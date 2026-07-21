import re
import codecs

with codecs.open('app.js', 'r', 'utf-8') as f:
    content = f.read()

replacement = """    // Configure Marked.js for markdown rendering
    if (typeof marked !== 'undefined') {
        const renderer = {
            code(codeContext, language) {
                // Handle different marked versions (v12+ passes token object, older passes string)
                let codeText = typeof codeContext === 'string' ? codeContext : (codeContext.text || '');
                let lang = typeof language === 'string' ? language : (codeContext.lang || 'text');
                
                const uid = 'code-' + Math.random().toString(36).substring(2, 9);
                const escapedCode = escapeHTML(codeText);
                return `
                    <div class="code-header">
                        <span>Mã nguồn (${lang})</span>
                        <button class="btn-copy-code" onclick="copyCodeText('${uid}')">
                            <i class="fa-regular fa-copy"></i> Sao chép
                        </button>
                    </div>
                    <pre><code id="${uid}" class="language-${lang}">${escapedCode}</code></pre>
                `;
            }
        };
        marked.use({ renderer, breaks: true, gfm: true });
    }

    function formatMarkdown(text) {
        if (typeof marked !== 'undefined') {
            return marked.parse(text);
        }
        // Fallback if marked fails to load
        let html = escapeHTML(text);
        html = html.replace(/\\n\\n/g, '</p><p>');
        html = html.replace(/\\n/g, '<br>');
        return '<p>' + html + '</p>';
    }"""

pattern = r"    function formatMarkdown\(text\) \{.*?return html;\n    \}"
new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with codecs.open('app.js', 'w', 'utf-8') as f:
    f.write(new_content)
