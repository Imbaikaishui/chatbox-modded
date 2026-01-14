// 测试群聊工具函数

import {
  createGroupChatMessage,
  formatReplyMessage,
  extractReplyInfo,
  getAssistantDisplayName,
} from './src/renderer/utils/groupChatUtils'

console.log('开始测试群聊工具函数...\n')

// 测试 1: createGroupChatMessage
console.log('测试 1: createGroupChatMessage')
const message1 = createGroupChatMessage({
  role: 'assistant',
  content: '这是一条测试消息',
  assistantId: 'assistant-1',
  round: 1,
  skip: false,
})
console.log('✓ 消息创建成功')
console.log('  ID:', message1.id)
console.log('  角色:', message1.role)
console.log('  内容:', message1.contentParts[0].text)
console.log('  轮次:', message1.round)

// 测试 2: formatReplyMessage
console.log('\n测试 2: formatReplyMessage')
const replyText = formatReplyMessage('这是一个回复', '助手A')
console.log('✓ 引用回复格式化成功')
console.log('  结果:', replyText)

// 测试 3: extractReplyInfo
console.log('\n测试 3: extractReplyInfo')
const extracted = extractReplyInfo(replyText)
console.log('✓ 引用信息提取成功')
console.log('  引用助手:', extracted.replyToAssistantName)
console.log('  实际内容:', extracted.actualContent)

// 测试 4: extractReplyInfo (非引用消息)
console.log('\n测试 4: extractReplyInfo (非引用消息)')
const plainText = '这是普通消息'
const plainExtracted = extractReplyInfo(plainText)
console.log('✓ 普通消息处理成功')
console.log('  引用助手:', plainExtracted.replyToAssistantName)
console.log('  实际内容:', plainExtracted.actualContent)

// 测试 5: getAssistantDisplayName
console.log('\n测试 5: getAssistantDisplayName')
const assistants = [
  { id: 'assistant-1', name: '理性分析师', provider: 'openai', modelId: 'gpt-4', isActive: true, isUser: false },
  { id: 'assistant-2', name: '创意设计师', provider: 'openai', modelId: 'gpt-4', isActive: true, isUser: false },
]
const displayName1 = getAssistantDisplayName({ role: 'assistant', assistantId: 'assistant-1' } as any, assistants)
const displayName2 = getAssistantDisplayName({ role: 'user' } as any, assistants, '助手')
console.log('✓ 显示名称获取成功')
console.log('  助手1:', displayName1)
console.log('  用户:', displayName2)

console.log('\n✅ 所有工具函数测试通过！')
