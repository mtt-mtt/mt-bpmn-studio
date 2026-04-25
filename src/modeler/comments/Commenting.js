const COMMENT_OVERLAY_TYPE = "experiment-comment";
const DEFAULT_POSITION = { left: 58, top: -34 };
const MAX_PREVIEW_LENGTH = 18;

function getAttrs(element) {
  return element.businessObject?.$attrs || {};
}

function getComment(element) {
  return getAttrs(element)["data-comment"] || "";
}

function getCommentPosition(element) {
  const attrs = getAttrs(element);
  const left = Number(attrs["data-comment-left"]);
  const top = Number(attrs["data-comment-top"]);

  if (Number.isFinite(left) && Number.isFinite(top)) {
    return { left, top };
  }

  return { ...DEFAULT_POSITION };
}

function setCommentData(element, modeling, value, position = getCommentPosition(element)) {
  const businessObject = element.businessObject;
  const attrs = { ...(businessObject.$attrs || {}) };

  if (value) {
    attrs["data-comment"] = value;
    attrs["data-comment-left"] = String(Math.round(position.left));
    attrs["data-comment-top"] = String(Math.round(position.top));
  } else {
    delete attrs["data-comment"];
    delete attrs["data-comment-left"];
    delete attrs["data-comment-top"];
  }

  modeling.updateModdleProperties(element, businessObject, {
    $attrs: attrs,
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function shortText(value) {
  const text = String(value || "").trim();
  return text.length > MAX_PREVIEW_LENGTH ? `${text.slice(0, MAX_PREVIEW_LENGTH)}...` : text;
}

function createCommentDialog(element, currentValue, onSave) {
  const shell = document.createElement("div");
  shell.className = "experiment-comment-dialog-backdrop";
  shell.innerHTML = `
    <section class="experiment-comment-dialog" role="dialog" aria-modal="true">
      <div class="experiment-comment-dialog-head">
        <div>
          <div class="experiment-comment-dialog-kicker">Comment</div>
          <h3>\u5386\u53f2\u8bc4\u8bed</h3>
        </div>
        <button type="button" class="experiment-comment-dialog-close" aria-label="\u5173\u95ed">\u00d7</button>
      </div>
      <textarea class="experiment-comment-dialog-input" rows="5" placeholder="\u8bb0\u5f55\u5386\u53f2\u8bc4\u8bed\u3001\u8bbe\u8ba1\u8bf4\u660e\u6216\u5f85\u786e\u8ba4\u95ee\u9898"></textarea>
      <div class="experiment-comment-dialog-meta">
        <span>${escapeHtml(element.businessObject?.name || element.id)}</span>
        <button type="button" class="experiment-comment-dialog-clear">\u6e05\u7a7a</button>
      </div>
      <div class="experiment-comment-dialog-actions">
        <button type="button" class="experiment-comment-dialog-secondary">\u53d6\u6d88</button>
        <button type="button" class="experiment-comment-dialog-primary">\u4fdd\u5b58\u8bc4\u8bed</button>
      </div>
    </section>
  `;

  const dialog = shell.querySelector(".experiment-comment-dialog");
  const input = shell.querySelector(".experiment-comment-dialog-input");
  const closeButton = shell.querySelector(".experiment-comment-dialog-close");
  const clearButton = shell.querySelector(".experiment-comment-dialog-clear");
  const cancelButton = shell.querySelector(".experiment-comment-dialog-secondary");
  const saveButton = shell.querySelector(".experiment-comment-dialog-primary");

  input.value = currentValue;

  const close = () => shell.remove();
  const save = () => {
    onSave(input.value.trim());
    close();
  };

  closeButton.addEventListener("click", close);
  cancelButton.addEventListener("click", close);
  clearButton.addEventListener("click", () => {
    input.value = "";
    input.focus();
  });
  saveButton.addEventListener("click", save);
  shell.addEventListener("mousedown", (event) => {
    if (!dialog.contains(event.target)) {
      close();
    }
  });
  shell.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close();
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      save();
    }
  });

  document.body.appendChild(shell);
  input.focus();
  input.select();
}

function createCommentOverlay(element, text, onEdit, onMove) {
  const bubble = document.createElement("article");
  bubble.className = "experiment-comment-bubble";
  bubble.title = `${text}\n\u62d6\u52a8\u79fb\u52a8\uff0c\u53cc\u51fb\u7f16\u8f91`;
  bubble.innerHTML = `
    <div class="experiment-comment-bubble-drag" aria-hidden="true"></div>
    <div class="experiment-comment-bubble-content">
      <span class="experiment-comment-bubble-kicker">\u8bc4\u8bed</span>
      <span class="experiment-comment-bubble-text">${escapeHtml(shortText(text))}</span>
    </div>
  `;

  let startEvent = null;
  let startPosition = null;
  let moved = false;

  bubble.addEventListener("mousedown", (event) => {
    event.preventDefault();
    event.stopPropagation();

    startEvent = { x: event.clientX, y: event.clientY };
    startPosition = getCommentPosition(element);
    moved = false;

    const onMouseMove = (moveEvent) => {
      const nextPosition = {
        left: startPosition.left + moveEvent.clientX - startEvent.x,
        top: startPosition.top + moveEvent.clientY - startEvent.y,
      };

      moved = moved || Math.abs(moveEvent.clientX - startEvent.x) > 3 || Math.abs(moveEvent.clientY - startEvent.y) > 3;
      bubble.parentElement.style.left = `${Math.round(nextPosition.left)}px`;
      bubble.parentElement.style.top = `${Math.round(nextPosition.top)}px`;
    };

    const onMouseUp = (upEvent) => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      if (!moved) {
        return;
      }

      onMove({
        left: startPosition.left + upEvent.clientX - startEvent.x,
        top: startPosition.top + upEvent.clientY - startEvent.y,
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  bubble.addEventListener("dblclick", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onEdit();
  });

  return bubble;
}

export default function Commenting(contextPad, eventBus, elementRegistry, modeling, overlays) {
  const refreshComment = (element) => {
    overlays.remove({ element, type: COMMENT_OVERLAY_TYPE });

    const comment = getComment(element);
    if (!comment) {
      return;
    }

    overlays.add(element, COMMENT_OVERLAY_TYPE, {
      position: getCommentPosition(element),
      scale: false,
      html: createCommentOverlay(
        element,
        comment,
        () => openEditor(element),
        (position) => {
          setCommentData(element, modeling, getComment(element), position);
          refreshComment(element);
        },
      ),
    });
  };

  const openEditor = (element) => {
    createCommentDialog(element, getComment(element), (nextValue) => {
      const position = getCommentPosition(element);
      setCommentData(element, modeling, nextValue, position);
      refreshComment(element);
      eventBus.fire("element.changed", { element });
    });
  };

  contextPad.registerProvider(900, {
    getContextPadEntries(element) {
      if (!element.businessObject || element.waypoints || element.labelTarget) {
        return {};
      }

      return {
        "experiment-comment": {
          group: "edit",
          html: '<div class="entry experiment-context-entry">\u8bc4</div>',
          title: "\u6dfb\u52a0/\u7f16\u8f91\u5386\u53f2\u8bc4\u8bed",
          action: {
            click(event) {
              event.preventDefault();
              event.stopPropagation();
              openEditor(element);
            },
          },
        },
      };
    },
  });

  const refreshAllComments = () => {
    overlays.remove({ type: COMMENT_OVERLAY_TYPE });

    elementRegistry.forEach((element) => {
      if (!element.businessObject || element.waypoints || element.labelTarget) {
        return;
      }

      refreshComment(element);
    });
  };

  eventBus.on(["import.done", "commandStack.changed", "element.changed"], 300, () => {
    window.requestAnimationFrame(refreshAllComments);
  });

  this.refreshComment = refreshComment;
  this.refreshAllComments = refreshAllComments;
}

Commenting.$inject = ["contextPad", "eventBus", "elementRegistry", "modeling", "overlays"];
