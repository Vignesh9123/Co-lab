export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    profilePicture?: string;
}

export interface AuthState{
    user: User | null;
    token: string | null;
    loading: boolean;
    isLoggedIn: boolean;
    setUser: (user: User | null) => void;
    login: ({idToken}:{idToken: string}) => Promise<void>;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

