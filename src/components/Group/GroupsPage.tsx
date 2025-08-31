import React, { useEffect, useState } from 'react';


if (!firebaseApp) return <div>Loading...</div>;
const realtime = new RealtimeService(firebaseApp);


return (
<div className="p-4">
<div className="flex gap-2 mb-4">
<div className="w-64 p-3 rounded bg-white/80">
<div className="font-semibold mb-2">Your Groups</div>
<div className="space-y-2">
{groups.length === 0 && <div className="text-sm opacity-70">No groups — create one in the sidebar</div>}
{groups.map((g) => (
<button key={g.id} onClick={() => setSelected(g)} className="w-full text-left py-2 hover:bg-black/5 rounded">{g.name}</button>
))}
</div>
</div>


<div className="flex-1">
{selected ? (
<GroupRoom groupId={selected.id} realtime={realtime} />
) : (
<div className="rounded bg-white/80 p-8">Select a group to open the room</div>
)}
</div>
</div>
</div>
);
};


export default GroupsPage;