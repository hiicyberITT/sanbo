import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock verification data - in production, fetch from database
    const mockVerifications = [
      {
        id: '1',
        documentType: 'cccd',
        status: 'approved',
        confidence: 0.95,
        submittedAt: new Date('2024-01-10T10:00:00'),
        reviewedAt: new Date('2024-01-11T14:30:00'),
        extractedData: {
          number: '001234567890',
          fullName: 'NGUYỄN VĂN A',
          dateOfBirth: '01/01/1990',
          gender: 'Nam',
          nationality: 'Việt Nam'
        }
      },
      {
        id: '2',
        documentType: 'passport',
        status: 'pending_review',
        confidence: 0.78,
        submittedAt: new Date('2024-01-15T16:20:00'),
        estimatedReviewTime: '2-3 ngày làm việc',
        extractedData: {
          number: 'A1234567',
          fullName: 'NGUYEN VAN A',
          dateOfBirth: '01/01/1990',
          nationality: 'VNM'
        }
      }
    ]

    // Filter verifications for current user
    const userVerifications = mockVerifications.map(v => ({
      ...v,
      submittedAt: new Date(v.submittedAt),
      reviewedAt: v.reviewedAt ? new Date(v.reviewedAt) : undefined
    }))

    return NextResponse.json({
      success: true,
      verifications: userVerifications,
      summary: {
        total: userVerifications.length,
        approved: userVerifications.filter(v => v.status === 'approved').length,
        pending: userVerifications.filter(v => v.status === 'pending_review').length,
        rejected: userVerifications.filter(v => v.status === 'rejected').length
      }
    })

  } catch (error) {
    console.error('Get verification status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
