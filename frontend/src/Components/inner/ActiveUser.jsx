import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

import India from "../../assets/India.png";
import Canada from "../../assets/Canada.png";
import Russia from "../../assets/Russia.png";
import UK from "../../assets/UK.png";
import Australia from "../../assets/Australia.png";
import US from "../../assets/US.png";
import Pakistan from "../../assets/Pakistan.png";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countries = [
  { name: "India", flag: India, percent: 50 },
  { name: "Canada", flag: Canada, percent: 30 },
  { name: "Russia", flag: Russia, percent: 20 },
  { name: "United Kingdom", flag: UK, percent: 40 },
  { name: "Australia", flag: Australia, percent: 60 },
  { name: "United States", flag: US, percent: 20 },
  { name: "Pakistan", flag: Pakistan, percent: 20 },
];

export default function ActiveUsers() {
  const [zoom, setZoom] = useState(1);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.5, 4));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.5, 1));

  return (
   <div className="h-full bg-white dark:bg-[#0b1220] border border-gray-700 rounded-xl p-6">

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT MAP */}
        <div className="relative bg-gray-50 dark:bg-[#0b1220] rounded-lg p-4 h-[400px] lg:h-[500px]">

          {/* Title */}
          <h1 className="text-gray-800 dark:text-gray-300 text-sm mb-3">
            Active users
          </h1>

          {/* Zoom Buttons */}
          <div className="absolute left-4 top-12 flex flex-col gap-2 z-10">

            <button
              onClick={zoomIn}
              className="bg-[#0b1220] text-white w-7 h-7 rounded flex items-center justify-center hover:bg-[#172235]"
            >
              +
            </button>

            <button
              onClick={zoomOut}
              className="bg-[#0b1220] text-white w-7 h-7 rounded flex items-center justify-center hover:bg-[#172235]"
            >
              −
            </button>

          </div>

          {/* MAP */}
          <div className="w-full h-full">

            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 130 }}
              style={{ width: "100%", height: "100%" }}
            >

              <ZoomableGroup zoom={zoom} center={[0, 20]}>

                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (

                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#6B7280"
                        stroke="#E5E7EB"
                        strokeWidth={0.5}
                        className="dark:fill-gray-300 dark:stroke-gray-700 cursor-pointer"
                        style={{
                          default: {
                            outline: "none",
                          },
                          hover: {
                            fill: "#3B82F6",
                            outline: "none",
                          },
                          pressed: {
                            outline: "none",
                          },
                        }}
                      />

                    ))
                  }
                </Geographies>

              </ZoomableGroup>

            </ComposableMap>

          </div>

        </div>

        {/* RIGHT COUNTRY LIST */}
        <div className="border-l border-gray-300 dark:border-[#243244] pl-6 space-y-5 flex flex-col justify-center">

          {countries.map((country, index) => (

            <div key={index}>

              {/* Country row */}
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">

                <div className="flex items-center gap-3">

                  {/* FLAG IMAGE */}
                  <img
                    src={country.flag}
                    alt={country.name}
                    className="w-6 h-6 rounded-sm object-cover border border-gray-300 dark:border-gray-600"
                  />

                  <span>{country.name}</span>

                </div>

                <span className="font-medium">
                  {country.percent}%
                </span>

              </div>

              {/* Progress Bar */}
              <div className="bg-gray-300 dark:bg-gray-700 h-2 rounded">

                <div
                  className="bg-blue-500 h-2 rounded transition-all duration-500"
                  style={{ width: `${country.percent}%` }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}
