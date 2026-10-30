// Deterministic, attractive academic and festive emojis for students
const EMOJIS = ['🎓', '🌟', '⚡', '🚀', '🎯', '🍀', '✨', '🔥', '💡', '🎨', '📚', '🏆', '💫', '🦁', '🦅', '💎', '🌈', '☀️', '⭐', '🎈', '🪐', '🏅', '🔮', '🌿'];

export function getStudentEmoji(name = '', serialNo = 0) {
  let hash = serialNo || 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % EMOJIS.length;
  }
  return EMOJIS[Math.abs(hash) % EMOJIS.length];
}
