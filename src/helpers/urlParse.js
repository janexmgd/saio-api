import createError from '../utils/createError.js';

export default (url) => {
  let service;
  const tiktokFormatUrls = [
    /^https:\/\/vt\.tiktok\.com\/[A-Za-z0-9]+\/?$/,
    /^https:\/\/www\.tiktok\.com\/@([A-Za-z0-9_]+)\/video\/(\d+)\/?$/,
  ];

  for (const tiktokFormatUrl of tiktokFormatUrls) {
    if (tiktokFormatUrl.test(url)) {
      service = 'tiktok';
      return service;
    }
  }
  throw createError('400', 'not supported url');
};
