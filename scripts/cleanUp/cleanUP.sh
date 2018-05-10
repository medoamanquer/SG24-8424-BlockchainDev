docker rm -f $(docker ps -aq)
docker system prune -f
docker volume rm $(docker volume ls -q)
docker rm $(docker ps -aq)

