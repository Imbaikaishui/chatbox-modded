import type { Assistant, GameMode } from 'src/shared/types'

/**
 * 游戏模式配置
 */
export interface GameModeConfig {
  id: GameMode
  name: string
  description: string
  minAssistants: number
  maxAssistants?: number
  systemPromptTemplate: string
  rules: string[]
  presets?: Omit<Assistant, 'id'>[]
}

/**
 * 预设的游戏模式
 */
export const GAME_MODES: Record<GameMode, GameModeConfig> = {
  none: {
    id: 'none',
    name: '自由对话',
    description: '没有特定规则，助手们可以自由地对话和交流',
    minAssistants: 2,
    systemPromptTemplate: '',
    rules: [],
  },

  werewolf: {
    id: 'werewolf',
    name: '狼人杀',
    description: '经典的狼人杀游戏，助手们扮演不同的角色，通过推理和辩论找出狼人',
    minAssistants: 6,
    maxAssistants: 12,
    systemPromptTemplate: `你正在参与一场狼人杀游戏。
你的角色是：{role}
你的身份是：{identity}（狼人/村民/预言家/女巫/猎人等）

游戏规则：
- 狼人每晚可以杀死一个村民
- 预言家每晚可以查验一个人的身份
- 女巫有一瓶解药和一瓶毒药
- 白天所有人投票处决一个被怀疑的人
- 游戏目标是狼人杀死所有村民，或者村民找出所有狼人

请根据你的身份和游戏阶段进行发言。`,
    rules: [
      '需要至少6名参与者',
      '每个角色有独特的技能',
      '分为白天（讨论和投票）和黑夜（行动）阶段',
      '发言时可以指控、辩护、推理',
    ],
  },

  debate: {
    id: 'debate',
    name: '辩论赛',
    description: '助手们分成正方和反方，围绕一个辩题进行辩论',
    minAssistants: 4,
    systemPromptTemplate: `你正在参与一场辩论赛。
辩题：{topic}
你的立场：{position}（正方/反方）
你的角色：{role}（一辩/二辩/三辩/四辩）

辩论规则：
- 发言要有逻辑和证据
- 遵守辩论礼仪，尊重对手
- 每方有固定的时间发言
- 最后进行总结陈词

请根据你的角色准备你的论点和发言。`,
    rules: [
      '需要偶数名参与者',
      '分成正反两方',
      '每方各有一位一辩、二辩、三辩、四辩',
      '依次发言，最后总结',
    ],
  },

  brainstorm: {
    id: 'brainstorm',
    name: '头脑风暴',
    description: '助手们围绕一个主题进行创意思维，激发灵感',
    minAssistants: 3,
    systemPromptTemplate: `你正在参与一场头脑风暴会议。
主题：{topic}
你的专长：{expertise}

头脑风暴规则：
- 鼓励发散思维，不批评任何想法
- 可以在他人的想法基础上延伸
- 追求数量，之后再筛选质量
- 跨领域思考，打破常规

请围绕主题提出你的创意想法。`,
    rules: [
      '围绕共同主题展开',
      '鼓励创造性和独特的想法',
      '可以互相启发和补充',
      '最后汇总所有想法',
    ],
  },

  custom: {
    id: 'custom',
    name: '自定义规则',
    description: '使用自定义的 Flowchart 规则来定义游戏玩法',
    minAssistants: 2,
    systemPromptTemplate: '',
    rules: ['使用 Flowchart 编辑器自定义规则'],
  },
}

/**
 * 狼人杀角色定义
 */
export const WEREWOLF_ROLES = {
  villager: {
    name: '村民',
    identity: '村民',
    description: '普通的村民，只能通过观察和推理找出狼人',
  },
  werewolf: {
    name: '狼人',
    identity: '狼人',
    description: '每晚可以杀死一个村民，目标是消灭所有村民',
  },
  seer: {
    name: '预言家',
    identity: '预言家',
    description: '每晚可以查验一个人的身份，是村民的核心力量',
  },
  witch: {
    name: '女巫',
    identity: '女巫',
    description: '有一瓶解药和一瓶毒药，每晚只能使用一瓶',
  },
  hunter: {
    name: '猎人',
    identity: '猎人',
    description: '死亡时可以开枪带走一个人',
  },
  guard: {
    name: '守卫',
    identity: '守卫',
    description: '每晚可以保护一个人不被狼人杀害',
  },
}

/**
 * 生成狼人杀游戏的预设助手
 */
export function generateWerewolfAssistants(count: number): Omit<Assistant, 'id'>[] {
  const roles = Object.values(WEREWOLF_ROLES)
  const assistants: Omit<Assistant, 'id'>[] = []

  // 确保至少有1个预言家、1个女巫、2个狼人
  const essentialRoles = [
    WEREWOLF_ROLES.seer,
    WEREWOLF_ROLES.witch,
    WEREWOLF_ROLES.werewolf,
    WEREWOLF_ROLES.werewolf,
  ]

  // 添加必要角色
  essentialRoles.forEach((role) => {
    assistants.push({
      name: role.name,
      systemPrompt: generateWerewolfSystemPrompt(role),
      provider: 'openai',
      modelId: 'gpt-4',
      isActive: true,
      isUser: false,
    })
  })

  // 填充剩余的角色
  const remaining = count - essentialRoles.length
  for (let i = 0; i < remaining; i++) {
    const role = i < 2 ? WEREWOLF_ROLES.villager : WEREWOLF_ROLES.villager
    assistants.push({
      name: `玩家${i + essentialRoles.length + 1}`,
      systemPrompt: generateWerewolfSystemPrompt(role),
      provider: 'openai',
      modelId: 'gpt-4',
      isActive: true,
      isUser: false,
    })
  }

  return assistants
}

/**
 * 生成狼人杀的系统提示词
 */
function generateWerewolfSystemPrompt(role: any): string {
  return `你正在参与一场狼人杀游戏。
你的角色是：${role.name}
你的身份是：${role.identity}
你的能力：${role.description}

请根据你的身份制定策略：
- 如果是狼人，隐藏身份，误导村民
- 如果是预言家，谨慎查验，适时公布信息
- 如果是女巫，合理使用药剂
- 如果是猎人，死亡时选择最有价值的目标
- 如果是村民，仔细观察，找出狼人

在游戏中保持角色人设，不要暴露自己的真实身份。`
}

/**
 * 生成辩论赛的预设助手
 */
export function generateDebateAssistants(topic: string): Omit<Assistant, 'id'>[] {
  const positions = ['正方', '反方']
  const roles = ['一辩', '二辩', '三辩', '四辩']

  const assistants: Omit<Assistant, 'id'>[] = []

  positions.forEach((position, pIdx) => {
    roles.forEach((role, rIdx) => {
      assistants.push({
        name: `${position}${role}`,
        systemPrompt: `你正在参与一场辩论赛。
辩题：${topic}
你的立场：${position}
你的角色：${role}

作为${position}${role}，你的任务是：
- ${rIdx === 0 ? '提出我方主要观点和立论框架' : ''}
- ${rIdx === 1 ? '补充论据，驳斥对方论点' : ''}
- ${rIdx === 2 ? '继续论证，深化我方观点' : ''}
- ${rIdx === 3 ? '总结陈词，强调我方优势' : ''}

请用有力的论据和逻辑来支持你的立场。`,
        provider: 'openai',
        modelId: 'gpt-4',
        isActive: true,
        isUser: false,
      })
    })
  })

  return assistants
}

/**
 * 生成头脑风暴的预设助手
 */
export function generateBrainstormAssistants(
  topic: string,
  expertises: string[]
): Omit<Assistant, 'id'>[] {
  return expertises.map((expertise, idx) => ({
    name: `${expertise}专家`,
    systemPrompt: `你正在参与一场头脑风暴会议。
主题：${topic}
你的专长：${expertise}

作为${expertise}领域的专家，请从你的专业角度提出创意想法和解决方案。你的想法应该：
- 具有创新性和可行性
- 结合${expertise}领域的最新发展
- 可以与其他专家的观点进行融合

请提出至少3个创意想法。`,
    provider: 'openai',
    modelId: 'gpt-4',
    isActive: true,
    isUser: false,
  }))
}
