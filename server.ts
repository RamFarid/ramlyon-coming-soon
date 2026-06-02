import express from "express";
import path from "path";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Security and middleware
app.use(helmet({ contentSecurityPolicy: false })); // Disabling CSP for Vite dev server compatibility
app.use(express.json());

// Middleware to prevent external API calls
const ensureFrontendRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const secFetchSite = req.headers['sec-fetch-site'];
  const referer = req.headers.referer;
  const host = req.headers.host;

  // Modern browsers send Sec-Fetch-Site
  if (secFetchSite && secFetchSite !== 'same-origin') {
    return res.status(403).json({ error: "Forbidden: API must be called from the frontend." });
  }

  // If no Sec-Fetch-Site and no referer, it's likely a direct request (e.g. cURL, Postman)
  if (!secFetchSite && !referer) {
    return res.status(403).json({ error: "Forbidden: Direct API access is not allowed." });
  }

  // If referer exists, it must match the host
  if (referer && host && !referer.includes(host)) {
    return res.status(403).json({ error: "Forbidden: Invalid origin." });
  }

  next();
};

// In-memory set to prevent multiple submissions from the same device (using server state)
// In a real app, this would be a database like Redis or PostgreSQL.
const submittedDevices = new Set<string>();

// Rate limiting setup
// Max 3 requests per IP every 15 minutes for the waitlist endpoint
const waitlistLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3, 
  message: { error: "Too many requests from this IP, please try again later." },
});

// Telegram Notification Endpoint
app.post("/api/waitlist", waitlistLimiter, ensureFrontendRequest, async (req, res) => {
  try {
    const { email, deviceId } = req.body;

    if (!email || !deviceId) {
      return res.status(400).json({ error: "Email and device ID are required" });
    }

    if (submittedDevices.has(deviceId)) {
      return res.status(409).json({ error: "This device has already joined the waitlist." });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("Telegram bot token or chat ID is missing. Request processed but not sent to Telegram.");
      // For the sake of UX, we still allow success if config is missing, but log a warning.
      submittedDevices.add(deviceId);
      return res.json({ success: true, message: "Added to waitlist" });
    }

    // Comprehensive Message Template
    const messageTemplate = `
🎉 <b>New Waitlist Signup!</b> 🎉

<b>Email Participant:</b>
<code>${email}</code>

<b>Meta Data:</b>
- <b>Device ID:</b> <code>${deviceId.slice(0,8)}...</code>
- <b>Time:</b> ${new Date().toISOString()}

#waitlist #signup #new_user
    `.trim();

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageTemplate,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (!data.ok) {
      console.error("Telegram API Error:", data);
      return res.status(500).json({ error: "Failed to process waitlist signup." });
    }

    submittedDevices.add(deviceId);
    res.json({ success: true, message: "Added to waitlist successfully" });
  } catch (error) {
    console.error("Waitlist error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

export default app
