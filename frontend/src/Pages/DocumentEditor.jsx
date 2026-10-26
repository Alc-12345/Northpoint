import { Link, useParams } from 'react-router-dom';
import { DocumentManager } from './HrDocuments';
import WorkspacePage from '../Components/WorkspacePage';
import { documentTypes } from '../../../backend/shared/hrDocuments';
export default function DocumentEditor(){
  const {type}=useParams();
  return <WorkspacePage title="Create a document" subtitle="Prepare a saved document, then assign its recipient from Document distribution."><div className="workspace-actions mb-6">{Object.entries(documentTypes).map(([key,config])=><Link key={key} className="workspace-button" aria-current={key===type?'page':undefined} to={`/documents/new/${key}`}>{config.title}</Link>)}<Link className="workspace-button" to="/documents">Back to distribution</Link></div>{Object.hasOwn(documentTypes,type)?<DocumentManager key={type} type={type}/>:<p className="workspace-alert">Choose a supported document type above.</p>}</WorkspacePage>;
}
