const supabaseClient = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_KEY
);

async function loadLatest() {

  const status = document.getElementById("status");

  try {

    const { data, error } = await supabaseClient
      .from("latest_app")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    console.log("Supabase data:", data);
    console.log("Supabase error:", error);

    if (error) {
      throw error;
    }

    if (!data) {
      document.getElementById("appName").textContent =
        "No APK published yet";

      status.textContent =
        "No APK release found.";

      return;
    }

    document.getElementById("appName").textContent =
      data.app_name;

    document.getElementById("version").textContent =
      data.version;

    document.getElementById("releasedAt").textContent =
      new Date(data.published_at).toLocaleDateString();


    const { data: urlData } =
      supabaseClient.storage
        .from("apks")
        .getPublicUrl(data.file_path);


    console.log("APK URL:", urlData.publicUrl);


    const downloadLink =
      document.getElementById("download");

    downloadLink.href =
      urlData.publicUrl;

    downloadLink.download =
      `${data.app_name}-${data.version}.apk`;


    document
      .getElementById("release")
      .classList.remove("hidden");

    status.textContent = "";

  } catch (error) {

    console.error("Website error:", error);

    document.getElementById("appName").textContent =
      "Unable to load APK";

    status.textContent =
      "Error: " + error.message;

  }

}

loadLatest();
