import re

with open(r'app.js', encoding='utf-8') as f:
    content = f.read()

with open(r'conv_lines.txt', encoding='utf-8') as f:
    new_rows = f.read().strip()

# Find and replace the CONVALIDACIONES array body
pattern = r'(const CONVALIDACIONES = \[)\s*[\s\S]*?(\];)'
replacement = r'\1\n' + new_rows + r'\n\2'

new_content = re.sub(pattern, replacement, content, count=1)

if new_content == content:
    print("ERROR: Pattern not found!")
else:
    with open(r'app.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("OK: CONVALIDACIONES updated successfully")
