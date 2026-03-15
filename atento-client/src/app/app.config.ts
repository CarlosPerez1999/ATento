import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { definePreset } from '@primeuix/themes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.700}',
            600: '{blue.800}',
            700: '{blue.900}',
            800: '{blue.950}',
            900: '{blue.950}',
            950: '{blue.950}'
        },
        secondary: {
            50: '{surface.50}',
            100: '{surface.100}',
            200: '{surface.200}',
            300: '{surface.300}',
            400: '{surface.400}',
            500: '{surface.500}',
            600: '{surface.600}',
            700: '{surface.700}',
            800: '{surface.800}',
            900: '{surface.900}',
            950: '{surface.950}'
        },
        danger: {
            50: '{red.50}',
            100: '{red.100}',
            200: '{red.200}',
            300: '{red.300}',
            400: '{red.400}',
            500: '{red.500}',
            600: '{red.600}',
            700: '{red.700}',
            800: '{red.800}',
            900: '{red.900}',
            950: '{red.950}'
        },
        surface: {
            0: '#ffffff',
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{primary.500}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.600}',
                    activeColor: '{primary.700}'
                },
                highlight: {
                    background: '{primary.500}',
                    focusBackground: '{primary.600}',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                }
            }
        }
    },
    components: {
        button: {
            root: {
                borderRadius: '0.75rem',
                paddingX: '1rem',
                paddingY: '0.625rem'
            }
        },
        dialog: {
            root: {
                borderRadius: '1.5rem'
            },
            header: {
                padding: '1.5rem'
            },
            footer: {
                padding: '1rem 1.5rem 1.5rem 1.5rem',
                gap: '0.75rem'
            },
            title: {
                fontWeight: '800',
                fontSize: '1.25rem'
            }
        },
        datatable: {
            headerCell: {
                background: '{surface.50}',
                color: '{surface.600}'
            },
            row: {
                hoverBackground: '{surface.50}'
            }
        },
        togglebutton: {
            root: {
                borderRadius: '0.5rem'
            }
        },
        selectbutton: {
            root: {
                borderRadius: '0.5rem'
            }
        },
        tag: {
            root: {
                borderRadius: '0.625rem',
                fontWeight: '800'
            }
        }
    }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: MyPreset,
            options: {
                darkModeSelector: '.dark',
                cssLayer: {
                    name: 'primeng',
                    order: 'theme, base, primeng, components, utilities'
                }
            }
        }
    }),
    MessageService,
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
