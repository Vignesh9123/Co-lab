import {create} from 'zustand'
import { CodeState } from '@repo/types'
export const useCodeStore = create<CodeState>((set) => ({
    code: undefined,
    setCode: (c: string) => set({code: c})
}))