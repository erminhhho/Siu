/**
 * SIU - Sistema de Armazenamento
 */

class SiuStorage {
  constructor() {
    this.storageKey = 'siuData';
    this.data = {
      author: {},
      process: {},
      evidence: {
        documents: [],
        witnesses: [],
        notes: ''
      },
      defense: {
        arguments: [],
        thesis: '',
        counter: '',
        notes: ''
      },
      interviews: {
        author: {
          history: '',
          relevant: '',
          questions: []
        },
        witnesses: [],
        notes: ''
      },
      report: {
        conclusion: ''
      }
    };

    this.loadData();
  }

  // Carrega dados do localStorage
  loadData() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.data = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }

  // Salva dados no localStorage
  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      return false;
    }
  }

  // Obtém dados de uma seção
  get(section) {
    return this.data[section] || {};
  }

  // Define dados para uma seção
  set(section, data) {
    this.data[section] = data;
    return this.saveData();
  }

  // Atualiza dados parciais de uma seção
  update(section, data) {
    this.data[section] = { ...this.data[section], ...data };
    return this.saveData();
  }

  // Limpa todos os dados
  clear() {
    this.data = {
      author: {},
      process: {},
      evidence: {
        documents: [],
        witnesses: [],
        notes: ''
      },
      defense: {
        arguments: [],
        thesis: '',
        counter: '',
        notes: ''
      },
      interviews: {
        author: {
          history: '',
          relevant: '',
          questions: []
        },
        witnesses: [],
        notes: ''
      },
      report: {
        conclusion: ''
      }
    };
    return this.saveData();
  }

  // Exporta dados como JSON
  export() {
    return JSON.stringify(this.data, null, 2);
  }

  // Importa dados de JSON
  import(jsonData) {
    try {
      this.data = JSON.parse(jsonData);
      return this.saveData();
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }
}
