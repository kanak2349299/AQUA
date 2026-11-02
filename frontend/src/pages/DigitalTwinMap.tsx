import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Filter, Layers, Database, Activity, ShieldCheck, 
  MapPin, Sliders, CheckCircle2, AlertTriangle, ArrowRight, 
  Eye, Droplet, Sparkles 
} from 'lucide-react';

// Custom icons for Leaflet markers
const createStationIcon = (status: string, grade: string) => {
  let color = '#0284c7';
  if (status === 'Over-Exploited') color = '#ef4444';
  else if (status === 'Critical') color = '#f97316';
  else if (status === 'Semi-Critical') color = '#eab308';
  else if (status === 'Normal') color = '#10b981';

  return L.divIcon({
    className: 'custom-station-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 0 10px ${color};
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

export const DigitalTwinMap: React.FC<{ onInspectWell: (wellId: string) => void }> = ({ onInspectWell }) => {
  const { selectedRegionId, setSelectedRegionId } = useAuth();
  const [wells, setWells] = useState<any[]>([]);
  const [rechargeZones, setRechargeZones] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [surveyType, setSurveyType] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [showRechargeOverlay, setShowRechargeOverlay] = useState<boolean>(true);
  const [showHeatmapCircles, setShowHeatmapCircles] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [basemapStyle, setBasemapStyle] = useState<'geoapify' | 'satellite' | 'osm'>('geoapify');

  // Geoapify API key provided by user for colorful tiles
  const GEOAPIFY_KEY = 'd8417f496fca43a3a66c5f4375fa0a79';

  // Map center coordinates depending on selected region
  const regionCoordinates: Record<string, [number, number]> = {
    ludhiana: [30.9010, 75.8573],
    haridwar: [29.9457, 78.1642],
    dehradun: [30.3165, 78.0322],
    latur: [18.4088, 76.5604],
    jaipur: [26.9124, 75.7873],
    anantapur: [14.6819, 77.6006],
    thanjavur: [10.7870, 79.1378],
    bundelkhand: [25.4484, 78.5685]
  };

  const currentCenter = regionCoordinates[selectedRegionId] || regionCoordinates.haridwar;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([
      api.getWells(),
      api.getRechargeZones(selectedRegionId === 'ludhiana' ? 'ludhiana' : 'haridwar')
    ]).then(([w, rz]) => {
      if (isMounted) {
        setWells(w);
        setRechargeZones(rz);
        setLoading(false);
      }
    }).catch(err => {
      console.error(err);
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [selectedRegionId]);

  // Filter wells
  const filteredWells = wells.filter(w => {
    if (selectedDistrict !== 'all' && !w.district.toLowerCase().includes(selectedDistrict.toLowerCase())) return false;
    if (surveyType !== 'all' && !w.survey_type.toLowerCase().includes(surveyType.toLowerCase())) return false;
    if (gradeFilter !== 'all' && !w.completeness_grade.toLowerCase().includes(gradeFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Top Banner (GGWPI / CDCPC Style matching Reference Image 5) */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Droplet className="w-4 h-4 fill-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                CDCPC • National Geophysical & Groundwater Twin
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                PostGIS / Leaflet Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Centralized Geospatial Telemetry & Aquifer Resistivity Logging across Indian Basins
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {/* Basemap Switcher Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setBasemapStyle('geoapify')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                basemapStyle === 'geoapify'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🌈 Geoapify Colorful
            </button>
            <button
              onClick={() => setBasemapStyle('satellite')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                basemapStyle === 'satellite'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛰️ True Color (Rivers Blue, Land Brown, Trees Green)
            </button>
            <button
              onClick={() => setBasemapStyle('osm')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                basemapStyle === 'osm'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🗺️ OpenStreetMap
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-400">Recharge Layer:</label>
            <input
              type="checkbox"
              checked={showRechargeOverlay}
              onChange={(e) => setShowRechargeOverlay(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-slate-400">Cone Heatmaps:</label>
            <input
              type="checkbox"
              checked={showHeatmapCircles}
              onChange={(e) => setShowHeatmapCircles(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main 3-Column GIS Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: FILTERS (Matching Reference Image 5) */}
        <div className="w-72 bg-slate-900 border-r border-slate-800 p-4 space-y-5 overflow-y-auto shrink-0">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>GIS Filters</span>
            </div>
            <button
              onClick={() => { setSelectedDistrict('all'); setSurveyType('all'); setGradeFilter('all'); }}
              className="text-[11px] text-cyan-400 hover:underline"
            >
              Reset
            </button>
          </div>

          {/* District Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">District / Basin</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Indian Districts (Pan-India)</option>
              <option value="haridwar">Haridwar (Uttarakhand)</option>
              <option value="dehradun">Dehradun (Uttarakhand)</option>
              <option value="ludhiana">Ludhiana (Punjab)</option>
              <option value="latur">Latur (Maharashtra)</option>
              <option value="jaipur">Jaipur (Rajasthan)</option>
              <option value="anantapur">Anantapur (Andhra Pradesh)</option>
              <option value="thanjavur">Thanjavur (Tamil Nadu)</option>
            </select>
          </div>

          {/* Survey Type Checkboxes (Image 5) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Survey Type</label>
            <div className="space-y-1.5 text-xs text-slate-300">
              {[
                { id: 'all', label: 'All Survey Methods' },
                { id: 'Digital Water Level Recorder', label: 'Telemetry (DWLR)' },
                { id: 'Electrical Resistivity', label: 'Electrical Resistivity (ERS)' },
                { id: 'Geophysical Borewell', label: 'Borewell Logging (GBL)' }
              ].map((st) => (
                <label key={st.id} className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="survey_radio"
                    checked={surveyType === st.id}
                    onChange={() => setSurveyType(st.id)}
                    className="text-cyan-500 bg-slate-950 border-slate-700"
                  />
                  <span>{st.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Completeness Grade Badges (Image 5) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Completeness Grade</label>
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'all', label: 'All Grades', color: 'bg-slate-700' },
                { id: 'Grade A', label: 'Grade A (High ≥ 90%)', color: 'bg-emerald-500' },
                { id: 'Grade B', label: 'Grade B (Good 70% - 89%)', color: 'bg-cyan-500' },
                { id: 'Grade C', label: 'Grade C (Moderate 40% - 69%)', color: 'bg-amber-500' },
                { id: 'Grade D', label: 'Grade D (Low < 40%)', color: 'bg-rose-500' }
              ].map((g) => (
                <div
                  key={g.id}
                  onClick={() => setGradeFilter(g.id)}
                  className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    gradeFilter === g.id
                      ? 'bg-slate-800 border-cyan-500'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${g.color}`} />
                    <span className="text-slate-300 font-medium">{g.label}</span>
                  </div>
                  {gradeFilter === g.id && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics Callout (Image 5) */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              1000+ Data Locations
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Validated against CGWB Ground Water Year Book 2026 and IMD high-resolution gridded rainfall models.
            </p>
          </div>
        </div>

        {/* CENTER: INTERACTIVE LEAFLET GIS MAP */}
        <div className="flex-1 relative bg-slate-950">
          <MapContainer
            center={currentCenter}
            zoom={selectedRegionId === 'ludhiana' ? 10 : 10}
            className="w-full h-full"
            style={{ background: '#090d16' }}
          >
            {/* Dynamic Tile Layer based on user selection - CartoDB watermark completely removed! */}
            {basemapStyle === 'geoapify' && (
              <TileLayer
                attribution='&copy; <a href="https://www.geoapify.com/">Geoapify</a> contributors &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_KEY}`}
                maxZoom={20}
              />
            )}
            {basemapStyle === 'satellite' && (
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Rivers in Blue, Land in Brown, Trees in Green'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
            )}
            {basemapStyle === 'osm' && (
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
            )}

            {/* Observation Telemetry Wells */}
            {filteredWells.map((well) => (
              <Marker
                key={well.id}
                position={[well.lat, well.lng]}
                icon={createStationIcon(well.status, well.completeness_grade)}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 min-w-[220px] text-slate-900">
                    <div className="flex items-center justify-between border-b pb-1 mb-2">
                      <span className="font-bold text-xs text-slate-900">{well.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded text-white ${
                        well.completeness_grade === 'Grade A' ? 'bg-emerald-600' : 'bg-cyan-600'
                      }`}>
                        {well.completeness_grade}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-700 mb-3">
                      <div><strong>Village:</strong> {well.village} ({well.district})</div>
                      <div><strong>Water Depth:</strong> <span className="font-bold text-rose-600">{well.depth_bgl_m} m bgl</span></div>
                      <div><strong>Annual Trend:</strong> {well.trend_rate_m_per_year} m/year</div>
                      <div><strong>Survey Type:</strong> {well.survey_type}</div>
                      <div><strong>Aquifer:</strong> {well.aquifer_type}</div>
                    </div>

                    <button
                      onClick={() => onInspectWell(well.id)}
                      className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1"
                    >
                      <span>Inspect ML Prediction</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Over-Exploited Drawdown Cones (Red Danger Zones) */}
            {showHeatmapCircles && filteredWells
              .filter(w => w.status === 'Over-Exploited')
              .map(w => (
                <Circle
                  key={`circle-${w.id}`}
                  center={[w.lat, w.lng]}
                  radius={3500}
                  pathOptions={{
                    color: '#ef4444',
                    fillColor: '#ef4444',
                    fillOpacity: 0.28,
                    weight: 2,
                    dashArray: '5, 5'
                  }}
                >
                  <Popup>
                    <div className="text-slate-900 text-xs p-1">
                      <div className="font-bold text-rose-600 flex items-center gap-1 mb-1">
                        ⚠️ RED DANGER ZONE: Severe Depletion
                      </div>
                      <div><strong>Location:</strong> {w.village}, {w.district}</div>
                      <div><strong>Critical Depth:</strong> {w.depth_bgl_m} m bgl</div>
                      <div><strong>Status:</strong> Over-Exploited Aquifer Cone</div>
                      <div className="text-rose-700 text-[10px] mt-1 font-semibold">
                        Immediate artificial recharge and restricted extraction advised!
                      </div>
                    </div>
                  </Popup>
                </Circle>
              ))
            }

            {/* Frontiers AHP Priority Recharge Zones (Green Safe Zones) */}
            {showRechargeOverlay && rechargeZones.map((rz) => {
              const isHigh = rz.score >= 70;
              const zoneColor = isHigh ? '#10b981' : (rz.score >= 50 ? '#f59e0b' : '#ef4444');
              return (
                <Circle
                  key={rz.id}
                  center={[rz.lat, rz.lng]}
                  radius={2800}
                  pathOptions={{
                    color: zoneColor,
                    fillColor: zoneColor,
                    fillOpacity: 0.45,
                    weight: 2.5
                  }}
                >
                  <Popup>
                    <div className="text-slate-900 text-xs p-1">
                      <div className="font-bold mb-1" style={{ color: zoneColor }}>
                        {isHigh ? '🛡️ GREEN SAFE ZONE: High Recharge' : `⚡ ${rz.zone_name}`}
                      </div>
                      <div><strong>Suitability:</strong> {rz.suitability_category} ({rz.score}/100)</div>
                      <div><strong>Lithology:</strong> {rz.lithology}</div>
                      <div><strong>Recommended Structure:</strong> {rz.recommended_structure}</div>
                      <div><strong>Recharge Potential:</strong> {rz.estimated_annual_recharge_potential_mcm} MCM/year</div>
                    </div>
                  </Popup>
                </Circle>
              );
            })}
          </MapContainer>

          {/* Floating Map Legend (Matching Reference Image 2 & 5) */}
          <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/95 border border-slate-800 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md text-[11px] text-slate-300 space-y-2 max-w-[240px]">
            <div className="font-bold text-white text-xs border-b border-slate-800 pb-1.5 flex items-center justify-between">
              <span>GIS Thematic Legend</span>
              <span className="text-[9px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800">Live</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#ef4444] border border-white shrink-0 animate-pulse" />
              <span className="font-semibold text-rose-300">Red: Danger Zone (Over-Exploited)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#10b981] border border-white shrink-0" />
              <span className="font-semibold text-emerald-300">Green: Safe Zone (AHP &gt; 70)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#f59e0b] border border-white shrink-0" />
              <span>Yellow: Moderate Potential</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#0284c7] border border-white shrink-0" />
              <span>Blue: Rivers & Telemetry Stations</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-[10px] text-slate-400">
              <span>🛰️ Satellite: Land in Brown, Trees in Green</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LOCATION SUMMARY & INTERPRETATIONS (Matching Reference Image 5) */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 p-4 space-y-5 overflow-y-auto shrink-0">
          
          {/* Dataset Overview Cards (Image 5) */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Dataset Overview
            </h2>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-2xl font-black text-cyan-400 tracking-tight">
                1000+
              </div>
              <div className="text-xs text-slate-400 font-medium">Data Locations Across India</div>
              
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80">
                <div>
                  <div className="text-sm font-bold text-white">620+</div>
                  <div className="text-[10px] text-slate-400">ERS Locations</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">480+</div>
                  <div className="text-[10px] text-slate-400">GBL Locations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Summary Bars per District (Image 5) */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Location Summary
            </h2>
            <div className="space-y-2.5 text-xs">
              {[
                { name: 'Ludhiana, PB', count: 185, pct: '92%' },
                { name: 'Haridwar, UK', count: 120, pct: '75%' },
                { name: 'Dehradun, UK', count: 110, pct: '70%' },
                { name: 'Latur, MH', count: 105, pct: '68%' },
                { name: 'Jaipur, RJ', count: 95, pct: '62%' }
              ].map((loc) => (
                <div key={loc.name} className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>{loc.name}</span>
                    <span className="font-bold text-white">{loc.count}+</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full" style={{ width: loc.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interpretations Box (Image 5) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              750+ Interpretations
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Includes 2D/3D calibrated models, specific yield calculations, and AHP recharge suitability reports.
            </p>
          </div>

        </div>

      </div>

      {/* BOTTOM FEATURE STRIP (Exact Replica of Reference Image 5) */}
      <div className="bg-slate-900 border-t border-slate-800 px-6 py-3 shrink-0 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">Trusted Data</div>
            <div className="text-[10px] text-slate-400">Quality checked from 1980 onwards</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">Multi-Source Integration</div>
            <div className="text-[10px] text-slate-400">ERS, Borewell Logging & Hydrogeology</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">Precise & Actionable</div>
            <div className="text-[10px] text-slate-400">High-resolution for water decisions</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">Secure & Accessible</div>
            <div className="text-[10px] text-slate-400">PostGIS spatial database & API</div>
          </div>
        </div>
      </div>

    </div>
  );
};
