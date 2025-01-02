import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		backgroundImage: {
			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			'grid-box-light': "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27 width=%2732%27 height=%2732%27 fill=%27none%27 stroke=%27rgb(0%200%200%20/%200.1)%27%3e%3cpath d=%27M0 .5H31.5V32%27/%3e%3c/svg%3e')",
			'grid-box-dark': "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27 width=%2732%27 height=%2732%27 fill=%27none%27 stroke=%27rgb(255%20255%20255%20/%200.1)%27%3e%3cpath d=%27M0 .5H31.5V32%27/%3e%3c/svg%3e')",
		},
		backgroundSize: {
			'grid-box': '24px 24px',
		},
		backgroundRepeat: {
			'grid-box': 'repeat',
		},
  		colors: {
			gradient: 'linear-gradient(to right, #f06, #4a90e2)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
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
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		animation: {
			scan: 'scan 2s ease-in-out infinite',
			'zoom-border': 'zoomCorners 2s infinite'
		},
		keyframes: {
			scan: {
			'0%, 100%': { transform: 'translateY(-100%)' },
			'50%': { transform: 'translateY(100%)' },
			},
			zoomCorners:{
				'0%': {
				  transform: 'scale(1)'
				},
				'50%': {
				  transform: 'scale(1.05)' 
				},
				'100%': {
				  transform: 'scale(1)'
				}
			  }
		},
		dropShadow: {
			'3xl': '-2px 2px 2px rgba(0, 0, 0, 0.30)',
			'4xl': [
				'0 35px 35px rgba(0, 0, 0, 0.25)',
				'0 45px 65px rgba(0, 0, 0, 0.15)'
			]
		  }
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
