'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Star, TrendingUp, TrendingDown, ArrowLeft, BarChart3, Plus, Minus } from 'lucide-react'

interface CoinData {
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap: number
  icon: string
  isFavorite: boolean
}

export function MobileMarketList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null)
  const [favorites, setFavorites] = useState<string[]>(['BTCUSDT', 'ETHUSDT'])

  const marketData: CoinData[] = [
    {
      symbol: 'BTCUSDT',
      name: 'Bitcoin',
      price: 40938.69,
      change24h: -316.64,
      changePercent24h: -0.75,
      volume24h: 25190000000,
      marketCap: 612540000000000,
      icon: '₿',
      isFavorite: true
    },
    {
      symbol: 'ETHUSDT',
      name: 'Ethereum',
      price: 2708.58,
      change24h: -103.42,
      changePercent24h: -3.68,
      volume24h: 15678900000,
      marketCap: 325000000000,
      icon: 'Ξ',
      isFavorite: true
    },
    {
      symbol: 'BNBUSDT',
      name: 'BNB',
      price: 324.59,
      change24h: 3.89,
      changePercent24h: 1.2,
      volume24h: 1234567000,
      marketCap: 48000000000,
      icon: '🔶',
      isFavorite: false
    },
    {
      symbol: 'SOLUSDT',
      name: 'Solana',
      price: 100.72,
      change24h: 2.23,
      changePercent24h: 2.26,
      volume24h: 987654000,
      marketCap: 45000000000,
      icon: '◎',
      isFavorite: false
    },
    {
      symbol: 'ADAUSDT',
      name: 'Cardano',
      price: 0.505976,
      change24h: -0.015,
      changePercent24h: -2.9,
      volume24h: 456789000,
      marketCap: 18000000000,
      icon: '₳',
      isFavorite: false
    }
  ]

  const filteredMarkets = marketData.filter(market => {
    const matchesSearch = market.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedCategory === 'favorites') {
      return matchesSearch && favorites.includes(market.symbol)
    }
    if (selectedCategory === 'gainers') {
      return matchesSearch && market.changePercent24h > 0
    }
    if (selectedCategory === 'losers') {
      return matchesSearch && market.changePercent24h < 0
    }
    return matchesSearch
  })

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    )
  }

  const handleCoinSelect = (coin: CoinData) => {
    setSelectedCoin(coin)
  }

  const handleBackToList = () => {
    setSelectedCoin(null)
  }

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(6)}`
    } else if (price < 100) {
      return `$${price.toFixed(2)}`
    } else {
      return `$${price.toLocaleString()}`
    }
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`
    }
    return `$${volume.toFixed(2)}`
  }

  // Coin Detail View
  if (selectedCoin) {
    return (
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToList}
            className="p-2 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFavorite(selectedCoin.symbol)}
              className={`p-2 ${
                favorites.includes(selectedCoin.symbol) 
                  ? 'text-yellow-400' 
                  : 'text-gray-400'
              }`}
            >
              <Star className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Coin Info */}
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {selectedCoin.icon}
              </div>
              <div>
                <div className="text-white text-xl font-bold">{selectedCoin.symbol}</div>
                <div className="text-gray-400">{selectedCoin.name}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-white text-3xl font-bold">
                {formatPrice(selectedCoin.price)}
              </div>
              <div className={`flex items-center space-x-1 ${
                selectedCoin.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {selectedCoin.changePercent24h >= 0 ? 
                  <TrendingUp className="w-4 h-4" /> : 
                  <TrendingDown className="w-4 h-4" />
                }
                <span className="font-medium">
                  {selectedCoin.changePercent24h >= 0 ? '+' : ''}
                  {selectedCoin.changePercent24h.toFixed(2)}%
                </span>
                <span>
                  ({selectedCoin.changePercent24h >= 0 ? '+' : ''}${selectedCoin.change24h.toFixed(2)})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">24h Volume</span>
              <span className="text-white">{formatVolume(selectedCoin.volume24h)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Market Cap</span>
              <span className="text-white">{formatVolume(selectedCoin.marketCap)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">24h High</span>
              <span className="text-white">{formatPrice(selectedCoin.price * 1.05)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">24h Low</span>
              <span className="text-white">{formatPrice(selectedCoin.price * 0.95)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-green-600 hover:bg-green-700 text-white h-12">
            <Plus className="w-4 h-4 mr-2" />
            Mua {selectedCoin.symbol.replace('USDT', '')}
          </Button>
          <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white h-12">
            <Minus className="w-4 h-4 mr-2" />
            Bán {selectedCoin.symbol.replace('USDT', '')}
          </Button>
        </div>
      </div>
    )
  }

  // Market List View
  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Tìm kiếm coin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-[#1E293B] border-[#334155] text-white placeholder-gray-400"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-[#1E293B]">
          <TabsTrigger value="all" className="text-xs text-gray-300 data-[state=active]:text-white">
            Tất cả
          </TabsTrigger>
          <TabsTrigger value="favorites" className="text-xs text-gray-300 data-[state=active]:text-white">
            Yêu thích
          </TabsTrigger>
          <TabsTrigger value="gainers" className="text-xs text-gray-300 data-[state=active]:text-white">
            Tăng
          </TabsTrigger>
          <TabsTrigger value="losers" className="text-xs text-gray-300 data-[state=active]:text-white">
            Giảm
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Market List */}
      <div className="space-y-2">
        {filteredMarkets.map((coin) => (
          <Card 
            key={coin.symbol} 
            className="bg-[#1E293B] border-[#334155] cursor-pointer hover:bg-[#334155] transition-colors"
            onClick={() => handleCoinSelect(coin)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {coin.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{coin.symbol}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(coin.symbol)
                        }}
                        className={`p-1 ${
                          favorites.includes(coin.symbol) 
                            ? 'text-yellow-400' 
                            : 'text-gray-400'
                        }`}
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-gray-400 text-sm">{coin.name}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium">
                    {formatPrice(coin.price)}
                  </div>
                  <div className={`text-sm ${
                    coin.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {coin.changePercent24h >= 0 ? '+' : ''}
                    {coin.changePercent24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Stats */}
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-gray-400 text-sm">Tổng thị trường</div>
              <div className="text-white font-medium">$1.2T</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">24h Volume</div>
              <div className="text-white font-medium">$45.6B</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
