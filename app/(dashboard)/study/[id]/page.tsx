'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Title,
  Text,
  Box,
  Button,
  Loader,
  Stack,
  Group,
  ActionIcon,
  Badge,
  Divider,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface GuideStep {
  id: number;
  name: string;
  instructions: string | null;
  example: string | null;
  index: number;
}

interface SessionStep {
  id: number;
  guideStepId: number;
  guideStep: GuideStep;
}

interface Session {
  id: number;
  date: string | null;
  time: string | null;
  insights: string | null;
  sessionSteps: SessionStep[];
}

interface Schedule {
  id: number;
  day: string;
  timeStart: string;
  repeats: string;
}

interface Resource {
  id: number;
  name: string;
  type: string;
}

interface Study {
  id: number;
  name: string;
  scheduleId: number | null;
  resourceId: number;
  schedule: Schedule | null;
  resource: Resource;
  sessions: Session[];
}

export default function StudyPage() {
  const router = useRouter();
  const params = useParams();
  const studyId = params?.id as string;

  const [study, setStudy] = useState<Study | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

  useEffect(() => {
    if (studyId) {
      fetchStudy();
    }
  }, [studyId]);

  useEffect(() => {
    // Reset to latest session (index 0) when study changes
    setCurrentSessionIndex(0);
  }, [study]);

  const fetchStudy = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/studies/${studyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch study');
      }
      const data = await response.json();
      setStudy(data);
    } catch (error) {
      console.error('Error fetching study:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load study',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const currentSession = study?.sessions && study.sessions.length > 0 
    ? study.sessions[currentSessionIndex] 
    : null;

  const hasPreviousSession = currentSessionIndex < (study?.sessions?.length || 0) - 1;
  const hasNextSession = currentSessionIndex > 0;

  const goToPreviousSession = () => {
    if (hasPreviousSession) {
      setCurrentSessionIndex(currentSessionIndex + 1);
    }
  };

  const goToNextSession = () => {
    if (hasNextSession) {
      setCurrentSessionIndex(currentSessionIndex - 1);
    }
  };

  if (loading) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Loader size="lg" />
      </Box>
    );
  }

  if (!study) {
    return (
      <Box>
        <Text c="red">Study not found</Text>
        <Button mt="md" onClick={() => router.push('/setup/studies')}>
          Back to Studies
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Group justify="space-between" mb="xl" wrap="wrap">
        <Title order={2} style={{ fontFamily: 'Arial, sans-serif' }}>
          {study.name}
        </Title>
      </Group>

      <Stack gap="md" mb="xl">
        <Box>
          <Text size="sm" c="dimmed">
            Resource
          </Text>
          <Text>{study.resource?.name || '-'}</Text>
        </Box>
        <Box>
          <Text size="sm" c="dimmed">
            Schedule
          </Text>
          {study.schedule ? (
            <Text>
              {study.schedule.day} {study.schedule.timeStart} ({study.schedule.repeats})
            </Text>
          ) : (
            <Text>-</Text>
          )}
        </Box>
      </Stack>

      <Divider mb="xl" />

      {currentSession ? (
        <Box>
          <Group justify="space-between" mb="md">
            <Group gap="md">
              <Text size="sm" c="dimmed">
                Session {study.sessions.length - currentSessionIndex} of {study.sessions.length}
              </Text>
              {currentSession.date && (
                <Text size="sm">
                  {new Date(currentSession.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              )}
              {currentSession.time && (
                <Text size="sm">
                  {new Date(currentSession.time).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
              )}
            </Group>
            <Group gap="xs">
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={goToPreviousSession}
                disabled={!hasPreviousSession}
                aria-label="Previous session"
              >
                <IconChevronLeft size={20} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={goToNextSession}
                disabled={!hasNextSession}
                aria-label="Next session"
              >
                <IconChevronRight size={20} />
              </ActionIcon>
            </Group>
          </Group>

          {currentSession.insights && (
            <Box mb="xl">
              <Text size="sm" c="dimmed" mb="xs">
                Insights
              </Text>
              <Text>{currentSession.insights}</Text>
            </Box>
          )}

          {currentSession.sessionSteps && currentSession.sessionSteps.length > 0 ? (
            <Box>
              <Title order={3} mb="md" style={{ fontFamily: 'Arial, sans-serif' }}>
                Session Steps
              </Title>
              <Stack gap="md">
                {currentSession.sessionSteps.map((sessionStep, index) => (
                  <Box
                    key={sessionStep.id}
                    style={{
                      padding: '16px',
                      border: '1px solid var(--mantine-color-gray-3)',
                      borderRadius: '4px',
                    }}
                  >
                    <Group gap="xs" mb="xs">
                      <Badge>{index + 1}</Badge>
                      <Text fw={500}>{sessionStep.guideStep.name}</Text>
                    </Group>
                    {sessionStep.guideStep.instructions && (
                      <Text size="sm" c="dimmed" mb="xs">
                        {sessionStep.guideStep.instructions}
                      </Text>
                    )}
                    {sessionStep.guideStep.example && (
                      <Box
                        style={{
                          padding: '8px',
                          backgroundColor: 'var(--mantine-color-gray-0)',
                          borderRadius: '4px',
                          marginTop: '8px',
                        }}
                      >
                        <Text size="sm" c="dimmed" mb="xs">
                          Example:
                        </Text>
                        <Text size="sm">{sessionStep.guideStep.example}</Text>
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              No session steps for this session.
            </Text>
          )}
        </Box>
      ) : (
        <Text c="dimmed" ta="center" py="xl">
          No sessions yet.
        </Text>
      )}
    </Box>
  );
}

