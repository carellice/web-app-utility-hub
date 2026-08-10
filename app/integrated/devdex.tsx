"use client";

import { MDXProvider } from "@mdx-js/react";
import { MemoryRouter } from "react-router-dom";
import "../../apps/devdex/src/styles/global.css";
import DevDexApp from "../../apps/devdex/src/App.jsx";
import { mdxComponents } from "../../apps/devdex/src/components/mdxComponents.jsx";
import { LanguageProvider } from "../../apps/devdex/src/context/LanguageContext.jsx";
import { PreferencesProvider } from "../../apps/devdex/src/context/PreferencesContext.jsx";
import { ProgressProvider } from "../../apps/devdex/src/context/ProgressContext.jsx";
import { ThemeProvider } from "../../apps/devdex/src/context/ThemeContext.jsx";

export default function DevDex() {
  // MemoryRouter mantiene tutte le pagine di DevDex dentro l'hub, senza
  // trasformare le sue rotte didattiche in nuove pagine o nuovi server.
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <LanguageProvider>
          <ProgressProvider>
            <MemoryRouter initialEntries={["/"]}>
              <MDXProvider components={mdxComponents}>
                <DevDexApp logoSrc="/app-icons/devdex.png" />
              </MDXProvider>
            </MemoryRouter>
          </ProgressProvider>
        </LanguageProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
}
