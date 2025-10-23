import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3934;
const datab=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"web_part",
  password:"VegitoTheGodKiller445511",
  port:"6511",
});
datab.connect();
let quiz = [];
datab.query("SELECT * FROM flags_part",(err,resp)=>{
  if(err){
    resp.error("Error occured! sorry!",err.stack);
  }else{
    quiz=resp.rows;
    // console.log(quiz);
  }
  datab.end();
});
let totalCorrect = 0;
let currentquestion={};
async function nextQuestion(){
  let question_part= quiz[Math.floor(Math.random()*quiz.length)]
  currentquestion=question_part;
  console.log(currentquestion);
}
let score=0;
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/",async(requ,resp)=>{
  totalCorrect=0;
  await nextQuestion();
  resp.render("index_customized.ejs",{
    question:currentquestion,
    totalScore:score,
  });
});
app.post("/submission",(requ,resp)=>{
  let user_inp=requ.body["answer"];
  if(currentquestion.name.toLowerCase()===user_inp.toLowerCase()){
    score=totalCorrect++;
    console.log(score);
  }
  nextQuestion();
  resp.render("index_customized.ejs",{
    question:currentquestion,
    totalScore:score,
  });
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
