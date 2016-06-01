'use strict';

module.exports = modifiedNewtonRaphson;

function modifiedNewtonRaphson (f, fp, fpp, x0, options) {
  var x1, y, yp, ypp, tol, maxIter, iter, yph, ymh, yp2h, ym2h, h, hr, h2r, verbose, eps, denom;

  // Iterpret variadic forms:
  if (typeof fpp !== 'function') {
    if (typeof fp === 'function') {
      options = x0;
      x0 = fpp;
    } else {
      options = fpp;
      x0 = fp;
      fp = null;
    }
    fpp = null;
  }

  options = options || {};
  tol = options.tolerance === undefined ? 1e-7 : options.tolerance;
  eps = options.epsilon === undefined ? 2.220446049250313e-16 : options.epsion;
  maxIter = options.maxIterations === undefined ? 20 : options.maxIterations;
  h = options.h === undefined ? 1e-4 : options.h;
  verbose = options.verbose === undefined ? false : options.verbose;
  hr = 1 / h;
  h2r = hr * hr;

  iter = 0;
  while (iter++ < maxIter) {
    // Compute the value of the function:
    y = f(x0);

    // Compute the second derivative using a fourth order central difference:
    if (fpp) {
      yp = fp(x0);
      ypp = fpp(x0);
    } else {
      if (fp) {
        // Has first derivative specified:
        yp = fp(x0);

        // Evaluate first derivative to compute second numerically:
        yph = fp(x0 + h);
        ymh = fp(x0 - h);
        yp2h = fp(x0 + 2 * h);
        ym2h = fp(x0 - 2 * h);

        // Second derivative is first derivative of the first derivative:
        ypp = (8 * (yph - ymh) + (ym2h - yp2h)) * hr / 12;
      } else {
        // Needs first and second numerical derivatives:
        yph = f(x0 + h);
        ymh = f(x0 - h);
        yp2h = f(x0 + 2 * h);
        ym2h = f(x0 - 2 * h);

        yp = (8 * (yph - ymh) + (ym2h - yp2h)) * hr / 12;
        ypp = (-30 * y + 16 * (yph + ymh) - (yp2h + ym2h)) * h2r / 12;
      }
    }

    // Check for badly conditioned first derivative (extremely small relative to function):
    if (Math.abs(yp) <= eps * Math.abs(y)) {
      if (verbose) {
        console.log('Modified Newton-Raphson: failed to converged due to nearly zero first derivative');
      }
      return false;
    }

    denom = (yp * yp - y * ypp);

    if (denom === 0) {
      if (verbose) {
        console.log('Modified Newton-Raphson: failed to converged due to divide by zero');
      }
      return false;
    }

    // Update the guess:
    x1 = x0 - y * yp / denom;

    // Check for convergence:
    if (Math.abs(x1 - x0) <= tol * Math.abs(x1)) {
      if (verbose) {
        console.log('Modified Newton-Raphson: converged to x = ' + x1 + ' after ' + iter + ' iterations');
      }
      return x1;
    }

    // Transfer update to the new guess:
    x0 = x1;
  }

  if (verbose) {
    console.log('Modified Newton-Raphson: Maximum iterations reached (' + maxIter + ')');
  }

  return false;
}
