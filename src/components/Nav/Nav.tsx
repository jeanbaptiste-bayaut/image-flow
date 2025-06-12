import axios from 'axios';

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

function Nav({
  products,
  setProducts,
  index,
  setIndex,
  getImages,
  selectedBrand,
  setSelectedBrand,
  setIsOpen,
}: {
  products: ProductsProp[];
  setProducts: React.Dispatch<React.SetStateAction<ProductsProp[]>>;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  getImages: () => Promise<void>;
  selectedBrand: string;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}) {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedBrand === 'default') return;

    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/products/${selectedBrand}`
    );

    const productListWithFormatedDesc = [];

    if (result.data.length > 0) {
      for (const product of result.data) {
        const formatedCharacteristics = formatDesc(product.characteristics);
        const formatedComposition = formatDesc(product.composition);

        productListWithFormatedDesc.push({
          ...product,
          characteristics: formatedCharacteristics,
          composition: formatedComposition,
        });
      }
    }

    setProducts(productListWithFormatedDesc);

    getImages();
  }

  function formatDesc(desc: string) {
    desc = `${desc}`;

    const html = desc
      .replace(/__([^:]+):__/g, '<strong><u>$1:</u></strong>')
      .replace(/([^:\n]) ([A-Z][a-z]+:)/g, '$1<br />$2');

    html.replace(/__([^:]+):__/g, '<strong><u>$1:</u></strong>');

    const htmlOutput = '<pre>' + html + '</pre>';

    return htmlOutput;
  }

  async function updateStatus() {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/products`,
        {
          material: products[index].material,
          noimages: '',
          comment: '',
        }
      );

      if (response.data) {
        console.log('Product updated successfully:', products[index].material);
        setIndex((prev) => (prev < products.length - 1 ? prev + 1 : prev));
        getImages();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }

  return (
    <>
      <form className="nav-form" onSubmit={(e) => handleSubmit(e)}>
        <select
          className="nav-select"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="default">Select a brand</option>
          <option value="quiksilver">Quiksilver</option>
          <option value="billabong">Billabong</option>
          <option value="dcshoes">DC Shoes</option>
          <option value="roxy">Roxy</option>
          <option value="element">Element</option>
          <option value="rvca">RVCA</option>
        </select>
        <button className="nav-button" type="submit">
          Submit
        </button>
      </form>
      {selectedBrand && products.length > 0 && (
        <>
          <h2>
            Products for {selectedBrand} - {index + 1} / {products.length}
          </h2>
          <h3>
            {products[index].material} - {products[index].name}
          </h3>
          <small style={{ fontWeight: 'bold' }}>Characteristics</small>
          {products[index].characteristics && (
            <span
              dangerouslySetInnerHTML={{
                __html: products[index].characteristics,
              }}
            />
          )}
          <small style={{ fontWeight: 'bold' }}>Composition</small>
          {products[index].composition !== 'undefined' ? (
            <span
              dangerouslySetInnerHTML={{
                __html: products[index].composition,
              }}
            />
          ) : null}
          {/* <button
            onClick={() => {
              setIndex((prev) => (prev > 0 ? prev - 1 : 0));
              getImages();
            }}
            disabled={index === 0}
          >
            Prev
          </button> */}
          <button
            onClick={() => {
              updateStatus();
            }}
            disabled={index === products.length - 1}
          >
            Next
          </button>
          <button onClick={() => setIsOpen(true)}>Add Comment</button>
        </>
      )}
    </>
  );
}

export default Nav;
