import {companyForgeAgentCatalog} from "../core/runtime";
test("CompanyForge catalog contains the CEO and specialist roles",()=>{const ids=companyForgeAgentCatalog().map(x=>x.id);expect(ids).toContain("ceo");expect(ids).toContain("builder");expect(ids).toContain("qa");expect(ids.length).toBe(12)});
