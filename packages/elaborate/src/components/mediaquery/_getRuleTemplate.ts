import mapNext from './_mapNext';
import mapNextNumber from './_mapNextNumber';
import strBreakpointJoin from './_stringBreakpointJoin';
import stripUnit from '../stripUnit';
import {BreakpointsProps,HidpiBreakpointsProps,Breakpoints,HidpiBreakpoints} from './mediaQuery';
import em from '../em';

const warning = require('warning');

/**
 * Generates a media query for dpi.
 *
 * @param {null | string} bpMin
 * @param {number} stdWebDpi
 * @param {null | string} bpMax
 *
 * @return {string}
 */
const generateDpiMediaQuery = (
  bpMin: null | number | string,
  stdWebDpi: number,
  bpMax: null | number | string,
): string => {
  let bpMinSize = bpMin;
  let bpMaxSize = bpMax;

  if (typeof bpMinSize === 'string') {
    bpMinSize = stripUnit(bpMinSize);
  }

  if (typeof bpMaxSize === 'string') {
    bpMaxSize = stripUnit(bpMaxSize);
  }

  // Generate values in DPI instead of DPPX for an IE9-11/Opera mini compatibility.
  // See https://caniuse.com/#feat=css-media-resolution
  const bpMinDpi =
    bpMinSize !== null ? `${+bpMinSize * stdWebDpi}dpi` : bpMinSize;
  const bpMaxDpi =
    bpMaxSize !== null
      ? `${parseFloat(`${+bpMaxSize * stdWebDpi}`).toFixed(0)}dpi`
      : bpMaxSize;

  const onlyScreen = 'only screen and ';

  if (bpMaxSize !== null) {
    bpMaxSize = parseFloat(`${bpMaxSize}`).toFixed(5);
  }

  let template = onlyScreen + strBreakpointJoin(
    bpMinSize,
    bpMaxSize,
    '-webkit-min-device-pixel-ratio',
    '-webkit-max-device-pixel-ratio',
  );

  if (template !== '') {
    template += ', ';
  }

  template += onlyScreen + strBreakpointJoin(
    bpMinSize,
    bpMaxSize,
    'min--moz-device-pixel-ratio',
    'max--moz-device-pixel-ratio',
  );

  if (template !== '') {
    template += ', ';
  }

  template += onlyScreen + strBreakpointJoin(
    bpMinSize !== null ? `${bpMinSize}/1` : null,
    bpMaxSize !== null ? `${bpMaxSize}/1` : null,
    '-o-min-device-pixel-ratio',
    '-o-max-device-pixel-ratio',
  );

  if (template !== '') {
    template += ', ';
  }

  return (
    template + onlyScreen +
    strBreakpointJoin(bpMinDpi, bpMaxDpi, 'min-resolution', 'max-resolution')
  );
};

/**
 * Generates a media query template string matching the input value.
 *
 * @param {string}                value
 * @param {BreakpointsProps}      breakpoints
 * @param {string}                printBreakpoint
 * @param {HidpiBreakpointsProps} hidpiBreakpoints
 *
 * @return {null | string}
 */
export default function(
  value: string,
  breakpoints: BreakpointsProps = Breakpoints,
  printBreakpoint: string = 'large',
  hidpiBreakpoints: HidpiBreakpointsProps = HidpiBreakpoints,
): string {
  const split = value.split(' ');
  // Web standard Pixels per inch. (1ddpx / $std-web-dpi) = 1dpi
  // See https://www.w3.org/TR/css-values-3/#absolute-lengths
  const stdWebDpi = 96;
  // Direction of media query (up, down, or only)
  const direction = split.length > 1 ? split[1] : 'up';
  const pbp = breakpoints[printBreakpoint];

  // Size or keyword
  let bp: string | number = split[0];
  // Value of the following breakpoint
  let bpNext: null | number = null;
  // Value for min-width media queries
  let bpMin: null | number | string = null;
  // Value for max-width media queries
  let bpMax: null | number | string = null;
  // If named, name of the breakpoint
  let name: null | string = null;
  // If the breakpoint is a HiDPI breakpoint
  let hidpi = false;

  if (bp === 'landscape' || bp === 'portrait') {
    return `(orientation: ${bp})`;
  }

  if (bp === 'retina') {
    return 'only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi)';
  }

  // Since NaN is the only JavaScript value that is treated as unequal to itself (DON`T REMOVE the +bp !== +bp check)
  // eslint-disable-next-line no-self-compare
  if (+bp !== +bp) {
    if (bp in breakpoints) {
      name = bp;
      bp = breakpoints[name];
      bpNext = mapNext(breakpoints, name);
    } else if (bp in hidpiBreakpoints) {
      name = bp;
      bp = hidpiBreakpoints[name];
      bpNext = mapNextNumber(hidpiBreakpoints, +bp);
      hidpi = true;
    } else {
      warning(
        true,
        `media-queries: ${value} is not defined in your "breakpoints" or "breakpoints-hidpi" setting.`,
      );
    }

    if (name === null && direction === 'only') {
      throw new Error(
        'breakpoint: Only named media queries can have an "only" range.',
      );
    }
  }

  // Conditions to skip media query creation
  // - It's a named breakpoint that resolved to "0 down" or "0 up"
  // - It's a numeric breakpoint that resolved to "0 " + anything
  if (bp > '0' || bp > 0 || direction === 'only' || direction === 'down') {

    // Only 'only' and 'up' have a min limit.
    if (direction === 'only' || direction === 'up') {
      if (hidpi) {
        bpMin = typeof bp === 'string' ? stripUnit(bp) : bp;
      } else {
        bpMin = em(bp);
      }
    }

    // Only 'only' and 'down' have a max limit.
    if (direction === 'only' || direction === 'down') {
      if (name === null) {
        if (hidpi) {
          bpMax = typeof bp === 'string' ? stripUnit(bp) : bp;
        } else {
          bpMax = em(bp);
        }
      } else if (bpNext !== null) {
        // If the breakpoint is named, the max limit is the following breakpoint - 1px.
        if (hidpi) {
          bpMax = bpNext - 1 / stdWebDpi;
        } else {
          bpMax = bpNext - 1 <= 0 ? '0' : `${+stripUnit(em(bpNext)) - 1 / 16}em`;
        }
      }
    }

    // Generate the media query string from min and max limits.
    if (hidpi) {
      return generateDpiMediaQuery(bpMin, stdWebDpi, bpMax);
    }

    let media = strBreakpointJoin(bpMin, bpMax);

    // For named breakpoints less than or equal to printBreakpoint, add print to the media types
    if (media !== '' && (bp <= pbp || direction === 'down')) {
      media = `print, ${media}`;
    }

    return media;
  }

  return '';
}
