import { dbService } from './dbService';
import { GhostJourney } from '../types';
import { Timestamp } from 'firebase/firestore';

const PERSONAS = [
  { name: 'Luxury Traveler', urls: ['https://luxury-hotels.com', 'https://first-class-flights.net'] },
  { name: 'Extreme Couponer', urls: ['https://coupons-daily.com', 'https://budget-living.org'] },
  { name: 'Crypto Whale', urls: ['https://coin-exchange.io', 'https://defi-protocols.net'] },
  { name: 'Industrial Farmer', urls: ['https://tractor-supply.com', 'https://bulk-grain.org'] },
  { name: 'Biohacker', urls: ['https://nootropics-lab.com', 'https://longevity-science.org'] }
];

let ghostInterval: any = null;
let currentFrequency = 15000;

export const ghostService = {
  startGhostMode(userId: string, isActiveMode: boolean = false) {
    if (ghostInterval) {
      clearInterval(ghostInterval);
    }

    currentFrequency = isActiveMode ? 5000 : 15000; // 5s in active mode, 15s otherwise

    ghostInterval = setInterval(async () => {
      const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
      const url = persona.urls[Math.floor(Math.random() * persona.urls.length)];

      const journey: GhostJourney = {
        userId,
        targetUrl: url,
        persona: persona.name,
        timestamp: Timestamp.now()
      };

      await dbService.logGhostJourney(journey);
      console.log(`[Ghost Mode] ${isActiveMode ? 'ACTIVE' : 'NORMAL'} Simulation: ${url} as ${persona.name}`);
    }, currentFrequency);

    dbService.toggleGhostMode(userId, true);
  },

  updateFrequency(userId: string, isActiveMode: boolean) {
    if (ghostInterval) {
      this.startGhostMode(userId, isActiveMode);
    }
  },

  stopGhostMode(userId: string) {
    if (ghostInterval) {
      clearInterval(ghostInterval);
      ghostInterval = null;
    }
    dbService.toggleGhostMode(userId, false);
  }
};
