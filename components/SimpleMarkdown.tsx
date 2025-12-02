import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface SimpleMarkdownProps {
  content: string;
}

interface CodeBlockProps {
  language: string;
  code: string;
}

// Sub-component for rendering Code Blocks with Copy functionality
const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-900 shadow-md my-4 group">
      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-mono border-b border-gray-700 flex justify-between items-center">
        <span className="uppercase">{language || 'VBA'}</span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all ${
            isCopied 
              ? 'text-green-400 bg-green-900/30' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          title="コードをコピー"
        >
          {isCopied ? (
            <>
              <CheckIcon className="w-3.5 h-3.5" />
              <span>コピー完了</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-3.5 h-3.5" />
              <span>コピー</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto custom-scrollbar">
        <code className="font-mono text-sm text-green-400 whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
};

const SimpleMarkdown: React.FC<SimpleMarkdownProps> = ({ content }) => {
  // Basic split to separate code blocks from text
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-4 text-gray-800 leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // Robust parsing logic to separate language from code
          // Remove the outer backticks
          let rawContent = part.slice(3, -3);

          // Normalize newlines to handle \r\n (Windows) properly
          rawContent = rawContent.replace(/\r\n/g, '\n');
          // Escape sequences in JSON sometimes leave literal \n strings, fix those
          rawContent = rawContent.replace(/\\n/g, '\n');

          // Find the end of the language identifier line
          const firstNewLine = rawContent.indexOf('\n');

          let lang = '';
          let code = rawContent;

          if (firstNewLine !== -1) {
             // Extract the first line to check if it's a language identifier
             const firstLine = rawContent.slice(0, firstNewLine).trim();
             
             // If the first line is short, alphanumeric, and doesn't contain spaces, treat it as language
             // e.g. "vba", "typescript", "json"
             if (firstLine.length > 0 && firstLine.length < 20 && /^[a-zA-Z0-9\+\-\#\.]+$/.test(firstLine)) {
                 lang = firstLine;
                 code = rawContent.slice(firstNewLine + 1); // Content after the language tag
             }
          }

          // Trim extra whitespace from the beginning and end of the code block
          // but preserve indentation structure
          code = code.replace(/^\n+/, '').replace(/\n+$/, '');

          return <CodeBlock key={index} language={lang} code={code} />;
        } else {
            // Basic text formatting for bold, headers, list items
            const lines = part.split('\n');
            return (
                <div key={index}>
                    {lines.map((line, lineIdx) => {
                        const key = `${index}-${lineIdx}`;
                        const trimmed = line.trim();
                        
                        if (line.startsWith('# ')) return <h1 key={key} className="text-3xl font-bold text-green-800 mt-6 mb-3">{line.slice(2)}</h1>;
                        if (line.startsWith('## ')) return <h2 key={key} className="text-2xl font-semibold text-green-700 mt-5 mb-2">{line.slice(3)}</h2>;
                        if (line.startsWith('* ')) return <li key={key} className="ml-5 list-disc mb-1">{parseBold(line.slice(2))}</li>;
                        if (trimmed.match(/^\d+\./)) return <li key={key} className="ml-5 list-decimal mb-1">{parseBold(line.replace(/^\d+\.\s*/, ''))}</li>;
                        if (trimmed === '') return <div key={key} className="h-2"></div>;
                        
                        // Handle table rows (simple implementation)
                        if (line.startsWith('|') && line.endsWith('|')) {
                            const cells = line.split('|').filter(c => c !== '');
                            // Simple check to see if it's a separator line like |---|---|
                            if (cells.every(c => c.trim().match(/^-+$/))) return null;
                            
                            return (
                                <div key={key} className="flex border-b border-gray-200 last:border-0">
                                    {cells.map((cell, cIdx) => (
                                        <div key={cIdx} className="flex-1 p-2 text-sm border-r border-gray-200 last:border-0 bg-gray-50/50">
                                            {parseBold(cell.trim())}
                                        </div>
                                    ))}
                                </div>
                            );
                        }

                        return <p key={key} className="mb-2">{parseBold(line)}</p>;
                    })}
                </div>
            )
        }
      })}
    </div>
  );
};

// Helper to handle simple **bold** syntax
const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

export default SimpleMarkdown;