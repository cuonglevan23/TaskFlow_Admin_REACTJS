# React Shadcn Admin Dashboard - Docker

A modern, responsive admin dashboard built with React, TypeScript, Tailwind CSS, and Shadcn/ui components.

## 🚀 Quick Start

### Run with Docker

```bash
docker run -p 3000:80 your-dockerhub-username/shadcn-admin-dashboard:latest
```

### Run with Docker Compose

```bash
git clone <your-repo>
cd React-Shadcn-Admin-Dashboard
docker-compose up -d
```

## 🏗️ Features

- **Modern UI**: Built with Shadcn/ui and Tailwind CSS
- **Responsive Design**: Works on all devices
- **TypeScript**: Full type safety
- **Performance**: Optimized production build
- **Security**: Security headers and best practices
- **Health Checks**: Built-in health monitoring

## 🐳 Docker Images

- `latest`: Latest stable version
- `v1.x.x`: Specific version tags
- `develop`: Development branch builds

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | - | API base URL |
| `VITE_APP_ENV` | production | Environment |
| `VITE_ENABLE_ANALYTICS` | true | Enable analytics |

## 📊 Health Check

The container includes a health check endpoint at `/health`

```bash
curl http://localhost:3000/health
```

## 🛠️ Development

### Local Development
```bash
npm install
npm run dev
```

### Build Docker Image
```bash
docker build -t shadcn-admin-dashboard .
```

## 📁 Architecture

- **Multi-stage build** for optimized image size
- **Nginx** for serving static files
- **Gzip compression** enabled
- **Security headers** configured

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
