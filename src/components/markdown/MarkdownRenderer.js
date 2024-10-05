import ReactMarkdown from 'react-markdown';
import CodeBlockWithCopy from './CodeBlockWithCopy';
import React from "react";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ content = '' }) => (
    <ReactMarkdown remarkPlugins={[remarkGfm]}
        components={{
            code({ node, inline = false, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const isInlineCode = !className; // 如果没有 className，则为行内代码
                console.log('Is Inline: ', isInlineCode); // 打印出是否为行内代码

                return (
                    <CodeBlockWithCopy
                        language={match ? match[1] : ''} // 如果存在语言类型，则传递
                        value={String(children).replace(/\n$/, '')} // 将代码字符串化并传递
                        inline={isInlineCode} // 传递 isInlineCode 来判断行内代码
                    />
                );
            },
        }}
    >
        {content}
    </ReactMarkdown>
);

export default MarkdownRenderer;
