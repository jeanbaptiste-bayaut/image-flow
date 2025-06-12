import fs from 'fs';
import path from 'path';
import csv2json from 'csvtojson';

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

      console.log('Found products:', productsByBrand.length);

      res.json(productsByBrand);
    } catch (error) {
      console.error(error); // Re-throw the error to be caught by the catch block
      throw new Error('Error processing the request');
    }
  }

  static async updateProduct(req, res) {
    const { material, comment, noimages } = req.body;

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

      const productToEdit = jsonArray.filter(
        (row) => row.material.toLowerCase() == material.toLowerCase()
      );

      if (comment) {
        productToEdit[0].comment = comment;
      }

      if (noimages) {
        productToEdit[0].noimages = noimages;
      }

      productToEdit[0].status = 'true';

      // Save the updated product back to the CSV file
      const updatedCsv = jsonArray.map((row) => {
        if (row.material.toLowerCase() === material.toLowerCase()) {
          return {
            ...row,
            comment: productToEdit[0].comment || row.comment,
            noimages: productToEdit[0].noimages || row.noimages,
          };
        }
        return row;
      });

      const headers =
        'material;season;brand;style;name;characteristics;composition;gender;department;category;type;site;noimages;comment;status';
      const csvContent = updatedCsv
        .map((row) => Object.values(row).join(';'))
        .join('\n');

      // Add headers to the CSV content
      const headerRow = headers + '\n';
      const csvContentWithHeaders = headerRow + csvContent;

      // Write the updated CSV content back to the file
      fs.writeFileSync(filePath, csvContentWithHeaders, 'utf8');
      console.log('Product updated successfully');
      // Return the updated product information

      res.json({
        message: 'Product updated successfully',
        product: productToEdit[0],
      });
    } catch (error) {
      console.error(error); // Re-throw the error to be caught by the catch block
      throw new Error('Error processing the request');
    }
  }
}
