import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Post } from '../lib/db';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const postUrl = post.slug && post.tags?.[0] 
    ? `/report/${post.tags[0]}/${post.slug}` 
    : `/post/${post.id}`;

  return (
    <Link 
      to={postUrl}
      className="group flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 bg-zinc-900">
        {post.imageUrl ? (
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900 border border-white/5">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            </div>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest">
            Read Intel
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
            {post.tags?.[0] || 'Unclassified'}
          </span>
          <div className="h-[1px] flex-1 bg-white/5"></div>
          <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold leading-tight tracking-tight text-white group-hover:text-zinc-300 transition-colors mb-4">
          {post.title}
        </h3>
        
        <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed mb-6">
          {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
        </p>
      </div>
    </Link>
  );
};

export default PostCard;
