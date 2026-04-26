export function listen(target, eventName, handler) {
  target.addEventListener(eventName, handler);

  return () => {
    target.removeEventListener(eventName, handler);
  };
}

export function onEmitter(emitter, eventName, handler) {
  emitter.on(eventName, handler);

  return () => {
    emitter.off(eventName, handler);
  };
}

export function disposeAll(disposers) {
  disposers
    .filter(Boolean)
    .slice()
    .reverse()
    .forEach((dispose) => {
      dispose();
    });
}
