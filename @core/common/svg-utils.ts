const fn = {
  text(str = '') {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  },
  camToHyp(str = '') {
    let mat = str.match(/([A-Z])/g);
    for (let m in mat) {
      // @ts-ignore
      str = str.replace(mat[m], '-' + mat[m].toLowerCase());
    }
    return str;
  },
  hypToCam(str = '') {
    let mat = str.match(/(-[a-z])/g);
    for (let m in mat) {
      // @ts-ignore
      str = str.replace(mat[m], mat[m].replace('-', '').toUpperCase());
    }
    return str;
  },
};

type func = (...args: any) => any;

class jElement {
  // private __rules:object;
  public __props: any;
  public _: HTMLElement;
  public [0]: HTMLElement;

  constructor(sel: string | HTMLElement | Node) {
    let elem: any = typeof sel == 'string' ? document.querySelector(sel) : sel;
    if (elem === null) {
      let parent = document.createElement('div');
      elem = document.createElement('div');
      parent.appendChild(elem);
    }
    // this.__rules = {};
    this.__props = {};
    this._ = elem;
    this[0] = elem;
  }

  __buildStyles() {}

  after(htmlString: string) {
    this._.insertAdjacentHTML('afterend', htmlString);
    return this;
  }

  addClass(className: string) {
    this._.classList.add(className);
    return this;
  }

  append(el: HTMLElement | jElement) {
    if (el instanceof jElement) this._.appendChild(el[0]);
    else this._.appendChild(el);
    return this;
  }

  appendTo(el: HTMLElement | jElement) {
    if (el instanceof jElement) el.append(this._);
    else el.appendChild(this._);
    return this;
  }

  attr_void(att: string, val: string | undefined) {
    if (typeof val == 'string') {
      this._.setAttribute(att, val);
      return this;
    } else return this._.getAttribute(att);
  }

  attr(attrib: any, val?: string | number) {
    let dict: any = {};
    let hasVal = typeof val == 'string' || typeof val == 'number';
    if (typeof attrib == 'string' && !hasVal) {
      // @ts-ignore
      return this._.getAttribute(attrib);
    }
    if (typeof attrib == 'string' && hasVal) {
      dict[attrib] = val;
    } else dict = attrib;
    // this._.style = fn.extend(this._.style, sty);
    for (let a in dict) {
      // @ts-ignore
      this._.setAttribute(a, dict[a]);
    }
    return this;
  }

  before(htmlString: string) {
    this._.insertAdjacentHTML('beforebegin', htmlString);
    return this;
  }

  children(sel?: string) {
    if (typeof sel == 'string') {
      // @ts-ignore
      return [...this._.children].filter((c) => c.matches(sel));
    }
    //.map(c => new jElement(c));
    else {
      // @ts-ignore
      return [...this._.children];
    } //.map(c => new jElement(c));
  }

  clone() {
    return $(this._.cloneNode(true));
  }

  contains(child: HTMLElement | string) {
    if (typeof child == 'string') return this._.querySelector(child) !== null;
    else return this._ !== child && this._.contains(child);
  }

  css(prop: any, val?: string | number) {
    let sty: any = {};
    let hasVal = typeof val == 'string' || typeof val == 'number';
    if (typeof prop == 'string' && !hasVal) {
      // @ts-ignore
      return window.getComputedStyle(this._)[prop];
    }
    if (typeof prop == 'string' && hasVal) {
      sty[fn.hypToCam(prop)] = val;
    } else sty = prop;
    // this._.style = fn.extend(this._.style, sty);
    for (let p in sty) {
      // @ts-ignore
      this._.style[p] = sty[p];
    }
    return this;
  }

  data(dat: string, val?: string) {
    return this.attr('data-' + dat, val);
  }

  empty(completely = false) {
    this._.innerHTML = completely ? '' : ''; // '<style id="--style-rules"></style>';//
    // this._.innerHTML = '';
    return this;
  }

  find(sel: string) {
    // @ts-ignore
    return [...this._.querySelectorAll(sel)];
  }

  hasClass(className: string) {
    return this._.classList.contains(className);
  }

  html(con?: string | number) {
    if (typeof con == 'string' || typeof con == 'number') {
      this._.innerHTML = '' + con;
      this.__buildStyles();
      return this;
    } else {
      return this._.innerHTML;
    }
  }

  is(sel: string) {
    return this._.matches(sel);
  }

  next() {
    return this._.nextElementSibling;
  }

  off(eventName: string, eventHandler: func) {
    this._.removeEventListener(eventName, eventHandler);
    return this;
  }

  offset() {
    let rect = this._.getBoundingClientRect();
    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft,
    };
  }

  on(eventName: string, eventHandler: func) {
    this._.addEventListener(eventName, eventHandler.bind(this._));
    return this;
  }

  one(eventName: string, eventHandler: func) {
    let handle = (e: any) => {
      eventHandler.bind(this._)(e);
      this._.removeEventListener(eventName, handle);
    };
    this._.addEventListener(eventName, handle);
    return this;
  }

  parent() {
    return this._.parentNode;
  }

  position() {
    return {left: this._.offsetLeft, top: this._.offsetTop};
  }

  prepend(el: HTMLElement | jElement) {
    const elm = el instanceof jElement ? el[0] : el;
    if (this._.firstChild) this._.insertBefore(elm, this._.firstChild);
    else this._.append(elm);
    return this;
  }

  prependTo(el: HTMLElement | jElement) {
    const elm = el instanceof jElement ? el[0] : el;
    if (elm.firstChild) elm.insertBefore(this._, elm.firstChild);
    else elm.appendChild(this._);
    return this;
  }

  insertBefore(el: HTMLElement | jElement) {
    const elm = el instanceof jElement ? el[0] : el;
    elm.parentNode?.insertBefore(this._, elm);
    return this;
  }

  insertAfter(el: HTMLElement | jElement) {
    const elm = el instanceof jElement ? el[0] : el;
    elm.parentNode?.insertBefore(this._, elm.nextSibling);
    return this;
  }

  prev() {
    return this._.previousElementSibling;
  }

  prop(dat: string, val = undefined) {
    if (val == undefined) return this.__props[dat];
    this.__props[dat] = val;
    // Object.defineProperty(this, 'trii', {
    // 	get: function() {
    // 		return 2;
    // 	},
    // 	set: function(val) {
    //
    // 	}
    // });
    return this;
  }

  remove() {
    this._.parentNode?.removeChild(this._);
    return this;
  }

  removeAttr(att: string) {
    this._.removeAttribute(att);
    return this;
  }

  removeClass(className: string) {
    this._.classList.remove(className);
    return this;
  }

  removeData(dat: string) {
    return this.removeAttr('data-' + dat);
  }

  removeProp(dat: string) {
    this.__props[dat] = undefined;
    delete this.__props[dat];
    return this;
  }

  select() {
    let range = document.createRange();
    range.selectNode(this._);
    window?.getSelection()?.removeAllRanges();
    window?.getSelection()?.addRange(range);
    return this;
  }

  siblings() {
    return Array.prototype.filter.call(
      this._.parentNode?.children,
      (child: HTMLElement) => {
        return child !== this._;
      },
    );
  }

  text(con?: string | number) {
    if (typeof con == 'string' || typeof con == 'number') {
      this._.innerHTML = fn.text(`${con}`);
      this.__buildStyles();
      return this;
    }
    let elm = document.createElement('div');
    elm.innerHTML = '' + this.html();
    return elm.innerText;
  }

  toggleClass(className: string) {
    this._.classList.toggle(className);
    return this;
  }

  trigger(event: string) {
    let evt = new Event(event);
    this._.dispatchEvent(evt);
    return this;
  }

  // EVENT
  blur(callback: func) {
    return this.on('blur', callback);
  }

  change(callback: func) {
    return this.on('change', callback);
  }

  click(callback: func) {
    return this.on('click', callback);
  }

  contextmenu(callback: func) {
    return this.on('contextmenu', callback);
  }

  dblclick(callback: func) {
    return this.on('dblclick', callback);
  }

  focusin(callback: func) {
    return this.on('focusin', callback);
  }

  focusout(callback: func) {
    return this.on('focusout', callback);
  }

  hover(callback: func) {
    return this.on('hover', callback);
  }

  keydown(callback: func) {
    return this.on('keydown', callback);
  }

  keypress(callback: func) {
    return this.on('keypress', callback);
  }

  keyup(callback: func) {
    return this.on('keyup', callback);
  }

  mousedown(callback: func) {
    return this.on('mousedown', callback);
  }

  mouseenter(callback: func) {
    return this.on('mouseenter', callback);
  }

  mouseleave(callback: func) {
    return this.on('mouseleave', callback);
  }

  mousemove(callback: func) {
    return this.on('mousemove', callback);
  }

  mouseout(callback: func) {
    return this.on('mouseout', callback);
  }

  mouseover(callback: func) {
    return this.on('mouseover', callback);
  }

  mouseup(callback: func) {
    return this.on('mouseup', callback);
  }

  resize(callback: func) {
    return this.on('resize', callback);
  }

  scroll(callback: func) {
    return this.on('scroll', callback);
  }
}

function $(sel: string | HTMLElement | Node): jElement {
  return new jElement(sel);
}

// @ts-ignore
function $$(sel: string): Array<HTMLElement> {
  // @ts-ignore
  return [...document.querySelectorAll(sel)];
}

function svg$(sel = 'g', att = {}) {
  let tg =
    (sel.match(/^[\w-]+/g) !== null ? sel.match(/^[\w-]+/g)?.[0] : 'g') || 'g';
  let id =
    sel.match(/#[\w\d-_]+/g) !== null
      ? sel.match(/#[\w\d-_]+/g)?.[0].replace('#', '')
      : '';
  let cl =
    sel.match(/\.[\w\d-_]+/g) !== null
      ? sel
          .match(/\.[\w\d-_]+/g)
          ?.map((v) => {
            return v.replace('.', '');
          })
          .join(' ')
      : '';
  let $e = $(document.createElementNS('http://www.w3.org/2000/svg', tg));
  if ((id + '').length > 0) $e.attr('id', id);
  if ((cl + '').length > 0) $e.attr('class', cl);
  for (let a in att) {
    // @ts-ignore
    $e.attr(a, att[a]);
  }
  return $e;
}

interface Prop {
  lh: any;
  ta: any;
  fs: any;
  bl: any;
}

export function areaText(
  textRoot: any,
  rect: DOMRect,
  prop: Prop,
  cutOff: boolean = false,
): Array<object> {
  const $tex = $(textRoot);
  // console.log($tex[0]);
  // $tex.clone().attr({ fill: '#f00', x: 0, y: 0 }).insertBefore($tex).prevAll('[pseudo="area"],[data-name*="::a;"]').attr('fill', '#bbb');
  // console.time('AreaText');
  // if(!(prop.ff in FD)) return [];
  // @ts-ignore
  let NBS = '&#160;',
    txt = $tex.text(),
    grp = svg$('g', {
      opacity: 1,
      transform: ($tex.attr('transform') + '').replace(
        /translate\([0-9\.]+\s*,?\s*[0-9\.]+\)/g,
        `translate(${rect.x} ${rect.y})`,
      ),
    }).insertBefore($tex),
    clo = svg$('g', {
      opacity: 1,
      transform: ($tex.attr('transform') + '').replace(
        /translate\([0-9\.]+\s*,?\s*[0-9\.]+\)/g,
        `translate(${rect.x} ${rect.y})`,
      ),
      style: 'will-change: transform;',
    }).insertBefore($tex),
    cll = $tex.clone().empty().attr({x: 0, y: 0, fill: `$000`, transform: ``}),
    // @ts-ignore
    tag = cll[0].outerHTML.replace('</text>', ''), //'<text x="0" y="0">',
    wid = rect.width,
    lht = prop.lh,
    aln = prop.ta,
    fsz = prop.fs,
    // ffm = prop.ff,
    // len = 0,
    // res = [],
    // clg = [],
    //////
    // upe = FD[ffm].u, // unitsPerEm,
    // dsc = FD[ffm].d, // descender,
    // asc = FD[ffm].a, // ascender,
    // cap = FD[ffm].c, // capHeight,
    // fbl = Math.ceil(fsz/upe*cap),
    fbl = Math.ceil(fsz * prop.bl), // newly added for first baseline
    lnm = 1,
    cln = 0,
    tar: Array<any> = [],
    cbx: Array<any> = [], ///-------------------
    // arr = [],///------------------- was crr
    // @ts-ignore
    crr = txt.split(' ').map((s) => {
      /// was arr
      if (s == '') {
        tar.push(' ');
        // crr.push('')
        return '';
      } else {
        tar.push(s, ' ');
        // crr.push(tag+`${s}</text>`);
        return tag + `${s}</text>`;
        // return `<tspan>${s}</tspan>`;
      }
    }),
    // @ts-ignore
    bxx = clo.html(tag + '-' + `</text>`)[0].getBBox(),
    // @ts-ignore
    sxx = clo.html(tag + NBS + `</text>`)[0].getBBox(),
    sln = (sxx.width * 1) / 1,
    hln = (bxx.width * 1) / 1,
    tof = -fbl, //(bxx.y * 1)/1,// edited for first baseline
    // cld = Array.prototype.map.bind($tex.html(arr.join(`<tspan> </tspan>`)).children())(el => el),//.map(el => el),///
    cpy = Array.prototype.map.bind(
      // @ts-ignore
      grp.html(crr.join(tag + ` </text>`)).children(),
    )((el, i) => {
      cbx.push(tar[i] == ' ' ? sxx : el.getBBox());
      return el;
    }), ///-------------------
    lns = [{w: 0, c: [], u: 0, x: cbx.length > 0 ? cbx[0].x : 0}]; ///-------------------
  // $tex.attr('xml:space', 'preserve')

  for (let c = 0, s = 0; c < cpy.length; c++) {
    if (tar[c] == ' ') s++; ///-------------------
    // if(c >= s && cpy.length - 1 == c) lns[lnm-1].u = cbx[c-s].width - cpy[c-s].getComputedTextLength() + cbx[c-s].x // last word's extra length ///-------------------
    if (c == 0 && c >= s && c == cpy.length - 1 && tar[c] != ' ')
      lns[lnm - 1].u = cbx[c].width - cpy[c].getComputedTextLength() + cbx[c].x;
    // last word's extra length for one-word-line ///-------------------
    else if (c >= s && c == cpy.length - 1 && tar[c] != ' ')
      lns[lnm - 1].u =
        cbx[c - 1 - s].width -
        cpy[c - 1 - s].getComputedTextLength() +
        cbx[c - 1 - s].x; // last word's extra length ///-------------------
    // $tex.html(tar[c]);
    if (tar[c] == ' ') {
      // res.push(`<tspan x="${cln}" y="${fbl + lht*(lnm-1)}"> </tspan>`)
      // @ts-ignore
      lns[lnm - 1].c.push({x: cln, t: ' '});
      cln += sln;
      continue;
    }
    let ttx = tar[c],
      // tsp = cld[c],///
      csp = cpy[c], ///-------------------
      bbx = cbx[c], ///-------------------
      v = bbx.width + bbx.x, ///-------------------
      w = csp.getComputedTextLength(); /// was tsp
    // w = (ttx == ' ') ? sln : Math.round(clo.html(ttx)[0].getBBox().width * 100)/100;
    // if(ttx == ' ') clg.push(w);
    if (cln + v - lns[lnm - 1].x <= wid) {
      // ok for now///-------------------
      // res.push(`<tspan x="${cln}" y="${fbl + lht*(lnm-1)}">${ttx}</tspan>`)
      // res.push(`${ttx}`)
      // cln += Math.ceil(w);
      // @ts-ignore
      lns[lnm - 1].c.push({x: cln, t: ttx});
      lns[lnm - 1].w = cln + w;
      cln += w;
    } else {
      // needs another line
      if (cutOff && (lnm + 1) * lht + tof > rect.height) break;
      if (v > wid) {
        // break word///-------------------
        let ltr = Array.prototype.map.bind(
          clo
            .html(
              ttx
                .split('')
                .map((s: string) => tag + `${s}</text>`)
                .join(''),
            )
            // @ts-ignore
            .children(),
        )((el) => el);
        // $(ltr).each((i,l) => {
        for (let i = 0; i < ltr.length; i++) {
          // let llt = clo.html(l)[0];
          // let llw = llt.getBBox().width;
          let l = ltr[i].innerHTML,
            llb = ltr[i].getBBox(), ///-------------------
            // @ts-ignore
            llv = llb.width + llb.x, ///-------------------
            llw = ltr[i].getComputedTextLength();
          if (cln + hln + llw - lns[lnm - 1].x > wid) {
            // add hyphen & break it///-------------------
            if (i != 0) {
              // @ts-ignore
              lns[lnm - 1].c.push({x: cln, t: `-`});
            } //&& res.push(`<tspan x="${cln}" y="${fbl + lht*(lnm-1)}">-</tspan>`)
            // res.push(`-`)
            // new line
            lns[lnm - 1].u = 0; //llv - llw + bxx.x // last word's extra length ///-------------------
            if (cutOff && (lnm + 1) * lht + tof > rect.height) break;
            cln = 0;
            lnm++;
            lns[lnm - 1] = {w: 0, c: [], u: 0, x: llb.x};
          }
          // in any case
          // res.push(`<tspan x="${cln}" y="${fbl + lht*(lnm-1)}">${l}</tspan>`)
          // res.push(`${l}`)
          // cln += Math.ceil(llw);
          // @ts-ignore
          lns[lnm - 1].c.push({x: cln, t: l});
          lns[lnm - 1].w = cln + llw;
          cln += llw;
        } //);
      } else {
        // new line
        if (c == s) lns[lnm - 1].u = sxx.width - sln + sxx.x;
        // last word's extra length for first line/s w/ leading spaces ///-------------------
        else
          lns[lnm - 1].u =
            cbx[c - s - 1].width -
            cpy[c - s - 1].getComputedTextLength() +
            cbx[c - s - 1].x; // last word's extra length ///-------------------
        cln = 0;
        lnm++;
        lns[lnm - 1] = {w: 0, c: [], u: 0, x: bbx.x};
        // res.push(`<tspan x="${cln}" y="${fbl + lht*(lnm-1)}">${ttx}</tspan>`)
        // res.push(`${ttx}`)
        // cln += Math.ceil(w);
        // @ts-ignore
        lns[lnm - 1].c.push({x: cln, t: ttx});
        lns[lnm - 1].w = cln + w;
        cln += w;
      }
    } // in any case
    s = 0; ///-------------------
  } // loop ends
  clo.remove().empty();
  $tex.attr({
    transform: ($tex.attr('transform') + '').replace(
      /translate\([0-9\.]+\s*,?\s*[0-9\.]+\)/g,
      `translate(${rect.x} ${rect.y})`,
    ),
    x: 0,
    y: 0,
  });
  // grp.html(lns.map((l,i) => tag + l.c[0].t + '</text>').join('')).children().each((i,el) => {
  // 	lns[i].x = el.getBBox().x
  // })
  grp.remove().empty();
  // console.log(clg);
  // $tex.html(res.join(''));
  $tex.html(
    lns
      .map((l, i) => {
        let x = 0 - l.x,
          con = l.c.map((w: any) => w.t).join(''); ///-------------------
        con =
          i > 0 || aln == 'cn' || aln == 'jc' ? con.trim() : con.trimRight(); ///-------------------
        // aln = 'jl'
        if (aln == 'rt') x = wid - l.w - l.u;
        ///-------------------
        else if (aln == 'cn') x = (wid - l.w - l.x - l.u) / 2;
        ///-------------------
        else if (
          aln == 'ju' ||
          ((aln == 'jl' || aln == 'jc' || aln == 'jr') && i != lns.length - 1)
        ) {
          let sps = con.split(' ').length - 1;
          let lsp = (wid - l.w + l.x - l.u + sln * sps) / sps - sln; ///-------------------
          con = con
            .split(' ')
            .join(`<tspan dx='${lsp}' opacity='0'>${NBS}</tspan>`); // perfect
          // con = con.split(' ').join(`<tspan letter-spacing="${ lsp/fsz }em" opacity="0">${NBS}</tspan>`) // original
          // con = con.split(' ').join(`<tspan textLength="${ lsp }em" lengthAdjust="spacingAndGlyphs" opacity="0">${NBS}</tspan>`) // fails
          // con = con.split(' ').join(`<tspan letter-spacing="${ lsp/fsz }em"> </tspan>`) // older
        } else if (
          (aln == 'jl' || aln == 'jc' || aln == 'jr') &&
          i == lns.length - 1
        ) {
          // last line
          con = con.split(' ').join(`<tspan opacity='0'>${NBS}</tspan>`);
          if (aln == 'jl') x = 0 - l.x;
          ///-------------------
          else if (aln == 'jc') x = (wid - l.w - l.x - l.u) / 2;
          ///-------------------
          else if (aln == 'jr') x = wid - l.w - l.u; ///-------------------
        } else x = 0 - l.x; ///-------------------
        if (aln == 'rt' || aln == 'cn' || aln == 'lt')
          con = con.split(' ').join(`<tspan opacity='0'>${NBS}</tspan>`);
        return `<tspan x='${x}' y='${fbl + lht * i}'>${con}</tspan>`; // fbl derives from capHeight
        // return `<tspan x="${ x }" y="${ lht*i - tof }">${ con }</tspan>`// tof (is -ve) seems to be derived from ascender
      })
      .join(''),
  );
  // console.timeEnd('AreaText');
  // console.log(clg);
  return lns;
}

export const setAreaText = (
  svgNode: Element,
  id: string,
  text: string,
  textAlign = 'lt',
  fillColor?: string | undefined | null
) => {
  const g: any = svgNode.querySelector(`g[id="${id}"]`);
  let textElement: any = [];
  const rect = g.children[0].getBBox();
  const fs = 1 * g.children[1].getAttribute('font-size');
  const lh = 1.25 * fs;
  const bl = 0.8;
  let lastCord = 0;
  if (text && Array.isArray(text)) {
    //last item
    // console.log('last text element ', textElement[ text.length - 1 ]);
    const SVG_NS = 'http://www.w3.org/2000/svg';
    // let lineHeight = rect.y;
    // text[0] = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    // text[0] = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    text.map((item, i, row) => {
      let text = document.createElementNS(SVG_NS, 'text');
      if (i > 0) {
        const previousTxt = textElement[i - 1];
        // console.log(`${id} :`, previousTxt.getBBox());
        const previousBoxHeight = previousTxt.getBBox().height;
        const heightWithPrev = previousBoxHeight + 5;
        // text.setAttributeNS(null, 'x', rect.x);
        // text.setAttributeNS(null, 'y', rect.y);
        text.setAttributeNS(
          null,
          'transform',
          `translate(18 ${heightWithPrev})`,
        );
        text.setAttributeNS(null, 'font-size', `${fs}`);
        fillColor && text.setAttribute('fill', fillColor);
        g.appendChild(text);
        rect.y += heightWithPrev;
        if (i == row.length - 1) {
          lastCord = rect.y;
        }
      }

      let currentChildren = g.children[i + 1];
      currentChildren.innerHTML = `${i + 1}. ${item}`;

      areaText(currentChildren, rect, {fs, lh, bl, ta: textAlign});
      textElement.push(currentChildren);
    });
  } else {
    if (text) g.children[1].innerHTML = text;
    areaText(g.children[1], rect, {fs, lh, bl, ta: textAlign});
    textElement.push(g.children[1]);
  }
  // console.log('textElement ', textElement);

  // g.children[0].setAttribute('fill', 'transparent');
  const lastElem = text ? textElement[text.length - 1] : textElement[0];
  return {
    textElement,
    lastElement: lastElem,
    lastCord,
  };
};

