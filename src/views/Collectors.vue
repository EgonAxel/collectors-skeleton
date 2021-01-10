<template>
  <main>
    <div id="winnerWrap">
      <div id="winnerDiv">
        <h3 class="winnerNames" v-if="activeRound === 5 && getWinner().length === 2">{{labels.congratulationsOne}} {{getWinner()[1]}} {{labels.whoWon}} {{getWinner()[0]}} {{labels.points}}</h3>
        <h3 class="winnerNames" v-if="activeRound === 5 && getWinner().length === 3">{{labels.congratulationsMany}} {{getWinner()[1]}} {{labels.and}} {{getWinner()[2]}} {{labels.whoWon}} {{getWinner()[0]}} {{labels.points}}</h3>
        <h3 class="winnerNames" v-if="activeRound === 5 && getWinner().length === 4">{{labels.congratulationsMany}} {{getWinner()[1]}}, {{getWinner()[2]}} {{labels.and}} {{getWinner()[3]}} {{labels.whoWon}} {{getWinner()[0]}} {{labels.points}}</h3>
        <h3 class="winnerNames" v-if="activeRound === 5 && getWinner().length === 5">{{labels.congratulationsMany}} {{getWinner()[1]}}, {{getWinner()[2]}}, {{getWinner()[3]}} {{labels.and}} {{getWinner()[4]}} {{labels.whoWon}} {{getWinner()[0]}} {{labels.points}}</h3>
        <div id="returnButtonDiv">
          <a href="/#/">
            <button id="returnButton"  v-if="activeRound === 5">
              <h3> {{ labels.return }} </h3>
            </button>
          </a>
        </div>
      </div>
    </div>

    <div id="container">

      <div id="BuyItemDiv">
        <!-- {{buyPlacement}} {{chosenPlacementCost}} Detta borde vi kunna skita i nu-->
        <CollectorsBuyActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :itemsOnSale="itemsOnSale"
        :marketValues="marketValues"
        :placement="buyPlacement"
        @buyItem="buyItem($event)"
        @placeBottle="placeBottle('buyItem', $event)"/>
      </div>

      <div id="BuySkillDiv">
        <CollectorsSkillActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :skillsOnSale="skillsOnSale"
        :placement="skillPlacement"
        @getSkill="handleAction($event)"
        @placeBottle="placeBottle('buySkill', $event)"/>
      </div>

      <div id="RaiseValueDiv">
        <CollectorsRaiseValueActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :marketValues="marketValues"
        :skillsOnSale="skillsOnSale"
        :auctionCards="auctionCards"
        :market="market"
        :currentAuctionCard="currentAuctionCard"
        :placement="marketPlacement"
        @placeBottleRaiseValue="placeBottleRaiseValue('market', $event)"/>
      </div>

      <div id="AuctionDiv">
        <CollectorsAuctionActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :auctionCards="auctionCards"
        :currentAuctionCard="currentAuctionCard"
        :placement="auctionPlacement"
        @handleAction="handleAction($event)"
        @placeBottle="placeBottle('startAuction', $event)"/>

        <div v-if="currentAuctionCard.length === 1">
          <p>{{labels.player}} {{ bidArray[bidArray.length - 1]}} {{labels.isNowLeading}} {{ bidArray.length}}${{labels.bid}}.</p>
          <button v-if="players[playerId]" :disabled="cannotRaiseBid()" @click="raiseCurrentBid()">{{labels.raiseCurrentBid}}</button>
          <button v-if="bidArray[bidArray.length - 1] === this.playerId" :disabled="noMoreBidsBoolean" @click="noMoreBids()">{{labels.my}} {{bidArray.length}}{{labels.dollarBidWon}}</button>
          <button v-if="this.noMoreBidsBoolean" @click="endAuction('buyItem')" style="background-color: #f9dcce">{{labels.useAsItem}}<br><img class="use_as" src="images/use_as_item.png" width="33%"></button>
          <button v-if="this.noMoreBidsBoolean" @click="endAuction('getSkill')" style="background-color: #dfeccc">{{labels.useAsSkill}}<br><img class="use_as" src="images/use_as_skill.png" width="22%"></button>
          <button v-if="this.noMoreBidsBoolean" @click="endAuction('market')" style="background-color: #cfdcf2">{{labels.useAsMarket}}<br><img class="use_as" src="images/use_as_market.png" width="20%"></button>
        </div>
      </div>

      <div id="GameOperationsDiv">
        <h2>{{labels.gameOperations}}</h2>
        <div id='readyGameButton' v-if="!playerBoardShown">
          <button class="ready" v-on:click="readyGame()" @click="playerReady = true" :disabled="playerReady">
            {{labels.ready}}
            </button>
        </div>
        <div id="startGameButton" v-if="!playerBoardShown">
          <button class="ready" v-on:click="startGame()">
            {{labels.start}}
          </button>
        </div>
        <div class="buttons" v-if="playerBoardShown">
          <p v-if="activeRound < 5">{{labels.currentRound}} {{ activeRound }}. {{labels.lastPlayerCanChange}}</p>
          <p v-if="activeRound === 5 && getWinner().length === 2">{{labels.congratulationsOne}} {{getWinner()[1]}} {{labels.whoWon}} {{getWinner()[0]}} {{labels.points}}</p>
          <p v-if="activeRound === 5 && getWinner().length === 3">{{labels.congratulationsMany}} {{getWinner()[1]}} {{labels.and}} {{getWinner()[2]}} {{labels.whoWon}} {{getWinner()[0]}} {{labels.points}}</p>
          <p v-if="activeRound === 5 && getWinner().length === 4">{{labels.congratulationsMany}} {{getWinner()[1]}}, {{getWinner()[2]}} {{labels.and}} {{getWinner()[3]}} {{labels.whoWon}} {{getWinner()[0]}} {{labels.points}}</p>
          <p v-if="activeRound === 5 && getWinner().length === 5">{{labels.congratulationsMany}} {{getWinner()[1]}}, {{getWinner()[2]}}, {{getWinner()[3]}} {{labels.and}} {{getWinner()[4]}} {{labels.whoWon}} {{getWinner()[0]}} {{labels.points}}</p>
          <button class="function_buttons"  v-on:click="changeRound()" :disabled="notLastPlayer() || activeRound === 5">{{labels.nextRound}}
              <img class="function_button_img" src="images/retrieveBottles.png">
          </button>
        </div>
        <div class="buttons">
          <button class="function_buttons">
            {{ labels.rules }}
              <a href="/rules_collectors.pdf" target="_blank">
                <img id="drawCard_button_img" src="images/drawCards.png">
              </a>
          </button>
        </div>

        <div>
          {{ labels.invite }} <br>
          <input type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
        </div>
      </div>

      <div id="WorkDiv">
        <CollectorsWorkActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :placement="workPlacement"
        :activeRound="activeRound"
        @placeBottleWork="placeBottleWork('doWork', $event)"/>
      </div>

      <div id="HandDiv"  v-if="players[playerId]">
        <div id="HandDivHeader">
          <h1 style="text-align: center">  <img id="drawCard_button_img" src="images/drawCards.png" style="  zoom: 0.6; -moz-transform: scale(0.8);" >Hand</h1>
        </div>
        <div id="CardsOnHand" class="cardslots">
          <CollectorsCard v-for="(card, index) in players[playerId].hand" :card="card" :availableAction="card.available" @doAction="handleAction(card)" :key="index"/>
        </div>
      </div>

      <div id="PlayerBoardDiv">
        <h2>{{labels.playerBoard}}</h2>
        <div id="BottleSlotsDiv">
          <!-- <span id="bottles" v-if="players[playerId]">
            <img id="playerBottles" v-for="bottle in players[playerId].bottles" src="images/bottle.png" :key="bottle">
          </span> -->
          <!-- <span id="slotImages" v-for="index in 5" :key="index">
            <input type="hidden" name="bottleSlot">
            <input class="bottleSlots" type="image" :src="visualizeBottleSlots(index)">
          </span> -->
          <span id="slot_1">
            <img v-if="players[playerId].bottles < 1" class="bottleSlotImages" src="images/bottleSlot_1.png">
            <img class="glowingBorder" v-if="players[playerId].bottles > 0" src="images/bottleSlotPlaced_1.png">
          </span>
          <span id="slot_2">
            <img v-if="players[playerId].bottles < 2" class="bottleSlotImages" src="images/bottleSlot_2.png">
            <img class="glowingBorder" v-if="players[playerId].bottles > 1" src="images/bottleSlotPlaced_2.png">
          </span>
          <span id="slot_3">
            <img v-if="players[playerId].bottles < 3" class="bottleSlotImages" src="images/bottleSlot_3.png">
            <img class="glowingBorder" v-if="players[playerId].bottles > 2" src="images/bottleSlotPlaced_3.png">
          </span>
          <span id="slot_4">
            <img v-if="players[playerId].bottles < 4" class="bottleSlotImages" src="images/bottleSlot_4.png">
            <img class="glowingBorder" v-if="players[playerId].bottles > 3" src="images/bottleSlotPlaced_4.png">
          </span>
          <span id="slot_5">
            <img v-if="players[playerId].bottles < 5" class="bottleSlotImages" src="images/bottleSlot_5.png">
            <img class="glowingBorder" v-if="players[playerId].bottles > 4" src="images/bottleSlotPlaced_5.png">
          </span>

        </div>

        <div id="AllPlayerStatsDiv" v-if="playerBoardShown">
          <div id="AllPlayerIdDiv">
            <h3>{{labels.names}}</h3>
            <div class="playercards" v-for="(player, key) in playerIdArray" :key="'names'+key">
              <p>{{ player }}</p>
            </div>
          </div>

          <div id="AllPlayerHandsDiv">
            <h3>{{labels.hands}}</h3>
            <div class="playercards" v-for="(player, key) in playerIdArray" :key="'hands'+key">
              <p>{{players[player].hand.length}}</p>
            </div>
          </div>

          <div id="AllPlayerItemsDiv">
            <h3>{{labels.items}}</h3>
            <div class="playercards" v-for="(player, key) in playerIdArray" :key="'items'+key">
              <CollectorsCard v-for="(card, index) in players[player].items" :card="card" :key="index"/>
            </div>
          </div>

          <div id="AllPlayerSkillsDiv">
            <h3>{{labels.skills}}</h3>
            <div class="playercards" v-for="(player, key) in playerIdArray" :key="'skills'+key">
              <CollectorsCard v-for="(card, index) in players[player].skills" :card="card" :key="index"/>
            </div>
          </div>

          <div id="AllPlayerIncomeDiv">
            <h3>{{labels.income}}</h3>
            <div class="playercards" v-for="(player, key) in playerIdArray" :key="'income'+key">
              <CollectorsCard v-for="(card, index) in players[player].income" :card="card" :key="index"/>
            </div>
          </div>

          <div id="AllPlayerMoneyDiv">
            <h3>{{labels.money}}</h3>
            <div class="playercards" v-for="(player, key) in playerIdArray" :key="'money'+key">
              <p>{{ players[player].money }}</p>
            </div>
          </div>

          <div id="AllPlayerBottlesDiv">
            <h3>{{labels.bottles}}</h3>
            <div class="playercards" v-for="(player, key) in playerIdArray" :key="'bottles'+key">
              <p>{{ players[player].bottles }}</p>
            </div>
          </div>
          <div id="AllPlayerValueDiv">
            <h3>{{labels.value}}</h3>
            <div class="playercards" v-for="(player, key) in playerIdArray" :key="'value'+key">
              <p>{{ players[player].value }}</p>
            </div>
          </div>
        </div>
        <footer>
        </footer>
      </div>
    </div>
  </main>
</template>

<script>
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/
import CollectorsCard from '@/components/CollectorsCard.vue'
import CollectorsBuyActions from '@/components/CollectorsBuyActions.vue'
import CollectorsSkillActions from '@/components/CollectorsSkillActions.vue'
import CollectorsRaiseValueActions from '@/components/CollectorsRaiseValueActions.vue'
import CollectorsAuctionActions from '@/components/CollectorsAuctionActions.vue'
import CollectorsWorkActions from '@/components/CollectorsWorkActions.vue'

export default {
  name: 'Collectors',
  components: {
    CollectorsCard,
    CollectorsBuyActions,
    CollectorsSkillActions,
    CollectorsRaiseValueActions,
    CollectorsAuctionActions,
    CollectorsWorkActions
  },
  data: function () {
    return {
      playerReady: false,
      playerBoardShown: false,
      publicPath: "localhost:8080/#", //"collectors-groupxx.herokuapp.com/#",
      touchScreen: false,
      maxSizes: { x: 0,
        y: 0 },
        labels: {},
        players: {},
        room: {},
        // playerId: {
        //   hand: [],
        //   money: 1,
        //   points: 0,
        //   skills: [],
        //   items: [],
        //   income: [],
        //   secret: []
        // }
        buyPlacement: [],
        skillPlacement: [],
        auctionPlacement: [],
        marketPlacement: [],
        workPlacement: [],
        bottleSlotsArray: ['images/bottleSlot_1.png', 'images/bottleSlot_2.png', 'images/bottleSlot_3.png', 'images/bottleSlot_4.png', 'images/bottleSlot_5.png',],
        chosenPlacementCost: null,
        chosenAction: "",
        raiseValueIndex: null,
        raiseValueSecondCard: null,
        bidArray: [],
        marketValues: { fastaval: 0,
          movie: 0,
          technology: 0,
          figures: 0,
          music: 0 },
        itemsOnSale: [],
        skillsOnSale: [],
        auctionCards: [],
        currentAuctionCard: [],
        noMoreBidsBoolean: false,
        playerid: 0,
        playerCount: 0,
        playerIdArray: [],
        activeRound: 0
        }
      },

      computed: {
        playerId: function() { return this.$store.state.playerId}
      },

      watch: {
        players: function(newP, oldP) {
          console.log(newP, oldP)
          for (let p in this.players) {
            for(let c = 0; c < this.players[p].hand.length; c += 1) {
              if (typeof this.players[p].hand[c].item !== "undefined")
              this.$set(this.players[p].hand[c], "available", false);
            }
          }
        }
      },

      created: function () {
        this.$store.commit('SET_PLAYER_ID', this.$route.query.id)
        //TODO! Fix this ugly hack
        //background: https://github.com/quasarframework/quasar/issues/5672
        const newRoute = this.$route.params.id + "?id=" + this.playerId;
        if (this.$route.params.id + "?id=" + this.$route.query.id !== newRoute)
        this.$router.push(newRoute);
        this.$store.state.socket.emit('collectorsLoaded',
        { roomId: this.$route.params.id,
          playerId: this.playerId } );
          this.$store.state.socket.on('collectorsInitialize',
          function(d) {
            this.labels = d.labels;
            this.players = d.players;
            this.room = d.room;
            this.itemsOnSale = d.itemsOnSale;
            this.marketValues = d.marketValues;
            this.skillsOnSale = d.skillsOnSale;
            this.auctionCards = d.auctionCards;
            this.currentAuctionCard = d.currentAuctionCard;
            this.market = d.market;
            this.buyPlacement = d.placements.buyPlacement;
            this.skillPlacement = d.placements.skillPlacement;
            this.marketPlacement = d.placements.marketPlacement;
            this.auctionPlacement = d.placements.auctionPlacement;
            this.workPlacement = d.placements.workPlacement;
            this.playerCount = d.playerCount;
          }.bind(this));

          this.$store.state.socket.on('collectorsGameStarted',
          function(d) {
            this.playerBoardShown = d.playerBoardShown;
            this.playerIdArray = d.playerIdArray;
            this.players = d.players;
            this.activeRound = d.activeRound;
          }.bind(this));

          this.$store.state.socket.on('collectorsBottlePlaced',
          function(d) {
            this.buyPlacement = d.placements.buyPlacement;
            this.skillPlacement = d.placements.skillPlacement;
            this.marketPlacement = d.placements.marketPlacement;
            this.auctionPlacement = d.placements.auctionPlacement;
            this.players[this.playerId].bottles = d.players[this.playerId].bottles;
            this.playerIdArray = d.playerIdArray;
          }.bind(this));

          this.$store.state.socket.on('collectorsWorkBottlePlaced',
          function(d) {
            this.players[this.playerId].bottles = d.players[this.playerId].bottles;
            this.players[this.playerId].income = d.players[this.playerId].income;
            this.players[this.playerId].money = d.players[this.playerId].money;
            this.players[this.playerId].value = d.players[this.playerId].value;
            this.workPlacement = d.placements.workPlacement;
            this.playerIdArray = d.playerIdArray;
            this.players = d.players;
          }.bind(this));

          this.$store.state.socket.on('collectorsPlayerArrayFinished',function(d) {
            this.playerIdArray = d.playerIdArray;
          }.bind(this));

          this.$store.state.socket.on('collectorsPointsUpdated', (d) => this.points = d );

          this.$store.state.socket.on('collectorsCardDrawn',
          function(d) {
            //this has been refactored to not single out one player's cards
            //better to update the state of all cards
            this.players = d;
          }.bind(this));

          this.$store.state.socket.on('collectorsItemBought',
          function(d) {
            console.log(d.playerId, "bought an item");
            this.players = d.players;
            this.itemsOnSale = d.itemsOnSale;
            this.currentAuctionCard = d.currentAuctionCard;
          }.bind(this));

          this.$store.state.socket.on('collectorsSkillAcquired',
          function(d) {
            console.log(d.playerId, "acquired a skill");
            this.players = d.players;
            this.skillsOnSale = d.skillsOnSale;
            this.currentAuctionCard = d.currentAuctionCard;
          }.bind(this));

          this.$store.state.socket.on('collectorsValueRaised',
          function(d) {
            this.players = d.players;
            this.marketValues = d.marketValues;
            this.market = d.market;
            this.skillsOnSale = d.skillsOnSale;
            this.auctionCards = d.auctionCards;
            this.currentAuctionCard = d.currentAuctionCard;
          }.bind(this));

          this.$store.state.socket.on('collectorsAuctionStarted',
          function(d) {
            this.players = d.players;
            this.auctionCards = d.auctionCards;
            this.currentAuctionCard = d.currentAuctionCard;
          }.bind(this));

          this.$store.state.socket.on('collectorsPlayerValueRecieved',
          function(d) {
            this.players = d;                                         // -------------------------------<<
          }.bind(this));

          this.$store.state.socket.on('collectorsBottlesRetrieved',
          function(d) {
            console.log(d.playerId, "retrieved bottles");
            this.players = d;
          }.bind(this));

          this.$store.state.socket.on('collectorsBidRaised',
          function(d) {
            console.log(d.playerId, "bid is raised");
            this.bidArray = d;
          }.bind(this));

          this.$store.state.socket.on('collectorsAuctionEnded',
          function(d) {
            console.log(d.playerId, "auction is raised");
            this.bidArray = d;
          }.bind(this));

          this.$store.state.socket.on('collectorsRoundUpdated',
          function(d) {
            this.activeRound = d.activeRound;
            this.buyPlacement = d.placements.buyPlacement;
            this.skillPlacement = d.placements.skillPlacement;
            this.marketPlacement = d.placements.marketPlacement;
            this.auctionPlacement = d.placements.auctionPlacement;
            this.workPlacement = d.placements.workPlacement;
            this.players = d.players;
            this.itemsOnSale = d.itemsOnSale;
            this.skillsOnSale = d.skillsOnSale;
            this.market = d.market;
            this.auctionCards = d.auctionCards;
            this.marketValues = d.marketValues;
          }.bind(this));
        },

methods: {
  readyGame: function() {
    this.$store.state.socket.emit('collectorsPlayerReady', {
      playerId: this.playerId,
      roomId: this.$route.params.id
    });
  },

  startGame: function() {
    let allPlayersReady = this.checkAllPlayersReady();
    if (allPlayersReady) {
      this.$store.state.socket.emit('collectorsStartGame', {
        roomId: this.$route.params.id
      });
    }
    else {
      alert("All players are not ready yet. Ready up everyone!")
    }
  },

  checkAllPlayersReady: function() {
    if (this.playerCount === this.playerIdArray.length) {
      return true;
    }
    else {
      return false;
    }
  },

  notLastPlayer: function() {
    if (this.playerId === this.playerIdArray[this.playerIdArray.length-1]) {
      return false;
    }
    else {
      return true;
    }
  },

  changeRound: function() {
    this.$store.state.socket.emit('collectorsChangeRound', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      activeRound: this.activeRound+1,
      players: this.players
    });
  },

  getWinner: function() {
    let highestScore = -1;
    let highestScorePlayer1 = null;
    let winnerArray = [];
    for (let index in Object.keys(this.players)) {
      console.log(this.players[Object.keys(this.players)[index]].victoryPoints);
      if (this.players[Object.keys(this.players)[index]].victoryPoints > highestScore) {
        highestScore = this.players[Object.keys(this.players)[index]].victoryPoints;
        highestScorePlayer1 = Object.keys(this.players)[index];
      }
    }
    winnerArray.push(highestScore);
    winnerArray.push(highestScorePlayer1);
    for (let index in Object.keys(this.players)) {
      console.log(this.players[Object.keys(this.players)[index]].victoryPoints);
      if (this.players[Object.keys(this.players)[index]].victoryPoints === highestScore && Object.keys(this.players)[index] !== highestScorePlayer1) {
        winnerArray.push(Object.keys(this.players)[index]);
      }
    }
    document.getElementById('container').style.filter = "blur(7px)";
    document.getElementById('container').style.transition = "7s";
    document.getElementById('winnerWrap').style.display="block";
    return winnerArray
  },

  selectAll: function (n) {
    n.target.select();
  },

  placeBottle: function (action, cost) {
    this.chosenPlacementCost = cost;
    this.chosenAction = action;
    console.log(action);
    this.$store.state.socket.emit('collectorsPlaceBottle', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      action: action,
      cost: cost,
    });
  },

  visualizeBottleSlots: function (index) {
    var bottleSlotsVisualisation = []
      bottleSlotsVisualisation.push(this.bottleSlotsArray[index - 1]);
      return bottleSlotsVisualisation;
  },

  placeBottleRaiseValue: function (action, p) {
    this.chosenPlacementCost = p.cost;
    this.chosenAction = action;
    this.raiseValueIndex = p.index;
    this.$store.state.socket.emit('collectorsPlaceBottleRaiseValue', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      action: action,
      cost: p.cost,
      index: p.index,
    });
  },

  placeBottleWork: function (action, p) {
    this.chosenPlacementCost = p.cost;
    this.chosenAction = action;
    this.raiseValueIndex = p.index;
    this.$store.state.socket.emit('collectorsPlaceBottleWork', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      action: action,
      cost: p.cost,
      index: p.index,
    });
  },

  buyItem: function (card) {
    this.$store.state.socket.emit('collectorsBuyItem', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      card: card,
      cost: this.marketValues[card.item] + this.chosenPlacementCost
    });
  },

  getSkill: function (card) {
    this.$store.state.socket.emit('collectorsGetSkill', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      card: card,
      cost: this.chosenPlacementCost
    });
  },

  handleAction: function (card) {
    if (card.available) {
      if (this.chosenAction === "buyItem") {
        this.buyItem(card);
      }
      if (this.chosenAction === "buySkill") {
        this.getSkill(card);
      }
      if (this.chosenAction === "market") {
        this.raiseValueHandler(card);
      }
      if (this.chosenAction === "startAuction") {
        this.startAuction(card);
      }
    }
  },

  playerTotalValue: function () {
    this.$store.state.socket.emit('collectorsPlayerTotalValue', {
      roomId: this.$route.params.id,                              //---------------------------<<
      playerId: this.playerId
    });
  },

  retrieveBottles: function () {
    this.$store.state.socket.emit('collectorsRetrieveBottles', {
      roomId: this.$route.params.id,
      playerId: this.playerId
    });
  },

  startAuction: function (card) {
    if (this.currentAuctionCard.length === 0) {
      this.$store.state.socket.emit('collectorsStartAuction', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.chosenPlacementCost
      });
    }
  },

  cannotRaiseBid: function () {
    console.log(this.players[this.playerId].money);
    console.log(this.bidArray.length);
    return (this.players[this.playerId].money <= this.bidArray.length);
  },

  raiseCurrentBid: function () {
    this.$store.state.socket.emit('collectorsRaiseCurrentBid', {
      roomId: this.$route.params.id,
      playerId: this.playerId
    });
  },

  noMoreBids: function() {
    this.noMoreBidsBoolean = true;
  },

  endAuction: function (action) {
    if (action === "buyItem") {
      this.$store.state.socket.emit('collectorsBuyItem', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: this.currentAuctionCard[0],
        cost: this.bidArray.length
      });
    }
    if (action === "getSkill") {
      this.$store.state.socket.emit('collectorsGetSkill', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: this.currentAuctionCard[0],
        cost: this.bidArray.length
      });
    }
    if (action === "market") {
      this.$store.state.socket.emit('collectorsRaiseValue', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card1: this.currentAuctionCard[0],
        card2: null,
        cost: this.bidArray.length
      });
    }
    this.noMoreBidsBoolean = false;
    this.$store.state.socket.emit('collectorsEndAuction', {
      roomId: this.$route.params.id,
      playerId: this.playerId
    });
  },

  raiseValueHandler: function (card) {
    var card2 = null;
    if (this.raiseValueIndex === 2) {
      this.raiseValue(card, card2);
    }
    else if (this.raiseValueSecondCard == null) {
      this.raiseValueSecondCard = card;
    }
    else if (this.raiseValueSecondCard != card) {
      this.raiseValue(card, this.raiseValueSecondCard);
      this.raiseValueSecondCard = null;
    }
  },

  raiseValue: function (card1, card2) {
    this.$store.state.socket.emit('collectorsRaiseValue', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      card1: card1,
      card2: card2,
      cost: this.chosenPlacementCost
    });
  },
},
}

</script>

<style scoped>
header {
  user-select: none;
  position: fixed;
  width:100%;
  pointer-events: none;
}
main {
  user-select: none;
}
footer {
  margin-top: 5em auto;
}
footer a {
  text-decoration: none;
  border-bottom: 2px dotted ivory;
}
footer a:visited {
  color:ivory;
}

#winnerWrap {
  width: 50em;
  height: 100%;
  position: relative;
  margin: auto;
  display: none;
}

#winnerDiv {
  background: radial-gradient(#f5f2cc, darkgray);
  padding: 10px 0 10px 0;
  border-radius: 10px;
  border: 10px double #f5f2cc;
  text-align: center;
  position: absolute;
  height: 15em;
  width: 50em;
  z-index: 1;
  animation: winner 2s forwards, winnerDivBorderAnimation 4s infinite;
}

#winnerDiv h3 {
  vertical-align: middle;
}

#returnButtonDiv {
  margin: 4.5em 0 0 0;
}

#returnButton {
  height: 4em;
  width: 20em;
  border-radius: 10px;
  padding: 0 0 4.5em 0;
  background: radial-gradient(#fffea8, #fffecf);
}

#returnButton h3 {
  font-size: 1.5em;
}

.winnerNames {
  margin: 4em 0 0 0;
}

@keyframes winner {
  from {top: 0;}
  to {top: 55em;}
}

@keyframes winnerDivBorderAnimation {
  0%   {box-shadow: 0 0 50px yellow;}
  25%  {box-shadow: 0 0 50px darkgray;}
  50%  {box-shadow: 0 0 50px yellow;}
  75%  {box-shadow: 0 0 50px darkgray;}
  100% {box-shadow: 0 0 50px yellow;}
}

#BuyItemDiv {
  grid-area: BuyItemDiv;
  align-self: center;
  background: #f9dcce;
  margin: 5px;
}

#BuySkillDiv {
  grid-area: BuySkillDiv;
  align-self: center;
  background: #dfeccc;
  margin: 5px;
}

#AuctionDiv {
  grid-area: AuctionDiv;
  align-self: center;
  background: #f5f1e1;
  margin: 5px;
}

#RaiseValueDiv {
  grid-area: RaiseValueDiv;
  align-self: center;
  background: #cfdcf2;
  margin: 5px;
}

#GameOperationsDiv {
  grid-area: GameOperationsDiv;
  align-self: center;
  text-align: center;
  color: black;
  background: #ceedeb;
  margin: 5px;
  height: 100%
}

#WorkDiv {
  height: 70%;
  grid-area: WorkDiv;
  align-self: center;
  background: #f5f2cc;
  margin: 5px;
}

#HandDiv {
  grid-area: HandDiv;
  align-self: center;
  text-align: center;
  background: #e4e4e3;
  margin: 5px;
}

#PlayerItemsDiv {
  grid-area: PlayerItemsDiv;
  align-self: center;
  background: #e4e4e3;
  margin: 5px;
}

#PlayerSkillsDiv {
  grid-area: PlayerSkillsDiv;
  align-self: center;
  background: #e4e4e3;
  margin: 5px;
}

#PlayerBoardDiv {
  grid-area: PlayerBoardDiv;
  align-self: center;
  /* background: url("https://previews.123rf.com/images/prapann/prapann1606/prapann160600110/58202559-old-wood-vintage-wood-wall-texture-wood-background-old-panels.jpg"); */
  background: pink;
  margin: 5px;
}

#BottleSlotsDiv {
  grid-area: BottleSlotsDiv;
  align-self: center;
  text-align: center;
  display: inline-block;
  position: relative;
  margin: 5px;
  z-index: 0;

  display: grid;
  grid-template-columns: 11.11% 11.11% 11.11% 11.11% 11.11% 11.11% 11.11% 11.11% 11.11%;
  grid-template-rows: 100%;
  grid-template-areas: ". . slot_1 slot_2 slot_3 slot_4 slot_5 . ."
}

#slot_1 {
  grid-area: slot_1;
}

#slot_2 {
  grid-area: slot_2;
}

#slot_3 {
  grid-area: slot_3;
}

#slot_4 {
  grid-area: slot_4;
}

#slot_5 {
  grid-area: slot_5;
}

/* storlek på bottleSlot-bilder */
.bottleSlotImages {
  width: 7em;
}

.glowingBorder {
  width: 7em;
  border-radius: 50%;
  box-shadow: 0 0 30px yellow;
  animation: bottleBorderAnimation 5s ease;
  animation-iteration-count: infinite;
}

@keyframes bottleBorderAnimation {
  0%   {box-shadow: 0 0 30px yellow;}
  25%  {box-shadow: 0 0 30px pink;}
  50%  {box-shadow: 0 0 30px yellow;}
  75%  {box-shadow: 0 0 30px pink;}
  100% {box-shadow: 0 0 30px yellow;}
}

#AllPlayerIdDiv {
  grid-area: AllPlayerIdDiv;
  align-self: center;
}

#AllPlayerHandsDiv {
  grid-area: AllPlayerHandsDiv;
  align-self: center;
}

#AllPlayerItemsDiv {
  grid-area: AllPlayerItemsDiv;
  align-self: center;
}

#AllPlayerSkillsDiv {
  grid-area: AllPlayerSkillsDiv;
  align-self: center;
}

#AllPlayerIncomeDiv {
  grid-area: AllPlayerIncomeDiv;
  align-self: center;
}

#AllPlayerMoneyDiv {
  grid-area: AllPlayerMoneyDiv;
  align-self: center;
}

#AllPlayerBottlesDiv {
  grid-area: AllPlayerBottlesDiv;
  align-self: center;
}

#AllPlayerValueDiv {
  grid-area: AllPlayerValueDiv;
  align-self: center;
}

#AllPlayerStatsDiv {
  align-self: center;
  display: grid;
  grid-template-columns: 10% 15% 15% 15% 15% 10% 10% 10%;
  grid-template-rows: 100%;
  grid-template-areas:
  "AllPlayerIdDiv AllPlayerHandsDiv AllPlayerItemsDiv AllPlayerSkillsDiv AllPlayerIncomeDiv AllPlayerMoneyDiv AllPlayerBottlesDiv AllPlayerValueDiv"
}

#container {
  height: 100%;
  width: 100%;
  display: grid;
  background: #D7D7D7;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-rows: 16,67% 16,67% 16,67% 16,67% 16,67% 16,67%;
  grid-template-areas:
  "BuyItemDiv BuyItemDiv RaiseValueDiv RaiseValueDiv"
  "BuyItemDiv BuyItemDiv RaiseValueDiv RaiseValueDiv"
  "BuySkillDiv BuySkillDiv AuctionDiv AuctionDiv"
  "BuySkillDiv BuySkillDiv AuctionDiv AuctionDiv"
  "GameOperationsDiv WorkDiv WorkDiv HandDiv"
  "BottleSlotsDiv BottleSlotsDiv BottleSlotsDiv BottleSlotsDiv"
  "PlayerBoardDiv PlayerBoardDiv PlayerBoardDiv PlayerBoardDiv"
}

#container h1, h2, h3, p, label, span {
  color: black;
}

#container div {
  border-radius: 10px;
}

#container button {
  border-radius: 5px;
}

#GameOperationsDiv button {
  font-size: 15px;
}

#BottleSlotsDiv input:hover {
  transform: scale(1.1);
  transition: all 0.3s ease-in-out 0s;
}

#BottleSlotsDiv input {
  transition: all 0.2s ease-in-out 0s;
}

#drawCard_button_img {
  width: 3.5em;
  vertical-align: middle;
}

/* #nextRound {
  width: 7em;
  margin-bottom: 0.5em;
  padding: 10px 0px 10px 0px;
} */

#money {
  width: 9em;
  margin-bottom: 0.5em;
  padding: 10px 0px 10px 0px;
}

.bottleSlots {
  width: 8%;
  margin: 0em 2em 0em 2em;
  display: inline-block;
  position: relative;
}

.function_buttons  {
  width: 12em;
  margin-bottom: 0.5em;
  padding: 10px 0px 10px 0px;
  transition: 0.15s;
  transition-timing-function: ease-in-out;
}

.function_buttons:hover,.ready:hover {
  transform: scale(1.05);
  transition: 0.15s;
  transition-timing-function: ease-in-out;
}

.function_button_img {
  width: 2em;
  vertical-align: middle;
}

.ready {
  width: 12em;
  margin-bottom: 0.5em;
  padding: 10px 0px 10px 0px;
}

.cardslots {
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-template-rows: repeat(auto-fill, 180px);
}

.cardslots div {
  transform: scale(0.5)translate(-50%,-50%);
  transition: 0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}

.cardslots div:hover {
  transform: scale(0.8)translate(-25%,-25%);
  z-index: 1;
}

#CardsOnHand.cardslots {
  zoom: 0.8;
  -moz-transform: scale(0.8);
  grid-template-columns: repeat(auto-fill, 40px);
  grid-template-rows: repeat(auto-fill, 180px);
}

.playercards {
  display: grid;
  grid-template-columns: repeat(auto-fill, 30px);
  grid-template-rows: repeat(auto-fill, 80px);
}

.playercards div {
  transform: scale(0.2)translate(-200%,-200%);
  transition: 0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}

.playercards div:hover {
  transform: scale(0.8)translate(-80%,-80%);
  z-index: 1;
}

@media screen and (max-width: 1600px) {
  main {
    zoom: 0.8;
    -moz-transform: scale(0.8);
  }
}

@media screen and (max-width: 1300px) {
  main {
    zoom: 0.6;
    -moz-transform: scale(0.6);
  }
}

@media screen and (max-width: 1000px) {
  main {
    zoom: 0.5;
    -moz-transform: scale(0.5);
  }
}
@media screen and (max-width: 850px) {
  main {
    zoom: 0.4;
    -moz-transform: scale(0.4);
  }
}

@media screen and (max-width: 650px) {
  main {
    zoom: 0.3;
    -moz-transform: scale(0.3);
  }
}

@media screen and (max-width: 480px) {
  main {
    zoom: 0.2;
    -moz-transform: scale(0.2);
  }
}

@media screen and (max-width: 325px) {
  main {
    zoom: 0.1;
    -moz-transform: scale(0.1);
  }
}

</style>
