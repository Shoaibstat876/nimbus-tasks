# Phase IV — Docker Specification

## Backend
- Multi-stage Dockerfile
- Non-root runtime user
- Exposes internal port only

## Frontend
- Build stage + runtime stage
- Static assets served by Node or Nginx
- No dev server

## Verification
- docker build completes
- Images tagged with phase identifier
