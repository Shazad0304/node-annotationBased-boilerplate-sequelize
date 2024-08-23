# build stage
FROM node:18-alpine3.18 as build-stage

WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install yarn globally
RUN npm install -g yarn --force

# Install Python for node-gyp
RUN apk add g++ make py3-pip

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

EXPOSE 80

# Production
FROM build-stage as prod-build-stage
ENV PORT=80
CMD ["npm", "run", "start:prod"]