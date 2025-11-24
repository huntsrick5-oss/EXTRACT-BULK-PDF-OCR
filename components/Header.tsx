import React from 'react';

export const Header: React.FC = () => (
  <header className="text-center space-y-2">
    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
      PDF OCR Extractor
    </h1>
    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
      Extract text from your PDFs with AI in under 20 seconds. Get a simple, text-based version in a flash.
    </p>
  </header>
);