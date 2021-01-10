import React, { ReactNode, useEffect, useState } from 'react';
import UserContext from './UserContext';

export default ({ children }: {children: ReactNode}) => {
  const [sessionId, setSessionId] = useState(sessionStorage.getItem('sessionId'));

  useEffect(() => {
    if (sessionId != null) {
      sessionStorage.setItem('sessionId', sessionId);
    } else {
      sessionStorage.removeItem('sessionId');
    }
  }, [sessionId]);

  useEffect(() => {
    const sessionIdFromSessionStorage = sessionStorage.getItem('sessionId');
    if (sessionIdFromSessionStorage != null) {
      setSessionId(sessionIdFromSessionStorage);
    }
  }, []);

  return (
    <UserContext.Provider value={{ sessionId, setSessionId }}>
      {children}
    </UserContext.Provider>
  );
};
