import subprocess, os

# 1. Add WebP serving to nginx site config
SITE_CONF = None
for f in ['/etc/nginx/sites-enabled/drprashantspawar.com', '/etc/nginx/sites-enabled/default']:
    if os.path.exists(f):
        SITE_CONF = f
        break

if not SITE_CONF:
    # Find the right config
    import glob
    confs = glob.glob('/etc/nginx/sites-enabled/*')
    for c in confs:
        content = open(c).read()
        if 'drprashantspawar' in content:
            SITE_CONF = c
            break

if not SITE_CONF:
    print('ERROR: nginx site config not found')
    exit(1)

print(f'SITE_CONF: {SITE_CONF}')
c = open(SITE_CONF).read()

# Add WebP map block before server block if not already present
if 'webp' not in c.lower() or '$webp_suffix' not in c:
    # Add location block for images to serve WebP when available
    webp_block = '''
    # Serve WebP images when browser supports and file exists
    location ~* ^(.+)\\.(png|jpe?g)$ {
        add_header Vary Accept;
        try_files $1.webp $uri =404;
    }
'''
    # Insert before the last closing brace of the server block
    # Find the location for static assets or add before closing
    if 'location' in c and 'assets' not in c:
        # Add after root directive
        c = c.replace('index index.html;', 'index index.html;\n' + webp_block, 1)
    else:
        # Try to add inside the server block before the last }
        last_brace = c.rfind('}')
        if last_brace > 0:
            c = c[:last_brace] + webp_block + '\n' + c[last_brace:]
    
    open(SITE_CONF, 'w').write(c)
    print('WEBP_LOCATION_ADDED')
else:
    print('WEBP_ALREADY_CONFIGURED')

# 2. Minify JS and CSS
SITE = '/var/www/doctor-sites/drprashantspawar.com'
js_file = os.path.join(SITE, 'assets/js/app.js')
css_file = os.path.join(SITE, 'assets/css/style.css')

# Simple minification - remove comments and excess whitespace
import re

def minify_js(content):
    # Remove single-line comments (but not URLs)
    content = re.sub(r'(?<!:)//[^\n]*', '', content)
    # Remove multi-line comments
    content = re.sub(r'/\*[\s\S]*?\*/', '', content)
    # Remove excess whitespace
    content = re.sub(r'\n\s*\n', '\n', content)
    # Remove leading whitespace on lines
    content = re.sub(r'\n[ \t]+', '\n', content)
    return content.strip()

def minify_css(content):
    # Remove comments
    content = re.sub(r'/\*[\s\S]*?\*/', '', content)
    # Remove excess whitespace
    content = re.sub(r'\s+', ' ', content)
    # Remove space around { } : ; ,
    content = re.sub(r'\s*{\s*', '{', content)
    content = re.sub(r'\s*}\s*', '}', content)
    content = re.sub(r'\s*;\s*', ';', content)
    content = re.sub(r'\s*:\s*', ':', content)
    content = re.sub(r'\s*,\s*', ',', content)
    return content.strip()

# Backup originals
os.system(f'cp {js_file} {js_file}.unmin')
os.system(f'cp {css_file} {css_file}.unmin')

js_content = open(js_file).read()
css_content = open(css_file).read()

js_min = minify_js(js_content)
css_min = minify_css(css_content)

open(js_file, 'w').write(js_min)
open(css_file, 'w').write(css_min)

js_saved = (len(js_content) - len(js_min)) / len(js_content) * 100
css_saved = (len(css_content) - len(css_min)) / len(css_content) * 100

print(f'JS: {len(js_content)//1024}KB -> {len(js_min)//1024}KB ({js_saved:.0f}% saved)')
print(f'CSS: {len(css_content)//1024}KB -> {len(css_min)//1024}KB ({css_saved:.0f}% saved)')
print('MINIFICATION_DONE')
