import { Platform } from 'react-native';

// Correções específicas para navegação na web
if (Platform.OS === 'web' && typeof window !== 'undefined' && window.addEventListener) {
  try {
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
    if (document && document.addEventListener) {
      document.addEventListener('touchstart', function() {}, { passive: true });
    }
  } catch (error) {
    console.warn('Web navigation fix error:', error);
  }
}

// Componente dummy para satisfazer o requisito de export default
const WebNavigationFix = () => null;

export default WebNavigationFix;