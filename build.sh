# Workaround to prevent docker-compose parallel builds
# (which doesn't work due to npm being choked by bandwidth limits)

docker compose build backend
docker compose build frontend