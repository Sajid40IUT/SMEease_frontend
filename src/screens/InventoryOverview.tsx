import React, { useRef, useState } from "react";
import { DashboardLayout } from "./Dashboard/DashboardLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Box, TrendingUp, PlusCircle, AlertTriangle, Star, X } from "lucide-react";
import { products as productList, Product } from "../lib/products";

export const InventoryOverview = () => {
  const allProductsRef = useRef<HTMLDivElement>(null);
  const restockRef = useRef<HTMLDivElement>(null);

  // Local state for products to allow UI updates
  const [products, setProducts] = useState<Product[]>(productList);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    upc: "",
    name: "",
    stock: "",
    sold: "",
    minStock: "",
  });
  const [error, setError] = useState("");
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const mostPopular = products.reduce((a, b) => (a.sold > b.sold ? a : b));
  // Restock logic: include products with stock = 0 or stock < minStock
  const restock = products.filter((p) => p.stock === 0 || p.stock < p.minStock);

  const scrollToAllProducts = () => {
    allProductsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToRestock = () => {
    restockRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add product logic
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validate
    if (!form.upc || !form.name || !form.stock || !form.sold || !form.minStock) {
      setError("All fields are required.");
      return;
    }
    if (products.some((p) => p.upc === form.upc)) {
      setError("UPC must be unique.");
      return;
    }
    const newProduct: Product = {
      upc: form.upc,
      name: form.name,
      stock: parseInt(form.stock, 10),
      sold: parseInt(form.sold, 10),
      minStock: parseInt(form.minStock, 10),
    };
    // Update UI
    setProducts((prev) => [...prev, newProduct]);
    setShowModal(false);
    setForm({ upc: "", name: "", stock: "", sold: "", minStock: "" });
    // Update products.ts file
    try {
      const res = await fetch("/api/update-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      // Optionally handle response
    } catch (err) {
      // Optionally handle error
    }
  };

  return (
    <DashboardLayout pageTitle="Inventory Overview">
      {/* Modal for Add Product */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred background with fade-in */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 opacity-100" onClick={() => setShowModal(false)} />
          {/* Modal card with scale/fade transition */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md z-10 animate-fadeInScale">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-2 text-center">Add New Product</h2>
            <p className="text-gray-500 text-sm mb-6 text-center">Fill in the details to register a new product by UPC</p>
            <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">UPC</label>
                <input name="upc" value={form.upc} onChange={handleChange} placeholder="UPC" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
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
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min Stock</label>
                <input name="minStock" value={form.minStock} onChange={handleChange} placeholder="Min Stock" type="number" className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#335CFF]" />
              </div>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <Button type="submit" className="bg-[#335CFF] text-white w-full mt-2 py-2 text-base rounded-lg shadow hover:bg-[#2546b8] transition">Add Product</Button>
            </form>
          </div>
          {/* Animation keyframes for modal */}
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
      {/* Restock Supplier Modal */}
      {restockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 opacity-100" onClick={() => setRestockProduct(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md z-10 animate-fadeInScale">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setRestockProduct(null)}>
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-2 text-center">Restock Product</h2>
            <p className="text-gray-500 text-sm mb-6 text-center">Contact the supplier to restock <span className='font-semibold text-black'>{restockProduct.name}</span></p>
            <div className="mb-4">
              <div className="mb-2"><span className="font-semibold">Supplier:</span> {restockProduct.supplier.name}</div>
              <div className="mb-2"><span className="font-semibold">Contact:</span> {restockProduct.supplier.contact}</div>
              <div className="mb-2"><span className="font-semibold">Email:</span> {restockProduct.supplier.email}</div>
            </div>
            <Button className="bg-[#335CFF] text-white w-full mt-2 py-2 text-base rounded-lg shadow hover:bg-[#2546b8] transition">Restock Now</Button>
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
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-400 mb-6">
        <span>Dashboard</span>
        <span className="mx-2">&gt;</span>
        <span className="text-[#335CFF] font-semibold">Inventory Overview</span>
      </div>

      {/* Top Section: Stats and Actions */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="cursor-pointer hover:shadow-lg transition" onClick={scrollToAllProducts}>
          <CardHeader>
            <CardTitle>Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Box className="w-8 h-8 text-[#335CFF]" />
              <span className="text-3xl font-bold">{totalStock}</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">All products in inventory</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition" onClick={scrollToRestock}>
          <CardHeader>
            <CardTitle>Restock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-[#FF4D4F]" />
              <span className="text-3xl font-bold">{restock.length}</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">Products need restocking</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Popular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-[#FFD600]" />
              <span className="font-bold">{mostPopular.name}</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">Sold: {mostPopular.sold} | UPC: {mostPopular.upc}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full flex gap-2 bg-[#335CFF] text-white" onClick={() => setShowModal(true)}>
              <PlusCircle className="w-5 h-5" /> Add Product
            </Button>
            <div className="text-xs text-gray-400 mt-2">Register a new product by UPC</div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Graph Placeholder */}
      <div className="bg-white rounded-xl border border-[#F0F0F0] p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-[#335CFF]" />
          <span className="font-semibold text-lg">Inventory Trends</span>
        </div>
        <div className="h-48 flex items-center justify-center text-gray-400">
          {/* Replace with actual chart later */}
          <span>Trend graph of stock and sales (coming soon)</span>
        </div>
      </div>

      {/* Restock Table */}
      <div ref={restockRef} className="bg-white rounded-xl border border-[#F0F0F0] p-6 mb-8">
        <div className="font-semibold text-lg mb-4">Products Needing Restock</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b">
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">UPC</th>
                <th className="py-3 px-4 font-semibold">Stock</th>
                <th className="py-3 px-4 font-semibold">Min Stock</th>
                <th className="py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {restock.length === 0 ? (
                <tr><td colSpan={5} className="py-4 text-center text-gray-400">No products need restocking.</td></tr>
              ) : (
                restock.map((p) => (
                  <tr key={p.upc} className="border-b hover:bg-[#F7F8FA]">
                    <td className="py-3 px-4 font-semibold">{p.name}</td>
                    <td className="py-3 px-4">{p.upc}</td>
                    <td className="py-3 px-4">{p.stock}</td>
                    <td className="py-3 px-4">{p.minStock}</td>
                    <td className="py-3 px-4">
                      <Button className="bg-[#EEF4FF] text-[#335CFF] px-4 py-1 text-xs font-semibold" onClick={() => setRestockProduct(p)}>Restock</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Products Table */}
      <div ref={allProductsRef} className="bg-white rounded-xl border border-[#F0F0F0] p-6">
        <div className="font-semibold text-lg mb-4">All Products</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b">
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">UPC</th>
                <th className="py-3 px-4 font-semibold">Stock</th>
                <th className="py-3 px-4 font-semibold">Sold</th>
                <th className="py-3 px-4 font-semibold">Min Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.upc} className="border-b hover:bg-[#F7F8FA]">
                  <td className="py-3 px-4 font-semibold">{p.name}</td>
                  <td className="py-3 px-4">{p.upc}</td>
                  <td className="py-3 px-4">{p.stock}</td>
                  <td className="py-3 px-4">{p.sold}</td>
                  <td className="py-3 px-4">{p.minStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}; 