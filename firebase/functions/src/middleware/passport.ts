import Auth0Strategy, {
    AuthenticateOptions,
    ExtraVerificationParams,
    VerifyFunctionWithRequest,
} from 'passport-auth0'
import passport, { Profile } from 'passport'
import { config } from '../utils'

const sessionSettings = {
    secret: 'bcconlinesecret', // TODO: Make this secret
    cookie: {},
    resave: false,
    saveUninitialized: true,
}

const strategy = new Auth0Strategy(
    {
        domain: config.auth0.domain,
        clientID: config.auth0.clientId,
        clientSecret: config.auth0.clientSecret,
        callbackURL: config.api.baseUrl + 'firebase/callback',
    },
    (
        _accessToken: string,
        _refreshToken: string,
        extraParams: ExtraVerificationParams,
        profile: Profile,
        done: VerifyFunctionWithRequest
    ) => {
        profile.accessToken = extraParams.id_token
        return done(null, profile)
    }
)

passport.use(strategy)
passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})

export { passport, sessionSettings }
