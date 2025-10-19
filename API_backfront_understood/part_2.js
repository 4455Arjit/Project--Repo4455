import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
const app=express();
const port=4545;
const API_Link="http://localhost:4500";
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",async(requ,resp)=>{    //Default Page with Displaying all Customers-> DONE✅
    try{
    const resp_from_api= await axios.get(API_Link+"/all");  //API_URL+"/all" from API route
    resp.render("Rendering_pageDefault.ejs",{
        all_cards:resp_from_api.data,
    });
    }catch(error){
        resp.sendStatus(404);
    }
});
app.get("/customer/:phone",async(requ,resp)=>{  //Displaying Particular Customer using PhoneNumber in the URL Parameters on ENDPOINT-> DONE✅
    try {
        const resp_from_api= await axios.get(API_Link+"/specific_customer/"+requ.params.phone); //API_URL + route to api + PhoneNumber
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
        heading:"Add Customer",
        submit:"Create",
    });
});
app.post("/addcustomer",async(requ,resp)=>{
   //This issue has been resolved by me : Myself.
    //here im facing issue of linking my HTML form in my Usage_page.ejs file for receiving inputs from the frontend..but somehow part_1.js is working fine with postman..but i want the inputs to be receive by my api from the Frontend. 
    const resp_from_api=await axios.post(API_Link+"/addcustomer",requ.body);
    console.log(resp_from_api.data);
    resp.redirect("/");
});
app.get("/updatingcustomer/:phone",async (requ,resp)=>{
    const searched_customer= await axios.get(API_Link+"/specific_customer/"+requ.params.phone);
    console.log(searched_customer.data);
    resp.render("Usage_page_editing.ejs",{
        heading:"Editing Customer",
        submit: "Update Customer",
        user_info:searched_customer.data,
    });
});
app.post("/updatingcustomer/:phone",async(requ,resp)=>{
    try{
        const api_resp= await axios.patch(API_Link+"/specific_customer/"+requ.params.phone,requ.body);
        console.log(api_resp.data);
        resp.redirect("/");
    }catch(error){
        resp.sendStatus(404);
    }
});
app.post("/deletingcustomer/:phone",async(requ,resp)=>{
    try{
        await axios.delete(API_Link+"/delete_customer/"+requ.params.phone);
        
    resp.redirect("/");
    }catch(error){
        resp.sendStatus(404);
    }
});
app.listen(port,()=>{
    console.log("here i m: ",port);
});
