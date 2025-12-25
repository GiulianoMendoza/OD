export const YEAR = 2026;

export const routine = [
  {
    title: "Lunes - Torso (fuerza)",
    rest: "Descanso: 2-3 min en los dos primeros, resto 90s.",
    exercises: [
      { id: "press_banca_plano", name: "Press banca plano", sets: "4x5" },
      { id: "remo_barra_manc", name: "Remo con barra o mancuerna", sets: "4x6" },
      { id: "press_militar", name: "Press militar", sets: "3x6" },
      { id: "dominadas_jalon", name: "Jalon prono", sets: "3x6-8" },
      { id: "fondos_press_cerrado", name: "Fondos", sets: "3x8" },
      { id: "curl_biceps", name: "Curl biceps", sets: "2x10" },
    ],
  },
  {
    title: "Martes - Pierna (fuerza)",
    rest: "",
    exercises: [
      { id: "sentadilla_barra_hack", name: "Sentadilla (barra o hack)", sets: "4x5" },
      { id: "pm_rumano", name: "Peso muerto rumano", sets: "3x6" },
      { id: "prensa", name: "Prensa", sets: "3x8" },
      { id: "curl_femoral", name: "Curl femoral", sets: "3x10" },
      { id: "gemelos", name: "Gemelos", sets: "4x12" },
      { id: "plancha", name: "Abdominales (plancha)", sets: "3x40s" },
    ],
  },
  {
    title: "Jueves - Torso (hipertrofia)",
    rest: "",
    exercises: [
      { id: "press_inclinado_manc", name: "Press inclinado mancuernas", sets: "3x8-10" },
      { id: "jalon_pecho", name: "Jalon prono", sets: "3x10" },
      { id: "aperturas", name: "Aperturas", sets: "3x12" },
      { id: "remo_bajo", name: "Remo bajo", sets: "3x10-12" },
      { id: "laterales", name: "Elevaciones laterales", sets: "4x12-15" },
      { id: "super_bi_tri", name: "Superserie biceps/triceps", sets: "3x12" },
    ],
  },
  {
    title: "Sabado - Full body corto",
    rest: "",
    exercises: [
      { id: "sentadilla_goblet_frontal", name: "Sentadilla goblet", sets: "3x8" },
      { id: "pm_rumano_ligero", name: "Peso muerto rumano ligero", sets: "2x10" },
      { id: "press_banca_flex_lastr", name: "Press banca", sets: "3x8" },
      { id: "remo", name: "Remo", sets: "3x10" },
      { id: "core", name: "Core (rueda o crunch cable)", sets: "3x12" },
    ],
  },
];
