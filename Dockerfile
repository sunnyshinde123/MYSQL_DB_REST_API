# OS with ENV (BASE IMAGE)
FROM node:latest

# WORKING DIRECTORY
WORKDIR /app

# Copy Package.json and Package-lock.json
COPY package*.json /app/

# INSTALL Libraries & Dependencies
RUN npm install

# Copy the Code
COPY . .

# Env Varible for to form connection with mysql
ENV DB_HOST=mysql-container
ENV DB_USER=root
ENV DB_PASSWORD=admin
ENV DB_DATABASE=delta_app

# EXPOSE
EXPOSE 6060

# Start the Server
CMD ["node", "index.js"]
