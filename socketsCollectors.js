function sockets(io, socket, data) {
    socket.on('setupCollectors', function(d) {
      data.createRoom(d.roomId, d.playerCount, d.lang);
    })
    socket.on('collectorsLoaded', function(d) {
      socket.join(d.roomId);
      if (data.joinGame(d.roomId, d.playerId)) {
        socket.emit('collectorsInitialize', {
            labels: data.getUILabels(d.roomId),
            players: data.getPlayers(d.roomId),
            itemsOnSale: data.getItemsOnSale(d.roomId),
            marketValues: data.getMarketValues(d.roomId),
            skillsOnSale: data.getSkillsOnSale(d.roomId),
            auctionCards: data.getAuctionCards(d.roomId),
            currentAuctionCard: data.getCurrentAuctionCard(d.roomId),
            placements: data.getPlacements(d.roomId),
            market: data.getMarket(d.roomId)
          }
        );
      }
    });
    socket.on('collectorsDrawCard', function(d) {
      io.to(d.roomId).emit('collectorsCardDrawn',
      data.drawCard(d.roomId, d.playerId)
      );
    });
    socket.on('collectorsBuyCard', function(d) {
      data.buyCard(d.roomId, d.playerId, d.card, d.cost)
      io.to(d.roomId).emit('collectorsCardBought', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          itemsOnSale: data.getItemsOnSale(d.roomId)
        }
      );
    });
    socket.on('collectorsPlaceBottle', function(d) {
      data.placeBottle(d.roomId, d.playerId, d.action, d.cost);
      io.to(d.roomId).emit('collectorsBottlePlaced', data.getPlacements(d.roomId)
      );
    });

    socket.on('collectorsPlaceBottleRaiseValue', function(d) {
      data.placeBottleRaiseValue(d.roomId, d.playerId, d.action, d.cost, d.index);
      io.to(d.roomId).emit('collectorsBottlePlaced', data.getPlacements(d.roomId)
      );
    });

    socket.on('collectorsStartAuction', function(d) {
      data.startAuction(d.roomId, d.playerId, d.card, d.cost);
      io.to(d.roomId).emit('collectorsAuctionStarted', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          auctionCards: data.getAuctionCards(d.roomId),
          currentAuctionCard: data.getCurrentAuctionCard(d.roomId)
        }
      );
    });

    socket.on('collectorsGetSkill', function(d) {
      data.getSkill(d.roomId, d.playerId, d.card, d.cost)
      io.to(d.roomId).emit('collectorsSkillAcquired', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          skillsOnSale: data.getSkillsOnSale(d.roomId)
        }
      );
    });

    socket.on('collectorsRaiseValue', function(d) {
      data.raiseValue(d.roomId, d.playerId, d.card1, d.cost)
      if (d.card2 !== null) {
        data.raiseValue(d.roomId, d.playerId, d.card2, 0)
      }
      io.to(d.roomId).emit('collectorsValueRaised', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          marketValues: data.getMarketValues(d.roomId),
          market: data.getMarket(d.roomId),
          skillsOnSale: data.getSkillsOnSale(d.roomId),
          auctionCards: data.getAuctionCards(d.roomId),
        }
      );
    });

    socket.on('collectorsFakeMoreMoney', function(d) {
      io.to(d.roomId).emit('collectorsMoneyFaked',
      data.fakeMoreMoney(d.roomId, d.playerId)
      );
    });

    socket.on('collectorsRaiseCurrentBid', function(d) {
	io.to(d.roomId).emit('collectorsBidRaised',
			     data.raiseCurrentBid(d.roomId, d.playerId)
      );
    });

}

module.exports = sockets;
