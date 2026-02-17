import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlockWithCopy = ({ language, value, inline }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return inline ? (
    <code className="markdown-inline-code">{value}</code>
  ) : (
    <div className="markdown-code">
      <SyntaxHighlighter language={language} style={materialDark}>
        {value}
      </SyntaxHighlighter>
      <button onClick={handleCopy} className={`markdown-code__copy ${copied ? "is-copied" : ""}`}>
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};

export default CodeBlockWithCopy;
