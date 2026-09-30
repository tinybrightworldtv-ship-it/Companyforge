import {interpretVercelDeployment} from "../core/website/vercel";
test("Vercel READY is deployment-ready",()=>{expect(interpretVercelDeployment({url:"https://example.vercel.app",status:"READY"}).status).toBe("READY");expect(interpretVercelDeployment({status:"BUILDING"}).status).toBe("BUILDING");});
