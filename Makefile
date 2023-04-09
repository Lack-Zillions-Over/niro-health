env:
	@bash setup/env.sh

build-package:
	@bash setup/build-package.sh

database:
	docker compose -f docker-compose.yml up -d postgres
	docker compose -f docker-compose.yml up -d mongodb
	docker compose -f docker-compose.yml up -d redis

db-push:
	yarn prisma db push

up:
	docker compose -f docker-compose.yml up

down:
	docker compose -f docker-compose.yml down

client-up:
	cd ./client; docker compose -f docker-compose.yml up

client-down:
	cd ./client; docker compose -f docker-compose.yml down

prune:
	docker system prune -af --volumes --force
