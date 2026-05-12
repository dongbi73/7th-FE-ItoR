import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);

export const getFormattedDate = (dateString: string) => {
  const now = dayjs();
  const postDate = dayjs(dateString);
  const diffInHours = now.diff(postDate, 'hour');

  if (diffInHours < 24) {
    dayjs.locale('ko');
    return postDate.fromNow();
  }
  
  return postDate.locale('en').format('MMM D. YYYY.');
};