import { create } from 'zustand'

interface useAuthType{
    isLoggedin : boolean,
    setIsLoggedIn :(value : boolean) =>void
}

export const useAuth = create<useAuthType>((set) => ({
    isLoggedin: false, 
    setIsLoggedIn: (value: boolean) => set({ isLoggedin: value })
}));