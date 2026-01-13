import React from 'react'
import {formatISO9075} from 'date-fns'
import { Link } from 'react-router-dom';
function Post({_id,title,summary,cover,content,createdAt,author}) {
  return (
    <>
      <div className="post" style={{ marginBottom: '40px' }}>
        <div className="image">
          <Link to={`/post/${_id}`}>
          <img   style={{ width: '300px', height: '200px', objectFit: 'cover' }} 
src={'http://localhost:4000/'+cover} alt=""/>
          </Link>
        </div>
        <div className="texts">
          <Link to={`/post/:${_id}`}>
          <h2>{title}</h2>
          </Link>
          <p className="info">
            <a className="author">{author.userName}</a>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          <p>
            {summary}
          </p>
          <div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Post;