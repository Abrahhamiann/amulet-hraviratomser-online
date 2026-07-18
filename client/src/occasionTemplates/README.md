# Static invitation templates

This folder contains the code-based invitation designs. Database template cards only decide whether a design is visible, how the card looks, and which static design is attached to it.

## How a card connects to a design

Each admin template card has a `designKey`.

- `classic` uses the generic site layout.
- `test-wedding` uses `TestWeddingTemplate.jsx`.
- `romantic-gold` uses `RomanticGoldTemplate.jsx`.
- `midnight-vows` uses `MidnightVowsTemplate.jsx`.

The registry is in `index.jsx`. When you add a new invitation design, export its preview/live/public components there and add the same key to the admin design list.

## Admin behavior

Deleting or deactivating a template card removes it from the public invitation catalog, but it does not remove the code files from this folder. The files stay in Git and are shared through GitHub pull/push.

Use `isActive` in the admin panel to show or hide a card without deleting its database record.
