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
  const response = await fetch(`/api/account/${playerId}`);

  if (!response.ok) {
    throw new Error(`Failed to load remote account: ${response.status}`);
  }

  const data = await response.json();
  return {
    profiles: data.profiles ?? [],
  };
}

export async function createRemoteProfile(playerId, profile) {
  const response = await fetch(`/api/account/${playerId}/profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    throw new Error(`Failed to create profile: ${response.status}`);
  }

  return response.json();
}

export async function saveRemoteProfileState(playerId, profile) {
  const response = await fetch(`/api/account/${playerId}/profiles/${profile.id}/state`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: profile.name,
      personaj: profile.personaj,
      steleGlobale: profile.steleGlobale,
      sunetActivat: profile.sunetActivat,
      lastSessionAt: profile.lastSessionAt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save remote profile state: ${response.status}`);
  }

  return response.json();
}

export async function saveRemoteGameResult(playerId, profileId, result) {
  const response = await fetch(`/api/account/${playerId}/profiles/${profileId}/results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  });

  if (!response.ok) {
    throw new Error(`Failed to save remote game result: ${response.status}`);
  }

  return response.json();
}
