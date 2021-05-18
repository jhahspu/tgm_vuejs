<?php


function dbDet() {


  $dbdet = "local";


  switch ($dbdet) {

    case "local":
      $dbacc[0] = ""; // Host Name
      $dbacc[1] = ""; // DB Name
      $dbacc[2] = ""; // Charset
      $dbacc[3] = ""; // Username
      $dbacc[4] = ""; // Password
      $dbacc[5] = ""; // tmdb api key
      $dbacc[6] = ""; // Private key for JWT signature
      $dbacc[7] = ""; // iss for JWT
      return $dbacc;
      break;

    case "live":
      $dbacc[0] = ""; // Host Name
      $dbacc[1] = ""; // DB Name
      $dbacc[2] = ""; // Charset
      $dbacc[3] = ""; // Username
      $dbacc[4] = ""; // Password
      $dbacc[5] = ""; // tmdb api key
      $dbacc[6] = ""; // Private key for JWT signature
      $dbacc[7] = ""; // iss for JWT
      return $dbacc;
      break;
      
  }
}

// murl = 'https://api.themoviedb.org/3/movie/{}?api_key={}&language=en-US'
// vurl = 'https://api.themoviedb.org/3/movie/{}/videos?api_key={}&language=en-US'
// url = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2{}'
// url = 'https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/{}'



// .htaccess
// Header always set Access-Control-Allow-Origin http://localhost:4200
// Header always set Access-Control-Max-Age "5000"
// Header always set Access-Control-Allow-Headers "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding"
// Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
// Header always set Content-Type Application/json

