import React from 'react';
import { useShoppingCart } from "use-shopping-cart";
import CartItem from "./CartItem";
import CheckoutButton from "./CheckoutButton";

export default function ShoppingCart() {
  const { shouldDisplayCart, cartCount, cartDetails } = useShoppingCart();

    const totalPrice = Object.values(cartDetails ?? {}).reduce(
    (total, item) => total + item.price * item.quantity,
    0
    );

    const totalQuantity = Object.values(cartDetails ?? {}).reduce(
    (total, item) => total + item.quantity,
    0
    );

  return (
    <div
      className={`bg-white flex flex-col absolute right-3 md:right-9 top-14 w-80 py-4 px-4 shadow-[0_5px_15px_0_rgba(0,0,0,.15)] rounded-md transition-opacity duration-500 ${
        shouldDisplayCart ? "opacity-100" : "opacity-0"
      }`}
    >
      {cartCount && cartCount > 0 ? (
        <>
          {Object.values(cartDetails ?? {}).map((entry) => (
            <CartItem key={entry.id} item={entry} />
          ))}
          <hr className="my-4 border-gray-300" />
          <div className="text-right font-bold text-xl md:text-2xl">Total: ￥{totalPrice}({totalQuantity})</div>
          <CheckoutButton />
        </>
      ) : (
        <div className="p-5">You have no items in your cart</div>
      )}
    </div>
  );
}
