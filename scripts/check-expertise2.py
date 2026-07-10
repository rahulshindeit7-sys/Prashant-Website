import json
f = '/var/www/doctor-sites/drprashantspawar-repo/config/doctor-profile.json'
c = json.load(open(f))
e = c.get('expertise', [])
print('count:', len(e))
has = sum(1 for x in e if len(x.get('keyPoints', [])) > 0)
print('with keyPoints:', has)
has2 = sum(1 for x in e if len(x.get('content_blocks', [])) > 1)
print('with content_blocks>1:', has2)
if e and len(e[0].get('keyPoints', [])) > 0:
    print('sample keyPoints[0]:', e[0]['keyPoints'][0][:80])
# Check scripts copy
f2 = '/var/www/doctor-sites/drprashantspawar-repo/scripts/config/doctor-profile.json'
try:
    c2 = json.load(open(f2))
    e2 = c2.get('expertise', [])
    has3 = sum(1 for x in e2 if len(x.get('keyPoints', [])) > 0)
    print('scripts copy - with keyPoints:', has3)
except:
    print('scripts copy not found')
