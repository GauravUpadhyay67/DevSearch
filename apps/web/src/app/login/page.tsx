'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '../../../src/components/Input';
import { Button } from '../../../src/components/Button';
import { OAuthButton } from '../../../src/components/OAuthButton';
import './login.css';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // TODO: Connect to backend local login API
    setTimeout(() => {
      setIsLoading(false);
      setError('Invalid credentials. Try OAuth instead.');
    }, 1000);
  };

  const handleOAuth = (provider: 'google' | 'github') => {
    window.location.href = `http://localhost:3001/auth/${provider}`;
  };

  return (
    <div className="split-layout animate-fade-in">
      {/* Left Showcase Pane */}
      <div className="showcase-side">
        <div className="showcase-content">
          <div className="login-logo mono" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            &gt;_ DevSearch<span className="login-logo-cursor"></span>
          </div>
          
          <h1 className="showcase-title text-gradient">
            Your Ultimate<br/>Developer Hub.
          </h1>
          
          <p className="showcase-subtitle">
            Save snippets, search code, and bookmark critical resources in one blazing-fast workspace designed exclusively for developers.
          </p>
          
          <div className="floating-code-wrapper">
            <div className="floating-code-card glass-panel">
              <div className="code-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <pre className="code-block mono">
                <code>
<span style={{color: '#c678dd'}}>import</span> {'{'} <span style={{color: '#e5c07b'}}>DevSearch</span> {'}'} <span style={{color: '#c678dd'}}>from</span> <span style={{color: '#98c379'}}>'@future/workflow'</span>;{'\n\n'}
<span style={{color: '#c678dd'}}>const</span> <span style={{color: '#61afef'}}>developer</span> = <span style={{color: '#c678dd'}}>new</span> <span style={{color: '#e5c07b'}}>DevSearch</span>({'{'}{'\n'}
  productivity: <span style={{color: '#d19a66'}}>1000</span>,{'\n'}
  stress: <span style={{color: '#d19a66'}}>0</span>,{'\n'}
  features: [<span style={{color: '#98c379'}}>'Snippets'</span>, <span style={{color: '#98c379'}}>'Search'</span>, <span style={{color: '#98c379'}}>'Bookmarks'</span>]{'\n'}
{'}'});{'\n\n'}
<span style={{color: '#61afef'}}>developer</span>.<span style={{color: '#56b6c2'}}>ignite</span>();
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Pane */}
      <div className="form-side">
        <div className="login-wrapper">
          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <Input 
              label="Email address"
              type="email" 
              placeholder="you@example.com"
              required
            />
            <Input 
              label="Password"
              type="password" 
              placeholder="••••••••"
              required
            />
            
            {error && <div className="login-error-alert">{error}</div>}
            
            <Button type="submit" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="oauth-container">
            <OAuthButton 
              provider="github" 
              label="GitHub" 
              onClick={() => handleOAuth('github')}
              type="button"
            />
            <OAuthButton 
              provider="google" 
              label="Google" 
              onClick={() => handleOAuth('google')}
              type="button"
            />
          </div>

          <p className="login-footer">
            No account? <Link href="/register">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
