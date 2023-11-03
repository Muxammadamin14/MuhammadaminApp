"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Page = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const productsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://64dcf61be64a8525a0f76c4d.mockapi.io/api/v1/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (minPrice === '' || product.price >= minPrice) &&
    (maxPrice === '' || product.price <= maxPrice)
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleBack = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold animate-pulse mb-4">No products found</h1>
        <button onClick={handleBack} className="mt-4 bg-gray-200 px-4 py-2 rounded">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Products on this site: Search, Filter, Map, and Pagination</h1>
      <div className="mb-4">
        <label htmlFor="search">Search:</label>
        <input
          type="text"
          id="search"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="minPrice">Min Price:</label>
        <input
          type="number"
          id="minPrice"
          value={minPrice}
          onChange={handleMinPriceChange}
          className="border p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="maxPrice">Max Price:</label>
        <input
          type="number"
          id="maxPrice"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          className="border p-2"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {currentProducts.map((product) => (
          <div key={product.id} className="border p-4">
            <img src={product.image} alt={product.name} className="mb-2" />
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-gray-500">{product.description}</p>
            <div className="flex justify-between mt-4">
              <span className="text-green-500 line-through">${product.priceSale}</span>
              <span className="text-gray-500 font-bold">${product.price}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`mx-1 px-2 py-1 rounded ${
              pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Page;
