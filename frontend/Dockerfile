# Dockerfile for Next.js frontend
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json, package-lock.json/yarn.lock
COPY package.json .
COPY yarn.lock .

# Install dependencies using yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
