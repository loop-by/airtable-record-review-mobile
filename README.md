# Record Review Mobile

A mobile wrapper for public Airtable Record review interfaces, with Korean and English menus.

## Use

1. Open the home page and paste a public Record review link.
2. Choose a record in **List**, then switch to **Details**.
3. Adjust display zoom and copy a share link in **Settings**.

There is no default interface. Opening `/reader` or `/reader.html` without `url` returns to the link input page. A supplied URL uses this format:

```text
https://example.invalid/reader?url=https%3A%2F%2Fairtable.com%2FappABCDEFGHIJKLMN%2FshrABCDEFGHIJKLMN
```

The IDs above are synthetic examples. Only HTTPS Airtable public-share URL formats are accepted. Content loads directly from Airtable through its official embed page. The wrapper does not copy records into a separate database or grant access to private content.

## Local development

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
node --test source-url.test.mjs
```

Open `http://127.0.0.1:4173/`. No dependencies or build step are required.

## GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` publishes `dist/` to GitHub Pages whenever a commit reaches `main`. In the repository's Pages settings, set the build and deployment source to **GitHub Actions**. The deployment adjusts the web app manifest paths for either a project-site URL or a custom domain.

## Files

- `dist/`: static website
- `source-url.test.mjs`: URL handling tests, using synthetic data
- `experiments/`: optional layout experiments
- `PRODUCT.md`, `VERIFICATION.md`, `SECURITY_REVIEW.md`: scope, verification and security notes
- `.openai/hosting.example.json`: generic static-hosting example

Personal deployment configuration is excluded from the GitHub source snapshot. API keys, credentials and real interface URLs do not belong in the repository.

## Limits

The layout assumes a 360px record-list sidebar. Other Airtable layouts may need changes. The wrapper cannot inspect the cross-origin iframe or automatically detect record selection. Users must switch to Details after choosing a record. Mobile-browser compatibility still needs testing on real devices.

The wrapper is independent of Airtable. See `SECURITY_REVIEW.md` before operating it for other users.
