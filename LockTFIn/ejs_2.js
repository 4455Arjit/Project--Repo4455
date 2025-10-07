import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { randomInt } from "crypto";
const direction = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3097;  //you can use random ports if you like : just comment this line and enable the line below this line.
// const port = randomInt(3000,3020);

console.log(direction);
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (requ, resp) => {
    resp.sendFile(direction + "/Ejstesthtmlpart2.html")
});

app.post("/part2", (requ, resp) => {
    let c_items = requ.body["cart_items"];
    if (!c_items) {
        return resp.status(400).send("No items Provided in the Cart!!");
    }
    let cutouttext = c_items.split(",");
    resp.render("ejs_2part.ejs", {
        real_list: cutouttext,
    });

});
app.listen(port, () => {
    console.log("here am i:-> " + port);
});