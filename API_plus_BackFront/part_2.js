import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
const app=express();
const port=4545;
const API_Link="http://localhost:4500";
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",async(requ,resp)=>{
    try{
    const resp_from_api= await axios.get(API_Link+"/all");
    resp.render("Rendering_pageDefault.ejs",{
        all_cards:resp_from_api.data,
    });
    }catch(error){
        resp.sendStatus(404);
    }
});
app.get("/customer/:phone",async(requ,resp)=>{
    try {
        const resp_from_api= await axios.get(API_Link+"/specific_customer/"+requ.params.phone);
        console.log(resp_from_api.data);
        resp.render("searched_customer.ejs",{
            searched_customer:resp_from_api.data,
        });
    } catch (error) {
        resp.sendStatus(404);
    }
});
app.get("/addcustomer",(requ,resp)=>{
    resp.render("Usage_page.ejs",{
        submit:"Create",
    });
});
app.post("/addcustomer",async(requ,resp)=>{
    //here im facing issue of linking my HTML form in my Usage_page.ejs file for receiving inputs from the frontend..but somehow part_1.js is working fine with postman..but i want the inputs to be receive by my api from the Frontend. 
    const resp_from_api=await axios.post(API_Link+"/addcustomer",requ.body);
    resp.render("Usage_page.ejs");
    console.log(resp_from_api.data);
});
app.listen(port,()=>{
    console.log("here i m: ",port);
});
