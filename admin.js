const ADMIN_PASSWORD = "Drsalim";

const supabaseClient = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_KEY
);

const loginSection = document.getElementById("loginSection");
const uploadSection = document.getElementById("uploadSection");
const message = document.getElementById("message");

function showMessage(text) {
  message.textContent = text;
}


// Check if already logged in
if (sessionStorage.getItem("apkAdminLoggedIn") === "true") {
  loginSection.classList.add("hidden");
  uploadSection.classList.remove("hidden");
}


// LOGIN
document.getElementById("loginForm").addEventListener(
  "submit",
  function (e) {

    e.preventDefault();

    const password =
      document.getElementById("password").value;

    if (password === ADMIN_PASSWORD) {

      sessionStorage.setItem(
        "apkAdminLoggedIn",
        "true"
      );

      loginSection.classList.add("hidden");
      uploadSection.classList.remove("hidden");

      showMessage("Logged in successfully.");

    } else {

      showMessage("Incorrect password.");

    }

  }
);


// UPLOAD APK
document.getElementById("uploadForm").addEventListener(
  "submit",
  async function (e) {

    e.preventDefault();

    const appName = "Clinic App";

    const version =
      document.getElementById("versionInput").value.trim();

    const file =
      document.getElementById("apkInput").files[0];

    if (!file) {
      showMessage("Please select an APK file.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".apk")) {
      showMessage("Please select a valid APK file.");
      return;
    }

    const button =
      document.getElementById("publishButton");

    button.disabled = true;

    try {

      showMessage("Uploading APK...");

      const safeVersion =
        version.replace(/[^a-zA-Z0-9._-]/g, "-");

      const filePath =
        `releases/${Date.now()}-${safeVersion}.apk`;


      const { error: uploadError } =
        await supabaseClient.storage
          .from("apks")
          .upload(
            filePath,
            file,
            {
              cacheControl: "3600",
              upsert: false,
              contentType:
                "application/vnd.android.package-archive"
            }
          );

      if (uploadError) {
        throw uploadError;
      }


      showMessage("Publishing version...");


      const { error: dbError } =
        await supabaseClient
          .from("latest_app")
          .upsert(
            {
              id: 1,
              app_name: appName,
              version: version,
              file_path: filePath,
              published_at: new Date().toISOString()
            },
            {
              onConflict: "id"
            }
          );

      if (dbError) {
        throw dbError;
      }


      document
        .getElementById("uploadForm")
        .reset();

      showMessage(
        `Successfully published ${appName} version ${version}!`
      );

    } catch (error) {

      console.error(error);

      showMessage(
        "Error: " + error.message
      );

    } finally {

      button.disabled = false;

    }

  }
);


// LOGOUT
document.getElementById("logoutButton").addEventListener(
  "click",
  function () {

    sessionStorage.removeItem("apkAdminLoggedIn");

    uploadSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    document.getElementById("password").value = "";

    showMessage("Logged out.");

  }
);
