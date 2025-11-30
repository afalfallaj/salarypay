import React, { useState } from 'react';
import { useApp } from '../context';
import { Card, StatCard, Badge, Button, Modal } from '../components/ui';
import { CreditCard, Wallet, Calendar, AlertCircle, ShoppingBag, XCircle, Pencil, Building } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Commitment } from '../types';

export const ConsumerDashboard: React.FC = () => {
  const { currentUser, state } = useApp();
  
  // Derived data
  const employeeRecord = state.employees.find(e => e.email === currentUser?.email);
  const salary = employeeRecord?.salary || 0;
  const employer = state.employers.find(e => e.id === currentUser?.employerId);
  const maxDeduction = employer ? (salary * employer.maxDeductionPercent) / 100 : 0;
  
  const myCommitments = state.commitments.filter(c => c.consumerId === currentUser?.id && c.status === 'Active');
  const usedAmount = myCommitments.reduce((sum, c) => sum + c.amount, 0);
  const safeToSpend = Math.max(0, maxDeduction - usedAmount);

  const upcomingDeductions = myCommitments.map(c => ({
    ...c,
    date: c.nextDeductionDate
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3);

  const chartData = [
    { name: 'Used', value: usedAmount, color: '#4f46e5' },
    { name: 'Available', value: safeToSpend, color: '#cbd5e1' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Hello, {currentUser?.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-500">Here's your salary overview.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Net Salary" value={`$${salary.toLocaleString()}`} icon={Wallet} color="bg-emerald-100 text-emerald-600" />
        <StatCard title="Safe to Spend" value={`$${safeToSpend.toLocaleString()}`} icon={CreditCard} color="bg-indigo-100 text-indigo-600" />
        <StatCard title="Active Commitments" value={myCommitments.length.toString()} icon={ShoppingBag} color="bg-amber-100 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Commitments List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Active Commitments</h2>
          {myCommitments.length === 0 ? (
             <Card className="p-8 text-center text-slate-500">
                You don't have any commitments yet.
             </Card>
          ) : (
            myCommitments.map(comm => (
                <Card key={comm.id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <ShoppingBag size={20} />
                    </div>
                    <div>
                    <h3 className="font-semibold text-slate-900">{comm.businessName}</h3>
                    <p className="text-sm text-slate-500">Next: {new Date(comm.nextDeductionDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-bold text-slate-900">${comm.amount}</div>
                    <div className="text-xs text-slate-400">/ month</div>
                </div>
                </Card>
            ))
          )}
        </div>

        {/* Utilization Chart */}
        <div className="space-y-4">
           <h2 className="text-lg font-bold text-slate-800">Limit Utilization</h2>
           <Card className="p-6 h-[300px] flex flex-col items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis hide />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
               </BarChart>
             </ResponsiveContainer>
             <p className="text-xs text-slate-400 mt-2 text-center">Max deduction allowed: ${maxDeduction.toLocaleString()}</p>
           </Card>
        </div>
      </div>
      
      {/* Upcoming */}
      <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Upcoming Deductions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingDeductions.map(c => (
                <Card key={c.id} className="p-4 border-l-4 border-l-indigo-500">
                    <div className="text-xs text-slate-400 mb-1">{new Date(c.nextDeductionDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</div>
                    <div className="font-bold text-slate-900">{c.businessName}</div>
                    <div className="text-sm text-slate-600">${c.amount}</div>
                </Card>
            ))}
             {upcomingDeductions.length === 0 && (
                <div className="text-slate-500 text-sm">No upcoming deductions scheduled.</div>
             )}
          </div>
      </div>
    </div>
  );
};

export const ConsumerCommitments: React.FC = () => {
    const { currentUser, state, cancelCommitment, updateCommitmentAmount, impersonatedUser } = useApp();
    const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editAmount, setEditAmount] = useState(0);

    const activeUser = impersonatedUser || currentUser;

    // Permissions
    const isReadOnly = !!impersonatedUser;

    const myCommitments = state.commitments.filter(c => c.consumerId === activeUser?.id);

    const handleEdit = (c: Commitment) => {
        setSelectedCommitment(c);
        setEditAmount(c.amount);
        setIsEditMode(true);
    };

    const handleSaveEdit = () => {
        if(selectedCommitment) {
            updateCommitmentAmount(selectedCommitment.id, editAmount);
            setIsEditMode(false);
            setSelectedCommitment(null);
        }
    }

    const handleCancel = (id: string) => {
        if (window.confirm("Are you sure you want to cancel this commitment? Future payments will stop.")) {
            cancelCommitment(id);
            if (selectedCommitment?.id === id) setSelectedCommitment(null);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">My Commitments</h1>
            <div className="grid gap-4">
                {myCommitments.map(c => (
                    <Card key={c.id} className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{c.businessName}</h3>
                                <p className="text-sm text-slate-500">Started: {new Date(c.startDate).toLocaleDateString()}</p>
                                <div className="mt-2">
                                    <Badge color={c.status === 'Active' ? 'green' : 'slate'}>{c.status}</Badge>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-indigo-600">${c.amount}</div>
                                <div className="text-xs text-slate-400">per month</div>
                            </div>
                        </div>

                        {/* History Accordion or List */}
                        <div className="mt-6 pt-4 border-t border-slate-100">
                             <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">Payment History</h4>
                             <div className="space-y-2">
                                {c.history.map(h => (
                                    <div key={h.id} className="flex justify-between text-sm">
                                        <span className="text-slate-600">{new Date(h.date).toLocaleDateString()}</span>
                                        <span className="font-medium text-slate-900">${h.amount} <span className="text-emerald-500 text-xs ml-1">({h.status})</span></span>
                                    </div>
                                ))}
                             </div>
                        </div>

                        {c.status === 'Active' && !isReadOnly && (
                            <div className="mt-6 flex gap-3">
                                <Button variant="outline" className="text-xs" onClick={() => handleEdit(c)}>
                                    <Pencil size={14} className="inline mr-1" /> Edit Amount
                                </Button>
                                <Button variant="danger" className="text-xs bg-white text-red-500 border border-red-200 hover:bg-red-50" onClick={() => handleCancel(c.id)}>
                                    <XCircle size={14} className="inline mr-1" /> Cancel
                                </Button>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {/* Edit Modal */}
            <Modal isOpen={isEditMode} onClose={() => setIsEditMode(false)} title="Edit Commitment">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">Modify the monthly payment amount for <strong>{selectedCommitment?.businessName}</strong>.</p>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">New Amount ($)</label>
                        <input 
                            type="number" 
                            value={editAmount} 
                            onChange={(e) => setEditAmount(Number(e.target.value))}
                            className="w-full border border-slate-300 rounded p-2"
                        />
                    </div>
                    <div className="flex gap-2 justify-end pt-4">
                        <Button variant="secondary" onClick={() => setIsEditMode(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export const ConsumerMerchants: React.FC = () => {
    const { state } = useApp();
    const activeMerchants = state.businesses.filter(b => b.status === 'Active');

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Merchants</h1>
            <p className="text-slate-500">Discover places where you can pay with your salary.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeMerchants.map(m => (
                    <Card key={m.id} className="p-0 overflow-hidden group hover:shadow-lg transition-shadow">
                         <div className="h-32 bg-slate-200 flex items-center justify-center text-slate-400">
                            <Building size={48} />
                         </div>
                         <div className="p-5">
                             <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-slate-900">{m.name}</h3>
                                <Badge color="blue">{m.category}</Badge>
                             </div>
                             <p className="text-sm text-slate-500 mb-4">Pay later with 0% interest directly from your next paycheck.</p>
                             <Button variant="outline" className="w-full text-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200">View Offers</Button>
                         </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}