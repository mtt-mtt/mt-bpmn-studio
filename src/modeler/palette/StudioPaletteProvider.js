import { paletteGroups } from "./paletteEntries.js";

const PALETTE_PRIORITY = 500;

function titleEntry(group, translate) {
  const title = translate(group.title);

  return {
    group: group.id,
    html: `<div class="studio-palette-title">${title}</div>`,
  };
}

function createEntry(entry, groupId, create, elementFactory, translate) {
  const { id, type, icon, label, options } = entry;
  const translatedLabel = translate(label);

  function createListener(event) {
    if (type === "bpmn:Participant") {
      create.start(event, elementFactory.createParticipantShape(options));
      return;
    }

    const shape = elementFactory.createShape({
      type,
      ...options,
    });

    create.start(event, shape);
  }

  return {
    group: groupId,
    title: translatedLabel,
    html: `
      <div class="entry studio-palette-entry" draggable="true">
        <span class="studio-palette-glyph ${icon}"></span>
        <span class="studio-palette-label">${translatedLabel}</span>
      </div>
    `,
    action: {
      dragstart: createListener,
      click: createListener,
    },
  };
}

export default function StudioPaletteProvider(palette, create, elementFactory, translate) {
  this._create = create;
  this._elementFactory = elementFactory;
  this._translate = translate;

  palette.registerProvider(PALETTE_PRIORITY, this);
}

StudioPaletteProvider.$inject = [
  "palette",
  "create",
  "elementFactory",
  "translate",
];

StudioPaletteProvider.prototype.getPaletteEntries = function() {
  const create = this._create;
  const elementFactory = this._elementFactory;
  const translate = this._translate;

  return () => paletteGroups.reduce((entries, group) => {
    entries[`title.${group.id}`] = titleEntry(group, translate);

    group.entries.forEach((entry) => {
      entries[entry.id] = createEntry(entry, group.id, create, elementFactory, translate);
    });

    return entries;
  }, {});
};
