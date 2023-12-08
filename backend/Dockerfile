# Use the official Node.js 18 image.
# https://hub.docker.com/_/node
FROM node:18-alpine

# Create app directory (this is the working directory for your application)
WORKDIR /usr/src/app

# Install Strapi globally
RUN npm install -g strapi

# Copy package.json AND package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Build the Strapi project (build the admin panel frontend)
RUN yarn build

# Expose the port Strapi will run on
EXPOSE 1337

# Run the Strapi application
CMD ["yarn", "start"]
