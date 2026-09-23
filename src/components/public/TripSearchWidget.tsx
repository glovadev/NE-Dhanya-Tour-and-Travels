"use client";

import React, { useState } from "react";
import { 
  MapPin, 
  Users, 
  Calendar, 
  ArrowRight,
  Compass,
  Check
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { createWhatsAppLink, getTripSearchMessage } from "@/lib/whatsapp";

import { Destination, TouristPlace } from "@/types";

interface TripSearchWidgetProps {
  whatsappNumber: string;
  destinations?: Destination[];
  places?: TouristPlace[];
}

// Comprehensive destination to tourist places mapping fallback
const destinationPlacesMap: Record<string, string[]> = {
  "Meghalaya": [
    "Shillong (Scotland of East)",
    "Cherrapunji (Sohra Waterfalls)",
    "Dawki & Umngot River",
    "Mawlynnong (Cleanest Village)",
    "Double Decker Living Root Bridge",
    "Laitlum Canyons",
    "Krang Suri Waterfalls",
    "Shnongpdeng Camping",
    "Umiam Lake"
  ],
  "Assam": [
    "Kaziranga National Park (Rhino Safari)",
    "Guwahati & Maa Kamakhya Temple",
    "Manas National Park & Tiger Reserve",
    "Majuli Island (World's Largest River Island)",
    "Pobitora Wildlife Sanctuary",
    "Sivasagar (Ahom Kingdom Monuments)",
    "Haflong Hill Station",
    "Jorhat Tea Gardens"
  ],
  "Arunachal Pradesh": [
    "Tawang Monastery & Tawang War Memorial",
    "Sela Pass (13,700 ft) & Sela Lake",
    "Bumla Pass & Indo-China Border",
    "Sangetsar (Madhuri) Lake",
    "Dirang Valley & Sangti Valley",
    "Bomdila Monastery & Apple Orchards",
    "Ziro Valley (Apatani Culture)",
    "Nuranang (Jang) Waterfalls"
  ],
  "Sikkim": [
    "Gangtok & Pedestrian MG Marg",
    "Tsomgo (Changu) Lake & Nathula Pass",
    "North Sikkim (Lachen & Lachung)",
    "Yumthang Valley & Zero Point",
    "Gurudongmar Lake (17,800 ft)",
    "Pelling & Glass Skywalk",
    "Ravangla Buddha Park",
    "Namchi Chardham"
  ],
  "Nagaland": [
    "Kohima & World War II Cemetery",
    "Dzukou Valley Trek (Emerald Valley)",
    "Kisama Heritage Village (Hornbill)",
    "Khonoma Green Village",
    "Mokokchung Tribal Villages",
    "Mon (Konyak Heritage)"
  ],
  "Bhutan": [
    "Paro & Tiger's Nest (Taktsang)",
    "Thimphu City & Buddha Dordenma",
    "Punakha Dzong & Suspension Bridge",
    "Dochula Pass (108 Memorial Chortens)",
    "Phobjikha Valley (Black-Necked Cranes)",
    "Haa Valley"
  ],
  "Mizoram": [
    "Aizawl City & Solomon's Temple",
    "Reiek Peak & Heritage Village",
    "Hmuifang Tourist Resort",
    "Vantawng Multi-Tiered Falls",
    "Tamdil Lake",
    "Champhai Indo-Myanmar Border"
  ],
  "Tripura": [
    "Agartala & Ujjayanta Palace",
    "Neermahal Floating Water Palace",
    "Unakoti Colossal Rock Carvings",
    "Jampui Hills (Orange City)",
    "Tripura Sundari Temple"
  ],
  "Multi-State Northeast Tour": [
    "Assam + Meghalaya Classic (6D/5N)",
    "Assam, Meghalaya & Arunachal (9D/8N)",
    "Kaziranga Rhino Safari + Shillong & Cherrapunji",
    "Sikkim & Darjeeling Himalayan Circuit",
    "Complete 7-Sister Grand Odyssey"
  ]
};

export const TripSearchWidget: React.FC<TripSearchWidgetProps> = ({ whatsappNumber, destinations, places }) => {
  const activeDestMap = React.useMemo(() => {
    const map: Record<string, string[]> = { ...destinationPlacesMap };
    if (destinations && destinations.length > 0) {
      destinations.forEach(d => {
        const destPlaces = places ? places.filter(p => p.destinationSlug.toLowerCase() === d.slug.toLowerCase()) : [];
        if (destPlaces.length > 0) {
          map[d.name] = destPlaces.map(p => p.name);
        } else if (!map[d.name]) {
          map[d.name] = [`Explore ${d.name}`];
        }
      });
    }
    return map;
  }, [destinations, places]);

  const destinationsList = Object.keys(activeDestMap);

  const [destination, setDestination] = useState("Meghalaya");
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([
    "Shillong (Scotland of East)",
    "Cherrapunji (Sohra Waterfalls)",
    "Dawki & Umngot River"
  ]);
  const [travelType, setTravelType] = useState<"personal" | "sharing">("personal");
  const [travellers, setTravellers] = useState("2-4 Travellers");
  const [travelDate, setTravelDate] = useState("");

  // When user changes destination, auto-update or reset places
  const handleDestinationChange = (newDest: string) => {
    setDestination(newDest);
    // Pre-select top 2-3 popular places for that destination
    const placesForDest = activeDestMap[newDest] || [];
    setSelectedPlaces(placesForDest.slice(0, 3));
  };

  const togglePlace = (place: string) => {
    setSelectedPlaces((prev) => 
      prev.includes(place) 
        ? prev.filter((p) => p !== place) 
        : [...prev, place]
    );
  };

  const handleSelectAllPlaces = () => {
    const all = activeDestMap[destination] || [];
    setSelectedPlaces(all);
  };

  const handleClearPlaces = () => {
    setSelectedPlaces([]);
  };

  const handleGetQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const message = getTripSearchMessage({
      destination,
      places: selectedPlaces,
      travelType,
      travellers,
      travelDate: travelDate || "Flexible dates / Coming soon",
    });

    const url = createWhatsAppLink(whatsappNumber, message);
    window.open(url, "_blank");
  };

  const currentPlaces = destinationPlacesMap[destination] || [];

  return (
    <div className="w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6 border border-white/40 text-slate-800">
      
      {/* Travel Mode Toggle Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            Instant Trip Planner
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 font-heading">
            Where do you want to explore?
          </h3>
        </div>

        {/* Travel Mode Toggle */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTravelType("personal")}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              travelType === "personal"
                ? "bg-forest-800 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🚗 Personal / Private Tour
          </button>
          <button
            type="button"
            onClick={() => setTravelType("sharing")}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              travelType === "sharing"
                ? "bg-forest-800 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            👥 Sharing Tour
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleGetQuote} className="space-y-4">
        
        {/* Top 3 Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Destination Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Destination</span>
            </label>
            <select
              value={destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
            >
              {destinationsList.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Travellers Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Number of Travellers</span>
            </label>
            <select
              value={travellers}
              onChange={(e) => setTravellers(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
            >
              <option value="Solo Traveller (1 Person)">Solo Traveller (1 Person)</option>
              <option value="Couple / 2 Persons">Couple / 2 Persons</option>
              <option value="Small Family (3-4 Persons)">Small Family (3-4 Persons)</option>
              <option value="Medium Group (5-7 Persons)">Medium Group (5-7 Persons)</option>
              <option value="Large Group (8-15+ Persons)">Large Group (8-15+ Persons)</option>
            </select>
          </div>

          {/* Travel Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tentative Travel Date</span>
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Dynamic Tourist Places Selection (Sub-destinations) */}
        <div className="bg-slate-50/80 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                Tourist Places in {destination}:
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                (Choose one or multiple)
              </span>
              {selectedPlaces.length > 0 && (
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {selectedPlaces.length} selected
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={handleSelectAllPlaces}
                className="text-emerald-700 hover:text-emerald-900 transition-colors"
              >
                Select All
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={handleClearPlaces}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Place Options Grid with Radio/Checkbox Button Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {currentPlaces.map((place) => {
              const isSelected = selectedPlaces.includes(place);
              return (
                <button
                  key={place}
                  type="button"
                  onClick={() => togglePlace(place)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-all border ${
                    isSelected
                      ? "bg-white border-emerald-600 text-slate-900 font-semibold shadow-sm ring-1 ring-emerald-600"
                      : "bg-white/90 hover:bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {/* Radio / Check Circle Indicator */}
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                        : "border-slate-300 bg-slate-50"
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
                    )}
                  </div>
                  <span className="truncate">{place}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Row & Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              ✓ Customized Itinerary
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              ✓ Clean Mountain Cabs
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              ✓ Zero Hidden Charges
            </span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95 shrink-0"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current text-white" />
            <span>Get Instant Quote on WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
