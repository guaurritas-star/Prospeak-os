import React, { useEffect, useState } from 'react';
import { BookmarkPlus, Trash2, Volume2, BookOpen } from 'lucide-react';
import { addPhrase, deletePhrase, getEntries, NOTEBOOK_CHANGED, type NotebookEntry } from '../utils/notebook';
import { speakText } from '../utils/audio';

export function NotebookWindow() {
  const [entries, setEntries] = useState<NotebookEntry[]>(getEntries);
  const [phrase, setPhrase] = useState('');
  const [note, setNote] = useState('');
  const [filter, setFilter] = useState('');
  useEffect(() => {
    const refresh = () => setEntries(getEntries());
    window.addEventListener(NOTEBOOK_CHANGED, refresh);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener(NOTEBOOK_CHANGED, refresh); window.removeEventListener('storage', refresh); };
  }, []);
  const add = (event: React.FormEvent) => {
    event.preventDefault();
    if (!phrase.trim()) return;
    addPhrase(phrase, note);
    setPhrase(''); setNote('');
  };
  const shown = entries.filter(x => (x.phrase + x.note).toLowerCase().includes(filter.toLowerCase()));
  return <div className="flex-1 min-h-0 overflow-y-auto bg-[#FAFCFC] p-4 sm:p-6 text-[#244450] space-y-5">
    <header className="space-y-1">
      <h2 className="text-2xl font-serif font-bold flex items-center gap-2"><BookOpen size={24} className="text-[#B9778C]" /> My Notebook</h2>
      <p className="text-sm text-[#546E79]">Save English phrases you'll actually use in conversation.</p>
      <p className="text-xs text-[#657D87]">Saved only on this browser. No account sync yet.</p>
    </header>
    <form onSubmit={add} className="bg-white border border-[#DDE6E9] rounded-2xl p-4 space-y-3 shadow-sm">
      <label className="block text-sm font-semibold" htmlFor="new-phrase">Expression in English</label>
      <input id="new-phrase" value={phrase} onChange={e => setPhrase(e.target.value)} maxLength={180} placeholder="Could you clarify that?" required className="w-full p-3 rounded-xl border border-[#B7CED8] text-base focus:outline-2 focus:outline-[#81A7B6]" />
      <label className="block text-sm font-semibold" htmlFor="new-note">Meaning or personal note (optional)</label>
      <input id="new-note" value={note} onChange={e => setNote(e.target.value)} maxLength={300} placeholder="Useful when I need more information" className="w-full p-3 rounded-xl border border-[#B7CED8] text-base focus:outline-2 focus:outline-[#81A7B6]" />
      <button type="submit" className="bg-[#294F5D] text-white rounded-xl px-4 py-3 font-semibold flex items-center gap-2"><BookmarkPlus size={18}/> Save expression</button>
    </form>
    <div className="flex justify-between items-center gap-2 flex-wrap">
      <h3 className="font-bold text-base">Your collection ({entries.length})</h3>
      <input aria-label="Search saved expressions" className="p-2 rounded-lg border border-[#D2E0E6] bg-white text-sm" placeholder="Search phrases" value={filter} onChange={e=>setFilter(e.target.value)} />
    </div>
    {shown.length === 0 && <div className="bg-[#EDF4F6] rounded-xl p-5 text-sm text-[#49626D]">{entries.length ? 'No matching expressions.' : 'Your notebook is empty. Save a phrase from your mission or add one above.'}</div>}
    <div className="grid gap-2">{shown.map(entry => <article key={entry.id} className="bg-white border border-[#DDE6E9] rounded-xl p-4 flex items-start justify-between gap-3">
      <div className="min-w-0"><p className="font-semibold text-base break-words">{entry.phrase}</p>{entry.note && <p className="text-sm text-[#596F7A] mt-1 break-words">{entry.note}</p>}</div>
      <div className="flex gap-1 shrink-0">
        <button onClick={() => speakText(entry.phrase)} className="p-2 rounded-lg hover:bg-[#E9F1F5]" title="Listen" aria-label={'Listen to ' + entry.phrase}><Volume2 size={18}/></button>
        <button onClick={() => deletePhrase(entry.id)} className="p-2 rounded-lg hover:bg-[#F9ECEF] text-[#9A6572]" title="Delete" aria-label={'Delete ' + entry.phrase}><Trash2 size={18}/></button>
      </div>
    </article>)}</div>
  </div>;
}
