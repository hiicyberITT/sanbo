'use client'

import { DocumentVerification } from '@/components/kyc/document-verification'
import { VerificationStatus } from '@/components/kyc/verification-status'
import { ThemeToggle } from '@/components/theme-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Bitcoin, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function KYCVerifyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/account">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Bitcoin className="w-8 h-8 text-orange-500" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Xác minh giấy tờ</h1>
                  <p className="text-sm text-muted-foreground">Xác minh CCCD, CMND hoặc Hộ chiếu với AI</p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <Tabs defaultValue="verify" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="verify">Xác minh mới</TabsTrigger>
            <TabsTrigger value="status">Trạng thái</TabsTrigger>
          </TabsList>

          <TabsContent value="verify">
            <DocumentVerification />
          </TabsContent>

          <TabsContent value="status">
            <VerificationStatus />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
