import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def clean_question_text(text: str) -> str:
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        stripped = line.strip()
        # Drop lines matching promotional links, board stamps, and footer markers
        if not stripped:
            cleaned_lines.append(line)
            continue
            
        if any(marker in stripped for marker in [
            'sifyreg.com',
            'testbook.com',
            'BIHAR SCHOOL EXAMINATION BOARD',
            'EPDF',
            'ENROLL NOW',
            'READ THEIR STORIES',
        ]):
            continue
            
        # Drop URL patterns
        if re.search(r'https?://(?:btet\.sifyreg|testbook|link\.testbook)\S*', stripped):
            continue
            
        # Drop timestamp / board header pattern
        if re.search(r'\d{2}/\d{2}/\d{4},\s*\d{2}:\d{2}\s*BIHAR SCHOOL EXAMINATION BOARD', stripped):
            continue
            
        # Drop page number / token patterns like "... 4/75" or "TY4YzY4... 22/75"
        if re.search(r'(?:…|\.{3})\s*\d+/\d+', stripped) or re.search(r'^[A-Za-z0-9+/=]{8,}…?\s*\d+/\d+$', stripped):
            continue
            
        # Drop trailing URL artifacts
        if stripped in ['EPDF', 'ENROLL NOW', 'READ THEIR STORIES !', 'READ THEIR STORIES!']:
            continue
            
        cleaned_lines.append(line)
        
    result = '\n'.join(cleaned_lines)
    # Remove consecutive blank lines
    result = re.sub(r'\n{3,}', '\n\n', result).strip()
    return result

with open('Bihar_STET_Computer_Science_PYQs_Analyzed.json', encoding='utf-8') as f:
    d = json.load(f)

changed = 0
for q in d['questions']:
    orig = q['question']
    cleaned = clean_question_text(orig)
    if cleaned != orig:
        changed += 1
        q['question'] = cleaned

print(f'Total questions cleaned: {changed}')

# Verify no remaining junk
remaining_junk = 0
for q in d['questions']:
    txt = q['question']
    if any(k in txt for k in ['sifyreg', 'testbook', 'BIHAR SCHOOL EXAMINATION BOARD', 'EPDF']):
        remaining_junk += 1
        print('REMAINING JUNK IN:', q['id'], txt)

print(f'Remaining junk count: {remaining_junk}')
