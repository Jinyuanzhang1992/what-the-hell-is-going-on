const { z } = require("zod");

const envSchema = z.object({
  Port: z.string().default("3010"),
});

const Env = envSchema.parse(process.env);

module.exports = { Env };
