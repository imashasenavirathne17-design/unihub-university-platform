import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { Calendar, Trash2, Clock, MapPin, Search, PlusCircle, User as UserIcon, Mail, ShieldAlert, Edit3, X } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        setLoading(false);
      } else {
        fetchBookings();
      }
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings/me');
      // Sort bookings by date and time
      const sortedBookings = res.data.sort((a, b) => {
        if (a.date !== b.date) return new Date(a.date) - new Date(b.date);
        return a.startTime.localeCompare(b.startTime);
      });
      setBookings(sortedBookings);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}/cancel`);
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert('Failed to cancel booking');
    }
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/bookings/${editModal._id}`, {
        date: editModal.date,
        startTime: editModal.startTime,
        endTime: editModal.endTime
      });
      setEditModal(null);
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to update booking');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div></div>;

  if (user?.role === 'student') {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">My Profile</h1>
          <p className="text-gray-500 mt-1">View your account details and permissions.</p>
        </div>
        
        <div className="glass rounded-3xl p-8 shadow-sm border border-slate-200/60 flex flex-col items-center">
          <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
            <UserIcon className="w-12 h-12 text-brand-600 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-200/50 to-transparent"></div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">{user.name}</h2>
          <div className="flex items-center gap-2 text-gray-500 mb-8 font-medium">
            <Mail className="w-4 h-4" /> {user.email}
          </div>
          
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-gray-500 font-medium">Account Role</span>
              <span className="bg-brand-50 text-brand-700 text-sm font-bold px-3 py-1.5 rounded-full border border-brand-100 uppercase tracking-wide">
                Student
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-gray-500 font-medium">Booking Access</span>
              <span className="text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 font-bold text-sm tracking-wide flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4"/> View Only
              </span>
            </div>
            <p className="text-sm text-center text-gray-500 pt-2 pb-3">
              As a student, you can view the timeline of available lecture halls and laboratories, but you do not have permission to book spaces.
            </p>
            <Link to="/" className="group flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all hover:scale-[1.02] shadow-lg shadow-brand-500/30">
               View Spaces Timeline
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your active lecture hall and laboratory bookings.</p>
        </div>
        <Link to="/" className="text-white bg-brand-600 hover:bg-brand-700 font-medium rounded-xl text-sm px-5 py-2.5 text-center flex items-center gap-2 transition-all hover:scale-105 shadow-md shadow-brand-500/20">
          <PlusCircle className="w-5 h-5"/> Book a Room
        </Link>
      </div>

      <div className="glass rounded-3xl p-8 shadow-sm border border-slate-200/60">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-brand-500" /> Upcoming Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center">
            <Search className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No active bookings</h3>
            <p className="text-gray-500 mt-1 mb-6 max-w-sm mx-auto">You haven't booked any rooms yet. Head over to the home page to find available slots.</p>
            <Link to="/" className="text-brand-600 bg-brand-50 hover:bg-brand-100 font-semibold rounded-lg text-sm px-6 py-3 transition-colors">
              Find Available Spots
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => {
              const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' });
              const isPast = booking.date < todayStr;
              const isToday = booking.date === todayStr;
              
              return (
              <div key={booking._id} className={`rounded-2xl p-5 border shadow-sm transition-shadow relative group ${isPast ? 'bg-slate-50 border-slate-200 opacity-60 grayscale' : isToday ? 'bg-brand-50/30 border-brand-400 ring-4 ring-brand-500/10 hover:shadow-lg shadow-brand-500/10' : 'bg-white border-slate-100 hover:shadow-md'}`}>
                <div className="absolute top-4 right-4 flex gap-2">
                  {isToday && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-accent-200 bg-accent-100 text-accent-700 animate-pulse tracking-wide select-none">
                      TODAY
                    </span>
                  )}
                  <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${isPast ? 'bg-gray-200 text-gray-500 border-gray-300' : 'bg-brand-50 text-brand-700 border-brand-100'}`}>
                    {booking.roomId.type === 'lab' ? 'Laboratory' : 'Lecture Hall'}
                  </div>
                </div>
                
                <h3 className={`text-xl font-bold mb-4 ${isPast ? 'text-slate-500' : 'text-slate-800'}`}>{booking.roomId.roomName}</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600 gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" /> 
                    {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 gap-2">
                    <Clock className="w-4 h-4 text-gray-400" /> 
                    {booking.startTime} - {booking.endTime}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" /> 
                    Floor {booking.roomId.floor}
                  </div>
                </div>
                
                {isPast ? (
                  <div className="w-full mt-4 bg-slate-200/50 text-slate-500 font-bold uppercase tracking-widest rounded-xl text-xs px-4 py-2.5 text-center flex items-center justify-center border border-slate-200 pointer-events-none">
                    Completed
                  </div>
                ) : (
                  <div className="flex gap-2 w-full mt-4">
                    <button 
                      onClick={() => setEditModal(booking)}
                      className="flex-1 text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-brand-600 font-medium rounded-xl text-sm px-4 py-2 text-center flex items-center justify-center gap-2 transition-colors border border-slate-200"
                    >
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>
                    <button 
                      onClick={() => cancelBooking(booking._id)}
                      className="flex-1 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 font-medium rounded-xl text-sm px-4 py-2 text-center flex items-center justify-center gap-2 transition-colors border border-red-100"
                    >
                      <Trash2 className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            )})}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-white relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-400 to-accent-500"></div>
            
            <button 
              onClick={() => setEditModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5"/>
            </button>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-6 pr-8">Edit Booking Time</h2>
            
            <form onSubmit={handleUpdateBooking} className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-sm font-medium text-gray-500">Room</span>
                  <span className="font-bold text-slate-800">{editModal.roomId.roomName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Current Date</span>
                  <span className="font-bold text-slate-800">{new Date(editModal.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Date</label>
                <input 
                  type="date"
                  className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-xl bg-white shadow-sm border transition-shadow"
                  value={editModal.date}
                  required
                  onChange={(e) => setEditModal({...editModal, date: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <select 
                    className="block w-full pl-4 pr-8 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-xl appearance-none bg-white shadow-sm border transition-shadow"
                    value={editModal.startTime}
                    onChange={(e) => setEditModal({...editModal, startTime: e.target.value})}
                  >
                    {Array.from({ length: 12 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <select 
                    className="block w-full pl-4 pr-8 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-xl appearance-none bg-white shadow-sm border transition-shadow"
                    value={editModal.endTime}
                    onChange={(e) => setEditModal({...editModal, endTime: e.target.value})}
                  >
                    {Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`).filter(t => t > editModal.startTime).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
                  className="flex-1 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium py-3 px-4 rounded-xl text-sm transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-500/30 text-sm font-medium text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all hover:scale-[1.02]"
                >
                  Confirm Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
