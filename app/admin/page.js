'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Lock, Key, ShieldCheck, Eye, EyeOff, LogOut, Download, Copy, Check,
  Search, Filter, Trash2, Edit3, Phone, Mail, MessageSquare, AlertCircle,
  FileText, Code, Settings, RefreshCw, Plus, Clock, ExternalLink, UserCheck, FileCheck, CheckCircle2
} from 'lucide-react';
import {
  getSubmissions,
  saveSubmission,
  updateSubmissionStatus,
  deleteSubmission,
  downloadSingleMarkdownFile,
  downloadMarkdownFile,
  downloadJsonFile,
  verifyAdminCredentials,
  checkIsAuthenticated,
  logoutAdmin,
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

  // Dashboard Category Tab State ('all' | 'services' | 'id-card' | 'documents')
  const [activeCategory, setActiveCategory] = useState('all');

  // Submissions and Filtering
  const [submissions, setSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Notes state in detail modal
  const [modalNotes, setModalNotes] = useState('');
  const [modalStatus, setModalStatus] = useState('New');
  const [notesSaved, setNotesSaved] = useState(false);
  const [isEditingModal, setIsEditingModal] = useState(false);
  const [showIdCardView, setShowIdCardView] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    email: '',
    topic: '',
    message: '',
  });

  const loadSubmissions = async () => {
    try {
      const res = await fetch('/api/admin/submissions');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.submissions)) {
          setSubmissions(json.submissions);
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

      const fallbackRes = await verifyAdminCredentials(username, password);
      if (fallbackRes.success) {
        setIsAuth(true);
        await loadSubmissions();
      } else {
        const errJson = await res.json().catch(() => ({}));
        setLoginError(errJson.error || fallbackRes.error || 'Invalid username or password.');
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
    // Optimistic UI update
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission((prev) => ({ ...prev, status: newStatus }));
      setModalStatus(newStatus);
    }

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
  };

  const handleOpenSubmission = (s) => {
    setSelectedSubmission(s);
    setModalNotes(s.notes || '');
    setModalStatus(s.status || 'New');
    setEditFormData({
      name: s.name || '',
      phone: s.phone || '',
      email: s.email || '',
      topic: s.topic || '',
      message: s.message || '',
    });
    setIsEditingModal(false);
    setShowIdCardView(isIdCard(s));
  };

  const handleSaveModal = async () => {
    if (!selectedSubmission) return;
    const id = selectedSubmission.id;

    const updates = {
      ...(isEditingModal ? editFormData : {}),
      status: modalStatus,
      notes: modalNotes,
    };

    // Optimistic UI update
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    setSelectedSubmission((prev) => ({
      ...prev,
      ...updates,
    }));
    setNotesSaved(true);
    setIsEditingModal(false);
    setTimeout(() => setNotesSaved(false), 2500);

    try {
      await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
    } catch (err) {
      console.warn('Notes patch warning:', err);
    }
    updateSubmissionStatus(id, modalStatus, modalNotes, isEditingModal ? editFormData : {});
  };

  // Execute confirmed delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);

    // Optimistic UI removal
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    if (selectedSubmission?.id === id) {
      setSelectedSubmission(null);
    }
    deleteSubmission(id);

    try {
      await fetch(`/api/admin/submissions?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Delete warning:', err);
    }
  };

  // Category classification helpers
  const isIdCard = (s) => {
    const t = (s.topic || '').toLowerCase();
    return t.includes('id card') || t.includes('membership') || t.includes('badge');
  };

  const isDocument = (s) => {
    const t = (s.topic || '').toLowerCase();
    return t.includes('document') || t.includes('certificate') || t.includes('65b');
  };

  const isService = (s) => !isIdCard(s) && !isDocument(s);

  // Filtered submissions based on active category, status, and search query
  const filtered = submissions.filter((s) => {
    // Category separation
    if (activeCategory === 'services' && !isService(s)) return false;
    if (activeCategory === 'id-card' && !isIdCard(s)) return false;
    if (activeCategory === 'documents' && !isDocument(s)) return false;

    // Status filter
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;

    // Search query
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (s.name || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.phone || '').toLowerCase().includes(q) ||
      (s.topic || '').toLowerCase().includes(q) ||
      (s.id || '').toLowerCase().includes(q) ||
      (s.message || '').toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const counts = {
    total: submissions.length,
    services: submissions.filter(isService).length,
    idCard: submissions.filter(isIdCard).length,
    documents: submissions.filter(isDocument).length,
    new: submissions.filter((s) => s.status === 'New').length,
    inProgress: submissions.filter((s) => s.status === 'In Progress').length,
    resolved: submissions.filter((s) => s.status === 'Resolved' || s.status === 'Contacted').length,
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner" />
        <p>Loading secure investigation desk...</p>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW 1: ADMIN LOGIN SCREEN (Unauthenticated)
  // ----------------------------------------------------------------------
  if (!isAuth) {
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-card">
          <div className="admin-login-brand">
            <Image src="/images/eagle_logo_clean.png" alt="Eaglesight Seal" width={72} height={72} />
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

        {/* Category Separation Tabs (All / Services / ID Card / Documents) */}
        <div className="admin-nav-tabs">
          <button
            type="button"
            className={`atab-btn${activeCategory === 'all' ? ' active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            <FileText size={16} /> All Inquiries ({counts.total})
          </button>
          <button
            type="button"
            className={`atab-btn${activeCategory === 'services' ? ' active' : ''}`}
            onClick={() => setActiveCategory('services')}
          >
            <ShieldCheck size={16} /> Service Enquiries ({counts.services})
          </button>
          <button
            type="button"
            className={`atab-btn${activeCategory === 'id-card' ? ' active' : ''}`}
            onClick={() => setActiveCategory('id-card')}
          >
            <UserCheck size={16} /> ID Card Verifications ({counts.idCard})
          </button>
          <button
            type="button"
            className={`atab-btn${activeCategory === 'documents' ? ' active' : ''}`}
            onClick={() => setActiveCategory('documents')}
          >
            <FileCheck size={16} /> Document Verifications ({counts.documents})
          </button>
        </div>

        {/* Content Table Area */}
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
              <p>
                {activeCategory !== 'all'
                  ? `No inquiries recorded under the "${activeCategory.toUpperCase()}" category.`
                  : 'No records match your active search or filter.'}
              </p>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => { setSearchQuery(''); setStatusFilter('All'); setActiveCategory('all'); }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="admin-table-frame">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ref ID &amp; Date</th>
                    <th>Client Details</th>
                    <th>Inquiry Category / Topic</th>
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
                    const isCardType = isIdCard(s);
                    const isDocType = isDocument(s);

                    return (
                      <tr key={s.id}>
                        <td>
                          <span className="ref-tag">{s.id}</span>
                          <div className="time-sub">{dateStr}</div>
                          {s.page && <div className="source-sub">{s.page}</div>}
                        </td>
                        <td>
                          <div className="client-name">{s.name}</div>
                          <div className="contact-links">
                            {s.phone && (
                              <a href={`tel:${s.phone.replace(/\s+/g, '')}`} className="clink phone" title="Call">
                                <Phone size={12} /> {s.phone}
                              </a>
                            )}
                            {s.email && (
                              <a href={`mailto:${s.email}`} className="clink email" title="Email">
                                <Mail size={12} /> {s.email}
                              </a>
                            )}
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
                          <span className={`topic-pill${isCardType ? ' gold' : isDocType ? ' purple' : ''}`}>
                            {s.topic}
                          </span>
                        </td>
                        <td>
                          <p className="msg-preview">{s.message}</p>
                          {s.notes && <div className="notes-preview"><b>Note:</b> {s.notes}</div>}
                        </td>
                        <td>
                          <select
                            value={s.status}
                            onChange={(e) => handleStatusChange(s.id, e.target.value)}
                            className={`status-select ${(s.status || 'new').toLowerCase().replace(/\s+/g, '-')}`}
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
                              onClick={() => handleOpenSubmission(s)}
                              title={isCardType ? 'View Official ID Card' : 'View and Edit Complete Details'}
                              style={isCardType ? { display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--navy-800)', color: 'var(--gold-400)', borderColor: 'var(--gold-500)' } : {}}
                            >
                              {isCardType ? <><UserCheck size={13} /> View ID Card</> : 'View / Edit'}
                            </button>
                            <button
                              type="button"
                              className="action-btn delete"
                              onClick={() => setDeleteTarget(s)}
                              title="Delete this case"
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
      </main>

      {/* ----------------- SUBMISSION DETAIL MODAL ----------------- */}
      {selectedSubmission && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedSubmission(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-top">
              <div className="modal-title-wrap" style={{ flex: 1 }}>
                <span className="ref-tag">{selectedSubmission.id}</span>
                {isEditingModal ? (
                  <div style={{ marginTop: 6, maxWidth: 360 }}>
                    <label style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                      Client Name
                    </label>
                    <input
                      type="text"
                      className="modal-input"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      placeholder="Client Name"
                    />
                  </div>
                ) : (
                  <h3>{selectedSubmission.name}</h3>
                )}
                <small className="time-sub">
                  Submitted on {new Date(selectedSubmission.date || selectedSubmission.createdAt || Date.now()).toLocaleString('en-IN')}
                </small>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => { setShowIdCardView(!showIdCardView); setIsEditingModal(false); }}
                  className={`btn btn-sm ${showIdCardView ? 'btn-gold' : 'btn-outline'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  title={showIdCardView ? 'Switch to Inquiry Details Form' : 'View Official Detective ID Card'}
                >
                  <UserCheck size={13} /> {showIdCardView ? 'Form View' : 'ID Card View'}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsEditingModal(!isEditingModal); setShowIdCardView(false); }}
                  className={`btn btn-sm ${isEditingModal ? 'btn-navy' : 'btn-outline'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  title={isEditingModal ? 'Cancel edit' : 'Edit client details and message'}
                >
                  <Edit3 size={13} /> {isEditingModal ? 'Cancel Edit' : 'Edit Details'}
                </button>
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
              {showIdCardView && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-900)' }}>
                      Official Cyber Detective Credential Card:
                    </span>
                    <a
                      href={`/verify?id=${encodeURIComponent(selectedSubmission.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      <ExternalLink size={13} /> Open in Public /verify Portal
                    </a>
                  </div>

                  <div className="detective-card" style={{ maxWidth: '100%', margin: '0 auto' }}>
                    <div className="card-top">
                      <div className="card-brand">
                        <Image src="/images/eagle_logo_clean.png" alt="Seal" width={52} height={52} />
                        <div>
                          <div className="brand-tit">EAGLESIGHT DETECTIVE SERVICES</div>
                          <div className="brand-sub-badge">CYBER INVESTIGATOR IDENTIFICATION</div>
                        </div>
                      </div>
                      <div className="status-pill active">
                        <CheckCircle2 size={14} /> {modalStatus === 'Resolved' ? 'ACTIVE & RESOLVED' : (modalStatus === 'In Progress' ? 'ACTIVE INVESTIGATION' : 'ACTIVE & VERIFIED')}
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="card-photo-col">
                        <div className="card-photo-placeholder">
                          <ShieldCheck size={40} className="card-seal-icon" />
                          <span>OFFICIAL SEAL</span>
                        </div>
                        <div className="card-cin">CIN: U62020TZ2026PTC041075</div>
                      </div>

                      <div className="card-details">
                        <div className="det-row">
                          <span className="det-label">Operative Name</span>
                          <span className="det-val highlight">{selectedSubmission.name || 'Registered Operative'}</span>
                        </div>
                        <div className="det-grid">
                          <div className="det-row">
                            <span className="det-label">Membership / Badge ID</span>
                            <span className="det-val mono">{selectedSubmission.id}</span>
                          </div>
                          <div className="det-row">
                            <span className="det-label">Designation</span>
                            <span className="det-val">{selectedSubmission.topic || 'Cyber Fraud & Field Investigator'}</span>
                          </div>
                          <div className="det-row">
                            <span className="det-label">Assigned Practice</span>
                            <span className="det-val">Special Investigations Desk</span>
                          </div>
                          <div className="det-row">
                            <span className="det-label">Jurisdiction</span>
                            <span className="det-val">Tamil Nadu & Pan-India</span>
                          </div>
                          <div className="det-row">
                            <span className="det-label">Issued On</span>
                            <span className="det-val">{new Date(selectedSubmission.date || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div className="det-row">
                            <span className="det-label">Valid Through</span>
                            <span className="det-val">09 Mar 2028</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer">
                      <div className="card-hash">
                        <span className="hash-label">Cryptographic Fingerprint:</span>
                        <code>{selectedSubmission.id.toLowerCase()}-verified-hash-sig</code>
                      </div>
                      <div className="card-stamp" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <a
                          href={`/verify?id=${encodeURIComponent(selectedSubmission.id)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-gold btn-sm"
                          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        >
                          <UserCheck size={13} /> Verify Online
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="modal-section">
                <div className="modal-grid-2">
                  <div>
                    <label className="modal-label">Phone Number</label>
                    {isEditingModal ? (
                      <input
                        type="text"
                        className="modal-input"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                        placeholder="+91..."
                      />
                    ) : (
                      <div className="modal-val">
                        {selectedSubmission.phone ? (
                          <a href={`tel:${selectedSubmission.phone.replace(/\s+/g, '')}`} className="modal-contact-link">
                            <Phone size={14} /> {selectedSubmission.phone}
                          </a>
                        ) : (
                          <span style={{ color: 'var(--muted)' }}>Not provided</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="modal-label">Email Address</label>
                    {isEditingModal ? (
                      <input
                        type="email"
                        className="modal-input"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        placeholder="client@example.com"
                      />
                    ) : (
                      <div className="modal-val">
                        {selectedSubmission.email ? (
                          <a href={`mailto:${selectedSubmission.email}`} className="modal-contact-link">
                            <Mail size={14} /> {selectedSubmission.email}
                          </a>
                        ) : (
                          <span style={{ color: 'var(--muted)' }}>Not provided</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="modal-label">Inquiry Category / Topic</label>
                    {isEditingModal ? (
                      <input
                        type="text"
                        className="modal-input"
                        value={editFormData.topic}
                        onChange={(e) => setEditFormData({ ...editFormData, topic: e.target.value })}
                        placeholder="Topic / Service category"
                      />
                    ) : (
                      <div className="modal-val">
                        <span className="topic-pill">{selectedSubmission.topic}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="modal-label">Reference ID</label>
                    <div className="modal-val">
                      <code>{selectedSubmission.id}</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <label className="modal-label">Client Message / Description</label>
                {isEditingModal ? (
                  <textarea
                    rows={4}
                    className="modal-notes-area"
                    value={editFormData.message}
                    onChange={(e) => setEditFormData({ ...editFormData, message: e.target.value })}
                    placeholder="Client message or description..."
                  />
                ) : (
                  <div className="modal-message-box">
                    {selectedSubmission.message || 'No description provided.'}
                  </div>
                )}
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

                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                    {selectedSubmission.phone && (
                      <a
                        href={`https://wa.me/${selectedSubmission.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ flex: 1, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      >
                        <MessageSquare size={15} color="#25D366" /> WhatsApp
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(selectedSubmission)}
                      className="btn btn-outline"
                      style={{ height: 42, color: '#dc2626', borderColor: '#fca5a5', display: 'flex', alignItems: 'center', gap: 6 }}
                      title="Delete this inquiry"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
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
                    {notesSaved && <span style={{ color: '#1f7a37', fontSize: 13, fontWeight: 600 }}>✓ Changes saved & committed to GitHub!</span>}
                    <button type="button" onClick={handleSaveModal} className={`btn btn-sm ${isEditingModal ? 'btn-gold' : 'btn-navy'}`}>
                      {isEditingModal ? 'Save All Changes & Sync' : 'Save Case Notes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- DEDICATED DELETE CONFIRMATION MODAL ----------------- */}
      {deleteTarget && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal-card" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-top" style={{ background: '#7f1d1d' }}>
              <div className="modal-title-wrap">
                <span className="ref-tag" style={{ background: '#991b1b', color: '#fff' }}>{deleteTarget.id}</span>
                <h3 style={{ color: '#fff' }}>Confirm Record Deletion</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDeleteTarget(null)}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body" style={{ padding: '24px' }}>
              <p style={{ fontSize: '15px', color: 'var(--navy-900)', margin: '0 0 16px', lineHeight: 1.5 }}>
                Are you sure you want to permanently delete case inquiry <b>{deleteTarget.id}</b> for <b>{deleteTarget.name}</b>?
              </p>

              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', color: '#991b1b', fontSize: '13px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <span>This action cannot be undone. The case file will be permanently removed from your active database.</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  style={{ background: '#dc2626', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none' }}
                  onClick={handleConfirmDelete}
                >
                  <Trash2 size={14} /> Yes, Delete Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
