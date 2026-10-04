import { STATES } from "./src/lib/regions";

for (const state of STATES) {
  for (const district of state.districts) {
    if (!district.places || district.places.length === 0) {
      console.log(`Missing places in district: ${district.name}`);
    }
  }
}
console.log("Validation complete.");
