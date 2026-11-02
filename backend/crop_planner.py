from typing import Dict, Any, List

# Crop coefficients (Kc) for FAO-56 Penman-Monteith method across stages
CROP_DATABASE = {
    "Wheat": {
        "stages": {
            "Crown Root Initiation (CRI)": {"kc": 0.45, "critical": True, "water_need_mm_day": 2.2},
            "Tillering": {"kc": 0.75, "critical": False, "water_need_mm_day": 3.6},
            "Jointing & Flowering": {"kc": 1.15, "critical": True, "water_need_mm_day": 5.2},
            "Grain Formation (Milking)": {"kc": 0.95, "critical": True, "water_need_mm_day": 4.5},
            "Ripening / Maturity": {"kc": 0.40, "critical": False, "water_need_mm_day": 1.8}
        },
        "soil_moisture_critical_pct": 14.0,
        "soil_moisture_warning_pct": 22.0,
        "saving_method": "Laser Land Levelling + Bed Planting (Saves 25-30% groundwater)"
    },
    "Paddy (Rice)": {
        "stages": {
            "Nursery & Transplanting": {"kc": 1.10, "critical": True, "water_need_mm_day": 6.8},
            "Active Tillering": {"kc": 1.25, "critical": True, "water_need_mm_day": 7.5},
            "Panicle Initiation / Flowering": {"kc": 1.35, "critical": True, "water_need_mm_day": 8.4},
            "Grain Filling": {"kc": 1.05, "critical": True, "water_need_mm_day": 6.0},
            "Maturity": {"kc": 0.70, "critical": False, "water_need_mm_day": 3.5}
        },
        "soil_moisture_critical_pct": 20.0,
        "soil_moisture_warning_pct": 28.0,
        "saving_method": "Alternate Wetting & Drying (AWD) / Direct Seeded Rice (DSR) (Saves 35% pumping)"
    },
    "Sugarcane": {
        "stages": {
            "Germination": {"kc": 0.50, "critical": False, "water_need_mm_day": 2.8},
            "Tillering / Formative": {"kc": 1.05, "critical": True, "water_need_mm_day": 5.8},
            "Grand Growth": {"kc": 1.25, "critical": True, "water_need_mm_day": 7.2},
            "Ripening": {"kc": 0.65, "critical": False, "water_need_mm_day": 3.2}
        },
        "soil_moisture_critical_pct": 16.0,
        "soil_moisture_warning_pct": 24.0,
        "saving_method": "Sub-surface Drip Irrigation (SSDI) + Trash Mulching (Saves 42% water)"
    },
    "Mustard": {
        "stages": {
            "Vegetative": {"kc": 0.55, "critical": False, "water_need_mm_day": 2.4},
            "Flowering / Pod Formation": {"kc": 1.05, "critical": True, "water_need_mm_day": 4.6},
            "Pod Filling & Maturation": {"kc": 0.60, "critical": False, "water_need_mm_day": 2.6}
        },
        "soil_moisture_critical_pct": 12.0,
        "soil_moisture_warning_pct": 18.0,
        "saving_method": "Micro-sprinkler irrigation at branch initiation (Saves 38% water)"
    },
    "Cotton": {
        "stages": {
            "Seedling": {"kc": 0.45, "critical": False, "water_need_mm_day": 2.0},
            "Square Formation & Flowering": {"kc": 1.15, "critical": True, "water_need_mm_day": 6.2},
            "Boll Development": {"kc": 1.20, "critical": True, "water_need_mm_day": 6.8},
            "Boll Opening": {"kc": 0.65, "critical": False, "water_need_mm_day": 3.0}
        },
        "soil_moisture_critical_pct": 14.0,
        "soil_moisture_warning_pct": 21.0,
        "saving_method": "Precision Drip with Fertigation (Saves 33% water, boosts yield 20%)"
    },
    "Gram (Chickpea)": {
        "stages": {
            "Branching": {"kc": 0.40, "critical": False, "water_need_mm_day": 1.8},
            "Pre-Flowering & Pod Formation": {"kc": 0.95, "critical": True, "water_need_mm_day": 4.2},
            "Pod Maturity": {"kc": 0.35, "critical": False, "water_need_mm_day": 1.5}
        },
        "soil_moisture_critical_pct": 11.0,
        "soil_moisture_warning_pct": 16.0,
        "saving_method": "Single sprinkler irrigation before flowering (Saves 40% water)"
    }
}

def calculate_crop_water_plan(crop_name: str, growth_stage: str, et0: float, current_sm: float, acres: float = 2.5) -> Dict[str, Any]:
    crop_info = CROP_DATABASE.get(crop_name, CROP_DATABASE["Wheat"])
    stages = crop_info["stages"]
    
    stage_data = stages.get(growth_stage, list(stages.values())[0])
    kc = stage_data["kc"]
    
    # ETc = Kc * ET0 (mm/day)
    etc_mm_day = round(kc * et0, 2)
    
    # 1 mm over 1 acre = 4046.86 Liters
    total_liters_per_day = round(etc_mm_day * acres * 4046.86)
    
    crit_pct = crop_info["soil_moisture_critical_pct"]
    warn_pct = crop_info["soil_moisture_warning_pct"]
    
    current_sm_pct = round(current_sm * 100, 1)
    
    if current_sm_pct <= crit_pct:
        urgency = "Urgent Irrigation Needed"
        rec_window = "Tomorrow 06:00 AM – 10:00 AM (Cool Hours)"
        alert_msg = f"Soil moisture ({current_sm_pct}%) has breached the permanent wilting threshold ({crit_pct}%). Severe crop stress in progress!"
        depth_to_apply_mm = 25.0
    elif current_sm_pct <= warn_pct:
        urgency = "Moderate Depletion"
        rec_window = "Within 48 hours (Early morning window)"
        alert_msg = f"Soil moisture ({current_sm_pct}%) is nearing critical threshold ({crit_pct}%). Plan light irrigation."
        depth_to_apply_mm = 15.0
    else:
        urgency = "Optimal Moisture"
        rec_window = "No irrigation required for the next 4-5 days"
        alert_msg = f"Soil moisture ({current_sm_pct}%) is well within rootzone comfort capacity. Avoid excess pumping."
        depth_to_apply_mm = 0.0

    # 7-day soil moisture forecast trajectory matching Image 3
    days = ["Today", "Tomorrow", "+2 Days", "+3 Days", "+4 Days", "+5 Days", "+6 Days"]
    forecast_trajectory = []
    bar_water_stress = []
    
    decay_rate = etc_mm_day * 0.4
    sim_sm = current_sm_pct
    
    for i, day in enumerate(days):
        if i > 0:
            sim_sm = max(5.0, round(sim_sm - decay_rate, 1))
        
        status = "Healthy"
        if sim_sm <= crit_pct:
            status = "Critical"
        elif sim_sm <= warn_pct:
            status = "Warning"
            
        forecast_trajectory.append({
            "day": day,
            "actual_sm_pct": current_sm_pct if i == 0 else None,
            "predicted_sm_pct": sim_sm,
            "optimal_zone": 35.0,
            "warning_threshold": warn_pct,
            "critical_threshold": crit_pct
        })
        
        bar_water_stress.append({
            "day": day,
            "soil_moisture_pct": sim_sm,
            "stress_category": status,
            "fill_color": "#16a34a" if status == "Healthy" else ("#eab308" if status == "Warning" else "#ef4444")
        })

    return {
        "crop_name": crop_name,
        "growth_stage": growth_stage,
        "kc_coefficient": kc,
        "reference_et0_mm_per_day": et0,
        "crop_water_demand_mm_per_day": etc_mm_day,
        "farm_area_acres": acres,
        "total_irrigation_needed_liters_per_day": total_liters_per_day,
        "current_soil_moisture_pct": current_sm_pct,
        "wilting_point_pct": crit_pct,
        "field_capacity_pct": 36.0,
        "urgency_status": urgency,
        "recommended_time_window": rec_window,
        "recommended_depth_mm": depth_to_apply_mm,
        "alert_message": alert_msg,
        "water_saving_tip": crop_info["saving_method"],
        "forecast_chart": forecast_trajectory,
        "stress_bars": bar_water_stress
    }
