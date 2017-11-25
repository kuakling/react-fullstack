// Your app's entry point.  Every ReactQL projects requires 'src/app.js',
// which both the server and browser will import.
//
// In this file, you'll do two things:
//
// 1.  Import `kit/config`, and configure your app.  In this example, I'm
// adding a custom Redux reducer that acts as a simple counter, and enabling
// a built-in GraphQL server that imports a schema for a simple message.
//
// 2.  Export the root React component that goes between <div id="main"/>
// in the server-side HTML.

// ----------------------
// IMPORTS

/* ReactQL */

// Config API, for adding reducers and configuring our ReactQL app
import config from 'kit/config';
import appConfig from 'src/app-config';
import jwt from 'jsonwebtoken';
import { getServerURL } from 'kit/lib/env'; // Get the server host/port, to register callbacks

/* App */

// Example counter reducer.  This simply increments the counter by +1
// import counterReducer from 'reducers/counter';

// Main component -- i.e. the 'root' React component in our app
import Main from 'components/main';

// Init global styles.  These will be added to the resulting CSS automatically
// without any class hashing.  Use this to include default or framework CSS.
import './styles.global.scss';
// import './styles/antd-overide-color.scss';

// ----------------------

/* REDUCERS */

// Add our custom `counter` reducer, with the initial state as a zero count.
// Note:  The initial state (3rd param) will automatically be wrapped in
// `seamless-immutable` by the kit's Redux init code, so plain objects are
// automatically immutable by default
// config.addReducer('counter', counterReducer, { count: 0 });
// เพิ่มเติม
require('src/common/reducers/index')

/* GRAPHQL */

// Enable the internal GraphQL server.  This will do two things:
//
// 1.  On the server, it will set-up the necessary route handlers to 'listen'
// to incoming GraphQL requests on `/graphql`, as well as (by default) set-up
// the GraphiQL IDE
//
// 2.  On the client, it will append the correct server URL so that we can
// call the ReactQL host properly, and let the server handle our requests
config.enableGraphQLServer();

/* SERVER */

// Set our server config, by checking `SERVER` -- this code path will be
// eliminated by Webpack in the browser, so we can safely add this.

if (SERVER) {
  /* SSL */

  // By default, the Koa web server runs on a plain HTTP server. However,
  // you can easily enable HTTPS.  In the following commands, I grab a sample
  // self-signed key/cert combo and call `config.enableSSL()` with the options
  // I want to pass to the `https.createServer()` that happens under the hood.
  //
  // Note: Running https:// in your browser using this self-signed cert will
  // undoubtably raise a security error. But at least we can see it's working.
  //
  // Production note: I generally recommend using a dedicated upstream proxy
  // such as Nginx to handle HTTPS traffic, since the TLS handshake will likely
  // be faster, and you can add HTTP/2 and have much finer-grain control over
  // HTTP. But, if you need a fast SSL service, ReactQL has you covered!

  /*
    Uncomment the next two lines to enable SSL!
  */

  // const cert = require('src/cert/self_signed');
  // config.enableSSL({ key: cert.key, cert: cert.cert });

  // If wanted, you could also run an *SSL-only* server by uncommenting:
  // config.disableHTTP();

  // Or, you could automatically redirect non-HTTP traffic to SSL by
  // uncommenting the following: (Note: pass { port: 8081 }) for development
  // or { port: 4000 } for the default production port
  // config.forceSSL({ port: 8081 });

  // เพิ่มเติม
  // Connect relationships between tables
  require('src/backend/db/relationships');

  /* GRAPHQL SCHEMA */
  // Pass in the schema to use for our internal GraphQL server.  Note we're
  // doing this inside a `SERVER` block to avoid importing a potentially large
  // file, which would then inflate our client bundle unnecessarily
  config.setGraphQLSchema(require('src/backend/graphql/schema').default);
  
  // เพิ่มเติม
  // Set-up CORS to allow credentials to be passed to origins outside of the
  // server.  We'll need this in order to test this out in development on :8080
  config.setCORSOptions({
    credentials: true,
  });

  /* CUSTOM ROUTES */

  // We can add custom routes to the web server easily, by using
  // `config.add<Get|Post|Put|Patch>Route()`.  Note:  These are server routes only.
  config.addGetRoute('/test', async ctx => {
    // For demo purposes, let's get a JSON dump of the current Redux state
    // to see that we can expect its contents
    const stateDump = JSON.stringify(ctx.store.getState());

    // Display a simple message, along with the Redux dump.  Note that this
    // won't contain a full `apollo` response, because it hasn't passed through
    // the React handler -- but it *does* mean we can still manipulate the state
    // from within our root, or fire action handlers!
    ctx.body = `Hello from your ReactQL route. Redux dump: ${stateDump}`;
  });

  // เพิ่มเติม
  // UPLOAD
  const parse = require('async-busboy')
  const fs = require('fs-extra')
  const path = require('path')
  config.addPostRoute('/upload', async (ctx, next) => {
    let prc = {}
    if ('POST' != ctx.request.method) return await next()
    
    const parts = await parse(ctx.req)
    // if (!parts.fields.csrf || appConfig.upload.csrf !== parts.fields.csrf) {
    if (!parts.fields.csrf) {
      prc = {
        error: true,
        message: 'Can not uplode: Your are not CSRF'
      }
      ctx.body = prc
      return await next()
    }

    // console.log(parts.fields.csrf, ' = ', jwt.verify(parts.fields.csrf, appConfig.token.secret), ' = ', appConfig.upload.csrf)
    if (jwt.verify(parts.fields.csrf, appConfig.token.secret) !== appConfig.upload.csrf) {
      prc = {
        error: true,
        message: 'Can not uplode: Invalid CSRF'
      }
      ctx.body = prc
      return await next()
    }
    
    let uploadedFiles = {}
    const folder_target = process.env.NODE_ENV == 'development' ? 'dev' : 'public'
    // const subDir = parts.fields.subdir || ''
    // const filepath = path.join('uploads', subDir)
    const subDirs = JSON.parse(parts.fields.subdirs) || {}
    const unlinks = JSON.parse(parts.fields.unlinks) || []
    for(let unlink of unlinks) {
      const fileForRm = path.join(__dirname, folder_target, 'uploads', unlink)
      if (fs.existsSync(fileForRm)) {
        fs.unlinkSync(fileForRm)
        // console.log('file %s is deleted.', fileForRm)
      }else{
        console.log('No file %s for unlink', fileForRm)
      }
    }
    // console.log(typeof(subDirs), subDirs)
    for(let part of parts.files) {
      const filename = Math.random().toString() + '_' + part.filename,
            filepath = path.join('uploads', subDirs.hasOwnProperty(part.fieldname) ? subDirs[part.fieldname] : ''),
            uploadDir = path.join(__dirname, folder_target, filepath)
      if (!fs.existsSync(uploadDir) && appConfig.upload.autoCreateDir){
        console.log(`Create recursive for => ${uploadDir} `)
        fs.mkdirpSync(uploadDir);
      }
      const uploadTarget = path.join(uploadDir, filename),
            stream = fs.createWriteStream(uploadTarget);
      part.pipe(stream);
      const fileurl = path.join(filepath, filename)
      uploadedFiles[part.fieldname] = {
        name: filename, 
        path: filepath, 
        url: fileurl
      }
      // console.log('uploading %s -> %s', part.filename, stream.path);
    }
    prc = {
      error: false,
      uploadedFiles
    }

    ctx.body = prc
  });



  /* PASSPORT.JS */
  const { User } = require('src/backend/db/user');
  const { createSession } = require('src/backend/db/session')
  const passport = require('koa-passport');
  const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

  // DB functions we'll need to handle login
  // const { createUserFromSocial } = require('src/backend/db/user');
  // const { createSession } = require('src/backend/db/session');

  // Set-up Facebook login strategy using the sample credentials that are
  // provided by Lee Benson's FB developer app account -- CHANGE THIS before
  // using in production, or you'll hit rate limits!
  passport.use(new GoogleStrategy(
    {
      clientID: appConfig.oauth2.google.clientID,
      clientSecret: appConfig.oauth2.google.clientSecret,
      callbackURL: `${getServerURL()}/auth/google/callback`,
    },
    // Callback function.  Use this to create the user if they don't already
    // exist
    async (token, tokenSecret, profile, done) => {
      // Attempt to create a new user. If the user already exists, this will
      // fail, so wrap this in a catch block (we can just log any failure)
      // console.log(profile)
      // console.log('-------------------------------------------')
      const email = profile.emails[0].value,
            username = email.split('@')[0],
            firstname = profile.name.givenName,
            lastname = profile.name.familyName;
      const user = await User.findOne({ where: { email } })
      // const googleProfile ={
      //   id: profile.id,
      //   token: tokenSecret,
      //   displayName: profile.displayName,
      //   email: profile.emails[0].value
      // }

      // let user = {};
      // try {
      //   user = await createUserFromSocial({
      //     email: profile.emails[0].value,
      //     firstName: profile.name.givenName,
      //     lastName: profile.name.familyName,
      //   });
      // } catch (e) {
      //   // eslint-disable-next-line
      //   console.log('User error:', e);
      // }
      done(null, user);
    },
  ));

  // Add the Passport.js middleware
  config.addMiddleware(passport.initialize());

  // Add the authorisation routes, for Facebook
  config.addGetRoute('/auth/google', passport.authenticate('google', {
    // Since we're not using sessions, turn `session` off
    session: false,

    // Get access to the fields we need
    scope: [
      'profile', 
      'email'
    ],
  }));

  config.addGetRoute('/auth/google/callback', async (ctx, next) => (
    // Since we need to attach a session to the user object here, we won't
    // use Passport's default handling.  Instead, we'll set our own 'inner
    // handler' and use that to attach a JWT to a new session we'll create
    passport.authenticate('google', { 
      session: false,
      // successRedirect: '/profile',
      // failureRedirect: '/' 
    }, async (e, user) => {
      if(!user) return ctx.redirect('/');

      const session = await createSession(user);
      // Create a JWT token, and store it on our common cookie
      ctx.cookies.set(appConfig.token.name, session.jwt(), {
        expires: session.expires_at,
      })

      // console.log('/auth/google/callback', user.toJSON())
      ctx.redirect('/');
    })(ctx, next)
  ));

  /* CUSTOM 404 HANDLER */

  // By default, if the server gets a route request that results in a 404,
  // it will set `ctx.status = 404` but continue to render the <NotFound>
  // block as normal.  If we want to add our own custom handler, we can use
  // `config.set404Handler()` as below.
  //
  // Note:  This only applies to SERVER routes.  On the client, the
  // <NotFound> block will *always* run.

  config.set404Handler(ctx => {
    // Like above, we'll grab a dump of the store state again -- this time,
    // it *will* contain a full `apollo` dump because in order to figure out that
    // a route has hit a 404, it will already have rendered the React chain
    // and retrieved any relevant GraphQL
    const stateDump = JSON.stringify(ctx.store.getState());

    // Explicitly set the return status to 404.  This is done for us by
    // default if we don't have a custom 404 handler, but left to the function
    // otherwise (since we might not always want to return a 404)
    ctx.status = 404;

    // Set the body
    ctx.body = `This route does not exist on the server - Redux dump: ${stateDump}`;
  });

  /* CUSTOM ERROR HANDLER */

  // By default, any exceptions thrown anywhere in the middleware chain
  // (including inside the `createReactHandler` func) will propogate up the
  // call stack to a default error handler that simply logs the message and
  // informs the user that there's an error.  We can override that default
  // behaviour with a func with a (e, ctx, next) -> {} signature, where `e` is
  // the error thrown, `ctx` is the Koa context object, and `next()` should
  // be called if you want to recover from the error and continue processing
  // subsequent middleware.  Great for logging to third-party tools, tc.
  config.setErrorHandler((e, ctx /* `next` is unused in this example */) => {
    // Mimic the default behaviour with an overriden message, so we know it's
    // working
    // eslint-disable-next-line no-console
    console.log('Error: ', e.message);
    ctx.body = 'Some kind of error. Check your source code.';
  });

  /* CUSTOM KOA APP INSTANTIATION */

  // If you need to do something with `app` outside of middleware/routing,
  // you can pass a func to `config.getKoaApp()` that will be fed the `app`
  // instance directly.
  config.getKoaApp(app => {
    // First, we'll add a new `engine` key to the app.context`
    // prototype (that per-request `ctx` extends) that can be
    // used in the middleware below, to set a `Powered-By` header.
    // eslint-disable-next-line no-param-reassign
    app.context.engine = 'ReactQL';

    // We'll also add a generic error handler, that prints out to the console.
    // Note: This is a 'lower-level' than `config.setErrorHandler()` because
    // it's not middleware -- it's for errors that happen at the server level
    app.on('error', e => {
      // This function should never show up, because `config.setErrorHandler()`
      // is already catching errors -- but just an FYI for what you might do.
      // eslint-disable-next-line no-console
      console.error('Server error:', e);
    });
  });

  /* CUSTOM MIDDLEWARE */

  // We can set custom middleware to be processed on the server.  This gives us
  // fine-grain control over headers, requests, responses etc, and even decide
  // if we want to avoid the React handler until certain conditions

  // There are two flavours of middleware -- `before` middleware, which
  // executes in Koa before the per-request Apollo client / Redux store has
  // been instantiated... and can be called with `confiig.addBeforeMiddleware`

  // ... and 'after' middleware, which runs after per-request instantiation.
  // Let's use the latter to add a custom header so we can see middleware in action
  config.addMiddleware(async (ctx, next) => {
    ctx.set('Powered-By', ctx.engine); // <-- `ctx.engine` from `config.getKoaApp()` above!

    // For the fun of it, let's demonstrate that we can fire Redux actions
    // and it'll manipulate the state on the server side!  View the SSR version
    // to see that the counter is now 1 and has been passed down the wire
    ctx.store.dispatch({ type: 'INCREMENT_COUNTER' });
    
    // เพิ่มเติม
    // Check the Authorization:` header or cookie for the JWT
    const authHeader = ctx.get('authorization') || ctx.cookies.get(appConfig.token.name);
    if (authHeader) {
      // Strip out the `Bearer` prefix, so we're left with just the JWT and
      // store it on Koa's `ctx.state``.  At this point, it's unverified, but
      // we'll leave it to the relevant GraphQL query to do the validation
      // at the time of the data request, rather than taking up extra CPU cycles
      ctx.state.jwt = authHeader.replace(/^bearer\s*/i, '');
    }

    // Always return `next()`, otherwise the request won't 'pass' to the next
    // middleware in the stack (likely, the React handler)
    return next();
  });
} else {
  /* BROWSER ONLY */

  // We don't bother running this stuff on the server, before it's simply
  // not relevant in that environment and/or could cause clashes (for example,
  // with Apollo middleware)

  // Set the Apollo CORS config, so that we can interpret `Set-Cookie`
  // headers for subsequent requests back to the SSR version
  config.setApolloNetworkOptions({
    credentials: 'include',
  });

  // Add Apollo request middleware to use the latest JWT token on every
  // request, so that our previously logged in state can be 'remembered'
  config.addApolloMiddleware((req, next) => {
    const jwt = localStorage.getItem(appConfig.token.name);
    req.options.headers = {
      ...req.options.headers,
      authorization: jwt || null,
    };
    next();
  });
}

// In app.js, we need to export the root component we want to mount as the
// starting point to our app.  We'll just export the `<Main>` component.
export default Main;
