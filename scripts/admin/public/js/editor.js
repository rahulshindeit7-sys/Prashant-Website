// Config Editor Component (uses textarea as fallback, CodeMirror CDN optional)
window.Editor = (function() {
  'use strict';

  let editorElement = null;
  let textarea = null;

  function initEditor() {
    const container = document.getElementById('editor-container');
    container.innerHTML = '';

    textarea = document.createElement('textarea');
    textarea.className = 'editor-textarea';
    textarea.style.cssText = 'width:100%;height:300px;font-family:monospace;font-size:0.85rem;padding:1rem;border:none;resize:vertical;outline:none;tab-size:2;';
    textarea.spellcheck = false;
    container.appendChild(textarea);

    // Try to load CodeMirror from CDN for enhanced editing
    loadCodeMirror(container);

    editorElement = container;
  }

  function loadCodeMirror(container) {
    // Optional: load CodeMirror for JSON syntax highlighting
    if (document.getElementById('codemirror-css')) return;

    const link = document.createElement('link');
    link.id = 'codemirror-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js';
    script.onload = () => {
      const modeScript = document.createElement('script');
      modeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js';
      modeScript.onload = () => {
        if (textarea && window.CodeMirror) {
          const cm = window.CodeMirror.fromTextArea(textarea, {
            mode: { name: 'javascript', json: true },
            lineNumbers: true,
            theme: 'default',
            tabSize: 2,
            matchBrackets: true,
            autoCloseBrackets: true
          });
          cm.setSize('100%', '300px');
          // Store reference for getEditorContent
          container._codeMirror = cm;
        }
      };
      document.head.appendChild(modeScript);
    };
    document.head.appendChild(script);
  }

  function loadConfig(config) {
    if (!textarea) initEditor();
    const content = JSON.stringify(config, null, 2);
    textarea.value = content;

    // If CodeMirror is loaded, update it
    const container = document.getElementById('editor-container');
    if (container._codeMirror) {
      container._codeMirror.setValue(content);
    }
  }

  function getEditorContent() {
    const container = document.getElementById('editor-container');
    if (container._codeMirror) {
      return container._codeMirror.getValue();
    }
    return textarea ? textarea.value : '';
  }

  function highlightErrors(errors) {
    // Simple error display below editor
    const container = document.getElementById('editor-container');
    let errorDiv = container.querySelector('.editor-errors');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'editor-errors';
      errorDiv.style.cssText = 'color:var(--color-danger);font-size:0.8rem;padding:0.5rem;';
      container.appendChild(errorDiv);
    }
    if (errors && errors.length > 0) {
      errorDiv.textContent = errors.join('; ');
      errorDiv.style.display = 'block';
    } else {
      errorDiv.style.display = 'none';
    }
  }

  // Auto-init when DOM is ready
  document.addEventListener('DOMContentLoaded', initEditor);

  return {
    initEditor,
    loadConfig,
    getEditorContent,
    highlightErrors
  };
})();
