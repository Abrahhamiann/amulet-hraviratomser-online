# Premium Wedding Invitation (React + Vite)

## Run

```bash
npm install
npm run dev
```

## Main editable data
Open `src/App.jsx` and edit the `CONFIG` object near the top:
- bride / groom names
- wedding date
- ceremony and reception time/place/map links

## Included user-provided assets
- Envelope PNG
- Envelope opening MP4
- Indila - Love Story MP3
- Bubble Sans Armenian font
- Wedding imagery cropped from the supplied reference screenshots for the demo layout

## Music behavior
The envelope is the explicit user interaction. Clicking it starts the envelope video and primes the music at volume 0. When the video finishes (or “Բացել հիմա” is pressed), the invitation opens and the song fades in. The fixed music button toggles play/pause.

# Responsive update

Added breakpoints for ultrawide, desktop, laptop, tablet, phones (600/390/340), short landscape phones, touch devices, safe-area insets, fluid typography, responsive hero/envelope/video/calendar/schedule/editorial/RSVP.
