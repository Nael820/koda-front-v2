import { getToken } from "./api.js";

// Vérifie que l'utilisateur est connecté sur toutes les pages protégées
if (!getToken()) {
  window.location.href = "login.html";
}