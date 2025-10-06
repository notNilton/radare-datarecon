# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to leverage Docker cache
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install project dependencies using pnpm
RUN npm install -g pnpm
RUN pnpm install

# Copy the rest of the application source code
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["pnpm", "run", "dev", "--host"]