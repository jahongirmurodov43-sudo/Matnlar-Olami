# Matnlar Olami — With Admin Panel (Decap CMS)

This version of your site has an admin panel where you and your editors can add/edit/delete stories through a friendly form. Changes are saved permanently to your GitHub repo and the live site updates within ~60 seconds.

---

## ⚡ Quick overview

- **Public site** → `your-site.netlify.app/` (anyone can view)
- **Admin panel** → `your-site.netlify.app/admin` (only authorized editors can use it)
- **Storage** → GitHub repo (each story is a separate `.md` file)
- **Login** → GitHub OAuth (editors need a free GitHub account)

---

## 📁 Project structure

```
matnlar-olami/
├── content/                 # ⭐ ALL CONTENT LIVES HERE
│   ├── classes.json         # Defines classes & quarters
│   └── stories/             # Each story is one .md file
│       ├── 1-q1-s1-vatan-motabar.md
│       ├── 2-q1-s6-ilmsizlik-zulmati.md
│       └── ... (31 stories total)
├── public/
│   └── admin/               # The admin panel UI
│       ├── index.html
│       └── config.yml       # Admin panel configuration
├── scripts/
│   └── build-data.js        # Compiles .md → stories.json at build time
├── src/                     # The React app (same as before)
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── data/                # stories.json is auto-generated here
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── netlify.toml
├── package.json
└── vite.config.js
```

---

## 🚀 Setup — Step by step

### Step 1 — Upload files to GitHub

1. Delete everything from your `Project_for_mansur` repo (keep the README if you want)
2. Upload all the contents of this folder (drag-drop or GitHub Desktop)
3. **Important:** Open `public/admin/config.yml` on GitHub and change line 3 to your actual repo:
   ```yaml
   repo: jahongirmurodov43-sudo/Project_for_mansur
   ```
   If your GitHub username is different, change it!
4. Commit

Netlify will auto-build. Visit your site — it should look identical to before. **The admin panel won't work yet** — that needs the next steps.

### Step 2 — Make your GitHub repo public (if it isn't)

Decap CMS uses GitHub's API. For free OAuth access through Netlify, your repo needs to be **Public**.

1. GitHub repo → Settings → scroll to bottom → "Change repository visibility"
2. Make it Public

### Step 3 — Set up GitHub OAuth on Netlify

This is the part that lets editors log in.

1. Go to your Netlify dashboard
2. Click on your project (`gregarious-gelato-4fc18c` or whatever you renamed it)
3. In the left sidebar, click **Project configuration**
4. Find the section called **Access & security** → **OAuth** (it may also be under "Integrations" or "Build & deploy")
5. Click **Install provider** → choose **GitHub**
6. Click **Authorize** — this opens GitHub asking permission for Netlify to act as the OAuth proxy
7. Accept

If you can't find "OAuth" in Netlify, search Netlify docs for "OAuth provider GitHub" — the UI sometimes moves. The end goal is: Netlify should know how to handle GitHub OAuth requests for your site.

### Step 4 — Test the admin panel

1. Go to `your-site.netlify.app/admin`
2. You should see a "Login with GitHub" button
3. Click it, sign in with your GitHub account
4. You're in! You should see a list of all 31 existing stories.

### Step 5 — Invite your friend & other editors

For your friend to use the admin:

1. He needs a free GitHub account → [github.com/signup](https://github.com/signup)
2. You add him as a collaborator on the repo:
   - GitHub repo → Settings → Collaborators → Add people
   - Type his GitHub username, send invite
3. He accepts the invite
4. He can now go to `your-site.netlify.app/admin` and log in with his GitHub account

**Repeat for any other editor.** Up to ~3 collaborators is fine on the free GitHub plan.

---

## ✍ How to use the admin panel

### Adding a new story

1. Go to `/admin` → click **Login with GitHub**
2. In the left sidebar, click **Matnlar**
3. Click **New Matn** (top right)
4. Fill in:
   - **Matn nomi** — the title
   - **Sinf** — pick a class
   - **Chorak** — pick a quarter
   - **Tartib raqami** — what order it appears (1 = first in the quarter)
   - **Namunaviy savollar** — click + to add questions
   - **Matn matni** — the actual story text
5. Click **Publish → Publish now**
6. Wait ~60 seconds. Refresh the public site — the story is live.

### Editing an existing story

1. In the admin, click on the story you want to change
2. Edit any field
3. Click **Publish → Publish now**

### Deleting a story

1. Click the story
2. In the top-right menu (three dots), click **Delete entry**

---

## 🖥 Run locally (optional)

If you want to test changes on your computer first:

1. Install [Node.js](https://nodejs.org) (LTS version)
2. Open this folder in a terminal
3. `npm install` (first time only)
4. `npm run dev`
5. Open `http://localhost:5173`

The admin panel at `localhost:5173/admin` won't work locally (it needs the Netlify OAuth proxy). Test the admin only on the deployed site.

---

## 🐛 Troubleshooting

### "Config Errors" when opening /admin
The `config.yml` has the wrong repo path. Edit `public/admin/config.yml` and make sure the `repo:` line matches your GitHub username/repo exactly.

### Build fails on Netlify
Most often this means a `.md` file has bad YAML in the frontmatter (the top section between `---` lines). Check the file mentioned in the error — usually a missing quote or special character.

### Login button does nothing
Make sure Step 3 (Netlify OAuth provider for GitHub) is fully completed. Try clicking the login button again — sometimes the popup is blocked.

### Editor can log in but can't save
The editor isn't a collaborator on the GitHub repo. Add them via repo Settings → Collaborators.

### "Your site doesn't have Identity enabled" error
You're seeing instructions for the old Netlify Identity method. This project uses **GitHub OAuth** instead, which doesn't need Netlify Identity. Make sure you followed Step 3 above (OAuth provider, not Identity).

---

## ⚠ Important notes

### About browser storage (localStorage)
The "Add story" button on the **public site** still exists and still saves to localStorage. That's the OLD behavior — those changes are NOT permanent and NOT shared. For permanent changes, **use the admin panel at /admin instead**.

You may want to remove those buttons later to avoid confusion. Let me know if you want to do that.

### Drafts vs instant publish
Right now, the config is set to `publish_mode: simple` — every save goes live immediately. If you want a draft-then-review workflow (editors create drafts, you approve before publishing), change that line in `config.yml` to `publish_mode: editorial_workflow`.

### Backup
Since all content is just `.md` files in GitHub, you have full version history. You can revert any bad change with one click via the GitHub commits page.

---

Good luck! When this is set up, you'll have a properly collaborative site that works exactly like the professional content-managed sites (BBC, Smashing Magazine, etc.) — same approach, just smaller scale.
