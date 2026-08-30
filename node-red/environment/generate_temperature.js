function estimateTemperature(month, hour) {
  // Monthly average, minimum, and maximum temperatures for El Jadida.
  const MONTHS = {
    1: { Tmin: 10.9, Tmax: 16.8, Tavg: 13.85, A: 2.95, h0: 8 },
    2: { Tmin: 11.2, Tmax: 17.3, Tavg: 14.25, A: 3.05, h0: 9 },
    3: { Tmin: 12.7, Tmax: 19.1, Tavg: 15.9, A: 3.2, h0: 9 },
    4: { Tmin: 14.1, Tmax: 20.2, Tavg: 17.15, A: 3.05, h0: 9 },
    5: { Tmin: 16.2, Tmax: 22.5, Tavg: 19.35, A: 3.15, h0: 9 },
    6: { Tmin: 18.5, Tmax: 24.9, Tavg: 21.7, A: 3.2, h0: 9 },
    7: { Tmin: 20.1, Tmax: 26.4, Tavg: 23.25, A: 3.15, h0: 9 },
    8: { Tmin: 20.8, Tmax: 27.3, Tavg: 24.05, A: 3.25, h0: 9 },
    9: { Tmin: 19.9, Tmax: 26.0, Tavg: 22.95, A: 3.05, h0: 9 },
    10: { Tmin: 18.1, Tmax: 24.1, Tavg: 21.1, A: 3.0, h0: 9 },
    11: { Tmin: 14.4, Tmax: 20.2, Tavg: 17.3, A: 2.9, h0: 9 },
    12: { Tmin: 12.2, Tmax: 18.1, Tavg: 15.15, A: 2.95, h0: 9 },
  };

  if (!MONTHS[month]) {
    throw new Error("Month must be between 1 and 12.");
  }

  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new Error("Hour must be between 0 and 23.");
  }

  const weatherNoise = Math.random() * 3 - 1.5;
  const monthData = MONTHS[month];
  const temperature =
    monthData.Tavg +
    monthData.A * Math.sin(((2 * Math.PI) / 24) * (hour - monthData.h0)) +
    weatherNoise;

  return Number(temperature.toFixed(2));
}

// El Jadida districts represented by the dashboard map.
const districts = [
  "Sidi Bouzid",
  "Bennani",
  "El Manar",
  "Sidi Moussa",
  "Essaada",
  "Mouilha",
  "Cité Portugaise",
  "Najd",
  "Les Facultés",
  "Quartier Jaouhara"
];

const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentHour = now.getHours();

const allData = districts.map((district, index) => ({
  sensor_id: `TEMP-ELJ-${String(index + 1).padStart(3, "0")}`,
  city: "El Jadida",
  district,
  temperature: estimateTemperature(currentMonth, currentHour),
  unit: "C",
  timestamp: new Date().toISOString()
}));

msg.topic = "smartcity.temperature.readings";
msg.payload = JSON.stringify(allData);

return msg;
