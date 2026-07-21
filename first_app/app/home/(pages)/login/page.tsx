// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';
import Link from 'next/link';
import TextInput from '@/app/components/TextInput';
import Button from '@/app/components/Button';
import { useTheme } from '@/app/context/ThemeContext';
import * as Fa from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const login = useLogin();
  const { isDarkTheme } = useTheme();

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) validateEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) validatePassword(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (isEmailValid && isPasswordValid) {
      login.mutate({ email, password, redirectTo: '/staff_portal' });
    }
  };

  return (
    <div className={`max-w-md m-auto mt-28 w-full space-y-8 p-10 rounded-lg shadow-lg transition-colors duration-300 ${
                isDarkTheme 
                  ? 'bg-slate-900/50 border-slate-700/50 ' 
                  : 'bg-white border-slate-200/80'
              }`}>
      <h2 className={`text-2xl font-bold text-center ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
        Sign In
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <TextInput
          type="email"
          value={email}
          onChange={handleEmailChange}
          label="Email"
          placeholder="admin@judiciary.go.tz"
          required
          error={emailError}
          isDarkTheme={isDarkTheme}
          autoComplete="email"
          icon={null}
          className="w-full"
        />

        <TextInput
          type="password"
          value={password}
          onChange={handlePasswordChange}
          label="Password"
          placeholder="••••••••"
          required
          error={passwordError}
          isDarkTheme={isDarkTheme}
          autoComplete="current-password"
          icon={null}
          className="w-full"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={login.isPending}
          icon={<Fa.FaSignInAlt className="w-4 h-4" />}
        >
          {login.isPending ? 'Logging in...' : 'Login'}
        </Button>

        {login.error && (
          <p className="text-red-600 dark:text-red-400 text-sm text-center">
            Incorrect credentials. Please try again.
          </p>
        )}

        <div className="flex flex-col items-center gap-2 pt-1">
          <Link 
            href="/forgot-password" 
            className="text-md text-blue-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:underline transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}