#!/bin/bash
echo "Stopping and removing Docker containers containing the keyword 'frontend'..."

# 停止名称中包含 'frontend' 的容器
docker ps -q --filter "name=frontend" | xargs -r docker stop

# 删除名称中包含 'frontend' 的容器
docker ps -a -q --filter "name=frontend" | xargs -r docker rm

echo "Containers with the keyword 'frontend' have been stopped and removed (if any)."
