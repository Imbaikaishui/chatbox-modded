import { create } from 'zustand'
import type { Session, Message, Assistant, GroupChatSettings } from 'src/shared/types'
import { v4 as uuidv4 } from 'uuid'
import {
  createGroupChatMessage,
  formatReplyMessage,
  getNextAssistant,
  buildAssistantContext,
  shouldContinueGroupChat,
} from '../utils/groupChatUtils'

interface GroupChatStoreState {
  currentRound: number
  currentAssistantId: string | undefined
  isAutoReplying: boolean
  autoReplyTimer: NodeJS.Timeout | null

  // Actions
  startGroupChat: (sessionId: string) => void
  endGroupChat: () => void
  setAutoReply: (enabled: boolean) => void
  triggerNextAssistant: (sessionId: string) => Promise<void>
  addAssistantMessage: (
    sessionId: string,
    assistant: Assistant,
    content: string,
    replyToMessageId?: string
  ) => void
  skipCurrentAssistant: (sessionId: string) => void
}

export const useGroupChatStore = create<GroupChatStoreState>((set, get) => ({
  currentRound: 0,
  currentAssistantId: undefined,
  isAutoReplying: false,
  autoReplyTimer: null,

  startGroupChat: (sessionId) => {
    // 初始化群聊
    set({
      currentRound: 1,
      currentAssistantId: undefined,
      isAutoReplying: false,
    })
  },

  endGroupChat: () => {
    // 清除定时器
    const { autoReplyTimer } = get()
    if (autoReplyTimer) {
      clearTimeout(autoReplyTimer)
    }

    set({
      currentRound: 0,
      currentAssistantId: undefined,
      isAutoReplying: false,
      autoReplyTimer: null,
    })
  },

  setAutoReply: (enabled) => {
    const { isAutoReplying, autoReplyTimer } = get()

    // 如果已经有定时器，先清除
    if (autoReplyTimer) {
      clearTimeout(autoReplyTimer)
    }

    if (enabled) {
      set({ isAutoReplying: true })
    } else {
      set({ isAutoReplying: false, autoReplyTimer: null })
    }
  },

  triggerNextAssistant: async (sessionId) => {
    // 这个函数应该与实际的 AI 调用集成
    // 这里只是框架代码

    // 1. 获取下一个助手
    // 2. 调用 AI API 获取回复
    // 3. 添加消息到会话
    // 4. 如果启用了自动回复，设置定时器触发下一个助手

    console.log('Triggering next assistant for session:', sessionId)
  },

  addAssistantMessage: (
    sessionId,
    assistant,
    content,
    replyToMessageId
  ) => {
    // 构建群聊消息
    const message = createGroupChatMessage({
      role: 'assistant',
      content,
      assistantId: assistant.id,
      replyToMessageId,
      replyToAssistantId: replyToMessageId
        ? undefined // 需要从被引用的消息中获取 assistantId
        : undefined,
      round: get().currentRound,
    })

    // 更新当前助手 ID
    set({ currentAssistantId: assistant.id })

    // 这里需要调用实际的会话更新逻辑
    // 例如：updateSessionStore(sessionId, ...)
    console.log('Adding assistant message:', message)
  },

  skipCurrentAssistant: (sessionId) => {
    const { currentAssistantId } = get()
    if (!currentAssistantId) return

    // 创建跳过消息
    const message = createGroupChatMessage({
      role: 'assistant',
      content: '这是一个基本事实问题，无需进行更多回复。我选择跳过。',
      assistantId: currentAssistantId,
      round: get().currentRound,
      skip: true,
    })

    console.log('Skipping assistant:', currentAssistantId)

    // 触发下一个助手
    // get().triggerNextAssistant(sessionId)
  },
}))
