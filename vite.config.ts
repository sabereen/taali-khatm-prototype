import { svelteTesting } from '@testing-library/svelte/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import icons from 'unplugin-icons/vite'
import UnoCSS from 'unocss/vite'
import packageJson from './package.json'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit(), UnoCSS(), icons({ autoInstall: true, compiler: 'svelte' })],

	build: {
		target: packageJson.browserslist.split(', ').map((b) => b.replaceAll('>=', '')),
	},

	test: {
		workspace: [
			{
				extends: './vite.config.ts',
				plugins: [svelteTesting()],

				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts'],
				},
			},
			{
				extends: './vite.config.ts',

				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
				},
			},
		],
	},
})
