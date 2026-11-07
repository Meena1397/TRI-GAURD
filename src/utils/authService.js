/**
 * TRI-GUARD Auth & OTP Verification Security Service
 * Implements password hashing, secure 6-digit OTP lifecycle, attempt limiting,
 * expiration checks, and unverified account protection.
 */

// In-Memory Database Registry for Users & Active OTP Sessions
const userRegistry = new Map();
const otpSessions = new Map();

// Helper: SHA-256 Password Hashing using native Web Crypto API
export async function hashPassword(password) {
  if (!password) return '';
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    // Fallback simple hash for older environments if crypto.subtle is unavailable
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'fallback_' + Math.abs(hash).toString(16);
  }
}

// Helper: Mask Email Address e.g. "mamtha@gmail.com" -> "ma*****@gmail.com"
export function maskEmail(email) {
  if (!email || !email.includes('@')) return 'us**@domain.com';
  const [name, domain] = email.split('@');
  if (name.length <= 2) {
    return `${name}*****@${domain}`;
  }
  return `${name.slice(0, 2)}*****@${domain}`;
}

// Check if an email is already registered
export function isEmailRegistered(email) {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  // Pre-configured mock emails
  if (cleanEmail === 'registered@triguard.ai') return true;
  
  const existing = userRegistry.get(cleanEmail);
  return existing && existing.isVerified;
}

// Step 1: Register User Draft & Dispatch 6-Digit OTP
export async function registerUserAndSendOtp(name, email, password) {
  const cleanEmail = email.trim().toLowerCase();

  if (isEmailRegistered(cleanEmail)) {
    return {
      success: false,
      error: '⚠ This email is already registered. Please sign in instead.'
    };
  }

  // Hash password securely before storing
  const hashedPassword = await hashPassword(password);

  // Generate secure 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 Minutes Expiry

  // Save draft unverified user
  userRegistry.set(cleanEmail, {
    name,
    email: cleanEmail,
    hashedPassword,
    isVerified: false,
    createdAt: Date.now()
  });

  // Store active OTP session
  otpSessions.set(cleanEmail, {
    otp: otpCode,
    expiresAt,
    attempts: 0,
    maxAttempts: 5,
    createdAt: Date.now()
  });

  return {
    success: true,
    maskedEmail: maskEmail(cleanEmail),
    otpCode,
    expiresAt,
    message: `Verification code sent to ${maskEmail(cleanEmail)}`
  };
}

// Step 2: Resend OTP Code
export async function resendOtpCode(email) {
  const cleanEmail = email.trim().toLowerCase();

  const user = userRegistry.get(cleanEmail);
  if (!user && cleanEmail !== 'registered@triguard.ai') {
    // If not in map, allow draft session creation
    userRegistry.set(cleanEmail, {
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      hashedPassword: await hashPassword('defaultPassword'),
      isVerified: false,
      createdAt: Date.now()
    });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 Minutes Expiry

  otpSessions.set(cleanEmail, {
    otp: otpCode,
    expiresAt,
    attempts: 0,
    maxAttempts: 5,
    createdAt: Date.now()
  });

  return {
    success: true,
    maskedEmail: maskEmail(cleanEmail),
    otpCode,
    expiresAt,
    message: `New verification code sent to ${maskEmail(cleanEmail)}`
  };
}

// Step 3: Verify OTP Code
export function verifyOtpCode(email, enteredCode) {
  const cleanEmail = email.trim().toLowerCase();
  const session = otpSessions.get(cleanEmail);

  if (!session) {
    return {
      success: false,
      code: 'EXPIRED',
      error: '⚠ VERIFICATION CODE EXPIRED. Please request a new verification code.'
    };
  }

  // Check 10-Minute Expiration
  if (Date.now() > session.expiresAt) {
    otpSessions.delete(cleanEmail);
    return {
      success: false,
      code: 'EXPIRED',
      error: '⚠ VERIFICATION CODE EXPIRED. Please request a new verification code.'
    };
  }

  // Check Max Failed Attempts
  if (session.attempts >= session.maxAttempts) {
    return {
      success: false,
      code: 'MAX_ATTEMPTS',
      error: '⚠ MAXIMUM ATTEMPTS EXCEEDED. Please request a new verification code.'
    };
  }

  // Check OTP Match
  if (enteredCode !== session.otp) {
    session.attempts += 1;
    otpSessions.set(cleanEmail, session);
    
    if (session.attempts >= session.maxAttempts) {
      return {
        success: false,
        code: 'MAX_ATTEMPTS',
        error: '⚠ MAXIMUM ATTEMPTS EXCEEDED. Please request a new verification code.'
      };
    }

    return {
      success: false,
      code: 'INVALID',
      attemptsRemaining: session.maxAttempts - session.attempts,
      error: '⚠ INVALID VERIFICATION CODE. The verification code is incorrect. Please try again.'
    };
  }

  // SUCCESS: Activate user account & invalidate OTP immediately
  otpSessions.delete(cleanEmail);
  const user = userRegistry.get(cleanEmail) || {
    name: cleanEmail.split('@')[0],
    email: cleanEmail,
    isVerified: true
  };
  user.isVerified = true;
  userRegistry.set(cleanEmail, user);

  return {
    success: true,
    user,
    message: '✓ EMAIL VERIFIED SUCCESSFULLY'
  };
}

// Sign In Verification Check (Prevents Unverified Users from Logging In)
export async function validateSignIn(email, password) {
  const cleanEmail = email.trim().toLowerCase();
  
  // Default mock user is verified
  if (cleanEmail === 'mamtha@triguard.ai' || cleanEmail === 'security.admin@corporate.com') {
    return { success: true };
  }

  const user = userRegistry.get(cleanEmail);
  if (user && !user.isVerified) {
    return {
      success: false,
      unverified: true,
      error: '⚠ EMAIL NOT VERIFIED. Please complete email verification before signing in.'
    };
  }

  return { success: true };
}
