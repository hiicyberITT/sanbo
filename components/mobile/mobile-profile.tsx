'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { User, Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight, Star, Award, CreditCard, Smartphone, Globe, Moon, Sun } from 'lucide-react'
import { getCurrentUser, logout } from '@/lib/auth'
import type { User as UserType } from '@/lib/auth'

export function MobileProfile() {
  const [user, setUser] = useState<UserType | null>(getCurrentUser())
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [biometric, setBiometric] = useState(false)

  const handleNavigation = (path: string) => {
    console.log('Navigate to:', path)
    // Handle navigation based on path
    switch (path) {
      case 'account':
        window.location.href = '/account'
        break
      case 'security':
        window.location.href = '/account?tab=security'
        break
      case 'kyc':
        window.location.href = '/kyc/verify'
        break
      case 'support':
        window.location.href = '/support'
        break
      default:
        break
    }
  }

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout()
      window.location.href = '/'
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white text-xl font-bold">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-blue-100 text-sm">{user?.email}</div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className="bg-green-600 text-white text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
                <Badge className="bg-yellow-600 text-white text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  VIP 1
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">156</div>
            <div className="text-gray-400 text-sm">Giao dịch</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">45</div>
            <div className="text-gray-400 text-sm">Ngày hoạt động</div>
          </CardContent>
        </Card>
      </div>

      {/* Account Settings */}
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Tài khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-between text-gray-300 hover:text-white hover:bg-[#334155] h-12"
            onClick={() => handleNavigation('account')}
          >
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5" />
              <span>Thông tin cá nhân</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-between text-gray-300 hover:text-white hover:bg-[#334155] h-12"
            onClick={() => handleNavigation('security')}
          >
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5" />
              <span>Bảo mật</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-between text-gray-300 hover:text-white hover:bg-[#334155] h-12"
            onClick={() => handleNavigation('kyc')}
          >
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5" />
              <span>Xác minh KYC</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-600 text-white text-xs">Hoàn thành</Badge>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-between text-gray-300 hover:text-white hover:bg-[#334155] h-12"
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5" />
              <span>Phương thức thanh toán</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Cài đặt ứng dụng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="text-gray-300">Thông báo</span>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-gray-300" />
              <span className="text-gray-300">Sinh trắc học</span>
            </div>
            <Switch
              checked={biometric}
              onCheckedChange={setBiometric}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {darkMode ? <Moon className="w-5 h-5 text-gray-300" /> : <Sun className="w-5 h-5 text-gray-300" />}
              <span className="text-gray-300">Chế độ tối</span>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
          
          <Button
            variant="ghost"
            className="w-full justify-between text-gray-300 hover:text-white hover:bg-[#334155] h-12"
          >
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5" />
              <span>Ngôn ngữ</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Tiếng Việt</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Hỗ trợ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-between text-gray-300 hover:text-white hover:bg-[#334155] h-12"
            onClick={() => handleNavigation('support')}
          >
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5" />
              <span>Trung tâm hỗ trợ</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-between text-gray-300 hover:text-white hover:bg-[#334155] h-12"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5" />
              <span>Điều khoản sử dụng</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-between text-gray-300 hover:text-white hover:bg-[#334155] h-12"
          >
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5" />
              <span>Chính sách bảo mật</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardContent className="p-4">
          <Button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white h-12"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Đăng xuất
          </Button>
        </CardContent>
      </Card>

      {/* App Version */}
      <div className="text-center text-gray-500 text-sm">
        CryptoTrade Mobile v1.0.0
      </div>
    </div>
  )
}
