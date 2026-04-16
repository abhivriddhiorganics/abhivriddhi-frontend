import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { calculateShipping } from '../utils/pricing';

export default function CartPage() {
  const { cartItems, updateQty, removeFromCart } = useCart();
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.unitPrice || item.price) * item.qty, 0);
  const shippingFee = calculateShipping(totalPrice);
  const finalTotal = totalPrice + shippingFee;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Cart</h1>
            <p className="text-sm text-slate-600">Review items before checkout.</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-full bg-[#4a7c23] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#3d6a1c]"
          >
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-10">
            <div className="text-center">
              <p className="text-lg font-medium text-slate-700">Your cart is empty.</p>
              <p className="mt-3 text-sm text-slate-500">
                Add products on the landing page or products page to start your order.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">Demo Cart Preview</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="h-16 w-16 rounded-2xl bg-slate-200" />
                  <div>
                    <p className="font-semibold text-slate-900">Jowar Atta</p>
                    <p className="text-sm text-slate-600">Qty 2 · ₹275 each</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="h-16 w-16 rounded-2xl bg-slate-200" />
                  <div>
                    <p className="font-semibold text-slate-900">Ragi Atta</p>
                    <p className="text-sm text-slate-600">Qty 1 · ₹275 each</p>
                  </div>
                </div>
              </div>
              <p className="mt-5 text-sm text-slate-500">
                This is a demo layout for the cart page. Add real products to see your cart populate here.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <img src={(item.img || item.image) ? ((item.img || item.image).startsWith('http') ? (item.img || item.image) : `${import.meta.env.VITE_BACKEND_URL || ''}/${item.img || item.image}`) : ''} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" onError={e => { e.target.src = '/placeholder.png'; }} />
                      <div>
                        <h2 className="font-semibold text-slate-900">{item.name}</h2>
                        <p className="text-sm text-slate-600">₹{item.unitPrice || item.price} /- {item.weight ? `(${item.weight})` : ''}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQty(item.id, item.weight, item.qty - 1)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700"
                      >
                        -
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-medium">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.weight, item.qty + 1)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id, item.weight)}
                        className="rounded-full px-3 py-2 text-sm font-medium text-red-600 transition hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}/-</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? "font-bold text-green-600" : ""}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}/-`}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-[10px] text-slate-500 italic">
                    Add ₹{(999 - totalPrice).toLocaleString('en-IN')} more for FREE shipping!
                  </p>
                )}
              </div>
              <div className="mt-6 flex items-center justify-between text-lg font-semibold text-slate-900 border-t border-slate-200 pt-4">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}/-</span>
              </div>
              <Link
                to="/checkout"
                className="mt-6 flex w-full justify-center rounded-full bg-[#4a7c23] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3d6a1c]"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
