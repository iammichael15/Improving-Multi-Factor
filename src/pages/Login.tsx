import React, { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { Lock, User } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err?.message?.includes('Invalid login credentials')) {
        setError('The email or password you entered is incorrect');
      } else if (err?.message?.includes('already registered')) {
        setError('This email is already registered. Please sign in instead.');
      } else if (err?.message?.includes('network')) {
        setError('Network error. Please check your internet connection.');
      } else if (err?.message?.includes('session')) {
        setError('Session expired. Please sign in again.');
      } else {
        setError('An error occurred. Please try again. If the problem persists, try clearing your browser cache.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    clearForm();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {isSignUp ? 'Sign up to get started' : 'Please sign in to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>
            {isSignUp && (
              <p className="mt-1 text-sm text-gray-500">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
              <p>{error}</p>
              {!isSignUp && error.includes('incorrect') && (
                <p className="mt-1">
                  <button
                    type="button"
                    onClick={clearForm}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Try again
                  </button>
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {isLoading 
              ? (isSignUp ? 'Creating account...' : 'Signing in...') 
              : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}