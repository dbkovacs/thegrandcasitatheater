// File: src/Layout.tsx
import React from 'react';

// FIX: Define the type for the props
interface LayoutProps {
  children: React.ReactNode; // 'React.ReactNode' is the correct type for children
}

const buildTimestamp = "2025-09-15 13:30 PM";

// FIX: Apply the type to the component's props
function Layout({ children }: LayoutProps) {
  return (
    <div className="site-wrapper">
      <header className="site-header">
        {/* Header content */}
      </header>
      <main className="site-content">
        {children}
      </main>
      <footer className="site-footer">
        <p>Last updated: {buildTimestamp}</p>
      </footer>
    </div>
  );
}

export default Layout;