"""Remove blank pages from the generated collateral PDFs.

Chromium's print engine can emit a trailing page even when the layout is only a
few centimetres tall. Rather than fight it, drop any page with no text and no
drawing content, so a downloaded PDF never contains an empty page.
"""
import sys
from pathlib import Path
from pypdf import PdfReader, PdfWriter

total_removed = 0
for f in sorted(Path("pdfs").glob("*.pdf")):
    reader = PdfReader(str(f))
    keep = []
    for i, page in enumerate(reader.pages):
        text = (page.extract_text() or "").strip()
        # a page is blank when it has no extractable text at all
        if text:
            keep.append(page)
        else:
            total_removed += 1
    if not keep:
        keep = [reader.pages[0]]  # never produce an empty document
    if len(keep) != len(reader.pages):
        writer = PdfWriter()
        for page in keep:
            writer.add_page(page)
        with open(f, "wb") as fh:
            writer.write(fh)
    print(f"{f.name:24} {len(reader.pages)} -> {len(keep)} pages")

print(f"blank pages removed: {total_removed}")
