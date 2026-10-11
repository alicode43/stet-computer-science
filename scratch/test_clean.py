import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('Bihar_STET_Computer_Science_PYQs_Analyzed.json', encoding='utf-8') as f:
    d = json.load(f)

count = 0
for idx, q in enumerate(d['questions']):
    txt = q['question']
    if any(k in txt for k in ['sifyreg', 'testbook', 'BIHAR SCHOOL EXAMINATION BOARD', 'EPDF', 'ENROLL NOW', 'READ THEIR STORIES']):
        lines = txt.split('\n')
        cleaned_lines = []
        junk_lines = []
        for l in lines:
            line_str = l.strip()
            if any(k in line_str for k in ['sifyreg', 'testbook', 'BIHAR SCHOOL EXAMINATION BOARD', 'EPDF', 'ENROLL NOW', 'READ THEIR STORIES']) \
               or re.search(r'https?://(?:btet\.sifyreg|testbook|link\.testbook)\S*', line_str) \
               or re.search(r'\d{2}/\d{2}/\d{4},\s*\d{2}:\d{2}\s*BIHAR SCHOOL EXAMINATION BOARD', line_str) \
               or re.search(r'[A-Za-z0-9+/=]{10,}… \d+/\d+', line_str):
                junk_lines.append(line_str)
            else:
                cleaned_lines.append(l)
        
        print(f'*** ID: {q["id"]} ***')
        print('JUNK DETECTED:')
        for j in junk_lines:
            print('  [JUNK]', j)
        print('REMAINING CLEAN QUESTION:')
        print('\n'.join(cleaned_lines).strip())
        print('========================================\n')
        count += 1
        if count >= 3:
            break
