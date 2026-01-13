import axios from 'axios';
import React, { useContext, useState } from 'react'
import  'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import Editor from '../Editor';
import { UserContext } from '../Usercontext';
const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image'],
      ['clean'],
    ],
  };
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]; 

export default function Createpost() {
    const [title,setTitle]=useState('');
    const [summary,setSummary]=useState('');
    const [content,setContent]=useState('');
    const [files,setFiles]=useState('');
    const navigate=useNavigate();
    const [redirect,setRedirect]=useState(false);
    const {userInfo}=useContext(UserContext);

    async function createnewpost(ev){
        const Data=new FormData();
        Data.set('title',title);
        Data.set('summary',summary);
        Data.set('content',content);
        Data.set('file',files[0]);
        // console.log(Data.title)
        ev.preventDefault();
        try {
          const response=await axios.post('http://localhost:4000/post',Data,{withCredentials:true});
        console.log(response.data)
        setRedirect(true);
        } catch (error) {
          console.log(error);
        }
    }
    if(redirect)
    {
      navigate('/');
    }
  return (
    <form className='create-post'onSubmit={createnewpost}>
      <input
        type="title"
        placeholder="Title"
        value={title}
        onChange={(ev) => {
          setTitle(ev.target.value);
        }}
      />
      <input
        type="summary"
        placeholder="Summary"
        value={summary}
        onChange={(ev) => {
          setSummary(ev.target.value);
        }}
      />
      <input
        type="file"
        onChange={(ev) => {
          setFiles(ev.target.files);
        }}
      />
      <Editor className='editor' value={content} onChange={setContent}/>
      <button style={{ marginTop: "5px" }}>Create Post</button>
    </form>
  );
}
