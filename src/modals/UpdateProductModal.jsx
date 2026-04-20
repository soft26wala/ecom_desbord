import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleUpdateProductModal } from "../store/slices/extraSlice";
import { LoaderCircle } from "lucide-react";
import { updateProduct } from "../store/slices/productsSlice";

const UpdateProductModal = ({ selectedProduct }) => {
  const { loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    mrp: "",
  });

  // ✅ old images
  const [existingImages, setExistingImages] = useState([]);

  // ✅ new images
  const [newImages, setNewImages] = useState([]);

  const categoryOptions = [
    "Kidney",
    "Liver",
    "Sugar Management",
    "Weight Loss",
    "Shilajit",
    "Piliya",
    "Stone",
    "immunity",
    "Oils",
  ];

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || "",
        category: selectedProduct.category || "",
        stock: selectedProduct.stock || "",
        mrp: selectedProduct.mrp || "",
      });

      // 🔥 set old images
      setExistingImages(selectedProduct.images || []);
    }
  }, [selectedProduct]);

  // ❌ remove old image
  const handleRemoveOldImage = (img) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
  };

  // ❌ remove new image
  const handleRemoveNewImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    data.append("mrp", formData.mrp);

    // ✅ existing images (OBJECT)
    data.append("existingImages", JSON.stringify(existingImages));

    // ✅ new images
    newImages.forEach((img) => {
      data.append("newImages", img);
    });

    dispatch(updateProduct(data, selectedProduct.id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={() => dispatch(toggleUpdateProductModal())}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          Update Product
        </h2>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          {/* name */}
          <input
            type="text"
            placeholder="Title"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="border px-4 py-2 rounded"
          />

          {/* category */}
          <select
            className="w-full border p-2 rounded-lg"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            {categoryOptions.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* price */}
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="border px-4 py-2 rounded"
          />

          {/* mrp */}
          <input
            type="number"
            placeholder="MRP"
            value={formData.mrp}
            onChange={(e) =>
              setFormData({ ...formData, mrp: e.target.value })
            }
            className="border px-4 py-2 rounded"
          />

          {/* stock */}
          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            className="border px-4 py-2 rounded"
          />

          {/* description */}
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="border px-4 py-2 rounded col-span-2"
            rows={4}
          />

          {/* 🔥 OLD IMAGES */}
          <div className="col-span-2">
            <p className="font-semibold mb-2">Existing Images</p>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt="product"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOldImage(img)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 🔥 NEW IMAGES */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewImages(Array.from(e.target.files))}
            className="border px-4 py-2 rounded col-span-2"
          />

          {/* preview new */}
          <div className="col-span-2 flex flex-wrap gap-3">
            {newImages.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* submit */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded col-span-2"
          >
            {loading ? (
              <>
                <LoaderCircle className="w-6 h-6 animate-spin" />
                Updating
              </>
            ) : (
              "Update Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;