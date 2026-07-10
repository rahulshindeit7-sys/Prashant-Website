import json, os, glob

backups_dir = '/var/www/smzentrix.info/backups/prashant/'
files = sorted(glob.glob(backups_dir + 'config.*.json'))

best_file = None
best_count = 0

for f in files:
    try:
        c = json.load(open(f))
        e = c.get('expertise', [])
        has = sum(1 for x in e if len(x.get('keyPoints', [])) > 0 or len(x.get('content_blocks', [])) > 1)
        if has > best_count:
            best_count = has
            best_file = f
    except:
        pass

print(f'Best file: {best_file}')
print(f'Items with content: {best_count}')

if best_file:
    c = json.load(open(best_file))
    e = c.get('expertise', [])
    for item in e:
        kp = item.get('keyPoints', [])
        cb = item.get('content_blocks', [])
        if len(kp) > 0 or len(cb) > 1:
            print(f"  {item['slug']}: keyPoints={len(kp)}, content_blocks={len(cb)}")
