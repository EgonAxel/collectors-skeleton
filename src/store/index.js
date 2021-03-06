import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'

Vue.use(Vuex)

/* https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript */
function makeId(length = 10) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
//Funktion för att få ett namn som är högst 10 karaktärer
function makePlayerName() {
  let maxLength = 10;
  let name = -1;

while (name == -1 || (name != null && name.length > maxLength)) {
    name = prompt('Please enter your name. It should be no more than ' + maxLength + ' characters in length', "Name");
}
return name;
}

export default new Vuex.Store({
  state: {
    socket: io(),
    roomId: "",
    playerCount: 0,
    playerId: "",
    lang: "en"
  },
  mutations: {
    SETUP_GAME(state, d) {
      state.playerCount = d.playerCount;
      state.socket.emit('setupCollectors',
        {
          playerCount: d.playerCount,
          roomId: state.roomId,
          lang: d.lang });
    },
    SET_PLAYER_COUNT(state, d) {
      state.playerCount = d;
    },
    SET_ROOM_ID(state) {
      state.roomId = makeId();
    },
    SET_LANG(state, d) {
      state.lang = d;
    },
    SET_PLAYER_ID(state, d = makePlayerName()) {    //Ber spelaren att skriva in sitt namn
      state.playerId = d;
    }
  },
  actions: {
  },
  modules: {
  }
})
