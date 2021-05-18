<?php


include_once "acc.php";



/** Return JSON response with status codes
 * 200 - OK
 * 201 - Created
 * 204 - Updated, shouldn't contain message
 * 400 - Bad request
 * 404 - Not found
 * 405 - Method not allowed
 * 500 - Server Internal error
 */
function json_response($code = 200, $message = null, $data = null) {
  header_remove();
  http_response_code($code);
  // header("Access-Control-Allow-Origin: *");
  // header("Cache-Control: no-cache,public,max-age=300,s-maxage=900");
  // header("Content-Type: application/json");
  $status = array(
      200 => "OK",
      201 => "CREATED",
      204 => "UPDATED",
      400 => "BAD REQUEST",
      404 => "NOT FOUND",
      405 => "METHOD NOT ALLOWED",
      500 => "INTERNAL SERVER ERROR"
      );
  header("Status: ".$status[$code]);
  if ($data) {
    return json_encode(array("status" => $code, "message" => $message, "data" => $data));
  } else {
    return json_encode(array("status" => $code, "message" => $message));
  }
}


/**
 * Return name from email before @
 */
function removeEmail($text) {
  list($text) = explode("@", $text);
  $text = preg_replace("/[^a-z0-9]/i", " ", $text);
  $text = ucwords($text);
  return $text;
}


/**
 * Generate custom length random token
 */
function genToken($length) {  
  $characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  $charactersLength = strlen($characters);
  $randomString = "";
  for ($i = 0; $i < $length; $i++) {
    $randomString .= $characters[rand(0, $charactersLength - 1)];
  }
  return $randomString;
}


// TODO path to save the poster to !!!

/**
 * Get Movie Details
 * @param string $mId - tMDb id
 */
function getDataFromTmdb($mId, $path, $usr) {
  $mdata = curlTMDB($mId, "mdata");
  if ($mdata["vote_average"] && $mdata["vote_average"] > 6) {
    $tdata = curlTMDB($mId, "tdata");
    $genres = "";
    foreach ($mdata["genres"] as $key => $value) {
      $genres .= $value["name"] . " ";
    }
    $trailers = "";
    foreach ($tdata["results"] as $key => $value) {
      $trailers .= $value["key"] . " ";
    }
    $poster = str_replace(".jpg", "", $mdata["poster_path"]);
    $new_data = array(
      "tmdb_id" => $mdata["id"],
      "title" => $mdata["title"], 
      "tagline" => $mdata["tagline"], 
      "release_date" => $mdata["release_date"], 
      "runtime" => $mdata["runtime"], 
      "genres" => $genres,
      "overview" => $mdata["overview"],
      "poster" => ltrim($poster, "/"),
      "backdrop" => $mdata["backdrop_path"],
      "trailers" => $trailers,
      "user" => $usr
    );
    $cpf = "https://image.tmdb.org/t/p/w300_and_h450_bestv2" . $mdata["poster_path"];
    $pto = $path . "/assets/z" . $mdata["poster_path"];
    saveImageToFile($cpf, $pto, $path, $poster);
    return $new_data;
  } else {
    return false;
  }
}


/**
 * Curl tmdb
 */
function curlTMDB($mid, $wy) {
  $dbDet = dbDet();
  $tmdbKey = $dbDet[5];
  $curl = curl_init();
  if ($wy == "mdata") {
    $getMovie = "https://api.themoviedb.org/3/movie/" . $mid . "?api_key=" . $tmdbKey . "&language=en-US";
  } else if ($wy == "tdata") {
    $getMovie = "https://api.themoviedb.org/3/movie/" . $mid . "/videos" . "?api_key=" . $tmdbKey . "&language=en-US";
  }
  // "https://api.themoviedb.org/3/movie/{}/videos?api_key={}&language=en-US"
  curl_setopt_array($curl, array(
    CURLOPT_URL => $getMovie,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_POSTFIELDS => "",
    CURLOPT_HTTPHEADER => array(
       "Content-Type: application/json",
       "cache-control: no-cache"
    ),
  ));
  $response = curl_exec($curl);
  $data = json_decode($response, true);
  curl_close($curl);
  return $data;
}


function saveImageToFile($cpf, $pto, $path, $poster) {
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $cpf);
  curl_setopt($ch, CURLOPT_VERBOSE, 1);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_AUTOREFERER, false);
  curl_setopt($ch, CURLOPT_REFERER, "https://www.topgoodmovies.com");
  curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  $result = curl_exec($ch);
  curl_close($ch);
  // the following lines write the contents to a file in the same directory (provided permissions etc)
  $fp = fopen($pto, 'w+');
  fwrite($fp, $result);
  fclose($fp);

  $jpg = imagecreatefromjpeg($pto);
  $w = imagesx($jpg);
  $h = imagesy($jpg);
  $webp = imagecreatetruecolor($w, $h);
  imagecopy($webp, $jpg, 0, 0, 0, 0, $w, $h);
  imagewebp($webp, $path . "/assets/p/" . $poster . ".webp", 70);
  imagedestroy($jpg);
  imagedestroy($webp);
}


/**
 * Create JWT Token
 * @param string $name
 * @return JSON Obj JWT
 */
function encodeJWT($name) {
  $dbDet = dbDet();
  $private_key = $dbDet[6];
  $iss = $dbDet[7];
  $exp = time() + 60*60;
  $header = json_encode([
    "typ" => "JWT",
    "alg" => "HS256"
  ]);
  $payload = json_encode([
    "iss" => $iss,
    "exp" => $exp,
    "name" => $name
  ]);
  $base64UrlHeader = encode64Url($header);
  $base64UrlPayload = encode64Url($payload);
  $signature = hash_hmac("sha256", $base64UrlHeader . "." . $base64UrlPayload, $private_key, true);
  $base64UrlSignature = encode64Url($signature);
  $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
  return $jwt;
}


/**
 * Check JWT
 * @param JSON $encodedJWT
 * @return boolean
 */
function checkJWT($encodedJWT) {
  $dbDet = dbDet();
  $private_key = $dbDet[6];
  $parts = explode(".", $encodedJWT);
  if (count($parts) === 3) {
    $decodedHeader = base64_decode($parts[0]);
    $decodedPayload = base64_decode($parts[1]);

    $expiration = json_decode($decodedPayload)->exp;

    $base64UrlHeader = encode64Url($decodedHeader);
    $base64UrlPayload = encode64Url($decodedPayload);

    $signature = hash_hmac("sha256", $base64UrlHeader . "." . $base64UrlPayload, $private_key, true);
    $base64UrlSignature = encode64Url($signature);

    $signatureValid = ($base64UrlSignature === $parts[2]);
    if ($signatureValid && $expiration > time()) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}


/**
 * Decode JWT
 * @param JSON $encodedJWT
 * @return boolean
 */
function nameFromJWT($encodedJWT) {
  $checkjwt = checkJWT($encodedJWT);
  if ($checkjwt) {
    $parts = explode(".", $encodedJWT);
    $decodedName  = base64_decode($parts[1]["name"]);
    return $decodedName;
  } else {
    return false;
  }
}


/**
 * Base 64 URL Encoder
 * @param string $decodedStr
 * @return base64 encoded string
 */
function encode64Url($decodedStr) {
  return str_replace(["+", "/", "="], ["-", "_", ""], base64_encode($decodedStr));
}