const { useState: useStateW } = React;

// ---------- Wallet ----------
const WalletPage = ({ onDeposit, onWithdraw }) => {
  const me = VERSRR_DATA.me;
  const [filter, setFilter] = useStateW('all');
  const txs = VERSRR_DATA.txs.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'deposits') return t.kind === 'deposit';
    if (filter === 'withdrawals') return t.kind === 'withdraw';
    if (filter === 'escrow') return t.kind.startsWith('escrow');
    return true;
  });
  const total = me.balances.USDT + me.balances.USDC + me.balances.USDT_locked + me.balances.USDC_locked;

  return (
    <div className="fade-in" style={{maxWidth: 720}}>
      <PageHeader title="Wallet" subtitle="Balances and transactions" />
      <div style={{
        padding: 24, borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(76,29,149,0.25))',
        border: '1px solid rgba(124,58,237,0.35)',
        marginBottom: 16, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{position: 'absolute', top: -40, right: -40, opacity: 0.1}}><VMark size={180} color="#A78BFA" /></div>
        <div style={{fontSize: 12, color: 'var(--violet-400)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase'}}>Total balance</div>
        <div className="mono" style={{fontSize: 40, fontWeight: 700, marginTop: 4, letterSpacing: '-0.02em'}}>${total.toFixed(2)}</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20}}>
          <div style={{padding: 12, background: 'rgba(0,0,0,0.25)', borderRadius: 10}}>
            <div style={{fontSize: 11, color: 'var(--fg-2)'}}>Available</div>
            <div className="mono" style={{fontSize: 18, fontWeight: 600, marginTop: 2}}>${me.balances.USDT.toFixed(2)}<span style={{fontSize: 11, color: 'var(--fg-3)', marginLeft: 4}}>USDT</span></div>
          </div>
          <div style={{padding: 12, background: 'rgba(0,0,0,0.25)', borderRadius: 10}}>
            <div style={{fontSize: 11, color: 'var(--fg-2)', display: 'flex', alignItems: 'center', gap: 4}}>Locked <Icon name="info" size={10} /></div>
            <div className="mono" style={{fontSize: 18, fontWeight: 600, marginTop: 2, color: 'var(--amber-500)'}}>${me.balances.USDT_locked.toFixed(2)}<span style={{fontSize: 11, color: 'var(--fg-3)', marginLeft: 4}}>USDT</span></div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 10, marginTop: 20}}>
          <button className="btn btn-purple" style={{flex: 1}} onClick={onDeposit}><Icon name="download" size={16} />Deposit</button>
          <button className="btn btn-outline" style={{flex: 1, borderColor: 'rgba(255,255,255,0.15)'}} onClick={onWithdraw}><Icon name="upload" size={16} />Withdraw</button>
        </div>
      </div>

      <div style={{display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 12, paddingBottom: 4}}>
        {['all','deposits','withdrawals','escrow'].map(f => (
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
            background: filter === f ? 'rgba(124,58,237,0.15)' : 'var(--bg-2)',
            color: filter === f ? 'var(--violet-400)' : 'var(--fg-2)',
            border: filter === f ? '1px solid rgba(124,58,237,0.3)' : '1px solid var(--border-1)',
            textTransform: 'capitalize',
          }}>{f}</button>
        ))}
      </div>

      <div className="card" style={{padding: 0, overflow: 'hidden'}}>
        {txs.map((t,i) => {
          const icon = t.kind === 'deposit' ? 'download' : t.kind === 'withdraw' ? 'upload' : t.kind === 'escrow-lock' ? 'lock' : t.kind === 'escrow-release' ? 'check-circle' : 'info';
          const color = t.amount > 0 ? 'var(--success)' : t.kind === 'escrow-lock' ? 'var(--amber-500)' : 'var(--fg-1)';
          return (
            <div key={t.id} style={{display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderBottom: i < txs.length - 1 ? '1px solid var(--border-1)' : 'none'}}>
              <div style={{width: 36, height: 36, borderRadius: 10, background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-1)'}}><Icon name={icon} size={16} /></div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontSize: 13, fontWeight: 500}}>{t.desc}</div>
                <div style={{fontSize: 11, color: 'var(--fg-3)'}}>{t.when}{t.hash && ` · `}{t.hash && <a href="#" style={{color: 'var(--fg-3)'}}>{t.hash}</a>}</div>
              </div>
              <div className="mono" style={{fontWeight: 600, color, fontSize: 14}}>{t.amount > 0 ? '+' : ''}{t.amount.toFixed(2)} {t.asset}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Deposit ----------
const DepositPage = ({ onBack, toast }) => {
  const [asset, setAsset] = useStateW('USDT');
  const addr = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bCa3';
  return (
    <div className="fade-in" style={{maxWidth: 480}}>
      <PageHeader title="Deposit" subtitle="Receive USDT or USDC on BNB Smart Chain" back={onBack} />
      <div className="card" style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <Segmented full value={asset} onChange={setAsset} options={[{value:'USDT',label:'USDT'},{value:'USDC',label:'USDC'}]} accent="purple" />
        <div style={{padding: 12, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start'}}>
          <Icon name="alert" size={16} />
          <div style={{fontSize: 12, color: 'var(--fg-1)'}}>Only send <strong>{asset}</strong> on <strong>BNB Smart Chain (BEP-20)</strong>. Other tokens or networks will be lost.</div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', padding: 20, background: 'var(--bg-1)', borderRadius: 14}}>
          <div style={{
            width: 180, height: 180, background: 'white',
            display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gridTemplateRows: 'repeat(16, 1fr)',
            padding: 10, borderRadius: 8,
          }}>
            {Array.from({length: 256}).map((_, i) => {
              const x = i % 16, y = Math.floor(i / 16);
              const isCorner = (x<3 && y<3) || (x>12 && y<3) || (x<3 && y>12);
              const noise = ((x*31 + y*17 + x*y) % 7) > 3;
              return <div key={i} style={{background: isCorner || noise ? '#111' : 'transparent'}} />;
            })}
          </div>
        </div>
        <div style={{padding: 12, background: 'var(--bg-1)', borderRadius: 10, border: '1px solid var(--border-1)', display: 'flex', alignItems: 'center', gap: 10}}>
          <div className="mono" style={{flex: 1, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-all'}}>{addr}</div>
          <CopyButton text={addr} onCopy={() => toast && toast('Address copied', 'success')} />
        </div>
      </div>
    </div>
  );
};

// ---------- Withdraw ----------
const WithdrawPage = ({ onBack, toast }) => {
  const [asset, setAsset] = useStateW('USDT');
  const [amount, setAmount] = useStateW('');
  const [code, setCode] = useStateW('');
  const [confirmOpen, setConfirmOpen] = useStateW(false);
  const me = VERSRR_DATA.me;
  const available = asset === 'USDT' ? me.balances.USDT : me.balances.USDC;

  return (
    <div className="fade-in" style={{maxWidth: 480}}>
      <PageHeader title="Withdraw" subtitle="Send funds to external address" back={onBack} />
      <div className="card" style={{display: 'flex', flexDirection: 'column', gap: 14}}>
        <Segmented full value={asset} onChange={setAsset} options={[{value:'USDT',label:'USDT'},{value:'USDC',label:'USDC'}]} accent="purple" />
        <label className="field">Amount
          <div style={{position: 'relative'}}>
            <input className="input mono" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" style={{paddingRight: 64}} />
            <button onClick={()=>setAmount(available.toFixed(2))} style={{position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: '4px 10px', borderRadius: 6, fontSize: 11, background: 'rgba(124,58,237,0.15)', color: 'var(--violet-400)', fontWeight: 600}}>MAX</button>
          </div>
          <span style={{fontSize: 11, color: 'var(--fg-3)', textTransform: 'none', letterSpacing: 0}}>Available: <span className="mono">{available.toFixed(2)} {asset}</span></span>
        </label>
        <label className="field">To address
          <input className="input mono" placeholder="0x…" style={{fontSize: 12}} />
        </label>
        <div style={{padding: 12, background: 'var(--bg-1)', borderRadius: 10, border: '1px solid var(--border-1)', display: 'flex', justifyContent: 'space-between', fontSize: 12}}>
          <span style={{color: 'var(--fg-2)'}}>Network fee</span>
          <span className="mono" style={{color: 'var(--success)', fontWeight: 600}}>FREE <span style={{color: 'var(--fg-3)', fontWeight: 400}}>(7 of 10 remaining)</span></span>
        </div>
        <label className="field">2FA code
          <input className="input mono" placeholder="••••••" value={code} onChange={e=>setCode(e.target.value)} maxLength={6} style={{letterSpacing: '0.3em', fontSize: 16}} />
        </label>
        <button className="btn btn-amber btn-full" onClick={() => setConfirmOpen(true)} disabled={!amount || code.length < 6}>Confirm Withdrawal</button>
      </div>
      <Modal open={confirmOpen} onClose={()=>setConfirmOpen(false)} title="Confirm withdrawal">
        <p style={{margin: '0 0 16px', fontSize: 14}}>Sending <span className="mono" style={{fontWeight: 600}}>{amount} {asset}</span> to external address. This cannot be reversed.</p>
        <div style={{display: 'flex', gap: 8}}>
          <button className="btn btn-outline" style={{flex: 1}} onClick={()=>setConfirmOpen(false)}>Cancel</button>
          <button className="btn btn-amber" style={{flex: 1}} onClick={() => { setConfirmOpen(false); toast && toast('Withdrawal submitted', 'success'); onBack(); }}>Confirm</button>
        </div>
      </Modal>
    </div>
  );
};

// ---------- Profile ----------
const ProfilePage = ({ onBack, onSettings }) => {
  const me = VERSRR_DATA.me;
  const t = TIERS[me.tier];
  return (
    <div className="fade-in" style={{maxWidth: 680}}>
      <PageHeader title="Profile" back={onBack} actions={<button onClick={onSettings} className="btn btn-outline btn-sm"><Icon name="settings" size={14}/> Settings</button>} />
      <div className="card" style={{marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16}}>
        <Avatar name={me.name} size={64} tier={me.tier} />
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontSize: 18, fontWeight: 700}}>{me.name}</div>
          <div style={{fontSize: 12, color: 'var(--fg-2)', marginTop: 2}}>Member since {me.memberSince}</div>
          <div style={{marginTop: 8}}><VerBadge tier={me.tier} count={me.verifications} size="md" /></div>
        </div>
      </div>

      <div style={{display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginBottom: 12}}>
        <div className="card" style={{textAlign: 'center'}}>
          <div className="mono" style={{fontSize: 28, fontWeight: 700}}>{me.trades}</div>
          <div style={{fontSize: 12, color: 'var(--fg-2)', marginTop: 2}}>Total trades</div>
        </div>
        <div className="card" style={{textAlign: 'center'}}>
          <div className="mono" style={{fontSize: 28, fontWeight: 700, color: 'var(--success)'}}>100%</div>
          <div style={{fontSize: 12, color: 'var(--fg-2)', marginTop: 2}}>Completion rate</div>
        </div>
        <div className="card" style={{textAlign: 'center'}}>
          <div className="mono" style={{fontSize: 28, fontWeight: 700}}>{me.avgRelease}</div>
          <div style={{fontSize: 12, color: 'var(--fg-2)', marginTop: 2}}>Avg release time</div>
        </div>
      </div>

      {/* Verification journey */}
      <div className="card" style={{marginBottom: 12}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12}}>
          <div>
            <div style={{fontWeight: 600, fontSize: 15}}>Verification journey</div>
            <div style={{fontSize: 12, color: 'var(--fg-2)'}}>{me.verifications} of 15 to become Vendor Eligible</div>
          </div>
          <div className="mono" style={{fontSize: 14, color: 'var(--violet-400)', fontWeight: 600}}>{Math.round(me.verifications/15*100)}%</div>
        </div>
        <div style={{height: 8, background: 'var(--bg-1)', borderRadius: 4, overflow: 'hidden', marginBottom: 14}}>
          <div style={{height: '100%', width: `${(me.verifications/15)*100}%`, background: 'linear-gradient(90deg, var(--purple-700), var(--violet-400))', borderRadius: 4}} />
        </div>
        <div style={{fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10}}>Recent verifiers</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          {VERSRR_DATA.recentVerifiers.map((r, i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--bg-1)', borderRadius: 8}}>
              <Avatar name={r.name} size={28} />
              <div style={{flex: 1, fontSize: 13}}>{r.name}</div>
              <span className="mono" style={{fontSize: 11, color: 'var(--fg-3)'}}>{r.tradeRef}</span>
              <span style={{fontSize: 11, color: 'var(--fg-3)'}}>{r.when}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Referral */}
      <div className="card" style={{background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(124,58,237,0.1))', border: '1px solid rgba(124,58,237,0.25)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10}}>
          <Icon name="sparkle" size={18} />
          <div style={{fontWeight: 600, fontSize: 15}}>Referral program</div>
        </div>
        <p style={{margin: '0 0 12px', fontSize: 13, color: 'var(--fg-2)'}}>Earn 0.1% of every trade your referrals make — for their first 6 months.</p>
        <div style={{padding: 10, background: 'rgba(0,0,0,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10}}>
          <span className="mono" style={{flex: 1, fontSize: 13, fontWeight: 500}}>versrr.com/?ref={me.referralCode}</span>
          <CopyButton text={`https://versrr.com/?ref=${me.referralCode}`} label="" />
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12}}>
          <div><div style={{color: 'var(--fg-3)'}}>Referrals</div><div className="mono" style={{fontSize: 16, fontWeight: 700, marginTop: 2}}>{me.referrals}</div></div>
          <div><div style={{color: 'var(--fg-3)'}}>This month</div><div className="mono" style={{fontSize: 16, fontWeight: 700, marginTop: 2, color: 'var(--amber-500)'}}>₦{me.referralEarnings.toLocaleString()}</div></div>
        </div>
      </div>
    </div>
  );
};

// ---------- Settings (light) ----------
const SettingsPage = ({ onBack }) => (
  <div className="fade-in" style={{maxWidth: 600}}>
    <PageHeader title="Settings" back={onBack} />
    {[
      { t: 'Account', items: ['Change password', 'Manage 2FA (enabled)', 'Email notifications'] },
      { t: 'Withdrawal', items: ['Saved withdrawal address', '24-hour security hold'] },
      { t: 'Linked accounts', items: ['WhatsApp: +234 80• ••• 4412', 'Telegram: @adaeze'] },
      { t: 'Payment accounts', items: ['Add registered payment name (vendors only)'] },
    ].map(sec => (
      <div key={sec.t} className="card" style={{marginBottom: 12}}>
        <div style={{fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10}}>{sec.t}</div>
        {sec.items.map((it, i) => (
          <button key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
            padding: '12px 4px',
            borderTop: i > 0 ? '1px solid var(--border-1)' : 'none',
            color: 'var(--fg-0)', textAlign: 'left', fontSize: 14,
          }}>
            <span>{it}</span>
            <Icon name="chevron-right" size={14} />
          </button>
        ))}
      </div>
    ))}
  </div>
);

// ---------- Auth (Login) ----------
const AuthPage = ({ mode = 'login', onSuccess, onSwitch }) => {
  const isLogin = mode === 'login';
  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.12), transparent 60%), var(--bg-0)'}}>
      <div style={{width: '100%', maxWidth: 400}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, gap: 12}}>
          <VMark size={48} color="#A78BFA" />
          <div style={{fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em'}}>versrr</div>
          <div style={{fontSize: 13, color: 'var(--fg-2)', textAlign: 'center'}}>Peer-verified P2P crypto trading</div>
        </div>
        <div className="card" style={{padding: 24, display: 'flex', flexDirection: 'column', gap: 14}}>
          <h2 style={{margin: 0, fontSize: 18, fontWeight: 600}}>{isLogin ? 'Log in' : 'Create account'}</h2>
          {!isLogin && <label className="field">Full legal name<input className="input" placeholder="As it appears on your ID" /></label>}
          <label className="field">Email<input className="input" placeholder="you@example.com" /></label>
          {!isLogin && <label className="field">Phone<input className="input mono" placeholder="+234 80 1234 5678" /></label>}
          <label className="field">Password<input type="password" className="input" placeholder="••••••••" /></label>
          {!isLogin && <label style={{display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--fg-2)'}}><input type="checkbox" style={{marginTop: 3}} />I agree to the Terms and Privacy Policy</label>}
          <button className="btn btn-amber btn-full" onClick={onSuccess}>{isLogin ? 'Log in' : 'Create account'}</button>
          <div style={{textAlign: 'center', fontSize: 13, color: 'var(--fg-2)'}}>
            {isLogin ? "Don't have an account? " : 'Already have one? '}
            <a onClick={onSwitch} style={{cursor: 'pointer'}}>{isLogin ? 'Sign up' : 'Log in'}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- API waitlist ----------
const APIPage = () => {
  const [email, setEmail] = useStateW('');
  const [joined, setJoined] = useStateW(false);
  return (
    <div className="fade-in" style={{maxWidth: 520}}>
      <PageHeader title="Versrr API" subtitle="Coming soon" />
      <div className="card" style={{textAlign: 'center', padding: 32}}>
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: 16}}>
          <div style={{width: 72, height: 72, borderRadius: 20, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--violet-400)'}}><Icon name="zap" size={32} /></div>
        </div>
        <h2 style={{margin: 0, fontSize: 22, fontWeight: 700}}>Automate your trades</h2>
        <p style={{color: 'var(--fg-2)', fontSize: 14, maxWidth: 360, margin: '8px auto 20px'}}>Monitor, respond and integrate Versrr into your workflow. Join the waitlist to be first.</p>
        {joined ? (
          <div style={{padding: 14, borderRadius: 10, background: 'var(--success-bg)', color: 'var(--success)', fontSize: 14, fontWeight: 500}}>
            ✓ You're on the list. We'll notify you when the API launches.
          </div>
        ) : (
          <div style={{display: 'flex', gap: 8}}>
            <input className="input" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
            <button className="btn btn-purple" onClick={()=>setJoined(true)}>Join Waitlist</button>
          </div>
        )}
        <div style={{marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10}}>
          {[
            { icon: 'refresh', t: 'Monitor trades' },
            { icon: 'zap', t: 'Automate responses' },
            { icon: 'api', t: 'Read offer data' },
            { icon: 'bell', t: 'Webhooks' },
          ].map(f => (
            <div key={f.t} style={{padding: 14, background: 'var(--bg-1)', borderRadius: 10, textAlign: 'left', border: '1px solid var(--border-1)'}}>
              <Icon name={f.icon} size={16} />
              <div style={{fontSize: 13, fontWeight: 500, marginTop: 8}}>{f.t}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------- Dispute ----------
const DisputePage = ({ onBack, toast }) => {
  const [reason, setReason] = useStateW('payment');
  const [desc, setDesc] = useStateW('');
  return (
    <div className="fade-in" style={{maxWidth: 560}}>
      <PageHeader title="File Dispute" subtitle="Open a formal review of this trade" back={onBack} />
      <div className="card" style={{display: 'flex', flexDirection: 'column', gap: 14}}>
        <label className="field">Reason
          <select className="input" value={reason} onChange={e=>setReason(e.target.value)}>
            <option value="payment">Payment not received</option>
            <option value="wrong">Wrong amount</option>
            <option value="unresponsive">Unresponsive counterparty</option>
            <option value="suspicious">Suspicious activity</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="field">Description<textarea className="input" rows={4} placeholder="Describe what happened, with timestamps." value={desc} onChange={e=>setDesc(e.target.value)} /></label>
        <div style={{padding: 14, border: '1px dashed var(--border-2)', borderRadius: 10, textAlign: 'center', color: 'var(--fg-3)', fontSize: 13}}>
          <Icon name="upload" size={18} /><div style={{marginTop: 6}}>Drop screenshots or click to upload</div>
          <div style={{fontSize: 11, marginTop: 2}}>Max 5 files · 10MB each</div>
        </div>
        <div style={{padding: 12, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontSize: 12, color: 'var(--fg-1)', display: 'flex', gap: 8}}>
          <Icon name="alert" size={14} />Filing a false dispute may result in account restrictions.
        </div>
        <button className="btn btn-red btn-full" onClick={() => { toast && toast('Dispute submitted. Admin will review within 24h.', 'info'); onBack(); }}>Submit Dispute</button>
      </div>
    </div>
  );
};

Object.assign(window, { WalletPage, DepositPage, WithdrawPage, ProfilePage, SettingsPage, AuthPage, APIPage, DisputePage });
