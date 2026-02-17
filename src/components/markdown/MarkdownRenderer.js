import ReactMarkdown from "react-markdown";
import CodeBlockWithCopy from "./CodeBlockWithCopy";
import React from "react";
import remarkGfm from "remark-gfm";
import "../../css/markdown.css";

const MarkdownRenderer = ({ content = "" }) => (
  <ReactMarkdown
    className="markdown-body"
    remarkPlugins={[remarkGfm]}
    components={{
      code({ className, children }) {
        const match = /language-(\w+)/.exec(className || "");
        const isInlineCode = !className;

        return (
          <CodeBlockWithCopy
            language={match ? match[1] : ""}
            value={String(children).replace(/\n$/, "")}
            inline={isInlineCode}
          />
        );
      }
    }}
  >
    {content}
  </ReactMarkdown>
);

export default MarkdownRenderer;
