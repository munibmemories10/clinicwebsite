const supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);

const loginSection = document.getElementById("loginSection");
const uploadSection = document.getElementById("uploadSection");
const message = document.getElementById("message");

function showMessage(text) { message.textContent = text; }

async function refreshSession() {
  const { data: { session } } = await supabase.auth.getSession();
  loginSection.classList.toggle("hidden", !!session);
  uploadSection.classList.toggle("hidden", !session);
}
refreshSession();

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  showMessage("Signing in…");
  const { error } = await supabase.auth.signInWithPassword({
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  });
  if (error) return showMessage(error.message);
  showMessage("Signed in.");
  refreshSession();
});

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const appName = document.getElementById("nameInput").value.trim();
  const version = document.getElementById("versionInput").value.trim();
  const file = document.getElementById("apkInput").files[0];

  if (!file || !file.name.toLowerCase().endsWith(".apk")) {
    return showMessage("Please choose a valid .apk file.");
  }

  const button = document.getElementById("publishButton");
  button.disabled = true;
  showMessage("Uploading APK…");

  const safeVersion = version.replace(/[^a-zA-Z0-9._-]/g, "-");
  const filePath = `releases/${Date.now()}-${safeVersion}.apk`;

  const { error: uploadError } = await supabase.storage
    .from("apks")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: "application/vnd.android.package-archive"
    });

  if (uploadError) {
    button.disabled = false;
    return showMessage("Upload failed: " + uploadError.message);
  }

  showMessage("Publishing version…");

  const { error: dbError } = await supabase
    .from("latest_app")
    .upsert({
      id: 1,
      app_name: appName,
      version,
      file_path: filePath,
      published_at: new Date().toISOString()
    }, { onConflict: "id" });

  button.disabled = false;

  if (dbError) return showMessage("APK uploaded, but publishing failed: " + dbError.message);

  document.getElementById("uploadForm").reset();
  showMessage(`Published ${appName} ${version}.`);
});

document.getElementById("logoutButton").addEventListener("click", async () => {
  await supabase.auth.signOut();
  showMessage("Signed out.");
  refreshSession();
});
