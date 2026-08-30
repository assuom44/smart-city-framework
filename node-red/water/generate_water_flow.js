function zoneFactor(districtId) {
  const factors = {
    sidi_bouzid: 2.0,
    bennani: 1.5,
    el_manar: 2.5,
    sidi_moussa: 1.0,
    essaada: 1.7,
    mouilha: 1.6,
    cite_portugaise: 1.9,
    najd: 1.8,
    les_facultes: 1.4,
    district_jaouhara: 1.6
  };

  return factors[districtId] || 1.0;
}

function waterFlowEstimated(hour, districtId) {
  let baseFlow = 3;

  // Higher consumption in the morning and evening
  if ((hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 22)) {
    baseFlow += 7;
  }

  const factor = zoneFactor(districtId);
  const variation = Math.random() * 1.5 - 0.75;

  const flowRate = baseFlow + factor + variation;

  let status = "normal";

  // Possible leak: flow is too high during the night
  if (hour >= 1 && hour <= 5 && flowRate > 5) {
    status = "possible_leak";
  }

  // High consumption
  if (flowRate > 15) {
    status = "high_consumption";
  }

  const pulses = Math.round(flowRate * 7.5);
  const volume = flowRate / 60;

  return {
    pulses: pulses,
    flow_rate_l_min: Number(flowRate.toFixed(2)),
    volume_l: Number(volume.toFixed(3)),
    flow_unit: "L/min",
    volume_unit: "L",
    status: status
  };
}

// Verify that the previous node created msg.waterSensors
if (!Array.isArray(msg.waterSensors)) {
  throw new Error("msg.waterSensors is missing. Run the water sensor configuration node first.");
}

const now = new Date();
const hour = now.getHours();

// Add flow data to each sensor
msg.waterSensors = msg.waterSensors.map(sensor => {
  return {
    ...sensor,
    type: "hall_flow_meter",
    water_flow: waterFlowEstimated(hour, sensor.districtId)
  };
});

return msg;