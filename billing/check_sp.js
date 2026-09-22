require("dotenv").config({ path: "/home/CasinoPride_2.0/CasinoPride_2.0_Prod/CasinoPride2BE/billing/.env" });
const db = require("./config/database");

async function run() {
  // APU BORAH TravelAgentId = 128 (confirmed earlier)

  // Check ALL tables in the DB
  const allTables = await db.knex.raw("SHOW TABLES");
  const allTableNames = allTables[0].map(t => Object.values(t)[0]);
  console.log("ALL tables in DB:", allTableNames.join(", "));

  // Try to find agentSettlements-related table
  const settleRelated = allTableNames.filter(t => /settl/i.test(t) || /agent/i.test(t));
  console.log("\nSettlement/agent related tables:", settleRelated.join(", "));

  // Check if there's an 'agentSettlements' table (case sensitive check)
  const exactMatch = allTableNames.find(t => t.toLowerCase() === 'agentsettlements');
  console.log("agentSettlements exact match:", exactMatch || "NOT FOUND");

  // Check what the CoreBE agentSettlement uses - search for it in the booking DB
  for (const tbl of settleRelated) {
    try {
      const cols = await db.knex.raw(`SHOW COLUMNS FROM \`${tbl}\``);
      console.log(`\nTable '${tbl}': ${cols[0].map(c => c.Field).join(", ")}`);
      const apuRows = await db.knex.raw(`SELECT * FROM \`${tbl}\` WHERE UserId = 128 ORDER BY Id DESC LIMIT 5`);
      console.log(`  APU BORAH rows:`, JSON.stringify(apuRows[0]));
    } catch(e) {
      console.log(`  Error reading ${tbl}: ${e.message}`);
    }
  }

  // Now run the SP directly to see what it returns for APU BORAH with July month
  console.log("\n\n=== Running SP directly for APU BORAH July 2026 ===");
  const spResult = await db.knex.raw(`
    CALL generate_reports_for_agent_settlement(128, 5, '2026-07-28 00:00:00', '2026-06-30 00:00:00', '2026-07')
  `);
  const spRows = spResult[0][0];
  console.log(`SP returned ${spRows?.length} rows`);
  if (spRows?.length > 0) {
    spRows.forEach(r => {
      console.log(`  Bill#${r.BillNumber} | CreatedOn:${r.CreatedOn} | BillDate:${r.BillDate} | Guest:${r.GuestName}`);
    });
  }

  process.exit(0);
}
run().catch(e => { console.error("Error:", e.message); process.exit(1); });
