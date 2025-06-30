import fs from 'fs';
import path from 'path';
import csv2json from 'csvtojson';
import { Parser } from 'json2csv';

export default class ProductController {
  static async getProductByBrand(req, res) {
    const { brand } = req.params;

    try {
      const __dirname = path.resolve();
      const file = fs
        .readdirSync(path.join(__dirname, 'uploads'))
        .find((file) => file.endsWith('products-253-254.csv'));

      const filePath = path.join(__dirname, 'uploads', file);

      const jsonArray = await csv2json({
        noheader: false,
        delimiter: ';',
      }).fromFile(filePath);

      const productsByBrand = jsonArray.filter(
        (row) => row.brand == brand && row.status !== 'true'
      );

      res.json(productsByBrand);
    } catch (error) {
      console.error(error); // Re-throw the error to be caught by the catch block
      throw new Error('Error processing the request');
    }
  }

  static async updateProduct(req, res) {
    const { material, comment, noimages } = req.body;

    if (!material) {
      return res.status(400).json({ message: 'Material is required' });
    }

    try {
      const __dirname = path.resolve();
      const file = fs
        .readdirSync(path.join(__dirname, 'uploads'))
        .find((file) => file.endsWith('products-253-254.csv'));

      const filePath = path.join(__dirname, 'uploads', file);

      const jsonArray = await csv2json({
        noheader: false,
        delimiter: ';',
      }).fromFile(filePath);

      const productToEdit = jsonArray.find(
        (row) => row.material.toLowerCase() === material.toLowerCase()
      );

      if (!productToEdit) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (comment) productToEdit.comment = comment;

      if (noimages) productToEdit.noimages = noimages;

      productToEdit.status = 'true';

      // // Save the updated product back to the CSV file
      // const updatedCsv = jsonArray.map((row) => {
      //   if (row.material.toLowerCase() === material.toLowerCase()) {
      //     return {
      //       ...row,
      //       // composition: `${productToEdit[0].composition}`,
      //       // characteristics: `${productToEdit[0].characteristics}`,
      //       comment: productToEdit[0].comment || row.comment,
      //       noimages: productToEdit[0].noimages || row.noimages,
      //     };
      //   }

      //   return {
      //     ...row,
      //     // composition: `${productToEdit[0].composition}`,
      //     // characteristics: `${productToEdit[0].characteristics}`,
      //   };
      // });

      // Rebuild CSV using json2csv
      const fields = [
        'material',
        'season',
        'brand',
        'style',
        'name',
        'characteristics',
        'composition',
        'gender',
        'department',
        'category',
        'type',
        'site',
        'noimages',
        'comment',
        'status',
      ];

      const parser = new Parser({ fields, delimiter: ';', quote: '"' });
      const csv = parser.parse(jsonArray);

      // Write to file
      fs.writeFileSync(filePath, csv, 'utf8');

      res.json({
        message: 'Product updated successfully',
        product: productToEdit,
      });
    } catch (error) {
      console.error(error); // Re-throw the error to be caught by the catch block
      throw new Error('Error processing the request');
    }
  }
}
