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
          <Link href={"/my-listings"}>My Listings</Link>
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

export default Navbar;
