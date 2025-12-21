import type { IUser } from '@zero/domain';

export const canAccess = ({
  user,
  routeTags,
}: {
  user: IUser | undefined;
  routeTags: string[];
}) => {
  if (!user && routeTags.includes('public')) {
    return true;
  }

  return Boolean(true);
};
