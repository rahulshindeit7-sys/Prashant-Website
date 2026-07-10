f = '/var/www/smzentrix.info/cms/public/js/dashboard.js'
c = open(f).read()

if 'blog_posts' not in c:
    # Add blog_posts tags handling in collectFormData, after syncExpertiseData
    old = '  syncExpertiseData(config);\n\n  return config;'
    new = '''  syncExpertiseData(config);

  // Convert blog_posts tags from comma string to array
  if (Array.isArray(config.blog_posts)) {
    config.blog_posts = config.blog_posts.map(post => ({
      ...post,
      tags: typeof post.tags === 'string'
        ? post.tags.split(',').map(t => t.trim()).filter(Boolean)
        : (Array.isArray(post.tags) ? post.tags : []),
      published: post.published !== undefined ? post.published : false
    }));
  }

  return config;'''
    c = c.replace(old, new, 1)
    open(f, 'w').write(c)
    print('BLOG_TAGS_HANDLING_ADDED')
else:
    print('BLOG_HANDLING_ALREADY_EXISTS')
