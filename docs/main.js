// --- Carga dinámica de la barra de navegación ---

async function loadNavbar() {
  const navbarContainer = document.getElementById('navbar-container');
  if (!navbarContainer) {
    console.error('Navbar container not found.');
    return;
  }

  try {
    // Cargar el HTML de la barra de navegación
    const response = await fetch('nav.html');
    if (!response.ok) {
      throw new Error(`Failed to fetch nav.html: ${response.statusText}`);
    }
    const navbarHTML = await response.text();
    navbarContainer.innerHTML = navbarHTML;

    // Añadir el CSS de la barra de navegación al <head>
    const navbarCSS = document.createElement('link');
    navbarCSS.rel = 'stylesheet';
    navbarCSS.href = 'nav.css';
    document.head.appendChild(navbarCSS);

    // Añadir el JS de la barra de navegación y ejecutarlo
    const navbarJS = document.createElement('script');
    navbarJS.src = 'nav.js';
    navbarJS.defer = true;
    document.body.appendChild(navbarJS);

  } catch (error) {
    console.error('Error loading navbar:', error);
    navbarContainer.innerHTML = '<p style="color: red; text-align: center;">Error loading navigation.</p>';
  }
}

// Cargar la barra de navegación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadNavbar);
