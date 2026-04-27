const { useState: useStateP, useEffect: useEffectP, useMemo: useMemoP } = React;

// ---------- Offer card ----------
const OfferCard = ({ vendor, direction, onTrade, currency = 'USDT' }) => {
  const rate = direction === 'buy' ? vendor.rateBuy : vendor.rateSell;
  return (
    <div className="card" style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      <div style={{display: 'flex', alignItems: 'flex-start', gap: 12}}>
        <Avatar name={vendor.name} size={40} tier={vendor.tier} />
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap'}}>
            <span style={{fontWeight: 600, fontSize: 14}}>{vendor.name}</span>
            {vendor.active && <span style={{display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--success)'}}>
              <span className="pulse-dot" style={{width: 6, height: 6, borderRadius: 999, background: 'var(--success)'}} />online
            </span>}
          </div>
          <div style={{marginTop: 6}}>
            <VerBadge tier={vendor.tier} count={vendor.ver} size="sm" />
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div className="mono" style={{fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em'}}>₦{rate.toLocaleString()}</div>
          <div style={{fontSize: 11, color: 'var(--fg-3)'}}>per {currency}</div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '10px 12px', background: 'var(--bg-1)', borderRadius: 10, border: '1px solid var(--border-1)'}}>
        <div><div style={{fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.04em'}}>Range</div><div className="mono" style={{fontSize: 12, fontWeight: 600, marginTop: 2}}>${vendor.min}–${vendor.max.toLocaleString()}</div></div>
        <div><div style={{fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.04em'}}>Completion</div><div className="mono" style={{fontSize: 12, fontWeight: 600, marginTop: 2}}>{vendor.completion}%</div></div>
        <div><div style={{fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.04em'}}>Trades</div><div className="mono" style={{fontSize: 12, fontWeight: 600, marginTop: 2}}>{vendor.trades.toLocaleString()}</div></div>
      </div>

      <div style={{display: 'flex', flexWrap: 'wrap', gap: 4}}>
        {vendor.methods.map(m => <MethodChip key={m} method={m} />)}
        {vendor.flags.map(f => <span key={f} style={{fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(245,158,11,0.1)', color: 'var(--amber-500)', border: '1px solid rgba(245,158,11,0.2)'}}>{f}</span>)}
      </div>

      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12}}>
        <span style={{fontSize: 11, color: 'var(--fg-3)'}}>Last trade {vendor.lastTrade}</span>
        <button className="btn btn-amber btn-sm" onClick={onTrade}>
          {direction === 'buy' ? 'Buy' : 'Sell'} {currency}
          <Icon name="arrow-right" size={14} />
        </button>
      </div>
    </div>
  );
};

// ---------- P2P page ----------
const P2PPage = ({ onOpenTrade, onCreate }) => {
  const [direction, setDirection] = useStateP('buy');
  const [currency, setCurrency] = useStateP('USDT');
  const [payment, setPayment] = useStateP('All');
  const [amount, setAmount] = useStateP('');
  const [sort, setSort] = useStateP('price');

  const offers = useMemoP(() => {
    let list = [...VERSRR_DATA.vendors];
    if (payment !== 'All') list = list.filter(v => v.methods.includes(payment));
    if (sort === 'price') list.sort((a,b) => direction === 'buy' ? a.rateBuy - b.rateBuy : b.rateSell - a.rateSell);
    if (sort === 'completion') list.sort((a,b) => b.completion - a.completion);
    if (sort === 'trades') list.sort((a,b) => b.trades - a.trades);
    return list;
  }, [direction, payment, sort]);

  return (
    <div className="fade-in">
      <PageHeader title="P2P Marketplace" subtitle={`${offers.length} offers available`} />

      {/* Buy/Sell toggle */}
      <div style={{marginBottom: 12}}>
        <Segmented full value={direction} onChange={setDirection} options={[{value:'buy',label:'Buy'},{value:'sell',label:'Sell'}]} accent="amber" />
      </div>

      {/* Filter row */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16}}>
        <select className="input" value={currency} onChange={e=>setCurrency(e.target.value)} style={{padding: '10px 12px', fontSize: 13}}>
          <option value="USDT">USDT</option><option value="USDC">USDC</option>
        </select>
        <select className="input" value={payment} onChange={e=>setPayment(e.target.value)} style={{padding: '10px 12px', fontSize: 13}}>
          <option>All</option><option>Opay</option><option>PalmPay</option><option>Kuda</option><option>Bank Transfer</option><option>Moniepoint</option>
        </select>
        <input className="input" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} style={{padding: '10px 12px', fontSize: 13}} />
      </div>

      {/* Sort */}
      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 12}}>
        <span style={{color: 'var(--fg-3)'}}>Sort by</span>
        {[{v:'price',l:'Best Rate'},{v:'completion',l:'Completion'},{v:'trades',l:'Volume'}].map(o => (
          <button key={o.v} onClick={()=>setSort(o.v)} style={{
            padding: '4px 10px', borderRadius: 6,
            background: sort === o.v ? 'rgba(124,58,237,0.15)' : 'transparent',
            color: sort === o.v ? 'var(--violet-400)' : 'var(--fg-2)',
            fontSize: 12, fontWeight: 500,
            border: sort === o.v ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
          }}>{o.l}</button>
        ))}
      </div>

      <div style={{display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'}}>
        {offers.map(v => <OfferCard key={v.id} vendor={v} direction={direction} currency={currency} onTrade={() => onOpenTrade(v, direction)} />)}
      </div>

      <FAB onClick={onCreate} icon="plus" label="Create Offer" />
    </div>
  );
};

// ---------- Create Offer (compact form) ----------
const CreateOfferPage = ({ onBack, onPublish }) => {
  const [dir, setDir] = useStateP('sell');
  const [rate, setRate] = useStateP('1618');
  const [min, setMin] = useStateP('50');
  const [max, setMax] = useStateP('2000');
  const [methods, setMethods] = useStateP(['Opay', 'Kuda']);
  const [terms, setTerms] = useStateP('');
  const [verReq, setVerReq] = useStateP('any');

  const toggleMethod = (m) => setMethods(mm => mm.includes(m) ? mm.filter(x=>x!==m) : [...mm, m]);

  return (
    <div className="fade-in" style={{maxWidth: 560}}>
      <PageHeader title="Create Offer" subtitle="Publish a public rate to the marketplace" back={onBack} />
      <div className="card" style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <div>
          <div style={{fontSize: 12, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8}}>Direction</div>
          <Segmented value={dir} onChange={setDir} options={[{value:'buy',label:'I\'m Buying'},{value:'sell',label:'I\'m Selling'}]} accent="purple" />
        </div>
        <label className="field">Rate (₦ per USDT)
          <input className="input mono" value={rate} onChange={e=>setRate(e.target.value)} />
        </label>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
          <label className="field">Min ($)<input className="input mono" value={min} onChange={e=>setMin(e.target.value)} /></label>
          <label className="field">Max ($)<input className="input mono" value={max} onChange={e=>setMax(e.target.value)} /></label>
        </div>
        <div>
          <div style={{fontSize: 12, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8}}>Payment Methods</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
            {['Opay', 'PalmPay', 'Kuda', 'Bank Transfer', 'Moniepoint', 'GTB'].map(m => (
              <button key={m} onClick={()=>toggleMethod(m)} style={{
                padding: '8px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                border: methods.includes(m) ? '1px solid var(--purple-700)' : '1px solid var(--border-1)',
                background: methods.includes(m) ? 'rgba(124,58,237,0.12)' : 'var(--bg-1)',
                color: methods.includes(m) ? 'var(--violet-400)' : 'var(--fg-1)',
              }}>{m}</button>
            ))}
          </div>
        </div>
        <label className="field">Verification requirement
          <select className="input" value={verReq} onChange={e=>setVerReq(e.target.value)}>
            <option value="any">Any user</option><option value="1">1+ verifications</option><option value="3">3+ verifications</option><option value="5">5+ verifications</option>
          </select>
        </label>
        <label className="field">Offer terms
          <textarea className="input" rows={3} placeholder="Pay from your own bank. Same-name payments only." value={terms} onChange={e=>setTerms(e.target.value)} />
        </label>
        <button className="btn btn-amber btn-full" onClick={onPublish}>Publish Offer</button>
      </div>
    </div>
  );
};

Object.assign(window, { P2PPage, CreateOfferPage, OfferCard });
