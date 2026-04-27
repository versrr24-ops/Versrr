const { useState: useStateA, useEffect: useEffectA } = React;

// Tweaks — live-tweakable defaults
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "amber",
  "density": "comfortable",
  "showVerificationOnCards": true,
  "glowCTA": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweaks] = useStateA(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = useStateA(false);
  const [auth, setAuth] = useStateA(() => {
    try { return localStorage.getItem('vsr_auth') === '1'; } catch(e) { return true; }
  });
  const [authMode, setAuthMode] = useStateA('login');
  const [route, setRoute] = useStateA(() => {
    try { return JSON.parse(localStorage.getItem('vsr_route')) || { page: 'p2p' }; } catch(e) { return { page: 'p2p' }; }
  });
  const [trade, setTrade] = useStateA(null);
  const [notifOpen, setNotifOpen] = useStateA(false);
  const { show, ToastHost } = useToast();

  useEffectA(() => { try { localStorage.setItem('vsr_route', JSON.stringify(route)); } catch(e) {} }, [route]);
  useEffectA(() => { try { localStorage.setItem('vsr_auth', auth ? '1' : '0'); } catch(e) {} }, [auth]);

  // Edit mode protocol
  useEffectA(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const updateTweak = (k, v) => {
    setTweaks(t => {
      const next = { ...t, [k]: v };
      try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*'); } catch(e) {}
      return next;
    });
  };

  const go = (page, extra = {}) => setRoute({ page, ...extra });

  const openTrade = (vendor, direction, amount = 100) => {
    setTrade({ vendor, direction, amount, state: 'opened' });
    setRoute({ page: 'trade', role: 'buyer' });
  };

  const advance = (newState) => setTrade(t => ({ ...t, state: newState }));

  // Auth flow
  if (!auth) {
    return (
      <>
        <AuthPage mode={authMode} onSuccess={() => { setAuth(true); show('Welcome to Versrr', 'success'); }} onSwitch={() => setAuthMode(m => m === 'login' ? 'signup' : 'login')} />
        <ToastHost />
      </>
    );
  }

  const unread = VERSRR_DATA.notifications.filter(n => n.unread).length;

  const renderPage = () => {
    switch (route.page) {
      case 'p2p': return <P2PPage onOpenTrade={(v,d) => openTrade(v, d)} onCreate={() => go('p2p-create')} />;
      case 'p2p-create': return <CreateOfferPage onBack={() => go('p2p')} onPublish={() => { show('Offer published', 'success'); go('p2p'); }} />;
      case 'trade': return <TradePage
          trade={trade}
          role={route.role || 'buyer'}
          onBack={() => go('p2p')}
          onAdvance={advance}
          onCancel={() => { show('Trade cancelled'); go('p2p'); }}
          onDispute={() => go('dispute')}
          toast={show}
        />;
      case 'dispute': return <DisputePage onBack={() => go('trade')} toast={show} />;
      case 'lk': return <LKPage onCreate={() => go('lk-create')} onOpen={(lk) => go('lk-manage', { lk })} onOpenPublic={(lk) => go('lk-public', { lk })} />;
      case 'lk-create': return <CreateLKPage onBack={() => go('lk')} onCreated={(code) => go('lk-public', { lk: { code, rate: 1617, note: 'Just created' } })} />;
      case 'lk-public': return <LKPublicPage lk={route.lk} onBack={() => go('lk')} onOpenTrade={(v, amt) => openTrade(v, 'buy', amt)} />;
      case 'lk-manage': return <LKPage onCreate={() => go('lk-create')} onOpen={() => {}} onOpenPublic={(lk) => go('lk-public', { lk })} />;
      case 'hw': return <HWPage onCreate={() => go('hw-create')} onOpen={(l) => go('hw-detail', { listing: l })} />;
      case 'hw-create': return <CreateHWPage onBack={() => go('hw')} onPost={() => { show('Listing posted. Vendors are being notified.', 'success'); go('hw'); }} />;
      case 'hw-detail': return <HWDetailPage listing={route.listing} onBack={() => go('hw')} toast={show} />;
      case 'wallet': return <WalletPage onDeposit={() => go('wallet-deposit')} onWithdraw={() => go('wallet-withdraw')} />;
      case 'wallet-deposit': return <DepositPage onBack={() => go('wallet')} toast={show} />;
      case 'wallet-withdraw': return <WithdrawPage onBack={() => go('wallet')} toast={show} />;
      case 'api': return <APIPage />;
      case 'profile': return <ProfilePage onBack={() => go('p2p')} onSettings={() => go('settings')} />;
      case 'settings': return <SettingsPage onBack={() => go('profile')} />;
      default: return <P2PPage onOpenTrade={openTrade} onCreate={() => go('p2p-create')} />;
    }
  };

  const activeTab = route.page.startsWith('p2p') || route.page === 'trade' || route.page === 'dispute' ? 'p2p'
    : route.page.startsWith('lk') ? 'lk'
    : route.page.startsWith('hw') ? 'hw'
    : route.page.startsWith('wallet') ? 'wallet'
    : route.page === 'api' ? 'api'
    : 'p2p';

  return (
    <div className="app-shell" data-screen-label="Versrr App" style={tweaks.density === 'compact' ? { fontSize: 13 } : {}}>
      <TopBar
        onProfile={() => go('profile')}
        onBell={() => setNotifOpen(true)}
        unread={unread}
        onHome={() => go('p2p')}
      />
      <Sidebar active={activeTab} onChange={(t) => go(t)} />
      <main className="main">{renderPage()}</main>
      <BottomNav active={activeTab} onChange={(t) => go(t)} />
      <ToastHost />

      <Modal open={notifOpen} onClose={() => setNotifOpen(false)} title="Notifications">
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          {VERSRR_DATA.notifications.map(n => (
            <div key={n.id} style={{padding: 12, borderRadius: 10, background: n.unread ? 'rgba(124,58,237,0.08)' : 'var(--bg-1)', border: '1px solid var(--border-1)', display: 'flex', gap: 10, alignItems: 'flex-start'}}>
              <div style={{width: 32, height: 32, borderRadius: 8, background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon name={n.kind === 'bid' ? 'gift' : n.kind === 'verify' ? 'shield-check' : 'store'} size={14} />
              </div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 13}}>{n.msg}</div>
                <div style={{fontSize: 11, color: 'var(--fg-3)', marginTop: 2}}>{n.when}</div>
              </div>
              {n.unread && <span style={{width: 8, height: 8, borderRadius: 999, background: 'var(--amber-500)', marginTop: 6}} />}
            </div>
          ))}
        </div>
      </Modal>

      {/* Tweaks panel */}
      {editMode && (
        <div style={{
          position: 'fixed', bottom: 88, right: 16, zIndex: 50,
          background: 'var(--bg-2)', border: '1px solid var(--border-2)', borderRadius: 14,
          padding: 16, width: 260,
          boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <Icon name="settings" size={16} />
            <div style={{fontWeight: 600, fontSize: 14}}>Tweaks</div>
          </div>
          <div>
            <div style={{fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 6}}>CTA Accent</div>
            <Segmented full value={tweaks.accent} onChange={(v) => updateTweak('accent', v)} options={[{value:'amber',label:'Amber'},{value:'purple',label:'Purple'}]} />
          </div>
          <div>
            <div style={{fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 6}}>Density</div>
            <Segmented full value={tweaks.density} onChange={(v) => updateTweak('density', v)} options={[{value:'comfortable',label:'Comfortable'},{value:'compact',label:'Compact'}]} />
          </div>
          <div style={{borderTop: '1px solid var(--border-1)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8}}>
            <div style={{fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase'}}>Jump to trade state</div>
            {['opened','active','paid','complete'].map(s => (
              <button key={s} className="btn btn-outline btn-sm" onClick={() => { if (!trade) setTrade({ vendor: VERSRR_DATA.vendors[0], direction: 'buy', amount: 100, state: s }); else advance(s); go('trade', { role: 'buyer' }); }}>
                Buyer · {s}
              </button>
            ))}
            <button className="btn btn-outline btn-sm" onClick={() => { setTrade({ vendor: VERSRR_DATA.vendors[0], direction: 'buy', amount: 100, state: 'paid' }); go('trade', { role: 'vendor' }); }}>
              Vendor view · paid (verify ID)
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => setAuth(false)}>Sign out (see auth)</button>
          </div>
        </div>
      )}

      {/* accent style override via tweak */}
      <style>{tweaks.accent === 'purple' ? `
        .btn-amber { background: var(--purple-800) !important; color: white !important; }
        .btn-amber:hover { background: var(--purple-700) !important; }
      ` : ''}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
