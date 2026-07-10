import json
f = '/var/www/smzentrix.info/backups/prashant/config.2026-07-09T20-38-38.json'
c = json.load(open(f))
e = c.get('expertise', [])
print('count:', len(e))
if e:
    print('first slug:', e[0]['slug'])
    print('first overview:', e[0].get('overview', '')[:100])
    print('first keyPoints:', len(e[0].get('keyPoints', [])))
    print('first whenToConsult:', len(e[0].get('whenToConsult', [])))
    # Check if any have real content
    has_content = 0
    for item in e:
        kp = item.get('keyPoints', [])
        if kp and len(kp) > 0:
            has_content += 1
    print('items with keyPoints:', has_content)
