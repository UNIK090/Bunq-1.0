import { getDatabase, ref, onValue, push, set, update, remove, serverTimestamp } from 'firebase/database';
await update(presRef, {
...presence,
state: 'online',
lastActive: serverTimestamp(),
});
}


async clearPresence(groupId: string, userId: string) {
const presRef = ref(this.db, `groups/${groupId}/presence/${userId}`);
await remove(presRef);
}


subscribeToPresence(groupId: string, callback: (users: Record<string, any>) => void) {
const presRef = ref(this.db, `groups/${groupId}/presence`);
onValue(presRef, (snap) => {
callback(snap.val() || {});
});
return () => {};
}


// ------------------ Typing ------------------
async setTyping(groupId: string, userId: string, isTyping: boolean) {
const typingRef = ref(this.db, `groups/${groupId}/typing/${userId}`);
await update(typingRef, { isTyping, updatedAt: serverTimestamp() });
}


subscribeToTyping(groupId: string, callback: (typing: Record<string, { isTyping: boolean }>) => void) {
const typingRef = ref(this.db, `groups/${groupId}/typing`);
onValue(typingRef, (snap) => callback(snap.val() || {}));
return () => {};
}


// ------------------ Playback sync ------------------
async sendPlaybackEvent(groupId: string, event: { type: 'play' | 'pause' | 'seek'; videoId: string; position: number; userId: string; userName?: string }) {
const evRef = ref(this.db, `groups/${groupId}/playbackEvents`);
const newRef = push(evRef);
await set(newRef, { ...event, createdAt: serverTimestamp() });
}


subscribeToPlayback(groupId: string, callback: (events: any[]) => void) {
const evRef = ref(this.db, `groups/${groupId}/playbackEvents`);
onValue(evRef, (snap) => {
const val = snap.val() || {};
const list = Object.values(val).map((v: any) => ({ ...v }));
list.sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));
callback(list);
});
return () => {};
}
}


export default RealtimeService;