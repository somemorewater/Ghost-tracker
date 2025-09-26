// Matrix rain effect
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = "01";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];
for (let x = 0; x < columns; x++) drops[x] = 1;

function draw() {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0F0";
  ctx.font = fontSize + "px monospace";
  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
      drops[i] = 0;
    drops[i]++;
  }
}
setInterval(draw, 35);

async function track() {
  const query = document.getElementById("query").value.trim();
  const resultsBox = document.getElementById("results");

  if (!query) {
    resultsBox.textContent = "Please enter a query.";
    return;
  }

  resultsBox.textContent = `Tracking: ${query}\nFetching data...`;

  let payload = { query };

  try {
    const res = await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    // Pretty display for phone numbers
    if (/^\+?\d{7,15}$/.test(query)) {
      resultsBox.textContent = `
Number: ${data.input || "N/A"}
Country code: ${data.country_code || "N/A"}
National number: ${data.national_number || "N/A"}
Type: ${data.number_type || "N/A"}
Valid: ${data.is_valid ?? "N/A"}
Possible: ${data.is_possible ?? "N/A"}
Region: ${data.region || "N/A"}
Timezones: ${data.timezones ? data.timezones.join(", ") : "N/A"}
Carrier: ${data.carrier || "N/A"}
      `;
    } else if (/^\d{1,3}(\.\d{1,3}){3}$/.test(query)) {
      // IP tracking raw JSON
      resultsBox.textContent = JSON.stringify(data, null, 2);
    } else {
      // Username tracking: format nicely
      let info = `Username: ${data.username || query}\nExists: ${
        data.exists ?? "N/A"
      }`;
      if (data.exists) {
        if (data.full_name) info += `\nFull name: ${data.full_name}`;
        if (data.bio) info += `\nBio: ${data.bio}`;
        if (data.followers) info += `\nFollowers: ${data.followers}`;
        if (data.posts) info += `\nPosts: ${data.posts}`;
        if (data.profile_url) info += `\nProfile URL: ${data.profile_url}`;
      }
      resultsBox.textContent = info;
    }
  } catch (err) {
    resultsBox.textContent = "Error: " + err.message;
  }
}

window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});
