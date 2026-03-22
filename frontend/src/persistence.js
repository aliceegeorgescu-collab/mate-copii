import { apiRequest } from "./api";

export const DEFAULT_PLAYER_ID = process.env.REACT_APP_PLAYER_ID || "default-player";

export function createId(prefix = "id") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export function getPlayerId() {
  return DEFAULT_PLAYER_ID;
}

export async function loadRemoteAccount(playerId) {
  return apiRequest(`/api/account/${playerId}`);
}

export async function createRemoteProfile(playerId, profile) {
  return apiRequest(`/api/account/${playerId}/profiles`, {
    method: "POST",
    body: profile,
  });
}

export async function saveRemoteProfileState(playerId, profile) {
  return apiRequest(`/api/account/${playerId}/profiles/${profile.id}/state`, {
    method: "PUT",
    body: {
      name: profile.name,
      personaj: profile.personaj,
      steleGlobale: profile.steleGlobale,
      sunetActivat: profile.sunetActivat,
      gamePreferences: profile.gamePreferences,
      lastSessionAt: profile.lastSessionAt,
    },
  });
}

export async function saveRemoteGameResult(playerId, profileId, result) {
  return apiRequest(`/api/account/${playerId}/profiles/${profileId}/results`, {
    method: "POST",
    body: result,
  });
}