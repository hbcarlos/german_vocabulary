// ------ Carga de datos desde JSON ------

async function fetchData() {
  const dataSources = [
    'nouns', 'adjectives', 'adverbs', 'prepositions'
  ];

  const fetchPromises = dataSources.map(source =>
    fetch(`./data/${source}.json`)
      .then(res => res.json())
      .then(res => res.map(w => ({ ...w, type: source })) )
      .catch(err => {
        console.error(`Error loading ${source}`, err);
        return [];
      })
  );

  const verbsPromise = fetch(`./data/verbs.json`)
    .then(res => res.json())
    .then(res => {
      const items = [];
      res.forEach(item => {
        items.push({...item, type: 'verbs'});
        items.push({...item, word: item.conjugations.ich, type: 'verbs'});
        items.push({...item, word: item.conjugations.du, type: 'verbs'});
        items.push({...item, word: item.conjugations["er/sie/es"], type: 'verbs'});
        items.push({...item, word: item.conjugations.wir, type: 'verbs'});
        items.push({...item, word: item.conjugations.ihr, type: 'verbs'});
        items.push({...item, word: item.conjugations["sie/Sie"], type: 'verbs'});
      });
      return items;
    })
    .catch(err => {
      console.error(`Error loading ${source}`, err);
      return [];
    })

  const basicsPromise = fetch('./data/basics.json')
    .then(res => res.json())
    .then(d => [
      ...(d.days || []).map(w => ({ ...w, type: 'basics' })),
      ...(d.month || []).map(w => ({ ...w, type: 'basics' })),
      ...(d.seasons || []).map(w => ({ ...w, type: 'basics' })),
      ...(d.colors || []).map(w => ({ ...w, type: 'basics' })),
      ...(d.countries || []).map(w => ({ ...w, type: 'basics' })),
      ...(d.languages || []).map(w => ({ ...w, type: 'basics' }))
    ])
    .catch(err => {
      console.error('Error loading basics', err);
      return [];
    });

  const allData = await Promise.all([...fetchPromises, verbsPromise, basicsPromise]);
  return allData.flat();
}

// ------ Lógica de la tarjeta ------

const statusElem = document.getElementById("status");
const searchInput = document.getElementById('searchInput');
const dropdown = document.getElementById('resultsDropdown');
const resultCard = document.getElementById('resultCard');

let words = [];       // se llenará con los JSON

// Función para quitar acentos y minúsculas (para buscar fácil)
const normalizeText = (text) => {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

function handleSearchInput(e) {
  const query = normalizeText(e.target.value);
  dropdown.innerHTML = ''; // Limpiar lista anterior
  resultCard.style.display = 'none'; // Ocultar tarjeta si se busca de nuevo

  if (query.length < 1) {
    dropdown.style.display = 'none';
    return;
  }

  // Filtramos buscando en la palabra alemana Y en la traducción
  const matches = words.filter(item => {
    const german = normalizeText(item.word);
    const spanish = normalizeText(item.translation);
    return german.includes(query) || spanish.includes(query);
  });

  if (matches.length > 0) {
    dropdown.style.display = 'block';
    matches.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="lang-de">${item.word}</span>
        <span class="lang-es">${item.translation}</span>
      `;
      // Al hacer click en una sugerencia
      li.addEventListener('click', () => {
        showResult(item);
        searchInput.value = item.word; // Poner palabra en input
        dropdown.style.display = 'none'; // Ocultar lista
      });
      dropdown.appendChild(li);
    });
  } else {
    dropdown.style.display = 'none';
  }
}



// 4. LÓGICA DE VISUALIZACIÓN (CARD)
function showResult(item) {
    let contentHtml = `
        <div class="result-header">
            <h2 class="result-word">${item.word}</h2>
            <p class="result-translation">${item.translation}</p>
        </div>
    `;

    // SI ES UN VERBO: Añadir tabla de conjugación
    if (item.type === 'verbs' && item.conjugations) {
        contentHtml += `
            <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
            <h4 style="color:#555; margin-bottom:10px;">Präsens (Presente)</h4>
            <table class="conjugation-table">
                <tbody>
                    <tr><td>ich</td><td><strong>${item.conjugations.ich}</strong></td></tr>
                    <tr><td>du</td><td><strong>${item.conjugations.du}</strong></td></tr>
                    <tr><td>er/sie/es</td><td><strong>${item.conjugations["er/sie/es"]}</strong></td></tr>
                    <tr><td>wir</td><td><strong>${item.conjugations.wir}</strong></td></tr>
                    <tr><td>ihr</td><td><strong>${item.conjugations.ihr}</strong></td></tr>
                    <tr><td>sie/Sie</td><td><strong>${item.conjugations["sie/Sie"]}</strong></td></tr>
                </tbody>
            </table>
        `;
    }
    
    // SI TIENE ARTÍCULO (Sustantivos): Mostrarlo
    if (item.article) {
         contentHtml = `
            <div class="result-header">
                <h2 class="result-word"><span style="font-size:0.6em; color:#888;">${item.article}</span> ${item.word}</h2>
                <p class="result-translation">${item.translation}</p>
                ${item.plural ? `<p style="font-size:0.9rem; color:#666;">Plural: <strong>die ${item.plural}</strong></p>` : ''}
            </div>
        `;
    }

    resultCard.innerHTML = contentHtml;
    resultCard.style.display = 'block';
}



// ------ Inicialización asíncrona ------

async function initializeApp() {
  try {
    statusElem.hidden = false;
    statusElem.textContent = "Cargando datos...";

    const data = await fetchData();
    words = data.filter(item => item && item.word);

    if (!words.length) {
      statusElem.textContent = "No se encontraron datos.";
      return;
    }

    statusElem.textContent = ""//`Cargadas ${words.length} palabras.`;
    statusElem.hidden = true;
  } catch (err) {
    console.error(err);
    statusElem.textContent = "Error al cargar los datos.";
  }
}

// Eventos
// Cerrar dropdown si clickeas fuera
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrapper')) {
    dropdown.style.display = 'none';
  }
});
searchInput.addEventListener('input', handleSearchInput);
document.addEventListener("DOMContentLoaded", initializeApp);