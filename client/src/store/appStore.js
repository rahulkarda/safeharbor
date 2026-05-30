import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAppStore = create(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      token: null,
      isAuthenticated: false,

      // Cached data
      moodEntries: [],
      journalEntries: [],

      // Auth actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => {
        set({ token })
        if (token) {
          localStorage.setItem('sh_token', token)
        } else {
          localStorage.removeItem('sh_token')
        }
      },

      login: (user, token) => {
        localStorage.setItem('sh_token', token)
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('sh_token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          moodEntries: [],
          journalEntries: [],
        })
      },

      // Mood entry actions
      addMoodEntry: (entry) =>
        set((state) => ({
          moodEntries: [entry, ...state.moodEntries].slice(0, 100),
        })),

      setMoodEntries: (entries) => set({ moodEntries: entries }),

      getMoodEntryToday: () => {
        const { moodEntries } = get()
        const today = new Date().toDateString()
        return moodEntries.find(
          (e) => new Date(e.createdAt || e.date).toDateString() === today
        ) || null
      },

      // Journal entry actions
      setJournalEntries: (entries) => set({ journalEntries: entries }),

      addJournalEntry: (entry) =>
        set((state) => ({
          journalEntries: [entry, ...state.journalEntries],
        })),

      updateJournalEntry: (id, updates) =>
        set((state) => ({
          journalEntries: state.journalEntries.map((e) =>
            e._id === id || e.id === id ? { ...e, ...updates } : e
          ),
        })),

      removeJournalEntry: (id) =>
        set((state) => ({
          journalEntries: state.journalEntries.filter(
            (e) => e._id !== id && e.id !== id
          ),
        })),
    }),
    {
      name: 'safeharbor-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAppStore
