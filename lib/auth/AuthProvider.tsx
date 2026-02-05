import { createContext, useContext, useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import {
  AuthUser,
  getCurrentUser,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  signUp as amplifySignUp,
} from 'aws-amplify/auth';
import { router } from 'expo-router';

type AuthStatus = 'loading' | 'authed' | 'unauthed';

type AuthContextType = {
  status: AuthStatus;
  user: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_VfyrkgawU',
      userPoolClientId: '6omhofc94bs43u5c1kfm0b2m13',
    },
  },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  // Runs on app start
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setStatus('authed');
    } catch (error) {
      setUser(null);
      setStatus('unauthed');
    }
  }

  async function signIn(email: string, password: string) {
    try {
      await amplifySignIn({
        username: email,
        password,
        options: { authFlowType: 'USER_PASSWORD_AUTH' },
      });
    } catch (error) {
    }
    checkSession();
    router.replace("/");
  }

  async function signOut() {
    await amplifySignOut();
    setUser(null);
    setStatus('unauthed');
    router.replace('/(auth)/signin');
  }

  async function signUp(email: string, password: string) {
    throw new Error('Not implemented');
  }

  return (
    <AuthContext.Provider value={{ status, user, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
