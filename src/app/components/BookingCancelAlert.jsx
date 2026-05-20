"use client";

import { authClient } from "@/lib/auth-client";
import { AlertDialog, Button } from "@heroui/react";

export function BookingCancelAlert({bookingId}) {
    const handleCancelBooking = async() => {

      const {data:tokenData} = await authClient.token()
        const res =await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking/${bookingId}`,{
            method: 'DELETE',
            headers: {
                'content-type' : 'application/json',
                authorization :  `Bearer ${tokenData.token}`
            },
        })
          const data =await res.json()
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
}
