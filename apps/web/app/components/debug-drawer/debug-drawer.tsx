import { HttpRequestsPanel } from '@components';
import { Drawer } from '@mantine/core';

interface DebugDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export const DebugDrawer = ({ opened, onClose }: DebugDrawerProps) => {
  return (
    <Drawer
      position="right"
      opened={opened}
      title="Debug Drawer"
      onClose={onClose}
      size="xl"
    >
      <HttpRequestsPanel />
    </Drawer>
  );
};
