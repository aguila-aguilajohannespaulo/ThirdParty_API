const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsGrid = document.getElementById("results-grid");
const loadingIndicator = document.getElementById("loading-indicator");
const errorBanner = document.getElementById("error-banner");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) {
    showError("Please enter an Amiibo or character.");
    return;
  }
  await searchAmiibo(query);
});

document.querySelectorAll(".challenge-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const query = button.dataset.query;
    if (!query) return;
    searchInput.value = query;
    await searchAmiibo(query);
  });
});

async function searchAmiibo(query) {
  showLoading();
  hideError();
  resultsGrid.innerHTML = "";
  try {
    const response = await fetch(
      `/.netlify/functions/search?q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.error || "Amiibo search failed."
      );
    }
    if (!data.results || data.results.length === 0) {
      showError(
        `No Amiibo found for "${query}".`
      );
      return;
    }
    displayResults(data.results);
  } catch (error) {
    console.error("Search error:", error);
    showError(
      error.message ||
      "Something went wrong while searching."
    );
  } finally {
    hideLoading();
  }
}
function displayResults(results) {
  resultsGrid.innerHTML = "";
  results.forEach((amiibo) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img
        src="${escapeHTML(amiibo.image)}"
        alt="${escapeHTML(amiibo.name)}"
        loading="lazy"
      >
      <div class="card-content">
        <h3>
          ${escapeHTML(amiibo.name)}
        </h3>
        <p>
          <strong>Character:</strong>
          ${escapeHTML(amiibo.character)}
        </p>
        <p>
          <strong>Game:</strong>
          ${escapeHTML(amiibo.gameSeries)}
        </p>
        <p>
          <strong>Series:</strong>
          ${escapeHTML(amiibo.amiiboSeries)}
        </p>
        <span class="tag tag-project">
          ${escapeHTML(amiibo.type)}
        </span>
      </div>
    `;
    resultsGrid.appendChild(card);
  });

}

function showLoading() {
  loadingIndicator.classList.remove("hidden");
}

function hideLoading() {
  loadingIndicator.classList.add("hidden");
}

function showError(message) {
  errorBanner.textContent = message;
  errorBanner.classList.remove("hidden");
}

function hideError() {
  errorBanner.classList.add("hidden");
}

function escapeHTML(value) {
  if (!value) return "";
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}
