import React from 'react';
import NextLink from 'next/link';
import {Button, Typography} from '@mui/material';
import clsx from 'clsx';
import {useRouter} from 'next/router';
import {ArrowRightAlt} from '@mui/icons-material';

interface LinkProp {
  children?: any;
  href?: string;
  className?: string;
  decorated?: boolean;
  passHref?: boolean;
  anchorProps?: any;
  target?: '_self' | '_blank' | '_parent' | '_top';

  [x: string]: any;
}

interface TextProp {
  children?: any;
  className?: string;

  [x: string]: any;
}

interface HeadingProp {
  children?: any;
  className?: string;
  centered?: boolean;

  [x: string]: any;
}

export const Link = ({
                       children,
                       style,
                       href = '',
                       className = '',
                       passHref = true,
                       target = '_self',
                       anchorProps = {},
                       ...props
                     }: LinkProp) => {
  return (
    <NextLink href={href} passHref={passHref} {...props}>
      <a
        href={href}
        target={target}
        className={className}
        style={style}
        {...anchorProps}>
        {children}
      </a>
    </NextLink>
  );
};

export const NavLink = ({
                          children,
                          style,
                          href = '',
                          className = '',
                          passHref = true,
                          target = '_self',
                          ...props
                        }: LinkProp) => {
  const route = useRouter();
  const active = route.pathname == href ? 'active' : '';
  return (
    <NextLink href={href} passHref={passHref} {...props}>
      <a href={href} className={clsx(className, active)} style={style} target={target}>
        {children}
      </a>
    </NextLink>
  );
};

export const Text = ({children, ...props}: TextProp) => (
  <Typography tabIndex={0} variant='body1' {...props}>
    {children}
  </Typography>
);

export const H1 = ({children, centered = false, ...props}: HeadingProp) => (
  <Typography
    variant='h1'
    tabIndex={0}
    style={centered ? {textAlign: 'center'} : {}}
    {...props}>
    {children}
  </Typography>
);

export const H2 = ({children, centered = false, ...props}: HeadingProp) => (
  <Typography
    variant='h2'
    tabIndex={0}
    style={centered ? {textAlign: 'center'} : {}}
    {...props}>
    {children}
  </Typography>
);

export const H3 = ({children, centered = false, ...props}: HeadingProp) => (
  <Typography
    variant='h3'
    tabIndex={0}
    style={centered ? {textAlign: 'center'} : {}}
    {...props}>
    {children}
  </Typography>
);

export const H4 = ({children, centered = false, ...props}: HeadingProp) => (
  <Typography
    variant='h4'
    tabIndex={0}
    style={centered ? {textAlign: 'center'} : {}}
    {...props}>
    {children}
  </Typography>
);

export const H5 = ({children, centered = false, ...props}: HeadingProp) => (
  <Typography
    variant='h5'
    tabIndex={0}
    style={centered ? {textAlign: 'center'} : {}}
    {...props}>
    {children}
  </Typography>
);

export const H6 = ({children, centered = false, ...props}: HeadingProp) => (
  <Typography
    variant='h6'
    tabIndex={0}
    style={centered ? {textAlign: 'center'} : {}}
    {...props}>
    {children}
  </Typography>
);

export const S1 = ({children, centered = false, ...props}: HeadingProp) => (
  <Typography
    variant='subtitle1'
    tabIndex={0}
    style={centered ? {textAlign: 'center'} : {}}
    {...props}>
    {children}
  </Typography>
);

export const S2 = ({children, centered = false, ...props}: HeadingProp) => (
  <Typography
    variant='subtitle2'
    tabIndex={0}
    style={centered ? {textAlign: 'center'} : {}}
    {...props}>
    {children}
  </Typography>
);

export const Body1 = ({children, centered = false, ...props}: HeadingProp) => (
  <Typography
    variant='body1'
    tabIndex={0}
    style={centered ? {textAlign: 'center'} : {}}
    {...props}>
    {children}
  </Typography>
);

export const Body2 = ({children, centered = false, ...props}: HeadingProp) => (
  <Typography
    variant='body2'
    tabIndex={0}
    style={centered ? {textAlign: 'center'} : {}}
    {...props}>
    {children}
  </Typography>
);

export const Caption = ({
                          children,
                          centered = false,
                          ...props
                        }: HeadingProp) => (
  <Typography
    variant='caption'
    style={centered ? {textAlign: 'center'} : {}}
    {...props}>
    {children}
  </Typography>
);

export const Hx = ({
                     children,
                     centered = false,
                     level = 'h2',
                     ...props
                   }: HeadingProp) => (
  <Typography
    variant={level}
    tabIndex={0}
    style={centered ? {textAlign: 'center'} : {}}
    {...props}>
    {children}
  </Typography>
);

export const SeeMoreLinkButton = ({
                                    href = '',
                                    label = '',
                                    color = 'primary',
                                    variant = 'outlined',
                                    ...props
                                  }: HeadingProp) => (
  <Link href={href} style={{display: 'inline-block'}} passhref>
    <Button
      variant={variant}
      color={color}
      endIcon={<ArrowRightAlt />}
      tabIndex={-1}
      style={{
        borderRadius: '10px',
      }}
      {...props}>
      {label}
    </Button>
  </Link>
);
