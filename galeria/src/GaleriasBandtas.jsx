import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CssasBanditas.css';

const API_KEY = '49709208-2833751e659e376b29ebc0e7c'; 
const CATEGORIES = {
  Zwierzęta: 'animals',
  Krajobrazy: 'landscape',
  Miasta: 'city',
  Inne: 'random'
};

const PER_PAGE = 12;

const ImageGallery = () => {
  const [category, setCategory] = useState('animals');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchImages = async (selectedCategory, currentPage) => {
    try {
      setError(null);
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: API_KEY,
          q: selectedCategory,
          image_type: 'photo',
          per_page: PER_PAGE,
          page: currentPage,
        },
      });
      setImages(response.data.hits);
      setTotalPages(Math.ceil(response.data.totalHits / PER_PAGE));
    } catch (err) {
      setError('Błąd podczas pobierania danych.');
      console.error(err);
    }
  };

  useEffect(() => {
    if (category) {
      fetchImages(category, page);
    }
  }, [category, page]);

  const handleCategoryClick = (cat) => {
    setCategory(CATEGORIES[cat]);
    setPage(1);
  };

  return (
    <div className="gallery-container">
      <div className="buttons">
        {Object.keys(CATEGORIES).map((cat) => (
          <button key={cat} onClick={() => handleCategoryClick(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      <div className="image-grid">
        {images.map((img) => (
          <a key={img.id} href={img.largeImageURL} target="_blank" rel="noopener noreferrer">
            <img src={img.webformatURL} alt={img.tags} className="thumbnail" />
          </a>
        ))}
      </div>

      {images.length > 0 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Poprzednia</button>
          <span>Strona {page} z {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Następna</button>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
