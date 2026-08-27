# Ծննդյան հրավեր — React + Vite

## Գործարկում

```bash
npm install
npm run dev
```

## Տվյալների փոփոխում

Բացեք `src/App.jsx` և փոփոխեք `CONFIG` օբյեկտը՝ անունը, տարիքը, օրը, ժամը, վայրը և քարտեզի հղումը։

## Տառատեսակ

CSS-ը նախատեսված է `Bubble Sans` տառատեսակի համար։ Քանի որ font ֆայլերը չեն ներառվում արտահանվող ZIP-ում, ձեր ունեցած `Bubble Sans 1.01.otf` ֆայլը տեղադրեք՝

`src/assets/fonts/Bubble Sans 1.01.otf`

Եթե այն չտեղադրեք, նախագիծը կաշխատի fallback տառատեսակով։

## Երաժշտություն

`src/assets/audio/happy-birthday.mp3` արդեն ներառված է։ Browser-ը կարող է արգելափակել ձայնով autoplay-ը մինչև առաջին user interaction-ը. այդ դեպքում երգը կմիանա առաջին click/touch-ից հետո։
