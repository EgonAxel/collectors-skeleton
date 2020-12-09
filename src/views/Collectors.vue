<template>
  <main>
    <div id='container'>

      <div id="BuyCardDiv">
        <!-- {{buyPlacement}} {{chosenPlacementCost}} Detta borde vi kunna skita i nu-->
        <CollectorsBuyActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :itemsOnSale="itemsOnSale"
        :marketValues="marketValues"
        :placement="buyPlacement"
        @buyCard="buyCard($event)"
        @placeBottle="placeBottle('buyItem', $event)"/>
      </div>

      <div id ="BuySkillDiv">
        <CollectorsSkillActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :skillsOnSale="skillsOnSale"
        :placement="skillPlacement"
        @getSkill="handleAction($event)"
        @placeBottle="placeBottle('buySkill', $event)"/>
      </div>

      <div id ="RaiseValueDiv">
        <CollectorsRaiseValueActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :marketValues="marketValues"
        :skillsOnSale="skillsOnSale"
        :auctionCards="auctionCards"
        :market="market"
        :currentAuctionCard="currentAuctionCard"
        :placement="marketPlacement"
        @raiseValue="raiseValue($event)"
        @placeBottleRaiseValue="placeBottleRaiseValue('market', $event)"/>
      </div>

      <div id="AuctionDiv">
        <button v-if="players[playerId]" @click="raiseCurrentBid()">
          Raise current bid!
        </button>
<<<<<<< HEAD
        <p v-if="players[playerId]"> Current highest bid: {{ players[playerId].bidArray.length }} </p>
        <p v-if="players[playerId]"> Current test: {{ bidArray }} </p>
=======
        <!--<div v-for="key in room.bidArray" :key="key"/> </div>-->
	
>>>>>>> 9c7c040d520edc6e7be07e4383546ff99f54aeb1
        <CollectorsAuctionActions v-if="players[playerId]"
        :labels="labels"
        :player="players[playerId]"
        :auctionCards="auctionCards"
        :currentAuctionCard="currentAuctionCard"
        :placement="auctionPlacement"
        @handleAction="handleAction($event)"
        @placeBottle="placeBottle('startAuction', $event)"/>
      </div>

      <div id ='WorkDiv' class="cardslots">
        <h2>Work</h2>
        <!-- <CollectorsCard v-for="(card, index) in auctionCards" :card="card" :key="index"/> -->
      </div>

      <div id="HandDiv" class="cardslots" v-if="players[playerId]">
        <h2>Hand</h2>
        <CollectorsCard v-for="(card, index) in players[playerId].hand" :card="card" :availableAction="card.available" @doAction="handleAction(card)" :key="index"/>
      </div>

      <div id="PlayerItemsDiv" class="cardslots" v-if="players[playerId]">
        <h2>Items</h2>
        <CollectorsCard v-for="(card, index) in players[playerId].items" :card="card" :key="index"/>
      </div>

      <div id="PlayerSkillsDiv" class="cardslots" v-if="players[playerId]">
        <h2>Skills</h2>
        <CollectorsCard v-for="(card, index) in players[playerId].skills" :card="card" :key="index"/>
      </div>

      <div id="PlayerBoardDiv">
        <h2>Player boards</h2>
        <!-- Displayar current money -->
        <p v-if="players[playerId]"> Current money: {{ players[playerId].money }} </p>
        <!-- Displayar current money -->
        <!-- <p> {{players}}        Tog bort denna info för tillfället, man kan kommentera tillbaka om man vill se
            {{marketValues}}</p>  -->
        <button v-if="players[playerId]" @click="fakeMoreMoney()">
          fake more money
        </button>
        <div class="buttons">
          <button @click="drawCard">
            {{ labels.draw }}
          </button>
        </div>

        <div id="AllPlayerCardsDiv">

          <div id="AllPlayerIdDiv">
            <h3>Names</h3>
            <div class="playercards" v-for="(player, key) in players" :key="key">
              <p>{{ key }}</p>
            </div>
          </div>

          <div id="AllPlayerHandsDiv">
            <h3>Hands</h3>
            <div class="playercards" v-for="(player, key) in players" :key="key">
              <CollectorsCard v-for="(card, index) in player.hand" :card="card" :key="index"/>
            </div>
          </div>

          <div id="AllPlayerItemsDiv">
            <h3>Items</h3>
            <div class="playercards" v-for="(player, key) in players" :key="key">
              <CollectorsCard v-for="(card, index) in player.items" :card="card" :key="index"/>
            </div>
          </div>

          <div id="AllPlayerSkillsDiv">
            <h3>Skills</h3>
            <div class="playercards" v-for="(player, key) in players" :key="key">
              <CollectorsCard v-for="(card, index) in player.skills" :card="card" :key="index"/>
            </div>
          </div>
        </div>

        <footer>
          <p>
            {{ labels.invite }}
            <input type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
          </p>
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

export default {
  name: 'Collectors',
  components: {
    CollectorsCard,
    CollectorsBuyActions,
    CollectorsSkillActions,
    CollectorsRaiseValueActions,
    CollectorsAuctionActions
  },
  data: function () {
    return {
      publicPath: "localhost:8080/#", //"collectors-groupxx.herokuapp.com/#",
      touchScreen: false,
      maxSizes: { x: 0,
        y: 0 },
        labels: {},
        players: {},
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
        playerid: 0
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
            this.bidArray = d.bidArray;
            this.itemsOnSale = d.itemsOnSale;
            this.marketValues = d.marketValues;
            this.skillsOnSale = d.skillsOnSale;
            this.auctionCards = d.auctionCards;
            this.market = d.market;
            this.buyPlacement = d.placements.buyPlacement;
            this.skillPlacement = d.placements.skillPlacement;
            this.marketPlacement = d.placements.marketPlacement;
            this.auctionPlacement = d.placements.auctionPlacement;
          }.bind(this));

          this.$store.state.socket.on('collectorsBottlePlaced',
          function(d) {
            this.buyPlacement = d.buyPlacement;
            this.skillPlacement = d.skillPlacement;
            this.marketPlacement = d.marketPlacement;
            this.auctionPlacement = d.auctionPlacement;
          }.bind(this));

          this.$store.state.socket.on('collectorsPointsUpdated', (d) => this.points = d );

          this.$store.state.socket.on('collectorsCardDrawn',
          function(d) {
            //this has been refactored to not single out one player's cards
            //better to update the state of all cards
            this.players = d;
          }.bind(this));

          this.$store.state.socket.on('collectorsCardBought',
          function(d) {
            console.log(d.playerId, "bought a card");
            this.players = d.players;
            this.itemsOnSale = d.itemsOnSale;
          }.bind(this));

          this.$store.state.socket.on('collectorsSkillAcquired',
          function(d) {
            console.log(d.playerId, "acquired a skill");
            this.players = d.players;
            this.skillsOnSale = d.skillsOnSale;
          }.bind(this));

          this.$store.state.socket.on('collectorsValueRaised',
          function(d) {
            console.log(d.playerId, "raised a value");
            this.players = d.players;
            this.marketValues = d.marketValues;
            this.market = d.market;
            this.skillsOnSale = d.skillsOnSale;
            this.auctionCards = d.auctionCards;
          }.bind(this));

          this.$store.state.socket.on('collectorsAuctionStarted',
          function(d) {
            this.players = d.players;
            this.auctionCards = d.auctionCards;
            this.currentAuctionCard = d.currentAuctionCard;
          }.bind(this));

          this.$store.state.socket.on('collectorsMoneyFaked',
          function(d) {
            console.log(d.playerId, "faked money");
            this.players = d;
          }.bind(this));

          this.$store.state.socket.on('collectorsBidRaised',
          function(d) {
            console.log(d.playerId, "bid is raised");
            this.bidArray = d;
          }.bind(this));

},
methods: {
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

  drawCard: function () {
    console.log(this.market)
    this.$store.state.socket.emit('collectorsDrawCard', {
      roomId: this.$route.params.id,
      playerId: this.playerId
    });
  },

  buyCard: function (card) {
    this.$store.state.socket.emit('collectorsBuyCard', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      card: card,
      cost: this.marketValues[card.item] + this.chosenPlacementCost
    });
  },

  getSkill: function (card) {
    console.log(this.currentAuctionCard);
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
        this.buyCard(card);
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

  fakeMoreMoney: function () {
    this.$store.state.socket.emit('collectorsFakeMoreMoney', {
      roomId: this.$route.params.id,
      playerId: this.playerId
    });
  },

  raiseCurrentBid: function () {
    this.$store.state.socket.emit('collectorsRaiseCurrentBid', {
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
    else {
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

  startAuction: function (card) {
    this.$store.state.socket.emit('collectorsStartAuction', {
      roomId: this.$route.params.id,
      playerId: this.playerId,
      card: card,
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


#BuyCardDiv {
  grid-area: BuyCardDiv;
  align-self: center;
  background: #f9dcce;
}

#BuySkillDiv {
  grid-area: BuySkillDiv;
  align-self: center;
  background: #dfeccc;
}

#AuctionDiv {
  grid-area: AuctionDiv;
  align-self: center;
  background: #f5f1e1;
}

#RaiseValueDiv {
  grid-area: RaiseValueDiv;
  align-self: center;
  background: #cfdcf2;
}

#WorkDiv {
  grid-area: WorkDiv;
  align-self: center;
background: #f5f2cc;
}

#HandDiv {
  grid-area: HandDiv;
  align-self: center;
  background: #e4e4e3;
}

#PlayerItemsDiv {
  grid-area: PlayerItemsDiv;
  align-self: center;
  background: #e4e4e3;
}

#PlayerSkillsDiv {
  grid-area: PlayerSkillsDiv;
  align-self: center;
  background: #e4e4e3;
}

#PlayerBoardDiv {
  grid-area: PlayerBoardDiv;
  align-self: center;
  /* background: url("https://previews.123rf.com/images/prapann/prapann1606/prapann160600110/58202559-old-wood-vintage-wood-wall-texture-wood-background-old-panels.jpg"); */
  background: #e4e4e3;
}

#AllPlayerCardsDiv {
  grid-area: AllPlayerCardsDiv;
  align-self: center;
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-areas:
  "AllPlayerIdDiv AllPlayerHandsDiv AllPlayerItemsDiv AllPlayerSkillsDiv"
}

#container {
  height: 100%;
  display: grid;
  background: #D7D7D7;
  grid-template-columns: 50% 50% ;
  grid-template-rows: 16,67% 16,67% 16,67% 16,67% 16,67% 16,67%;
  column-gap: 20px;
  row-gap: 20px;
  grid-template-areas:
  "BuyCardDiv RaiseValueDiv"
  "BuyCardDiv RaiseValueDiv"
  "BuySkillDiv AuctionDiv"
  "BuySkillDiv WorkDiv"
  "PlayerItemsDiv PlayerBoardDiv"
  "PlayerSkillsDiv PlayerBoardDiv"
  "HandDiv PlayerBoardDiv"
}

#container h1, h2, h3, p  {
  color: black;
}

.cardslots {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
  grid-template-rows: repeat(auto-fill, 180px);
}
.cardslots div {
  transform: scale(0.5)translate(-50%,-50%);
  transition:0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}
.cardslots div:hover {
  transform: scale(0.8)translate(-25%,-25%);
  z-index: 1;
}

.playercards {
  display: grid;
  grid-template-columns: repeat(auto-fill, 30px);
  grid-template-rows: repeat(auto-fill, 80px);
}

.playercards div {
  transform: scale(0.2)translate(-200%,-200%);
  transition:0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}

.playercards div:hover {
  transform: scale(0.8)translate(-20%,-20%);
  z-index: 1;
}

@media screen and (max-width: 800px) {
  main {
    width:90vw;
  }
}
</style>
