import { database } from "./database";

export interface UserData {
  name?: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  dob?: Date;       // Optional Date of Birth
  phone?: string;   // Optional Phone Number
  gender?: string;  // Optional Gender
}


// Create a new user
export const createUser = async (data: UserData) => {
  try {
    const user = await database.user.create({
      data,
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

// Get user by email
export const getUserByEmail = async (email: string) => {
  try {
    const user = await database.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

// Get user by ID
export const getUserById = async (id: string) => {
  try {
    const user = await database.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};

// check email is verify or not

export const isEmailVerified = async (email: string): Promise<boolean> => {
  try {
    const user = await database.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    });

    return !!user?.emailVerified; // Returns true if emailVerified is not null
  } catch (error) {
    console.error("Error checking email verification:", error);
    return false;
  }
};

// Update user by ID

export const updateUser = async (id: string, data: Partial<UserData>) => {
  try {
    const user = await database.user.update({
      where: {
        id,
      },
      data,
    });

    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};

///change password

export const changePasswordByEmail = async (email: string, password: string) => {
  try {
    // Update the user's password
    const user = await database.user.update({
      where: { email },
      data: { password },
    });

    return user;
  } catch (error) {
    console.error("Error changing password:", error);
    return null;
  }
};

//// get user details without id


export const getUserWithoutIDByEmail = async (email: string) => {
  try {
    const user = await database.user.findUnique({
      where: { email },
      select: {
        name: true,
        email: true,
        phone: true,
        gender: true,
        dob: true,
        image: true,
      },
    });

    return user
      ? {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          gender: user.gender || "",
          dob: user.dob ? new Date(user.dob) : undefined,
          image: user.image || "",
        }
      : null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};
