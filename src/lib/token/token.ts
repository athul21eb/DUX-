import "server-only";
import { v4 as uuidv4 } from "uuid";

import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationTokenByEmail,
} from "../db/verification_token";

export const generateVerificationToken = async (email: string) => {
  // Generate a random token
  const token = uuidv4();
  const expires = new Date().getTime() + 1000 * 60 * 60 * 1; // 1 hours

  // Check if a token already exists for the user
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await deleteVerificationToken(existingToken.id);

  }

  // Create a new verification token

  const verificationToken = await createVerificationToken(
    email,
    token,
    new Date(expires)
  );


  return verificationToken;
};
