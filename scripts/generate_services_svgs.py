"""Generate native SVG icons from services_*.webp — unified 200×200 viewBox."""
from __future__ import annotations

import os
import re
from PIL import Image

FOLDER = r'c:\Users\Kouki\Documents\GitHub\DEYAA\public\hero'
VIEW = 200
PAD = 10
ALPHA = 40
GRADIENT = """    <linearGradient id="{gid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#92C4E0" />
      <stop offset="55%" stop-color="#C5E0EE" />
      <stop offset="100%" stop-color="#F2FAFE" />
    </linearGradient>"""


def image_bbox(px, w, h, alpha=ALPHA):
    x0, y0, x1, y1 = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > alpha:
                x0 = min(x0, x)
                y0 = min(y0, y)
                x1 = max(x1, x)
                y1 = max(y1, y)
    return x0, y0, x1, y1


def norm(x, y, bbox):
    x0, y0, x1, y1 = bbox
    cw, ch = x1 - x0 + 1, y1 - y0 + 1
    inner = VIEW - 2 * PAD
    scale = min(inner / cw, inner / ch)
    ox = (VIEW - cw * scale) / 2
    oy = (VIEW - ch * scale) / 2
    return round((x - x0) * scale + ox, 1), round((y - y0) * scale + oy, 1)


def spans_on_row(px, w, y, alpha=ALPHA):
    xs = [x for x in range(w) if px[x, y][3] > alpha]
    if not xs:
        return []
    spans = []
    start = xs[0]
    prev = xs[0]
    for x in xs[1:]:
        if x > prev + 1:
            spans.append((start, prev))
            start = x
        prev = x
    spans.append((start, prev))
    return spans


def trace_component(px, w, h, seed, alpha=ALPHA, num_rows=40):
    sx, sy = seed
    if px[sx, sy][3] <= alpha:
        return None

    stack = [(sx, sy)]
    visited = {(sx, sy)}
    minx = maxx = sx
    miny = maxy = sy

    while stack:
        x, y = stack.pop()
        minx = min(minx, x)
        maxx = max(maxx, x)
        miny = min(miny, y)
        maxy = max(maxy, y)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited and px[nx, ny][3] > alpha:
                visited.add((nx, ny))
                stack.append((nx, ny))

    comp_bbox = (minx, miny, maxx, maxy)
    ch = maxy - miny + 1
    rows = []
    for i in range(num_rows):
        y = miny + int(i * (ch - 1) / max(num_rows - 1, 1))
        spans = spans_on_row(px, w, y, alpha)
        in_comp = [(l, r) for l, r in spans if l <= maxx and r >= minx]
        if in_comp:
            left = max(in_comp[0][0], minx)
            right = min(in_comp[-1][1], maxx)
            rows.append((y, left, right))

    if len(rows) < 2:
        return None

    left = [norm(l, y, comp_bbox) for y, l, _ in rows]
    right = [norm(r, y, comp_bbox) for y, _, r in reversed(rows)]
    pts = left + right
    d = 'M ' + ' L '.join(f'{x} {y}' for x, y in pts) + ' Z'
    return d, comp_bbox


def find_components(px, w, h, alpha=ALPHA):
    visited = [[False] * w for _ in range(h)]
    components = []
    for sy in range(h):
        for sx in range(w):
            if visited[sy][sx] or px[sx, sy][3] <= alpha:
                continue
            traced = trace_component(px, w, h, (sx, sy), alpha)
            if not traced:
                continue
            d, comp_bbox = traced
            minx, miny, maxx, maxy = comp_bbox
            for y in range(miny, maxy + 1):
                for x in range(minx, maxx + 1):
                    if px[x, y][3] > alpha:
                        visited[y][x] = True
            components.append(d)
    return components


def find_circles_2x2(px, w, h, alpha=ALPHA):
    circles = []
    for gy in range(2):
        for gx in range(2):
            x0 = int(gx * w / 2)
            x1 = int((gx + 1) * w / 2)
            y0 = int(gy * h / 2)
            y1 = int((gy + 1) * h / 2)
            minx, maxx, miny, maxy = w, 0, h, 0
            for y in range(y0, y1):
                for x in range(x0, x1):
                    if px[x, y][3] > alpha:
                        minx = min(minx, x)
                        maxx = max(maxx, x)
                        miny = min(miny, y)
                        maxy = max(maxy, y)
            if maxx <= minx:
                continue
            cx = (minx + maxx) / 2
            cy = (miny + maxy) / 2
            r = min(maxx - minx, maxy - miny) / 2
            circles.append((cx, cy, r))
    return circles


def circles_to_paths(circles, bbox):
    paths = []
    for cx, cy, r in circles:
        nx, ny = norm(cx, cy, bbox)
        x0, y0, x1, y1 = bbox
        cw, ch = x1 - x0 + 1, y1 - y0 + 1
        inner = VIEW - 2 * PAD
        scale = min(inner / cw, inner / ch)
        nr = round(r * scale, 1)
        nxl = round(nx - nr, 1)
        nxr = round(nx + nr, 1)
        ny = round(ny, 1)
        paths.append(
            f'M {nxl} {ny} A {nr} {nr} 0 1 0 {nxr} {ny} '
            f'A {nr} {nr} 0 1 0 {nxl} {ny} Z'
        )
    return paths


def column_rects(px, w, h, bbox, alpha=ALPHA):
    x0, y0, x1, y1 = bbox
    mid_y = (y0 + y1) // 2
    spans = spans_on_row(px, w, mid_y, alpha)
    nx, ny = norm(spans[0][0], y0, bbox)
    _, nby = norm(spans[0][0], y1, bbox)
    nh = round(nby - ny, 1)
    cw = x1 - x0 + 1
    ch = y1 - y0 + 1
    inner = VIEW - 2 * PAD
    scale = min(inner / cw, inner / ch)
    rects = []
    for left, right in spans:
        col_x, _ = norm(left, y0, bbox)
        nw = round((right - left + 1) * scale, 1)
        rects.append((round(col_x, 1), round(ny, 1), nw, nh))
    return rects


def write_svg(index, shapes, shape_kind='path', comment=''):
    gid = f'services-{index}-frost'
    if shape_kind == 'rect':
        body = '\n'.join(
            f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="url(#{gid})" />'
            for x, y, w, h in shapes
        )
    else:
        body = '\n'.join(
            f'  <path fill="url(#{gid})" d="{d}" />'
            for d in shapes
        )

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VIEW} {VIEW}" fill="none" aria-hidden="true">\n'
        f'  <defs>\n{GRADIENT.format(gid=gid)}\n  </defs>\n'
        f'  <!-- {comment} -->\n'
        f'{body}\n'
        f'</svg>\n'
    )
    out = os.path.join(FOLDER, f'services_{index}.svg')
    with open(out, 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f'Wrote {out} ({len(svg)} bytes, {len(shapes)} shapes)')


def generate_from_webp(index):
    webp = os.path.join(FOLDER, f'services_{index}.webp')
    img = Image.open(webp).convert('RGBA')
    w, h = img.size
    px = img.load()
    bbox = image_bbox(px, w, h)

    if index == 3:
        circles = find_circles_2x2(px, w, h)
        paths = circles_to_paths(circles, bbox)
        write_svg(index, paths, 'path', 'Four circles — from services_3.webp')
        return

    if index == 5:
        rects = column_rects(px, w, h, bbox)
        write_svg(index, rects, 'rect', 'Three columns — from services_5.webp')
        return

    paths = find_components(px, w, h)
    write_svg(index, paths, 'path', f'services_{index} — from webp ({len(paths)} parts)')


def main():
    for i in range(1, 8):
        webp = os.path.join(FOLDER, f'services_{i}.webp')
        if not os.path.exists(webp):
            print(f'SKIP missing {webp}')
            continue
        generate_from_webp(i)


if __name__ == '__main__':
    main()
