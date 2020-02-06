From node:12-alpine

# Set a term for terminal inside the container, can't clear without it
ENV TERM xterm-256color

# Prefix path with global node_modules folder
# This allows npm package binaries to be available everywhere
ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /usr/src/app

# Install project dependencies
COPY package*.json ./
RUN npm install && npm cache clean --force

# Copy over project files
COPY . /usr/src/app

# Expose required ports
EXPOSE 8080

#CMD ["npm", "run", "serve"]
