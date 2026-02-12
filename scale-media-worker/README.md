# Scale Media Worker

A standalone worker application for processing media jobs from the Bull queue. This worker is designed to be horizontally scalable using KEDA (Kubernetes Event-Driven Autoscaling).

## Architecture

- **Producer**: The main backend application (`scale-media-backend`) adds jobs to the Redis queue
- **Consumer**: This worker application (`scale-media-worker`) processes jobs from the queue
- **Queue**: Bull/BullMQ with Redis as the backend

## Features

- ✅ Processes media jobs asynchronously
- ✅ Job progress tracking
- ✅ Automatic retry with exponential backoff
- ✅ Graceful shutdown handling
- ✅ KEDA auto-scaling support
- ✅ Docker containerization

## Environment Variables

```env
REDIS_HOST=localhost
REDIS_PORT=6379
NODE_ENV=production
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build
npm run build

# Run production build
npm start
```

## Docker

```bash
# Build image
docker build -t scale-media-worker:latest -f scale-media-worker/Dockerfile .

# Run container
docker run --env-file .env scale-media-worker:latest
```

## Kubernetes Deployment with KEDA

### Prerequisites

1. Install KEDA in your Kubernetes cluster:

```bash
kubectl apply -f https://github.com/kedacore/keda/releases/download/v2.12.0/keda-2.12.0.yaml
```

2. Deploy the worker:

```bash
kubectl apply -f scale-media-worker/k8s-deployment.yaml
```

### KEDA Scaling

The worker automatically scales based on queue length:

- **Min replicas**: 1
- **Max replicas**: 10
- **Scale trigger**: 5+ jobs waiting in queue
- **Polling interval**: 15 seconds
- **Cooldown**: 30 seconds

## Job Processing Flow

1. Backend API receives upload confirmation
2. Job is added to Redis queue via `JobQueueService`
3. Worker picks up the job
4. Media processing steps:
   - Download media from S3
   - Transcode/process media
   - Generate thumbnails
   - Upload processed files
   - Update job status in database
5. Job completion or retry on failure

## Monitoring

View worker logs:

```bash
# Docker
docker logs <container-id>

# Kubernetes
kubectl logs -f deployment/scale-media-worker
```

## Scaling Behavior

KEDA monitors the Redis queue length and automatically scales worker pods:

- Queue has 5+ jobs → Scale up
- Queue is empty for 30s → Scale down (minimum 1 pod)
