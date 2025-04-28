import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MouseData } from '../types';

interface Props {
  sessionId: string;
  onData?: (data: MouseData) => void;
}

export const MouseTracker: React.FC<Props> = ({ sessionId, onData }) => {
  const lastPos = useRef({ x: 0, y: 0, timestamp: 0 });
  const lastSpeed = useRef(0);
  const location = useLocation();

  const getTaskType = (path: string) => {
    if (path.includes('login')) return 'login';
    if (path.includes('form')) return 'form';
    if (path.includes('interactive')) return 'interactive';
    if (path.includes('browsing')) return 'browsing';
    return 'form';
  };

  useEffect(() => {
    const taskType = getTaskType(location.pathname);

    const handleMouseMove = async (e: MouseEvent) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastPos.current.timestamp;
      
      if (deltaTime === 0) return;

      const deltaX = e.clientX - lastPos.current.x;
      const deltaY = e.clientY - lastPos.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const speed = distance / deltaTime;
      const acceleration = (speed - lastSpeed.current) / deltaTime;

      try {
        const { error } = await supabase
          .from('mouse_data')
          .insert([{
            session_id: sessionId,
            timestamp: new Date(currentTime).toISOString(),
            x: e.clientX,
            y: e.clientY,
            event_type: 'move',
            speed,
            acceleration,
            task_type: taskType
          }]);

        if (error) throw error;

        onData?.({
          sessionId,
          timestamp: currentTime,
          x: e.clientX,
          y: e.clientY,
          eventType: 'move',
          speed,
          acceleration,
          taskType,
        });
      } catch (err) {
        console.error('Error saving mouse movement data:', err);
      }

      lastPos.current = { x: e.clientX, y: e.clientY, timestamp: currentTime };
      lastSpeed.current = speed;
    };

    const handleClick = async (e: MouseEvent) => {
      try {
        const { error } = await supabase
          .from('mouse_data')
          .insert([{
            session_id: sessionId,
            timestamp: new Date(Date.now()).toISOString(),
            x: e.clientX,
            y: e.clientY,
            event_type: 'click',
            task_type: taskType
          }]);

        if (error) throw error;

        onData?.({
          sessionId,
          timestamp: Date.now(),
          x: e.clientX,
          y: e.clientY,
          eventType: 'click',
          taskType,
        });
      } catch (err) {
        console.error('Error saving mouse click data:', err);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
  }, [sessionId, onData, location.pathname]);

  return null;
};