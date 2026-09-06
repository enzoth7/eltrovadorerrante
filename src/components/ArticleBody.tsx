import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function ArticleBody({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => <h2 className="mb-6 mt-14 font-body text-4xl font-bold leading-tight text-blue">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-5 mt-10 font-body text-2xl font-bold leading-tight text-blue">{children}</h3>,
        p: ({ children }) => <p>{children}</p>,
        blockquote: ({ children }) => <blockquote className="my-10 border-l-2 border-blue pl-7 font-quote text-2xl">{children}</blockquote>,
        ul: ({ children }) => <ul className="mb-8 list-disc space-y-3 pl-7">{children}</ul>,
        ol: ({ children }) => <ol className="mb-8 list-decimal space-y-3 pl-7">{children}</ol>,
        a: ({ href = '', children }) => {
          const className = 'underline decoration-1 underline-offset-4 hover:text-blue';
          return href.startsWith('/') ? <Link className={className} href={href}>{children}</Link> : <a className={className} href={href} rel="noreferrer" target="_blank">{children}</a>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
