import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { KeystrokeData } from '../types';

interface Props {
  sessionId: string;
  onData?: (data: KeystrokeData) => void;
}

export const KeystrokeTracker: React.FC<Props> = ({ sessionId, onData }) => {
  const location = useLocation();
  
  const getTaskType = (path: string) => {
    if (path.includes('login')) return 'login';
    if (path.includes('form')) return 'form';
    if (path.includes('interactive')) return 'interactive';
    if (path.includes('browsing')) return 'browsing';
    return 'form';
  };

  useEffect(() => {
    let lastKeyUpTime = 0;
    let keyDownTime = 0;
    const taskType = getTaskType(location.pathname);

    const handleKeyDown = async (e: KeyboardEvent) => {
      keyDownTime = Date.now();
      
      const data: KeystrokeData = {
        sessionId,
        timestamp: keyDownTime,
        key: e.key,
        eventType: 'keydown',
        taskType,
      };

      try {
        const { error } = await supabase
          .from('keystroke_data')
          .insert([{
            session_id: sessionId,
            timestamp: new Date(keyDownTime).toISOString(),
            key: e.key,
            event_type: 'keydown',
            task_type: taskType
          }]);

        if (error) throw error;
        onData?.(data);
      } catch (err) {
        console.error('Error saving keystroke data:', err);
      }
    };

    const handleKeyUp = async (e: KeyboardEvent) => {
      const currentTime = Date.now();
      const dwellTime = currentTime - keyDownTime;
      const flightTime = lastKeyUpTime > 0 ? keyDownTime - lastKeyUpTime : 0;
      
      try {
        const { error } = await supabase
          .from('keystroke_data')
          .insert([{
            session_id: sessionId,
            timestamp: new Date(currentTime).toISOString(),
            key: e.key,
            event_type: 'keyup',
            dwell_time: dwellTime,
            flight_time: flightTime,
            task_type: taskType
          }]);

        if (error) throw error;
        
        onData?.({
          sessionId,
          timestamp: currentTime,
          key: e.key,
          eventType: 'keyup',
          dwellTime,
          flightTime,
          taskType,
        });
      } catch (err) {
        console.error('Error saving keystroke data:', err);
      }

      lastKeyUpTime = currentTime;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [sessionId, onData, location.pathname]);

  return null;
};