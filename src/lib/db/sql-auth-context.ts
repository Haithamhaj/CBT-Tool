export type SqlAuthContext = {
  userId: string;
  role: "trainee" | "facilitator";
};

export function buildSqlAuthContext(context: SqlAuthContext) {
  return {
    requestUserId: context.userId,
    requestRole: context.role
  };
}
