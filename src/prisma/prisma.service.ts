/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly pool: Pool

	constructor(config: ConfigService) {
		const url = config.get<string>('POSTGRES_URI')
		if (!url) throw new Error('POSTGRES_URI is not set')

		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const pool = new Pool({ connectionString: url })
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const adapter = new PrismaPg(pool)

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		super({ adapter } as any)

		this.pool = pool
	}

	async onModuleInit() {
		await this.$connect()
	}

	async onModuleDestroy() {
		await this.$disconnect()
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		await this.pool.end()
	}
}
