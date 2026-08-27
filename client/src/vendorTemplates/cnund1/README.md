# Birthday Space Invitation

React + Vite birthday invitation created from the supplied watercolor space assets.

## Run

```bash
npm install
npm run dev
```

## Edit invitation data

Open `src/App.jsx` and edit the `CONFIG` object near the top:

- `childName`
- `age`
- `eventDate`
- `dateLabel`
- `monthTitle`
- `year`
- `selectedDay`
- `time`
- `venue`
- `address`
- `mapUrl`

## Music

The supplied track is at `src/assets/audio/happy-birthday.mp3`.
The page tries to autoplay it. Modern browsers may block audible autoplay; in that case, music starts after the first user interaction. The fixed music button always allows play/pause.
