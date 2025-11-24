import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import pg from "pg";
import bcrypt from "bcrypt";
const saltrounds = 3;
const app = express();
const port = 5422;
dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const dbase = new pg.Client({
    user: process.env.PG_user,
    host: process.env.PG_host,
    database: process.env.PG_database,
    password: process.env.PG_pass,
    port: parseInt(process.env.PG_port || "6511", 10),
});
dbase.connect();

app.post("/api/regis", async (requ, resp) => {
    try {
        const user_email = requ.body["user_email"];
        const plain_pass = requ.body["user_pass"];
        let user_points = user_email.trim().length;
        console.log("User Points : " + user_points);
        if (user_email && plain_pass) {
            const check_existing = await dbase.query("SELECT * FROM user_creds where email=$1", [user_email.trim()]);
            if (check_existing.rows.length > 0) {
                return  resp.status(400).json({
                    existing_user_err:"User already exists! Go to login Page",
                });
            }else{
                const hashed_pass=await bcrypt.hash(plain_pass, saltrounds);
                const q1=await dbase.query("INSERT INTO user_creds (email,pass,user_credits) VALUES($1,$2,$3) RETURNING*",[user_email,hashed_pass,parseInt(user_points,10)]);
                const q2=await dbase.query("INSERT INTO hash_passes (email,pass) VALUES($1,$2) RETURNING*",[user_email,hashed_pass]);
                console.log(q1, "<-Here Query1");
                let user_posts = await dbase.query("SELECT post_of_user FROM pub_info");
                console.log(user_posts.rows);
                console.log(q2,"<-Here is Query2");
                resp.json({
                    usermail: user_email,
                });
            }
        } else {
           return resp.status(401).json({
                empty_columns_err:"Empty Columns!Fill them right away !",
            });
        }
    }
    catch (err) {
        console.log(err);
        return resp.status(404).json({
            bad_gateway_err:"Bad Response!"+resp.sendStatus(404),
        });
    }
});  //Done

app.post("/api/login", async (requ, resp) => {
        const user_email = requ.body['user_email'];
        const plain_pass = requ.body['user_pass'];
        const Q1 = await dbase.query("SELECT * FROM user_creds WHERE email=$1", [user_email]);
        try{
        if (Q1.rows.length > 0) {
        let user_details = Q1.rows[0];
        const stored_pass = user_details.pass;
        console.log(stored_pass);
        const pass_match= await bcrypt.compare(plain_pass,stored_pass);
        if (!pass_match){
            return resp.status(401).json({
                wrong_pass_error:"Passwords Mismatch ! Try again",
            });
            } else {
                const Q2 = await dbase.query("SELECT post_of_user FROM pub_info");
                let user_credits = await dbase.query("SELECT user_credits FROM user_creds WHERE email=$1", [user_email.trim()]);
                resp.json({
                    all_posts: Q2.rows,
                    current_user_points: user_credits.rows[0],
                });
            }
        } else {
            return resp.status(401).json({
                non_existent:"User Not Found!",
            });
        }
    }catch(err){
        resp.sendStatus(404);
        }
    }); //Done

app.listen(port, () => {
    console.log("API here-> http://localhost:" + port);
});