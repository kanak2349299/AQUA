from typing import List, Dict, Any

# AHP (Analytic Hierarchy Process) Weights validated for Indian Watersheds
AHP_WEIGHTS = {
    "slope": 0.28,
    "lithology": 0.22,
    "soil_permeability": 0.18,
    "drainage_density": 0.16,
    "rainfall": 0.16
}

RECHARGE_ZONES_DATA: Dict[str, List[Dict[str, Any]]] = {
    "haridwar": [
        {
            "id": "RZ-HRD-01",
            "zone_name": "Bahadrabad Central Alluvial Fan (Priority Box 3)",
            "district": "Haridwar",
            "lat": 29.9150,
            "lng": 78.0720,
            "suitability_category": "Very High Potential",
            "score": 88.5,
            "color_hex": "#800000",
            "slope_pct": 1.2,
            "drainage_density": "Moderate (1.8 km/km²)",
            "lithology": "Bhabar Coarse Boulder & Gravel Bed",
            "recommended_structure": "Infiltration Basin & Subsurface Recharge Shafts",
            "estimated_annual_recharge_potential_mcm": 14.2,
            "priority_box": 3
        },
        {
            "id": "RZ-HRD-02",
            "zone_name": "Roorkee Solani Floodplain Buffer (Priority Box 2)",
            "district": "Haridwar",
            "lat": 29.8620,
            "lng": 77.8950,
            "suitability_category": "High Potential",
            "score": 76.4,
            "color_hex": "#16a34a",
            "slope_pct": 2.1,
            "drainage_density": "High (2.4 km/km²)",
            "lithology": "Holocene Tarai Alluvial Silt & Sand",
            "recommended_structure": "Check Dams with Infiltration Trenches",
            "estimated_annual_recharge_potential_mcm": 11.5,
            "priority_box": 2
        },
        {
            "id": "RZ-HRD-03",
            "zone_name": "Bhagwanpur Industrial Aquifer Depression (Priority Box 1)",
            "district": "Haridwar",
            "lat": 30.0380,
            "lng": 77.8180,
            "suitability_category": "Very High Potential",
            "score": 84.8,
            "color_hex": "#800000",
            "slope_pct": 1.8,
            "drainage_density": "Moderate (1.6 km/km²)",
            "lithology": "Upper Alluvium with High Transmissivity",
            "recommended_structure": "Percolation Ponds with Deep Gravity Injection Wells",
            "estimated_annual_recharge_potential_mcm": 16.8,
            "priority_box": 1
        },
        {
            "id": "RZ-HRD-04",
            "zone_name": "Laksar South-Eastern Agriculture Belt (Priority Box 4)",
            "district": "Haridwar",
            "lat": 29.7480,
            "lng": 78.0320,
            "suitability_category": "High Potential",
            "score": 73.2,
            "color_hex": "#16a34a",
            "slope_pct": 1.5,
            "drainage_density": "Low-Moderate (1.4 km/km²)",
            "lithology": "Fine Sandy Loam over Clayey Lenses",
            "recommended_structure": "Farm Pond Networks & Bund Infiltration",
            "estimated_annual_recharge_potential_mcm": 9.4,
            "priority_box": 4
        },
        {
            "id": "RZ-HRD-05",
            "zone_name": "Chandi Devi Piedmont Escarpment",
            "district": "Haridwar",
            "lat": 29.9320,
            "lng": 78.1880,
            "suitability_category": "Low Potential",
            "score": 41.0,
            "color_hex": "#ef4444",
            "slope_pct": 18.5,
            "drainage_density": "Steep Runoff Channels",
            "lithology": "Siwalik Sandstone & Mudstone Conglomerate",
            "recommended_structure": "Contour Trenches & Afforestation Only",
            "estimated_annual_recharge_potential_mcm": 2.1,
            "priority_box": None
        },
        {
            "id": "RZ-HRD-06",
            "zone_name": "Ganga Canal Right Bank Moderate Zone",
            "district": "Haridwar",
            "lat": 29.8900,
            "lng": 78.0100,
            "suitability_category": "Moderate Potential",
            "score": 58.0,
            "color_hex": "#eab308",
            "slope_pct": 3.4,
            "drainage_density": "Moderate",
            "lithology": "Fine Sandy Clay",
            "recommended_structure": "Check Dams & Gabion Structures",
            "estimated_annual_recharge_potential_mcm": 5.8,
            "priority_box": None
        }
    ],
    "ludhiana": [
        {
            "id": "RZ-LDH-01",
            "zone_name": "Sutlej Floodplain Paleo-Channel Zone (Jagraon)",
            "district": "Ludhiana",
            "lat": 30.8650,
            "lng": 75.5200,
            "suitability_category": "Very High Potential",
            "score": 89.2,
            "color_hex": "#800000",
            "slope_pct": 0.8,
            "drainage_density": "Moderate",
            "lithology": "Paleo-channel Coarse Sand Formations",
            "recommended_structure": "Direct Injection Aquifer Wells & Infiltration Basins",
            "estimated_annual_recharge_potential_mcm": 22.4,
            "priority_box": 1
        },
        {
            "id": "RZ-LDH-02",
            "zone_name": "Buddha Nullah Buffer Alluvial Plain",
            "district": "Ludhiana",
            "lat": 30.9350,
            "lng": 75.8450,
            "suitability_category": "Moderate Potential",
            "score": 55.4,
            "color_hex": "#eab308",
            "slope_pct": 1.2,
            "drainage_density": "High (Industrial Runoff)",
            "lithology": "Silty Loam over Sand",
            "recommended_structure": "Constructed Wetland Infiltration with Pre-filtration",
            "estimated_annual_recharge_potential_mcm": 6.8,
            "priority_box": None
        },
        {
            "id": "RZ-LDH-03",
            "zone_name": "Samrala Recharge Corridor",
            "district": "Ludhiana",
            "lat": 30.8250,
            "lng": 76.1850,
            "suitability_category": "High Potential",
            "score": 78.1,
            "color_hex": "#16a34a",
            "slope_pct": 1.0,
            "drainage_density": "Low-Moderate",
            "lithology": "Alluvial Loam with High Infiltration",
            "recommended_structure": "Check Dams & Village Pond Rejuvenation",
            "estimated_annual_recharge_potential_mcm": 15.2,
            "priority_box": 2
        }
    ],
    "latur": [
        {
            "id": "RZ-LTR-01",
            "zone_name": "Manjra River Basalt Fracture Confluence (Ausa)",
            "district": "Latur",
            "lat": 18.2600,
            "lng": 76.5150,
            "suitability_category": "High Potential",
            "score": 75.8,
            "color_hex": "#16a34a",
            "slope_pct": 2.5,
            "drainage_density": "Moderate",
            "lithology": "Vesicular Basalt Lineament Intersections",
            "recommended_structure": "Sub-surface Dykes & Continuous Contour Trenches",
            "estimated_annual_recharge_potential_mcm": 8.5,
            "priority_box": 1
        }
    ]
}

def get_recharge_zones(district: str) -> List[Dict[str, Any]]:
    key = district.lower()
    if key in RECHARGE_ZONES_DATA:
        return RECHARGE_ZONES_DATA[key]
    return RECHARGE_ZONES_DATA["haridwar"]
