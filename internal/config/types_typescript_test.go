package config

import (
	"os"
	"regexp"
	"testing"
)

func TestTypeScriptTypesInSync(t *testing.T) {
	tsFile, err := os.ReadFile("../../packages/config-types/src/index.ts")
	if err != nil {
		t.Fatalf("reading TypeScript types file: %v", err)
	}
	ts := string(tsFile)

	// propertyRe matches TypeScript interface properties like "  fieldName: ..." or "  fieldName?: ..."
	propertyRe := regexp.MustCompile(`(?m)^\s+(\w+)\??\s*:`)
	allProps := map[string]bool{}
	for _, match := range propertyRe.FindAllStringSubmatch(ts, -1) {
		allProps[match[1]] = true
	}

	// These map interface names to the JSON field names that MUST appear in
	// the TypeScript file. The field names come from the json tags in Go
	// structs and the rawConfig inner structs in custom UnmarshalJSON methods.
	//
	// Computed fields (json:"-") are intentionally excluded.
	// The "version" field exists only in load.go validation, not in a Go struct.
	expectedFields := map[string][]string{
		"Config": {"version", "proxy", "mcpServers"},
		"ProxyConfig": {
			"baseURL", "addr", "name", "auth", "sessions",
		},
		"OAuthAuthConfig": {
			"kind", "issuer", "gcpProject", "idp",
			"allowedDomains", "allowedOrigins",
			"tokenTtl", "refreshTokenTtl", "refreshTokenScopes",
			"storage", "firestoreDatabase", "firestoreCollection",
			"jwtSecret", "encryptionKey",
			"dangerouslyAcceptIssuerAudience",
		},
		"IDPConfig": {
			"provider", "clientId", "clientSecret", "redirectUri",
			"discoveryUrl", "authorizationUrl", "tokenUrl", "userInfoUrl",
			"scopes", "tenantId", "allowedOrgs",
		},
		"MCPServerConfig": {
			"type", "transportType",
			"command", "args", "env",
			"url", "headers", "timeout",
			"options",
			"requiresUserToken", "userAuthentication",
			"serviceAuths",
			"inline",
			"servers", "discovery", "delimiter",
		},
		"SessionConfig": {
			"timeout", "cleanupInterval", "maxPerUser",
		},
		"DiscoveryConfig": {
			"timeout", "cacheTtl", "maxConnsPerUser",
		},
		"ServiceAuth": {
			"type", "username", "password", "tokens", "userToken",
		},
		"UserAuthentication": {
			"type", "displayName",
			"clientId", "clientSecret", "authorizationUrl", "tokenUrl", "scopes",
			"instructions", "helpUrl", "validation",
			"tokenFormat",
		},
		"Options": {
			"authTokens", "toolFilter",
		},
		"ToolFilterConfig": {
			"mode", "list",
		},
	}

	for typeName, fields := range expectedFields {
		for _, field := range fields {
			if !allProps[field] {
				t.Errorf("TypeScript types missing field %q (expected in %s)", field, typeName)
			}
		}
	}
}
