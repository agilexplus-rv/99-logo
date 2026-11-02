#!/usr/bin/env python3
"""Regression check for the approved Forge+Ember and rounded-99 primary identity."""
import json,subprocess
from pathlib import Path
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parent.parent
script="const fs=require('fs'),vm=require('vm');const s={};vm.runInNewContext(fs.readFileSync('site/assets/theme.js','utf8'),s);console.log(JSON.stringify({t:s.Brand99.PACKAGES.forge.tokens,key:s.Brand99.current(),logo:s.Brand99.getLogo(),order:s.Brand99.LOGO_ORDER,svg:s.Brand99.LOGOS['ninetynine-the-wordmark']}));"
d=json.loads(subprocess.check_output(['node','-e',script],cwd=ROOT,text=True))
assert d['key']=='forge';assert d['logo']=='ninetynine-the-wordmark'
assert d['order']==['ninetynine-the-wordmark','the-wordmark']
assert 'Inter Tight' in d['t']['--font-display'];assert 'Inter Tight' in d['t']['--font-body']
assert d['t']['--ink']=='#0C1013';assert d['t']['--accent']=='#C9973F'
svg=(ROOT/'site/assets/ninetynine-the-wordmark.svg').read_text().strip();assert svg==d['svg']
r=ET.fromstring(svg);ns='{http://www.w3.org/2000/svg}'
assert [x.get('data-weight') for x in r.findall('.//'+ns+'path') if x.get('data-weight')]==['400','750']
for p in (ROOT/'site/site').glob('*.html'):
    text=p.read_text();assert '99.system' not in text;assert 'contact@ninetynine.eu' in text;assert 'fonts.googleapis.com' not in text
for f in ['site/index.html','site/collateral.html']:
    text=(ROOT/f).read_text();assert '99.system' not in text;assert 'ninetynine.eu' in text
print('PASS: approved primary logo, compact alternate, Forge colours, Ember typography, domain and offline fonts')
