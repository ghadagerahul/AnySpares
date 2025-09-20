# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.16.0

################################################################################
# Base image
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

################################################################################
# Dependencies stage
FROM base AS deps
# Copy package files and install prod dependencies
COPY package*.json ./
RUN npm ci --omit=dev

################################################################################
# Build stage
FROM base AS build
# Copy package files and install all dependencies (including dev for build)
COPY package*.json ./
RUN npm ci
# Copy source code
COPY . .
# Build Angular app
RUN npm run build -- --configuration production

################################################################################
# Production stage
FROM node:alpine AS final
WORKDIR /usr/src/app

# Install a small static server globally
RUN npm install -g serve

# Copy built app from build stage
COPY --from=build /usr/src/app/dist/anyspares-app/browser ./dist

# Expose port
EXPOSE 4211

# Run the app using serve
CMD ["serve", "-s", "dist", "-l", "4211"]
