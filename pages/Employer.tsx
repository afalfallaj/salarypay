import React, { useState } from 'react';
import { useApp } from '../context';
import { Card, StatCard, Badge, Button, Modal } from '../components/ui';
import { Users, DollarSign, PieChart, Upload, Power, FileText } from 'lucide-react';

export const EmployerDashboard: React.FC = () => {
    const { currentUser, state } = useApp();
    const myEmployer = state.employers.find(e => e.id === currentUser?.employerId);
    const myEmployees = state.employees.filter(e => e.employerId === myEmployer?.id);
    const activeEmployees = myEmployees.filter(e => e.status === 'Enabled');

    // Stats
    const totalDeductions = state.commitments
        .filter(c => myEmployees.some(e => e.id === c.consumerId) && c.status === 'Active')
        .reduce((sum, c) => sum + c.amount, 0);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Employer Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Employees" value={myEmployees.length.toString()} icon={Users} color="bg-blue-100 text-blue-600" />
                <StatCard title="Active Users" value={activeEmployees.length.toString()} icon={Power} color="bg-emerald-100 text-emerald-600" />
                <StatCard title="Monthly Deductions" value={`$${totalDeductions.toLocaleString()}`} icon={DollarSign} color="bg-indigo-100 text-indigo-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                    <div className="flex gap-4 flex-wrap">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Upload size={16} /> Bulk Upload CSV
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <FileText size={16} /> Download Payroll Report
                        </Button>
                    </div>
                </Card>
                <Card className="p-6">
                    <h3 className="font-bold text-lg mb-4">Policy Settings</h3>
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                        <div>
                            <div className="font-medium text-slate-900">Max Deduction Limit</div>
                            <div className="text-sm text-slate-500">Percentage of net salary</div>
                        </div>
                        <div className="text-2xl font-bold text-indigo-600">{myEmployer?.maxDeductionPercent}%</div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export const EmployerEmployees: React.FC = () => {
    const { currentUser, state, updateEmployeeStatus, addEmployee } = useApp();
    const myEmployer = state.employers.find(e => e.id === currentUser?.employerId);
    const myEmployees = state.employees.filter(e => e.employerId === myEmployer?.id);
    
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [csvFile, setCsvFile] = useState<File | null>(null);

    const handleUpload = () => {
        if (!csvFile || !myEmployer) return;
        // Mock processing
        setTimeout(() => {
            // Add a mock employee
            addEmployee({
                id: `new-${Date.now()}`,
                employerId: myEmployer.id,
                name: 'New Employee (CSV)',
                email: `user${Date.now()}@example.com`,
                salary: 5500,
                status: 'Enabled',
                joinedDate: new Date().toISOString()
            });
            setIsUploadOpen(false);
            setCsvFile(null);
            alert("Processing complete. 1 record added (Mock).");
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
                <Button onClick={() => setIsUploadOpen(true)} className="flex items-center gap-2">
                    <Upload size={16} /> Upload CSV
                </Button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Salary</th>
                                <th className="px-6 py-3">Joined</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myEmployees.map(e => (
                                <tr key={e.id} className="bg-white border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{e.name}</td>
                                    <td className="px-6 py-4 text-slate-500">{e.email}</td>
                                    <td className="px-6 py-4 text-slate-500">${e.salary.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(e.joinedDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <Badge color={e.status === 'Enabled' ? 'green' : 'slate'}>{e.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => updateEmployeeStatus(e.id, e.status === 'Enabled' ? 'Disabled' : 'Enabled')}
                                            className={`text-xs font-medium ${e.status === 'Enabled' ? 'text-red-600 hover:text-red-800' : 'text-emerald-600 hover:text-emerald-800'}`}
                                        >
                                            {e.status === 'Enabled' ? 'Disable' : 'Enable'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Employees">
                <div className="space-y-4">
                    <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center bg-slate-50">
                        <input type="file" onChange={(e) => setCsvFile(e.target.files?.[0] || null)} className="hidden" id="csv-upload" />
                        <label htmlFor="csv-upload" className="cursor-pointer">
                            <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                            <span className="text-sm text-slate-600">Click to upload CSV</span>
                            {csvFile && <div className="text-sm font-bold text-indigo-600 mt-2">{csvFile.name}</div>}
                        </label>
                    </div>
                    <div className="text-xs text-slate-400">
                        Required columns: Name, Email, Salary, ID.
                    </div>
                    <div className="flex justify-end pt-2">
                         <Button onClick={handleUpload} disabled={!csvFile}>Process Upload</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export const EmployerRules: React.FC = () => {
    const { currentUser, state, updateEmployerRule } = useApp();
    const myEmployer = state.employers.find(e => e.id === currentUser?.employerId);
    const [percent, setPercent] = useState(myEmployer?.maxDeductionPercent || 0);

    const handleSave = () => {
        if(myEmployer) {
            updateEmployerRule(myEmployer.id, percent);
            alert("Rule updated!");
        }
    }

    if (!myEmployer) return <div>Loading...</div>;

    return (
        <div className="max-w-xl space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Deduction Rules</h1>
            <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">Salary Percentage Cap</h3>
                <p className="text-sm text-slate-500 mb-6">
                    Set the maximum percentage of an employee's net salary that can be allocated to monthly commitments.
                </p>
                <div className="flex items-center gap-4">
                    <input 
                        type="range" 
                        min="5" 
                        max="50" 
                        value={percent} 
                        onChange={(e) => setPercent(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="w-16 font-bold text-xl text-indigo-600">{percent}%</div>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleSave}>Save Configuration</Button>
                </div>
            </Card>
        </div>
    );
}
