const AccessibilityToolbarCSS = `

html.monochrome {
  filter: grayscale(100%) contrast(120%);
}
html.inverted {
  filter: invert(75%) contrast(120%);
}
html.inverted.monochrome {
  filter: grayscale(100%) invert(75%) contrast(120%);
}
html.bigCursor, html.bigcursor * {
  cursor: url('/images/cursor.svg'), auto !important 
}
html.highlightLinks a {
  background-color: #cde400 !important;
  color: black !important; 
}
html.highlightHeadings h1,
html.highlightHeadings h2,
html.highlightHeadings h3,
html.highlightHeadings h4,
html.highlightHeadings h5,
html.highlightHeadings h6
{
  background-color: #cde400 !important;
  color: black !important;
}
html.guide #readingGuide {
  background-color: #cde400;
  display: block !important;
}
html.fontsize-16 { font-size: 16px; }
html.fontsize-18 { font-size: 18px; }
html.fontsize-20 { font-size: 20px; }
html.fontsize-22 { font-size: 22px; }
html.fontsize-24 { font-size: 24px; }
html.fontsize-26 { font-size: 26px; }
html.fontsize-28 { font-size: 28px; }
html.fontsize-30 { font-size: 30px; }
html.fontsize-32 { font-size: 32px; }
html.fontsize-34 { font-size: 34px; }
html.fontsize-36 { font-size: 36px; }

`;

export default AccessibilityToolbarCSS;
