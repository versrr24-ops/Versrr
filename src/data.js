// Mock data for Versrr prototype
window.VERSRR_DATA = {
  me: {
    id: 'u_me',
    name: 'Adaeze Okeke',
    username: 'adaeze',
    email: 'adaeze@example.com',
    phone: '+234 80• ••• 4412',
    memberSince: 'Oct 2025',
    verifications: 12,
    tier: 'peer', // new | peer | vendor | trusted
    completionRate: null,
    trades: 14,
    avgRelease: '2m 40s',
    referralCode: 'ADAEZE',
    referralEarnings: 3200,
    referrals: 4,
    twoFA: true,
    isVendor: false,
    balances: { USDT: 148.32, USDC: 0, USDT_locked: 50, USDC_locked: 0 },
  },

  vendors: [
    { id: 'v_john', name: 'John Okafor', ver: 213, tier: 'trusted', completion: 99.2, trades: 1847, active: true, rateBuy: 1618, rateSell: 1604, min: 50, max: 5000, methods: ['Opay', 'Kuda', 'Bank Transfer'], methodName: 'John Okafor', lastTrade: '2m ago', terms: 'Pay from your own bank. Same-name payments only. Release within 5 minutes of confirmation.', flags: ['No Third Party'] },
    { id: 'v_chiamaka', name: 'Chiamaka Obi', ver: 147, tier: 'trusted', completion: 98.7, trades: 982, active: true, rateBuy: 1616, rateSell: 1602, min: 100, max: 3000, methods: ['PalmPay', 'Opay'], methodName: 'Chiamaka A. Obi', lastTrade: '14m ago', terms: 'Fast release. No negotiation on rate.', flags: ['No Negotiation'] },
    { id: 'v_tunde', name: 'Tunde Balogun', ver: 88, tier: 'vendor', completion: 97.4, trades: 412, active: true, rateBuy: 1615, rateSell: 1601, min: 50, max: 2000, methods: ['Bank Transfer', 'Kuda'], methodName: 'Tunde A Balogun', lastTrade: '1h ago', terms: 'Include trade ID in transfer narration.', flags: [] },
    { id: 'v_funmi', name: 'Funmi Adeyemi', ver: 64, tier: 'vendor', completion: 96.1, trades: 298, active: false, rateBuy: 1614, rateSell: 1598, min: 20, max: 1500, methods: ['Opay', 'PalmPay', 'Moniepoint'], methodName: 'Funmilayo Adeyemi', lastTrade: '3h ago', terms: 'Verified users only.', flags: [] },
    { id: 'v_ibrahim', name: 'Ibrahim Musa', ver: 41, tier: 'vendor', completion: 94.8, trades: 186, active: true, rateBuy: 1612, rateSell: 1595, min: 30, max: 1000, methods: ['Bank Transfer'], methodName: 'Ibrahim S. Musa', lastTrade: '22m ago', terms: 'Bank transfer only. No Opay.', flags: [] },
    { id: 'v_grace', name: 'Grace Nwosu', ver: 29, tier: 'peer', completion: 93.2, trades: 94, active: false, rateBuy: 1610, rateSell: 1593, min: 20, max: 500, methods: ['Kuda', 'Opay'], methodName: 'Grace C. Nwosu', lastTrade: '6h ago', terms: 'New vendor — building reputation.', flags: [] },
  ],

  lockTrades: [
    { code: 'LK-7XQ2', type: 'vendor', rate: 1617, min: 100, max: 2000, note: 'WhatsApp group rate — fast release', status: 'active', activeTrades: 3, created: '4h ago', terms: 'Only for members of Lagos Traders WA group.' },
    { code: 'LK-M4AP', type: 'buyer', amount: 500, note: 'Paying via GTB transfer, need fast release', status: 'active', bids: 2, created: '18m ago' },
  ],

  hwListings: [
    { id: 'hw_1', user: 'Kemi D.', ver: 18, card: 'Apple', amount: 100, rate: 75, window: 10, remaining: 347, bids: 4, active: true },
    { id: 'hw_2', user: 'David O.', ver: 47, card: 'Amazon', amount: 200, rate: 72, window: 15, remaining: 612, bids: 2, active: true },
    { id: 'hw_3', user: 'Blessing A.', ver: 6, card: 'Steam', amount: 50, rate: 68, window: 10, remaining: 189, bids: 3, active: true },
    { id: 'hw_4', user: 'Emeka I.', ver: 91, card: 'Google Play', amount: 25, rate: 70, window: 5, remaining: 0, bids: 5, active: false },
  ],

  recentVerifiers: [
    { name: 'John Okafor', when: '2 days ago', tradeRef: 'TR-8821' },
    { name: 'Chiamaka Obi', when: '5 days ago', tradeRef: 'TR-8701' },
    { name: 'Tunde Balogun', when: '1 week ago', tradeRef: 'TR-8544' },
    { name: 'Funmi Adeyemi', when: '2 weeks ago', tradeRef: 'TR-8291' },
  ],

  notifications: [
    { id: 1, kind: 'trade', msg: 'John Okafor accepted your trade', when: '2m ago', unread: true },
    { id: 2, kind: 'bid', msg: 'New bid on your Apple $100 card — 78%', when: '14m ago', unread: true },
    { id: 3, kind: 'verify', msg: 'Chiamaka Obi verified your identity', when: '2d ago', unread: false },
  ],

  txs: [
    { id: 1, kind: 'escrow-release', desc: 'Trade TR-8821 released', amount: +50, asset: 'USDT', when: '2d ago', hash: '0x7a2f...8c41' },
    { id: 2, kind: 'deposit', desc: 'Deposit BEP-20', amount: +100, asset: 'USDT', when: '5d ago', hash: '0x4b1e...9a32' },
    { id: 3, kind: 'escrow-lock', desc: 'Trade TR-8701 escrow', amount: -50, asset: 'USDT', when: '5d ago', hash: null },
    { id: 4, kind: 'fee', desc: 'Platform fee', amount: -0.15, asset: 'USDT', when: '5d ago', hash: null },
    { id: 5, kind: 'deposit', desc: 'Deposit BEP-20', amount: +50, asset: 'USDT', when: '1w ago', hash: '0x9f3a...2b71' },
  ],
};
