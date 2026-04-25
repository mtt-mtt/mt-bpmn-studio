export default function NativeCopyPasteFallback(eventBus, nativeCopyPaste) {
  eventBus.on("native-copy-paste:error", ({ message, error }) => {
    nativeCopyPaste.toggle(false);

    console.warn("[bpmnPJ] Native clipboard unavailable, using local BPMN clipboard.", message, error);
  });
}

NativeCopyPasteFallback.$inject = ["eventBus", "nativeCopyPaste"];
