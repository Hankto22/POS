import { useEffect, useState } from 'react';
import { getAllShifts, endShift } from '../services/api';
import type { Shift } from '../types/components';

export default function ShiftManagement() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await getAllShifts();
        setShifts(res.data || []);
      } catch (error) {
        console.error('Error fetching shifts:', error);
        setShifts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchShifts();
  }, []);

  const handleEndShift = async (shiftId: string) => {
    try {
      const satisfaction = prompt('Enter customer satisfaction (1-5):');
      if (satisfaction && parseInt(satisfaction) >= 1 && parseInt(satisfaction) <= 5) {
        await endShift(shiftId, { customerSatisfaction: parseInt(satisfaction) });
        // Refresh shifts
        const res = await getAllShifts();
        setShifts(res.data || []);
      }
    } catch (error) {
      console.error('Error ending shift:', error);
      alert('Failed to end shift');
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Shift Management</h2>

      {shifts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No shifts recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Start Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">End Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Total Sales</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {shifts.map(shift => (
                <tr key={shift.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{shift.user?.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(shift.startTime).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {shift.endTime ? new Date(shift.endTime).toLocaleString() : 'Ongoing'}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400">
                    KES {shift.totalSales}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {shift.isActive ? 'Active' : 'Ended'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {shift.isActive && (
                      <button
                        onClick={() => handleEndShift(shift.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        End Shift
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}