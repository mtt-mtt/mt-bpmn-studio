const CONTEXT_PAD_PRIORITY = 500;

export default function ContextPadCleanup(contextPad) {
  contextPad.registerProvider(CONTEXT_PAD_PRIORITY, this);
}

ContextPadCleanup.$inject = ["contextPad"];

ContextPadCleanup.prototype.getContextPadEntries = function() {
  return (entries) => {
    delete entries.replace;
    return entries;
  };
};

ContextPadCleanup.prototype.getMultiElementContextPadEntries = function() {
  return (entries) => {
    delete entries.replace;
    return entries;
  };
};
