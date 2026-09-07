#!/usr/bin/env bash
# =========================================================
# ShopVerse — One-time MySQL setup
# Makes root accessible WITHOUT a password (local dev only),
# exactly as required by the project config.
#
# Run it like this (it will ask for YOUR Linux password):
#   sudo bash setup-db.sh
# =========================================================
set -e

echo ">> Configuring MySQL root with mysql_native_password (no password)..."
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''; FLUSH PRIVILEGES;"

echo ">> Verifying passwordless access..."
mysql -u root -e "SELECT user, host, plugin FROM mysql.user WHERE user = 'root';"

echo ""
echo ">> Done! You can now run:  npm start"