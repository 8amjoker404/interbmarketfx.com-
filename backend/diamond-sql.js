"use strict";

function requireValue(name, value) {
  if (!value) {
    throw new Error(`${name} is required for DBMS Gateway access`);
  }
  return value;
}

function trimTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

async function readGatewayResponse(response) {
  const text = await response.text();
  let payload = {};

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (error) {
      throw new Error(`DBMS Gateway returned invalid JSON: ${error.message}`);
    }
  }

  if (!response.ok) {
    const message = payload.error || payload.message || `DBMS Gateway request failed with ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

function connectProject(siteId, options = {}) {
  const resolvedSiteId = requireValue("SITE_ID", siteId);
  const apiKey = requireValue("API_KEY", options.apiKey);
  const dbmsUrl = trimTrailingSlash(requireValue("DBMS_URL", options.dbmsUrl));
  const timeoutMs = Number(options.timeoutMs || 15000);

  async function request(path, init = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${dbmsUrl}${path}`, {
        ...init,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-site-id": resolvedSiteId,
          "x-api-key": apiKey,
          ...(init.headers || {}),
        },
      });

      return await readGatewayResponse(response);
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(`DBMS Gateway request timed out after ${timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  const db = {
    async query(sql, params = []) {
      const payload = await request("/gateway/query", {
        method: "POST",
        body: JSON.stringify({ sql, params }),
      });

      return payload.rows || [];
    },

    async execute(sql, params = []) {
      return db.query(sql, params);
    },

    async status() {
      return request("/gateway/status", { method: "GET" });
    },

    async getConnection() {
      return {
        query: db.query,
        execute: db.execute,
        beginTransaction: async () => {},
        commit: async () => {},
        rollback: async () => {},
        release: () => {},
      };
    },
  };

  return db;
}

module.exports = { connectProject };
