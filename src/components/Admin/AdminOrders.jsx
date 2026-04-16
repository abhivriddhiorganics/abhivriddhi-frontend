import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await api.get('/admin/orders');
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const data = await api.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
      }
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.shippingAddress?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Order Fulfilment</h1>
          <p className="text-gray-500 font-medium mt-1">Review and manage customer purchases</p>
        </div>
        
        <div className="relative w-full lg:w-96">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text"
            placeholder="Search by Name or Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-semibold"
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        {/* Mobile View */}
        <div className="block lg:hidden divide-y divide-gray-50">
          {filteredOrders.map(order => (
            <div key={order._id} className="p-4 space-y-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs">
                    {order.shippingAddress?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-black text-gray-800 text-sm leading-tight">
                      {order.shippingAddress?.fullName || 'Anonymous'}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-black mt-0.5 uppercase tracking-wider">
                      #{String(order._id).slice(-8).toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-gray-900 text-sm">₹{order.totalAmount?.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-400 font-bold">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                  ['Delivered', 'Completed'].includes(order.orderStatus) ? 'bg-green-50 text-green-700 border-green-100' : 
                  ['Cancelled', 'Failed'].includes(order.orderStatus) ? 'bg-red-50 text-red-700 border-red-100' :
                  'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {order.orderStatus}
                </div>
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-sm"
                >
                  Manage Order
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 font-black text-xs uppercase tracking-widest border-b border-gray-100">
                <th className="px-10 py-6">Customer & Reference</th>
                <th className="px-10 py-6">Purchase Value</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50/80 transition-all duration-200">
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-700 flex items-center justify-center font-black text-sm shadow-inner">
                        {order.shippingAddress?.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-black text-gray-800 text-lg leading-tight">
                          {order.shippingAddress?.fullName || 'Anonymous'}
                        </div>
                        <div className="text-xs text-emerald-600 font-black mt-1.5 uppercase tracking-wider bg-emerald-50 inline-block px-2 py-0.5 rounded-md">
                          #{String(order._id).slice(-8).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="font-black text-gray-900 text-lg">₹{order.totalAmount?.toLocaleString()}</div>
                    <div className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</div>
                  </td>
                  <td className="px-10 py-7">
                    <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                      ['Delivered', 'Completed'].includes(order.orderStatus) ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      ['Cancelled', 'Failed'].includes(order.orderStatus) ? 'bg-red-50 text-red-700 border-red-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-[40px] border border-gray-100 p-20 text-center">
          <div className="text-6xl mb-6 opacity-20">🛒</div>
          <div className="text-gray-400 font-black text-xl tracking-tight">No orders matched your search</div>
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 backdrop-blur-md bg-black/20">
          <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 pb-4 flex justify-between items-center border-b border-gray-50 bg-gray-50/30">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Order Breakdown</h2>
                <p className="text-emerald-600 font-black text-xs uppercase tracking-widest mt-1">REF: #{String(selectedOrder._id).toUpperCase()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm text-gray-400 font-bold text-xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Purchased Items</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-5 p-4 rounded-3xl bg-gray-50/50 border border-gray-100">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                        <img src={item.image || '/placeholder.png'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-800 tracking-tight text-lg line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-wider">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900 text-lg">₹{item.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Delivery Address</h3>
                  <div className="p-6 rounded-3xl bg-emerald-50/30 border border-emerald-100/50 space-y-4">
                    <p className="font-black text-gray-900">{selectedOrder.shippingAddress?.fullName}</p>
                    <p className="text-sm font-bold text-gray-600">{selectedOrder.shippingAddress?.mobile}</p>
                    <div className="text-sm font-bold text-gray-700 leading-relaxed pt-2 border-t border-emerald-100/30">
                      {selectedOrder.shippingAddress?.addressLine}<br />
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}<br />
                      <span className="text-emerald-700 font-black">PIN: {selectedOrder.shippingAddress?.pincode}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Manage Status</h3>
                  <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 space-y-6">
                    <select 
                      value={selectedOrder.orderStatus}
                      onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                      className="w-full bg-white border-2 border-transparent focus:border-emerald-500 rounded-2xl px-5 py-3 font-bold text-gray-700 shadow-sm outline-none"
                    >
                      {['Payment Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <div className="pt-4 border-t border-gray-200/50 flex justify-between items-end">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Payable</p>
                      <p className="text-3xl font-black text-emerald-600 tracking-tighter">₹{selectedOrder.totalAmount?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setSelectedOrder(null)} className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all">Close Summary</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
