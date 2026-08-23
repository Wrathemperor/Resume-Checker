# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install base dependencies
RUN npm install

# Install the UI/UX libraries we added earlier 
RUN npm install lucide-react clsx tailwind-merge react react-dom react-router-dom axios @tanstack/react-query
RUN npm install -D @tailwindcss/postcss postcss autoprefixer @types/react @types/react-dom @vitejs/plugin-react typescript

# Copy all frontend files
COPY . .

# Build the React/Vite app for production
RUN npm run build

# Serve Stage
FROM nginx:alpine
# Copy the built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy our Nginx config (SPA routing + API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
