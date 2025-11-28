const toggler = document.getElementById('navbar-toggler');
const collapseMenu = document.getElementById('navbar-collapse');

if (toggler && collapseMenu) {
  toggler.addEventListener('click', () => {
    collapseMenu.classList.toggle('is-open');
  });
}
