const SUPABASE_URL = "https://stuwmwjtvuegwtmskdtl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_TzvBXXmImUx8Ae8G7uF8jA_09JSwVJC";

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Redirect if already logged in
client.auth.getSession().then(({ data }) => {
  if (data.session) window.location.href = "dashboard.html";
});

let isSignUp = false;

const form = document.getElementById("auth-form");
const submitBtn = document.getElementById("submit-btn");
const toggleBtn = document.getElementById("toggle-btn");
const toggleText = document.getElementById("toggle-text");
const errorMsg = document.getElementById("error-msg");
const successMsg = document.getElementById("success-msg");

toggleBtn.addEventListener("click", () => {
  isSignUp = !isSignUp;
  submitBtn.textContent = isSignUp ? "Sign up" : "Sign in";
  toggleText.textContent = isSignUp ? "Already have an account?" : "Don't have an account?";
  toggleBtn.textContent = isSignUp ? "Sign in" : "Sign up";
  hide(errorMsg);
  hide(successMsg);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hide(errorMsg);
  hide(successMsg);

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  submitBtn.disabled = true;
  submitBtn.textContent = "Please wait...";

  if (isSignUp) {
    const { error } = await client.auth.signUp({ email, password });
    if (error) {
      show(errorMsg, error.message);
    } else {
      show(successMsg, "Account created! Check your email to confirm, then sign in.");
    }
  } else {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      show(errorMsg, error.message);
    } else {
      await client.from("login_events").insert({
        user_id: data.user.id,
        email: data.user.email,
      });
      window.location.href = "dashboard.html";
    }
  }

  submitBtn.disabled = false;
  submitBtn.textContent = isSignUp ? "Sign up" : "Sign in";
});

function show(el, msg) {
  el.textContent = msg;
  el.classList.remove("hidden");
}

function hide(el) {
  el.classList.add("hidden");
}
