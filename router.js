/**
 * SIU - Sistema de Roteamento
 */

class SiuRouter {
  constructor() {
    this.routes = {
      'home': 'home.html',
      'author': 'author.html',
      'process': 'process.html',
      'incapacity': 'incapacity.html',  // Nova rota adicionada
      'evidence': 'evidence.html',
      'defense': 'defense.html',
      'interviews': 'interviews.html',
      'report': 'report.html'
    };

    this.defaultRoute = 'home';
    this.contentArea = document.getElementById('content');
    this.loader = document.getElementById('loader');
    this.currentRoute = null;

    this.init();
  }

  init() {
    // Inicializa os listeners para navegação
    window.addEventListener('hashchange', () => this.handleRoute());

    // Carrega a rota inicial
    this.handleRoute();
  }

  handleRoute() {
    // Obtém a rota da URL
    let route = window.location.hash.substring(1);

    // Se não houver rota, usa a padrão
    if (!route || !this.routes[route]) {
      route = this.defaultRoute;
      window.location.hash = `#${route}`;
      return;
    }

    this.loadPage(route);
  }

  async loadPage(route) {
    if (this.currentRoute === route) return;

    // Exibe o loader
    this.loader.classList.remove('d-none');
    if (this.contentArea) {
      this.contentArea.style.opacity = '0.5';
    }

    try {
      // Carrega o conteúdo da página
      const response = await fetch(this.routes[route]);
      if (!response.ok) {
        throw new Error(`Falha ao carregar a página ${route}`);
      }

      const html = await response.text();

      // Atualiza o conteúdo
      this.contentArea.innerHTML = html;

      // Atualiza navegação ativa
      this.updateActiveNav(route);

      // Remove o loader
      this.loader.classList.add('d-none');
      this.contentArea.style.opacity = '1';

      // Aplica a animação de entrada
      const pageElement = this.contentArea.querySelector('.page-fade');
      if (pageElement) {
        setTimeout(() => {
          pageElement.classList.add('show');
        }, 50);
      }

      // Notifica sobre a mudança de rota
      document.dispatchEvent(new CustomEvent('routeChanged', {
        detail: { route }
      }));

      this.currentRoute = route;

    } catch (error) {
      console.error('Erro ao carregar página:', error);
      this.contentArea.innerHTML = `
        <div class="alert alert-danger mt-4">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Erro ao carregar a página. Tente novamente.
        </div>
      `;
      this.loader.classList.add('d-none');
    }
  }

  updateActiveNav(route) {
    // Remove classe active de todos os links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // Adiciona classe active ao link da rota atual
    document.querySelectorAll(`.nav-link[href="#${route}"]`).forEach(link => {
      link.classList.add('active');
    });
  }
}
