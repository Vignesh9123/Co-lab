import { create } from "zustand";
import {User} from '@repo/types'
import axiosInstance from "@/config/axiosConfig";
interface AuthState{
    user: User | null;
    token: string | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    login: ({idToken}:{idToken: string}) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => (
{   
    user: null,
    token: null,
    loading: false,
    setUser: (u) => set(() => ({user:u })),
    login: async({idToken})=>{
        set(() => ({loading: true}));
        const response = await axiosInstance.post('/user/google-auth', { idToken });
        const {user, accessToken} = response.data;
        localStorage.setItem('token', accessToken);
        set(() => ({user:{email: user.email, id: user.id, name: user.name}, token: accessToken, loading: false}));
    },
    logout: () => {}
})
);

