const app = Vue.createApp({
  data() {
    return {
      tabs: [
        {
          name: "Random",
          icoLight: "assets/img/rnd-light.svg",
          icoDark: "assets/img/rnd-dark.svg"
        },
        {
          name: "Latest",
          icoLight: "assets/img/ltst-light.svg",
          icoDark: "assets/img/ltst-dark.svg"
        },
        {
          name: "Account",
          icoLight: "assets/img/acc-light.svg",
          icoDark: "assets/img/acc-dark.svg"
        },

      ],
      currentTab: 'Random',
      darkMode: localStorage.getItem('darkMode') ? JSON.parse(localStorage.getItem('darkMode')) : false,
      cookies: localStorage.getItem('cookies') ? false : true,
    }
  },
  computed: {
    currentTabComponent() {
      return 'tab-' + this.currentTab.toLowerCase();
    }
  },
  methods: {
    tgglDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
    },
    usrCookies(usrOpt) {
      localStorage.setItem('cookies', JSON.stringify(usrOpt));
      this.cookies = !this.cookies;
    }
  },
  mounted: function() {
    document.body.classList.remove('loading');
  }
})
  
app.component('tab-random', {
  template: `
    <section class="tab-random">

      <div class="toast" v-show="message">{{message}}</div>

      <div class="head">
        <h2>Random Titles</h2>
        <button @click="updateMovies">
          <svg class="svg-icon" viewBox="0 0 20 20">
            <path fill="none" d="M19.305,9.61c-0.235-0.235-0.615-0.235-0.85,0l-1.339,1.339c0.045-0.311,0.073-0.626,0.073-0.949
              c0-3.812-3.09-6.901-6.901-6.901c-2.213,0-4.177,1.045-5.44,2.664l0.897,0.719c1.053-1.356,2.693-2.232,4.543-2.232
              c3.176,0,5.751,2.574,5.751,5.751c0,0.342-0.037,0.675-0.095,1l-1.746-1.39c-0.234-0.235-0.614-0.235-0.849,0
              c-0.235,0.235-0.235,0.615,0,0.85l2.823,2.25c0.122,0.121,0.282,0.177,0.441,0.172c0.159,0.005,0.32-0.051,0.44-0.172l2.25-2.25
              C19.539,10.225,19.539,9.845,19.305,9.61z M10.288,15.752c-3.177,0-5.751-2.575-5.751-5.752c0-0.276,0.025-0.547,0.062-0.813
              l1.203,1.203c0.235,0.234,0.615,0.234,0.85,0c0.234-0.235,0.234-0.615,0-0.85l-2.25-2.25C4.281,7.169,4.121,7.114,3.961,7.118
              C3.802,7.114,3.642,7.169,3.52,7.291l-2.824,2.25c-0.234,0.235-0.234,0.615,0,0.85c0.235,0.234,0.615,0.234,0.85,0l1.957-1.559
              C3.435,9.212,3.386,9.6,3.386,10c0,3.812,3.09,6.901,6.902,6.901c2.083,0,3.946-0.927,5.212-2.387l-0.898-0.719
              C13.547,14.992,12.008,15.752,10.288,15.752z"></path>
          </svg>
        </button>
      </div>

      <ul class="movies">
        <li
          v-for="movie in movies"
          :key="movie.id"
          class="movie">
            
            <div
              :style="{background: 'url(assets/p/' + movie.poster + '.webp)'}"
              class="poster">
            </div>

            <h3>{{movie.title}}</h3>

            <div class="mvb">
              <button @click="selectedMovie = movie">
                <span>
                  <svg class="svg-icon" viewBox="0 0 20 20">
                    <path d="M10,1.445c-4.726,0-8.555,3.829-8.555,8.555c0,4.725,3.829,8.555,8.555,8.555c4.725,0,8.555-3.83,8.555-8.555C18.555,5.274,14.725,1.445,10,1.445 M10,17.654c-4.221,0-7.654-3.434-7.654-7.654c0-4.221,3.433-7.654,7.654-7.654c4.222,0,7.654,3.433,7.654,7.654C17.654,14.221,14.222,17.654,10,17.654 M14.39,10c0,0.248-0.203,0.45-0.45,0.45H6.06c-0.248,0-0.45-0.203-0.45-0.45s0.203-0.45,0.45-0.45h7.879C14.187,9.55,14.39,9.752,14.39,10 M14.39,12.702c0,0.247-0.203,0.449-0.45,0.449H6.06c-0.248,0-0.45-0.202-0.45-0.449c0-0.248,0.203-0.451,0.45-0.451h7.879C14.187,12.251,14.39,12.454,14.39,12.702 M14.39,7.298c0,0.248-0.203,0.45-0.45,0.45H6.06c-0.248,0-0.45-0.203-0.45-0.45s0.203-0.45,0.45-0.45h7.879C14.187,6.848,14.39,7.051,14.39,7.298"></path>
                  </svg>
                </span>
                Details
              </button>
            </div>
        </li>
      </ul>

      <div
        class="overlay"
        :class="{'active': selectedMovie}"
        @click.self="selectedMovie = null">

        <div
          class="movie-details"
          v-if="selectedMovie">
         
          <button @click="selectedMovie = null">
            <svg class="svg-icon" viewBox="0 0 20 20">
              <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
            </svg>
          </button>

          <h2>
            {{selectedMovie.title}} ({{parseInt(selectedMovie.release_date)}})
          </h2>
          
          <h3>{{selectedMovie.tagline}}</h3>
          
          <h4 class="info">
            <span>{{selectedMovie.genres}}</span>
            <span>{{selectedMovie.runtime}} min</span>
          </h4>

          <p>{{selectedMovie.overview}}</p>

          <div v-for="tt in selectedMovie.trailers.split(' ')">
            <div v-if="tt.length > 3" class="iframe-container">
              <iframe
                loading="lazy"
                :src="'https://www.youtube-nocookie.com/embed/' + tt"></iframe>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
  data: function () {
    return {
      movies: localStorage.getItem('mvs') ? JSON.parse(localStorage.getItem('mvs')) : null,
      selectedMovie: null,
      message: null
    }
  },
  methods: {
    updateMovies: async function() {
      document.querySelector('#loader').classList.add('loading');
      const head = new Headers();
      head.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "req":"rnd-titles",
        "genre":"any"
      });
      const requestOptions = {
        method: 'POST',
        headers: head,
        body: raw,
        redirect: 'follow'
      };
      
      const res = await fetch("resources/movies", requestOptions)
        .then(resp => resp.json())
        .then(res => {
          if (res["status"] < 400) {
            this.movies = res['data'];
            localStorage.setItem('mvs', JSON.stringify(res['data']));
            this.makeToast(res['message']);
          } else {
            this.makeToast(res['message']);
          }
        })
        .catch(error => console.log(error));
      document.querySelector('#loader').classList.remove('loading');
    },
    makeToast: function(message) {
      this.message = message;
      setTimeout(() => {
        this.message = null;
      }, 5000);
    }
  }
})

app.component('tab-latest', {
  template: `
    <section class="tab-movies">

      <div class="toast" v-show="message">{{message}}</div>

      <div class="head">
        <h2>Latest Titles</h2>
        <button @click="updateMovies">
          <svg class="svg-icon" viewBox="0 0 20 20">
            <path fill="none" d="M19.305,9.61c-0.235-0.235-0.615-0.235-0.85,0l-1.339,1.339c0.045-0.311,0.073-0.626,0.073-0.949
              c0-3.812-3.09-6.901-6.901-6.901c-2.213,0-4.177,1.045-5.44,2.664l0.897,0.719c1.053-1.356,2.693-2.232,4.543-2.232
              c3.176,0,5.751,2.574,5.751,5.751c0,0.342-0.037,0.675-0.095,1l-1.746-1.39c-0.234-0.235-0.614-0.235-0.849,0
              c-0.235,0.235-0.235,0.615,0,0.85l2.823,2.25c0.122,0.121,0.282,0.177,0.441,0.172c0.159,0.005,0.32-0.051,0.44-0.172l2.25-2.25
              C19.539,10.225,19.539,9.845,19.305,9.61z M10.288,15.752c-3.177,0-5.751-2.575-5.751-5.752c0-0.276,0.025-0.547,0.062-0.813
              l1.203,1.203c0.235,0.234,0.615,0.234,0.85,0c0.234-0.235,0.234-0.615,0-0.85l-2.25-2.25C4.281,7.169,4.121,7.114,3.961,7.118
              C3.802,7.114,3.642,7.169,3.52,7.291l-2.824,2.25c-0.234,0.235-0.234,0.615,0,0.85c0.235,0.234,0.615,0.234,0.85,0l1.957-1.559
              C3.435,9.212,3.386,9.6,3.386,10c0,3.812,3.09,6.901,6.902,6.901c2.083,0,3.946-0.927,5.212-2.387l-0.898-0.719
              C13.547,14.992,12.008,15.752,10.288,15.752z"></path>
          </svg>
        </button>
      </div>

      <ul class="movies">
        <li
          v-for="movie in movies"
          :key="movie.id"
          class="movie">

            <div
              :style="{background: 'url(assets/p/' + movie.poster + '.webp)'}"
              class="poster">
            </div>

            <h3>{{movie.title}}</h3>

            <div class="mvb">
              <button @click="selectedMovie = movie">
                <span>
                  <svg class="svg-icon" viewBox="0 0 20 20">
                    <path d="M10,1.445c-4.726,0-8.555,3.829-8.555,8.555c0,4.725,3.829,8.555,8.555,8.555c4.725,0,8.555-3.83,8.555-8.555C18.555,5.274,14.725,1.445,10,1.445 M10,17.654c-4.221,0-7.654-3.434-7.654-7.654c0-4.221,3.433-7.654,7.654-7.654c4.222,0,7.654,3.433,7.654,7.654C17.654,14.221,14.222,17.654,10,17.654 M14.39,10c0,0.248-0.203,0.45-0.45,0.45H6.06c-0.248,0-0.45-0.203-0.45-0.45s0.203-0.45,0.45-0.45h7.879C14.187,9.55,14.39,9.752,14.39,10 M14.39,12.702c0,0.247-0.203,0.449-0.45,0.449H6.06c-0.248,0-0.45-0.202-0.45-0.449c0-0.248,0.203-0.451,0.45-0.451h7.879C14.187,12.251,14.39,12.454,14.39,12.702 M14.39,7.298c0,0.248-0.203,0.45-0.45,0.45H6.06c-0.248,0-0.45-0.203-0.45-0.45s0.203-0.45,0.45-0.45h7.879C14.187,6.848,14.39,7.051,14.39,7.298"></path>
                  </svg>
                </span>
                Details
              </button>
            </div>
        </li>
      </ul>

      <div
        class="overlay"
        :class="{'active': selectedMovie}"
        @click.self="selectedMovie = null">

        <div
          class="movie-details"
          v-if="selectedMovie">
         
          <button @click="selectedMovie = null">
            <svg class="svg-icon" viewBox="0 0 20 20">
              <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
            </svg>
          </button>

          <h2>
            {{selectedMovie.title}}
          </h2>
          
          <h3>{{selectedMovie.tagline}}</h3>
          
          <h4 class="info">
            <span>{{selectedMovie.genres}}</span>
            <span>{{selectedMovie.runtime}} min</span>
          </h4>

          <p>{{selectedMovie.overview}}</p>

          <div v-for="tt in selectedMovie.trailers.split(' ')">
            <div v-if="tt.length > 3" class="iframe-container">
              <iframe loading="lazy" :src="'https://www.youtube-nocookie.com/embed/' + tt"></iframe>
            </div>
          </div>

        </div>
      </div>

    </section>
  `,
  data: function () {
    return {
      movies: localStorage.getItem('ltst') ? JSON.parse(localStorage.getItem('ltst')) : null,
      selectedMovie: null,
      message: null
    }
  },
  methods: {
    updateMovies: async function() {
      document.querySelector('#loader').classList.add('loading');
      const head = new Headers();
      head.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "req":"ltst-titles"
      })
      const requestOptions = {
        method: 'POST',
        headers: head,
        body: raw,
        redirect: 'follow'
      }
      
      const res = await fetch("resources/movies", requestOptions)
        .then(resp => resp.json())
        .then(res => {
          if (res["status"] < 400) {
            this.movies = res['data'];
            localStorage.setItem('ltst', JSON.stringify(res['data']));
            this.makeToast(res['message']);
          } else {
            this.makeToast('something went wrong, try again later');
          }
        })
        .catch(error => console.log(error));
      document.querySelector('#loader').classList.remove('loading');
    },
    makeToast: function(message) {
      this.message = message;
      setTimeout(() => {
        this.message = null;
      }, 5000);
    }
  }
})
  
app.component('tab-account', {
  template: `
    <section class="tab-account">

    <div class="toast" v-show="message">{{message}}</div>

    <div class="head">
      <h2>
        <span v-if="noJWT">Account</span>
        <span v-else>Hello <span class="user-name">{{signedInUser}}</span></span>
      </h2>
      <button
        v-if="!noJWT"
        @click="signOut">
          <svg class="svg-icon" viewBox="0 0 20 20" style="transform: rotate(90deg)">
            <path d="M8.416,3.943l1.12-1.12v9.031c0,0.257,0.208,0.464,0.464,0.464c0.256,0,0.464-0.207,0.464-0.464V2.823l1.12,1.12c0.182,0.182,0.476,0.182,0.656,0c0.182-0.181,0.182-0.475,0-0.656l-1.744-1.745c-0.018-0.081-0.048-0.16-0.112-0.224C10.279,1.214,10.137,1.177,10,1.194c-0.137-0.017-0.279,0.02-0.384,0.125C9.551,1.384,9.518,1.465,9.499,1.548L7.76,3.288c-0.182,0.181-0.182,0.475,0,0.656C7.941,4.125,8.234,4.125,8.416,3.943z M15.569,6.286h-2.32v0.928h2.32c0.512,0,0.928,0.416,0.928,0.928v8.817c0,0.513-0.416,0.929-0.928,0.929H4.432c-0.513,0-0.928-0.416-0.928-0.929V8.142c0-0.513,0.416-0.928,0.928-0.928h2.32V6.286h-2.32c-1.025,0-1.856,0.831-1.856,1.856v8.817c0,1.025,0.832,1.856,1.856,1.856h11.138c1.024,0,1.855-0.831,1.855-1.856V8.142C17.425,7.117,16.594,6.286,15.569,6.286z"></path>
          </svg>
      </button>
    </div>

    <form
      v-if="noJWT"
      @submit.prevent="usrForm"
      class="usr-form">

      <div v-if="errors.length" class="errors">
        <b>Correct the following errors: </b>
        <ul>
          <li v-for="error in errors">{{error}}</li>
        </ul>
      </div>

      <div class="form-group">
        <input
          v-model="userAction"
          type="radio"
          id="signin"
          name="signin"
          value="signin" />
        <label for="signin">Sign In</label>
        
        <input
          v-model="userAction"
          type="radio"
          id="register"
          name="register"
          value="register" />
        <label for="register">Register</label>
      </div>

      <div class="form-group">
        <label for="username">Username: </label>
        <input
          required
          minlength="6"
          maxlength="20"
          v-model="username"
          id="username"
          name="username"
          type="text"
          placeholder="username" />
      </div>

      <div class="form-group">
        <label for="password">Password: </label>
        <input
          required
          minlength="6"
          maxlength="20"
          v-model="password"
          id="password"
          name="password"
          type="password"
          placeholder="password" />
      </div>

      <div v-if="userAction == 'register'" class="form-group">
        <label for="passwordc">Check Password: </label>
        <input
          required
          v-model="passwordc"
          id="passwordc"
          name="passwordc"
          type="password"
          placeholder="retype password" />
      </div>

      <div>
        <input
          :value="userAction"
          type="submit"
          class="form-btn" />
      </div>
      
    </form>

    <form 
      v-if="!noJWT"
      @submit.prevent="mvsForm"
      class="mvs-form">

      <div class="form-group">
        
        <input
          required
          maxlength="7"
          v-model="tmdbid"
          id="tmdbid"
          name="tmdbid"
          type="text"
          placeholder="tMDb ID" />
      </div>

      <div>
        <input
          value="+ Title"
          type="submit"
          class="form-btn" />
      </div>
    
    </form>

    <div v-if="newMovie.title" class="new-movie">
      <h2>New Movie in the list: </h2>

      <ul>
        <li>tMDb: {{newMovie.tmdb_id}}</li>
        <li>Title: {{newMovie.title}}</li>
        <li>Tagline: {{newMovie.tagline}}</li>
        <li>Release Date: {{newMovie.release_date}}</li>
        <li>Runtime: {{newMovie.runtime}}</li>
        <li>Genres: {{newMovie.genres}}</li>
        <li>Overview: {{newMovie.overview}}</li>
        <li>Poster: {{newMovie.poster}}</li>
        <li>Trailers: {{newMovie.trailers}}</li>
        <li>User: {{newMovie.user}}</li>
      </ul>

    </div>

    </section>
  `,
  data: function() {
    return {
      username: null,
      password: null,
      passwordc: null,
      userAction: "signin",
      noJWT: localStorage.getItem('username') ? false: true,
      signedInUser: localStorage.getItem('username') ? JSON.parse(localStorage.getItem('username')) : null,
      errors: [],
      message: null,
      tmdbid: null,
      newMovie: []
    }
  },
  methods: {
    usrForm: function() {
      this.errors = [];
      if (this.username === null || this.username === '' || this.username.length < 6 || this.username.includes(' ') || this.username.includes('admin')) {
        this.errors.push('Username required, minimum 6 characters and no empty spaces');
      } 
      if(this.password === null || this.password === '' || this.password.length < 6 || this.password.includes(' ')) {
        this.errors.push('Password required, minimum 6 characters and no empty spaces');
      } 
      if (this.userAction === 'register' && this.password !== this.passwordc) {
        this.errors.push('Passwords must match');
      }

      if (this.errors.length === 0) {
        this.handleUserReq();
        this.username = null;
        this.password = null;
        this.passwordc = null;
      } else {
        this.noJWT = true;
        this.password = null;
        this.passwordc = null;
      }
    },
    handleUserReq: async function() {
      document.querySelector('#loader').classList.add('loading');
      const head = new Headers();
      head.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "req": this.userAction,
        "username": this.username,
        "password": this.password
      })
      const requestOptions = {
        method: 'POST',
        headers: head,
        body: raw,
        redirect: 'follow'
      }
      const res = await fetch("resources/users", requestOptions)
        .then(resp => resp.json())
        .then(res => {
          if (res["status"] < 400) {
            this.signedInUser = res["data"]["username"];
            localStorage.setItem('username', JSON.stringify(res["data"]["username"]));
            localStorage.setItem('jwt', JSON.stringify(res["data"]["jwt"]));
            let tJWT = this.parseJWT(res["data"]["jwt"]);
            let exp = new Date(tJWT.exp * 1000);
            console.log("token will expire @ ", exp);
            localStorage.setItem('tJWT', JSON.stringify(tJWT));
            this.noJWT = false;
            this.makeToast(res['message']);
          } else {
            this.makeToast(res['message']);
          }
        })
        .catch(error => console.log(error));
      document.querySelector('#loader').classList.remove('loading');
    },
    parseJWT: function(token) {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    },
    makeToast: function(message) {
      this.message = message;
      setTimeout(() => {
        this.message = null;
      }, 5000);
    },
    signOut: function() {
      this.noJWT = true;
      localStorage.removeItem('username');
      localStorage.removeItem('jwt');
      localStorage.removeItem('tJWT');
      this.makeToast('Sign Out Successful')
    },
    mvsForm: async function() {
      if (localStorage.getItem('jwt')) {
        document.querySelector('#loader').classList.add('loading');
        const jwt = JSON.parse(localStorage.getItem('jwt'));
        let tJWT = this.parseJWT(jwt);
        let username = tJWT.name;
        const head = new Headers();
        head.append("Content-Type", "application/json");
        const raw = JSON.stringify({
          "req": 'get-movie',
          "tmdbid": this.tmdbid,
          "jwt": jwt,
          "username": username
        })
        const requestOptions = {
          method: 'POST',
          headers: head,
          body: raw,
          redirect: 'follow'
        }
        const res = await fetch("resources/movies", requestOptions)
          .then(resp => resp.json())
          .then(res => {
            if (res["status"] < 400) {
              this.makeToast(res['message']);
              this.newMovie = res['data'];
              this.tmdbid = null;
            } else {
              this.makeToast(res['message']);
            }
          })
          .catch(error => console.log(error));
        document.querySelector('#loader').classList.remove('loading');
      } else {
        this.makeToast('imposible request');
      }
    }
  }
})


app.mount('#app');