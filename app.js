const supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);

async function loadLatest() {
  const { data, error } = await supabase
    .from("latest_app")
    .select("app_name, version, file_path, published_at")
    .eq("id", 1)
    .maybeSingle();

  const status = document.getElementById("status");
  if (error || !data) {
    document.getElementById("appName").textContent = "No APK published yet";
    status.textContent = error ? "Unable to load the latest release." : "Check back soon.";
    return;
  }

  document.getElementById("appName").textContent = data.app_name;
  document.getElementById("version").textContent = data.version;
  document.getElementById("releasedAt").textContent =
    new Date(data.published_at).toLocaleDateString();

  const { data: urlData } = supabase.storage
    .from("apks")
    .getPublicUrl(data.file_path, { download: true });

  document.getElementById("download").href = urlData.publicUrl;
  document.getElementById("release").classList.remove("hidden");
  status.textContent = "";
}
loadLatest();
