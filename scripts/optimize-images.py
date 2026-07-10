import os
import subprocess

SITE = '/var/www/doctor-sites/drprashantspawar.com'
IMG_DIR = os.path.join(SITE, 'assets', 'images')

# 1. Compress large PNGs to optimized JPEG/WebP
large_pngs = [
    ('dr-prashant-hero-clean.png', 800),  # resize to 800px wide
    ('Dr Prashant.png', 600),
    ('Dr Prashant 2.png', 500),
    ('Dr Prashant Logo.png', 200),
]

for fname, width in large_pngs:
    src = os.path.join(IMG_DIR, fname)
    if not os.path.exists(src):
        print(f'SKIP (missing): {fname}')
        continue
    
    orig_size = os.path.getsize(src)
    
    # Resize + compress with ImageMagick
    cmd = ['convert', src, '-resize', f'{width}x>', '-quality', '82', '-strip', src]
    subprocess.run(cmd, check=True)
    
    new_size = os.path.getsize(src)
    print(f'COMPRESSED: {fname} {orig_size//1024}KB -> {new_size//1024}KB')

# 2. Compress all JPEGs > 100KB
for fname in os.listdir(IMG_DIR):
    fpath = os.path.join(IMG_DIR, fname)
    if not fname.lower().endswith(('.jpeg', '.jpg')):
        continue
    size = os.path.getsize(fpath)
    if size < 100 * 1024:
        continue
    cmd = ['convert', fpath, '-quality', '78', '-strip', fpath]
    subprocess.run(cmd, check=True)
    new_size = os.path.getsize(fpath)
    print(f'JPEG: {fname} {size//1024}KB -> {new_size//1024}KB')

# 3. Compress uploaded images > 200KB
UPLOAD_DIR = '/var/www/smzentrix.info/uploads/prashant'
if os.path.isdir(UPLOAD_DIR):
    for fname in os.listdir(UPLOAD_DIR):
        fpath = os.path.join(UPLOAD_DIR, fname)
        if not fname.lower().endswith(('.jpeg', '.jpg', '.png')):
            continue
        size = os.path.getsize(fpath)
        if size < 200 * 1024:
            continue
        cmd = ['convert', fpath, '-resize', '800x>', '-quality', '80', '-strip', fpath]
        subprocess.run(cmd, check=True)
        new_size = os.path.getsize(fpath)
        print(f'UPLOAD: {fname} {size//1024}KB -> {new_size//1024}KB')

print('IMAGE_OPTIMIZATION_DONE')
