from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ObservationWell(BaseModel):
    id: str
    name: str
    village: str
    district: str
    state: str
    basin: str
    lat: float
    lng: float
    depth_bgl_m: float  # Current Depth to water table below ground level in meters
    historical_avg_m: float
    trend_rate_m_per_year: float  # negative means declining
    aquifer_type: str  # Alluvial, Hard rock basalt, Granite-Gneiss, etc.
    completeness_grade: str  # Grade A (>=90%), Grade B (70-89%), Grade C (40-69%), Grade D (<40%)
    survey_type: str  # ERS (Electrical Resistivity Survey), GBL (Geophysical Borewell Logging), DWLR (Digital Water Level Recorder)
    last_updated: str
    status: str  # Normal, Semi-Critical, Critical, Over-Exploited

class RegionInfo(BaseModel):
    id: str
    name: str
    district: str
    state: str
    basin: str
    lat: float
    lng: float
    area_sq_km: float
    total_wells: int
    overexploited_wells: int
    baseline_gw_depth_m: float
    annual_rainfall_normal_mm: float
    dominant_crops: List[str]
    aquifer_system: str
    soil_type: str

class LiveMeteoData(BaseModel):
    temperature_c: float
    relative_humidity_pct: float
    precipitation_mm: float
    evapotranspiration_et0_mm: float
    soil_moisture_0_to_7cm: float  # m3/m3
    soil_moisture_7_to_28cm: float
    weather_condition: str
    forecast_7d_rainfall_mm: float
    is_live_api: bool
    source_attribution: str
    timestamp: str

class MLPredictionResult(BaseModel):
    station_id: str
    station_name: str
    horizon_days: int
    current_depth_m: float
    predicted_depth_m: float
    trend_description: str
    confidence_interval_low: float
    confidence_interval_high: float
    depletion_probability_pct: float
    metrics: Dict[str, float]  # R2, RMSE, MAE
    shap_feature_importance: List[Dict[str, Any]]
    time_series: List[Dict[str, Any]]  # dates, actual, predicted, upper, lower

class DroughtAssessment(BaseModel):
    region_id: str
    region_name: str
    drought_score: float  # 0 to 100
    risk_level: str  # Low Risk, Moderate Risk, High Risk, Critical Risk
    rainfall_deficit_pct: float
    groundwater_decline_pct: float
    soil_moisture_anomaly: float
    heat_stress_index: float
    high_risk_villages: List[Dict[str, Any]]
    early_warning_alerts: List[Dict[str, Any]]
    recommended_preventive_action: str
    source_agency: str

class CropPlanRequest(BaseModel):
    region_id: str
    crop_name: str
    growth_stage: str
    farm_area_acres: float = 2.5
    soil_texture: str = "Loamy"

class CropPlanResponse(BaseModel):
    crop_name: str
    growth_stage: str
    kc_coefficient: float
    reference_et0_mm_per_day: float
    crop_water_demand_mm_per_day: float
    total_irrigation_needed_liters_per_day: float
    current_soil_moisture_pct: float
    wilting_point_pct: float
    field_capacity_pct: float
    urgency_status: str  # Optimal, Moderate, Urgent Irrigation Needed, Over-irrigated
    recommended_time_window: str
    water_saving_tip: str
    efficient_method_savings_pct: int

class RechargeSiteItem(BaseModel):
    id: str
    zone_name: str
    district: str
    lat: float
    lng: float
    suitability_category: str  # Very High Potential, High Potential, Moderate Potential, Low Potential
    score: float  # 0-100 AHP weighted
    slope_pct: float
    drainage_density: str
    lithology: str
    recommended_structure: str  # Check Dam, Recharge Shaft, Percolation Pond, Sub-surface Dyke
    estimated_annual_recharge_potential_mcm: float

class SimulationRequest(BaseModel):
    region_id: str
    rainfall_change_pct: float = 0.0  # e.g. -20% or +20%
    pumping_change_pct: float = 0.0   # e.g. +15%
    temp_increase_c: float = 0.0      # e.g. +1.5 C
    recharge_interventions_count: int = 10
    drip_irrigation_adoption_pct: float = 20.0

class SimulationResponse(BaseModel):
    baseline_gw_depth_m: float
    projected_gw_depth_m: float
    net_water_table_change_m: float
    baseline_drought_score: float
    projected_drought_score: float
    annual_storage_change_mcm: float
    risk_level_shift: str
    impact_summary: str
    breakdown_water_balance: Dict[str, float]

class DSSRecommendation(BaseModel):
    id: str
    category: str  # Farmer, Government, Hydrologist / Planner
    identified_problem: str
    supporting_data: str
    recommended_action: str
    expected_benefit: str
    estimated_cost_inr: str
    priority_level: str  # Critical, High, Medium, Low
    confidence_score_pct: int
    scientific_limitations: str

class ConservationProject(BaseModel):
    id: str
    title: str
    structure_type: str
    location: str
    district: str
    state: str
    completion_date: str
    status: str  # Operational, Under Construction, Proposed
    capacity_megalitres: float
    cumulative_recharged_megalitres: float
    surrounding_gw_rise_cm: float
    cost_inr_lakhs: float

class CopilotQuery(BaseModel):
    prompt: str
    region_id: Optional[str] = "ludhiana"
    user_role: Optional[str] = "researcher"
