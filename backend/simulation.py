from typing import Dict, Any

def run_watershed_simulation(
    region_id: str,
    rainfall_change_pct: float,
    pumping_change_pct: float,
    temp_increase_c: float,
    recharge_structures_count: int = 15,
    drip_irrigation_adoption_pct: float = 20.0,
    baseline_depth: float = 24.8,
    area_sq_km: float = 3765.0
) -> Dict[str, Any]:
    """
    Simulates aquifer water budget using lumped hydrological balance equation:
    ΔS = P_eff + R_art + Q_in - (ET_actual + Q_out + Draft_pumping)
    """
    # Baseline normal values (MCM = Million Cubic Meters)
    baseline_annual_rainfall_mcm = (680.0 / 1000.0) * area_sq_km * 0.18  # 18% infiltration factor
    baseline_annual_extraction_mcm = baseline_annual_rainfall_mcm * 1.45  # Over-exploited deficit
    
    # Apply user-modified scenario deltas
    sim_rainfall_factor = 1.0 + (rainfall_change_pct / 100.0)
    sim_pumping_factor = 1.0 + (pumping_change_pct / 100.0)
    temp_et_factor = 1.0 + (temp_increase_c * 0.045)  # 4.5% ET increase per 1°C
    
    efficiency_saving_factor = 1.0 - (drip_irrigation_adoption_pct * 0.0035)  # Saves water
    
    simulated_natural_recharge_mcm = baseline_annual_rainfall_mcm * sim_rainfall_factor / temp_et_factor
    simulated_artificial_recharge_mcm = recharge_structures_count * 0.42  # 0.42 MCM per check dam/shaft
    total_recharge_mcm = simulated_natural_recharge_mcm + simulated_artificial_recharge_mcm
    
    simulated_draft_mcm = baseline_annual_extraction_mcm * sim_pumping_factor * efficiency_saving_factor
    
    net_storage_change_mcm = round(total_recharge_mcm - simulated_draft_mcm, 2)
    
    # Specific yield Sy ~ 0.12 for alluvial sand, 0.03 for hard rock
    specific_yield = 0.10
    head_change_m = net_storage_change_mcm / (area_sq_km * specific_yield)
    
    projected_depth_m = max(2.0, round(baseline_depth - head_change_m, 2))
    depth_shift_m = round(projected_depth_m - baseline_depth, 2)  # positive means deeper/worse
    
    # Calculate sustainability indices (0 - 100)
    gw_sustainability_score = max(5, min(98, round(70.0 - (depth_shift_m * 12.0) + (drip_irrigation_adoption_pct * 0.3))))
    env_health_score = max(10, min(95, round(65.0 + (rainfall_change_pct * 0.5) - (temp_increase_c * 4.0))))
    economy_score = max(20, min(96, round(75.0 + (pumping_change_pct * 0.3) - (abs(depth_shift_m) * 3.0))))
    
    # Drought score shift
    baseline_drought_score = 68.0
    projected_drought = min(99.0, max(12.0, round(baseline_drought_score - (rainfall_change_pct * 0.6) + (pumping_change_pct * 0.4) + (temp_increase_c * 3.5) - (recharge_structures_count * 0.5), 1)))

    # Flow Sankey proportions matching Image 4
    total_water_budget = round(simulated_draft_mcm + total_recharge_mcm, 1)
    sources = [
        {"name": "Groundwater Extraction", "value": round(simulated_draft_mcm, 1), "color": "#0284c7"},
        {"name": "Rainfall Infiltration", "value": round(simulated_natural_recharge_mcm, 1), "color": "#16a34a"},
        {"name": "Artificial Recharge Structures", "value": round(simulated_artificial_recharge_mcm, 1), "color": "#0d9488"}
    ]
    consumers = [
        {"name": "Agriculture (Irrigation)", "value": round(simulated_draft_mcm * 0.82, 1), "color": "#eab308"},
        {"name": "Cities & Domestic Towns", "value": round(simulated_draft_mcm * 0.12, 1), "color": "#3b82f6"},
        {"name": "Industry & Infrastructure", "value": round(simulated_draft_mcm * 0.06, 1), "color": "#ef4444"}
    ]

    return {
        "region_id": region_id,
        "baseline_gw_depth_m": baseline_depth,
        "projected_gw_depth_m": projected_depth_m,
        "net_water_table_change_m": depth_shift_m,
        "net_storage_change_mcm": net_storage_change_mcm,
        "total_recharge_mcm": round(total_recharge_mcm, 1),
        "total_draft_mcm": round(simulated_draft_mcm, 1),
        "baseline_drought_score": baseline_drought_score,
        "projected_drought_score": projected_drought,
        "sustainability_indicators": {
            "groundwater_health": gw_sustainability_score,
            "environmental_flow": env_health_score,
            "agricultural_economy": economy_score
        },
        "efficiency_indicators": {
            "cities_efficiency_pct": 68,
            "agriculture_efficiency_pct": round(45 + drip_irrigation_adoption_pct * 0.6),
            "industry_efficiency_pct": 52
        },
        "sources": sources,
        "consumers": consumers,
        "assessment_narrative": (
            f"Under this scenario, the aquifer experiences a net annual storage shift of {net_storage_change_mcm:+.1f} MCM. "
            f"Groundwater depth is projected to {'decline deeper by' if depth_shift_m > 0 else 'recover shallower by'} {abs(depth_shift_m):.2f} meters. "
            f"Drought stress score moves from {baseline_drought_score} to {projected_drought}."
        )
    }
