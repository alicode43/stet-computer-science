import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('Bihar_STET_Computer_Science_PYQs_Analyzed.json', encoding='utf-8') as f:
    d = json.load(f)

for q in d['questions']:
    if 'sifyreg' in q['question'] or 'testbook' in q['question']:
        print('=== ID:', q['id'], '===')
        print(q['question'])
        print('--- OPTIONS ---')
        print(q['options'])
        print('========================================\n')
        break
