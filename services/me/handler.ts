import { query } from "@/schema/db";
import type { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";

/**
 * API Gateway handler that upserts a user in the Pantree database on first login
 * @param {APIGatewayProxyHandlerV2WithJWTAuthorizerEvent} event - API Gateway event object
 * @returns {APIGatewayProxyHandlerV2Response} - Response object with user_id and email
 */
export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (event) => {
  const claims = event.requestContext.authorizer.jwt.claims;

  const userId = claims.sub;
  if (!userId) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const email = typeof claims.email === "string" ? claims.email : null;

  await query(`INSERT INTO users (user_id, email)
                VALUES ($1, $2)
                ON CONFLICT (user_id)
                DO UPDATE SET
                  email = COALESCE(EXCLUDED.email, users.email);
`, [userId, email]);

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      email,
    }),
  };
};
