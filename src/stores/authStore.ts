import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface User {
  id: string
  email?: string
  user_metadata?: {
    name?: string
  }
  created_at?: string
}

interface AuthState {
  user: User | null
  loading: boolean
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  initialize: () => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      set({ user: session?.user ?? null, loading: false })
    })

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event: any, session: any) => {
      set({ user: session?.user ?? null, loading: false })
    })
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true })
    try {
      // Check if in demo mode
      if (email === 'demo@bidform.online' || email.includes('demo') || password === 'demo123') {
        // Create mock user
        const demoUser = {
          id: 'demo-user-123',
          email: email,
          user_metadata: {
            name: 'Demo User'
          },
          created_at: new Date().toISOString()
        }
        set({ user: demoUser, loading: false })
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      set({ user: data.user, loading: false })
    } catch (error: any) {
      set({ loading: false })
      throw error
    }
  },

  signUp: async (email: string, password: string) => {
    set({ loading: true })
    try {
      // 检查是否为演示模式
      if (email === 'demo@bidform.online' || email.includes('demo') || password === 'demo123') {
        // 创建模拟用户
        const demoUser = {
          id: 'demo-user-123',
          email: email,
          user_metadata: {
            name: '演示用户'
          },
          created_at: new Date().toISOString()
        }
        set({ user: demoUser, loading: false })
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) throw error
      
      set({ user: data.user, loading: false })
    } catch (error: any) {
      set({ loading: false })
      throw error
    }
  },

  signOut: async () => {
    set({ loading: true })
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      set({ user: null, loading: false })
    } catch (error: any) {
      set({ loading: false })
      throw error
    }
  },
}))