# 🚀 Docker & CI/CD Setup Guide

## 📦 Files Created

### Docker Files
- `Dockerfile` - Multi-stage build với Node.js và Nginx
- `docker-compose.yml` - Container orchestration
- `nginx.conf` - Nginx configuration với security headers
- `.dockerignore` - Optimized build context
- `.env.production` - Production environment variables

### Scripts
- `build-and-push.sh` - Build và push image lên Docker Hub
- `manage.sh` - Container management script

### CI/CD
- `.github/workflows/docker-build.yml` - Build và push tự động
- `.github/workflows/deploy.yml` - Production deployment

## 🛠️ Setup Instructions

### 1. Docker Hub Setup
```bash
# 1. Đăng ký tài khoản Docker Hub tại https://hub.docker.com
# 2. Tạo repository mới với tên: shadcn-admin-dashboard
# 3. Tạo Access Token tại Settings > Security
```

### 2. Cập nhật thông tin Docker
```bash
# Sửa username trong các file sau:
# - build-and-push.sh (line 6)
# - docker-compose.yml
# - .github/workflows/docker-build.yml (line 11)
# - .github/workflows/deploy.yml (line 11)

# Thay "your-dockerhub-username" bằng username thực của bạn
```

### 3. GitHub Secrets Setup
Vào repository GitHub > Settings > Secrets and variables > Actions:

```
DOCKERHUB_USERNAME=your-username
DOCKERHUB_TOKEN=your-access-token
SSH_PRIVATE_KEY=your-server-ssh-key (for deployment)
SERVER_USER=your-server-username
SERVER_HOST=your-server-ip
SLACK_WEBHOOK=your-slack-webhook (optional)
```

## 🚀 Usage

### Local Development
```bash
# Build và test local
docker build -t shadcn-admin-dashboard .
docker run -p 3000:80 shadcn-admin-dashboard

# Hoặc dùng docker-compose
docker-compose up -d
```

### Production Build & Push
```bash
# Sử dụng script tự động
./build-and-push.sh

# Hoặc manual
docker build -t your-username/shadcn-admin-dashboard:latest .
docker push your-username/shadcn-admin-dashboard:latest
```

### Container Management
```bash
./manage.sh start     # Start container
./manage.sh stop      # Stop container
./manage.sh restart   # Restart container
./manage.sh logs      # View logs
./manage.sh status    # Check status
./manage.sh update    # Update to latest
./manage.sh health    # Health check
./manage.sh cleanup   # Clean unused containers
```

## 🔄 CI/CD Workflow

### Automatic Triggers
- **Push to main/develop** → Build và push image
- **Pull Request** → Run tests
- **Release tag** → Deploy to production
- **Manual dispatch** → Deploy to staging/production

### Build Process
1. ✅ Code checkout
2. ✅ Run tests & linting
3. ✅ Build Docker image
4. ✅ Security scan
5. ✅ Push to Docker Hub
6. ✅ Update documentation

## 🏗️ Architecture

```
React App (Vite) → Docker Multi-stage Build → Nginx → Production
     ↓                        ↓                  ↓
   Build Stage          Production Stage    Security Headers
   (Node 18)              (Nginx Alpine)    Health Checks
```

## 📊 Monitoring

- **Health Check**: `http://localhost:3000/health`
- **Container Logs**: `docker-compose logs -f`
- **Resource Usage**: `docker stats`

## 🛡️ Security Features

- Multi-stage build (smaller image)
- Non-root user
- Security headers
- Vulnerability scanning
- Read-only filesystem options
- Health checks

## 🎯 Next Steps

1. **Cập nhật username** trong tất cả file config
2. **Setup GitHub secrets** cho CI/CD
3. **Test build local** với `./build-and-push.sh`
4. **Push code lên GitHub** để trigger CI/CD
5. **Setup production server** nếu cần auto-deploy

## 📞 Troubleshooting

### Common Issues
- **Build fails**: Check Docker daemon running
- **Push fails**: Verify Docker Hub login
- **CI/CD fails**: Check GitHub secrets
- **Health check fails**: Verify Nginx config

### Debug Commands
```bash
./manage.sh logs      # Check container logs
./manage.sh status    # Check container status
docker system df      # Check disk usage
docker system prune   # Clean up space
```
