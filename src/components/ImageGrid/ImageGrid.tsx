import './ImageGrid.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type CardProp = {
  pattern: string;
  color: string;
  brand: string;
  images_name: {
    name: string;
  }[];
};

function ImageGrid() {
  const [images, setImages] = useState<CardProp>({
    pattern: '',
    color: '',
    brand: '',
    images_name: [{ name: '' }],
  });
  const [overlay, setOverlay] = useState({ status: false, image: '' });

  const { brand, pattern, color } = useParams();

  async function getImages() {
    const result = await axios.get(
      `http://localhost:6464/api/images/${brand}/${pattern}/${color}`
    );

    setImages(result.data);
  }

  useEffect(() => {
    getImages();
  }, []);
  return (
    <div style={{ margin: '0' }}>
      <p style={{ marginLeft: '1em', marginTop: '0' }}>
        {images.brand} - {images.pattern} - {images.color}
      </p>
      <div className="container">
        {images.images_name.map((image, index) => (
          <article key={index}>
            <figure
              key={index}
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
                key={`img-${index}`}
                onClick={() => {
                  setOverlay({ status: true, image: image.name });
                }}
                style={{ width: '100%', objectFit: 'cover' }}
                src={`http://images.napali.app/global/${images.brand}-products/all/default/hi-res/${image.name}`}
                //   alt={image.pattern}
              />
            </figure>
            <figure
              className="overlay"
              key={`overlay-${index}`}
              style={
                overlay.status == true && image.name == overlay.image
                  ? { display: 'flex' }
                  : { display: 'none' }
              }
            >
              <img
                key={`overlay-img-${index}`}
                onClick={() => setOverlay({ status: !overlay, image: '' })}
                style={{ width: '500px', height: '650px' }}
                src={`http://images.napali.app/global/${images.brand}-products/all/default/hi-res/${image.name}`}
                //   alt={image.pattern}
              />
            </figure>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ImageGrid;
