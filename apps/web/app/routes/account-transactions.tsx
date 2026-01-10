import { Page } from '@components';
import { useAccount } from '@zero/react-api';
import { useParams } from 'react-router';

const AccountTransactions = () => {
  const { accountId } = useParams<{ accountId: string }>();
  if (!accountId) {
    throw new Error(`Account id missing!`);
  }

  const { account } = useAccount(accountId);
  return (
    <Page routeName="accountTransactions" title={account?.name ?? ''}>
      <p>test</p>
    </Page>
  );
};

export default AccountTransactions;
