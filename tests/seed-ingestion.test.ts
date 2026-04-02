import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

describe("seed ingestion support", () => {
  it("generates deterministic SQL seed output", () => {
    execFileSync("node", ["scripts/generate-seed-sql.mjs"], {
      cwd: process.cwd(),
      stdio: "pipe"
    });

    const seedSql = fs.readFileSync(path.join(process.cwd(), "supabase/seed.sql"), "utf8");

    expect(seedSql).toContain("insert into public.users");
    expect(seedSql).toContain("insert into public.cases");
    expect(seedSql).toContain("B001");
    expect(seedSql).toContain("trainee.one@example.com");
  });
});
