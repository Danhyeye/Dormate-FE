"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@/app/hooks/useAuth";
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
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function RegisterForm() {
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;
    dob: string;
    phoneNumber: string;
    province: string;
    district: string;
    ward: string;
    address: string;
    type: number;
    gender: boolean;
  }>({
    fullName: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    dob: "",
    phoneNumber: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    type: 2,
    gender: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const signUpMutation = useSignUp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên là bắt buộc";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.userName.trim()) {
      newErrors.userName = "Tên đăng nhập là bắt buộc";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    }

    if (!formData.dob) {
      newErrors.dob = "Ngày sinh là bắt buộc";
    }

    if (!formData.province) {
      newErrors.province = "Tỉnh/Thành phố là bắt buộc";
    }

    if (!formData.district) {
      newErrors.district = "Quận/Huyện là bắt buộc";
    }

    if (!formData.ward) {
      newErrors.ward = "Phường/Xã là bắt buộc";
    }

    if (!formData.address) {
      newErrors.address = "Địa chỉ là bắt buộc";
    }

    if (![2, 3].includes(formData.type)) {
      newErrors.type = "Vui lòng chọn loại tài khoản";
    }

    if (!agreeTerms) {
      newErrors.terms = "Bạn phải đồng ý với các điều khoản và điều kiện";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const signUpData = {
        ...formData,
        status: 1,
      };

      const result = await signUpMutation.mutateAsync(signUpData);
      if (result.success) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ form: "Đăng ký thất bại. Vui lòng thử lại." });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tạo tài khoản</CardTitle>
          <CardDescription>
            Điền thông tin của bạn để tạo tài khoản mới.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.form && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"
              >
                {errors.form}
              </motion.div>
            )}

            

            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Họ và tên
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-emerald-500"
                } focus:border-emerald-500 outline-none transition-all`}
                placeholder="Nguyễn Văn A"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-emerald-500"
                } focus:border-emerald-500 outline-none transition-all`}
                placeholder="example@gmail.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700"
              >
                Tên đăng nhập
              </Label>
              <Input
                id="userName"
                name="userName"
                type="text"
                value={formData.userName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.userName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-emerald-500"
                } focus:border-emerald-500 outline-none transition-all`}
                placeholder="username"
              />
              {errors.userName && (
                <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Số điện thoại
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.phoneNumber
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-emerald-500"
                } focus:border-emerald-500 outline-none transition-all`}
                placeholder="0987654321"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Ngày sinh
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      errors.dob
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-emerald-500"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dob ? (
                      format(new Date(formData.dob), "dd/MM/yyyy")
                    ) : (
                      <span className="text-gray-500">Chọn ngày sinh</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dob ? new Date(formData.dob) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setFormData((prev) => ({
                          ...prev,
                          dob: date.toISOString().split("T")[0],
                        }));
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dob && (
                <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="province"
                className="block text-sm font-medium text-gray-700"
              >
                Tỉnh/Thành phố
              </Label>
              <Input
                id="province"
                name="province"
                type="text"
                value={formData.province}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.province
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-emerald-500"
                } focus:border-emerald-500 outline-none transition-all`}
                placeholder="Hồ Chí Minh"
              />
              {errors.province && (
                <p className="mt-1 text-sm text-red-600">{errors.province}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700"
              >
                Quận/Huyện
              </Label>
              <Input
                id="district"
                name="district"
                type="text"
                value={formData.district}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.district
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-emerald-500"
                } focus:border-emerald-500 outline-none transition-all`}
                placeholder="Quận 1"
              />
              {errors.district && (
                <p className="mt-1 text-sm text-red-600">{errors.district}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="ward"
                className="block text-sm font-medium text-gray-700"
              >
                Phường/Xã
              </Label>
              <Input
                id="ward"
                name="ward"
                type="text"
                value={formData.ward}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.ward
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-emerald-500"
                } focus:border-emerald-500 outline-none transition-all`}
                placeholder="Phường Bến Nghé"
              />
              {errors.ward && (
                <p className="mt-1 text-sm text-red-600">{errors.ward}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Địa chỉ
              </Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.address
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-emerald-500"
                } focus:border-emerald-500 outline-none transition-all`}
                placeholder="123 Đường ABC"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border pr-10 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-emerald-500"
                  } focus:border-emerald-500 outline-none transition-all`}
                  placeholder="Mật khẩu"
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
              </div>
              {errors.password ? (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Mật khẩu phải có ít nhất 8 ký tự
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Nhập lại mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border pr-10 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-emerald-500"
                  } focus:border-emerald-500 outline-none transition-all`}
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Bạn muốn đăng ký với tư cách
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`relative w-full p-4 rounded-lg border-2 transition-all ${
                    formData.type === 2
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-600 hover:bg-emerald-50"
                  } ${errors.type ? "border-red-500" : ""}`}
                  onClick={() => setFormData((prev) => ({ ...prev, type: 2 }))}
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="text-3xl">🏠</span>
                    <span className="font-medium text-gray-900">Người thuê</span>
                  </div>
                  {formData.type === 2 && (
                    <div className="absolute top-2 right-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  className={`relative w-full p-4 rounded-lg border-2 transition-all ${
                    formData.type === 3
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-600 hover:bg-emerald-50"
                  } ${errors.type ? "border-red-500" : ""}`}
                  onClick={() => setFormData((prev) => ({ ...prev, type: 3 }))}
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="text-3xl">🏘️</span>
                    <span className="font-medium text-gray-900">Chủ nhà</span>
                  </div>
                  {formData.type === 3 && (
                    <div className="absolute top-2 right-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
                    </div>
                  )}
                </button>
              </div>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <Checkbox
                  id="terms"
                  name="terms"
                  checked={agreeTerms}
                  onCheckedChange={() => setAgreeTerms(!agreeTerms)}
                  className="h-4 w-4 border-gray-300 rounded focus:ring-emerald-500 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white"
                />
              </div>
              <div className="ml-3">
                <Label htmlFor="terms" className="text-sm text-gray-700">
                  Tôi đồng ý với{" "}
                  <a
                    href="#"
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    Điều khoản và điều kiện
                  </a>{" "}
                  và{" "}
                  <a
                    href="#"
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    Chính sách bảo mật
                  </a>
                </Label>
                {errors.terms && (
                  <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending
                ? "Đang tạo tài khoản..."
                : "Tạo tài khoản"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-4">
          <Link
            href="/login"
            className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Trở về đăng nhập
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}