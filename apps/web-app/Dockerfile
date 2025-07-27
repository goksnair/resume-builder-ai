FROM node:18-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy the pre-built dist folder
COPY dist ./dist

# Expose port
EXPOSE $PORT

# Serve the static files
CMD ["serve", "dist", "-s", "-p", "$PORT"]