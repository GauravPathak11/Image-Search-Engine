const input = document.querySelector(".search-box input");
const btn = document.querySelector(".btn");
const images = document.querySelector(".images");
const load = document.querySelector("#load");

const accessKey = "TGBwYopWkEgvEV756X7FZJ4VGQDCyAC5SkGVIP9fsYM"; // replace with your key

let page = 1;
let keyword = "";

// ---------------- DOWNLOAD IMAGE ----------------
function download(imgUrl) {
  fetch(imgUrl)
    .then(res => res.blob())
    .then(file => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch(() => alert("Failed to download image"));
}

// ---------------- FETCH IMAGES ----------------
async function getResponse() {
  keyword = input.value.trim();
  if (!keyword) return;

  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    const results = data.results;

    if (page === 1) {
      images.innerHTML = "";
    }

    results.forEach(result => {
      if (!result.urls) return;

      const li = document.createElement("li");
      li.classList.add("image");

      li.innerHTML = `
        <img src="${result.urls.small}" alt="img" class="photo">
        <div class="details">
          <div class="user">
            <img src="/camera.svg" alt="camera">
            <span>${result.user.name}</span>
          </div>
          <div class="download">
            <img src="/download.svg" alt="download">
          </div>
        </div>
      `;

      li.querySelector(".download").addEventListener("click", () => {
        download(result.urls.full);
      });

      images.appendChild(li);
    });

    load.style.display = results.length > 0 ? "block" : "none";

  } catch (error) {
    console.error(error);
    alert("Something went wrong. Try again.");
  }
}

// ---------------- EVENTS ----------------
input.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    page = 1;
    getResponse();
  }
});

btn.addEventListener("click", () => {
  page = 1;
  getResponse();
});

load.addEventListener("click", () => {
  page++;
  getResponse();
});
