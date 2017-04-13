<?php
$divText = 'Access Denied';

$con = mysqli_connect("localhost", "stomin", "1q2a3z4", "skynet");
$user = $_GET['user'];
$key = $_GET['key'];

$query = mysqli_query($con, "SELECT * FROM `users` WHERE `USERNAME` = '$user' AND `_KEY` = '$key'");
$result = mysqli_fetch_row($query);

if (sizeof($result) != 0) {
    $query = mysqli_query($con, "SELECT `ICAO`, `LAT`, `LON`, `HEADING`, `SPEED`, `VERTSPEED`, `HEIGHT` FROM `planes-data`");
    $json = [];
    while ($result = mysqli_fetch_assoc($query)) {
        array_push($json, json_encode($result));
    }
    $divText = json_encode($json);
}

?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="shortcut icon" href="http://skynet.sliven.org/logo.png" type="image/x-icon" />
    <title>JSON</title>
</head>
<body>
<div><?= $divText ?></div>
</body>
</html>