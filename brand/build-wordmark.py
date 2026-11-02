#!/usr/bin/env python3
"""Outline the approved ninety(400)+nine(750) treatment and compose the four lockups.
Usage: python3 brand/build-wordmark.py /path/to/InterTight[wght].ttf
Requires fonttools and uharfbuzz only when regenerating; deployed SVGs need no fonts.
Typeface: Inter Tight, SIL OFL (licence bundled beside the SVGs).
"""
import json
import re
import sys
from pathlib import Path
import xml.etree.ElementTree as ET
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / 'site/assets'
NS = '{http://www.w3.org/2000/svg}'
ET.register_namespace('', 'http://www.w3.org/2000/svg')


def inner(raw):
    root = ET.fromstring(raw)
    for title in list(root):
        if title.tag == NS + 'title':
            root.remove(title)
    return ''.join(ET.tostring(el, encoding='unicode') for el in root)


def build(font_path):
    source = Path(font_path).read_bytes()
    runs = []
    x = 0
    for text, weight in [('ninety', 400), ('nine', 750)]:
        font = instantiateVariableFont(TTFont(font_path), {'wght': weight}, inplace=False)
        glyphs = font.getGlyphSet()
        hf = hb.Font(hb.Face(source))
        hf.set_variations({'wght': weight})
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(hf, buf, {'kern': True})
        order = font.getGlyphOrder()
        positioned = []
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            positioned.append((order[info.codepoint], x + pos.x_offset, pos.y_offset))
            x += pos.x_advance - 12  # restrained tracking, no artificial gap at the weight boundary
        pen = BoundsPen(glyphs)
        for name, gx, gy in positioned:
            glyphs[name].draw(TransformPen(pen, (1, 0, 0, 1, gx, gy)))
        runs.append((glyphs, positioned, pen.bounds, text, weight))
    x0 = min(r[2][0] for r in runs)
    y0 = min(r[2][1] for r in runs)
    x1 = max(r[2][2] for r in runs)
    y1 = max(r[2][3] for r in runs)
    scale = 216 / (y1 - y0)
    width = round((x1 - x0) * scale + 40)
    paths = []
    for glyphs, positioned, _, text, weight in runs:
        pen = SVGPathPen(glyphs)
        for name, gx, gy in positioned:
            glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, 20 + (gx - x0)*scale, 20 + (y1 - gy)*scale)))
        path = re.sub(r'-?\d+\.\d+', lambda m: f'{float(m[0]):.2f}'.rstrip('0').rstrip('.'), pen.getCommands())
        paths.append(f'<path fill="currentColor" data-part="{text}" data-weight="{weight}" d="{path}"/>')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 256" role="img" aria-label="ninetynine">'
           '<title>ninetynine — light ninety, bold nine</title>' + ''.join(paths) + '</svg>\n')
    (ASSETS / 'ninetynine.svg').write_text(svg)
    originals = json.loads((ROOT / 'brand/symbols.json').read_text())
    for key, symbol in originals.items():
        sym_width = float(ET.fromstring(symbol).get('viewBox').split()[2])
        # Keep visual width consistent for the wide numeral symbol; preserve each original viewBox.
        sym_scale = min(0.8, 205 / sym_width)
        sym_x = 16 + (205 - sym_width * sym_scale) / 2
        sym_y = (256 - 256 * sym_scale) / 2
        total = round(245 + width * 0.72 + 20)
        lockup = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total} 256" role="img" aria-label="ninetynine">'
                  f'<title>{key} + ninetynine</title>'
                  f'<g transform="translate({sym_x:.2f} {sym_y:.2f}) scale({sym_scale:.4f})">{inner(symbol)}</g>'
                  f'<g transform="translate(245 35.84) scale(.72)">{inner(svg)}</g></svg>\n')
        (ASSETS / f'ninetynine-{key}.svg').write_text(lockup)
    print('Built mixed-weight wordmark and four outlined symbol lockups')


if __name__ == '__main__':
    build(sys.argv[1])
