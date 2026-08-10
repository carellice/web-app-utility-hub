import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vscDarkPlus,
  oneLight
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../context/ThemeContext.jsx';

function CodeBlock({ className = '', children, ...rest }) {
  const { theme } = useTheme();
  const match = /language-(\w+)/.exec(className);
  const language = match ? match[1] : 'text';
  const code = String(children).replace(/\n$/, '');

  if (!match) {
    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  }

  return (
    <SyntaxHighlighter
      language={language}
      style={theme === 'dark' ? vscDarkPlus : oneLight}
      customStyle={{
        margin: 0,
        padding: '16px 18px',
        background: theme === 'dark' ? '#0d1430' : '#f7f7fb',
        fontSize: '13.5px',
        lineHeight: 1.55
      }}
      PreTag="div"
    >
      {code}
    </SyntaxHighlighter>
  );
}

export const mdxComponents = {
  code: CodeBlock,
  pre: ({ children }) => <pre>{children}</pre>
};
