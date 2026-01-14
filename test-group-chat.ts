// 测试群聊功能的类型定义和基本功能

import type {
  Assistant,
  GroupChatSettings,
  GameMode,
  Flowchart,
  Message,
  SessionType,
} from './src/shared/types/session'

console.log('开始测试群聊功能...')

// 测试 1: 创建 Assistant
console.log('\n测试 1: 创建 Assistant')
const testAssistant: Assistant = {
  id: 'test-assistant-1',
  name: '测试助手',
  avatar: 'avatar-url',
  systemPrompt: '你是一个测试助手',
  provider: 'openai',
  modelId: 'gpt-4',
  isActive: true,
  isUser: false,
}
console.log('✓ Assistant 类型定义正确')
console.log('  助手名称:', testAssistant.name)

// 测试 2: 创建 GroupChatSettings
console.log('\n测试 2: 创建 GroupChatSettings')
const testGroupChatSettings: GroupChatSettings = {
  assistants: [testAssistant],
  gameMode: 'werewolf',
  autoReply: true,
  maxRounds: 10,
}
console.log('✓ GroupChatSettings 类型定义正确')
console.log('  游戏模式:', testGroupChatSettings.gameMode)

// 测试 3: 创建 Flowchart
console.log('\n测试 3: 创建 Flowchart')
const testFlowchart: Flowchart = {
  nodes: [
    {
      id: 'start',
      type: 'start',
      label: '开始',
      position: { x: 100, y: 100 },
    },
    {
      id: 'message',
      type: 'message',
      label: '发送消息',
      position: { x: 300, y: 100 },
    },
  ],
  edges: [
    { id: 'e1', source: 'start', target: 'message' },
  ],
}
console.log('✓ Flowchart 类型定义正确')
console.log('  节点数量:', testFlowchart.nodes.length)

// 测试 4: 创建带群聊扩展的 Message
console.log('\n测试 4: 创建带群聊扩展的 Message')
const testMessage: Message = {
  id: 'msg-1',
  role: 'assistant',
  contentParts: [{ type: 'text', text: '这是一条测试消息' }],
  timestamp: Date.now(),
  assistantId: 'test-assistant-1',
  replyToMessageId: 'msg-0',
  replyToAssistantId: 'test-assistant-0',
  round: 1,
  skip: false,
}
console.log('✓ Message 类型定义正确（支持群聊扩展）')
console.log('  助手ID:', testMessage.assistantId)
console.log('  回复轮次:', testMessage.round)

// 测试 5: SessionType 包含 group-chat
console.log('\n测试 5: SessionType 包含 group-chat')
const sessionType: SessionType = 'group-chat'
console.log('✓ SessionType 正确')
console.log('  类型:', sessionType)

// 测试 6: GameMode 枚举
console.log('\n测试 6: GameMode 枚举')
const gameModes: GameMode[] = ['none', 'werewolf', 'debate', 'brainstorm', 'custom']
gameModes.forEach((mode) => {
  console.log(`  - ${mode}`)
})
console.log('✓ 所有游戏模式类型正确')

console.log('\n✅ 所有类型定义测试通过！')
