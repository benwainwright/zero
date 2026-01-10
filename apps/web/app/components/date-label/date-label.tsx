import { DateTime } from 'luxon';

interface DateLabelProps {
  date: Date | string;
}
export const DateLabel = ({ date }: DateLabelProps) => {
  return (
    <>
      {DateTime.fromJSDate(
        typeof date === 'string' ? new Date(date) : date
      ).toLocaleString()}
    </>
  );
};
