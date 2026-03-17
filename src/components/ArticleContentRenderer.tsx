import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface ArticleContentRendererProps {
  content: string;
  isDark?: boolean;
}

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ArticleContentRenderer({ content, isDark = false }: ArticleContentRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="article-content">
      <ReactMarkdown
        components={{
          // Headings with proper styling and anchors
          h1: ({ children }) => {
            const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return (
              <h1 id={id} className="text-4xl font-semibold mt-8 mb-4 pb-2 border-b border-border first:mt-0 scroll-mt-20">
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return (
              <h2 id={id} className="text-3xl font-semibold mt-8 mb-4 pb-2 border-b border-border scroll-mt-20">
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return (
              <h3 id={id} className="text-2xl font-semibold mt-6 mb-3 scroll-mt-20">
                {children}
              </h3>
            );
          },
          h4: ({ children }) => {
            const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return (
              <h4 id={id} className="text-xl font-semibold mt-4 mb-2 scroll-mt-20">
                {children}
              </h4>
            );
          },
          h5: ({ children }) => (
            <h5 className="text-lg font-semibold mt-3 mb-2">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-base font-semibold mt-2 mb-1">
              {children}
            </h6>
          ),

          // Paragraphs with spacing
          p: ({ children }) => (
            <p className="mb-4 leading-7 text-foreground/90">
              {children}
            </p>
          ),

          // Lists with proper styling
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc space-y-2 marker:text-primary/60">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-2 marker:text-primary/60">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-7 pl-1">
              {children}
            </li>
          ),

          // Blockquotes with enhanced styling for callouts
          blockquote: ({ children }) => {
            const content = String(children);
            const isNote = content.toLowerCase().includes('note:');
            const isWarning = content.toLowerCase().includes('warning:') || content.toLowerCase().includes('caution:');
            const isTip = content.toLowerCase().includes('tip:') || content.toLowerCase().includes('💡');
            
            let className = 'my-4 border-l-4 pl-4 pr-4 py-3 rounded-r ';
            let icon = null;
            
            if (isWarning) {
              className += 'border-yellow-500 bg-yellow-50 text-yellow-900';
              icon = <AlertTriangle className="size-5 text-yellow-600 mr-2 flex-shrink-0" />;
            } else if (isTip) {
              className += 'border-blue-500 bg-blue-50 text-blue-900';
              icon = <Lightbulb className="size-5 text-blue-600 mr-2 flex-shrink-0" />;
            } else if (isNote) {
              className += 'border-green-500 bg-green-50 text-green-900';
              icon = <Info className="size-5 text-green-600 mr-2 flex-shrink-0" />;
            } else {
              className += 'border-primary/40 bg-muted/50 italic';
            }

            return (
              <blockquote className={className}>
                <div className="flex items-start">
                  {icon}
                  <div className="flex-1">{children}</div>
                </div>
              </blockquote>
            );
          },

          // Tables with professional styling
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-lg border border-border shadow-sm">
              <table className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/70">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border bg-background">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/30 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-semibold text-sm border-b-2 border-border">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm">
              {children}
            </td>
          ),

          // Code blocks with syntax highlighting
          code: ({ inline, className, children, ...props }: CodeBlockProps) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');
            const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

            // Inline code
            if (inline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-sm border border-border/50"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // Code block with syntax highlighting
            return (
              <div className="relative group my-4">
                <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-t-lg border border-b-0 border-border">
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    {language || 'code'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => handleCopyCode(codeString, codeId)}
                  >
                    {copiedCode === codeId ? (
                      <>
                        <Check className="size-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="size-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <SyntaxHighlighter
                  style={isDark ? oneDark : oneLight}
                  language={language || 'text'}
                  PreTag="div"
                  className="!my-0 !mt-0 text-sm rounded-t-none"
                  customStyle={{
                    margin: 0,
                    borderRadius: '0 0 0.5rem 0.5rem',
                    border: '1px solid var(--color-border)',
                    borderTop: 'none',
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      fontSize: '0.875rem',
                      lineHeight: '1.7',
                    }
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          },

          // Links with hover effects
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-primary underline decoration-primary/30 hover:decoration-primary transition-colors font-medium"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),

          // Horizontal rules
          hr: () => (
            <hr className="my-8 border-t border-border" />
          ),

          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground/90">
              {children}
            </em>
          ),

          // Images with proper styling
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="max-w-full h-auto rounded-lg border border-border my-4 shadow-sm"
              loading="lazy"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>

      <style>{`
        .article-content {
          color: var(--color-foreground);
        }
        
        /* Remove default margins from first and last children */
        .article-content > *:first-child {
          margin-top: 0 !important;
        }
        
        .article-content > *:last-child {
          margin-bottom: 0 !important;
        }

        /* Nested list spacing */
        .article-content ul ul,
        .article-content ul ol,
        .article-content ol ul,
        .article-content ol ol {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        /* Smooth scrolling for anchor links */
        html {
          scroll-behavior: smooth;
        }

        /* Code block scrolling */
        .article-content pre {
          max-width: 100%;
          overflow-x: auto;
        }

        /* Table responsiveness */
        .article-content table {
          display: table;
          width: 100%;
        }

        /* Print styles */
        @media print {
          .article-content {
            font-size: 12pt;
            line-height: 1.6;
          }
          
          .article-content pre {
            page-break-inside: avoid;
            border: 1px solid #ccc;
            padding: 1em;
          }
          
          .article-content table {
            page-break-inside: avoid;
            border: 1px solid #ccc;
          }

          .article-content a {
            text-decoration: underline;
            color: #000;
          }

          .article-content a[href^="http"]::after {
            content: " (" attr(href) ")";
            font-size: 0.8em;
          }
        }
      `}</style>
    </div>
  );
}