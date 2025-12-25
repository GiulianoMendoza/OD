import { toISODate } from "../core/dates.js";
import { stateKey } from "../core/state.js";
import { clear, el } from "./dom.js";

const weekLabel = (week) =>
  `Semana ${String(week.weekNum).padStart(2, "0")} - ${toISODate(week.start)} al ${toISODate(week.end)}`;

export const renderApp = ({ root, routine, weeks, loadState, saveState, clearState }) => {
  let state = loadState();
  let currentWeek = weeks[0];

  const weekView = el("div");

  const {
    container,
    weekSelect,
    btnPrev,
    btnNext,
    btnExport,
    btnImport,
    fileImport,
    btnReset,
  } = buildShell({
    weeks,
    weekView,
    onWeekChange: (key) => setWeek(key),
  });

  root.appendChild(container);

  const setWeek = (key) => {
    const wk = weeks.find((w) => w.key === key) || weeks[0];
    currentWeek = wk;
    weekSelect.value = wk.key;
    renderWeek();
  };

  const stepWeek = (delta) => {
    const idx = weeks.findIndex((w) => w.key === currentWeek.key);
    const nextIdx = Math.max(0, Math.min(weeks.length - 1, idx + delta));
    setWeek(weeks[nextIdx].key);
  };

  btnPrev.addEventListener("click", () => stepWeek(-1));
  btnNext.addEventListener("click", () => stepWeek(1));

  btnExport.addEventListener("click", () => exportJSON(state));
  btnImport.addEventListener("click", () => fileImport.click());
  fileImport.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (typeof parsed !== "object" || parsed === null) throw new Error("JSON invalido");
      state = parsed;
      saveState(state);
      renderWeek();
    } catch (err) {
      alert("No se pudo importar: " + (err?.message || err));
    } finally {
      e.target.value = "";
    }
  });

  btnReset.addEventListener("click", () => {
    const confirmed = confirm("Esto borra todos los pesos/notas guardados. Seguro?");
    if (!confirmed) return;
    clearState();
    state = {};
    renderWeek();
  });

  const handleFieldChange = (weekKey, exerciseId, field, rawValue) => {
    const key = stateKey(weekKey, exerciseId);
    const next = { ...state };
    const entry = { ...(next[key] || {}) };
    if (field === "weight") {
      const numeric = rawValue === "" ? "" : Number(rawValue);
      entry.weight = rawValue === "" || Number.isNaN(numeric) ? "" : numeric;
    } else {
      entry.notes = rawValue;
    }
    next[key] = entry;
    state = next;
    saveState(state);
  };

  const renderWeek = () => {
    clear(weekView);
    const frag = document.createDocumentFragment();

    frag.appendChild(
      el("div", { className: "d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2" }, [
        el("div", { className: "h5 mb-0" }, [
          el("span", { className: "ms-2", text: `${toISODate(currentWeek.start)} al ${toISODate(currentWeek.end)}` }),
        ]),
      ])
    );

    routine.forEach((block) => {
      frag.appendChild(buildBlock(block, currentWeek, { state, onChange: handleFieldChange }));
    });

    weekView.appendChild(frag);
  };

  renderWeek();
};

const buildShell = ({ weeks, weekView, onWeekChange }) => {
  const weekCount = el("span", {
    className: "badge text-bg-secondary",
    text: `${weeks.length} semanas`,
  });

  const weekSelect = el(
    "select",
    { className: "form-select mb-3", ariaLabel: "Seleccionar semana" },
    weeks.map((w) => el("option", { value: w.key, text: weekLabel(w) }))
  );
  weekSelect.value = weeks[0].key;
  weekSelect.addEventListener("change", () => onWeekChange(weekSelect.value));

  const btnPrev = el("button", { className: "btn btn-outline-dark btn-sm", type: "button", text: "Semana anterior" });
  const btnNext = el("button", { className: "btn btn-outline-dark btn-sm", type: "button", text: "Semana siguiente" });

  const btnExport = el("button", { className: "btn btn-outline-primary btn-sm", type: "button", text: "Exportar JSON" });
  const btnImport = el("button", { className: "btn btn-outline-secondary btn-sm", type: "button", text: "Importar JSON" });
  const fileImport = el("input", { type: "file", accept: "application/json", className: "d-none" });
  const btnReset = el("button", { className: "btn btn-outline-danger btn-sm", type: "button", text: "Borrar todo" });

  const leftCol = el("div", { className: "card sticky-col shadow-sm" }, [
    el("div", { className: "card-body" }, [
      el("div", { className: "d-flex align-items-center justify-content-between mb-2" }, [
        el("div", { className: "fw-semibold", text: "Semana" }),
        weekCount,
      ]),
      weekSelect,
      el("div", { className: "d-grid gap-2" }, [btnPrev, btnNext]),
    ]),
  ]);

  const toolbar = el("div", { className: "d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3" }, [
    el("div", { className: "d-flex gap-2" }, [btnExport, btnImport, fileImport, btnReset]),
  ]);

  const container = el("div", { className: "container py-4" }, [
    toolbar,
    el("div", { className: "row g-3" }, [
      el("div", { className: "col-lg-4" }, [leftCol]),
      el("div", { className: "col-lg-8" }, [weekView]),
    ]),
  ]);

  return { container, weekSelect, btnPrev, btnNext, btnExport, btnImport, fileImport, btnReset };
};

const exportJSON = (state) => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rutina_2026_backup.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const buildBlock = (block, week, { state, onChange }) => {
  const mobileCards = el(
    "div",
    { className: "d-block d-lg-none" },
    block.exercises.map((ex) => buildExerciseCard(ex, week, state, onChange))
  );

  const desktopTable = el("div", { className: "d-none d-lg-block" }, [buildDesktopTable(block.exercises, week, state, onChange)]);

  return el("div", { className: "card shadow-sm mb-3" }, [
    el("div", { className: "card-header d-flex flex-wrap align-items-center justify-content-between gap-2" }, [
      el("div", { className: "fw-semibold", text: block.title }),
      block.rest ? el("span", { className: "badge text-bg-light border", text: block.rest }) : null,
    ]),
    el("div", { className: "card-body" }, [mobileCards, desktopTable]),
  ]);
};

const buildExerciseCard = (exercise, week, state, onChange) => {
  const entry = state[stateKey(week.key, exercise.id)] || {};

  const weightInput = el("input", {
    type: "number",
    step: "0.5",
    min: "0",
    className: "form-control",
    placeholder: "kg",
    value: entry.weight ?? "",
  });

  const notesInput = el("input", {
    type: "text",
    className: "form-control form-control-sm",
    placeholder: "Notas (RPE, reps reales, etc.)",
    value: entry.notes ?? "",
  });

  weightInput.addEventListener("input", () => onChange(week.key, exercise.id, "weight", weightInput.value));
  notesInput.addEventListener("input", () => onChange(week.key, exercise.id, "notes", notesInput.value));

  return el("div", { className: "card mb-2" }, [
    el("div", { className: "card-body py-3" }, [
      el("div", { className: "d-flex justify-content-between gap-2" }, [
        el("div", {}, [
          el("div", { className: "fw-semibold", text: exercise.name }),
          el("div", { className: "small-muted", text: exercise.sets }),
        ]),
        el("div", { className: "text-end" }, [
          el("div", { className: "small-muted mb-1", text: "Peso" }),
          el("div", { className: "input-group input-group-sm" }, [
            weightInput,
            el("span", { className: "input-group-text", text: "kg" }),
          ]),
        ]),
      ]),
      el("div", { className: "mt-2" }, [notesInput]),
    ]),
  ]);
};

const buildDesktopTable = (exercises, week, state, onChange) => {
  const rows = exercises.map((ex) => {
    const entry = state[stateKey(week.key, ex.id)] || {};

    const weightInput = el("input", {
      type: "number",
      step: "0.5",
      min: "0",
      className: "form-control",
      placeholder: "kg",
      value: entry.weight ?? "",
    });
    const notesInput = el("input", {
      type: "text",
      className: "form-control form-control-sm",
      placeholder: "Notas",
      value: entry.notes ?? "",
    });

    weightInput.addEventListener("input", () => onChange(week.key, ex.id, "weight", weightInput.value));
    notesInput.addEventListener("input", () => onChange(week.key, ex.id, "notes", notesInput.value));

    return el("tr", {}, [
      el("td", { className: "align-middle" }, [
        el("div", { className: "fw-semibold", text: ex.name }),
        el("div", { className: "small-muted", text: ex.sets }),
      ]),
      el("td", { className: "align-middle" }, [
        el("div", { className: "input-group input-group-sm" }, [
          weightInput,
          el("span", { className: "input-group-text", text: "kg" }),
        ]),
      ]),
      el("td", { className: "align-middle" }, [notesInput]),
    ]);
  });

  return el("div", { className: "table-responsive" }, [
    el("table", { className: "table table-sm align-middle" }, [
      el("thead", {}, [
        el("tr", {}, [
          el("th", { style: "min-width: 260px;", text: "Ejercicio" }),
          el("th", { style: "min-width: 150px;", text: "Peso inicial (semana)" }),
          el("th", { style: "min-width: 220px;", text: "Notas" }),
        ]),
      ]),
      el("tbody", {}, rows),
    ]),
  ]);
};
