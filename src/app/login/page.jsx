
"use client";

import { authClient } from "@/lib/auth-client";
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  Separator,
  TextField,
  Description,
} from "@heroui/react";

import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Mail,
  LockKeyhole,
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(
      e.currentTarget,
    );

    const user = Object.fromEntries(
      formData.entries(),
    );

    const { data, error } =
      await authClient.signIn.email({
        email: user.email,
        password: user.password,
      });

    if (data) {
      redirect("/");
    }

    if (error) {
      alert("Invalid credentials");
    }
  };

  const handleGoogleSignin =
    async () => {
      await authClient.signIn.social({
        provider: "google",
      });
    };

  return (
    <section className="min-h-screen bg-[#07111f] relative overflow-hidden flex items-center justify-center px-6 py-16">
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full"></div>

      {/* Card */}
      <Card className="w-full max-w-xl bg-[#0d1b2a]/95 border border-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] rounded-3xl overflow-hidden z-10">
        <div className="p-10 md:p-14">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="uppercase tracking-[5px] text-cyan-400 text-sm mb-3 font-semibold">
              Welcome Back
            </p>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white">
              Login
            </h1>

            <p className="text-gray-400 mt-5 text-lg leading-relaxed">
              Access your study room
              bookings and manage your
              workspace easily.
            </p>
          </div>

          {/* Form */}
          <Form
            onSubmit={onSubmit}
            className="flex flex-col gap-7 w-full"
          >
            {/* Email */}
            <TextField
              isRequired
              name="email"
              type="email"
              className="w-full"
              validate={(value) => {
                if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                    value,
                  )
                ) {
                  return "Please enter a valid email address";
                }

                return null;
              }}
            >
              <Label className="text-gray-300 mb-2 text-sm">
                Email Address
              </Label>

              <div className="relative w-full">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />

                <Input
                  placeholder="john@example.com"
                  className="w-full pl-12"
                />
              </div>

              <FieldError className="text-red-400 text-sm mt-2" />
            </TextField>

            {/* Password */}
            <TextField
              isRequired
              minLength={8}
              name="password"
              type="password"
              className="w-full"
              validate={(value) => {
                if (
                  value.length < 8
                ) {
                  return "Password must be at least 8 characters";
                }

                if (
                  !/[A-Z]/.test(
                    value,
                  )
                ) {
                  return "Password must contain at least one uppercase letter";
                }

                if (
                  !/[0-9]/.test(
                    value,
                  )
                ) {
                  return "Password must contain at least one number";
                }

                return null;
              }}
            >
              <Label className="text-gray-300 mb-2 text-sm">
                Password
              </Label>

              <div className="relative w-full">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />

                <Input
                  placeholder="Enter your password"
                  className="w-full pl-12"
                />
              </div>

              <Description className="text-gray-500 text-sm mt-2">
                Must contain at least
                8 characters, 1
                uppercase letter and 1
                number.
              </Description>

              <FieldError className="text-red-400 text-sm mt-2" />
            </TextField>

            {/* Forgot Password */}
            <div className="w-full flex justify-end">
              <button
                type="button"
                className="text-cyan-400 hover:text-cyan-300 transition text-sm font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg shadow-xl transition-all duration-300"
            >
              Login
            </Button>
          </Form>

          {/* Divider */}
          <div className="flex justify-center items-center gap-4 my-8">
            <Separator className="bg-white/10" />

            <div className="whitespace-nowrap text-gray-400 text-sm">
              OR CONTINUE WITH
            </div>

            <Separator className="bg-white/10" />
          </div>

          {/* Google Login */}
          <Button
            onClick={
              handleGoogleSignin
            }
            variant="bordered"
            className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-lg font-semibold transition-all duration-300"
          >
            <FcGoogle className="text-2xl" />
            Sign in with Google
          </Button>

          {/* Register */}
          <div className="text-center mt-8">
            <p className="text-gray-400">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default LoginPage;