import { create } from "zustand";
import { AuthState} from '@repo/types'
import axiosInstance from "@/config/axiosConfig";



export const useAuthStore = create<AuthState>()((set) => (
{   
    user: null,
    token: null,
    loading: true,
    isLoggedIn: false,
    setUser: (u) => set(() => ({user:u, isLoggedIn: true })),
    login: async({idToken})=>{
            set({loading: true});
            const response = await axiosInstance.post('/user/google-auth', { idToken });
            const {user, accessToken} = response.data;
            localStorage.setItem('token', accessToken);
            set({user, token: accessToken, loading: false, isLoggedIn: true});      
        
    },
    logout: async() => {
        set({loading: true});
        await axiosInstance.get('/user/logout');
        localStorage.removeItem('token');
        set({user: null, token: null, loading: false, isLoggedIn: false});
    },
    setLoading: (loading) => set(() => ({loading})),
    setIsLoggedIn: (isLoggedIn) => set(() => ({isLoggedIn})),
})
);

