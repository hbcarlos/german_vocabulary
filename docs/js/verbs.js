// ------ Game Logic ------

const verbDisplay = document.getElementById('verb-display');
const checkBtn = document.getElementById('check-btn');
const showAnswersBtn = document.getElementById('show-answers-btn');
const nextVerbBtn = document.getElementById('next-verb-btn');
const randomBtn = document.getElementById('random-btn');
const resultsContainer = document.getElementById('results-container');
const translation = document.getElementById('translation')

const inputs = {
  ich: document.getElementById('ich'),
  du: document.getElementById('du'),
  'er/sie/es': document.getElementById('er-sie-es'),
  wir: document.getElementById('wir'),
  ihr: document.getElementById('ihr'),
  'sie/Sie': document.getElementById('sie-Sie'),
};

let verbs = [];
let currentVerbIndex = 0;
let randomMode = false;

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
    resultsContainer.textContent = 'No se pudieron cargar los verbos.';
  }
}

function displayVerb(index) {
  if (index < 0 || index >= verbs.length) return;
  
  currentVerbIndex = index;
  const verb = verbs[index];
  verbDisplay.textContent = verb.verb;
  resultsContainer.textContent = '';

  translation.textContent = '';
  
  for (const key in inputs) {
    inputs[key].value = '';
    inputs[key].classList.remove('correct', 'incorrect');
    inputs[key].disabled = false;
  }
  checkBtn.disabled = false;
  showAnswersBtn.disabled = false;
}

function nextVerb() {
  if (!verbs.length) return;

  let nextIndex;
  if (randomMode) {
    do {
      nextIndex = Math.floor(Math.random() * verbs.length);
    } while (verbs.length > 1 && nextIndex === currentVerbIndex);
  } else {
    nextIndex = (currentVerbIndex + 1) % verbs.length;
  }
  displayVerb(nextIndex);
}

function checkAnswers() {
  if (currentVerbIndex < 0 || currentVerbIndex >= verbs.length) return;

  const currentVerb = verbs[currentVerbIndex];
  let allCorrect = true;
  const correctConjugations = currentVerb.conjugations;

  translation.textContent = currentVerb.translation;

  for (const pronoun in inputs) {
    const userInput = inputs[pronoun].value.trim().toLowerCase();
    const correctAnswer = correctConjugations[pronoun];

    if (userInput === correctAnswer) {
      inputs[pronoun].classList.add('correct');
      inputs[pronoun].classList.remove('incorrect');
    } else {
      inputs[pronoun].classList.add('incorrect');
      inputs[pronoun].classList.remove('correct');
      allCorrect = false;
    }
  }

  if (allCorrect) {
    resultsContainer.textContent = '¡Excelente! Todo correcto.';
    resultsContainer.className = 'result-correct';
    checkBtn.disabled = true;
    showAnswersBtn.disabled = true;
    for (const pronoun in inputs) {
      inputs[pronoun].disabled = true;
    }
  } else {
    resultsContainer.textContent = 'Algunas respuestas son incorrectas. ¡Sigue intentando!';
    resultsContainer.className = 'result-incorrect';
  }
}

function showAnswers() {
  if (currentVerbIndex < 0 || currentVerbIndex >= verbs.length) return;

  const currentVerb = verbs[currentVerbIndex];
  const correctConjugations = currentVerb.conjugations;
  for (const pronoun in inputs) {
    inputs[pronoun].value = correctConjugations[pronoun];
    inputs[pronoun].classList.add('correct');
    inputs[pronoun].classList.remove('incorrect');
    inputs[pronoun].disabled = true;
  }

  translation.textContent = currentVerb.translation;
  resultsContainer.textContent = 'Aquí están las respuestas correctas.';
  resultsContainer.className = '';
  checkBtn.disabled = true;
  showAnswersBtn.disabled = true;
}

function setRandomMode(on) {
  randomMode = on;
  randomBtn.textContent = randomMode ? 'Random: ON' : 'Random: OFF';
  randomBtn.classList.toggle('active', randomMode);
}

async function initializeApp() {
  await fetchVerbs();
  if (verbs.length > 0) {
    displayVerb(0);
  } else {
    checkBtn.disabled = true;
    showAnswersBtn.disabled = true;
    nextVerbBtn.disabled = true;
    randomBtn.disabled = true;
  }
}

// Event Listeners
checkBtn.addEventListener('click', checkAnswers);
showAnswersBtn.addEventListener('click', showAnswers);
nextVerbBtn.addEventListener('click', nextVerb);
randomBtn.addEventListener('click', () => setRandomMode(!randomMode));

document.addEventListener('DOMContentLoaded', initializeApp);
