import '../workspace.css';
export default function WorkspacePage({ title, subtitle, actions, children }) {
  return <main className="workspace-page"><header className="workspace-heading"><div><p className="workspace-eyebrow">Northpoint workspace</p><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{actions && <div className="workspace-actions">{actions}</div>}</header>{children}</main>;
}
