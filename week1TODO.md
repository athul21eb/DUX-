# 5-Day Development Schedule - Next.js Fullstack App (NextAuth.js, Prisma, Neon PSQL)

**Overall Strategy:**

1.  Focus on Core Authentication and User Management First.
2.  Iterative Development: Each day builds on the previous one.
3.  Prioritize Practical Implementation.
4.  Leverage Server Actions.

**Day 1: Authentication Foundation & Basic User Creation**

*   **Goal:** Implement basic authentication with NextAuth.js and allow new user registration with email/password and basic profile information.

*   **Tasks:**

    *   **(9:00 AM - 12:00 PM): NextAuth.js Setup & Google Provider Integration:**
        - [x ] Install necessary NextAuth.js packages (`next-auth`).
        - [x ] Configure NextAuth.js with email/password and Google provider (prioritize email/password first).
        - [ x] Implement basic sign-in and sign-out functionality.
        - [ x] **Google Sign-up: Option to choose new account or existing:**
            - [ x] In `signIn` callback, detect if user with Google email exists.
            - [ x] If exists, sign in.
            - [ x] If not, present choice: "Create new account" or "Sign in with existing".

    *   **(1:00 PM - 5:00 PM): New User Registration (Email/Password):**
        - [ x] Create `/register` page with form (email, password, name).
        - [ x] Implement Server Action to:
            - [ x] Validate input.
            - [ x] Hash password (bcrypt).
            - [x ] Create user in `User` table (Prisma).
            - [ x] Send email verification link.

    *   **(5:00 PM - 7:00 PM): Email Verification Link:**
        - [ x] Generate unique token (uuid or crypto).
        - [ x] Store token and user ID in `VerificationToken` table.
        - [ x] Create "verify email" page (`/verify-email/[token]`).
        - [ x] Implement Server Action to:
            - [x ] Retrieve token from URL.
            - [ x] Query `VerificationToken` table.
            - [x ] If valid, update `emailVerified` to `true` in `User` table.
            - [ x] Delete token from `VerificationToken` table.
            - [ x] Redirect to "verification successful" page.
        - [ x] **Email Sending (Simple):** Use `console.log` initially.

    *   **(7:00 PM - 10:00 PM): Prisma Schema and Basic Data Access Layer:**
        - [ x] Define `User` model in `schema.prisma`.
        - [ x] Create `lib/db.ts`:
            - [x ] `createUser(data: UserData)`
            - [ x] `getUserByEmail(email: string)`
            - [x ] `verifyEmail(token: string)`

**Day 2: User Profile, Authentication Enhancements, and Git Setup**

*   **Goal:** Allow users to view and edit their profile, implement "Forgot Password" functionality, and finalize Git setup.

*   **Tasks:**

    *   **(9:00 AM - 12:00 PM): User Profile (View & Edit):**
        - [ ] Create `/profile` page (protected).
        - [ ] Display user information.
        - [ ] Create "Edit Profile" form (name, etc.).
        - [ ] Implement Server Action for profile updates.

    *   **(1:00 PM - 4:00 PM): Forgot Password with OTP:**
        - [x ] Create "Forgot Password" page (`/forgot-password`).
        - [x ] Form for email address.
        - [ x] **Server Action:**
            - [ x] Validate email.
            - [ x] Check if email exists.
            - [ x] Generate OTP.
            - [ x] Store OTP and user ID in `OTP` table (with expiry).
            - [ x] Send OTP to email.
        - [x ] Create "Reset Password" page (`/reset-password/[email]`).
        - [ x] Form for OTP and new password.
        - [ x] **Server Action:**
            - [ x] Validate OTP and password.
            - [ x] Verify OTP.
            - [ x] Hash new password.
            - [ x] Update password in `User` table.
            - [x ] Delete OTP.
            - [x ] Redirect to sign-in.

    *   **(4:00 PM - 6:00 PM): Git Setup:**
        - [x ] `git init`
        - [x ] `.gitignore` (exclude `.env`, `node_modules`)
        - [x ] Commit regularly.
        - [x     ] Push to remote repository (GitHub, GitLab, Bitbucket).

    *   **(6:00 PM - 10:00 PM): Data Access Layer Enhancements:**
        - [ x] `updateUser(id: string, data: Partial<UserData>)`
        - [x ] `createOTP(email: string, otp: string)`
        - [ x] `verifyOTP(email: string, otp: string)`
        - [ x] `resetPassword(email: string, hashedPassword: string)`

**Day 3: Role-Based Access Control (RBAC) & Basic Mentor List**

*   **Goal:** Implement basic role-based access control for APIs and create a simple mentor listing.

*   **Tasks:**

    *   **(9:00 AM - 12:00 PM): Role-Based Access Control (RBAC):**
        - [ ] Add `role` field to `User` model (`USER`, `MENTOR`, `ADMIN`).  Default to `USER`.
        - [ ] Middleware/Server Action checks for API access based on role.
        - [ ] Example: `/api/admin/users` (ADMIN only, return 403 otherwise).
        - [ ] Use NextAuth.js session to check role.

    *   **(1:00 PM - 5:00 PM): Mentor List:**
        - [ ] Create `Mentor` model (link to `User` model).
        - [ ] Create `/mentors` page.
        - [ ] Implement Server Action to fetch mentors (filter by `role = MENTOR`).
        - [ ] Display mentor list (name, bio, expertise).       

    *   **(5:00 PM - 10:00 PM): Data Access Layer Enhancements:**
        - [ ] `getMentors()`
        - [ ] `createMentorProfile(data: MentorData)`
        - [ ] `getUsersByRole(role: string)`

**Day 4: Mentor Registration & Admin User Management**

*   **Goal:** Allow users to register as mentors (with document upload and OTP verification) and implement basic admin user management (verify/block).

*   **Tasks:**

    *   **(9:00 AM - 1:00 PM): Register as Mentor (with Documents & OTP):**
        - [ ] Create `/register-mentor` page (protected).
        - [ ] Form for:
            - [ ] Document upload (resume, certifications).  **Securely handle file uploads!** (Cloudinary/S3).
            - [ ] OTP entry.
        - [ ] **Server Action:**
            - [ ] Validate form.
            - [ ] Upload documents (Cloudinary/S3).
            - [ ] Generate OTP.
            - [ ] Store OTP in `OTP` table.
            - [ ] Send OTP.
        - [ ] OTP verification step: Update user `role` to `MENTOR` and create `Mentor` record.

    *   **(2:00 PM - 6:00 PM): Admin User Management (Verify/Block):**
        - [ ] Create `/admin/users` page (ADMIN only).
        - [ ] List users with roles and status.
        - [ ] Actions:
            - [ ] "Verify" user (set `emailVerified` to `true`). Send email.
            - [ ] "Block" user (add `blocked` field, set to `true`). Prevent sign-in. Send email.

    *   **(6:00 PM - 10:00 PM): Data Access Layer Enhancements:**
        - [ ] `updateUserRole(id: string, role: string)`
        - [ ] `blockUser(id: string)`
        - [ ] `unblockUser(id: string)`

**Day 5: Skill Management & Polish/Refactor**

*   **Goal:** Implement skill management and refactor code for better readability and maintainability.

*   **Tasks:**

    *   **(9:00 AM - 1:00 PM): Skill Management:**
        - [ ] Create `Skill` model.
        - [ ] Many-to-many relationship between `User` and `Skill`.
        - [ ] Allow users to select skills on profile page.
        - [ ] **Server Actions:**
            - [ ] Fetch skills.
            - [ ] Update user skills.
        - [ ] Display skills on profile.

    *   **(2:00 PM - 6:00 PM): Code Refactoring & Polish:**
        - [ ] Review code.
        - [ ] Extract reusable components.
        - [ ] Improve error handling.
        - [ ] Add logging.
        - [ ] Write unit tests (if time).
        - [ ] Address bugs.

    *   **(6:00 PM - 10:00 PM): Documentation & Deployment:**
        - [ ] Write basic documentation.
        - [ ] Deploy to hosting (Vercel, Netlify).

**Important Considerations:**

*   **Security:**  Prioritize security! Strong passwords, input validation, XSS/CSRF protection.
    - [ ]  Prioritize security! Strong passwords, input validation, XSS/CSRF protection.
*   **Error Handling:** Robust error handling, meaningful error messages.
    - [ ] Robust error handling, meaningful error messages.
*   **Testing:** Unit and integration tests.
     - [ ]  Unit and integration tests.
*   **UI/UX:** User-friendly interface.
      - [ ] User-friendly interface.
*   **Email Service:** Integrate a real email service (SendGrid, Mailgun, etc.).
       - [ ] Integrate a real email service (SendGrid, Mailgun, etc.).
*   **File Uploads:** Securely handle file uploads!
        - [ ] Securely handle file uploads!
*   **Data Validation:** Validate all user input.
        - [ ] Validate all user input.
*   **Rate Limiting:** Protect API endpoints.
         - [ ] Protect API endpoints.
*   **Monitoring:** Track performance and identify issues.
           - [ ] Track performance and identify issues.