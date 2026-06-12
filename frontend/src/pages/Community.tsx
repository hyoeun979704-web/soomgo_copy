import { useEffect, useState } from 'react'

import { api } from '../api/client'
import type { Post } from '../types'

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<Post[]>('/home/posts')
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <header className="page-header">
        <span className="page-title">커뮤니티</span>
      </header>
      {loading && <div className="page-status">불러오는 중...</div>}
      <ul className="post-list padded">
        {posts.map((post) => (
          <li key={post.id} className="post-row">
            <div className="post-body">
              <strong className="post-title">{post.title}</strong>
              <p className="post-preview">{post.body}</p>
              <span className="post-meta">
                {post.region} · 좋아요 {post.likes} · 댓글 {post.comments}
              </span>
            </div>
            <span className="post-thumb">{post.image}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
