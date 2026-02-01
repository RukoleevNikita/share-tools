import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module.js'
import { ProviderModule } from './auth/provider/provider.module.js'
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util.js'
import { PrismaModule } from './prisma/prisma.module.js'
import { UserModule } from './user/user.module.js'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true,
			expandVariables: true
		}),
		PrismaModule,
		AuthModule,
		UserModule,
		ProviderModule
	]
})
export class AppModule {}
