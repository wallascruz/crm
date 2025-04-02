import express from 'express';
import compression from 'compression';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(compression());
app.use(express.json());
app.use(express.static('dist'));


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
