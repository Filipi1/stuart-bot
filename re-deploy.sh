#!/bin/bash

docker-compose down

if [ -n "$(docker images -q $DOCKER_REPO)" ]; then
    docker rmi $(docker images -q $DOCKER_REPO)
fi

IMAGE_TAG=$IMAGE_TAG docker-compose up -d