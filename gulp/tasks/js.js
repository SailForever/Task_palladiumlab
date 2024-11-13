import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import concat from 'gulp-concat';

export const js = () => {
  // Поток для несжатого файла без jQuery
  const mainScript = app.gulp.src(app.path.src.js)
    .pipe(concat('app.js')) // 
    .pipe(app.gulp.dest(app.path.build.js)); // сохраняем без jQuery и сжатия

  // Поток для сжатого файла с jQuery
  const mainScriptWithJquery = app.gulp.src([
      'node_modules/jquery/dist/jquery.js', // добавляем jQuery
      'node_modules/jquery-mask-plugin/dist/jquery.mask.js',
      app.path.src.js // основной JavaScript
    ])
    .pipe(concat('app.min.js')) // объединяем в один файл
    .pipe(uglify()) // сжимаем
    .pipe(app.gulp.dest(app.path.build.js)); // сохраняем в .min.js

  return Promise.all([mainScript, mainScriptWithJquery])
    .then(() => app.plugins.browsersync.stream());
};