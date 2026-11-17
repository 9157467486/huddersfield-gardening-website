# Huddersfield Gardening — GitHub + Vercel deployment

This folder is the static Vercel deployment version of the website.

## Deploy with GitHub
1. Create a new GitHub repository named `huddersfield-gardening-website`.
2. Upload the CONTENTS of this folder (index.html, styles.css, script.js, gallery.json, assets/) to the repository root.
3. Commit the files to the `main` branch.

## Deploy with Vercel
1. Sign in at https://vercel.com and choose Add New → Project.
2. Import `huddersfield-gardening-website` from GitHub.
3. Framework Preset: Other.
4. Root Directory: `./` (repository root).
5. Leave Build Command and Output Directory empty.
6. Click Deploy.

Every push to `main` will trigger a new deployment.

## Important backend note
This Vercel package is a static deployment. The website's gallery and browser-based rule-based chatbot work. The quote form opens a pre-filled WhatsApp message to +44 7971 312070. The local Express + SQLite enquiry API from the full-stack development copy is not included because Vercel's serverless filesystem is not suitable for a persistent SQLite database. If you need stored enquiries in a database, connect a hosted database (for example, Neon/Postgres or Supabase) and a serverless API, or host the existing full-stack Express + SQLite version on a persistent Node.js host.

## Test
Open `index.html` locally in a browser to inspect the static page. For local testing with Node, you can use `npx serve .`.
