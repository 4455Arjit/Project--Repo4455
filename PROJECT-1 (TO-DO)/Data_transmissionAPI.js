//API FILE:
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const port=4499;
const appl=express();
//DATABASE CONNECTION SECTION<-----
let datab=new pg.Client({
    //user must use his own Credentials for using this Code file
    user:process.env.PG_user, 
    host: process.env.PG_host,
    database: process.env.PG_database,
    password: process.env.PG_pass,
    port:parseInt(process.env.PG_port || "6511",10),
});
//DATABASE SECTION END------>
datab.connect();
appl.use(bodyParser.json());
appl.use(bodyParser.urlencoded({extended:true}));
// ======================================GET Tasks==========================================
appl.get("/api/all_tasks",async(requ,resp)=>{     // "/api/all_tasks" route in API
    let full_info=await datab.query("SELECT * FROM task_crush");   //QUERY -1
    console.log(full_info.rows);
    resp.send(full_info.rows);
});//Done✅

//=====================================INSERT TASK==========================================
appl.post("/api/adding_user_task",async (requ,resp)=>{  // "/adding_user_task" route in API ->adding new Task
    let user_task=requ.body["adding_task"];
    try{
        await datab.query("INSERT INTO task_crush (task_info) VALUES($1)",[user_task]);   // QUERY -2
        console.log("Data inserted Successfully!");
        resp.redirect("/api/all_tasks");
    } catch(er){
        console.log(er);
    }
});//Done✅

// ===============================(Getting)Edit Task===============================================
appl.get("/api/edit_task/:id",async(requ,resp)=>{
    let edit_task=await datab.query("SELECT * FROM task_crush where id=$1",[requ.params.id]);  //QUERY-3
    let pure_rows=edit_task.rows;
    console.log(pure_rows,"<=Pure Row sent ");
    resp.send(pure_rows);
}); //Getting particular Task [DONE]

//==============================(Updating)Edit Task===========================

appl.post("/api/editing_task/:id",async(requ,resp)=>{
    try{
        let user_taskinp=requ.body["edit_current_task"];
        await datab.query("UPDATE task_crush SET task_info=$1 where id=$2",[user_taskinp,requ.params.id]);  //QUERY -4
        resp.redirect("/api/all_tasks");
    }catch(er){
        resp.send(er);
        console.log(er);
        }
}); //DONE FINALLY

//======================DELETE TASK=========================
appl.post("/api/deleting_task/:id",async(requ,resp)=>{
    try{
        let deletion_task=requ.params.id;
        let del_q=await datab.query("DELETE FROM task_crush WHERE id=$1 RETURNING*",[deletion_task]);  //QUERY -5
        resp.send(del_q.rowCount); 
    }catch(er){
        console.log(er);
    }
}); //DONE
appl.listen(port,()=>{
    console.log("Here we are->",port);

});


