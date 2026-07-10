import re

f = '/etc/nginx/nginx.conf'
c = open(f).read()

# Enable gzip settings
replacements = [
    ('# gzip_vary on;', 'gzip_vary on;'),
    ('# gzip_proxied any;', 'gzip_proxied any;'),
    ('# gzip_comp_level 6;', 'gzip_comp_level 6;'),
    ('# gzip_buffers 16 8k;', 'gzip_buffers 16 8k;'),
    ('# gzip_http_version 1.1;', 'gzip_http_version 1.1;'),
    ('# gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;',
     'gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;'),
]

for old, new in replacements:
    c = c.replace(old, new)

open(f, 'w').write(c)
print('GZIP_ENABLED')
