// Vercel Serverless Function: POST /api/contact
// - Validates the submission
// - Stores it in MongoDB Atlas (collection "contacts")
// - Emails the visitor an auto-reply with their details
// - Notifies Smile of the new message
//
// Required environment variables (set them in Vercel → Project → Settings → Environment Variables):
//   MONGODB_URI          your MongoDB Atlas connection string
//   MONGODB_DB           database name (e.g. "portfolio")   [optional, defaults to "portfolio"]
//   GMAIL_USER           the Gmail address that sends mail (e.g. smileshelley270702@gmail.com)
//   GMAIL_APP_PASSWORD   16-char Gmail App Password (NOT your normal password)
//   NOTIFY_EMAIL         where to receive new-contact alerts [optional, defaults to GMAIL_USER]
//   ALLOWED_ORIGIN       your site origin, e.g. https://smilegits.github.io  [optional, defaults to *]

const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");

// Reuse the Mongo connection across warm invocations
let cachedClient = null;
async function getDb() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI, { maxPoolSize: 3 });
    await cachedClient.connect();
  }
  return cachedClient.db(process.env.MONGODB_DB || "portfolio");
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function autoReplyHtml(doc) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#1a1a2e">
    <div style="background:linear-gradient(120deg,#7c5cff,#ff5ca8,#24d0c4);padding:28px 24px;border-radius:14px 14px 0 0;color:#fff">
      <h1 style="margin:0;font-size:22px">Thanks for reaching out! 👋</h1>
    </div>
    <div style="border:1px solid #eee;border-top:none;border-radius:0 0 14px 14px;padding:24px">
      <p>Hi ${esc(doc.name)},</p>
      <p>Thanks for getting in touch through my portfolio. I've received your message and
         <strong>Smile will get to know about you</strong> and reply personally soon.</p>
      <p style="margin-bottom:8px"><strong>Here are the details you entered:</strong></p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#666;width:120px">Name</td><td style="padding:8px 0">${esc(doc.name)}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0">${esc(doc.email)}</td></tr>
        ${doc.message ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top">About you</td><td style="padding:8px 0">${esc(doc.message)}</td></tr>` : ""}
        ${doc.question ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top">Your question</td><td style="padding:8px 0">${esc(doc.question)}</td></tr>` : ""}
      </table>
      <p style="margin-top:20px">Talk soon,<br/><strong>Smile Sharma</strong><br/>
        <span style="color:#888;font-size:13px">Software Engineer · AI / GenAI Builder</span></p>
    </div>
    <p style="text-align:center;color:#aaa;font-size:12px;margin-top:14px">This is an automated confirmation from smilegits.github.io</p>
  </div>`;
}

function notifyHtml(doc) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;color:#1a1a2e">
    <h2 style="color:#7c5cff">📬 New contact from your portfolio</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:6px 0;color:#666;width:120px">Name</td><td>${esc(doc.name)}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Email</td><td>${esc(doc.email)}</td></tr>
      ${doc.message ? `<tr><td style="padding:6px 0;color:#666;vertical-align:top">About</td><td>${esc(doc.message)}</td></tr>` : ""}
      ${doc.question ? `<tr><td style="padding:6px 0;color:#666;vertical-align:top">Question</td><td>${esc(doc.question)}</td></tr>` : ""}
      <tr><td style="padding:6px 0;color:#666">When</td><td>${esc(doc.createdAt.toISOString())}</td></tr>
    </table>
    <p style="color:#888;font-size:13px">Just hit reply to respond directly to ${esc(doc.name)}.</p>
  </div>`;
}

module.exports = async (req, res) => {
  // ---- CORS ----
  const origin = process.env.ALLOWED_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const message = (body.message || "").trim();
    const question = (body.question || "").trim();

    if (body._gotcha) return res.status(200).json({ ok: true }); // bot honeypot
    if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: "A valid name and email are required." });
    }

    const doc = {
      name, email, message, question,
      createdAt: new Date(),
      ip: req.headers["x-forwarded-for"] || null,
      userAgent: req.headers["user-agent"] || null
    };

    // ---- Store in MongoDB ----
    const db = await getDb();
    await db.collection("contacts").insertOne(doc);

    // ---- Send emails (auto-reply + notify) ----
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
      });

      await Promise.all([
        transporter.sendMail({
          from: `"Smile Sharma" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: "Thanks for reaching out! 👋",
          html: autoReplyHtml(doc)
        }),
        transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
          to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
          replyTo: email,
          subject: `New portfolio contact: ${name}`,
          html: notifyHtml(doc)
        })
      ]);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};
