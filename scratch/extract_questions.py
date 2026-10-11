import pypdf
import re
import json
import os

pdf_path = os.path.join('public', 'question', 'Bihar_STET_Computer_Science_PYQs_Topic_Wise.pdf')
reader = pypdf.PdfReader(pdf_path)

full_text = ''
for i, page in enumerate(reader.pages):
    full_text += f'\n<<<PAGE_{i+1}>>>\n' + (page.extract_text() or '')

known_topics = [
    'Digital Electronics & Boolean Algebra',
    'Computer Architecture & Organization',
    'Data Structures & Algorithms',
    'Programming, OOP & Python',
    'DBMS & SQL',
    'Operating Systems',
    'Computer Networks & Cybersecurity',
    'Theory of Computation & Automata',
    'Artificial Intelligence, Robotics & Emerging Tech',
    'General Computer Science'
]

topic_markers = []
for kt in known_topics:
    for m in re.finditer(re.escape(kt), full_text):
        topic_markers.append((m.start(), kt))
topic_markers.sort()

def get_base_topic(pos):
    current = 'Digital Electronics & Boolean Algebra'
    for t_pos, t_name in topic_markers:
        if t_pos < pos:
            current = t_name
        else:
            break
    return current

header_matches = list(re.finditer(r'\n(202\d\s*\|\s*[^|\n]+\|\s*[^|\n]+\s*\|\s*Q\d+)\n', full_text))
print(f'Total questions matched: {len(header_matches)}')

extracted = []

for idx, qm in enumerate(header_matches):
    hdr = qm.group(1).strip()
    start_pos = qm.end()
    end_pos = header_matches[idx+1].start() if idx+1 < len(header_matches) else len(full_text)
    raw_body = full_text[start_pos:end_pos]
    base_topic = get_base_topic(qm.start())
    
    parts = [p.strip() for p in hdr.split('|')]
    year = int(re.search(r'202\d', parts[0]).group(0))
    date = parts[1] if len(parts) > 1 else ''
    shift = parts[2] if len(parts) > 2 else ''
    q_str = parts[3] if len(parts) > 3 else ''
    q_num = int(re.search(r'Q(\d+)', q_str).group(1)) if re.search(r'Q(\d+)', q_str) else idx + 1
    
    # Clean compilation markers from raw body
    text = re.sub(r'<<<PAGE_\d+>>>', '', raw_body)
    text = re.sub(r'Bihar STET Computer Science Paper II \|[^\n]*\n', '', text)
    text = re.sub(r'Page \d+\n', '', text)
    text = re.sub(r'https?://(?:btet\.sifyreg|testbook|link\.testbook)\S+', '', text)
    text = re.sub(r'\d{2}/\d{2}/\d{4},\s*\d{2}:\d{2}\s*BIHAR SCHOOL EXAMINATION BOARD', '', text)
    text = re.sub(r'Question \d+ Question Id : \d+', '', text)
    text = re.sub(r'[A-Za-z0-9+/=]{10,}… \d+/\d+', '', text)
    text = re.sub(r'■+', '', text)
    
    # Official / candidate answers
    corr_m = re.search(r'Correct option(?: \(as printed in source\))?:\s*([A-D])\.?\s*([^\n\r]*)', text)
    official_opt = corr_m.group(1) if corr_m else None
    official_txt = corr_m.group(2).strip() if corr_m else None
    
    cand_m = re.search(r'Candidate-selected option:\s*([A-D])', text)
    candidate_opt = cand_m.group(1) if cand_m else None
    
    # Isolate question text & options by splitting off the answer/candidate lines
    body_no_ans = re.split(r'Correct option|Candidate-selected', text)[0]
    
    # Special fix for 2025 07 Nov S1 Q82 (XML tags where A was angle brackets)
    if 'define the start and end of XML tags' in body_no_ans and 'A. B. { }' in body_no_ans:
        body_no_ans = body_no_ans.replace('A. B. { }', 'A. < >\nB. { }')
    elif 'define the start and end of XML tags' in body_no_ans and 'A.  B. { }' in body_no_ans:
        body_no_ans = body_no_ans.replace('A.  B. { }', 'A. < >\nB. { }')
        
    opt_pattern = r'(?:^|\n)\s*([A-D])\.\s*'
    splits = list(re.finditer(opt_pattern, body_no_ans))
    
    options = {}
    q_text = ''
    if len(splits) >= 4:
        q_text = body_no_ans[:splits[0].start()].strip()
        for s_idx in range(len(splits)):
            letter = splits[s_idx].group(1)
            start_opt = splits[s_idx].end()
            end_opt = splits[s_idx+1].start() if s_idx+1 < len(splits) else len(body_no_ans)
            opt_val = body_no_ans[start_opt:end_opt].strip()
            
            # Clean lines of opt_val
            opt_lines = [l.strip() for l in opt_val.split('\n') if l.strip()]
            cleaned_lines = []
            for l in opt_lines:
                if re.match(r'^\d{4,12}$', l):
                    continue
                if any(l.startswith(k) for k in ['Question Type', 'Question ID', 'Option ', 'Status :', 'Chosen Option', 'Ans']):
                    continue
                cleaned_lines.append(l)
            options[letter] = ' '.join(cleaned_lines)
    else:
        q_text = body_no_ans.strip()
        
    # Clean question text
    q_lines = [l.strip() for l in q_text.split('\n') if l.strip()]
    cleaned_q_lines = []
    for l in q_lines:
        if re.match(r'^\d+$', l):
            continue
        if any(l.startswith(k) for k in ['Question Type', 'Question ID', 'Option ', 'Status :', 'Chosen Option', 'Ans', 'EPDF', 'ENROLL NOW', 'READ THEIR STORIES']):
            continue
        cleaned_q_lines.append(l)
    cleaned_q = ' '.join(cleaned_q_lines)
    
    extracted.append({
        'index': idx + 1,
        'year': year,
        'date': date,
        'shift': shift,
        'q_num': q_num,
        'raw_header': hdr,
        'base_topic': base_topic,
        'question': cleaned_q,
        'options': options,
        'official_opt': official_opt,
        'official_txt': official_txt,
        'candidate_opt': candidate_opt
    })

os.makedirs('scratch', exist_ok=True)
with open('scratch/raw_extracted_questions.json', 'w', encoding='utf-8') as f:
    json.dump(extracted, f, indent=2, ensure_ascii=False)

print(f'Successfully saved {len(extracted)} questions to scratch/raw_extracted_questions.json')
