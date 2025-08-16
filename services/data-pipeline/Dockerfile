ARG FUNCTION_DIR="/var/task"

# Set up the base image
FROM node:20-bookworm AS build-image

# Install build dependencies
RUN apt-get update && \
    apt-get install -y \
    g++ \
    make \
    cmake \
    unzip \
    libcurl4-openssl-dev

ARG FUNCTION_DIR
WORKDIR ${FUNCTION_DIR}

COPY dist/package.json ./
COPY dist/package-lock.json ./

RUN npm i --omit=dev --loglevel verbose --no-audit
RUN npm i aws-lambda-ric --omit=dev --no-audit --loglevel verbose

COPY dist/ .

FROM node:22-alpine

ARG FUNCTION_DIR
WORKDIR ${FUNCTION_DIR}

COPY --from=build-image ${FUNCTION_DIR} ./

ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
CMD ["main.handler"]
