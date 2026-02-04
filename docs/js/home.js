// ------ Carga de datos desde JSON ------

async function fetchData() {
  const dataSources = ['nouns'];

  const fetchPromises = dataSources.map(source =>
    fetch(`./data/${source}.json`)
      .then(res => res.json())
      .catch(err => {
        console.error(`Error loading ${source}`, err);
        return [];
      })
  );

  const basicsPromise = fetch('./data/basics.json')
    .then(res => res.json())
    .then(d => [
      ...(d.days || []),
      ...(d.month || []),
      ...(d.seasons || []),
      ...(d.colors || []),
      ...(d.countries || []),
      ...(d.languages || [])
    ])
    .catch(err => {
      console.error('Error loading basics', err);
      return [];
    });

  const allData = await Promise.all([...fetchPromises, basicsPromise]);
  return allData.flat();
}

// ------ Lógica de la tarjeta ------

const card = document.getElementById("card");
const wordElem = document.getElementById("word");
const solutionElem = document.getElementById("solution");
const articleElem = document.getElementById("article");
const pluralElem = document.getElementById("plural");
const translationElem = document.getElementById("translation");
const counterElem = document.getElementById("counter");
const statusElem = document.getElementById("status");

const showBtn = document.getElementById("show-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const randomBtn = document.getElementById("random-btn");
const spanishBtn = document.getElementById("spanish-btn");

// Colores asociados a cada artículo
const articleColors = {
  der: "#cce5ff",   // azul claro
  die: "#ffd6e7",   // rosa claro
  das: "#d5f5e3"    // verde claro
};

let words = [];       // se llenará con los JSON
let currentIndex = 0;
let randomMode = false;
let spanishMode = false;

function setButtonsEnabled(enabled) {
  [showBtn, prevBtn, nextBtn, randomBtn, spanishBtn].forEach(btn => {
    btn.disabled = !enabled;
  });
}

function renderCard(index) {
  const item = words[index];
  if (!item) return;

  if (spanishMode) {
    wordElem.textContent = item.translation || "(sin palabra)";
    translationElem.textContent = item.word || "";
  } else {
    wordElem.textContent = item.word || "(sin palabra)";
    translationElem.textContent = item.translation || "";
  }
  
  articleElem.textContent = item.article || "";
  pluralElem.textContent = item.plural || "";

  // Ocultamos la solución y restauramos color base
  solutionElem.style.display = "none";
  card.style.backgroundColor = "#ffffff";

  // Contador
  counterElem.textContent = `Palabra ${index + 1} de ${words.length}`;
}

function showSolution() {
  const item = words[currentIndex];
  if (!item) return;

  solutionElem.style.display = "block";

  const art = (item.article || "").toLowerCase();
  const color = item.color || articleColors[art] || "#fff3cd"; // color por defecto
  card.style.backgroundColor = color;
}

function prevWord() {
  if (!words.length) return;

  let nextIndex;
  if (randomMode) {
    do {
      nextIndex = Math.floor(Math.random() * words.length);
    } while (words.length > 1 && nextIndex === currentIndex);
  } else {
    if (currentIndex == 0) {
      nextIndex = words.length -1;
    } else {
      nextIndex = (currentIndex - 1) % words.length;
    }
  }
  currentIndex = nextIndex;
  renderCard(currentIndex);
}

function nextWord() {
  if (!words.length) return;

  let nextIndex;
  if (randomMode) {
    do {
      nextIndex = Math.floor(Math.random() * words.length);
    } while (words.length > 1 && nextIndex === currentIndex);
  } else {
    nextIndex = (currentIndex + 1) % words.length;
  }
  currentIndex = nextIndex;
  renderCard(currentIndex);
}

function setRandomMode(on) {
  randomMode = on;
  randomBtn.textContent = randomMode ? "Random: ON" : "Random: OFF";
  randomBtn.classList.toggle("active", randomMode);
}

function setSpanishMode(on) {
  spanishMode = on;
  spanishBtn.textContent = randomMode ? "Español" : "Alemán";
  spanishBtn.classList.toggle("active", spanishMode);
  renderCard(currentIndex);
}

// ------ Inicialización asíncrona ------

async function initializeApp() {
  try {
    statusElem.hidden = false;
    statusElem.textContent = "Cargando datos...";
    setButtonsEnabled(false);

    const data = await fetchData();
    words = data.filter(item => item && item.word);

    if (!words.length) {
      statusElem.textContent = "No se encontraron datos.";
      wordElem.textContent = "Sin datos";
      return;
    }

    currentIndex = 0;
    renderCard(currentIndex);
    statusElem.textContent = ""//`Cargadas ${words.length} palabras.`;
    statusElem.hidden = true;
    setButtonsEnabled(true);
  } catch (err) {
    console.error(err);
    statusElem.textContent = "Error al cargar los datos.";
    wordElem.textContent = "Error :(";
  }
}

// Eventos
showBtn.addEventListener("click", showSolution);
prevBtn.addEventListener("click", prevWord);
nextBtn.addEventListener("click", nextWord);

randomBtn.addEventListener("click", () => {
  setRandomMode(!randomMode);
});

spanishBtn.addEventListener("click", () => {
  setSpanishMode(!spanishMode);
});

document.addEventListener("DOMContentLoaded", initializeApp);