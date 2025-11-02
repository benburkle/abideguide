'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Paper,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Card,
  Text,
  Badge,
  ActionIcon,
  Switch,
  Loader,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconTrash, IconCheck, IconX } from '@tabler/icons-react';

interface Post {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: false,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      // Ensure data is always an array
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch posts',
        color: 'red',
      });
      // Set to empty array on error to prevent map errors
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: 'Post created successfully!',
          color: 'green',
          icon: <IconCheck />,
        });
        setFormData({ title: '', content: '', published: false });
        fetchPosts();
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create post',
        color: 'red',
        icon: <IconX />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: 'Post deleted successfully!',
          color: 'green',
          icon: <IconCheck />,
        });
        fetchPosts();
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete post',
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  const handleTogglePublished = async (post: Post) => {
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !post.published }),
      });

      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: `Post ${!post.published ? 'published' : 'unpublished'}!`,
          color: 'green',
          icon: <IconCheck />,
        });
        fetchPosts();
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update post',
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Group justify="center">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Title order={1}>Next.js with Mantine & Database</Title>

        <Paper shadow="xs" p="md" withBorder>
          <Title order={2} mb="md">
            Create New Post
          </Title>
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Title"
                placeholder="Enter post title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <Textarea
                label="Content"
                placeholder="Enter post content"
                rows={4}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
              <Switch
                label="Published"
                checked={formData.published}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    published: e.currentTarget.checked,
                  })
                }
              />
              <Button type="submit" loading={submitting}>
                Create Post
              </Button>
            </Stack>
          </form>
        </Paper>

        <Paper shadow="xs" p="md" withBorder>
          <Title order={2} mb="md">
            Posts ({Array.isArray(posts) ? posts.length : 0})
          </Title>
          {!Array.isArray(posts) || posts.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              No posts yet. Create your first post above!
            </Text>
          ) : (
            <Stack gap="md">
              {posts.map((post) => (
                <Card key={post.id} shadow="sm" padding="lg" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Group>
                      <Title order={3}>{post.title}</Title>
                      <Badge
                        color={post.published ? 'green' : 'gray'}
                        variant="light"
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                    </Group>
                    <Group gap="xs">
                      <Switch
                        checked={post.published}
                        onChange={() => handleTogglePublished(post)}
                        size="sm"
                      />
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => handleDelete(post.id)}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Group>
                  </Group>
                  {post.content && (
                    <Text size="sm" c="dimmed" mb="xs">
                      {post.content}
                    </Text>
                  )}
                  <Text size="xs" c="dimmed">
                    Created: {new Date(post.createdAt).toLocaleString()}
                  </Text>
                </Card>
              ))}
            </Stack>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
