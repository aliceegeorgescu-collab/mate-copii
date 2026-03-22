export function formatDateLabel(value) {
  if (!value) return "Nicio sesiune inca";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Nicio sesiune inca";

  return date.toLocaleString("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function getPersonajSimbol(personaj) {
  if (!personaj) return "EU";
  return personaj.simbol || personaj.nume?.slice(0, 2)?.toUpperCase() || "EU";
}

export function formatGameLabel(gameId) {
  const labels = {
    baloane: "Prinde Raspunsul",
    trenulet: "Trenuletul Info",
    pescuit: "Pescuitul Numerelor",
    racheta: "Racheta spre Stele",
    cursa: "Cursa Masinutelor",
    labirint_batman: "Labirintul lui Batman",
    gradinita_vesela: "Gradinita Vesela",
  };

  return labels[gameId] ?? gameId;
}