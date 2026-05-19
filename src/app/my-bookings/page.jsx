import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const MyBookingPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user

  const res = await fetch(
    `http://localhost:5000/booking/${user?.id}`,
  );

  const bookings =await res.json()
  console.log(bookings)

  return <div>My Bookings</div>;
};

export default MyBookingPage;
