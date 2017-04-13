<?php
if(getenv('REQUEST_METHOD') == 'POST') {
    $json = file_get_contents('php://input');
    //file_put_contents('dancho.txt', $json);

    $con = mysqli_connect("localhost", "stomin", "1q2a3z4", "skynet");

    $arr = json_decode($json, true);

    foreach ($arr as $element) {
	$icao = $element["icao"];
	$lat = $element["lat"];
	$lon = $element["lon"];
	$h = $element["altitude"];
	$speed = $element["speed"];
	$heading = $element["heading"];
	$verticalSpeed = $element["vr_speed"];

	$query = "INSERT INTO `planes-data` (ICAO, SOURCE, LAT, LON, HEIGHT, HEADING, SPEED, VERTSPEED) VALUES('$icao', 2, $lat, $lon, $h, $heading, $speed, $verticalSpeed) ON DUPLICATE KEY UPDATE SOURCE=2, LAT=$lat, LON=$lon, HEIGHT=$h, HEADING=$heading,SPEED=$speed,VERTSPEED=$verticalSpeed";
	mysqli_query($con, $query);
    }

    $query = "DELETE FROM `planes-data` WHERE `TIMESTAMP` < (NOW() - INTERVAL 1 MINUTE)";
    mysqli_query($con, $query);
}





