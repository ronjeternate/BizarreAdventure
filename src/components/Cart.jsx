
import React from 'react';

const items = [

];

function Cart() {
  return (
    <div className="min-h-screen p-20">
      <header className=" mb-5">
        <h1 className="text-blue-950 font-[Bebas] text-[100px] leading-none">WELCOME TO YOUR CART!</h1>
      </header>
      <div className="bg-white shadow-md  overflow-hidden">
        <table className="min-w-full bg-white">
          <thead>
            <tr className='text-gray-400'>
              <th className="px-4 py-2">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Unit Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Total Price</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-4 flex items-center">
                  <img src="https://via.placeholder.com/50" alt={item.name} className="w-12 h-12 mr-4" />
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">Gender: {item.gender}</div>
                    <div className="text-sm text-gray-600">Size: {item.size}</div>
                  </div>
                </td>
                <td className="px-4 py-2 text-center">₱{item.unitPrice}</td>
                <td className="px-4 py-2 text-center">{item.quantity}</td>
                <td className="px-4 py-2 text-center">₱{item.totalPrice}</td>
                <td className="px-4 py-2 text-center text-blue-950 cursor-pointer">Delete</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <button className="bg-blue-950 text-white text-[15px] px-15 py-3">Check out</button>
      </div>
    </div>
  );
}

export default Cart;
