/**
 * SIU - Helper de busca
 */

class Search {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Limpa o cache de pesquisas
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Verifica se um termo de busca está no cache
   * @param {string} key - Termo de busca
   * @returns {boolean}
   */
  hasCache(key) {
    return this.cache.has(key);
  }

  /**
   * Obtém resultado do cache
   * @param {string} key - Termo de busca
   * @returns {any}
   */
  getFromCache(key) {
    return this.cache.get(key);
  }

  /**
   * Armazena resultado no cache
   * @param {string} key - Termo de busca
   * @param {any} value - Resultado a ser armazenado
   */
  addToCache(key, value) {
    this.cache.set(key, value);
  }

  /**
   * Cria uma função debounce para evitar chamadas repetidas
   * @param {Function} func - Função a ser executada
   * @param {number} delay - Tempo de espera em ms
   * @returns {Function}
   */
  debounce(func, delay = 300) {
    let timeout;

    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  /**
   * Configura um autocomplete para um campo de input
   */
  setupAutocomplete(inputElement, dropdownElement, searchFunction, renderFunction, selectFunction) {
    if (!inputElement || !dropdownElement) return;

    // Função de busca com debounce
    const debouncedSearch = this.debounce(async (query) => {
      if (!query || query.length < 2) {
        dropdownElement.classList.add('d-none');
        return;
      }

      try {
        const results = await searchFunction(query);

        dropdownElement.innerHTML = renderFunction(results);

        // Adicionar eventos de clique aos itens
        dropdownElement.querySelectorAll('.dropdown-item[href="#"]').forEach(item => {
          item.addEventListener('click', (e) => {
            e.preventDefault();
            selectFunction(item);
          });
        });

        // Garantir que o dropdown fique visível
        dropdownElement.style.display = 'block';
        dropdownElement.classList.remove('d-none');
      } catch (error) {
        console.error('Erro na busca:', error);
        dropdownElement.innerHTML = '<div class="dropdown-item">Erro ao realizar busca</div>';
        dropdownElement.style.display = 'block';
        dropdownElement.classList.remove('d-none');
      }
    });

    // Evento de input para pesquisa
    inputElement.addEventListener('input', () => {
      debouncedSearch(inputElement.value);
    });

    // Evento de foco para mostrar resultados
    inputElement.addEventListener('focus', () => {
      if (inputElement.value.length >= 2) {
        debouncedSearch(inputElement.value);
      }
    });

    // Esconder dropdown ao clicar fora
    document.addEventListener('click', (e) => {
      if (!inputElement.contains(e.target) && !dropdownElement.contains(e.target)) {
        dropdownElement.classList.add('d-none');
      }
    });

    // Navegação com teclado
    inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && !dropdownElement.classList.contains('d-none')) {
        e.preventDefault();
        dropdownElement.querySelector('.dropdown-item')?.focus();
      }
    });
  }
}
