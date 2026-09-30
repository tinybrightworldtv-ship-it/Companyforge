import { LLMError } from "./errors.js";
export async function postJson(url: string, headers: Record<string,string>, body: unknown): Promise<Record<string,any>> {
  const response = await fetch(url,{method:"POST",headers:{"content-type":"application/json",...headers},body:JSON.stringify(body)});
  const raw = await response.text();
  let data: Record<string,any>;
  try { data = raw ? JSON.parse(raw) : {}; } catch { throw new LLMError("Provider returned invalid JSON.",undefined,response.status,response.status>=500); }
  if (!response.ok) {
    const message = (data?.error?.message ?? data?.error?.status ?? raw) || "Provider request failed.";
    throw new LLMError(message,undefined,response.status,response.status>=500 || response.status===429);
  }
  return data;
}
