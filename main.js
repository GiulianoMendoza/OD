import { routine, YEAR } from "./src/data/routine.js";
import { weeksForYear } from "./src/core/dates.js";
import { clearState, loadState, saveState } from "./src/core/state.js";
import { injectStyles } from "./src/ui/styles.js";
import { renderApp } from "./src/ui/app.js";

injectStyles();

const root = document.getElementById("app");
const weeks = weeksForYear(YEAR);

renderApp({
  root,
  routine,
  weeks,
  loadState,
  saveState,
  clearState,
});
