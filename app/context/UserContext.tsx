//handles current user management for the session
"use client";
import {createContext, useContext, useEffect, useState} from "react";
import {supabase} from '../lib/supabaseClient';
import {Session, User} from '@supabase/supabase-js';

const UserContext = createContext<{user: User | null, loading: boolean} | null>(null);

export const UserProvider = ({children} : {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // listen for auth changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (<UserContext.Provider value = {{user, loading}}>
        {children}
    </UserContext.Provider>);
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};