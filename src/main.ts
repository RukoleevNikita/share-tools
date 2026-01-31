import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
// import connectRedis from 'connect-redis'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import { Redis } from 'ioredis'

import { AppModule } from './app.module.js'
import { parseBoolean } from './libs/common/utils/parse-boolean.util.js'

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
const connectRedis = require('connect-redis')

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	// const redis = new Redis(config.getOrThrow<string>('REDIS_URI'))
	const redis = new Redis({
		host: config.getOrThrow<string>('REDIS_HOST'),
		port: Number(config.getOrThrow<string>('REDIS_PORT')),
		password: config.getOrThrow<string>('REDIS_PASSWORD')
	})

	redis.on('error', e => console.error('[redis]', e.message))

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
	const RedisStore = connectRedis(session)

	app.use(cookieParser(config.getOrThrow('COOKIE_SECRET')))

	app.useGlobalPipes(
		new ValidationPipe({
			// whitelist: true,
			// forbidNonWhitelisted: true,
			transform: true
		})
	)
	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: false, // true,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				// maxAge: ms(config.getOrThrow<string>('SESSION_MAX_AGE')),
				maxAge: 1209600000, // 14 days
				httpOnly: parseBoolean(
					config.getOrThrow<string>('SESSION_HTTP_ONLY')
				),
				secure: parseBoolean(
					config.getOrThrow<string>('SESSION_SECURE')
				),
				sameSite: 'lax'
			},
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_FOLDER')
			})
		})
	)

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGINS').split(','),
		credentials: true,
		exposedHeaders: ['set-cookie']
	})

	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
}

void bootstrap().catch(err => {
	console.error(err)
	process.exit(1)
})
