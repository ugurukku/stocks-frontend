import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function BeveragePurchasePage() {
    const navigate = useNavigate();
    const [beer, setBeer] = useState(null);
    const [amount, setAmount] = useState("");
    const [quantity, setQuantity] = useState("");
    const [orderType, setOrderType] = useState("tap");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const { id } = useParams();

    useEffect(() => {
        const fetchBeerData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/v1/beverages/${id}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch beer data: ${response.status}`);
                }

                const data = await response.json();
                setBeer(data);
                console.log('Beer data received:', data);
            } catch (err) {
                console.error('Error fetching beer data:', err);
            }
        };
        fetchBeerData();
    }, [id]);

    const handleBack = () => {
        navigate("/beverages");
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(price);
    };

    const calculateTotal = () => {
        if (!beer || !quantity) return 0;
        return parseFloat(quantity) * beer.price;
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
        if (value && beer) {
            // Calculate quantity based on amount
            const calc = parseFloat(value) / beer.price;
            setQuantity(Math.floor(calc).toString());
        }
        if (errors.amount || errors.input) {
            setErrors(prev => ({ ...prev, amount: "", input: "" }));
        }
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        setQuantity(value);
        if (value && beer) {
            // Calculate amount based on quantity
            const calc = parseFloat(value) * beer.price;
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
            await new Promise(resolve => setTimeout(resolve, 2000));

            const orderData = {
                amount: parseInt(quantity)
            };

            const response = await fetch(`http://localhost:8080/v1/beverages/${id}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log("Order submitted:", orderData);

            alert(`Successfully placed ${orderType} order for ${quantity} pints of ${beer.name || beer.symbol}`);
            navigate("/beverages");

        } catch (error) {
            console.error("Order submission failed:", error);
            alert("Order submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getBeerType = (name) => {
        const types = ['IPA', 'Lager', 'Stout', 'Ale', 'Wheat', 'Porter', 'Pilsner'];
        return types[name?.length % types.length] || 'Craft Beer';
    };

    const getBeerIcon = () => {
        const icons = ['🍺', '🍻', '🥂'];
        return icons[Math.floor(Math.random() * icons.length)];
    };

    if (!beer) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-700 flex items-center justify-center">
                <div className="text-amber-100 text-center">
                    <div className="w-16 h-16 bg-amber-600/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-400/30">
                        <svg className="w-8 h-8 text-amber-200 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <p>Loading fresh brew information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-700">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative z-10 p-6 max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                    <button
                        onClick={handleBack}
                        className="group flex items-center space-x-2 bg-amber-600/20 backdrop-blur-md text-amber-100 font-medium py-3 px-6 rounded-2xl border border-amber-400/30 hover:bg-amber-500/30 hover:border-amber-300/50 transition-all duration-300 transform hover:scale-105"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Beverages</span>
                    </button>

                    <div className="text-right">
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 mb-2 flex items-center justify-end space-x-2">
                            <span>🍺</span>
                            <span>Order Fresh Brew</span>
                        </h1>
                        <p className="text-amber-100/80 text-lg">Fresh from tap • Cold & Ready</p>
                    </div>
                </div>

                {/* Beer Information Card */}
                <div className="bg-amber-600/20 backdrop-blur-xl rounded-2xl border border-amber-400/30 p-8 mb-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl">
                                {getBeerIcon()}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-amber-100">{beer.name || beer.symbol}</h2>
                                <p className="text-amber-200/70 text-lg">{getBeerType(beer.name || beer.symbol)} • Fresh from tap</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-mono font-bold text-amber-100 mb-1">
                                {formatPrice(beer.price)}
                            </div>
                            <div className="flex items-center justify-end space-x-2 text-green-400">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">Fresh & Cold</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Purchase Form */}
                <div className="bg-amber-900/30 backdrop-blur-xl rounded-2xl border border-amber-400/20 p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Order Type Selection */}
                        <div>
                            <label className="block text-amber-100 text-lg font-semibold mb-4">Order Style</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setOrderType("tap")}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${orderType === "tap"
                                        ? "border-amber-500 bg-amber-500/20 text-amber-300"
                                        : "border-amber-400/30 bg-amber-600/10 text-amber-200/70 hover:border-amber-400/50 hover:bg-amber-600/20"
                                        }`}
                                >
                                    <div className="text-left">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-xl">🚰</span>
                                            <h3 className="font-semibold text-lg">Fresh Tap</h3>
                                        </div>
                                        <p className="text-sm opacity-80">Served immediately, perfectly chilled</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOrderType("bottle")}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${orderType === "bottle"
                                        ? "border-orange-500 bg-orange-500/20 text-orange-300"
                                        : "border-amber-400/30 bg-amber-600/10 text-amber-200/70 hover:border-amber-400/50 hover:bg-amber-600/20"
                                        }`}
                                >
                                    <div className="text-left">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-xl">🍾</span>
                                            <h3 className="font-semibold text-lg">Bottled</h3>
                                        </div>
                                        <p className="text-sm opacity-80">Take home, premium packaging</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Amount and Quantity Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-amber-100 text-lg font-semibold mb-3">
                                    Total Amount ($)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-amber-200/60 text-lg">$</span>
                                    </div>
                                    <input
                                        readOnly
                                        type="number"
                                        value={amount}
                                        onChange={handleAmountChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        className="w-full pl-10 pr-4 py-4 bg-amber-600/20 border border-amber-400/30 rounded-xl text-amber-100 text-lg font-mono placeholder-amber-200/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 backdrop-blur-md"
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
                                <label className="block text-amber-100 text-lg font-semibold mb-3">
                                    Number of Pints
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        placeholder="0"
                                        min="1"
                                        step="1"
                                        className="w-full px-4 py-4 bg-amber-600/20 border border-amber-400/30 rounded-xl text-amber-100 text-lg font-mono placeholder-amber-200/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 backdrop-blur-md"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <span className="text-amber-200/60 text-sm">pints</span>
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
                            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
                                <h3 className="text-green-300 text-lg font-semibold mb-4 flex items-center space-x-2">
                                    <span>📋</span>
                                    <span>Order Summary</span>
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-amber-100">
                                    <div className="flex justify-between">
                                        <span className="text-amber-200/70">Beer:</span>
                                        <span className="font-semibold">{beer.name || beer.symbol}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-amber-200/70">Price per pint:</span>
                                        <span className="font-mono">{formatPrice(beer.price)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-amber-200/70">Pints:</span>
                                        <span className="font-semibold">{quantity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-amber-200/70">Style:</span>
                                        <span className="font-semibold capitalize">{orderType}</span>
                                    </div>
                                    <div className="col-span-2 pt-4 border-t border-green-500/30">
                                        <div className="flex justify-between items-center">
                                            <span className="text-amber-100 text-lg font-semibold">Total:</span>
                                            <span className="text-2xl font-bold font-mono text-green-300">
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
                                className="group relative w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center space-x-3">
                                    {isSubmitting ? (
                                        <>
                                            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="text-xl">Preparing Order...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-2xl">🍺</span>
                                            <span className="text-xl">Order {quantity} Pint{quantity > 1 ? 's' : ''}</span>
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
                    <p className="text-amber-200/60 text-sm flex items-center justify-center space-x-2">
                        <span>🍺</span>
                        <span>Fresh daily brews</span>
                        <span>•</span>
                        <span>Served cold</span>
                        <span>•</span>
                        <span>{new Date().toLocaleString()}</span>
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

export default BeveragePurchasePage;