import type { ReactNode } from 'react';
import { Header } from './Header';

export function MainLayout({ children, logoSrc }: { children: ReactNode; logoSrc: string }) {
  return (
    <div className="flex h-dvh flex-col">
      <Header logoSrc={logoSrc} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
