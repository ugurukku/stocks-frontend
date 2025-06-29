import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-amber-300 rounded-full opacity-30 animate-bounce animation-delay-1000"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-orange-400 rounded-full opacity-50 animate-bounce animation-delay-2000"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-40 animate-bounce animation-delay-3000"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-amber-400 rounded-full opacity-30 animate-bounce animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 mb-6 flex items-center justify-center space-x-4">
              <span>📈</span>
              <span>TradingHub</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full mb-8"></div>
            <p className="text-xl md:text-2xl text-amber-100/80 font-light max-w-2xl mx-auto leading-relaxed">
              Your gateway to real-time market data and seamless trading experiences
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-6 border border-amber-400/40">
              <div className="w-12 h-12 bg-amber-500/30 rounded-xl flex items-center justify-center mb-4 mx-auto text-2xl">
                📊
              </div>
              <h3 className="text-amber-100 font-semibold text-lg mb-2">Live Market Data</h3>
              <p className="text-amber-200/70 text-sm">Real-time stock prices with WebSocket connectivity</p>
            </div>

            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-2xl p-6 border border-orange-400/40">
              <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center mb-4 mx-auto text-2xl">
                🚀
              </div>
              <h3 className="text-orange-100 font-semibold text-lg mb-2">Smart Trading</h3>
              <p className="text-orange-200/70 text-sm">Create and manage orders with intelligent automation</p>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-md rounded-2xl p-6 border border-yellow-400/40">
              <div className="w-12 h-12 bg-yellow-500/30 rounded-xl flex items-center justify-center mb-4 mx-auto text-2xl">
                📈
              </div>
              <h3 className="text-yellow-100 font-semibold text-lg mb-2">Advanced Analytics</h3>
              <p className="text-yellow-200/70 text-sm">Comprehensive insights and performance tracking</p>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Stocks/Leaderboard Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <button
              onClick={() => navigate("/beverages")}
              className="hover:cursor-pointer relative w-full bg-amber-900/30 backdrop-blur-xl rounded-3xl p-8 border border-amber-400/20 hover:bg-amber-500/10 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-2xl"
            >
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl">
                  🍺
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-2xl font-bold text-amber-100 mb-2 flex items-center space-x-2">
                    <span>Live Stocks</span>
                  </h3>
                  <p className="text-amber-200/70 text-base">
                    Monitor real-time stock prices and market movements with live WebSocket updates
                  </p>
                  <div className="flex items-center space-x-2 mt-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Live Data</span>
                  </div>
                </div>
                <div className="text-amber-100/40 group-hover:text-amber-100/80 group-hover:translate-x-2 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Additional Card for Balance */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative w-full bg-amber-900/30 backdrop-blur-xl rounded-3xl p-8 border border-amber-400/20 shadow-2xl">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl">
                  💰
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-2xl font-bold text-amber-100 mb-2">Portfolio</h3>
                  <p className="text-amber-200/70 text-base">
                    Track your investments and analyze performance metrics
                  </p>
                  <div className="flex items-center space-x-2 mt-4">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-amber-400 text-sm font-medium">Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full">
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-6 border border-amber-400/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-200 text-sm font-medium">Active Traders</p>
                <p className="text-amber-100 text-3xl font-bold">1,247</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/30 rounded-xl flex items-center justify-center text-2xl">
                👥
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-2xl p-6 border border-orange-400/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm font-medium">Daily Volume</p>
                <p className="text-orange-100 text-3xl font-bold">$2.4M</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center text-2xl">
                📊
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-md rounded-2xl p-6 border border-yellow-400/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-medium">Market Status</p>
                <p className="text-yellow-100 text-3xl font-bold">OPEN</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/30 rounded-xl flex items-center justify-center text-2xl">
                🔔
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-amber-200/60 text-sm flex items-center justify-center space-x-2">
            <span>📈</span>
            <span>Powered by WebSocket</span>
            <span>•</span>
            <span>Real-time updates</span>
            <span>•</span>
            <span>{new Date().getFullYear()} TradingHub</span>
            <span>•</span>
            <span>{new Date().toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Custom CSS for animation delays */}
      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default MainPage;