// ------ Carga de datos desde JSON ------

async function fetchData() {
  try {
    const response = await fetch('./data/numbers.json');
    if (!response.ok) {
      throw new Error('Failed to load numbers data.');
    }
    return response.json();
  } catch (error) {
    console.error(error);
    verbDisplay.textContent = 'Error';
    resultsContainer.textContent = 'No se pudieron cargar los números.';
  }
  return []
}

// ------ Lógica de la tarjeta ------

const card = document.getElementById("card");
const wordElem = document.getElementById("word");
const solutionElem = document.getElementById("solution");
const translationElem = document.getElementById("translation");
const counterElem = document.getElementById("counter");
const statusElem = document.getElementById("status");

const showBtn = document.getElementById("show-btn");
const nextBtn = document.getElementById("next-btn");
const randomBtn = document.getElementById("random-btn");

let words = [];       // se llenará con los JSON
let currentIndex = 0;
let randomMode = false;

function setButtonsEnabled(enabled) {
  [showBtn, nextBtn, randomBtn].forEach(btn => {
    btn.disabled = !enabled;
  });
}

function renderCard(index) {
  const item = words[index];
  if (!item) return;

  wordElem.textContent = item.number || "(sin palabra)";
  translationElem.textContent = item.word || "";

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
  card.style.backgroundColor = "#fff3cd";
}

function nextWord() {
  if (!words.length) return;

  if (randomMode) {
    let newIndex = currentIndex;
    if (words.length > 1) {
      while (newIndex === currentIndex) {
        newIndex = Math.floor(Math.random() * words.length);
      }
    }
    currentIndex = newIndex;
  } else {
    currentIndex = (currentIndex + 1) % words.length;
  }
  renderCard(currentIndex);
}

function setRandomMode(on) {
  randomMode = on;
  randomBtn.textContent = randomMode ? "Random: ON" : "Random: OFF";
  randomBtn.classList.toggle("active", randomMode);
}

// ------ Inicialización asíncrona ------

async function initializeApp() {
  try {
    statusElem.hidden = false;
    statusElem.textContent = "Cargando datos...";
    setButtonsEnabled(false);

    const data = await fetchData();
    words = data.filter(item => item && item.number);

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
nextBtn.addEventListener("click", nextWord);

randomBtn.addEventListener("click", () => {
  setRandomMode(!randomMode);
});

document.addEventListener("DOMContentLoaded", initializeApp);