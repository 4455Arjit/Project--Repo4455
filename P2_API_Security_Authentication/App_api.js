import express from "express";
import dotenv from 'dotenv';
import {Pool} from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import {Strategy} from 'passport-local';
import cors from 'cors';
//All paths: POST- /api/regis  ,POST- /api/login  ,GET- /api/public_posts
const salt_rounds=3;
const app=express();
const port =process.env.PORT;
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:true,
    credentials:true
}));
app.use(session({
    secret:process.env.Session_key,
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:60000 * 60*24,  //(For demonstration Purposes only)
    },
}));
app.use(passport.initialize());
app.use(passport.session());
const d_base=new Pool({
    connectionString:process.env.DATABASE_URL,
     ssl: { rejectUnauthorized: false },
    max: 100,
    idleTimeoutMillis:50000,
    connectionTimeoutMillis:3000
});
app.use((requ, resp, next) => {  //This block is not necessary but helping me somehow tracking my progress🥴
    console.log(requ.sessionID, "<- Session ID");
    console.log(requ.session, "<=Session");
    console.log(requ.user, "<-User i Guess");
    next();
});
passport.use(new Strategy(
    {
        usernameField:'user_email',
        passwordField:'user_pass'
    },
    async function verify_him(user_email,user_pass,calling){

        try{ 
            const get_user_data=await d_base.query("SELECT user_name,email,user_credits FROM user_creds WHERE email=$1",[user_email]);
            const get_user_info=get_user_data.rows;
            if(get_user_info.length>0){
                const get_user_details=get_user_info[0];
                const get_password_data= await d_base.query("SELECT pass FROM user_creds WHERE email=$1",[user_email]);
                const get_password_info= get_password_data.rows[0];
                const compare_pass=await bcrypt.compare(user_pass,get_password_info.pass);
                console.log(compare_pass,"Comparison Response"); //Will be True or False
                if(compare_pass==true){
                    console.log("Log-In successfull!");
                    return calling(null,get_user_details);
                }else{
                    const wrong_pass="Wrong Password ! Try again until you get Tired and Smash your Device on the floor!☠️";
                    console.log(wrong_pass,"Error 1");
                    return calling(null,false,{wrong_passing:wrong_pass});
                }
            }else{
                const exist_er="User is not Born Yet ! Please Go to the Doctor: I mean SignUP page!";
                console.log(exist_er," Error 2");
                return calling(null,false,{no_existence:exist_er});
            }

        }catch(e){
            return calling(e);
        }


    }
));
passport.serializeUser((user_here,calling)=>{
    calling(null,user_here);
});
passport.deserializeUser((user_here,calling)=>{
    calling(null,user_here);
});
app.post("/api/login",(requ,resp,next)=>{
    passport.authenticate('local',(er,user,info)=>{
        if(er){
            return next(er);
        }
        if(!user){
            if(info.wrong_passing){
                console.log(info.wrong_passing,"Error 1 for Password");
                return resp.status(401).json({
                    pass_err:info.wrong_passing
                });
            }else if(info.no_existence){
                console.log(info.no_existence,"Error 2 for Not Existing");
                return resp.status(404).json({
                    not_exist_err:info.no_existence,
                });
            }return resp.status(404).json({
                usermail_raw:requ.body.user_email,
                pass_error_raw:info.wrong_pass,
                not_exist_raw:info.no_existence,
            });
        }requ.logIn(user,loginErr=>{    //Explain this part
            if(loginErr)return next(loginErr);
            return resp.json({user});
        });
    })(requ,resp,next);            //Explain this Part
});
app.get("/api/public_posts",async(requ,resp)=>{
    if(requ.isAuthenticated()){
        const user_info=requ.user;
        console.log(user_info,"Full Info of User except Passkey");
        const update_points=await d_base.query("SELECT user_credits FROM user_creds WHERE user_name=$1",[user_info.user_name]);
        if(update_points.rows.length>0){
            user_info.user_credits=update_points.rows[0].user_credits;
        }
        const get_posts=await d_base.query("SELECT post_of_user FROM pub_info");
        console.log(get_posts);
        return resp.status(200).json({
            uusername_raw:user_info,
            user_points_raw:user_info,
            retrieved_posts:get_posts.rows,
        });
    }else{
        return resp.status(400).json({Login_again: "Session EXPIRED!..Give some medicine to Revive him...i mean Login Again"});
    }
});
//I want to get the current user who is currently logged in.

app.post("/api/post_creation",async(requ,resp)=>{  //Then i want to grab the current user when im about to make a Post on a page and when i Create a post , i want the user_name to be written in the end of the Text Post automatically at the backend:so then the post will be displayed and the username will be displayed at the end automatically.
    try{
        if(requ.isAuthenticated()){
            const full_req=requ;
            console.log(full_req,"<<<<<<<<<<======FULL REQUEST????????????????????????????????");
            const user_info=requ.user;
            const usr_name=user_info.user_name;
            console.log(usr_name,"<<<<<<<_________THIS IS USER_NAME INFO");
            const raw_post=requ.body["create_post"];
            const user_post=`${raw_post} :by-${usr_name}`;
            const user_post_query=await d_base.query("INSERT INTO pub_info(user_name,post_of_user) values($1,$2)",[usr_name,user_post]);
            const success_point=3;
            await d_base.query("UPDATE user_creds SET user_credits=user_credits+$1 WHERE user_name=$2",[parseInt(success_point),usr_name]);
            if(user_post_query){
                return resp.status(200).json({
                success_mess:"Post Created",
               });
            }else{
                return resp.status(404).json({
                    failure_mess:"Sorry We messed up! somehow",
                });
            }
        }
    }catch(e){
        console.log(e);
        return resp.json({redirection_mess:"Redirect to Feed"});
    }
    
});
app.post("/api/regis",async (requ,resp)=>{
    try {
        const user_email=requ.body["user_email"];
        const plain_pass= requ.body["user_pass"];
        const username=user_email.split("@")[0];
        let user_points=user_email.trim().length;
        if(user_email && plain_pass){
            const check_if_exist=await d_base.query("SELECT * FROM user_creds WHERE email=$1",[user_email]);
            if(check_if_exist.rows.length>0){
                return resp.status(400).json({
                    exist_er:"User Exists on the Planet!",
                });
            }else{
                const hashing=await bcrypt.hash(plain_pass,salt_rounds);
                await d_base.query("INSERT INTO user_creds (email,pass,user_credits,user_name) VALUES($1,$2,$3,$4) RETURNING*", [user_email, hashing, parseInt(user_points, 10), username])
                .then(query_result=>{
                    console.log(query_result,"The Promise Result")
                    return resp.status(200).json({
                        user_e_mail:user_email,
                    });
                });
            }
        }else{
            return resp.status(405).json({
                empty_columns_err:"Columns are dead!",
            });
        }
    } catch (e) {
        console.log(e);
        return resp.status(404).json({
            bad_gateway_err:"Bad Response! You're gettin Naauughty! Behave Yourself",
        });
    }
});
app.listen(port,()=>{
    console.log("here im -> http://localhost:"+port);

});

