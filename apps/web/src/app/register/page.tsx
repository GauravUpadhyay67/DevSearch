'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '../../../src/components/Input';
import { Button } from '../../../src/components/Button';
import { OAuthButton } from '../../../src/components/OAuthButton';
import '../login/login.css';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // TODO: Connect to backend local register API
    setTimeout(() => {
      setIsLoading(false);
      setError('Registration is currently disabled for demo purposes.');
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
            Build your second<br/>developer brain.
          </h1>
          
          <p className="showcase-subtitle">
            Never lose a snippet again. Join DevSearch to sync your workflow across all your devices securely.
          </p>
          
          <div className="floating-code-wrapper">
            <div className="floating-code-card glass-panel" style={{ animationDelay: '0.2s' }}>
              <div className="code-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <pre className="code-block mono">
                <code>
<span style={{color: '#c678dd'}}>async function</span> <span style={{color: '#61afef'}}>joinDevSearch</span>() {'{'}{'\n'}
  <span style={{color: '#c678dd'}}>const</span> <span style={{color: '#e5c07b'}}>future</span> = <span style={{color: '#c678dd'}}>await</span> <span style={{color: '#56b6c2'}}>register</span>({'{'}{'\n'}
    role: <span style={{color: '#98c379'}}>'10x Developer'</span>,{'\n'}
    motivation: <span style={{color: '#d19a66'}}>Infinity</span>{'\n'}
  {'}'});{'\n\n'}
  <span style={{color: '#c678dd'}}>return</span> <span style={{color: '#e5c07b'}}>future</span>.<span style={{color: '#56b6c2'}}>unlockPotential</span>();{'\n'}
{'}'}
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
            <h2 className="login-title">Create Account</h2>
            <p className="login-subtitle">Start your journey today</p>
          </div>

          <form onSubmit={handleRegister} className="login-form">
            <Input 
              label="Username"
              type="text" 
              placeholder="developer123"
              required
            />
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
              Sign Up
            </Button>
          </form>

          <div className="divider">
            <span>or sign up with</span>
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
            Already have an account? <Link href="/login">Sign in instead</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
