import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND = "https://back-products-xi.vercel.app/api/products";

interface Product {
  _id: string;
  name: string;
  price: string;
}

const MyApp: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [addProductErrors, setAddProductErrors] = useState<string[] | null>(
    null
  );

  const errorHandler = (error: any) => {
    if (error.response) {
      setErrorMessage(error.response.data.message);
    } else {
      setErrorMessage("An error occurred while processing the request.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {
    try {
      await axios.post(BACKEND, newProduct);
      setNewProduct({ name: "", price: "" });
      fetchProducts();
      setAddProductErrors(null);
    } catch (error: any) {
      setAddProductErrors(
        error.response.data.errors.map((e: any) => e.message)
      );
    }
  };

  const editProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
  };

  const updateProduct = async () => {
    try {
      await axios.put(`${BACKEND}/${selectedProduct?._id}`, selectedProduct);
      setIsEditing(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error: any) {
      errorHandler(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(BACKEND);
      setProducts(response.data);
    } catch (error: any) {
      errorHandler(error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${BACKEND}/${id}`);
      fetchProducts();
    } catch (error: any) {
      errorHandler(error);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Products Management</h1>
      {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}

      <div className="flex flex-col mb-10">
        <h2 className="text-lg font-semibold mb-2">Add new product</h2>
        <input
          type="text"
          value={newProduct.name || ""}
          onChange={(e) =>
            setNewProduct((prevProduct) => ({
              ...prevProduct,
              name: e.target.value,
            }))
          }
          className="border border-gray-400 p-2 mb-2"
          placeholder="Product Name"
        />
        <input
          type="text"
          value={newProduct.price || ""}
          onChange={(e) =>
            setNewProduct((prevProduct) => ({
              ...prevProduct,
              price: e.target.value,
            }))
          }
          className="border border-gray-400 p-2 mb-2"
          placeholder="Price"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addProduct}
        >
          Add Product
        </button>
        {addProductErrors && (
          <div className="text-red-500 mt-2">
            {addProductErrors.map((error) => (
              <div key={error}>*{error}</div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Product - Price</h2>
        <ul>
          {products.map((product) => (
            <li key={product._id} className="mb-2">
              Product: <b>{product.name}</b> - Price: <b>{product.price}</b>
              <button
                className="ml-2 text-blue-500 border rounded px-2 hover:bg-blue-500 hover:text-white"
                onClick={() => editProduct(product)}
              >
                Edit
              </button>
              <button
                className="ml-2 text-red-500 hover:underline"
                onClick={() => deleteProduct(product._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isEditing && (
        <div className="mb-4 flex flex-col gap-1">
          <h2 className="text-lg font-semibold mb-2 mt-7">Editing Product</h2>
          <input
            type="text"
            value={selectedProduct?.name || ""}
            onChange={(e) =>
              setSelectedProduct((prevProduct) => ({
                ...prevProduct!,
                name: e.target.value,
              }))
            }
            className="border border-gray-400 p-1 mb-1"
            placeholder="Product Name"
          />
          <input
            type="text"
            value={selectedProduct?.price || ""}
            onChange={(e) =>
              setSelectedProduct((prevProduct) => ({
                ...prevProduct!,
                price: e.target.value,
              }))
            }
            className="border border-gray-400 p-1 mb-1"
            placeholder="Price"
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded w-full"
            onClick={updateProduct}
          >
            Save
          </button>
          <button
            className="bg-gray-500 text-white px-3 py-1 rounded w-full"
            onClick={() => {
              setIsEditing(false);
              setSelectedProduct(null);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default MyApp;
