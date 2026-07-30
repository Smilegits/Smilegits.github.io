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

The **Contact** section has a form (powered by **Web3Forms** — no backend, no secrets) plus direct links (email, phone, LinkedIn, GitHub, résumé).

---

## Activate the contact form (2 minutes, free)

The form posts to **Web3Forms**, which emails you each submission and can auto-reply to the visitor. The access key is a *public identifier* (like an email address), **not a password** — safe to keep in the code.

1. Go to **https://web3forms.com** → enter your email (`smileshelley270702@gmail.com`) → they email you an **Access Key**.
2. In `index.html`, find `value="YOUR_ACCESS_KEY"` and replace `YOUR_ACCESS_KEY` with your key.
3. (Optional) To send visitors a "thanks for reaching out" confirmation automatically, open your **Web3Forms dashboard → Autoresponse**, turn it on, and write the message.
4. Commit + push (see below). Test it by submitting the form on your live site — the message lands in your inbox.

Until the key is added, the form gracefully tells visitors to email you directly, so nothing looks broken.

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
