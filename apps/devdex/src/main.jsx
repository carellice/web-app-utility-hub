import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { PreferencesProvider } from './context/PreferencesContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { ProgressProvider } from './context/ProgressContext.jsx';
import { mdxComponents } from './components/mdxComponents.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <PreferencesProvider>
        <LanguageProvider>
          <ProgressProvider>
            <BrowserRouter>
              <MDXProvider components={mdxComponents}>
                <App />
              </MDXProvider>
            </BrowserRouter>
          </ProgressProvider>
        </LanguageProvider>
      </PreferencesProvider>
    </ThemeProvider>
  </React.StrictMode>
);
