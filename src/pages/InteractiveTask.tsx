import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSessionStore } from '../store/session';

export function InteractiveTask() {
  const navigate = useNavigate();
  const { sessionId } = useSessionStore();
  const [clickedTargets, setClickedTargets] = useState<number[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalTargets = 10;

  const handleTargetClick = (index: number) => {
    if (!clickedTargets.includes(index)) {
      setClickedTargets(prev => [...prev, index]);
    }
  };

  const handleSubmit = async () => {
    if (clickedTargets.length !== totalTargets) return;
    
    setIsSubmitting(true);
    try {
      if (!sessionId) throw new Error('No session ID found');

      const duration = Date.now() - startTime;
      
      const { error } = await supabase
        .from('task_completions')
        .insert([
          {
            session_id: sessionId,
            task_type: 'interactive',
            duration: duration
          }
        ]);

      if (error) throw error;
      navigate('/browsing');
    } catch (error) {
      console.error('Error saving task completion:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Interactive Task
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Click all {totalTargets} targets in any order
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Progress: {clickedTargets.length} / {totalTargets}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: totalTargets }).map((_, index) => (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center rounded-lg transition-all duration-300 ${
                clickedTargets.includes(index)
                  ? 'bg-green-100 cursor-default'
                  : 'bg-white shadow-md hover:shadow-lg cursor-pointer'
              }`}
              onClick={() => handleTargetClick(index)}
            >
              <Target
                className={`w-12 h-12 transition-colors ${
                  clickedTargets.includes(index)
                    ? 'text-green-500'
                    : 'text-indigo-500'
                }`}
              />
            </div>
          ))}
        </div>

        {clickedTargets.length === totalTargets && (
          <div className="mt-12 text-center">
            <div className="text-2xl font-bold text-green-600 mb-4">
              All targets clicked!
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                isSubmitting
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Complete Task & Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}