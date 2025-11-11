# Choose your Vaibhav ❤️ Adventure

An interactive birthday website with two romantic routes!

## File Structure

```
├── index.html              # Main landing page
├── rizzy-route.html        # Rizzy (flirty) route
├── romantic-route.html     # Romantic route
├── styles/
│   ├── main.css           # Main styles (shared)
│   ├── rizzy.css          # Rizzy route styles
│   └── romantic.css       # Romantic route styles
├── scripts/
│   ├── main.js            # Main page interactivity
│   ├── rizzy.js           # Rizzy route functionality
│   ├── romantic.js        # Romantic route functionality
│   ├── confetti.js        # Confetti animation
│   └── sparkles.js        # Sparkle effects
└── README.md              # This file
```

## How to Add Your Photos

### For Rizzy Route (rizzy-route.html)

Replace the photo placeholders in the slideshow:

1. Find the `<div class="slide">` elements
2. Replace the `<div class="photo-placeholder">` content with:
   ```html
   <img src="images/photo1.jpg" alt="Photo 1" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;">
   <p class="caption">Your caption here</p>
   ```

3. Create an `images/` folder and add your photos there

### For Romantic Route (romantic-route.html)

Replace the photo placeholders in the gallery:

1. Find the `.photo-item` elements
2. Replace the `.photo-placeholder` content with:
   ```html
   <img src="images/romantic1.jpg" alt="Romantic Photo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 15px;">
   <p class="romantic-caption">Your romantic caption</p>
   ```

## Features

- ✨ Glowing animations and effects
- 💋 Interactive pop-ups with pickup lines
- 🎁 Clickable gift box
- 🎉 Confetti and sparkle effects
- 🎁 Hidden Easter egg (click the gift icon on main page)
- 📱 Fully responsive for mobile devices

## Customization

- Edit pickup lines in `scripts/rizzy.js` (pickupLines array)
- Modify text content directly in the HTML files
- Adjust colors in the CSS files (search for color codes like `#ff6b9d`)
- Change animations by editing the `@keyframes` in CSS files

## Usage

Simply open `index.html` in a web browser to start the adventure!

