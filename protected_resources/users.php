<?php


include_once "funcs.php";


class User {


  private $conn;


  public function __construct($db) {
    $this->conn = $db;
  }

  
  /**
   * Check user email & password in DB and return user infos
   * @param string $um user email
   * @param string $up user password
   * @return JSON: status code, message, data{"name", "pic", "uuid"}
   */
  public function checkUser($un, $up) {
    $query = "SELECT * FROM users WHERE username = :username";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(":username", $un);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if(!$user){
      return json_response(404, "Username not found");
    } else {
      $validPass = password_verify($up, $user["password"]);
      if ($validPass) {
        $jwt = encodeJWT($user["username"]);
          return json_response(200, "Signin successful", array(
            "username" => $user["username"],
            "jwt" => $jwt
          ));
      } else {
        return json_response(400, "Check password and try again");
      }
    }
  }

  
  /**
   * Register User
   * @param string $um - user email
   * @param string $up - user password
   * @return JSON with new user infos
   */
  public function registerUser($un, $up) {
    $query = "SELECT COUNT(username) AS usrs FROM users WHERE username = :username";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(":username", $un);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if($user["usrs"] > 0){
      return json_response(400, "Username already in use");
    } else {
      $passwordHash = password_hash($up, PASSWORD_BCRYPT, array("cost" => 12));
      $token = genToken(8) . "-" . genToken(4) . "-" . genToken(4) . "-" . genToken(4) . "-" . genToken(8);
      $query = "INSERT INTO users (username, password, uuid) VALUES (:username, :password, :uuid)";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(":username", $un);
      $stmt->bindValue(":password", $passwordHash);
      $stmt->bindValue(":uuid", $token);
      $result = $stmt->execute();
      if($result){
        $jwt = encodeJWT($un);
        return json_response(200, "Registration successful", array(
          "username" => $un,
          "jwt" => $jwt
        ));
      }
    }
  }

  
  /**
   * Check if provided token in DB
   * @param string $tk - user token
   * @return boolean
   */
  public function checkToken($tk) {
    $query = "SELECT * FROM users WHERE uuid = :uuid";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(":uuid", $tk);
    $stmt->execute();
    $token = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($token) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * Change user password if old pass and token are valid
   * @param string $tk - user uuid
   * @param string $op - old password
   * @param string $np - new password
   * @return status code and message
   */
  public function changePassword($tk, $op, $np) {
    $query = "SELECT * FROM users WHERE uuid = :uuid";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(":uuid", $tk);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if(!$user){
      return json_response(404, "User not found");
    } else {
      $validPass = password_verify($op, $user["password"]);
      if ($validPass) {
          $passwordHash = password_hash($np, PASSWORD_BCRYPT, array("cost" => 12));
          $query = "UPDATE users SET password = :password WHERE uuid = :uuid";
          $stmt = $this->conn->prepare($query);
          $stmt->bindValue(":password", $passwordHash);
          $stmt->bindValue(":uuid", $tk);
          $stmt->execute();
          return json_response(200, "Password change successful");
      } else {
        return json_response(400, "Check password and try again");
      }
    }
  }


  /**
   * Delete user if token and password match with DB indo
   * @param string $tk - user uuid
   * @param string $up - user password
   * @return status code and message
   */
  public function removeUser($tk, $up) {
    $query = "SELECT * FROM users WHERE uuid = :uuid";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(":uuid", $tk);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if(!$user){
      return json_response(404, "User not found");
    } else {
      $validPass = password_verify($up, $user["password"]);
      if ($validPass) {
          $query = "DELETE FROM users WHERE uuid = :uuid";
          $stmt = $this->conn->prepare($query);
          $stmt->bindValue(":uuid", $tk);
          $stmt->execute();
          return json_response(200, "User removed");
      } else {
        return json_response(400, "Check password and try again");
      }
    }
  }


  /**
   * Change user avatar if token passed
   * @param string $tk - user token
   * @param string $na - new avatar name
   * @return Obj containing updated infos about user
   */
  public function changeUserAvatar($tk, $na) {
    $passed = $this->checkToken($tk);
    if ($passed) {
      $query = "UPDATE users SET pic = :pic WHERE uuid = :uuid";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(":pic", $na);
      $stmt->bindValue(":uuid", $tk);
      $stmt->execute();
      return true;
    } else {
      return false;
    }
  }
}
