import { rand } from "./random";

export const COLOR_OPTIONS = [
  { id: "rosu", label: "ROSU", color: "#ef5350" },
  { id: "albastru", label: "ALBASTRU", color: "#42a5f5" },
  { id: "galben", label: "GALBEN", color: "#fdd835" },
  { id: "verde", label: "VERDE", color: "#66bb6a" },
  { id: "portocaliu", label: "PORTOCALIU", color: "#fb8c00" },
  { id: "roz", label: "ROZ", color: "#f48fb1" },
  { id: "mov", label: "MOV", color: "#ab47bc" },
  { id: "alb", label: "ALB", color: "#ffffff", border: "#cfd8dc" },
];

const ANIMAL_OPTIONS = ["\uD83D\uDC36", "\uD83D\uDC31", "\uD83D\uDC30", "\uD83E\uDD86"];
const SHAPE_OPTIONS = [
  { id: "cerc", label: "cerc", color: "#4fc3f7" },
  { id: "patrat", label: "patrat", color: "#ff8a65" },
  { id: "triunghi", label: "triunghi", color: "#ffd54f" },
  { id: "stea", label: "stea", color: "#ba68c8" },
  { id: "inima", label: "inima", color: "#f06292" },
];

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createColorRound() {
  const target = COLOR_OPTIONS[rand(0, COLOR_OPTIONS.length - 1)];
  const options = shuffle([target, ...shuffle(COLOR_OPTIONS.filter((color) => color.id !== target.id)).slice(0, 2)]);

  return {
    id: `color-${target.id}-${Date.now()}`,
    type: "culoare",
    target,
    options,
    message: `Gaseste culoarea ${target.label}!`,
  };
}

function createAnimalRound(maxCount) {
  const count = rand(1, maxCount);
  const animal = ANIMAL_OPTIONS[rand(0, ANIMAL_OPTIONS.length - 1)];
  const animals = Array.from({ length: count }, (_, index) => ({ id: `${animal}-${index}`, emoji: animal }));
  const numbers = new Set([count]);

  while (numbers.size < 3) {
    numbers.add(rand(1, 5));
  }

  return {
    id: `animals-${animal}-${Date.now()}`,
    type: "animale",
    animal,
    animals,
    options: shuffle(Array.from(numbers)),
    answer: count,
    message: "Numara animalele si apasa numarul corect!",
  };
}

function createShapeRound(shapePool) {
  const target = shapePool[rand(0, shapePool.length - 1)];
  const options = shuffle([target, ...shuffle(shapePool.filter((shape) => shape.id !== target.id)).slice(0, 3)]);

  return {
    id: `shape-${target.id}-${Date.now()}`,
    type: "forma",
    target,
    options,
    message: "Potriveste forma identica!",
  };
}

export function buildKindergartenRound(dificultate, previousType = "") {
  const typePool = ["culoare", "animale", "forma"].filter((type) => type !== previousType);
  const chosenType = typePool[rand(0, typePool.length - 1)];

  if (chosenType === "culoare") {
    return createColorRound();
  }

  if (chosenType === "animale") {
    return createAnimalRound(dificultate === "usor" ? 3 : dificultate === "mediu" ? 4 : 5);
  }

  const shapes = dificultate === "usor" ? SHAPE_OPTIONS.slice(0, 3) : dificultate === "mediu" ? SHAPE_OPTIONS.slice(0, 4) : SHAPE_OPTIONS;
  return createShapeRound(shapes);
}