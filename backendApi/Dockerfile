# Utilisez l'image Python officielle comme image de base
FROM python:3.10-slim

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le fichier requirements.txt dans le conteneur
COPY requirement.txt .



# Mise à jour de pip
RUN pip install --upgrade pip

RUN apt-get update
RUN apt-get install -y postgresql-server-dev-all
RUN pip install psycopg2-binary

# Installez les dépendances de votre projet Django
RUN pip install --no-cache-dir -r requirement.txt

# Copiez le reste des fichiers du projet dans le conteneur
COPY . .

RUN python manage.py collectstatic --no-input


# Exécutez les migrations pour initialiser la base de données
RUN python manage.py makemigrations
RUN python manage.py migrate

# Exposez le port 8000 pour que Django puisse y écouter les requêtes HTTP
EXPOSE 8000

# Définissez les variables d'environnement pour Django
ENV DJANGO_SETTINGS_MODULE=backendApi.settings
ENV PYTHONUNBUFFERED=1

# Exécutez la commande de démarrage de votre application Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
