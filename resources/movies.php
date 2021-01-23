<?php


include_once "../../acc/database.php";
include_once "../../acc/movies.php";
include_once "../../acc/funcs.php";
include_once "../conf.php";


$data = json_decode(file_get_contents("php://input", false));


if ($data->req === "rnd-titles") {
  $database = new Database();
  $db = $database->connect();
  $mvs = new Mvs($db);
  $genre = $data->genre;
  $result = $mvs->getRnd($genre);
  echo $result;
} else if ($data->req === "ltst-titles") {
  $database = new Database();
  $db = $database->connect();
  $mvs = new Mvs($db);
  $result = $mvs->getLtst();
  echo $result;
} else if ($data->req === "get-movie") {
  $passJWT = checkJWT($data->jwt);
  if ($passJWT) {
    $database = new Database();
    $db = $database->connect();
    $mvs = new Mvs($db);
    $passID = $mvs->checkTMDbId($data->tmdbid);
    if ($passID) {
      echo json_response(400, "Movie already in our database, good choice though .)");
    } else {
      $res = getDataFromTmdb($data->tmdbid, BASE_PATH, $data->username);
      if ($res) {
        $addedMovie = $mvs->insertMovie($res);
        echo $addedMovie;
      } else {
        echo json_response(400, "Rating must be over 6");
      }
    }
  } else {
    echo json_response(400, "Please signin again, thank you!" . $data->jwt);
  }
} else {
  echo json_response(405, "Invalid request");
}