import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧪 Testing CRUD operations on PostgreSQL...\n");

  // Test 1: Create Project
  console.log("1️⃣ Testing Project creation...");
  const project = await prisma.project.create({
    data: {
      name: "Test Project",
      description: "Test project for CRUD validation",
      status: "TODO",
    },
  });
  console.log(`✅ Project created: ${project.id}`);

  // Test 2: Create Workstream
  console.log("\n2️⃣ Testing Workstream creation...");
  const workstream = await prisma.workstream.create({
    data: {
      name: "Test Workstream",
      description: "Test workstream",
      projectId: project.id,
    },
  });
  console.log(`✅ Workstream created: ${workstream.id}`);

  // Test 3: Create Task
  console.log("\n3️⃣ Testing Task creation...");
  const user = await prisma.user.findFirst();
  const task = await prisma.task.create({
    data: {
      title: "Test Task",
      description: "Test task for CRUD validation",
      status: "TODO",
      priority: "HIGH",
      projectId: project.id,
      workstreamId: workstream.id,
      assigneeId: user?.id,
    },
  });
  console.log(`✅ Task created: ${task.id}`);

  // Test 4: Create Milestone
  console.log("\n4️⃣ Testing Milestone creation...");
  const milestone = await prisma.milestone.create({
    data: {
      title: "Test Milestone",
      description: "Test milestone",
      targetDate: new Date("2025-12-31"),
      projectId: project.id,
      workstreamId: workstream.id,
    },
  });
  console.log(`✅ Milestone created: ${milestone.id}`);

  // Test 5: Create Risk
  console.log("\n5️⃣ Testing Risk creation...");
  const risk = await prisma.risk.create({
    data: {
      title: "Test Risk",
      description: "Test risk",
      probability: 3,
      impact: 4,
      mitigation: "Test mitigation plan",
      status: "TODO",
      projectId: project.id,
      workstreamId: workstream.id,
    },
  });
  console.log(`✅ Risk created: ${risk.id}`);

  // Test 6: Create Hardware Candidate
  console.log("\n6️⃣ Testing Hardware Candidate creation...");
  const hardware = await prisma.hardwareCandidate.create({
    data: {
      name: "Test Device",
      brand: "Test Brand",
      model: "TEST-001",
      price: 299,
      currency: "USD",
      status: "TODO",
    },
  });
  console.log(`✅ Hardware created: ${hardware.id}`);

  // Test 7: Create Legal Doc
  console.log("\n7️⃣ Testing Legal Doc creation...");
  const legal = await prisma.legalDoc.create({
    data: {
      title: "Test Legal Doc",
      type: "MSA",
      status: "DRAFT",
      version: "1.0",
    },
  });
  console.log(`✅ Legal Doc created: ${legal.id}`);

  // Test 8: Create Pricing Plan
  console.log("\n8️⃣ Testing Pricing Plan creation...");
  const pricing = await prisma.pricingPlan.create({
    data: {
      name: "TEST PLAN",
      description: "Test pricing plan",
      setupFee: 100,
      monthlyFee: 50,
      transactionFee: 1.5,
      feeType: "PERCENTAGE",
      currency: "USD",
      isActive: true,
    },
  });
  console.log(`✅ Pricing Plan created: ${pricing.id}`);

  // Test 9: Create Reward Rule
  console.log("\n9️⃣ Testing Reward Rule creation...");
  const reward = await prisma.rewardRule.create({
    data: {
      name: "Test Reward",
      type: "PER_TX",
      description: "Test reward rule",
      formula: "$1 per transaction",
      isActive: true,
    },
  });
  console.log(`✅ Reward Rule created: ${reward.id}`);

  // Test 10: Create Runbook
  console.log("\n🔟 Testing Runbook creation...");
  const runbook = await prisma.runbook.create({
    data: {
      title: "Test Runbook",
      type: "test",
      content: "Test runbook content",
      version: "1.0",
      isActive: true,
    },
  });
  console.log(`✅ Runbook created: ${runbook.id}`);

  // Test 11: Update operations
  console.log("\n🔄 Testing UPDATE operations...");
  await prisma.task.update({
    where: { id: task.id },
    data: { status: "IN_PROGRESS" },
  });
  await prisma.risk.update({
    where: { id: risk.id },
    data: { probability: 5 },
  });
  console.log("✅ Updates successful");

  // Test 12: Read operations
  console.log("\n📖 Testing READ operations...");
  const allProjects = await prisma.project.findMany();
  const allTasks = await prisma.task.findMany();
  const allRisks = await prisma.risk.findMany();
  console.log(`✅ Found ${allProjects.length} projects, ${allTasks.length} tasks, ${allRisks.length} risks`);

  // Test 13: Delete operations
  console.log("\n🗑️  Testing DELETE operations...");
  await prisma.task.delete({ where: { id: task.id } });
  await prisma.risk.delete({ where: { id: risk.id } });
  await prisma.milestone.delete({ where: { id: milestone.id } });
  await prisma.hardwareCandidate.delete({ where: { id: hardware.id } });
  await prisma.legalDoc.delete({ where: { id: legal.id } });
  await prisma.pricingPlan.delete({ where: { id: pricing.id } });
  await prisma.rewardRule.delete({ where: { id: reward.id } });
  await prisma.runbook.delete({ where: { id: runbook.id } });
  await prisma.workstream.delete({ where: { id: workstream.id } });
  await prisma.project.delete({ where: { id: project.id } });
  console.log("✅ Deletes successful");

  // Final count
  console.log("\n📊 Final database state:");
  const counts = {
    users: await prisma.user.count(),
    projects: await prisma.project.count(),
    tasks: await prisma.task.count(),
    milestones: await prisma.milestone.count(),
    risks: await prisma.risk.count(),
    hardware: await prisma.hardwareCandidate.count(),
    legal: await prisma.legalDoc.count(),
    pricing: await prisma.pricingPlan.count(),
    rewards: await prisma.rewardRule.count(),
    runbooks: await prisma.runbook.count(),
  };
  
  console.log(`   Users: ${counts.users}`);
  console.log(`   Projects: ${counts.projects}`);
  console.log(`   Tasks: ${counts.tasks}`);
  console.log(`   Milestones: ${counts.milestones}`);
  console.log(`   Risks: ${counts.risks}`);
  console.log(`   Hardware: ${counts.hardware}`);
  console.log(`   Legal Docs: ${counts.legal}`);
  console.log(`   Pricing Plans: ${counts.pricing}`);
  console.log(`   Reward Rules: ${counts.rewards}`);
  console.log(`   Runbooks: ${counts.runbooks}`);

  console.log("\n✅ All CRUD tests passed successfully!");
  console.log("🎉 PostgreSQL database is fully functional!");
}

main()
  .catch((e) => {
    console.error("❌ Test failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
