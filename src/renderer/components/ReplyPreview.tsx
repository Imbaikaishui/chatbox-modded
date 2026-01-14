import { Box, Group, Text, ActionIcon, Avatar } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

interface ReplyPreviewProps {
  assistantName: string
  assistantAvatar?: string
  onCancelReply: () => void
}

export function ReplyPreview({
  assistantName,
  assistantAvatar,
  onCancelReply,
}: ReplyPreviewProps) {
  return (
    <Box
      style={{
        padding: '8px 12px',
        backgroundColor: 'var(--mantine-color-blue-0)',
        borderRadius: '8px 8px 0 0',
        borderLeft: '3px solid var(--mantine-color-blue-6)',
      }}
    >
      <Group justify="space-between" gap="xs">
        <Group gap="xs">
          <Avatar size="xs" radius="xl" src={assistantAvatar}>
            {assistantName[0]}
          </Avatar>
          <Text size="sm" fw={500} c="blue">
            正在回复 {assistantName}
          </Text>
        </Group>
        <ActionIcon
          size="sm"
          variant="subtle"
          onClick={onCancelReply}
          color="gray"
        >
          <IconX size={16} />
        </ActionIcon>
      </Group>
    </Box>
  )
}
