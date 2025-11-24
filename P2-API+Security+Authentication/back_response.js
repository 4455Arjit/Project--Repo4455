import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const port = 5433;
const app = express();
const API_URL = "http://localhost:5422"
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
        if(resp_data.usermail){
       resp.render("log_in.ejs",{
            usermail:resp_data.usermail,
        });
    }
    }
catch(err){
    const err_data=err.response.data;
    console.log(err_data);
     if(err_data.existing_user_err){
        return resp.render("register.ejs",{
            existing_error:err_data.existing_user_err
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
app.post("/userLogin", async (requ, resp) => {
try{
    const response_login = await axios.post(API_URL + "/api/login", requ.body);
    const resp_data=response_login.data;
    console.log(response_login.data, "<-This is the Response Data");
    if(resp_data.all_posts && resp_data.current_user_points){
        resp.render("public_page.ejs",{
            user_posts:resp_data.all_posts,
            user_points:resp_data.current_user_points,
        });
    }
}
catch(err){
    const err_data=err.response.data
    console.log(err_data);
        if(err_data.non_existent){
        return resp.render("log_in.ejs",{
            not_exist_error:err_data.non_existent,
        });
    }
    else if(err_data.wrong_pass_error){
        resp.render("log_in.ejs",{
            pass_error:err_data.wrong_pass_error,
        });
    }
}
}); //Done
app.listen(port, () => {
    console.log("here-> http://localhost:" + port);
}); //Done
//---------All OUT------------