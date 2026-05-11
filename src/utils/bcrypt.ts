import bcrypt from 'bcrypt';
const saltRound = 10;
export async function hash_password(password): Promise<string | null> {
  return await bcrypt.hash(password, saltRound);
}

export async function compare_password(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
