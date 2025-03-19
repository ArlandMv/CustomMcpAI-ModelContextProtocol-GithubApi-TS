// 1. Import dependencies
// 2. Tool Schema
// 3. Tool Listing information
// 4. Tool implementation

import { z } from "zod";

//2
export const GreetingToolSchema = z.object({
  name: z.string(),
});

//3
export const GreetingToolDefinition = {
  name: "greeting",
  description: "Return a greeting message",
  inputSchema: {
    type: "Object",
    properties: {
      name: { type: "string", description: "The name to greet" },
    },
    required: ["name"],
  },
  outputSchema: {
    type: "Object",
    properties: {
      message: { type: "string" },
    },
  },
};

//4
export const handleGreeting = (args: unknown) => {
  const validated = GreetingToolSchema.parse(args);
  const { name } = validated;

  return {
    content: [
      {
        type: "text",
        text: `Hello ${name} from MCP!`,
      },
    ],
  };
};
