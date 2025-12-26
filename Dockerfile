FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files (if any) first.
COPY package*.json ./

# Install all dependencies.
RUN npm install

# Copy the rest of your application code into the container.
COPY . .

# Run the build script to compile your application.
RUN npm run build

# Copy the script entrypoint and make sure it is executable.
COPY entrypoint.sh .
RUN chmod +x ./entrypoint.sh

# Expose the port that will be used by the application.
EXPOSE 5005

# Define volumes for D1 data and media to be persistent.
VOLUME ["/app/.wrangler/d1", "/app/media"]

# Set entrypoint to our script.
ENTRYPOINT ["./entrypoint.sh"]