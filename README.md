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

---

## Sound (Sonidos en el juego) 🔊

I've added a simple `SoundManager` using `expo-av`. To enable sounds:

1. Install the native audio package:

```bash
npx expo install expo-av
```

1. Add your sound files to `src/assets/sounds/` using these recommended names:

- `click.mp3` (botones)
- `vote.mp3` (votar/expulsar)
- `reveal.mp3` (mostrar palabra/carta)
- `win.mp3` (victoria tripulantes)
- `lose.mp3` (victoria impostores)

1. Restart Metro. The app will attempt to auto-register those files at startup.

2. Sounds respect the `Sonido` toggle in the Home/Settings screen. If `Sonido` está apagado, no se reproducirán.

If you want more places to make sound or different assets, I can add more hooks or a wrapper `SoundTouchable` component.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
