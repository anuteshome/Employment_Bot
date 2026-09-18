# Telegram Mini App ↔ FastAPI Backend Connection Guide

This guide explains the end-to-end integration between the **Telegram Bot**, **Frontend Mini App**, and **FastAPI Backend**, including authentication flows, API helper patterns, and local development tunneling.

---

## 🏗️ 3-Tier Architecture Overview

```text
┌─────────────────────────┐       1. Opens Mini App       ┌─────────────────────────┐
│  Telegram Client App    ├──────────────────────────────►│ Telegram Mini App (UI)  │
│  (Mobile / Desktop / Web)│                               │  (React / HTML5 App)    │
└────────────┬────────────┘                               └────────────┬────────────┘
             │                                                         │
             │ 2. Signs user identity with BOT_TOKEN                   │ 3. Passes initData string
             │    into window.Telegram.WebApp.initData                 │    in API HTTP request
             ▼                                                         ▼
┌─────────────────────────┐   4. Verifies HMAC signature   ┌─────────────────────────┐
│   Telegram BotFather    │◄──────────────────────────────┤   FastAPI Backend API   │
│ (Bot Token registered)  │   & issues JWT Bearer Token    │ (Python 3.11+ / Postgres)│
└─────────────────────────┘                               └─────────────────────────┘
```

---

## 1. Telegram Bot ↔ Frontend Connection

When a user opens your bot inside Telegram and clicks the Menu Button or WebApp link:

### 1.1 Bot Menu Config in @BotFather
1. Open `@BotFather` in Telegram.
2. Select `/mybots` -> Choose your bot -> **Bot Settings** -> **Menu Button** / **Web App**.
3. Set your Frontend WebApp URL (e.g., `https://your-domain.com` or local tunnel `https://xxxx.ngrok-free.app` for local development).

### 1.2 Telegram WebApp SDK in Frontend
In `frontend/index.html`, load Telegram's WebApp JS script:
```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

In your React / JS code (`frontend/src/App.tsx` or main component):
```javascript
// Expand WebApp to full screen view
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

// Extract user initialization query string signed by Telegram
const rawInitData = window.Telegram.WebApp.initData;
```

---

## 2. Frontend ↔ Backend API Connection

Once the frontend retrieves `window.Telegram.WebApp.initData`, it connects to the FastAPI backend via a two-phase process:

### Phase A: Login & Token Exchange (`POST /api/v1/auth/telegram`)
The frontend sends `initData` to the FastAPI backend on initial load:

```typescript
// frontend/src/services/authService.ts

export async function loginWithTelegram() {
  const initData = window.Telegram.WebApp.initData;

  const response = await fetch("http://localhost:8000/api/v1/auth/telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ init_data: initData }),
  });

  const data = await response.json();

  if (response.ok) {
    // Store JWT access token in memory or localStorage
    localStorage.setItem("access_token", data.access_token);
    return data.user; // Contains id, role, status, has_employee_profile, has_employer_profile
  } else {
    console.error("Authentication failed:", data.detail);
    throw new Error(data.detail);
  }
}
```

### Phase B: Authenticated API Calls (`Authorization: Bearer <token>`)
All subsequent API calls attach the JWT token in the `Authorization` header:

```typescript
// frontend/src/services/apiClient.ts

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  return response.json();
}

// Example: Fetch logged-in user profile summary
export async function getCurrentUser() {
  return fetchWithAuth("http://localhost:8000/api/v1/users/me");
}
```

---

## 3. Local Development & Tunneling Setup

Telegram Mini Apps require an HTTPS URL. For local development, you can tunnel your local frontend dev server using **ngrok**:

1. Run your frontend dev server locally (e.g., `http://localhost:5173`).
2. Run ngrok in a separate terminal:
   ```bash
   npx ngrok http 5173
   ```
3. Copy the generated HTTPS URL (e.g. `https://xxxx.ngrok-free.app`) and paste it into `@BotFather` as your WebApp URL!

---

## 4. Integration Workflow for Frontend Components

When adding your frontend views:
1. **App Mount**: Run `loginWithTelegram()` to authenticate with the backend and retrieve user profile flags.
2. **Onboarding Flow**:
   - If `has_employee_profile == false`: Redirect candidate user to Employee Profile Wizard (`POST /api/v1/employees/profile`).
   - If `has_employer_profile == false`: Redirect business user to Employer Verification Wizard (`POST /api/v1/employers/profile`).
3. **Document Uploads**: Request presigned URLs from `/api/v1/documents/upload-url` and upload directly to object storage.
