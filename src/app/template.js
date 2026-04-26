import { modelerPanelTemplate } from "./templates/modelerPanelTemplate.js";
import { sidebarTemplate } from "./templates/sidebarTemplate.js";
import { trackingPanelTemplate } from "./templates/trackingPanelTemplate.js";
import { workspaceHeaderTemplate } from "./templates/workspaceHeaderTemplate.js";

export const appTemplate = `
  <div class="shell">
    ${sidebarTemplate}

    <main class="workspace">
      ${workspaceHeaderTemplate}
      ${modelerPanelTemplate}
      ${trackingPanelTemplate}
    </main>
  </div>
`;
