const svg = `<svg id='svg' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 595.276 841.89'>
  <g id='classic-graphics'>
    <g>
      <g id='cv-header'>
        <text transform='translate(235 15)' font-size='17' fill='#231f20' font-family='ArialMT, Arial' x='0' y='0'><tspan x='0' y='10'>
          <tspan>Curriculam Vitae</tspan>
        </text>
      </g>
      <!--<path d="M235.529,27.013v-.9H359.747v.9Z" fill="#231f20"/>-->
    </g>
    <line x1='18' y1='185.12' x2='578' y2='185.12' fill='none' stroke='#bcbec0' stroke-miterlimit='10'/>
    <g id='contact-address'>
      <text transform='translate(18 71)' font-size='13.5' fill='#231f20' font-family='ArialMT, Arial' x='0' y='0'><tspan x='0' y='10'>
        <tspan>Contact&amp;Address</tspan>
      </text>
    </g>

  </g>
  <g id='classic-data'>
    <g id='address2'>
      <rect x='18' y='155.647' width='438' height='25' fill='#bcbec0'/>
      <text transform='translate(18 136.239)' font-size='12' fill='#231f20' font-family='ArialMT, Arial'> </text>
    </g>
    <g id='address'>
      <rect x='18' y='127.647' width='438' height='25' fill='#bcbec0'/>
      <text transform='translate(18 136.239)' font-size='12' fill='#231f20' font-family='ArialMT, Arial'> </text>
    </g>
    <g id='email'>
      <rect x='18' y='109.333' width='450.631' height='13.314' fill='#bcbec0'/>
      <text transform='translate(18 117.925)' font-size='12' fill='#231f20' font-family='ArialMT, Arial'> </text>
    </g>
    <g id='phone'>
      <rect x='18' y='91.019' width='450.631' height='13.314' fill='#bcbec0'/>
      <text transform='translate(18 99.61)' font-size='12' fill='#231f20' font-family='ArialMT, Arial'> </text>
    </g>
    <g id='name'>
      <rect x='18' y='49.186' width='450.631' height='13.314' fill='#bcbec0'/>
      <text transform='translate(18 57.777)' font-size='14' fill='#231f20' font-family='ArialMT, Arial'> </text>
    </g>
    
    <g id='photo'>
      <image width='512' height='512' transform='translate(450 36.186) scale(0.25)' xlink:href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAgMAAACJFjxpAAAADFBMVEXFxcX////p6enW1tbAmiBwAAAFiElEQVR4AezAgQAAAACAoP2pF6kAAAAAAAAAAAAAAIDbu2MkvY0jiuMWWQoUmI50BB+BgRTpCAz4G6C8CJDrC3AEXGKPoMTlYA/gAJfwETawI8cuBs5Nk2KtvfiLW+gLfK9m+r3X82G653+JP/zjF8afP1S//y+An4/i51//AsB4aH+/QPD6EQAY/zwZwN8BAP50bh786KP4+VT+3fs4/noigEc+jnHeJrzxX+NWMDDh4g8+EXcnLcC9T8U5S/CdT8bcUeBEIrwBOiI8ki7Ba5+NrePgWUy89/nYyxQ8Iw3f+pWY4h1gb3eAW7sDTPEOsLc7wK1TIeDuDB+I/OA1QOUHv/dFsZQkhKkh4QlEfOULYz2nGj2/Nn1LmwR/86VxlCoAW6kCsHRGANx1RgCMo5Qh2EsZgrXNQZZShp5Liv7Il8eIc5C91EHY2hxk6bwYmNscZIReDBwtCdhbErC1JGBpScBcOgFMLQsZMQs5Whayd+UQsLYsZGlZyNyykKllISNmIUfAwifw8NXvTojAjGFrdYi11SGWVoeYWx1i6lmQCiEjFkKOVgjZ+xxIhZCtFULWHkCqxCw9gNQKmP9vNHzipdEPrRcxtVbAeDkAvve0iM2QozVD9hfjhp4YP/UrkJYDbD2AtBxgfSkAvvHEeNcDSAsilgtAWxIy91J8AXgZAJ5e33+4tuACcAG4AFwALgBXRXQB6AFcB5MXAuA6nl9/0Vx/011/1V5/1/dfTPJvRtdnu/zL6beeFO/7r+fXBYbrEkt/j+i6ytXfpuvvE/ZXOnsA/a3a/l5xf7O6v1t+Xe/vOyz6HpO8yyboM8o7rfJes77bru83THk48p7TvOs27zvOO6/73vO++z7l4cgnMPQzKPopHC0N9noSSz6LJp/Gk88jyicy5TOp6qlc+VyyfDJbPpuuns6XzyfMJzTmMyrrKZ35nNJ8Ums+q7af1tvPK+4nNodEnPKp3fnc8npyez67/qVP7+/fL8hfcMjfsOhf8cjfMclfcnn9+BkOnLECP8Q58OYeyJ40eoyF6Ee/En/JHlP6mIlRVXprF4BxtAvArV0AxtEuALd2ARhHuwDc2gVgHPX/hFv9fMBddjIGeKg/WCxlCsI46u+Ga5mCcJd+sIG9UkGAW32ZbApFAHhod4Bb3eo04h3god0BbiUHYApVCNjbHeBW+QDAXT4a7qg7r7e214057vg0QhkEHkoSwq0kIdydXw4/Q3H8hjYJ3vL0WConBJhCHQaOToeBrU0BljYFmEoVgHGUKgAPnREAt84IgLuqFgAYSUEOAHszDwuAtSkHAZhLGYIpdCLgKGUIHtocZG1zkLmUIRhxDnJU1RDA1uYga5uDzKUOwhTnIEfnxcDe5iBrcyQAYGlzkKkUYhhxDrKXQgxbSwLWUohhbknA1JKAEZOAvSUBW0sC1pYEzC0JmFoSMMJyCDhaFrK3JGDtyiFgaVnI3LKQqWUhI2YhR8tC9paFrC0LWVoWMrcsZGpZyIhZyNGykL2rSIGtlQHWVgZYWhlgbmWAqZUBRiwDHK0MsLcywNbKAGsOoNUhllaHmFsdYmp1iBHrEEerQ+w5gFYI2VodYm11iKXVIeYcQCuETK0QMmIh5MgBtELI3gohWyuErDmAVolZWiFkzgG0SszUKjGjfj6gVmKOVonZcwCtFbB9HQC+ozWDbz1bvGu9iKW1AuYcQOtFTLEX1GbIaFegN0OOHEBrhuw5gNYM2XIArRuz5gDacoB3bTnAEktxXQ4wfw0AvveM8b4tiJjSJOwLIsbXsAKeNeKCiOO3D+AVbUl0AfjGs8ZPbUnIdgFoa1LWC0BblfMuB9AeC1j6gqQE0J9LmC8AOYD2ZMb7i4bt2ZTpWoHfPoB7Tj2fXzT8N1X41vkq/QHOAAAAAElFTkSuQmCC'/>
    </g>

    <g id='cv-body0'></g>
  </g>
</svg>
`;
export default svg;
