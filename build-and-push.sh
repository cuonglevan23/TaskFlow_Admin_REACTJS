#!/bin/bash

# Build and Push Script for Docker Hub
set -e

# Configuration
DOCKER_USERNAME="your-dockerhub-username"
IMAGE_NAME="shadcn-admin-dashboard"
VERSION=$(node -p "require('./package.json').version")
LATEST_TAG="latest"

echo "🐳 Building Docker image for React Admin Dashboard..."

# Build the Docker image
echo "Building image: ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
docker build -t "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}" .
docker build -t "${DOCKER_USERNAME}/${IMAGE_NAME}:${LATEST_TAG}" .

echo "✅ Docker image built successfully!"

# Login to Docker Hub (you'll need to run this manually first time)
echo "🔐 Please ensure you're logged in to Docker Hub:"
echo "Run: docker login"

# Ask for confirmation before pushing
read -p "Do you want to push to Docker Hub? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Pushing to Docker Hub..."
    docker push "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
    docker push "${DOCKER_USERNAME}/${IMAGE_NAME}:${LATEST_TAG}"
    echo "✅ Images pushed successfully!"
    echo "📦 Available at: https://hub.docker.com/r/${DOCKER_USERNAME}/${IMAGE_NAME}"
else
    echo "❌ Push cancelled."
fi

echo "🎉 Build process completed!"
echo "🏃 To run locally: docker run -p 3000:80 ${DOCKER_USERNAME}/${IMAGE_NAME}:${LATEST_TAG}"
