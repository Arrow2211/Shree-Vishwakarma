import express from 'express';
const app = express();
app.get('/', (req, res) => res.send('OK'));
app.listen(3000, '0.0.0.0', () => console.log('Minimal server running on 3000'));
