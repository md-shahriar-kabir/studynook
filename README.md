





























in my booking section somethings doesnot work, make it simple, then I will include function from database to cancel this booking

<div className="bg-[#0d1b2a] border border-white/10 rounded-3xl p-16 text-center">
  {/* Small Tag */}
  <p className="uppercase tracking-[4px] text-cyan-400 text-sm mb-4">
    No Reservations Found
  </p>

  {/* Heading */}
  <h2 className="text-4xl md:text-5xl font-extrabold text-white">
    You have no bookings yet.
  </h2>

  {/* Description */}
  <p className="text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed text-lg">
    Discover modern and comfortable
    study rooms designed for focus,
    collaboration, and productivity.
    Start exploring available spaces
    and book your perfect room today.
  </p>

  {/* Button */}
  <div className="mt-10">
    <Link href="/rooms">
      <button className="bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 px-8 py-4 rounded-2xl text-white font-bold shadow-2xl">
        Browse Collection
      </button>
    </Link>
  </div>
</div>

Console Error



An empty string ("") was passed to the src attribute. This may cause the browser to download the whole page again over the network. To fix this, either do not render the element at all or pass null to src instead of an empty string. what is the problem here, I am using Proxy but didnt work

This error means somewhere in your app you are rendering:

<Image src="" />
or

<img src="" />
An empty string ("") is invalid for src.

Most likely problem in your code:

<Image
  src={user?.image}
  alt={user?.name}
  fill
/>
If user?.image is empty ("") or undefined, Next.js throws this warning.

Fix it like this:

<Image
  src={
    user?.image ||
    "https://i.pravatar.cc/300"
  }
  alt={user?.name || "User"}
  fill
  className="object-cover"
/>
You also have another possible issue here:

<Image
  src={booking.image}
  alt={booking.roomName}
  fill
/>
Fix:

<Image
  src={
    booking.image ||
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop"
  }
  alt={booking.roomName || "Room"}
  fill
  className="object-cover"
/>
Why Proxy didn't fix it:

Proxy only helps external image domains.

Your actual issue is the src value is empty before rendering.

Also make sure your next.config.js contains:

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
or specific domains:

images: {
  domains: [
    "images.unsplash.com",
    "i.pravatar.cc",
  ],
},
Main fix:

Never allow src=""

Always provide fallback image with || operator.


import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
 
// This function can be marked async if using await inside
export async function proxy(request) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session){
        return NextResponse.redirect(new URL('/login', request.url))
    }

 
}
 
export const config = {
  matcher: ['/my-bookings','/add-room', '/rooms/:path'],
} this proxy code is not working

Your middleware/proxy has several problems.

Main issue:
headers() does NOT work inside middleware/proxy.

Also in Next.js the file should usually be named:

middleware.js
or

middleware.ts
NOT proxy.js.

Use this instead:

import { NextResponse } from "next/server";

export async function middleware(request) {
  const sessionCookie =
    request.cookies.get(
      "better-auth.session_token",
    );

  // If user is not logged in
  if (!sessionCookie) {
    return NextResponse.redirect(
      new URL("/login", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/my-bookings",
    "/add-room",
    "/rooms/:path*",
  ],
};
But if you are using Better Auth properly, recommended version:

import { nextCookies } from "better-auth/next-js";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const session =
    request.cookies.get(
      "better-auth.session_token",
    );

  if (!session) {
    return NextResponse.redirect(
      new URL("/login", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/my-bookings",
    "/add-room",
    "/rooms/:path*",
  ],
};
Another important mistake:

matcher: ['/rooms/:path']
should be:

matcher: ['/rooms/:path*']
because:

:path → single segment

:path* → nested dynamic routes

Without *, routes like:

/rooms/123
may fail.

Also remember:

middleware runs on Edge Runtime

you cannot use server functions like headers()

you cannot directly call auth.api.getSession() there

So use cookies/token checking instead.


"use client";

import { Card, Separator } from "@heroui/react";
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signIn.email({
      email: user.email,
      password: user.password,
    });


    if (data) {
      redirect('/')
    }

    if (error) {
      // toast
      alert("Error");
    }
  };

  const handleGoogleSignin = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center my-3">
        <h1 className="text-2xl font-bold">Login</h1>
        <p>Start your adventure with Wanderlust</p>
      </div>
      <Card className="border rounded-none">
        <Form onSubmit={onSubmit} className="flex w-96 flex-col gap-4">
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label>Email</Label>
            <Input placeholder="john@example.com" />
            <FieldError />
          </TextField>
          <TextField
            isRequired
            minLength={8}
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }
              return null;
            }}
          >
            <Label>Password</Label>
            <Input placeholder="Enter your password" />
            <Description>
              Must be at least 8 characters with 1 uppercase and 1 number
            </Description>
            <FieldError />
          </TextField>
          <div className="flex justify-center gap-2">
            <Button className={"rounded-none w-full bg-cyan-500"} type="submit">
              Login
            </Button>
          </div>
        </Form>

        <div className="flex justify-center items-center gap-3">
          <Separator />
          <div className="whitespace-nowrap"> Or sign up with </div>
          <Separator />
        </div>
        <div>
          <Button
            onClick={handleGoogleSignin}
            variant="outline"
            className={"w-full rounded-none"}
          >
            <FcGoogle /> Sign in with Google
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage; this is my login page, make it beautiful but functionality will be the same

"use client";

import { authClient } from "@/lib/auth-client";

import {
  Button,
  Card,
  CardBody,
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
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full"></div>

      {/* Card */}
      <Card className="w-full max-w-lg bg-[#0d1b2a]/95 border border-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] rounded-3xl overflow-hidden z-10">
        <CardBody className="p-10">
          {/* Heading */}
          <div className="text-center mb-10">
            <p className="uppercase tracking-[4px] text-cyan-400 text-sm mb-3">
              Welcome Back
            </p>

            <h1 className="text-5xl font-extrabold text-white">
              Login
            </h1>

            <p className="text-gray-400 mt-4 text-lg">
              Access your study room
              bookings and listings.
            </p>
          </div>

          {/* Form */}
          <Form
            onSubmit={onSubmit}
            className="flex flex-col gap-7"
          >
            {/* Email */}
            <TextField
              isRequired
              name="email"
              type="email"
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
              <Label className="text-gray-300 mb-2">
                Email Address
              </Label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />

                <Input
                  placeholder="john@example.com"
                  className="pl-12"
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
              <Label className="text-gray-300 mb-2">
                Password
              </Label>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />

                <Input
                  placeholder="Enter your password"
                  className="pl-12"
                />
              </div>

              <Description className="text-gray-500 mt-2">
                Must contain at least
                8 characters, 1
                uppercase letter and 1
                number.
              </Description>

              <FieldError className="text-red-400 text-sm mt-2" />
            </TextField>

            {/* Forgot */}
            <div className="w-full flex justify-end -mt-2">
              <button
                type="button"
                className="text-cyan-400 hover:text-cyan-300 text-sm transition"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg shadow-2xl transition-all duration-300"
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

          {/* Google */}
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
                href="/register"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
              >
                Register
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </section>
  );
};

export default LoginPage;

image(1).png
solve it . some times some heroUI doesn't work

This error happens because your installed version of HeroUI does NOT export CardBody.

You are probably using an older/free version where only Card exists.

Replace this:

import {
  Button,
  Card,
  CardBody,
  FieldError,
  Form,
  Input,
  Label,
  Separator,
  TextField,
  Description,
} from "@heroui/react";
with this:

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
Then replace:

<CardBody className="p-10">
with:

<div className="p-10">
And replace the closing tag:

</CardBody>
with:

</div>
Final structure:

<Card className="w-full max-w-lg bg-[#0d1b2a]/95 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden">
  <div className="p-10">
    
    {/* everything */}

  </div>
</Card>
Why this happens:

HeroUI documentation sometimes shows newer/premium/latest API

Your installed package version may not support:

CardBody

ModalContent

useDisclosure

ModalBody

So use normal <div> wrappers instead.

For your project, safest approach is:

Use HeroUI only for:

Button

Input

Card

Form

Separator

Build layouts/modals with Tailwind manually.

That avoids almost all HeroUI compatibility issues.


fix it and give me full code

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
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full"></div>

      {/* Login Card */}
      <Card className="w-full max-w-lg bg-[#0d1b2a]/95 border border-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] rounded-3xl overflow-hidden z-10">
        <div className="p-10">
          {/* Heading */}
          <div className="text-center mb-10">
            <p className="uppercase tracking-[4px] text-cyan-400 text-sm mb-3">
              Welcome Back
            </p>

            <h1 className="text-5xl font-extrabold text-white">
              Login
            </h1>

            <p className="text-gray-400 mt-4 text-lg">
              Access your study room
              bookings and listings.
            </p>
          </div>

          {/* Form */}
          <Form
            onSubmit={onSubmit}
            className="flex flex-col gap-7"
          >
            {/* Email */}
            <TextField
              isRequired
              name="email"
              type="email"
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
              <Label className="text-gray-300 mb-2">
                Email Address
              </Label>

              <div className="relative w-full">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />

                <Input
                  placeholder="john@example.com"
                  className="pl-12"
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
              <Label className="text-gray-300 mb-2">
                Password
              </Label>

              <div className="relative w-full">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />

                <Input
                  placeholder="Enter your password"
                  className="pl-12"
                />
              </div>

              <Description className="text-gray-500 mt-2">
                Must contain at least
                8 characters, 1
                uppercase letter and 1
                number.
              </Description>

              <FieldError className="text-red-400 text-sm mt-2" />
            </TextField>

            {/* Forgot Password */}
            <div className="w-full flex justify-end -mt-2">
              <button
                type="button"
                className="text-cyan-400 hover:text-cyan-300 text-sm transition"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg shadow-2xl transition-all duration-300"
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
                href="/register"
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

image(2).png
this input field should be full width

Your issue is caused by this wrapper:

<div className="relative w-full">
but the actual TextField container is NOT taking full width.

Add className="w-full" to TextField.

Replace this:

<TextField
  isRequired
  name="email"
  type="email"
>
with:

<TextField
  isRequired
  name="email"
  type="email"
  className="w-full"
>
And same for password:

<TextField
  isRequired
  minLength={8}
  name="password"
  type="password"
  className="w-full"
>
Then also update Input:

<Input
  placeholder="john@example.com"
  className="w-full pl-12"
/>
and:

<Input
  placeholder="Enter your password"
  className="w-full pl-12"
/>
Main reason:

HeroUI TextField does not automatically stretch.

Form flex layout also shrinks children unless width is explicitly set.

Final correct structure:

<Form
  onSubmit={onSubmit}
  className="flex flex-col gap-7 w-full"
>
VERY IMPORTANT:
also change your Form to:

<Form
  onSubmit={onSubmit}
  className="flex flex-col gap-7 w-full"
>
Otherwise children still won't expand properly.


would you please give me full code

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
                href="/register"
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

"use client";
import { FcGoogle } from "react-icons/fc";
import { Card, Separator } from "@heroui/react";

import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const SignUpPage = () => {
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signUp.email({
      email: user.email,
      password: user.password,
      name: user.name,
      image: user.image,
    });

    if (data) {
      redirect("/");
    }

    if (error) {
      // toast
      alert("Error");
    }
  };

  const handleGoogleSignin = async() => {
    await authClient.signIn.social({
        provider: "google"
    })

  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center my-3">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p>Start your adventure with Wanderlust</p>
      </div>
      <Card className="border rounded-none">
        <Form onSubmit={onSubmit} className="flex w-96 flex-col gap-4">
          <TextField isRequired name="name" type="text">
            <Label>Name</Label>
            <Input placeholder="Enter your name" />
            <FieldError />
          </TextField>

          <TextField name="image" type="url">
            <Label>Image URL</Label>
            <Input placeholder="Image url" />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label>Email</Label>
            <Input placeholder="john@example.com" />
            <FieldError />
          </TextField>
          <TextField
            isRequired
            minLength={8}
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }
              return null;
            }}
          >
            <Label>Password</Label>
            <Input placeholder="Enter your password" />
            <Description>
              Must be at least 8 characters with 1 uppercase and 1 number
            </Description>
            <FieldError />
          </TextField>
          <div className="flex justify-center gap-2">
            <Button className={"rounded-none w-full bg-cyan-500"} type="submit">
              Create Account
            </Button>
          </div>
        </Form>
        <div className="flex justify-center items-center gap-3">
            <Separator/>
           <div className="whitespace-nowrap"> Or sign up with </div>
              <Separator/>
            </div>
        <div>
            <Button onClick={handleGoogleSignin} variant="outline" className={'w-full rounded-none'}><FcGoogle /> Sign in with Google</Button>
        </div>
      </Card>
      
    </div>
  );
};

export default SignUpPage; make it same

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
  User,
  ImageIcon,
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";

const SignUpPage = () => {
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(
      e.currentTarget,
    );

    const user = Object.fromEntries(
      formData.entries(),
    );

    const { data, error } =
      await authClient.signUp.email({
        email: user.email,
        password: user.password,
        name: user.name,
        image: user.image,
      });

    if (data) {
      redirect("/");
    }

    if (error) {
      alert("Registration Failed");
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
              Join With Us
            </p>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white">
              Register
            </h1>

            <p className="text-gray-400 mt-5 text-lg leading-relaxed">
              Create your account and
              start booking premium
              study rooms instantly.
            </p>
          </div>

          {/* Form */}
          <Form
            onSubmit={onSubmit}
            className="flex flex-col gap-7 w-full"
          >
            {/* Name */}
            <TextField
              isRequired
              name="name"
              type="text"
              className="w-full"
              validate={(value) => {
                if (
                  value.length < 3
                ) {
                  return "Name must be at least 3 characters";
                }

                return null;
              }}
            >
              <Label className="text-gray-300 mb-2 text-sm">
                Full Name
              </Label>

              <div className="relative w-full">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />

                <Input
                  placeholder="John Doe"
                  className="w-full pl-12"
                />
              </div>

              <FieldError className="text-red-400 text-sm mt-2" />
            </TextField>

            {/* Image URL */}
            <TextField
              name="image"
              type="url"
              className="w-full"
              validate={(value) => {
                if (
                  value &&
                  !/^https?:\/\/.+/i.test(
                    value,
                  )
                ) {
                  return "Please enter a valid image URL";
                }

                return null;
              }}
            >
              <Label className="text-gray-300 mb-2 text-sm">
                Profile Image URL
              </Label>

              <div className="relative w-full">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />

                <Input
                  placeholder="https://example.com/profile.jpg"
                  className="w-full pl-12"
                />
              </div>

              <FieldError className="text-red-400 text-sm mt-2" />
            </TextField>

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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg shadow-xl transition-all duration-300"
            >
              Create Account
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

          {/* Google */}
          <Button
            onClick={
              handleGoogleSignin
            }
            variant="bordered"
            className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-lg font-semibold transition-all duration-300"
          >
            <FcGoogle className="text-2xl" />
            Sign up with Google
          </Button>

          {/* Login */}
          <div className="text-center mt-8">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default SignUpPage;

"use client";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Avatar, Button } from "@heroui/react";

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async() => {
    await authClient.signOut();
  }

  return (
    <nav className="flex items-center justify-between p-5">
      <div>
        <Link href={"/"}>
          <h2 className="text-2xl font-extrabold">
            Study{" "}
            <span className="text-2xl text-cyan-400 font-extrabold">Nook</span>
          </h2>
        </Link>
      </div>
      <ul className="flex gap-3">
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        <li>
          <Link href={"/rooms"}>Rooms</Link>
        </li>
        <li>
          <Link href={"/add-room"}>Add Room</Link>
        </li>
        <li>
          <Link href={"/my-bookings"}>My Bookings</Link>
        </li>
      </ul>

      <ul className="flex items-center gap-3">
        <li>
          <Link href={"/profile"}>My Profile</Link>
        </li>

        {user ? (
          <>
            <li>
              <Avatar>
                <Avatar.Image
                  alt="John Doe"
                  src={user?.image}
                />
                <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
              </Avatar>
            </li>
            <li><Button onClick={handleSignOut} variant="danger">Logout</Button></li>
          </>
        ) : (
          <>
            <li>
              <Link href={"/login"}>Login</Link>
            </li>
            <li>
              <Link href={"/signup"}>Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar; this is my navbar, just need to add one function that theme switch toggle and make more beautiful, but functionality must be same 

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";

import {
  Avatar,
  Button,
} from "@heroui/react";

import {
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const { data: session } =
    authClient.useSession();

  const user = session?.user;

  const [darkMode, setDarkMode] =
    useState(true);

  const [menuOpen, setMenuOpen] =
    useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "light") {
      setDarkMode(false);
      document.documentElement.classList.remove(
        "dark",
      );
    } else {
      setDarkMode(true);
      document.documentElement.classList.add(
        "dark",
      );
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove(
        "dark",
      );

      localStorage.setItem(
        "theme",
        "light",
      );
    } else {
      document.documentElement.classList.add(
        "dark",
      );

      localStorage.setItem(
        "theme",
        "dark",
      );
    }

    setDarkMode(!darkMode);
  };

  const handleSignOut =
    async () => {
      await authClient.signOut();
    };

  const navLinks = (
    <>
      <li>
        <Link
          href={"/"}
          className="hover:text-cyan-400 transition"
        >
          Home
        </Link>
      </li>

      <li>
        <Link
          href={"/rooms"}
          className="hover:text-cyan-400 transition"
        >
          Rooms
        </Link>
      </li>

      <li>
        <Link
          href={"/add-room"}
          className="hover:text-cyan-400 transition"
        >
          Add Room
        </Link>
      </li>

      <li>
        <Link
          href={"/my-bookings"}
          className="hover:text-cyan-400 transition"
        >
          My Bookings
        </Link>
      </li>
    </>
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07111f]/80 border-b border-white/10 text-white">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link href={"/"}>
            <h2 className="text-3xl font-extrabold tracking-wide">
              Study{" "}
              <span className="text-cyan-400">
                Nook
              </span>
            </h2>
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-8 font-medium text-gray-300">
          {navLinks}
        </ul>

        {/* Right Side */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-11 h-11 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-cyan-400" />
            )}
          </button>

          {user ? (
            <>
              {/* Profile */}
              <Link
                href={"/profile"}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-full transition"
              >
                <Avatar
                  src={user?.image}
                  name={user?.name}
                  className="w-9 h-9"
                />

                <span className="text-sm font-medium">
                  {user?.name}
                </span>
              </Link>

              {/* Logout */}
              <Button
                onClick={
                  handleSignOut
                }
                className="bg-red-500 hover:bg-red-600 text-white rounded-full px-5"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href={"/login"}
              >
                <Button
                  variant="bordered"
                  className="border-white/20 text-white rounded-full px-5"
                >
                  Login
                </Button>
              </Link>

              <Link
                href={"/signup"}
              >
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-5">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() =>
            setMenuOpen(
              !menuOpen,
            )
          }
          className="lg:hidden"
        >
          {menuOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#07111f] px-6 py-6">
          <ul className="flex flex-col gap-5 text-gray-300 font-medium">
            {navLinks}
          </ul>

          <div className="mt-6 flex flex-col gap-4">
            {/* Theme */}
            <button
              onClick={
                toggleTheme
              }
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-2xl"
            >
              {darkMode ? (
                <>
                  <Sun className="w-5 h-5 text-yellow-400" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-cyan-400" />
                  Dark Mode
                </>
              )}
            </button>

            {user ? (
              <>
                <Link
                  href={
                    "/profile"
                  }
                  className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl"
                >
                  <Avatar
                    src={
                      user?.image
                    }
                    name={
                      user?.name
                    }
                    className="w-10 h-10"
                  />

                  <span>
                    {
                      user?.name
                    }
                  </span>
                </Link>

                <Button
                  onClick={
                    handleSignOut
                  }
                  className="bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href={
                    "/login"
                  }
                >
                  <Button className="w-full border border-white/20 bg-transparent text-white rounded-2xl">
                    Login
                  </Button>
                </Link>

                <Link
                  href={
                    "/signup"
                  }
                >
                  <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

two more things need to change, navbar keep white when it toggle will be brand color..and a icon set besides logo with motion

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";

import {
  Avatar,
  Button,
} from "@heroui/react";

import {
  Moon,
  Sun,
  Menu,
  X,
  BookOpenCheck,
} from "lucide-react";

import { motion } from "framer-motion";

const Navbar = () => {
  const { data: session } =
    authClient.useSession();

  const user = session?.user;

  const [darkMode, setDarkMode] =
    useState(true);

  const [menuOpen, setMenuOpen] =
    useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "light") {
      setDarkMode(false);

      document.documentElement.classList.remove(
        "dark",
      );
    } else {
      setDarkMode(true);

      document.documentElement.classList.add(
        "dark",
      );
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove(
        "dark",
      );

      localStorage.setItem(
        "theme",
        "light",
      );
    } else {
      document.documentElement.classList.add(
        "dark",
      );

      localStorage.setItem(
        "theme",
        "dark",
      );
    }

    setDarkMode(!darkMode);
  };

  const handleSignOut =
    async () => {
      await authClient.signOut();
    };

  const navLinks = (
    <>
      <li>
        <Link
          href={"/"}
          className="hover:text-cyan-400 transition"
        >
          Home
        </Link>
      </li>

      <li>
        <Link
          href={"/rooms"}
          className="hover:text-cyan-400 transition"
        >
          Rooms
        </Link>
      </li>

      <li>
        <Link
          href={"/add-room"}
          className="hover:text-cyan-400 transition"
        >
          Add Room
        </Link>
      </li>

      <li>
        <Link
          href={"/my-bookings"}
          className="hover:text-cyan-400 transition"
        >
          My Bookings
        </Link>
      </li>
    </>
  );

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
        darkMode
          ? "bg-[#07111f]/90 border-white/10 text-white"
          : "bg-cyan-500 text-white border-cyan-400/30 shadow-xl"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link
            href={"/"}
            className="flex items-center gap-3"
          >
            {/* Animated Icon */}
            <motion.div
              animate={{
                rotate: [
                  0,
                  -10,
                  10,
                  -10,
                  0,
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className={`p-2 rounded-2xl shadow-lg ${
                darkMode
                  ? "bg-cyan-500/20"
                  : "bg-white/20"
              }`}
            >
              <BookOpenCheck className="w-7 h-7 text-cyan-300" />
            </motion.div>

            {/* Logo Text */}
            <div>
              <h2 className="text-3xl font-extrabold tracking-wide leading-none">
                Study{" "}
                <span
                  className={
                    darkMode
                      ? "text-cyan-400"
                      : "text-white"
                  }
                >
                  Nook
                </span>
              </h2>

              <p className="text-xs tracking-[3px] uppercase text-gray-300 mt-1">
                Smart Study Rooms
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-8 font-medium text-gray-300">
          {navLinks}
        </ul>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
              darkMode
                ? "bg-white/5 border border-white/10 hover:bg-white/10"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-white" />
            )}
          </button>

          {user ? (
            <>
              {/* Profile */}
              <Link
                href={"/profile"}
                className={`flex items-center gap-3 px-3 py-2 rounded-full transition ${
                  darkMode
                    ? "bg-white/5 hover:bg-white/10 border border-white/10"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                <Avatar
                  src={user?.image}
                  name={user?.name}
                  className="w-9 h-9"
                />

                <span className="text-sm font-medium">
                  {user?.name}
                </span>
              </Link>

              {/* Logout */}
              <Button
                onClick={
                  handleSignOut
                }
                className="bg-red-500 hover:bg-red-600 text-white rounded-full px-5"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href={"/login"}
              >
                <Button
                  variant="bordered"
                  className={`rounded-full px-5 ${
                    darkMode
                      ? "border-white/20 text-white"
                      : "border-white text-white"
                  }`}
                >
                  Login
                </Button>
              </Link>

              <Link
                href={"/signup"}
              >
                <Button className="bg-white text-cyan-600 hover:bg-gray-100 rounded-full px-5 font-semibold">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() =>
            setMenuOpen(
              !menuOpen,
            )
          }
          className="lg:hidden"
        >
          {menuOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className={`lg:hidden px-6 py-6 border-t ${
            darkMode
              ? "bg-[#07111f] border-white/10"
              : "bg-cyan-500 border-white/20"
          }`}
        >
          <ul className="flex flex-col gap-5 font-medium">
            {navLinks}
          </ul>

          <div className="mt-6 flex flex-col gap-4">
            {/* Theme */}
            <button
              onClick={
                toggleTheme
              }
              className={`flex items-center justify-center gap-2 py-3 rounded-2xl transition ${
                darkMode
                  ? "bg-white/5 border border-white/10"
                  : "bg-white/20"
              }`}
            >
              {darkMode ? (
                <>
                  <Sun className="w-5 h-5 text-yellow-400" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-white" />
                  Dark Mode
                </>
              )}
            </button>

            {user ? (
              <>
                <Link
                  href={
                    "/profile"
                  }
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${
                    darkMode
                      ? "bg-white/5 border border-white/10"
                      : "bg-white/20"
                  }`}
                >
                  <Avatar
                    src={
                      user?.image
                    }
                    name={
                      user?.name
                    }
                    className="w-10 h-10"
                  />

                  <span>
                    {
                      user?.name
                    }
                  </span>
                </Link>

                <Button
                  onClick={
                    handleSignOut
                  }
                  className="bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href={
                    "/login"
                  }
                >
                  <Button
                    className={`w-full rounded-2xl ${
                      darkMode
                        ? "border border-white/20 bg-transparent text-white"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    Login
                  </Button>
                </Link>

                <Link
                  href={
                    "/signup"
                  }
                >
                  <Button className="w-full bg-white text-cyan-600 hover:bg-gray-100 rounded-2xl font-semibold">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;


navbar need selected item, when it clicked it will be selected

First import usePathname from Next.js:

import { usePathname } from "next/navigation";
Then inside your component add:

const pathname = usePathname();
Now replace your current navLinks with this:

const navItems = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Rooms",
    path: "/rooms",
  },
  {
    name: "Add Room",
    path: "/add-room",
  },
  {
    name: "My Bookings",
    path: "/my-bookings",
  },
];

const navLinks = navItems.map(
  (item) => (
    <li key={item.path}>
      <Link
        href={item.path}
        className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
          pathname === item.path
            ? darkMode
              ? "bg-cyan-500 text-white shadow-lg"
              : "bg-white text-cyan-600 shadow-lg"
            : darkMode
            ? "text-gray-300 hover:text-cyan-400 hover:bg-white/5"
            : "text-white hover:bg-white/20"
        }`}
      >
        {item.name}

        {/* Active Indicator */}
        {pathname === item.path && (
          <span
            className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
              darkMode
                ? "bg-cyan-300"
                : "bg-cyan-600"
            }`}
          ></span>
        )}
      </Link>
    </li>
  ),
);
Now your navbar will have:

Active selected menu

Rounded active background

Active indicator dot

Smooth hover animation

Theme-aware active colors

Professional navigation UI


give me full code please

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import {
  Avatar,
  Button,
} from "@heroui/react";

import {
  Moon,
  Sun,
  Menu,
  X,
  BookOpenCheck,
} from "lucide-react";

import { motion } from "framer-motion";

const Navbar = () => {
  const pathname =
    usePathname();

  const { data: session } =
    authClient.useSession();

  const user = session?.user;

  const [darkMode, setDarkMode] =
    useState(true);

  const [menuOpen, setMenuOpen] =
    useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "light") {
      setDarkMode(false);

      document.documentElement.classList.remove(
        "dark",
      );
    } else {
      setDarkMode(true);

      document.documentElement.classList.add(
        "dark",
      );
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove(
        "dark",
      );

      localStorage.setItem(
        "theme",
        "light",
      );
    } else {
      document.documentElement.classList.add(
        "dark",
      );

      localStorage.setItem(
        "theme",
        "dark",
      );
    }

    setDarkMode(!darkMode);
  };

  const handleSignOut =
    async () => {
      await authClient.signOut();
    };

  const navItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Rooms",
      path: "/rooms",
    },
    {
      name: "Add Room",
      path: "/add-room",
    },
    {
      name: "My Bookings",
      path: "/my-bookings",
    },
  ];

  const navLinks = navItems.map(
    (item) => (
      <li key={item.path}>
        <Link
          href={item.path}
          className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
            pathname === item.path
              ? darkMode
                ? "bg-cyan-500 text-white shadow-lg"
                : "bg-white text-cyan-600 shadow-lg"
              : darkMode
              ? "text-gray-300 hover:text-cyan-400 hover:bg-white/5"
              : "text-white hover:bg-white/20"
          }`}
        >
          {item.name}

          {/* Active Dot */}
          {pathname ===
            item.path && (
            <span
              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
                darkMode
                  ? "bg-cyan-300"
                  : "bg-cyan-600"
              }`}
            ></span>
          )}
        </Link>
      </li>
    ),
  );

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
        darkMode
          ? "bg-[#07111f]/90 border-white/10 text-white"
          : "bg-cyan-500 text-white border-cyan-400/30 shadow-xl"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link
            href={"/"}
            className="flex items-center gap-3"
          >
            {/* Animated Icon */}
            <motion.div
              animate={{
                rotate: [
                  0,
                  -10,
                  10,
                  -10,
                  0,
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className={`p-2 rounded-2xl shadow-lg ${
                darkMode
                  ? "bg-cyan-500/20"
                  : "bg-white/20"
              }`}
            >
              <BookOpenCheck className="w-7 h-7 text-cyan-300" />
            </motion.div>

            {/* Logo Text */}
            <div>
              <h2 className="text-3xl font-extrabold tracking-wide leading-none">
                Study{" "}
                <span
                  className={
                    darkMode
                      ? "text-cyan-400"
                      : "text-white"
                  }
                >
                  Nook
                </span>
              </h2>

              <p className="text-xs tracking-[3px] uppercase text-gray-300 mt-1">
                Smart Study Rooms
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-4 font-medium">
          {navLinks}
        </ul>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
              darkMode
                ? "bg-white/5 border border-white/10 hover:bg-white/10"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-white" />
            )}
          </button>

          {user ? (
            <>
              {/* Profile */}
              <Link
                href={"/profile"}
                className={`flex items-center gap-3 px-3 py-2 rounded-full transition ${
                  darkMode
                    ? "bg-white/5 hover:bg-white/10 border border-white/10"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                <Avatar
                  src={user?.image}
                  name={user?.name}
                  className="w-9 h-9"
                />

                <span className="text-sm font-medium">
                  {user?.name}
                </span>
              </Link>

              {/* Logout */}
              <Button
                onClick={
                  handleSignOut
                }
                className="bg-red-500 hover:bg-red-600 text-white rounded-full px-5"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href={"/login"}
              >
                <Button
                  variant="bordered"
                  className={`rounded-full px-5 ${
                    darkMode
                      ? "border-white/20 text-white"
                      : "border-white text-white"
                  }`}
                >
                  Login
                </Button>
              </Link>

              <Link
                href={"/signup"}
              >
                <Button className="bg-white text-cyan-600 hover:bg-gray-100 rounded-full px-5 font-semibold">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() =>
            setMenuOpen(
              !menuOpen,
            )
          }
          className="lg:hidden"
        >
          {menuOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className={`lg:hidden px-6 py-6 border-t ${
            darkMode
              ? "bg-[#07111f] border-white/10"
              : "bg-cyan-500 border-white/20"
          }`}
        >
          <ul className="flex flex-col gap-5 font-medium">
            {navLinks}
          </ul>

          <div className="mt-6 flex flex-col gap-4">
            {/* Theme */}
            <button
              onClick={
                toggleTheme
              }
              className={`flex items-center justify-center gap-2 py-3 rounded-2xl transition ${
                darkMode
                  ? "bg-white/5 border border-white/10"
                  : "bg-white/20"
              }`}
            >
              {darkMode ? (
                <>
                  <Sun className="w-5 h-5 text-yellow-400" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-white" />
                  Dark Mode
                </>
              )}
            </button>

            {user ? (
              <>
                <Link
                  href={
                    "/profile"
                  }
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${
                    darkMode
                      ? "bg-white/5 border border-white/10"
                      : "bg-white/20"
                  }`}
                >
                  <Avatar
                    src={
                      user?.image
                    }
                    name={
                      user?.name
                    }
                    className="w-10 h-10"
                  />

                  <span>
                    {
                      user?.name
                    }
                  </span>
                </Link>

                <Button
                  onClick={
                    handleSignOut
                  }
                  className="bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href={
                    "/login"
                  }
                >
                  <Button
                    className={`w-full rounded-2xl ${
                      darkMode
                        ? "border border-white/20 bg-transparent text-white"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    Login
                  </Button>
                </Link>

                <Link
                  href={
                    "/signup"
                  }
                >
                  <Button className="w-full bg-white text-cyan-600 hover:bg-gray-100 rounded-2xl font-semibold">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image src="/assets/banner.png" alt="Study Room Banner" fill />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">
        <div className="max-w-4xl space-y-7">
          <p className="uppercase tracking-[5px] text-cyan-400 font-semibold">
            Find Your Ideal Study Space
          </p>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-2xl">
            Discover Your <br />
            <span className="text-cyan-400">Perfect Study Room</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
            Browse and book quiet, comfortable, and private study rooms near
            you. List your own room, connect with students, and earn extra
            income effortlessly.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4">
            <Link href="/rooms">
              <button className="bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 px-8 py-4 rounded-xl text-lg font-semibold shadow-2xl cursor-pointer">
                Explore Rooms
              </button>
            </Link>

            <Link href="/signup">
              <button className="border border-white/40 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 px-8 py-4 rounded-xl text-lg text-white font-semibold cursor-pointer">
                Become a Host
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Blur Effect */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent"></div>
    </section>
  );
};

export default Banner;  this is my banner section, need to more attractive and integrated some framer motion but previous any functionality must be same, you can change the design also 

"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowRight,
  BookOpenCheck,
  Sparkles,
} from "lucide-react";

const Banner = () => {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/banner.png"
          alt="Study Room Banner"
          fill
          priority
          className="object-cover scale-105"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#07111f]/75"></div>

      {/* Cyan Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/20 blur-[140px] rounded-full"></div>

      {/* Grid Effect */}
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:70px_70px]"></div>

      {/* Floating Blur */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute top-40 right-20 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl"
      ></motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 items-center gap-16">
          {/* Left Side */}
          <motion.div
            initial={{
              opacity: 0,
              y: 60,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
            }}
            className="space-y-8"
          >
            {/* Top Badge */}
            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.8,
              }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3"
            >
              <Sparkles className="w-5 h-5 text-cyan-400" />

              <span className="text-sm uppercase tracking-[4px] text-cyan-300 font-semibold">
                Smart Study Environment
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{
                opacity: 0,
                y: 50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
                duration: 1,
              }}
            >
              <h1 className="text-5xl md:text-7xl xl:text-8xl font-black leading-tight text-white">
                Discover
                <br />

                <span className="relative inline-block text-cyan-400">
                  Perfect
                  <motion.span
                    animate={{
                      width: [
                        "0%",
                        "100%",
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 1.5,
                    }}
                    className="absolute left-0 bottom-2 h-3 bg-cyan-500/20 rounded-full"
                  ></motion.span>
                </span>{" "}
                Study Rooms
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.7,
                duration: 1,
              }}
              className="text-lg md:text-2xl text-gray-300 leading-relaxed max-w-2xl"
            >
              Book quiet, comfortable,
              and fully equipped study
              rooms near you. Create
              the perfect environment
              for productivity,
              collaboration, and
              focused learning.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1,
                duration: 1,
              }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link href="/rooms">
                <button className="group bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 px-8 py-5 rounded-2xl text-lg font-bold text-white shadow-[0_10px_40px_rgba(6,182,212,0.35)] flex items-center gap-3">
                  Explore Rooms

                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <Link href="/signup">
                <button className="group border border-white/20 bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-300 px-8 py-5 rounded-2xl text-lg text-white font-semibold flex items-center gap-3">
                  Become a Host

                  <BookOpenCheck className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.2,
                duration: 1,
              }}
              className="flex flex-wrap gap-8 pt-6"
            >
              <div>
                <h3 className="text-4xl font-black text-white">
                  500+
                </h3>

                <p className="text-gray-400 mt-1">
                  Study Rooms
                </p>
              </div>

              <div>
                <h3 className="text-4xl font-black text-white">
                  10K+
                </h3>

                <p className="text-gray-400 mt-1">
                  Happy Students
                </p>
              </div>

              <div>
                <h3 className="text-4xl font-black text-white">
                  24/7
                </h3>

                <p className="text-gray-400 mt-1">
                  Booking Access
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side Card */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.6,
              duration: 1,
            }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-[40px]"></div>

              {/* Glass Card */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="relative bg-white/10 border border-white/10 backdrop-blur-2xl rounded-[40px] p-8 shadow-2xl max-w-md"
              >
                <div className="relative h-[450px] w-[350px] rounded-[30px] overflow-hidden">
                  <Image
                    src="/assets/banner.png"
                    alt="Study Room"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Floating Mini Card */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                  className="absolute -bottom-8 -left-8 bg-[#0d1b2a] border border-white/10 rounded-3xl p-5 shadow-2xl"
                >
                  <p className="text-gray-400 text-sm">
                    Available Today
                  </p>

                  <h3 className="text-white text-3xl font-black mt-1">
                    126 Rooms
                  </h3>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#07111f] to-transparent"></div>
    </section>
  );
};

export default Banner;

give me a error page for room details page

"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowLeft,
  SearchX,
  Home,
} from "lucide-react";

const RoomDetailsError = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-[#07111f] flex items-center justify-center px-6">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/20 blur-[140px] rounded-full"></div>

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:70px_70px]"></div>

      {/* Main Content */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[40px] p-10 md:p-16 shadow-2xl text-center">
          {/* Animated Icon */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="w-28 h-28 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8"
          >
            <SearchX className="w-14 h-14 text-red-400" />
          </motion.div>

          {/* Error Code */}
          <motion.h1
            initial={{
              scale: 0.8,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              delay: 0.2,
              duration: 0.5,
            }}
            className="text-7xl md:text-8xl font-black text-white"
          >
            404
          </motion.h1>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-5">
            Room Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-lg leading-relaxed mt-6 max-w-xl mx-auto">
            The study room you are
            looking for may have been
            removed, renamed, or is
            temporarily unavailable.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-10">
            <Link href="/rooms">
              <button className="group bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-[0_10px_40px_rgba(6,182,212,0.35)] flex items-center gap-3">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />

                Browse Rooms
              </button>
            </Link>

            <Link href="/">
              <button className="group border border-white/20 bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-300 px-8 py-4 rounded-2xl text-white font-semibold text-lg flex items-center gap-3">
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />

                Back Home
              </button>
            </Link>
          </div>

          {/* Small Footer */}
          <div className="mt-12 pt-6 border-t border-white/10">
            <p className="text-gray-500 text-sm">
              Need help? Contact Study
              Nook support for
              assistance.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default RoomDetailsError;

import React from 'react';

const Featured =async () => {
    const res = await fetch(${process.env.NEXT_PUBLIC_SERVER_URL})
    const featuredRoom = res.json()
    return (
        <div>
            
        </div>
    );
};

export default Featured;  give featured page where 4 rooms will show

"use client";

import {
  Button,
  Modal,
} from "@heroui/react";

import {
  useEffect,
  useState,
} from "react";

import { BiEdit } from "react-icons/bi";

const amenitiesList = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];

export default function EditModal({
  room,
}) {
  const {
    roomName,
    description,
    image,
    floor,
    capacity,
    hourlyRate,
    amenities,
  } = room;

  const [
    selectedAmenities,
    setSelectedAmenities,
  ] = useState([]);

  useEffect(() => {
    setSelectedAmenities(
      amenities || [],
    );
  }, [amenities]);

  const handleAmenityChange =
    (amenity) => {
      if (
        selectedAmenities.includes(
          amenity,
        )
      ) {
        setSelectedAmenities(
          selectedAmenities.filter(
            (item) =>
              item !==
              amenity,
          ),
        );
      } else {
        setSelectedAmenities([
          ...selectedAmenities,
          amenity,
        ]);
      }
    };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const form =
        e.target;

      const updatedRoom = {
        roomName:
          form.roomName.value,
        description:
          form.description.value,
        image:
          form.image.value,
        floor:
          form.floor.value,
        capacity: Number(
          form.capacity.value,
        ),
        hourlyRate:
          Number(
            form.hourlyRate
              .value,
          ),
        amenities:
          selectedAmenities,
      };

      console.log(
        updatedRoom,
      );
    };

  return (
    <Modal>
      {/* Button */}
      <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl">
        <BiEdit />
        Edit Room
      </Button>

      {/* Backdrop */}
      <Modal.Backdrop className="bg-black/40" />

      {/* Modal */}
      <Modal.Container placement="center">
        <Modal.Dialog className="max-w-3xl bg-white rounded-3xl overflow-hidden">
          <Modal.CloseTrigger />

          {/* Header */}
          <div className="bg-cyan-500 px-8 py-6 text-white">
            <h2 className="text-3xl font-bold">
              Edit Room
            </h2>

            <p className="text-white/80 mt-1">
              Update your room
              information
            </p>
          </div>

          {/* Body */}
          <Modal.Body className="p-8 max-h-[80vh] overflow-y-auto">
            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-6"
            >
              {/* Room Name */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Room Name
                </label>

                <input
                  defaultValue={
                    roomName
                  }
                  type="text"
                  name="roomName"
                  required
                  className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-cyan-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  defaultValue={
                    description
                  }
                  name="description"
                  rows={4}
                  required
                  className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-cyan-500 resize-none"
                ></textarea>
              </div>

              {/* Image URL */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Image URL
                </label>

                <input
                  defaultValue={
                    image
                  }
                  type="url"
                  name="image"
                  required
                  className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-cyan-500"
                />
              </div>

              {/* Grid */}
              <div className="grid md:grid-cols-3 gap-5">
                {/* Floor */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Floor
                  </label>

                  <input
                    defaultValue={
                      floor
                    }
                    type="text"
                    name="floor"
                    required
                    className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Capacity
                  </label>

                  <input
                    defaultValue={
                      capacity
                    }
                    type="number"
                    name="capacity"
                    required
                    className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Rate */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Hourly Rate
                  </label>

                  <input
                    defaultValue={
                      hourlyRate
                    }
                    type="number"
                    name="hourlyRate"
                    required
                    className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block mb-4 font-medium text-gray-700">
                  Amenities
                </label>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {amenitiesList.map(
                    (
                      amenity,
                    ) => (
                      <label
                        key={
                          amenity
                        }
                        className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition ${
                          selectedAmenities.includes(
                            amenity,
                          )
                            ? "bg-cyan-500 text-white border-cyan-500"
                            : "border-gray-300 hover:border-cyan-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(
                            amenity,
                          )}
                          onChange={() =>
                            handleAmenityChange(
                              amenity,
                            )
                          }
                          className="accent-cyan-500"
                        />

                        <span>
                          {
                            amenity
                          }
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  slot="close"
                  variant="bordered"
                  className="rounded-xl"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  slot="close"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
}

"use client";
import { Button, Modal, Surface } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BiEdit } from "react-icons/bi";

const amenitiesList = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];

export default function EditModal({ room }) {
  const {
    _id,
    roomName,
    description,
    image,
    floor,
    capacity,
    hourlyRate,
    amenities,
  } = room;

  const router = useRouter();

  const [selectedAmenities, setSelectedAmenities] = useState([]);

  useEffect(() => {
    setSelectedAmenities(amenities || []);
  }, [amenities]);

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(
        selectedAmenities.filter((item) => item !== amenity),
      );
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const room = {
      roomName: form.roomName.value,
      description: form.description.value,
      image: form.image.value,
      floor: form.floor.value,
      capacity: Number(form.capacity.value),
      hourlyRate: Number(form.hourlyRate.value),
      amenities: selectedAmenities,
    };

    console.log(room);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/room/${_id}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(room),
      },
    );

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      alert("Room Updated Successfully");
      router.push("/rooms");
    }

    form.reset();
    setSelectedAmenities([]);
  };

  return (
    <Modal>
      <Button
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 rounded-xl"
      >
        <BiEdit />
        Edit
      </Button>

      <Modal.Backdrop className="bg-black/40" />

      <Modal.Container placement="auto">
        <Modal.Dialog className="sm:max-w-3xl rounded-2xl overflow-hidden">
          <Modal.CloseTrigger />

          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-8 py-5">
            <h2 className="text-2xl font-bold text-white">
              Edit Room
            </h2>

            <p className="text-cyan-100 text-sm mt-1">
              Update your room information
            </p>
          </div>

          <Modal.Body className="p-6 bg-white">
            <Surface className="bg-transparent shadow-none">
              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Room Name */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Room Name
                  </label>

                  <input
                    defaultValue={roomName}
                    type="text"
                    name="roomName"
                    required
                    placeholder="Enter room name"
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Description
                  </label>

                  <textarea
                    defaultValue={description}
                    name="description"
                    required
                    rows={5}
                    placeholder="Write room description"
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                  ></textarea>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Image URL
                  </label>

                  <input
                    defaultValue={image}
                    type="url"
                    name="image"
                    required
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                {/* Floor + Capacity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Floor
                    </label>

                    <input
                      defaultValue={floor}
                      type="text"
                      name="floor"
                      required
                      placeholder="3rd Floor"
                      className="w-full px-5 py-4 rounded-xl border border-gray-300 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Capacity
                    </label>

                    <input
                      defaultValue={capacity}
                      type="number"
                      name="capacity"
                      required
                      placeholder="4"
                      className="w-full px-5 py-4 rounded-xl border border-gray-300 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Hourly Rate ($)
                  </label>

                  <input
                    defaultValue={hourlyRate}
                    type="number"
                    name="hourlyRate"
                    required
                    placeholder="5"
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-gray-700 mb-4 font-medium">
                    Amenities
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {amenitiesList.map((amenity) => (
                      <label
                        key={amenity}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition border ${
                          selectedAmenities.includes(amenity)
                            ? "bg-cyan-500 text-white border-cyan-500"
                            : "bg-gray-50 border-gray-200 hover:border-cyan-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="w-5 h-5 accent-cyan-500"
                        />

                        <span className="text-sm font-medium">
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <Modal.Footer className="px-0 pb-0">
                  <Button
                    type="submit"
                    slot="close"
                    className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl px-6"
                  >
                    Save Changes
                  </Button>
                </Modal.Footer>
              </form>
            </Surface>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
}

in my navbar doesn't show my profile image after login

Your navbar profile image is probably not showing because of one of these common issues:

user.image is null or empty

Wrong HeroUI Avatar syntax

Next.js external image domain is not added in next.config.js

Your current code:

<Avatar>
  <Avatar.Image
    alt="John Doe"
    src={user?.image}
  />
  <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
</Avatar>
HeroUI latest version does NOT work like this in many setups.

Use this instead:

<Avatar
  src={user?.image || "/assets/user.png"}
  name={user?.name}
  className="w-11 h-11 border-2 border-cyan-400"
/>
Replace your full avatar section with:

<li>
  <Avatar
    src={user?.image || "/assets/user.png"}
    name={user?.name}
    className="w-11 h-11 border-2 border-cyan-400"
  />
</li>
Also check your next.config.js

If your image comes from Google/GitHub/Unsplash/etc, you MUST add domains.

Example:

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "images.unsplash.com",
      "avatars.githubusercontent.com",
    ],
  },
};

export default nextConfig;
Then restart server:

npm run dev
Another important thing:

Check console:

console.log(user)
If image is missing:

image: null
then your auth provider is not saving image properly.

For Google login usually it should come automatically.
For email signup you must pass image manually during signup:

image: user.image,
And save it in database/session correctly.


"use client";

import { useEffect, useMemo, useState } from "react";

import { CalendarDays, Clock3, NotebookPen } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

const BookingCard = ({ room }) => {
    const {image, roomName, floor, capacity} = room
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [date, setDate] = useState("");

  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");

  const [specialNote, setSpecialNote] = useState("");

  const [totalCost, setTotalCost] = useState(0);

  // Today Date
  const today = new Date().toISOString().split("T")[0];

  // End Time Filter
  const availableEndTimes = useMemo(() => {
    if (!startTime) return [];

    const startIndex = timeSlots.indexOf(startTime);

    return timeSlots.slice(startIndex + 1);
  }, [startTime]);

  // Calculate Total Cost
  useEffect(() => {
    if (startTime && endTime) {
      const start = Number(startTime.split(":")[0]);

      const end = Number(endTime.split(":")[0]);

      const totalHours = end - start;

      setTotalCost(totalHours * room.hourlyRate);
    }
  }, [startTime, endTime, room]);

  const handleBooking = async (e) => {
    e.preventDefault();

    const bookingData = {
      userId: user?.id,
      userImage: user?.image,
      userName: user?.name,
      roomId: room._id,
      roomName: room.roomName,
      date,
      startTime,
      endTime,
      totalCost,
      image,
      roomName,
      floor,
      capacity,
      specialNote,
      status : "confirmed",
    };

    const {data:tokenData} = await authClient.token()
    console.log(tokenData)

    const res = await fetch(${process.env.NEXT_PUBLIC_SERVER_URL}/booking,
        {
            method:'POST',
            headers: { 
                'content-type': 'application/json',
                authorization : Bearer ${tokenData?.token}
            },
            body: JSON.stringify(bookingData)
        })

        const data = await res.json()
        toast.success('Your Room Booking is Confirmed')
        redirect('/my-bookings')

  };

  return (
    <section className="">
      <div className="bg-[#07111f] border border-cyan-500/10 rounded-3xl p-8 md:p-10 shadow-2xl">
        {/* Heading */}
        <div className="mb-10">
          <p className="uppercase tracking-[4px] text-cyan-400 text-sm mb-3">
            Booking Form
          </p>

          <h2 className="text-4xl font-extrabold text-white">
            Reserve This Study Room
          </h2>

          <p className="text-gray-400 mt-3">
            Select your preferred booking date and time.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleBooking} className="space-y-8">
          {/* Date */}
          <div>
            <label className="block text-gray-300 mb-3 font-medium">
              Booking Date
            </label>

            <div className="relative">
              <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5" />

              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full h-14 bg-[#0d1b2a] border border-white/10 rounded-2xl pl-12 pr-4 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Start Time */}
            <div>
              <label className="block text-gray-300 mb-3 font-medium">
                Start Time
              </label>

              <div className="relative">
                <Clock3 className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />

                <select
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);

                    setEndTime("");
                  }}
                  required
                  className="w-full h-14 bg-[#0d1b2a] border border-white/10 rounded-2xl pl-12 pr-4 text-white appearance-none outline-none focus:border-cyan-400"
                >
                  <option value="">Select Start Time</option>

                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-gray-300 mb-3 font-medium">
                End Time
              </label>

              <div className="relative">
                <Clock3 className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />

                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full h-14 bg-[#0d1b2a] border border-white/10 rounded-2xl pl-12 pr-4 text-white appearance-none outline-none focus:border-cyan-400"
                >
                  <option value="">Select End Time</option>

                  {availableEndTimes.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Total Cost */}
          <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-3xl p-8">
            <p className="text-gray-300 mb-2">Total Booking Cost</p>

            <h2 className="text-5xl font-extrabold text-cyan-400">
              ${totalCost}
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              Calculated automatically based on booking hours.
            </p>
          </div>

          {/* Special Note */}
          <div>
            <label className="block text-gray-300 mb-3 font-medium">
              Special Note
            </label>

            <div className="relative">
              <NotebookPen className="absolute left-4 top-5 text-cyan-400 w-5 h-5" />

              <textarea
                rows={5}
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                placeholder="Optional note..."
                className="w-full bg-[#0d1b2a] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-500 outline-none focus:border-cyan-400 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-14 bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 rounded-2xl text-white font-bold text-lg shadow-2xl cursor-pointer"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </section>
  );
};

export default BookingCard; this is my booking card component, I need to fix here " Conflict check:
Check if the selected room and time slot already has a confirmed booking.
If conflict exists, return an error; otherwise, create the booking successfully.
Frontend shows a success toast “Room booked successfully!” I have also database functionality, so how could I build it and where need to change in Front end as well backend 
 

You need to build the conflict check in backend first, then handle the response properly in frontend.

Your current frontend booking structure is already good.
Only small changes are needed.

1. BACKEND CONFLICT CHECK (MOST IMPORTANT)
Inside your booking POST route.

Example Express + MongoDB:

router.post("/booking", verifyToken, async (req, res) => {
  const bookingData = req.body;

  const {
    roomId,
    date,
    startTime,
    endTime,
  } = bookingData;

  // Find existing bookings of same room & same date
  const existingBookings = await bookingCollection
    .find({
      roomId,
      date,
      status: "confirmed",
    })
    .toArray();

  // Convert hour helper
  const convertHour = (time) =>
    Number(time.split(":")[0]);

  const newStart =
    convertHour(startTime);

  const newEnd =
    convertHour(endTime);

  // Conflict check
  const hasConflict =
    existingBookings.some(
      (booking) => {
        const existingStart =
          convertHour(
            booking.startTime,
          );

        const existingEnd =
          convertHour(
            booking.endTime,
          );

        return (
          newStart < existingEnd &&
          newEnd > existingStart
        );
      },
    );

  // If conflict exists
  if (hasConflict) {
    return res.status(409).send({
      success: false,
      message:
        "This time slot is already booked.",
    });
  }

  // Insert booking
  const result =
    await bookingCollection.insertOne(
      bookingData,
    );

  res.send({
    success: true,
    result,
  });
});
HOW THIS WORKS
Example:

Existing booking:

09:00 - 11:00
New booking attempts:

Booking	Conflict
08:00 - 09:00	❌ No
08:00 - 10:00	✅ Yes
10:00 - 12:00	✅ Yes
11:00 - 13:00	❌ No
This line handles everything:

newStart < existingEnd &&
newEnd > existingStart
2. FRONTEND CHANGES
Now update your frontend handleBooking.

Replace this section:

const data = await res.json()
toast.success('Your Room Booking is Confirmed')
redirect('/my-bookings')
WITH:

const data = await res.json();

if (!res.ok) {
  toast.error(
    data.message ||
      "Booking failed",
  );

  return;
}

toast.success(
  "Room booked successfully!",
);

window.location.href =
  "/my-bookings";
3. WHY redirect() IS WRONG HERE
You are inside a client component.

This:

redirect('/my-bookings')
is for server components/actions.

Use:

router.push("/my-bookings")
OR:

window.location.href =
  "/my-bookings";
Better:

Add:

const router = useRouter();
Then:

router.push("/my-bookings");
4. FINAL FRONTEND HANDLEBOOKING
Replace your entire handleBooking with this:

const router = useRouter();

const handleBooking = async (
  e,
) => {
  e.preventDefault();

  const bookingData = {
    userId: user?.id,
    userImage: user?.image,
    userName: user?.name,

    roomId: room._id,
    roomName:
      room.roomName,

    date,
    startTime,
    endTime,

    totalCost,

    image,
    floor,
    capacity,

    specialNote,

    status: "confirmed",
  };

  try {
    const {
      data: tokenData,
    } =
      await authClient.token();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/booking`,
      {
        method: "POST",
        headers: {
          "content-type":
            "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify(
          bookingData,
        ),
      },
    );

    const data =
      await res.json();

    if (!res.ok) {
      toast.error(
        data.message ||
          "Booking failed",
      );

      return;
    }

    toast.success(
      "Room booked successfully!",
    );

    router.push(
      "/my-bookings",
    );
  } catch (error) {
    toast.error(
      "Something went wrong",
    );

    console.log(error);
  }
};
5. IMPORTANT
Your conflict check only works properly if cancelled bookings are excluded.

That is why we used:

status: "confirmed"
Cancelled bookings will no longer block the slot.

6. OPTIONAL IMPROVEMENT
You can disable already booked times in frontend later.

Example:

09:00 - 11:00 booked
Then hide:

09:00
10:00
from dropdown automatically.

That would make your app look very professional.


// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');
dotenv.config()

const uri = process.env.MONGODB_URI;

const app = express()
const port = process.env.port;

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const JWKS = createRemoteJWKSet(
  new URL(${process.env.CLIENT_URL}/api/auth/jwks)
)

const verifyToken = async (req, res, next) =>{
  const authHeader = req?.headers?.authorization
  if(!authHeader){
    return res.status(401).json({message:"Unauthorized"});
  }
  const token = authHeader.split(" ")[1];
  console.log(token)

  if(!token){
    return res.status(401).json({message:"Unauthorized"});
  }
  
  try {
    const {payload} = await jwtVerify(token, JWKS)
  console.log(payload)
   next()
  } catch (error) {
    return res.status(403).json({message: "Forbidden"});
  }
  
}

async function run() {
  try {
    // await client.connect();

    const db = client.db("studynook")
    const roomCollection = db.collection("rooms")
    const bookingCollection = db.collection("bookings")

    app.get('/featured', async(req, res) =>{
      const result = await roomCollection.find().limit(4).toArray()
      res.json(result)
    })

    app.get('/room', async (req, res) => {
      const result = await roomCollection.find().toArray()
      res.json(result);
    })

    app.post('/room', async (req, res) => {
      const roomData = req.body
      const result =await roomCollection.insertOne(roomData)
      res.json(result);

    });

    app.get('/room/:id',verifyToken, async (req, res) => {
      const {id} = req.params
      const result  =  await roomCollection.findOne({_id: new ObjectId(id),

      })
      res.json(result)
    })

    app.patch("/room/:id", async (req, res) =>{
      const {id} = req.params
      const updatedData = req.body
      const result =await roomCollection.updateOne(
        {_id: new ObjectId(id)},
        {$set:updatedData}
      )
      res.json(result)
    })


    app.delete("/room/:id", async(req, res) => {
      const {id} = req.params
      const result =await roomCollection.deleteOne({_id:new ObjectId(id)})
      res.json(result)
    })

    app.get('/booking/:userId', async (req, res) => {
      const {userId} = req.params
      const result = await bookingCollection.find({userId}).toArray()
      res.json(result)
    })

     app.post('/booking', verifyToken, async (req, res) => {
      const bookingData = req.body
      const result =await bookingCollection.insertOne(bookingData)
      res.json(result);

    });

    app.delete('/booking/:bookingId',verifyToken, async(req, res) => {
      const {bookingId} = req.params
      const result =await bookingCollection.deleteOne({_id:new ObjectId(bookingId)})
      res.json(result)
    })


    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(Example app listening on port ${port})
}) this is my backend index.js file...would you please add the conflict content in this index.js file fully

// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
} = require("mongodb");

const {
  createRemoteJWKSet,
  jwtVerify,
} = require("jose-cjs");

dotenv.config();

const uri = process.env.MONGODB_URI;

const app = express();

const port = process.env.port;

app.use(cors());

app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
);

const verifyToken = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized" });
  }

  try {
    const { payload } = await jwtVerify(
      token,
      JWKS
    );

    console.log(payload);

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Forbidden" });
  }
};

async function run() {
  try {
    // await client.connect();

    const db = client.db("studynook");

    const roomCollection =
      db.collection("rooms");

    const bookingCollection =
      db.collection("bookings");

    // ===============================
    // FEATURED ROOMS
    // ===============================

    app.get("/featured", async (req, res) => {
      const result = await roomCollection
        .find()
        .limit(4)
        .toArray();

      res.json(result);
    });

    // ===============================
    // GET ALL ROOMS
    // ===============================

    app.get("/room", async (req, res) => {
      const result = await roomCollection
        .find()
        .toArray();

      res.json(result);
    });

    // ===============================
    // ADD ROOM
    // ===============================

    app.post("/room", async (req, res) => {
      const roomData = req.body;

      const result =
        await roomCollection.insertOne(
          roomData
        );

      res.json(result);
    });

    // ===============================
    // GET SINGLE ROOM
    // ===============================

    app.get(
      "/room/:id",
      verifyToken,
      async (req, res) => {
        const { id } = req.params;

        const result =
          await roomCollection.findOne({
            _id: new ObjectId(id),
          });

        res.json(result);
      }
    );

    // ===============================
    // UPDATE ROOM
    // ===============================

    app.patch(
      "/room/:id",
      async (req, res) => {
        const { id } = req.params;

        const updatedData = req.body;

        const result =
          await roomCollection.updateOne(
            {
              _id: new ObjectId(id),
            },
            {
              $set: updatedData,
            }
          );

        res.json(result);
      }
    );

    // ===============================
    // DELETE ROOM
    // ===============================

    app.delete(
      "/room/:id",
      async (req, res) => {
        const { id } = req.params;

        const result =
          await roomCollection.deleteOne({
            _id: new ObjectId(id),
          });

        res.json(result);
      }
    );

    // ===============================
    // GET USER BOOKINGS
    // ===============================

    app.get(
      "/booking/:userId",
      async (req, res) => {
        const { userId } = req.params;

        const result =
          await bookingCollection
            .find({ userId })
            .toArray();

        res.json(result);
      }
    );

    // ===============================
    // CREATE BOOKING + CONFLICT CHECK
    // ===============================

    app.post(
      "/booking",
      verifyToken,
      async (req, res) => {
        const bookingData = req.body;

        const {
          roomId,
          date,
          startTime,
          endTime,
        } = bookingData;

        // Check Existing Booking Conflict
        const existingBookings =
          await bookingCollection
            .find({
              roomId,
              date,
              status: "confirmed",
            })
            .toArray();

        // Convert Time Function
        const convertToHour = (time) => {
          return Number(time.split(":")[0]);
        };

        const newStart =
          convertToHour(startTime);

        const newEnd =
          convertToHour(endTime);

        // Conflict Check
        const hasConflict =
          existingBookings.some((booking) => {
            const existingStart =
              convertToHour(
                booking.startTime
              );

            const existingEnd =
              convertToHour(
                booking.endTime
              );

            return (
              newStart < existingEnd &&
              newEnd > existingStart
            );
          });

        // If Conflict Found
        if (hasConflict) {
          return res.status(409).json({
            success: false,
            message:
              "This room is already booked for the selected time slot.",
          });
        }

        // Save Booking
        const result =
          await bookingCollection.insertOne(
            bookingData
          );

        res.status(201).json({
          success: true,
          message:
            "Room booked successfully!",
          insertedId: result.insertedId,
        });
      }
    );

    // ===============================
    // CANCEL BOOKING
    // ===============================

    app.delete(
      "/booking/:bookingId",
      verifyToken,
      async (req, res) => {
        const { bookingId } = req.params;

        const result =
          await bookingCollection.deleteOne({
            _id: new ObjectId(
              bookingId
            ),
          });

        res.json(result);
      }
    );

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening on port ${port}`
  );
});
Now update your frontend handleBooking function.

Replace this:

toast.success('Your Room Booking is Confirmed')
redirect('/my-bookings')
with this:

if (res.ok) {
  toast.success("Room booked successfully!");
  redirect("/my-bookings");
} else {
  toast.error(data.message);
}
Now your system will:

Prevent double booking

Check overlapping time slots

Return conflict error

Show success toast

Show error toast automatically

Example conflict:

Existing booking → 09:00 - 11:00

New booking → 10:00 - 12:00 ❌ Conflict

New booking → 11:00 - 13:00 ✅ Allowed


JWT with HTTP-Only Cookies
On successful login (email/password or Google), generate a JWT containing { userId: user._id } (optionally role).
Store the token in an HTTP-only cookie (httpOnly: true, secure: true in production, sameSite: 'strict').
Create authMiddleware to:
Read token from req.cookies.token
Verify JWT
Attach req.user = { id: userId }
Return 401 Unauthorized if invalid or expired
Apply middleware to all private routes (Add Room, Book Room, My Bookings, Edit/Delete, Cancel).
Logout clears cookie using res.clearCookie('token').  how could I complete this task, give me full details

To complete this authentication system properly in your Next.js + Express + MongoDB project, you need 5 major things:

Install packages

Generate JWT on login

Store JWT in HTTP-only cookie

Create auth middleware

Protect private routes

Logout by clearing cookie

Your current project already has authentication partially working, so now you are moving into a production-style auth system.

1. Install Required Packages
Backend:

npm install jsonwebtoken cookie-parser
2. Setup Express Middleware
In your index.js

Import:

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
Add middleware:

app.use(cookieParser());
Place it after:

app.use(express.json())
So:

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());

app.use(cookieParser());
3. Create JWT Token on Login
You need a login route.

Example:

app.post("/jwt", async (req, res) => {
  const user = req.body;

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .send({
      success: true,
      message: "Login successful",
    });
});
4. Add Environment Variable
In .env

JWT_SECRET=studynook_secret_key
Use a strong random key in production.

5. Create authMiddleware
Create:

middleware/authMiddleware.js
Code:

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized Access",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.userId,
    };

    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

module.exports = authMiddleware;
6. Use Middleware in Private Routes
Import:

const authMiddleware = require("./middleware/authMiddleware");
Now protect routes:

Add Room
app.post("/room", authMiddleware, async (req, res) => {
Single Room
app.get("/room/:id", authMiddleware, async (req, res) => {
Booking
app.post("/booking", authMiddleware, async (req, res) => {
My Bookings
app.get("/booking/:userId", authMiddleware, async (req, res) => {
Delete Booking
app.delete("/booking/:bookingId", authMiddleware, async (req, res) => {
Edit Room
app.patch("/room/:id", authMiddleware, async (req, res) => {
Delete Room
app.delete("/room/:id", authMiddleware, async (req, res) => {
7. Logout Route
Add:

app.post("/logout", (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .send({
      success: true,
      message: "Logged out successfully",
    });
});
8. Frontend Login Request
After successful Better Auth login:

Example:

const { data, error } =
  await authClient.signIn.email({
    email: user.email,
    password: user.password,
  });

if (data) {
  await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/jwt`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        _id: data.user.id,
      }),
    }
  );

  redirect("/");
}
9. Frontend Protected Fetch Requests
IMPORTANT:

Every protected fetch must include:

credentials: "include"
Example:

const res = await fetch(
  `${process.env.NEXT_PUBLIC_SERVER_URL}/booking`,
  {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(bookingData),
  }
);
10. Remove Authorization Header
You no longer need:

authorization: Bearer token
because cookie handles auth automatically.

Remove this:

const {data:tokenData} = await authClient.token()
and remove:

authorization : `Bearer ${tokenData?.token}`
Final Authentication Flow
Login
User logs in →

Better Auth returns user →

Backend creates JWT →

JWT stored in HTTP-only cookie

Protected Request
Frontend sends request with:

credentials: "include"
Browser automatically sends cookie →

Middleware verifies JWT →

Access granted

Logout
Backend clears cookie →

User logged out

Security Advantages
This is much safer than localStorage token auth because:

HTTP-only cookies cannot be accessed by JavaScript

Better protection against XSS attacks

Secure production authentication system

Easier middleware protection

IMPORTANT CORS CONFIG
This is REQUIRED:

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
Otherwise cookies will not work.

Production Cookie Setup
In production:

secure: true
In localhost:

secure: false
Your current condition already handles that correctly:

secure: process.env.NODE_ENV === "production"
Recommended Structure
server/
│
├── middleware/
│   └── authMiddleware.js
│
├── index.js
│
├── .env
One Important Note
You are currently using Better Auth token verification with JWKS.

You now have TWO OPTIONS:

OPTION 1 — Keep Better Auth Token System
Use:

authClient.token()

Bearer token

jose verification

OPTION 2 — Use JWT HTTP-only Cookie System
Use:

jsonwebtoken

cookie-parser

cookies

middleware

You SHOULD choose ONE system only.

For your project requirements, OPTION 2 is the correct one because your assignment specifically asks for:

HTTP-only cookies

req.cookies.token

authMiddleware

res.clearCookie()

So I recommend fully switching to OPTION 2.


my backend code is one problem that " when someone booking a specific time slot then the same user if cancel the booking from my booking then must be that slot should be remove from database, please give me full solution

Right now your conflict check works because bookings stay inside database with:

status: "confirmed"
But when user cancels booking, you are currently deleting the booking:

deleteOne()
This creates two problems:

Booking history disappears

You cannot track cancelled bookings

A much better professional solution is:

BEST SOLUTION
Instead of deleting booking:

✅ Change status from:

confirmed
to:

cancelled
Then your conflict check will automatically ignore cancelled bookings because you already wrote:

status: "confirmed"
This is exactly how real booking systems work.

WHAT YOU SHOULD CHANGE
1. Keep Booking Status
When creating booking:

status: "confirmed"
already exists in your frontend.

Good.

2. Replace DELETE Route
REMOVE THIS:

app.delete('/booking/:bookingId',verifyToken, async(req, res) => {
  const {bookingId} = req.params

  const result = await bookingCollection.deleteOne({
    _id:new ObjectId(bookingId)
  })

  res.json(result)
})
3. ADD CANCEL ROUTE
Use PATCH instead.

app.patch(
  "/booking/cancel/:bookingId",
  verifyToken,
  async (req, res) => {

    const { bookingId } = req.params;

    const result =
      await bookingCollection.updateOne(
        {
          _id: new ObjectId(bookingId),
        },
        {
          $set: {
            status: "cancelled",
          },
        }
      );

    res.send({
      success: true,
      message: "Booking cancelled successfully",
      result,
    });
  }
);
4. Why This Fixes Your Problem
Your conflict check already says:

const existingBookings =
  await bookingCollection.find({
    roomId,
    date,
    status: "confirmed",
  }).toArray();
So:

BEFORE CANCEL
Booking:

{
  roomId: "abc",
  startTime: "09:00",
  endTime: "11:00",
  status: "confirmed"
}
❌ Conflict exists

AFTER CANCEL
Booking becomes:

{
  roomId: "abc",
  startTime: "09:00",
  endTime: "11:00",
  status: "cancelled"
}
Now conflict check ignores it.

✅ Time slot becomes available again.

5. FRONTEND CANCEL FUNCTION
Replace your delete request.

OLD:

await fetch(`/booking/${bookingId}`, {
  method: "DELETE",
});
NEW:

const res = await fetch(
  `${process.env.NEXT_PUBLIC_SERVER_URL}/booking/cancel/${bookingId}`,
  {
    method: "PATCH",
    credentials: "include",
  }
);

const data = await res.json();

if (res.ok) {
  toast.success("Booking Cancelled");
} else {
  toast.error(data.message);
}
6. Booking Card UI
You already have:

booking.status === "confirmed"
Perfect.

Now cancelled bookings automatically show:

red badge

hidden cancel button

no conflict

7. FINAL DATABASE FLOW
BOOK ROOM
Create:

{
  status: "confirmed"
}
CANCEL BOOKING
Update:

{
  status: "cancelled"
}
CONFLICT CHECK
Only check:

status: "confirmed"
FINAL RESULT
✅ Cancelled slots become available again
✅ Booking history stays محفوظ
✅ Cleaner database
✅ Professional architecture
✅ Easier admin dashboard later
✅ Easier analytics later
✅ Real-world booking system pattern

This is the correct scalable solution for your StudyNook project.


"use client";

import { authClient } from "@/lib/auth-client";
import { AlertDialog, Button } from "@heroui/react";
import toast from "react-hot-toast";

export function BookingCancelAlert({bookingId}) {
    const handleCancelBooking = async() => {

      const {data:tokenData} = await authClient.token()
        const res =await fetch(${process.env.NEXT_PUBLIC_SERVER_URL}/booking/${bookingId},{
            method: 'DELETE',
            headers: {
                'content-type' : 'application/json',
                authorization :  Bearer ${tokenData.token}
            },
        })
          const data =await res.json()
          toast.success("Room Booking Cancel Successfully")
          window.location.reload()
    }


  return (
    <AlertDialog>
      <Button className="bg-red-500 hover:bg-red-600 transition px-7 py-3 rounded-2xl font-semibold text-white">
        Cancel Booking
      </Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>
                Cancel Booking?
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                Are You Sure? Your <strong>Room Booking</strong>{" "}
                is Cancel. This action cannot be undone.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                No
              </Button>
              <Button onClick={handleCancelBooking} slot="close" variant="danger">
                Yes Cancel
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}  this is my cancel booking page, please give me change for this full code, also you have my backend code give it to me 

// ================================
// BACKEND DELETE ROUTE
// ================================

// Replace your old delete booking route with this

app.delete("/booking/:bookingId", verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find booking first
    const booking = await bookingCollection.findOne({
      _id: new ObjectId(bookingId),
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Delete booking
    const result = await bookingCollection.deleteOne({
      _id: new ObjectId(bookingId),
    });

    // Because booking is fully deleted,
    // that time slot automatically becomes available again

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
});
Updated Frontend Cancel Modal
"use client";

import { authClient } from "@/lib/auth-client";
import { AlertDialog, Button } from "@heroui/react";
import toast from "react-hot-toast";

export function BookingCancelAlert({ bookingId }) {
  const handleCancelBooking = async () => {
    try {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/booking/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Booking cancelled successfully");

        // Refresh page
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  return (
    <AlertDialog>
      {/* Open Button */}
      <Button className="bg-red-500 hover:bg-red-600 transition-all duration-300 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg">
        Cancel Booking
      </Button>

      {/* Backdrop */}
      <AlertDialog.Backdrop className="bg-black/60 backdrop-blur-sm">
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[420px] rounded-3xl border border-white/10 bg-[#0d1b2a] text-white shadow-2xl">
            <AlertDialog.CloseTrigger />

            {/* Header */}
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />

              <AlertDialog.Heading className="text-2xl font-bold">
                Cancel Booking?
              </AlertDialog.Heading>
            </AlertDialog.Header>

            {/* Body */}
            <AlertDialog.Body>
              <p className="text-gray-300 leading-relaxed">
                Are you sure you want to cancel this booking?
              </p>

              <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                <p className="text-red-300 text-sm">
                  This action cannot be undone. After cancellation, the booked
                  time slot will become available again.
                </p>
              </div>
            </AlertDialog.Body>

            {/* Footer */}
            <AlertDialog.Footer className="gap-3">
              <Button
                slot="close"
                variant="bordered"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Keep Booking
              </Button>

              <Button
                onClick={handleCancelBooking}
                slot="close"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Yes, Cancel
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}


// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
} = require("mongodb");
const {
  createRemoteJWKSet,
  jwtVerify,
} = require("jose-cjs");
dotenv.config();
const uri = process.env.MONGODB_URI;
const app = express();
const port = process.env.port;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWKS = createRemoteJWKSet(
  new URL(${process.env.CLIENT_URL}/api/auth/jwks)
);

const verifyToken = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized" });
  }

  try {
    const { payload } = await jwtVerify(
      token,
      JWKS
    );

    console.log(payload);

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Forbidden" });
  }
};

async function run() {
  try {
    // await client.connect();

    const db = client.db("studynook");

    const roomCollection =
      db.collection("rooms");

    const bookingCollection =
      db.collection("bookings");

    // ===============================
    // FEATURED ROOMS
    // ===============================

    app.get("/featured", async (req, res) => {
      const result = await roomCollection
        .find()
        .limit(4)
        .toArray();

      res.json(result);
    });

    // ===============================
    // GET ALL ROOMS
    // ===============================

    app.get("/room", async (req, res) => {
      const result = await roomCollection
        .find()
        .toArray();

      res.json(result);
    });

    // ===============================
    // ADD ROOM
    // ===============================

    app.post("/room", async (req, res) => {
      const roomData = req.body;

      const result =
        await roomCollection.insertOne(
          roomData
        );

      res.json(result);
    });

    // ===============================
    // GET SINGLE ROOM
    // ===============================

    app.get(
      "/room/:id",
      verifyToken,
      async (req, res) => {
        const { id } = req.params;

        const result =
          await roomCollection.findOne({
            _id: new ObjectId(id),
          });

        res.json(result);
      }
    );

    // ===============================
    // UPDATE ROOM
    // ===============================

    app.patch(
      "/room/:id",
      async (req, res) => {
        const { id } = req.params;

        const updatedData = req.body;

        const result =
          await roomCollection.updateOne(
            {
              _id: new ObjectId(id),
            },
            {
              $set: updatedData,
            }
          );

        res.json(result);
      }
    );

    // ===============================
    // DELETE ROOM
    // ===============================

    app.delete(
      "/room/:id",
      async (req, res) => {
        const { id } = req.params;

        const result =
          await roomCollection.deleteOne({
            _id: new ObjectId(id),
          });

        res.json(result);
      }
    );

    // ===============================
    // GET USER BOOKINGS
    // ===============================

    app.get(
      "/booking/:userId",
      async (req, res) => {
        const { userId } = req.params;

        const result =
          await bookingCollection
            .find({ userId })
            .toArray();

        res.json(result);
      }
    );

    // ===============================
    // CREATE BOOKING + CONFLICT CHECK
    // ===============================

    app.post(
      "/booking",
      verifyToken,
      async (req, res) => {
        const bookingData = req.body;

        const {
          roomId,
          date,
          startTime,
          endTime,
        } = bookingData;

        // Check Existing Booking Conflict
        const existingBookings =
          await bookingCollection
            .find({
              roomId,
              date,
              status: "confirmed",
            })
            .toArray();

        // Convert Time Function
        const convertToHour = (time) => {
          return Number(time.split(":")[0]);
        };

        const newStart =
          convertToHour(startTime);

        const newEnd =
          convertToHour(endTime);

        // Conflict Check
        const hasConflict =
          existingBookings.some((booking) => {
            const existingStart =
              convertToHour(
                booking.startTime
              );

            const existingEnd =
              convertToHour(
                booking.endTime
              );

            return (
              newStart < existingEnd &&
              newEnd > existingStart
            );
          });

        // If Conflict Found
        if (hasConflict) {
          return res.status(409).json({
            success: false,
            message:
              "This room is already booked for the selected time slot.",
          });
        }

        // Save Booking
        const result =
          await bookingCollection.insertOne(
            bookingData
          );

        res.status(201).json({
          success: true,
          message:
            "Room booked successfully!",
          insertedId: result.insertedId,
        });
      }
    );

    // ===============================
    // CANCEL BOOKING
    // ===============================

    app.delete(
      "/booking/:bookingId",
      verifyToken,
      async (req, res) => {
        const { bookingId } = req.params;

        const result =
          await bookingCollection.deleteOne({
            _id: new ObjectId(
              bookingId
            ),
          });

        res.json(result);
      }
    );

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    Example app listening on port ${port}
  );
});  this is my backend please change it where is needed

Your backend is already very close.
You only need a few important improvements:

Prevent booking conflict correctly

Keep cancelled bookings in DB instead of deleting them

Allow same slot again after cancellation

Secure routes with token

Return proper responses

The biggest mistake currently is:

deleteOne()
You are fully deleting bookings from database.

Instead, you should update status:

status: "cancelled"
Then your conflict check will ignore cancelled bookings automatically.

Replace ONLY these sections in your backend.

1. CREATE BOOKING ROUTE (Replace Your Existing /booking POST Route)
// ===============================
// CREATE BOOKING + CONFLICT CHECK
// ===============================

app.post(
  "/booking",
  verifyToken,
  async (req, res) => {
    try {
      const bookingData = req.body;

      const {
        roomId,
        date,
        startTime,
        endTime,
      } = bookingData;

      // Find Existing Confirmed Bookings
      const existingBookings =
        await bookingCollection
          .find({
            roomId,
            date,
            status: "confirmed",
          })
          .toArray();

      // Convert Time Function
      const convertToHour = (time) => {
        return Number(time.split(":")[0]);
      };

      const newStart =
        convertToHour(startTime);

      const newEnd =
        convertToHour(endTime);

      // Check Time Conflict
      const hasConflict =
        existingBookings.some((booking) => {
          const existingStart =
            convertToHour(
              booking.startTime
            );

          const existingEnd =
            convertToHour(
              booking.endTime
            );

          return (
            newStart < existingEnd &&
            newEnd > existingStart
          );
        });

      // Conflict Found
      if (hasConflict) {
        return res.status(409).json({
          success: false,
          message:
            "This room is already booked for the selected time slot.",
        });
      }

      // Add Default Status
      bookingData.status =
        bookingData.status || "confirmed";

      // Save Booking
      const result =
        await bookingCollection.insertOne(
          bookingData
        );

      res.status(201).json({
        success: true,
        message:
          "Room booked successfully!",
        insertedId: result.insertedId,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);
2. CANCEL BOOKING ROUTE (IMPORTANT)
Replace this:

deleteOne()
WITH THIS:

// ===============================
// CANCEL BOOKING
// ===============================

app.patch(
  "/booking/cancel/:bookingId",
  verifyToken,
  async (req, res) => {
    try {
      const { bookingId } = req.params;

      const result =
        await bookingCollection.updateOne(
          {
            _id: new ObjectId(
              bookingId
            ),
          },
          {
            $set: {
              status: "cancelled",
            },
          }
        );

      res.json({
        success: true,
        message:
          "Booking cancelled successfully",
        result,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);
WHY THIS FIXES EVERYTHING
Before:

Booking exists forever

Slot remains blocked

Even after delete problems can happen

Now:

When cancelled:

status: "cancelled"
And conflict checker only checks:

status: "confirmed"
So:

✅ Confirmed booking blocks slot
✅ Cancelled booking does NOT block slot
✅ Booking history stays محفوظ
✅ Better real-world system

3. UPDATE FRONTEND CANCEL COMPONENT
Replace your handleCancelBooking

with this:

const handleCancelBooking = async () => {
  const { data: tokenData } =
    await authClient.token();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/booking/cancel/${bookingId}`,
    {
      method: "PATCH",
      headers: {
        "content-type":
          "application/json",
        authorization: `Bearer ${tokenData.token}`,
      },
    }
  );

  const data = await res.json();

  if (data.success) {
    toast.success(
      "Booking Cancelled Successfully"
    );

    window.location.reload();
  }
};
4. FRONTEND BOOKING ERROR HANDLING
Inside your BookingCard component:

Replace this section:

const data = await res.json()
toast.success('Your Room Booking is Confirmed')
redirect('/my-bookings')
WITH:

const data = await res.json();

if (!res.ok) {
  toast.error(data.message);
  return;
}

toast.success(
  "Room booked successfully!"
);

window.location.href =
  "/my-bookings";
FINAL RESULT
Now your system supports:

✅ Booking conflict detection
✅ Prevent overlapping bookings
✅ Cancel booking safely
✅ Re-book cancelled slot
✅ Persistent booking history
✅ Proper toast messages
✅ Real-world booking logic

Your architecture is now production-style.


give me full code, I just copy and paste

// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
} = require("mongodb");

const {
  createRemoteJWKSet,
  jwtVerify,
} = require("jose-cjs");

dotenv.config();

const uri = process.env.MONGODB_URI;

const app = express();

const port = process.env.port;

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());

// ===============================
// MONGODB CLIENT
// ===============================

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// ===============================
// JWT VERIFY
// ===============================

const JWKS = createRemoteJWKSet(
  new URL(
    `${process.env.CLIENT_URL}/api/auth/jwks`
  )
);

const verifyToken = async (
  req,
  res,
  next
) => {
  const authHeader =
    req?.headers?.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token =
    authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const { payload } =
      await jwtVerify(token, JWKS);

    req.user = payload;

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }
};

// ===============================
// DATABASE RUN
// ===============================

async function run() {
  try {
    // await client.connect();

    const db = client.db("studynook");

    const roomCollection =
      db.collection("rooms");

    const bookingCollection =
      db.collection("bookings");

    // ===============================
    // FEATURED ROOMS
    // ===============================

    app.get(
      "/featured",
      async (req, res) => {
        const result =
          await roomCollection
            .find()
            .limit(4)
            .toArray();

        res.json(result);
      }
    );

    // ===============================
    // GET ALL ROOMS
    // ===============================

    app.get(
      "/room",
      async (req, res) => {
        const result =
          await roomCollection
            .find()
            .toArray();

        res.json(result);
      }
    );

    // ===============================
    // GET SINGLE ROOM
    // ===============================

    app.get(
      "/room/:id",
      verifyToken,
      async (req, res) => {
        try {
          const { id } = req.params;

          const result =
            await roomCollection.findOne(
              {
                _id: new ObjectId(id),
              }
            );

          res.json(result);
        } catch (error) {
          res.status(500).json({
            success: false,
            message:
              "Failed to fetch room",
          });
        }
      }
    );

    // ===============================
    // ADD ROOM
    // ===============================

    app.post(
      "/room",
      verifyToken,
      async (req, res) => {
        try {
          const roomData = req.body;

          const result =
            await roomCollection.insertOne(
              roomData
            );

          res.status(201).json({
            success: true,
            message:
              "Room added successfully",
            result,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message:
              "Failed to add room",
          });
        }
      }
    );

    // ===============================
    // UPDATE ROOM
    // ===============================

    app.patch(
      "/room/:id",
      verifyToken,
      async (req, res) => {
        try {
          const { id } = req.params;

          const updatedData =
            req.body;

          const result =
            await roomCollection.updateOne(
              {
                _id: new ObjectId(id),
              },
              {
                $set: updatedData,
              }
            );

          res.json({
            success: true,
            message:
              "Room updated successfully",
            result,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message:
              "Failed to update room",
          });
        }
      }
    );

    // ===============================
    // DELETE ROOM
    // ===============================

    app.delete(
      "/room/:id",
      verifyToken,
      async (req, res) => {
        try {
          const { id } = req.params;

          const result =
            await roomCollection.deleteOne(
              {
                _id: new ObjectId(id),
              }
            );

          res.json({
            success: true,
            message:
              "Room deleted successfully",
            result,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message:
              "Failed to delete room",
          });
        }
      }
    );

    // ===============================
    // GET USER BOOKINGS
    // ===============================

    app.get(
      "/booking/:userId",
      verifyToken,
      async (req, res) => {
        try {
          const { userId } =
            req.params;

          const result =
            await bookingCollection
              .find({ userId })
              .toArray();

          res.json(result);
        } catch (error) {
          res.status(500).json({
            success: false,
            message:
              "Failed to fetch bookings",
          });
        }
      }
    );

    // ===============================
    // CREATE BOOKING
    // ===============================

    app.post(
      "/booking",
      verifyToken,
      async (req, res) => {
        try {
          const bookingData =
            req.body;

          const {
            roomId,
            date,
            startTime,
            endTime,
          } = bookingData;

          // ===============================
          // FIND EXISTING BOOKINGS
          // ===============================

          const existingBookings =
            await bookingCollection
              .find({
                roomId,
                date,
                status: "confirmed",
              })
              .toArray();

          // ===============================
          // CONVERT TIME
          // ===============================

          const convertToHour = (
            time
          ) => {
            return Number(
              time.split(":")[0]
            );
          };

          const newStart =
            convertToHour(
              startTime
            );

          const newEnd =
            convertToHour(endTime);

          // ===============================
          // CHECK CONFLICT
          // ===============================

          const hasConflict =
            existingBookings.some(
              (booking) => {
                const existingStart =
                  convertToHour(
                    booking.startTime
                  );

                const existingEnd =
                  convertToHour(
                    booking.endTime
                  );

                return (
                  newStart <
                    existingEnd &&
                  newEnd >
                    existingStart
                );
              }
            );

          // ===============================
          // IF CONFLICT FOUND
          // ===============================

          if (hasConflict) {
            return res
              .status(409)
              .json({
                success: false,
                message:
                  "This room is already booked for the selected time slot.",
              });
          }

          // ===============================
          // SAVE BOOKING
          // ===============================

          bookingData.status =
            bookingData.status ||
            "confirmed";

          bookingData.createdAt =
            new Date();

          const result =
            await bookingCollection.insertOne(
              bookingData
            );

          res.status(201).json({
            success: true,
            message:
              "Room booked successfully!",
            insertedId:
              result.insertedId,
          });
        } catch (error) {
          console.log(error);

          res.status(500).json({
            success: false,
            message:
              "Failed to create booking",
          });
        }
      }
    );

    // ===============================
    // CANCEL BOOKING
    // ===============================

    app.patch(
      "/booking/cancel/:bookingId",
      verifyToken,
      async (req, res) => {
        try {
          const { bookingId } =
            req.params;

          const result =
            await bookingCollection.updateOne(
              {
                _id: new ObjectId(
                  bookingId
                ),
              },
              {
                $set: {
                  status:
                    "cancelled",
                },
              }
            );

          res.json({
            success: true,
            message:
              "Booking cancelled successfully",
            result,
          });
        } catch (error) {
          console.log(error);

          res.status(500).json({
            success: false,
            message:
              "Failed to cancel booking",
          });
        }
      }
    );

    console.log(
      "MongoDB Connected Successfully"
    );
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

// ===============================
// ROOT ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send("StudyNook Server Running");
});

// ===============================
// SERVER LISTEN
// ===============================

app.listen(port, () => {
  console.log(
    `Server running on port ${port}`
  );
});

bookings.map is not a function
src\app\my-bookings\page.jsx (98:23) @ MyBookingPage


   96 |         ) : (
   97 |           <div className="space-y-8">
>  98 |             {bookings.map((booking) => {
      |                       ^
   99 |               const bookingDate = new Date(booking.date);
  100 |
  101 |               const today = new Date();  this is my bookings page, I found this problem here

This error means:

bookings is not an array
So .map() cannot run.

Most probably your backend is returning:

{
  success: false,
  message: "Unauthorized"
}
OR

{
  message: "Forbidden"
}
instead of an array.

Because now your backend route:

/booking/:userId
is protected with:

verifyToken
But your frontend fetch does NOT send token.

FIX
Go to your MyBookingPage

and replace your fetch section with this:

const { data: tokenData } =
  await authClient.token();

const res = await fetch(
  `${process.env.NEXT_PUBLIC_SERVER_URL}/booking/${user?.id}`,
  {
    cache: "no-store",
    headers: {
      authorization: `Bearer ${tokenData?.token}`,
    },
  }
);

const bookings = await res.json();
BUT
authClient.token() cannot be used inside Server Component.

Your current page is:

const MyBookingPage = async () => {}
which means Server Component.

So you have TWO OPTIONS.

BEST SOLUTION (RECOMMENDED)
Remove token verification from this route temporarily:

Backend:

Change this:

app.get(
  "/booking/:userId",
  verifyToken,
TO:

app.get(
  "/booking/:userId",
Because your frontend is using Server Component.

WHY THIS HAPPENS
Server Components cannot easily access:

authClient.token()
That works only in client components.

EXTRA SAFETY FIX
Also change:

{bookings.map(...)}
TO:

{Array.isArray(bookings) &&
  bookings.map((booking) => (
This prevents crash even if API fails.

FINAL FIX YOU SHOULD DO NOW
Backend
REMOVE verifyToken from:

/booking/:userId
Frontend
Change:

bookings.map
to:

Array.isArray(bookings) &&
bookings.map
Then everything will work correctly.


Readme.md: Add a meaningful readme.md file with the name of your website and a live site URL on client side. Include a minimum of five bullet points to feature your website.  you know my project details, just give me a read me file

# StudyNook

StudyNook is a modern study room booking platform where students can discover, book, and manage quiet study spaces easily. Users can also list their own study rooms and manage bookings through a beautiful and responsive dashboard experience.

## 🌐 Live Site

Client Site: https://your-live-site-url.com

---

## 🚀 Features

- 🔐 Secure authentication system using Email/Password and Google Login
- 🏠 Users can add, edit, and delete their own study room listings
- 📅 Real-time room booking system with booking conflict prevention
- ❌ Booking cancellation system with confirmation modal
- 🌙 Modern responsive UI with dark/light theme toggle support
- 🔎 Search and filter functionality for browsing rooms
- 📱 Fully responsive design optimized for mobile, tablet, and desktop
- 🧾 Personalized “My Bookings” page with booking status tracking
- ⚡ Protected private routes using JWT token verification
- 🎨 Beautiful animations and interactive UI using Framer Motion

---

## 🛠️ Technologies Used

### Frontend
- Next.js
- React
- Tailwind CSS
- HeroUI
- Framer Motion
- React Icons
- Lucide React

### Backend
- Express.js
- MongoDB
- JWT Authentication
- JOSE
- CORS
- Dotenv

---

## 🔑 Environment Variables

### Client
```env
NEXT_PUBLIC_SERVER_URL=
```

### Server
```env
MONGODB_URI=
CLIENT_URL=
PORT=
```

---

## 👨‍💻 Author

Developed by Shahriar Kabir

