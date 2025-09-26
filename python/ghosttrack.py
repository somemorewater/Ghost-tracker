import requests
import json
import phonenumbers
from phonenumbers import carrier, geocoder, timezone, number_type
from bs4 import BeautifulSoup
import argparse

# ===== Safe GET request =====
def safe_get(url):
    try:
        return requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
    except requests.exceptions.RequestException:
        return None

# ===== Track IP =====
def TrackIP(ip):
    resp = safe_get(f"https://ipwho.is/{ip}")
    if resp and resp.ok:
        print(json.dumps(resp.json(), indent=2))
    else:
        print(json.dumps({"success": False, "message": "Failed to fetch IP info"}))

# ===== Track phone number =====
def TrackPhone(phone):
    try:
        number = phonenumbers.parse(phone)
        result = {
            "input": phone,
            "country_code": number.country_code,
            "national_number": number.national_number,
            "number_type": str(number_type(number)),
            "is_possible": phonenumbers.is_possible_number(number),
            "is_valid": phonenumbers.is_valid_number(number),
            "region": geocoder.description_for_number(number, "en"),
            "timezones": timezone.time_zones_for_number(number),
            "carrier": carrier.name_for_number(number, "en")
        }
        print(json.dumps(result, indent=2))
    except phonenumbers.NumberParseException as e:
        print(json.dumps({"success": False, "error": f"Invalid phone number: {str(e)}"}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

# ===== Track username across platforms =====
def TrackUsername(username):
    results = []

    platforms = [
        {"name": "GitHub", "url": f"https://api.github.com/users/{username}"},
        {"name": "Reddit", "url": f"https://www.reddit.com/user/{username}/about.json"},
        {"name": "Instagram", "url": f"https://www.instagram.com/{username}/"},
        {"name": "TikTok", "url": f"https://www.tiktok.com/@{username}"},
        {"name": "Snapchat", "url": f"https://www.snapchat.com/add/{username}"},
        {"name": "Telegram", "url": f"https://t.me/{username}"},
        {"name": "Twitter", "url": f"https://twitter.com/{username}"}
    ]

    for p in platforms:
        platform_data = {"platform": p["name"], "profile_url": p["url"], "exists": False}
        try:
            resp = safe_get(p["url"])
            if resp and resp.status_code == 200:
                platform_data["exists"] = True

                if p["name"] == "GitHub":
                    data = resp.json()
                    platform_data.update({
                        "name": data.get("name"),
                        "bio": data.get("bio"),
                        "avatar": data.get("avatar_url"),
                        "followers": data.get("followers"),
                        "following": data.get("following"),
                        "public_repos": data.get("public_repos")
                    })

                elif p["name"] == "Reddit":
                    data = resp.json().get("data", {})
                    platform_data.update({
                        "karma": data.get("total_karma"),
                        "created": data.get("created_utc")
                    })

                elif p["name"] == "Instagram":
                    try:
                        soup = BeautifulSoup(resp.text, "html.parser")
                        script = soup.find("script", text=lambda t: t.startswith("window._sharedData"))
                        json_text = script.string.split(" = ", 1)[1].rstrip(";")
                        user = json.loads(json_text)["entry_data"]["ProfilePage"][0]["graphql"]["user"]
                        platform_data.update({
                            "full_name": user.get("full_name"),
                            "bio": user.get("biography"),
                            "avatar": user.get("profile_pic_url"),
                            "followers": user["edge_followed_by"]["count"],
                            "following": user["edge_follow"]["count"]
                        })
                    except:
                        platform_data.update({"note": "Limited Instagram data"})

                elif p["name"] == "Twitter":
                    try:
                        soup = BeautifulSoup(resp.text, "html.parser")
                        title = soup.title.string if soup.title else None
                        platform_data.update({"display_name": title})
                    except:
                        platform_data.update({"note": "Limited Twitter data"})

                elif p["name"] in ["TikTok", "Snapchat", "Telegram"]:
                    platform_data.update({"display_name": username})

            results.append(platform_data)

        except Exception as e:
            platform_data["error"] = str(e)
            results.append(platform_data)

    print(json.dumps(results, indent=2))

# ===== CLI / API entry =====
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["ip", "phone", "username", "selfip"], help="Run mode")
    parser.add_argument("--value", help="Value for the mode (IP, phone, username)")
    args = parser.parse_args()

    if args.mode == "ip" and args.value:
        TrackIP(args.value)
    elif args.mode == "phone" and args.value:
        TrackPhone(args.value)
    elif args.mode == "username" and args.value:
        TrackUsername(args.value)
    elif args.mode == "selfip":
        resp = safe_get("https://api.myip.com/")
        if resp and resp.ok:
            print(json.dumps(resp.json(), indent=2))
        else:
            print(json.dumps({"success": False, "message": "Failed to fetch IP"}))
    else:
        print(json.dumps({"success": False, "message": "Invalid mode or missing value"}))
