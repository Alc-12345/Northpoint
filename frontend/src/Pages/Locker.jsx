import { useEffect, useState } from 'react';
import api from '../services/api';
const getAuthUser = () => { try { return JSON.parse(localStorage.getItem('authUser') || 'null'); } catch { return null; } };

export default function Locker() {
  const [folders, setFolders] = useState([]);
  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [kind, setKind] = useState('client');
  const run = async action => {
    setBusy(true); setMessage('');
    try { await action(); } catch (error) { setMessage(error.response?.data?.message || error.message); }
    finally { setBusy(false); }
  };
  useEffect(() => {
    if (!['admin', 'superadmin'].includes(getAuthUser()?.role)) return;
    api.get('/hr/locker/folders').then(({ data }) => setFolders(data)).catch(error => setMessage(error.response?.data?.message || error.message));
  }, []);
  const input = 'rounded-lg border p-3 dark:bg-slate-900 dark:border-slate-700';
  const button = 'rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50';
  if (!['admin', 'superadmin'].includes(getAuthUser()?.role)) return <p>Locker access is available to administrators only.</p>;
  return <div className="space-y-6 text-gray-900 dark:text-gray-100">
    <div><h1 className="text-2xl font-bold">HR Locker</h1><p className="mt-2 text-sm text-gray-500">Client folders and your personal files. Files up to 5 MB each.</p></div>
    {message && <p role="status" className="rounded-lg border p-3">{message}</p>}
      <form className="flex flex-wrap gap-3" onSubmit={event => { event.preventDefault(); run(async () => { const { data } = await api.post('/hr/locker/folders', { name, kind }); setFolders(current => [...current, data]); setName(''); }); }}><input aria-label="Folder name" className={input} placeholder="Client or personal folder name" required maxLength={120} value={name} onChange={e => setName(e.target.value)}/><select aria-label="Folder category" className={input} value={kind} onChange={e => setKind(e.target.value)}><option value="client">Client folder · shared with admins</option><option value="personal">Personal folder · only you</option></select><button disabled={busy} className={button}>Create folder</button></form>
      <div className="grid gap-5 md:grid-cols-3"><section className="rounded-xl border p-4 space-y-2"><h2 className="font-semibold">Folders</h2>{!folders.length && <p className="text-sm text-gray-500">Create your first folder to save files.</p>}{folders.map(item => <button key={item._id} disabled={busy} className={`block w-full text-left rounded-lg border p-3 ${folder?._id === item._id ? 'border-blue-500 bg-blue-50 dark:bg-slate-800' : ''}`} onClick={() => run(async () => { const { data } = await api.get(`/hr/locker/folders/${item._id}/files`); setFolder(item); setFiles(data); })}><span className="block font-medium break-words">{item.name}</span><span className="text-xs text-gray-500">{item.kind === 'personal' ? 'Personal · only you' : 'Client'}</span></button>)}</section>
      <section className="md:col-span-2 rounded-xl border p-5 space-y-4">{!folder ? <p>Select a folder to view or upload files.</p> : <><h2 className="font-semibold break-words">{folder.name}</h2><label className="block">Upload file<input type="file" className="block mt-2 max-w-full" disabled={busy} onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (!file) return; run(async () => {
        if (!file.size || file.size > 5 * 1024 * 1024) throw new Error('Choose a non-empty file up to 5 MB');
        const content = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.onerror = () => reject(new Error('Unable to read file')); reader.readAsDataURL(file); });
        const { data } = await api.post(`/hr/locker/folders/${folder._id}/files`, { name: file.name, content }); setFiles(current => [data, ...current]);
      }); }}/></label>{!files.length && <p className="text-gray-500">No files in this folder yet.</p>}{files.map(file => <div key={file._id} className="flex items-center justify-between gap-3 border-t pt-3"><div className="min-w-0"><p className="break-words">{file.name}</p><p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB · {new Date(file.createdAt).toLocaleDateString()}</p></div><button disabled={busy} className="text-blue-600" onClick={() => run(async () => { const { data } = await api.get(`/hr/locker/folders/${folder._id}/files/${file._id}`, { responseType: 'blob' }); const url = URL.createObjectURL(data); const anchor = document.createElement('a'); anchor.href = url; anchor.download = file.name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); })}>Download</button></div>)}</>}</section></div>
  </div>;
}
