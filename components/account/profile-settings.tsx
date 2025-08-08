'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Edit, Save, AlertCircle, CheckCircle, Shield, CreditCard } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import type { User as UserType } from '@/lib/auth'

export function ProfileSettings() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    nationality: '',
    idType: '',
    idNumber: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    occupation: ''
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      // Lấy thông tin từ user và profile
      setProfileData({
        fullName: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email,
        dateOfBirth: currentUser.profile?.dateOfBirth || '',
        nationality: currentUser.profile?.nationality || '',
        idType: currentUser.profile?.idType || '',
        idNumber: currentUser.profile?.idNumber || '',
        address: currentUser.profile?.address || '',
        city: currentUser.profile?.city || '',
        country: currentUser.profile?.country || '',
        phone: currentUser.profile?.phone || '',
        occupation: currentUser.profile?.occupation || ''
      })
    }
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Cập nhật localStorage
      if (user) {
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            fullName: profileData.fullName,
            dateOfBirth: profileData.dateOfBirth,
            nationality: profileData.nationality,
            idType: profileData.idType,
            idNumber: profileData.idNumber,
            address: profileData.address,
            city: profileData.city,
            country: profileData.country,
            phone: profileData.phone,
            occupation: profileData.occupation
          }
        }
        
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
      }
      
      setSuccess('Cập nhật thông tin thành công!')
      setIsEditing(false)
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật thông tin')
    } finally {
      setIsLoading(false)
    }
  }

  const getKYCStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Đã xác thực</Badge>
      case 'pending':
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Chờ xác thực</Badge>
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Bị từ chối</Badge>
      default:
        return <Badge variant="outline"><Shield className="w-3 h-3 mr-1" />Chưa xác thực</Badge>
    }
  }

  if (!user) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="space-y-6">
      {/* KYC Status Alert */}
      {user.kycStatus !== 'approved' && (
        <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                Tài khoản của bạn chưa được xác thực danh tính. Vui lòng hoàn thành KYC để sử dụng đầy đủ tính năng.
              </span>
              <Button size="sm" className="ml-4">
                <CreditCard className="w-4 h-4 mr-2" />
                Xác thực ngay
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Thông tin cá nhân</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              {getKYCStatusBadge(user.kycStatus || 'none')}
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Thông tin tài khoản */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin tài khoản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Họ và tên</Label>
                {isEditing ? (
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Nhập họ và tên"
                  />
                ) : (
                  <div className="p-2 bg-muted rounded">{profileData.fullName || 'Chưa cập nhật'}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <div className="p-2 bg-muted rounded text-muted-foreground">
                  {profileData.email} (không thể thay đổi)
                </div>
              </div>

              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                {isEditing ? (
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Nhập số điện thoại"
                  />
                ) : (
                  <div className="p-2 bg-muted rounded">{profileData.phone || 'Chưa cập nhật'}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Nghề nghiệp</Label>
                {isEditing ? (
                  <Input
                    value={profileData.occupation}
                    onChange={(e) => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
                    placeholder="Nhập nghề nghiệp"
                  />
                ) : (
                  <div className="p-2 bg-muted rounded">{profileData.occupation || 'Chưa cập nhật'}</div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Thông tin cá nhân */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân (KYC)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày sinh</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                ) : (
                  <div className="p-2 bg-muted rounded">{profileData.dateOfBirth || 'Chưa cập nhật'}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Quốc tịch</Label>
                {isEditing ? (
                  <Select value={profileData.nationality} onValueChange={(value) => setProfileData(prev => ({ ...prev, nationality: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quốc tịch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VN">Việt Nam</SelectItem>
                      <SelectItem value="US">Hoa Kỳ</SelectItem>
                      <SelectItem value="JP">Nhật Bản</SelectItem>
                      <SelectItem value="KR">Hàn Quốc</SelectItem>
                      <SelectItem value="CN">Trung Quốc</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-muted rounded">
                    {profileData.nationality === 'VN' ? 'Việt Nam' : 
                     profileData.nationality === 'US' ? 'Hoa Kỳ' :
                     profileData.nationality === 'JP' ? 'Nhật Bản' :
                     profileData.nationality === 'KR' ? 'Hàn Quốc' :
                     profileData.nationality === 'CN' ? 'Trung Quốc' :
                     profileData.nationality || 'Chưa cập nhật'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Loại giấy tờ</Label>
                {isEditing ? (
                  <Select value={profileData.idType} onValueChange={(value) => setProfileData(prev => ({ ...prev, idType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại giấy tờ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CCCD">Căn cước công dân</SelectItem>
                      <SelectItem value="CMND">Chứng minh nhân dân</SelectItem>
                      <SelectItem value="PASSPORT">Hộ chiếu</SelectItem>
                      <SelectItem value="GPLX">Giấy phép lái xe</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-muted rounded">
                    {profileData.idType === 'CCCD' ? 'Căn cước công dân' :
                     profileData.idType === 'CMND' ? 'Chứng minh nhân dân' :
                     profileData.idType === 'PASSPORT' ? 'Hộ chiếu' :
                     profileData.idType === 'GPLX' ? 'Giấy phép lái xe' :
                     profileData.idType || 'Chưa cập nhật'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Số giấy tờ</Label>
                {isEditing ? (
                  <Input
                    value={profileData.idNumber}
                    onChange={(e) => setProfileData(prev => ({ ...prev, idNumber: e.target.value }))}
                    placeholder="Nhập số giấy tờ"
                  />
                ) : (
                  <div className="p-2 bg-muted rounded">{profileData.idNumber || 'Chưa cập nhật'}</div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Địa chỉ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Địa chỉ cư trú</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Địa chỉ</Label>
                {isEditing ? (
                  <Input
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Nhập địa chỉ"
                  />
                ) : (
                  <div className="p-2 bg-muted rounded">{profileData.address || 'Chưa cập nhật'}</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Thành phố</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.city}
                      onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Nhập thành phố"
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded">{profileData.city || 'Chưa cập nhật'}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Quốc gia</Label>
                  {isEditing ? (
                    <Select value={profileData.country} onValueChange={(value) => setProfileData(prev => ({ ...prev, country: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quốc gia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VN">Việt Nam</SelectItem>
                        <SelectItem value="US">Hoa Kỳ</SelectItem>
                        <SelectItem value="JP">Nhật Bản</SelectItem>
                        <SelectItem value="KR">Hàn Quốc</SelectItem>
                        <SelectItem value="CN">Trung Quốc</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-2 bg-muted rounded">
                      {profileData.country === 'VN' ? 'Việt Nam' : 
                       profileData.country === 'US' ? 'Hoa Kỳ' :
                       profileData.country === 'JP' ? 'Nhật Bản' :
                       profileData.country === 'KR' ? 'Hàn Quốc' :
                       profileData.country === 'CN' ? 'Trung Quốc' :
                       profileData.country || 'Chưa cập nhật'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trading Limits */}
          {user.tradingLimits && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Giới hạn giao dịch</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Hàng ngày</div>
                    <div className="text-2xl font-bold">
                      {user.kycStatus === 'approved' ? '$10,000' : '$0'}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Hàng tháng</div>
                    <div className="text-2xl font-bold">
                      {user.kycStatus === 'approved' ? '$100,000' : '$0'}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Rút tiền</div>
                    <div className="text-2xl font-bold">
                      {user.kycStatus === 'approved' ? '$5,000' : '$0'}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
