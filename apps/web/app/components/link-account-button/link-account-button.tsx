import { ButtonWithLoader } from '@components';
import { Button, Combobox, Input, InputBase, useCombobox } from '@mantine/core';
import { useRequest } from '@zero/react-api';
import { useEffect, useState, type ReactNode } from 'react';

interface LinkAccountButtonProps {
  onPick: (id: string) => void | Promise<void>;
}

interface AccountDetails {
  name: string | undefined;
  details: string | undefined;
  id: string;
}

export const LinkAccountButton = ({
  onPick,
}: LinkAccountButtonProps): ReactNode => {
  const { execute: getAccounts } = useRequest('GetOpenBankingAccountsCommand');

  const [accounts, setAccounts] = useState<AccountDetails[]>();

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
    },
  });

  if (accounts) {
    const options = accounts.map((item) => (
      <Combobox.Option value={item.id} key={item.id}>
        {item.name ?? item.details}
      </Combobox.Option>
    ));

    return (
      <Combobox
        store={combobox}
        // oxlint-disable eslint/no-misused-promises
        onOptionSubmit={async (val) => {
          await onPick(val);
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <InputBase
            component="button"
            variant="subtle"
            type="button"
            pointer
            rightSection={<Combobox.Chevron />}
            rightSectionPointerEvents="none"
            onClick={() => {
              combobox.toggleDropdown();
            }}
          >
            {typeof accounts === 'undefined' ? (
              <div aria-busy></div>
            ) : (
              <Input.Placeholder>Choose Account</Input.Placeholder>
            )}
          </InputBase>
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Options>{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    );
  }

  return (
    <ButtonWithLoader
      variant="subtle"
      onClick={async () => {
        setAccounts(await getAccounts());
        combobox.openDropdown();
      }}
    >
      Link Account
    </ButtonWithLoader>
  );
};
