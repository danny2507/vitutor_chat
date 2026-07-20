#!/usr/bin/env python3
import http.server
import socketserver
import urllib.request
import urllib.error
import json
import os
import sys
import shutil

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

class ViTutorProxyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Initialize SimpleHTTPRequestHandler to serve from the correct directory
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_OPTIONS(self):
        # Support CORS for local development testing
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                req_body = json.loads(post_data.decode('utf-8'))
            except Exception as e:
                self.send_error_json(400, f"Malformed JSON payload: {str(e)}")
                return
            
            endpoint = req_body.get('endpoint', 'https://ws.gvlab.org/fablab/ura/llama/haystack/')
            model = req_body.get('model', 'vitutor-qwen3-8b-full-sft-dpo-grpo')
            messages = req_body.get('messages', [])
            temperature = req_body.get('temperature', 0.6)
            max_tokens = req_body.get('max_tokens', 2048)
            stream = req_body.get('stream', True)
            api_key = req_body.get('apiKey', '')

            # Resolve full target API URL
            # Ensure the endpoint points to chat completions
            target_url = endpoint.rstrip('/')
            if not target_url.endswith('/v1/chat/completions') and not target_url.endswith('/chat/completions'):
                if target_url.endswith('/v1'):
                    target_url += '/chat/completions'
                else:
                    target_url += '/v1/chat/completions'

            # Build outgoing payload
            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "stream": stream
            }

            headers = {
                'Content-Type': 'application/json',
                'User-Agent': 'ViTutor-Chat-UI/1.0'
            }
            if api_key:
                headers['Authorization'] = f'Bearer {api_key}'

            # Make request to remote model endpoint
            req = urllib.request.Request(
                target_url,
                data=json.dumps(payload).encode('utf-8'),
                headers=headers,
                method='POST'
            )

            try:
                # Set timeout to 120 seconds for long mathematical reasoning traces
                with urllib.request.urlopen(req, timeout=120) as response:
                    self.send_response(response.status)
                    
                    # Forward key headers
                    self.send_header('Access-Control-Allow-Origin', '*')
                    for header_name in ['Content-Type', 'Cache-Control', 'Connection']:
                        header_val = response.headers.get(header_name)
                        if header_val:
                            self.send_header(header_name, header_val)
                    self.end_headers()

                    # Stream chunks back to client
                    while True:
                        chunk = response.read(1024)
                        if not chunk:
                            break
                        self.wfile.write(chunk)
                        self.wfile.flush()
                        
            except urllib.error.HTTPError as e:
                # Forward remote API errors directly to the frontend for debugging
                try:
                    err_content = e.read().decode('utf-8')
                except:
                    err_content = str(e)
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(err_content.encode('utf-8'))
                
            except Exception as e:
                # Generic proxy failure
                self.send_error_json(500, f"Error proxying request to model endpoint: {str(e)}")
        else:
            # Fallback to serving static file
            super().do_POST()

    def send_error_json(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        err_response = {"error": {"message": message, "type": "proxy_error"}}
        self.wfile.write(json.dumps(err_response).encode('utf-8'))

def main():
    # Double check that the logo is in the same directory, if not try to copy it from parent
    logo_filename = "01_logobachkhoasang.png"
    dest_logo_path = os.path.join(DIRECTORY, logo_filename)
    if not os.path.exists(dest_logo_path):
        src_logo_path = os.path.join(os.path.dirname(DIRECTORY), logo_filename)
        if os.path.exists(src_logo_path):
            shutil.copy(src_logo_path, dest_logo_path)
            print(f"Copied Bach Khoa logo to: {dest_logo_path}")

    # Set up a threaded server so one long streaming chat does not block others.
    with ThreadingHTTPServer(("", PORT), ViTutorProxyHandler) as httpd:
        print("="*60)
        print(f" ViTutor Chat Server running locally at: http://localhost:{PORT}/")
        print(f" Default Model Endpoint: https://ws.gvlab.org/fablab/ura/llama/haystack/")
        print(" Concurrent requests: enabled")
        print(" Press Ctrl+C to stop.")
        print("="*60)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down ViTutor Chat Server.")
            sys.exit(0)

if __name__ == "__main__":
    main()
