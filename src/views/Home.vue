  <template>
    <div class="container">

      <div id="startMenuImageDiv">
        <img src="images\CollectorsStartMenuImage-removebg-preview (1).png" alt="">
      </div>

        <h1>Collectors</h1>

      <div>
          <span id="languageFlags">
            <img src="images/se.png" @click="displaySe()">
            <img src="images/en.png" @click="displayEn()">
          </span>
      </div>



    <div id="buttons_En" style="display: none">
      <h2> Set up a game of Collectors for: </h2>
        <a>
          <button v-for="i in 3" :key="'enbutton'+i" @click="setupCollectors(i+1, 'en')">
            <span class="playerNumber"> {{i+1}} </span> players
         </button>
       </a>
        <a href="/rules_collectors.pdf" target="_blank">
          <button class="rules">
            Rules
          </button>
        </a>
        <a class="intro">
          <button class="intro" v-on:click="myTutorial()">
            Tutorial
          </button>
        </a>
      </div>

      <div id="buttons_Se" style="display: none" opacity="0">
        <h2> Spela Collectors med: </h2>
          <a>
            <button v-for="i in 3" :key="'swebutton'+i" @click="setupCollectors(i+1, 'se')">
              <span class="playerNumber"> {{i+1}} </span> spelare
            </button>
          </a>
        <a class="rules" href="/rules_collectors.pdf" target="_blank">
          <button class="rules">
            Spelregler
          </button>
        </a>
        <a class="intro">
          <button class="intro" v-on:click="myTutorial()">
            Introduktion
          </button>
        </a>
      </div>
    </div>
  </template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  created: function () {
    this.$store.commit('SET_ROOM_ID');
  },
  methods: {
    setupCollectors: function (playerCount, lang) {
      this.$store.commit('SETUP_GAME', {roomId: this.$store.state.roomId,
        playerCount: playerCount,
        lang: lang });
        this.$router.push("/room/" + this.$store.state.roomId);
      },

      displayEn: function () {
        document.getElementById("buttons_En").style.display = "block";
        document.getElementById("buttons_Se").style.display = "none";
      },
      myTutorial: function() {
        window.open(
        'https://www.youtube.com/watch?v=J8VHXwiblHo&feature=youtu.be',
        '_blank' // <- This is what makes it open in a new window.
      );
    },

      displaySe: function () {
        document.getElementById("buttons_Se").style.display = "block";
        document.getElementById("buttons_En").style.display = "none";
      },

    }
  }

  </script>
  <style scoped>

#startMenuImageDiv {
  text-align: center;
}

#startMenuImageDiv img {
  width: 70%;
}

#languageFlags img {
  border: 1px solid #000000;
  border-radius: 4px;
  margin: 0 1em 0 1em;
  width: 4em;
  transition: 0.5s;
}

#languageFlags img:hover {
  transform: scale(1.15);
  transition: 0.15s;
  transition-timing-function: ease-in-out;
}

@keyframes buttonFades {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

#buttons_Se {
  animation: buttonFades 1s ease-in-out;
}

#buttons_En {
  animation: buttonFades 1s ease-in-out;
}

a {
  text-decoration: none;
}

.playerNumber {
  font-size: 1.25em;
  font-weight: 600;
}
.intro{
font-weight: 600;
}

.rules {
  font-weight: 600;
}

.container {
  display: grid;
  align-items: center;
  justify-content: center;
  text-align: center;
}

button {
margin: auto;
margin-bottom: 0.5em;
background-color: #d9d9d9;
display: block;
width: 15em;
height: 3em;
border-radius: 10px;
transition:0.3s;
font-size: 1em;
color: #000000;
}

button:hover{
  color: green;
  transform: scale(1.3);
  transition:0.4s;
  background-color: white;
  border-radius: 10px;
  transition-timing-function: ease-in-out;
  z-index: 2;
}


</style>
