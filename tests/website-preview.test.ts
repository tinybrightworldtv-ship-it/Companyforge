import assert from "node:assert/strict";
import {queuePreviewBuild} from "../core/website/preview";
const b=queuePreviewBuild("build-1");
assert.equal(b.status,"queued");
assert.equal(b.buildCommand,"npm run build");
assert.equal(b.previewUrl,undefined);
console.log("Website preview tests passed.");
