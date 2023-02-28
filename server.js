const express=require('express');
const app=express();
const mongo=require('mongodb');
const MongoClient=mongo.MongoClient;
const URL="mongodb://127.0.0.1:27017/";

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

app.listen(8000);