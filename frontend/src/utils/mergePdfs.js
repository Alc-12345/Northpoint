import { PDFDocument } from 'pdf-lib';

export async function mergePdfs(files) {
  if (files.length < 2) throw new Error('Select at least two PDF files to merge.');
  const merged = await PDFDocument.create();
  for (const file of files) {
    let source;
    try {
      source = await PDFDocument.load(await file.arrayBuffer());
    } catch {
      throw new Error(`Cannot read "${file.name}". Use a valid PDF without password protection.`);
    }
    const pages = await merged.copyPages(source, source.getPageIndices());
    pages.forEach(page => merged.addPage(page));
  }
  if (!merged.getPageCount()) throw new Error('The selected PDFs contain no pages.');
  return merged.save();
}
