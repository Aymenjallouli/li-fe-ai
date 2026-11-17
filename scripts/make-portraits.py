"""
Build the site's pictures of Lisa and Felix. Felix is the HeyGen LiveAvatar
character "Matthew", Lisa is "Hannah" (the ones used in the live conversation).

  design-export/uploads/duo.png      both, already without background
      -> assets/lisa.webp, assets/felix.webp   (hero portraits)
  design-export/live/*.jpg           stills from the LiveAvatar catalogue
      -> assets/laptop.webp, assets/phone.webp (call screens, room kept)

The importer prefers a .webp in design-export/assets/ over the export's own
.png of the same name; run scripts/import-design.mjs afterwards.

    python scripts/make-portraits.py
"""
import os
import sys

import cv2
import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(ROOT, 'design-export', 'live')
OUT = os.path.join(ROOT, 'design-export', 'assets')

# Hero portraits: the frame is 300:178. For each person: their columns in the
# double portrait, the column their face is centred on, and the rows to show.
DUO = os.path.join(ROOT, 'design-export', 'uploads', 'duo.png')
FRAME = 300 / 178
TOP_PAD = 24
SCALE = 2
PEOPLE = {
    'lisa': {'cols': (244, 1034), 'centre': 653, 'rows': (0, 462)},
    'felix': {'cols': (1034, 1896), 'centre': 1455, 'rows': (0, 462)},
}

# Call screens: (source, crop box x0,y0,x1,y1 in source pixels, output width)
SCREENS = {
    'laptop': ('matthew.jpg', (300, 70, 1620, 895), 1320),  # 16:10
    'phone': ('hannah-3.jpg', (675, 20, 1195, 1060), 520),  # 9:18
}


def read(name):
    img = cv2.imdecode(np.fromfile(os.path.join(SRC, name), dtype=np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        sys.exit(f'missing {name}')
    return img


def write(name, img, quality):
    ok, buf = cv2.imencode('.webp', img, [cv2.IMWRITE_WEBP_QUALITY, quality])
    buf.tofile(os.path.join(OUT, name))
    print(name, f'{img.shape[1]}x{img.shape[0]}', f'{len(buf) // 1024} KB')


def portraits():
    """Lisa (left) and Felix (right) from the transparent double portrait."""
    data = np.fromfile(DUO, dtype=np.uint8)
    src = cv2.imdecode(data, cv2.IMREAD_UNCHANGED).astype(np.float32) / 255.0  # BGRA
    for name, p in PEOPLE.items():
        x0, x1 = p['cols']
        y0, y1 = p['rows']
        h = TOP_PAD + (y1 - y0)
        w = int(round(h * FRAME))
        canvas = np.zeros((h, w, 4), np.float32)
        left = w // 2 - (p['centre'] - x0)  # where the person's first column lands
        a, b = max(0, left), min(w, left + (x1 - x0))
        canvas[TOP_PAD:, a:b] = src[y0:y1, x0 + (a - left):x0 + (b - left)]
        # Scale with premultiplied alpha so no fringe appears along the edge.
        canvas[..., :3] *= canvas[..., 3:]
        pre = np.clip(cv2.resize(canvas, (w * SCALE, h * SCALE), interpolation=cv2.INTER_LANCZOS4), 0, 1)
        alpha = pre[..., 3:]
        pre[..., :3] = np.clip(pre[..., :3] / np.maximum(alpha, 1e-4), 0, 1)
        write(f'{name}.webp', (pre * 255).round().astype(np.uint8), 92)


def screens():
    for name, (src, (x0, y0, x1, y1), out_w) in SCREENS.items():
        img = read(src)[y0:y1, x0:x1]
        out_h = int(round(img.shape[0] * out_w / img.shape[1]))
        if out_w != img.shape[1]:
            img = cv2.resize(img, (out_w, out_h), interpolation=cv2.INTER_AREA)
        write(f'{name}.webp', img, 88)


if __name__ == '__main__':
    screens()
    portraits()
