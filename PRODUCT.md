# Product scope

Record Review Mobile displays public Airtable Record review interfaces on mobile browsers.

## Included

- User-supplied public interface links
- Separate list and detail views
- Display zoom, refresh and share links
- Korean and English menus
- Browser-local language and display preferences

No default interface, account system, payment system, analytics integration, API credential store or record database is included. The source content remains on Airtable and retains its original access controls. URL validation checks the address format; Airtable determines whether a share link can actually be accessed.

## Before broader release

- Test several independent public interfaces and mobile browsers.
- Improve feedback for failed, revoked or blocked embeds.
- Address the remaining privacy and hosting controls in `SECURITY_REVIEW.md`.
- Verify the Android prototype separately before distributing an app.
