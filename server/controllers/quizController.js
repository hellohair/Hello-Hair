exports.curlQuiz = (req, res) => {
    const { answers } = req.body;
    // Simple stub logic – in a real app, analyze quiz answers to decide the hair type.
    let hairType = 'Curly';
    if (answers && answers.length && answers[0] === 'option1') {
      hairType = 'Straight';
    }
    res.json({ hairType, message: 'Quiz result based on your answers' });
  };
  