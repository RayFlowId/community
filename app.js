import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL =
  "https://amwqoiyejlmyqoubqzsx.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_jenitOnfR6n6BpFX3gXI7A_T3FdyD3B";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


/* =====================================================
   ELEMENTS
===================================================== */

const authSection =
  document.getElementById("authSection");

const dashboardSection =
  document.getElementById("dashboardSection");

const authFooter =
  document.getElementById("authFooter");

const loginForm =
  document.getElementById("loginForm");

const registerForm =
  document.getElementById("registerForm");

const authTitle =
  document.getElementById("authTitle");

const authSubtitle =
  document.getElementById("authSubtitle");

const headingIcon =
  document.getElementById("headingIcon");

const message =
  document.getElementById("message");

const loginButton =
  document.getElementById("loginButton");

const registerButton =
  document.getElementById("registerButton");

const logoutButton =
  document.getElementById("logoutButton");

const showRegister =
  document.getElementById("showRegister");

const showLogin =
  document.getElementById("showLogin");

const forgotPassword =
  document.getElementById("forgotPassword");

const userEmail =
  document.getElementById("userEmail");

const avatarLetter =
  document.getElementById("avatarLetter");

const dashboardGreeting =
  document.getElementById("dashboardGreeting");

const timeGreeting =
  document.getElementById("timeGreeting");

const registerPassword =
  document.getElementById("registerPassword");

const strengthText =
  document.getElementById("strengthText");

const passwordStrength =
  document.querySelector(".password-strength");


/* =====================================================
   GREETING
===================================================== */

function getGreeting() {

  const hour =
    new Date().getHours();

  if (hour >= 5 && hour < 11) {
    return "Selamat pagi";
  }

  if (hour >= 11 && hour < 15) {
    return "Selamat siang";
  }

  if (hour >= 15 && hour < 18) {
    return "Selamat sore";
  }

  return "Selamat malam";
}


function updateGreeting() {

  const greeting =
    getGreeting();

  if (timeGreeting) {
    timeGreeting.textContent =
      `${greeting} 👋`;
  }

  if (dashboardGreeting) {
    dashboardGreeting.textContent =
      `${greeting}.`;
  }
}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
  text,
  type = "error"
) {

  message.textContent =
    text;

  message.className =
    `message ${type}`;

}


function hideMessage() {

  message.textContent =
    "";

  message.className =
    "message hidden";

}


/* =====================================================
   BUTTON LOADING
===================================================== */

function setLoading(
  button,
  loading
) {

  if (!button) return;

  button.disabled =
    loading;

  button.classList.toggle(
    "loading",
    loading
  );

}


/* =====================================================
   SWITCH AUTH MODE
===================================================== */

function showLoginForm() {

  registerForm.classList.add(
    "hidden"
  );

  loginForm.classList.remove(
    "hidden"
  );

  authTitle.textContent =
    "Selamat datang kembali";

  authSubtitle.textContent =
    "Masuk untuk melanjutkan ke Community Rayy.";

  headingIcon.textContent =
    "👋";

  hideMessage();

}


function showRegisterForm() {

  loginForm.classList.add(
    "hidden"
  );

  registerForm.classList.remove(
    "hidden"
  );

  authTitle.textContent =
    "Buat akun baru";

  authSubtitle.textContent =
    "Gabung dan mulai perjalananmu bersama kami.";

  headingIcon.textContent =
    "✨";

  hideMessage();

}


/* =====================================================
   SHOW DASHBOARD
===================================================== */

function showDashboard(user) {

  document.body.classList.add("dashboard-active");
  document.body.classList.remove("auth-active");

  authSection.classList.add(
    "hidden"
  );

  dashboardSection.classList.remove(
    "hidden"
  );

  if (authFooter) {
    authFooter.classList.add(
      "hidden"
    );
  }

  const email =
    user?.email || "User";

  userEmail.textContent =
    email;

  avatarLetter.textContent =
    email
      .charAt(0)
      .toUpperCase();

  updateGreeting();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =====================================================
   SHOW AUTH
===================================================== */

function showAuth() {

  document.body.classList.add("auth-active");
  document.body.classList.remove("dashboard-active");

  dashboardSection.classList.add(
    "hidden"
  );

  authSection.classList.remove(
    "hidden"
  );

  if (authFooter) {
    authFooter.classList.remove(
      "hidden"
    );
  }

}


/* =====================================================
   LOGIN
===================================================== */

loginForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    hideMessage();

    const email =
      document
        .getElementById("loginEmail")
        .value
        .trim();

    const password =
      document
        .getElementById("loginPassword")
        .value;


    if (!email || !password) {

      showMessage(
        "Email dan password wajib diisi.",
        "error"
      );

      return;
    }


    setLoading(
      loginButton,
      true
    );


    try {

      const {
        data,
        error
      } =
        await supabase.auth.signInWithPassword({
          email,
          password
        });


      if (error) {
        throw error;
      }


      if (!data.user) {
        throw new Error(
          "Akun tidak ditemukan."
        );
      }


      loginForm.reset();

      showDashboard(
        data.user
      );


    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      showMessage(
        getReadableError(error),
        "error"
      );

    } finally {

      setLoading(
        loginButton,
        false
      );

    }

  }
);


/* =====================================================
   REGISTER
===================================================== */

registerForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    hideMessage();

    const email =
      document
        .getElementById("registerEmail")
        .value
        .trim();

    const password =
      document
        .getElementById("registerPassword")
        .value;

    const confirmPassword =
      document
        .getElementById("registerPasswordConfirm")
        .value;


    if (!email) {

      showMessage(
        "Masukkan email kamu.",
        "error"
      );

      return;
    }


    if (password.length < 6) {

      showMessage(
        "Password minimal 6 karakter.",
        "error"
      );

      return;
    }


    if (password !== confirmPassword) {

      showMessage(
        "Password yang kamu masukkan belum sama.",
        "error"
      );

      return;
    }


    setLoading(
      registerButton,
      true
    );


    try {

      const {
        data,
        error
      } =
        await supabase.auth.signUp({

          email,

          password,

          options: {

            emailRedirectTo:
              window.location.origin

          }

        });


      if (error) {
        throw error;
      }


      /*
       * Confirm Email kamu sebelumnya
       * diaktifkan di Supabase.
       */

      if (!data.session) {

        registerForm.reset();

        updatePasswordStrength();

        showMessage(
          "Akun berhasil dibuat! 📩 Cek email kamu untuk memverifikasi akun sebelum login.",
          "success"
        );

        return;
      }


      showMessage(
        "Akun berhasil dibuat! Selamat datang 🎉",
        "success"
      );


      setTimeout(
        () => {

          showDashboard(
            data.user
          );

        },
        600
      );


    } catch (error) {

      console.error(
        "Register error:",
        error
      );

      showMessage(
        getReadableError(error),
        "error"
      );

    } finally {

      setLoading(
        registerButton,
        false
      );

    }

  }
);


/* =====================================================
   LOGOUT
===================================================== */

logoutButton.addEventListener(
  "click",
  async () => {

    logoutButton.disabled =
      true;

    const originalHTML =
      logoutButton.innerHTML;

    logoutButton.innerHTML =
      "<span>Keluar...</span>";


    try {

      const {
        error
      } =
        await supabase.auth.signOut();


      if (error) {
        throw error;
      }


      showAuth();

      showLoginForm();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });


    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

      alert(
        getReadableError(error)
      );


    } finally {

      logoutButton.disabled =
        false;

      logoutButton.innerHTML =
        originalHTML;

    }

  }
);


/* =====================================================
   SWITCH BUTTONS
===================================================== */

showRegister.addEventListener(
  "click",
  () => {

    showRegisterForm();

  }
);


showLogin.addEventListener(
  "click",
  () => {

    showLoginForm();

  }
);


/* =====================================================
   FORGOT PASSWORD
===================================================== */

forgotPassword.addEventListener(
  "click",
  async () => {

    const email =
      document
        .getElementById("loginEmail")
        .value
        .trim();


    if (!email) {

      showMessage(
        "Masukkan email kamu terlebih dahulu.",
        "error"
      );

      document
        .getElementById("loginEmail")
        .focus();

      return;
    }


    try {

      const {
        error
      } =
        await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo:
              window.location.origin
          }
        );


      if (error) {
        throw error;
      }


      showMessage(
        "Link reset password sudah dikirim ke email kamu. 📩",
        "success"
      );


    } catch (error) {

      console.error(
        "Reset password error:",
        error
      );

      showMessage(
        getReadableError(error),
        "error"
      );

    }

  }
);


/* =====================================================
   PASSWORD TOGGLE
===================================================== */

document
  .querySelectorAll(".password-toggle")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const target =
          document.getElementById(
            button.dataset.target
          );

        if (!target) return;


        const visible =
          target.type === "text";


        target.type =
          visible
            ? "password"
            : "text";


        button
          .querySelector("span")
          .textContent =
            visible
              ? "◉"
              : "◌";

      }
    );

  });


/* =====================================================
   PASSWORD STRENGTH
===================================================== */

function updatePasswordStrength() {

  if (!registerPassword) return;

  const password =
    registerPassword.value;


  passwordStrength.classList.remove(
    "weak",
    "medium",
    "good",
    "strong"
  );


  if (!password) {

    strengthText.textContent =
      "Masukkan password";

    return;
  }


  let score = 0;


  if (password.length >= 6) {
    score++;
  }

  if (password.length >= 10) {
    score++;
  }

  if (/[A-Z]/.test(password)) {
    score++;
  }

  if (/[0-9]/.test(password)) {
    score++;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  }


  if (score <= 1) {

    passwordStrength.classList.add(
      "weak"
    );

    strengthText.textContent =
      "Lemah";

  } else if (score === 2) {

    passwordStrength.classList.add(
      "medium"
    );

    strengthText.textContent =
      "Lumayan";

  } else if (score === 3 || score === 4) {

    passwordStrength.classList.add(
      "good"
    );

    strengthText.textContent =
      "Bagus";

  } else {

    passwordStrength.classList.add(
      "strong"
    );

    strengthText.textContent =
      "Sangat kuat";

  }

}


registerPassword.addEventListener(
  "input",
  updatePasswordStrength
);


/* =====================================================
   SESSION
===================================================== */

async function checkSession() {

  try {

    const {
      data,
      error
    } =
      await supabase.auth.getSession();


    if (error) {
      throw error;
    }


    if (data.session?.user) {

      showDashboard(
        data.session.user
      );

    } else {

      showAuth();

      showLoginForm();

    }


  } catch (error) {

    console.error(
      "Session error:",
      error
    );

    showAuth();

    showLoginForm();

  }

}


/* =====================================================
   AUTH STATE
===================================================== */

supabase.auth.onAuthStateChange(
  (event, session) => {

    console.log(
      "Supabase auth:",
      event
    );


    if (
      session?.user &&
      (
        event === "SIGNED_IN" ||
        event === "INITIAL_SESSION"
      )
    ) {

      showDashboard(
        session.user
      );

    }


    if (
      event === "SIGNED_OUT"
    ) {

      showAuth();

      showLoginForm();

    }

  }
);


/* =====================================================
   READABLE ERRORS
===================================================== */

function getReadableError(error) {

  const raw =
    error?.message || "";

  const text =
    raw.toLowerCase();


  if (
    text.includes(
      "invalid login credentials"
    )
  ) {

    return "Email atau password salah.";

  }


  if (
    text.includes(
      "email not confirmed"
    )
  ) {

    return "Email kamu belum diverifikasi. Cek inbox email kamu.";

  }


  if (
    text.includes(
      "user already registered"
    )
  ) {

    return "Email tersebut sudah terdaftar. Silakan login.";

  }


  if (
    text.includes(
      "password should be at least"
    )
  ) {

    return "Password minimal 6 karakter.";

  }


  if (
    text.includes(
      "rate limit"
    )
  ) {

    return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";

  }


  if (
    text.includes(
      "email address"
    ) &&
    text.includes(
      "invalid"
    )
  ) {

    return "Format email tidak valid.";

  }


  return raw ||
    "Terjadi kesalahan. Silakan coba lagi.";

}


/* =====================================================
   INITIALIZE
===================================================== */

updateGreeting();

checkSession();


/* =====================================================
   RAYY INTRO — always plays on each page load
===================================================== */
(function runRayyIntro() {
  const intro = document.getElementById("rayyIntro");
  if (!intro) return;
  document.body.classList.add("intro-running");
  window.setTimeout(() => {
    intro.classList.add("intro-exit");
    document.body.classList.remove("intro-running");
    window.setTimeout(() => intro.remove(), 900);
  }, 4300);
})();

