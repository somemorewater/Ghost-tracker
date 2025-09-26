Got you, Water 😎. Here's a single `README.md` file ready to use:

````markdown
# GhostTrack

GhostTrack is a backend service and CLI tool for tracking **IP addresses, phone numbers, and usernames** across multiple social media platforms. It fetches publicly available information using Python and exposes it via an Express.js backend.

---

## Features

### IP Tracking
- Fetch geolocation, timezone, ISP, and other public IP info via [ipwho.is](https://ipwho.is).
- **Input:** IPv4 address (e.g., `8.8.8.8`).
- **Output:** JSON with location and ISP details.

### Phone Number Tracking
- Validate phone numbers using [phonenumbers](https://pypi.org/project/phonenumbers/).
- **Details:**
  - Country code
  - National number
  - Type (mobile, fixed, etc.)
  - Validity & possibility
  - Region
  - Timezones
  - Carrier

### Username Tracking
- Searches for public accounts across platforms:
  - GitHub
  - Reddit
  - Instagram
  - TikTok
  - Snapchat
  - Telegram
  - X (Twitter)
- **Returns:**
  - Existence of account
  - Public profile info (bio, followers, avatar, karma, etc.)
  - Profile URL
  - Limited data for platforms with scraping restrictions

---

## Requirements

### Python
- Python 3.10+
- Packages:
```bash
pip install requests phonenumbers beautifulsoup4
````

### Node.js

* Node.js 16+
* Packages:

```bash
npm install express cors morgan body-parser dotenv
```

---

## Project Structure

```
GhostTrack/
│
├─ python/
│  ├─ ghosttrack.py         # Python script for IP, phone, username tracking
│  └─ venv/                 # Python virtual environment
│
├─ public/
│  ├─ index.html            # Frontend page
│  └─ script.js             # Frontend JS for tracking UI
│
├─ server.js                # Express backend
├─ package.json
└─ .env                     # Environment variables (PORT, API keys)
```

---

## Usage

### CLI (Python)

```bash
# Track IP
python ghosttrack.py --mode ip --value 8.8.8.8

# Track Phone
python ghosttrack.py --mode phone --value +2348012345678

# Track Username
python ghosttrack.py --mode username --value Water

# Get your own IP
python ghosttrack.py --mode selfip
```

### API (Node.js)

Start the backend:

```bash
node server.js
```

* **Test server ping:**

```http
GET http://localhost:5000/api/ping
```

* **Track IP/Phone/Username via POST:**

```http
POST http://localhost:5000/api/track
Content-Type: application/json

{
  "query": "8.8.8.8"
}
```

> The server automatically detects IP vs phone vs username.

---

## Frontend

* Simple HTML/JS interface with **matrix rain effect**.
* Input a query and click **Track** to get details displayed.

---

## Notes

* **X/Twitter** API requires a developer account for full public data. Without API keys, only existence and display name can be detected via scraping.
* Instagram scraping is limited to public information only.
* Snapchat, TikTok, and Telegram are verified via page existence.
* GitHub and Reddit provide structured JSON data.

---


```
