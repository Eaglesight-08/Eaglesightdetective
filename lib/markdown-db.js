import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const LOCAL_DB_FILE = path.join(process.cwd(), 'submissions.md');
const TMP_DB_FILE = path.join(os.tmpdir(), 'eaglesight-submissions.md');
const SUBMISSIONS_DIR = path.join(process.cwd(), 'submissions');

// Read at runtime (never hardcode the repo slug) so its value is not bundled into build output.
function getGitHubRepo() {
  return process.env.GITHUB_REPO || null;
}

/**
 * Fetches latest content directly from GitHub REST API
 */
async function fetchFromGitHub(repoPath) {
  const token = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = getGitHubRepo();
  if (!token || !GITHUB_REPO) return null;

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${repoPath}?ref=main`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Eaglesight-App',
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return { content, sha: data.sha };
    }
  } catch (err) {
    console.warn('GitHub API fetch notice:', err.message);
  }
  return null;
}

/**
 * Commits updated file directly to GitHub REST API (with [skip ci] to avoid unnecessary builds)
 */
async function commitToGitHub(repoPath, content, commitMessage) {
  const token = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = getGitHubRepo();
  if (!token || !GITHUB_REPO) return false;

  try {
    const existing = await fetchFromGitHub(repoPath);
    const base64Content = Buffer.from(content).toString('base64');

    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${repoPath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Eaglesight-App',
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `${commitMessage} [skip ci]`,
        content: base64Content,
        sha: existing?.sha,
        branch: 'main',
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('GitHub API commit notice:', err.message);
    return false;
  }
}

/**
 * Deletes a file directly from GitHub repository via REST API
 */
async function deleteFromGitHub(repoPath, commitMessage) {
  const token = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = getGitHubRepo();
  if (!token || !GITHUB_REPO) return false;

  try {
    const existing = await fetchFromGitHub(repoPath);
    if (!existing?.sha) return false;

    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${repoPath}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Eaglesight-App',
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `${commitMessage} [skip ci]`,
        sha: existing.sha,
        branch: 'main',
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('GitHub API delete notice:', err.message);
    return false;
  }
}

/**
 * Ensures the submissions directory and database exist locally.
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
 * If GITHUB_TOKEN is present, queries GitHub.com directly for real-time consistency.
 */
export async function readSubmissionsFromMd() {
  // If GitHub token is configured, load directly from GitHub repository!
  if (process.env.GITHUB_TOKEN) {
    const gh = await fetchFromGitHub('submissions.md');
    if (gh?.content) {
      const dataMatch = gh.content.match(/<!-- DATA_START\r?\n([\s\S]*?)\r?\nDATA_END -->/);
      if (dataMatch && dataMatch[1]) {
        try {
          const parsed = JSON.parse(dataMatch[1].trim());
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch {
          // ignore
        }
      }
    }
  }

  await ensureDb();

  let content = '';
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
 * Re-serializes the submissions array into Markdown format,
 * writes to disk (/tmp fallback) AND commits directly to GitHub repository if token is present.
 */
export async function writeSubmissionsToMd(submissions, commitMessage = 'Update submissions registry') {
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

  // 1. Commit directly to GitHub.com if token is available!
  if (process.env.GITHUB_TOKEN) {
    await commitToGitHub('submissions.md', md, commitMessage);
  }

  // 2. Write to /tmp in serverless environments
  try {
    await fs.writeFile(TMP_DB_FILE, md, 'utf-8');
  } catch {
    // ignore
  }

  // 3. Write to local repo file if writable
  try {
    await fs.writeFile(LOCAL_DB_FILE, md, 'utf-8');
  } catch {
    // Read-only serverless safe
  }

  return md;
}

/**
 * Inserts a new submission and pushes both submissions.md and submissions/${id}.md to GitHub.
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

  await writeSubmissionsToMd(updated, `Add inquiry ${id} from ${newEntry.name}`);

  // Individual case file content
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

  // Commit individual case file to GitHub
  if (process.env.GITHUB_TOKEN) {
    await commitToGitHub(`submissions/${id}.md`, individualMd, `Create case file ${id}`);
  }

  // Save to local /tmp
  try {
    const individualFilePath = path.join(SUBMISSIONS_DIR, `${id}.md`);
    await fs.writeFile(individualFilePath, individualMd, 'utf-8');
  } catch {
    // Read-only serverless safe
  }

  return newEntry;
}

/**
 * Updates a submission's status or notes, and commits to GitHub.
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

  await writeSubmissionsToMd(updated, `Update case ${id} to ${found.status || 'Updated'}`);

  const individualMd = `# Investigation Case File: ${id}

- **Reference ID**: ${id}
- **Date Submitted**: ${found.date || new Date().toISOString()}
- **Status**: ${found.status || 'New'}
- **Client Name**: ${found.name || ''}
- **Phone**: ${found.phone || ''}
- **Email**: ${found.email || ''}
- **Topic**: ${found.topic || ''}
- **Urgency**: ${found.urgency || 'Normal'}

## Client Message
${found.message || ''}

## Case Notes
${found.notes || '_No notes recorded yet._'}
`;

  // Commit updated individual case file to GitHub
  if (process.env.GITHUB_TOKEN) {
    await commitToGitHub(`submissions/${id}.md`, individualMd, `Update case file ${id}`);
  }

  try {
    const individualFilePath = path.join(SUBMISSIONS_DIR, `${id}.md`);
    await fs.writeFile(individualFilePath, individualMd, 'utf-8');
  } catch {
    // ignore
  }

  return found;
}

/**
 * Deletes a submission and removes from GitHub.
 */
export async function deleteSubmissionFromMd(id) {
  const existing = await readSubmissionsFromMd();
  const filtered = existing.filter((s) => s.id !== id);

  await writeSubmissionsToMd(filtered, `Delete inquiry ${id}`);

  // Delete from GitHub repository
  if (process.env.GITHUB_TOKEN) {
    await deleteFromGitHub(`submissions/${id}.md`, `Remove case file ${id}`);
  }

  try {
    const individualFilePath = path.join(SUBMISSIONS_DIR, `${id}.md`);
    await fs.unlink(individualFilePath);
  } catch {
    // ignore
  }

  return true;
}
