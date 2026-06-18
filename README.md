# The Guri Woodcraft — website (Jekyll on GitHub Pages)

Guriqbal Singh · bespoke carpentry & interiors · Jalandhar
**theguriwoodcraft.in** · +91 89071 80006 · gbunty77@yahoo.co.in

This site uses **Jekyll**, which GitHub Pages runs for you automatically. You
write simple text files and push them; GitHub builds the website. You never run
a build yourself. The big win: **header, footer, and menus live in ONE place
each** — change them once and every page updates.

---

## The one idea to understand

Pages don't repeat the header/footer. Instead:

- `_layouts/default.html` is the **shell** (header + footer + styles), used by every page.
- `_includes/header.html` and `_includes/footer.html` are the shared pieces.
- `_data/nav.yml` is the **single menu + translations file**.
- Your pages (`index.html`, `blog.html`, posts) contain **only their own content**;
  the shell wraps them automatically at build time.

So: edit the footer once in `_includes/footer.html` → it changes on every page.
Add a menu item once in `_data/nav.yml` → it appears in the header AND footer,
in all three languages, on every page. This is the scalable replacement for
copy-pasting.

## Folder map

```
_config.yml          site-wide settings: phone, email, Formspree id, social links
_data/nav.yml        THE menu + all UI translations (edit menus here)
_layouts/
  default.html       page shell (header/footer/CSS/JS) — rarely touched
  post.html          article shell
_includes/
  header.html        shared top nav (menu, language switch, theme toggle)
  footer.html        shared footer
index.html           homepage content (hero, work, services, contact…)
blog.html            auto-list of all articles
_posts/              ONE Markdown file per article (see below)
assets/
  css/site.css       all shared styles + light/dark theme variables
  js/site.js         theme + language + menu behaviour (every page)
  js/home.js         homepage-only: spotlight, slider, contact form
  img/  video/       your photos and videos go here
CNAME                your domain (already set)
robots.txt 404.html  housekeeping
```

## Going live (one time)

1. Create a GitHub repo. Upload **everything in `jekyll-site/`** to the repo root.
2. Repo **Settings ▸ Pages**: Source = `main` / root. GitHub detects Jekyll and builds.
3. Set custom domain `theguriwoodcraft.in`, tick **Enforce HTTPS**.
4. DNS at GoDaddy:
   ```
   A     @    185.199.108.153
   A     @    185.199.109.153
   A     @    185.199.110.153
   A     @    185.199.111.153
   CNAME www  <your-github-username>.github.io
   ```
   (Confirm these IPs in GitHub's current Pages docs.)

The **sitemap.xml is generated automatically** by the `jekyll-sitemap` plugin —
you never touch it. New pages and posts are added to it on every build.

## Everyday tasks

**Change phone / email / social links** → `_config.yml` (one place, used everywhere).

**Add or rename a menu item** → `_data/nav.yml`. Copy a block, fill `en/hi/pa`
labels and the `url`. Appears in header + footer automatically.

**Write a blog post** → copy `_posts/2026-06-18-why-revamp-beats-replace.md` to
`_posts/YYYY-MM-DD-your-title.md`, edit the title/date and the Markdown body.
It auto-appears in `/blog/`, the homepage teaser, and the sitemap. No menu edits.

**Add photos** → put files in `assets/img/`, then in `index.html` replace a
gallery `<div class="ph">…</div>` with `<img src="/assets/img/yourfile.jpg" alt="...">`.

**Hero before/after images** → set `BEFORE_IMG` and `AFTER_IMG` at the top of
`assets/js/home.js`. Use same-origin paths (files in this repo) or the
cursor-spotlight canvas mask is blocked by the browser.

**Add a video** → drop an `.mp4` in `assets/video/`, then in `index.html` remove
the `.video-ph` block and uncomment the `<video>` tag.

## Languages (English / Hindi / Punjabi)

Every visible string is written three times, tagged `data-lang="en|hi|pa"`. CSS
shows only the active language; the EN/हि/ਪੰ switch in the header sets it and
remembers the choice. **All Hindi/Punjabi text is machine-drafted — have a native
speaker check it before relying on it.** To fix a translation, edit that one
`data-lang` span (in `index.html`) or that one line in `_data/nav.yml`.

## Dark / light theme

First-time visitors get whatever their **device** is set to (auto). The toggle
in the header lets them switch, and the choice is remembered. All colours are
CSS variables in `assets/css/site.css` — the `:root` block is dark, the
`[data-theme="light"]` block is light. Change a brand colour once there.

## Contact form → your email

GitHub Pages can't send email (it only serves files), so the form uses
**Formspree** (free tier):
1. Sign up at https://formspree.io with gbunty77@yahoo.co.in
2. Create a form, copy its id (the part after `/f/`, e.g. `abcdwxyz`).
3. Put it in `_config.yml` → `formspree_id: "abcdwxyz"`.

Until then the form shows a "use WhatsApp/email" message; WhatsApp/email links
always work. A hidden honeypot field reduces spam.

## Security (honest scope)

- HTTPS by GitHub Pages (enforce in settings).
- A Content-Security-Policy `<meta>` in the layout limits what can load/run
  (this origin + Google Fonts + Formspree only). Add a service's domain there
  if you ever embed something new, or it'll be blocked.
- External links use `rel="noopener noreferrer"`.
- No secrets in the repo; a static site has no server credentials.
- **PQC note:** post-quantum security lives in the TLS handshake between the
  browser and GitHub's servers — a platform/transport property that **no HTML,
  CSS, or JS file can implement, add, or harden.** GitHub manages that layer. If
  you want PQC-hybrid transport you control, put Cloudflare in front of Pages and
  enable post-quantum there. Nothing in this repo can change it.

## Optional: preview locally (not required)

GitHub builds for you, so this is optional. If you ever want a local preview on a
machine with Ruby: `gem install bundler jekyll`, then `bundle install` and
`bundle exec jekyll serve`. On Termux this is possible but fiddly; pushing to
GitHub and viewing the live site is the simpler loop.
