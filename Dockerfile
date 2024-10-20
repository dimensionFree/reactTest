# 使用 Node.js 基础镜像进行构建
FROM 724758113747.dkr.ecr.ap-northeast-1.amazonaws.com/my_image_store:node-20 AS build
WORKDIR /app

# 复制 package.json 并安装依赖
COPY package.json package-lock.json ./
RUN npm install

# 复制项目文件并构建前端
COPY . ./

# 接收构建参数
ARG REACT_APP_TURNSTILE_SITEKEY
# 将传入的环境变量设置为 React 构建时使用的环境变量
ENV REACT_APP_TURNSTILE_SITEKEY=$REACT_APP_TURNSTILE_SITEKEY

# 输出环境变量（可选，调试时使用）
RUN echo "Building with REACT_APP_TURNSTILE_SITEKEY=$REACT_APP_TURNSTILE_SITEKEY"

RUN npm run build


# 使用 Nginx 作为生产环境服务器
FROM 724758113747.dkr.ecr.ap-northeast-1.amazonaws.com/my_image_store:nginx-alpine

# 复制构建生成的静态文件到 Nginx 的默认目录
COPY --from=build /app/build /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# 复制 SSL 证书（如果需要使用 HTTPS）
COPY ./ssl/cert.pem /etc/nginx/ssl/cert.pem
COPY ./ssl/cert.key /etc/nginx/ssl/cert.key

# 暴露 80 和 443 端口
EXPOSE 80 443

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
