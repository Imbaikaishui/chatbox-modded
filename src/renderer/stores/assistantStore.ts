import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Assistant } from 'src/shared/types'
import { v4 as uuidv4 } from 'uuid'

interface AssistantStoreState {
  assistants: Assistant[]
  addAssistant: (assistant: Omit<Assistant, 'id'>) => void
  updateAssistant: (id: string, updates: Partial<Assistant>) => void
  removeAssistant: (id: string) => void
  getAssistant: (id: string) => Assistant | undefined
  duplicateAssistant: (id: string) => void
}

export const useAssistantStore = create<AssistantStoreState>()(
  persist(
    (set, get) => ({
      assistants: [],

      addAssistant: (assistantData) => {
        const newAssistant: Assistant = {
          ...assistantData,
          id: uuidv4(),
          isActive: assistantData.isActive ?? true,
          isUser: assistantData.isUser ?? false,
        }
        set((state) => ({
          assistants: [...state.assistants, newAssistant],
        }))
      },

      updateAssistant: (id, updates) => {
        set((state) => ({
          assistants: state.assistants.map((assistant) =>
            assistant.id === id ? { ...assistant, ...updates } : assistant
          ),
        }))
      },

      removeAssistant: (id) => {
        set((state) => ({
          assistants: state.assistants.filter((assistant) => assistant.id !== id),
        }))
      },

      getAssistant: (id) => {
        return get().assistants.find((assistant) => assistant.id === id)
      },

      duplicateAssistant: (id) => {
        const assistant = get().getAssistant(id)
        if (!assistant) return

        const duplicate: Assistant = {
          ...assistant,
          id: uuidv4(),
          name: `${assistant.name} (副本)`,
        }

        set((state) => ({
          assistants: [...state.assistants, duplicate],
        }))
      },
    }),
    {
      name: 'assistant-storage',
    }
  )
)

// 预设的助手模板
export const PRESET_ASSISTANTS: Omit<Assistant, 'id'>[] = [
  {
    name: '理性分析师',
    systemPrompt: '你是一个理性、客观的分析师。你的回答基于事实和数据，逻辑清晰，善于从多个角度分析问题。',
    provider: 'openai',
    modelId: 'gpt-4',
    isActive: true,
    isUser: false,
  },
  {
    name: '创意设计师',
    systemPrompt: '你是一个富有创意的设计师。你的回答充满想象力和艺术感，善于发现事物的美感和创新点。',
    provider: 'openai',
    modelId: 'gpt-4',
    isActive: true,
    isUser: false,
  },
  {
    name: '严谨程序员',
    systemPrompt: '你是一个严谨的程序员。你关注代码质量和最佳实践，善于给出精确的技术解决方案。',
    provider: 'openai',
    modelId: 'gpt-4',
    isActive: true,
    isUser: false,
  },
  {
    name: '哲学家',
    systemPrompt: '你是一个哲学家。你善于从哲学角度思考问题，探讨事物的本质和意义。',
    provider: 'openai',
    modelId: 'gpt-4',
    isActive: true,
    isUser: false,
  },
  {
    name: '用户',
    systemPrompt: '你是用户，可以提问和参与对话。',
    provider: 'openai',
    modelId: 'gpt-4',
    isActive: true,
    isUser: true,
  },
]
