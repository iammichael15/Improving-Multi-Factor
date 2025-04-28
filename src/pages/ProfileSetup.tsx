import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';

export function ProfileSetup() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [ageGroup, setAgeGroup] = useState<string>('');
  const [technicalProficiency, setTechnicalProficiency] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Load existing profile data if it exists
    const loadProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('age_group, technical_proficiency')
          .eq('id', user.id)
          .single();

        if (fetchError) throw fetchError;
        
        if (data) {
          setAgeGroup(data.age_group);
          setTechnicalProficiency(data.technical_proficiency);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };

    loadProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      const profileData = {
        id: user.id,
        age_group: ageGroup,
        technical_proficiency: technicalProficiency,
      };

      let error;

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id);
        error = updateError;
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([profileData]);
        error = insertError;
      }

      if (error) throw error;
      
      navigate('/form');
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error('Profile save error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please provide some information about yourself
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700">
                Age Group
              </label>
              <select
                id="ageGroup"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select age group</option>
                <option value="18-25">18-25</option>
                <option value="26-40">26-40</option>
                <option value="41+">41+</option>
              </select>
            </div>

            <div>
              <label htmlFor="technicalProficiency" className="block text-sm font-medium text-gray-700">
                Technical Proficiency
              </label>
              <select
                id="technicalProficiency"
                value={technicalProficiency}
                onChange={(e) => setTechnicalProficiency(e.target.value)}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select proficiency level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}