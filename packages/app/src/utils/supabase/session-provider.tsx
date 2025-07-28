import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./client";
import { AppState } from "react-native";

const SessionContext = createContext<Session | null>(null);

export const useSession = () => {
  const sessionContext = useContext(SessionContext);

  return sessionContext;
};

type Props = {
  children: React.ReactNode;
  callback?: () => void;
};

export const SessionProvider = ({ children, callback }: Props) => {
  const [session, setSession] = useState<Session | null>(null);

  // Tells Supabase Auth to continuously refresh the session automatically
  // if the app is in the foreground. When this is added, you will continue
  // to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
  // `SIGNED_OUT` event if the user's session is terminated. This should
  // only be registered once.
  useEffect(() => {
    AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then((result) => {
      setSession(result.data.session);
      callback?.();
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Event", _event);
      setSession(session);
    });
  }, [callback]);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
