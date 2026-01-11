import {
  Button,
  createTheme,
  Input,
  PasswordInput,
  Stack,
} from '@mantine/core';

export const theme = createTheme({
  components: {
    Stack: Stack.extend({
      defaultProps: {
        gap: 'lg',
        m: 'lg',
      },
    }),
    Input: Input.extend({
      defaultProps: {
        size: 'lg',
      },
    }),

    PasswordInput: PasswordInput.extend({
      defaultProps: {
        size: 'lg',
      },
    }),
    TextInput: PasswordInput.extend({
      defaultProps: {
        size: 'lg',
      },
    }),
  },
});
