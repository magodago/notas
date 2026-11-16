window.LISTAS = window.LISTAS || {};

window.LISTAS.cartas = (function () {
  var palos = ['picas', 'corazones', 'diamantes', 'treboles'];
  var rangos = ['as', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jota', 'reina', 'rey'];
  var items = [];
  for (var p = 0; p < palos.length; p++) {
    for (var r = 0; r < rangos.length; r++) {
      items.push(rangos[r] + ' de ' + palos[p]);
    }
  }
  return { titulo: 'Cartas', items: items, dibujo: true };
})();
