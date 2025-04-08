"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signInMutation = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    try {
      const result = await signInMutation.mutateAsync(formData);
      if (result.success && result.data) {
        // Extract role from token
        const token = result.data.accessToken;
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        const claims = JSON.parse(decodedPayload);
        const userRole = claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        
        if (userRole === "Landlord") {
          router.push("/rooms");
        } else if (userRole === "Tenant") {
          router.push("/");
        } else {
          router.push("/");
        }
      } else if (result.message) {
        // This branch shouldn't be reached with the current implementation
        // but keeping it for safety
        setErrorMessage(result.message);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error.message || "Sai tên đăng nhập hoặc mật khẩu");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập thông tin của bạn để đăng nhập vào tài khoản.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {(errorMessage || signInMutation.error) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"
              >
                {errorMessage || signInMutation.error?.message}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700"
              >
                Tên đăng nhập
              </Label>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Input
                  id="userName"
                  type="text"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="Nhập tên đăng nhập"
                />
              </motion.div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="relative"
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </motion.div>
            </div>

            <div className="flex items-center">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={() => setRemember(!remember)}
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <Label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700"
              >
                Ghi nhớ tôi
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending ? "Đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-4">
          <Link
            href="/register"
            className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tạo tài khoản mới
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}