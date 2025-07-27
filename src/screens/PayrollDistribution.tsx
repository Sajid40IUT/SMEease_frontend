import React from "react";
import { DashboardLayout } from "./Dashboard/DashboardLayout";
import { employees, Employee } from "../lib/employees";

// Tax rates (2024/2025)
const FEDERAL_INCOME_TAX_RATE = 0.12; // Simplified for demo, real is progressive
const IDAHO_STATE_TAX_RATE = 0.053; // 5.3% for income over $14,600 (single)
const SOCIAL_SECURITY_RATE = 0.062; // 6.2%
const SOCIAL_SECURITY_WAGE_BASE = 160200; // 2023 limit
const MEDICARE_RATE = 0.0145; // 1.45%

function calculatePayroll(employee: Employee) {
  // Assume weekly pay period
  const grossPay = employee.payType === 'salary'
    ? Math.round(employee.salary / 52)
    : Math.round(employee.hourlyRate * 40); // Assume 40h/week

  // Social Security (up to wage base)
  const socialSecurity = Math.min(grossPay, SOCIAL_SECURITY_WAGE_BASE / 52) * SOCIAL_SECURITY_RATE;
  // Medicare
  const medicare = grossPay * MEDICARE_RATE;
  // Idaho State Income Tax (simplified: 5.3% of gross if annual > $14,600)
  const idahoTax = (employee.salary > 14600) ? grossPay * IDAHO_STATE_TAX_RATE : 0;
  // Federal Income Tax (simplified flat 12%)
  const federalTax = grossPay * FEDERAL_INCOME_TAX_RATE;
  // Total taxes
  const totalTax = socialSecurity + medicare + idahoTax + federalTax;
  // Net pay
  const netPay = grossPay - totalTax;
  return {
    name: employee.name,
    role: employee.role,
    hours: 40,
    gross: grossPay,
    taxes: Math.round(totalTax),
    net: Math.round(netPay),
    status: employee.status === 'Active' ? 'Present' : (employee.status === 'On Leave' ? 'Pending' : 'Not Finalized'),
  };
}

const payrollRows = employees.map(calculatePayroll);
const totalPayroll = payrollRows.reduce((sum, row) => sum + row.gross, 0);
const totalTax = payrollRows.reduce((sum, row) => sum + row.taxes, 0);
const pendingPayslips = payrollRows.filter(row => row.status !== 'Present').length;

export const PayrollDistribution = () => {
  return (
    <DashboardLayout pageTitle="Employee Payroll">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow border">
          <div className="text-xs text-gray-500 mb-1">Total Payroll (This Period)</div>
          <div className="text-3xl font-bold">${totalPayroll.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">Gross pay before deductions</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow border">
          <div className="text-xs text-gray-500 mb-1">Total Tax Withheld</div>
          <div className="text-3xl font-bold">${totalTax.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">Fed + state income, SS, Medicare, etc.</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow border">
          <div className="text-xs text-gray-500 mb-1">Next Tax Deposit Due</div>
          <div className="text-2xl font-bold">Oct 5, 2025</div>
          <div className="text-xs text-gray-400 mt-1">Auto-linked to IRS semi-weekly/monthly rules</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow border flex flex-col justify-between">
          <div>
            <div className="text-xs text-gray-500 mb-1">Pending Payslips</div>
            <div className="text-3xl font-bold">{pendingPayslips}</div>
          </div>
          <button className="mt-2 text-xs text-blue-600 flex items-center gap-1">See payslips <span>→</span></button>
        </div>
      </div>
      {/* Filter Bar */}
      <div className="flex items-center gap-3 mb-4">
        <select className="border rounded px-3 py-2 text-sm text-gray-700">
          <option>Role</option>
        </select>
        <select className="border rounded px-3 py-2 text-sm text-gray-700">
          <option>Status</option>
        </select>
        <select className="border rounded px-3 py-2 text-sm text-gray-700">
          <option>Last 7 Days</option>
        </select>
        <div className="flex items-center gap-2">
          <input type="date" className="border rounded px-2 py-2 text-sm" />
          <span className="text-gray-400">-</span>
          <input type="date" className="border rounded px-2 py-2 text-sm" />
        </div>
        <button className="ml-auto bg-blue-50 text-blue-700 px-4 py-2 rounded flex items-center gap-2 border border-blue-200">
          Export CSV/PDF <span>⇩</span>
        </button>
      </div>
      {/* Payroll Table */}
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Hours Worked</th>
              <th className="px-6 py-3 text-left">Gross Pay</th>
              <th className="px-6 py-3 text-left">Taxes</th>
              <th className="px-6 py-3 text-left">Net Pay</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {payrollRows.map((row, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{row.name}</td>
                <td className="px-6 py-3">{row.role}</td>
                <td className="px-6 py-3">{row.hours} hrs</td>
                <td className="px-6 py-3">${row.gross}</td>
                <td className="px-6 py-3">${row.taxes}</td>
                <td className="px-6 py-3">${row.net}</td>
                <td className="px-6 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${row.status === 'Present' ? 'bg-green-100 text-green-700' : row.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{row.status}</span>
                </td>
                <td className="px-6 py-3">
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded mr-2">Edit</button>
                  <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded">View Payslip</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default PayrollDistribution; 