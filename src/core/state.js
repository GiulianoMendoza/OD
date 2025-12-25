const LS_KEY = "rutina_2026_v3";

export const loadState = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
};

export const saveState = (state) => {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
};

export const clearState = () => localStorage.removeItem(LS_KEY);

export const stateKey = (weekKey, exerciseId) => `${weekKey}::${exerciseId}`;
