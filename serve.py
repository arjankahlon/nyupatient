# Local preview server (not deployed): no caching, plus a stand-in for the
# Netlify function at /api/ics so the calendar button works locally.
import http.server, functools, sys, os, base64
from urllib.parse import urlparse, parse_qs

class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
    def _ics(self, body):
        u = urlparse(self.path)
        c = parse_qs(u.query).get('c', [''])[0]
        try:
            text = base64.urlsafe_b64decode(c + '=' * (-len(c) % 4)).decode('utf-8')
            assert text.startswith('BEGIN:VCALENDAR')
        except Exception:
            self.send_error(400); return
        data = text.encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'text/calendar; charset=utf-8')
        self.send_header('Content-Disposition', 'inline; filename="surgery-reminders.ics"')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        if body: self.wfile.write(data)
    def do_GET(self):
        if urlparse(self.path).path.lower() == '/qr':  # mirrors the Netlify redirect
            self.send_response(301); self.send_header('Location', '/link/'); self.end_headers(); return
        if urlparse(self.path).path == '/api/ics': return self._ics(True)
        super().do_GET()
    def do_HEAD(self):
        if urlparse(self.path).path == '/api/ics': return self._ics(False)
        super().do_HEAD()

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public')
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8775
http.server.ThreadingHTTPServer(('127.0.0.1', port), functools.partial(H, directory=root)).serve_forever()
