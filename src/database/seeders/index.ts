import "dotenv/config";

async function runSeeders() {
  console.log("Running database seeders...");

  try {
    // Import and run all seeders
    const { seedSuperAdmin } =
      await import("@/database/seeders/super-admin.js");

    await seedSuperAdmin();

    console.log("All seeders completed successfully!");
  } catch (error) {
    console.error("Error running seeders:", error);
    process.exit(1);
  }
}

// Run all seeders
runSeeders();
