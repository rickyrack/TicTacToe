const express = require("express");
const User = require("../models/User");
const Match = require("../models/Match");
const router = express.Router();

// GET play page
router.get("/", async (req, res) => {
  res.render("play", {
    title: "Play",
    username: req.body.username,
  });
});

// POST create finished game data
router.post("/:id", async (req, res) => {
  // only sent by winning player or player 1 in ties
  // username will be the winner OR player 1 in ties
  const gameData = req.body;
  const loserUsername =
    gameData.username === gameData.p1Name ? gameData.p2Name : gameData.p1Name;
  try {
    if (gameData.tie) {
      await User.findOneAndUpdate(
        { username: gameData.p1Name },
        { $inc: { tie: 1 } },
        { new: true }
      );
      await User.findOneAndUpdate(
        { username: gameData.p2Name },
        { $inc: { tie: 1 } },
        { new: true }
      );
    } else {
      // update winner and POST completed match
      console.log('erm')
      await User.findOneAndUpdate(
        { username: gameData.username },
        { $inc: { win: 1 } },
        { new: true }
      );
      // update loser
      await User.findOneAndUpdate(
        { username: loserUsername },
        { $inc: { loss: 1 } },
        { new: true }
      );
    }

    const match = new Match({
      winner: gameData.username,
      loser: loserUsername,
      lobbyId: req.params.id,
      ranked: false,
      board: gameData.board,
      tie: gameData.tie,
    });

    const newMatch = await match.save();
    console.log(newMatch)
    res.status(201).json(newMatch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
