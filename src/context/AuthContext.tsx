import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "teacher" | "student";

interface AuthContextType {
    session: Session | null;
    user: User | null;
    role: UserRole | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    role: null,
    loading: true,
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchRole = async (userId: string) => {
        try {
            // Sử dụng function SECURITY DEFINER để bypass RLS
            const { data, error } = await supabase.rpc("get_my_role");

            if (error) {
                console.error("Error fetching role via RPC:", error);
                // Fallback: thử query trực tiếp
                const { data: profileData, error: profileError } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", userId)
                    .single();

                if (profileError) {
                    console.error("Error fetching role from profiles:", profileError);
                    setRole("student");
                    return;
                }
                setRole((profileData?.role as UserRole) || "student");
                return;
            }

            setRole((data as UserRole) || "student");
        } catch (err) {
            console.error("Error fetching role:", err);
            setRole("student");
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchRole(session.user.id);
            } else {
                setRole(null);
                setLoading(false);
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchRole(session.user.id);
            } else {
                setRole(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Set loading to false only after role is fetched
    useEffect(() => {
        if (user && role !== null) {
            setLoading(false);
        } else if (!user && role === null) {
            // Not logged in, loading already set above
        }
    }, [user, role]);

    const signOut = async () => {
        await supabase.auth.signOut();
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ session, user, role, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// Convenience hooks
export const useIsAdmin = () => {
    const { role } = useAuth();
    return role === "admin";
};

export const useIsTeacher = () => {
    const { role } = useAuth();
    return role === "teacher";
};

export const useIsStudent = () => {
    const { role } = useAuth();
    return role === "student";
};

export const useCanUpload = () => {
    const { role } = useAuth();
    return role === "admin" || role === "teacher";
};

export const useCanPreview = () => {
    return true; // Tất cả mọi người đều có thể xem trước và tải xuống
};
