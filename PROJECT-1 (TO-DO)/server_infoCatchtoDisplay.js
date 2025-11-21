import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const port=4500;
const appl=express();
const API_URL='http://localhost:4499';
appl.use(bodyParser.urlencoded({extended:true}));

//=================================Get all Tasks=================================
appl.get("/",async(requ,resp)=>{
    try{
        const list_from_api=await axios.get(API_URL+'/api/all_tasks');
        let full_data=list_from_api.data;
        console.log(full_data);
        resp.render("Displaypage.ejs",{
            all_tasks:full_data,
        });
    }catch(er){
        console.log(er);
    }
}); //Done✅

//==============================Add Tasks========================================

appl.post("/add_task",async(requ,resp)=>{  // "/add_task" in frontend EJS
    try{
        await axios.post(API_URL+'/api/adding_user_task',requ.body);
       // console.log(JSON.stringify(resp_api.data)+" <-This is the data"); //RESPONSE DATA COMING FROM API
        resp.redirect('/');
    }catch(er){
        console.log(er);
    }
});//Done✅


//==========================(Getting and Displaying)Edit Task===============================
appl.get("/edit_task/:id",async(requ,resp)=>{  //set on button as href ='/edit_task/...'
    try{
        let specific_task=await axios.get(API_URL+"/api/edit_task/"+requ.params.id);
        let usabledata=specific_task.data[0];
        console.log(usabledata);
        console.log("-------");
        resp.render("editing.ejs",{
        user_task:usabledata,
        });
    }catch(er){
        console.log(er);
    }
}); //Get and Display Task [DONE]

//=========================(Updating)Edit the Displayed Task===================

appl.post("/editing_task/:id",async(requ,resp)=>{  //Post on this: ' /editing_task/...'
    try{
        const search_task=await axios.post(API_URL+'/api/editing_task/'+requ.params.id,requ.body);
        console.log(search_task.data+"Searched one");
        resp.redirect("/");
    }catch(er){
        console.log(er);
    }
}); //DONE FINALLY

//========================DELETE TASK==============================
appl.post("/delete_task/:id",async(requ,resp)=>{
    const delete_resp=await axios.post(API_URL+"/api/deleting_task/"+requ.params.id);
    console.log(delete_resp.data);
    resp.redirect("/");
});//DONE

appl.listen(port,()=>{
    console.log("Here we are->",port);
});