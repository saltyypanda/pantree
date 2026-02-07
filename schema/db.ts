import { Pool, QueryArrayResult } from "pg";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

// I LEARNED: Because this file is imported by lambda handlers, it will run in Node.js, which will instantiate 'pool' once like a singleton :)
let pool: Pool | null = null;

const sm = new SecretsManagerClient({});

async function getDbCredentials() {
  const secretArn = process.env.DB_SECRET_ARN;
  if (!secretArn) throw new Error("DB_SECRET_ARN not set");

  const res = await sm.send(
    new GetSecretValueCommand({ SecretId: secretArn })
  );

  if (!res.SecretString) {
    throw new Error("SecretString missing from DB secret");
  }

  const secret = JSON.parse(res.SecretString);

  return {
    user: secret.username,
    password: secret.password,
  };
}

export async function getPool(): Promise<Pool> {
  if (pool) return pool;

  const { user, password } = await getDbCredentials();

  pool = new Pool({
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT ?? "5432"),
    database: process.env.DB_NAME!,
    user,
    password,
    ssl: { rejectUnauthorized: false }, // RDS default
    max: 2,
  });

  return pool;
}

export async function query<T extends QueryArrayResult>(text: string, params: any[] = []) {
  const pool = await getPool();
  return pool.query<T>(text, params);
}
