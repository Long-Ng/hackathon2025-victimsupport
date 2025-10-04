
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Safe Harbor AI Assistant
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">A confidential space for support and guidance.</p>
      </div>
    </header>
  );
};

export default Header;
