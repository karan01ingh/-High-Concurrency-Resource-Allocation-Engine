
import { useState } from "react";
import AuthModel from "./components/AuthModel";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import CreateEvent from "./Pages/Event_Create";
import Profile from "./Pages/Profile";
import BookingPayment from "./Pages/Booking_Payments";
import OrganizerDashboard from "./Pages/Organizer_Dashboard";
import MyEvents from "./Pages/My_Events";
import MyBookings from "./Pages/My_Bookings";
import UserDashboard from "./Pages/User_Dashboard";
import BookingConfirmation from "./Pages/Booking_Confirmation";

export default function App() {
  const [isOpen, setIsOpen] = useState(true);

  // return (
  //   <main className="flex min-h-screen items-center justify-center bg-slate-950">
  //     <button
  //       onClick={() => setIsOpen(true)}
  //       className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
  //     >
  //       Login / Sign Up
  //     </button>
  //     <AuthModel
  //       isOpen={isOpen}
  //       onClose={() => setIsOpen(false)}
  //     />
  //   </main>
  // );
  return (
    <>
    <MyEvents/>
    </>
  )
}
