f = '/var/www/smzentrix.info/cms/public/js/editor.js'
c = open(f).read()
c = c.replace("formData.append('image', file);\n        const resp = await fetch('/api/uploads/image', {", "formData.append('file', file);\n        const resp = await fetch('/api/upload', {\n          credentials: 'include',")
# Remove the duplicate closing that might result
c = c.replace("          credentials: 'include',\n          method: 'POST',", "          method: 'POST',\n          credentials: 'include',")
open(f, 'w').write(c)
print('BLOG_UPLOAD_FIXED')
