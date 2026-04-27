const { useState: useState2, useEffect: useEffect2, useMemo: useMemo2 } = React;

// Navigation items
const NAV_ITEMS = [
  { id: 'p2p', label: 'P2P', sub: 'Marketplace', icon: 'store' },
  { id: 'lk', label: 'LK', sub: 'Lock Trade', icon: 'lock' },
  { id: 'hw', label: 'H&W', sub: 'Gift Cards', icon: 'gift' },
  { id: 'wallet', label: 'Wallet', sub: 'Balance', icon: 'wallet' },
  { id: 'api', label: 'API', sub: 'Waitlist', icon: 'api' },
];

const TopBar = ({ onProfile, onBell, unread, onHome }) => {
  return (
    <header className="topbar">
      <button onClick={onHome} style={{display: 'flex', alignItems: 'center', gap: 10, padding: 4, borderRadius: 8}}>
        <VMark size={26} color="#A78BFA" />
        <span style={{fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em'}}>versrr</span>
        <span style={{fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: 'rgba(124,58,237,0.18)', color: '#C4B5FD', border: '1px solid rgba(124,58,237,0.35)'}}>BETA</span>
      </button>
      <div style={{flex: 1}} />
      <button onClick={onBell} style={{position: 'relative', padding: 8, borderRadius: 10, color: 'var(--fg-1)'}}>
        <Icon name="bell" size={20} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 8, height: 8, borderRadius: 999,
            background: 'var(--amber-500)', border: '2px solid var(--bg-0)',
          }} />
        )}
      </button>
      <button onClick={onProfile} style={{padding: 2, borderRadius: 999}}>
        <Avatar name={VERSRR_DATA.me.name} size={32} tier={VERSRR_DATA.me.tier} />
      </button>
    </header>
  );
};

const BottomNav = ({ active, onChange }) => (
  <nav className="bottomnav">
    {NAV_ITEMS.map(item => {
      const isActive = active === item.id;
      return (
        <button key={item.id} onClick={() => onChange(item.id)} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 3, padding: '8px 4px',
          color: isActive ? 'var(--violet-400)' : 'var(--fg-3)',
          position: 'relative',
        }}>
          {isActive && <span style={{position: 'absolute', top: 0, width: 28, height: 2, background: 'var(--violet-400)', borderRadius: 0}} />}
          <Icon name={item.icon} size={20} stroke={isActive ? 2 : 1.6} />
          <span style={{fontSize: 10, fontWeight: 600, letterSpacing: 0.02}}>{item.label}</span>
        </button>
      );
    })}
  </nav>
);

const Sidebar = ({ active, onChange }) => (
  <aside className="sidebar">
    {NAV_ITEMS.map(item => {
      const isActive = active === item.id;
      return (
        <button key={item.id} onClick={() => onChange(item.id)} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px', borderRadius: 10,
          background: isActive ? 'rgba(124,58,237,0.12)' : 'transparent',
          color: isActive ? 'var(--violet-400)' : 'var(--fg-1)',
          fontWeight: isActive ? 600 : 500,
          border: isActive ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
          textAlign: 'left',
        }}>
          <Icon name={item.icon} size={18} stroke={isActive ? 2 : 1.6} />
          <div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.2}}>
            <span style={{fontSize: 14}}>{item.label}</span>
            <span style={{fontSize: 11, color: 'var(--fg-3)', fontWeight: 400}}>{item.sub}</span>
          </div>
        </button>
      );
    })}
    <div style={{flex: 1}} />
    <div style={{padding: 12, borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border-1)', fontSize: 12, color: 'var(--fg-2)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: 'var(--fg-1)'}}>
        <Icon name="shield" size={14} />
        <span style={{fontWeight: 600}}>Escrow Secured</span>
      </div>
      All funds held on-chain via smart contract. Built on BNB Smart Chain.
    </div>
  </aside>
);

// ---------- Page Header (with back btn) ----------
const PageHeader = ({ title, subtitle, back, actions }) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
    {back && <button onClick={back} className="btn-ghost" style={{padding: 8, borderRadius: 10, display: 'flex'}}><Icon name="arrow-left" size={18} /></button>}
    <div style={{flex: 1, minWidth: 0}}>
      <h1 style={{margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em'}}>{title}</h1>
      {subtitle && <p style={{margin: '2px 0 0', fontSize: 13, color: 'var(--fg-2)'}}>{subtitle}</p>}
    </div>
    {actions}
  </div>
);

// ---------- Floating Action Button ----------
const FAB = ({ onClick, icon = 'plus', label }) => (
  <button onClick={onClick} style={{
    position: 'fixed', bottom: 88, right: 16, zIndex: 20,
    background: 'var(--purple-800)', color: 'white',
    borderRadius: 999, height: 52,
    padding: label ? '0 20px 0 16px' : '0',
    width: label ? 'auto' : 52,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontWeight: 600, fontSize: 14,
    boxShadow: 'var(--glow-purple)', border: '1px solid rgba(167,139,250,0.4)',
  }}>
    <Icon name={icon} size={20} />{label && <span>{label}</span>}
  </button>
);

Object.assign(window, { NAV_ITEMS, TopBar, BottomNav, Sidebar, PageHeader, FAB });
