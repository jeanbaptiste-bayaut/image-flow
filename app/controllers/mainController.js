import fs from 'fs';
import path from 'path';
import csv2json from 'csvtojson';

const __dirname = path.resolve();

export default class MainController {
  static async transformToJson(req, res) {
    const { brand, pattern, color } = req.params;
    try {
      const file = fs
        .readdirSync(path.join(__dirname, 'uploads'))
        .find((file) => file.endsWith('.csv'));

      const filePath = path.join(__dirname, 'uploads', file);

      const jsonArray = await csv2json({
        noheader: false,
        delimiter: ';',
      }).fromFile(filePath);

      jsonArray.forEach((product) => {
        product['images_name'] = [];
        for (const key in product) {
          if (
            key.includes('image_') &&
            product[key] !== '' &&
            key !== 'images_name'
          ) {
            product['images_name'].push({ name: product[key] });
          }
        }

        for (const key in product) {
          if (key.includes('image_')) {
            delete product[key];
          }
        }
      });

      const productInfos = jsonArray.find((product) => {
        return (
          product.brand === brand &&
          product.pattern === pattern &&
          product.color === color
        );
      });

      console.log(productInfos);

      res.json(productInfos);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
}
