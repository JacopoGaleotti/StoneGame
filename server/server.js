const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const mongoose = require("mongoose");

const { LiveGames } = require("./utils/liveGames");
const { Players } = require("./utils/players");

const Quiz = require("../models/Quiz.js"); 

const publicPath = path.join(__dirname, "../public");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const games = new LiveGames();
const players = new Players();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connessione a MongoDB con Mongoose"))
.catch(err => {
  console.error("❌ Errore connessione MongoDB:", err);
  process.exit(1);
});

app.use(express.static(publicPath));
app.use(express.json());

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server avviato sulla porta", PORT);
});

app.delete("/deleteQuiz/:id", async (req, res) => {
  const quizId = parseInt(req.params.id);

  try {
    const result = await Quiz.deleteOne({ id: quizId });

    if (result.deletedCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Quiz non trovato" });
    }
  } catch (error) {
    console.error("Errore eliminazione quiz:", error);
    res.status(500).json({ success: false, message: "Errore server" });
  }
});

// SOCKET
io.on("connection", (socket) => {

  socket.on("host-join", async (data) => {
    try {
      const quiz = await Quiz.findOne({ id: parseInt(data.id) });

      if (quiz) {
        const gamePin = Math.floor(Math.random() * 90000) + 10000;

        games.addGame(gamePin, socket.id, false, {
          playersAnswered: 0,
          questionLive: false,
          gameid: data.id,
          question: 1,
        });

        const game = games.getGame(socket.id);
        socket.join(game.pin);
        console.log("Gioco creato con pin:", game.pin);

        socket.emit("showGamePin", { pin: game.pin });
      } else {
        socket.emit("noGameFound");
      }
    } catch (err) {
      console.error("Errore in host-join:", err);
      socket.emit("noGameFound");
    }
  });

  socket.on("host-join-game", async (data) => {
    const oldHostId = data.id;
    const game = games.getGame(oldHostId);

    if (game) {
      game.hostId = socket.id;
      socket.join(game.pin);

      const playerData = players.getPlayers(oldHostId);
      players.players.forEach((p) => {
        if (p.hostId === oldHostId) p.hostId = socket.id;
      });

      const quiz = await Quiz.findOne({ id: parseInt(game.gameData.gameid) });

      if (quiz) {
        const q = quiz.questions[0];
        socket.emit("gameQuestions", {
          q1: q.question,
          a1: q.answers[0],
          a2: q.answers[1],
          a3: q.answers[2],
          a4: q.answers[3],
          correct: q.correct,
          playersInGame: playerData.length,
        });

        setTimeout(() => {
          io.to(game.pin).emit("sendImageToPlayers", { image: q.image || "" });
        }, 500);
      }

      io.to(game.pin).emit("gameStartedPlayer");
      game.gameData.questionLive = true;
    } else {
      socket.emit("noGameFound");
    }
  });

  socket.on("player-join", (params) => {
    let gameFound = false;

    games.games.forEach((game) => {
      if (params.pin === game.pin) {
        players.addPlayer(game.hostId, socket.id, params.name, {
          score: 0,
          answer: 0,
        });

        socket.join(params.pin);
        const playersInGame = players.getPlayers(game.hostId);
        io.to(params.pin).emit("updatePlayerLobby", playersInGame);
        gameFound = true;
      }
    });

    if (!gameFound) {
      socket.emit("noGameFound");
    }
  });

  socket.on("player-join-game", (data) => {
    const player = players.getPlayer(data.id);
    if (player) {
      const game = games.getGame(player.hostId);
      socket.join(game.pin);
      player.playerId = socket.id;

      const playerData = players.getPlayers(game.hostId);
      socket.emit("playerGameData", playerData);
    } else {
      socket.emit("noGameFound");
    }
  });

  socket.on("disconnect", () => {
    const game = games.getGame(socket.id);
    if (game && !game.gameLive) {
      games.removeGame(socket.id);
      const playersToRemove = players.getPlayers(game.hostId);
      playersToRemove.forEach((p) => players.removePlayer(p.playerId));
      io.to(game.pin).emit("hostDisconnect");
    } else {
      const player = players.getPlayer(socket.id);
      if (player) {
        const game = games.getGame(player.hostId);
        if (game && !game.gameLive) {
          players.removePlayer(socket.id);
          const playersInGame = players.getPlayers(player.hostId);
          io.to(game.pin).emit("updatePlayerLobby", playersInGame);
        }
      }
    }
  });

  socket.on("playerAnswer", async (num) => {
    const player = players.getPlayer(socket.id);
    if (!player) return;

    const hostId = player.hostId;
    const game = games.getGame(hostId);
    if (game && game.gameData.questionLive) {
      player.gameData.answer = num;
      game.gameData.playersAnswered++;

      const quiz = await Quiz.findOne({ id: parseInt(game.gameData.gameid) });
      if (!quiz) return;

      const correctAnswer = quiz.questions[game.gameData.question - 1].correct;
      if (num === correctAnswer) {
        player.gameData.score += 100;
      }

      const playersInGame = players.getPlayers(hostId);
      io.to(game.pin).emit("updateScore", playersInGame);
    }
  });

});

