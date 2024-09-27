import { ExtendedError, Server, Socket } from 'socket.io'
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { Redis } from "ioredis";
import env from '#start/env'
import { AccessToken } from '@adonisjs/auth/access_tokens';
import User from '#models/user';
import db from '@adonisjs/lucid/services/db';

class Ws {
    io: Server | undefined
    private booted = false

    boot() {
        /**
         * Ignore multiple calls to the boot method
         */
        if (!env.get('ALLOW_SOCKET')) {
            return
        }
        
        if (this.booted) {
            return
        }

        this.booted = true

        this.io = this.setupSocket();

        this.io.use(this.authMiddleware.bind(this))

        this.io.listen(env.get('PORT'))
    }

    protected redisClient(): Redis {
        return new Redis({
            host: env.get('REDIS_HOST'),
            port: env.get('REDIS_PORT'),
            password: env.get('REDIS_PASSWORD'),
        });
    }

    private setupSocket(): Server {
        return new Server({
            adapter: createAdapter(this.redisClient()),
            cors: {
                origin: env.get('NODE_ENV') === "production" ? [env.get('APP_URL')] : '*',
                allowedHeaders: ['Access-Control-Allow-Origin', 'Content-Type', 'Authorization'],
                credentials: true
            },
        });
    }

    protected async authMiddleware(socket: Socket, next: (err?: ExtendedError) => void) {
        const authorization = socket.handshake.headers.authorization
        if (authorization) {
            const [, token] = authorization.split('Bearer ')
            const tokenData = AccessToken.decode('oat_', token);
            if (tokenData) {
                const userToken = await db.from('auth_access_tokens').where('id', tokenData.identifier).first();
                if (userToken) {
                    const user = await User.query().where('id', userToken.tokenable_id).first()
                    if (user) {
                        socket.data.user = user.serialize()
                        socket.handshake.auth.user = user.serialize()
                        return next()
                    }
                }
            }
        }

        const err = new Error('Unauthorized')
        return next(err)
    }
}

export default new Ws()