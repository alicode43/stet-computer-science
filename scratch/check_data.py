import json
from collections import Counter

with open('Bihar_STET_Computer_Science_PYQs_Analyzed.json', encoding='utf-8') as f:
    d = json.load(f)

qs = d.get('questions', [])
print('Total questions:', len(qs))
print('Topics and counts:')
for t, c in Counter(q['topic'] for q in qs).most_common():
    print(f'  {t}: {c}')

papers = Counter(f"{q['year']} - {q.get('exam_date','')} ({q.get('shift','')})" for q in qs)
print('\nPapers and counts:')
for p, c in papers.most_common():
    print(f'  {p}: {c}')
