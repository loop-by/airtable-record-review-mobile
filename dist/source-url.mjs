function sourceError(code, message) { const error = new Error(message); error.code = code; return error; }

/** Only publicly shared Interface URLs; keep record/filter query parameters intact. */
export function parseSource(value) {
  let url;
  try { url = new URL(String(value).trim()); }
  catch { throw sourceError('invalidUrl', 'https://airtable.com/app…/shr… 형식의 공개 Interface 링크를 입력하세요.'); }
  const match = url.pathname.match(/^\/(?:embed\/)?(app[a-zA-Z0-9]{14})\/(shr[a-zA-Z0-9]{14})\/?$/);
  if (url.protocol !== 'https:' || !['airtable.com', 'www.airtable.com'].includes(url.hostname)
      || url.port || url.username || url.password || !match) {
    throw sourceError('unsupportedUrl', 'Airtable 공개 Interface 링크만 지원합니다. 공개 공유 주소의 /app…/shr… 부분을 확인하세요.');
  }
  const path = `${match[1]}/${match[2]}`;
  const suffix = url.search + url.hash;
  return { original: `https://airtable.com/${path}${suffix}`, embed: `https://airtable.com/embed/${path}${suffix}` };
}

export function resolveSource(search) {
  const params = new URLSearchParams(search);
  if (!params.has('url')) return null;
  return { ...parseSource(params.get('url')), custom: true };
}

export function shareUrl(readerUrl, value) {
  const source = parseSource(value);
  const result = new URL(readerUrl);
  result.search = '';
  result.hash = '';
  result.searchParams.set('url', source.original);
  return result.href;
}
