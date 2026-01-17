import { Combobox, Input, InputBase, Loader, useCombobox } from '@mantine/core';
import type { Category } from '@zero/domain';
import { useRequest } from '@zero/react-api';
import { useState } from 'react';

interface CategoriesComboBoxProps {
  currentValue: Category | undefined;
  onChange: (newValue: Category | undefined) => void;
}

export const CategoriesComboBox = ({
  currentValue,
  onChange,
}: CategoriesComboBoxProps) => {
  const [data, setData] = useState<Map<string, Category>>(new Map());
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<Category | undefined>(currentValue);
  const { execute: listCategories } = useRequest('ListCategoriesQueryUnpaged');

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: async () => {
      if (data.size === 0 && !loading) {
        setLoading(true);

        const categories = await listCategories();
        if (categories) {
          setData(
            new Map(categories.categories.map((item) => [item.id, item]))
          );
          setLoading(false);
          combobox.resetSelectedOption();
        }
      }
    },
  });

  const options = Array.from(data.values()).map((item) => (
    <Combobox.Option value={item.id} key={item.id}>
      {item.name}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        const theCategory = data.get(val);
        setValue(theCategory);
        onChange(theCategory);
        combobox.closeDropdown();
        console.log({ theCategory: theCategory?.name });
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          variant="unstyled"
          p="none"
          styles={{
            root: {
              display: 'flex',
              alignItems: 'center',
              minHeight: '1rem',
              height: '1rem',
            },
            wrapper: {
              flexGrow: 2,
            },
          }}
          style={{}}
          type="button"
          pointer
          rightSection={loading ? <Loader size={18} /> : <Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
        >
          {value?.name || <Input.Placeholder>Pick value</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {loading ? <Combobox.Empty>Loading....</Combobox.Empty> : options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
