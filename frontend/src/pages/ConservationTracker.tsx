import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  CheckSquare, Droplet, Plus, ArrowUpRight, CheckCircle2, 
  MapPin, IndianRupee, Layers, Calendar, Sparkles 
} from 'lucide-react';

export const ConservationTracker: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New intervention form state
  const [title, setTitle] = useState('');
  const [structureType, setStructureType] = useState('Check Dam');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(250);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getConservationProjects()
      .then(res => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;
    const newProj = {
      id: `CP-NEW-${Math.floor(Math.random() * 900 + 100)}`,
      title,
      structure_type: structureType,
      location,
      district: 'Haridwar',
      state: 'Uttarakhand',
      completion_date: '2026-11-01',
      status: 'Proposed',
      capacity_megalitres: Number(capacity),
      cumulative_recharged_megalitres: 0.0,
      surrounding_gw_rise_cm: 15.0,
      cost_inr_lakhs: 45.0
    };
    setData((prev: any) => ({
      ...prev,
      total_projects: prev.total_projects + 1,
      total_capacity_megalitres: prev.total_capacity_megalitres + Number(capacity),
      projects: [newProj, ...prev.projects]
    }));
    setShowAddModal(false);
    setTitle('');
    setLocation('');
  };

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Water Conservation Impact Tracker
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Measurable Outcomes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking rainwater harvesting, injection shafts and village pond rejuvenation interventions
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Intervention</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Total Conservation Projects</div>
          <div className="text-3xl font-black text-slate-900">
            {data.total_projects} <span className="text-xs font-normal text-slate-500">active sites</span>
          </div>
          <p className="text-[10px] text-teal-600 font-semibold mt-1">Check dams, recharge shafts & dykes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Cumulative Water Infiltrated</div>
          <div className="text-3xl font-black text-cyan-600">
            {data.cumulative_recharged_megalitres} <span className="text-xs font-normal text-slate-500">MegaLitres</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Total storage capacity: {data.total_capacity_megalitres} ML</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Average Surrounding GW Table Rise</div>
          <div className="text-3xl font-black text-emerald-600">
            +{data.average_gw_recovery_cm} <span className="text-xs font-normal text-slate-500">cm</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">Directly measured at local monitoring piezometers</p>
        </div>

      </div>

      {/* Interventions Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Verified Watershed Interventions Ledger
          </h2>
          <span className="text-[11px] text-slate-400">CGWB & District Collectorate Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Intervention Name & ID</th>
                <th className="py-3 px-4">Structure Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Cumulative Recharged</th>
                <th className="py-3 px-4">GW Rise (cm)</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.projects.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{p.title}</div>
                    <div className="text-[10px] font-mono text-slate-400">{p.id}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{p.structure_type}</td>
                  <td className="py-3 px-4 text-slate-600">{p.location}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{p.capacity_megalitres} ML</td>
                  <td className="py-3 px-4 font-bold text-cyan-600">{p.cumulative_recharged_megalitres} ML</td>
                  <td className="py-3 px-4 font-black text-emerald-600">+{p.surrounding_gw_rise_cm} cm</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === 'Operational'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.status === 'Under Construction'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register New Intervention Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900">Register New Conservation Project</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bhagwanpur Cascade Check Dam #4"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Structure Type</label>
                <select
                  value={structureType}
                  onChange={(e) => setStructureType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="Check Dam">Check Dam</option>
                  <option value="Recharge Shaft with Silt Chamber">Recharge Shaft with Silt Chamber</option>
                  <option value="Percolation Pond Rejuvenation">Percolation Pond Rejuvenation</option>
                  <option value="Sub-surface Dyke">Sub-surface Dyke</option>
                  <option value="Direct Well Injection">Direct Well Injection</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location / Village</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bhagwanpur Block, Haridwar"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Storage Capacity (MegaLitres)</label>
                <input
                  type="number"
                  min="10"
                  max="5000"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 border rounded-xl font-medium text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl"
                >
                  Add Intervention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
