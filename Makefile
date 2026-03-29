COMPOSE      = docker compose
COMPOSE_FILE = docker-compose.yml

-include .env
export

.PHONY: start stop restart status logs logs-api logs-web logs-db reset help

start: ## Démarre tous les services (build si nécessaire)
	@$(COMPOSE) -f $(COMPOSE_FILE) up -d --build
	@printf "    \033[32m✓\033[0m  pact démarré\n"

stop: ## Arrête tous les services
	@$(COMPOSE) -f $(COMPOSE_FILE) down
	@printf "    \033[32m✓\033[0m  pact arrêté\n"

restart: stop start ## Redémarre tous les services

status: ## État des conteneurs
	@$(COMPOSE) -f $(COMPOSE_FILE) ps

logs: ## Suit tous les logs en live
	@$(COMPOSE) -f $(COMPOSE_FILE) logs -f

logs-api: ## Logs du service API
	@$(COMPOSE) -f $(COMPOSE_FILE) logs -f pact-api

logs-web: ## Logs du service Web
	@$(COMPOSE) -f $(COMPOSE_FILE) logs -f pact-web

logs-db: ## Logs de MongoDB
	@$(COMPOSE) -f $(COMPOSE_FILE) logs -f pact-db

reset: ## Supprime TOUT (conteneurs, volumes nommés, images buildées)
	@$(COMPOSE) -f $(COMPOSE_FILE) down -v --remove-orphans
	@docker rmi pact-api:latest pact-web:latest 2>/dev/null || true
	@printf "    \033[32m✓\033[0m  pact reset complet\n"

help: ## Affiche cette aide
	@awk 'BEGIN {FS=":.*##"; printf "\n\033[1mCommandes disponibles :\033[0m\n\n"} \
	/^[a-zA-Z_-]+:.*##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } \
	END { printf "\n" }' $(MAKEFILE_LIST)
