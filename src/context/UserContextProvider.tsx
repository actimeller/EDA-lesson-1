import React, { ReactNode, useEffect, useState } from 'react';
import { SESSION_STORAGE_SESSION_ID } from '../enviroment';
import UserContext from './UserContext';

export default ({ children }: {children: ReactNode}) => {
  const [sessionId, setSessionId] = useState(sessionStorage.getItem(SESSION_STORAGE_SESSION_ID));

  useEffect(() => {
    if (sessionId != null) {
      sessionStorage.setItem(SESSION_STORAGE_SESSION_ID, sessionId);
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_SESSION_ID);
    }
  }, [sessionId]);

  useEffect(() => {
    const sessionIdFromSessionStorage = sessionStorage.getItem(SESSION_STORAGE_SESSION_ID);
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
