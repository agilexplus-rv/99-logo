"""Finalize the concept checkpoint; force CairoSVG (no browser fallback)."""
import sys
sys.dont_write_bytecode = True
from pathlib import Path
import subprocess
import xml.etree.ElementTree as ET
import cairosvg
from PIL import Image, ImageDraw, ImageFont
from build import ROOT, artwork, render

SKILL = Path('/home/builder/.claude/skills/logo-design')
marks = artwork(3)
for name, raw in marks.items():
    target = ROOT/'concepts'/f'{name}.svg'
    target.write_text(raw)
    (ROOT/'checks'/f'{name}-reverse.svg').write_text(raw.replace('fill="#000"', 'fill="#fff"'))
    for size in (16, 32, 64):
        render(raw, size).save(ROOT/'checks'/f'{name}-{size}.png')
        render(raw.replace('fill="#000"', 'fill="#fff"'), size, '#000').save(ROOT/'checks'/f'{name}-{size}-reverse.png')

# Use installed overview composition; replace its renderer with CairoSVG directly.
sys.path.insert(0, str(SKILL/'scripts'))
import concept_sheet

def cairo_only(source, dest, width, height):
    cairosvg.svg2png(url=source, write_to=dest, output_width=width, output_height=height, background_color='#fff')
    return 'cairosvg (explicit; no fallback)'
concept_sheet.render_png.render = cairo_only
sys.argv = ['concept_sheet.py', *[str(ROOT/'concepts'/f'{n}.svg') for n in marks],
            '--names', 'Cut & Curve', 'Counterform', 'Joint',
            '--notes', 'Custom numerals. Clear name, decisive tails.',
            'Two 9s cut from one architectural mass.', 'Two numeral forms share one compact body.',
            '--title', '99 / SOL concept round 1',
            '--subtitle', 'Software development. Delivered solutions. Three directions, black first.',
            '--recommend', '1', '--width', '1500', '-o', str(ROOT/'concepts.png')]
concept_sheet.main()

# Actual-size reverse ladder, together with enlarged nearest-neighbour pixels.
ladder = Image.new('RGB', (1020, 500), 'white')
ld = ImageDraw.Draw(ladder)
lf = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
for i, name in enumerate(marks):
    xx = 20 + i*340
    ld.text((xx, 10), name, font=lf, fill='black')
    for j, size in enumerate((64, 32, 16)):
        for reverse in (False, True):
            im = Image.open(ROOT/'checks'/f'{name}-{size}{"-reverse" if reverse else ""}.png')
            yy = 50+j*140 + (60 if reverse else 0)
            ladder.paste(im, (xx, yy))
            ladder.paste(im.resize((im.width*3, im.height*3), Image.Resampling.NEAREST), (xx+105, yy)) if size == 16 else None
        ld.text((xx+210, 50+j*140), f'{size}px', font=lf, fill='black')
ladder.save(ROOT/'checks'/'size-reverse-ladder.png')

# A same-size library peer shelf, not a trademark-clearance or competitor search.
board = Image.new('RGB', (1260, 570), 'white')
d = ImageDraw.Draw(board)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 17)
d.text((28, 20), 'CRAFT / SILHOUETTE SHELF — technique references, not claimed competitors', fill='black', font=font)
items = [(n, raw) for n, raw in marks.items()]
items += [(n, (SKILL/'assets/library/svg'/f'{n}.svg').read_text()) for n in ('pagekit', 'framer', 'npm-icon')]
for i, (name, raw) in enumerate(items):
    x = 35 + (i%3)*420
    y = 70 + (i//3)*245
    im = render(raw, 135)
    im.thumbnail((155, 170))
    board.paste(im, (x, y))
    d.text((x+170, y+40), name, fill='black', font=font)
board.save(ROOT/'checks'/'peer-shelf.png')

files = [str(ROOT/'concepts'/f'{n}.svg') for n in marks]
result = subprocess.run([sys.executable, str(SKILL/'scripts/svg_audit.py'), *files], text=True, capture_output=True)
(ROOT/'checks'/'svg-audit.txt').write_text(result.stdout + result.stderr)
assert result.returncode == 0, result.stderr

# Minimal repeatable structural and render-integrity checks, not aesthetic scoring.
allowed = {'svg', 'title', 'path', 'g', 'rect', 'circle', 'ellipse', 'polygon'}
for name in marks:
    root = ET.parse(ROOT/'concepts'/f'{name}.svg').getroot()
    assert root.attrib['viewBox'] in ('0 0 256 256', '0 0 344 256')
    for el in root.iter():
        assert el.tag.split('}')[-1] in allowed
        assert not any(k in el.attrib for k in ('filter', 'stroke', 'href'))
        if 'fill' in el.attrib:
            assert el.attrib['fill'] == '#000'
    for size in (16, 32, 64):
        for reverse in (False, True):
            p = ROOT/'checks'/f'{name}-{size}{"-reverse" if reverse else ""}.png'
            im = Image.open(p)
            assert im.width == size
            extrema = im.convert('L').getextrema()
            assert extrema[0] == 0 and extrema[1] == 255, (p, extrema)
            assert im.mode == 'RGB'
assert Image.open(ROOT/'concepts.png').size == (1500, 840)
print(result.stdout)
print('PASS: 3 final vector-only masters; 18 opaque size/reverse PNGs; overview 1500x840; no forbidden SVG artwork elements.')
