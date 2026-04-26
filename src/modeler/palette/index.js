import ContextPadCleanup from "./ContextPadCleanup.js";
import StudioPaletteProvider from "./StudioPaletteProvider.js";

export default {
  __init__: [
    "studioPaletteProvider",
    "contextPadCleanup",
  ],
  studioPaletteProvider: ["type", StudioPaletteProvider],
  contextPadCleanup: ["type", ContextPadCleanup],
};
