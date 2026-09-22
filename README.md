# MK Career Guidance Website

A 5-page career-guidance website for **Madhankumar Career Guidance** (Home, About,
After 12th, College & Admissions, Contact) built with plain **HTML + CSS + JS** —
no build tools needed. Includes a notification popup, scroll animations, a
chatbot widget, a contact form, and an admin panel.

## What's inside

```
mk-career/
├── index.html              Home
├── about.html               About Madhankumar
├── after-12th.html          After 12th career guidance
├── college-admissions.html  College & admission guidance
├── contact.html             Contact + booking form
├── css/style.css            All styling (colors, layout, animation)
├── js/script.js             Nav menu, scroll animation, notification popup
├── js/chatbot.js            Chatbot widget (email capture + Q&A)
├── js/admin.js               Admin login + dashboard logic
├── admin/login.html         Admin login page
├── admin/dashboard.html     Admin dashboard (view leads/contacts/logins)
└── backend/                 OPTIONAL real database backend (Node + MySQL)
```

## 1. See it locally

No install needed — just open `index.html` in your browser. Or, for the
chatbot/forms to behave exactly like a real server (recommended), run a
tiny local server from this folder:

```
npx serve .
```

then open the URL it prints.

## 2. Upload to GitHub

```
cd mk-career
git init
git add .
git commit -m "MK Career Guidance website"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### Turn it into a live website (GitHub Pages) — free, no server needed
1. On GitHub, open your repo → **Settings → Pages**.
2. Under "Build and deployment", choose **Deploy from a branch**, branch
   `main`, folder `/ (root)`. Save.
3. After ~1 minute your site is live at
   `https://<your-username>.github.io/<your-repo>/`.

GitHub Pages only serves static files (HTML/CSS/JS) — that's all this
frontend needs. It **cannot** run MySQL or Node.js — see the note below.

## 3. Important — about MySQL / the database

You asked for MySQL for admin login and user tracking. Two honest points:

- **GitHub Pages (or any plain HTML/JS host) cannot run MySQL.** MySQL is a
  server-side database; it needs an actual server process running
  somewhere, which static hosting doesn't provide.
- So the site ships in **two layers**:
  1. **Working demo right now**: the admin panel (`admin/login.html` →
     `admin/dashboard.html`) and the chatbot/contact form store their data
     in the browser's `localStorage`. This works immediately, needs zero
     setup, and is enough to try everything out — but the data stays only
     on that one browser/device, and isn't secure for real passwords.
  2. **Real backend (optional, in `backend/`)**: a small Node.js + Express
     + MySQL API that does this properly — hashed admin passwords, a
     shared MySQL database, login history. See `backend/README` below.
     Deploy it to a Node-friendly host like **Render**, **Railway**, or
     **Hostinger Node hosting** (GitHub Pages can't run it). Once it's
     live, you can point the frontend at its URL to replace the
     `localStorage` calls with real API calls — ask if you'd like this
     wiring done.

### Running the optional backend
```
cd backend
npm install
cp .env.example .env      # then fill in your MySQL details
mysql -u root -p < schema.sql
node create-admin.js admin YourStrongPassword
node server.js
```

## 4. Chatbot — sending real emails to mk@gmail.com

Plain HTML/JS can't send emails on its own (no mail server). The chatbot
already saves every registration + message to the (demo or real) database.
To also get an actual email in your inbox when someone registers:

1. Create a free account at **https://www.emailjs.com**
2. Add an **Email Service** connected to `mk@gmail.com`.
3. Create an **Email Template** using variables `{{from_email}}` and
   `{{message}}`.
4. Open `js/chatbot.js` and fill in the three IDs near the top:
   ```js
   var EMAILJS_PUBLIC_KEY  = "...";
   var EMAILJS_SERVICE_ID  = "...";
   var EMAILJS_TEMPLATE_ID = "...";
   ```
   Until you do this, the chatbot still works fully — it just skips the
   email step.

## 5. Things to personalise before going live

- Replace the placeholder in `about.html` with Madhankumar's real photo
  (`images/madhankumar.jpg`).
- Update the YouTube channel link/embed IDs in `index.html`.
- Update phone/email/address in every page's footer if they change.
- Change the demo admin password in `js/admin.js` (or set up the real
  backend for a secure login).
- Swap the Unsplash stock photos for your own images if you have them.

## 6. Notification popup & scroll animation

- The bottom-left toast ("2026 Admission Guidance is open!") appears a
  couple of seconds after page load, once per browser session — edit its
  text directly in each page's `<div class="mk-toast">` block.
- Sections fade up into view as you scroll, powered by `.reveal` classes
  in `js/script.js` — add the `reveal` class to any new block you add.
