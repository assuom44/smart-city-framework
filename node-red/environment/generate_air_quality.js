function randomBetween(min, max, decimals = 2) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function calculateAQIPM25(pm25) {
  // AQI based on PM2.5 using the US EPA scale
  const breakpoints = [
    { cLow: 0.0, cHigh: 9.0, iLow: 0, iHigh: 50, status: "good" },
    { cLow: 9.1, cHigh: 35.4, iLow: 51, iHigh: 100, status: "moderate" },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150, status: "unhealthy_sensitive" },
    { cLow: 55.5, cHigh: 125.4, iLow: 151, iHigh: 200, status: "unhealthy" },
    { cLow: 125.5, cHigh: 225.4, iLow: 201, iHigh: 300, status: "very_unhealthy" },
    { cLow: 225.5, cHigh: 325.4, iLow: 301, iHigh: 500, status: "hazardous" }
  ];

  const bp = breakpoints.find(b => pm25 >= b.cLow && pm25 <= b.cHigh);

  if (!bp) {
    return {
      aqi: 500,
      status: "hazardous"
    };
  }

  const aqi =
    ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) *
      (pm25 - bp.cLow) +
    bp.iLow;

  return {
    aqi: Math.round(aqi),
    status: bp.status
  };
}

function districtFactor(districtId) {
  // Estimated factor by district
  const factors = {
    sidi_bouzid: 0.90,
    bennani: 1.05,
    el_manar: 1.05,
    sidi_moussa: 1.00,
    essaada: 1.08,
    mouilha: 1.02,
    cite_portugaise: 1.15,
    najd: 1.00,
    les_facultes: 0.95,
    district_jaouhara: 1.03
  };

  return factors[districtId] || 1.00;
}

function estimateAirQuality(districtId, hour) {
  const factor = districtFactor(districtId);

  // Realistic estimated values for El Jadida
  // PM2.5 is generally around 11 to 16.5 µg/m³
  let pm25Base = randomBetween(11, 16.5);

  // Hourly variation: higher pollution during traffic periods
  if (hour >= 7 && hour <= 9) {
    pm25Base += randomBetween(2, 5);
  } else if (hour >= 17 && hour <= 20) {
    pm25Base += randomBetween(2, 6);
  } else if (hour >= 0 && hour <= 5) {
    pm25Base -= randomBetween(1, 3);
  }

  const pm25 = Math.max(3, pm25Base * factor + randomBetween(-1.2, 1.2));
  const pm10 = pm25 * randomBetween(1.8, 2.8);
  const no2 = randomBetween(8, 32) * factor;
  const co = randomBetween(0.2, 0.8) * factor;
  const o3 = randomBetween(30, 75);

  const aqiResult = calculateAQIPM25(pm25);

  return {
    aqi: aqiResult.aqi,
    status: aqiResult.status,
    main_pollutant: "PM2.5",
    pm25: Number(pm25.toFixed(2)),
    pm10: Number(pm10.toFixed(2)),
    no2: Number(no2.toFixed(2)),
    co: Number(co.toFixed(2)),
    o3: Number(o3.toFixed(2)),
    units: {
      pm25: "µg/m³",
      pm10: "µg/m³",
      no2: "µg/m³",
      co: "mg/m³",
      o3: "µg/m³"
    }
  };
}

// Verify that msg.sensors exists
if (!Array.isArray(msg.sensors)) {
  throw new Error("msg.sensors is missing. Run the sensor configuration and temperature generation nodes first.");
}

const now = new Date();
const currentHour = now.getHours();

// Add air quality data to each sensor
msg.sensors = msg.sensors.map(sensor => {
  return {
    ...sensor,
    air_quality: estimateAirQuality(sensor.districtId, currentHour)
  };
});

return msg;