'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertCircle, XCircle, FileText, User, Shield, RefreshCw, Eye } from 'lucide-react'

interface VerificationStatus {
  id: string
  documentType: 'cccd' | 'cmnd' | 'passport'
  status: 'pending' | 'approved' | 'rejected' | 'pending_review'
  confidence: number
  submittedAt: Date
  reviewedAt?: Date
  estimatedReviewTime?: string
  extractedData: any
  notes?: string[]
}

export function VerificationStatus() {
  const [verifications, setVerifications] = useState<VerificationStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchVerificationStatus()
  }, [])

  const fetchVerificationStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/kyc/verification-status')
      const data = await response.json()
      
      if (response.ok) {
        setVerifications(data.verifications || [])
      }
    } catch (error) {
      console.error('Error fetching verification status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'pending_review':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Đã duyệt</Badge>
      case 'rejected':
        return <Badge variant="destructive">Bị từ chối</Badge>
      case 'pending_review':
        return <Badge variant="secondary">Đang xem xét</Badge>
      default:
        return <Badge variant="outline">Đang xử lý</Badge>
    }
  }

  const getDocumentTypeName = (type: string) => {
    const names = {
      cccd: 'Căn cước công dân',
      cmnd: 'Chứng minh nhân dân',
      passport: 'Hộ chiếu'
    }
    return names[type as keyof typeof names] || type
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Đang tải trạng thái xác minh...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (verifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Chưa có xác minh nào</h3>
          <p className="text-muted-foreground mb-4">
            Bạn chưa gửi giấy tờ nào để xác minh
          </p>
          <Button>
            Bắt đầu xác minh
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trạng thái xác minh</h2>
        <Button variant="outline" onClick={fetchVerificationStatus}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {verifications.map((verification) => (
        <Card key={verification.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(verification.status)}
                {getDocumentTypeName(verification.documentType)}
              </CardTitle>
              {getStatusBadge(verification.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Số giấy tờ:</span>
                <p className="font-mono font-medium">{verification.extractedData.number}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Họ tên:</span>
                <p className="font-medium">{verification.extractedData.fullName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Ngày gửi:</span>
                <p>{verification.submittedAt.toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Độ tin cậy:</span>
                <div className="flex items-center gap-2">
                  <Progress value={verification.confidence * 100} className="h-2 flex-1" />
                  <span className="text-xs">{Math.round(verification.confidence * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Status Details */}
            {verification.status === 'pending_review' && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Giấy tờ của bạn đang được xem xét thủ công. 
                  Thời gian dự kiến: {verification.estimatedReviewTime || '1-3 ngày làm việc'}
                </AlertDescription>
              </Alert>
            )}

            {verification.status === 'approved' && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Giấy tờ đã được xác minh thành công. Tài khoản của bạn đã được nâng cấp.
                  {verification.reviewedAt && (
                    <span className="block mt-1 text-sm">
                      Duyệt lúc: {verification.reviewedAt.toLocaleString('vi-VN')}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {verification.status === 'rejected' && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Giấy tờ không thể xác minh. Vui lòng kiểm tra lại thông tin và gửi lại.
                  {verification.notes && verification.notes.length > 0 && (
                    <div className="mt-2">
                      <strong>Lý do:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {verification.notes.map((note, index) => (
                          <li key={index} className="text-sm">{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Xem chi tiết
              </Button>
              
              {verification.status === 'rejected' && (
                <Button size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Gửi lại
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Overall KYC Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Tổng quan xác minh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <User className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold">Cấp độ hiện tại</h4>
              <Badge variant="outline" className="mt-1">
                {verifications.some(v => v.status === 'approved') ? 'Đã xác minh' : 'Chưa xác minh'}
              </Badge>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <FileText className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold">Giấy tờ đã duyệt</h4>
              <p className="text-2xl font-bold text-green-600">
                {verifications.filter(v => v.status === 'approved').length}
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h4 className="font-semibold">Đang chờ duyệt</h4>
              <p className="text-2xl font-bold text-yellow-600">
                {verifications.filter(v => v.status === 'pending_review').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
