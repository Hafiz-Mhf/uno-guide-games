// sync-engine.js
// Supabase Real-Time Cloud Sync for UNO Engagement Day 2026

export const SUPABASE_CONFIG = {
  url: 'https://csdhoihirffjqkkhkfnv.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZGhvaWhpcmZmanFra2hrZm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNDQ0NjAsImV4cCI6MjEwODcyMDQ2MH0.Gl7suL5tgx8PT9GUQ0kZju0ziu2xGQ2V0-L856GWPPk',
  table: 'tournament_state',
  documentId: 'uno_tournament_2026'
};

let supabaseClient = null;
let realtimeChannel = null;
let currentStatus = 'connecting'; // 'connected' | 'syncing' | 'offline' | 'error'
const statusListeners = new Set();
let isApplyingRemote = false;
let pollingInterval = null;

export function isNodeTestEnvironment() {
  return typeof process !== 'undefined' && Boolean(process.versions?.node);
}

export function getSyncStatus() {
  return currentStatus;
}

export function onSyncStatusChange(cb) {
  if (typeof cb === 'function') {
    statusListeners.add(cb);
    cb(currentStatus);
    return () => statusListeners.delete(cb);
  }
  return () => {};
}

function notifyStatus(newStatus) {
  currentStatus = newStatus;
  statusListeners.forEach(cb => {
    try { cb(newStatus); } catch (e) { console.error(e); }
  });
}

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
      return supabaseClient;
    } catch (e) {
      console.warn('[SyncEngine] Supabase client init warning:', e);
    }
  }
  return null;
}

export async function fetchRemoteTournamentState() {
  const url = `${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.table}?id=eq.${SUPABASE_CONFIG.documentId}&select=*`;
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
        'Cache-Control': 'no-cache'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].state) {
      notifyStatus('connected');
      return data[0].state;
    }
    notifyStatus('connected');
    return null;
  } catch (err) {
    console.warn('[SyncEngine] Fetch remote state error:', err);
    notifyStatus('offline');
    return null;
  }
}

let pushTimeout = null;
export function pushTournamentStateToCloud(state) {
  if (!state || isApplyingRemote) return Promise.resolve(false);
  if (isNodeTestEnvironment()) return Promise.resolve(false);

  notifyStatus('syncing');

  // Debounce slightly to prevent thrashing rapid clicks
  return new Promise((resolve) => {
    if (pushTimeout) clearTimeout(pushTimeout);
    pushTimeout = setTimeout(async () => {
      const url = `${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.table}`;
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_CONFIG.anonKey,
            'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            id: SUPABASE_CONFIG.documentId,
            state: state,
            updated_at: new Date().toISOString()
          })
        });

        if (res.ok) {
          notifyStatus('connected');
          resolve(true);
        } else {
          console.warn('[SyncEngine] Push state HTTP failed:', res.status);
          notifyStatus('error');
          resolve(false);
        }
      } catch (err) {
        console.warn('[SyncEngine] Push state network failed:', err);
        notifyStatus('offline');
        resolve(false);
      }
    }, 150);
  });
}

export function subscribeToRealtimeChanges(onRemoteUpdate) {
  if (typeof window === 'undefined' || isNodeTestEnvironment()) return () => {};

  const setupChannel = () => {
    const client = getSupabaseClient();
    if (!client) {
      // SDK might still be loading from CDN
      setTimeout(setupChannel, 400);
      return;
    }

    try {
      if (realtimeChannel) {
        try { client.removeChannel(realtimeChannel); } catch (e) {}
      }

      realtimeChannel = client
        .channel('public:tournament_state_realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: SUPABASE_CONFIG.table,
            filter: `id=eq.${SUPABASE_CONFIG.documentId}`
          },
          (payload) => {
            if (payload.new && payload.new.state) {
              isApplyingRemote = true;
              try {
                if (typeof onRemoteUpdate === 'function') {
                  onRemoteUpdate(payload.new.state);
                }
              } finally {
                setTimeout(() => { isApplyingRemote = false; }, 300);
              }
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            notifyStatus('connected');
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            notifyStatus('offline');
          }
        });
    } catch (e) {
      console.warn('[SyncEngine] Realtime subscribe error:', e);
      notifyStatus('offline');
    }
  };

  setupChannel();

  // Background fallback poll every 8 seconds in case WebSocket drops on mobile sleep
  if (!pollingInterval) {
    pollingInterval = setInterval(async () => {
      if (isApplyingRemote) return;
      const remoteState = await fetchRemoteTournamentState();
      if (remoteState && typeof onRemoteUpdate === 'function') {
        onRemoteUpdate(remoteState, true /* isPoll */);
      }
    }, 8000);
  }

  return () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
    const client = getSupabaseClient();
    if (client && realtimeChannel) {
      try { client.removeChannel(realtimeChannel); } catch (e) {}
    }
  };
}

export async function initSyncEngine({ getLocalState, onRemoteUpdate }) {
  if (typeof window === 'undefined' || isNodeTestEnvironment()) return;

  notifyStatus('connecting');

  // 1. Initial remote fetch
  const remoteState = await fetchRemoteTournamentState();
  if (remoteState && typeof onRemoteUpdate === 'function') {
    isApplyingRemote = true;
    try {
      onRemoteUpdate(remoteState);
    } finally {
      setTimeout(() => { isApplyingRemote = false; }, 300);
    }
  } else if (!remoteState && typeof getLocalState === 'function') {
    // If remote is empty, push local state as initial baseline
    const local = getLocalState();
    if (local && (local.round1?.matches?.length > 0 || local.roster?.length > 0)) {
      await pushTournamentStateToCloud(local);
    }
  }

  // 2. Realtime WebSocket subscription
  subscribeToRealtimeChanges(onRemoteUpdate);
}
