import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, Download, Printer, ShieldCheck, CheckCircle2, 
  MapPin, Calendar, Droplet, Sparkles 
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const ReportGenerator: React.FC = () => {
  const { selectedRegionId, user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [drought, setDrought] = useState<any>(null);
  const [recs, setRecs] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      api.getOverview(selectedRegionId),
      api.getDroughtAssessment(selectedRegionId),
      api.getDSSRecommendations(selectedRegionId)
    ]).then(([s, d, r]) => {
      setStats(s);
      setDrought(d);
      setRecs(r);
    });
  }, [selectedRegionId]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AQUA_AQUA_Report_${selectedRegionId.toUpperCase()}_2026.pdf`);
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      setGenerating(false);
    }
  };

  if (!stats || !drought) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      
      {/* Top Controls */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Watershed Intelligence Dossier Generator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official decision support and groundwater prognosis brief for {stats.region_name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print View</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={generating}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            {generating ? (
              <span>Generating PDF...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Official PDF Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Printable Report Document (A4 Styled) */}
      <div
        ref={reportRef}
        className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md space-y-6 text-slate-900 text-xs font-sans"
      >
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-sm">
              <Droplet className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-slate-900">
                A.Q.U.A. • AQUA WATERSHED DOSSIER
              </div>
              <div className="text-[11px] font-semibold text-slate-600">
                Aquifer Quantification & Understanding through AI • Decision Support System
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-slate-500 space-y-0.5">
            <div><strong>Report Ref:</strong> HT-REP-{selectedRegionId.toUpperCase()}-2026</div>
            <div><strong>Generated:</strong> {new Date().toLocaleDateString('en-GB')}</div>
            <div><strong>Officer:</strong> {user?.name || 'District Water Resource Directorate'}</div>
          </div>
        </div>

        {/* Section 1: Executive Watershed Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase text-slate-900 tracking-wider border-b pb-1">
            1. Executive Watershed Summary & Telemetry Status
          </h2>
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 block">Monitored Watershed</span>
              <strong className="text-slate-900 text-xs">{stats.region_name}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Basin Authority</span>
              <strong className="text-slate-900 text-xs">{stats.basin}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Total Monitored Area</span>
              <strong className="text-slate-900 text-xs">{stats.monitored_area_sq_km.toLocaleString()} km²</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Mean Water Table Depth</span>
              <strong className="text-rose-600 text-xs">{stats.current_gw_depth_m} m bgl</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Annual Drawdown Rate</span>
              <strong className="text-rose-600 text-xs">{stats.depletion_rate_m_year} m/year</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Extraction Stage</span>
              <strong className="text-slate-900 text-xs">{stats.water_stress_index}</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Real Meteorological Observations */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase text-slate-900 tracking-wider border-b pb-1">
            2. Real-Time Meteorological & Soil Telemetry (Open-Meteo & IMD)
          </h2>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Ambient Temp</span>
              <span className="font-bold text-sm text-slate-900">{stats.temperature_c}°C</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">7-Day Rainfall</span>
              <span className="font-bold text-sm text-slate-900">{stats.rainfall_received_mm} mm</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Soil Moisture (0-7cm)</span>
              <span className="font-bold text-sm text-amber-600">{stats.soil_moisture_pct}%</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">FAO-56 ET0</span>
              <span className="font-bold text-sm text-slate-900">{stats.evapotranspiration_et0} mm/d</span>
            </div>
          </div>
        </div>

        {/* Section 3: Drought Risk Assessment */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase text-slate-900 tracking-wider border-b pb-1">
            3. Localized Drought Risk Assessment
          </h2>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-rose-900">
                Risk Classification: {drought.risk_level} (Score: {drought.drought_score}/100)
              </span>
              <span className="text-[10px] font-semibold text-rose-700">
                Rainfall Deficit: -{drought.rainfall_deficit_pct}%
              </span>
            </div>
            <p className="text-[11px] text-rose-800 leading-snug">
              <strong>High-Risk Clusters Identified:</strong>{' '}
              {drought.high_risk_villages.map((v: any) => `${v.village} (${v.risk_score})`).join(', ')}.
            </p>
          </div>
        </div>

        {/* Section 4: Flagship Decision Support Recommendations */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase text-slate-900 tracking-wider border-b pb-1">
            4. Tailored Decision Support Interventions (DSS Engine)
          </h2>
          <div className="space-y-2">
            {recs.slice(0, 3).map((r: any) => (
              <div key={r.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{r.recommended_action}</span>
                  <span className="text-teal-700">{r.priority_level} Priority</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  <strong>Expected Benefit:</strong> {r.expected_benefit}
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>Budget: {r.estimated_cost_inr}</span>
                  <span>Confidence: {r.confidence_score_pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Footer: Attribution & Signatures */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
          <div>
            <strong>Data Attributions:</strong> CGWB Ground Water Year Book 2026, IMD Rainfall, Open-Meteo European Reanalysis, Sentinel-2 GEE.
          </div>
          <div>
            National Water Intelligence Initiative
          </div>
        </div>

      </div>

    </div>
  );
};
