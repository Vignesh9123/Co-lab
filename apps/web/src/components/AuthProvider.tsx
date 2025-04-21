'use client'
import { useAuthStore } from "@/zustand/auth";
import { useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { AxiosError } from "axios";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "@/config/firebaseConfig";
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const {user, setUser, loading, setLoading, isLoggedIn, setIsLoggedIn} = useAuthStore();
    const app = initializeApp(firebaseConfig);
    useEffect(()=>{
        setLoading(true)
        console.log("Auth fb")
        getAnalytics(app);
        axiosInstance.get('/user/current-user')
            .then(response => {
                const {user} = response.data;
                console.log("User", user)
                setUser(user);
                setIsLoggedIn(true);
            })
            .catch(error => {
                console.error('Error fetching current user:', error);
                if(error instanceof AxiosError) {
                    if(error.status == 401) {
                        console.log("Logged out")
                    }
                }
                setIsLoggedIn(false);
            })
            .finally(() => {
                setLoading(false)
            })
        
    }, [])
  return children
}

