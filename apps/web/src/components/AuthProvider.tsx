'use client'
import { useAuthStore } from "@/zustand/auth";
import { useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const {user, setUser, loading, setLoading, isLoggedIn, setIsLoggedIn} = useAuthStore();
    useEffect(()=>{
        setLoading(true)
        axiosInstance.get('/user/current-user')
            .then(response => {
                const {user} = response.data;
                setUser(user);
                setIsLoggedIn(true);
            })
            .catch(error => {
                console.error('Error fetching current user:', error);
                setIsLoggedIn(false);
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])
  return children
}

