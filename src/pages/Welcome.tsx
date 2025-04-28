import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/session';
import { MousePointer2, Keyboard, Brain } from 'lucide-react';

export function Welcome() {
  const navigate = useNavigate();
  const { sessionId, initializeSession } = useSessionStore();

  const handleStart = async () => {
    if (!sessionId) {
      await initializeSession();
    }
    navigate('/form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Behavioral Biometrics Study
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Participate in our research study to help us understand human-computer interaction patterns.
            No sign-up required - you'll receive a unique identifier at the end.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center">
                <Keyboard className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Keystroke Analysis</h3>
              <p className="mt-2 text-gray-500">
                Measures typing patterns and rhythms during various tasks
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center">
                <MousePointer2 className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Mouse Dynamics</h3>
              <p className="mt-2 text-gray-500">
                Tracks mouse movement patterns and interaction styles
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center">
                <Brain className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Behavioral Patterns</h3>
              <p className="mt-2 text-gray-500">
                Analyzes interaction patterns across different tasks
              </p>
            </div>
          </div>

          <div className="mt-12">
            <button
              onClick={handleStart}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start the Study
            </button>
            <p className="mt-4 text-sm text-gray-500">
              Estimated completion time: 10-15 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}