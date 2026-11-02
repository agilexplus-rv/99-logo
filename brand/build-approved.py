#!/usr/bin/env python3
"""Assemble approved brand-system assets, portable HTML guidelines and download archive."""
import json, re, subprocess, shutil, zipfile
from pathlib import Path
import xml.etree.ElementTree as ET
import cairosvg
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'brand-system'; SITE=ROOT/'site'
OUT.mkdir(exist_ok=True)
script="const fs=require('fs'),vm=require('vm');const x={};vm.runInNewContext(fs.readFileSync('site/assets/theme.js','utf8'),x);console.log(JSON.stringify({tokens:x.Brand99.PACKAGES.forge.tokens,logo:x.Brand99.LOGOS['ninetynine-the-wordmark'],symbol:x.Brand99.LOGOS['the-wordmark']}));"
data=json.loads(subprocess.check_output(['node','-e',script],cwd=ROOT,text=True))
tokens=data['tokens'];(OUT/'tokens.json').write_text(json.dumps({'name':'ninetynine','domain':'ninetynine.eu','email':'contact@ninetynine.eu','logo':'rounded 99 + mixed-weight ninetynine','tokens':tokens},indent=2)+'\n')
css=':root{\n'+''.join(f'  {k}: {v};\n' for k,v in tokens.items())+'}\n'
(OUT/'tokens.css').write_text(css)
(OUT/'logos').mkdir(exist_ok=True)
for name,raw in [('primary',data['logo']),('symbol',data['symbol'])]:
    if 'xmlns=' not in raw:raw=raw.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ',1)
    (OUT/'logos'/f'{name}.svg').write_text(raw)
    for variant,color in [('ink','#0C1013'),('brass','#C9973F'),('white','#F4F2ED')]:
        svg=raw.replace('currentColor',color)
        (OUT/'logos'/f'{name}-{variant}.svg').write_text(svg)
        cairosvg.svg2png(bytestring=svg.encode(),write_to=str(OUT/'logos'/f'{name}-{variant}.png'),output_width=1600 if name=='primary' else 512)
    if name=='symbol':(SITE/'assets/favicon.svg').write_text(raw.replace('currentColor','#C9973F'))
# Social card uses only approved vector logo.
primary=data['logo']; root=ET.fromstring(primary); art=''.join(ET.tostring(c,encoding='unicode') for c in root)
og='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0C1013"/><g color="#C9973F" transform="translate(93 180)">'+art+'</g><rect x="94" y="500" width="1012" height="2" fill="#C9973F"/></svg>'
cairosvg.svg2png(bytestring=og.encode(),write_to=str(SITE/'og-image.png'))
# Small native Markdown renderer: headings, lists, paragraphs and tables; no dependency or remote runtime.
from html import escape
def inline(s):
    s=escape(s)
    s=re.sub(r'`([^`]+)`',r'<code>\1</code>',s)
    s=re.sub(r'\*\*([^*]+)\*\*',r'<strong>\1</strong>',s)
    s=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',r'<a href="\2">\1</a>',s)
    return s

def render(md):
    out=[]; table=False; ul=False
    for line in md.splitlines():
        if line.startswith('|'):
            if not table:out.append('<table>');table=True
            cells=[c.strip() for c in line.strip('|').split('|')]
            if all(re.fullmatch(r'[:\- ]+',c) for c in cells):continue
            out.append('<tr>'+''.join('<td>'+inline(c)+'</td>' for c in cells)+'</tr>');continue
        if table:out.append('</table>');table=False
        if line.startswith('- '):
            if not ul:out.append('<ul>');ul=True
            out.append('<li>'+inline(line[2:])+'</li>');continue
        if ul:out.append('</ul>');ul=False
        match=re.match(r'^(#{1,4}) (.*)',line)
        if match:
            n=len(match[1]);out.append(f'<h{n}>'+inline(match[2])+f'</h{n}>')
        elif line.strip():out.append('<p>'+inline(line.lstrip('> '))+'</p>')
    if table:out.append('</table>')
    if ul:out.append('</ul>')
    return '\n'.join(out)
style='''*{box-sizing:border-box}body{margin:0;background:#0C1013;color:#F4F2ED;font:17px/1.65 "Inter Tight",Arial,sans-serif}main{max-width:1000px;margin:auto;padding:60px 28px}h1,h2,h3{letter-spacing:-.035em;line-height:1.12}h1{font-size:3.5rem}h2{font-size:2rem;margin-top:2.5em}h3{margin-top:2em}a{color:#C9973F}code{font: .82em "JetBrains Mono",monospace}table{width:100%;border-collapse:collapse;font-size:.85em}td{padding:10px;border-bottom:1px solid #7f848966;vertical-align:top}tr:first-child{font-weight:600;color:#C9973F}.hero-logo{width:min(520px,100%);color:#C9973F}.toolbar{display:flex;gap:16px;flex-wrap:wrap;padding:18px 0;border-bottom:1px solid #7f848944}.toolbar a{padding:8px 0}.notice{padding:18px;border:1px solid #7f848966;background:#141A1E}@media(max-width:600px){main{padding:30px 18px}h1{font-size:2.5rem}table{display:block;overflow:auto}}@media print{@page{size:A4;margin:18mm}body{background:white;color:#0C1013;font-size:10pt}main{padding:0;max-width:none}a{color:#88692D}.toolbar,.notice{display:none}h1{font-size:28pt}h2{font-size:18pt;break-after:avoid}h3{break-after:avoid}p,li,tr{break-inside:avoid}table{font-size:8pt}.hero-logo{color:#0C1013}tr:first-child{color:#88692D}}'''
body=render((OUT/'GUIDELINES.md').read_text())
body=body.replace('href="../site/assets/', 'href="assets/')
intro='<div class="hero-logo">'+data['logo']+'</div><nav class="toolbar"><a href="site/home">Website preview</a><a href="collateral">Collateral</a><a href="downloads/brand-guidelines.pdf">Guidelines PDF</a><a href="downloads/brand-system.zip">Claude brand-system ZIP</a><a href="downloads/company-activities.pdf">Company activities PDF</a></nav><p class="notice">Approved identity: Forge colours + Ember fonts · ninetynine.eu. Legal and company-registration details remain fictional pending confirmation. Domain/DNS and mailboxes are not provisioned by this handoff.</p>'
head='<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Brand guidelines — ninetynine</title><meta name="description" content="The approved ninetynine brand system: Forge colours, Inter Tight typography, rounded 99 symbol and mixed-weight wordmark."><link rel="icon" href="assets/favicon.svg"><meta property="og:title" content="ninetynine — Brand guidelines"><meta property="og:description" content="One to ninety-nine. We start at one."><meta property="og:image" content="https://ninetynine.eu/og-image.png"><link rel="stylesheet" href="assets/fonts/fonts.css">'
(SITE/'index.html').write_text('<!doctype html><html lang="en"><head>'+head+'<style>'+style+'</style></head><body><main>'+intro+body+'</main></body></html>')
company=render((OUT/'COMPANY-ACTIVITIES.md').read_text())
(SITE/'company-activities.html').write_text('<!doctype html><html lang="en"><head>'+head.replace('Brand guidelines — ninetynine','Company activities — 99 Invest Ltd')+'<style>'+style+'</style></head><body><main>'+company+'</main></body></html>')
# Offline handoff documents retain local font and logo references.
(OUT/'guidelines.html').write_text((SITE/'index.html').read_text().replace('href="assets/fonts/','href="fonts/').replace('href="assets/favicon.svg"','href="logos/symbol-brass.svg"'))
print('Built approved logo variants, tokens, social card, guidelines and registration description HTML')
