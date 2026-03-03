import { useState } from 'react';
import { Bold, Heading1, Heading2, Type, Image as ImageIcon, Tag as TagIcon, Eye, Save, Link as LinkIcon, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface EditorProps {
  initialData?: {
    title: string;
    slug: string;
    content: string;
    tags: string[];
    imageUrl?: string;
  };
  onSave: (data: any) => void;
}

const Editor = ({ initialData, onSave }: EditorProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState(initialData?.tags.join(', ') || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [preview, setPreview] = useState(false);

  const handleSave = () => {
    onSave({
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      content,
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      imageUrl
    });
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const newText = text.substring(0, start) + before + selected + after + text.substring(end);
    setContent(newText);
    
    // Set focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-500 text-[11px] font-bold tracking-[0.3em] uppercase">
            <EditIcon className="w-4 h-4" />
            Composer
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white uppercase">
            {initialData ? 'Edit Intelligence' : 'New Intelligence'}
          </h1>
          <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs">Drafting Classified Report</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
          >
            {preview ? <EditIcon className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {preview ? 'Editor' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all shadow-xl uppercase tracking-widest text-xs"
          >
            <Save className="w-4 h-4" />
            Save Report
          </button>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Report Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white focus:border-white/20 outline-none transition-all font-medium"
              placeholder="The Great Breach of 2026"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Custom Slug (URL Path)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-emerald-500/70 focus:border-white/20 outline-none transition-all font-mono text-sm"
              placeholder="great-breach-2026"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Header Image URL</label>
            <div className="relative">
              <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-white/20 outline-none transition-all font-medium"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Classifications (Tags)</label>
            <div className="relative">
              <TagIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-white/20 outline-none transition-all font-medium"
                placeholder="Cyber, Malware, Linux"
              />
            </div>
          </div>
        </div>

        {!preview ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 p-3 bg-black/40 border border-white/5 rounded-2xl">
              <ToolbarButton onClick={() => insertText('**', '**')} icon={<Bold className="w-4 h-4" />} label="Bold" />
              <ToolbarButton onClick={() => insertText('# ', '')} icon={<Heading1 className="w-4 h-4" />} label="H1" />
              <ToolbarButton onClick={() => insertText('## ', '')} icon={<Heading2 className="w-4 h-4" />} label="H2" />
              <ToolbarButton onClick={() => insertText('> ', '')} icon={<Type className="w-4 h-4" />} label="Quote" />
              <ToolbarButton onClick={() => insertText('`', '`')} icon={<Code className="w-4 h-4" />} label="Code" />
              <ToolbarButton onClick={() => insertText('![Alt Text](', ')')} icon={<ImageIcon className="w-4 h-4" />} label="Image" />
              <ToolbarButton onClick={() => insertText('[Link Text](', ')')} icon={<LinkIcon className="w-4 h-4" />} label="Link" />
            </div>
            <textarea
              id="editor-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[600px] bg-black/40 border border-white/5 rounded-[2rem] p-8 focus:border-white/20 outline-none transition-all font-mono text-sm leading-relaxed text-zinc-300"
              placeholder="Compose your intelligence report using Markdown..."
            />
          </div>
        ) : (
          <div className="w-full min-h-[600px] bg-black/40 border border-white/5 rounded-[2rem] p-12 overflow-y-auto">
            <div className="prose-custom">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ToolbarButton = ({ onClick, icon, label }: { onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick} 
    className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
  >
    {icon}
    {label}
  </button>
);

const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export default Editor;
