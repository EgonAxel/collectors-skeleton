<template>
  <div id="RaiseValueDiv">
    <h1 style="text-align: center"><img class="title_img" src="images/raise.png">{{ labels.raiseValue }}</h1>
    <div id="MarketDiv">
      <div id="Cards">
        <div class="raise-value">
          <div v-for="(card, index) in market" :key="index">
            <CollectorsCard :card="card"/>
          </div>
        </div>
        <div>
          <div class="buttons" v-for="(p, index) in placement" :key="index">
            <button
            v-if="p.playerId===null"
            :disabled="cannotAfford(p.cost) || player.bottles < 1"
            @click="placeBottle(p, index)">
            <!-- ${{p.cost}} -->
            <img :src='p.img' style="width:75%">
          </button>
          <div v-if="p.playerId !== null" style="color:black">
            {{p.playerId}}
          </div>
        </div>
      </div>
    </div>
    <div id="ValueStats">
      <h3>{{labels.currentlyRaisedValues}}</h3>
      <div v-for="(type, index) in marketValues" :key="index">
        <p> {{ index }} : {{ type }} </p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsRaiseValueActions',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    skillsOnSale: Array,
    auctionCards: Array,
    marketValues: Object,
    placement: Array,
    market: Array
  },
  methods: {
    cannotAfford: function (cost) {
      return (this.player.money < cost);
    },

    placeBottle: function (p, index) {
      p.index = index;
      this.$emit('placeBottleRaiseValue', p);
      this.highlightAvailableCards();
    },

    highlightAvailableCards: function () {
      let lastSkillIndex = -1;
      for (let i = 0; i < this.skillsOnSale.length; i++) {
        if (this.skillsOnSale[i].item != undefined) {
          lastSkillIndex = i;
        }
        console.log(this.skillsOnSale);
        console.log(lastSkillIndex);
      }
      if (lastSkillIndex >= 0) {
        this.$set(this.skillsOnSale[lastSkillIndex], "available", true);
      }
      let lastAuctionIndex = -1;
      for (let i = 0; i < this.auctionCards.length; i++) {
        if (this.auctionCards[i].item != undefined) {
          lastAuctionIndex = i;
        }
      }
      if (lastAuctionIndex >= 0) {
        this.$set(this.auctionCards[lastAuctionIndex], "available", true);
      }
      if (this.player.hand.length > 0) {
        for (let i = 0; i < this.player.hand.length; i += 1) {
          this.$set(this.player.hand[i], "available", true);
        }
      }
    },
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.title_img {
  height: 65px;
  width: 70px;
  vertical-align: middle;
}

.raise-value {
  display: grid;
  grid-template-columns: repeat(auto-fill, 40px);
  grid-template-rows: repeat(auto-fill, 260px);
}

.raise-value div {
  transform: scale(0.8)translate(-10%,-10%);
  transition:0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}

.raise-value div:hover {
  transform: scale(0.9)translate(-10%,-10%);
  z-index: 1;
}

.buttons {
  display: grid;
  float:left;
  grid-template-columns: repeat(auto-fill, 130px);
  transform: scale(0.8)translate(10%,-10%);
}

.buttons button {
  border-radius: 10px;
  transition: 0.15s;
  transition-timing-function: ease-in-out;
}

.buttons button:hover {
  transform: scale(1.05);
  transition:0.2s;
  transition-timing-function: ease-in-out;
}

#Cards {
  grid-area: Cards;
  align-self: center;
}

#ValueStats {
  grid-area: ValueStats;
  align-self: center;
}

#MarketDiv {
  display: grid;
  grid-template-columns: 85% 15% ;
  grid-template-areas:
  "Cards ValueStats"
}

#RaiseValueDiv h1, h2, h3, p  {
  color: black;
}

</style>
