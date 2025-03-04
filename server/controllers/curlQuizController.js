const CurlQuiz = require('../models/CurlQuiz');
const User = require('../models/User');

const submitCurlQuiz = async (req, res) => {
  try {
    const { userId, quizName, answers, result } = req.body;

    if (!userId || !quizName || !answers || !result) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new CurlQuiz document
    const newQuiz = new CurlQuiz({
      user: userId,
      quizName,
      answers,
      result,
    });
    await newQuiz.save();

    // Hardcoded community mapping logic based on result text (case-insensitive)
    const lowerResult = result.toLowerCase();
    let assignedCommunity = "";
    if (lowerResult.includes("straight")) {
      assignedCommunity = "Straight & Sleek Community";
    } else if (lowerResult.includes("wavy")) {
      assignedCommunity = "Wavy Wonders";
    } else if (lowerResult.includes("curly") || lowerResult.includes("coily")) {
      assignedCommunity = "Curly Queens";
    } else {
      assignedCommunity = "General Hair Community";
    }

    // Update the user's latestCurlQuiz and community field
    await User.findByIdAndUpdate(userId, { 
      latestCurlQuiz: newQuiz._id, 
      community: assignedCommunity 
    });

    res.status(201).json({
      message: "Curl quiz submitted!",
      quiz: newQuiz,
      community: assignedCommunity
    });
  } catch (error) {
    console.error("Curl Quiz submission error:", error.message);
    res.status(500).json({ message: "Failed to update hair profile" });
  }
};

module.exports = { submitCurlQuiz };
