export function initializeWebNavigation() {
  if (
    typeof window === "undefined" ||
    typeof window.addEventListener !== "function"
  ) {
    return;
  }

  try {
    window.addEventListener("popstate", function (event) {
      if (event.state && event.state.expo) {
        return;
      }
      window.location.reload();
    });

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
