# Himani's Birthday Site

5-step surprise page (teaser → name guess → trivia → reveal + gift + song → closing),
with name guesses, quiz answers, and gift pledges saved to a database via a Vercel
serverless function + Supabase.

## Deploy

### 1. Set up the database (Supabase)
1. Go to supabase.com → New project (free tier is fine).
2. Once it's created, open SQL Editor → paste the contents of `schema.sql` → Run.
3. Go to Project Settings → API. Copy the **Project URL** and the **service_role** key
   (not the anon key — the API route needs the service key to write data).

### 2. Push this folder to GitHub
```
git init
git add .
git commit -m "birthday site"
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

### 3. Deploy on Vercel
1. Go to vercel.com → Add New → Project → import the GitHub repo.
2. Framework preset: "Other" (it's a static site + serverless function, no build step needed).
3. Before deploying, add Environment Variables:
   - `SUPABASE_URL` = your project URL from step 1
   - `SUPABASE_SERVICE_KEY` = your service_role key from step 1
4. Click Deploy. Vercel will give you a live URL like `himani-birthday.vercel.app`.

That's it — `index.html` is served as the homepage, and `/api/track` (in the `api/`
folder) is auto-deployed as a serverless function, since Vercel treats any file
under `api/` as an endpoint.

### 4. Check it worked
Open the site, go through the flow, then in Supabase go to Table Editor →
`birthday_events` — you should see rows appear as people guess names, answer
trivia, and add themselves to the gift list.

## Notes
- If the `/api/track` call fails for any reason (e.g. you haven't deployed the
  backend yet), the page falls back to saving events in the visitor's own
  browser (`localStorage`) so it never breaks the experience — it just won't be
  shared across visitors until the backend is live.
- The birthday song is generated live with the Web Audio API (not an audio
  file), playing the well-known "Happy Birthday to You" melody, which is
  public domain in the US as of 2016.
- To add a custom domain, go to the Vercel project → Settings → Domains.
