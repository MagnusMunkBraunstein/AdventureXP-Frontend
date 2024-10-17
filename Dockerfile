# Use the official Nginx image
FROM nginx:alpine

# Copy the custom Nginx configuration to replace the default one
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy your static resources (HTML, JS, CSS) into the Nginx container
COPY ./target/classes/static/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80
