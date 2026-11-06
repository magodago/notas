"""Genera el icono de Notas a partir de los colores y la geometria de la captura de David."""
from PIL import Image, ImageDraw

S = 1024
ALTO = 1.0

# Geometria medida sobre la foto (icono de 211x211 px)
BANDA = 0.246          # fin del amarillo
PUNTOS_Y = 0.284       # fila de puntos
LINEA1_Y = 0.493
LINEA2_Y = 0.754
LINEA_H = 0.019
LINEA_W = 0.744
PUNTO_D = 0.024
PUNTO_SEP = 0.0745
N_PUNTOS = 13

AMARILLO_ARRIBA = (252, 208, 12)
AMARILLO_ABAJO = (240, 190, 0)
CUERPO_ARRIBA = (27, 27, 27)
CUERPO_ABAJO = (14, 14, 14)
GRIS_LINEA = (124, 124, 124)
GRIS_PUNTO = (150, 146, 138)


def icono() -> Image.Image:
    im = Image.new('RGB', (S, S), CUERPO_ABAJO)
    px = im.load()

    # cuerpo con degradado vertical
    for y in range(S):
        t = y / (S - 1)
        c = tuple(round(CUERPO_ARRIBA[i] + (CUERPO_ABAJO[i] - CUERPO_ARRIBA[i]) * t) for i in range(3))
        for x in range(S):
            px[x, y] = c

    # banda amarilla con degradado
    fin_banda = round(BANDA * S)
    for y in range(fin_banda):
        t = y / max(1, fin_banda - 1)
        c = tuple(round(AMARILLO_ARRIBA[i] + (AMARILLO_ABAJO[i] - AMARILLO_ARRIBA[i]) * t) for i in range(3))
        for x in range(S):
            px[x, y] = c

    d = ImageDraw.Draw(im)

    # fila de puntos bajo la banda
    r = PUNTO_D * S / 2
    paso = PUNTO_SEP * S
    ancho_total = (N_PUNTOS - 1) * paso
    x0 = (S - ancho_total) / 2
    cy = PUNTOS_Y * S
    for i in range(N_PUNTOS):
        cx = x0 + i * paso
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=GRIS_PUNTO)

    # dos lineas grises
    ancho = LINEA_W * S
    alto = LINEA_H * S
    for fy in (LINEA1_Y, LINEA2_Y):
        cy = fy * S
        d.rounded_rectangle([(S - ancho) / 2, cy - alto / 2, (S + ancho) / 2, cy + alto / 2],
                            radius=alto / 2, fill=GRIS_LINEA)

    return im


base = icono()
base.save('/home/dorti/magia/indice/notas-icon.png', optimize=True)
base.resize((512, 512), Image.LANCZOS).save('/home/dorti/magia/indice/notas-icon-512.png', optimize=True)
base.resize((180, 180), Image.LANCZOS).save('/home/dorti/magia/indice/notas-180.png', optimize=True)
print('ok', base.size)
