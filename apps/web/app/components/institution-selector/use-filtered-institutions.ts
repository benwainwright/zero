import type { BankConnection } from '@zero/domain';
import Fuse from 'fuse.js';
import { useState } from 'react';

export const useFilteredInstitutions = (institutions: BankConnection[]) => {
  const [filter, setFilter] = useState<string>();

  if (!filter) {
    return { filteredInstitutions: institutions, setFilter };
  }

  const fuse = new Fuse(institutions, {
    keys: ['bankName'],
  });

  const filteredInstitutions = fuse.search(filter).map((item) => item.item);

  return { filteredInstitutions, setFilter };
};
