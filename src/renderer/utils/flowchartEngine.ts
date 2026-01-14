import type { Flowchart, FlowchartNode, FlowchartEdge, Message, Assistant } from 'src/shared/types'

/**
 * Flowchart 执行上下文
 */
export interface FlowchartExecutionContext {
  currentNodeId: string | null
  variables: Record<string, any>
  messages: Message[]
  assistants: Assistant[]
  history: string[]
  isFinished: boolean
}

/**
 * Flowchart 执行引擎
 */
export class FlowchartEngine {
  private flowchart: Flowchart
  private context: FlowchartExecutionContext

  constructor(flowchart: Flowchart) {
    this.flowchart = flowchart
    this.context = {
      currentNodeId: null,
      variables: {},
      messages: [],
      assistants: [],
      history: [],
      isFinished: false,
    }
  }

  /**
   * 获取起始节点
   */
  private getStartNode(): FlowchartNode | null {
    return this.flowchart.nodes.find((node) => node.type === 'start') || null
  }

  /**
   * 获取节点的出边
   */
  private getOutgoingEdges(nodeId: string): FlowchartEdge[] {
    return this.flowchart.edges.filter((edge) => edge.source === nodeId)
  }

  /**
   * 根据条件选择下一个节点
   */
  private selectNextEdge(edges: FlowchartEdge[]): FlowchartEdge | null {
    if (edges.length === 0) {
      return null
    }

    // 如果没有条件，返回第一条边
    if (!edges[0].condition) {
      return edges[0]
    }

    // 评估条件，返回匹配的边
    for (const edge of edges) {
      if (edge.condition && this.evaluateCondition(edge.condition)) {
        return edge
      }
    }

    return edges[0] // 默认返回第一条边
  }

  /**
   * 评估条件表达式
   */
  private evaluateCondition(condition: string): boolean {
    try {
      // 将变量注入到表达式上下文
      const func = new Function(...Object.keys(this.context.variables), `return ${condition}`)
      const args = Object.values(this.context.variables)
      return func(...args)
    } catch (error) {
      console.error('Error evaluating condition:', error)
      return false
    }
  }

  /**
   * 执行节点
   */
  private async executeNode(node: FlowchartNode): Promise<void> {
    switch (node.type) {
      case 'start':
        await this.executeStartNode(node)
        break
      case 'message':
        await this.executeMessageNode(node)
        break
      case 'condition':
        await this.executeConditionNode(node)
        break
      case 'agent-assign':
        await this.executeAgentAssignNode(node)
        break
      case 'action':
        await this.executeActionNode(node)
        break
      case 'end':
        await this.executeEndNode(node)
        break
      default:
        console.warn(`Unknown node type: ${node.type}`)
    }

    // 记录执行历史
    this.context.history.push(node.id)
  }

  /**
   * 执行起始节点
   */
  private async executeStartNode(node: FlowchartNode): Promise<void> {
    console.log('Starting flowchart from node:', node.id)

    // 初始化变量
    if (node.data) {
      Object.assign(this.context.variables, node.data)
    }
  }

  /**
   * 执行消息节点
   */
  private async executeMessageNode(node: FlowchartNode): Promise<void> {
    const { assistantId, content, target } = node.data as any

    if (!content) {
      console.warn('Message node has no content')
      return
    }

    // 创建消息
    const message: Message = {
      id: `msg_${Date.now()}`,
      role: assistantId ? 'assistant' : 'system',
      contentParts: [{ type: 'text', text: content }],
      assistantId,
      timestamp: Date.now(),
    }

    this.context.messages.push(message)

    console.log('Message sent:', message)
  }

  /**
   * 执行条件节点
   */
  private async executeConditionNode(node: FlowchartNode): Promise<void> {
    const { expression } = node.data as any

    if (!expression) {
      console.warn('Condition node has no expression')
      return
    }

    const result = this.evaluateCondition(expression)
    this.context.variables[node.id] = result

    console.log('Condition evaluated:', expression, '=', result)
  }

  /**
   * 执行代理分配节点
   */
  private async executeAgentAssignNode(node: FlowchartNode): Promise<void> {
    const { assistantId, variable } = node.data as any

    if (!assistantId) {
      console.warn('Agent assign node has no assistantId')
      return
    }

    const assistant = this.context.assistants.find((a) => a.id === assistantId)
    if (!assistant) {
      console.warn(`Assistant not found: ${assistantId}`)
      return
    }

    // 将当前助手分配到变量
    if (variable) {
      this.context.variables[variable] = assistant
    }

    console.log('Agent assigned:', assistant.name)
  }

  /**
   * 执行动作节点
   */
  private async executeActionNode(node: FlowchartNode): Promise<void> {
    const { action, params } = node.data as any

    console.log('Executing action:', action, params)

    // 这里可以添加各种自定义动作
    // 例如：发送通知、更新状态等

    switch (action) {
      case 'setVariable':
        if (params.name !== undefined && params.value !== undefined) {
          this.context.variables[params.name] = params.value
        }
        break
      case 'increment':
        if (params.name !== undefined) {
          this.context.variables[params.name] =
            (this.context.variables[params.name] || 0) + 1
        }
        break
      case 'sendMessage':
        // 发送消息到助手
        console.log('Sending message:', params)
        break
      default:
        console.warn('Unknown action:', action)
    }
  }

  /**
   * 执行结束节点
   */
  private async executeEndNode(node: FlowchartNode): Promise<void> {
    console.log('Flowchart finished at node:', node.id)
    this.context.isFinished = true
  }

  /**
   * 启动执行
   */
  async start(): Promise<void> {
    const startNode = this.getStartNode()
    if (!startNode) {
      console.error('No start node found in flowchart')
      return
    }

    this.context.currentNodeId = startNode.id
    await this.executeStep()
  }

  /**
   * 执行下一步
   */
  async executeStep(): Promise<void> {
    if (this.context.isFinished || !this.context.currentNodeId) {
      return
    }

    // 执行当前节点
    const currentNode = this.flowchart.nodes.find(
      (n) => n.id === this.context.currentNodeId
    )

    if (!currentNode) {
      console.error('Current node not found:', this.context.currentNodeId)
      return
    }

    await this.executeNode(currentNode)

    // 如果已经结束，停止执行
    if (this.context.isFinished) {
      return
    }

    // 获取下一个节点
    const outgoingEdges = this.getOutgoingEdges(currentNode.id)
    const nextEdge = this.selectNextEdge(outgoingEdges)

    if (!nextEdge) {
      console.log('No next edge, flowchart finished')
      this.context.isFinished = true
      return
    }

    this.context.currentNodeId = nextEdge.target
  }

  /**
   * 获取执行上下文
   */
  getContext(): FlowchartExecutionContext {
    return { ...this.context }
  }

  /**
   * 获取消息
   */
  getMessages(): Message[] {
    return [...this.context.messages]
  }

  /**
   * 设置变量
   */
  setVariable(name: string, value: any): void {
    this.context.variables[name] = value
  }

  /**
   * 获取变量
   */
  getVariable(name: string): any {
    return this.context.variables[name]
  }
}

/**
 * 创建一个简单的循环聊天流程图
 */
export function createLoopChatFlowchart(): Flowchart {
  return {
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
        data: { content: '请开始对话' },
      },
      {
        id: 'check_continue',
        type: 'condition',
        label: '是否继续？',
        position: { x: 500, y: 100 },
        data: { expression: 'round < maxRounds' },
      },
      {
        id: 'increment',
        type: 'action',
        label: '增加轮次',
        position: { x: 700, y: 50 },
        data: { action: 'increment', params: { name: 'round' } },
      },
      {
        id: 'end',
        type: 'end',
        label: '结束',
        position: { x: 700, y: 150 },
      },
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'message' },
      { id: 'e2', source: 'message', target: 'check_continue' },
      {
        id: 'e3',
        source: 'check_continue',
        target: 'increment',
        condition: 'round < maxRounds',
      },
      { id: 'e4', source: 'increment', target: 'message' },
      {
        id: 'e5',
        source: 'check_continue',
        target: 'end',
        condition: 'round >= maxRounds',
      },
    ],
  }
}
