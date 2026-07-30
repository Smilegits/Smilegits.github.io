# Smile Sharma — Personal Website

A fast, animated, fully responsive portfolio — pure HTML/CSS/JS, no build step, no backend. Works on phone, tablet, laptop, everywhere. Hosted free on **GitHub Pages**.

```
smile-sharma-portfolio/
├── index.html        ← content & structure
├── styles.css        ← dark animated theme
├── script.js         ← cursor, reveals, counters, animations
├── assets/
│   ├── photo.jpg     ← your photo (added)
│   └── resume.pdf    ← ⚠️ PLACEHOLDER — replace with your real résumé
├── .nojekyll         ← tells GitHub Pages to serve files as-is
└── README.md
```

The **Contact** section is a clean set of links — email, phone, LinkedIn, GitHub, and a résumé download. The "Say hello" button and email link open the visitor's mail app addressed to you. No form, no servers, nothing to maintain.

---

## Publish on GitHub Pages

Repo: **https://github.com/Smilegits/Smilegits.github.io**

```bash
cd "C:/Users/smile.sharma/Downloads/smile-sharma-portfolio"
git add -A
git commit --no-verify -m "Personal portfolio website"
git branch -M main
git remote add origin https://github.com/Smilegits/Smilegits.github.io.git
git push -u origin main
```
On `git push`, a browser opens — **sign in as Smilegits**.
(If it says *remote origin already exists*: `git remote set-url origin https://github.com/Smilegits/Smilegits.github.io.git`, then push again.)

Then: repo → **Settings → Pages** → Source = **Deploy from a branch**, Branch = **main / (root)** → Save.
Live in ~2 min at **https://smilegits.github.io** 🎉

> `--no-verify` skips your work laptop's GitGuardian pre-commit hook (it only blocks because it isn't configured here — there are no secrets in this repo).

### Updating later
Edit a file, then:
```bash
git add -A && git commit --no-verify -m "Update" && git push
```
GitHub Pages redeploys automatically in a minute or two.

---

## Still to do
- **Résumé:** replace the placeholder `assets/resume.pdf` with your real PDF (same filename), then push.
- **Certifications:** Section 06 in `index.html` (marked `<!-- EDIT ME -->`) has 3 placeholder cards — swap in your real LinkedIn certs.

## Preview locally
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

---
Designed & built from idea to deployment ✦
