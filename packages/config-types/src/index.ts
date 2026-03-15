export interface EnvRef {
  $env: string;
}

export interface UserTokenRef {
  $userToken: string;
}

/**
 * A config value that accepts a literal string or an environment variable
 * reference. The env var is resolved at config load time.
 */
export type ConfigValue = string | EnvRef;

/**
 * A config value that additionally accepts user token templates.
 * The token placeholder {{token}} is resolved at request time with
 * the authenticated user's token.
 */
export type ConfigValueWithToken = string | EnvRef | UserTokenRef;

export interface ToolFilterConfig {
  mode?: "allow" | "block";
  list?: string[];
}

export interface Options {
  authTokens?: string[];
  toolFilter?: ToolFilterConfig;
}

export interface DiscoveryConfig {
  timeout?: string;
  cacheTtl?: string;
  maxConnsPerUser?: number;
}

export interface SessionConfig {
  timeout?: string;
  cleanupInterval?: string;
  maxPerUser?: number;
}

export interface ServiceAuth {
  type: "bearer" | "basic";
  username?: string;
  password?: ConfigValue;
  tokens?: string[];
  userToken?: ConfigValue;
}

export interface UserAuthentication {
  type: "manual" | "oauth";
  displayName: string;

  clientId?: ConfigValue;
  clientSecret?: ConfigValue;
  authorizationUrl?: string;
  tokenUrl?: string;
  scopes?: string[];

  instructions?: string;
  helpUrl?: string;
  validation?: string;

  tokenFormat?: string;
}

export interface MCPServerConfig {
  type?: "direct" | "aggregate";
  transportType?: "stdio" | "sse" | "streamable-http" | "inline";

  command?: ConfigValue;
  args?: ConfigValueWithToken[];
  env?: Record<string, ConfigValueWithToken>;

  url?: ConfigValueWithToken;
  headers?: Record<string, ConfigValueWithToken>;
  timeout?: string;

  options?: Options;

  requiresUserToken?: boolean;
  userAuthentication?: UserAuthentication;

  serviceAuths?: ServiceAuth[];

  inline?: unknown;

  servers?: string[];
  discovery?: DiscoveryConfig;
  delimiter?: string;
}

export interface IDPConfig {
  provider: "google" | "azure" | "github" | "oidc";
  clientId: ConfigValue;
  clientSecret: ConfigValue;
  redirectUri: ConfigValue;
  discoveryUrl?: ConfigValue;
  authorizationUrl?: ConfigValue;
  tokenUrl?: ConfigValue;
  userInfoUrl?: ConfigValue;
  scopes?: string[];
  tenantId?: ConfigValue;
  allowedOrgs?: string[];
}

export interface OAuthAuthConfig {
  kind: "oauth";
  issuer: ConfigValue;
  gcpProject?: ConfigValue;
  idp: IDPConfig;
  allowedDomains: string[];
  allowedOrigins?: string[];
  tokenTtl?: string;
  refreshTokenTtl?: string;
  refreshTokenScopes?: string[];
  storage: string;
  firestoreDatabase?: string;
  firestoreCollection?: string;
  jwtSecret: ConfigValue;
  encryptionKey?: ConfigValue;
  dangerouslyAcceptIssuerAudience?: boolean;
}

export interface ProxyConfig {
  baseURL: ConfigValue;
  addr: ConfigValue;
  name?: string;
  auth?: OAuthAuthConfig;
  sessions?: SessionConfig;
}

export interface Config {
  version: string;
  proxy: ProxyConfig;
  mcpServers: Record<string, MCPServerConfig>;
}
