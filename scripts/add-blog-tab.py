import sys

f = '/var/www/smzentrix.info/cms/public/dashboard.html'
c = open(f).read()

# Add blog tab link in sidebar
if 'tab-blog' not in c:
    old_nav = 'href="#tab-preview" class="tab-link"'
    new_nav = 'href="#tab-blog" class="tab-link">\u270d\ufe0f Blog</a></li>\n        <li><a ' + old_nav
    c = c.replace(old_nav, new_nav, 1)

# Add blog tab panel
if 'id="tab-blog"' not in c:
    old_panel = '<div class="tab-panel" id="tab-preview">'
    new_panel = '<div class="tab-panel" id="tab-blog">\n        <h1>Blog Posts</h1>\n        <div id="blogForm"></div>\n      </div>\n\n      ' + old_panel
    c = c.replace(old_panel, new_panel, 1)

open(f, 'w').write(c)
print('BLOG_TAB_ADDED')
