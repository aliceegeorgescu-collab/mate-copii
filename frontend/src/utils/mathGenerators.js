import { rand } from "./random";

export function alegeOperator() {
  return rand(0, 1) === 0 ? "+" : "-";
}

export function genereazaIntrebare(tip, dificultate = "mediu") {
  if (tip === "+") {
    let a;
    let b;

    if (dificultate === "usor") {
      a = rand(1, 9);
      b = rand(1, 10 - a);
    } else if (dificultate === "mediu") {
      a = rand(1, 19);
      b = rand(1, 20 - a);
    } else {
      a = rand(2, 9);
      b = rand(11 - a, 9);
      if (Math.random() > 0.5) {
        a = rand(11, 19);
        b = rand(1, 20 - a);
      }
    }

    return { a, b, op: "+", raspuns: a + b };
  }

  let a;
  let b;

  if (dificultate === "usor") {
    a = rand(2, 10);
    b = rand(1, a - 1);
  } else if (dificultate === "mediu") {
    a = rand(2, 20);
    b = rand(1, a - 1);
  } else {
    a = rand(11, 18);
    b = rand(a - 9, 9);
  }

  return { a, b, op: "-", raspuns: a - b };
}

export function genereazaOptiuni(raspuns, max = 20) {
  const valori = new Set([raspuns]);
  let fails = 0;

  while (valori.size < 4 && fails < 50) {
    const valoare = raspuns + rand(-4, 4);
    if (valoare !== raspuns && valoare >= 0 && valoare <= max) {
      valori.add(valoare);
    } else {
      fails += 1;
    }
  }

  while (valori.size < 4) {
    valori.add(rand(0, max));
  }

  return [...valori].sort(() => Math.random() - 0.5);
}