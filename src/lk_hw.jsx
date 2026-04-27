const { useState: useStateL, useMemo: useMemoL } = React;

// ---------- Lock Trade home ----------
const LKPage = ({ onCreate, onOpen, onOpenPublic }) => {
  const [tab, setTab] = useStateL('mine');
  const mine = VERSRR_DATA.lockTrades;
  return (
    <div className="fade-in">
      <PageHeader title="Lock Trade" subtitle="Private tradeable links you can share on WhatsApp or Telegram" />
      <div style={{marginBottom: 16}}>
        <Segmented value={tab} onChange={setTab} options={[{value:'mine',label:'My Lock Trades'},{value:'received',label:'Received'}]} accent="purple" />
      </div>
      {tab === 'mine' ? (
        <div style={{display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'}}>
          {mine.map(lk => (
            <div key={lk.code} className="card" style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <span className="mono" style={{fontSize: 15, fontWeight: 700, color: 'var(--violet-400)'}}>{lk.code}</span>
                    <span style={{fontSize: 10, padding: '2px 6px', borderRadius: 4, background: lk.type === 'vendor' ? 'rgba(245,158,11,0.12)' : 'rgba(124,58,237,0.15)', color: lk.type === 'vendor' ? 'var(--amber-500)' : 'var(--violet-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em'}}>
                      {lk.type === 'vendor' ? 'Selling' : 'Buying'}
                    </span>
                  </div>
                  <div style={{fontSize: 12, color: 'var(--fg-2)', marginTop: 4}}>{lk.note}</div>
                </div>
                <span style={{fontSize: 11, padding: '3px 8px', borderRadius: 999, background: 'var(--success-bg)', color: 'var(--success)'}}>● {lk.status}</span>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '10px 12px', background: 'var(--bg-1)', borderRadius: 10}}>
                {lk.type === 'vendor' ? (
                  <>
                    <div><div style={{fontSize: 10, color: 'var(--fg-3)'}}>Rate</div><div className="mono" style={{fontWeight: 600, fontSize: 13}}>₦{lk.rate.toLocaleString()}</div></div>
                    <div><div style={{fontSize: 10, color: 'var(--fg-3)'}}>Range</div><div className="mono" style={{fontWeight: 600, fontSize: 13}}>${lk.min}–${lk.max}</div></div>
                    <div><div style={{fontSize: 10, color: 'var(--fg-3)'}}>Active trades</div><div className="mono" style={{fontWeight: 600, fontSize: 13}}>{lk.activeTrades}</div></div>
                    <div><div style={{fontSize: 10, color: 'var(--fg-3)'}}>Created</div><div style={{fontWeight: 600, fontSize: 13}}>{lk.created}</div></div>
                  </>
                ) : (
                  <>
                    <div><div style={{fontSize: 10, color: 'var(--fg-3)'}}>Amount wanted</div><div className="mono" style={{fontWeight: 600, fontSize: 13}}>${lk.amount}</div></div>
                    <div><div style={{fontSize: 10, color: 'var(--fg-3)'}}>Bids</div><div className="mono" style={{fontWeight: 600, fontSize: 13}}>{lk.bids}</div></div>
                    <div><div style={{fontSize: 10, color: 'var(--fg-3)'}}>Created</div><div style={{fontWeight: 600, fontSize: 13}}>{lk.created}</div></div>
                  </>
                )}
              </div>
              <div style={{display: 'flex', gap: 8}}>
                <button className="btn btn-outline btn-sm" style={{flex: 1}} onClick={() => onOpenPublic(lk)}><Icon name="external" size={14} /> Public view</button>
                <button className="btn btn-purple btn-sm" style={{flex: 1}} onClick={() => onOpen(lk)}>Manage</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="lock" title="No received Lock Trades" body="When you click a vendor's link, it will appear here." />
      )}
      <FAB onClick={onCreate} icon="plus" label="Create Lock Trade" />
    </div>
  );
};

// ---------- Create Lock Trade ----------
const CreateLKPage = ({ onBack, onCreated }) => {
  const [dir, setDir] = useStateL('vendor');
  const [rate, setRate] = useStateL('1617');
  const [min, setMin] = useStateL('100');
  const [max, setMax] = useStateL('2000');
  const [note, setNote] = useStateL('');
  const [expiry, setExpiry] = useStateL('24h');
  const [done, setDone] = useStateL(null);

  const handleCreate = () => {
    const code = 'LK-' + Math.random().toString(36).slice(2,6).toUpperCase();
    setDone(code);
  };

  if (done) {
    const url = `versrr.com/lk/${done}`;
    return (
      <div className="fade-in" style={{maxWidth: 520}}>
        <PageHeader title="Lock Trade created" subtitle="Share this link anywhere" back={onBack} />
        <div className="card" style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, padding: 24}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
            <div style={{width: 64, height: 64, borderRadius: 16, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon name="check" size={28} stroke={3} />
            </div>
            <div className="mono" style={{fontSize: 22, fontWeight: 700, color: 'var(--violet-400)'}}>{done}</div>
          </div>
          <div style={{padding: 14, background: 'var(--bg-1)', borderRadius: 10, border: '1px solid var(--border-1)', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between'}}>
            <span className="mono" style={{fontSize: 13, color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis'}}>{url}</span>
            <CopyButton text={`https://${url}`} />
          </div>
          <div style={{display: 'flex', gap: 8}}>
            <button className="btn btn-outline" style={{flex: 1, background: 'rgba(0,185,107,0.1)', borderColor: 'rgba(0,185,107,0.3)', color: '#34D399'}}><Icon name="whatsapp" size={16} />WhatsApp</button>
            <button className="btn btn-outline" style={{flex: 1, background: 'rgba(37,99,235,0.1)', borderColor: 'rgba(37,99,235,0.3)', color: '#60A5FA'}}><Icon name="telegram" size={16} />Telegram</button>
          </div>
          <button className="btn btn-purple btn-full" onClick={() => onCreated(done)}>View Lock Trade</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{maxWidth: 560}}>
      <PageHeader title="Create Lock Trade" subtitle="Private link for direct trades" back={onBack} />
      <div className="card" style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <div>
          <div style={{fontSize: 12, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8}}>Direction</div>
          <Segmented value={dir} onChange={setDir} options={[{value:'vendor',label:"I'm Selling"},{value:'buyer',label:"I'm Buying"}]} accent="purple" />
        </div>
        {dir === 'vendor' ? (
          <>
            <label className="field">Rate (₦ per USDT)<input className="input mono" value={rate} onChange={e=>setRate(e.target.value)} /></label>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
              <label className="field">Min ($)<input className="input mono" value={min} onChange={e=>setMin(e.target.value)} /></label>
              <label className="field">Max ($)<input className="input mono" value={max} onChange={e=>setMax(e.target.value)} /></label>
            </div>
          </>
        ) : (
          <label className="field">Amount wanted ($)<input className="input mono" value={min} onChange={e=>setMin(e.target.value)} /></label>
        )}
        <label className="field">Offer note<textarea className="input" rows={2} placeholder="WhatsApp group rate — fast release" value={note} onChange={e=>setNote(e.target.value)} /></label>
        <label className="field">Expiry
          <select className="input" value={expiry} onChange={e=>setExpiry(e.target.value)}>
            <option value="1h">1 hour</option><option value="6h">6 hours</option><option value="24h">24 hours</option><option value="1w">1 week</option><option value="never">No expiry</option>
          </select>
        </label>
        <button className="btn btn-amber btn-full" onClick={handleCreate}>Create Lock Trade</button>
      </div>
    </div>
  );
};

// ---------- Lock Trade public page ----------
const LKPublicPage = ({ lk, onBack, onOpenTrade }) => {
  const [amount, setAmount] = useStateL('100');
  const vendor = VERSRR_DATA.vendors[0];
  return (
    <div className="fade-in" style={{maxWidth: 520}}>
      <PageHeader title="Lock Trade" subtitle={<span className="mono" style={{color:'var(--violet-400)'}}>{lk?.code || 'LK-7XQ2'}</span>} back={onBack} />
      <div className="card" style={{marginBottom: 12}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12}}>
          <Avatar name={vendor.name} size={44} tier={vendor.tier} />
          <div style={{flex: 1}}>
            <div style={{fontWeight: 600}}>{vendor.name}</div>
            <div style={{fontSize: 11, color: 'var(--fg-2)', marginTop: 2}}>{vendor.completion}% · {vendor.trades} trades</div>
          </div>
          <VerBadge tier={vendor.tier} count={vendor.ver} size="sm" />
        </div>
        <div style={{padding: 14, background: 'var(--bg-1)', borderRadius: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
          <div><div style={{fontSize: 10, color: 'var(--fg-3)', textTransform:'uppercase'}}>Rate</div><div className="mono" style={{fontWeight: 700, fontSize: 18, marginTop: 2}}>₦{(lk?.rate || 1617).toLocaleString()}</div></div>
          <div><div style={{fontSize: 10, color: 'var(--fg-3)', textTransform:'uppercase'}}>Range</div><div className="mono" style={{fontWeight: 600, fontSize: 14, marginTop: 2}}>$100–$2,000</div></div>
        </div>
        <div style={{marginTop: 12, padding: 12, borderRadius: 10, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)'}}>
          <div style={{fontSize: 11, color: 'var(--violet-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4}}>Note</div>
          <div style={{fontSize: 13}}>{lk?.note || 'WhatsApp group rate — fast release'}</div>
        </div>
      </div>
      <div className="card">
        <label className="field" style={{marginBottom: 12}}>Amount ($)<input className="input mono" value={amount} onChange={e=>setAmount(e.target.value)} /></label>
        <button className="btn btn-amber btn-full" onClick={() => onOpenTrade(vendor, parseFloat(amount) || 100)}>Open Trade</button>
      </div>
    </div>
  );
};

// ---------- H&W gift card feed ----------
const CARD_COLORS = { Apple: '#A1A1A6', Amazon: '#FF9900', Steam: '#1B2838', 'Google Play': '#34A853', iTunes: '#FC3158', Nike: '#111111' };

const HWPage = ({ onCreate, onOpen }) => {
  const [tab, setTab] = useStateL('browse');
  const feed = VERSRR_DATA.hwListings;
  return (
    <div className="fade-in">
      <PageHeader title="H&W Gift Cards" subtitle="I Have · I Want — reverse auction marketplace" />
      <div style={{marginBottom: 16}}>
        <Segmented value={tab} onChange={setTab} options={[{value:'browse',label:'Browse'},{value:'mine',label:'My Listings'}]} accent="purple" />
      </div>
      <div style={{display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'}}>
        {feed.map(l => (
          <button key={l.id} onClick={() => onOpen(l)} className="card" style={{display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.15s', padding: 16}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: CARD_COLORS[l.card] || '#374151',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: 16,
              }}>{l.card[0]}</div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontWeight: 600, fontSize: 14}}>{l.card} Gift Card</div>
                <div style={{fontSize: 11, color: 'var(--fg-2)'}}>Posted by {l.user} · <VerBadge tier="peer" count={l.ver} size="sm" /></div>
              </div>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '10px 12px', background: 'var(--bg-1)', borderRadius: 10}}>
              <div><div style={{fontSize: 10, color: 'var(--fg-3)', textTransform:'uppercase'}}>Card value</div><div className="mono" style={{fontWeight: 700, fontSize: 16, marginTop: 2}}>${l.amount}</div></div>
              <div><div style={{fontSize: 10, color: 'var(--fg-3)', textTransform:'uppercase'}}>Wants</div><div className="mono" style={{fontWeight: 700, fontSize: 16, marginTop: 2, color: 'var(--amber-500)'}}>{l.rate}%</div></div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <span style={{fontSize: 11, color: l.active ? 'var(--success)' : 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 4}}>
                {l.active ? <><span className="pulse-dot" style={{width:6,height:6,borderRadius:999,background:'var(--success)'}}/>Open · {Math.floor(l.remaining/60)}:{(l.remaining%60).toString().padStart(2,'0')} left</> : 'Closed'}
              </span>
              <span style={{fontSize: 11, color: 'var(--fg-2)'}}>{l.bids} bids</span>
            </div>
          </button>
        ))}
      </div>
      <FAB onClick={onCreate} icon="plus" label="I Have a Card" />
    </div>
  );
};

// ---------- H&W Detail ----------
const HWDetailPage = ({ listing, onBack, toast }) => {
  const [bids, setBids] = useStateL([
    { id: 1, vendor: 'John Okafor', ver: 213, tier: 'trusted', rate: 80, funded: true, when: '1m ago' },
    { id: 2, vendor: 'Chiamaka Obi', ver: 147, tier: 'trusted', rate: 78, funded: true, when: '3m ago' },
    { id: 3, vendor: 'Tunde Balogun', ver: 88, tier: 'vendor', rate: 76, funded: false, when: '5m ago' },
  ]);

  const accept = (b) => {
    toast && toast(`Accepted ${b.vendor}'s bid at ${b.rate}%. Trade opening…`, 'success');
    setBids(bb => bb.filter(x => x.id !== b.id));
  };

  return (
    <div className="fade-in" style={{maxWidth: 640}}>
      <PageHeader title={`${listing.card} $${listing.amount}`} subtitle={`Wants ${listing.rate}% · ${Math.floor(listing.remaining/60)}:${(listing.remaining%60).toString().padStart(2,'0')} left`} back={onBack} />
      <div className="card" style={{marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{width: 56, height: 56, borderRadius: 12, background: CARD_COLORS[listing.card] || '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 20}}>{listing.card[0]}</div>
        <div style={{flex: 1}}>
          <div style={{fontWeight: 700, fontSize: 18}}>{listing.card} ${listing.amount}</div>
          <div style={{fontSize: 12, color: 'var(--fg-2)'}}>Desired rate <span className="mono" style={{color: 'var(--amber-500)', fontWeight: 600}}>{listing.rate}%</span> · up to <span className="mono">${Math.round(listing.amount * listing.rate / 100)} USDT</span></div>
        </div>
      </div>

      <div style={{fontSize: 12, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '20px 0 10px'}}>Incoming bids ({bids.length})</div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
        {bids.map(b => (
          <div key={b.id} className="card" style={{display: 'flex', alignItems: 'center', gap: 12, padding: 14}}>
            <Avatar name={b.vendor} size={40} tier={b.tier} />
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap'}}>
                <span style={{fontWeight: 600, fontSize: 14}}>{b.vendor}</span>
                <VerBadge tier={b.tier} count={b.ver} size="sm" />
              </div>
              <div style={{fontSize: 11, color: 'var(--fg-3)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8}}>
                <span>{b.when}</span>
                {b.funded ? <span style={{padding: '2px 6px', borderRadius: 4, background: 'var(--success-bg)', color: 'var(--success)', fontWeight: 600}}>● Funded</span> : <span style={{padding: '2px 6px', borderRadius: 4, background: 'var(--bg-3)', color: 'var(--fg-3)', fontWeight: 600}}>Not Funded</span>}
              </div>
            </div>
            <div style={{textAlign: 'right'}}>
              <div className="mono" style={{fontSize: 18, fontWeight: 700, color: b.rate >= listing.rate ? 'var(--success)' : 'var(--fg-1)'}}>{b.rate}%</div>
              <div className="mono" style={{fontSize: 11, color: 'var(--fg-3)'}}>${Math.round(listing.amount * b.rate / 100)} USDT</div>
            </div>
            <button className="btn btn-amber btn-sm" onClick={() => accept(b)}>Accept</button>
          </div>
        ))}
        {bids.length === 0 && <EmptyState icon="gift" title="All bids resolved" body="Trade has opened with the accepted bidder." />}
      </div>
    </div>
  );
};

const CreateHWPage = ({ onBack, onPost }) => {
  const [card, setCard] = useStateL('Apple');
  const [amount, setAmount] = useStateL('100');
  const [rate, setRate] = useStateL('75');
  const [window, setWindow] = useStateL('10');
  return (
    <div className="fade-in" style={{maxWidth: 520}}>
      <PageHeader title="I Have a Card" subtitle="Post a gift card for vendors to bid on" back={onBack} />
      <div className="card" style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <div>
          <div style={{fontSize: 12, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8}}>
            <span style={{color: 'var(--violet-400)', fontWeight: 700}}>H</span> — I Have
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
            {['Apple', 'Amazon', 'Steam', 'Google Play', 'iTunes', 'Nike'].map(c => (
              <button key={c} onClick={()=>setCard(c)} style={{
                padding: '8px 12px', borderRadius: 8, fontSize: 13,
                background: card === c ? 'var(--purple-800)' : 'var(--bg-1)',
                color: card === c ? 'white' : 'var(--fg-1)',
                border: card === c ? '1px solid var(--purple-700)' : '1px solid var(--border-1)',
                fontWeight: 500,
              }}>{c}</button>
            ))}
          </div>
        </div>
        <label className="field">Card value (USD)<input className="input mono" value={amount} onChange={e=>setAmount(e.target.value)} /></label>
        <div>
          <div style={{fontSize: 12, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8}}>
            <span style={{color: 'var(--amber-500)', fontWeight: 700}}>W</span> — I Want
          </div>
          <label className="field">Desired rate (%)<input className="input mono" value={rate} onChange={e=>setRate(e.target.value)} /></label>
          <div style={{fontSize: 11, color: 'var(--fg-3)', marginTop: 6}}>Vendors will bid at or above your rate. You'll receive up to <span className="mono" style={{color: 'var(--amber-500)'}}>${Math.round(amount * rate / 100)} USDT</span>.</div>
        </div>
        <label className="field">Bidding window
          <select className="input" value={window} onChange={e=>setWindow(e.target.value)}>
            <option value="5">5 minutes</option><option value="10">10 minutes</option><option value="15">15 minutes</option><option value="30">30 minutes</option>
          </select>
        </label>
        <button className="btn btn-amber btn-full" onClick={onPost}>Post Listing</button>
      </div>
    </div>
  );
};

Object.assign(window, { LKPage, CreateLKPage, LKPublicPage, HWPage, HWDetailPage, CreateHWPage });
