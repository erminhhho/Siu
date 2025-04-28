/**
 * Funções auxiliares para pesquisa
 * Este arquivo contém funções auxiliares para pesquisas no SIU
 */

// Função para pesquisar em um banco de dados
function pesquisar(termo, database, campoTitulo, campoDescricao) {
  if (!termo || termo.length < 2) return [];

  termo = termo.toLowerCase().trim();

  return database.filter(item => {
    const titulo = item[campoTitulo] ? item[campoTitulo].toLowerCase() : '';
    const descricao = item[campoDescricao] ? item[campoDescricao].toLowerCase() : '';
    const categoria = item.categoria ? item.categoria.toLowerCase() : '';

    return titulo.includes(termo) ||
           descricao.includes(termo) ||
           categoria.includes(termo);
  });
}

// Função para exibir resultados de pesquisa
function exibirResultados(resultados, termo, container, tipo, callback) {
  // Se não há resultados, mostra opção para adicionar novo
  if (resultados.length === 0) {
    container.innerHTML = `
      <a href="#" class="list-group-item list-group-item-action" data-value="${termo}">
        <div class="d-flex align-items-center">
          <i class="bi bi-plus-circle-fill text-primary me-2"></i>
          <span>Adicionar "<strong>${termo}</strong>" como novo ${tipo}</span>
        </div>
      </a>
    `;
  } else {
    // Mostra os resultados encontrados
    let html = resultados.map(item => {
      const titulo = item.texto || item.nome;
      return `
        <a href="#" class="list-group-item list-group-item-action" data-value="${titulo}">
          <div class="item-title">${titulo}</div>
          <div class="item-description">${item.descricao} <span class="badge bg-light text-dark">${item.categoria}</span></div>
        </a>
      `;
    }).join('');

    // Adiciona opção para texto personalizado
    html += `
      <a href="#" class="list-group-item list-group-item-action" data-value="${termo}">
        <div class="d-flex align-items-center">
          <i class="bi bi-plus-circle-fill text-primary me-2"></i>
          <span>Adicionar "<strong>${termo}</strong>" como novo ${tipo}</span>
        </div>
      </a>
    `;

    container.innerHTML = html;
  }

  // Adiciona eventos aos resultados
  container.querySelectorAll('a').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const valor = item.getAttribute('data-value');
      callback(valor);
    });
  });
}

// Expor funções globalmente
window.SiuSearch = {
  pesquisar: pesquisar,
  exibirResultados: exibirResultados
};
