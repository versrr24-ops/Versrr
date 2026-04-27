// Shared UI primitives — exported to window

const { useState, useEffect, useRef, useMemo } = React;

// ---------- Icons (inline SVGs, stroke-based) ----------
const Icon = ({ name, size = 20, stroke = 1.8 }) => {
  const paths = {
    'store': 'M3 9l1.5-5h15L21 9M4 9h16v11H4zM9 13h6',
    'lock': 'M6 10V7a6 6 0 1112 0v3M5 10h14v11H5z',
    'gift': 'M20 7H4v5h16V7zM12 7v15M5 22h14v-10H5zM8 7a2 2 0 010-4c2 0 4 4 4 4s2-4 4-4a2 2 0 010 4',
    'wallet': 'M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-1M21 12h-4a2 2 0 010-4h4v4z',
    'api': 'M8 3v4M16 3v4M3 9h18M3 9v10a2 2 0 002 2h14a2 2 0 002-2V9M8 14l2 2 4-4',
    'bell': 'M18 16V11a6 6 0 10-12 0v5l-2 3h16l-2-3zM10 20a2 2 0 004 0',
    'search': 'M11 4a7 7 0 105 12l4 4M11 4a7 7 0 017 7',
    'check': 'M4 12l5 5L20 6',
    'check-circle': 'M22 11.1V12a10 10 0 11-5.9-9.1M22 4L12 14l-3-3',
    'shield': 'M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4zM9 12l2 2 4-4',
    'shield-check': 'M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4zM9 12l2 2 4-4',
    'plus': 'M12 5v14M5 12h14',
    'arrow-left': 'M19 12H5M12 19l-7-7 7-7',
    'arrow-right': 'M5 12h14M12 5l7 7-7 7',
    'arrow-up-right': 'M7 17L17 7M7 7h10v10',
    'copy': 'M8 4h10v14M6 8h10v12H6z',
    'user': 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
    'users': 'M9 12a4 4 0 100-8 4 4 0 000 8zM2 20a7 7 0 0114 0M18 11a3 3 0 100-6M22 19a6 6 0 00-5-5.9',
    'settings': 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 01-2.9 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 01-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 012.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 012.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z',
    'x': 'M6 6l12 12M6 18L18 6',
    'chevron-right': 'M9 6l6 6-6 6',
    'chevron-down': 'M6 9l6 6 6-6',
    'chevron-up': 'M18 15l-6-6-6 6',
    'alert': 'M12 9v4M12 17h.01M10.3 3.86L1.82 18a2 2 0 001.7 3h16.9a2 2 0 001.7-3L13.7 3.86a2 2 0 00-3.4 0z',
    'info': 'M12 16v-4M12 8h.01M12 22a10 10 0 100-20 10 10 0 000 20z',
    'clock': 'M12 6v6l4 2M12 22a10 10 0 100-20 10 10 0 000 20z',
    'message': 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
    'upload': 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
    'download': 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
    'logout': 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
    'qr': 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2M18 14h2M14 18h2v2M18 18h2v2',
    'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    'handshake': 'M11 17l-2-2 4-4 2 2M9 11l-4 4 3 3 4-4M15 9l4 4-3 3-4-4M13 7l2-2 4 4-2 2',
    'whatsapp': 'M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5H8c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.7-.4zM12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.5A10 10 0 1012 2z',
    'telegram': 'M22 3L2 10l6 3 3 8 4-5 6 4z',
    'flag': 'M4 21V4M4 4h14l-3 4 3 4H4',
    'edit': 'M17 3a2 2 0 014 4l-12 12-5 1 1-5L17 3z',
    'trash': 'M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6',
    'refresh': 'M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0114.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0020.5 15',
    'external': 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3',
    'star': 'M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z',
    'filter': 'M3 5h18M6 12h12M10 19h4',
    'menu': 'M3 6h18M3 12h18M3 18h18',
    'sparkle': 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2',
    'building': 'M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 9h1M9 13h1M9 17h1M14 9h1M14 13h1M14 17h1',
  };
  const d = paths[name] || paths['info'];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
};

// ---------- Versrr V logo mark ----------
const VMark = ({ size = 24, color = '#7C3AED' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path d="M15 22 L28 22 L48 68 L48 82 Z" fill={color} />
    <path d="M85 22 L72 22 L52 68 L52 82 Z" fill={color} />
  </svg>
);

// ---------- Verification Badge (tier-coded, ultra-prominent) ----------
const TIERS = {
  new: { label: 'New', fg: '#9CA3AF', bg: 'rgba(107,114,128,0.15)', border: 'rgba(107,114,128,0.4)', dot: '#6B7280' },
  peer: { label: 'Peer Verified', fg: '#C4B5FD', bg: 'rgba(124,58,237,0.16)', border: 'rgba(124,58,237,0.45)', dot: '#7C3AED' },
  vendor: { label: 'Vendor', fg: '#FBBF24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)', dot: '#F59E0B' },
  trusted: { label: 'Trusted Vendor', fg: '#E9D5FF', bg: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(245,158,11,0.15))', border: 'rgba(167,139,250,0.5)', dot: '#A78BFA' },
};

const VerBadge = ({ tier = 'peer', count = 0, size = 'md' }) => {
  const t = TIERS[tier];
  const padding = size === 'sm' ? '3px 8px' : size === 'lg' ? '6px 12px' : '4px 10px';
  const fontSize = size === 'sm' ? 11 : size === 'lg' ? 13 : 12;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding, borderRadius: 999, fontSize, fontWeight: 600,
      background: t.bg, color: t.fg, border: `1px solid ${t.border}`,
      lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      <span style={{width: 6, height: 6, borderRadius: 999, background: t.dot}} />
      {t.label}
      {count > 0 && <span style={{opacity: 0.75, fontWeight: 500, fontFamily: 'var(--font-mono)'}}>· {count}</span>}
    </span>
  );
};

// Large verification card for profile-style prominence
const VerCard = ({ tier, count, recent = [], compact = false }) => {
  const t = TIERS[tier];
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: compact ? 8 : 12,
      padding: compact ? 12 : 16,
      borderRadius: 14,
      background: t.bg,
      border: `1px solid ${t.border}`,
    }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <Icon name="shield-check" size={compact ? 18 : 22} />
          <span style={{fontWeight: 600, color: t.fg}}>{t.label}</span>
        </div>
        <div className="mono" style={{fontSize: compact ? 18 : 24, fontWeight: 700, color: t.fg}}>{count}</div>
      </div>
      {!compact && recent.length > 0 && (
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <div style={{display: 'flex'}}>
            {recent.slice(0,4).map((r, i) => (
              <div key={i} title={r.name} style={{
                width: 26, height: 26, borderRadius: 999,
                background: `hsl(${(i*67)%360} 30% 50%)`,
                border: '2px solid var(--bg-1)',
                marginLeft: i > 0 ? -8 : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: 'white',
              }}>
                {r.name.split(' ').map(s=>s[0]).join('').slice(0,2)}
              </div>
            ))}
          </div>
          <span style={{fontSize: 12, color: 'var(--fg-2)'}}>
            {recent[0].name.split(' ')[0]} + {recent.length - 1} others verified you
          </span>
        </div>
      )}
    </div>
  );
};

// ---------- Avatar ----------
const Avatar = ({ name, size = 36, tier }) => {
  const initials = (name || '?').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
  const hue = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: `linear-gradient(135deg, hsl(${hue} 40% 45%), hsl(${(hue+30)%360} 50% 35%))`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700, color: 'white', flexShrink: 0,
      border: tier === 'trusted' ? '2px solid rgba(167,139,250,0.6)' : 'none',
    }}>
      {initials}
    </div>
  );
};

// ---------- Payment method chip ----------
const METHOD_COLORS = {
  'Opay': '#00B96B', 'PalmPay': '#7C3AED', 'Kuda': '#6B21A8', 'Moniepoint': '#F59E0B',
  'Bank Transfer': '#6B7280', 'GTB': '#E11D48', 'Access': '#2563EB',
};
const MethodChip = ({ method }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 8px', borderRadius: 6,
    fontSize: 11, fontWeight: 500,
    background: 'var(--bg-3)', color: 'var(--fg-1)',
    border: '1px solid var(--border-1)',
  }}>
    <span style={{width: 6, height: 6, borderRadius: 2, background: METHOD_COLORS[method] || '#6B7280'}} />
    {method}
  </span>
);

// ---------- Toast ----------
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const show = (msg, kind = 'info') => {
    const id = Math.random();
    setToasts(t => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  const ToastHost = () => (
    <div style={{position: 'fixed', top: 72, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 100, pointerEvents: 'none'}}>
      {toasts.map(t => (
        <div key={t.id} className="slide-in-top" style={{
          background: 'var(--bg-3)',
          border: '1px solid var(--border-2)',
          borderLeft: `3px solid ${t.kind === 'success' ? 'var(--success)' : t.kind === 'error' ? 'var(--error)' : 'var(--purple-700)'}`,
          borderRadius: 10, padding: '10px 16px', fontSize: 13, color: 'var(--fg-0)',
          boxShadow: 'var(--shadow-lg)', maxWidth: 340, pointerEvents: 'auto',
        }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
  return { show, ToastHost };
};

// ---------- Modal ----------
const Modal = ({ open, onClose, children, title, size = 'md' }) => {
  if (!open) return null;
  const maxWidth = size === 'sm' ? 360 : size === 'lg' ? 560 : 440;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 60,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} className="fade-in" style={{
        background: 'var(--bg-2)', border: '1px solid var(--border-1)',
        borderRadius: 20, padding: 24, width: '100%', maxWidth,
        maxHeight: '90vh', overflow: 'auto',
      }}>
        {title && (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16}}>
            <h3 style={{margin: 0, fontSize: 18, fontWeight: 600}}>{title}</h3>
            <button onClick={onClose} className="btn-ghost" style={{padding: 6, borderRadius: 8, display: 'flex'}}><Icon name="x" size={18} /></button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

// ---------- Toggle / SegmentedControl ----------
const Segmented = ({ value, onChange, options, full = false, accent = 'amber' }) => (
  <div style={{
    display: 'inline-flex', padding: 4, borderRadius: 10,
    background: 'var(--bg-1)', border: '1px solid var(--border-1)',
    width: full ? '100%' : 'auto',
  }}>
    {options.map(o => {
      const active = value === o.value;
      return (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          flex: full ? 1 : 'none',
          padding: '8px 16px', borderRadius: 7, fontSize: 13, fontWeight: 600,
          background: active ? (accent === 'amber' ? 'var(--amber-500)' : 'var(--purple-800)') : 'transparent',
          color: active ? (accent === 'amber' ? '#1a1300' : 'white') : 'var(--fg-2)',
          transition: 'all 0.15s',
        }}>{o.label}</button>
      );
    })}
  </div>
);

// ---------- Empty state ----------
const EmptyState = ({ icon = 'info', title, body, cta }) => (
  <div style={{
    padding: '48px 20px', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
  }}>
    <div style={{
      width: 56, height: 56, borderRadius: 16,
      background: 'var(--bg-2)', border: '1px solid var(--border-1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--fg-3)',
    }}><Icon name={icon} size={24} /></div>
    <div>
      <div style={{fontWeight: 600, marginBottom: 4}}>{title}</div>
      <div style={{color: 'var(--fg-2)', fontSize: 13}}>{body}</div>
    </div>
    {cta}
  </div>
);

// ---------- Copy button ----------
const CopyButton = ({ text, label = 'Copy', onCopy }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button className="btn btn-outline btn-sm" onClick={() => {
      try { navigator.clipboard.writeText(text); } catch(e) {}
      setCopied(true);
      onCopy && onCopy();
      setTimeout(() => setCopied(false), 1500);
    }}>
      <Icon name={copied ? 'check' : 'copy'} size={14} />
      {copied ? 'Copied' : label}
    </button>
  );
};

// Export everything to window
Object.assign(window, { Icon, VMark, VerBadge, VerCard, Avatar, MethodChip, useToast, Modal, Segmented, EmptyState, CopyButton, TIERS, METHOD_COLORS });
