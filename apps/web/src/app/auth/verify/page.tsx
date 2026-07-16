'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchApi } from '../../../lib/api';
import { Button } from '../../../components/Button';
import '../login/login.css';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetchApi(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Verification failed. The token may be invalid or expired.');
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="login-wrapper">
      <div className="login-header animate-fade-in" style={{ textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⌛</div>
            <h2 className="login-title">Verifying</h2>
            <p className="login-subtitle">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 className="login-title">Verified!</h2>
            <p className="login-subtitle" style={{ marginBottom: '2rem' }}>{message}</p>
            <Button onClick={() => router.push('/login')}>Go to Sign In</Button>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <h2 className="login-title">Verification Failed</h2>
            <p className="login-subtitle" style={{ marginBottom: '2rem', color: '#ff5f56' }}>{message}</p>
            <Button onClick={() => router.push('/register')}>Back to Register</Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="split-layout animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="form-side" style={{ borderLeft: 'none', background: 'transparent', boxShadow: 'none' }}>
        <Suspense fallback={
          <div className="login-wrapper" style={{ textAlign: 'center' }}>
            <h2 className="login-title">Loading...</h2>
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
