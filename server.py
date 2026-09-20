import os
from http.server import SimpleHTTPRequestHandler, HTTPServer

DIST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")

class SPARequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def do_GET(self):
        # Serve index.html for SPA client-side routes unless it's a static file asset
        req_path = self.translate_path(self.path)
        if not os.path.exists(req_path) or (os.path.isdir(req_path) and self.path != "/"):
            self.path = "/index.html"
        return super().do_GET()

if __name__ == "__main__":
    port = 3000
    server_address = ("0.0.0.0", port)
    httpd = HTTPServer(server_address, SPARequestHandler)
    print(f"EAD-DAWMS Production SPA Server running on http://localhost:{port}")
    httpd.serve_forever()
