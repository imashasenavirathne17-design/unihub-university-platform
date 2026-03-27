import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar as CalendarIcon, Filter, Info, X } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  // Filters
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' }));
  const [floor, setFloor] = useState('1');
  const [type, setType] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(null); // { room, startTime }
  
  // Array of hours for the timeline: 08:00 to 19:00
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const roomParams = new URLSearchParams();
      if (floor) roomParams.append('floor', floor);
      if (type) roomParams.append('type', type);
      
      const [roomsRes, bookingsRes] = await Promise.all([
         axios.get(`http://localhost:5000/api/rooms?${roomParams.toString()}`),
         axios.get(`http://localhost:5000/api/bookings?date=${date}`)
      ]);
      
      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [date, floor, type]);

  const isSlotBooked = (roomId, timeStr) => {
    return bookings.some(b => {
      if (b.roomId._id === roomId || b.roomId === roomId) {
        return timeStr >= b.startTime && timeStr < b.endTime;
      }
      return false;
    });
  };

  const handleSlotClick = (room, timeStr) => {
    if (!user) {
      alert("Please login to book a lecture hall.");
      return;
    }
    if (user.role === 'student') {
      alert("Students cannot book spaces. Please view active bookings on your Dashboard.");
      return;
    }
    if (isSlotBooked(room._id, timeStr)) return;
    
    // Set default end time to 1 hour later
    const startHour = parseInt(timeStr.split(':')[0]);
    const endTime = `${(startHour + 1).toString().padStart(2, '0')}:00`;
    
    setBookingModal({ room, startTime: timeStr, endTime });
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        roomId: bookingModal.room._id,
        date,
        startTime: bookingModal.startTime,
        endTime: bookingModal.endTime
      });
      setBookingModal(null);
      fetchData(); // Refresh slots
    } catch (err) {
      alert(err.response?.data?.message || 'Error booking room');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header section with filters */}
      <div className="glass rounded-3xl p-6 shadow-sm border border-slate-200/60 sticky top-24 z-30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Room Availability</h1>
            <p className="text-gray-500 text-sm mt-1">Book a lecture hall or laboratory slot in real-time.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-4 w-4 text-brand-500" />
               </div>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-brand-500 bg-white shadow-sm text-sm font-medium text-slate-700 w-full md:w-auto transition-shadow"
              />
            </div>
            
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            
            <div className="relative flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400 absolute left-3 z-10" />
              <select 
                value={floor} 
                onChange={(e) => setFloor(e.target.value)}
                className="pl-9 pr-8 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-brand-500 bg-white shadow-sm text-sm font-medium text-slate-700 appearance-none transition-shadow"
              >
                {[1, 2, 3, 4, 5, 6, 7].map(f => (
                  <option key={f} value={f}>Floor {f}</option>
                ))}
              </select>
            </div>
            
            <div className="relative flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400 absolute left-3 z-10" />
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="pl-9 pr-8 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-brand-500 bg-white shadow-sm text-sm font-medium text-slate-700 appearance-none transition-shadow"
              >
                <option value="">All Types</option>
                <option value="lecture hall">Lecture Hall</option>
                <option value="lab">Laboratory</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="glass rounded-3xl p-6 shadow-sm border border-slate-200/60 overflow-hidden relative">
        <div className="flex items-center gap-6 mb-8 mt-2 ml-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium font-mono">
            <span className="w-4 h-4 rounded shadow-sm bg-brand-500"></span> Available
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium font-mono">
            <span className="w-4 h-4 rounded shadow-sm bg-slate-200 border border-slate-300"></span> Booked
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
          </div>
        ) : rooms.length === 0 ? (
           <div className="h-64 flex flex-col items-center justify-center text-gray-500 space-y-3">
             <Info className="w-10 h-10 text-gray-300" />
             <p>No rooms found for the selected criteria.</p>
           </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[800px]">
              {/* Timeline Header */}
              <div className="flex ml-48 mb-4 border-b border-gray-100 pb-2">
                {timeSlots.map(time => (
                  <div key={time} className="flex-1 text-center text-xs font-semibold text-gray-400">
                    {time}
                  </div>
                ))}
              </div>

              {/* Rooms List */}
              <div className="space-y-4">
                {rooms.map(room => (
                  <div key={room._id} className="flex items-center group relative hover:bg-slate-50 rounded-xl transition-colors p-1 pr-4">
                    <div className="w-48 flex-shrink-0 px-4">
                      <div className="font-bold text-slate-800">{room.roomName}</div>
                      <div className="text-xs text-brand-600 font-medium capitalize mt-0.5 inline-block bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
                        {room.type}
                      </div>
                    </div>
                    
                    <div className="flex flex-1 h-12 gap-1 py-1">
                      {timeSlots.map(time => {
                        const booked = isSlotBooked(room._id, time);
                        return (
                          <div 
                            key={time}
                            onClick={() => handleSlotClick(room, time)}
                            className={`flex-1 rounded-md transition-all duration-300 flex items-center justify-center shadow-sm relative group/slot
                              ${booked 
                                ? 'bg-slate-200 border border-slate-300 cursor-not-allowed opacity-70 scale-[0.98]' 
                                : 'bg-brand-500 hover:bg-brand-400 hover:shadow-brand-500/30 hover:scale-105 cursor-pointer z-10'
                              }
                            `}
                          >
                           {!booked && user?.role !== 'student' && (
                             <span className="opacity-0 group-hover/slot:opacity-100 text-[10px] font-bold text-white transition-opacity select-none">
                               BOOK
                             </span>
                           )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-white relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-400 to-blue-500"></div>
            
            <button 
              onClick={() => setBookingModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5"/>
            </button>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-6 pr-8">Confirm Booking</h2>
            
            <form onSubmit={handleBook} className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-sm font-medium text-gray-500">Room</span>
                  <span className="font-bold text-slate-800">{bookingModal.room.roomName}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-sm font-medium text-gray-500">Date</span>
                  <span className="font-bold text-slate-800">{new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Start Time</span>
                  <span className="font-bold text-slate-800">{bookingModal.startTime}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration / End Time</label>
                <div className="relative">
                  <select 
                    className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-xl appearance-none bg-white shadow-sm border transition-shadow"
                    value={bookingModal.endTime}
                    onChange={(e) => setBookingModal({...bookingModal, endTime: e.target.value})}
                  >
                    {timeSlots.map(time => {
                      if (time <= bookingModal.startTime) return null;
                      return <option key={time} value={time}>{time}</option>;
                    })}
                    <option value="20:00">20:00</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setBookingModal(null)}
                  className="flex-1 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium py-3 px-4 rounded-xl text-sm transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-500/30 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all hover:scale-[1.02]"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
