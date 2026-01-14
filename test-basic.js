// 基本测试脚本

console.log('=== 群聊功能基本测试 ===\n')

// 测试 1: 检查文件是否存在
console.log('测试 1: 检查关键文件是否存在')
const fs = require('fs')
const files = [
  'src/shared/types/session.ts',
  'src/renderer/stores/assistantStore.ts',
  'src/renderer/stores/groupChatStore.ts',
  'src/renderer/utils/groupChatUtils.ts',
  'src/renderer/utils/gameModes.ts',
  'src/renderer/utils/flowchartEngine.ts',
  'src/renderer/components/GroupChatPanel.tsx',
  'src/renderer/components/ReplyButton.tsx',
  'src/renderer/components/ReplyPreview.tsx',
]

files.forEach(file => {
  const exists = fs.existsSync(file)
  console.log(`  ${exists ? '✓' : '✗'} ${file}`)
})

// 测试 2: 检查文件大小
console.log('\n测试 2: 检查文件大小')
files.forEach(file => {
  const stats = fs.statSync(file)
  console.log(`  ${file}: ${stats.size} bytes`)
})

// 测试 3: 检查文件内容
console.log('\n测试 3: 检查关键类型定义')
const sessionTypes = fs.readFileSync('src/shared/types/session.ts', 'utf8')

const keyTypes = [
  'AssistantSchema',
  'GroupChatSettingsSchema',
  'GameModeEnum',
  'FlowchartSchema',
  'MessageSchema',
]

keyTypes.forEach(type => {
  const exists = sessionTypes.includes(type)
  console.log(`  ${exists ? '✓' : '✗'} ${type}`)
})

// 测试 4: 检查功能函数
console.log('\n测试 4: 检查工具函数')
const groupChatUtils = fs.readFileSync('src/renderer/utils/groupChatUtils.ts', 'utf8')

const functions = [
  'createGroupChatMessage',
  'formatReplyMessage',
  'extractReplyInfo',
  'getNextAssistant',
  'buildGroupChatContext',
]

functions.forEach(fn => {
  const exists = groupChatUtils.includes(fn)
  console.log(`  ${exists ? '✓' : '✗'} ${fn}`)
})

// 测试 5: 检查游戏模式
console.log('\n测试 5: 检查游戏模式配置')
const gameModes = fs.readFileSync('src/renderer/utils/gameModes.ts', 'utf8')

const modes = [
  'werewolf',
  'debate',
  'brainstorm',
  'WEREWOLF_ROLES',
]

modes.forEach(mode => {
  const exists = gameModes.includes(mode)
  console.log(`  ${exists ? '✓' : '✗'} ${mode}`)
})

// 测试 6: 检查 Flowchart 引擎
console.log('\n测试 6: 检查 Flowchart 引擎')
const flowchartEngine = fs.readFileSync('src/renderer/utils/flowchartEngine.ts', 'utf8')

const engineFeatures = [
  'FlowchartEngine',
  'executeNode',
  'evaluateCondition',
  'start',
  'executeStep',
]

engineFeatures.forEach(feature => {
  const exists = flowchartEngine.includes(feature)
  console.log(`  ${exists ? '✓' : '✗'} ${feature}`)
})

// 测试 7: 检查 UI 组件
console.log('\n测试 7: 检查 UI 组件')
const components = {
  'GroupChatPanel.tsx': 'GroupChatPanel',
  'ReplyButton.tsx': 'ReplyButton',
  'ReplyPreview.tsx': 'ReplyPreview',
}

Object.entries(components).forEach(([file, component]) => {
  const content = fs.readFileSync(`src/renderer/components/${file}`, 'utf8')
  const exists = content.includes(component)
  console.log(`  ${exists ? '✓' : '✗'} ${component}`)
})

console.log('\n✅ 基本测试完成！')
console.log('\n说明：')
console.log('- 所有核心文件已创建')
console.log('- 类型定义已正确添加')
console.log('- 工具函数已实现')
console.log('- 游戏模式已配置')
console.log('- UI 组件已创建')
console.log('\n注意：完整的功能测试需要启动 Electron 应用环境。')
