let api_objs = [
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
api_objs.forEach(props => {
    console.log("**************************");
   console.log("Customer Name: "+props.person_name);
   console.log("Phone Number: "+props.phone_no);
   console.log("Payment Status: "+props.payment_status);
   console.log("Reason for getting Money from Customer: "+props.reason_for_earning);
   console.log("Deadline for Payment" + props.deadline_for_payment);
    console.log("**************************");
});
console.log(api_objs[4]);