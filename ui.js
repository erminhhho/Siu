/**
 * SIU - Interface do Usuário
 * Versão simplificada para resolver problemas de sintaxe
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

  // Método para inicializar o comportamento de selects com opção "outro"
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
              <select class="form-select" id="beneficio${newIndex}" name="beneficios[]">
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
              </select>
              <label for="beneficio${newIndex}">Benefício Pleiteado</label>
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger ms-2 align-self-center remove-btn" title="Remover">
              <i class="bi bi-trash"></i>
            </button>
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
              <select class="form-select" id="motivo${newIndex}" name="motivos[]">
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
              </select>
              <label for="motivo${newIndex}">Motivo de Indeferimento</label>
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger ms-2 align-self-center remove-btn" title="Remover">
              <i class="bi bi-trash"></i>
            </button>
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
                <div class="form-floating">
                  <input type="text" class="form-control cid-input" id="cid${newIndex}" placeholder="CID" name="cids[]" data-index="${newIndex}">
                  <label for="cid${newIndex}">CID</label>
                </div>
              </div>
              <div class="col-md-9">
                <div class="form-floating">
                  <input type="text" class="form-control doenca-input" id="doenca${newIndex}" placeholder="Doença" name="doencas[]" data-index="${newIndex}">
                  <label for="doenca${newIndex}">Doença/Condição</label>
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
      });
    }

    // Carregar dados salvos
    const data = this.storage.get('incapacity');
    if (data) {
      // Implementar preenchimento dos campos com dados salvos
    }

    // Configurar salvamento de formulário
    const form = document.querySelector('form');
    if (form) {
      this.setupFormSaving(form, 'incapacity');
    }
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

    // Função de pesquisa em tempo real (simplificada)
    const realizarPesquisa = () => {
      if (!searchBox || !searchResults || !window.SiuSearch) return;

      const term = searchBox.value.toLowerCase().trim();

      // Se o termo de pesquisa for muito curto, esconde resultados
      if (term.length < 2) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        infoProvas.style.display = 'block';
        return;
      }

      // Pesquisar usando função auxiliar
      const results = window.SiuSearch.pesquisar(term, provasDB, 'nome', 'descricao');

      // Exibir resultados usando função auxiliar
      window.SiuSearch.exibirResultados(results, term, searchResults, 'prova', adicionarProva);

      // Exibe os resultados
      searchResults.style.display = 'block';
      infoProvas.style.display = 'none';
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
    const argumentosDB = [
      { categoria: 'Qualidade de Segurado', texto: "Falta de qualidade de segurado na data do início da incapacidade", descricao: "O autor não mantinha vínculo com a previdência na DII" },
      { categoria: 'Qualidade de Segurado', texto: "Perda da qualidade de segurado", descricao: "O autor ultrapassou o período de graça previsto em lei" },
      { categoria: 'Qualidade de Segurado', texto: "Falta de comprovação dos recolhimentos previdenciários", descricao: "Ausência de pagamentos ao INSS" },

      { categoria: 'Carência', texto: "Não cumprimento da carência mínima exigida", descricao: "Faltam contribuições para atingir o mínimo necessário" },
      { categoria: 'Carência', texto: "Carência não cumprida para o benefício pleiteado", descricao: "Contribuições insuficientes para o benefício solicitado" },

      { categoria: 'Incapacidade', texto: "Incapacidade não constatada pela perícia médica", descricao: "Perícia não identificou limitações funcionais" },
      { categoria: 'Incapacidade', texto: "Incapacidade parcial, possibilitando reabilitação profissional", descricao: "Autor pode exercer outras atividades compatíveis" },
      { categoria: 'Incapacidade', texto: "Doença preexistente ao ingresso no RGPS", descricao: "Patologia já existia antes da filiação ao INSS" },
      { categoria: 'Incapacidade', texto: "Recuperação da capacidade laborativa", descricao: "Autor já recuperou sua capacidade para o trabalho" },

      { categoria: 'Rural', texto: "Ausência de início de prova material", descricao: "Faltam documentos que comprovem atividade rural" },
      { categoria: 'Rural', texto: "Descontinuidade da atividade rural", descricao: "Interrupção da atividade no período mínimo exigido" },
      { categoria: 'Rural', texto: "Prova exclusivamente testemunhal", descricao: "Lei exige prova material para comprovação de atividade rural" },

      { categoria: 'BPC/LOAS', texto: "Renda familiar per capita superior a 1/4 do salário mínimo", descricao: "Renda familiar acima do limite legal" },
      { categoria: 'BPC/LOAS', texto: "Ausência de deficiência de longo prazo", descricao: "Não caracterização de impedimento de longo prazo" },

      { categoria: 'Aposentadoria', texto: "Não atingimento da idade mínima", descricao: "Autor não atingiu a idade exigida para o benefício" },
      { categoria: 'Aposentadoria', texto: "Tempo de contribuição insuficiente", descricao: "Não atinge o tempo mínimo de contribuição necessário" },

      { categoria: 'Pensão', texto: "Ausência de dependência econômica", descricao: "Não foi comprovada a dependência em relação ao falecido" },
      { categoria: 'Pensão', texto: "Não comprovação de união estável/casamento", descricao: "Ausência de provas do vínculo conjugal ou união estável" }
    ];

    // Banco de dados de teses defensivas pesquisáveis
    const tesesDB = [
      { categoria: 'Qualidade de Segurado', texto: "Perda da qualidade de segurado por ausência de contribuições", descricao: "Art. 15 da Lei 8.213/91 - Período de graça expirado" },
      { categoria: 'Qualidade de Segurado', texto: "Ausência de vínculo formal com a Previdência Social", descricao: "Não há registro de inscrição ou contribuição ao RGPS" },
      { categoria: 'Qualidade de Segurado', texto: "Impossibilidade de recebimento de benefício sem qualidade de segurado", descricao: "Princípio contributivo da Previdência Social" },

      { categoria: 'Carência', texto: "Não cumprimento da carência de 12 meses para auxílio-doença", descricao: "Art. 25, I da Lei 8.213/91" },
      { categoria: 'Carência', texto: "Não cumprimento da carência de 180 contribuições para aposentadoria", descricao: "Art. 25, II da Lei 8.213/91" },
      { categoria: 'Carência', texto: "Inaplicabilidade das exceções de carência previstas no art. 26", descricao: "Doença não constante na lista PRT Interministerial MPAS/MS 2.998/01" },

      { categoria: 'Incapacidade', texto: "Ausência de incapacidade constatada em perícia médica oficial", descricao: "Laudo pericial conclusivo pela capacidade laborativa" },
      { categoria: 'Incapacidade', texto: "Doença preexistente à filiação ao RGPS", descricao: "Art. 59, parágrafo único da Lei 8.213/91" },
      { categoria: 'Incapacidade', texto: "Incapacidade apenas parcial e temporária", descricao: "Possibilidade de reabilitação em outra atividade" },
      { categoria: 'Incapacidade', texto: "Inexistência de nexo causal entre doença e atividade laboral", descricao: "Ausência de caráter ocupacional da patologia" },

      { categoria: 'Rural', texto: "Ausência de comprovação de atividade rural pelo período de carência", descricao: "Art. 48, §2º da Lei 8.213/91" },
      { categoria: 'Rural', texto: "Insuficiência probatória do labor rurícola", descricao: "Falta de início de prova material contemporânea" },
      { categoria: 'Rural', texto: "Descaracterização da qualidade de segurado especial", descricao: "Exercício de atividade urbana pelo requerente ou cônjuge" },

      { categoria: 'BPC/LOAS', texto: "Renda familiar per capita superior ao limite legal", descricao: "Art. 20, §3º da Lei 8.742/93" },
      { categoria: 'BPC/LOAS', texto: "Ausência de impedimento de longo prazo", descricao: "Não enquadramento no conceito de pessoa com deficiência" },
      { categoria: 'BPC/LOAS', texto: "Composição familiar não comprovada", descricao: "Inclusão incorreta ou exclusão indevida de membros do grupo familiar" },

      { categoria: 'Aposentadoria', texto: "Não implemento simultâneo dos requisitos idade e tempo de contribuição", descricao: "Art. 201, §7º da CF/88" },
      { categoria: 'Aposentadoria', texto: "Inviabilidade de cômputo de tempo especial sem comprovação", descricao: "Ausência dos PPP e LTCAT exigidos pela legislação" },
      { categoria: 'Aposentadoria', texto: "Improcedência do reconhecimento de atividade especial após Lei 9.032/95", descricao: "Ausência de comprovação da efetiva exposição aos agentes nocivos" },

      { categoria: 'Revisão', texto: "Decadência do direito de revisão de ato concessório", descricao: "Art. 103 da Lei 8.213/91 - Prazo de 10 anos" },
      { categoria: 'Revisão', texto: "Prescrição das parcelas vencidas há mais de 5 anos", descricao: "Art. 103, parágrafo único da Lei 8.213/91" },

      { categoria: 'Pensão', texto: "Ausência de comprovação de dependência econômica", descricao: "Art. 16, §4º da Lei 8.213/91 - Dependência não presumida" },
      { categoria: 'Pensão', texto: "Perda da qualidade de dependente", descricao: "Emancipação ou atingimento da idade limite" },
      { categoria: 'Pensão', texto: "Inexistência de união estável/casamento na data do óbito", descricao: "Art. 1.723 do CC - Falta de configuração da união estável" }
    ];

    // Elementos do DOM
    const searchBox = document.getElementById('searchArgumento');
    const searchResults = document.getElementById('searchArgumentos');
    const argumentosContestacao = document.getElementById('argumentosContestacao');
    const btnAddNovoArgumento = document.getElementById('btnAddNovoArgumento');

    const searchTese = document.getElementById('searchTese');
    const searchResultsTese = document.getElementById('searchTeses');
    const btnAddNovaTese = document.getElementById('btnAddNovaTese');

    // Função para adicionar argumento
    const adicionarArgumento = (textoArgumento) => {
      if (!argumentosContestacao || !textoArgumento.trim()) return;

      const newIndex = argumentosContestacao.children.length + 1;
      const newItem = document.createElement('li');
      newItem.className = 'list-group-item bg-transparent px-0';
      newItem.innerHTML = `
        <div class="d-flex align-items-center">
          <div class="form-floating flex-grow-1">
            <input type="text" class="form-control" id="argumento${newIndex}" placeholder="Argumento" name="argumento[]" value="${textoArgumento}">
            <label for="argumento${newIndex}">Argumento</label>
          </div>
          <button type="button" class="btn btn-sm btn-outline-danger ms-2 align-self-center remove-btn" title="Remover">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      argumentosContestacao.appendChild(newItem);

      // Adicionar evento ao botão de remover
      newItem.querySelector('.remove-btn').addEventListener('click', () => {
        newItem.remove();
      });

      // Limpar campo de pesquisa e resultados
      if (searchBox) {
        searchBox.value = '';
        if (searchResults) {
          searchResults.innerHTML = '';
          searchResults.style.display = 'none';
        }
      }
    };

    // Função para adicionar tese
    const adicionarTese = (textoTese) => {
      if (!textoTese.trim()) return;

      const tesesDefensivas = document.getElementById('tesesDefensivas');
      if (tesesDefensivas) {
        const valorAtual = tesesDefensivas.value.trim();
        tesesDefensivas.value = valorAtual
          ? valorAtual + '\n\n• ' + textoTese
          : '• ' + textoTese;
      }

      // Limpar campo de pesquisa e resultados
      if (searchTese) {
        searchTese.value = '';
        if (searchResultsTese) {
          searchResultsTese.innerHTML = '';
          searchResultsTese.style.display = 'none';
        }
      }
    };

    // Função de pesquisa para argumentos (simplificada)
    const pesquisarArgumentos = () => {
      if (!searchBox || !searchResults || !window.SiuSearch) return;

      const term = searchBox.value.toLowerCase().trim();

      // Se o termo de pesquisa for muito curto, esconde resultados
      if (term.length < 2) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
      }

      // Pesquisar usando função auxiliar
      const results = window.SiuSearch.pesquisar(term, argumentosDB, 'texto', 'descricao');

      // Exibir resultados usando função auxiliar
      window.SiuSearch.exibirResultados(results, term, searchResults, 'argumento', adicionarArgumento);

      // Exibe a lista
      searchResults.style.display = 'block';
    };

    // Função de pesquisa para teses (simplificada)
    const pesquisarTeses = () => {
      if (!searchTese || !searchResultsTese || !window.SiuSearch) return;

      const term = searchTese.value.toLowerCase().trim();

      // Se o termo de pesquisa for muito curto, esconde resultados
      if (term.length < 2) {
        searchResultsTese.innerHTML = '';
        searchResultsTese.style.display = 'none';
        return;
      }

      // Pesquisar usando função auxiliar
      const results = window.SiuSearch.pesquisar(term, tesesDB, 'texto', 'descricao');

      // Exibir resultados usando função auxiliar
      window.SiuSearch.exibirResultados(results, term, searchResultsTese, 'tese', adicionarTese);

      // Exibe a lista
      searchResultsTese.style.display = 'block';
    };

    // Inicializa eventos para argumentos
    if (searchBox) {
      // Pesquisa em tempo real
      searchBox.addEventListener('input', pesquisarArgumentos);

      // Ao pressionar Enter, adiciona o texto atual
      searchBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          adicionarArgumento(searchBox.value);
        }
      });

      // Clique fora fecha os resultados
      document.addEventListener('click', (e) => {
        if (searchResults && !searchBox.contains(e.target) && !searchResults.contains(e.target)) {
          searchResults.style.display = 'none';
        }
      });
    }

    // Botão para adicionar novo argumento
    if (btnAddNovoArgumento) {
      btnAddNovoArgumento.addEventListener('click', () => {
        if (searchBox) {
          adicionarArgumento(searchBox.value);
        }
      });
    }

    // Inicializa eventos para teses
    if (searchTese) {
      // Pesquisa em tempo real
      searchTese.addEventListener('input', pesquisarTeses);

      // Ao pressionar Enter, adiciona o texto atual
      searchTese.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          adicionarTese(searchTese.value);
        }
      });

      // Clique fora fecha os resultados
      document.addEventListener('click', (e) => {
        if (searchResultsTese && !searchTese.contains(e.target) && !searchResultsTese.contains(e.target)) {
          searchResultsTese.style.display = 'none';
        }
      });
    }

    // Botão para adicionar nova tese
    if (btnAddNovaTese) {
      btnAddNovaTese.addEventListener('click', () => {
        if (searchTese) {
          adicionarTese(searchTese.value);
        }
      });
    }

    // Carregar dados salvos
    const data = this.storage.get('defense');
    if (data) {
      // Carregar argumentos salvos
      if (data.argumentos && Array.isArray(data.argumentos)) {
        data.argumentos.forEach(arg => {
          adicionarArgumento(arg);
        });
      }

      // Carregar teses defensivas
      document.getElementById('tesesDefensivas')?.value = data.tesesDefensivas || '';

      // Carregar contra-argumentação
      document.getElementById('contraArgumentacao')?.value = data.contraArgumentacao || '';

      // Carregar observações
      document.getElementById('observacoesContestacao')?.value = data.observacoes || '';
    }

    // Configurar salvamento
    this.setupDefenseSaving();
  }

  // Método genérico para mostrar resultados de pesquisa
  mostrarResultados(results, term, container, tipo, adicionarCallback) {
    // Se não há resultados, mostra opção para adicionar novo
    if (results.length === 0) {
      container.innerHTML = `
        <a href="#" class="list-group-item list-group-item-action" data-value="${term}">
          <div class="d-flex align-items-center">
            <i class="bi bi-plus-circle-fill text-primary me-2"></i>
            <span>Adicionar "<strong>${term}</strong>" como novo ${tipo}</span>
          </div>
        </a>
      `;
    } else {
      // Mostra os resultados encontrados
      let html = results.map(item => {
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
        <a href="#" class="list-group-item list-group-item-action" data-value="${term}">
          <div class="d-flex align-items-center">
            <i class="bi bi-plus-circle-fill text-primary me-2"></i>
            <span>Adicionar "<strong>${term}</strong>" como novo ${tipo}</span>
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
        adicionarCallback(valor);
      });
    });
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

    const argumentosElements = document.querySelectorAll('input[name="argumento[]"]');
    const tesesDefensivas = document.getElementById('tesesDefensivas')?.value || '';
    const contraArgumentacao = document.getElementById('contraArgumentacao')?.value || '';
    const observacoes = document.getElementById('observacoesContestacao')?.value || '';

    const argumentos = [];
    argumentosElements.forEach(el => {
      if (el.value.trim()) {
        argumentos.push(el.value.trim());
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
  }

  // Inicializa página de relatório
  initReport() {
    console.log('Inicializando página Relatório');
  }

  // Utilitário para preencher formulários
  fillForm(form, data) {
    if (!form || !data) return;

    Object.entries(data).forEach(([key, value]) => {
      const field = form.elements[key];
      if (field && typeof value !== "object") {
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

// Garantir que a classe SiuUI esteja disponível globalmente
window.SiuUI = SiuUI;
