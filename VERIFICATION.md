# Verification

## URL handling

`node --test source-url.test.mjs` covers missing links, explicitly supplied public links, nested query/hash preservation, official embed normalization and rejected URL formats. All fixtures use synthetic IDs.

## Browser behavior

- Opening the Reader without a URL returns to an empty link input page.
- Invalid explicit URLs show an error without loading an interface.
- A submitted synthetic URL is used by the iframe, original link and share URL.
- Earlier layout checks covered 360px, 412px and 890px viewports and stable header positions when switching languages.
- List/detail switching, display zoom and language preferences have been checked in a desktop browser with mobile viewport overrides.

No original records, personal interface URLs, screenshots or source-specific test dates are retained in this repository.

## Limits

Actual mobile-browser behavior has not been verified on physical devices. Synthetic-URL checks verify URL handling, not the availability of an actual Airtable interface. Hosting and security findings are recorded separately in `SECURITY_REVIEW.md`.
