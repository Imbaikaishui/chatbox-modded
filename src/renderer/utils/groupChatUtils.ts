import type { Message, Assistant, GroupChatSettings } from 'src/shared/types'
import { v4 as uuidv4 } from 'uuid'

/**
 * 创建群聊消息
 */
export function createGroupChatMessage(params: {
  role: 'user' | 'assistant' | 'system'
  content: string
  assistantId?: string
  replyToMessageId?: string
  replyToAssistantId?: string
  round?: number
  skip?: boolean
}): Message {
  const {
    role,
    content,
    assistantId,
    replyToMessageId,
    replyToAssistantId,
    round,
    skip = false,
  } = params

  return {
    id: uuidv4(),
    role,
    contentParts: [{ type: 'text', text: content }],
    timestamp: Date.now(),
    assistantId,
    replyToMessageId,
    replyToAssistantId,
    round,
    skip,
  }
}

/**
 * 格式化引用回复文本
 */
export function formatReplyMessage(
  content: string,
  replyToAssistantName?: string
): string {
  if (replyToAssistantName) {
    return `> 回复 **${replyToAssistantName}**\n\n${content}`
  }
  return content
}

/**
 * 从消息内容中提取引用信息
 */
export function extractReplyInfo(content: string): {
  replyToAssistantName?: string
  actualContent: string
} {
  const replyPattern = /^> 回复\s+\*\*(.+?)\*\*\n\n(.+)$/s
  const match = content.match(replyPattern)

  if (match) {
    return {
      replyToAssistantName: match[1],
      actualContent: match[2],
    }
  }

  return {
    actualContent: content,
  }
}

/**
 * 获取下一个应该回复的助手
 */
export function getNextAssistant(
  currentAssistantId: string | undefined,
  settings: GroupChatSettings
): Assistant | null {
  const activeAssistants = settings.assistants.filter((a) => a.isActive && !a.isUser)

  if (activeAssistants.length === 0) {
    return null
  }

  // 如果有指定的回复顺序，按顺序选择
  if (settings.replyOrder && settings.replyOrder.length > 0) {
    const validOrder = settings.replyOrder.filter((id) =>
      activeAssistants.some((a) => a.id === id)
    )

    if (validOrder.length > 0) {
      const currentIndex = currentAssistantId
        ? validOrder.indexOf(currentAssistantId)
        : -1
      const nextIndex = (currentIndex + 1) % validOrder.length
      const nextAssistantId = validOrder[nextIndex]
      return (
        activeAssistants.find((a) => a.id === nextAssistantId) ||
        activeAssistants[0]
      )
    }
  }

  // 否则，随机选择一个助手
  if (!currentAssistantId) {
    return activeAssistants[Math.floor(Math.random() * activeAssistants.length)]
  }

  const currentIndex = activeAssistants.findIndex((a) => a.id === currentAssistantId)
  const nextIndex = (currentIndex + 1) % activeAssistants.length
  return activeAssistants[nextIndex]
}

/**
 * 构建群聊上下文消息列表
 */
export function buildGroupChatContext(
  messages: Message[],
  maxContextLength: number = 10
): Message[] {
  // 过滤掉跳过的消息
  const validMessages = messages.filter((m) => !m.skip)

  // 获取最近的N条消息
  return validMessages.slice(-maxContextLength)
}

/**
 * 为助手构建个性化的上下文（包括被引用的消息）
 */
export function buildAssistantContext(
  messages: Message[],
  assistantId: string,
  maxContextLength: number = 10
): Message[] {
  // 过滤出所有非跳过的消息
  const validMessages = messages.filter((m) => !m.skip)

  // 获取最近的N条消息
  const recentMessages = validMessages.slice(-maxContextLength)

  // 查找是否有针对当前助手的引用
  const repliesToCurrentAssistant = recentMessages.filter(
    (m) => m.replyToAssistantId === assistantId
  )

  // 如果有针对当前助手的回复，确保包含被引用的消息
  if (repliesToCurrentAssistant.length > 0) {
    const referencedMessageIds = new Set(
      repliesToCurrentAssistant.map((m) => m.replyToMessageId).filter(Boolean) as string[]
    )

    const referencedMessages = messages.filter((m) =>
      referencedMessageIds.has(m.id)
    )

    // 合并上下文，保持时间顺序
    const allMessages = [...referencedMessages, ...recentMessages]
    const uniqueMessages = Array.from(
      new Map(allMessages.map((m) => [m.id, m])).values()
    )
    return uniqueMessages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
  }

  return recentMessages
}

/**
 * 判断是否应该继续群聊
 */
export function shouldContinueGroupChat(
  messages: Message[],
  settings: GroupChatSettings
): boolean {
  // 如果设置了最大轮次
  if (settings.maxRounds) {
    const rounds = messages.filter((m) => m.round).map((m) => m.round!)
    if (rounds.length > 0 && Math.max(...rounds) >= settings.maxRounds) {
      return false
    }
  }

  // 如果没有启用的助手，结束群聊
  const activeAssistants = settings.assistants.filter((a) => a.isActive && !a.isUser)
  if (activeAssistants.length === 0) {
    return false
  }

  return true
}

/**
 * 获取消息的显示名称
 */
export function getAssistantDisplayName(
  message: Message,
  assistants: Assistant[],
  fallbackName: string = '助手'
): string {
  if (message.role === 'user') {
    return '用户'
  }

  if (message.assistantId) {
    const assistant = assistants.find((a) => a.id === message.assistantId)
    if (assistant) {
      return assistant.name
    }
  }

  return fallbackName
}
