FROM python:3.11-alpine

WORKDIR /app

# Copy the pre-built dist folder
COPY dist ./

# Create a simple server script
RUN echo 'import http.server\nimport socketserver\nimport os\n\nPORT = int(os.environ.get("PORT", 8080))\n\nclass MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):\n    def end_headers(self):\n        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")\n        self.send_header("Pragma", "no-cache")\n        self.send_header("Expires", "0")\n        super().end_headers()\n\nwith socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:\n    print(f"Server running on port {PORT}")\n    httpd.serve_forever()' > server.py

# Expose port
EXPOSE $PORT

# Start the server
CMD ["python", "server.py"]