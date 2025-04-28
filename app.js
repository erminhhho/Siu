/**
 * SIU - Sistema de Instrução Unificado
 * Main application JavaScript file
 */

// Main application class
class SiuApp {
  constructor() {
    this.currentPage = 'home';
    this.appContainer = document.getElementById('app');
    this.pageTemplates = {
      home: document.getElementById('home-template'),
      courses: document.getElementById('courses-template'),
      resources: document.getElementById('resources-template'),
      about: document.getElementById('about-template')
    };

    this.init();
  }

  init() {
    // Set the initial page content
    this.loadPage(this.currentPage);

    // Add event listeners for navigation
    document.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.currentTarget.getAttribute('data-page');
        this.navigateTo(page);
      });
    });

    // Listen for popstate events (browser back/forward navigation)
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.page) {
        this.loadPage(e.state.page, false);
      }
    });
  }

  navigateTo(page) {
    if (page !== this.currentPage && this.pageTemplates[page]) {
      // Push state to browser history
      window.history.pushState({ page }, `SIU - ${page}`, `#${page}`);
      this.loadPage(page);
    }
  }

  loadPage(page, updateActive = true) {
    // Store current page
    this.currentPage = page;

    // Clear current content
    this.appContainer.innerHTML = '';

    // Clone and append the template content
    if (this.pageTemplates[page]) {
      const content = this.pageTemplates[page].content.cloneNode(true);
      this.appContainer.appendChild(content);

      // Apply animation
      this.appContainer.classList.add('animate-fade-in');
      setTimeout(() => {
        this.appContainer.classList.remove('animate-fade-in');
      }, 500);

      // Initialize page-specific components
      this.initPageComponents(page);

      // Update active navigation
      if (updateActive) {
        this.updateActiveNav(page);
      }
    }
  }

  updateActiveNav(page) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // Add active class to current page nav link
    const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  initPageComponents(page) {
    // Initialize page-specific event listeners and functionality
    switch(page) {
      case 'home':
        this.initHomeComponents();
        break;
      case 'courses':
        this.initCoursesComponents();
        break;
      case 'resources':
        this.initResourcesComponents();
        break;
      case 'about':
        this.initAboutComponents();
        break;
    }

    // Re-attach navigation event listeners for elements loaded dynamically
    this.appContainer.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.currentTarget.getAttribute('data-page');
        this.navigateTo(page);
      });
    });
  }

  initHomeComponents() {
    // Home page specific functionality
    console.log('Home page initialized');
  }

  initCoursesComponents() {
    // Courses page specific functionality
    console.log('Courses page initialized');

    // Filter course functionality demo
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        const category = e.target.value;
        console.log(`Filtering courses by category: ${category || 'all'}`);
        // In a real application, you would filter the courses here
      });
    }

    const searchForm = this.appContainer.querySelector('form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchInput = document.getElementById('searchCourses');
        if (searchInput) {
          console.log(`Searching for: ${searchInput.value}`);
          // In a real application, you would search the courses here
        }
      });
    }
  }

  initResourcesComponents() {
    // Resources page specific functionality
    console.log('Resources page initialized');

    const searchInput = document.getElementById('searchResources');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        console.log(`Searching resources for: ${searchTerm}`);
        // In a real application, you would filter resources here
      });
    }
  }

  initAboutComponents() {
    // About page specific functionality
    console.log('About page initialized');

    const contactForm = this.appContainer.querySelector('form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simple validation
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('contactMessage').value;

        if (name && email && message) {
          console.log('Form submitted:', { name, email, message });

          // Show a success message (in a real app, you would send this to a server)
          alert('Mensagem enviada com sucesso!');
          contactForm.reset();
        } else {
          alert('Por favor, preencha todos os campos do formulário.');
        }
      });
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new SiuApp();

  // Check if there's a hash in the URL for direct navigation
  const hash = window.location.hash.substr(1);
  if (hash && ['home', 'courses', 'resources', 'about'].includes(hash)) {
    app.navigateTo(hash);
  }
});
