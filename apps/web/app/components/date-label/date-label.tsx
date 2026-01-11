import { DateTime, type DateTimeFormatOptions } from 'luxon';

interface DateLabelProps {
  date: Date | string;
  formatOptions?: DateTimeFormatOptions;
}
export const DateLabel = ({ date, formatOptions }: DateLabelProps) => {
  return (
    <>
      {DateTime.fromJSDate(
        typeof date === 'string' ? new Date(date) : date
      ).toLocaleString(formatOptions)}
    </>
  );
};
