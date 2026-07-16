'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import '../../login/login.css'; // Reusing for the glass panel styling

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Authenticating...');

  useEffect(() => {
    // Give a slight delay so the user sees the success message
    const timer = setTimeout(() => {
      const token = searchParams.get('token');
      
      if (token) {
        // Save the JWT token to local storage
        localStorage.setItem('accessToken', token);
        setStatus('Authentication successful! Redirecting...');
        
        // Redirect to the home dashboard (we'll build this later)
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setStatus('Authentication failed. No token received.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="login-container animate-fade-in">
      <div className="login-card glass-panel" style={{ textAlign: 'center' }}>
        <div className="mb-6">
          <svg className="spinner" viewBox="0 0 24 24" style={{ margin: '0 auto', width: '40px', height: '40px', borderTopColor: 'var(--accent-primary)' }}></svg>
        </div>
        <h2 className="login-title">Almost there!</h2>
        <p className="login-subtitle mt-4">{status}</p>
      </div>
    </div>
  );
}
