import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteTransition from '@/components/RouteTransition';

const TransitionContext = createContext(null);

export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const [transition, setTransition] = useState(null); // null or { target: string }

  const triggerTransition = useCallback((targetPath) => {
    setTransition({ target: targetPath });
  }, []);

  const handleNavigate = useCallback(() => {
    if (transition) {
      navigate(transition.target);
    }
  }, [transition, navigate]);

  const handleComplete = useCallback(() => {
    setTransition(null);
  }, []);

  return (
    <TransitionContext.Provider value={triggerTransition}>
      {children}
      {transition && (
        <RouteTransition
          onNavigate={handleNavigate}
          onComplete={handleComplete}
        />
      )}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionContext);
}
