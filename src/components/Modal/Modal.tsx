import './Modal.css';
import axios from 'axios';
import { useState } from 'react';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  index: number;
  setIndex: (index: number | ((prevIndex: number) => number)) => void;
};

function Modal({ setIsOpen, index, setIndex }: ModalProps) {
  const handleClose = () => setIsOpen(false);
  const [formData, setFormData] = useState({
    material: '',
    noimages: false,
    comment: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/products`,
        {
          material: formData.material,
          noimages: formData.noimages,
          comment: formData.comment,
        }
      );

      if (response.data) {
        console.log('Product updated successfully:', response.data);
        handleClose();
        setIndex(index + 1); // Increment index to refresh the product list
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={handleClose}>
          &times;
        </span>
        <h2>Add a comment</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <textarea
            placeholder="Enter your text here..."
            rows={4}
            cols={50}
            className="modal-textarea"
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
          ></textarea>
          <label>
            no images
            <input
              type="checkbox"
              checked={formData.noimages}
              onChange={(e) =>
                setFormData({ ...formData, noimages: e.target.checked })
              }
            />
          </label>
          <button type="submit" className="modal-submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
export default Modal;
