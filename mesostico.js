/* Mesóstico de la libreta: «PALABRA 3» se convierte en la lista de palabras
   cuya TERCERA letra forma PALABRA. Compartido por la libreta y el receptor.
   Requiere mesostico-bank.js cargado antes.

   Reglas:
   - 100 líneas, una palabra distinta en cada una (nunca se repite una palabra).
   - Si la palabra elegida repite letras (PERRO, AGUJA), cada línea tira de una
     palabra distinta del mismo cajón: el cajón se consulta con la marca de
     "usadas", así que dos R nunca eligen la misma palabra.
   - Las tildes y diéresis se neutralizan: CAFÉ se deletrea C-A-F-E. El banco no
     tiene palabras acentuadas, así que la columna nunca mezcla É y E.
   - El número tiene que ser una letra real de la palabra (1..longitud). */
(function () {
  'use strict';
  var MESO = /^([a-záéíóúüñ]{3,16})[\s,;:.\-–—]+([1-6])$/i;

  function sinTildes(w) {
    return String(w || '').toLowerCase()
      .replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e').replace(/[íìï]/g, 'i')
      .replace(/[óòö]/g, 'o').replace(/[úùü]/g, 'u').replace(/ç/g, 'c');
  }

  function semilla(t) {
    var h = 7;
    for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) % 99991;
    return h;
  }

  /* Motivo por el que no se puede montar la lista, o '' si se puede. */
  function problema(palabra, pos) {
    var limpia = sinTildes(palabra);
    var n = Number(pos);
    if (!limpia || !(n >= 1 && n <= 6)) return 'número fuera de rango';
    if (n > limpia.length) return 'la palabra solo tiene ' + limpia.length + ' letras';
    var caja = (window.MESOSTICO_BANCO || {})[String(n)] || {};
    for (var i = 0; i < limpia.length; i++) {
      if (!(caja[limpia[i]] || []).length) return 'no hay relleno para la letra ' + limpia[i].toUpperCase();
    }
    return '';
  }

  /* Devuelve el array de palabras (mayúsculas) o null si no se puede. */
  function lista(palabra, pos) {
    var banco = window.MESOSTICO_BANCO || {};
    var limpia = sinTildes(palabra);
    var letras = limpia.split('');
    var caja = banco[String(pos)] || {};
    var h = semilla(limpia + pos);
    if (!letras.length || problema(palabra, pos)) return null;
    for (var vuelta = 0; vuelta < 2; vuelta++) {
      var usadas = {}, out = [], rota = false;
      for (var i = 0; i < letras.length && !rota; i++) {
        var pool = (caja[letras[i]] || []).filter(function (w) { return w !== limpia; });
        if (!pool.length) { rota = true; break; }
        var elegida = null;
        for (var k = 0; k < pool.length && !elegida; k++) {
          var w = pool[(h + i * 7 + k) % pool.length];
          if (vuelta || !usadas[w]) elegida = w;   /* 1ª vuelta: sin repetir; 2ª: lo que haya */
        }
        if (!elegida) { rota = true; break; }
        usadas[elegida] = 1;
        out.push(elegida.toUpperCase());
      }
      if (!rota) return out;
    }
    return null;
  }

  /* «AGUJA 2» → "HABLAR\nAGUA\n..."   Cualquier otro texto, tal cual. */
  function texto(t) {
    var s = String(t || '').trim();
    var m = s.match(MESO);
    if (m) {
      var ws = lista(m[1], m[2]);
      if (ws) return ws.join('\n');
    }
    return s;
  }

  window.MESOSTICO = { lista: lista, texto: texto, patron: MESO, problema: problema };
})();
