import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase"; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore";
import backgroundImage from "../assets/Background.png";
import poloSport from "../assets/polo.png";
import Enchante from "../assets/enchante.png";
import Antheia from "../assets/antheia.png";
import Slick from "../assets/slick.png";
import bestSeller from "../assets/bestSeller.png";
import Modal from "./Modal";
import BuyPage from "./BuyPage";


const Perfume = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [size, setSize] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on category & size
  const filteredProducts = products.filter(product => {
    const productGender = product.gender || "All";
    const productSize = product.volume || "All";
    return (category === 'All' || category === productGender) && 
           (size === 'All' || size === productSize);
  });

  // Handle product click to show modal with product details
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      {/* Best Seller Section */}
      <div
        id="best-seller"
        className="flex items-center justify-center pt-20 pb-20 min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div>
          <div className="flex justify-center gap-150 pt-0">
            <div>
              <h1 className="text-white font-[Bebas] text-[100px] leading-none">
                Best <span className="text-blue-950 font-[Bebas] text-[100px] leading-none">Seller</span>
              </h1>
            </div>
            <div className="pt-15">
              <a href="/perfume" className="tracking-[.2em] text-white text-[15px] font-[Aboreto] opacity-0">
                View Perfumes {">"}
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img src={poloSport} alt="Polo Sport" className="w-70" />
            <img src={Enchante} alt="Enchante" className="w-70" />
            <img src={bestSeller} alt="BestSeller" className="w-70" />
            <img src={Antheia} alt="Antheia" className="w-70" />
            <img src={Slick} alt="Slick" className="w-70" />
          </div>
        </div>
      </div>

      {/* Product Filter */}
      <div id="products" className="flex p-4 mt-20 ml-10">
        {/* Filter Sidebar */}
        <div className="bg-white p-6 border-r-1 w-80 border-black/40">
          <h1 className="text-xl font-bold mb-10">By Category</h1>

          {/* Category Filter */}
          <h2 className="text-lg font-semibold">Gender</h2>
          <div className="mt-2">
            {["Men", "Women", "All"].map((cat) => (
              <label key={cat} className="flex items-center mr-4">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={category === cat}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mr-2"
                />
                {cat}
              </label>
            ))}
          </div>

          {/* Size Filter */}
          <h2 className="text-lg font-semibold mt-6">Size</h2>
          <div className="mt-2">
            {["30ml", "65ml", "All"].map(volume => (
              <label key={volume} className="flex items-center mr-4">
                <input
                  type="radio"
                  name="size"
                  value={volume}
                  checked={size === volume}
                  onChange={() => setSize(volume)}
                  className="mr-2"
                />
                {volume}
              </label>
            ))}
          </div>
        </div>

        {/* Product Display */}
        <div className="bg-white p-4 w-full">
          {loading ? (
            <p className="text-center">Kindly wait...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white border-1 border-black/40 cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  {console.log (product.imageUrl)}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-70 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-bold mt-2">{product.name}</h2>
                    <p className="text-sm text-gray-600">{product.volume}</p>
                    <p className="text-[20px] font-semibold text-blue-950">{product.price}</p>
                    <p className="text-sm text-gray-500">24H Last Longer</p>
                    <p className="text-sm text-gray-500">Long lasting</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for BuyPage */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        {selectedProduct && <BuyPage  isOpen={isModalOpen} onClose={handleModalClose} product={selectedProduct} />}
      
      </Modal>
    </div>
  );
};

export default Perfume;
