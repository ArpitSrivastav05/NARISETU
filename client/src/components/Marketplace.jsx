import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import ImageUploader from "./ImageUploader";

const API_URL = import.meta.env.VITE_API_URL || "https://narisetu-j9ac.onrender.com";

const PRODUCT_CATEGORIES = [
  { value: "handloom", label: "Handloom & Textiles" },
  { value: "handicraft", label: "Handicraft" },
  { value: "food_processing", label: "Food Processing" },
  { value: "agriculture", label: "Agriculture" },
  { value: "retail", label: "Retail" },
  { value: "services", label: "Services" },
  { value: "other", label: "Other" },
];

export default function Marketplace() {
  const { authHeaders } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState("browse"); // "browse" or "sell"
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Contact Modal state
  const [contactSeller, setContactSeller] = useState(null);

  // Seller/Business profile state

  const [businessProfile, setBusinessProfile] = useState(null);
  const [isCheckingBusiness, setIsCheckingBusiness] = useState(false);

  // Forms states
  const [businessForm, setBusinessForm] = useState({
    businessName: "",
    ownerName: "",
    category: "handicraft",
    location: "",
    description: "",
    contactNumber: "",
    profileImage: "",
  });

  const [productForm, setProductForm] = useState({
    productName: "",
    category: "handicraft",
    price: "",
    description: "",
    imageUrl: "",
  });

  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // ── Fetch active products ──────────────────────────────
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/api/products`;
      const params = [];
      if (selectedCategory !== "all") {
        params.push(`category=${selectedCategory}`);
      }
      if (searchQuery.trim() !== "") {
        params.push(`search=${encodeURIComponent(searchQuery)}`);
      }
      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const headers = await authHeaders();
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error("Failed to load products.");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        throw new Error(data.error || "Failed to parse products.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Fetch authenticated user's business profile ────────────
  const fetchMyBusinessProfile = async () => {
    setIsCheckingBusiness(true);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/business/mine`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setBusinessProfile(data.data);
          setBusinessId(data.data.id);
        } else {
          setBusinessProfile(null);
          setBusinessId(null);
        }
      } else {
        setBusinessProfile(null);
        setBusinessId(null);
      }
    } catch (err) {
      console.error("Error fetching business profile:", err);
    } finally {
      setIsCheckingBusiness(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchMyBusinessProfile();
  }, [authHeaders]);

  // ── Handle Business Registration ───────────────────────
  const handleRegisterBusiness = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);
    setIsSubmitting(true);

    const { businessName, ownerName, category, location, contactNumber, description, profileImage } = businessForm;

    // Validate phone: 10 digits
    const cleanPhone = contactNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setFormError("Please enter a valid 10-digit phone number.");
      setIsSubmitting(false);
      return;
    }

    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/business/create`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          businessName,
          ownerName,
          category,
          location,
          contactNumber: cleanPhone,
          description,
          profileImage: profileImage || "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(businessName) + "&backgroundColor=e8d5f5,f0e6ff&textColor=7c3aed",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to create profile.");

      setBusinessId(data.data.id);
      setBusinessProfile(data.data);
      setFormSuccess("Business profile created successfully!");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Handle AI Optimization ────────────────────────────
  const handleOptimizeProduct = async () => {
    if (!productForm.productName || !productForm.price) {
      setFormError("Please enter a product name and price before optimizing.");
      return;
    }
    setFormError(null);
    setFormSuccess(false);
    setIsOptimizing(true);

    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/ai/optimize-product`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          productData: {
            name: productForm.productName,
            price: productForm.price,
            description: productForm.description,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to optimize product.");

      setProductForm({ ...productForm, description: data.data.optimizedDescription });
      setFormSuccess("✨ Product description optimized by AI!");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsOptimizing(false);
    }
  };

  // ── Handle Product Submission ─────────────────────────
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);
    setIsSubmitting(true);

    const { productName, category, price, description, imageUrl } = productForm;

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError("Please enter a valid price greater than 0.");
      setIsSubmitting(false);
      return;
    }

    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/products/create`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          productName,
          category,
          price: parsedPrice,
          description,
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to create listing.");

      setFormSuccess("Product listed successfully in the marketplace!");
      setProductForm({
        productName: "",
        category: "handicraft",
        price: "",
        description: "",
        imageUrl: "",
      });
      fetchProducts(); // Refresh listings
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-navy-800 to-navy-950 p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">🛒 NariSetu Marketplace</h2>
          <p className="text-slate-300 mt-2 max-w-xl text-sm leading-relaxed">
            A micro-business directory connecting local entrepreneurs, artisans, and farmers directly to customers.
          </p>
        </div>
        <div className="flex gap-3 self-start md:self-auto shrink-0">
          <button
            onClick={() => setActiveSubTab("browse")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
              activeSubTab === "browse" ? "bg-white text-navy-900 shadow-md" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            🛍️ Browse Products
          </button>
          <button
            onClick={() => setActiveSubTab("sell")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
              activeSubTab === "sell" ? "bg-white text-navy-900 shadow-md" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            💼 Seller Center
          </button>
        </div>
      </div>

      {/* ── BROWSE MODE ─────────────────────────────────────── */}
      {activeSubTab === "browse" && (
        <div className="space-y-6">
          {/* Search and Filters Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition text-sm font-semibold text-slate-600"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Listings Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="h-10 w-10 border-4 border-slate-200 border-t-navy-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-slate-500 mt-4 font-semibold">Loading marketplace listings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 bg-rose-50 border border-rose-100 rounded-2xl p-6">
              <p className="text-rose-600 font-bold">Failed to load marketplace</p>
              <p className="text-xs text-rose-500 mt-1">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
              <span className="text-4xl">📦</span>
              <h3 className="text-slate-700 font-bold mt-4">No Products Found</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
                No matching product listings are available right now. Be the first to list a product in the Seller Center!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="group relative flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                    <img
                      src={p.imageUrl}
                      alt={p.productName}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400";
                      }}
                    />
                    <span className="absolute top-3 right-3 bg-white/95 text-navy-800 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-sm ring-1 ring-slate-100">
                      {PRODUCT_CATEGORIES.find((c) => c.value === p.category)?.label || p.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{p.productName}</h3>
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 h-8 leading-relaxed">
                        {p.description || "No description provided."}
                      </p>
                      <div className="mt-4 flex justify-between items-baseline border-b border-slate-50 pb-3">
                        <span className="text-slate-400 text-xs font-semibold">Price</span>
                        <span className="text-xl font-black text-emerald-600">₹{p.price.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-1 text-xs text-slate-500 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        {p.sellerProfileImage ? (
                          <img
                            src={p.sellerProfileImage}
                            alt={p.sellerName}
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.replaceWith(Object.assign(document.createElement('span'), { textContent: '👩‍🌾' }));
                            }}
                          />
                        ) : (
                          <span>👩‍🌾</span>
                        )}
                        <span className="font-semibold text-slate-700">{p.sellerName}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[100px]">{p.businessName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span>📍</span>
                        <span>{p.location}</span>
                      </div>

                      <button
                        onClick={() => setContactSeller(p)}
                        className="w-full mt-4 bg-navy-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs hover:bg-navy-700 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg hover:shadow-navy-600/20 active:scale-95"
                      >
                        💬 Contact Seller
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── SELLER CENTER MODE ──────────────────────────────── */}
      {activeSubTab === "sell" && (
        <div className="max-w-3xl mx-auto">
          {isCheckingBusiness ? (
            <div className="text-center py-20">
              <div className="h-10 w-10 border-4 border-slate-200 border-t-navy-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-slate-500 mt-4">Verifying business registry...</p>
            </div>
          ) : !businessProfile ? (
            /* Registration form if no business exists */
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-md space-y-6">
              <div className="text-center max-w-md mx-auto">
                <span className="text-4xl">🏢</span>
                <h3 className="text-2xl font-bold text-slate-800 mt-3">Register Seller Profile</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Create a profile for your business or cooperative to start listing products on NariSetu.
                </p>
              </div>

              {formError && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-semibold">
                  ⚠️ {formError}
                </div>
              )}

              <form onSubmit={handleRegisterBusiness} className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Business Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anjali Handlooms"
                    value={businessForm.businessName}
                    onChange={(e) => setBusinessForm({ ...businessForm, businessName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Owner Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={businessForm.ownerName}
                    onChange={(e) => setBusinessForm({ ...businessForm, ownerName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Business Category</label>
                  <select
                    value={businessForm.category}
                    onChange={(e) => setBusinessForm({ ...businessForm, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 cursor-pointer"
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Contact Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={businessForm.contactNumber}
                    onChange={(e) => setBusinessForm({ ...businessForm, contactNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Varanasi, Uttar Pradesh"
                    value={businessForm.location}
                    onChange={(e) => setBusinessForm({ ...businessForm, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Profile Image</label>
                  <ImageUploader
                    onUploadComplete={(url) => setBusinessForm({ ...businessForm, profileImage: url })}
                    initialImageUrl={businessForm.profileImage}
                    folder="businesses"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Tell customers about your business, craft, or goals..."
                    value={businessForm.description}
                    onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:col-span-2 bg-navy-600 hover:bg-navy-700 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? "Registering profile..." : "Register & Start Selling"}
                </button>
              </form>
            </div>
          ) : (
            /* Registered Seller Center with Add Product Form */
            <div className="space-y-6">
              {/* Seller details card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-navy-50 overflow-hidden ring-1 ring-slate-100">
                    <img
                      src={businessProfile.profileImage}
                      alt={businessProfile.businessName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(businessProfile.businessName || "Seller") + "&backgroundColor=e8d5f5,f0e6ff&textColor=7c3aed";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{businessProfile.businessName}</h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      Seller Center · {businessProfile.ownerName} · 📍 {businessProfile.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Add Product Form */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-bold text-slate-800">➕ Add New Product</h3>
                  <p className="text-xs text-slate-400 mt-1">Submit listing details to expose your products to visitors.</p>
                </div>

                {formError && (
                  <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-semibold">
                    ⚠️ {formError}
                  </div>
                )}
                {formSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs font-semibold">
                    ✅ {formSuccess}
                  </div>
                )}

                <form onSubmit={handleAddProduct} className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hand-spun Banarasi Silk Scarf"
                      value={productForm.productName}
                      onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 cursor-pointer"
                    >
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 1200"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Product Image</label>
                    <ImageUploader
                      onUploadComplete={(url) => setProductForm({ ...productForm, imageUrl: url })}
                      initialImageUrl={productForm.imageUrl}
                      folder="products"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Description</label>
                      <button
                        type="button"
                        onClick={handleOptimizeProduct}
                        disabled={isOptimizing}
                        className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full transition disabled:opacity-50"
                      >
                        {isOptimizing ? "Optimizing..." : "✨ AI Optimize"}
                      </button>
                    </div>
                    <textarea
                      rows="4"
                      placeholder="Provide product details, sizing, material composition, or crafting time..."
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:col-span-2 bg-navy-600 hover:bg-navy-700 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? "Creating product listing..." : "Publish Product Listing"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CONTACT MODAL ─────────────────────────────────────── */}
      {contactSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 relative animate-scaleIn">
            <button
              onClick={() => setContactSeller(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 text-sm hover:text-slate-600 transition"
            >
              ✕
            </button>
            <div className="text-center">
              <span className="text-3xl">📱</span>
              <h3 className="text-lg font-bold text-slate-800 mt-2">Contact Seller</h3>
              <p className="text-xs text-slate-400 mt-1">Reach out to purchase or inquire about: </p>
              <p className="font-bold text-navy-600 mt-1 text-sm">"{contactSeller.productName}"</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 border border-slate-100">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Seller Name:</span>
                <span className="text-slate-800">{contactSeller.sellerName}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Business:</span>
                <span className="text-slate-800">{contactSeller.businessName}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Location:</span>
                <span className="text-slate-800">{contactSeller.location}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Price:</span>
                <span className="text-emerald-600 font-bold">₹{contactSeller.price}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 mt-2">
              <a
                href={`https://wa.me/91${contactSeller.contactNumber}?text=${encodeURIComponent(
                  `Hi, I saw your product "${contactSeller.productName}" on NariSetu and I would like to buy it.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow"
              >
                <span>💬</span> WhatsApp Seller
              </a>
              <a
                href={`tel:${contactSeller.contactNumber}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow"
              >
                <span>📞</span> Call Seller (₹{contactSeller.contactNumber})
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
