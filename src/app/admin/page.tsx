'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import type { Booking } from '@prisma/client';
import Link from 'next/link';

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setError(null);
    try {
      const response = await fetch(`${window.location.origin}/api/admin/bookings`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await fetch(`${window.location.origin}/api/admin/bookings/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete booking');
      
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    }
  };

  const resendEmail = async (booking: Booking) => {
    try {
      const response = await fetch(`${window.location.origin}/api/admin/bookings/resend-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      
      if (!response.ok) throw new Error('Failed to resend email');
      
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-8">Admin Dashboard</h1>
          <nav className="space-y-2">
            <Link 
              href="/admin"
              className="block py-2 px-4 rounded bg-gray-700 text-white hover:bg-gray-600"
            >
              Bookings
            </Link>
            <Link 
              href="/admin/emails"
              className="block py-2 px-4 rounded text-white hover:bg-gray-700"
            >
              Email Manager
            </Link>
            <Link 
              href="/admin/email-campaigns"
              className="block py-2 px-4 rounded text-white hover:bg-gray-700"
            >
              Email Campaigns
            </Link>
            <Link 
              href="/"
              className="block py-2 px-4 rounded text-white hover:bg-gray-700"
            >
              Back to Website
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md border p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Bookings</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-black">
                  {bookings.length} total bookings
                </span>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-black">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-black">No bookings found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-black">Name</th>
                      <th className="px-4 py-2 text-left text-black">Email</th>
                      <th className="px-4 py-2 text-left text-black">Date</th>
                      <th className="px-4 py-2 text-left text-black">Time</th>
                      <th className="px-4 py-2 text-left text-black">Status</th>
                      <th className="px-4 py-2 text-left text-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-t">
                        <td className="px-4 py-2 text-black">{booking.name}</td>
                        <td className="px-4 py-2 text-black">{booking.email}</td>
                        <td className="px-4 py-2 text-black">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-black">{booking.bookingTime}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => resendEmail(booking)}
                              className="text-black hover:text-blue-800"
                            >
                              Resend Email
                            </button>
                            <button
                              onClick={() => deleteBooking(booking.id)}
                              className="text-black hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
