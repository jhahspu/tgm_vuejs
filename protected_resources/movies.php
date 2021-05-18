<?php


include_once "funcs.php";


class Mvs {

  
  private $conn;


  public function __construct($db) {
    $this->conn = $db;
  }


  /**
   * Return titles based on genre
   * @param string $gen - genre
   * @return Obj and status code with message 
   */
  public function getRnd($gen) {
    if(empty($gen) || $gen == "any") {
      $condition = "";
    } else {
      $condition = " WHERE genres like '%" . $gen . "%'";
    }
    $query = "SELECT * FROM movies ".$condition." ORDER BY RAND() LIMIT 24";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_CLASS);
    if($result) {
      return json_response(200, "Et Voilà !", $result);
    } else {
      return json_response(404, "Ups, couldn't find anything");
    }
  }


  /**
   * Return latest entris from DB
   */
  public function getLtst() {
    $query = "SELECT * FROM movies ORDER BY id DESC LIMIT 24";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_CLASS);
    if($result) {
      return json_response(200, "success", $result);
    } else {
      return json_response(404, "No titles found");
    }
  }


  /**
   * Check if tMDb ID already exists
   * @param string $mid
   * @return bool
   */
  public function checkTMDbId($mID) {
    $query = "SELECT tmdb_id FROM movies WHERE tmdb_id = :tmdb";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(":tmdb", $mID);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * Insert Movie into DB
   * 
   */
  public function insertMovie($data) {
    $query = "INSERT INTO movies (tmdb_id, title, tagline, release_date, runtime, genres, overview, poster, backdrop, trailers, user) VALUES (:tmdb_id, :title, :tagline, :release_date, :runtime, :genres, :overview, :poster, :backdrop, :trailers, :user)";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(":tmdb_id", $data["tmdb_id"]);
    $stmt->bindValue(":title", $data["title"]);
    $stmt->bindValue(":tagline", $data["tagline"]);
    $stmt->bindValue(":release_date", $data["release_date"]);
    $stmt->bindValue(":runtime", $data["runtime"]);
    $stmt->bindValue(":genres", $data["genres"]);
    $stmt->bindValue(":overview", $data["overview"]);
    $stmt->bindValue(":poster", $data["poster"]);
    $stmt->bindValue(":backdrop", $data["backdrop"]);
    $stmt->bindValue(":trailers", $data["trailers"]);
    $stmt->bindValue(":user", $data["user"]);
    $result = $stmt->execute();
    if($result){
      return json_response(200, "Movie added, whuhu!", $data);
    } else {
      return json_response(500, "Server error, sorry! Maybe try again later..");
    }
  }
}