FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for build)
RUN npm install

# Copy source code
COPY . .

# Set environment variable for build
ENV VITE_API_URL=https://resume-builder-ai-production.up.railway.app

# Build the app
RUN npm run build

# Expose port
EXPOSE $PORT

# Start the app
CMD ["npm", "start"]