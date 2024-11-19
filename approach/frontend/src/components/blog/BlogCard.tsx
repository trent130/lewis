import React from 'react';
import type { BlogPost } from '../../services/blogservice';

interface Props {
  post: BlogPost;
}

export function BlogCard({ post }: Props) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={post.coverImage} 
        alt="" 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img 
            src={post.author.avatar} 
            alt={post.author.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString()}
              </time>
              <span aria-hidden="true">&middot;</span>
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            <a href={`/blog/${post.slug}`}>{post.title}</a>
          </h3>
          <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
        </div>
        <div className="mt-6">
          <a
            href={`/blog/${post.slug}`}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Read more →
          </a>
        </div>
      </div>
    </article>
  );
}