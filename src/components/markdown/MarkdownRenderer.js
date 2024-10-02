import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlockWithCopy from './CodeBlockWithCopy';

const markdown = `
\`\`\`sql
CREATE INDEX idx_content ON blog_posts (content(100));
\`\`\`
`;

const MarkdownRenderer = ({ content = '' }) => (
    <ReactMarkdown
        components={{
            code({ node, inline, className, children, ...props }) {
                // 尝试匹配 language- 的类，如果没有匹配到，语言可以为空字符串
                const match = /language-(\w+)/.exec(className || '');
                return !inline ? (
                    <CodeBlockWithCopy
                        language={match ? match[1] : ''}  // 如果没有指定语言，传空字符串
                        value={String(children).replace(/\n$/, '')}
                    />
                ) : (
                    <code className={className} {...props}>
                        {children}
                    </code>
                );
            },
        }}
    >
        {content}
    </ReactMarkdown>
);

export default MarkdownRenderer;

