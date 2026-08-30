# Education institution logos

The Education section (`client/src/components/EducationSection.tsx`) loads an
institution's official logo from this folder and falls back to a brand-tinted
monogram tile if the file is absent.

Drop the official logo files here with these exact names:

| File            | Institution                     | Served at              |
| --------------- | ------------------------------- | ---------------------- |
| `sans.png`      | SANS Technology Institute       | `/assets/edu/sans.png` |
| `umd.png`       | University of Maryland          | `/assets/edu/umd.png`  |

Notes:
- PNG (transparent background) or a square logo works best; the tile renders the
  image `object-contain` on a white chip (16×16 rounded tile).
- To use SVG or a different filename, update the `logo` path in the
  `INSTITUTIONS` map in `EducationSection.tsx`.
- These are the institutions' own marks, shown to denote genuinely earned
  degrees (nominative use). Use each school's official brand asset.
