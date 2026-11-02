export type UserRole = 'farmer' | 'officer' | 'researcher' | 'admin' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  district: string;
  state: string;
}

export interface Region {
  id: string;
  name: string;
  district: string;
  state: string;
  basin: string;
  lat: number;
  lng: number;
  area_sq_km: number;
  total_wells: number;
  overexploited_wells: number;
  baseline_gw_depth_m: number;
  annual_rainfall_normal_mm: number;
  dominant_crops: string[];
  aquifer_system: string;
  soil_type: string;
  stage_of_gw_extraction_pct: number;
}

export interface ObservationWell {
  id: string;
  name: string;
  village: string;
  district: string;
  state: string;
  basin: string;
  lat: number;
  lng: number;
  depth_bgl_m: number;
  historical_avg_m: number;
  trend_rate_m_per_year: number;
  aquifer_type: string;
  completeness_grade: string;
  survey_type: string;
  last_updated: string;
  status: 'Normal' | 'Semi-Critical' | 'Critical' | 'Over-Exploited';
}

export interface LiveMeteo {
  temperature_c: number;
  relative_humidity_pct: number;
  precipitation_mm: number;
  evapotranspiration_et0_mm: number;
  soil_moisture_0_to_7cm: number;
  soil_moisture_7_to_28cm: number;
  weather_condition: string;
  forecast_7d_rainfall_mm: number;
  is_live_api: boolean;
  source_attribution: string;
  timestamp: string;
}

export interface MLPrediction {
  station_id: string;
  station_name: string;
  horizon_days: number;
  current_depth_m: number;
  predicted_depth_m: number;
  trend_description: string;
  confidence_interval_low: number;
  confidence_interval_high: number;
  depletion_probability_pct: number;
  metrics: {
    r2_score: number;
    rmse_m: number;
    mae_m: number;
  };
  shap_feature_importance: Array<{
    feature: string;
    contribution_pct: number;
    direction: string;
    impact_color: string;
  }>;
  time_series: Array<{
    date: string;
    actual_m: number | null;
    predicted_m: number;
    upper_ci_95: number;
    lower_ci_95: number;
  }>;
}

export interface RechargeZone {
  id: string;
  zone_name: string;
  district: string;
  lat: number;
  lng: number;
  suitability_category: 'Very High Potential' | 'High Potential' | 'Moderate Potential' | 'Low Potential' | 'Very Low Potential';
  score: number;
  color_hex: string;
  slope_pct: number;
  drainage_density: string;
  lithology: string;
  recommended_structure: string;
  estimated_annual_recharge_potential_mcm: number;
  priority_box: number | null;
}

export interface CropWaterPlan {
  crop_name: string;
  growth_stage: string;
  kc_coefficient: number;
  reference_et0_mm_per_day: number;
  crop_water_demand_mm_per_day: number;
  farm_area_acres: number;
  total_irrigation_needed_liters_per_day: number;
  current_soil_moisture_pct: number;
  wilting_point_pct: number;
  field_capacity_pct: number;
  urgency_status: string;
  recommended_time_window: string;
  recommended_depth_mm: number;
  alert_message: string;
  water_saving_tip: string;
  forecast_chart: Array<{
    day: string;
    actual_sm_pct: number | null;
    predicted_sm_pct: number;
    optimal_zone: number;
    warning_threshold: number;
    critical_threshold: number;
  }>;
  stress_bars: Array<{
    day: string;
    soil_moisture_pct: number;
    stress_category: string;
    fill_color: string;
  }>;
}

export interface DSSItem {
  id: string;
  category: string;
  identified_problem: string;
  supporting_data: string;
  recommended_action: string;
  expected_benefit: string;
  estimated_cost_inr: string;
  priority_level: 'Critical' | 'High' | 'Medium' | 'Low';
  confidence_score_pct: number;
  scientific_limitations: string;
}

export interface WaterSimResult {
  region_id: string;
  baseline_gw_depth_m: number;
  projected_gw_depth_m: number;
  net_water_table_change_m: number;
  net_storage_change_mcm: number;
  total_recharge_mcm: number;
  total_draft_mcm: number;
  baseline_drought_score: number;
  projected_drought_score: number;
  sustainability_indicators: {
    groundwater_health: number;
    environmental_flow: number;
    agricultural_economy: number;
  };
  efficiency_indicators: {
    cities_efficiency_pct: number;
    agriculture_efficiency_pct: number;
    industry_efficiency_pct: number;
  };
  sources: Array<{ name: string; value: number; color: string }>;
  consumers: Array<{ name: string; value: number; color: string }>;
  assessment_narrative: string;
}
