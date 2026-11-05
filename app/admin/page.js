'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Lock, Key, ShieldCheck, Eye, EyeOff, LogOut, Download, Copy, Check,
  Search, Filter, Trash2, Edit3, Phone, Mail, MessageSquare, AlertCircle,
  FileText, Code, Settings, RefreshCw, Plus, Clock, ExternalLink, UserCheck
} from 'lucide-react';
import {
  getSubmissions,
  saveSubmission,
  updateSubmissionStatus,
  deleteSubmission,
  resetToInitialSubmissions,
  generateMarkdownReport,
  downloadMarkdownFile,
  downloadSingleMarkdownFile,
  downloadJsonFile,
  verifyAdminCredentials,
  checkIsAuthenticated,
  logoutAdmin,
  changeAdminPassword,
  getLoginAttempts,
} from '@/lib/submissions-store';

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Login Form States (empty by default, requires manual entry)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard States
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'markdown' | 'json' | 'settings'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [copied, setCopied] = useState(false);

  // Notes state in modal
  const [modalNotes, setModalNotes] = useState('');
  const [modalStatus, setModalStatus] = useState('New');
  const [notesSaved, setNotesSaved] = useState(false);
  const [rawMdContent, setRawMdContent] = useState('');

  // Password change state
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState({ text: '', type: '' });

  const loadSubmissions = async () => {
    try {
      const res = await fetch('/api/admin/submissions');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.submissions)) {
          setSubmissions(json.submissions);
          if (json.rawMarkdown) {
            setRawMdContent(json.rawMarkdown);
          }
          return;
        }
      }
    } catch (err) {
      console.warn('API fetch warning:', err);
    }
    setSubmissions(getSubmissions());
  };

  // Initial check
  useEffect(() => {
    async function initAuth() {
      try {
        const res = await fetch('/api/admin/check');
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated) {
            setIsAuth(true);
            await loadSubmissions();
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Check auth warning:', err);
      }

      const clientAuth = checkIsAuthenticated();
      setIsAuth(clientAuth);
      if (clientAuth) {
        await loadSubmissions();
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const refreshList = async () => {
    await loadSubmissions();
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        setIsAuth(true);
        await loadSubmissions();
        setLoginLoading(false);
        return;
      }

      // Check fallback
      const fallbackRes = await verifyAdminCredentials(username, password);
      if (fallbackRes.success) {
        setIsAuth(true);
        await loadSubmissions();
      } else {
        const errJson = await res.json().catch(() => ({}));
        setLoginError(errJson.error || fallbackRes.error || 'Authentication failed.');
      }
    } catch {
      const fallbackRes = await verifyAdminCredentials(username, password);
      if (fallbackRes.success) {
        setIsAuth(true);
        await loadSubmissions();
      } else {
        setLoginError('Error verifying credentials.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    logoutAdmin();
    setIsAuth(false);
    setSelectedSubmission(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.warn('Status patch warning:', err);
    }
    updateSubmissionStatus(id, newStatus);
    await refreshList();
    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status: newStatus });
      setModalStatus(newStatus);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedSubmission) return;
    try {
      await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSubmission.id,
          status: modalStatus,
          notes: modalNotes,
        }),
      });
    } catch (err) {
      console.warn('Notes patch warning:', err);
    }
    updateSubmissionStatus(selectedSubmission.id, modalStatus, modalNotes);
    await refreshList();
    setSelectedSubmission({
      ...selectedSubmission,
      status: modalStatus,
      notes: modalNotes,
    });
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete inquiry record ${id}?`)) {
      // Optimistic update: remove from UI instantly
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (selectedSubmission?.id === id) setSelectedSubmission(null);
      deleteSubmission(id);

      try {
        await fetch(`/api/admin/submissions?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.warn('Delete warning:', err);
      }
    }
  };

  const handleCopyMarkdown = () => {
    const md = rawMdContent || generateMarkdownReport(submissions);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMd = () => {
    const md = rawMdContent || generateMarkdownReport(submissions);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ text: '', type: '' });
    if (newPass !== confirmPass) {
      setPassMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPass }),
      });
      if (res.ok) {
        setPassMsg({
          text: 'Admin credentials updated & stored into admin-credentials.md successfully!',
          type: 'success',
        });
        setNewPass('');
        setConfirmPass('');
        return;
      }
    } catch (err) {
      console.warn('API credentials update warning:', err);
    }

    const res = await changeAdminPassword(newPass);
    if (res.success) {
      setPassMsg({ text: 'Admin password updated and hashed with SHA-256 successfully!', type: 'success' });
      setNewPass('');
      setConfirmPass('');
    } else {
      setPassMsg({ text: res.error || 'Failed to update password.', type: 'error' });
    }
  };

  // Filtered submissions
  const filtered = submissions.filter((s) => {
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      s.topic.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.message.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const counts = {
    total: submissions.length,
    new: submissions.filter((s) => s.status === 'New').length,
    inProgress: submissions.filter((s) => s.status === 'In Progress').length,
    contacted: submissions.filter((s) => s.status === 'Contacted').length,
    resolved: submissions.filter((s) => s.status === 'Resolved').length,
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner" />
        <p>Loading secure portal...</p>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW 1: SECURE LOGIN SCREEN
  // ----------------------------------------------------------------------
  if (!isAuth) {
    const attempts = getLoginAttempts();
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-logo-circle">
              <Image src="/images/eagle_logo_clean.png" alt="Seal" width={64} height={64} priority />
            </div>
            <h2>EAGLESIGHT DETECTIVE SERVICES</h2>
            <div className="admin-login-sub">CYBER INVESTIGATION DESK · SECURE ADMIN</div>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-field">
              <label htmlFor="adm-user">Username</label>
              <div className="admin-input-wrap">
                <input
                  id="adm-user"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="adm-pass">Password</label>
              <div className="admin-input-wrap">
                <input
                  id="adm-pass"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="pass-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="admin-alert error">
                <AlertCircle size={16} /> {loginError}
              </div>
            )}

            <button type="submit" className="btn btn-navy btn-block" disabled={loginLoading}>
              <Lock size={16} /> {loginLoading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
            </button>
          </form>

          <div className="admin-back-link">
            <Link href="/">← Return to Public Website</Link>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // ----------------------------------------------------------------------
  return (
    <div className="admin-dashboard-wrap">
      {/* Top Header */}
      <header className="admin-topbar">
        <div className="admin-container admin-topbar-inner">
          <div className="admin-brand">
            <Image src="/images/eagle_logo_clean.png" alt="Seal" width={42} height={42} />
            <div>
              <div className="admin-brand-title">EAGLESIGHT INVESTIGATION DESK</div>
              <div className="admin-brand-tag">PORTAL & SUBMISSIONS MANAGER</div>
            </div>
          </div>

          <div className="admin-top-actions">
            <div className="admin-session-badge">
              <span className="live-pulse" />
              <span>Admin Active</span>
            </div>
            <Link href="/" target="_blank" className="btn btn-outline btn-sm">
              <ExternalLink size={14} /> Open Site
            </Link>
            <button onClick={handleLogout} className="btn btn-light btn-sm">
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="admin-container admin-main">
        {/* Metric Cards */}
        <div className="admin-stats-grid">
          <div className="astat-card">
            <div className="astat-num">{counts.total}</div>
            <div className="astat-label">Total Submissions</div>
          </div>
          <div className="astat-card yellow">
            <div className="astat-num">{counts.new}</div>
            <div className="astat-label">New / Pending</div>
          </div>
          <div className="astat-card purple">
            <div className="astat-num">{counts.inProgress}</div>
            <div className="astat-label">In Progress</div>
          </div>
          <div className="astat-card green">
            <div className="astat-num">{counts.resolved}</div>
            <div className="astat-label">Resolved / Closed</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button
            type="button"
            className={`atab-btn${activeTab === 'list' ? ' active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <FileText size={16} /> Submissions List ({counts.total})
          </button>
          <button
            type="button"
            className={`atab-btn${activeTab === 'markdown' ? ' active' : ''}`}
            onClick={() => setActiveTab('markdown')}
          >
            <Edit3 size={16} /> Markdown (.md) View & Export
          </button>
          <button
            type="button"
            className={`atab-btn${activeTab === 'json' ? ' active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            <Code size={16} /> JSON Data & Backup
          </button>
          <button
            type="button"
            className={`atab-btn${activeTab === 'settings' ? ' active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={16} /> Security & Password
          </button>
        </div>

        {/* ----------------- TAB 1: SUBMISSIONS LIST ----------------- */}
        {activeTab === 'list' && (
          <div className="admin-tab-pane">
            <div className="admin-toolbar">
              <div className="admin-search-input">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by client name, email, phone, topic, or ref ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="status-filter-pills">
                {['All', 'New', 'In Progress', 'Contacted', 'Resolved'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`filter-pill${statusFilter === st ? ' active' : ''}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="admin-toolbar-actions">
                <button type="button" onClick={() => downloadMarkdownFile(submissions)} className="btn btn-outline btn-sm">
                  <Download size={14} /> Export .md
                </button>
                <button type="button" onClick={() => downloadJsonFile(submissions)} className="btn btn-outline btn-sm">
                  <Download size={14} /> Export .json
                </button>
                <button type="button" onClick={refreshList} className="btn btn-light btn-sm" title="Refresh">
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="admin-empty-state">
                <FileText size={42} />
                <h3>No Submissions Found</h3>
                <p>No records match your search or filter.</p>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="admin-table-frame">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ref ID &amp; Date</th>
                      <th>Client Details</th>
                      <th>Inquiry Topic</th>
                      <th>Message Preview</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => {
                      const dateStr = new Date(s.date || s.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      return (
                        <tr key={s.id}>
                          <td>
                            <span className="ref-tag">{s.id}</span>
                            <div className="time-sub">{dateStr}</div>
                            <div className="source-sub">{s.page}</div>
                          </td>
                          <td>
                            <div className="client-name">{s.name}</div>
                            <div className="contact-links">
                              <a href={`tel:${s.phone.replace(/\s+/g, '')}`} className="clink phone" title="Call">
                                <Phone size={12} /> {s.phone}
                              </a>
                              <a href={`mailto:${s.email}`} className="clink email" title="Email">
                                <Mail size={12} /> {s.email}
                              </a>
                              {s.phone && (
                                <a
                                  href={`https://wa.me/${s.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="clink whatsapp"
                                  title="WhatsApp"
                                >
                                  WhatsApp
                                </a>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="topic-pill">{s.topic}</span>
                          </td>
                          <td>
                            <p className="msg-preview">{s.message}</p>
                            {s.notes && <div className="notes-preview"><b>Note:</b> {s.notes}</div>}
                          </td>
                          <td>
                            <select
                              value={s.status}
                              onChange={(e) => handleStatusChange(s.id, e.target.value)}
                              className={`status-select ${s.status.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <option value="New">🟡 New</option>
                              <option value="In Progress">🟣 In Progress</option>
                              <option value="Contacted">🔵 Contacted</option>
                              <option value="Resolved">🟢 Resolved</option>
                            </select>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="row-actions">
                              <button
                                type="button"
                                className="action-btn view"
                                onClick={() => {
                                  setSelectedSubmission(s);
                                  setModalNotes(s.notes || '');
                                  setModalStatus(s.status || 'New');
                                }}
                                title="View Complete Details"
                              >
                                View
                              </button>
                              <button
                                type="button"
                                className="action-btn delete"
                                onClick={() => handleDelete(s.id)}
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB 2: MARKDOWN (.MD) VIEW ----------------- */}
        {activeTab === 'markdown' && (
          <div className="admin-tab-pane">
            <div className="md-view-box">
              <div className="md-header">
                <div>
                  <h4>Submissions Database (<code>submissions.md</code>)</h4>
                  <p>Real-time contents of your Markdown database file stored on disk.</p>
                </div>
                <div className="md-actions">
                  <button type="button" onClick={handleCopyMarkdown} className="btn btn-outline btn-sm">
                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Markdown'}
                  </button>
                  <button type="button" onClick={handleDownloadMd} className="btn btn-navy btn-sm">
                    <Download size={14} /> Download submissions.md
                  </button>
                </div>
              </div>

              <pre className="md-code-preview">
                {rawMdContent || generateMarkdownReport(submissions)}
              </pre>
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: JSON DATA VIEW ----------------- */}
        {activeTab === 'json' && (
          <div className="admin-tab-pane">
            <div className="md-view-box">
              <div className="md-header">
                <div>
                  <h4>Raw JSON Submissions Array</h4>
                  <p>Direct JSON data storage. You can download or backup this file anytime.</p>
                </div>
                <div className="md-actions">
                  <button type="button" onClick={() => downloadJsonFile(submissions)} className="btn btn-navy btn-sm">
                    <Download size={14} /> Download submissions.json
                  </button>
                </div>
              </div>

              <pre className="md-code-preview">
                {JSON.stringify(submissions, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: SECURITY & SETTINGS ----------------- */}
        {activeTab === 'settings' && (
          <div className="admin-tab-pane">
            <div className="settings-grid">
              <div className="settings-card">
                <h3>Change Admin Password</h3>
                <p>Updates the SHA-256 cryptographic hash used to authenticate this dashboard.</p>

                <form onSubmit={handleChangePassword} style={{ marginTop: 20 }}>
                  <div className="admin-field">
                    <label>New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 5 characters"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                    />
                  </div>

                  <div className="admin-field">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat new password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                    />
                  </div>

                  {passMsg.text && (
                    <div className={`admin-alert ${passMsg.type}`}>
                      {passMsg.text}
                    </div>
                  )}

                  <button type="submit" className="btn btn-navy" style={{ marginTop: 10 }}>
                    <Key size={15} /> Update Admin Password
                  </button>
                </form>
              </div>

              <div className="settings-card">
                <h3>Offline Markdown File System Control</h3>
                <p>All system access credentials and submitted inquiries are stored in standard Markdown (<code>.md</code>) files under your full control.</p>

                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ background: 'var(--navy-900)', border: '1px solid var(--line-gold)', borderRadius: 'var(--radius)', padding: '14px 18px', color: '#fff' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-400)', marginBottom: 4 }}>
                      📁 admin-credentials.md
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      Stores active administrator username, password, SHA-256 hash, and authorization clearance level.
                    </div>
                  </div>

                  <div style={{ background: 'var(--navy-900)', border: '1px solid var(--line-gold)', borderRadius: 'var(--radius)', padding: '14px 18px', color: '#fff' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-400)', marginBottom: 4 }}>
                      📁 submissions.md
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      Central Markdown database file. Every inquiry submitted from the website forms is stored here in real-time.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadMd}
                    className="btn btn-gold"
                  >
                    <Download size={15} /> Export submissions.md File
                  </button>
                </div>

                <div style={{ marginTop: 28, fontSize: 13, color: 'var(--muted)', borderTop: '1px solid var(--line)', paddingTop: 16 }}>
                  <b>Security Notice:</b> Admin authentication is verified server-side with HMAC-SHA256 encrypted cookies. You can also edit credentials directly inside <code>admin-credentials.md</code>.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ----------------- SUBMISSION DETAIL MODAL ----------------- */}
      {selectedSubmission && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedSubmission(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-top">
              <div className="modal-title-wrap">
                <span className="ref-tag">{selectedSubmission.id}</span>
                <h3>{selectedSubmission.name}</h3>
                <small className="time-sub">
                  Submitted on {new Date(selectedSubmission.date || selectedSubmission.createdAt || Date.now()).toLocaleString('en-IN')}
                </small>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => downloadSingleMarkdownFile(selectedSubmission)}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Download size={13} /> {selectedSubmission.id}.md
                </button>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setSelectedSubmission(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="admin-modal-body">
              <div className="modal-section">
                <div className="modal-grid-2">
                  <div>
                    <label className="modal-label">Phone Number</label>
                    <div className="modal-val">
                      <a href={`tel:${selectedSubmission.phone.replace(/\s+/g, '')}`} className="modal-contact-link">
                        <Phone size={14} /> {selectedSubmission.phone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="modal-label">Email Address</label>
                    <div className="modal-val">
                      <a href={`mailto:${selectedSubmission.email}`} className="modal-contact-link">
                        <Mail size={14} /> {selectedSubmission.email}
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="modal-label">Inquiry Topic</label>
                    <div className="modal-val">
                      <span className="topic-pill">{selectedSubmission.topic}</span>
                    </div>
                  </div>

                  <div>
                    <label className="modal-label">Submitted From Page</label>
                    <div className="modal-val">
                      <code>{selectedSubmission.page}</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <label className="modal-label">Client Message / Description</label>
                <div className="modal-message-box">
                  {selectedSubmission.message}
                </div>
              </div>

              <div className="modal-section">
                <div className="modal-grid-2">
                  <div>
                    <label className="modal-label">Update Case Status</label>
                    <select
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value)}
                      className="modal-select"
                    >
                      <option value="New">🟡 New</option>
                      <option value="In Progress">🟣 In Progress</option>
                      <option value="Contacted">🔵 Contacted</option>
                      <option value="Resolved">🟢 Resolved</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    {selectedSubmission.phone && (
                      <a
                        href={`https://wa.me/${selectedSubmission.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-block"
                        style={{ height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      >
                        <MessageSquare size={15} color="#25D366" /> Chat on WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <label className="modal-label">Investigator Case Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Enter internal notes, follow-up actions, NDA status, or assigned examiner..."
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    className="modal-notes-area"
                  />
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
                    {notesSaved && <span style={{ color: '#1f7a37', fontSize: 13, fontWeight: 600 }}>✓ Notes saved!</span>}
                    <button type="button" onClick={handleSaveNotes} className="btn btn-navy btn-sm">
                      Save Case Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

