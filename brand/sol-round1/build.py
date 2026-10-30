"""Reproducible concept drawings and CairoSVG-only inspection boards."""
from pathlib import Path
import html
import io
import xml.etree.ElementTree as ET
import cairosvg
from PIL import Image, ImageOps, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
for folder in ('concepts', 'revisions', 'renders', 'checks'):
    (ROOT / folder).mkdir(exist_ok=True)


def svg(title, body, vb='0 0 256 256'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-labelledby="title"><title id="title">99 — {html.escape(title)}</title>{body}</svg>\n'


def nine(x=0, y=0, scale=1, color='#000', version=1):
    # Custom numeral: circular bowl, open swept descender, flat oblique terminal.
    tail = 'C74 122 58 137 28 146 L36 166 C81 154 104 120 104 65' if version == 1 else 'C73 119 55 136 24 144 L32 166 C79 154 104 120 104 65'
    hole = 'M52 32 C37 32 28 42 28 56 C28 70 37 79 52 79 C67 79 78 69 78 55 C78 41 68 32 52 32 Z' if version < 3 else 'M52 31 C36 31 27 41 27 56 C27 71 37 80 52 80 C68 80 79 70 79 55 C79 40 69 31 52 31 Z'
    return f'<path fill="{color}" fill-rule="evenodd" transform="translate({x} {y}) scale({scale})" d="M52 8 C23 8 4 28 4 56 C4 84 22 102 48 102 C60 102 70 98 77 90 {tail} V57 C104 27 84 8 52 8 Z {hole}"/>'


def artwork(version):
    yy = 20 if version < 3 else 15
    a = svg('Cut & Curve', nine(28, yy, 1.3, version=version) + nine(188 if version == 1 else 181, yy, 1.3, version=version), '0 0 344 256')
    # Two negative numerals open into the baseline of an architectural slab.
    # Nested subpaths restore true counter islands without painted-over holes.
    bpaths = 'M24 28 H232 V228 H24 Z '
    for x in ((42, 140) if version < 3 else (40, 140)):
        w = 74 if version == 1 else 76
        bpaths += f'M{x} 52 H{x+w} V228 H{x+w-24} V142 H{x} Z M{x+24} 76 H{x+w-24} V118 H{x+24} Z '
    b = svg('Counterform', f'<path fill="#000" fill-rule="evenodd" d="{bpaths}"/>')
    # Two positive numerals arranged diagonally; not a single-9 shorthand.
    if version == 1:
        c = svg('Joint', nine(12, 5, 1, version=version) + nine(106, 100, 1, version=version))
    else:
        # Rounded architectural numerals share an upright at the diagonal junction.
        # Separate filled paths overlap only outside their transparent counters.
        def joint_nine(x, y):
            r = 24 if version == 2 else 30
            inset = 24 if version == 2 else 26
            return f'<path fill="#000" fill-rule="evenodd" d="M{x+r} {y} H{x+108-r} Q{x+108} {y} {x+108} {y+r} V{y+140} H{x+52} V{y+116} H{x+84} V{y+92} H{x+r} Q{x} {y+92} {x} {y+92-r} V{y+r} Q{x} {y} {x+r} {y} Z M{x+inset} {y+24} H{x+84} V{y+68} H{x+inset} Z"/>'
        c = svg('Joint', joint_nine(22 if version == 2 else 32, 20) + joint_nine(106 if version == 2 else 116, 96))
    return {'a-cut-and-curve': a, 'b-counterform': b, 'c-joint': c}


def render(raw, width, bg='#fff'):
    return Image.open(io.BytesIO(cairosvg.svg2png(bytestring=raw.encode(), output_width=width, background_color=bg))).convert('RGB')


def inspection(version, marks):
    # Actual-size tests plus large reverse, mirrored and rotated readings.
    board = Image.new('RGB', (1320, 1050), 'white')
    d = ImageDraw.Draw(board)
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18)
    small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
    for i, (name, raw) in enumerate(marks.items()):
        x = 30 + i*430
        d.text((x, 18), f'{name} / v{version}', fill='black', font=font)
        im = render(raw, 390)
        board.paste(im, (x, 60))
        for s, xx in ((64, x), (32, x+115), (16, x+200)):
            tiny = render(raw, s)
            board.paste(tiny, (xx, 470 + 64-tiny.height))
            d.text((xx, 544), f'{s}px wide', fill='black', font=small)
        rev = raw.replace('fill="#000"', 'fill="#fff"')
        im = render(rev, 250, '#000')
        board.paste(im, (x, 585))
        d.text((x, 845), 'White on black / same geometry', fill='black', font=small)
        im = render(raw, 130)
        board.paste(ImageOps.mirror(im), (x, 888))
        board.paste(im.rotate(180), (x+175, 888))
        d.text((x, 1025), 'Mirror                         180 degrees', fill='black', font=small)
    path = ROOT/'renders'/f'inspection-v{version}.png'
    board.save(path)
    return path


def build(version):
    marks = artwork(version)
    for name, raw in marks.items():
        (ROOT/'revisions'/f'{name}-v{version}.svg').write_text(raw)
        render(raw, 600).save(ROOT/'renders'/f'{name}-v{version}.png')
    print(inspection(version, marks))
    return marks

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('version', type=int)
    args = parser.parse_args()
    build(args.version)
