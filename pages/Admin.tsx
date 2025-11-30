import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { Card, StatCard, Badge, Button } from '../components/ui';
import { Users, Building, Briefcase, Eye, ShieldAlert } from 'lucide-react';
import { Role } from '../types';

export const AdminDashboard: React.FC = () => {
    const { state } = useApp();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Consumers" value={state.users.filter(u => u.role === Role.CONSUMER).length.toString()} icon={Users} />
                <StatCard title="Employers" value={state.employers.length.toString()} icon={Building} color="text-blue-600" />
                <StatCard title="Businesses" value={state.businesses.length.toString()} icon={Briefcase} color="text-amber-600" />
                <StatCard title="Commitments" value={state.commitments.length.toString()} icon={ShieldAlert} color="text-emerald-600" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="font-bold text-lg mb-4">Recent Employers</h3>
                    <div className="space-y-3">
                        {state.employers.slice(0, 5).map(e => (
                             <div key={e.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                <div>
                                    <div className="font-medium text-slate-900">{e.name}</div>
                                    <div className="text-xs text-slate-500">{e.employeeCount} employees</div>
                                </div>
                             </div>
                        ))}
                    </div>
                </Card>
                <Card className="p-6">
                    <h3 className="font-bold text-lg mb-4">Recent Businesses</h3>
                    <div className="space-y-3">
                        {state.businesses.slice(0, 5).map(b => (
                             <div key={b.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                <div>
                                    <div className="font-medium text-slate-900">{b.name}</div>
                                    <div className="text-xs text-slate-500">{b.category}</div>
                                </div>
                                <Badge color={b.status === 'Active' ? 'green' : 'red'}>{b.status}</Badge>
                             </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export const AdminEmployers: React.FC = () => {
    const { state } = useApp();
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Manage Employers</h1>
            <Card>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Employees</th>
                            <th className="px-6 py-3">Max Deduction</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.employers.map(e => (
                            <tr key={e.id} className="border-b border-slate-50">
                                <td className="px-6 py-4 font-medium">{e.name}</td>
                                <td className="px-6 py-4">{e.employeeCount}</td>
                                <td className="px-6 py-4">{e.maxDeductionPercent}%</td>
                                <td className="px-6 py-4">
                                    <Button variant="outline" className="text-xs">Edit</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}

export const AdminBusinesses: React.FC = () => {
    const { state, toggleBusinessStatus } = useApp();
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Manage Businesses</h1>
            <Card>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Revenue</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.businesses.map(b => (
                            <tr key={b.id} className="border-b border-slate-50">
                                <td className="px-6 py-4 font-medium">{b.name}</td>
                                <td className="px-6 py-4">{b.category}</td>
                                <td className="px-6 py-4">${b.revenue.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <Badge color={b.status === 'Active' ? 'green' : 'red'}>{b.status}</Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <Button 
                                        variant="outline" 
                                        className="text-xs"
                                        onClick={() => toggleBusinessStatus(b.id)}
                                    >
                                        {b.status === 'Active' ? 'Suspend' : 'Activate'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}

export const AdminConsumers: React.FC = () => {
    const { state, startImpersonation } = useApp();
    const navigate = useNavigate();
    const consumers = state.users.filter(u => u.role === Role.CONSUMER);

    const handleImpersonate = (userId: string) => {
        const user = state.users.find(u => u.id === userId);
        if (user) {
            startImpersonation(user);
            navigate('/consumer');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Manage Consumers</h1>
            <Card>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Employer</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consumers.map(u => {
                            const emp = state.employers.find(e => e.id === u.employerId);
                            return (
                                <tr key={u.id} className="border-b border-slate-50">
                                    <td className="px-6 py-4 font-medium">{u.name}</td>
                                    <td className="px-6 py-4">{u.email}</td>
                                    <td className="px-6 py-4">{emp?.name || '-'}</td>
                                    <td className="px-6 py-4">
                                        <Button 
                                            variant="secondary" 
                                            className="text-xs flex items-center gap-1"
                                            onClick={() => handleImpersonate(u.id)}
                                        >
                                            <Eye size={12} /> View As
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
