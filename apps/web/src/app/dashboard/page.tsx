'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '../../../src/lib/api';
import { SnippetCard } from '../../../src/components/SnippetCard';
import { BookmarkCard } from '../../../src/components/BookmarkCard';

export default function DashboardPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [snippetsRes, bookmarksRes] = await Promise.all([
          fetchApi('/snippets'),
          fetchApi('/bookmarks')
        ]);
        
        // Combine and sort by date created (assuming newest first)
        const combined = [
          ...(snippetsRes || []).map((s: any) => ({ ...s, type: 'snippet' })),
          ...(bookmarksRes || []).map((b: any) => ({ ...b, type: 'bookmark' }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setItems(combined);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="empty-state">
        <div className="empty-icon" style={{ animation: 'pulse 2s infinite' }}>⚡</div>
        <h2 className="empty-title">Loading Workspace...</h2>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-state animate-fade-in" style={{ zIndex: 1, position: 'relative', height: '100%' }}>
        <div className="glass-panel" style={{ padding: '4rem 3rem', maxWidth: '600px', width: '100%', margin: '0 auto', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div className="empty-icon" style={{ opacity: 1, marginBottom: '2rem' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 20px rgba(129, 140, 248, 0.4))' }}>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-primary)" />
                  <stop offset="100%" stopColor="var(--accent-secondary)" />
                </linearGradient>
              </defs>
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
              <polyline points="8 10 12 14 16 10"></polyline>
            </svg>
          </div>
          <h2 className="empty-title text-gradient" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your workspace is ready</h2>
          <p style={{ margin: '0 auto 2.5rem', color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            You don't have any snippets or bookmarks yet. Start building your personal developer brain by adding your first item.
          </p>
          <button className="add-btn" style={{ margin: '0 auto', padding: '1rem 2rem', fontSize: '1rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Your First Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="items-grid">
        {items.map(item => (
          item.type === 'snippet' 
            ? <SnippetCard key={`snippet-${item.id}`} snippet={item} />
            : <BookmarkCard key={`bookmark-${item.id}`} bookmark={item} />
        ))}
      </div>
    </div>
  );
}
