import ContextPadCleanup from "./ContextPadCleanup.js";
import OdooPaletteProvider from "./OdooPaletteProvider.js";

export default {
  __init__: [
    "odooPaletteProvider",
    "contextPadCleanup",
  ],
  odooPaletteProvider: ["type", OdooPaletteProvider],
  contextPadCleanup: ["type", ContextPadCleanup],
};
