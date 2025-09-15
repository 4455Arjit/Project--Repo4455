<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
</head>

<body>
    <!-- 3306 -->
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
        <label>Email:
            <input type="email" name="E_mail">
        </label>
        <br>
        <label>Username:
            <input type="text" name="Username">
        </label>
        <br>
        <label>Password:
            <input type="password" name="U_password">
        </label>
        <br>
        <input type="submit" name="SUBMIT2" value="SUBMIT">
    </form>
</body>

</html>
<?php
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
            echo "<br>Welcome ,{$username}";
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
                    /* $sql_query1="CREATE TABLE database_test(
                    sr_n INT PRIMARY KEY,
  THIS query is           u_email VARCHAR(30),
    Done already.          user_nme VARCHAR(20),
                    user_pass VARCHAR(25)
                    )";
                    if(mysqli_query($connection_to_db,$sql_query1)){
                        echo "<br>Query Successful breh !";
                    } */
                }
                $sql_query1 = $connection_to_db->prepare("INSERT INTO database_test('u_email','user_nme','user_pass') VALUES(?,?,?)");
                $sql_query1->bind_param($email,$usern,$passw);
               if($sql_query1->execute()){
                echo "You are Registered Successfully!";
               }else{
                echo "Ops! we ran into an error!";
               }
            }
        }
    }
}

?>