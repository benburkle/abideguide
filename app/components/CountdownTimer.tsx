'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Button, Group, TextInput, Text, Stack, ActionIcon, Modal, Tooltip } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState({ minutes: 0, seconds: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const playSound = () => {
    // Create a beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // Frequency in Hz
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleSetTime = () => {
    const totalSeconds = initialTime.minutes * 60 + initialTime.seconds;
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsRunning(false);
      setModalOpen(false);
    }
  };

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRunning(false);
  };

  const handleTimerClick = () => {
    setModalOpen(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <>
      <Group gap="xs" style={{ alignItems: 'center' }}>
        <Tooltip label="Start">
          <ActionIcon
            variant="filled"
            size="lg"
            onClick={handleStart}
            disabled={isRunning || timeLeft === 0}
            radius="xl"
          >
            <IconPlayerPlay size={18} />
          </ActionIcon>
        </Tooltip>
        <Box
          onClick={handleTimerClick}
          style={{
            padding: '4px 12px',
            border: '1px solid var(--mantine-color-gray-3)',
            borderRadius: '4px',
            textAlign: 'center',
            backgroundColor: 'var(--mantine-color-gray-0)',
            cursor: 'pointer',
            minWidth: '70px',
          }}
        >
          <Text size="sm" fw={600} style={{ fontFamily: 'monospace' }}>
            {formatTime(timeLeft)}
          </Text>
        </Box>
        <Tooltip label="Stop">
          <ActionIcon
            variant="filled"
            size="lg"
            onClick={handleStop}
            disabled={!isRunning}
            radius="xl"
          >
            <IconPlayerStop size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Set Timer"
        size="xs"
      >
        <Stack gap="md">
          <Group gap="xs" align="center">
            <TextInput
              type="number"
              placeholder="Min"
              label="Minutes"
              value={initialTime.minutes || ''}
              onChange={(e) =>
                setInitialTime({
                  ...initialTime,
                  minutes: parseInt(e.target.value) || 0,
                })
              }
              style={{ width: '100px' }}
              min={0}
              max={59}
            />
            <Text size="xl" mt="xl">:</Text>
            <TextInput
              type="number"
              placeholder="Sec"
              label="Seconds"
              value={initialTime.seconds || ''}
              onChange={(e) =>
                setInitialTime({
                  ...initialTime,
                  seconds: parseInt(e.target.value) || 0,
                })
              }
              style={{ width: '100px' }}
              min={0}
              max={59}
            />
          </Group>
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetTime}>
              Set
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

