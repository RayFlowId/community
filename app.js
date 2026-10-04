import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


/* =====================================================
   SUPABASE CONFIG
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

const loginForm =
  document.getElementById("loginForm");

const registerForm =
  document.getElementById("registerForm");

const authTitle =
  document.getElementById("authTitle");

const authSubtitle =
  document.getElementById("authSubtitle");

const message =
  document.getElementById("message");

const loginButton =
  document.getElementById("loginButton");

const registerButton =
  document.getElementById("registerButton");

const logoutButton =
  document.getElementById("logoutButton");

const forgotPassword =
  document.getElementById("forgotPassword");

const showRegister =
  document.getElementById("showRegister");

const showLogin =
  document.getElementById("showLogin");

const userEmail =
  document.getElementById("userEmail");

const avatarLetter =
  document.getElementById("avatarLetter");


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(text, type = "error") {

  message.textContent = text;

  message.className =
    `message ${type}`;

}

function hideMessage() {

  message.textContent = "";

  message.className =
    "message hidden";

}


/* =====================================================
   LOADING
===================================================== */

function setLoading(button, loading, normalText) {

  if (!button) return;

  button.disabled = loading;

  if (loading) {

    button.innerHTML =
      "<span>Memproses...</span>";

  } else {

    button.innerHTML =
      `<span>${normalText}</span>`;

  }

}


/* =====================================================
   AUTH VIEW
===================================================== */

function showLoginForm() {

  loginForm.classList.remove("hidden");

  registerForm.classList.add("hidden");

  authTitle.textContent =
    "Selamat datang 👋";

  authSubtitle.textContent =
    "Login untuk masuk ke Community Rayy.";

  hideMessage();

}


function showRegisterForm() {

  loginForm.classList.add("hidden");

  registerForm.classList.remove("hidden");

  authTitle.textContent =
    "Buat akun baru 🚀";

  authSubtitle.textContent =
    "Bergabung dengan Community Rayy.";

  hideMessage();

}


/* =====================================================
   DASHBOARD
===================================================== */

function showDashboard(user) {

  authSection.classList.add("hidden");

  dashboardSection.classList.remove("hidden");

  const email =
    user?.email || "User";

  userEmail.textContent =
    email;

  avatarLetter.textContent =
    email.charAt(0).toUpperCase();

}


function showAuth() {

  dashboardSection.classList.add("hidden");

  authSection.classList.remove("hidden");

}


/* =====================================================
   REGISTER
===================================================== */

registerForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    hideMessage();

    const email =
      document.getElementById("registerEmail")
        .value
        .trim();

    const password =
      document.getElementById("registerPassword")
        .value;

    const confirmPassword =
      document.getElementById("registerPasswordConfirm")
        .value;


    /* Password check */

    if (password.length < 6) {

      showMessage(
        "Password minimal 6 karakter.",
        "error"
      );

      return;

    }


    if (password !== confirmPassword) {

      showMessage(
        "Password dan ulangi password tidak sama.",
        "error"
      );

      return;

    }


    setLoading(
      registerButton,
      true,
      "Buat akun"
    );


    try {

      const {
        data,
        error
      } = await supabase.auth.signUp({

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
       * Karena Confirm Email aktif,
       * user biasanya belum langsung mendapatkan
       * session sampai email diverifikasi.
       */

      if (!data.session) {

        registerForm.reset();

        showMessage(
          "Akun berhasil dibuat! 📩 Cek email kamu untuk verifikasi sebelum login.",
          "success"
        );

        return;

      }


      showMessage(
        "Akun berhasil dibuat!",
        "success"
      );


    } catch (error) {

      console.error(error);

      showMessage(
        getReadableError(error),
        "error"
      );

    } finally {

      setLoading(
        registerButton,
        false,
        "Buat akun"
      );

    }

  }
);


/* =====================================================
   LOGIN
===================================================== */

loginForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    hideMessage();

    const email =
      document.getElementById("loginEmail")
        .value
        .trim();

    const password =
      document.getElementById("loginPassword")
        .value;


    setLoading(
      loginButton,
      true,
      "Masuk"
    );


    try {

      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({

        email,

        password

      });


      if (error) {

        throw error;

      }


      if (!data.user) {

        throw new Error(
          "User tidak ditemukan."
        );

      }


      showDashboard(
        data.user
      );


      loginForm.reset();


    } catch (error) {

      console.error(error);

      showMessage(
        getReadableError(error),
        "error"
      );

    } finally {

      setLoading(
        loginButton,
        false,
        "Masuk"
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

    logoutButton.disabled = true;

    logoutButton.textContent =
      "Keluar...";


    try {

      const {
        error
      } = await supabase.auth.signOut();


      if (error) {

        throw error;

      }


      showAuth();

      showLoginForm();


    } catch (error) {

      console.error(error);

      alert(
        getReadableError(error)
      );


    } finally {

      logoutButton.disabled = false;

      logoutButton.textContent =
        "Keluar";

    }

  }
);


/* =====================================================
   SWITCH LOGIN / REGISTER
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
      document.getElementById("loginEmail")
        .value
        .trim();


    if (!email) {

      showMessage(
        "Masukkan email terlebih dahulu.",
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
      } = await supabase.auth.resetPasswordForEmail(
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

      console.error(error);

      showMessage(
        getReadableError(error),
        "error"
      );

    }

  }
);


/* =====================================================
   SHOW / HIDE PASSWORD
===================================================== */

document
  .querySelectorAll(".show-password")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const targetId =
          button.dataset.target;

        const input =
          document.getElementById(
            targetId
          );

        if (!input) return;


        if (input.type === "password") {

          input.type = "text";

          button.textContent =
            "🙈";

        } else {

          input.type = "password";

          button.textContent =
            "👁";

        }

      }
    );

  });


/* =====================================================
   SESSION CHECK
===================================================== */

async function checkSession() {

  try {

    const {
      data,
      error
    } = await supabase.auth.getSession();


    if (error) {

      console.error(error);

      showAuth();

      return;

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

  }

}


/* =====================================================
   AUTH STATE LISTENER
===================================================== */

supabase.auth.onAuthStateChange(
  (event, session) => {

    console.log(
      "Auth event:",
      event
    );


    if (
      session?.user &&
      event === "SIGNED_IN"
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
   ERROR HANDLER
===================================================== */

function getReadableError(error) {

  const message =
    error?.message || "";


  if (
    message
      .toLowerCase()
      .includes("invalid login credentials")
  ) {

    return "Email atau password salah.";

  }


  if (
    message
      .toLowerCase()
      .includes("email not confirmed")
  ) {

    return "Email kamu belum diverifikasi. Cek inbox email kamu.";

  }


  if (
    message
      .toLowerCase()
      .includes("user already registered")
  ) {

    return "Email tersebut sudah terdaftar. Silakan login.";

  }


  if (
    message
      .toLowerCase()
      .includes("password should be at least")
  ) {

    return "Password terlalu pendek.";

  }


  if (
    message
      .toLowerCase()
      .includes("rate limit")
  ) {

    return "Terlalu banyak percobaan. Coba lagi beberapa saat.";

  }


  return message ||
    "Terjadi kesalahan. Silakan coba lagi.";

}


/* =====================================================
   START
===================================================== */

checkSession();