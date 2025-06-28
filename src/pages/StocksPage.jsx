import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";

function StocksPage() {
  const [stocks, setStocks] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    fetch("http://localhost:8080/v1/stocks")
      .then(res => res.json())
      .then(data => {
        // Sort by price descending when initially fetching
        const sortedData = data.sort((a, b) => b.price - a.price);
        setStocks(sortedData);
      })
      .catch(err => console.error("Failed to fetch stocks", err));

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("STOMP connected");
        setConnectionStatus('connected');
        client.subscribe("/topic/stocks", (message) => {
          const updatedStock = JSON.parse(message.body);
          setStocks(prevStocks => {
            const index = prevStocks.findIndex(s => s.symbol === updatedStock.symbol);
            let updatedStocks;
            
            if (index !== -1) {
              updatedStocks = [...prevStocks];
              updatedStocks[index] = updatedStock;
            } else {
              updatedStocks = [...prevStocks, updatedStock];
            }
            
            // Sort by price descending after each update
            return updatedStocks.sort((a, b) => b.price - a.price);
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
      case 'connected': return 'bg-emerald-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-amber-500';
    }
  };

  const getConnectionStatusText = () => {
    switch(connectionStatus) {
      case 'connected': return 'Live';
      case 'error': return 'Error';
      default: return 'Connecting...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="group flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white font-medium py-3 px-6 rounded-2xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </button>
            
            {/* Connection Status */}
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()} animate-pulse`}></div>
              <span className="text-white text-sm font-medium">{getConnectionStatusText()}</span>
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
              Live Stocks
            </h1>
            <p className="text-white/70 text-lg">Real-time market data • Sorted by price</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 backdrop-blur-md rounded-2xl p-6 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm font-medium">Active Stocks</p>
                <p className="text-white text-3xl font-bold">{stocks.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Average Price</p>
                <p className="text-white text-3xl font-bold">
                  {stocks.length > 0 ? formatPrice(stocks.reduce((sum, stock) => sum + stock.price, 0) / stocks.length) : '$0.00'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Highest Price</p>
                <p className="text-white text-3xl font-bold">
                  {stocks.length > 0 ? formatPrice(Math.max(...stocks.map(s => s.price))) : '$0.00'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Stocks Table */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 backdrop-blur-md">
                <tr>
                  <th className="text-left py-6 px-8 text-white/90 font-semibold text-sm uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <span>#</span>
                      <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                      <span>Rank</span>
                    </div>
                  </th>
                  <th className="text-left py-6 px-8 text-white/90 font-semibold text-sm uppercase tracking-wider">
                    Stock Symbol
                  </th>
                  <th className="text-right py-6 px-8 text-white/90 font-semibold text-sm uppercase tracking-wider">
                    <div className="flex items-center justify-end space-x-2">
                      <span>Current Price</span>
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stocks.map((stock, index) => (
                  <tr
                    key={stock.id}
                    className="group hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.01]"
                  >
                    <td className="py-6 px-8">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500 text-yellow-900' :
                          index === 1 ? 'bg-gray-400 text-gray-900' :
                          index === 2 ? 'bg-amber-600 text-amber-100' :
                          'bg-white/20 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        {index < 3 && (
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{stock.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <div className="text-white font-semibold text-lg">{stock.symbol}</div>
                          <div className="text-white/60 text-sm">Live Trading</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="text-white font-mono text-xl font-bold">
                        {formatPrice(stock.price)}
                      </div>
                      <div className="text-emerald-400 text-sm flex items-center justify-end space-x-1 mt-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>Live</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {stocks.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-16">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                          <svg className="w-8 h-8 text-white/60 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                        <div className="text-center">
                          <h3 className="text-white text-lg font-semibold mb-2">Loading Market Data</h3>
                          <p className="text-white/60">Fetching real-time stock prices...</p>
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
          <p className="text-white/50 text-sm">
            Real-time data • Updated live via WebSocket • {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StocksPage;