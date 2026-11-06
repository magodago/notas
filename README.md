# Notas y Calculadora

Dos apps del repertorio, estética iOS, instalables como PWA. Funcionan sin conexión.

- `calculadora.html` — calculadora real. Al pulsar `=` guarda las **dos últimas cifras** del resultado.
- `notas.html` — libreta con cuatro listas de **100 entradas (00–99)**: Famosos, Películas, Objetos, Músicos.

El número viaja de la calculadora a la libreta por un puente propio (`~/magia/puente`, Cloudflare Worker + KV),
porque iOS da a cada app instalada su propia memoria y no hay canal entre ellas.

El ítem forzado se coloca en el número en juego intercambiando posiciones: la lista sigue teniendo
100 nombres distintos, sin duplicados ni huecos.

Ajustes ocultos en la libreta: tres toques en «Todo (iCloud)». Número a mano: pulsación larga en «...».
