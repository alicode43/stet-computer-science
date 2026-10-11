import json
import re
import sys
import shutil

sys.stdout.reconfigure(encoding='utf-8')

def clean_question_text(text: str) -> str:
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        stripped = line.strip()
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
    result = re.sub(r'\n{3,}', '\n\n', result).strip()
    return result

# Load and clean Bihar_STET_Computer_Science_PYQs_Analyzed.json
with open('Bihar_STET_Computer_Science_PYQs_Analyzed.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

cleaned_count = 0
for q in d['questions']:
    orig = q['question']
    cleaned = clean_question_text(orig)
    if cleaned != orig:
        cleaned_count += 1
        q['question'] = cleaned

with open('Bihar_STET_Computer_Science_PYQs_Analyzed.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print(f'Successfully updated Bihar_STET_Computer_Science_PYQs_Analyzed.json ({cleaned_count} questions cleaned)')

# Also copy to public/data/stet_questions.json
shutil.copy('Bihar_STET_Computer_Science_PYQs_Analyzed.json', 'public/data/stet_questions.json')
print('Successfully synchronized to public/data/stet_questions.json')
