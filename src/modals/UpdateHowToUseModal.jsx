import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleUpdateHowToUseModal } from "../store/slices/extraSlice";
import { LoaderCircle } from "lucide-react";
import { updateHowToUse } from "../store/slices/productsSlice";

const UpdateHowToUseModal = ({ selectedProduct }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.product);


  const [steps, setSteps] = useState([
    { title: "", description: "", img: "" },
  ]);

  useEffect(() => {
    if (selectedProduct?.how_to_use) {
      setSteps(selectedProduct.how_to_use);
    }
  }, [selectedProduct]);

  // ➕ add step
  const addStep = () => {
    setSteps([...steps, { title: "", description: "", img: "" }]);
  };

  // ❌ remove step
  const removeStep = (index) => {
    const updated = [...steps];
    updated.splice(index, 1);
    setSteps(updated);
  };

  // ✏️ update step
  const handleChange = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  // 🚀 submit
const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();

  let imgIndex = 0;

  const cleanSteps = steps.map((step) => {
    if (step.img instanceof File) {
      // 🔥 file append karo
      formData.append("stepImages", step.img);

      // 🔥 placeholder set karo
      return {
        ...step,
        img: `__file_${imgIndex++}`,
      };
    }
    return step;
  });

  formData.append("steps", JSON.stringify(cleanSteps));

  dispatch(updateHowToUse(formData, selectedProduct.id));
};

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">

        {/* Close */}
        <button
          onClick={() => dispatch(toggleUpdateHowToUseModal())}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          Update How To Use
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {steps.map((step, index) => (
            <div key={index} className="border p-4 rounded-lg relative">

              {/* remove */}
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="absolute top-2 right-2 text-red-500"
              >
                ✕
              </button>

              <h3 className="font-semibold mb-2">
                Step {index + 1}
              </h3>

              {/* title */}
              <input
                type="text"
                placeholder="Step Title"
                value={step.title}
                onChange={(e) =>
                  handleChange(index, "title", e.target.value)
                }
                className="w-full border px-3 py-2 rounded mb-2"
              />

              {/* description */}
              <textarea
                placeholder="Description"
                value={step.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
                className="w-full border px-3 py-2 rounded mb-2"
              />

              {/* image url */}
              {/* image upload */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleChange(index, "img", e.target.files[0])
                }
                className="w-full border px-3 py-2 rounded"
              />



              {/* preview */}
              {step.img && (
                <img
                  src={
                    typeof step.img === "string"
                      ? step.img // old image (URL)
                      : URL.createObjectURL(step.img) // new file
                  }
                  alt="preview"
                  className="mt-2 w-24 h-24 object-cover rounded"
                />
              )}
            </div>
          ))}

          {/* add step */}
          <button
            type="button"
            onClick={addStep}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            ➕ Add Step
          </button>

          {/* submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" />
                Updating...
              </>
            ) : (
              "Update How To Use"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateHowToUseModal;