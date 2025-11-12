// Correções específicas para navegação na web
if (typeof window !== 'undefined') {
  // Forçar reload da página quando necessário para navegação
  window.addEventListener('popstate', function(event) {
    if (event.state && event.state.expo) {
      // Permitir navegação normal do Expo Router
      return;
    }
    // Para outras navegações, recarregar a página
    window.location.reload();
  });

  // Melhorar interações de touch em dispositivos móveis via web
  document.addEventListener('touchstart', function() {}, { passive: true });
}