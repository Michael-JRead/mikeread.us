# Education institution logos

The Education section (`client/src/components/EducationSection.tsx`) loads an
institution's official logo from this folder and falls back to a brand-tinted
monogram tile if the file is absent.

Drop the official logo files here with these exact names:

| File         | Institution                | Served at              |
| ------------ | -------------------------- | ---------------------- |
| `sans.jpg`   | SANS Technology Institute  | `/assets/edu/sans.jpg` |
| `UM.png`     | University of Maryland     | `/assets/edu/UM.png`   |

Notes:
- The tile renders the image `object-contain` on a white chip (16×16 rounded
  tile), so both a transparent PNG and a JPG with a solid background read fine.
- To use different filenames/formats, update the `logo` path in the
  `INSTITUTIONS` map in `EducationSection.tsx`.
- These are the institutions' own marks, shown to denote genuinely earned
  degrees (nominative use). Use each school's official brand asset.
