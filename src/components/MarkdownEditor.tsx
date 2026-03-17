import { useState } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { ArticleContentRenderer } from './ArticleContentRenderer';
import {
  Eye,
  Edit,
  Bold,
  Italic,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Table,
  Quote,
  Info,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const insertLine = (text: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newText = value.substring(0, lineStart) + text + value.substring(lineStart);
    
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart + text.length, lineStart + text.length);
    }, 0);
  };

  const insertTable = () => {
    const table = `\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n\n`;
    insertMarkdown(table);
  };

  const insertCodeBlock = (language: string = '') => {
    insertMarkdown(`\n\`\`\`${language}\n`, `\n\`\`\`\n`);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'write' | 'preview')}>
        <div className="bg-muted/30 border-b">
          {/* Tabs Header */}
          <div className="flex items-center justify-between px-2 py-2">
            <TabsList>
              <TabsTrigger value="write" className="flex items-center gap-2">
                <Edit className="size-4" />
                Write
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="size-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            {/* Toolbar - Only show in Write mode */}
            {activeTab === 'write' && (
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown('**', '**')}
                  title="Bold"
                  className="size-8 p-0"
                >
                  <Bold className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown('*', '*')}
                  title="Italic"
                  className="size-8 p-0"
                >
                  <Italic className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown('`', '`')}
                  title="Inline Code"
                  className="size-8 p-0"
                >
                  <Code className="size-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertLine('# ')}
                  title="Heading 1"
                  className="size-8 p-0"
                >
                  <Heading1 className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertLine('## ')}
                  title="Heading 2"
                  className="size-8 p-0"
                >
                  <Heading2 className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertLine('### ')}
                  title="Heading 3"
                  className="size-8 p-0"
                >
                  <Heading3 className="size-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertLine('- ')}
                  title="Bullet List"
                  className="size-8 p-0"
                >
                  <List className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertLine('1. ')}
                  title="Numbered List"
                  className="size-8 p-0"
                >
                  <ListOrdered className="size-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown('[', '](url)')}
                  title="Link"
                  className="size-8 p-0"
                >
                  <LinkIcon className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown('![alt text](', ')')}
                  title="Image"
                  className="size-8 p-0"
                >
                  <ImageIcon className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={insertTable}
                  title="Table"
                  className="size-8 p-0"
                >
                  <Table className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertLine('> ')}
                  title="Quote"
                  className="size-8 p-0"
                >
                  <Quote className="size-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      title="Code Block"
                      className="size-8 p-0"
                    >
                      <Code className="size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => insertCodeBlock('')}
                      >
                        Plain Code
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => insertCodeBlock('python')}
                      >
                        Python
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => insertCodeBlock('javascript')}
                      >
                        JavaScript
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => insertCodeBlock('typescript')}
                      >
                        TypeScript
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => insertCodeBlock('json')}
                      >
                        JSON
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => insertCodeBlock('sql')}
                      >
                        SQL
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      title="Help"
                      className="size-8 p-0"
                    >
                      <Info className="size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2 text-sm">
                      <h4 className="font-semibold mb-2">Markdown Quick Reference</h4>
                      <div className="space-y-1 text-xs font-mono">
                        <p># Heading 1</p>
                        <p>## Heading 2</p>
                        <p>**bold** *italic*</p>
                        <p>[link](url)</p>
                        <p>![image](url)</p>
                        <p>- bullet list</p>
                        <p>1. numbered list</p>
                        <p>&gt; blockquote</p>
                        <p>`inline code`</p>
                        <p>```language</p>
                        <p>code block</p>
                        <p>```</p>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Use callouts: <br />
                          &gt; **Note:** for info <br />
                          &gt; **Warning:** for warnings <br />
                          &gt; **Tip:** for tips
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>

        <TabsContent value="write" className="m-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Write your article content in Markdown...'}
            className="min-h-[500px] max-h-[600px] font-mono text-sm border-0 rounded-none focus-visible:ring-0 resize-none"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            }}
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div className="min-h-[500px] max-h-[600px] overflow-y-auto p-6 bg-background">
            {value.trim() ? (
              <ArticleContentRenderer content={value} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <Eye className="size-12 mx-auto mb-4 opacity-50" />
                  <p>Nothing to preview yet</p>
                  <p className="text-sm">Start writing in the Write tab</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
