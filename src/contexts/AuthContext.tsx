import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type SupabaseClient = Awaited<typeof import('@/integrations/supabase/client')>['supabase'];

function bootAuthImmediately() {
  return typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const clientRef = useRef<SupabaseClient | null>(null);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    let idleId = 0;
    let timeoutId = 0;

    const start = async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      if (cancelled) return;
      clientRef.current = supabase;

      const { data: { session: nextSession } } = await supabase.auth.getSession();
      if (cancelled) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, next) => {
        setSession(next);
        setUser(next?.user ?? null);
        setLoading(false);
      });
      unsubscribe = () => subscription.unsubscribe();
    };

    if (bootAuthImmediately()) {
      void start();
    } else if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(() => {
        void start();
      }, { timeout: 1800 });
    } else {
      timeoutId = window.setTimeout(() => {
        void start();
      }, 1);
    }

    return () => {
      cancelled = true;
      unsubscribe?.();
      if (idleId && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { supabase } = clientRef.current
      ? { supabase: clientRef.current }
      : await import('@/integrations/supabase/client');
    clientRef.current = supabase;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (data.session) {
      setSession(data.session);
      setUser(data.session.user);
    }
    return { error };
  };

  const signOut = async () => {
    const supabase = clientRef.current ?? (await import('@/integrations/supabase/client')).supabase;
    clientRef.current = supabase;
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const isAdmin = user !== null;

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
