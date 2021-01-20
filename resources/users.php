<?php


include_once "../../acc/database.php";
include_once "../../acc/users.php";

$data = json_decode(file_get_contents("php://input", false));

if ($data->username) $username = $data->username;
if ($data->password) $password = $data->password;

if ($data->req === "register") {
  $database = new Database();
  $db = $database->connect();
  $usr = new User($db);
  $result = $usr->registerUser($username, $password);
  echo $result;
} else if($data->req === "signin") {
  $database = new Database();
  $db = $database->connect();
  $usr = new User($db);
  $result = $usr->checkUser($username, $password);
  echo $result;
} else {
  echo json_response(405, "Invalid request");
}