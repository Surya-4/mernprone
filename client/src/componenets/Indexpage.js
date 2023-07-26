import React, { useEffect, useState } from 'react'
import Post from './Post'

export default function Indexpage() {
    const [posts,setPosts]=useState([]);
    useEffect(()=>{
       fetch('http://localhost:4000/post').then(response=>{
        response.json().then(posts=>{
            console.log(posts);
            setPosts(posts);
        })
       })
    },[]);
  return (
    <>
    {posts && 
    posts.map(post=>(
        <Post {...post}/>
    ))
    }
    {!posts && 
    <div>
      No Posts to Display
    </div> }
    </>
  )
}
