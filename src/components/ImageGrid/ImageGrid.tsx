import './ImageGrid.css';
import Nav from '../Nav/Nav';
import Modal from '../Modal/Modal';
import axios from 'axios';
import { useEffect, useState } from 'react';

type CardProp = {
  pattern: string;
  color: string;
  brand: string;
  images_name: {
    name: string;
  }[];
};

type ProductsProp = {
  material: string;
  season: number;
  brand: string;
  style: string;
  name: string;
  gender: string;
  department: string;
  category: string;
  type: string;
  site: string;
  characteristics: string;
  composition: string;
  status: boolean;
  comments: string;
};

function ImageGrid() {
  const [images, setImages] = useState<CardProp>({
    pattern: '',
    color: '',
    brand: '',
    images_name: [{ name: '' }],
  });
  const [products, setProducts] = useState<ProductsProp[]>([]);
  const [overlay, setOverlay] = useState({ status: false, image: '' });
  const [index, setIndex] = useState<number>(0);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function getImages() {
    setLoading(true);
    const url = `${products[index].brand.toLowerCase()}/${products[
      index
    ].style.toLowerCase()}/${products[index].material
      .split('-')[1]
      .toLowerCase()}`;

    console.log(`Fetching images for URL: ${url}`);
    console.log(products[index]);

    const result = await axios.get(`http://localhost:8080/api/images/${url}`);

    if (!result.data) {
      console.log('No images found');
      setImages({
        pattern: '',
        color: '',
        brand: '',
        images_name: [{ name: '' }],
      });
    } else {
      setImages(result.data);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (products.length > 0) {
      // Vider les images pendant le chargement
      setImages({
        pattern: '',
        color: '',
        brand: '',
        images_name: [{ name: '' }],
      });

      getImages();
    }
  }, [index, products]);

  return (
    <>
      <Nav
        products={products}
        setProducts={setProducts}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        index={index}
        setIndex={setIndex}
        getImages={getImages}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />
      {products.length > 0 && images.pattern == '' ? 'NO IMAGES' : ''}
      {products.length > 0 && images.pattern !== '' && (
        <div style={{ margin: '0' }}>
          <div className="container">
            {loading ? (
              <p>Chargement des images...</p>
            ) : (
              images.images_name.map((image, index) => (
                <article key={index}>
                  <figure
                    style={
                      overlay.status == true && overlay.image == image.name
                        ? {
                            position: 'relative',
                            width: '90%',
                          }
                        : { width: '90%' }
                    }
                  >
                    <img
                      onClick={() => {
                        setOverlay({
                          status: !overlay.status,
                          image: image.name,
                        });
                      }}
                      style={{ width: '100%', objectFit: 'cover' }}
                      src={`http://images.napali.app/global/${products[
                        index
                      ].brand.toLowerCase()}-products/all/default/hi-res/${
                        image.name
                      }`}
                      //   alt={image.pattern}
                    />
                  </figure>
                  <figure
                    className="overlay"
                    style={
                      overlay.status == true && image.name == overlay.image
                        ? { display: 'flex' }
                        : { display: 'none' }
                    }
                  >
                    <img
                      onClick={() =>
                        setOverlay({ status: !overlay, image: '' })
                      }
                      style={{ width: '500px', height: '650px' }}
                      src={`http://images.napali.app/global/${images.brand}-products/all/default/hi-res/${image.name}`}
                      //   alt={image.pattern}
                    />
                  </figure>
                </article>
              ))
            )}
          </div>
        </div>
      )}
      {isOpen && (
        <Modal
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          index={index}
          setIndex={setIndex}
        />
      )}
    </>
  );
}

export default ImageGrid;
