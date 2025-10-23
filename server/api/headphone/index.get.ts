import { headphones } from '~~/shared/utils/headphones';

export default defineCachedEventHandler(async (_event) => {
  const headphoneList = headphones;
  return headphoneList;
}, { maxAge: 60 * 60 * 24 }); // 1 day
