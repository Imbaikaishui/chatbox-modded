import { ActionIcon, Tooltip } from '@mantine/core'
import { IconReply } from '@tabler/icons-react'
import type { Message } from 'src/shared/types'
import { useState } from 'react'

interface ReplyButtonProps {
  message: Message
  onReply: (messageId: string, assistantName: string) => void
  disabled?: boolean
}

export function ReplyButton({ message, onReply, disabled = false }: ReplyButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  // 只允许对助手的消息进行回复
  if (message.role !== 'assistant') {
    return null
  }

  const handleReply = () => {
    if (message.id && message.name) {
      onReply(message.id, message.name)
    }
  }

  return (
    <Tooltip label="回复此消息" position="top">
      <ActionIcon
        size="sm"
        variant="subtle"
        onClick={handleReply}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          opacity: isHovered ? 1 : 0.6,
          transition: 'opacity 0.2s',
        }}
      >
        <IconReply size={16} />
      </ActionIcon>
    </Tooltip>
  )
}
