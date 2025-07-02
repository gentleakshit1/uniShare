# build.sh
#!/usr/bin/env bash

# Install dependencies
pip install -r requirements.txt

# Run migrations automatically
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput
