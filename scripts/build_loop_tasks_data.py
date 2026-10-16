import zipfile, xml.etree.ElementTree as ET, glob, os, json, re

def get_doc_paragraphs(path):
    with zipfile.ZipFile(path) as z:
        xml_content = z.read('word/document.xml')
        root = ET.fromstring(xml_content)
        lines = []
        for p in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            texts = [node.text for node in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
            if texts:
                lines.append(''.join(texts).strip())
        return [l for l in lines if l]

for i in range(1, 9):
    lines = get_doc_paragraphs(f'loop task/Lesson {i} Loop task.docx')
    print(f"Lesson {i}: {len(lines)} lines")
