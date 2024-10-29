const express=require("express");

const app=express();
const path=require("path");
const mysql=require("mysql2");
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');


const port=6060;
app.use(methodOverride('_method'))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.listen(port, ()=>{
    console.log(`listen to the port of ${port}`);
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'data_pack',
    password: 'Sunny@2001'
});

app.get("/", (req, res)=>{
    let q="select count(*) as count from user";
    try{
        connection.query(q, (err, result)=>{
            if(err){
                throw err;
            }
            let Count=result[0]["count"];
            res.render("home.ejs", {Count});
        })
    }catch(err){
        res.render("error.ejs", err);
    }
})

app.get("/users", (req, res)=>{
    let q="select * from user";
    try{
        connection.query(q, (err, result, field)=>{
            if(err) throw err;
            res.render("showuser.ejs", {result});
        })
    }catch(err){
        res.render("error.ejs", err);
    }
})

app.get("/users/:id/edit", (req, res)=>{
    let {id}=req.params;
    try{
        let q=`select * from user where id="${id}"`;
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let data=result[0];
            res.render("form.ejs", {data});
        })
    }catch(err){
        res.render("error.ejs", err);
    }
})

app.patch("/users/:id", (req, res)=>{
    let {id}=req.params;
    let {username, email, password}=req.body;
    try{
        let q=`select * from user where id="${id}"`;
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let data=result[0];
            if(data.password!=password){
                res.send("Wrong Password");
            }else{
                try{
                    let q=`update user set username='${username}', email='${email}' where id='${id}'`;
                    connection.query(q, (err, result)=>{
                        if(err) throw err;
                        console.log(result);
                        res.redirect("/users");
                    })
                }
                catch(err){
                    res.render("error.ejs", err);
                }
            }
        })
    }catch(err){
        res.render("error.ejs", err);
    }
})

app.get("/users/:id/delete", (req, res)=>{
    let {id}=req.params;
    try{
        let q=`select * from user where id="${id}"`;
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let data=result[0];
            res.render("deletePage.ejs", {data});
        })
    }catch(err){
        res.render("error.ejs", err);
    }
})

app.delete("/users/:id", (req, res)=>{
    let {id}=req.params;
    let {email, password}=req.body;
    try{
        let q=`select * from user where id="${id}"`;
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let data=result[0];
            if(data.password!=password || data.email!=email){
                res.send("Wrong Password");
            }else{
                try{
                    let q=`delete from user where id='${id}'`;
                    connection.query(q, (err, result)=>{
                        if(err) throw err;
                        console.log(result);
                        res.redirect("/users");
                    })
                }
                catch(err){
                    res.render("error.ejs", err);
                }
            }
        })
    }catch(err){
        res.render("error.ejs", err);
    }
})

app.get("/users/new", (req, res)=>{
    res.render("NewEntry.ejs");
})

app.post("/users", (req, res)=>{
    let {username, email, password}=req.body;
    try{
        let q=`insert into user(id, username, email, password) values(?, ?, ?, ?)`;
        let newUser=[uuidv4(), username, email, password];
        connection.query(q, newUser, (err, result, field)=>{
            if(err) throw err;
            console.log(result);
            res.redirect("/users");
        })
    }catch(err){
        res.render("error.ejs", err);
    }
})