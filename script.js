const resultsNav = document.getElementById("loadMore");
const favoritesNav = document.getElementById("favorite");
const cardContainer = document.querySelector(".card-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const saveConfirmedx2 = document.querySelector(".save-confirmedx2");
const saveConfirmedx3 = document.querySelector(".save-confirmedx3");
const loader = document.querySelector(".loader");
const container = document.querySelector(".container");

const count = 10;
const apiKey = `DEMO_KEY`;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

const showContent = function (page) {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
  if (page === "results") {
    favoritesNav.classList.remove("hidden");
    resultsNav.classList.add("hidden");
  } else {
    favoritesNav.classList.add("hidden");
    resultsNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
};

const getNasaPictures = async function () {
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM("results");
  } catch (err) {
    console.log(`💥💥💥💥${err}`);
  }
};

const updateDOM = function (page) {
  if (localStorage.getItem("fav")) {
    favorites = JSON.parse(localStorage.getItem("fav"));
  }
  container.textContent = "";
  createDOMNodes(page);
  showContent(page);
};

const createDOMNodes = function (page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  currentArray.forEach((result) => {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");

    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";

    const image = document.createElement("img");
    image.classList.add("img");
    image.src = result.url;
    image.alt = result.title ? result.title : "Nasa Picture of the Day";
    image.loading = "lazy";

    const textContainer = document.createElement("div");
    textContainer.classList.add("text-container");

    const title = document.createElement("h1");
    title.classList.add("title", "h-mb-m");
    title.textContent = result.title;

    const favoriteEl = document.createElement("div");
    favoriteEl.classList.add("add-to-favorites", "h-mb-m");
    if (page === "results") {
      favoriteEl.textContent = "Add To Favorites";
      favoriteEl.setAttribute("onclick", `saveFavorite('${result.url}')`);
    } else {
      favoriteEl.textContent = "Remove Favorite";
      favoriteEl.setAttribute("onclick", `removeFavorite('${result.url}')`);
    }

    const mainTextEl = document.createElement("h2");
    mainTextEl.classList.add("heading-2", "h-mb-m");
    mainTextEl.textContent = result.explanation;

    const dateEl = document.createElement("div");
    dateEl.classList.add("date-text");
    dateEl.textContent = result.date;

    const copyright = document.createElement("span");
    copyright.classList.add("copyright");
    copyright.textContent = result.copyright ? result.copyright : "";

    container.append(cardContainer);
    cardContainer.append(imgContainer, textContainer);
    imgContainer.appendChild(link);
    link.appendChild(image);
    textContainer.append(title, favoriteEl, mainTextEl, dateEl);
    dateEl.appendChild(copyright);
  });
};

getNasaPictures();

const saveFavorite = function (itemUrl) {
  resultsArray.forEach((e) => {
    if (e.url.includes(itemUrl) && favorites[itemUrl]) {
      saveConfirmedx2.classList.remove("hidden");
      setTimeout(() => {
        saveConfirmedx2.classList.add("hidden");
      }, 2000);
    }
    if (e.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = e;
      saveConfirmed.classList.remove("hidden");
      setTimeout(() => {
        saveConfirmed.classList.add("hidden");
      }, 2000);
      localStorage.setItem("fav", JSON.stringify(favorites));
      return;
    }
  });
};

const removeFavorite = function (itemUrl) {
  Object.values(favorites).forEach((e) => {
    if (favorites[itemUrl]) {
      delete favorites[itemUrl];
      localStorage.setItem("fav", JSON.stringify(favorites));
      updateDOM("favorites");
      saveConfirmedx3.classList.remove("hidden");
      setTimeout(() => {
        saveConfirmedx3.classList.add("hidden");
      }, 2000);
    }
  });
};
