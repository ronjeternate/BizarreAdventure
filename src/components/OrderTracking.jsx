import { Link } from "react-router-dom";

const orders = [
];

export default function OrderTracking() {
  return (
    <div className="min-h-screen p-20">
      <div className="flex justify-end gap-10 items-center mb-5 mt-5 ">
      <h2 className="absolute left-30 text-blue-950 font-[Bebas] text-[100px] leading-none">ORDERS:</h2>
        <select className="border p-2 ">
          <option value="all">All</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="30ml">30ml</option>
          <option value="65ml">65ml</option>
        </select>
        <Link to="/history" className="text-blue-950 hover:underline">
          View order's history &gt;
        </Link>
      </div>
      <div className="bg-white shadow-md  overflow-hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center p-4 border-b last:border-none"
          >
            <img src={order.image} alt={order.name} className="w-20 h-20 " />
            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-lg">{order.name}</h3>
              <p className="text-gray-600 text-sm">
                Gender: {order.gender} | Size: {order.size}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-[25px]">{order.quantity} x ₱{order.price}</p>
              <p className="text-gray-500">= ₱{order.quantity * order.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
