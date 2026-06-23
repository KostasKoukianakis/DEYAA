"""Compare SVG silhouette overlap with source webp using PIL polygon fill."""
from PIL import Image, ImageDraw
import os, re

FOLDER = r'c:\Users\Kouki\Documents\GitHub\DEYAA\public\hero'
VIEW = 200


def parse_path(d):
    """Parse simple M/L path to polygon points."""
    tokens = re.findall(r'[MLZ]|[-+]?(?:\d+\.?\d*|\.\d+)', d)
    pts = []
    i = 0
    cur = (0, 0)
    start = None
    while i < len(tokens):
        t = tokens[i]
        if t == 'M':
            x, y = float(tokens[i+1]), float(tokens[i+2])
            cur = (x, y)
            start = cur
            pts.append(cur)
            i += 3
        elif t == 'L':
            x, y = float(tokens[i+1]), float(tokens[i+2])
            cur = (x, y)
            pts.append(cur)
            i += 3
        elif t == 'Z':
            if start:
                pts.append(start)
            i += 1
        else:
            i += 1
    return pts


def render_path(d, size=VIEW, evenodd=False):
    img = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(img)
    # split subpaths for evenodd
    parts = re.split(r'\s+(?=M\s)', d.strip())
    polys = [parse_path(p) for p in parts if p.strip()]
    for poly in polys:
        if len(poly) >= 3:
            draw.polygon(poly, fill=255)
    return img


def overlap(svg_path, webp_path):
    with open(svg_path) as f:
        content = f.read()
    d_match = re.search(r'd="([^"]+)"', content)
    evenodd = 'evenodd' in content
    d = d_match.group(1)
    svg_mask = render_path(d, evenodd=evenodd)

    webp = Image.open(webp_path).convert('RGBA').resize((VIEW, VIEW), Image.LANCZOS)
    wpx = webp.load()
    match = total = 0
    spx = svg_mask.load()
    for y in range(VIEW):
        for x in range(VIEW):
            w_on = wpx[x, y][3] > 40
            s_on = spx[x, y] > 128
            if w_on or s_on:
                total += 1
                if w_on == s_on:
                    match += 1
    return match / total * 100 if total else 0


for i in range(1, 8):
    svg = os.path.join(FOLDER, f'services_{i}.svg')
    webp = os.path.join(FOLDER, f'services_{i}.webp')
    if os.path.exists(svg) and os.path.exists(webp):
        print(f'services_{i}: {overlap(svg, webp):.1f}% overlap')
