import { Button, Loader, type ButtonProps } from '@mantine/core';
import { useState } from 'react';

interface ButtonWithLoaderProps extends Omit<ButtonProps, 'onClick'> {
  onClick: () => Promise<void>;
}

export const ButtonWithLoader = ({
  onClick,
  children,
  ...props
}: ButtonWithLoaderProps) => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      {...props}
      onClick={async () => {
        try {
          setLoading(true);
          await onClick();
        } finally {
          setLoading(false);
        }
      }}
    >
      <span style={{ visibility: loading ? 'hidden' : 'visible' }}>
        {children}
      </span>
      {loading ? (
        <Loader
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          size="sm"
        ></Loader>
      ) : null}
    </Button>
  );
};
