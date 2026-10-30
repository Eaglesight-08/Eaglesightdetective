const EDGE_LAYERS = 16;

// 3D gold coin of the Eaglesight seal: it sways and periodically flips, with
// orbit rings and drifting particles.
export default function Seal3D({ className = '' }) {
  return (
    <div className={`seal3d ${className}`} aria-hidden="true">
      <div className="seal3d-grid" />

      <div className="seal3d-scene">
        <div className="orbit o1"><span /></div>
        <div className="orbit o2"><span /></div>
        <div className="orbit o3"><span /><span /></div>

        <div className="coin">
          <div className="coin-face front">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/eagle_seal_hd.png" alt="" draggable="false" />
            <span className="coin-shine" />
          </div>
          {Array.from({ length: EDGE_LAYERS }, (_, i) => (
            <div key={i} className="coin-edge" style={{ '--z': `${-(i + 1)}px` }} />
          ))}
          <div className="coin-face back">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/eagle_seal_hd.png" alt="" draggable="false" />
            <span className="coin-shine" />
          </div>
        </div>
      </div>

      <div className="seal3d-particles">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>
    </div>
  );
}
