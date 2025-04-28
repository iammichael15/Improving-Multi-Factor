import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSessionStore } from './store/session';
import { KeystrokeTracker } from './components/KeystrokeTracker';
import { MouseTracker } from './components/MouseTracker';
import { NavigationHeader } from './components/NavigationHeader';
import { Welcome } from './pages/Welcome';
import { FormTask } from './pages/FormTask';
import { InteractiveTask } from './pages/InteractiveTask';
import { BrowsingTask } from './pages/BrowsingTask';
import { Dashboard } from './pages/Dashboard';

function App() {
  const { sessionId, initializeSession } = useSessionStore();

  useEffect(() => {
    if (!sessionId) {
      initializeSession();
    }
  }, [sessionId, initializeSession]);

  return (
    <Router>
      {sessionId && (
        <>
          <NavigationHeader showSignOut={false} />
          <KeystrokeTracker sessionId={sessionId} />
          <MouseTracker sessionId={sessionId} />
        </>
      )}
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route 
          path="/form" 
          element={sessionId ? <FormTask /> : <Navigate to="/welcome" />} 
        />
        <Route 
          path="/interactive" 
          element={sessionId ? <InteractiveTask /> : <Navigate to="/welcome" />} 
        />
        <Route 
          path="/browsing" 
          element={sessionId ? <BrowsingTask /> : <Navigate to="/welcome" />} 
        />
        <Route 
          path="/dashboard" 
          element={sessionId ? <Dashboard /> : <Navigate to="/welcome" />} 
        />
        <Route path="/" element={<Navigate to="/welcome" />} />
      </Routes>
    </Router>
  );
}

export default App;