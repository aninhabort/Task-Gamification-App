// Correções específicas para navegação na web
// Este arquivo deve ser importado no _layout.tsx para inicializar as correções

export function initializeWebNavigation() {
  // Apenas executar no ambiente web
  if (
    typeof window === "undefined" ||
    typeof window.addEventListener !== "function"
  ) {
    return;
  }

  try {
    // Forçar reload da página quando necessário para navegação
    window.addEventListener("popstate", function (event) {
      if (event.state && event.state.expo) {
        // Permitir navegação normal do Expo Router
        return;
      }
      // Para outras navegações, recarregar a página
      window.location.reload();
    });

    // Melhorar interações de touch em dispositivos móveis via web
    if (typeof document !== "undefined" && document.addEventListener) {
      document.addEventListener("touchstart", function () {}, {
        passive: true,
      });
    }
  } catch (error) {
    // Falhar silenciosamente se APIs não estão disponíveis
    console.debug("Web navigation initialization skipped:", error);
  }
}
