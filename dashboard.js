const SUPABASE_URL = "https://stuwmwjtvuegwtmskdtl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_TzvBXXmImUx8Ae8G7uF8jA_09JSwVJC";

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

client.auth.getSession().then(({ data }) => {
  if (!data.session) {
    window.location.href = "index.html";
  } else {
    document.getElementById("user-email").textContent = data.session.user.email;
  }
});

document.getElementById("logout-btn").addEventListener("click", async () => {
  await client.auth.signOut();
  window.location.href = "index.html";
});
