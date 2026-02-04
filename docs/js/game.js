// ------ Game Logic ------

const verbDisplay = document.getElementById('verb-display');
const checkBtn = document.getElementById('check-btn');
const showAnswersBtn = document.getElementById('show-answers-btn');
const nextVerbBtn = document.getElementById('next-verb-btn');
const resultsContainer = document.getElementById('results-container');
const pronoun = document.getElementById('pronoun');
const conjugation = document.getElementById('conjugation');
const translation = document.getElementById('translation');

let CONJUGATIONS = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];

let verbs = [];
let currentVerbIndex = 0;
let currentConjugation = CONJUGATIONS[0];
let checkMode = true;

async function fetchVerbs() {
  try {
    const response = await fetch('./data/verbs.json');
    if (!response.ok) {
      throw new Error('Failed to load verb data.');
    }
    verbs = await response.json();
  } catch (error) {
    console.error(error);
    verbDisplay.textContent = 'Error';
    pronoun.textContent = 'Error';
    resultsContainer.textContent = 'No se pudieron cargar los verbos.';
  }
}

function displayVerb(index, conj) {
  if (index < 0 || index >= verbs.length) return;
  
  const verb = verbs[index];
  verbDisplay.textContent = verb.word;
  resultsContainer.textContent = '';

  pronoun.textContent = conj;
  conjugation.value = '';
  conjugation.classList.remove('correct', 'incorrect');
  conjugation.disabled = false;
  translation.textContent = '';
  
  checkMode = true;
  //checkBtn.disabled = false;
  checkBtn.textContent = "Comprobar";
  showAnswersBtn.disabled = false;
}


function nextVerb() {
  if (!verbs.length) return;

  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * verbs.length);
  } while (verbs.length > 1 && nextIndex === currentVerbIndex);

  currentVerbIndex = nextIndex;
  currentConjugation = CONJUGATIONS[Math.floor(Math.random() * 6)];
  
  displayVerb(nextIndex, currentConjugation);
}

function handleCheckBtn() {
  if (checkMode) checkAnswers();
  else cleanAnswers();
}

function checkAnswers() {
  if (currentVerbIndex < 0 || currentVerbIndex >= verbs.length) return;

  const currentVerb = verbs[currentVerbIndex];
  const correctConjugations = currentVerb.conjugations;

  translation.textContent = currentVerb.translation;

  const userInput = conjugation.value.trim().toLowerCase();
  const correctAnswer = correctConjugations[currentConjugation];

  if (userInput === correctAnswer) {
    conjugation.disabled = true;
    conjugation.classList.add('correct');
    conjugation.classList.remove('incorrect');

    resultsContainer.textContent = '¡Excelente! Es correcto.';
    resultsContainer.className = 'result-correct';
    checkMode = false;
    //checkBtn.disabled = true;
    checkBtn.textContent = "Limpiar";
    showAnswersBtn.disabled = true;

  } else {
    conjugation.classList.add('incorrect');
    conjugation.classList.remove('correct');

    resultsContainer.textContent = 'Respuesta son incorrecta. ¡Sigue intentando!';
    resultsContainer.className = 'result-incorrect';
  }
}

function cleanAnswers() {
  if (currentVerbIndex < 0 || currentVerbIndex >= verbs.length) return;

  conjugation.value = "";
  conjugation.classList.remove('correct');
  conjugation.classList.remove('incorrect');
  conjugation.disabled = false;

  translation.textContent = "";
  resultsContainer.textContent = '';
  resultsContainer.classList.remove('result-correct');
  resultsContainer.classList.remove('result-incorrect');
  checkMode = true;
  //checkBtn.disabled = false;
  checkBtn.textContent = "Comprobar";
  showAnswersBtn.disabled = false;
}

function showAnswers() {
  if (currentVerbIndex < 0 || currentVerbIndex >= verbs.length) return;

  const currentVerb = verbs[currentVerbIndex];
  const correctConjugations = currentVerb.conjugations;

  conjugation.value = correctConjugations[currentConjugation];
  conjugation.classList.add('correct');
  conjugation.classList.remove('incorrect');
  conjugation.disabled = true;

  translation.textContent = currentVerb.translation;
  resultsContainer.textContent = 'Aquí está las respuesta correcta.';
  resultsContainer.className = '';
  
  checkMode = false;
  //checkBtn.disabled = true;
  checkBtn.textContent = "Limpiar";
  showAnswersBtn.disabled = true;
}

async function initializeApp() {
  await fetchVerbs();
  if (verbs.length > 0) {
    //displayVerb(0, CONJUGATIONS[0]);
    nextVerb();
  } else {
    checkBtn.disabled = true;
    showAnswersBtn.disabled = true;
    nextVerbBtn.disabled = true;
  }
}

// Event Listeners
checkBtn.addEventListener('click', handleCheckBtn);
showAnswersBtn.addEventListener('click', showAnswers);
nextVerbBtn.addEventListener('click', nextVerb);

document.addEventListener('DOMContentLoaded', initializeApp);
