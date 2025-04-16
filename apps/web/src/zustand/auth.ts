import { create } from "zustand";
import {User} from '@repo/types'
import axiosInstance from "@/config/axiosConfig";
interface AuthState{
    user: User | null;
    token: string | null;
    loading: boolean;
    isLoggedIn: boolean;
    setUser: (user: User | null) => void;
    login: ({idToken}:{idToken: string}) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => (
{   
    user: null,
    token: null,
    loading: false,
    isLoggedIn: false,
    setUser: (u) => set(() => ({user:u, isLoggedIn: true })),
    login: async({idToken})=>{
        set(() => ({loading: true}));
        const response = await axiosInstance.post('/user/google-auth', { idToken });
        const {user, accessToken} = response.data;
        localStorage.setItem('token', accessToken);
        set(() => ({user:{email: user.email, id: user.id, name: user.name}, token: accessToken, loading: false, isLoggedIn: true}));
    },
    logout: async() => {
        set(() => ({loading: true}));
        const response = await axiosInstance.get('/user/logout');
        localStorage.removeItem('token');
        set(() => ({user: null, token: null, loading: false, isLoggedIn: false}));
    },
    setLoading: (loading) => set(() => ({loading})),
    setIsLoggedIn: (isLoggedIn) => set(() => ({isLoggedIn})),
})
);

