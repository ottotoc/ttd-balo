import React, { useRef, useEffect } from 'react'

/**
 * Simple Rich Text Editor using contentEditable
 * Không cần nhập HTML, chỉ cần nhập text bình thường và format bằng toolbar
 */
export default function SimpleRichEditor({ value = '', onChange, placeholder = 'Viết nội dung blog...' }) {
  const editorRef = useRef(null)
  const isUpdatingRef = useRef(false)

  // Update content when value prop changes (from outside)
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  // Handle input changes
  const handleInput = () => {
    if (!editorRef.current || isUpdatingRef.current) return
    
    isUpdatingRef.current = true
    const html = editorRef.current.innerHTML
    onChange(html)
    setTimeout(() => {
      isUpdatingRef.current = false
    }, 0)
  }

  // Toolbar commands
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  // Check if command is active
  const isCommandActive = (command) => {
    return document.queryCommandState(command)
  }

  return (
    <div className="simple-rich-editor">
      {/* Toolbar */}
      <div className="toolbar border-bottom p-2 bg-light d-flex flex-wrap gap-2 align-items-center">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-sm btn-outline-secondary ${isCommandActive('bold') ? 'active' : ''}`}
            onClick={() => execCommand('bold')}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className={`btn btn-sm btn-outline-secondary ${isCommandActive('italic') ? 'active' : ''}`}
            onClick={() => execCommand('italic')}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className={`btn btn-sm btn-outline-secondary ${isCommandActive('underline') ? 'active' : ''}`}
            onClick={() => execCommand('underline')}
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </button>
        </div>

        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => execCommand('formatBlock', 'h2')}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => execCommand('formatBlock', 'h3')}
            title="Heading 3"
          >
            H3
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => execCommand('formatBlock', 'p')}
            title="Paragraph"
          >
            P
          </button>
        </div>

        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => execCommand('insertUnorderedList')}
            title="Bullet List"
          >
            • List
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => execCommand('insertOrderedList')}
            title="Numbered List"
          >
            1. List
          </button>
        </div>

        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              const url = prompt('Nhập URL:')
              if (url) execCommand('createLink', url)
            }}
            title="Insert Link"
          >
            🔗 Link
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => execCommand('removeFormat')}
            title="Remove Formatting"
          >
            🧹 Clear
          </button>
        </div>

        <div className="btn-group ms-auto" role="group">
          <button
            type="button"
            className="btn btn-sm btn-outline-info"
            onClick={() => {
              if (editorRef.current) {
                const html = editorRef.current.innerHTML
                if (import.meta.env.DEV) {
                  console.log('HTML Output:', html)
                }
                alert('HTML đã được copy vào console!')
              }
            }}
            title="View HTML"
          >
            📄 HTML
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={(e) => {
          e.preventDefault()
          const text = e.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, text)
        }}
        className="editor-content border p-3"
        style={{
          minHeight: '400px',
          maxHeight: '600px',
          overflow: 'auto',
          outline: 'none',
          fontSize: '16px',
          lineHeight: '1.6',
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <style>{`
        .simple-rich-editor .editor-content:empty:before {
          content: attr(data-placeholder);
          color: #6c757d;
          pointer-events: none;
        }
        .simple-rich-editor .editor-content:focus {
          outline: 2px solid #0d6efd;
          outline-offset: -2px;
        }
        .simple-rich-editor .toolbar .btn.active {
          background-color: #0d6efd;
          color: white;
          border-color: #0d6efd;
        }
        .simple-rich-editor .editor-content h2 {
          font-size: 1.75rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .simple-rich-editor .editor-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .simple-rich-editor .editor-content p {
          margin-bottom: 1rem;
        }
        .simple-rich-editor .editor-content ul,
        .simple-rich-editor .editor-content ol {
          margin-bottom: 1rem;
          padding-left: 2rem;
        }
        .simple-rich-editor .editor-content li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  )
}

