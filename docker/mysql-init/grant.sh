#!/bin/bash
# Grant database creation privileges to the user created via MYSQL_USER environment variable

# Wait for MySQL to be ready
until mysql -u root -p"${MYSQL_ROOT_PASSWORD}" -e "SELECT 1" >/dev/null 2>&1; do
  echo "Waiting for MySQL to be ready..."
  sleep 2
done

echo "Granting CREATE DATABASE privileges to user: ${MYSQL_USER}"

# Grant CREATE DATABASE and other necessary privileges to the user
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" <<EOF
GRANT CREATE ON *.* TO '${MYSQL_USER}'@'%';
GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_USER}'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SELECT User, Host, Create_priv FROM mysql.user WHERE User = '${MYSQL_USER}';
EOF

echo "Privileges granted successfully to ${MYSQL_USER}"