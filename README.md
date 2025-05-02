# Kur? Čia! (Where? Here!)

A geography guessing game that tests your knowledge of specific locations. Players are shown Google Street View images and have to guess the location by placing a marker on a map.

![image](https://github.com/user-attachments/assets/5d8806ad-5304-40d6-8083-2b001e159bc5)
![image](https://github.com/user-attachments/assets/588625cf-ac7a-4e72-8d2d-6d56af2cc0c7)
![image](https://github.com/user-attachments/assets/2fef6279-a4aa-4bff-8d7b-f759d18d9e0b)


## 🎮 Features

- Interactive Street View exploration
- Map-based location guessing
- Score system based on distance accuracy
- Five rounds per game with cumulative scoring
- High score tracking
- Detailed game summary with statistics
- Mobile-friendly design

## 🚀 Demo

Try the game here: https://kurcia.vercel.app/

## 🔧 Technology Stack

- React
- TypeScript
- Tailwind CSS
- Google Maps API (Street View & Maps)
- Vite

## 📋 How to Play

1. **Explore**: Navigate the Street View by dragging your mouse or finger
2. **Guess**: Click on the map to place your guess marker
3. **Submit**: Click the "Spėti" (Guess) button to confirm your answer
4. **Results**: See how close you were and your score
5. **Continue**: Complete all five rounds to see your final score and stats

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16+)
- Google Maps API key with Street View & Maps JavaScript API enabled

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kur-cia.git
   cd kur-cia
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Google Maps API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 🌍 Customization

### Adding Custom Locations

Edit the `frontend/src/data/location.ts` file to add or modify locations:

```typescript
const latLongs = [
  [latitude1, longitude1], // Location 1
  [latitude2, longitude2], // Location 2
  // Add more coordinates here
];
```

## 🙏 Support & Contributing

If you enjoy this project, consider:
- ⭐ Starring the repository
- 🐛 Opening issues for bugs or enhancements
- 🔀 Submitting pull requests
- ☕ [Buy me a coffee](https://ko-fi.com/danvol)
