import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="card p-5 text-center"
        style={{
          maxWidth: '520px',
          width: '100%',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <h1 className="mb-3" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a' }}>
          Website is Currently Under Development
        </h1>
        <p className="mb-0" style={{ color: '#555', fontSize: '0.95rem' }}>
          We are working hard to bring something great. Please check back soon.
        </p>
      </div>
    </div>
  );
}
