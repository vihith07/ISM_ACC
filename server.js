const express=require('express');
const app=express();
const body_parse=require("body-parser");
const mongo=require('mongodb');
const MongoClient=mongo.MongoClient;
const URL="mongodb://127.0.0.1:27017/";
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/ISM_PROJ');
// const { resolveInclude } = require("ejs");
app.use(express.static(__dirname+"/public"));
app.use(body_parse.urlencoded({extended: true}));

// app.use('view engine',"ejs");


app.get("/allowip",async (req,resp)=>{
    let ipadd=req.query.ip;
    let usn1=req.query.name;
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        let ans=await db.collection("ip_access_block").find({usn:usn1}).toArray();
        for(let i=0;i<ans.length;i++){
            if(ans[i].ip==ipadd){
                resp.send("true");
                return ;
            }
        }
        console.log(ans);
        resp.send("false");
    }
    catch(err){
        console.log(err);
    }
})

app.get("/allowstate",async (req,resp)=>{
    let state=req.query.state.toLowerCase();
    let usn1=req.query.name;
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        let ans=await db.collection("state_access_block").find({usn:usn1}).toArray();
        for(let i=0;i<ans.length;i++){
            if(ans[i].state==state){
                resp.send("true");
                return ;
            }
        }
        resp.send("false");
    }
    catch(err){
        console.log(err);
    }
})

app.get("/allowcountry",async (req,resp)=>{
    let country=req.query.country.toLowerCase();
    console.log(country);
    let usn1=req.query.name;
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        let ans=await db.collection("country_access_block").find({usn:usn1}).toArray();
        for(let i=0;i<ans.length;i++){
            if(ans[i].country==country){
                resp.send("true");
                return ;
            }
        }
        resp.send("false");
    }
    catch(err){
        console.log(err);
    }
})


app.get("/allowcity",async (req,resp)=>{
    let city=req.query.city.toLowerCase();
    let usn1=req.query.name;
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        let ans=await db.collection("city_access_block").find({usn:usn1}).toArray();
        for(let i=0;i<ans.length;i++){
            if(ans[i].city==city){
                resp.send("true");
                return ;
            }
        }
        resp.send("false");
    }
    catch(err){
        console.log(err);
    }
})

app.get("/allowpost",async (req,resp)=>{
    let postcode=req.query.postcode.toLowerCase();
    let usn1=req.query.name;
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        let ans=await db.collection("postcode_access_block").find({usn:usn1}).toArray();
        for(let i=0;i<ans.length;i++){
            if(ans[i].postcode==postcode){
                resp.send("true");
                return ;
            }
        }
        resp.send("false");
    }
    catch(err){
        console.log(err);
    }
})


app.get("/allowlatlong",async (req,resp)=>{
    let latlong=req.query.latlong.toLowerCase();
    let usn1=req.query.name;
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        let ans=await db.collection("latlong_access_block").find({usn:usn1}).toArray();
        console.log(latlong);
        console.log(ans);
        for(let i=0;i<ans.length;i++){
            if(ans[i].latlong==latlong){

                resp.send("true");
                return ;
            }
        }
        resp.send("false");
    }
    catch(err){
        console.log(err);
    }
})
 

app.get("/allowisp",async (req,resp)=>{
    let isp=req.query.isp.toLowerCase();
    let usn1=req.query.name;
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        let ans=await db.collection("isp_access_block").find({usn:usn1}).toArray();
        for(let i=0;i<ans.length;i++){
            if(ans[i].isp==isp){
                resp.send("true");
                return ;
            }
        }
        resp.send("false");
    }
    catch(err){
        console.log(err);
    }
})

app.get("/admin/login",(req,resp)=>{
    resp.sendFile(__dirname+"/public/html_files/login.html");
});

const user_schema= new mongoose.Schema({
    usn: String,
    pass: String
});
const user_model=mongoose.model("user_det",user_schema);
app.post("/admin/login",async function(req,resp,next){
    let val=await user_model.find({usn: req.body.user_name});
    if(val.length===0){
        resp.send("incorrect");
    }
    else{
        if(req.body.password===val[0].pass){
            resp.redirect("/admin/logged/"+req.body.user_name);
        }
    }
});


app.get("/admin/signin",(req,resp)=>{
    resp.sendFile(__dirname+"/public/html_files/signin.html");
});
app.post("/admin/signin",async (req,resp)=>{
    let ans=await user_model.find({usn: req.body.user_name});
    if(ans.length!==0){
        resp.send("user name is in use");
    }
    else{
        const user1=new user_model({
            usn: req.body.user_name,
            pass: req.body.password
        });
        user1.save();
        resp.redirect("http://localhost:8000/admin/login");
    }
})



app.get("/admin/logged/:id",async(req,resp)=>{
    //id=req.params.id;
    let ip_arr=[];
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        ip_arr=await db.collection("ip_access_block").find({usn:req.params.id}).toArray();
    }
    catch(err){
        console.log(err);
    }
    let post_arr=[];
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        post_arr=await db.collection("postcode_access_block").find({usn:req.params.id}).toArray();
    }
    catch(err){
        console.log(err);
    }
    let lat_arr=[];
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        lat_arr=await db.collection("latlong_access_block").find({usn:req.params.id}).toArray();
    }
    catch(err){
        console.log(err);
    }
    resp.render("main.ejs",{ usn:req.params.id,ipdets:ip_arr,postdets:post_arr,latdets:lat_arr});
})



app.post("/admin/deleteip",async (req,resp)=>{
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        await db.collection("ip_access_block").deleteOne({usn:req.body.user,ip:req.body.ip});
    }
    catch(err){
        console.log(err);
    }

    resp.send("ok");
})

app.post("/admin/addip",async (req,resp)=>{
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        await db.collection("ip_access_block").insertOne({usn:req.body.user,ip:req.body.ip});
    }
    catch(err){
        console.log(err);
    }

    resp.send("ok");
})


app.post("/admin/deletepost",async (req,resp)=>{
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        await db.collection("postcode_access_block").deleteOne({usn:req.body.user,postcode:req.body.post});
    }
    catch(err){
        console.log(err);
    }

    resp.send("ok");
})

app.post("/admin/addpost",async (req,resp)=>{
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        await db.collection("postcode_access_block").insertOne({usn:req.body.user,postcode:req.body.post});
    }
    catch(err){
        console.log(err);
    }

    resp.send("ok");
})




app.post("/admin/deletelat",async (req,resp)=>{
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        await db.collection("latlong_access_block").deleteOne({usn:req.body.user,latlong:req.body.lat+" "+req.body.long});
    }
    catch(err){
        console.log(err);
    }

    resp.send("ok");
})

app.post("/admin/addlat",async (req,resp)=>{
    try{
        const client=await MongoClient.connect(URL);
        let db=client.db("ISM_PROJ");
        await db.collection("latlong_access_block").insertOne({usn:req.body.user,latlong:req.body.lat+" "+req.body.long});
    }
    catch(err){
        console.log(err);
    }

    resp.send("ok");
})




app.listen(8000);