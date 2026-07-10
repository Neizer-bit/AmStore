import { createCartFlowSuite } from "@cimplify/sdk/testing/suite";
import { brand } from "../lib/brand";
import bedrockSeed from "../cimplify.seed";

// Run the cart-flow suite against the real Bedrock Workwear catalogue (the same
// seed the dev mock loads) so the test's businessId matches runtime.
createCartFlowSuite({
  seed: { kind: "fn", seed: bedrockSeed },
  businessId: brand.mock.businessId,
});
