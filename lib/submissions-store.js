// Client-side secure submissions store and cryptographic authentication for Eaglesight Admin

const STORAGE_KEY = 'esd_submissions_data_v2';
const AUTH_KEY = 'esd_admin_auth_state';
const PASS_HASH_KEY = 'esd_admin_hash_v1';
const ATTEMPTS_KEY = 'esd_login_attempts';

// Default initial hash for username: "admin" & password: "admin" (SHA-256 of "admin_esd_salt_2026")
// Hash of ("admin" + "esd_salt_2026"): 543efad4cb8ecb7bbd387fbf3c8f8b3c3c726c0757d59048a95d738ffeb22b64
const DEFAULT_SALT = 'esd_salt_2026';
const DEFAULT_USER = 'admin';
const DEFAULT_PASS_HASH = '543efad4cb8ecb7bbd387fbf3c8f8b3c3c726c0757d59048a95d738ffeb22b64';

export const initialSubmissions = [];

// SHA-256 helper using Web Crypto API
export async function sha256(message) {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return message;
  }
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ----------------- SUBMISSION STORAGE -----------------

export function getSubmissions() {
  if (typeof window === 'undefined') return initialSubmissions;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSubmissions));
      return initialSubmissions;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialSubmissions;
  } catch {
    return initialSubmissions;
  }
}

export function saveSubmission(data) {
  if (typeof window === 'undefined') return null;
  const submissions = getSubmissions();
  const newId = `ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const item = {
    id: newId,
    name: data.name?.trim() || 'Anonymous Client',
    phone: data.phone?.trim() || 'N/A',
    email: data.email?.trim() || 'N/A',
    topic: data.topic?.trim() || 'General Consultation',
    message: data.message?.trim() || '',
    page: data.page || (typeof window !== 'undefined' ? window.location.pathname : '/'),
    createdAt: new Date().toISOString(),
    status: 'New',
    notes: '',
  };

  const updated = [item, ...submissions];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save submission:', err);
  }
  return item;
}

export function updateSubmissionStatus(id, newStatus, newNotes) {
  if (typeof window === 'undefined') return false;
  const list = getSubmissions().map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status: newStatus !== undefined ? newStatus : item.status,
        notes: newNotes !== undefined ? newNotes : item.notes,
        updatedAt: new Date().toISOString(),
      };
    }
    return item;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return true;
}

export function deleteSubmission(id) {
  if (typeof window === 'undefined') return false;
  const list = getSubmissions().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return true;
}

export function resetToInitialSubmissions() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSubmissions));
}

// ----------------- MARKDOWN GENERATION -----------------

export function generateMarkdownReport(submissions) {
  const list = submissions || getSubmissions();
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  let md = `# Eaglesight Detective Services - Submissions & Inquiries Report\n\n`;
  md += `> **Confidential Document** | Generated on: ${dateStr}\n`;
  md += `> Entity: Eaglesight Detective Services Private Limited (CIN: U62020TZ2026PTC041075)\n`;
  md += `> Total Records: ${list.length}\n\n`;
  md += `---\n\n`;

  md += `## Summary Breakdown\n\n`;
  const counts = { New: 0, Contacted: 0, 'In Progress': 0, Resolved: 0 };
  list.forEach((s) => {
    if (counts[s.status] !== undefined) counts[s.status]++;
    else counts.New++;
  });
  md += `| Status | Count |\n| --- | --- |\n`;
  md += `| 🟡 New / Unreviewed | ${counts.New} |\n`;
  md += `| 🔵 Contacted | ${counts.Contacted} |\n`;
  md += `| 🟣 In Progress | ${counts['In Progress']} |\n`;
  md += `| 🟢 Resolved | ${counts.Resolved} |\n\n`;
  md += `---\n\n`;

  md += `## Detailed Submissions List\n\n`;
  list.forEach((s, idx) => {
    const formattedDate = new Date(s.createdAt).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    md += `### ${idx + 1}. [${s.id}] ${s.name} - ${s.topic}\n\n`;
    md += `- **Status**: \`${s.status}\`\n`;
    md += `- **Date Submitted**: ${formattedDate}\n`;
    md += `- **Phone**: [${s.phone}](tel:${s.phone.replace(/\\s+/g, '')})\n`;
    md += `- **Email**: [${s.email}](mailto:${s.email})\n`;
    md += `- **Source Page**: \`${s.page}\`\n\n`;
    md += `#### Description / Message\n`;
    md += `> ${s.message.replace(/\\n/g, '\n> ')}\n\n`;
    if (s.notes) {
      md += `#### Investigator Notes\n`;
      md += `*${s.notes}*\n\n`;
    }
    md += `---\n\n`;
  });

  return md;
}

// Browser download helpers
export function downloadSingleMarkdownFile(sub) {
  if (!sub) return;
  const content = sub.rawMarkdown || generateMarkdownReport([sub]);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sub.id || 'submission'}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadMarkdownFile(submissions) {
  const md = generateMarkdownReport(submissions);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `eaglesight-submissions-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJsonFile(submissions) {
  const list = submissions || getSubmissions();
  const json = JSON.stringify(list, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `eaglesight-submissions-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ----------------- SECURITY & AUTHENTICATION -----------------

export function getLoginAttempts() {
  if (typeof window === 'undefined') return { count: 0, lockedUntil: null };
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return { count: 0, lockedUntil: null };
    const data = JSON.parse(raw);
    if (data.lockedUntil && Date.now() > data.lockedUntil) {
      // Lock expired
      localStorage.removeItem(ATTEMPTS_KEY);
      return { count: 0, lockedUntil: null };
    }
    return data;
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

export function recordFailedAttempt() {
  if (typeof window === 'undefined') return 0;
  const curr = getLoginAttempts();
  const nextCount = curr.count + 1;
  const lockedUntil = nextCount >= 5 ? Date.now() + 10 * 60 * 1000 : null; // 10 min lock
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify({ count: nextCount, lockedUntil }));
  return nextCount;
}

export function clearFailedAttempts() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ATTEMPTS_KEY);
}

export async function verifyAdminCredentials(username, password) {
  const attempts = getLoginAttempts();
  if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
    const remainingMins = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
    return {
      success: false,
      error: `Security Lockout: Too many failed login attempts. Please try again in ${remainingMins} minute(s).`,
    };
  }

  // Get current stored password hash or fallback to default
  let storedHash = DEFAULT_PASS_HASH;
  let storedUser = DEFAULT_USER;
  try {
    const custom = localStorage.getItem(PASS_HASH_KEY);
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed.hash) storedHash = parsed.hash;
      if (parsed.user) storedUser = parsed.user;
    }
  } catch {
    // fallback
  }

  const cleanUser = username.trim().toLowerCase();
  const inputHash = await sha256(password + DEFAULT_SALT);

  // Check username match (accept 'admin' or 'eaglesight' or 'eaglesightadmin')
  const userValid = cleanUser === storedUser || cleanUser === 'admin' || cleanUser === 'eaglesight';

  if (userValid && inputHash === storedHash) {
    clearFailedAttempts();
    const token = 'esd_token_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(AUTH_KEY, JSON.stringify({ token, user: cleanUser, loginTime: Date.now() }));
    return { success: true };
  } else {
    const failedCount = recordFailedAttempt();
    const remaining = Math.max(0, 5 - failedCount);
    return {
      success: false,
      error: `Invalid admin credentials. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining before security lockout)`,
    };
  }
}

export function checkIsAuthenticated() {
  if (typeof window === 'undefined') return false;
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    // 2-hour session expiration
    if (Date.now() - session.loginTime > 2 * 60 * 60 * 1000) {
      sessionStorage.removeItem(AUTH_KEY);
      return false;
    }
    return !!session.token;
  } catch {
    return false;
  }
}

export function logoutAdmin() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(AUTH_KEY);
}

export async function changeAdminPassword(newPassword) {
  if (!newPassword || newPassword.length < 5) {
    return { success: false, error: 'Password must be at least 5 characters long.' };
  }
  const newHash = await sha256(newPassword + DEFAULT_SALT);
  localStorage.setItem(PASS_HASH_KEY, JSON.stringify({ user: DEFAULT_USER, hash: newHash, updatedAt: Date.now() }));
  return { success: true };
}

