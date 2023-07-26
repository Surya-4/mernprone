const express=require('express');
const cors=require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User=require('./model/User');
const Post=require('./model/Post');
const app=express();
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const multer=require('multer');
const upload =multer({dest: 'uploads/'});
const fs=require('fs');

const salt=bcrypt.genSaltSync(10);
const secret='hvet40y7g59htushi9ut0g84958ghu9540';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use('/uploads',express.static(__dirname+'/uploads'));

mongoose.connect('mongodb+srv://suryavamsi04:5IZab8Q3v9lrjgOY@cluster0.tkkojbm.mongodb.net/?retryWrites=true&w=majority');

app.post('/register',async(req,res)=>{
    const {userName,password}=req.body;
    try {
        const userdoc=await User.create({
            userName,
            password:bcrypt.hashSync(password,salt),
        });
        res.json(userdoc);
    } catch (error) {
        res.status(400).json(error);
    }
});

app.post('/login',async (req,res)=>{
    const {userName,password}=req.body;
    const userdoc=await User.findOne({userName});
    const passok=bcrypt.compareSync(password,userdoc.password);
    if(passok)
    {
        jwt.sign({userName,id:userdoc._id},secret,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token',token).json({
                id:userdoc._id,
                userName,
            });
        });
    }
    else{
        res.status(400).json('Incorrect Credentials');
    }
});

app.get('/profile',(req,res)=>{
    const {token}=req.cookies;
    jwt.verify(token,secret,{},(err,info)=>{
        if(err) throw err;
        res.json(info);
    });
    res.json(req.cookies);
});

app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
});
 
app.post('/post',upload.single('file'),async (req,res)=>{
   const {originalname,path}=req.file;
   const parts=originalname.split('.');
   const ext=parts[parts.length-1];
   const newPath=path+'.'+ext;
   fs.renameSync(path,newPath);
   const {token}=req.cookies;
   jwt.verify(token,secret,{},async (err,info)=>{
    if(err) throw err;
    const {title,summary,content}=req.body;
    const postDoc= await Post.create({
     title,
     summary,
     content,
     cover:newPath,
     author:info.id,
    });
    res.json({postDoc})
});
});

app.put('/post',upload.single('file'),async(req,res)=>{
    let newPath=null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }
    const {token}=req.cookies;
   jwt.verify(token, secret, {}, async (err, info) => {
     if (err) throw err;
     const { id,title, summary, content } = req.body;
     const postDoc=await Post.findById(id);
     const isAuthor=JSON.stringify(postDoc.author)===JSON.stringify(info.id);
     if(!isAuthor)
     {
        return res.status(400).json('you are not author');
     }
     await postDoc.updateOne({
        title,
        summary,
        content,
        cover:newPath?newPath:postDoc.cover,
     })
     res.json(postDoc);
   });
});
app.get('/post',async(req,res)=>{
    res.json(await Post.find().populate('author',['userName']).sort({createdAt:-1}).limit(20));
});

app.get('/post/:id',async (req,res)=>{
    const {id}=req.params;
    res.json(await Post.findById(id).populate('author',['userName']))
})
app.listen(4000);
//5IZab8Q3v9lrjgOY
//mongodb+srv://suryavamsi04:5IZab8Q3v9lrjgOY@cluster0.tkkojbm.mongodb.net/?retryWrites=true&w=majority