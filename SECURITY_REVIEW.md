# Security review

Scope: the static wrapper source, URL handling and anonymous HTTP responses from the current deployment. This was a focused review, not a complete penetration test of Airtable or the hosting provider.

## Findings

### Medium: supplied interface URLs appear in request URLs

The Reader uses `?url=...`. An initial navigation sends the complete supplied interface URL, including its nested query values, to the hosting provider. It also appears in browser history and copied share links. Anyone receiving that Reader link receives the public interface address. No actual hosting logs were inspected, and log retention is unknown.

Consider fragment-based state (`#url=...`) for new links while retaining compatibility with existing links. Fragments are excluded from the HTTP request target, although page scripts and browser history can still access them. Strip unnecessary source query values when sharing and avoid putting credentials or private filters in public links.

### Low: response security headers are absent

Anonymous HTTP 200 responses for the home page, Reader and URL module did not include Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy or Strict-Transport-Security. The site is served over HTTPS. Absence of these headers is a hardening gap, not proof of an exploitable vulnerability.

Configure appropriate headers at the hosting layer, including a tested CSP, `frame-ancestors` and `nosniff`. A CSP must allow the required Airtable frame and hosting infrastructure. `frame-ancestors` cannot be enforced through a meta element. Header configuration support must be confirmed with the hosting provider.

### Low: external iframe has no sandbox restrictions

The iframe is limited to HTTPS Airtable URLs, but has no sandbox attribute. The same-origin policy already prevents it from reading the wrapper DOM; this review found no bypass. A compatible sandbox could further restrict top-level navigation and other frame capabilities. Test external links, downloads and embedded attachments before enabling it.

## Improvements included in the source cleanup

- Removed source-specific URLs, deployment addresses, organization identifiers, record-specific verification details and duplicate archives from the GitHub snapshot.
- A `no-referrer` meta policy now covers both pages; the Airtable iframe explicitly uses `no-referrer`, and the original-link anchor uses `noopener noreferrer`.
- The wrapper stores only language and zoom preferences locally, not interface URLs or record contents.
- New repository history uses a generic project author and a reserved example email address.

## Checks without a finding

- URL validation rejects non-HTTPS schemes, credentials, nonstandard ports, unrelated hosts and private-page URL formats.
- URL values are assigned as DOM values or validated attributes. No `innerHTML`, dynamic script evaluation or HTML interpolation of user input was found in the wrapper.
- No backend credential store, API token, record database or user-supplied server-side fetch endpoint was found in this static application.
- Anonymous requests for `/.git/config`, `/.openai/hosting.json` and `/.env` returned HTTP 404.
- No credentials were found by the source review and common-token-pattern scan. This is not a guarantee that every possible secret format was recognized.

## History and retention limits

Rewriting Git branches removes old commits from normal branch history. It does not erase GitHub cached commit views, other clones, forks, hosting backups or saved historical deployments. Removal of provider-retained data requires the provider's supported deletion or support process. Do not restore an old clone into the cleaned repository.

## References

- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
- https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#sandbox
