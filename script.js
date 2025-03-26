document.addEventListener('DOMContentLoaded', function() {
    // Initialize editors
    const sourceEditor = ace.edit("sourceEditor");
    const targetEditor = ace.edit("targetEditor");
    
    // Editor configuration
    sourceEditor.setTheme("ace/theme/monokai");
    sourceEditor.session.setMode("ace/mode/text");
    sourceEditor.setOptions({
        fontSize: "14px",
        showPrintMargin: false,
        wrap: true,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true
    });
    
    targetEditor.setTheme("ace/theme/monokai");
    targetEditor.session.setMode("ace/mode/text");
    targetEditor.setOptions({
        fontSize: "14px",
        showPrintMargin: false,
        wrap: true,
        readOnly: true
    });
    
    // Language data
    const languages = [
        { name: "Python", mode: "python", extension: "py" },
        { name: "JavaScript", mode: "javascript", extension: "js" },
        { name: "Java", mode: "java", extension: "java" },
        { name: "C++", mode: "c_cpp", extension: "cpp" },
        { name: "C#", mode: "csharp", extension: "cs" },
        { name: "Ruby", mode: "ruby", extension: "rb" },
        { name: "PHP", mode: "php", extension: "php" },
        { name: "Go", mode: "golang", extension: "go" },
        { name: "Swift", mode: "swift", extension: "swift" },
        { name: "TypeScript", mode: "typescript", extension: "ts" },
        { name: "Kotlin", mode: "kotlin", extension: "kt" },
        { name: "Rust", mode: "rust", extension: "rs" },
        { name: "Scala", mode: "scala", extension: "scala" },
        { name: "Dart", mode: "dart", extension: "dart" },
        { name: "R", mode: "r", extension: "r" },
        { name: "Bash", mode: "sh", extension: "sh" },
        { name: "HTML", mode: "html", extension: "html" },
        { name: "CSS", mode: "css", extension: "css" },
        { name: "SQL", mode: "sql", extension: "sql" },
        { name: "JSON", mode: "json", extension: "json" }
    ];
    
    // Populate language dropdowns
    const sourceLanguageSelect = document.getElementById('sourceLanguage');
    const targetLanguageSelect = document.getElementById('targetLanguage');
    
    languages.forEach(lang => {
        const option1 = document.createElement('option');
        option1.value = lang.mode;
        option1.textContent = lang.name;
        sourceLanguageSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = lang.mode;
        option2.textContent = lang.name;
        targetLanguageSelect.appendChild(option2);
    });
    
    // Language detection (simplified)
    document.getElementById('detectLanguage').addEventListener('click', function() {
        const code = sourceEditor.getValue();
        if (!code.trim()) {
            alert('Please enter some code to detect');
            return;
        }
        
        // Simple keyword-based detection (in a real app, use a proper library)
        const detectedLang = detectLanguageFromCode(code);
        if (detectedLang) {
            sourceLanguageSelect.value = detectedLang.mode;
            sourceEditor.session.setMode(`ace/mode/${detectedLang.mode}`);
            alert(`Detected language: ${detectedLang.name}`);
        } else {
            alert('Could not detect language. Please select manually.');
        }
    });
    
    function detectLanguageFromCode(code) {
        const lowerCode = code.toLowerCase();
        
        if (lowerCode.includes('def ') || lowerCode.includes('import ') || lowerCode.includes('print(')) {
            return languages.find(l => l.name === 'Python');
        }
        if (lowerCode.includes('function ') || lowerCode.includes('console.log(') || lowerCode.includes('const ') || lowerCode.includes('let ')) {
            return languages.find(l => l.name === 'JavaScript');
        }
        if (lowerCode.includes('public class ') || lowerCode.includes('System.out.println')) {
            return languages.find(l => l.name === 'Java');
        }
        if (lowerCode.includes('#include ') || lowerCode.includes('std::')) {
            return languages.find(l => l.name === 'C++');
        }
        if (lowerCode.includes('namespace ') || lowerCode.includes('Console.WriteLine')) {
            return languages.find(l => l.name === 'C#');
        }
        
        return null;
    }
    
    // Load sample code
    document.getElementById('loadSample').addEventListener('click', function() {
        const selectedLang = sourceLanguageSelect.value;
        if (!selectedLang) {
            alert('Please select a source language first');
            return;
        }
        
        const lang = languages.find(l => l.mode === selectedLang);
        if (!lang) return;
        
        // In a real app, you would load actual sample files
        const samples = {
            'python': `# Python sample code
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

print(factorial(5))`,
            'javascript': `// JavaScript sample code
function factorial(n) {
    if (n === 0) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

console.log(factorial(5));`,
            'java': `// Java sample code
public class Main {
    public static int factorial(int n) {
        if (n == 0) {
            return 1;
        } else {
            return n * factorial(n - 1);
        }
    }
    
    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}`,
            'c_cpp': `// C++ sample code
#include <iostream>

int factorial(int n) {
    if (n == 0) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

int main() {
    std::cout << factorial(5) << std::endl;
    return 0;
}`
        };
        
        const sample = samples[lang.mode] || `// Sample ${lang.name} code\n// No sample available for this language`;
        sourceEditor.setValue(sample);
        sourceEditor.session.setMode(`ace/mode/${lang.mode}`);
    });
    
    // Source language change
    sourceLanguageSelect.addEventListener('change', function() {
        const mode = this.value;
        if (mode) {
            sourceEditor.session.setMode(`ace/mode/${mode}`);
        }
    });
    
    // Target language change
    targetLanguageSelect.addEventListener('change', function() {
        const mode = this.value;
        if (mode) {
            targetEditor.session.setMode(`ace/mode/${mode}`);
        }
    });
    
    // Convert code
    document.getElementById('convertBtn').addEventListener('click', function() {
        const sourceLang = sourceLanguageSelect.value;
        const targetLang = targetLanguageSelect.value;
        const code = sourceEditor.getValue();
        
        if (!sourceLang || !targetLang) {
            alert('Please select both source and target languages');
            return;
        }
        
        if (!code.trim()) {
            alert('Please enter some code to convert');
            return;
        }
        
        if (sourceLang === targetLang) {
            alert('Source and target languages are the same');
            return;
        }
        
        // Show loading state
        const convertBtn = this;
        convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';
        convertBtn.disabled = true;
        
        // Simulate conversion (in a real app, you would call an API)
        setTimeout(() => {
            const convertedCode = simulateConversion(code, sourceLang, targetLang);
            targetEditor.setValue(convertedCode);
            
            // Add to history
            addToHistory(sourceLang, targetLang, code, convertedCode);
            
            // Reset button
            convertBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Convert';
            convertBtn.disabled = false;
        }, 1500);
    });
    
    function simulateConversion(code, sourceLang, targetLang) {
        const sourceLangName = languages.find(l => l.mode === sourceLang)?.name || 'Unknown';
        const targetLangName = languages.find(l => l.mode === targetLang)?.name || 'Unknown';
        
        // This is just a simulation - a real app would use an API or sophisticated conversion logic
        const includeComments = document.getElementById('includeComments').checked;
        const optimization = document.getElementById('optimizationLevel').value;
        
        let result = `// Converted from ${sourceLangName} to ${targetLangName}\n`;
        result += `// Optimization: ${optimization}\n`;
        result += `// ${new Date().toLocaleString()}\n\n`;
        
        // Very basic "conversion" examples
        if (sourceLang === 'python' && targetLang === 'javascript') {
            result += code
                .replace(/def (\w+)\(([^)]*)\):/g, 'function $1($2) {')
                .replace(/^(\s*)print\((.*)\)/gm, '$1console.log($2)')
                .replace(/^(\s*)if (.*):/gm, '$1if ($2) {')
                .replace(/^(\s*)else:/gm, '$1} else {')
                .replace(/^(\s*)elif (.*):/gm, '$1} else if ($2) {')
                .replace(/^(\s*)(return .*)/gm, '$1$2;\n$1}')
                .replace(/None/g, 'null')
                .replace(/True/g, 'true')
                .replace(/False/g, 'false');
        } else if (sourceLang === 'javascript' && targetLang === 'python') {
            result += code
                .replace(/function (\w+)\(([^)]*)\) \{/g, 'def $1($2):')
                .replace(/console\.log\((.*)\);/g, 'print($1)')
                .replace(/if \((.*)\) \{/g, 'if $1:')
                .replace(/\} else if \((.*)\) \{/g, 'elif $1:')
                .replace(/\} else \{/g, 'else:')
                .replace(/\}/g, '')
                .replace(/null/g, 'None')
                .replace(/true/g, 'True')
                .replace(/false/g, 'False')
                .replace(/;/g, '');
        } else {
            // Generic fallback
            result += `// Automatic conversion from ${sourceLangName} to ${targetLangName} is not yet implemented\n`;
            result += `// Here's the original code:\n\n${code}`;
        }
        
        if (!includeComments) {
            // Simple comment removal (would need more sophisticated parsing in real app)
            result = result.replace(/\/\/.*$/gm, '');
            result = result.replace(/\/\*[\s\S]*?\*\//g, '');
            result = result.replace(/#.*$/gm, '');
        }
        
        return result;
    }
    
    // Copy output
    document.getElementById('copyOutput').addEventListener('click', function() {
        const code = targetEditor.getValue();
        if (!code.trim()) {
            alert('No code to copy');
            return;
        }
        
        navigator.clipboard.writeText(code).then(() => {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy code');
        });
    });
    
    // Download output
    document.getElementById('downloadOutput').addEventListener('click', function() {
        const code = targetEditor.getValue();
        if (!code.trim()) {
            alert('No code to download');
            return;
        }
        
        const targetLang = targetLanguageSelect.value;
        const lang = languages.find(l => l.mode === targetLang);
        const extension = lang?.extension || 'txt';
        
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted_code.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // History functionality
    let history = JSON.parse(localStorage.getItem('codeConversionHistory')) || [];
    
    function addToHistory(sourceLang, targetLang, sourceCode, targetCode) {
        const sourceLangName = languages.find(l => l.mode === sourceLang)?.name || 'Unknown';
        const targetLangName = languages.find(l => l.mode === targetLang)?.name || 'Unknown';
        
        const timestamp = new Date().toISOString();
        const historyItem = {
            id: Date.now(),
            sourceLang,
            targetLang,
            sourceLangName,
            targetLangName,
            sourceCode,
            targetCode,
            timestamp
        };
        
        history.unshift(historyItem);
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        localStorage.setItem('codeConversionHistory', JSON.stringify(history));
        renderHistory();
    }
    
    function renderHistory() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            historyList.innerHTML = '<p>No conversion history yet</p>';
            return;
        }
        
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'history-item-info';
            infoDiv.innerHTML = `
                <strong>${item.sourceLangName} → ${item.targetLangName}</strong>
                <small>${new Date(item.timestamp).toLocaleString()}</small>
            `;
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'history-item-actions';
            actionsDiv.innerHTML = `
                <button data-id="${item.id}" class="view-history"><i class="fas fa-eye"></i></button>
                <button data-id="${item.id}" class="delete-history"><i class="fas fa-trash"></i></button>
            `;
            
            historyItem.appendChild(infoDiv);
            historyItem.appendChild(actionsDiv);
            historyList.appendChild(historyItem);
        });
        
        // Add event listeners to history buttons
        document.querySelectorAll('.view-history').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const item = history.find(i => i.id === id);
                if (item) {
                    sourceLanguageSelect.value = item.sourceLang;
                    targetLanguageSelect.value = item.targetLang;
                    sourceEditor.session.setMode(`ace/mode/${item.sourceLang}`);
                    targetEditor.session.setMode(`ace/mode/${item.targetLang}`);
                    sourceEditor.setValue(item.sourceCode);
                    targetEditor.setValue(item.targetCode);
                    window.scrollTo(0, 0);
                }
            });
        });
        
        document.querySelectorAll('.delete-history').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                history = history.filter(i => i.id !== id);
                localStorage.setItem('codeConversionHistory', JSON.stringify(history));
                renderHistory();
            });
        });
    }
    
    // Initial history render
    renderHistory();
});