import React, { useEffect, useMemo, useRef, useState } from 'react';
/>
) : (
<div className="w-full h-full flex items-center justify-center text-white/70">Select a video</div>
)}


<div className="absolute bottom-4 left-4 flex items-center gap-2">
<button onClick={onPlay} className="px-3 py-1 rounded bg-white text-black flex items-center gap-1"><Play className="w-4 h-4"/>Play</button>
<button onClick={onPause} className="px-3 py-1 rounded bg-white text-black flex items-center gap-1"><Pause className="w-4 h-4"/>Pause</button>
<button onClick={() => onSeek(Math.max(0, playbackPos - 10))} className="px-2 py-1 rounded bg-white/90">-10s</button>
<button onClick={() => onSeek(playbackPos + 10)} className="px-2 py-1 rounded bg-white/90">+10s</button>
</div>
</div>
</div>


<div className="col-span-4 flex flex-col gap-4">
<div className="p-4 rounded bg-white/80">
<div className="flex items-center gap-2 font-semibold"><Users className="w-4 h-4"/> Participants ({participants.length})</div>
<div className="max-h-36 overflow-auto mt-2 space-y-1">
{participants.map((p) => (
<div key={p.id} className="flex items-center gap-2 text-sm">
<div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center">{(p.name||'U')[0]}</div>
<div className="flex-1">{p.name}</div>
</div>
))}
</div>
</div>


<div className="p-4 rounded bg-white/80 flex-1 flex flex-col min-h-0">
<div className="flex-1 overflow-auto space-y-2">
{messages.map((m, i) => (
<div key={i} className="text-sm"><span className="font-medium">{m.userName}</span>: {m.text}</div>
))}
{typingUsers.length > 0 && <div className="text-xs opacity-70">{typingUsers.length} typing…</div>}
</div>


<div className="mt-3 flex items-center gap-2">
<input value={newMessage} onChange={(e) => onType(e.target.value)} placeholder="Message your group" className="flex-1 px-3 py-2 rounded border" />
<button onClick={sendMessage} className="px-3 py-2 rounded bg-indigo-600 text-white flex items-center gap-1"><Send className="w-4 h-4"/>Send</button>
</div>
</div>


<div className="grid grid-cols-3 gap-2">
<button className="p-3 rounded bg-white/80 flex items-center justify-center gap-1"><Hand className="w-4 h-4"/>Raise</button>
<button className="p-3 rounded bg-white/80 flex items-center justify-center gap-1"><Smile className="w-4 h-4"/>React</button>
<button className="p-3 rounded bg-white/80 flex items-center justify-center gap-1"><Clock className="w-4 h-4"/>Timer</button>
</div>
</div>
</div>
);
};


export default GroupRoom;