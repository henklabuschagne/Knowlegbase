import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertHeading = (level: number) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const heading = document.createElement(`h${level}`);
    
    try {
      range.surroundContents(heading);
      handleInput();
    } catch (e) {
      // Fallback for complex selections
      execCommand('formatBlock', `<h${level}>`);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
  ];

  const formatButtons = [
    { icon: Heading1, action: () => insertHeading(1), title: 'Heading 1' },
    { icon: Heading2, action: () => insertHeading(2), title: 'Heading 2' },
    { icon: Heading3, action: () => insertHeading(3), title: 'Heading 3' },
  ];

  const listButtons = [
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
  ];

  const insertButtons = [
    { icon: LinkIcon, action: insertLink, title: 'Insert Link' },
    { icon: ImageIcon, action: insertImage, title: 'Insert Image' },
    { icon: Code, command: 'formatBlock', value: '<pre>', title: 'Code Block' },
    { icon: Quote, command: 'formatBlock', value: '<blockquote>', title: 'Quote' },
  ];

  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        isFocused ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      {/* Toolbar */}
      <div className="bg-muted border-b p-2 flex flex-wrap gap-1">
        {/* Text Style Buttons */}
        {toolbarButtons.map((btn, idx) => (
          <Button
            key={idx}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand(btn.command)}
            title={btn.title}
            className="size-8 p-0"
          >
            <btn.icon className="size-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-8 mx-1" />

        {/* Format Buttons */}
        {formatButtons.map((btn, idx) => (
          <Button
            key={idx}
            type="button"
            variant="ghost"
            size="sm"
            onClick={btn.action}
            title={btn.title}
            className="size-8 p-0"
          >
            <btn.icon className="size-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-8 mx-1" />

        {/* List Buttons */}
        {listButtons.map((btn, idx) => (
          <Button
            key={idx}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand(btn.command)}
            title={btn.title}
            className="size-8 p-0"
          >
            <btn.icon className="size-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-8 mx-1" />

        {/* Insert Buttons */}
        {insertButtons.map((btn, idx) => (
          <Button
            key={idx}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              btn.action ? btn.action() : execCommand(btn.command!, btn.value)
            }
            title={btn.title}
            className="size-8 p-0"
          >
            <btn.icon className="size-4" />
          </Button>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="p-4 min-h-[400px] max-h-[600px] overflow-y-auto focus:outline-none prose prose-sm max-w-none"
        style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}
        data-placeholder={placeholder}
      />

      <style>{`
        [contentEditable=true]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          position: absolute;
        }
        
        .prose h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }
        
        .prose h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.75em;
          margin-bottom: 0.75em;
        }
        
        .prose h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
        
        .prose ul, .prose ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        
        .prose li {
          margin: 0.5em 0;
        }
        
        .prose blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          color: #6b7280;
        }
        
        .prose pre {
          background-color: #f3f4f6;
          padding: 1em;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-family: monospace;
        }
        
        .prose code {
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.9em;
        }
        
        .prose a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .prose img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
        }
      `}</style>
    </div>
  );
}