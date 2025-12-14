const express = require('express');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ВАЖНО: Точный Callback URL
const CALLBACK_URL = 'http://localhost:3000/auth/yandex/callback'; // Жестко закодируем

const YANDEX_CLIENT_ID = process.env.YANDEX_CLIENT_ID || 'a538e99ca8e94c8198148432fa5e28dd';
const YANDEX_CLIENT_SECRET = process.env.YANDEX_CLIENT_SECRET || 'd2a78a54fa09430c921ff83265667c82';

// Диагностика
console.log('='.repeat(60));
console.log('🔍 ДИАГНОСТИКА:');
console.log('='.repeat(60));
console.log('PORT:', PORT);
console.log('CALLBACK_URL:', CALLBACK_URL);
console.log('Client ID:', YANDEX_CLIENT_ID ? '✓ есть' : '✗ нет');
console.log('='.repeat(60));

if (!YANDEX_CLIENT_ID || !YANDEX_CLIENT_SECRET) {
    console.error('❌ ОШИБКА: Не заданы Яндекс OAuth ключи');
    process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'simple-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

// Стратегия с жестко заданным Callback URL
passport.use('yandex', new OAuth2Strategy({
    authorizationURL: 'https://oauth.yandex.ru/authorize',
    tokenURL: 'https://oauth.yandex.ru/token',
    clientID: YANDEX_CLIENT_ID,
    clientSecret: YANDEX_CLIENT_SECRET,
    callbackURL: CALLBACK_URL, // Жестко заданный URL
    state: true
}, (accessToken, refreshToken, params, profile, done) => {
    console.log('✅ Яндекс OAuth успешен!');
    
    const user = {
        id: `yandex-${Date.now()}`,
        displayName: 'Пользователь Яндекс',
        email: 'user@yandex.ru',
        provider: 'yandex',
        accessToken: accessToken ? 'получен' : 'нет',
        oauthSuccess: true
    };
    
    return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use((req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();
    res.locals.user = req.user;
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

// Главная
app.get('/', (req, res) => {
    res.render('index', { title: 'Яндекс OAuth' });
});

// OAuth маршруты
app.get('/auth/yandex', passport.authenticate('yandex'));

app.get('/auth/yandex/callback',
    passport.authenticate('yandex', { 
        failureRedirect: '/',
        failureMessage: true 
    }),
    (req, res) => {
        console.log('✅ Пользователь авторизован через Яндекс');
        res.redirect('/profile');
    }
);

// Профиль
app.get('/profile', (req, res) => {
    if (!req.user) return res.redirect('/');
    res.render('profile', { title: 'Профиль' });
});

// Тестовый вход
app.get('/auth/test', (req, res) => {
    req.login({
        id: 'test-user',
        displayName: 'Тестовый пользователь',
        email: 'test@yandex.ru',
        provider: 'yandex',
        isTest: true
    }, (err) => {
        if (err) return res.redirect('/');
        res.redirect('/profile');
    });
});

// Диагностика Callback URL
app.get('/debug-callback', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Debug Callback URL</title>
            <style>
                body { font-family: Arial; padding: 20px; max-width: 800px; margin: 0 auto; }
                pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
                .correct { color: green; font-weight: bold; }
                .incorrect { color: red; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>🔍 Диагностика ошибки "redirect_uri не совпадает"</h1>
            
            <h3>Текущая конфигурация:</h3>
            <ul>
                <li>Порт: ${PORT}</li>
                <li>Callback URL в коде: <pre>${CALLBACK_URL}</pre></li>
                <li>Client ID: ${YANDEX_CLIENT_ID.substring(0, 10)}...</li>
            </ul>
            
            <h3>Что должно быть в Яндекс OAuth:</h3>
            <p>Перейдите по ссылке: <a href="https://oauth.yandex.ru/client/${YANDEX_CLIENT_ID}" target="_blank">
                https://oauth.yandex.ru/client/${YANDEX_CLIENT_ID}
            </a></p>
            
            <p>В разделе <strong>"Redirect URI для веб-сервисов"</strong> должно быть:</p>
            <pre>http://localhost:3000/auth/yandex/callback</pre>
            
            <h3>Быстрые действия:</h3>
            <ol>
                <li><a href="https://oauth.yandex.ru/client/${YANDEX_CLIENT_ID}" target="_blank">Открыть настройки приложения</a></li>
                <li>Проверить Redirect URI</li>
                <li>Если не совпадает - изменить на: <code>${CALLBACK_URL}</code></li>
                <li>Сохранить изменения</li>
                <li><a href="/auth/yandex">Попробовать OAuth снова</a></li>
            </ol>
            
            <h3>Тестирование:</h3>
            <p><a href="/auth/yandex" style="padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none;">🔑 Попробовать OAuth</a></p>
            <p><a href="/" style="padding: 10px 20px; background: #2196F3; color: white; text-decoration: none;">🏠 На главную</a></p>
        </body>
        </html>
    `);
});

// Выход
app.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/'));
});

// Запуск
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 Сервер запущен на порту ' + PORT);
    console.log('='.repeat(60));
    console.log(`📍 Главная: http://localhost:${PORT}`);
    console.log(`🔑 OAuth вход: http://localhost:${PORT}/auth/yandex`);
    console.log(`🔍 Диагностика: http://localhost:${PORT}/debug-callback`);
    console.log(`🧪 Тестовый вход: http://localhost:${PORT}/auth/test`);
    console.log('='.repeat(60));
    console.log('\n⚠️  Callback URL должен быть в Яндекс OAuth:');
    console.log('   ' + CALLBACK_URL);
    console.log('='.repeat(60));
});