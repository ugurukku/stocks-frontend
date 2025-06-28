import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";

function BeveragesPage() {
  const [beers, setBeers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleBeverageClick = (id) => {
    navigate(`/${id}/purchase`);
  };

  useEffect(() => {
    fetch("http://localhost:8080/v1/beverages")
      .then(res => res.json())
      .then(data => {
        // Sort by price descending when initially fetching
        const sortedData = data.sort((a, b) => b.price - a.price);
        setBeers(sortedData);
      })
      .catch(err => console.error("Failed to fetch beers", err));

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("STOMP connected");
        setConnectionStatus('connected');
        client.subscribe("/topic/beers", (message) => {
          const updatedBeer = JSON.parse(message.body);
          setBeers(prevBeers => {
            const index = prevBeers.findIndex(b => b.name === updatedBeer.name);
            let updatedBeers;
            
            if (index !== -1) {
              updatedBeers = [...prevBeers];
              updatedBeers[index] = updatedBeer;
            } else {
              updatedBeers = [...prevBeers, updatedBeer];
            }
            
            // Sort by price descending after each update
            return updatedBeers.sort((a, b) => b.price - a.price);
          });
        });
      },
      onStompError: (frame) => {
        console.error("Broker error", frame.headers["message"]);
        setConnectionStatus('error');
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getConnectionStatusColor = () => {
    switch(connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-amber-500';
    }
  };

  const getConnectionStatusText = () => {
    switch(connectionStatus) {
      case 'connected': return 'Fresh';
      case 'error': return 'Error';
      default: return 'Brewing...';
    }
  };

  const getBeerIcon = (index) => {
    const icons = ['🍺', '🍻', '🍺', '🥂', '🍺'];
    return icons[index % icons.length];
  };

  const getBeerType = (name) => {
    const types = ['IPA', 'Lager', 'Stout', 'Ale', 'Wheat', 'Porter', 'Pilsner'];
    return types[name.length % types.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-700">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="group flex items-center space-x-2 bg-amber-600/20 backdrop-blur-md text-amber-100 font-medium py-3 px-6 rounded-2xl border border-amber-400/30 hover:bg-amber-500/30 hover:border-amber-300/50 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </button>
            
            {/* Connection Status */}
            <div className="flex items-center space-x-2 bg-amber-600/20 backdrop-blur-md px-4 py-2 rounded-xl border border-amber-400/30">
              <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()} animate-pulse`}></div>
              <span className="text-amber-100 text-sm font-medium">{getConnectionStatusText()}</span>
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 mb-2 flex items-center justify-end space-x-2">
              <span>🍺</span>
              <span>Craft Brewery</span>
            </h1>
            <p className="text-amber-100/80 text-lg">Fresh brews daily • Click to order</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-6 border border-amber-400/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-200 text-sm font-medium">Available Brews</p>
                <p className="text-amber-100 text-3xl font-bold">{beers.length}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/30 rounded-xl flex items-center justify-center text-2xl">
                🍺
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-2xl p-6 border border-orange-400/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm font-medium">Average Price</p>
                <p className="text-orange-100 text-3xl font-bold">
                  {beers.length > 0 ? formatPrice(beers.reduce((sum, beer) => sum + beer.price, 0) / beers.length) : '$0.00'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center text-2xl">
                💰
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-md rounded-2xl p-6 border border-yellow-400/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-medium">Premium Brew</p>
                <p className="text-yellow-100 text-3xl font-bold">
                  {beers.length > 0 ? formatPrice(Math.max(...beers.map(b => b.price))) : '$0.00'}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/30 rounded-xl flex items-center justify-center text-2xl">
                👑
              </div>
            </div>
          </div>
        </div>

        {/* Beers Table */}
        <div className="bg-amber-900/30 backdrop-blur-xl rounded-2xl border border-amber-400/20 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-800/40 backdrop-blur-md">
                <tr>
                  <th className="text-left py-6 px-8 text-amber-100 font-semibold text-sm uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <span>🏆</span>
                      <span>Rank</span>
                    </div>
                  </th>
                  <th className="text-left py-6 px-8 text-amber-100 font-semibold text-sm uppercase tracking-wider">
                    Beer Name
                  </th>
                  <th className="text-center py-6 px-8 text-amber-100 font-semibold text-sm uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-right py-6 px-8 text-amber-100 font-semibold text-sm uppercase tracking-wider">
                    <div className="flex items-center justify-end space-x-2">
                      <span>Price</span>
                      <span>💵</span>
                    </div>
                  </th>
                  <th className="text-center py-6 px-8 text-amber-100 font-semibold text-sm uppercase tracking-wider">
                    Order
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-400/10">
                {beers.map((beer, index) => (
                  <tr
                    key={beer.id}
                    className="group hover:bg-amber-500/10 transition-all duration-300 transform hover:scale-[1.01]"
                  >
                    <td className="py-6 px-8">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500 text-yellow-900' :
                          index === 1 ? 'bg-gray-400 text-gray-900' :
                          index === 2 ? 'bg-amber-600 text-amber-100' :
                          'bg-amber-500/30 text-amber-100'
                        }`}>
                          {index + 1}
                        </div>
                        {index < 3 && (
                          <span className="text-2xl">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
                          {getBeerIcon(index)}
                        </div>
                        <div>
                          <div className="text-amber-100 font-semibold text-lg">{beer.name || beer.symbol}</div>
                          <div className="text-amber-200/70 text-sm">Fresh from tap</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-200 border border-amber-400/30">
                        {getBeerType(beer.name || beer.symbol)}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="text-amber-100 font-mono text-xl font-bold">
                        {formatPrice(beer.price)}
                      </div>
                      <div className="text-green-400 text-sm flex items-center justify-end space-x-1 mt-1">
                        <span>✨</span>
                        <span>Fresh</span>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center">
                      <button
                        onClick={() => handleBeverageClick(beer.id || beer.symbol)}
                        className="group relative bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-amber-500/25"
                      >
                        <div className="flex items-center space-x-2">
                          <span>🛒</span>
                          <span>Order</span>
                        </div>
                      </button>
                    </td>
                  </tr>
                ))}
                {beers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-16">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-3xl">
                          🍺
                        </div>
                        <div className="text-center">
                          <h3 className="text-amber-100 text-lg font-semibold mb-2">Brewing Fresh Beers</h3>
                          <p className="text-amber-200/70">Loading our finest selection...</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-amber-200/60 text-sm flex items-center justify-center space-x-2">
            <span>🍺</span>
            <span>Fresh daily brews</span>
            <span>•</span>
            <span>Live inventory</span>
            <span>•</span>
            <span>Click any beer to order</span>
            <span>•</span>
            <span>{new Date().toLocaleString()}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default BeveragesPage;