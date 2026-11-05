import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const CREDENTIALS_FILE = path.join(process.cwd(), 'admin-credentials.md');
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'eaglesight-ultra-secure-secret-token-key-2026';

/**
 * Computes SHA-256 hash of a string.
 */
export function sha256(text) {
  return crypto.createHash('sha256').update(String(text)).digest('hex');
}

/**
 * Reads admin credentials directly from admin-credentials.md
 */
export async function getAdminCredentials() {
  try {
    const content = await fs.readFile(CREDENTIALS_FILE, 'utf-8');
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (match) {
      const meta = {};
      match[1].split(/\r?\n/).forEach((line) => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          let val = parts.slice(1).join(':').trim();
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.substring(1, val.length - 1);
          }
          meta[key] = val;
        }
      });
      return {
        username: meta.username || 'eaglesight_admin',
        password: meta.password || 'Eagle#Secure!2026$Investigate',
        passwordHash: meta.passwordHash || sha256('Eagle#Secure!2026$Investigate'),
        role: meta.role || 'SuperAdmin',
      };
    }
  } catch (err) {
    console.warn('Could not read admin-credentials.md, using defaults:', err.message);
  }

  return {
    username: process.env.ADMIN_USERNAME || 'eaglesight_admin',
    password: process.env.ADMIN_PASSWORD || 'Eagle#Secure!2026$Investigate',
    passwordHash: sha256(process.env.ADMIN_PASSWORD || 'Eagle#Secure!2026$Investigate'),
    role: 'SuperAdmin',
  };
}

/**
 * Writes updated credentials into admin-credentials.md
 */
export async function updateAdminCredentials(newUsername, newPassword) {
  const current = await getAdminCredentials();
  const uname = newUsername || current.username;
  const pass = newPassword || current.password;
  const hash = sha256(pass);
  const dateStr = new Date().toISOString();

  const md = `---
username: "${uname}"
password: "${pass}"
passwordHash: "${hash}"
role: "SuperAdmin"
updatedAt: "${dateStr}"
---

# Eaglesight Detective Services - Admin Access Credentials

> **Classification**: Confidential / Investigative Privilege  
> **Access Level**: Level 5 Master Clearance (ISO/IEC 27001:2022 Compliant)

---

## 1. Authorized Master Credentials
- **Username**: ${uname}
- **Password**: ${pass}
- **Role**: SuperAdmin (Full Investigative Privileges)
- **Last Modified**: ${new Date().toLocaleString('en-US', { timeZone: 'UTC', dateStyle: 'full', timeStyle: 'medium' })} (UTC)

---

## 2. Security Instructions
1. You can change the admin username and password directly inside this \`.md\` file, or through the \`/admin\` portal settings.
2. The system dynamically reads this file to authenticate \`/admin\` login requests.
3. Every password update automatically synchronizes the SHA-256 cryptographic hash.

---
*Maintained by Eaglesight Detective & Forensic Services Security Registry*
`;

  await fs.writeFile(CREDENTIALS_FILE, md, 'utf-8');
  return { username: uname, success: true };
}

/**
 * Validates admin credentials against admin-credentials.md
 */
export async function verifyCredentials(username, password) {
  if (!username || !password) return false;
  const creds = await getAdminCredentials();

  const usernameMatch = username === creds.username;
  const passwordMatch =
    password === creds.password ||
    sha256(password) === creds.passwordHash;

  return usernameMatch && passwordMatch;
}

/**
 * Creates a signed HMAC-SHA256 session token valid for 24 hours.
 */
export function createSessionToken(username) {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = JSON.stringify({ username, exp: expiresAt });
  const base64Payload = Buffer.from(payload).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(base64Payload)
    .digest('base64url');

  return `${base64Payload}.${signature}`;
}

/**
 * Verifies the signed session token.
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [base64Payload, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(base64Payload)
    .digest('base64url');

  if (signature !== expectedSignature) return false;

  try {
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf-8'));
    if (Date.now() > payload.exp) return false;
    return payload;
  } catch {
    return false;
  }
}
