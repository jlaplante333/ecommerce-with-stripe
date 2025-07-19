# Setup scripts

.PHONY: setup
setup:
	poetry install --with dev
	command -v direnv >/dev/null && direnv allow || echo "Direnv not found, skipping direnv allow"
