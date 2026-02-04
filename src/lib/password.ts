/**
 * Generates a temporary password (12 chars: 8 uppercase + 4 numbers)
 * Format: XXXXXXXX1234 (easy to read and type)
 */
export function generateTempPassword(): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let password = "";

  // Generate 8 random uppercase letters
  for (let i = 0; i < 8; i++) {
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  }

  // Generate 4 random numbers
  for (let i = 0; i < 4; i++) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return password;
}
