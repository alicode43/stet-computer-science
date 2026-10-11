import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('Bihar_STET_Computer_Science_PYQs_Analyzed.json', encoding='utf-8') as f:
    d = json.load(f)

print('--- CHECKING QUESTIONS AND OPTIONS FOR JUNK ---')

junk_keywords = [
    'sifyreg',
    'testbook',
    'BIHAR SCHOOL EXAMINATION BOARD',
    'EPDF',
    'ENROLL NOW',
    'READ THEIR STORIES',
    'http://',
    'https://'
]

for kw in junk_keywords:
    q_matches = sum(1 for q in d['questions'] if kw.lower() in q['question'].lower())
    opt_matches = sum(1 for q in d['questions'] if any(kw.lower() in str(v).lower() for v in q['options'].values()))
    print(f'"{kw}": questions={q_matches}, options={opt_matches}')
