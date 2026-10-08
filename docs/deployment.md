# Deployment

The repository includes a Render Blueprint for the production Node/Nitro target.

## Render

The current Blueprint is render.yaml.

It uses:

- Bun 1.4.2
- the Node/Nitro production preset
- bun run build
- node .output/server/index.mjs
- automatic deploys from main
- / as the health check
- VITE_SITE_URL as a required deployment variable for absolute canonical URLs and sitemap generation

Render supports Bun in its native runtime. Connect this GitHub repository to a Render Web Service and apply the Blueprint.

After the first deployment, copy the public Render hostname into VITE_SITE_URL and redeploy. The build will then generate public/sitemap.xml from the current published canonical records.

## Local production smoke test

~~~bash
bun install --frozen-lockfile
NITRO_PRESET=node-server bun run build
bun run start
~~~

Then verify:

- /
- /search?q=vidyapati
- /research
- /api/archive
- one canonical record URL
- /sitemap.xml

## Production environment

Do not commit secrets.

VITE_SITE_URL is public configuration and may be embedded into page metadata. It should be the final HTTPS origin without a trailing slash.

## Important deployment boundary

The repository contains deployment configuration, but an external hosting account still has to authorize access to the GitHub repository and create the service. That account-level action cannot be encoded safely into Git history.
