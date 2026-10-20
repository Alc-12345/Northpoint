import { useEffect, useRef, useState } from 'react';
import { FiArrowDown, FiArrowUp, FiDownload, FiFileText, FiTrash2 } from 'react-icons/fi';
import WorkspacePage from '../Components/WorkspacePage';
import { mergePdfs } from '../utils/mergePdfs';

export default function MergePdf() {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const nextId = useRef(0);

  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  const updateFiles = next => {
    setFiles(next);
    setResult(null);
    setError('');
  };

  const selectFiles = event => {
    const selected = Array.from(event.target.files || []);
    event.target.value = '';
    if (!selected.length) return;
    const valid = selected.filter(file => /\.pdf$/i.test(file.name));
    updateFiles([...files, ...valid.map(file => ({ id: nextId.current++, file }))]);
    if (valid.length !== selected.length) setError('Only PDF files can be added. Other files were skipped.');
  };

  const moveFile = (index, direction) => {
    const next = [...files];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    updateFiles(next);
  };

  const merge = async () => {
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const bytes = await mergePdfs(files.map(entry => entry.file));
      setResult({ url: URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' })) });
    } catch (err) {
      setError(err.message || 'Unable to merge these PDFs. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return <WorkspacePage title="Merge PDFs" subtitle="Select multiple PDFs at once and combine them into a single document. Files are processed in your browser.">
    <section className="workspace-panel" aria-busy={busy}>
      <label className="workspace-field" htmlFor="merge-pdf-files">Add PDF files
        <input id="merge-pdf-files" type="file" accept=".pdf,application/pdf" multiple disabled={busy} onChange={selectFiles} />
      </label>
      <p className="workspace-muted mt-3">PDFs merge in the order below. Use the arrows to change their order, or add more files.</p>
      {error && <p role="alert" className="workspace-alert mt-4">{error}</p>}
      {files.length ? <ol className="mt-5 space-y-3" aria-label="PDF merge order">
        {files.map(({ id, file }, index) => <li key={id} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
          <FiFileText aria-hidden="true" />
          <div className="min-w-0 flex-1"><p className="break-all">{index + 1}. {file.name}</p><p className="workspace-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div>
          <div className="workspace-actions">
            <button type="button" disabled={busy || index === 0} aria-label={`Move ${file.name} up`} onClick={() => moveFile(index, -1)}><FiArrowUp /></button>
            <button type="button" disabled={busy || index === files.length - 1} aria-label={`Move ${file.name} down`} onClick={() => moveFile(index, 1)}><FiArrowDown /></button>
            <button type="button" disabled={busy} aria-label={`Remove ${file.name}`} onClick={() => updateFiles(files.filter(entry => entry.id !== id))}><FiTrash2 /></button>
          </div>
        </li>)}
      </ol> : <p className="workspace-empty">No PDFs selected. Add at least two files to get started.</p>}
      <div className="workspace-actions mt-5">
        <button type="button" disabled={busy || files.length < 2} onClick={merge}>{busy ? 'Merging PDFs…' : 'Merge PDFs'}</button>
        <button type="button" disabled={busy || !files.length} onClick={() => updateFiles([])}>Clear all</button>
        <span className="workspace-muted">{files.length} files selected</span>
      </div>
      <div role="status" aria-live="polite" className="mt-4">
        {busy && <p>Merging your files. Please keep this page open.</p>}
        {result && <><p className="mb-3">Your merged PDF is ready.</p><a className="workspace-button" href={result.url} download="merged.pdf"><FiDownload />Download merged PDF</a></>}
      </div>
    </section>
  </WorkspacePage>;
}
