// Sends back calendar reminders built by the page (passed in ?c= as base64url)
// as a real calendar feed, so iPhones show "Add to Calendar" instead of a file.
// Stores nothing; the data only contains step names and dates, never patient info.
export default async (req) => {
  const c = new URL(req.url).searchParams.get('c') || '';
  if (!c || c.length > 30000) return new Response('Bad request', { status: 400 });
  let text;
  try { text = Buffer.from(c.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'); }
  catch { return new Response('Bad request', { status: 400 }); }
  if (!text.startsWith('BEGIN:VCALENDAR') || !text.trimEnd().endsWith('END:VCALENDAR')) return new Response('Bad request', { status: 400 });
  return new Response(text, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="surgery-reminders.ics"',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
export const config = { path: '/api/ics' };
