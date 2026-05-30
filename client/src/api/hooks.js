import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from './client.js'

// ─── Query Keys ─────────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  moodEntries: ['mood', 'entries'],
  moodAnalytics: ['mood', 'analytics'],
  journalEntries: ['journal', 'entries'],
  journalEntry: (id) => ['journal', 'entry', id],
  breathingTechniques: ['breathing', 'techniques'],
  crisisContacts: ['crisis', 'contacts'],
  wellnessTips: ['wellness', 'tips'],
  affirmations: ['affirmations'],
}

// ─── Mood Hooks ──────────────────────────────────────────────────────────────

export function useMoodEntries(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.moodEntries,
    queryFn: async () => {
      const { data } = await apiClient.get('/mood')
      return data
    },
    ...options,
  })
}

export function useMoodAnalytics(days = 7, options = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.moodAnalytics, days],
    queryFn: async () => {
      const { data } = await apiClient.get(`/mood/analytics?days=${days}`)
      return data
    },
    ...options,
  })
}

export function useCreateMoodEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (entry) => {
      const { data } = await apiClient.post('/mood', entry)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.moodEntries })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.moodAnalytics })
    },
  })
}

// ─── Journal Hooks ───────────────────────────────────────────────────────────

export function useJournalEntries(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.journalEntries,
    queryFn: async () => {
      const { data } = await apiClient.get('/journal')
      return data
    },
    ...options,
  })
}

export function useJournalEntry(id, options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.journalEntry(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/journal/${id}`)
      return data
    },
    enabled: !!id,
    ...options,
  })
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (entry) => {
      const { data } = await apiClient.post('/journal', entry)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.journalEntries })
    },
  })
}

export function useUpdateJournalEntry(id) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await apiClient.put(`/journal/${id}`, updates)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.journalEntries })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.journalEntry(id) })
    },
  })
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/journal/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.journalEntries })
    },
  })
}

// ─── Breathing Techniques Hook ───────────────────────────────────────────────

export function useBreathingTechniques(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.breathingTechniques,
    queryFn: async () => {
      // Static fallback data if backend not ready
      try {
        const { data } = await apiClient.get('/breathing/techniques')
        return data
      } catch {
        return FALLBACK_BREATHING_TECHNIQUES
      }
    },
    staleTime: Infinity,
    ...options,
  })
}

const FALLBACK_BREATHING_TECHNIQUES = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Used by Navy SEALs to stay calm under pressure.',
    steps: [
      { phase: 'Inhale', duration: 4, instruction: 'Breathe in through your nose' },
      { phase: 'Hold', duration: 4, instruction: 'Hold your breath' },
      { phase: 'Exhale', duration: 4, instruction: 'Breathe out through your mouth' },
      { phase: 'Hold', duration: 4, instruction: 'Hold your breath' },
    ],
    totalCycles: 4,
    color: 'primary',
  },
  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    description: 'A natural tranquilizer for the nervous system.',
    steps: [
      { phase: 'Inhale', duration: 4, instruction: 'Breathe in through your nose' },
      { phase: 'Hold', duration: 7, instruction: 'Hold your breath' },
      { phase: 'Exhale', duration: 8, instruction: 'Breathe out through your mouth' },
    ],
    totalCycles: 4,
    color: 'calm',
  },
  {
    id: 'diaphragmatic',
    name: 'Deep Belly Breathing',
    description: 'Activates the parasympathetic nervous system.',
    steps: [
      { phase: 'Inhale', duration: 5, instruction: 'Breathe deep into your belly' },
      { phase: 'Hold', duration: 2, instruction: 'Feel your belly full' },
      { phase: 'Exhale', duration: 5, instruction: 'Let it all go slowly' },
      { phase: 'Rest', duration: 2, instruction: 'Pause before next breath' },
    ],
    totalCycles: 5,
    color: 'accent',
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    description: 'Balances the nervous system in 5 minutes.',
    steps: [
      { phase: 'Inhale', duration: 5, instruction: 'Steady, relaxed breath in' },
      { phase: 'Exhale', duration: 5, instruction: 'Steady, relaxed breath out' },
    ],
    totalCycles: 6,
    color: 'primary',
  },
]

// ─── Crisis Contacts Hook ─────────────────────────────────────────────────────

export function useCrisisContacts(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.crisisContacts,
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/crisis')
        return data
      } catch {
        return FALLBACK_CRISIS_CONTACTS
      }
    },
    staleTime: Infinity,
    ...options,
  })
}

const FALLBACK_CRISIS_CONTACTS = [
  {
    id: 1,
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    description: '24/7, free and confidential support',
    available: '24/7',
    type: 'hotline',
  },
  {
    id: 2,
    name: 'Crisis Text Line',
    phone: null,
    text: 'HOME to 741741',
    description: 'Text with a trained crisis counselor',
    available: '24/7',
    type: 'text',
  },
  {
    id: 3,
    name: 'SAMHSA National Helpline',
    phone: '1-800-662-4357',
    description: 'Mental health & substance use treatment referrals',
    available: '24/7',
    type: 'hotline',
  },
  {
    id: 4,
    name: 'Veterans Crisis Line',
    phone: '988, then press 1',
    description: 'For veterans and service members',
    available: '24/7',
    type: 'hotline',
  },
  {
    id: 5,
    name: 'Trevor Project (LGBTQ+)',
    phone: '1-866-488-7386',
    description: 'Crisis intervention for LGBTQ+ youth',
    available: '24/7',
    type: 'hotline',
  },
  {
    id: 6,
    name: 'Emergency Services',
    phone: '911',
    description: 'If you or someone is in immediate danger',
    available: 'Always',
    type: 'emergency',
  },
]

// ─── Wellness Tips Hook ───────────────────────────────────────────────────────

export function useWellnessTips(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.wellnessTips,
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/wellness/tips')
        return data
      } catch {
        return FALLBACK_WELLNESS_TIPS
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  })
}

const FALLBACK_WELLNESS_TIPS = [
  'Take three deep breaths before responding to stressful situations.',
  'A 10-minute walk outside can shift your mood significantly.',
  'Drinking a glass of water is a small act of self-care that matters.',
  'Name five things you can see around you right now. You are present.',
  'It is okay to set boundaries. Your needs are valid.',
  'Progress, not perfection. Every small step counts.',
  'Rest is productive. Your body and mind need recovery time.',
  'Reach out to one person today, even just to say hello.',
  'Feelings are information, not instructions. You can feel and choose.',
  'You have gotten through every hard day so far. That is real strength.',
  'Gratitude and grief can coexist. Both deserve space.',
  'Your story is still being written. Today is not the final chapter.',
]

// ─── Affirmations Hook ────────────────────────────────────────────────────────

export function useAffirmations(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.affirmations,
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/affirmations')
        return data
      } catch {
        return FALLBACK_AFFIRMATIONS
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  })
}

const FALLBACK_AFFIRMATIONS = [
  'I am worthy of love and compassion, especially from myself.',
  'I am doing the best I can with what I have today.',
  'My feelings are valid. I give myself permission to feel them.',
  'I am stronger than I think and braver than I feel.',
  'I choose to be gentle with myself today.',
  'I am not my worst days. I am everything I have survived.',
  'Healing is not linear, and that is okay.',
  'I deserve support. Asking for help is an act of courage.',
  'I am enough, exactly as I am right now.',
  'My presence in this world matters.',
  'I can get through today, one moment at a time.',
  'I am allowed to take up space and exist fully.',
  'Every breath is a new beginning.',
  'I am growing even when it does not feel like it.',
]
