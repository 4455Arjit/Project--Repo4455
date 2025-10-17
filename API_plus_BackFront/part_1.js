// API RESPONSE Part

import express from "express";
import bodyParser from "body-parser";
const app=express();
const port=4500;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
let api_cards = [
    {
        person_name: "Besan ka laddu",
        phone_no: "987654321...whatever",
        payment_status: "Done",
        reason_for_earning: "i did assignments",
        deadline_for_payment: "Date=>86/ Month=> Pumpebber/ Year=> -5836",
    },
    {
        person_name: "Quantum Mango",
        phone_no: "123-456-7890ish",
        payment_status: "Pendingish",
        reason_for_earning: "Invented invisible socks",
        deadline_for_payment: "Date=>42/ Month=> Blurnuary/ Year=> 9999BC",
    },
    {
        person_name: "Sir Wobbleton",
        phone_no: "000-000-0000",
        payment_status: "Uncertain",
        reason_for_earning: "Juggled flaming cucumbers",
        deadline_for_payment: "Date=>∞/ Month=> Nevertember/ Year=> -0",
    },
    {
        person_name: "Captain Crayon",
        phone_no: "LOL-WUT-1234",
        payment_status: "Maybe",
        reason_for_earning: "Painted the moon purple",
        deadline_for_payment: "Date=>13/ Month=> Octobruary/ Year=> 20X6",
    },
    {
        person_name: "Zorp the Magnificent",
        phone_no: "999-999-9999",
        payment_status: "Paid in marshmallows",
        reason_for_earning: "Decoded alien emojis",
        deadline_for_payment: "Date=>00/ Month=> Smarch/ Year=> 404",
    },
    {
        person_name: "Flibber McGibber",
        phone_no: "867-5309",
        payment_status: "Pending",
        reason_for_earning: "Wrote a thesis on cheese gravity",
        deadline_for_payment: "Date=>7/ Month=> Blibruary/ Year=> 12345",
    },
    {
        person_name: "Lady Gloop",
        phone_no: "555-FAKE-NUM",
        payment_status: "In limbo",
        reason_for_earning: "Invented edible keyboards",
        deadline_for_payment: "Date=>99/ Month=> Jellune/ Year=> -999",
    },
    {
        person_name: "Professor Snazz",
        phone_no: "404-NOT-REAL",
        payment_status: "Overpaid",
        reason_for_earning: "Taught squirrels calculus",
        deadline_for_payment: "Date=>31/ Month=> Maysday/ Year=> 202X",
    },
    {
        person_name: "Dr. Blip",
        phone_no: "123-BLIP-BLOP",
        payment_status: "Pending",
        reason_for_earning: "Invented time-traveling toast",
        deadline_for_payment: "Date=>12/ Month=> Fizztember/ Year=> 1E+6",
    },
    {
        person_name: "The Honorable Glitch",
        phone_no: "000-111-2222",
        payment_status: "Corrupted",
        reason_for_earning: "Debugged the Matrix",
        deadline_for_payment: "Date=>404/ Month=> Nullvember/ Year=> NaN",
    },
    {
        person_name: "Sir Loopalot",
        phone_no: "123-456-7890",
        payment_status: "Recursively pending",
        reason_for_earning: "Got stuck in a for-loop",
        deadline_for_payment: "Date=>∞/ Month=> Loopuary/ Year=> ∞",
    },
];
app.get("/all",(requ,resp)=>{
    console.log(api_cards);
    resp.json(api_cards);
});
app.get("/specific_customer/:phone",(requ,resp)=>{
    const get_customer=api_cards.find((api_inst)=>api_inst.phone_no==requ.params.phone);
    console.log(get_customer);
    resp.json(get_customer);
    //This was my Previos approach <- But i accidently Phucked up! then i resolved it myself...used '.data' to get the actual piece of data from the Object .
    // let searching=resp.json(get_customer);
    // resp.render("searched_customer.ejs",{
    //     searched_customer:searching,
    // });
});
app.post("/addcustomer",(requ,resp)=>{
    // const new_cust=requ.body;
    const new_cust={
        person_name:requ.body["custmr_name"],
        phone_no:requ.body["phone"],
        
        payment_status:requ.body["money_amt"],
        reason_for_earning:requ.body["job_i_did"],
        deadline_for_payment:requ.body["payment_deadline"],
    };
    api_cards.push(new_cust);
    resp.sendStatus(201).json(new_cust);
    // resp.render("Usage_page.ejs",{
    //     added_customer:new_cust7,
    // });
});
app.listen(port,()=>{
    console.log(port +"<--here ");
});