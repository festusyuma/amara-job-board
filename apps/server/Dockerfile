ARG FUNCTION_DIR="/var/task"

# Set up the base image
FROM node:20-buster AS build-image

# Include global arg in this stage of the build
ARG FUNCTION_DIR

WORKDIR ${FUNCTION_DIR}

# install dependencies
COPY dist/package.json ./
COPY dist/package-lock.json ./

RUN npm i --omit=dev --loglevel verbose --no-audit

# Copy the function code
COPY dist/ .

FROM node:22-alpine

# by default npm writes logs under /home/.npm and Lambda fs is read-only
ENV NPM_CONFIG_CACHE=/tmp/.npm

# Include global arg in this stage of the build
ARG FUNCTION_DIR

# Set working directory to function root directory
WORKDIR ${FUNCTION_DIR}

# Copy in the built dependencies
COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

