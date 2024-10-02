import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlockWithCopy = ({ language, value, inline}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return inline ? (
        // 行内代码的显示
        <code style={{ background: '#f0f0f0', padding: '2px 5px', borderRadius: '3px' }}>
            {value}
        </code>
    ) : (
        // 多行代码块，带复制按钮
        <div style={{ position: 'relative' }}>
            <SyntaxHighlighter language={language} style={materialDark}>
                {value}
            </SyntaxHighlighter>

            <button
                onClick={handleCopy}
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    background: copied ? 'green' : 'grey',
                    color: 'white',
                    border: 'none',
                    padding: '5px',
                    cursor: 'pointer',
                    borderRadius: '5px', // 圆角
                }}
            >
                {copied ? 'Copied!' : 'Copy Code'}
            </button>
        </div>
    );
};

export default CodeBlockWithCopy;
