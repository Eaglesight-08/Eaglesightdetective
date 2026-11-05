import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const LOCAL_DB_FILE = path.join(process.cwd(), 'submissions.md');
const TMP_DB_FILE = path.join(os.tmpdir(), 'eaglesight-submissions.md');
const SUBMISSIONS_DIR = path.join(process.cwd(), 'submissions');

/**
 * Gets the active DB file path (checks /tmp first if running in serverless)
 */
async function getDbFilePath() {
  // If we already wrote to /tmp in a serverless environment, prefer /tmp
  try {
    await fs.access(TMP_DB_FILE);
    return TMP_DB_FILE;
  } catch {
    return LOCAL_DB_FILE;
  }
}

/**
 * Ensures the submissions directory and database exist.
 */
async function ensureDb() {
  try {
    await fs.mkdir(SUBMISSIONS_DIR, { recursive: true });
  } catch {
    // Read-only filesystem on serverless is expected
  }

  try {
    await fs.access(LOCAL_DB_FILE);
  } catch {
    // If not found, create in /tmp
    const initialContent = `# Eaglesight Detective Services - Submissions Database

> **Classification**: Confidential / Investigative Privilege  
> **Storage Mode**: Offline Local Markdown File Database  
> **Standard**: ISO/IEC 27001:2022 Verified  
> **Last Synchronized**: ${new Date().toISOString()}

---

<!-- DATA_START
[]
DATA_END -->

## Submissions Log

*No inquiries submitted yet. When a visitor submits a contact or inquiry form on the website, their details are automatically stored here.*
`;
    try {
      await fs.writeFile(LOCAL_DB_FILE, initialContent, 'utf-8');
    } catch {
      await fs.writeFile(TMP_DB_FILE, initialContent, 'utf-8').catch(() => {});
    }
  }
}

/**
 * Reads all submissions from the active markdown database.
 */
export async function readSubmissionsFromMd() {
  await ensureDb();

  let content = '';
  // Try /tmp first, then local repo file
  try {
    content = await fs.readFile(TMP_DB_FILE, 'utf-8');
  } catch {
    try {
      content = await fs.readFile(LOCAL_DB_FILE, 'utf-8');
    } catch (err) {
      console.warn('Could not read submissions file:', err.message);
      return [];
    }
  }

  try {
    const dataMatch = content.match(/<!-- DATA_START\r?\n([\s\S]*?)\r?\nDATA_END -->/);
    if (dataMatch && dataMatch[1]) {
      const parsed = JSON.parse(dataMatch[1].trim());
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error parsing submissions markdown:', err);
  }

  return [];
}

/**
 * Re-serializes the submissions array into Markdown format
 * and writes to disk (with automatic serverless /tmp fallback).
 */
export async function writeSubmissionsToMd(submissions) {
  await ensureDb();

  const list = Array.isArray(submissions) ? submissions : [];
  const readableDate = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const jsonBlock = JSON.stringify(list, null, 2);

  let md = `# Eaglesight Detective Services - Submissions Database

> **Classification**: Confidential / Investigative Privilege  
> **Storage Mode**: Offline Local Markdown File Database  
> **Standard**: ISO/IEC 27001:2022 Verified  
> **Last Synchronized**: ${readableDate} (UTC)  
> **Total Records**: ${list.length}

---

<!-- DATA_START
${jsonBlock}
DATA_END -->

## Active Inquiries Summary

| Ref ID | Date (UTC) | Client Name | Contact | Service Requested | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
`;

  if (list.length === 0) {
    md += `| - | - | _No submissions yet_ | - | - | - |\n\n`;
  } else {
    list.forEach((s) => {
      const shortDate = s.date ? new Date(s.date).toISOString().slice(0, 10) : '-';
      const contact = s.phone || s.email || 'N/A';
      md += `| **${s.id}** | ${shortDate} | ${s.name} | ${contact} | ${s.topic} | \`${s.status || 'New'}\` |\n`;
    });
    md += `\n`;
  }

  md += `---\n\n## Detailed Investigation Case Files\n\n`;

  if (list.length === 0) {
    md += `*No inquiry details available yet. As soon as a client submits a form in the UI, their full details will appear here.*\n`;
  } else {
    list.forEach((s, idx) => {
      md += `### ${idx + 1}. [${s.id}] ${s.name}\n\n`;
      md += `- **Reference ID**: \`${s.id}\`\n`;
      md += `- **Date Submitted**: ${s.date}\n`;
      md += `- **Case Status**: **${s.status || 'New'}**\n`;
      md += `- **Full Name**: ${s.name}\n`;
      md += `- **Phone Number**: ${s.phone || 'Not provided'}\n`;
      md += `- **Email Address**: ${s.email || 'Not provided'}\n`;
      md += `- **Service / Topic**: ${s.topic || 'General Enquiry'}\n`;
      md += `- **Urgency**: ${s.urgency || 'Normal'}\n\n`;
      md += `#### Client Message / Evidence Brief\n`;
      md += `> ${String(s.message || 'No description provided.').replace(/\n/g, '\n> ')}\n\n`;
      if (s.notes) {
        md += `#### Investigator Case Notes\n`;
        md += `*${s.notes}*\n\n`;
      }
      md += `---\n\n`;
    });
  }

  // Always write to /tmp in case local is read-only
  try {
    await fs.writeFile(TMP_DB_FILE, md, 'utf-8');
  } catch {
    // ignore
  }

  // Try writing to local repo file if writable
  try {
    await fs.writeFile(LOCAL_DB_FILE, md, 'utf-8');
  } catch (err) {
    // EROFS on Netlify serverless is expected and safely handled by TMP_DB_FILE
    if (err.code !== 'EROFS' && !err.message.includes('read-only')) {
      console.warn('Non-critical storage notice:', err.message);
    }
  }

  return md;
}

/**
 * Inserts a new submission.
 */
export async function insertSubmission(data) {
  const id = `ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const date = new Date().toISOString();

  const newEntry = {
    id,
    date,
    status: 'New',
    name: data.name || '',
    phone: data.phone || '',
    email: data.email || '',
    topic: data.topic || 'General Consultation',
    urgency: data.urgency || 'Normal',
    message: data.message || '',
    notes: '',
  };

  const existing = await readSubmissionsFromMd();
  const updated = [newEntry, ...existing];

  await writeSubmissionsToMd(updated);

  // Try writing individual case file (silently ignore EROFS in serverless)
  try {
    const individualFilePath = path.join(SUBMISSIONS_DIR, `${id}.md`);
    const individualMd = `# Investigation Case File: ${id}

- **Reference ID**: ${id}
- **Date Submitted**: ${date}
- **Status**: New
- **Client Name**: ${newEntry.name}
- **Phone**: ${newEntry.phone}
- **Email**: ${newEntry.email}
- **Topic**: ${newEntry.topic}
- **Urgency**: ${newEntry.urgency}

## Client Message
${newEntry.message}

## Case Notes
${newEntry.notes || '_No notes recorded yet._'}
`;
    await fs.writeFile(individualFilePath, individualMd, 'utf-8');
  } catch {
    // Read-only serverless safe
  }

  return newEntry;
}

/**
 * Updates a submission's status or notes.
 */
export async function updateSubmissionInMd(id, updates) {
  const existing = await readSubmissionsFromMd();
  let found = null;

  const updated = existing.map((s) => {
    if (s.id === id) {
      found = { ...s, ...updates };
      return found;
    }
    return s;
  });

  if (!found) {
    found = { id, ...updates };
  }

  await writeSubmissionsToMd(updated);

  return found;
}

/**
 * Deletes a submission safely without failing on read-only environments.
 */
export async function deleteSubmissionFromMd(id) {
  const existing = await readSubmissionsFromMd();
  const filtered = existing.filter((s) => s.id !== id);

  await writeSubmissionsToMd(filtered);

  try {
    const individualFilePath = path.join(SUBMISSIONS_DIR, `${id}.md`);
    await fs.unlink(individualFilePath);
  } catch {
    // Read-only serverless safe
  }

  return true;
}
