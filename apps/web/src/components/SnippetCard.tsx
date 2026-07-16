'use client';

import React, { useState } from 'react';

interface SnippetProps {
  id: string;
  title: string;
  description?: string;
  language: string;
  code: string;
}

export function SnippetCard({ snippet }: { snippet: SnippetProps }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="item-card">
      <div className="card-header">
        <h3 className="card-title">{snippet.title}</h3>
        <div className="card-meta">
          <span className="badge">{snippet.language}</span>
        </div>
      </div>
      
      <div className="card-body">
        {snippet.description && (
          <p className="card-description">{snippet.description}</p>
        )}
        
        <div className="snippet-preview mono">
          <button className="copy-btn" onClick={handleCopy} title="Copy to clipboard">
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
          <pre>
            <code style={{ color: '#abb2bf' }}>
              {/* Simplistic preview rendering without heavy highlighting library yet */}
              {snippet.code.substring(0, 150)}{snippet.code.length > 150 ? '\n...' : ''}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
