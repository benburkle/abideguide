'use client';

import { useState, useEffect } from 'react';
import { Box, useMantineColorScheme } from '@mantine/core';
import { TopNavBar } from './TopNavBar';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { colorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const borderColor = mounted && colorScheme === 'dark' 
    ? 'var(--mantine-color-dark-4)' 
    : 'var(--mantine-color-gray-3)';

  return (
    <Box style={{ minHeight: '100vh' }}>
      <Box>
        <TopNavBar onMenuClick={toggleSidebar} />
        <Box
          style={{
            display: 'flex',
            minHeight: 'calc(100vh - 120px)'
          }}
        >
          {sidebarOpen && (
            <Box style={{ width: 'auto', flexShrink: 0, borderRight: `1px solid ${borderColor}` }}>
              <Sidebar />
            </Box>
          )}
          <Box 
            style={{ 
              flex: 1,
              padding: '24px', 
              minHeight: '100%' 
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
