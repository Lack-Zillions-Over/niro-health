echo "Deleting environment variables backend..."
rm -rf .env
rm -rf .env.local

echo "Setting up environment variables backend (development)..."
echo -e "\
NODE_ENV="development"\n\
VERSION="1.7.0"\n\
API_URI="http://localhost:4000"\n\
WEBAPP_URI="http://localhost:3000"\n\
PORT="4000"\n\
DATABASE_URL="postgresql://postgres:postgres@localhost/project_development"\n\
DB_PORT="5432"\n\
DB_USERNAME="postgres"\n\
DB_PASSWORD="postgres"\n\
DB_DATABASE_NAME="project_development"\n\
MONGODB_USERNAME="mongodb"\n\
MONGODB_PASSWORD="mongodb"\n\
MONGODB_HOST="localhost"\n\
MONGODB_PORT="27017"\n\
MONGODB_NAME="project_development"\n\
MONGODB_GRIDFS_NAME="project_development_gridfs"\n\
MONGODB_CONNECTION_SSL="false"\n\
MONGODB_PROJECT_NAME="niro_health"\n\
REDIS_HOST="redis://localhost:6379"\n\
REDIS_PORT='6379'\n\
REDIS_PASSWORD=""\n\
BULL_BOARD_USERNAME="admin"\n\
BULL_BOARD_PASSWORD="admin"\n\
CRON_TIMEZONE="America/Sao_Paulo"\n\
CRYPTO_PASSWORD="o4t7bNT5CbOnlqBcah40R99zierzSQz3MS9Ssceqq2U="\n\
MASTER_KEY="eJwFwcFOwzAMANBviZxTJB+c2Il7q7ZdKGWlbGzqKaKbWihTGYzR3+e9knQFqTI7dB5Hz1FCIacPZ8LdF9S4Ldrwa8wymrt7YcJ60xxlQU25g7+068McmjU6GKw3xMr5RI/gIzz3sorqiA3rTRvGs9JUu9bo6NCifRImwQLVwnhRzSml48OeQecSbPiZM+8OSHotaeFNjgXE6/snyVCj+Sa8nvELJnFyFoC07Muh7LQs4jZRf1vnSLZqJxdu/tLmrj+JrUzwYjmxKV4Rwecgb0gY0z8TjUCv"\n\
JWT_SECRET="cLoM/xpKjQpuL825AZexwyitebaOg94Gr4SzBiBNN6M="\n\
COOKIE_SECRET="aMIKHAO4USHeyz5b1SqHwKbQcG5ln/D6XkXNqvS8/e0="\n\
SESSION_SECRET="Hn+s7UQPty8vkUqvuzzmqysSO0LV/P8r8oUMXEbRLKY="\n\
AXIOS_URI="http://localhost:4000"\n\
AXIOS_AUTHORIZATION="3b93157d4096c56fd6e96570b6016b87f6443202"\n\
AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS"\n\
AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_ACCESS_KEY"\n\
SMTP_HOST="smtp.mail.com"\n\
SMTP_PORT="587"\n\
SMTP_SECURE="false"\n\
SMTP_USERNAME="example@mail.com"\n\
SMTP_PASSWORD="YOUR_SMTP_PASSWORD"\
" >> .env

echo "Setting up environment variables backend (local)..."
echo -e "\
NODE_ENV="local"\n\
VERSION="1.7.0"\n\
API_URI="http://172.18.0.2:4000"\n\
WEBAPP_URI="http://172.18.0.6:3000"\n\
PORT="4000"\n\
DATABASE_URL="postgresql://postgres:postgres@172.18.0.3/project_development"\n\
DB_PORT="5432"\n\
DB_USERNAME="postgres"\n\
DB_PASSWORD="postgres"\n\
DB_DATABASE_NAME="project_development"\n\
MONGODB_USERNAME="mongodb"\n\
MONGODB_PASSWORD="mongodb"\n\
MONGODB_HOST="172.18.0.4"\n\
MONGODB_PORT="27017"\n\
MONGODB_NAME="project_development"\n\
MONGODB_GRIDFS_NAME="project_development_gridfs"\n\
MONGODB_CONNECTION_SSL="false"\n\
MONGODB_PROJECT_NAME="niro_health"\n\
REDIS_HOST="redis://172.18.0.5:6379"\n\
REDIS_PORT='6379'\n\
REDIS_PASSWORD=""\n\
BULL_BOARD_USERNAME="admin"\n\
BULL_BOARD_PASSWORD="admin"\n\
CRON_TIMEZONE="America/Sao_Paulo"\n\
CRYPTO_PASSWORD="o4t7bNT5CbOnlqBcah40R99zierzSQz3MS9Ssceqq2U="\n\
MASTER_KEY="eJwFwcFOwzAMANBviZxTJB+c2Il7q7ZdKGWlbGzqKaKbWihTGYzR3+e9knQFqTI7dB5Hz1FCIacPZ8LdF9S4Ldrwa8wymrt7YcJ60xxlQU25g7+068McmjU6GKw3xMr5RI/gIzz3sorqiA3rTRvGs9JUu9bo6NCifRImwQLVwnhRzSml48OeQecSbPiZM+8OSHotaeFNjgXE6/snyVCj+Sa8nvELJnFyFoC07Muh7LQs4jZRf1vnSLZqJxdu/tLmrj+JrUzwYjmxKV4Rwecgb0gY0z8TjUCv"\n\
JWT_SECRET="cLoM/xpKjQpuL825AZexwyitebaOg94Gr4SzBiBNN6M="\n\
COOKIE_SECRET="aMIKHAO4USHeyz5b1SqHwKbQcG5ln/D6XkXNqvS8/e0="\n\
SESSION_SECRET="Hn+s7UQPty8vkUqvuzzmqysSO0LV/P8r8oUMXEbRLKY="\n\
AXIOS_URI="http://172.18.0.2:4000"\n\
AXIOS_AUTHORIZATION="3b93157d4096c56fd6e96570b6016b87f6443202"\n\
AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS"\n\
AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_ACCESS_KEY"\n\
SMTP_HOST="smtp.mail.com"\n\
SMTP_PORT="587"\n\
SMTP_SECURE="false"\n\
SMTP_USERNAME="example@mail.com"\n\
SMTP_PASSWORD="YOUR_SMTP_PASSWORD"\
" >> .env.local

echo "Environment variables setted up!"
