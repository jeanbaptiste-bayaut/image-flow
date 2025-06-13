import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import MainController from './app/controllers/mainController.js';
import ProductController from './app/controllers/productController.js';
import path from 'path';
import cors from 'cors';

const app = express();
const __dirname = path.resolve();
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:6464',
    'https://image-control.onrender.com',
  ],
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './dist')));
app.use(cors(corsOptions));

const httpServer = createServer(app);

app.get('/', (req, res) => {
  MainController.transformToJson(req, res);

  res.sendFile(path.join(__dirname, './dist', 'index.html'));
});

app.get('/api/products/:brand', (req, res) => {
  console.log('API request products');
  ProductController.getProductByBrand(req, res);
});

app.get('/api/images/:brand/:pattern/:color', (req, res) => {
  console.log('API request get images');
  MainController.transformToJson(req, res);
});

app.patch('/api/products', (req, res) => {
  console.log('API request update product');
  ProductController.updateProduct(req, res);
});

const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
  console.log(`Server launched at http://localhost:${PORT}`);
});

export default app;
