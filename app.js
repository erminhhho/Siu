/**
 * SIU - Sistema de Instrução Unificado
 * Aplicação principal
 */

document.addEventListener('DOMContentLoaded', () => {
  try {
    // Inicializa os componentes principais
    const storage = new SiuStorage();
    const router = new SiuRouter();
    const ui = new SiuUI(storage);

    // Exposição para debug - remover em produção
    window.siu = {
      storage,
      router,
      ui
    };

    console.log('SIU - Sistema de Instrução Unificado inicializado');
  } catch (error) {
    console.error('Erro ao inicializar o SIU:', error);
  }
});
