'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      login.mutate({ email, password, redirectTo: '/staff_portal' });
  };

  return (
    <div className="max-w-md m-auto mt-32 w-full space-y-8 p-10 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold text-center">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="admin@judiciary.go.tz"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={login.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {login.isPending ? 'Logging in...' : 'Login'}
        </button>
        {login.error && (
          <p className="text-red-500 py-2 text-sm">
            {(login.error as any)?.response?.data?.message || 
             login.error.message || 
             'Incorrect credentials. Please try again.'}
          </p>
        )}
        <p className="text-center">
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </p>
        {/* <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p> */}
      </form>
    </div>
  );
}