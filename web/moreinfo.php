<?php
$con = mysqli_connect("localhost", "stomin", "1q2a3z4", "skynet");
$icao = $_GET['icao'];
$source = $_GET['source'];
$query = mysqli_query($con, "SELECT `type` FROM `planes` WHERE `icao` = '$icao'");
$result = mysqli_fetch_row($query);
$query = mysqli_query($con, "SELECT `name` FROM `planetypes` WHERE `icao` = '$result[0]'");
$result = mysqli_fetch_row($query);
$planeType = $result[0];
$query = mysqli_query($con, "SELECT `NAME` FROM `sources` WHERE `ID` = $source");
$result = mysqli_fetch_row($query);
$sourceName = $result[0];

$arr = [$planeType, $sourceName];

echo json_encode($arr);