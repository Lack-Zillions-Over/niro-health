database:
	docker compose -f docker-compose.yml up -d postgres
	docker compose -f docker-compose.yml up -d redis

db-push:
	yarn prisma db push

up:
	docker compose -f docker-compose.yml up

down:
	docker compose -f docker-compose.yml down

prune:
	docker system prune -af --volumes --force
