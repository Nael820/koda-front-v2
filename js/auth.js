import { apiRequest, getToken, removeToken, setToken } from "./api.js";

function saveAuthToken(data) {
  const token = data.access_token || data.token || data.accessToken;

  if (!token) {
    throw new Error("Le back n'a pas retourne de token.");
  }

  setToken(token);
  return token;
}

export async function register(user) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export async function login(username, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  saveAuthToken(data);
  return data;
}

export async function getProfile() {
  return apiRequest("/users/me");
}

export async function logout() {
  try {
    if (getToken()) {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    }
  } finally {
    removeToken();
  }
}

export async function deleteAccount() {
  const result = await apiRequest("/auth/delete", {
    method: "DELETE",
  });

  removeToken();
  return result;
}

export function isLoggedIn() {
  return Boolean(getToken());
}
