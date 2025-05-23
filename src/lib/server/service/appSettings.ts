import type { TKhatm } from '@prisma/client'
import { db } from '../db'
import { khatmService_getList } from './khatm'

type Config = {
	/** لینک پشتیبانی سایت */
	readonly supportLink?: string
	/** آیا ختم هاص صفحه اصلی خودکار تولید شوند؟ */
	readonly autoShowcase: boolean
	/**
	 * ختم‌های صفحه اصلی
	 * اگر automaticShowcase فعال باشد این فیلد کاربردی ندارد.
	 */
	readonly showcase: ReadonlyArray<number>
	/**
	 * تنظیمات مربوط به نوتیفیکیشن
	 */
	readonly notification: {
		eitaa?: boolean
		eitaaToken?: string
		eitaaChatId?: string
	}
}

type Store = {
	config: Config
	showcaseKhatms: TKhatm[]
}

const store: Store = {
	config: {
		showcase: [],
		supportLink: '',
		autoShowcase: true,
		notification: {
			eitaa: false,
		},
	},
	showcaseKhatms: [],
}

export const appSettings_store = store

export async function appSettingsService_init() {
	await appSettingsService_update()
}

export async function appSettingsService_update() {
	const result = await db.tAppSettings.findUnique({ where: { id: 1 } })

	if (!result) {
		await db.tAppSettings.create({
			data: {
				id: 1,
				config: store.config,
			},
		})
	}

	await apply(result?.config as unknown as Config)
}

async function apply(newConfig?: Config | null) {
	if (!newConfig) return

	store.config = {
		...store.config,
		...newConfig,
	}
	const result = await khatmService_getList(newConfig.showcase)
	store.showcaseKhatms = result
}

export function appSettingsService_getStaleShowcaseWhileRevalidate() {
	const currentShowcase = store.config.showcase
	khatmService_getList(currentShowcase).then((result) => {
		if (currentShowcase === store.config.showcase) {
			store.showcaseKhatms = result
		}
	})
	return store.showcaseKhatms
}

export async function appSettingsService_setShowcase(showcase: number[]) {
	const newConfig = {
		...store.config,
		showcase: showcase,
	}

	const result = await db.tAppSettings.update({
		where: { id: 1 },
		data: {
			config: newConfig,
		},
	})

	await apply(result.config as unknown as Config)
}

export async function appSettingsService_setKey<T extends keyof Config>(key: T, value: Config[T]) {
	const newConfig = {
		...store.config,
	}
	newConfig[key] = value
	await db.tAppSettings.update({
		where: { id: 1 },
		data: { config: newConfig },
	})
	store.config = newConfig
}
