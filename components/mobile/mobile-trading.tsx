'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, ArrowUpDown, DollarSign, Percent, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export function MobileTrading() {
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const currentPrice = 41700.12
  const balance = 1250.67

  const handleOrderTypeChange = (type: 'market' | 'limit' | 'stop') => {
    setOrderType(type)
  }

  const handleQuickAmount = (percentage: number) => {
    const quickAmount = (balance * percentage / 100).toFixed(2)
    setAmount(quickAmount)
  }

  const handleSubmitOrder = async () => {
    if (!amount || (orderType !== 'market' && !price)) {
      alert('Vui lòng nhập đầy đủ thông tin')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setShowSuccess(true)
      setAmount('')
      setPrice('')
      
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Order submission failed:', error)
      alert('Đặt lệnh thất bại. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-600/20 border border-green-600 rounded-lg p-3 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400 text-sm">Đặt lệnh thành công!</span>
        </div>
      )}

      {/* Current Price */}
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm">BTC/USDT</div>
              <div className="text-white text-2xl font-bold">
                ${currentPrice.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">+0.28%</span>
              </div>
              <div className="text-gray-400 text-sm">+$116.64</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Form */}
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">Giao dịch</CardTitle>
            <Badge className="bg-blue-600 text-white">Spot</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Buy/Sell Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => setTradeType('buy')}
              className={`h-10 ${
                tradeType === 'buy' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-[#334155] text-gray-300 hover:bg-[#475569]'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Mua
            </Button>
            <Button
              onClick={() => setTradeType('sell')}
              className={`h-10 ${
                tradeType === 'sell' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-[#334155] text-gray-300 hover:bg-[#475569]'
              }`}
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Bán
            </Button>
          </div>

          {/* Order Type */}
          <div className="space-y-2">
            <div className="text-gray-400 text-sm">Loại lệnh</div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                onClick={() => handleOrderTypeChange('market')}
                className={`text-xs ${
                  orderType === 'market' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-[#334155] text-gray-300'
                }`}
              >
                Market
              </Button>
              <Button
                size="sm"
                onClick={() => handleOrderTypeChange('limit')}
                className={`text-xs ${
                  orderType === 'limit' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-[#334155] text-gray-300'
                }`}
              >
                Limit
              </Button>
              <Button
                size="sm"
                onClick={() => handleOrderTypeChange('stop')}
                className={`text-xs ${
                  orderType === 'stop' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-[#334155] text-gray-300'
                }`}
              >
                Stop
              </Button>
            </div>
          </div>

          {/* Price Input (for limit/stop orders) */}
          {orderType !== 'market' && (
            <div className="space-y-2">
              <div className="text-gray-400 text-sm">Giá</div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-10 bg-[#334155] border-[#475569] text-white"
                />
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-gray-400 text-sm">Số lượng</div>
              <div className="text-gray-400 text-xs">
                Khả dụng: ${balance.toLocaleString()}
              </div>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 bg-[#334155] border-[#475569] text-white"
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75, 100].map((percentage) => (
              <Button
                key={percentage}
                size="sm"
                variant="outline"
                onClick={() => handleQuickAmount(percentage)}
                className="text-xs border-[#475569] text-gray-300 hover:bg-[#475569]"
              >
                {percentage}%
              </Button>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-[#334155] rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tổng</span>
              <span className="text-white">
                ${amount ? (parseFloat(amount) * currentPrice).toLocaleString() : '0.00'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Phí</span>
              <span className="text-white">$0.50</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitOrder}
            disabled={isSubmitting || !amount}
            className={`w-full h-12 font-medium ${
              tradeType === 'buy'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Đang xử lý...</span>
              </div>
            ) : (
              `${tradeType === 'buy' ? 'Mua' : 'Bán'} BTC`
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Lệnh gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'buy', amount: '0.025', price: '41,650', status: 'completed', time: '2 phút trước' },
              { type: 'sell', amount: '0.015', price: '41,720', status: 'pending', time: '5 phút trước' },
              { type: 'buy', amount: '0.050', price: '41,580', status: 'completed', time: '10 phút trước' },
            ].map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#334155] rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    order.type === 'buy' ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <div>
                    <div className="text-white text-sm font-medium">
                      {order.type === 'buy' ? 'Mua' : 'Bán'} {order.amount} BTC
                    </div>
                    <div className="text-gray-400 text-xs">
                      ${order.price} • {order.time}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`text-xs ${
                    order.status === 'completed' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-yellow-600 text-white'
                  }`}>
                    {order.status === 'completed' ? 'Hoàn thành' : 'Đang chờ'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
