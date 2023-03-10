const { src, dest, parallel, series, watch } = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-imagemin');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
const tiny = require('gulp-tinypng-compress');
const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');

const fonts = () => {
    src('./src/fonts/**.ttf')
    .pipe(ttf2woff())
    .pipe(dest('./app/fonts/'))
    return src('./src/fonts/**.ttf')
    .pipe(ttf2woff2())
    .pipe(dest('./app/fonts/'))
}

const cb = () => {}

let srcFonts = './src/css/_fonts.scss';
let appFonts = './app/fonts/';

const fontsStyle = (done) => {
    let file_content = fs.readFileSync(srcFonts);

    fs.writeFile(srcFonts, '', cb);
    fs.readdir(appFonts, function (err, items) {
        if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
                let fontname = items[i].split('.');
                fontname = fontname[0];
                if (c_fontname != fontname) {
                    fs.appendFile(srcFonts, '@include font-face("' + fontname + '", "' + fontname + '", 400);\r\n', cb);
                }
                c_fontname = fontname;
            }
        }
    })

done();
}

const svgSprites = () => {
    return src('./src/img/svg/**.svg')
    .pipe(svgSprite({
        mode: {
            stack: {
                sprite: "../sprite.svg"
            }
        }
    }))
    .pipe(dest('./app/img'))
}

const styles = () => {
    return src('./src/css/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'expanded'
    }).on('error', notify.onError()))
    .pipe(rename({
        suffix:'.min'
    }))
    .pipe(autoprefixer({
        cascade: false,
    }))
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/css/'))
    .pipe(browserSync.stream())
}

const htmlInclude = () => {
    return src(['./src/*.html'])
    .pipe(fileInclude({
        prefix: '@',
        basepath: '@file'
    }))
    .pipe(dest('./app'))
    .pipe(browserSync.stream())
}

const imgToApp = () => {
    return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg'])
    .pipe(image())
    .pipe(dest('./app/img/'))
}

const clean = () => {
	return del(['app/*'])
}

const scripts = () => {
    return src('./src/js/main.js')
    .pipe(webpackStream({
        mode: 'development',
        output: {
            filename: 'main.js',
        },
        module: {
            rules: [{
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }]
        },
    }))
    .on('error', function(err) {
        console.error('WEBPACK ERROR', err);
        this.emit('end'); // Don't stop the rest of the task, ???? ???????????????????????????? ???????????????????? ?????????? ????????????
    })

    .pipe(sourcemaps.init())
	.pipe(uglify().on("error", notify.onError()))
	.pipe(sourcemaps.write('.'))
	.pipe(dest('./app/js'))
	.pipe(browserSync.stream());
}

const resources = () => {
    return src('./src/resources/**')
    .pipe(dest('./app'))
}

const script = () => {
  return src('./src/js/script/**')
  .pipe(dest('./app/js'))
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });

    watch('./src/css/**/*.scss', styles);
    watch('./src/**/*.html', htmlInclude);
  //  watch('./src/html/*.html', htmlInclude);
    watch('./src/img/**.jpg', imgToApp);
    watch('./src/img/**.png', imgToApp);
    watch('./src/img/**.jpeg', imgToApp);
    watch('./src/img/**/**.svg', svgSprites);
    watch('./src/resources/**', resources);
    watch('./src/fonts/**.ttf', fonts);
    watch('./src/fonts/**.ttf', fontsStyle);
    watch('./src/js/**/*.js', scripts);
    watch('.src/js/script/**', script);
}

exports.clean = clean;
exports.styles = styles;
exports.watchFiles = watchFiles;
exports.fileInclude = fileInclude;

exports.default = series( clean, parallel ( htmlInclude, scripts, fonts, resources, imgToApp, svgSprites, script ), fontsStyle, styles, watchFiles );

// BUILD
const tinypng = () => {
    return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg'])
    .pipe(tiny({
        key: 'ADD LOCK',
        sigFile: '.app/img/.tinypmg-sigs',
        parallel: true,
        parallelMax: 50, // ???????????? ???? ???????????????????? ???????????????????????????? ????????????????????
        log: true
    }))
    .pipe(dest('./app/img'))
}

const stylesBuild = () => {
    return src('./src/css/**/*.scss')
    .pipe(sass({
        outputStyle: 'expanded'
    }).on('error', notify.onError()))
    .pipe(rename({
        suffix:'.min'
    }))
    .pipe(autoprefixer({
        cascade: false,
    }))
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(dest('./app/css/'))
}

const scriptsBuild = () => {
    return src('./src/js/main.js')
    .pipe(webpackStream({
        mode: 'development',
        output: {
            filename: 'main.js',
        },
        module: {
            rules: [{
                test: /\.m?js$/,
                exclude: /(node_modules|bowel_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                    presets: ['@babel/preset-env']
                    }
                }
            }]
        },
    }))
    .on('error', function(err) {
        console.error('WEBPACK ERROR', err);
        this.emit('end'); // Don't stop the rest of the task, ???? ???????????????????????????? ???????????????????? ?????????? ????????????
    })

    .pipe(uglify().on("error", notify.onError()))
    .pipe(dest('./app/js'))
}

exports.build = series( clean, parallel ( htmlInclude, scriptsBuild, fonts, resources, imgToApp, svgSprites, script ), fontsStyle, stylesBuild, tinypng );

// deploy
const deploy = () => {
	let conn = ftp.create({
		host: '',
		user: '',
		password: '',
		parallel: 10,
		log: gutil.log
	});

	let globs = [
		'app/**',
	];

	return src(globs, {
			base: './app',
			buffer: false
		})
		.pipe(conn.newer('')) // only upload newer files, ?????????????????? ???????????? ?????????? ??????????
		.pipe(conn.dest(''));
}

exports.deploy = deploy;
