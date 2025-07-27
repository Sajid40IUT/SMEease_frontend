import React, { useState } from "react";
import { DashboardLayout } from "./Dashboard/DashboardLayout";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { products as productList, Product, Supplier } from "../lib/products";
import { PlusCircle, Edit, Trash2, X } from "lucide-react";

const emptyForm = {
  upc: "",
  name: "",
  stock: "",
  sold: "",
  minStock: "",
  supplier: { name: "", contact: "", email: "" },
};

export const InventoryManagement = () => {
  const [products, setProducts] = useState<Product[]>(productList);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState<{ index: number | null; open: boolean }>({ index: null, open: false });
  const [search, setSearch] = useState("");

  // Open modal for add or edit
  const openModal = (index: number | null = null) => {
    setError("");
    setEditIndex(index);
    if (index === null) {
      setForm(emptyForm);
    } else {
      const p = products[index];
      setForm({
        upc: p.upc,
        name: p.name,
        stock: p.stock.toString(),
        sold: p.sold.toString(),
        minStock: p.minStock.toString(),
        supplier: { ...p.supplier },
      });
    }
    setShowModal(true);
  };

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("supplier.")) {
      setForm({ ...form, supplier: { ...form.supplier, [name.split(".")[1]]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Add or update product
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.upc || !form.name || !form.stock || !form.sold || !form.minStock || !form.supplier.name || !form.supplier.contact || !form.supplier.email) {
      setError("All fields are required.");
      return;
    }
    const newProduct: Product = {
      upc: form.upc,
      name: form.name,
      stock: parseInt(form.stock, 10),
      sold: parseInt(form.sold, 10),
      minStock: parseInt(form.minStock, 10),
      supplier: { ...form.supplier },
    };
    if (editIndex === null) {
      // Add
      if (products.some((p) => p.upc === newProduct.upc)) {
        setError("UPC must be unique.");
        return;
      }
      setProducts((prev) => [...prev, newProduct]);
    } else {
      // Edit
      setProducts((prev) => prev.map((p, i) => (i === editIndex ? newProduct : p)));
    }
    setShowModal(false);
    setForm(emptyForm);
    setEditIndex(null);
  };

  // Delete product
  const handleDelete = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
    setShowDelete({ index: null, open: false });
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.upc.toLowerCase().includes(q) ||
      p.supplier.name.toLowerCase().includes(q) ||
      p.supplier.contact.toLowerCase().includes(q) ||
      p.supplier.email.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout pageTitle="Inventory Management">
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 opacity-100" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg z-10 animate-fadeInScale">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-2 text-center">{editIndex === null ? "Add New Product" : "Edit Product"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">UPC</label>
                  <input name="upc" value={form.upc} onChange={handleChange} placeholder="UPC" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" disabled={editIndex !== null} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Sold</label>
                  <input name="sold" value={form.sold} onChange={handleChange} placeholder="Sold" type="number" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Min Stock</label>
                  <input name="minStock" value={form.minStock} onChange={handleChange} placeholder="Min Stock" type="number" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Supplier Name</label>
                  <input name="supplier.name" value={form.supplier.name} onChange={handleChange} placeholder="Supplier Name" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Supplier Contact</label>
                  <input name="supplier.contact" value={form.supplier.contact} onChange={handleChange} placeholder="Contact" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Supplier Email</label>
                  <input name="supplier.email" value={form.supplier.email} onChange={handleChange} placeholder="Email" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
                </div>
              </div>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <Button type="submit" className="bg-[#335CFF] text-white w-full mt-2 py-2 text-base rounded-lg shadow hover:bg-[#2546b8] transition">{editIndex === null ? "Add Product" : "Update Product"}</Button>
            </form>
          </div>
          <style>{`
            @keyframes fadeInScale {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-fadeInScale {
              animation: fadeInScale 0.25s cubic-bezier(0.4,0,0.2,1);
            }
          `}</style>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDelete.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 opacity-100" onClick={() => setShowDelete({ index: null, open: false })} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm z-10 animate-fadeInScale">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setShowDelete({ index: null, open: false })}>
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Delete Product</h2>
            <p className="text-gray-600 mb-6 text-center">Are you sure you want to delete this product?</p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-gray-200 text-gray-700" onClick={() => setShowDelete({ index: null, open: false })}>Cancel</Button>
              <Button className="bg-[#FF4D4F] text-white" onClick={() => handleDelete(showDelete.index!)}>Delete</Button>
            </div>
          </div>
          <style>{`
            @keyframes fadeInScale {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-fadeInScale {
              animation: fadeInScale 0.25s cubic-bezier(0.4,0,0.2,1);
            }
          `}</style>
        </div>
      )}
      {/* Main Content */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Product Inventory</h1>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, UPC, or supplier..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#335CFF]"
          />
          <Button className="flex gap-2 bg-[#335CFF] text-white" onClick={() => openModal(null)}>
            <PlusCircle className="w-5 h-5" /> Add Product
          </Button>
        </div>
      </div>
      <Card className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="py-3 px-4 font-semibold">Product</th>
              <th className="py-3 px-4 font-semibold">UPC</th>
              <th className="py-3 px-4 font-semibold">Stock</th>
              <th className="py-3 px-4 font-semibold">Sold</th>
              <th className="py-3 px-4 font-semibold">Min Stock</th>
              <th className="py-3 px-4 font-semibold">Supplier</th>
              <th className="py-3 px-4 font-semibold">Contact</th>
              <th className="py-3 px-4 font-semibold">Email</th>
              <th className="py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr><td colSpan={9} className="py-4 text-center text-gray-400">No products found.</td></tr>
            ) : (
              filteredProducts.map((p, idx) => (
                <tr key={p.upc} className="border-b hover:bg-[#F7F8FA]">
                  <td className="py-3 px-4 font-semibold">{p.name}</td>
                  <td className="py-3 px-4">{p.upc}</td>
                  <td className="py-3 px-4">{p.stock}</td>
                  <td className="py-3 px-4">{p.sold}</td>
                  <td className="py-3 px-4">{p.minStock}</td>
                  <td className="py-3 px-4">{p.supplier.name}</td>
                  <td className="py-3 px-4">{p.supplier.contact}</td>
                  <td className="py-3 px-4">{p.supplier.email}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <Button className="bg-[#EEF4FF] text-[#335CFF] px-3 py-1 text-xs font-semibold" onClick={() => openModal(products.indexOf(p))}><Edit className="w-4 h-4" /></Button>
                    <Button className="bg-[#FFEEF0] text-[#FF4D4F] px-3 py-1 text-xs font-semibold" onClick={() => setShowDelete({ index: products.indexOf(p), open: true })}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}; 