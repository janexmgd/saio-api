import { parse as parseSetCookie, splitCookiesString } from 'set-cookie-parser';
function updateCookieValues(cookie, values) {
  let changed = false;

  for (const [key, value] of Object.entries(values)) {
    changed = cookie.set(key, value) || changed;
  }

  if (changed && cookie.meta) {
    dirty = true;
    if (isCluster) {
      const message = { cookieUpdate: { ...cookie.meta, cookie } };
      cluster.send(message);
    }
  }

  return changed;
}
export function updateCookie(cookie, headers) {
  if (!cookie) return;

  const parsed = parseSetCookie(splitCookiesString(headers.get('set-cookie')), {
      decodeValues: false,
    }),
    values = {};

  cookie.unset(parsed.filter((c) => c.expires < new Date()).map((c) => c.name));
  parsed
    .filter((c) => !c.expires || c.expires > new Date())
    .forEach((c) => (values[c.name] = c.value));

  updateCookieValues(cookie, values);
}
