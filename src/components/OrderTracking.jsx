import { useEffect, useState } from "react"
import { db } from "../firebase/firebase"
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { Link } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Packed from "../assets/packed.png"
import Shipped from "../assets/shipped.png"
import Completed from "../assets/completed.png"

export default function OrderTracking() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const auth = getAuth()
  const user = auth.currentUser

  useEffect(() => {
    if (!user) return

    const userOrdersRef = collection(db, "users", user.uid, "orders")

    const unsubscribe = onSnapshot(
      userOrdersRef,
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setOrders(fetchedOrders)
      },
      (error) => {
        console.error("Error fetching orders:", error)
        setError("Failed to load orders. Please try again.")
      },
    )
    console.log("selectedOrder:", selectedOrder)

    return () => unsubscribe()
  }, [user])

  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelReason.trim()) return

    setLoading(true)

    try {
      const orderRef = doc(db, "users", user.uid, "orders", selectedOrder.id)
      await updateDoc(orderRef, {
        status: "Cancelled",
        cancelReason: cancelReason,
        cancelledAt: new Date(),
      })

      setSelectedOrder(null) // Close the modal after canceling
      setShowCancelModal(false)
      setCancelReason("")
      toast.success("Order has been canceled successfully.", { className: "mt-15" })
    } catch (error) {
      console.error("Error canceling order:", error)
      toast.error("Failed to cancel order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const openCancelModal = () => {
    setShowCancelModal(true)
  }

  const closeCancelModal = () => {
    setShowCancelModal(false)
    setCancelReason("")
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const filteredOrders = orders
    .filter((order) => order.status !== "Cancelled" && order.status !== "Completed") // Exclude cancelled orders
    .filter((order) => {
      if (filter === "all") return true
      return order.products.some((product) => product.gender === filter)
    })

  return (
    <div className="min-h-screen p-20 py-30">
      <ToastContainer autoClose={1000} />
      {/* Header Section */}
      <div className="flex justify-end gap-10 items-center mb-5 mt-5">
        <h2 className="absolute left-30 text-blue-950 font-[Bebas] text-[100px] leading-none">ORDERS:</h2>
        <select
          className="border p-2 cursor-pointer"
          value={filter}
          onChange={handleFilterChange} // Handle filter change
        >
          <option value="all">All</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
        </select>
        <Link to="/profile" className="text-blue-950">
          View order's history &gt;
        </Link>
      </div>

      {/* Orders List */}
      <div className="bg-black/5 shadow-md mt-8 overflow-hidden">
        {error ? (
          <p className="text-center text-red-500 p-5">{error}</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 p-5">No orders found...</p>
        ) : (
          filteredOrders.map((order) => {
            if (!Array.isArray(order.products) || order.products.length === 0) {
              return (
                <div key={order.id} className="p-5 border-b bg-white text-gray-500 text-sm">
                  No items in this order.
                </div>
              )
            }

            return (
              <div
                key={order.id}
                className="p-5 border-b border-black/10 last:border-none bg-white flex items-center gap-4 cursor-pointer hover:bg-gray-200"
                onClick={() => setSelectedOrder(order)}
              >
                <img
                  src={order.products[0].imageUrl || "/placeholder.svg"}
                  alt={order.products[0].name}
                  className="w-20 h-20 object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-lg">Order id: {order.products[0].id}</p>
                  <p className="text-gray-500 text-sm">
                    Gender: {order.products[0].gender} | Size: {order.products[0].size}
                  </p>
                  {order.products.length > 1 && (
                    <p className="text-blue-950 text-sm">This order has +{order.products.length - 1} more items</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">₱{order.total}</p>
                  <p className="text-gray-500 text-sm">Status: {order.status}</p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm flex bg-black/50 justify-center items-center z-50">
          <div className="bg-gray-200 p-8 shadow-lg max-w-200 w-full">
            {/* Close Button */}
            <div className="flex justify-between mb-5">
              <p className="text-blue-950 text-lg font-bold">Order id: {selectedOrder.id}</p>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-600 hover:text-gray-900 text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Order Progress */}
            <div className="flex gap-4 mb-6">
              <div
                className={`flex-1 text-left p-2 border ${
                  selectedOrder?.status === "Packed"
                    ? "bg-blue-950/30 text-blue-950 border-blue-950" // Fully blue for "Packed"
                    : "bg-gray-100 text-gray-600 border-gray-300"
                }`}
              >
                <div className="flex justify-center gap-3 items-center">
                  <img src={Packed || "/placeholder.svg"} alt="" className="w-10 h-10" />
                  <div>
                    <p className="font-semibold">Packed</p>
                    <p className="text-sm">Complete packing</p>
                  </div>
                </div>
              </div>

              {/* Shipped */}
              <div
                className={`flex-1 text-left p-2 border ${
                  selectedOrder?.status === "Shipped"
                    ? "bg-blue-950/30 text-blue-950 border-blue-950" // Fully blue for "Shipped"
                    : "bg-gray-100 text-gray-600 border-gray-300"
                }`}
              >
                <div className="flex justify-center gap-3 items-center">
                  <img src={Shipped || "/placeholder.svg"} alt="" className="w-10 h-10" />
                  <div>
                    <p className="font-semibold">Shipped</p>
                    <p className="text-sm">Out for delivery</p>
                  </div>
                </div>
              </div>

              {/* Completed */}
              <div
                className={`flex-1 text-left  p-2 border ${
                  selectedOrder?.status === "Completed"
                    ? "bg-blue-950/30 text-blue-950 border-blue-950" // Fully blue for "Completed"
                    : "bg-gray-100 text-gray-600 border-gray-300"
                }`}
              >
                <div className="flex justify-center gap-3 items-center">
                  <img src={Completed || "/placeholder.svg"} alt="" className="w-10 h-10" />
                  <div>
                    <p className="font-semibold">Completed</p>
                    <p className="text-sm">Order complete</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="border-t border-black/20 pt-4 mb-4">
              <p className="font-semibold mb-2">Shipping Details</p>
              <p className="text-black/50">
                <p>Name: {selectedOrder.customerName}</p>
              </p>
              <p className="text-black/50">
                <p>Address: {selectedOrder.customerAddress}</p>
              </p>
              <p className="text-black/50">
                <p>Phone: {selectedOrder.customerPhone}</p>
              </p>
            </div>

            {/* Product Details */}
            <div className="border-t border-black/20 pt-4 mb-4">
              <p className="font-semibold">Order Items</p>
              {selectedOrder.products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 mt-2">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-20 h-20 object-cover"
                  />
                  <div className="flex gap-70">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-black/50">
                        Gender: {product.gender} | Size: {product.size}
                      </p>
                      <p className="text-black/50">Quantity: {product.quantity}</p>
                    </div>
                    <div>
                      <p className="font-semibold">
                        {product.unitPrice} x {product.quantity} = {product.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t mb-2 border-black/20 pt-4">
              <p className="font-semibold mb-2">Order Summary</p>
              <div className="flex justify-between text-black/50">
                <span>Product Price</span>
                <span>₱{selectedOrder?.products?.[0]?.totalPrice ?? "N/A"}</span>
              </div>
              <div className="flex justify-between text-black/50">
                <span>Shipping Fee</span>
                <span>₱{selectedOrder.shippingFee}</span>
              </div>
              <div className="flex justify-between font-semibold mt-10">
                <span>Total:</span>
                <span className="border-t">₱{selectedOrder.total}</span>
              </div>
            </div>

            {/* Cancel Order Button */}
            {!["Shipped", "Completed", "Cancelled"].includes(selectedOrder.status) && (
              <button
                onClick={openCancelModal}
                className="w-40 mt-4 cursor-pointer bg-blue-950/20 hover:bg-blue-950/40 text-blue-950 flex items-center justify-center px-4 py-2 border border-blue-950"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cancel Reason Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex bg-black/50 justify-center items-center z-50">
          <div className="bg-white p-6  shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-blue-950">Cancel Order</h3>
              <button onClick={closeCancelModal} className="text-gray-600 hover:text-gray-900 text-xl cursor-pointer">
                ✕
              </button>
            </div>

            <p className="mb-4 text-gray-700">Please provide a reason for cancelling this order:</p>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mb-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-950/50"
              placeholder="Enter your reason for cancellation..."
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={closeCancelModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Back
              </button>
              <button
                onClick={handleCancelOrder}
                className={`px-4 py-2 bg-blue-950 text-white rounded-md hover:bg-blue-900 flex items-center justify-center ${
                  loading || !cancelReason.trim() ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={loading || !cancelReason.trim()}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="32"
                        strokeDashoffset="8"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Confirm Cancellation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

