import { updateCookie } from '../cookie/cookieManager.js';
import Cookie from '../cookie/cookie.js';
import userAgent from '../helpers/userAgent.js';
import createError from '../../utils/createError.js';
const tiktokService = async (url) => {
  try {
    const cookie = new Cookie({});
    const vtFormat = /^https:\/\/vt\.tiktok\.com\/[A-Za-z0-9]+\/?$/;
    const tiktokVideoUrlFormat =
      /^https:\/\/www\.tiktok\.com\/@([A-Za-z0-9_.]+)\/video\/(\d+)\/?$/;
    let postId;
    if (vtFormat.test(url)) {
      const data = await fetch(url, {
        redirect: 'manual',
        headers: {
          'User-Agent': userAgent.split(' Chrome/1')[0],
        },
      });
      const html = await data.text();
      if (!html) {
        return { error: 'tiktok not returning html' };
      }

      if (html.startsWith('<a href="https://')) {
        const extractedUrl = html.split('<a href="')[1].split('?')[0];
        if (tiktokVideoUrlFormat.test(extractedUrl)) {
          postId = extractedUrl.split('/').pop();
        } else {
          return { error: 'unkown url response' };
        }
      }
      if (!postId) {
        return { error: 'fetch failed' };
      }
    } else {
      if (tiktokVideoUrlFormat.test(url)) {
        postId = url.split('/').pop();
      } else {
        return { error: 'fetch failed' };
      }
    }
    const res = await fetch(`https://tiktok.com/@i/video/${postId}`, {
      headers: {
        'User-Agent': userAgent.split(' Chrome/1')[0],
        cookie,
      },
    });
    updateCookie(cookie, res.headers);
    let detail;
    const html = await res.text();
    const json = html
      .split(
        '<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application/json">'
      )[1]
      .split('</script>')[0];
    const data = JSON.parse(json);

    const videoDetail = data['__DEFAULT_SCOPE__']['webapp.video-detail'];
    if (!videoDetail) throw createError(500, 'no detail video found');

    // status_deleted or etc
    if (videoDetail.statusMsg) {
      throw createError(500, 'content unavailable');
    }

    detail = videoDetail?.itemInfo?.itemStruct;
    if (detail.isContentClassified) {
      throw createError(500, 'content.post.age');
    }

    if (!detail.author) {
      throw createError(500, 'fetch empty');
    }
    // let playAddr = detail.video?.playAddr;
    return {
      data: {
        service: 'tiktok',
        content: detail,
        cookie: cookie,
      },
    };
  } catch (error) {
    console.log(error.message);

    throw createError(500, 'failed fetch');
  }
};
export default tiktokService;
