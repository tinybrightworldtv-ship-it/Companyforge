import assert from "node:assert/strict";
import { MultiProviderRouter } from "../core/llm/router.js";
import type { LLMAdapter, LLMRequest } from "../core/llm/types.js";
class FakeAdapter implements LLMAdapter {
  constructor(public readonly provider:"openai"|"anthropic"|"google",private readonly response="ok",private readonly fail=false){}
  model="fake";
  async generate(_request:LLMRequest){if(this.fail)throw new Error("unavailable");return {provider:this.provider,model:this.model,text:this.response};}
}
const request:LLMRequest={messages:[{role:"user",content:"test"}]};
async function main(){
 const router=new MultiProviderRouter({adapters:[new FakeAdapter("openai","openai"),new FakeAdapter("anthropic","anthropic"),new FakeAdapter("google","google")]});
 assert.equal((await router.generate(request)).provider,"openai");
 const fallback=new MultiProviderRouter({adapters:[new FakeAdapter("openai","openai",true),new FakeAdapter("anthropic","anthropic"),new FakeAdapter("google","google")]});
 assert.equal((await fallback.generate(request)).provider,"anthropic");
 console.log("LLM tests passed.");
}
void main();
