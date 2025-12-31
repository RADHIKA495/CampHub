const cities = [];

const states = [
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Delhi",
  "Uttar Pradesh",
  "Gujarat",
  "Rajasthan",
  "West Bengal",
  "Telangana",
  "Kerala"
];

for (let i = 0; i < 1000; i++) {
  const city = {
    city: `City ${i}`,
    growth_from_2000_to_2013: `${(Math.random() * 50).toFixed(2)}%`,
    latitude: +(8 + Math.random() * 28).toFixed(6),     // India approx
    longitude: +(68 + Math.random() * 29).toFixed(6),  // India approx
    population: Math.floor(Math.random() * 9_000_000) + 100_000,
    rank: i,
    state: states[Math.floor(Math.random() * states.length)]
  };

  cities.push(city);
}

module.exports = cities;
