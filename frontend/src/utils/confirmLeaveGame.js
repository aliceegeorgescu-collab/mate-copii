export function confirmLeaveGame(action) {
  if (window.confirm("Ești sigur? Vei pierde progresul din acest joc!")) {
    action();
  }
}