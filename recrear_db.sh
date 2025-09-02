#!/bin/bash

echo "🗑️ Eliminando base de datos actual..."
cd backend
rm -f db.sqlite3

echo "🗑️ Eliminando migraciones existentes..."
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

echo "📝 Creando nuevas migraciones..."
python manage.py makemigrations

echo "🔧 Aplicando migraciones..."
python manage.py migrate

echo "👤 Creando superusuario (admin/admin)..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@admin.com', 'admin') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell

echo "✅ Base de datos recreada exitosamente!"
echo "🚀 Usuario administrador: admin / admin"
