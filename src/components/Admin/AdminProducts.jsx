import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, RefreshCcw } from 'lucide-react';
import api from '../../services/api';
import ProductModal from './ProductModal';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const fetchProductsList = async () => {
    try {
      setLoading(true);
      // Use the public products endpoint for reliability as it is confirmed working
      const data = await api.get('/products');
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const data = await api.delete(`/admin/products/${id}`);
      if (data.success) {
        setProducts(products.filter(p => (p._id || p.id) !== id));
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleToggleStock = async (product) => {
    try {
      const updatedStatus = !product.inStock;
      const data = await api.put(`/admin/products/${product._id || product.id}/stock`, { inStock: updatedStatus });
      if (data.success) {
        setProducts(products.map(p => (p._id || p.id) === (product._id || product.id) ? { ...p, inStock: updatedStatus } : p));
      }
    } catch (err) {
      alert('Failed to update stock status');
    }
  };

  const filteredProducts = products.filter(p => {
    const name = p.name || '';
    const category = p.category || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  if (loading && products.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Product Inventory</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your shop items and stock levels</p>
        </div>
        <button 
          onClick={() => { setCurrentProduct(null); setShowModal(true); }}
          className="px-6 py-4 bg-slate-900 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add New Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm outline-none focus:ring-4 focus:ring-slate-800/5 transition-all font-semibold"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-12 pr-10 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm outline-none focus:ring-4 focus:ring-slate-800/5 transition-all font-bold appearance-none"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        {/* Mobile View */}
        <div className="block lg:hidden divide-y divide-slate-100">
           {filteredProducts.map(product => (
             <div key={product._id || product.id} className="p-4 space-y-4">
                <div className="flex gap-4">
                   <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                      <img 
                        src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${import.meta.env.VITE_BACKEND_URL || ''}/${product.imageUrl}`) : '/placeholder.png'} 
                        alt="" 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                      />
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                         <div className="font-bold text-slate-900 truncate pr-2">{product.name}</div>
                         <div className="font-black text-slate-900">₹{product.price}</div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-1">{product.category}</div>
                      <div className="mt-2">
                        <button 
                          onClick={() => handleToggleStock(product)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            product.inStock ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-slate-400'}`} />
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </div>
                   </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                   <button 
                      onClick={() => { setCurrentProduct(product); setShowModal(true); }}
                      className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                   >
                      Edit
                   </button>
                   <button 
                      onClick={() => handleDelete(product._id || product.id)}
                      className="py-2 px-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-bold"
                   >
                      Delete
                   </button>
                </div>
             </div>
           ))}
           {filteredProducts.length === 0 && (
             <div className="p-12 text-center text-slate-500 text-sm italic">
                No products found matching your current filters.
             </div>
           )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5">Product Details</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Description</th>
                <th className="px-8 py-5">Stock Status</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(product => (
                <tr key={product._id || product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                        <img 
                          src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${import.meta.env.VITE_BACKEND_URL || ''}/${product.imageUrl}`) : '/placeholder.png'} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.target.src = '/placeholder.png'; }}
                        />
                      </div>
                      <div className="font-bold text-slate-800">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm">{product.category}</td>
                  <td className="px-8 py-5">
                    <div className="text-xs text-slate-500 max-w-[200px] truncate" title={product.shortDescription || product.description}>
                      {product.shortDescription || '—'}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => handleToggleStock(product)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        product.inStock ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-slate-400'}`} />
                      {product.inStock ? 'Active' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-8 py-5 font-bold">₹{product.price}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setCurrentProduct(product); setShowModal(true); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800">Edit</button>
                      <button onClick={() => handleDelete(product._id || product.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-slate-400 text-lg font-bold">
                    No products found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ProductModal 
          product={currentProduct} 
          onClose={() => setShowModal(false)} 
          onSuccess={() => { setShowModal(false); fetchProductsList(); }} 
        />
      )}
    </div>
  );
};

export default AdminProducts;
