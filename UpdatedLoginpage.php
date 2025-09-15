<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link rel="stylesheet" href="UpdatedLoginpage.css">
</head>

<body>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
        <div class="styleblock">

            <div class="emailstyle">
                <label>Email:
               <input type="email" name="E_mail">
            </label>
        </div>
        <br>
        <div class="userstyle">

            <label>Username:
                <input type="text" name="Username">
            </label>
        </div>
        <br>
        <div class="passstyle">
            <label>Password:
                <input type="password" name="U_password">
            </label>
        </div>
        <br>
        <input type="submit" name="SUBMIT2" value="SUBMIT">
    </div>
    </form>
</body>

</html>
<?php
function filteration($user_entry){
    return filter_var($user_entry,FILTER_SANITIZE_EMAIL);
}
function filteration2($user_entry3){
    return password_hash($user_entry3,PASSWORD_DEFAULT);
}
function insertionofdata($email, $usern, $passw)
            {
                $host = "localhost";
                $user_n = "dbuser_testacc";
                $pass = "PHPserverpass";
                $data_bs = "dbl";
                $port = 3306;
                $connection_to_db = "";
                $connection_to_db = mysqli_connect($host, $user_n, $pass, $data_bs, $port);
                if ($connection_to_db) {
                    echo "<br>Yeah ! connected !";
                }
                $sql_query1 = $connection_to_db->prepare("INSERT INTO database_test (u_email,user_nme,user_pass) VALUES(?,?,?)");
                $sql_query1->bind_param("sss",$email,$usern,$passw);
               if($sql_query1->execute()){
                echo "You are Registered Successfully!";
               }else{
                echo "Ops! we ran into an error!";
               }
            }
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_email = $_POST["E_mail"];
    $username = $_POST["Username"];
    $user_pass = $_POST["U_password"];
    $sub_button = $_POST["SUBMIT2"];
    if (isset($sub_button)) {
        if (empty($user_email && $username && $user_pass)) {
            echo "<br>Some fields are empty ! Fill them right away!";
        } else {
            echo "<br>You are registered in our Database as a New User!";
            insertionofdata(filteration($user_email),$username,filteration2($user_pass));
            echo "<br>Welcome ,{$username}";
        }
    }
}

?>