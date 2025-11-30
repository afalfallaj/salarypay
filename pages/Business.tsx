import React from 'react';
import { useApp } from '../context';
import { Card, StatCard, Badge, Button } from '../components/ui';
import { DollarSign, Users, RefreshCw, Code, CheckCircle } from 'lucide-react';

export const BusinessDashboard: React.FC = () => {
    const { currentUser, state } = useApp();
    const myBusiness = state.businesses.find(b => b.id === currentUser?.businessId);
    
    // Stats
    const myCommitments = state.commitments.filter(c => c.businessId === myBusiness?.id);
    const activeCommitments = myCommitments.filter(c => c.status === 'Active');
    const monthlyRevenue = activeCommitments.reduce((sum, c) => sum + c.amount, 0);
    const totalCustomers = new Set(myCommitments.map(c => c.consumerId)).size;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Business Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Monthly Recurring" value={`$${monthlyRevenue.toLocaleString()}`} icon={DollarSign} color="bg-emerald-100 text-emerald-600" />
                <StatCard title="Active Subscriptions" value={activeCommitments.length.toString()} icon={RefreshCw} color="bg-indigo-100 text-indigo-600" />
                <StatCard title="Unique Customers" value={totalCustomers.toString()} icon={Users} color="bg-amber-100 text-amber-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {myCommitments.slice(0, 5).map(c => (
                            <div key={c.id} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded">
                                <div>
                                    <div className="font-medium text-slate-800">New Subscription</div>
                                    <div className="text-xs text-slate-500">{new Date(c.startDate).toLocaleDateString()}</div>
                                </div>
                                <div className="font-bold text-emerald-600">+${c.amount}</div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="p-6 bg-slate-900 text-white">
                    <h3 className="font-bold text-lg mb-4">Integration Status</h3>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-400"><CheckCircle size={20} /></div>
                        <div>
                            <div className="font-medium">API Active</div>
                            <div className="text-xs text-slate-400">Last heartbeat: 2 mins ago</div>
                        </div>
                    </div>
                    <div className="p-3 bg-white/10 rounded font-mono text-xs overflow-hidden">
                        public_key: pk_live_51Nq...
                    </div>
                </Card>
            </div>
        </div>
    );
};

export const BusinessCustomers: React.FC = () => {
    const { currentUser, state } = useApp();
    const myBusiness = state.businesses.find(b => b.id === currentUser?.businessId);
    const myCommitments = state.commitments.filter(c => c.businessId === myBusiness?.id);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
            <Card className="overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3">Customer ID</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Start Date</th>
                            <th className="px-6 py-3">Next Payment</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myCommitments.map(c => (
                            <tr key={c.id} className="bg-white border-b border-slate-50">
                                <td className="px-6 py-4 font-mono text-xs">{c.consumerId}</td>
                                <td className="px-6 py-4 font-medium">${c.amount}</td>
                                <td className="px-6 py-4">{new Date(c.startDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{new Date(c.nextDeductionDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <Badge color={c.status === 'Active' ? 'green' : 'slate'}>{c.status}</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export const BusinessSettlements: React.FC = () => {
    const { currentUser, state } = useApp();
    const mySettlements = state.settlements.filter(s => s.businessId === currentUser?.businessId);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Settlements</h1>
            <div className="grid gap-4">
                {mySettlements.map(s => (
                    <Card key={s.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                <DollarSign size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">{new Date(s.date).toLocaleDateString()}</div>
                                <div className="text-xs text-slate-500">{s.itemsCount} transactions</div>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="font-bold text-lg text-slate-900">${s.amount.toLocaleString()}</div>
                             <Badge color={s.status === 'Paid' ? 'green' : 'amber'}>{s.status}</Badge>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const BusinessAPI: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Developer API</h1>
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-lg">API Keys</h3>
                        <p className="text-sm text-slate-500">Use these keys to authenticate your requests.</p>
                    </div>
                    <Button disabled>Create New Key</Button>
                </div>
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded border border-slate-200">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-bold text-slate-700">Publishable Key</span>
                            <span className="text-xs text-slate-400">Created Oct 1, 2023</span>
                        </div>
                        <code className="block bg-white p-2 rounded border border-slate-200 text-xs font-mono text-slate-600">pk_live_51Nq8S...xY2z</code>
                    </div>
                    <div className="p-4 bg-slate-50 rounded border border-slate-200">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-bold text-slate-700">Secret Key</span>
                             <span className="text-xs text-slate-400">Created Oct 1, 2023</span>
                        </div>
                        <code className="block bg-white p-2 rounded border border-slate-200 text-xs font-mono text-slate-600">sk_live_... (hidden)</code>
                    </div>
                </div>
            </Card>
        </div>
    )
}
