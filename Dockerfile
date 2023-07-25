# Use the official Node.js LTS image as the base image
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port on which Nest.js runs
EXPOSE 3000

# Start the Nest.js application
CMD ["npm", "start"]
