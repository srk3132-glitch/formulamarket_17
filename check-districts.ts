import { STATES } from "./src/lib/regions";

for (const state of STATES) {
  console.log(`${state.name}: ${state.districts.length} districts`);
}
