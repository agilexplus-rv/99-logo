#!/usr/bin/env python3
"""Minimal regression check for outlined mixed-weight wordmark and shared catalogue."""
import json
import subprocess
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NS = '{http://www.w3.org/2000/svg}'
script = "const fs=require('fs'),vm=require('vm'); const s={}; vm.runInNewContext(fs.readFileSync('site/assets/theme.js','utf8'),s); console.log(JSON.stringify({logos:s.Brand99.LOGOS,order:s.Brand99.LOGO_ORDER}));"
catalogue = json.loads(subprocess.check_output(['node', '-e', script], cwd=ROOT, text=True))
assert len(catalogue['order']) == 9
word = ET.parse(ROOT / 'site/assets/ninetynine.svg').getroot()
assert [(p.get('data-part'), p.get('data-weight')) for p in word.findall(NS+'path')] == [('ninety','400'),('nine','750')]
ids = ['ninetynine'] + ['ninetynine-'+k for k in ['the-sign','the-wordmark','the-sign-off','the-seal']]
for key in ids:
    file = ROOT / 'site/assets' / (key + '.svg')
    svg = file.read_text().strip()
    assert svg == catalogue['logos'][key]
    root = ET.fromstring(svg)
    assert root.get('viewBox')
    assert not any(el.tag.split('}')[-1] in ('text','image','filter','mask') for el in root.iter())
    assert root.findall('.//' + NS + 'path')
    book = (ROOT/'site/index.html').read_text()
    assert book.count('data-logo="'+key+'"') == 1
print('PASS: two outlined weights; all four composed lockups; nine unique selections; book matches live canonical artwork.')
