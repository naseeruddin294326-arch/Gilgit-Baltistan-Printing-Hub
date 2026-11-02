# Gilgit Baltistan Printing Hub

A responsive, single-file website prototype for Gilgit-Baltistan printing services.

## Preview
Open `index.html` in a browser, or deploy this repository as a static site on Netlify. No build command is required; publish directory: `.`

## Included
- Responsive homepage with navigation and mountain-inspired hero
- Wedding cards, birthday cards, banners/flex, visiting cards, culture designs and gift/event cards
- Design gallery filters and select-design preview
- Order request form with quantity and Gilgit-Baltistan delivery area fields
- Mobile navigation and demo-only browser storage

## Important — not ready for real customer orders yet
This is a frontend prototype. The order form saves a demo request only in the visitor's own browser using localStorage. It does **not** send orders to the business, connect to Supabase, include a secure admin dashboard/login, process online payments, or provide customer/order tracking. Do not accept real orders through this prototype until a secure backend, database permissions, validation, and order handling are implemented and tested.

## Deploy with Netlify
1. Open Netlify and choose **Add new site** / **Import an existing project**.
2. Connect GitHub and select `Gilgit-Baltistan-Printing-Hub`.
3. Leave the build command blank and set the publish directory to `.` if prompted.
4. Deploy the site.

## Before public launch
- Replace placeholder contact details with the business's real phone/WhatsApp and email.
- Review/replace the external hero photo with a suitable image you have permission to use.
- Connect Supabase securely, configure Row Level Security, and implement protected admin access and real order submission.
- Confirm printing prices, printer arrangements, delivery terms, privacy policy, and payment options.
