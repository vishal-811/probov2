import { create } from "zustand";

interface WalletBalType{
    walletBalance : number,
    setWalletBalance :(value : number) => void
}

export const useWalletBalance = create<WalletBalType>()((set)=>({
    walletBalance : 0.0,
    setWalletBalance: (value: number) =>    
        set(() => ({ walletBalance: value})),
}))