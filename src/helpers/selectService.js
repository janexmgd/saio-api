import tiktokService from '../core/processing/tiktok.js';
import createError from '../utils/createError.js';
export default async (url) => {
  const tiktokFormatUrls = [
    /^https:\/\/vt\.tiktok\.com\/[A-Za-z0-9]+\/?$/,
    /^https:\/\/www\.tiktok\.com\/@([A-Za-z0-9_.]+)\/video\/(\d+)\/?$/,
  ];
  for (const tiktokFormatUrl of tiktokFormatUrls) {
    if (tiktokFormatUrl.test(url)) {
      const data = await tiktokService(url);
      return data;
    }
  }
  throw createError('400', 'not supported url');
};
