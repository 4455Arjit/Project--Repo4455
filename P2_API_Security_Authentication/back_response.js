import express from "express";
import axios from "axios";
const port = process.env.PORT;
const app = express();
axios.defaults.withCredentials=true;
const API_URL = process.env.NODE_ENV === 'production'? "https://project-repo4455.onrender.com" : "http://localhost:5422";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//----------------------------Landing Page----------------------------------
app.get("/", (requ, resp) => {
    resp.render("landing.ejs");
}); //DONE
// ============================Register Page LOAD============================
app.get("/regis", (requ, resp) => {   // i've set "/regis" on the HREF of landing page so that page will capture the "/regis" and send a request to backend to load the same endpoint :->so we rendered "register.ejs" from raw backend
    resp.render("register.ejs");
}); //DONE
// ============================User Login Page LOAD==========================
app.get("/login", (requ, resp) => {   // i've set "/login" on the HREF of landing page so that page will capture the "/login" and send a request to backend to load the same endpoint :->so we rendered "log_in.ejs" from raw backend
    resp.render("log_in.ejs");
});
//=============================Post to Register Page=========================
app.post("/regCredentials", async (requ, resp) => {
    try{

        const response_register = await axios.post(API_URL + "/api/regis", requ.body);
        const resp_data=response_register.data;
        console.log(resp_data, "<-Heres the Response Data");
        if(resp_data.user_e_mail){
       resp.render("log_in.ejs",{
            usermail:resp_data.user_e_mail,
        });
    }
    }
catch(err){
    const err_data=err.response?.data;
    console.log(err_data);
     if(err_data.exist_er){
        return resp.render("register.ejs",{
            existing_error:err_data.exist_er
        });
    }else if(err_data.empty_columns_err){
        return resp.render("register.ejs",{
            error_empty_columns:err_data.empty_columns_err
        });
    }else{
        return resp.render("register.ejs",{
            bad_gateway:err_data.bad_gateway_err,
        });
    }
 }
}); //Done
//=================UserLogin=========================
app.get("/page_feed",async(requ,resp)=>{
    const cook_cookie_received=requ.headers.cookie;
    if(!cook_cookie_received){
        return resp.redirect("/login");
    }
    const posts_APIresp=await axios.get(API_URL+"/api/public_posts",{headers:
        {Cookie:cook_cookie_received}
    ,withCredentials:true,});
        const posts_API_data=posts_APIresp.data;
        if(posts_API_data.Login_again){
            resp.render("log_in.ejs",{login_again_error:posts_API_data.Login_again},);
        }
        resp.render("public_page.ejs",{
            user_posts:posts_API_data.retrieved_posts,
            user_points:posts_API_data.user_points_raw,
            uuser_name:posts_API_data.uusername_raw,
        });
});
app.post("/userLogin", async (requ, resp) => {
try{
    const response_login = await axios.post(API_URL + "/api/login", requ.body,{
        withCredentials:true,
    });
    const cook_cookie=response_login.headers['set-cookie'];
    if(cook_cookie){
        resp.setHeader("Set-Cookie",cook_cookie);   //This line
    }
    const post_API_response=await axios.get(API_URL+"/api/public_posts",{
        headers:{Cookie:cook_cookie},  //why "Cookie" name is used ?is it just like JSON or a key-value pair?
        withCredentials:true,

    });
    const resp_data=response_login.data;
    console.log(resp_data, "<-This is the Response Data");
    const post_API_response_Data=post_API_response.data;
    console.log(post_API_response_Data, "<-Full Data ONLY");
    if(post_API_response_Data.Login_again){
        resp.render("log_in.ejs",{
            login_again_error: post_API_response_Data.Login_again,
        });
    }else{
        console.log(post_API_response_Data,"<-Here's all POSTS DATA");
        resp.redirect("/page_feed");
    }
}
catch(err){
    const err_data=err.response?.data;
    console.log(err_data);
        if(err_data?.not_exist_err){
        resp.render("log_in.ejs",{
            not_exist_error:err_data.not_exist_err,
        });
    }
    else if(err_data?.pass_err){
        resp.render("log_in.ejs",{
            pass_error:err_data.pass_err,
        });
    }
}
}); //Done
app.post("/creation",async(requ,resp)=>{
    try{
        const incoming_cookie=requ.headers.cookie;
        const post_api_resp=await axios.post(API_URL+"/api/post_creation",requ.body,{withCredentials:true,
    headers:{Cookie:incoming_cookie}
});
const post_api_data=post_api_resp.data;
console.log(post_api_data,"<-Post Data");
if(post_api_data.success_mess){
    console.log(post_api_data.success_mess);
    resp.redirect('/page_feed');
}else if(post_api_data.failure_mess){
    console.log(post_api_data.failure_mess);
}else if(post_api_data.redirection_mess){
    console.log("we're sorry Baboo , we accidentally Barbequed it!",post_api_data.redirection_mess);
    resp.redirect('/page_feed');
}
}catch(e){
    const unexp_err=e.response?.data;
    console.log(unexp_err,"<<--Unexpected Err");
    resp.redirect('/page_feed');
}
});

app.listen(port, () => {
    console.log("here's Our Server running: -> " + port);
}); //Done

//---------All OUT------------

