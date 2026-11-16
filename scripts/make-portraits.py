"""
Build the site's pictures of Lisa and Felix from the two uploads in
design-export/uploads/:

  Portraits professionnels sur fond transparent.png
      Lisa (left) and Felix (right), already without background.
      -> assets/lisa.webp, assets/felix.webp (transparent, hero framing)

  Appel vidéo sur ordinateur et smartphone.png
      Laptop and phone in a video call, on white.
      -> assets/call.webp (white removed, so it sits on the dark page)

The importer prefers a .webp in design-export/assets/ over the export's own
.png of the same name; run scripts/import-design.mjs afterwards.

    python scripts/make-portraits.py
"""
import os

import cv2
import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(ROOT, 'design-export', 'uploads')
OUT = os.path.join(ROOT, 'design-export', 'assets')

PORTRAITS = 'Portraits professionnels sur fond transparent.png'
CALL = 'Appel vidéo sur ordinateur et smartphone.png'

# The hero frame is 300:178. Each portrait: columns of the person in the
# upload, the column their face is centred on, and how far down to show.
FRAME = 300 / 178
PEOPLE = {
    'lisa': {'cols': (130, 750), 'centre': 432, 'rows': (0, 470), 'top_pad': 26},
    'felix': {'cols': (755, 1536), 'centre': 1142, 'rows': (0, 470), 'top_pad': 26},
}
SCALE = 2  # the upload is small; a clean 2x keeps edges smooth on big screens


def read(name, flags=cv2.IMREAD_UNCHANGED):
    data = np.fromfile(os.path.join(SRC, name), dtype=np.uint8)
    return cv2.imdecode(data, flags)


def write(name, img, quality):
    ok, buf = cv2.imencode('.webp', img, [cv2.IMWRITE_WEBP_QUALITY, quality])
    buf.tofile(os.path.join(OUT, name))
    print(name, f'{img.shape[1]}x{img.shape[0]}', f'{len(buf) // 1024} KB')


def portraits():
    src = read(PORTRAITS).astype(np.float32) / 255.0  # BGRA
    for name, p in PEOPLE.items():
        x0, x1 = p['cols']
        y0, y1 = p['rows']
        h = p['top_pad'] + (y1 - y0)
        w = int(round(h * FRAME))
        canvas = np.zeros((h, w, 4), np.float32)
        left = w // 2 - (p['centre'] - x0)  # where the person's first column lands
        a, b = max(0, left), min(w, left + (x1 - x0))
        canvas[p['top_pad']:, a:b] = src[y0:y1, x0 + (a - left):x0 + (b - left)]
        # Scale with premultiplied alpha so no fringe appears along the edge.
        pre = canvas.copy()
        pre[..., :3] *= pre[..., 3:]
        pre = cv2.resize(pre, (w * SCALE, h * SCALE), interpolation=cv2.INTER_LANCZOS4)
        pre = np.clip(pre, 0, 1)
        alpha = pre[..., 3:]
        pre[..., :3] = np.clip(pre[..., :3] / np.maximum(alpha, 1e-4), 0, 1)
        write(f'{name}.webp', (pre * 255).round().astype(np.uint8), 92)


def call():
    img = read(CALL, cv2.IMREAD_COLOR)
    # Everything light that is connected to the picture's border is backdrop;
    # the devices' dark bezels stop the fill from reaching the screens.
    light = (img.min(axis=2) > 200).astype(np.uint8)
    _, labels = cv2.connectedComponents(light, connectivity=4)
    edge = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    backdrop = np.isin(labels, edge[edge != 0]).astype(np.uint8)
    # Take one more pixel off the devices (the light anti-aliased rim), then soften.
    backdrop = cv2.dilate(backdrop, np.ones((3, 3), np.uint8), iterations=2)
    alpha = cv2.GaussianBlur((1 - backdrop).astype(np.float32), (3, 3), 0)

    ys, xs = np.where(alpha > 0.5)
    y0, y1, x0, x1 = ys.min() - 4, ys.max() + 5, xs.min() - 4, xs.max() + 5
    rgba = np.dstack([img, (alpha * 255).astype(np.uint8)])[max(0, y0):y1, max(0, x0):x1]
    write('call.webp', rgba, 92)


if __name__ == '__main__':
    portraits()
    call()
