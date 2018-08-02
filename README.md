# Celebhairbycecilia

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.2.

## Script Caveats:
### Image scripts
For 'rpi' (refresh-portfolio-images) and 'rpj' (refresh-portfolio-json) scripts, on Windows, the best way to run them is from Windows-Subsystem-for-Linux (ubuntu1804 etc) - The image
scripts depend on 'imagemagick' library which is not installed on windows though is easily installable via `$ apt-get` 
(for ubuntu, on windows (wsl) check 'ubuntu package universe' for imagemagick version for your platform (if necessary)).
#### Pre-requisites for image scripts
- 'imagemagick' - `$ sudo apt-get install imagemagick gcc g++ make`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
