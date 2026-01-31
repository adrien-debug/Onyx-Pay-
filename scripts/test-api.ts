/**
 * Script de tests API - ONYX Launch & Ops
 * 
 * Usage: npx ts-node scripts/test-api.ts
 * 
 * Ce script teste toutes les API REST disponibles.
 * Nécessite que l'application soit lancée sur localhost:3000
 */

const BASE_URL = process.env.API_URL || "http://localhost:3000";

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  duration: number;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    results.push({
      name,
      passed: true,
      message: "OK",
      duration: Date.now() - start,
    });
    console.log(`✅ ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({
      name,
      passed: false,
      message,
      duration: Date.now() - start,
    });
    console.log(`❌ ${name}: ${message}`);
  }
}

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  
  if (!res.ok && res.status !== 401) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  
  return res;
}

// ============================================
// TESTS
// ============================================

async function runTests() {
  console.log("\n🧪 TESTS API - ONYX Launch & Ops\n");
  console.log(`📍 Base URL: ${BASE_URL}\n`);
  console.log("=".repeat(50) + "\n");

  // Health check
  await test("Health Check - App accessible", async () => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`Status ${res.status}`);
  });

  // ============================================
  // Projects API
  // ============================================
  console.log("\n📁 PROJECTS API\n");

  let projectId: string | null = null;

  await test("GET /api/projects - Liste des projets", async () => {
    const res = await fetchAPI("/api/projects");
    if (res.status === 401) return; // OK si non authentifié
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  await test("POST /api/projects - Créer un projet (auth required)", async () => {
    const res = await fetchAPI("/api/projects", {
      method: "POST",
      body: JSON.stringify({
        name: "Test Project",
        description: "Created by test script",
      }),
    });
    if (res.status === 401) return; // OK - auth required
    const data = await res.json();
    if (data.id) projectId = data.id;
  });

  // ============================================
  // Tasks API
  // ============================================
  console.log("\n📋 TASKS API\n");

  await test("GET /api/tasks - Liste des tâches", async () => {
    const res = await fetchAPI("/api/tasks");
    if (res.status === 401) return;
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  await test("GET /api/tasks?projectId=xxx - Filtrage par projet", async () => {
    const res = await fetchAPI("/api/tasks?projectId=test");
    if (res.status === 401) return;
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  // ============================================
  // Milestones API
  // ============================================
  console.log("\n🎯 MILESTONES API\n");

  await test("GET /api/milestones - Liste des jalons", async () => {
    const res = await fetchAPI("/api/milestones");
    if (res.status === 401) return;
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  // ============================================
  // Risks API
  // ============================================
  console.log("\n⚠️ RISKS API\n");

  await test("GET /api/risks - Liste des risques", async () => {
    const res = await fetchAPI("/api/risks");
    if (res.status === 401) return;
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  // ============================================
  // Workstreams API
  // ============================================
  console.log("\n🔧 WORKSTREAMS API\n");

  await test("GET /api/workstreams - Liste des workstreams", async () => {
    const res = await fetchAPI("/api/workstreams");
    if (res.status === 401) return;
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  // ============================================
  // Hardware API
  // ============================================
  console.log("\n📱 HARDWARE API\n");

  await test("GET /api/hardware - Liste du hardware", async () => {
    const res = await fetchAPI("/api/hardware");
    if (res.status === 401) return;
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  // ============================================
  // Legal API
  // ============================================
  console.log("\n📄 LEGAL API\n");

  await test("GET /api/legal - Liste des documents légaux", async () => {
    const res = await fetchAPI("/api/legal");
    if (res.status === 401) return;
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  // ============================================
  // Pricing API
  // ============================================
  console.log("\n💰 PRICING API\n");

  await test("GET /api/pricing - Liste des plans", async () => {
    const res = await fetchAPI("/api/pricing");
    if (res.status === 401) return;
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  // ============================================
  // Rewards API
  // ============================================
  console.log("\n🎁 REWARDS API\n");

  await test("GET /api/rewards - Liste des règles", async () => {
    const res = await fetchAPI("/api/rewards");
    if (res.status === 401) return;
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  // ============================================
  // Content API
  // ============================================
  console.log("\n📝 CONTENT API\n");

  await test("GET /api/content - Liste du contenu", async () => {
    const res = await fetchAPI("/api/content");
    if (res.status === 401) return;
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  // ============================================
  // Runbooks API
  // ============================================
  console.log("\n📚 RUNBOOKS API\n");

  await test("GET /api/runbooks - Liste des runbooks", async () => {
    const res = await fetchAPI("/api/runbooks");
    if (res.status === 401) return;
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  // ============================================
  // SUMMARY
  // ============================================
  console.log("\n" + "=".repeat(50));
  console.log("\n📊 RÉSUMÉ DES TESTS\n");

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  console.log(`Total: ${total} tests`);
  console.log(`✅ Passés: ${passed}`);
  console.log(`❌ Échoués: ${failed}`);
  console.log(`📈 Taux de réussite: ${((passed / total) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log("\n❌ Tests échoués:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  - ${r.name}: ${r.message}`);
      });
  }

  console.log("\n");
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((error) => {
  console.error("Erreur fatale:", error);
  process.exit(1);
});
