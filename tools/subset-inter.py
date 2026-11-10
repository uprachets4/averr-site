"""Subset the Inter variable fonts to the glyphs this site actually uses.

The shipped InterVariable.woff2 was 344 kB and preloaded, so it raced the
entry chunk for the pipe: on a 1.6 Mbps link the 151 kB of JS took 1826 ms
to arrive instead of ~760 ms, and first contentful paint landed at 2992 ms.
Subsetting takes it to 77 kB.

Both variable axes (opsz, wght) are kept, so nothing about the type
changes. The only codepoints dropped are ones no page can render. The six
box-drawing and symbol characters that appear in source (box, triangle,
hamburger, multiplication X) were never in Inter either and already fall
back to a system face.

Run from the repo root; it rewrites public/fonts in place and is
idempotent. The unsubsetted originals are in history at 512bfd1.
"""

import os, sys
from fontTools.subset import main as subset_main

# Latin + Latin-Extended-A, plus every non-ASCII character that appears
# anywhere in the source. Both variable axes are kept.
UNICODES = "U+0020-007E,U+00A0-00FF,U+0100-017F,U+0192,U+2000-206F,U+20AC,U+2122,U+2190-21FF,U+2212,U+2215,U+2248,U+2264-2265,U+2500-257F,U+25A0-25FF,U+2605,U+2610-2612,U+2630,U+2713,U+2715,U+FEFF,U+FFFD"

for name in ("InterVariable", "InterVariable-Italic"):
    src = f"public/fonts/{name}.woff2"
    out = f"public/fonts/{name}.woff2"
    before = os.path.getsize(src)
    subset_main([
        src,
        f"--unicodes={UNICODES}",
        "--layout-features=kern,liga,calt,ccmp,locl,mark,mkmk,rlig,tnum,case",
        "--flavor=woff2",
        "--no-hinting",
        "--desubroutinize",
        f"--output-file={out}",
    ])
    after = os.path.getsize(out)
    print(f"{name}: {before/1024:.0f} kB -> {after/1024:.0f} kB  ({100*after/before:.0f}%)")
