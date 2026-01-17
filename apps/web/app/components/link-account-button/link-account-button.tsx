import { Button, Combobox, Input, InputBase, useCombobox } from '@mantine/core';
import { useRequest, useDataRequest } from '@zero/react-api';
import { useEffect, useState, type ReactNode } from 'react';

interface LinkAccountButtonProps {
  onPick: (id: string) => void | Promise<void>;
}

interface AccountDetails {
  name: string;
  details: string;
  id: string;
}

export const LinkAccountButton = ({
  onPick,
}: LinkAccountButtonProps): ReactNode => {
  const [isLinking, setIsLinking] = useState(false);
  const { execute: fetchDetails } = useRequest(
    'FetchLinkedAccountsDetailsCommand'
  );
  const { data: linkedAccountDetails, refresh } = useDataRequest(
    'GetLinkedAccountsDetailsQuery',
    isLinking
  );

  const [requisitionAccounts, setRequisitionAccounts] =
    useState<AccountDetails[]>();

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
    },
  });

  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      if (
        isLinking &&
        linkedAccountDetails &&
        linkedAccountDetails.length > 0
      ) {
        setRequisitionAccounts(linkedAccountDetails);
      } else {
        await fetchDetails();
        refresh();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLinking, fetchDetails, refresh, JSON.stringify(linkedAccountDetails)]);

  if (isLinking && requisitionAccounts) {
    const options = requisitionAccounts.map((item) => (
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
          setValue(val);
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
            {value ? (
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
    <Button
      variant="subtle"
      onClick={() => {
        setIsLinking(true);
        combobox.openDropdown();
      }}
    >
      Link Account
    </Button>
  );
};
