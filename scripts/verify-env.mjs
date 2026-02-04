#!/usr/bin/env node

const REQUIRED_VARS = [
  "NEXT_PUBLIC_API_BASE_URL",
];

console.log("====================================");
console.log("Nimbus Tasks — Frontend Env Verification");
console.log("Phase IV (Kubernetes + Ingress)");
console.log("====================================\n");

let hasError = false;

for (const key of REQUIRED_VARS) {
  const value = process.env[key];

  if (!value) {
    console.error(`❌ ${key} is NOT set`);
    hasError = true;
    continue;
  }

  if (value.includes("localhost")) {
    console.error(`❌ ${key} must NOT contain 'localhost' → ${value}`);
    hasError = true;
    continue;
  }

  console.log(`✅ ${key} = ${value}`);
}

if (hasError) {
  console.error("\n❌ Environment verification FAILED");
  process.exit(1);
}

console.log("\n✔ Environment verification PASSED");
