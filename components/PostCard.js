import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';

export default function PostCard({ post, date, feature = false }) {
  return (
    <Link href={`/insights/${post.slug}`} className={`post-card${feature ? ' post-feature' : ''}`}>
      <div className="post-media">
        <Image src={post.image} alt="" fill sizes={feature ? '(max-width: 900px) 100vw, 60vw' : '(max-width: 900px) 100vw, 33vw'} />
        <span className="post-cat">{post.category}</span>
      </div>
      <div className="post-body">
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="post-meta">
          <span><Calendar /> {date}</span>
          <span><Clock /> {post.minutes} min read</span>
        </div>
      </div>
    </Link>
  );
}
