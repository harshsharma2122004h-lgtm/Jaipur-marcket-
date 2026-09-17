# Jaipur Market — Phase 1

Phase 1 mein ye ban chuka hai:
- Next.js project scaffold
- Database schema (Prisma) — Products, Categories, Variants (size/color), Cart,
  Wishlist, Orders, Reviews, Coupons, OTP-based Auth
- Auth API — Send OTP / Verify OTP (session cookie se login)
- Products & Categories API
- Basic homepage (category grid + product list)
- Seed script for your 6 categories: Oxidized Jewellery, Kurtis, Printed
  Shirts, Printed T-Shirts, Back Pouches, Fabric

## Phone se GitHub par upload kaise karein

1. GitHub app ya github.com kholen, apna naya repo `jaipur-market` open karein
2. "Add file" → "Upload files" par tap karein
3. Is zip ko pehle apne phone mein extract karein (koi bhi file manager app
   jaise Files by Google use kar sakte hain — "Extract" option milega)
4. Extract hone ke baad saari files aur folders GitHub ke upload screen mein
   select karke upload kar dein (folder structure automatically maintain
   ho jayega)
5. Commit karein — "Initial commit: Phase 1 scaffold"

## Vercel par deploy

1. vercel.com → "New Project" → apna `jaipur-market` repo select karein
2. Deploy se pehle "Environment Variables" section mein `.env.example` file
   ki teeno values daalein:
   - `DATABASE_URL` (Supabase se milegi)
   - `JWT_SECRET` (koi bhi random lamba text daal dein)
   - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` (baad mein bhi add kar sakte hain)
3. "Deploy" dabayein

## Supabase se DATABASE_URL kaise len

1. supabase.com → New Project (naam: jaipur-market, password set karein)
2. Project banne ke baad: Settings → Database → "Connection string" →
   "URI" wala option copy karein
3. Usmein `[YOUR-PASSWORD]` ki jagah apna set kiya hua password daal dein
4. Yahi string Vercel ke `DATABASE_URL` mein paste karein

## Database tables banana (migration)

Deploy ke baad ek baar ye command chalani hogi taaki tables ban jayein.
Chunki aapke paas laptop nahi hai, iske 2 tareeke hain:

- **Aasan tareeka**: mujhe batayein jab aap DATABASE_URL bana lein — main
  aapko Supabase ke SQL Editor (jo browser/phone se hi khulta hai) ke liye
  ready-made SQL de dunga, jise aap copy-paste karke run kar sakte hain
- **Dusra tareeka**: agar kabhi laptop mil jaye, `npx prisma migrate dev`
  aur `node prisma/seed.js` chala dena — sab automatic ho jayega

## Aage kya (Phase 2)

- Product listing page with filters (price, category)
- Product detail page (images, size/color selection, add to cart)
- Cart & checkout page
- Razorpay payment integration
- Admin panel (product add/edit, order management)

Jab ready ho, bata dena — Phase 2 shuru kar denge.
