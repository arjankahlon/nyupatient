/* ============================================================
   CATALOG: surgeons, body areas, surgeries and studies.
   Shared by the patient guide (/) and the Link Generator (/link).
   Link/QR params: ?s=<surgeon>&a=<area>&p=<surgery>&st=<study>&d=YYYY-MM-DD
   ============================================================ */

const SURGEONS = {
  lomas: {
    name: 'Dr. Lomas',
    website: 'https://lomasortho.com',
    packet: 'packets/lomas-elbow.pdf',
    opDays: 'Tuesdays and Fridays',
    contacts: [
      { name: 'Surgical scheduling', who: 'Anetam Kaur', role: 'Insurance, forms, and urgent questions', phone: '646-460-8723' },
      { name: 'Office', who: 'Lorenzo Hayes', role: 'NYU Langone Orthopedic Center', phone: '646-501-7223' },
    ],
    sites: [
      { name: 'NYU Langone Orthopedic Hospital', addr: '301 E 17th St' },
      { name: 'Essex Crossing Surgical Center', addr: '171 Delancey St' },
      { name: '38th Street Surgical Center', addr: '339 E 38th St' },
    ],
  },
};

const AREAS = {
  elbow: { label: 'Elbow' },
};

// kind: 'scope' (arthroscopy) or 'open'; unknown surgery shows both versions.
const PROCEDURES = {
  scope: { label: 'Elbow arthroscopy', area: 'elbow', kind: 'scope' },
  dbr:   { label: 'Distal biceps repair', area: 'elbow', kind: 'open' },
  ucl:   { label: 'UCL repair', area: 'elbow', kind: 'open' },
  unt:   { label: 'Ulnar nerve transposition', area: 'elbow', kind: 'open' },
  epi:   { label: 'Epicondylectomy', area: 'elbow', kind: 'open' },
  open:  { label: 'Other open elbow surgery', area: 'elbow', kind: 'open' },
};

// Research studies, listed by body area (not by surgery). None yet.
// Example: xyz: { label: 'XYZ Study', areas: ['elbow'] },
const STUDIES = {
};

const LINK_KEYS = ['s', 'a', 'p', 'st', 'd'];
const procsFor = area => Object.entries(PROCEDURES).filter(([, v]) => !area || v.area === area);
const studiesFor = area => Object.entries(STUDIES).filter(([, v]) => !area || v.areas.includes(area));

// Keeps a details object consistent: unknown values dropped, area follows the surgery.
function cleanDetails(x) {
  const o = { s: '', a: '', p: '', st: '', d: '', ...x };
  if (!SURGEONS[o.s]) o.s = '';
  if (!AREAS[o.a]) o.a = '';
  if (!PROCEDURES[o.p] || (o.a && PROCEDURES[o.p].area !== o.a)) o.p = '';
  if (o.p) o.a = PROCEDURES[o.p].area;
  if (!STUDIES[o.st] || (o.a && !STUDIES[o.st].areas.includes(o.a))) o.st = '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(o.d || '')) o.d = '';
  return o;
}
