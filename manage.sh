#!/bin/bash

# Container management script
set -e

CONTAINER_NAME="shadcn-admin-dashboard"
IMAGE_NAME="your-dockerhub-username/shadcn-admin-dashboard"

show_help() {
    echo "Container Management Script for React Admin Dashboard"
    echo ""
    echo "Usage: ./manage.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start     - Start the container"
    echo "  stop      - Stop the container"
    echo "  restart   - Restart the container"
    echo "  logs      - Show container logs"
    echo "  status    - Show container status"
    echo "  update    - Pull latest image and restart"
    echo "  cleanup   - Remove stopped containers and unused images"
    echo "  health    - Check application health"
    echo "  shell     - Open shell in container"
    echo ""
}

start_container() {
    echo "🚀 Starting container..."
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        echo "⚠️  Container is already running"
    else
        docker-compose up -d
        echo "✅ Container started successfully"
        echo "🌐 Application available at: http://localhost:3000"
    fi
}

stop_container() {
    echo "🛑 Stopping container..."
    docker-compose down
    echo "✅ Container stopped"
}

restart_container() {
    echo "🔄 Restarting container..."
    stop_container
    start_container
}

show_logs() {
    echo "📋 Showing logs..."
    docker-compose logs -f --tail=100
}

show_status() {
    echo "📊 Container Status:"
    docker ps -f name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "💾 Image Info:"
    docker images $IMAGE_NAME --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}"
}

update_container() {
    echo "🔄 Updating to latest version..."
    docker-compose pull
    restart_container
    echo "✅ Update completed"
}

cleanup() {
    echo "🧹 Cleaning up..."
    echo "Removing stopped containers..."
    docker container prune -f
    echo "Removing unused images..."
    docker image prune -f
    echo "✅ Cleanup completed"
}

health_check() {
    echo "🏥 Checking application health..."
    if curl -f -s http://localhost:3000/health > /dev/null; then
        echo "✅ Application is healthy"
    else
        echo "❌ Application health check failed"
        exit 1
    fi
}

open_shell() {
    echo "🐚 Opening shell in container..."
    docker exec -it $CONTAINER_NAME /bin/sh
}

case "${1:-}" in
    start)
        start_container
        ;;
    stop)
        stop_container
        ;;
    restart)
        restart_container
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    update)
        update_container
        ;;
    cleanup)
        cleanup
        ;;
    health)
        health_check
        ;;
    shell)
        open_shell
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Unknown command: ${1:-}"
        echo ""
        show_help
        exit 1
        ;;
esac
