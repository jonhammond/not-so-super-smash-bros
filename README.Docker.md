# Docker Setup for Not So Super Smash Bros

This guide explains how to run the game using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### Development Mode

Run the application with live-reload:

```bash
docker compose up --build
```

The application will be available at:
- **Game View**: http://localhost:3000
- **Controller**: http://localhost:3000/controller
- **Browser-sync proxy**: http://localhost:5001 (with live-reload)
- **Debug Port**: 9229 (for Node.js debugging)

### Production Mode

Build and run the production image:

```bash
docker build --target prod -t not-so-super-smash-bros .
docker run -p 3000:3000 not-so-super-smash-bros
```

### Running Tests

```bash
docker build --target test -t not-so-super-smash-bros-test .
```

## Docker Configuration

### Dockerfile Stages

The Dockerfile includes three build stages:

1. **dev**: Development mode with hot-reload via nodemon
   - Includes all dev dependencies
   - Source code mounted as volume for live changes
   - Debug port exposed (9229)

2. **prod**: Production mode
   - Only production dependencies
   - Optimized for deployment
   - Runs on port 3000

3. **test**: Test runner
   - Runs Jasmine tests during build

### Volume Mounting

In development mode, the `src` directory is mounted as a volume, allowing you to edit code locally and see changes reflected in the container without rebuilding.

## Common Commands

### Build the image
```bash
docker compose build
```

### Start the container
```bash
docker compose up
```

### Start in detached mode (background)
```bash
docker compose up -d
```

### View logs
```bash
docker compose logs -f
```

### Stop the container
```bash
docker compose down
```

### Rebuild and restart
```bash
docker compose up --build
```

## Ports

- **3000**: Express server (game & controller pages)
- **5001**: Browser-sync proxy (used in dev mode)
- **9229**: Node.js debugger

## Troubleshooting

### Container won't start
- Ensure Docker Desktop is running
- Check if ports 3000, 5001, or 9229 are already in use

### Changes not reflecting
- Make sure you're editing files in the `src` directory
- Nodemon should automatically restart the server

### Dependencies issues
- Rebuild the image: `docker compose build --no-cache`

## Deploying to the Cloud

First, build your image for production:
```bash
docker build --target prod -t myapp .
```

If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform:
```bash
docker build --platform=linux/amd64 --target prod -t myapp .
```

Then, push it to your registry:
```bash
docker push myregistry.com/myapp
```

### References
* [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)