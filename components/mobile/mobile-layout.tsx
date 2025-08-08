'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MobileTrading } from './mobile-trading'
import { MobileWallet } from './mobile-wallet'
import { MobileProfile } from './mobile-profile'
import { MobileMarketList } from './mobile-market-list'
import { Home, TrendingUp, Wallet, User, BarChart3, Bell, Search, Menu, X, Settings, LogOut } from 'lucide-react'
import { getCurrentUser, logout } from '@/lib/auth'
import type { User } from '@/lib/auth'

export function MobileLayout() {
  const [activeTab, setActiveTab] = useState('home')
  const [user, setUser] = useState<User | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setShowMenu(false)
  }

  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action)
    // Handle quick actions like buy, sell, etc.
    switch (action) {
      case 'buy':
        setActiveTab('trading')
        break
      case 'sell':
        setActiveTab('trading')
        break
      case 'wallet':
        setActiveTab('wallet')
        break
      case 'markets':
        setActiveTab('markets')
        break
      default:
        break
    }
  }

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout()
      window.location.reload()
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'trading':
        return <MobileTrading />
      case 'wallet':
        return <MobileWallet />
      case 'profile':
        return <MobileProfile />
      case 'markets':
        return <MobileMarketList />
      default:
        return (
          <div className="p-4 space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white">
              <h2 className="text-lg font-bold mb-1">
                Chào mừng, {user?.firstName || 'Trader'}!
              </h2>
              <p className="text-blue-100 text-sm">
                Sẵn sàng giao dịch crypto hôm nay
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1E293B] rounded-lg p-4">
                <div className="text-gray-400 text-sm">Tổng tài sản</div>
                <div className="text-white text-xl font-bold">$12,450.67</div>
                <div className="text-green-400 text-sm">+2.34%</div>
              </div>
              <div className="bg-[#1E293B] rounded-lg p-4">
                <div className="text-gray-400 text-sm">P&L hôm nay</div>
                <div className="text-white text-xl font-bold">+$234.56</div>
                <div className="text-green-400 text-sm">+1.92%</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold">Thao tác nhanh</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => handleQuickAction('buy')}
                  className="bg-green-600 hover:bg-green-700 text-white h-12"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Mua
                </Button>
                <Button 
                  onClick={() => handleQuickAction('sell')}
                  variant="outline" 
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white h-12"
                >
                  <TrendingUp className="w-4 h-4 mr-2 rotate-180" />
                  Bán
                </Button>
                <Button 
                  onClick={() => handleQuickAction('wallet')}
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white h-12"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Ví
                </Button>
                <Button 
                  onClick={() => handleQuickAction('markets')}
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white h-12"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Thị trường
                </Button>
              </div>
            </div>

            {/* Top Coins */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold">Top Coins</h3>
              <div className="space-y-2">
                {[
                  { symbol: 'BTC', name: 'Bitcoin', price: '$41,700', change: '+0.28%', positive: true },
                  { symbol: 'ETH', name: 'Ethereum', price: '$2,708', change: '-3.68%', positive: false },
                  { symbol: 'BNB', name: 'BNB', price: '$324', change: '+1.20%', positive: true },
                ].map((coin) => (
                  <div key={coin.symbol} className="bg-[#1E293B] rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {coin.symbol[0]}
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{coin.symbol}</div>
                        <div className="text-gray-400 text-xs">{coin.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium text-sm">{coin.price}</div>
                      <div className={`text-xs ${coin.positive ? 'text-green-400' : 'text-red-400'}`}>
                        {coin.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1426] text-white flex flex-col">
      {/* Mobile Header */}
      <header className="bg-[#0F172A] border-b border-[#1E293B] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CT</span>
          </div>
          <span className="text-lg font-bold text-white">CryptoTrade</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 text-gray-300 hover:text-white"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {notificationCount}
              </Badge>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-300 hover:text-white"
          >
            {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="absolute top-16 left-0 right-0 bg-[#0F172A] border-b border-[#1E293B] z-50">
          <div className="p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white"
              onClick={() => handleTabChange('profile')}
            >
              <Settings className="w-4 h-4 mr-3" />
              Cài đặt
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Đăng xuất
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0F172A] border-t border-[#1E293B] px-4 py-2">
        <div className="flex items-center justify-around">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTabChange('home')}
            className={`flex flex-col items-center space-y-1 p-2 ${
              activeTab === 'home' ? 'text-cyan-400' : 'text-gray-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Trang chủ</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTabChange('markets')}
            className={`flex flex-col items-center space-y-1 p-2 ${
              activeTab === 'markets' ? 'text-cyan-400' : 'text-gray-400'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">Thị trường</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTabChange('trading')}
            className={`flex flex-col items-center space-y-1 p-2 ${
              activeTab === 'trading' ? 'text-cyan-400' : 'text-gray-400'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs">Giao dịch</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTabChange('wallet')}
            className={`flex flex-col items-center space-y-1 p-2 ${
              activeTab === 'wallet' ? 'text-cyan-400' : 'text-gray-400'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-xs">Ví</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTabChange('profile')}
            className={`flex flex-col items-center space-y-1 p-2 ${
              activeTab === 'profile' ? 'text-cyan-400' : 'text-gray-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Tài khoản</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
