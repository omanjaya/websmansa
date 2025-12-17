import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					'50': '#eff6ff',
					'100': '#dbeafe',
					'200': '#bfdbfe',
					'300': '#93c5fd',
					'400': '#60a5fa',
					'500': '#3b82f6',
					'600': '#2563eb',
					'700': '#1d4ed8',
					'800': '#1e40af',
					'900': '#1e3a8a',
					'950': '#172554',
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					'50': '#f8fafc',
					'100': '#f1f5f9',
					'200': '#e2e8f0',
					'300': '#cbd5e1',
					'400': '#94a3b8',
					'500': '#64748b',
					'600': '#475569',
					'700': '#334155',
					'800': '#1e293b',
					'900': '#0f172a',
					'950': '#020617',
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				sans: [
					'Inter',
					'system-ui',
					'sans-serif'
				]
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-out',
				'fade-up': 'fadeUp 0.5s ease-out',
				'fade-down': 'fadeDown 0.5s ease-out',
				'slide-in-left': 'slideInLeft 0.5s ease-out',
				'slide-in-right': 'slideInRight 0.5s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				'bounce-in': 'bounceIn 0.6s ease-out',
				float: 'float 6s ease-in-out infinite',
				'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				shimmer: 'shimmer 2s linear infinite',
				'spin-slow': 'spin 3s linear infinite',
				gradient: 'gradient 8s ease infinite'
			},
			keyframes: {
				fadeIn: {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				fadeUp: {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				fadeDown: {
					'0%': {
						opacity: '0',
						transform: 'translateY(-20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				slideInLeft: {
					'0%': {
						opacity: '0',
						transform: 'translateX(-20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				slideInRight: {
					'0%': {
						opacity: '0',
						transform: 'translateX(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				scaleIn: {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				bounceIn: {
					'0%': {
						opacity: '0',
						transform: 'scale(0.3)'
					},
					'50%': {
						transform: 'scale(1.05)'
					},
					'70%': {
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				float: {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				shimmer: {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				gradient: {
					'0%, 100%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					}
				}
			},
			backdropBlur: {
				xs: '2px'
			},
			boxShadow: {
				glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
				'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
				soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
				'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
				'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
				glow: '0 0 15px rgba(59, 130, 246, 0.5)',
				'glow-lg': '0 0 30px rgba(59, 130, 246, 0.4)'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'mesh-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				aurora: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 25%, #8b5cf6 50%, #ec4899 75%, #f97316 100%)'
			},
			transitionTimingFunction: {
				'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography"),
	],
};
export default config;
