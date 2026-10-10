const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});