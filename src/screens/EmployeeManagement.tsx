import React, { useState } from "react";
import { DashboardLayout } from "./Dashboard/DashboardLayout";
import { Button } from "../components/ui/button";
import { UserCircle, MoreVertical } from "lucide-react";
import { employees, Employee } from "../lib/employees";

export const EmployeeManagement = () => {
  const [selected, setSelected] = useState<Employee | null>(null);
  return (
    <DashboardLayout pageTitle="Employee Management">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-400 mb-6">
        <span>Dashboard</span>
        <span className="mx-2">&gt;</span>
        <span className="text-[#335CFF] font-semibold">Time-tracking</span>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col">
          <span className="text-xs text-gray-400 mb-2">Present</span>
          <span className="text-2xl font-bold mb-2">12</span>
          <span className="text-xs text-gray-400">Increased by 20% from yesterday (10 present)</span>
        </div>
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col">
          <span className="text-xs text-gray-400 mb-2">Absent</span>
          <span className="text-2xl font-bold mb-2">2</span>
          <span className="text-xs text-gray-400">Decreased by 33% from yesterday (3 absent)</span>
        </div>
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col">
          <span className="text-xs text-gray-400 mb-2">On Leave</span>
          <span className="text-2xl font-bold mb-2">1</span>
          <span className="text-xs text-gray-400">No change from yesterday</span>
        </div>
        <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] flex flex-col">
          <span className="text-xs text-gray-400 mb-2">Total Staff</span>
          <span className="text-2xl font-bold mb-2">15</span>
          <span className="text-xs text-gray-400">No change from yesterday</span>
        </div>
      </div>
      {/* Filters and Date Range */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Button variant="outline" className="text-xs px-4 py-2">Role</Button>
          <Button variant="outline" className="text-xs px-4 py-2">Status</Button>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" className="text-xs px-4 py-2">Last 7 Days</Button>
          <Button variant="outline" className="text-xs px-4 py-2">20th Feb</Button>
          <span className="text-xs text-gray-400">-</span>
          <Button variant="outline" className="text-xs px-4 py-2">27th Feb</Button>
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Employee ID</th>
              <th className="py-3 px-4 font-semibold">Role</th>
              <th className="py-3 px-4 font-semibold">Shift Time</th>
              <th className="py-3 px-4 font-semibold">Clock-In Status</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr key={idx} className="border-b hover:bg-[#F7F8FA] cursor-pointer" onClick={() => setSelected(emp)}>
                <td className="py-3 px-4 flex items-center gap-2">
                  <UserCircle className="w-6 h-6 text-gray-400" />
                  <span>{emp.name}</span>
                </td>
                <td className="py-3 px-4">{emp.id}</td>
                <td className="py-3 px-4">{emp.role}</td>
                <td className="py-3 px-4">{emp.shift}</td>
                <td className="py-3 px-4">{emp.status === "Present" ? `Clocked in @ ${emp.clockIn}` : '-'}</td>
                <td className="py-3 px-4">
                  {emp.status === "Present" && <span className="px-3 py-1 rounded-full bg-[#E6F9F0] text-[#00B96B] font-semibold text-xs">Present</span>}
                  {emp.status === "Absent" && <span className="px-3 py-1 rounded-full bg-[#FFEEF0] text-[#FF4D4F] font-semibold text-xs">Absent</span>}
                  {emp.status === "On Leave" && <span className="px-3 py-1 rounded-full bg-[#FFF8E1] text-[#FFC107] font-semibold text-xs">On Leave</span>}
                </td>
                <td className="py-3 px-4">
                  <Button className="bg-[#EEF4FF] text-[#335CFF] px-4 py-1 text-xs font-semibold">Check In</Button>
                  <MoreVertical className="inline ml-2 w-4 h-4 text-gray-400 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Employee Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative p-0 overflow-hidden">
            <button className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-black" onClick={() => setSelected(null)}>&times;</button>
            <div className="flex flex-col md:flex-row gap-8 p-8 pt-12">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">{selected.name}</span>
                      <span className="ml-2 px-3 py-1 rounded-full bg-[#E6F9F0] text-[#00B96B] font-semibold text-xs">{selected.status}</span>
                    </div>
                    <div className="text-xs text-gray-400 flex gap-4">
                      <span>Employee ID: {selected.id}</span>
                      <span>Role: {selected.role}</span>
                      <span>Department: {selected.department}</span>
                      <span>Joined: {selected.joined}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#F0F0F0] p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">Product Sales</span>
                    <select className="border border-[#E5E7EB] rounded px-2 py-1 text-xs">
                      <option>Last 7 Days</option>
                    </select>
                  </div>
                  {/* Dummy Bar Chart */}
                  <div className="flex items-end gap-3 h-32">
                    {selected.productSales.map((v, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className={`w-6 rounded-t bg-[#335CFF]`} style={{height: `${v * 12}px`}}></div>
                        <span className="text-xs text-gray-400 mt-1">{selected.productSalesLabels[i]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#335CFF] inline-block" />Hours Worked</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#B0B7C3] inline-block" />Days</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-72 flex-shrink-0 flex flex-col gap-6">
                <div>
                  <div className="font-semibold mb-2">Shift & Timing</div>
                  <div className="text-xs text-gray-500 mb-1">Default Shift: <span className="text-black">{selected.defaultShift}</span></div>
                  <div className="text-xs text-gray-500 mb-1">Average Clock-in Time: <span className="text-black">{selected.avgClockIn}</span></div>
                  <div className="text-xs text-gray-500 mb-1">Preferred Days Off: <span className="text-black">{selected.preferredDayOff}</span></div>
                </div>
                <div>
                  <div className="font-semibold mb-2">Contact Info</div>
                  <div className="text-xs text-gray-500 mb-1">Phone: <span className="text-black">{selected.phone}</span></div>
                  <div className="text-xs text-gray-500 mb-1">Email: <span className="text-black">{selected.email}</span></div>
                  <div className="text-xs text-gray-500 mb-1">Emergency Contact: <span className="text-black">{selected.emergency}</span></div>
                </div>
                <div>
                  <div className="font-semibold mb-2">Work Performance</div>
                  <div className="text-xs text-gray-500 mb-1">Total Hours Worked: <span className="text-black">{selected.totalHours} hrs</span></div>
                  <div className="text-xs text-gray-500 mb-1">Overtime Hours: <span className="text-black">{selected.overtime} hrs</span></div>
                  <div className="text-xs text-gray-500 mb-1">Tasks Completed: <span className="text-black">{selected.tasks}</span></div>
                  <div className="text-xs text-gray-500 mb-1">Manager Rating: <span className="text-black">{selected.rating}/5</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}; 