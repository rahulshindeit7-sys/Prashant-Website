import glob
import re

base = '/var/www/doctor-sites/drprashantspawar.com'
version = '20260710a'
files = [
    f'{base}/index.html',
    f'{base}/blog.html',
    f'{base}/blog-detail.html',
    f'{base}/contact.html',
    f'{base}/expertise.html',
    f'{base}/expertise-detail.html',
    f'{base}/profile.html',
]

count = 0
for fpath in files:
    try:
        c = open(fpath).read()
        # Replace app.js references (with or without existing version)
        c = re.sub(r'assets/js/app\.js(\?v=[^"\']*)?', f'assets/js/app.js?v={version}', c)
        # Replace routes.js references
        c = re.sub(r'assets/js/routes\.js(\?v=[^"\']*)?', f'assets/js/routes.js?v={version}', c)
        # Replace style.css references
        c = re.sub(r'assets/css/style\.css(\?v=[^"\']*)?', f'assets/css/style.css?v={version}', c)
        open(fpath, 'w').write(c)
        count += 1
    except Exception as e:
        print(f'ERROR {fpath}: {e}')

print(f'CACHE_BUSTED: {count} files updated with v={version}')
