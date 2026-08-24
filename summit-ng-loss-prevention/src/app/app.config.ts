import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  LucideBuilding2,
  LucideList,
  LucideShieldPlus,
  LucideUsers,
  provideLucideIcons,
} from '@lucide/angular';
import { provideOptimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideOptimus({
      theme: {
        preset: Aura,
        options: { darkModeSelector: 'none' },
      },
    }),
    provideLucideIcons(
      LucideList,
      LucideUsers,
      LucideBuilding2,
      LucideShieldPlus
    ),
  ],
};
