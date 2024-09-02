import * as React from 'react';
import {Breakpoint} from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';

export interface HiddenProps {
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
  /**
   * Specify which implementation to use.  'js' is the default, 'css' works better for
   * server-side rendering.
   * @default 'js'
   */
  implementation?: 'js' | 'css';
  /**
   * You can use this prop when choosing the `js` implementation with server-side rendering.
   *
   * As `window.innerWidth` is unavailable on the server,
   * we default to rendering an empty component during the first mount.
   * You might want to use a heuristic to approximate
   * the screen width of the client browser screen width.
   *
   * For instance, you could be using the user-agent or the client-hints.
   * https://caniuse.com/#search=client%20hint
   */
  initialWidth?: Breakpoint;
  /**
   * If `true`, screens this size and down are hidden.
   * @default false
   */
  lgDown?: boolean;
  /**
   * If `true`, screens this size and up are hidden.
   * @default false
   */
  lgUp?: boolean;
  /**
   * If `true`, screens this size and down are hidden.
   * @default false
   */
  mdDown?: boolean;
  /**
   * If `true`, screens this size and up are hidden.
   * @default false
   */
  mdUp?: boolean;
  /**
   * Hide the given breakpoint(s).
   */
  only?: Breakpoint | Breakpoint[];
  /**
   * If `true`, screens this size and down are hidden.
   * @default false
   */
  smDown?: boolean;
  /**
   * If `true`, screens this size and up are hidden.
   * @default false
   */
  smUp?: boolean;
  /**
   * If `true`, screens this size and down are hidden.
   * @default false
   */
  xlDown?: boolean;
  /**
   * If `true`, screens this size and up are hidden.
   * @default false
   */
  xlUp?: boolean;
  /**
   * If `true`, screens this size and down are hidden.
   * @default false
   */
  xsDown?: boolean;
  /**
   * If `true`, screens this size and up are hidden.
   * @default false
   */
  xsUp?: boolean;
}

export default function Hidden(props: HiddenProps) {
  const {
    // implementation = 'js',
    lgDown = false,
    lgUp = false,
    mdDown = false,
    mdUp = false,
    smDown = false,
    smUp = false,
    xlDown = false,
    xlUp = false,
    xsDown = false,
    xsUp = false,
  } = props;
  const theme = useTheme();

  let matches;
  if (lgDown) {
    matches = useMediaQuery(theme.breakpoints.down('lg'));
  } else if (lgUp) {
    matches = useMediaQuery(theme.breakpoints.up('lg'));
  } else if (mdDown) {
    matches = useMediaQuery(theme.breakpoints.down('md'));
  } else if (mdUp) {
    matches = useMediaQuery(theme.breakpoints.up('md'));
  } else if (smDown) {
    matches = useMediaQuery(theme.breakpoints.down('sm'));
  } else if (smUp) {
    matches = useMediaQuery(theme.breakpoints.up('sm'));
  } else if (xlDown) {
    matches = useMediaQuery(theme.breakpoints.down('xl'));
  } else if (xlUp) {
    matches = useMediaQuery(theme.breakpoints.up('xl'));
  } else if (xsDown) {
    matches = useMediaQuery(theme.breakpoints.down('xs'));
  } else if (xsUp) {
    matches = useMediaQuery(theme.breakpoints.up('xs'));
  } else {
    matches = true;
  }

  return <>{!matches ? props.children : null}</>;
}
