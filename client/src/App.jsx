
import { Routes, Route, Navigate } from "react-router-dom";

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

import { useAuth } from "./Context/AuthContext";

export default function App() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />

        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking-payment" element={<BookingPayment />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AuthModel
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
    </>
  );
}
