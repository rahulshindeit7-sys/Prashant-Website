f = '/var/www/doctor-sites/drprashantspawar.com/index.html'
c = open(f).read()

# Add preload hints for critical resources
preloads = '''  <link rel="preload" href="assets/css/style.css" as="style" />
  <link rel="preload" href="assets/js/app.js" as="script" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="dns-prefetch" href="https://www.google-analytics.com" />'''

if 'rel="preload"' not in c:
    # Insert after <meta name="viewport">
    c = c.replace(
        '<link rel="stylesheet" href="assets/css/style.css',
        preloads + '\n  <link rel="stylesheet" href="assets/css/style.css'
    )
    open(f, 'w').write(c)
    print('PRELOADS_ADDED')
else:
    print('PRELOADS_ALREADY_EXIST')
