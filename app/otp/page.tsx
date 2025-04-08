'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { verifyOTP } from "@/app/services/RequestManager"

export default function OTPVerification() {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!otp || otp.length !== 6) {
      toast.error("Vui lòng nhập mã OTP 6 số")
      return
    }

    setIsLoading(true)

    try {
      const success = await verifyOTP(otp)

      if (success) {
        toast.success("Xác thực thành công. Vui lòng tạo mật khẩu mới")
        router.push('/doi-mat-khau')
      } else {
        toast.error("Có lỗi xảy ra khi xác thực OTP")
      }
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Xác thực OTP</CardTitle>
          <CardDescription>
            Nhập mã OTP đã được gửi đến email của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác thực
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
