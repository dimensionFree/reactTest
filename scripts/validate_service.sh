#!/bin/bash
echo "Validating the service..."

# 检查应用是否在 localhost 上运行
echo "Checking if the application is running on localhost..."
until curl http://localhost:80; do
  echo "Application is not yet available. Waiting..."
  sleep 5
done

echo "Application is now running on localhost."
