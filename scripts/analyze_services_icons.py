from PIL import Image
import os, json

folder = r'c:\Users\Kouki\Documents\GitHub\DEYAA\public\hero'

for i in range(1, 8):
    path = os.path.join(folder, f'services_{i}.webp')
    if not os.path.exists(path):
        print(f'MISSING {path}')
        continue
    img = Image.open(path).convert('RGBA')
    w, h = img.size
    px = img.load()

    def edge(y):
        xs = [x for x in range(w) if px[x, y][3] > 50]
        return (xs[0], xs[-1], xs[-1] - xs[0] + 1) if xs else None

    x0, y0, x1, y1 = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 50:
                x0 = min(x0, x)
                y0 = min(y0, y)
                x1 = max(x1, x)
                y1 = max(y1, y)

    samples = {}
    for pct in [0, 0.25, 0.5, 0.75, 1.0]:
        y = int(y0 + (y1 - y0) * pct)
        e = edge(y)
        if e:
            samples[pct] = e

    # color samples
    colors = []
    for sy in [y0 + (y1 - y0) // 4, y0 + (y1 - y0) // 2, y0 + 3 * (y1 - y0) // 4]:
        for sx in [x0 + (x1 - x0) // 4, x0 + (x1 - x0) // 2, x0 + 3 * (x1 - x0) // 4]:
            r, g, b, a = px[sx, sy]
            if a > 50:
                colors.append((r, g, b))

    def rgb_hex(c):
        return f'#{c[0]:02X}{c[1]:02X}{c[2]:02X}'

    unique_colors = list(dict.fromkeys(colors))[:5]

    print(f'\n=== services_{i}.webp {w}x{h} bbox=({x0},{y0})-({x1},{y1}) content={x1-x0+1}x{y1-y0+1}')
    for pct, e in samples.items():
        print(f'  y@{pct:.0%}: left={e[0]} right={e[1]} width={e[2]}')
    print(f'  colors: {[rgb_hex(c) for c in unique_colors]}')

    # contour points for key rows
    key_rows = []
    step = max(1, (y1 - y0) // 20)
    for y in range(y0, y1 + 1, step):
        e = edge(y)
        if e:
            key_rows.append((y, e[0], e[1]))
    print(f'  contour rows ({len(key_rows)}):')
    for y, l, r in key_rows[::2]:
        print(f'    y={y}: {l}-{r}')
