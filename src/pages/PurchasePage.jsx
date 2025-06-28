import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PurchasePage() {
    const navigate = useNavigate();
    const [stock, setStock] = useState(null);
    const [amount, setAmount] = useState("");
    const [quantity, setQuantity] = useState("");
    const [orderType, setOrderType] = useState("market");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const { symbol } = useParams();

    useEffect(() => {
        console.log('Stock symbol:', symbol);
        const fetchStockData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/v1/stocks/${symbol}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch stock data: ${response.status}`);
                }

                const data = await response.json();
                setStock(data);
                console.log('Stock data received:', data);
            } catch (err) {
                console.error('Error fetching stock data:', err);
            } finally {
            }
        };
        fetchStockData();
    }, [symbol]);

    const handleBack = () => {
        navigate("/stocks");
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(price);
    };

    const calculateTotal = () => {
        if (!stock || !quantity) return 0;
        return parseFloat(quantity) * stock.price;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!amount && !quantity) {
            newErrors.input = "Please enter either amount or quantity";
        }

        if (amount && parseFloat(amount) <= 0) {
            newErrors.amount = "Amount must be greater than 0";
        }

        if (quantity && (parseFloat(quantity) <= 0 || !Number.isInteger(parseFloat(quantity)))) {
            newErrors.quantity = "Quantity must be a positive whole number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);
        if (value && stock) {
            // Calculate quantity based on amount
            const calc = parseFloat(value) / stock.price;
            setQuantity(Math.floor(calc).toString());
        }
        if (errors.amount || errors.input) {
            setErrors(prev => ({ ...prev, amount: "", input: "" }));
        }
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        setQuantity(value);
        if (value && stock) {
            // Calculate amount based on quantity
            const calc = parseFloat(value) * stock.price;
            setAmount(calc.toFixed(2));
        }
        if (errors.quantity || errors.input) {
            setErrors(prev => ({ ...prev, quantity: "", input: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Here you would make the actual API call to purchase the stock
            const orderData = {
                stockSymbol: stock.symbol,
                stockPrice: stock.price,
                quantity: parseInt(quantity),
                totalAmount: calculateTotal(),
                orderType: orderType,
                timestamp: new Date().toISOString()
            };

            console.log("Order submitted:", orderData);

            // Show success and redirect
            alert(`Successfully placed ${orderType} order for ${quantity} shares of ${stock.symbol}`);
            navigate("/stocks");

        } catch (error) {
            console.error("Order submission failed:", error);
            alert("Order submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!stock) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white/60 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <p>Loading stock information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative z-10 p-6 max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                    <button
                        onClick={handleBack}
                        className="group flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white font-medium py-3 px-6 rounded-2xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Stocks</span>
                    </button>

                    <div className="text-right">
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
                            Purchase Stock
                        </h1>
                        <p className="text-white/70 text-lg">Place your order • Real-time pricing</p>
                    </div>
                </div>

                {/* Stock Information Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 mb-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">{stock.symbol.slice(0, 2)}</span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">{stock.symbol}</h2>
                                <p className="text-white/70">Live Trading Stock</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-mono font-bold text-white mb-1">
                                {formatPrice(stock.price)}
                            </div>
                            <div className="flex items-center justify-end space-x-2 text-emerald-400">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">Live Price</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Purchase Form */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Order Type Selection */}
                        <div>
                            <label className="block text-white/90 text-lg font-semibold mb-4">Order Type</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setOrderType("market")}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${orderType === "market"
                                        ? "border-cyan-500 bg-cyan-500/20 text-cyan-300"
                                        : "border-white/20 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10"
                                        }`}
                                >
                                    <div className="text-left">
                                        <h3 className="font-semibold text-lg">Market Order</h3>
                                        <p className="text-sm opacity-80">Execute immediately at current price</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOrderType("limit")}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${orderType === "limit"
                                        ? "border-purple-500 bg-purple-500/20 text-purple-300"
                                        : "border-white/20 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10"
                                        }`}
                                >
                                    <div className="text-left">
                                        <h3 className="font-semibold text-lg">Limit Order</h3>
                                        <p className="text-sm opacity-80">Set your preferred price</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Amount and Quantity Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white/90 text-lg font-semibold mb-3">
                                    Investment Amount ($)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-white/60 text-lg">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={handleAmountChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        className="w-full pl-10 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-lg font-mono placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>
                                {errors.amount && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>{errors.amount}</span>
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white/90 text-lg font-semibold mb-3">
                                    Number of Shares
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        placeholder="0"
                                        min="1"
                                        step="1"
                                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-lg font-mono placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <span className="text-white/60 text-sm">shares</span>
                                    </div>
                                </div>
                                {errors.quantity && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>{errors.quantity}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {errors.input && (
                            <p className="text-red-400 text-sm flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{errors.input}</span>
                            </p>
                        )}

                        {/* Order Summary */}
                        {quantity && (
                            <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 backdrop-blur-md rounded-xl p-6 border border-emerald-500/30">
                                <h3 className="text-emerald-300 text-lg font-semibold mb-4">Order Summary</h3>
                                <div className="grid grid-cols-2 gap-4 text-white">
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Stock:</span>
                                        <span className="font-semibold">{stock.symbol}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Price per share:</span>
                                        <span className="font-mono">{formatPrice(stock.price)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Shares:</span>
                                        <span className="font-semibold">{quantity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Order type:</span>
                                        <span className="font-semibold capitalize">{orderType}</span>
                                    </div>
                                    <div className="col-span-2 pt-4 border-t border-emerald-500/30">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/90 text-lg font-semibold">Total:</span>
                                            <span className="text-2xl font-bold font-mono text-emerald-300">
                                                {formatPrice(calculateTotal())}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || !quantity}
                                className="group relative w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center space-x-3">
                                    {isSubmitting ? (
                                        <>
                                            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="text-xl">Processing Order...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                            <span className="text-xl">Place {orderType} Order</span>
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-white/50 text-sm">
                        Secure trading • Real-time execution • {new Date().toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Custom CSS for animation delays */}
            <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
}

export default PurchasePage;