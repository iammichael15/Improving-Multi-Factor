import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface SessionState {
  sessionId: string | null;
  loading: boolean;
  initializeSession: () => Promise<void>;
  getSessionId: () => string | null;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessionId: localStorage.getItem('session_id'),
  loading: false,
  initializeSession: async () => {
    try {
      set({ loading: true });
      
      // Call the RPC function to generate a session ID
      const { data, error } = await supabase
        .rpc('generate_session_id');

      if (error) throw error;

      const sessionId = data as string;
      
      // Store the session ID
      localStorage.setItem('session_id', sessionId);
      set({ sessionId, loading: false });
    } catch (error) {
      console.error('Session initialization error:', error);
      set({ loading: false });
    }
  },
  getSessionId: () => {
    const { sessionId } = get();
    return sessionId || localStorage.getItem('session_id');
  }
}));