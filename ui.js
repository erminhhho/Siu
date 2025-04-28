/**
 * SIU - Interface do Usuário
 */

class SiuUI {
  constructor(storage) {
    this.storage = storage;
    this.handlers = {};

    // Definir handlers de forma segura
    this.registerHandlers();
    this.init();
  }

  registerHandlers() {
    // Registrar handlers para cada página
    this.handlers = {
      'home': this.initHome.bind(this),
      'author': this.initAuthor.bind(this),
      'process': this.initProcess.bind(this),
      'incapacity': this.initIncapacity.bind(this),
      'evidence': this.initEvidence.bind(this),
      'defense': this.initDefense.bind(this),
      'interviews': this.initInterviews.bind(this),
      'report': this.initReport.bind(this)
    };
  }

  init() {
    // Inicializa os botões gerais
    this.initButtons();

    // Escuta por mudanças de rota
    document.addEventListener('routeChanged', (e) => {
      const route = e.detail.route;
      if (this.handlers[route]) {
        this.handlers[route]();
      }
    });

    // Inicializa o handler para selects com opção "outro"
    this.initSelectWithOther();
  }

  // Inicializa botões gerais
  initButtons() {
    // Botão de reset
    const btnReset = document.getElementById('btnReset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
          if (this.storage.clear) {
            this.storage.clear();
          }
          window.location.reload();
        }
      });
    }

    // Botão de exportar
    const btnExport = document.getElementById('btnExport');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        this.exportPDF();
      });
    }

    // Botão de imprimir
    const btnPrint = document.getElementById('btnPrint');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }
  }

  // Novo método para inicializar o comportamento de selects com opção "outro"
  initSelectWithOther() {
    document.addEventListener('change', (e) => {
      if (e.target && e.target.classList.contains('select-with-other')) {
        const otherFieldId = e.target.getAttribute('data-other-target');
        const otherField = document.getElementById(otherFieldId);

        if (otherField) {
          if (e.target.value === 'outro') {
            otherField.classList.remove('d-none');
            otherField.classList.add('show');
          } else {
            otherField.classList.add('d-none');
            otherField.classList.remove('show');
          }
        }
      }
    });
  }

  // Handler para a página inicial
  initHome() {
    console.log('Inicializando página Home');
    // Implementar inicialização da página inicial
  }

  // Handler para a página de autor
  initAuthor() {
    console.log('Inicializando página Autor');
    const form = document.getElementById('autorForm');
    if (!form) return;

    // Preenche com dados salvos
    const data = this.storage.get('author');
    if (data) {
      this.fillForm(form, data);
    }

    // Calcula idade automaticamente
    const dataNascimento = form.elements['dataNascimento'];
    const idadeField = form.elements['idadeAutor'];

    if (dataNascimento && idadeField) {
      // Calcula ao mudar a data
      dataNascimento.addEventListener('change', () => {
        if (dataNascimento.value) {
          const today = new Date();
          const birthDate = new Date(dataNascimento.value);
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();

          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }

          idadeField.value = age;
        }
      });

      // Calcula ao carregar a página
      if (dataNascimento.value) {
        dataNascimento.dispatchEvent(new Event('change'));
      }
    }

    // Salva ao navegar
    this.setupFormSaving(form, 'author');
  }

  // Inicializa página do processo
  initProcess() {
    console.log('Inicializando página Processo');
    // Inicializar handlers para benefícios
    const beneficiosList = document.getElementById('beneficiosList');
    const btnAddBeneficio = document.getElementById('addBeneficio');

    if (beneficiosList && btnAddBeneficio) {
      btnAddBeneficio.addEventListener('click', () => {
        const newIndex = beneficiosList.children.length + 1;
        const newItem = document.createElement('li');
        newItem.className = 'list-group-item bg-transparent px-0';
        newItem.innerHTML = `
          <div class="d-flex align-items-center">
            <div class="form-floating flex-grow-1">
              <select class="form-select select-with-other" id="beneficio${newIndex}" name="beneficios[]" data-other-target="outroBeneficio${newIndex}">
                <option value="" selected disabled>Selecione um benefício...</option>
                <option value="auxilio-doenca">Auxílio-Doença (B31)</option>
                <option value="aposentadoria-invalidez">Aposentadoria por Invalidez (B32)</option>
                <option value="auxilio-acidente">Auxílio-Acidente (B94)</option>
                <option value="bpc-loas">BPC/LOAS (B87)</option>
                <option value="aposentadoria-tempo">Aposentadoria por Tempo de Contribuição (B42)</option>
                <option value="aposentadoria-idade">Aposentadoria por Idade (B41)</option>
                <option value="aposentadoria-especial">Aposentadoria Especial (B46)</option>
                <option value="pensao-morte">Pensão por Morte (B21)</option>
                <option value="salario-maternidade">Salário-Maternidade (B80)</option>
                <option value="auxilio-reclusao">Auxílio-Reclusão (B25)</option>
                <option value="outro">Outro...</option>
              </select>
              <label for="beneficio${newIndex}">Benefício Pleiteado</label>
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger ms-2 align-self-center remove-btn" title="Remover">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <div class="form-floating mt-2 d-none outro-field" id="outroBeneficio${newIndex}">
            <input type="text" class="form-control" id="outroBeneficioInput${newIndex}" placeholder="Especifique o benefício" name="outroBeneficios[]">
            <label for="outroBeneficioInput${newIndex}">Especifique o benefício</label>
          </div>
        `;
        beneficiosList.appendChild(newItem);

        // Adicionar evento para o botão remover
        newItem.querySelector('.remove-btn').addEventListener('click', function() {
          newItem.remove();
        });
      });
    }

    // Inicializar handlers para motivos
    const motivosList = document.getElementById('motivosList');
    const btnAddMotivo = document.getElementById('addMotivo');

    if (motivosList && btnAddMotivo) {
      btnAddMotivo.addEventListener('click', () => {
        const newIndex = motivosList.children.length + 1;
        const newItem = document.createElement('li');
        newItem.className = 'list-group-item bg-transparent px-0';
        newItem.innerHTML = `
          <div class="d-flex align-items-center">
            <div class="form-floating flex-grow-1">
              <select class="form-select select-with-other" id="motivo${newIndex}" name="motivos[]" data-other-target="outroMotivo${newIndex}">
                <option value="" selected disabled>Selecione um motivo...</option>
                <option value="falta-qualidade-segurado">Falta de qualidade de segurado</option>
                <option value="falta-carencia">Não cumprimento de carência</option>
                <option value="falta-incapacidade">Não constatação de incapacidade</option>
                <option value="falta-deficiencia">Não constatação de deficiência</option>
                <option value="doenca-preexistente">Doença ou lesão preexistente</option>
                <option value="falta-tempo-contribuicao">Tempo de contribuição insuficiente</option>
                <option value="falta-idade-minima">Não atingiu idade mínima</option>
                <option value="falta-atividade-rural">Não comprovação de atividade rural</option>
                <option value="falta-dependencia-economica">Falta de comprovação de dependência econômica</option>
                <option value="outro">Outro...</option>
              </select>
              <label for="motivo${newIndex}">Motivo de Indeferimento</label>
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger ms-2 align-self-center remove-btn" title="Remover">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <div class="form-floating mt-2 d-none outro-field" id="outroMotivo${newIndex}">
            <input type="text" class="form-control" id="outroMotivoInput${newIndex}" placeholder="Especifique o motivo" name="outroMotivos[]">
            <label for="outroMotivoInput${newIndex}">Especifique o motivo</label>
          </div>
        `;
        motivosList.appendChild(newItem);

        // Adicionar evento para o botão remover
        newItem.querySelector('.remove-btn').addEventListener('click', function() {
          newItem.remove();
        });
      });
    }

    // Carregar dados salvos
    const data = this.storage.get('process');
    if (data) {
      // Implementar preenchimento de campos com dados salvos
    }

    // Configurar salvamento de formulário
    const form = document.querySelector('form');
    if (form) {
      this.setupFormSaving(form, 'process');
    }
  }

  // Inicializa página de incapacidade
  initIncapacity() {
    console.log('Inicializando página Incapacidade');

    // Inicializar serviço CID se ainda não existir
    if (!window.cidHelper) {
      window.cidHelper = new CID();
    }

    // Adicionar evento para botão de adicionar doença
    const doencasList = document.getElementById('doencasList');
    const btnAddDoenca = document.getElementById('addDoenca');

    if (doencasList && btnAddDoenca) {
      btnAddDoenca.addEventListener('click', () => {
        const newIndex = doencasList.children.length + 1;
        const newItem = document.createElement('li');
        newItem.className = 'list-group-item bg-transparent px-0';
        newItem.innerHTML = `
          <div class="d-flex align-items-center">
            <div class="row g-2 flex-grow-1">
              <div class="col-md-3">
                <div class="form-floating position-relative">
                  <input type="text" class="form-control cid-input" id="cid${newIndex}" placeholder="CID" name="cids[]" data-index="${newIndex}" autocomplete="off">
                  <label for="cid${newIndex}">CID</label>
                  <div class="cid-dropdown dropdown-menu shadow-sm w-100" id="cidDropdown${newIndex}" style="display:none;"></div>
                </div>
              </div>
              <div class="col-md-9">
                <div class="form-floating position-relative">
                  <input type="text" class="form-control doenca-input" id="doenca${newIndex}" placeholder="Doença" name="doencas[]" data-index="${newIndex}" autocomplete="off">
                  <label for="doenca${newIndex}">Doença/Condição</label>
                  <div class="doenca-dropdown dropdown-menu shadow-sm w-100" id="doencaDropdown${newIndex}" style="display:none;"></div>
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger ms-2 align-self-center remove-btn" title="Remover">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        `;
        doencasList.appendChild(newItem);

        // Adicionar evento ao botão de remover
        newItem.querySelector('.remove-btn').addEventListener('click', () => {
          newItem.remove();
        });

        // Inicializar autocomplete nos novos campos
        setTimeout(() => {
          window.cidHelper.setupFields(newIndex);
        }, 0);
      });
    }

    // Inicializar autocomplete para todos os campos existentes
    document.querySelectorAll('.cid-input').forEach(input => {
      const index = input.dataset.index;
      if (index) {
        setTimeout(() => {
          window.cidHelper.setupFields(index);
        }, 0);
      }
    });

    // Salvar ao navegar
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        this.saveIncapacityData();
      });
    });
  }

  // Salvar dados de incapacidade
  saveIncapacityData() {
    if (!this.storage.set) return;

    const doencasElements = document.querySelectorAll('input[name="doencas[]"]');
    const cidsElements = document.querySelectorAll('input[name="cids[]"]');
    const observacoes = document.getElementById('observacoesIncapacidade')?.value || '';

    const doencas = [];
    doencasElements.forEach(el => {
      if (el.value.trim()) {
        doencas.push(el.value.trim());
      }
    });

    const cids = [];
    cidsElements.forEach(el => {
      if (el.value.trim()) {
        cids.push(el.value.trim());
      }
    });

    this.storage.set('incapacity', {
      doencas,
      cids,
      observacoes
    });
  }

  // Inicializa página de provas
  initEvidence() {
    console.log('Inicializando página Provas');

    // Banco de dados de provas para pesquisa
    const provasDB = [
      // Provas rurais
      { categoria: 'Rural', nome: "CNIS - Cadastro Nacional de Informações Sociais", descricao: "Extrato que comprova vínculos rurais" },
      { categoria: 'Rural', nome: "DAP - Declaração de Aptidão ao Pronaf", descricao: "Documento que qualifica o agricultor familiar" },
      { categoria: 'Rural', nome: "Talão de Produtor Rural", descricao: "Comprovante de venda de produtos rurais" },
      { categoria: 'Rural', nome: "ITR - Imposto Territorial Rural", descricao: "Comprovante de pagamento de imposto de propriedade rural" },
      { categoria: 'Rural', nome: "INCRA - Certificado de Cadastro de Imóvel Rural", descricao: "Registro de propriedade rural" },
      { categoria: 'Rural', nome: "Contrato de Parceria ou Arrendamento Rural", descricao: "Documento que comprova relação de trabalho rural" },
      { categoria: 'Rural', nome: "Certificado de Cadastro de Imóvel Rural (CCIR)", descricao: "Documento emitido pelo INCRA" },
      { categoria: 'Rural', nome: "Ficha de Cadastro na Secretaria de Agricultura", descricao: "Registro em órgão municipal/estadual" },
      { categoria: 'Rural', nome: "Bloco de Notas do Produtor Rural", descricao: "Comprovante de venda de produtos rurais" },
      { categoria: 'Rural', nome: "Ficha de Filiação a Sindicato Rural", descricao: "Comprovante de associação a sindicato" },
      { categoria: 'Rural', nome: "Contratos de Empréstimo ou Financiamento Rural", descricao: "Documentos de crédito rural (PRONAF, etc)" },

      // Provas de incapacidade
      { categoria: 'Incapacidade', nome: "Laudo Médico Detalhado", descricao: "Documento médico com CID e descrição da incapacidade" },
      { categoria: 'Incapacidade', nome: "Exames Complementares", descricao: "Exames que comprovam a patologia (raio-x, ressonância, etc)" },
      { categoria: 'Incapacidade', nome: "Receituários Médicos", descricao: "Comprovantes de medicamentos em uso contínuo" },
      { categoria: 'Incapacidade', nome: "Atestados Médicos", descricao: "Documentos médicos atestando afastamento" },
      { categoria: 'Incapacidade', nome: "CAT - Comunicação de Acidente de Trabalho", descricao: "Documento que registra acidente laboral" },
      { categoria: 'Incapacidade', nome: "Perícia Médica Anterior", descricao: "Resultado de perícia realizada anteriormente" },

      // Provas de pobreza (LOAS/BPC)
      { categoria: 'Pobreza', nome: "Inscrição no CadÚnico", descricao: "Cadastro em programas sociais do governo" },
      { categoria: 'Pobreza', nome: "Comprovante de Benefício Social", descricao: "Recebimento de Bolsa Família ou similar" },
      { categoria: 'Pobreza', nome: "Conta de Água/Luz/Telefone", descricao: "Contas básicas demonstrando baixa renda" },
      { categoria: 'Pobreza', nome: "Declaração de Imposto de Renda Isento", descricao: "Comprovante de isenção por baixa renda" },
      { categoria: 'Pobreza', nome: "Comprovante de Moradia", descricao: "Contrato de aluguel ou comodato" },

      // Provas de vínculo (pensão)
      { categoria: 'Vínculo', nome: "Certidão de Casamento", descricao: "Documento que comprova união civil" },
      { categoria: 'Vínculo', nome: "Declaração de União Estável", descricao: "Documento que comprova relação estável" },
      { categoria: 'Vínculo', nome: "Certidão de Nascimento de Filhos", descricao: "Documento que comprova filiação comum" },
      { categoria: 'Vínculo', nome: "Conta Bancária Conjunta", descricao: "Comprovante de dependência econômica" },
      { categoria: 'Vínculo', nome: "Comprovante de Mesmo Endereço", descricao: "Documentos que demonstram convivência" },
      { categoria: 'Vínculo', nome: "Seguro de Vida/Plano de Saúde como Dependente", descricao: "Documento que comprova dependência" }
    ];

    // Elementos do DOM
    const searchBox = document.getElementById('searchProva');
    const searchResults = document.getElementById('searchResults');
    const provasDocumentais = document.getElementById('provasDocumentais');
    const btnAddNovaProva = document.getElementById('btnAddNovaProva');
    const infoProvas = document.getElementById('infoProvas');

    // Função para adicionar prova
    const adicionarProva = (textoProva) => {
      if (!provasDocumentais || !textoProva.trim()) return;

      const newIndex = provasDocumentais.children.length + 1;
      const newItem = document.createElement('li');
      newItem.className = 'list-group-item bg-transparent px-0';
      newItem.innerHTML = `
        <div class="d-flex align-items-center">
          <div class="form-floating flex-grow-1">
            <input type="text" class="form-control" id="prova${newIndex}" placeholder="Descrição da prova" name="prova[]" value="${textoProva}">
            <label for="prova${newIndex}">Descrição da prova</label>
          </div>
          <button type="button" class="btn btn-sm btn-outline-danger ms-2 align-self-center remove-btn" title="Remover">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      provasDocumentais.appendChild(newItem);

      // Adicionar evento ao botão de remover
      newItem.querySelector('.remove-btn').addEventListener('click', () => {
        newItem.remove();
      });

      // Limpar campo de pesquisa e resultados
      if (searchBox) {
        searchBox.value = '';
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
      }
    };

    // Função de pesquisa em tempo real
    const realizarPesquisa = () => {
      if (!searchBox || !searchResults) return;

      const term = searchBox.value.toLowerCase().trim();

      // Se o termo de pesquisa for muito curto, esconde resultados
      if (term.length < 2) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        infoProvas.style.display = 'block';
        return;
      }

      // Filtra resultados
      const results = provasDB.filter(prova =>
        prova.nome.toLowerCase().includes(term) ||
        prova.descricao.toLowerCase().includes(term) ||
        prova.categoria.toLowerCase().includes(term)
      );

      // Se não há resultados, mostra opção para adicionar novo
      if (results.length === 0) {
        searchResults.innerHTML = `
          <a href="#" class="list-group-item list-group-item-action" data-value="${term}">
            <div class="d-flex align-items-center">
              <i class="bi bi-plus-circle-fill text-primary me-2"></i>
              <span>Adicionar "<strong>${term}</strong>" como nova prova</span>
            </div>
          </a>
        `;
      } else {
        // Mostra os resultados encontrados
        searchResults.innerHTML = results.map(prova => `
          <a href="#" class="list-group-item list-group-item-action" data-value="${prova.nome}">
            <div class="item-title">${prova.nome}</div>
            <div class="item-description">${prova.descricao} <span class="badge bg-light text-dark">${prova.categoria}</span></div>
          </a>
        `).join('');

        // Adiciona opção para texto personalizado
        searchResults.innerHTML += `
          <a href="#" class="list-group-item list-group-item-action" data-value="${term}">
            <div class="d-flex align-items-center">
              <i class="bi bi-plus-circle-fill text-primary me-2"></i>
              <span>Adicionar "<strong>${term}</strong>" como nova prova</span>
            </div>
          </a>
        `;
      }

      // Exibe os resultados
      searchResults.style.display = 'block';
      infoProvas.style.display = 'none';

      // Adiciona eventos aos resultados
      document.querySelectorAll('#searchResults a').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const valor = item.getAttribute('data-value');
          adicionarProva(valor);
        });
      });
    };

    // Inicializa eventos
    if (searchBox) {
      // Pesquisa em tempo real
      searchBox.addEventListener('input', realizarPesquisa);

      // Ao pressionar Enter, adiciona o texto atual
      searchBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          adicionarProva(searchBox.value);
        }
      });

      // Clique fora fecha os resultados
      document.addEventListener('click', (e) => {
        if (!searchBox.contains(e.target) && !searchResults.contains(e.target)) {
          searchResults.style.display = 'none';
        }
      });
    }

    // Botão para adicionar nova prova
    if (btnAddNovaProva) {
      btnAddNovaProva.addEventListener('click', () => {
        adicionarProva(searchBox.value);
      });
    }

    // Mostrar mensagem informativa inicialmente
    if (infoProvas) {
      infoProvas.style.display = 'block';
    }

    // Carregar dados salvos
    const data = this.storage.get('evidence');
    if (data && data.provas && provasDocumentais) {
      // Preencher provas salvas
      data.provas.forEach(prova => {
        adicionarProva(prova);
      });
    }

    // Configurar salvamento
    this.setupEvidenceSaving();
  }

  // Configurar salvamento de provas
  setupEvidenceSaving() {
    // Salvar ao navegar
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        this.saveEvidenceData();
      });
    });
  }

  // Salvar dados de provas
  saveEvidenceData() {
    if (!this.storage.set) return;

    const provasElements = document.querySelectorAll('input[name="prova[]"]');
    const observacoes = document.getElementById('observacoesProvas')?.value || '';

    const provas = [];
    provasElements.forEach(el => {
      if (el.value.trim()) {
        provas.push(el.value.trim());
      }
    });

    this.storage.set('evidence', {
      provas,
      observacoes
    });
  }

  // Inicializa página de contestação
  initDefense() {
    console.log('Inicializando página Contestação');

    // Banco de dados de argumentos comuns do INSS
    const argumentosDB = {
      qualidade: [
        { id: 'q1', texto: "Falta de qualidade de segurado na data do início da incapacidade" },
        { id: 'q2', texto: "Perda da qualidade de segurado (período de graça expirado)" },
        { id: 'q3', texto: "Não comprovação dos recolhimentos previdenciários" },
        { id: 'q4', texto: "Ausência de inscrição no RGPS" }
      ],
      carencia: [
        { id: 'c1', texto: "Não cumprimento da carência mínima exigida (12 contribuições)" },
        { id: 'c2', texto: "Carência não cumprida para aposentadoria (180 contribuições)" },
        { id: 'c3', texto: "Não cumprimento da carência após nova filiação" }
      ],
      incapacidade: [
        { id: 'i1', texto: "Incapacidade não constatada pela perícia médica" },
        { id: 'i2', texto: "Incapacidade parcial (possibilidade de reabilitação)" },
        { id: 'i3', texto: "Incapacidade preexistente ao ingresso no RGPS" },
        { id: 'i4', texto: "Recuperação da capacidade laborativa" },
        { id: 'i5', texto: "Ausência de incapacidade para atividade habitual" },
        { id: 'i6', texto: "Doença não incapacitante" }
      ],
      rural: [
        { id: 'r1', texto: "Ausência de início de prova material" },
        { id: 'r2', texto: "Descontinuidade da atividade rural" },
        { id: 'r3', texto: "Prova exclusivamente testemunhal" },
        { id: 'r4', texto: "Documentos em nome de terceiros sem comprovação de vínculo" },
        { id: 'r5', texto: "Atividade urbana do cônjuge descaracteriza condição de segurado especial" }
      ],
      bpc: [
        { id: 'b1', texto: "Renda familiar per capita superior a 1/4 do salário mínimo" },
        { id: 'b2', texto: "Ausência de deficiência de longo prazo" },
        { id: 'b3', texto: "Não comprovação de miserabilidade" },
        { id: 'b4', texto: "Composição familiar declarada incorretamente" }
      ],
      aposentadoria: [
        { id: 'a1', texto: "Não atingimento da idade mínima" },
        { id: 'a2', texto: "Tempo de contribuição insuficiente" },
        { id: 'a3', texto: "Falta de implementação dos requisitos na data do requerimento" },
        { id: 'a4', texto: "Não comprovação de tempo especial" }
      ],
      pensao: [
        { id: 'p1', texto: "Ausência de comprovação de dependência econômica" },
        { id: 'p2', texto: "Não comprovação de união estável" },
        { id: 'p3', texto: "Perda da qualidade de dependente" },
        { id: 'p4', texto: "Não qualidade de segurado do falecido na data do óbito" }
      ],
      processual: [
        { id: 'pr1', texto: "Prescrição quinquenal" },
        { id: 'pr2', texto: "Falta de interesse de agir (ausência de prévio requerimento administrativo)" },
        { id: 'pr3', texto: "Decadência (revisão requerida após 10 anos)" },
        { id: 'pr4', texto: "Coisa julgada (matéria já decidida em outro processo)" }
      ],
      outro: [
        { id: 'o1', texto: "Outro argumento (especificar)" }
      ]
    };

    // Elementos do DOM
    const categoriaTese = document.getElementById('categoriaTese');
    const argumentoInss = document.getElementById('argumentoInss');
    const btnAddArgumento = document.getElementById('btnAddArgumento');
    const argumentosContestacao = document.getElementById('argumentosContestacao');

    // Inicializa o dropdown de argumentos baseado na categoria selecionada
    if (categoriaTese && argumentoInss) {
      categoriaTese.addEventListener('change', () => {
        const categoria = categoriaTese.value;
        argumentoInss.innerHTML = '<option value="" selected disabled>Selecione um argumento...</option>';
        argumentoInss.disabled = !categoria;

        if (categoria && argumentosDB[categoria]) {
          argumentosDB[categoria].forEach(arg => {
            const option = document.createElement('option');
            option.value = arg.id;
            option.textContent = arg.texto;
            argumentoInss.appendChild(option);
          });
        }
      });
    }

    // Função para adicionar argumento
    const adicionarArgumento = () => {
      if (!argumentosContestacao || !argumentoInss || argumentoInss.disabled) return;

      if (argumentoInss.selectedIndex <= 0) return;

      const selectedOption = argumentoInss.options[argumentoInss.selectedIndex];
      if (!selectedOption || selectedOption.disabled) return;

      const textoArgumento = selectedOption.textContent;
      const categoriaTexto = categoriaTese.options[categoriaTese.selectedIndex].textContent;

      // Para a opção "Outro argumento", solicita um texto personalizado
      let textoFinal = textoArgumento;
      if (textoArgumento === "Outro argumento (especificar)") {
        const textoPersonalizado = prompt("Digite o argumento personalizado:");
        if (!textoPersonalizado) return;
        textoFinal = textoPersonalizado;
      }

      const newIndex = argumentosContestacao.children.length + 1;
      const newItem = document.createElement('li');
      newItem.className = 'list-group-item bg-transparent px-0';
      newItem.innerHTML = `
        <div class="d-flex align-items-center">
          <div class="flex-grow-1">
            <div class="d-flex align-items-center">
              <strong class="me-2">${textoFinal}</strong>
              <span class="badge bg-secondary">${categoriaTexto}</span>
            </div>
          </div>
          <button type="button" class="btn btn-sm btn-outline-danger ms-2 remove-btn" title="Remover">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      argumentosContestacao.appendChild(newItem);

      // Adicionar evento ao botão de remover
      newItem.querySelector('.remove-btn').addEventListener('click', () => {
        newItem.remove();
      });

      // Resetar seleção
      categoriaTese.selectedIndex = 0;
      argumentoInss.innerHTML = '<option value="" selected disabled>Primeiro selecione uma categoria...</option>';
      argumentoInss.disabled = true;
    };

    // Botão para adicionar argumento
    if (btnAddArgumento) {
      btnAddArgumento.addEventListener('click', adicionarArgumento);
    }

    // Carregar dados salvos
    const data = this.storage.get('defense');
    if (data) {
      // Carregar argumentos salvos
      if (data.argumentos && Array.isArray(data.argumentos)) {
        data.argumentos.forEach(arg => {
          const newItem = document.createElement('li');
          newItem.className = 'list-group-item bg-transparent px-0';
          newItem.innerHTML = `
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <strong>${arg}</strong>
              </div>
              <button type="button" class="btn btn-sm btn-outline-danger ms-2 remove-btn" title="Remover">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          `;
          if (argumentosContestacao) {
            argumentosContestacao.appendChild(newItem);

            // Adicionar evento ao botão de remover
            newItem.querySelector('.remove-btn').addEventListener('click', () => {
              newItem.remove();
            });
          }
        });
      }

      // Carregar teses defensivas
      const tesesDefensivas = document.getElementById('tesesDefensivas');
      if (tesesDefensivas) {
        tesesDefensivas.value = data.tesesDefensivas || '';
      }

      // Carregar contra-argumentação
      const contraArgumentacao = document.getElementById('contraArgumentacao');
      if (contraArgumentacao) {
        contraArgumentacao.value = data.contraArgumentacao || '';
      }

      // Carregar observações
      const observacoesContestacao = document.getElementById('observacoesContestacao');
      if (observacoesContestacao) {
        observacoesContestacao.value = data.observacoes || '';
      }
    }

    // Configurar salvamento
    this.setupDefenseSaving();
  }

  // Configurar salvamento de contestação
  setupDefenseSaving() {
    // Salvar ao navegar
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        this.saveDefenseData();
      });
    });
  }

  // Salvar dados de contestação
  saveDefenseData() {
    if (!this.storage.set) return;

    const argumentosItems = document.querySelectorAll('#argumentosContestacao li strong');
    const tesesDefensivas = document.getElementById('tesesDefensivas')?.value || '';
    const contraArgumentacao = document.getElementById('contraArgumentacao')?.value || '';
    const observacoes = document.getElementById('observacoesContestacao')?.value || '';

    const argumentos = [];
    argumentosItems.forEach(el => {
      if (el.textContent.trim()) {
        argumentos.push(el.textContent.trim());
      }
    });

    this.storage.set('defense', {
      argumentos,
      tesesDefensivas,
      contraArgumentacao,
      observacoes
    });
  }

  // Inicializa página de entrevistas
  initInterviews() {
    console.log('Inicializando página Entrevistas');

    // Elementos DOM - Autor
    const historiaAutor = document.getElementById('historiaAutor');
    const btnMostrarTodasPerguntas = document.getElementById('btnMostrarTodasPerguntas');
    const btnOcultarTodasPerguntas = document.getElementById('btnOcultarTodasPerguntas');
    const btnLimparRespostas = document.getElementById('btnLimparRespostas');
    const btnAddPerguntaPersonalizada = document.getElementById('btnAddPerguntaPersonalizada');

    // Elementos DOM - Testemunhas
    const testemunhasContainer = document.getElementById('testemunhasContainer');
    const semTestemunhasAlert = document.getElementById('semTestemunhasAlert');
    const btnAddTestemunha = document.getElementById('btnAddTestemunha');
    const testemunhaTemplate = document.getElementById('testemunhaTemplate');

    // Perguntas predefinidas para testemunhas rurais
    const perguntasTestemunhaRural = [
      {
        categoria: "Conhecimento sobre o Autor",
        perguntas: [
          "Há quanto tempo conhece o autor?",
          "Qual a sua relação com o autor?",
          "Onde e como conheceu o autor?",
          "Sabe a idade do autor? Desde que idade ele trabalha na roça?",
          "Sabe informar onde o autor nasceu e cresceu?"
        ]
      },
      {
        categoria: "Sobre o Trabalho Rural",
        perguntas: [
          "Já viu o autor trabalhando na roça? Com que frequência?",
          "Que tipo de atividade rural o autor exerce?",
          "O autor trabalha sozinho ou com ajuda da família?",
          "Sabe informar o que o autor cultiva/planta?",
          "Conhece a propriedade onde o autor trabalha?",
          "Sabe informar se a terra é própria, arrendada ou cedida?",
          "Sabe o tamanho aproximado da área de cultivo do autor?"
        ]
      },
      {
        categoria: "Produção e Comercialização",
        perguntas: [
          "Sabe se o autor vende o que produz? Onde e como?",
          "Já comprou produtos cultivados pelo autor?",
          "Já viu o autor comercializando sua produção? Onde?",
          "Sabe se o autor produz apenas para subsistência ou também para venda?"
        ]
      },
      {
        categoria: "Vizinhança e Comunidade",
        perguntas: [
          "Também é trabalhador rural ou conhece a atividade?",
          "Conhece outros trabalhadores rurais da região que conhecem o autor?",
          "Sabe informar como o autor é conhecido na comunidade?",
          "Participa de alguma associação ou sindicato rural junto com o autor?"
        ]
      },
      {
        categoria: "Continuidade da Atividade",
        perguntas: [
          "Sabe se o autor já trabalhou em outra atividade que não a rural?",
          "Sabe se o autor se afastou da atividade rural em algum momento? Por quê?",
          "Até quando o autor exerceu atividade rural que você tenha conhecimento?"
        ]
      }
    ];

    // Contador para IDs únicos de testemunhas
    let testemunhaCounter = 0;

    // Mostrar todas as perguntas para o autor
    if (btnMostrarTodasPerguntas) {
      btnMostrarTodasPerguntas.addEventListener('click', () => {
        document.querySelectorAll('#perguntasAutor .accordion-collapse').forEach(collapse => {
          const bsCollapse = new bootstrap.Collapse(collapse, { toggle: false });
          bsCollapse.show();
        });
      });
    }

    // Ocultar todas as perguntas para o autor
    if (btnOcultarTodasPerguntas) {
      btnOcultarTodasPerguntas.addEventListener('click', () => {
        document.querySelectorAll('#perguntasAutor .accordion-collapse').forEach(collapse => {
          const bsCollapse = new bootstrap.Collapse(collapse, { toggle: false });
          bsCollapse.hide();
        });
      });
    }

    // Limpar todas as respostas das perguntas do autor
    if (btnLimparRespostas) {
      btnLimparRespostas.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar todas as respostas?')) {
          document.querySelectorAll('.pergunta-autor').forEach(input => {
            input.value = '';
          });
        }
      });
    }

    // Adicionar pergunta personalizada para o autor
    if (btnAddPerguntaPersonalizada) {
      btnAddPerguntaPersonalizada.addEventListener('click', () => {
        const perguntaTexto = prompt('Digite a pergunta:');
        if (!perguntaTexto) return;

        // Encontrar ou criar grupo "Perguntas Personalizadas"
        let grupoPersonalizado = document.getElementById('heading-personalizado');
        if (!grupoPersonalizado) {
          const perguntasAutor = document.getElementById('perguntasAutor');
          if (!perguntasAutor) return;

          // Criar novo grupo para perguntas personalizadas
          const novoGrupo = document.createElement('div');
          novoGrupo.className = 'accordion-item';
          novoGrupo.innerHTML = `
            <h2 class="accordion-header" id="heading-personalizado">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-personalizado" aria-expanded="true" aria-controls="collapse-personalizado">
                Perguntas Personalizadas
              </button>
            </h2>
            <div id="collapse-personalizado" class="accordion-collapse collapse show" aria-labelledby="heading-personalizado" data-bs-parent="#perguntasAutor">
              <div class="accordion-body" id="perguntas-personalizadas-container">
              </div>
            </div>
          `;
          perguntasAutor.appendChild(novoGrupo);
          grupoPersonalizado = document.getElementById('heading-personalizado');
        }

        // Adicionar a pergunta ao grupo personalizado
        const perguntasContainer = document.getElementById('perguntas-personalizadas-container');
        if (perguntasContainer) {
          const novaPerguntaId = `pergunta-personalizada-${Date.now()}`;
          const novaPergunta = document.createElement('div');
          novaPergunta.className = 'mb-3';
          novaPergunta.innerHTML = `
            <div class="d-flex">
              <label class="form-label flex-grow-1">${perguntaTexto}</label>
              <button type="button" class="btn btn-sm btn-outline-danger" title="Remover pergunta">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <input type="text" class="form-control pergunta-autor" id="${novaPerguntaId}" name="${novaPerguntaId}">
          `;
          perguntasContainer.appendChild(novaPergunta);

          // Adicionar evento para remover pergunta
          const btnRemover = novaPergunta.querySelector('button');
          if (btnRemover) {
            btnRemover.addEventListener('click', () => {
              novaPergunta.remove();
              // Verificar se o grupo está vazio
              if (perguntasContainer.children.length === 0) {
                document.querySelector('.accordion-item:has(#heading-personalizado)').remove();
              }
            });
          }

          // Abrir o grupo personalizado
          const collapsePersonalizado = document.getElementById('collapse-personalizado');
          if (collapsePersonalizado) {
            const bsCollapse = new bootstrap.Collapse(collapsePersonalizado, { toggle: false });
            bsCollapse.show();
          }
        }
      });
    }

    // Adicionar testemunha
    if (btnAddTestemunha && testemunhaTemplate && testemunhasContainer) {
      btnAddTestemunha.addEventListener('click', () => {
        // Incrementa contador
        testemunhaCounter++;

        // Oculta alerta de "sem testemunhas"
        if (semTestemunhasAlert) {
          semTestemunhasAlert.style.display = 'none';
        }

        // Cria nova testemunha a partir do template
        const templateContent = testemunhaTemplate.innerHTML
          .replace(/{ID}/g, testemunhaCounter);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = templateContent;
        const newTestemunha = tempDiv.firstElementChild;

        testemunhasContainer.appendChild(newTestemunha);

        // Inicializa eventos da nova testemunha
        initTestemunhaEvents(newTestemunha, testemunhaCounter);

        // Adiciona perguntas predefinidas
        adicionarPerguntasPredefinidas(newTestemunha, testemunhaCounter);
      });
    }

    // Função para adicionar perguntas predefinidas à testemunha
    function adicionarPerguntasPredefinidas(testemunhaElement, id) {
      if (!testemunhaElement) return;

      const perguntasContainer = testemunhaElement.querySelector('.testemunha-perguntas-container');
      if (!perguntasContainer) return;

      // Limpa o container de perguntas
      perguntasContainer.innerHTML = '';

      // Adiciona acordeão para categorias de perguntas
      const acordeaoId = `acordeaoTestemunha${id}`;
      const acordeao = document.createElement('div');
      acordeao.className = 'accordion mb-3';
      acordeao.id = acordeaoId;
      perguntasContainer.appendChild(acordeao);

      // Adiciona categorias e perguntas
      perguntasTestemunhaRural.forEach((categoria, catIndex) => {
        const categoriaId = `categoria${id}_${catIndex}`;
        const categoriaElement = document.createElement('div');
        categoriaElement.className = 'accordion-item';
        categoriaElement.innerHTML = `
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#${categoriaId}" aria-expanded="false" aria-controls="${categoriaId}">
              ${categoria.categoria}
            </button>
          </h2>
          <div id="${categoriaId}" class="accordion-collapse collapse" data-bs-parent="#${acordeaoId}">
            <div class="accordion-body perguntasCategoria${catIndex}">
            </div>
          </div>
        `;
        acordeao.appendChild(categoriaElement);

        // Adiciona perguntas dentro da categoria
        const categoriaPerguntasContainer = categoriaElement.querySelector(`.perguntasCategoria${catIndex}`);
        if (categoriaPerguntasContainer) {
          categoria.perguntas.forEach((pergunta, pIndex) => {
            const perguntaElement = document.createElement('div');
            perguntaElement.className = 'testemunha-pergunta mb-3';
            perguntaElement.innerHTML = `
              <div class="input-group mb-2">
                <span class="input-group-text">P</span>
                <input type="text" class="form-control testemunha-pergunta-texto" value="${pergunta}" readonly>
                <button class="btn btn-outline-secondary btn-edit-pergunta" type="button" title="Editar">
                  <i class="bi bi-pencil"></i>
                </button>
              </div>
              <div class="input-group">
                <span class="input-group-text">R</span>
                <input type="text" class="form-control testemunha-resposta-texto" placeholder="Resposta">
              </div>
            `;
            categoriaPerguntasContainer.appendChild(perguntaElement);

            // Adicionar evento para editar a pergunta
            const btnEdit = perguntaElement.querySelector('.btn-edit-pergunta');
            const inputPergunta = perguntaElement.querySelector('.testemunha-pergunta-texto');

            if (btnEdit && inputPergunta) {
              btnEdit.addEventListener('click', () => {
                // Se estiver readonly, permite edição
                if (inputPergunta.readOnly) {
                  inputPergunta.readOnly = false;
                  inputPergunta.focus();
                  btnEdit.innerHTML = '<i class="bi bi-check"></i>';
                  btnEdit.title = "Concluir edição";
                } else {
                  // Se estiver em edição, salva
                  inputPergunta.readOnly = true;
                  btnEdit.innerHTML = '<i class="bi bi-pencil"></i>';
                  btnEdit.title = "Editar";
                }
              });
            }
          });
        }
      });

      // Adiciona botão para mostrar todas as perguntas
      const botoesContainer = document.createElement('div');
      botoesContainer.className = 'd-flex gap-2 mb-3';
      botoesContainer.innerHTML = `
        <button class="btn btn-sm btn-outline-primary btn-mostrar-todas-perguntas">
          <i class="bi bi-eye me-1"></i>Mostrar Todas
        </button>
        <button class="btn btn-sm btn-outline-secondary btn-ocultar-todas-perguntas">
          <i class="bi bi-eye-slash me-1"></i>Ocultar Todas
        </button>
      `;
      perguntasContainer.insertBefore(botoesContainer, acordeao);

      // Adiciona eventos aos botões
      const btnMostrarTodas = botoesContainer.querySelector('.btn-mostrar-todas-perguntas');
      if (btnMostrarTodas) {
        btnMostrarTodas.addEventListener('click', () => {
          testemunhaElement.querySelectorAll('.accordion-collapse').forEach(collapse => {
            const bsCollapse = new bootstrap.Collapse(collapse, { toggle: false });
            bsCollapse.show();
          });
        });
      }

      const btnOcultarTodas = botoesContainer.querySelector('.btn-ocultar-todas-perguntas');
      if (btnOcultarTodas) {
        btnOcultarTodas.addEventListener('click', () => {
          testemunhaElement.querySelectorAll('.accordion-collapse').forEach(collapse => {
            const bsCollapse = new bootstrap.Collapse(collapse, { toggle: false });
            bsCollapse.hide();
          });
        });
      }

      // Botão para adicionar pergunta personalizada
      const btnAddContainer = document.createElement('div');
      btnAddContainer.className = 'mt-3';
      btnAddContainer.innerHTML = `
        <button class="btn btn-sm btn-outline-primary btn-adicionar-pergunta-personalizada">
          <i class="bi bi-plus-circle me-1"></i>Adicionar Pergunta Personalizada
        </button>
      `;
      perguntasContainer.appendChild(btnAddContainer);

      // Evento para adicionar pergunta personalizada
      const btnAddPerguntaPersonalizada = btnAddContainer.querySelector('.btn-adicionar-pergunta-personalizada');
      if (btnAddPerguntaPersonalizada) {
        btnAddPerguntaPersonalizada.addEventListener('click', () => {
          const perguntaTexto = prompt('Digite a pergunta para a testemunha:');
          if (!perguntaTexto) return;

          // Cria categoria "Perguntas Personalizadas" se não existir
          let categoriaPersonalizada = testemunhaElement.querySelector('.categoria-personalizada');
          if (!categoriaPersonalizada) {
            const categoriaId = `categoriaPersonalizada${id}`;
            categoriaPersonalizada = document.createElement('div');
            categoriaPersonalizada.className = 'accordion-item categoria-personalizada';
            categoriaPersonalizada.innerHTML = `
              <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse"
                        data-bs-target="#${categoriaId}" aria-expanded="true" aria-controls="${categoriaId}">
                  Perguntas Personalizadas
                </button>
              </h2>
              <div id="${categoriaId}" class="accordion-collapse collapse show" data-bs-parent="#${acordeaoId}">
                <div class="accordion-body perguntas-personalizadas-container">
                </div>
              </div>
            `;
            acordeao.appendChild(categoriaPersonalizada);
          }

          // Adiciona a pergunta à categoria personalizada
          const perguntasPersonalizadasContainer = categoriaPersonalizada.querySelector('.perguntas-personalizadas-container');
          if (perguntasPersonalizadasContainer) {
            const novaPergunta = document.createElement('div');
            novaPergunta.className = 'testemunha-pergunta mb-3';
            novaPergunta.innerHTML = `
              <div class="input-group mb-2">
                <span class="input-group-text">P</span>
                <input type="text" class="form-control testemunha-pergunta-texto" value="${perguntaTexto}">
                <button class="btn btn-outline-danger btn-remover-pergunta" type="button">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <div class="input-group">
                <span class="input-group-text">R</span>
                <input type="text" class="form-control testemunha-resposta-texto" placeholder="Resposta">
              </div>
            `;
            perguntasPersonalizadasContainer.appendChild(novaPergunta);

            // Adicionar evento ao botão de remover pergunta
            const btnRemoverPergunta = novaPergunta.querySelector('.btn-remover-pergunta');
            if (btnRemoverPergunta) {
              btnRemoverPergunta.addEventListener('click', () => {
                novaPergunta.remove();
                // Se não houver mais perguntas personalizadas, remove a categoria
                if (perguntasPersonalizadasContainer.children.length === 0) {
                  categoriaPersonalizada.remove();
                }
              });
            }

            // Exibe a categoria personalizada
            const collapsePersonalizado = document.getElementById(`categoriaPersonalizada${id}`);
            if (collapsePersonalizado) {
              const bsCollapse = new bootstrap.Collapse(collapsePersonalizado, { toggle: false });
              bsCollapse.show();
            }
          }
        });
      }
    }

    // Função para inicializar eventos da testemunha
    function initTestemunhaEvents(testemunhaElement, id) {
      if (!testemunhaElement) return;

      // Atualiza nome no cabeçalho quando campo de nome mudar
      const nomeInput = testemunhaElement.querySelector('.testemunha-nome-input');
      const nomeDisplay = testemunhaElement.querySelector('.testemunha-nome');

      if (nomeInput && nomeDisplay) {
        nomeInput.addEventListener('input', () => {
          nomeDisplay.textContent = nomeInput.value || 'Nome da Testemunha';
        });
      }

      // Botão de remover testemunha
      const btnRemover = testemunhaElement.querySelector('.btn-remover-testemunha');
      if (btnRemover) {
        btnRemover.addEventListener('click', () => {
          if (confirm('Tem certeza que deseja remover esta testemunha?')) {
            testemunhaElement.remove();

            // Mostra alerta se não houver mais testemunhas
            if (testemunhasContainer.children.length === 0 && semTestemunhasAlert) {
              semTestemunhasAlert.style.display = 'block';
            }
          }
        });
      }

      // Botão de editar testemunha
      const btnEditar = testemunhaElement.querySelector('.btn-editar-testemunha');
      if (btnEditar) {
        btnEditar.addEventListener('click', () => {
          const detalhesContainer = testemunhaElement.querySelector('.testemunha-detalhes');
          if (detalhesContainer) {
            detalhesContainer.classList.toggle('d-none');
          }
        });
      }
    }

    // Carregar dados salvos
    const data = this.storage.get('interviews');
    if (data) {
      // Preencher dados do autor
      if (historiaAutor && data.historia) {
        historiaAutor.value = data.historia;
      }

      // Preencher perguntas do autor
      if (data.perguntasAutor) {
        Object.entries(data.perguntasAutor).forEach(([id, resposta]) => {
          const input = document.getElementById(id);
          if (input) {
            input.value = resposta;
          }
        });
      }

      // Preencher testemunhas
      if (data.testemunhas && Array.isArray(data.testemunhas) && data.testemunhas.length > 0) {
        // Oculta alerta de "sem testemunhas"
        if (semTestemunhasAlert) {
          semTestemunhasAlert.style.display = 'none';
        }

        // Adiciona cada testemunha salva
        data.testemunhas.forEach(testemunha => {
          testemunhaCounter++;

          // Cria nova testemunha a partir do template
          const templateContent = testemunhaTemplate.innerHTML
            .replace(/{ID}/g, testemunhaCounter);

          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = templateContent;
          const newTestemunha = tempDiv.firstElementChild;

          testemunhasContainer.appendChild(newTestemunha);

          // Preenche dados da testemunha
          newTestemunha.querySelector('.testemunha-nome-input').value = testemunha.nome || '';
          newTestemunha.querySelector('.testemunha-nome').textContent = testemunha.nome || 'Nome da Testemunha';
          newTestemunha.querySelector('.testemunha-relacao').value = testemunha.relacao || '';
          newTestemunha.querySelector('.testemunha-depoimento').value = testemunha.depoimento || '';

          // Inicializa eventos
          initTestemunhaEvents(newTestemunha, testemunhaCounter);

          // Adiciona perguntas e respostas
          if (testemunha.perguntas && Array.isArray(testemunha.perguntas)) {
            const perguntasContainer = newTestemunha.querySelector('.testemunha-perguntas-container');

            // Remove pergunta inicial
            perguntasContainer.innerHTML = '';

            // Adiciona perguntas salvas
            testemunha.perguntas.forEach(pergunta => {
              const novaPergunta = document.createElement('div');
              novaPergunta.className = 'testemunha-pergunta mb-3';
              novaPergunta.innerHTML = `
                <div class="input-group mb-2">
                  <span class="input-group-text">P</span>
                  <input type="text" class="form-control testemunha-pergunta-texto" placeholder="Pergunta" value="${pergunta.pergunta || ''}">
                  <button class="btn btn-outline-danger btn-remover-pergunta" type="button">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
                <div class="input-group">
                  <span class="input-group-text">R</span>
                  <input type="text" class="form-control testemunha-resposta-texto" placeholder="Resposta" value="${pergunta.resposta || ''}">
                </div>
              `;
              perguntasContainer.appendChild(novaPergunta);

              // Adicionar evento ao botão de remover pergunta
              const btnRemoverPergunta = novaPergunta.querySelector('.btn-remover-pergunta');
              if (btnRemoverPergunta) {
                btnRemoverPergunta.addEventListener('click', () => {
                  novaPergunta.remove();
                });
              }
            });
          }
        });
      }

      // Preencher observações
      const observacoesEntrevistas = document.getElementById('observacoesEntrevistas');
      if (observacoesEntrevistas && data.observacoes) {
        observacoesEntrevistas.value = data.observacoes;
      }
    }

    // Configurar salvamento
    this.setupInterviewsSaving();
  }

  // Configurar salvamento de entrevistas
  setupInterviewsSaving() {
    // Salvar ao navegar
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        this.saveInterviewsData();
      });
    });
  }

  // Salvar dados de entrevistas
  saveInterviewsData() {
    if (!this.storage.set) return;

    // Dados do autor
    const historia = document.getElementById('historiaAutor')?.value || '';

    // Perguntas do autor
    const perguntasAutor = {};
    document.querySelectorAll('.pergunta-autor').forEach(input => {
      if (input.id) {
        perguntasAutor[input.id] = input.value || '';
      }
    });

    // Testemunhas
    const testemunhas = [];
    document.querySelectorAll('.testemunha-item').forEach(testemunhaEl => {
      const testemunha = {
        nome: testemunhaEl.querySelector('.testemunha-nome-input')?.value || '',
        relacao: testemunhaEl.querySelector('.testemunha-relacao')?.value || '',
        depoimento: testemunhaEl.querySelector('.testemunha-depoimento')?.value || '',
        perguntas: []
      };

      // Perguntas e respostas
      testemunhaEl.querySelectorAll('.testemunha-pergunta').forEach(perguntaEl => {
        testemunha.perguntas.push({
          pergunta: perguntaEl.querySelector('.testemunha-pergunta-texto')?.value || '',
          resposta: perguntaEl.querySelector('.testemunha-resposta-texto')?.value || ''
        });
      });

      testemunhas.push(testemunha);
    });

    // Observações
    const observacoes = document.getElementById('observacoesEntrevistas')?.value || '';

    // Salvar tudo
    this.storage.set('interviews', {
      historia,
      perguntasAutor,
      testemunhas,
      observacoes
    });
  }

  // Inicializa página de relatório
  initReport() {
    console.log('Inicializando página Relatório');
    // Implementação básica
  }

  // Utilitário para preencher formulários
  fillForm(form, data) {
    if (!form || !data) return;

    Object.entries(data).forEach(([key, value]) => {
      const field = form.elements[key];
      if (field && typeof value !== 'object') {
        field.value = value;
      }
    });
  }

  // Utilitário para configurar salvamento automático
  setupFormSaving(form, sectionName) {
    if (!form || !sectionName) return;

    // Salvar ao navegar para fora da página
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        this.saveFormData(form, sectionName);
      });
    });

    // Opcionalmente, salvar automaticamente em mudanças
    /*
    form.addEventListener('change', () => {
      this.saveFormData(form, sectionName);
    });
    */
  }

  // Salvar dados do formulário
  saveFormData(form, sectionName) {
    if (!form || !sectionName || !this.storage.set) return;

    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
      // Lidar com arrays (campos com o mesmo nome)
      if (key.endsWith('[]')) {
        const baseName = key.slice(0, -2);
        if (!data[baseName]) {
          data[baseName] = [];
        }
        data[baseName].push(value);
      } else {
        data[key] = value;
      }
    });

    this.storage.set(sectionName, data);
  }

  // Exportar para PDF
  exportPDF() {
    // Verificar se estamos na página de relatório
    if (window.location.hash.substring(1) !== 'report') {
      window.location.hash = '#report';
      setTimeout(() => this.generatePDF(), 1000);
      return;
    }

    this.generatePDF();
  }

  // Gerar PDF
  generatePDF() {
    const element = document.getElementById('relatorioContent');
    if (!element) return;

    const opt = {
      margin: 10,
      filename: `SIU_Relatorio_${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  }
}
