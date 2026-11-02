import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://prsjwsfwlhrqlxsvucch.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "public-anon-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const API_BASE = '/api';

export const api = {
  async getOverview(regionId: string = 'ludhiana') {
    const res = await fetch(`${API_BASE}/stats/overview?region_id=${regionId}`);
    if (!res.ok) throw new Error('Failed to fetch overview');
    return res.json();
  },

  async getRegions() {
    const res = await fetch(`${API_BASE}/regions`);
    if (!res.ok) throw new Error('Failed to fetch regions');
    return res.json();
  },

  async getWells(params?: { district?: string; survey_type?: string; grade?: string; status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/wells?${query}`);
    if (!res.ok) throw new Error('Failed to fetch wells');
    return res.json();
  },

  async getLiveMeteo(lat: number, lng: number, regionId: string) {
    const res = await fetch(`${API_BASE}/meteo/live?lat=${lat}&lng=${lng}&region_id=${regionId}`);
    if (!res.ok) throw new Error('Failed to fetch live meteorology');
    return res.json();
  },

  async getPrediction(stationId: string, horizonDays: number = 30, regionId: string = 'ludhiana') {
    const res = await fetch(`${API_BASE}/predictions/${stationId}?horizon_days=${horizonDays}&region_id=${regionId}`);
    if (!res.ok) throw new Error('Failed to fetch ML prediction');
    return res.json();
  },

  async getDroughtAssessment(regionId: string = 'ludhiana') {
    const res = await fetch(`${API_BASE}/drought/assessment?region_id=${regionId}`);
    if (!res.ok) throw new Error('Failed to fetch drought assessment');
    return res.json();
  },

  async getRechargeZones(district: string = 'haridwar') {
    const res = await fetch(`${API_BASE}/recharge/zones?district=${district}`);
    if (!res.ok) throw new Error('Failed to fetch recharge zones');
    return res.json();
  },

  async calculateCropPlan(payload: { region_id: string; crop_name: string; growth_stage: string; farm_area_acres: number }) {
    const res = await fetch(`${API_BASE}/crop/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to calculate crop plan');
    return res.json();
  },

  async runSimulation(payload: {
    region_id: string;
    rainfall_change_pct: number;
    pumping_change_pct: number;
    temp_increase_c: number;
    recharge_interventions_count: number;
    drip_irrigation_adoption_pct: number;
  }) {
    const res = await fetch(`${API_BASE}/simulation/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to run simulation');
    return res.json();
  },

  async getDSSRecommendations(regionId: string = 'ludhiana', role: string = 'all') {
    const res = await fetch(`${API_BASE}/dss/recommendations?region_id=${regionId}&role=${role}`);
    if (!res.ok) throw new Error('Failed to fetch DSS recommendations');
    return res.json();
  },

  async getConservationProjects() {
    const res = await fetch(`${API_BASE}/conservation/tracker`);
    if (!res.ok) throw new Error('Failed to fetch conservation projects');
    return res.json();
  },

  async getAnomalies() {
    const res = await fetch(`${API_BASE}/anomalies`);
    if (!res.ok) throw new Error('Failed to fetch aquifer anomalies');
    return res.json();
  },

  async askCopilot(prompt: string, regionId: string, role: string) {
    const res = await fetch(`${API_BASE}/copilot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, region_id: regionId, user_role: role })
    });
    if (!res.ok) throw new Error('Failed to query AQUA copilot');
    return res.json();
  }
};
