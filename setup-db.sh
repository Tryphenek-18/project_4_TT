#!/usr/bin/env bash
# =========================================================
# SHOPME — One-time MySQL setup
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

echo ">> Creating database 'shopme'..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS shopme CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo ""
echo ">> Done! You can now run:  npm start"
# =========================================================
# SHOPME — One-time MySQL setup
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

echo ">> Creating database 'shopme'..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS shopme CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo ""
echo ">> Done! You can now run:  npm start"
# =========================================================
# SHOPME — One-time MySQL setup
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

echo ">> Creating database 'shopme'..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS shopme CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo ""
echo ">> Done! You can now run:  npm start"
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