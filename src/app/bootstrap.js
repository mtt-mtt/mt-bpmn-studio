import { getDomRefs } from "./domRefs.js";
import { appTemplate } from "./template.js";
import { createWorkbench } from "./workbench.js";

export async function bootstrapApp(root) {
  root.innerHTML = appTemplate;

  const refs = getDomRefs(root);
  const workbench = createWorkbench({ root, refs });
  await workbench.start();
}
