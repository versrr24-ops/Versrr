const { useState: useStateT, useEffect: useEffectT, useMemo: useMemoT, useRef: useRefT } = React;

// Trade status states
const TRADE_STATES = ['opened', 'active', 'paid', 'verified', 'complete'];
const TRADE_LABELS = { opened: 'Opened', active: 'Active', paid: 'Paid', verified: 'Verified', complete: 'Complete' };

// ---------- Status stepper ----------
const TradeStatus = ({ state }) => {
  const activeIdx = TRADE_STATES.indexOf(state);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 4, padding: '12px 4px'}}>
      {TRADE_STATES.map((s, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        const color = done ? 'var(--success)' : active ? 'var(--violet-400)' : 'var(--fg-4)';
        return (
          <React.Fragment key={s}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: '0 0 auto', minWidth: 56}}>
              <div style={{
                width: 24, height: 24, borderRadius: 999,
                background: done ? 'var(--success)' : active ? 'rgba(124,58,237,0.2)' : 'var(--bg-3)',
                border: `1.5px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: done ? 'white' : color,
              }}>
                {done ? <Icon name="check" size={12} stroke={3} /> : <span style={{fontSize: 10, fontWeight: 700}}>{i+1}</span>}
              </div>
              <span style={{fontSize: 10, color, fontWeight: active ? 600 : 500, textAlign: 'center'}}>{TRADE_LABELS[s]}</span>
            </div>
            {i < TRADE_STATES.length - 1 && <div style={{flex: 1, height: 2, background: done ? 'var(--success)' : 'var(--border-1)', marginBottom: 20, minWidth: 8}} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------- Countdown timer ----------
const useCountdown = (seconds, onEnd) => {
  const [left, setLeft] = useStateT(seconds);
  useEffectT(() => { setLeft(seconds); }, [seconds]);
  useEffectT(() => {
    if (left <= 0) { onEnd && onEnd(); return; }
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  const m = Math.floor(Math.max(0,left) / 60), s = Math.max(0,left) % 60;
  return `${m}:${s.toString().padStart(2,'0')}`;
};

// ---------- Trade chat ----------
const TradeChat = ({ messages, onSend, vendor }) => {
  const [open, setOpen] = useStateT(false);
  const [msg, setMsg] = useStateT('');
  return (
    <div className="card" style={{padding: 0, overflow: 'hidden'}}>
      <button onClick={() => setOpen(o=>!o)} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 14, textAlign: 'left'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <Icon name="message" size={18} />
          <span style={{fontWeight: 600, fontSize: 14}}>Trade chat</span>
          <span style={{fontSize: 11, color: 'var(--fg-3)', padding: '2px 6px', borderRadius: 4, background: 'var(--bg-3)'}}>{messages.length}</span>
        </div>
        <Icon name={open ? 'chevron-down' : 'chevron-up'} size={16} />
      </button>
      {open && (
        <div style={{borderTop: '1px solid var(--border-1)', padding: 14, display: 'flex', flexDirection: 'column', gap: 10}}>
          <div style={{maxHeight: 220, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8}}>
            {messages.map((m, i) => (
              <div key={i} style={{display: 'flex', justifyContent: m.me ? 'flex-end' : 'flex-start'}}>
                <div style={{
                  maxWidth: '78%', padding: '8px 12px', borderRadius: 12,
                  background: m.me ? 'var(--purple-800)' : 'var(--bg-3)',
                  color: m.me ? 'white' : 'var(--fg-0)',
                  fontSize: 13, lineHeight: 1.4,
                }}>
                  <div>{m.text}</div>
                  <div style={{fontSize: 10, opacity: 0.6, marginTop: 2}}>{m.when}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{display: 'flex', gap: 8}}>
            <input className="input" placeholder="Type a message…" value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>{if(e.key==='Enter' && msg){onSend(msg); setMsg('');}}} style={{padding: '10px 12px'}} />
            <button className="btn btn-purple" onClick={()=>{if(msg){onSend(msg); setMsg('');}}}>Send</button>
          </div>
          <div style={{display: 'flex', gap: 8}}>
            <button className="btn btn-outline btn-sm" style={{flex: 1}}><Icon name="whatsapp" size={14} />WhatsApp</button>
            <button className="btn btn-outline btn-sm" style={{flex: 1}}><Icon name="telegram" size={14} />Telegram</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- Trade page ----------
const TradePage = ({ trade, role, onBack, onAdvance, onCancel, onDispute, toast }) => {
  const { vendor, amount, direction, state } = trade;
  const rate = direction === 'buy' ? vendor.rateBuy : vendor.rateSell;
  const totalFiat = amount * rate;
  const [messages, setMessages] = useStateT([
    { me: false, text: 'Hi, I\'ll send the details once you\'ve opened. Please only pay from your own account.', when: '2m ago' },
  ]);
  const [verifyOpen, setVerifyOpen] = useStateT(false);
  const [showKYC, setShowKYC] = useStateT(false);

  const timerOpened = useCountdown(state === 'opened' ? 287 : 0);
  const timerPaid = useCountdown(state === 'paid' ? 432 : 0);

  const isBuyer = role === 'buyer';

  const sendMsg = (t) => setMessages(m => [...m, { me: true, text: t, when: 'now' }]);

  return (
    <div className="fade-in" style={{maxWidth: 720}}>
      <PageHeader
        title={`Trade TR-${Math.floor(Math.random()*9000+1000)}`}
        subtitle={<span>{isBuyer ? 'Buying' : 'Selling'} <span className="mono">${amount}</span> {direction === 'buy' ? 'from' : 'to'} {vendor.name}</span>}
        back={onBack}
        actions={<span style={{fontSize: 11, padding: '4px 10px', borderRadius: 6, background: 'var(--bg-2)', color: 'var(--fg-2)', border: '1px solid var(--border-1)'}}>{isBuyer ? 'Buyer view' : 'Vendor view'}</span>}
      />

      {/* Status */}
      <div className="card" style={{marginBottom: 12, padding: 8}}>
        <TradeStatus state={state} />
      </div>

      <div style={{display: 'grid', gap: 12, gridTemplateColumns: 'minmax(0, 1fr)'}}>
        {/* Timer banner */}
        {state === 'opened' && (
          <div style={{padding: 14, borderRadius: 12, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', gap: 10}}>
            <Icon name="clock" size={18} stroke={2} />
            <div style={{flex: 1}}>
              <div style={{fontWeight: 600, fontSize: 13}}>Waiting for vendor to engage</div>
              <div style={{fontSize: 12, color: 'var(--fg-2)'}}>Response window expires in <span className="mono" style={{color: 'var(--amber-500)', fontWeight: 600}}>{timerOpened}</span></div>
            </div>
          </div>
        )}
        {state === 'paid' && (
          <div style={{padding: 14, borderRadius: 12, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', gap: 10}}>
            <Icon name="clock" size={18} stroke={2} />
            <div style={{flex: 1}}>
              <div style={{fontWeight: 600, fontSize: 13}}>{isBuyer ? 'Awaiting vendor verification' : 'Buyer marked as paid'}</div>
              <div style={{fontSize: 12, color: 'var(--fg-2)'}}>Vendor has <span className="mono" style={{color: 'var(--violet-400)', fontWeight: 600}}>{timerPaid}</span> to verify and release</div>
            </div>
          </div>
        )}
        {state === 'complete' && (
          <div style={{padding: 16, borderRadius: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{width: 36, height: 36, borderRadius: 999, background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon name="check" size={20} stroke={3} />
            </div>
            <div>
              <div style={{fontWeight: 700, fontSize: 15}}>Trade complete</div>
              <div style={{fontSize: 12, color: 'var(--fg-2)'}}>{isBuyer ? `${amount} USDT released to your wallet` : `$${amount} paid · verification recorded`}</div>
            </div>
          </div>
        )}

        {/* Trade details */}
        <div className="card">
          <div style={{fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10}}>Trade details</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
            <div><div style={{fontSize: 11, color: 'var(--fg-3)'}}>Amount</div><div className="mono" style={{fontSize: 18, fontWeight: 700, marginTop: 2}}>${amount}<span style={{fontSize: 12, color: 'var(--fg-2)', marginLeft: 4}}>USDT</span></div></div>
            <div><div style={{fontSize: 11, color: 'var(--fg-3)'}}>Rate</div><div className="mono" style={{fontSize: 14, fontWeight: 600, marginTop: 2}}>₦{rate.toLocaleString()}</div></div>
            <div><div style={{fontSize: 11, color: 'var(--fg-3)'}}>Total</div><div className="mono" style={{fontSize: 18, fontWeight: 700, marginTop: 2, color: 'var(--amber-500)'}}>₦{totalFiat.toLocaleString()}</div></div>
            <div><div style={{fontSize: 11, color: 'var(--fg-3)'}}>Method</div><div style={{marginTop: 4}}><MethodChip method={vendor.methods[0]} /></div></div>
          </div>
        </div>

        {/* Counterparty */}
        <div className="card">
          <div style={{fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10}}>Counterparty</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12}}>
            <Avatar name={vendor.name} size={44} tier={vendor.tier} />
            <div style={{flex: 1}}>
              <div style={{fontWeight: 600, fontSize: 15}}>{vendor.name}</div>
              <div style={{fontSize: 12, color: 'var(--fg-2)', marginTop: 2}}>{vendor.completion}% completion · {vendor.trades.toLocaleString()} trades</div>
            </div>
          </div>
          <VerBadge tier={vendor.tier} count={vendor.ver} size="md" />
          <div style={{marginTop: 14, padding: 12, borderRadius: 10, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)'}}>
            <div style={{fontSize: 11, color: 'var(--violet-400)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em'}}>Vendor terms</div>
            <div style={{fontSize: 13, color: 'var(--fg-1)'}}>{vendor.terms}</div>
          </div>
        </div>

        {/* Payment details — buyer */}
        {isBuyer && (state === 'active' || state === 'paid' || state === 'verified' || state === 'complete') && (
          <div className="card" style={{borderColor: state === 'active' ? 'rgba(245,158,11,0.3)' : 'var(--border-1)'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12}}>
              <div style={{fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em'}}>Send ₦{totalFiat.toLocaleString()} to</div>
              <span style={{fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.3)'}}>
                <Icon name="shield-check" size={10} /> Verified account
              </span>
            </div>
            <div style={{padding: 14, background: 'var(--bg-1)', borderRadius: 10, border: '1px solid var(--border-1)', display: 'flex', flexDirection: 'column', gap: 10}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{fontSize: 11, color: 'var(--fg-3)'}}>Account name</div>
                  <div style={{fontWeight: 600}}>{vendor.methodName}</div>
                </div>
                <CopyButton text={vendor.methodName} label="" />
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{fontSize: 11, color: 'var(--fg-3)'}}>Account number ({vendor.methods[0]})</div>
                  <div className="mono" style={{fontWeight: 600, fontSize: 15}}>8103 442 091</div>
                </div>
                <CopyButton text="8103442091" label="" />
              </div>
              <div style={{fontSize: 11, color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 6}}>
                <Icon name="info" size={12} />
                Verified by 47 users as {vendor.methodName}'s registered account
              </div>
            </div>
          </div>
        )}

        {/* Vendor view — payment received & verify ID */}
        {!isBuyer && state === 'paid' && (
          <div className="card" style={{borderColor: 'rgba(245,158,11,0.3)'}}>
            <div style={{fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10}}>Identity verification required</div>
            <div style={{padding: 14, background: 'var(--bg-1)', borderRadius: 10, border: '1px solid var(--border-1)', marginBottom: 12}}>
              <div style={{fontSize: 11, color: 'var(--fg-3)'}}>Buyer declared name</div>
              <div style={{fontWeight: 700, fontSize: 18, marginTop: 2}}>Adaeze Okeke</div>
              <div style={{fontSize: 12, color: 'var(--fg-2)', marginTop: 6}}>Confirm this matches the sender name on your bank notification.</div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--bg-1)', borderRadius: 10, border: '1px dashed var(--border-2)', marginBottom: 12}}>
              <div style={{width: 56, height: 72, borderRadius: 6, background: 'linear-gradient(135deg, #2a2a3a, #1a1a2a)', border: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-3)', flexShrink: 0}}>
                <Icon name="user" size={20} />
              </div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontSize: 13, fontWeight: 600}}>NIN slip uploaded</div>
                <div style={{fontSize: 11, color: 'var(--fg-2)'}}>First-time buyer · sensitive fields redacted</div>
              </div>
              <button className="btn btn-outline btn-sm">View</button>
            </div>
            <button className="btn btn-purple btn-full" onClick={() => setVerifyOpen(true)}>
              <Icon name="shield-check" size={16} /> Verify Identity
            </button>
          </div>
        )}

        {/* Chat */}
        <TradeChat messages={messages} onSend={sendMsg} vendor={vendor} />

        {/* Actions */}
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4}}>
          {isBuyer && state === 'opened' && (
            <button className="btn btn-outline" style={{flex: 1}} onClick={onCancel}>Cancel Trade</button>
          )}
          {isBuyer && state === 'active' && (
            <>
              <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
              <button className="btn btn-amber" style={{flex: 1}} onClick={() => { onAdvance('paid'); if (toast) toast('Marked as paid. Waiting for vendor.', 'success'); }}>
                <Icon name="check" size={16} /> I Have Paid
              </button>
            </>
          )}
          {!isBuyer && state === 'opened' && (
            <>
              <button className="btn btn-outline" onClick={onCancel}>Decline</button>
              <button className="btn btn-amber" style={{flex: 1}} onClick={() => { onAdvance('active'); if (toast) toast('Trade accepted. Waiting for buyer payment.', 'success'); }}>Accept Trade</button>
            </>
          )}
          {(state === 'paid' || state === 'verified') && (
            <button className="btn btn-outline" style={{color: 'var(--error)', borderColor: 'rgba(239,68,68,0.3)'}} onClick={onDispute}>
              <Icon name="flag" size={14} /> File Dispute
            </button>
          )}
          {state === 'complete' && (
            <button className="btn btn-purple btn-full" onClick={onBack}>Back to marketplace</button>
          )}
        </div>
      </div>

      <Modal open={verifyOpen} onClose={()=>setVerifyOpen(false)} title="Verify buyer identity">
        <p style={{margin: '0 0 16px', color: 'var(--fg-1)', fontSize: 14}}>You are confirming that <strong style={{color: 'var(--fg-0)'}}>Adaeze Okeke</strong> matches the payment sender name on your bank notification.</p>
        <p style={{margin: '0 0 20px', color: 'var(--fg-2)', fontSize: 13}}>This verification will be recorded on the buyer's profile and visible to other vendors.</p>
        <div style={{display: 'flex', gap: 8}}>
          <button className="btn btn-outline" style={{flex: 1}} onClick={()=>setVerifyOpen(false)}>Cancel</button>
          <button className="btn btn-amber" style={{flex: 1}} onClick={() => { setVerifyOpen(false); onAdvance('complete'); toast && toast('Verified & released · ' + amount + ' USDT sent to buyer', 'success'); }}>
            Verify & Release
          </button>
        </div>
      </Modal>
    </div>
  );
};

Object.assign(window, { TradePage, TradeStatus });
