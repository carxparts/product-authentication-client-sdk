// typescript gulp example
var gulp = require("gulp");
var del = require("del");
var ts = require("gulp-typescript");
var uglify = require("gulp-uglify");
const webpack = require("webpack-stream");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const outputDist = "./lib";
const InputDist = "./src";

const webpackConfig = {
  mode: "production",
  devtool: false,
  output: {
    filename: "productAuthentication.umd.min.js",
    // libraryTarget: "var",
    libraryTarget: "umd",
    library: "carxparts",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: "/node_modules/",
      },
    ],
  },
  plugins: [
    // new BundleAnalyzerPlugin()
  ],
};

gulp.task("clean", function () {
  return del(["lib", "coverage", "dist"]);
});

gulp.task("ts-compile-commonjs", function () {
  let tsProject = ts.createProject("tsconfig.json", {
    module: "commonjs",
    declaration: false,
  });
  return gulp
    .src(`${InputDist}/*.ts`)
    .pipe(tsProject())
    .pipe(uglify())
    .pipe(gulp.dest(`${outputDist}/js`));
});

// gulp.task("ts-compile-es6", function () {
//   let tsProject = ts.createProject("tsconfig.json", {
//     module: "es6",
//     declaration: false,
//   });
//   return gulp
//     .src(`${InputDist}/*.ts`)
//     .pipe(tsProject())
//     .pipe(uglify())
//     .pipe(gulp.dest(`${outputDist}/es6`));
// });

gulp.task("ts-compile-onlyDeclaration", function () {
  let tsProject = ts.createProject("tsconfig.json", {
    module: "commonjs",
    declaration: true,
    emitDeclarationOnly: true,
  });
  return gulp
    .src(`${InputDist}/*.ts`)
    .pipe(tsProject())
    .pipe(gulp.dest(`${outputDist}/d_ts`));
});

gulp.task("ts-compile-webpack", function () {
  return gulp
    .src(`${InputDist}/*.ts`)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(`${outputDist}/bundle`));
});

gulp.task(
  "ts-compile",
  gulp.parallel(
    "ts-compile-commonjs",
    // "ts-compile-es6",
    "ts-compile-onlyDeclaration",
    "ts-compile-webpack"
  )
);
const defaultRun = gulp.series("clean", "ts-compile");

gulp.task("watch", function () {
  return gulp.watch(`${InputDist}/*.ts`, defaultRun);
});

gulp.task("default", defaultRun);
