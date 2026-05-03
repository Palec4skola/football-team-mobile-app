# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Architektúra projektu

Projekt je rozdelený do viacerých priečinkov podľa funkčnosti a zodpovednosti:

- **app/** – Hlavný adresár s obrazovkami aplikácie a routovaním (file-based routing). Obsahuje podpriečinky pre jednotlivé sekcie (napr. `announcements/`, `attendance/`, `chat/`, `match/`, `registration/`, `team/`, `training/`, `wellness/`).
- **components/** – Znovupoužiteľné React komponenty rozdelené podľa funkcie alebo sekcie aplikácie.
- **constants/** – Konštanty a témy (napr. farby, štýly).
- **data/** – Dátové modely alebo mock dáta (ak sú použité).
- **functions/** – Serverless funkcie alebo backend logika (napr. Firebase Functions).
- **hooks/** – Vlastné React hooky pre opakované logiky (napr. prístup k tímom, profilom, attendance, atď.).
- **services/** – Logika pre komunikáciu s backendom alebo externými službami (napr. wellness, teams).
- **styles/** – Samostatné súbory so štýlmi pre jednotlivé obrazovky alebo komponenty.
- **utils/** – Pomocné utility funkcie (napr. na prácu s dátumami, rolami, kódmi tímov).
- **assets/** – Obrázky a ďalšie statické súbory.

### Hlavné súbory

- `app.json`, `eas.json`, `firebase.json` – Konfiguračné súbory pre Expo, EAS a Firebase.
- `package.json` – Zoznam závislostí a skriptov.
- `README.md` – Tento súbor s dokumentáciou.

### Príklad štruktúry

```text
app/
   announcements/
   attendance/
   chat/
   ...
components/
   profile/
   team/
   ...
hooks/
   useTeamMembers.ts
   useProfilePhoto.ts
   ...
services/
   wellness/
   teams/
   ...
utils/
   dateUtils.ts
   ...
```

Každý priečinok je zameraný na konkrétnu časť aplikácie alebo typ logiky, čo uľahčuje orientáciu a rozširovanie projektu.
