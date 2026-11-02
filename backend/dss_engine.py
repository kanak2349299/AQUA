from typing import List, Dict, Any

def get_dss_recommendations(region_id: str, role: str = "all") -> List[Dict[str, Any]]:
    all_recs = [
        # Farmer Recommendations
        {
            "id": "DSS-FARM-01",
            "category": "Farmer",
            "role_target": "farmer",
            "identified_problem": "Critical Rootzone Soil Moisture Deficit during High-Kc Crop Stage",
            "supporting_data": "Current rootzone volumetric soil moisture is 12.8% (permanent wilting limit 14.0%). Daily FAO-56 ET0 is 4.8 mm/day.",
            "recommended_action": "Execute precision night-time / early morning micro-sprinkler irrigation (15-20 mm) between 05:00 AM and 09:00 AM to eliminate mid-day evaporative loss.",
            "expected_benefit": "Prevents irreversible vegetative moisture stress while reducing water consumption by 28% compared to afternoon flood irrigation.",
            "estimated_cost_inr": "₹1,200 per acre (operational energy saving ₹450)",
            "priority_level": "Critical",
            "confidence_score_pct": 94,
            "scientific_limitations": "Model assumes uniform soil porosity; micro-variations in clay patches may alter drainage velocity."
        },
        {
            "id": "DSS-FARM-02",
            "category": "Farmer",
            "role_target": "farmer",
            "identified_problem": "Excessive Groundwater Pumping for Water-Intensive Crops in Over-Exploited Blocks",
            "supporting_data": "Local extraction stage stands at 164% of net annual recharge. Deep tube well pumping depth exceeded 28m below ground level.",
            "recommended_action": "Transition from conventional puddle transplantation to Direct Seeded Rice (DSR) or shift 30% acreage to Maize/Pulses (Moong/Urad) during Kharif cycle.",
            "expected_benefit": "Conserves 3.5 to 4.2 lakh liters of groundwater per acre per season; lowers diesel/electricity pumping bills by 35%.",
            "estimated_cost_inr": "₹4,500 per acre initial seed drill rental (eligible for ₹7,000 state incentive)",
            "priority_level": "High",
            "confidence_score_pct": 91,
            "scientific_limitations": "Adoption depends on weed management efficacy and timely pre-monsoon precipitation."
        },

        # Government Authority Recommendations
        {
            "id": "DSS-GOV-01",
            "category": "Government",
            "role_target": "officer",
            "identified_problem": "Rapid Groundwater Table Drawdown & Borewell Failure in Jagraon & Samrala Clusters",
            "supporting_data": "Telemetric DWLR logs indicate a continuous multi-year drawdown rate of -0.88 m/year. 81% of rural observation wells classified Over-Exploited.",
            "recommended_action": "Notify Jagraon Block under CGWA Section 5(2) for regulated commercial extraction; deploy 12 high-capacity deep recharge shafts along Sutlej paleo-channels before monsoon.",
            "expected_benefit": "Replenishes 8.4 MCM of surplus canal runoff annually directly into the second confined aquifer, arresting local cone of depression.",
            "estimated_cost_inr": "₹1.85 Crores under District Mineral Foundation / Jal Jeevan Mission funds",
            "priority_level": "Critical",
            "confidence_score_pct": 96,
            "scientific_limitations": "Requires strict sedimentation desilt chambers to prevent clogging of injection filter media."
        },
        {
            "id": "DSS-GOV-02",
            "category": "Government",
            "role_target": "officer",
            "identified_problem": "High-Runoff Waste and Declining Water Bodies in Haridwar Sub-Himalayan Piedmont",
            "supporting_data": "AHP Multi-criteria analysis identified Bahadrabad and Bhagwanpur zones with >84/100 recharge suitability but low storage capture.",
            "recommended_action": "Construct a cascade of 6 gabion check dams and rejuvenate 18 community village ponds with silt-trap forebays in Haridwar district.",
            "expected_benefit": "Captures 14.2 MCM of annual flash runoff, augmenting groundwater table by an estimated 0.45 meters within a 3-km radius.",
            "estimated_cost_inr": "₹3.40 Crores under MGNREGS convergence scheme",
            "priority_level": "High",
            "confidence_score_pct": 92,
            "scientific_limitations": "Piedmont boulder beds require structural anchoring against monsoon flash flood velocity."
        },

        # Hydrologist / Planner Recommendations
        {
            "id": "DSS-PLAN-01",
            "category": "Hydrologist / Planner",
            "role_target": "researcher",
            "identified_problem": "Cumulative Aquifer Deficit Threatens Long-Term Baseflow to Downstream Wetlands",
            "supporting_data": "WaterSim simulation reveals a net negative aquifer storage balance of -34.5 MCM/year under current 15% extraction growth trajectory.",
            "recommended_action": "Establish dynamic conjunctive water management: increase surface canal water allocation during peak Kharif to relieve tube-well pumping pressure.",
            "expected_benefit": "Reduces groundwater draft by 42 MCM/year, stabilizing hydraulic gradient and securing perennial river baseflow.",
            "estimated_cost_inr": "₹85 Lakhs for telemetry automation and canal gate SCADA integration",
            "priority_level": "High",
            "confidence_score_pct": 89,
            "scientific_limitations": "Canal delivery is subject to inter-state reservoir storage availability in upstream Bhakra-Nangal dams."
        },
        {
            "id": "DSS-PLAN-02",
            "category": "Hydrologist / Planner",
            "role_target": "researcher",
            "identified_problem": "Sparse Telemetry Density along Fractured Hard-Rock Aquifers in Marathwada & Rayalaseema",
            "supporting_data": "Observation density in Latur/Anantapur is only 1 station per 180 km², leading to uncertainty in localized basalt lineament recharge tracking.",
            "recommended_action": "Deploy 25 IoT-enabled Digital Water Level Recorders (DWLR) with acoustic sensors paired with Electrical Resistivity (ERS) profiling.",
            "expected_benefit": "Increases localized data completeness grade from Grade C (55%) to Grade A (>90%), reducing ML prediction error (RMSE) from 0.45m to <0.18m.",
            "estimated_cost_inr": "₹42 Lakhs through National Hydrology Project (NHP)",
            "priority_level": "Medium",
            "confidence_score_pct": 95,
            "scientific_limitations": "Cellular telemetry connectivity in remote basalt valley terrains requires satellite fallback uplink."
        }
    ]

    if role in ["farmer", "officer", "researcher"]:
        return [r for r in all_recs if r["role_target"] == role or r["priority_level"] == "Critical"]
    return all_recs
