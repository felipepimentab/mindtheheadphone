import { headphones } from '~~/shared/utils/headphones';

export default defineEventHandler(async (event) => {
  // Cache for 30 minutes to avoid excessive requests
  setHeader(event, 'Cache-Control', 's-maxage=1800');

  const headphoneList = headphones;
  return headphoneList;
});
