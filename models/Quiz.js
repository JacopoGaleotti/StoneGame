const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  id: Number,
  questions: [
    {
      question: String,
      answers: [String],
      correct: Number,
      image: String,
    }
  ]
});

module.exports = mongoose.model("Quiz", quizSchema, "kahootGames");
