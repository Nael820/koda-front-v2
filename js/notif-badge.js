import { apiRequest } from "./api.js";

function getDismissedReminders() {
  try {
    return JSON.parse(sessionStorage.getItem('dismissedReminders') || '[]');
  } catch { return []; }
}

function parseTimeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

export async function loadNotifBadge() {
  const badge = document.getElementById("notif-count");
  if (!badge) return;

  let total = 0;

  // Demandes d'amis en attente
  try {
    const data = await apiRequest("/friends/pending/count");
    total += data.count ?? 0;
  } catch (_) {}

  // Rappels de mission du jour non vus, dont l'heure est déjà passée
  try {
    const reminders = await apiRequest("/tasks/reminders");
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const dismissed = getDismissedReminders();

    const visibleReminders = reminders.filter(r => {
      if (dismissed.includes(r.taskId)) return false;
      const reminderMinutes = parseTimeToMinutes(r.reminderTime);
      return currentMinutes >= reminderMinutes;
    });

    total += visibleReminders.length;
  } catch (_) {}

  if (total > 0) {
    badge.textContent = total > 9 ? "9+" : total;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}