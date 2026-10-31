"""Opus round 1 — reproducible logo geometry. Filled paths only (no strokes, no text).

Usage: python3 build.py <version>   -> writes revisions/*-v<version>.svg and concepts/*.svg
"""
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
F = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")


def svg(title, body, w=256, h=256):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
            f'<title>99 — {title}</title>{body}</svg>\n')


def ring(cx, cy, R, r, gap=None):
    """Annulus as one evenodd path. gap=(a1, a2) in degrees removes that sector (open loop)."""
    if gap is None:
        return (f'<path fill="#000" fill-rule="evenodd" d="M{F(cx-R)} {F(cy)}a{F(R)} {F(R)} 0 1 0 {F(2*R)} 0'
                f'a{F(R)} {F(R)} 0 1 0 {F(-2*R)} 0Z M{F(cx-r)} {F(cy)}a{F(r)} {F(r)} 0 1 0 {F(2*r)} 0'
                f'a{F(r)} {F(r)} 0 1 0 {F(-2*r)} 0Z"/>')
    a1, a2 = map(math.radians, gap)          # draw the ring from a2 round to a1 (the long way)
    p = lambda rad, a: (cx + rad * math.cos(a), cy + rad * math.sin(a))
    o1, o2, i1, i2 = p(R, a2), p(R, a1), p(r, a1), p(r, a2)
    return (f'<path fill="#000" d="M{F(o1[0])} {F(o1[1])}A{F(R)} {F(R)} 0 1 1 {F(o2[0])} {F(o2[1])}'
            f'L{F(i1[0])} {F(i1[1])}A{F(r)} {F(r)} 0 1 0 {F(i2[0])} {F(i2[1])}Z"/>')


def rect(x, y, w, h):
    return f'<path fill="#000" d="M{F(x)} {F(y)}h{F(w)}v{F(h)}h{F(-w)}Z"/>'


# ---------------------------------------------------------------- A · Closing Quote
def comma(cx, cy, r, tail):
    """Filled quotation-mark 9: a disc plus a tapering tail that curls down-left.
    Disc and tail are drawn with the same winding so they union under nonzero fill."""
    disc = (f'M{F(cx)} {F(cy-r)}a{F(r)} {F(r)} 0 1 1 0 {F(2*r)}a{F(r)} {F(r)} 0 1 1 0 {F(-2*r)}Z')
    t = tail
    tl = (f'M{F(cx+r)} {F(cy)}'
          f'C{F(cx+r)} {F(cy+r*t["c1"])} {F(cx+r*t["c2x"])} {F(cy+r*t["c2y"])} {F(cx+r*t["tipx"])} {F(cy+r*t["tipy"])}'
          f'L{F(cx+r*t["tip2x"])} {F(cy+r*t["tip2y"])}'
          f'C{F(cx+r*t["c3x"])} {F(cy+r*t["c3y"])} {F(cx+r*t["c4x"])} {F(cy+r*t["c4y"])} {F(cx+r*t["endx"])} {F(cy+r*t["endy"])}Z')
    return disc + tl


TAIL = {
    1: dict(c1=1.4, c2x=0.6, c2y=2.05, tipx=-0.55, tipy=2.35, tip2x=-0.70, tip2y=2.05,
            c3x=0.05, c3y=1.75, c4x=0.35, c4y=1.35, endx=0.0, endy=1.0),
    2: dict(c1=1.25, c2x=0.75, c2y=1.95, tipx=-0.45, tipy=2.40, tip2x=-0.625, tip2y=2.0969,
            c3x=0.20, c3y=1.68, c4x=0.50, c4y=1.20, endx=0.4745, endy=0.91),
}


def concept_a(v):
    r = 42
    t = TAIL[1 if v == 1 else 2]  # v3 reuses v2 tail with snapped cut
    gap = 98 if v == 1 else 100
    x1 = 128 - gap / 2 - (4 if v == 1 else 0)
    cy = 92 if v == 1 else 98
    d = comma(x1, cy, r, t) + comma(x1 + gap, cy, r, t)
    if v >= 4:   # enlarge 1.22x about the canvas centre for small-size presence
        return svg("Closing Quote", f'<g transform="translate(128 126) scale(1.22) translate(-128 -126)"><path fill="#000" d="{d}"/></g>')
    return svg("Closing Quote", f'<path fill="#000" d="{d}"/>')


# ---------------------------------------------------------------- B · Open → Closed
def nine(cx, cy, R, r, stem_to, gap=None, foot=0):
    """Geometric 9: ring bowl + straight right stem (x = cx+r .. cx+R) down to stem_to."""
    body = ring(cx, cy, R, r, gap) + rect(cx + r, cy, R - r, stem_to - cy)
    if foot:                                   # short flat foot kicking left at the base
        body += rect(cx + R - foot, stem_to - (R - r), foot, R - r)
    return body


def concept_b(v):
    if v >= 3:
        return concept_b_signoff()
    R, r = 46, 22                               # 24-unit weight
    cy, stem = (88, 204) if v == 1 else (92, 208)
    gap = (150, 222) if v == 1 else (-75, -30)  # v2: opening at upper right, away from the 3 reading
    x1, x2 = (76, 180) if v == 1 else (74, 182)
    body = nine(x1, cy, R, r, stem, gap=gap) + nine(x2, cy, R, r, stem)
    return svg("Open to Closed", body)


def concept_b_signoff():
    """Sign-off: the second 9's stem turns left on a 24-unit radius into one line under both numerals."""
    R, r, w = 46, 22, 24
    cy = 92
    x1, x2 = 74, 182
    base_top, base_bot = 192, 216              # the sign-off line
    body = nine(x1, cy, R, r, 172)             # first 9 stands just above the line (20-unit gap)
    body += ring(x2, cy, R, r)
    # second stem + rounded corner + line, as one filled outline
    xo, xi = x2 + R, x2 + r                    # stem outer / inner x
    d = (f"M{F(xi)} {F(cy)}H{F(xo)}V{F(base_bot - w)}"
         f"A{w} {w} 0 0 1 {F(xo - w)} {F(base_bot)}"
         f"H{F(x1 - R)}V{F(base_top)}H{F(xi)}Z")
    body += f'<path fill="#000" d="{d}"/>'
    return svg("Sign-off", body)


# ---------------------------------------------------------------- C · Turnkey
def concept_c(v):
    R, r = 46, 22
    cy, stem = 88, 212
    x1, x2 = (74, 182) if v == 1 else (64, 168)
    w = R - r
    body = nine(x1, cy, R, r, stem) + nine(x2, cy, R, r, stem)
    # Key bits: two teeth on the outer (right) side of the second stem, near its tip.
    tooth_w = 16 if v == 1 else 24
    ys = (168, 196) if v == 1 else (160, 192)
    for y in ys:
        body += rect(x2 + R, y, tooth_w, 14 if v == 1 else 20)
    return svg("Turnkey", body)


CONCEPTS = {"a-closing-quote": concept_a, "b-sign-off": concept_b, "c-turnkey": concept_c}

if __name__ == "__main__":
    v = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    for name, fn in CONCEPTS.items():
        raw = fn(v)
        (ROOT / "revisions" / f"{name}-v{v}.svg").write_text(raw)
        (ROOT / "concepts" / f"{name}.svg").write_text(raw)
    print(f"wrote v{v}")
