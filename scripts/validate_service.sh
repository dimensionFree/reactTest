#!/bin/bash
echo "Validating the service..."

# 检查应用是否在 localhost:443 上运行
echo "Checking if the application is running on localhost:443..."
until curl http://localhost:443; do
  echo "Application is not yet available. Waiting..."
  sleep 5
done

echo "Application is now running on localhost:443."
