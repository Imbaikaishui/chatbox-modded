import {
  Box,
  Stack,
  Paper,
  Group,
  Text,
  ActionIcon,
  Badge,
  Divider,
  ScrollArea,
} from '@mantine/core'
import {
  IconUsers,
  IconSettings,
  IconPlay,
  IconStop,
  IconRefresh,
} from '@tabler/icons-react'
import { useState } from 'react'
import type { Assistant, GameMode } from 'src/shared/types'
import { useAssistantStore } from '@/stores/assistantStore'
import { GAME_MODES } from '@/utils/gameModes'

interface GroupChatPanelProps {
  onToggle: () => void
  onStartGroupChat: () => void
  onStopGroupChat: () => void
  isRunning: boolean
  selectedAssistants: Assistant[]
  onAssistantToggle: (assistant: Assistant) => void
  gameMode: GameMode
  onGameModeChange: (mode: GameMode) => void
}

export function GroupChatPanel({
  onToggle,
  onStartGroupChat,
  onStopGroupChat,
  isRunning,
  selectedAssistants,
  onAssistantToggle,
  gameMode,
  onGameModeChange,
}: GroupChatPanelProps) {
  const [showSettings, setShowSettings] = useState(false)
  const assistants = useAssistantStore((state) => state.assistants)

  const activeAssistantsCount = selectedAssistants.filter((a) => !a.isUser).length

  return (
    <Paper
      p="sm"
      withBorder
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          <IconUsers size={18} />
          <Text size="sm" fw={500}>
            群聊
          </Text>
          {activeAssistantsCount > 0 && (
            <Badge size="xs" color="blue">
              {activeAssistantsCount}
            </Badge>
          )}
        </Group>
        <Group gap="xs">
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={() => setShowSettings(!showSettings)}
          >
            <IconSettings size={16} />
          </ActionIcon>
          <ActionIcon size="sm" variant="subtle" onClick={onToggle}>
            ×
          </ActionIcon>
        </Group>
      </Group>

      {/* Game Mode */}
      {showSettings && (
        <Stack gap="sm" mb="sm">
          <Text size="xs" c="dimmed">
            游戏模式
          </Text>
          <ScrollArea.Autosize mah={120}>
            <Stack gap="xs">
              {Object.keys(GAME_MODES).map((key) => {
                const mode = GAME_MODES[key as GameMode]
                return (
                  <Paper
                    key={key}
                    p="xs"
                    withBorder
                    onClick={() => onGameModeChange(key as GameMode)}
                    style={{
                      cursor: 'pointer',
                      border:
                        gameMode === key
                          ? '2px solid var(--mantine-color-blue-6)'
                          : undefined,
                    }}
                  >
                    <Text size="sm" fw={gameMode === key ? 500 : 400}>
                      {mode.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {mode.description}
                    </Text>
                  </Paper>
                )
              })}
            </Stack>
          </ScrollArea.Autosize>

          <Divider />

          {/* Assistants List */}
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              参与者 ({assistants.length})
            </Text>
            <Text size="xs" c="blue" style={{ cursor: 'pointer' }}>
              + 添加
            </Text>
          </Group>

          <ScrollArea.Autosize mah={200}>
            <Stack gap="xs">
              {assistants.map((assistant) => {
                const isSelected = selectedAssistants.some(
                  (a) => a.id === assistant.id
                )

                return (
                  <Paper
                    key={assistant.id}
                    p="xs"
                    withBorder
                    onClick={() => onAssistantToggle(assistant)}
                    style={{
                      cursor: 'pointer',
                      border: isSelected
                        ? '2px solid var(--mantine-color-blue-6)'
                        : undefined,
                      opacity: assistant.isActive ? 1 : 0.6,
                    }}
                  >
                    <Group gap="xs">
                      <Box
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: 'var(--mantine-color-gray-3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {assistant.name[0]}
                      </Box>
                      <Text size="sm">{assistant.name}</Text>
                      {assistant.isUser && (
                        <Badge size="xs" color="green">
                          用户
                        </Badge>
                      )}
                    </Group>
                  </Paper>
                )
              })}
            </Stack>
          </ScrollArea.Autosize>
        </Stack>
      )}

      {/* Actions */}
      {!showSettings && (
        <Stack gap="sm">
          <Text size="xs" c="dimmed">
            当前模式: {GAME_MODES[gameMode]?.name}
          </Text>
          <Text size="xs" c="dimmed">
            {activeAssistantsCount} 个助手参与
          </Text>
        </Stack>
      )}

      {/* Control Buttons */}
      <Divider mt="sm" mb="sm" />

      {!isRunning ? (
        <Group justify="center">
          <ActionIcon
            size="lg"
            variant="filled"
            color="green"
            onClick={onStartGroupChat}
            disabled={activeAssistantsCount < 2}
          >
            <IconPlay size={20} />
          </ActionIcon>
          <Text size="xs" c="dimmed">
            开始群聊
          </Text>
        </Group>
      ) : (
        <Group justify="center">
          <ActionIcon
            size="lg"
            variant="filled"
            color="red"
            onClick={onStopGroupChat}
          >
            <IconStop size={20} />
          </ActionIcon>
          <Text size="xs" c="dimmed">
            停止群聊
          </Text>
        </Group>
      )}
    </Paper>
  )
}
