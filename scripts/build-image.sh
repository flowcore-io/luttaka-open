#!/bin/bash

SPLIT_APP_NAME=$(node -p -e "require('./package.json').name")
SPLIT_VERSION=$(node -p -e "require('./package.json').version")

docker buildx build --no-cache -t ${SPLIT_APP_NAME}:${SPLIT_VERSION} -t ${SPLIT_APP_NAME}:latest .

docker image prune -f