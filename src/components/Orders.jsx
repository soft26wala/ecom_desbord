import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import {
  deleteOrder,
  fetchAllOrders,
  updateOrderStatus,
} from "../store/slices/orderSlice";
import "./dashboard-components/print.css"; // Import the CSS for print styling

const Orders = () => {
  const statusArray = [
    "All",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  const [selectedStatus, setSelectedStatus] = useState({});
  const [filterByStaus, setFilterByStaus] = useState("All");
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [selectedOrderForBill, setSelectedOrderForBill] = useState(null); // Bill popup ke liye

  useEffect(() => {
    dispatch(fetchAllOrders());

    const interval = setInterval(() => {
      dispatch(fetchAllOrders());
    }, 5000000); // 5 sec refresh

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatus(newStatus);
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const filteredOrders =
    filterByStaus === "All"
      ? orders
      : orders?.filter((order) => order.order_status === filterByStaus);


  const confirmDelete = () => {
    dispatch(deleteOrder(deleteConfirm.id));
    setDeleteConfirm({ open: false, id: null });
  };


  console.log("filteredOrders :", filteredOrders)

  if (loading) return <p className="p-10">Loading Orders...</p>;

  return (
    <>
      <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
        {/* HEADER */}
        <div className="flex-1 md:p-6">
          <Header />
          <h1 className="text-2xl font-bold">All Orders</h1>
          <p className="text-sm text-gray-600 mb-6">Manage all your orders.</p>
        </div>

        {/* CONTENT */}

        {loading ? (
          <div className="w-40 h-40 mx-auto border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {filteredOrders.length === 0 ? (
              <h3 className="text-2xl p-6 font-bold">No orders found.</h3>
            ) : (
              <>
                <div className="flex justify-between items-center p-6">
                  <select
                    className="p-2 border rounded shadow-sm"
                    onChange={(e) => setFilterByStaus(e.target.value)}
                  >
                    {statusArray.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>


                {filteredOrders.map((order) => {
                  return (
                    <div
                      key={order.id}
                      className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-all"
                    >
                      <div className="flex justify-between items-center">   
                        <div>
                          <p>
                            <strong>Order ID:</strong> {order.id}
                          </p>

                          {/* 🔥 ADD THIS */}
                          <p>
                            <strong>Payment:</strong>{" "}
                            {order.paid_at === null ? (
                              <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                                COD ORDER
                              </span>
                            ) : (
                              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                                ONLINE PAID
                              </span>
                            )}
                          </p>

                          <p>
                            <strong>Status:</strong> {order.order_status}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                          <p>
                            <strong>Order ID:</strong> {order.id}
                          </p>
                          <p>
                            <strong>Status:</strong> {order.order_status}
                          </p>
                          <p>
                            <strong>Placed At:</strong>{" "}
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                          <p>
                            <strong>Total Amount:</strong> ₹ {order.total_price}
                          </p>
                        </div>

                        <div>
                          <select
                            value={
                              selectedStatus[order.id] || order.order_status
                            }
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className="border p-2 rounded mb-2"
                          >
                            {statusArray.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => setSelectedOrderForBill(order)}
                            className="ml-3 bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1"
                          >
                            Bill
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({ open: true, id: order.id })
                            }
                            className="ml-3 bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold text-lg mb-1">
                          Shipping Info
                        </h4>
                        <p>
                          <strong>Name:</strong>{" "}
                          {order.shipping_info?.full_name || "N/A"}
                        </p>
                        <p>
                          <strong>Phone:</strong> {order.shipping_info?.phone || "N/A"}
                        </p>
                        <p>
                          <strong>Address:</strong>{" "}
                          {order.shipping_info?.address || "N/A"},{" "}
                          {order.shipping_info?.city} ,{" "}
                          {order.shipping_info?.state},{" "}
                          {order.shipping_info?.pincode}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold text-lg mb-2">
                          Ordered Items
                        </h4>
                        {Array.isArray(order.order_items) && order.order_items.length > 0 ? (
                          order.order_items.map((item) => (


                            // return (
                            <div
                              key={item.order_item_id}
                              className="flex items-center gap-4 mb-2 border-b pb-2"
                            >
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-16 h-16 object-cover cursor-pointer"
                                  onClick={() => setPreviewImage(item.image)}
                                />
                              )}
                              <div>
                                <p className="font-semibold">{item.title}</p>
                                <p>
                                  <strong>Qty:</strong> {item.quantity} |{" "}
                                  <strong>Price:</strong>₹ {item.price} |
                                  <strong>Total Price:</strong> ₹
                                  {item.quantity * item.price}
                                </p>
                              </div>
                            </div>
                            // );


                          ))
                        ) : (
                          <p>No items found</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* IMAGE PREVIEW */}
            {previewImage && (
              <div
                className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                onClick={() => setPreviewImage(null)}
              >
                <img
                  src={previewImage}
                  alt="preview"
                  className="max-w-[90%] max-h-[90%] rounded shadow-xl"
                />
              </div>
            )}

            {/* DELETE ORDER CONFIRMATION MODAL */}
            {deleteConfirm.open && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-4">
                    Are you sure you want to delete this order?
                  </h3>
                  <div className="flex justify-self-center gap-4">
                    <button
                      onClick={confirmDelete}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({ open: false, id: null })
                      }
                      className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {selectedOrderForBill && (
        <>


          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden">
              {/* Bill Header */}
              <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">Shipping Label / Invoice</h3>
                <button onClick={() => setSelectedOrderForBill(null)} className="text-gray-600 hover:text-black">✖</button>
              </div>

              {/* Bill Content (Printable Area) */}
              <div id="printable-bill" className="p-6 border-2 border-dashed border-gray-300 m-4 rounded">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-black uppercase">Tax Invoice</h2>
                  <div className="text-right text-xs">
                    <p>Order ID: {selectedOrderForBill.id}</p>
                    <p>Date: {new Date(selectedOrderForBill.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <hr className="my-2" />

                <div className="mb-4">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Shipping Address:</p>
                  <p className="font-bold text-md">{selectedOrderForBill.shipping_info?.full_name}</p>
                  <p className="text-sm">{selectedOrderForBill.shipping_info?.address}</p>
                  <p className="text-sm">{selectedOrderForBill.shipping_info?.city}, {selectedOrderForBill.shipping_info?.state} - {selectedOrderForBill.shipping_info?.pincode}</p>
                  <p className="text-sm font-semibold">Phone: {selectedOrderForBill.shipping_info?.phone}</p>
                </div>

                <table className="w-full text-left text-sm mb-4">
                  <thead>
                    <tr className="border-b">
                      <th className="py-1">Item</th>
                      <th className="py-1 text-center">Qty</th>
                      <th className="py-1 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrderForBill.order_items.map((item) => (
                      <tr key={item.order_item_id} className="border-b border-gray-100">
                        <td className="py-2 text-xs">{item.title}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">₹{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="text-right">
                  <p className="text-lg font-bold">Total: ₹{selectedOrderForBill.total_price}</p>
                </div>

                <div className="mt-4 text-center border-t pt-2">
                  <p className="text-[10px] text-gray-400">Thank you for shopping with us!</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700"
                >
                  Print Bill
                </button>
                <button
                  onClick={() => setSelectedOrderForBill(null)}
                  className="flex-1 bg-gray-300 py-2 rounded font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>

      )}

    </>


  );
};

export default Orders;
