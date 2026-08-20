# APK Portal

## 1. Create a Supabase project
Create a project at Supabase.

## 2. Create your admin user
In Authentication, create/sign up the single email/password account you want to use for the admin page.
For a simple private admin setup, do not give the credentials to anyone else.

## 3. Create Storage bucket
Create a bucket named:

apks

Set it to **Public** so visitors can download the APK.

## 4. Run the SQL
Open SQL Editor and run the entire contents of `supabase.sql`.

## 5. Add project credentials
Open `config.js` and replace:

PASTE_YOUR_SUPABASE_URL_HERE
PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE

Use the Project URL and Publishable/anon key from your Supabase project.

Never put a service_role or secret key into this website.

## 6. Test locally
Open the files with a simple local web server, for example VS Code Live Server.

Public page:
index.html

Admin page:
admin.html

## 7. Put the website online
Upload these files to a static host such as GitHub Pages, Cloudflare Pages, or Netlify.

Once online:
- You visit /admin.html and sign in.
- Upload an APK and enter its version.
- The APK is stored in Supabase Storage.
- `latest_app` is updated.
- Anyone opening the public page sees the latest version and can download it.

## Important security note
This simple setup allows any authenticated Supabase user to upload/update. If you only create one admin user, that user is effectively the admin.

For multiple users or stricter permissions, add an admin-role table or server-side function.
