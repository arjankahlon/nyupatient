# Patient Surgery Guide (NYU Langone Orthopedics)

Patient-facing perioperative information site. Static page in `public/index.html`
(all patient-facing text is in the CONTENT block at the top of its script), plus one
Netlify function (`netlify/functions/ics.mjs`) for adding reminders to Apple Calendar.

No patient names or medical records are collected. Surgeon, surgery and date are
optional and stored only in the patient's browser.

- Links/QR codes: `?s=lomas&p=dbr&d=2026-12-01` (see DEPLOY.txt for codes)
- Testing a date: `&today=MM-DD-YYYY`
- Local preview: `python3 serve.py` then open http://localhost:8775
