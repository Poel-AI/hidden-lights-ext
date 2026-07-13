(function(){
try {
/** @license
 *
 * jsPDF - PDF Document creation from JavaScript
 * Version 2.5.1 Built on 2022-01-28T15:37:57.789Z
 *                      CommitID 00000000
 *
 * Copyright (c) 2010-2021 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
 *               2015-2021 yWorks GmbH, http://www.yworks.com
 *               2015-2021 Lukas Holländer <lukas.hollaender@yworks.com>, https://github.com/HackbrettXXX
 *               2016-2018 Aras Abbasi <aras.abbasi@gmail.com>
 *               2010 Aaron Spike, https://github.com/acspike
 *               2012 Willow Systems Corporation, https://github.com/willowsystems
 *               2012 Pablo Hess, https://github.com/pablohess
 *               2012 Florian Jenett, https://github.com/fjenett
 *               2013 Warren Weckesser, https://github.com/warrenweckesser
 *               2013 Youssef Beddad, https://github.com/lifof
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2013 Stefan Slonevskiy, https://github.com/stefslon
 *               2013 Jeremy Morel, https://github.com/jmorel
 *               2013 Christoph Hartmann, https://github.com/chris-rock
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Makes, https://github.com/dollaruw
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 Steven Spungin, https://github.com/Flamenco
 *               2014 Kenneth Glassey, https://github.com/Gavvers
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Contributor(s):
 *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
 *    kim3er, mfo, alnorth, Flamenco
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).jspdf={})}(this,(function(t){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var r=function(){return"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this}();function n(){r.console&&"function"==typeof r.console.log&&r.console.log.apply(r.console,arguments)}var i={log:n,warn:function(t){r.console&&("function"==typeof r.console.warn?r.console.warn.apply(r.console,arguments):n.call(null,arguments))},error:function(t){r.console&&("function"==typeof r.console.error?r.console.error.apply(r.console,arguments):n(t))}};function a(t,e,r){var n=new XMLHttpRequest;n.open("GET",t),n.responseType="blob",n.onload=function(){l(n.response,e,r)},n.onerror=function(){i.error("could not download file")},n.send()}function o(t){var e=new XMLHttpRequest;e.open("HEAD",t,!1);try{e.send()}catch(t){}return e.status>=200&&e.status<=299}function s(t){try{t.dispatchEvent(new MouseEvent("click"))}catch(r){var e=document.createEvent("MouseEvents");e.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),t.dispatchEvent(e)}}var c,u,l=r.saveAs||("object"!==("undefined"==typeof window?"undefined":e(window))||window!==r?function(){}:"undefined"!=typeof HTMLAnchorElement&&"download"in HTMLAnchorElement.prototype?function(t,e,n){var i=r.URL||r.webkitURL,c=document.createElement("a");e=e||t.name||"download",c.download=e,c.rel="noopener","string"==typeof t?(c.href=t,c.origin!==location.origin?o(c.href)?a(t,e,n):s(c,c.target="_blank"):s(c)):(c.href=i.createObjectURL(t),setTimeout((function(){i.revokeObjectURL(c.href)}),4e4),setTimeout((function(){s(c)}),0))}:"msSaveOrOpenBlob"in navigator?function(t,r,n){if(r=r||t.name||"download","string"==typeof t)if(o(t))a(t,r,n);else{var c=document.createElement("a");c.href=t,c.target="_blank",setTimeout((function(){s(c)}))}else navigator.msSaveOrOpenBlob(function(t,r){return void 0===r?r={autoBom:!1}:"object"!==e(r)&&(i.warn("Deprecated: Expected third argument to be a object"),r={autoBom:!r}),r.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)?new Blob([String.fromCharCode(65279),t],{type:t.type}):t}(t,n),r)}:function(t,n,i,o){if((o=o||open("","_blank"))&&(o.document.title=o.document.body.innerText="downloading..."),"string"==typeof t)return a(t,n,i);var s="application/octet-stream"===t.type,c=/constructor/i.test(r.HTMLElement)||r.safari,u=/CriOS\/[\d]+/.test(navigator.userAgent);if((u||s&&c)&&"object"===("undefined"==typeof FileReader?"undefined":e(FileReader))){var l=new FileReader;l.onloadend=function(){var t=l.result;t=u?t:t.replace(/^data:[^;]*;/,"data:attachment/file;"),o?o.location.href=t:location=t,o=null},l.readAsDataURL(t)}else{var h=r.URL||r.webkitURL,f=h.createObjectURL(t);o?o.location=f:location.href=f,o=null,setTimeout((function(){h.revokeObjectURL(f)}),4e4)}});
/**
   * A class to parse color values
   * @author Stoyan Stefanov <sstoo@gmail.com>
   * {@link   http://www.phpied.com/rgb-color-parser-in-javascript/}
   * @license Use it if you like it
   */function h(t){var e;t=t||"",this.ok=!1,"#"==t.charAt(0)&&(t=t.substr(1,6));t={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dodgerblue:"1e90ff",feldspar:"d19275",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslateblue:"8470ff",lightslategray:"778899",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"00ff00",limegreen:"32cd32",linen:"faf0e6",magenta:"ff00ff",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",red:"ff0000",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",violetred:"d02090",wheat:"f5deb3",white:"ffffff",whitesmoke:"f5f5f5",yellow:"ffff00",yellowgreen:"9acd32"}[t=(t=t.replace(/ /g,"")).toLowerCase()]||t;for(var r=[{re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,example:["rgb(123, 234, 45)","rgb(255,234,245)"],process:function(t){return[parseInt(t[1]),parseInt(t[2]),parseInt(t[3])]}},{re:/^(\w{2})(\w{2})(\w{2})$/,example:["#00ff00","336699"],process:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/^(\w{1})(\w{1})(\w{1})$/,example:["#fb0","f0f"],process:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}}],n=0;n<r.length;n++){var i=r[n].re,a=r[n].process,o=i.exec(t);o&&(e=a(o),this.r=e[0],this.g=e[1],this.b=e[2],this.ok=!0)}this.r=this.r<0||isNaN(this.r)?0:this.r>255?255:this.r,this.g=this.g<0||isNaN(this.g)?0:this.g>255?255:this.g,this.b=this.b<0||isNaN(this.b)?0:this.b>255?255:this.b,this.toRGB=function(){return"rgb("+this.r+", "+this.g+", "+this.b+")"},this.toHex=function(){var t=this.r.toString(16),e=this.g.toString(16),r=this.b.toString(16);return 1==t.length&&(t="0"+t),1==e.length&&(e="0"+e),1==r.length&&(r="0"+r),"#"+t+e+r}}
/**
   * @license
   * Joseph Myers does not specify a particular license for his work.
   *
   * Author: Joseph Myers
   * Accessed from: http://www.myersdaily.org/joseph/javascript/md5.js
   *
   * Modified by: Owen Leong
   */
function f(t,e){var r=t[0],n=t[1],i=t[2],a=t[3];r=p(r,n,i,a,e[0],7,-680876936),a=p(a,r,n,i,e[1],12,-389564586),i=p(i,a,r,n,e[2],17,606105819),n=p(n,i,a,r,e[3],22,-1044525330),r=p(r,n,i,a,e[4],7,-176418897),a=p(a,r,n,i,e[5],12,1200080426),i=p(i,a,r,n,e[6],17,-1473231341),n=p(n,i,a,r,e[7],22,-45705983),r=p(r,n,i,a,e[8],7,1770035416),a=p(a,r,n,i,e[9],12,-1958414417),i=p(i,a,r,n,e[10],17,-42063),n=p(n,i,a,r,e[11],22,-1990404162),r=p(r,n,i,a,e[12],7,1804603682),a=p(a,r,n,i,e[13],12,-40341101),i=p(i,a,r,n,e[14],17,-1502002290),r=g(r,n=p(n,i,a,r,e[15],22,1236535329),i,a,e[1],5,-165796510),a=g(a,r,n,i,e[6],9,-1069501632),i=g(i,a,r,n,e[11],14,643717713),n=g(n,i,a,r,e[0],20,-373897302),r=g(r,n,i,a,e[5],5,-701558691),a=g(a,r,n,i,e[10],9,38016083),i=g(i,a,r,n,e[15],14,-660478335),n=g(n,i,a,r,e[4],20,-405537848),r=g(r,n,i,a,e[9],5,568446438),a=g(a,r,n,i,e[14],9,-1019803690),i=g(i,a,r,n,e[3],14,-187363961),n=g(n,i,a,r,e[8],20,1163531501),r=g(r,n,i,a,e[13],5,-1444681467),a=g(a,r,n,i,e[2],9,-51403784),i=g(i,a,r,n,e[7],14,1735328473),r=m(r,n=g(n,i,a,r,e[12],20,-1926607734),i,a,e[5],4,-378558),a=m(a,r,n,i,e[8],11,-2022574463),i=m(i,a,r,n,e[11],16,1839030562),n=m(n,i,a,r,e[14],23,-35309556),r=m(r,n,i,a,e[1],4,-1530992060),a=m(a,r,n,i,e[4],11,1272893353),i=m(i,a,r,n,e[7],16,-155497632),n=m(n,i,a,r,e[10],23,-1094730640),r=m(r,n,i,a,e[13],4,681279174),a=m(a,r,n,i,e[0],11,-358537222),i=m(i,a,r,n,e[3],16,-722521979),n=m(n,i,a,r,e[6],23,76029189),r=m(r,n,i,a,e[9],4,-640364487),a=m(a,r,n,i,e[12],11,-421815835),i=m(i,a,r,n,e[15],16,530742520),r=v(r,n=m(n,i,a,r,e[2],23,-995338651),i,a,e[0],6,-198630844),a=v(a,r,n,i,e[7],10,1126891415),i=v(i,a,r,n,e[14],15,-1416354905),n=v(n,i,a,r,e[5],21,-57434055),r=v(r,n,i,a,e[12],6,1700485571),a=v(a,r,n,i,e[3],10,-1894986606),i=v(i,a,r,n,e[10],15,-1051523),n=v(n,i,a,r,e[1],21,-2054922799),r=v(r,n,i,a,e[8],6,1873313359),a=v(a,r,n,i,e[15],10,-30611744),i=v(i,a,r,n,e[6],15,-1560198380),n=v(n,i,a,r,e[13],21,1309151649),r=v(r,n,i,a,e[4],6,-145523070),a=v(a,r,n,i,e[11],10,-1120210379),i=v(i,a,r,n,e[2],15,718787259),n=v(n,i,a,r,e[9],21,-343485551),t[0]=S(r,t[0]),t[1]=S(n,t[1]),t[2]=S(i,t[2]),t[3]=S(a,t[3])}function d(t,e,r,n,i,a){return e=S(S(e,t),S(n,a)),S(e<<i|e>>>32-i,r)}function p(t,e,r,n,i,a,o){return d(e&r|~e&n,t,e,i,a,o)}function g(t,e,r,n,i,a,o){return d(e&n|r&~n,t,e,i,a,o)}function m(t,e,r,n,i,a,o){return d(e^r^n,t,e,i,a,o)}function v(t,e,r,n,i,a,o){return d(r^(e|~n),t,e,i,a,o)}function b(t){var e,r=t.length,n=[1732584193,-271733879,-1732584194,271733878];for(e=64;e<=t.length;e+=64)f(n,y(t.substring(e-64,e)));t=t.substring(e-64);var i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(e=0;e<t.length;e++)i[e>>2]|=t.charCodeAt(e)<<(e%4<<3);if(i[e>>2]|=128<<(e%4<<3),e>55)for(f(n,i),e=0;e<16;e++)i[e]=0;return i[14]=8*r,f(n,i),n}function y(t){var e,r=[];for(e=0;e<64;e+=4)r[e>>2]=t.charCodeAt(e)+(t.charCodeAt(e+1)<<8)+(t.charCodeAt(e+2)<<16)+(t.charCodeAt(e+3)<<24);return r}c=r.atob.bind(r),u=r.btoa.bind(r);var w="0123456789abcdef".split("");function N(t){for(var e="",r=0;r<4;r++)e+=w[t>>8*r+4&15]+w[t>>8*r&15];return e}function L(t){return String.fromCharCode((255&t)>>0,(65280&t)>>8,(16711680&t)>>16,(4278190080&t)>>24)}function A(t){return function(t){return t.map(L).join("")}(b(t))}var x="5d41402abc4b2a76b9719d911017c592"!=function(t){for(var e=0;e<t.length;e++)t[e]=N(t[e]);return t.join("")}(b("hello"));function S(t,e){if(x){var r=(65535&t)+(65535&e);return(t>>16)+(e>>16)+(r>>16)<<16|65535&r}return t+e&4294967295}
/**
   * @license
   * FPDF is released under a permissive license: there is no usage restriction.
   * You may embed it freely in your application (commercial or not), with or
   * without modifications.
   *
   * Reference: http://www.fpdf.org/en/script/script37.php
   */function _(t,e){var r,n,i,a;if(t!==r){for(var o=(i=t,a=1+(256/t.length>>0),new Array(a+1).join(i)),s=[],c=0;c<256;c++)s[c]=c;var u=0;for(c=0;c<256;c++){var l=s[c];u=(u+l+o.charCodeAt(c))%256,s[c]=s[u],s[u]=l}r=t,n=s}else s=n;var h=e.length,f=0,d=0,p="";for(c=0;c<h;c++)d=(d+(l=s[f=(f+1)%256]))%256,s[f]=s[d],s[d]=l,o=s[(s[f]+s[d])%256],p+=String.fromCharCode(e.charCodeAt(c)^o);return p}
/**
   * @license
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   * Author: Owen Leong (@owenl131)
   * Date: 15 Oct 2020
   * References:
   * https://www.cs.cmu.edu/~dst/Adobe/Gallery/anon21jul01-pdf-encryption.txt
   * https://github.com/foliojs/pdfkit/blob/master/lib/security.js
   * http://www.fpdf.org/en/script/script37.php
   */var P={print:4,modify:8,copy:16,"annot-forms":32};function k(t,e,r,n){this.v=1,this.r=2;var i=192;t.forEach((function(t){if(void 0!==P.perm)throw new Error("Invalid permission: "+t);i+=P[t]})),this.padding="(¿N^NuAd\0NVÿú\b..\0¶Ðh>/\f©þdSiz";var a=(e+this.padding).substr(0,32),o=(r+this.padding).substr(0,32);this.O=this.processOwnerPassword(a,o),this.P=-(1+(255^i)),this.encryptionKey=A(a+this.O+this.lsbFirstWord(this.P)+this.hexToBytes(n)).substr(0,5),this.U=_(this.encryptionKey,this.padding)}function F(t){if(/[^\u0000-\u00ff]/.test(t))throw new Error("Invalid PDF Name Object: "+t+", Only accept ASCII characters.");for(var e="",r=t.length,n=0;n<r;n++){var i=t.charCodeAt(n);if(i<33||35===i||37===i||40===i||41===i||47===i||60===i||62===i||91===i||93===i||123===i||125===i||i>126)e+="#"+("0"+i.toString(16)).slice(-2);else e+=t[n]}return e}function I(t){if("object"!==e(t))throw new Error("Invalid Context passed to initialize PubSub (jsPDF-module)");var n={};this.subscribe=function(t,e,r){if(r=r||!1,"string"!=typeof t||"function"!=typeof e||"boolean"!=typeof r)throw new Error("Invalid arguments passed to PubSub.subscribe (jsPDF-module)");n.hasOwnProperty(t)||(n[t]={});var i=Math.random().toString(35);return n[t][i]=[e,!!r],i},this.unsubscribe=function(t){for(var e in n)if(n[e][t])return delete n[e][t],0===Object.keys(n[e]).length&&delete n[e],!0;return!1},this.publish=function(e){if(n.hasOwnProperty(e)){var a=Array.prototype.slice.call(arguments,1),o=[];for(var s in n[e]){var c=n[e][s];try{c[0].apply(t,a)}catch(t){r.console&&i.error("jsPDF PubSub Error",t.message,t)}c[1]&&o.push(s)}o.length&&o.forEach(this.unsubscribe)}},this.getTopics=function(){return n}}function C(t){if(!(this instanceof C))return new C(t);var e="opacity,stroke-opacity".split(",");for(var r in t)t.hasOwnProperty(r)&&e.indexOf(r)>=0&&(this[r]=t[r]);this.id="",this.objectNumber=-1}function j(t,e){this.gState=t,this.matrix=e,this.id="",this.objectNumber=-1}function O(t,e,r,n,i){if(!(this instanceof O))return new O(t,e,r,n,i);this.type="axial"===t?2:3,this.coords=e,this.colors=r,j.call(this,n,i)}function B(t,e,r,n,i){if(!(this instanceof B))return new B(t,e,r,n,i);this.boundingBox=t,this.xStep=e,this.yStep=r,this.stream="",this.cloneIndex=0,j.call(this,n,i)}function M(t){var n,a="string"==typeof arguments[0]?arguments[0]:"p",o=arguments[1],s=arguments[2],c=arguments[3],f=[],d=1,p=16,g="S",m=null;"object"===e(t=t||{})&&(a=t.orientation,o=t.unit||o,s=t.format||s,c=t.compress||t.compressPdf||c,null!==(m=t.encryption||null)&&(m.userPassword=m.userPassword||"",m.ownerPassword=m.ownerPassword||"",m.userPermissions=m.userPermissions||[]),d="number"==typeof t.userUnit?Math.abs(t.userUnit):1,void 0!==t.precision&&(n=t.precision),void 0!==t.floatPrecision&&(p=t.floatPrecision),g=t.defaultPathOperation||"S"),f=t.filters||(!0===c?["FlateEncode"]:f),o=o||"mm",a=(""+(a||"P")).toLowerCase();var v=t.putOnlyUsedFonts||!1,b={},y={internal:{},__private__:{}};y.__private__.PubSub=I;var w="1.3",N=y.__private__.getPdfVersion=function(){return w};y.__private__.setPdfVersion=function(t){w=t};var L={a0:[2383.94,3370.39],a1:[1683.78,2383.94],a2:[1190.55,1683.78],a3:[841.89,1190.55],a4:[595.28,841.89],a5:[419.53,595.28],a6:[297.64,419.53],a7:[209.76,297.64],a8:[147.4,209.76],a9:[104.88,147.4],a10:[73.7,104.88],b0:[2834.65,4008.19],b1:[2004.09,2834.65],b2:[1417.32,2004.09],b3:[1000.63,1417.32],b4:[708.66,1000.63],b5:[498.9,708.66],b6:[354.33,498.9],b7:[249.45,354.33],b8:[175.75,249.45],b9:[124.72,175.75],b10:[87.87,124.72],c0:[2599.37,3676.54],c1:[1836.85,2599.37],c2:[1298.27,1836.85],c3:[918.43,1298.27],c4:[649.13,918.43],c5:[459.21,649.13],c6:[323.15,459.21],c7:[229.61,323.15],c8:[161.57,229.61],c9:[113.39,161.57],c10:[79.37,113.39],dl:[311.81,623.62],letter:[612,792],"government-letter":[576,756],legal:[612,1008],"junior-legal":[576,360],ledger:[1224,792],tabloid:[792,1224],"credit-card":[153,243]};y.__private__.getPageFormats=function(){return L};var A=y.__private__.getPageFormat=function(t){return L[t]};s=s||"a4";var x={COMPAT:"compat",ADVANCED:"advanced"},S=x.COMPAT;function _(){this.saveGraphicsState(),ht(new Vt(_t,0,0,-_t,0,Rr()*_t).toString()+" cm"),this.setFontSize(this.getFontSize()/_t),g="n",S=x.ADVANCED}function P(){this.restoreGraphicsState(),g="S",S=x.COMPAT}var j=y.__private__.combineFontStyleAndFontWeight=function(t,e){if("bold"==t&&"normal"==e||"bold"==t&&400==e||"normal"==t&&"italic"==e||"bold"==t&&"italic"==e)throw new Error("Invalid Combination of fontweight and fontstyle");return e&&(t=400==e||"normal"===e?"italic"===t?"italic":"normal":700!=e&&"bold"!==e||"normal"!==t?(700==e?"bold":e)+""+t:"bold"),t};y.advancedAPI=function(t){var e=S===x.COMPAT;return e&&_.call(this),"function"!=typeof t||(t(this),e&&P.call(this)),this},y.compatAPI=function(t){var e=S===x.ADVANCED;return e&&P.call(this),"function"!=typeof t||(t(this),e&&_.call(this)),this},y.isAdvancedAPI=function(){return S===x.ADVANCED};var E,q=function(t){if(S!==x.ADVANCED)throw new Error(t+" is only available in 'advanced' API mode. You need to call advancedAPI() first.")},D=y.roundToPrecision=y.__private__.roundToPrecision=function(t,e){var r=n||e;if(isNaN(t)||isNaN(r))throw new Error("Invalid argument passed to jsPDF.roundToPrecision");return t.toFixed(r).replace(/0+$/,"")};E=y.hpf=y.__private__.hpf="number"==typeof p?function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.hpf");return D(t,p)}:"smart"===p?function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.hpf");return D(t,t>-1&&t<1?16:5)}:function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.hpf");return D(t,16)};var R=y.f2=y.__private__.f2=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.f2");return D(t,2)},T=y.__private__.f3=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.f3");return D(t,3)},U=y.scale=y.__private__.scale=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.scale");return S===x.COMPAT?t*_t:S===x.ADVANCED?t:void 0},z=function(t){return S===x.COMPAT?Rr()-t:S===x.ADVANCED?t:void 0},H=function(t){return U(z(t))};y.__private__.setPrecision=y.setPrecision=function(t){"number"==typeof parseInt(t,10)&&(n=parseInt(t,10))};var W,V="00000000000000000000000000000000",G=y.__private__.getFileId=function(){return V},Y=y.__private__.setFileId=function(t){return V=void 0!==t&&/^[a-fA-F0-9]{32}$/.test(t)?t.toUpperCase():V.split("").map((function(){return"ABCDEF0123456789".charAt(Math.floor(16*Math.random()))})).join(""),null!==m&&(Ye=new k(m.userPermissions,m.userPassword,m.ownerPassword,V)),V};y.setFileId=function(t){return Y(t),this},y.getFileId=function(){return G()};var J=y.__private__.convertDateToPDFDate=function(t){var e=t.getTimezoneOffset(),r=e<0?"+":"-",n=Math.floor(Math.abs(e/60)),i=Math.abs(e%60),a=[r,Q(n),"'",Q(i),"'"].join("");return["D:",t.getFullYear(),Q(t.getMonth()+1),Q(t.getDate()),Q(t.getHours()),Q(t.getMinutes()),Q(t.getSeconds()),a].join("")},X=y.__private__.convertPDFDateToDate=function(t){var e=parseInt(t.substr(2,4),10),r=parseInt(t.substr(6,2),10)-1,n=parseInt(t.substr(8,2),10),i=parseInt(t.substr(10,2),10),a=parseInt(t.substr(12,2),10),o=parseInt(t.substr(14,2),10);return new Date(e,r,n,i,a,o,0)},K=y.__private__.setCreationDate=function(t){var e;if(void 0===t&&(t=new Date),t instanceof Date)e=J(t);else{if(!/^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|-0[0-9]|-1[0-1])'(0[0-9]|[1-5][0-9])'?$/.test(t))throw new Error("Invalid argument passed to jsPDF.setCreationDate");e=t}return W=e},Z=y.__private__.getCreationDate=function(t){var e=W;return"jsDate"===t&&(e=X(W)),e};y.setCreationDate=function(t){return K(t),this},y.getCreationDate=function(t){return Z(t)};var $,Q=y.__private__.padd2=function(t){return("0"+parseInt(t)).slice(-2)},tt=y.__private__.padd2Hex=function(t){return("00"+(t=t.toString())).substr(t.length)},et=0,rt=[],nt=[],it=0,at=[],ot=[],st=!1,ct=nt,ut=function(){et=0,it=0,nt=[],rt=[],at=[],Qt=Kt(),te=Kt()};y.__private__.setCustomOutputDestination=function(t){st=!0,ct=t};var lt=function(t){st||(ct=t)};y.__private__.resetCustomOutputDestination=function(){st=!1,ct=nt};var ht=y.__private__.out=function(t){return t=t.toString(),it+=t.length+1,ct.push(t),ct},ft=y.__private__.write=function(t){return ht(1===arguments.length?t.toString():Array.prototype.join.call(arguments," "))},dt=y.__private__.getArrayBuffer=function(t){for(var e=t.length,r=new ArrayBuffer(e),n=new Uint8Array(r);e--;)n[e]=t.charCodeAt(e);return r},pt=[["Helvetica","helvetica","normal","WinAnsiEncoding"],["Helvetica-Bold","helvetica","bold","WinAnsiEncoding"],["Helvetica-Oblique","helvetica","italic","WinAnsiEncoding"],["Helvetica-BoldOblique","helvetica","bolditalic","WinAnsiEncoding"],["Courier","courier","normal","WinAnsiEncoding"],["Courier-Bold","courier","bold","WinAnsiEncoding"],["Courier-Oblique","courier","italic","WinAnsiEncoding"],["Courier-BoldOblique","courier","bolditalic","WinAnsiEncoding"],["Times-Roman","times","normal","WinAnsiEncoding"],["Times-Bold","times","bold","WinAnsiEncoding"],["Times-Italic","times","italic","WinAnsiEncoding"],["Times-BoldItalic","times","bolditalic","WinAnsiEncoding"],["ZapfDingbats","zapfdingbats","normal",null],["Symbol","symbol","normal",null]];y.__private__.getStandardFonts=function(){return pt};var gt=t.fontSize||16;y.__private__.setFontSize=y.setFontSize=function(t){return gt=S===x.ADVANCED?t/_t:t,this};var mt,vt=y.__private__.getFontSize=y.getFontSize=function(){return S===x.COMPAT?gt:gt*_t},bt=t.R2L||!1;y.__private__.setR2L=y.setR2L=function(t){return bt=t,this},y.__private__.getR2L=y.getR2L=function(){return bt};var yt,wt=y.__private__.setZoomMode=function(t){var e=[void 0,null,"fullwidth","fullheight","fullpage","original"];if(/^(?:\d+\.\d*|\d*\.\d+|\d+)%$/.test(t))mt=t;else if(isNaN(t)){if(-1===e.indexOf(t))throw new Error('zoom must be Integer (e.g. 2), a percentage Value (e.g. 300%) or fullwidth, fullheight, fullpage, original. "'+t+'" is not recognized.');mt=t}else mt=parseInt(t,10)};y.__private__.getZoomMode=function(){return mt};var Nt,Lt=y.__private__.setPageMode=function(t){if(-1==[void 0,null,"UseNone","UseOutlines","UseThumbs","FullScreen"].indexOf(t))throw new Error('Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "'+t+'" is not recognized.');yt=t};y.__private__.getPageMode=function(){return yt};var At=y.__private__.setLayoutMode=function(t){if(-1==[void 0,null,"continuous","single","twoleft","tworight","two"].indexOf(t))throw new Error('Layout mode must be one of continuous, single, twoleft, tworight. "'+t+'" is not recognized.');Nt=t};y.__private__.getLayoutMode=function(){return Nt},y.__private__.setDisplayMode=y.setDisplayMode=function(t,e,r){return wt(t),At(e),Lt(r),this};var xt={title:"",subject:"",author:"",keywords:"",creator:""};y.__private__.getDocumentProperty=function(t){if(-1===Object.keys(xt).indexOf(t))throw new Error("Invalid argument passed to jsPDF.getDocumentProperty");return xt[t]},y.__private__.getDocumentProperties=function(){return xt},y.__private__.setDocumentProperties=y.setProperties=y.setDocumentProperties=function(t){for(var e in xt)xt.hasOwnProperty(e)&&t[e]&&(xt[e]=t[e]);return this},y.__private__.setDocumentProperty=function(t,e){if(-1===Object.keys(xt).indexOf(t))throw new Error("Invalid arguments passed to jsPDF.setDocumentProperty");return xt[t]=e};var St,_t,Pt,kt,Ft,It={},Ct={},jt=[],Ot={},Bt={},Mt={},Et={},qt=null,Dt=0,Rt=[],Tt=new I(y),Ut=t.hotfixes||[],zt={},Ht={},Wt=[],Vt=function t(e,r,n,i,a,o){if(!(this instanceof t))return new t(e,r,n,i,a,o);isNaN(e)&&(e=1),isNaN(r)&&(r=0),isNaN(n)&&(n=0),isNaN(i)&&(i=1),isNaN(a)&&(a=0),isNaN(o)&&(o=0),this._matrix=[e,r,n,i,a,o]};Object.defineProperty(Vt.prototype,"sx",{get:function(){return this._matrix[0]},set:function(t){this._matrix[0]=t}}),Object.defineProperty(Vt.prototype,"shy",{get:function(){return this._matrix[1]},set:function(t){this._matrix[1]=t}}),Object.defineProperty(Vt.prototype,"shx",{get:function(){return this._matrix[2]},set:function(t){this._matrix[2]=t}}),Object.defineProperty(Vt.prototype,"sy",{get:function(){return this._matrix[3]},set:function(t){this._matrix[3]=t}}),Object.defineProperty(Vt.prototype,"tx",{get:function(){return this._matrix[4]},set:function(t){this._matrix[4]=t}}),Object.defineProperty(Vt.prototype,"ty",{get:function(){return this._matrix[5]},set:function(t){this._matrix[5]=t}}),Object.defineProperty(Vt.prototype,"a",{get:function(){return this._matrix[0]},set:function(t){this._matrix[0]=t}}),Object.defineProperty(Vt.prototype,"b",{get:function(){return this._matrix[1]},set:function(t){this._matrix[1]=t}}),Object.defineProperty(Vt.prototype,"c",{get:function(){return this._matrix[2]},set:function(t){this._matrix[2]=t}}),Object.defineProperty(Vt.prototype,"d",{get:function(){return this._matrix[3]},set:function(t){this._matrix[3]=t}}),Object.defineProperty(Vt.prototype,"e",{get:function(){return this._matrix[4]},set:function(t){this._matrix[4]=t}}),Object.defineProperty(Vt.prototype,"f",{get:function(){return this._matrix[5]},set:function(t){this._matrix[5]=t}}),Object.defineProperty(Vt.prototype,"rotation",{get:function(){return Math.atan2(this.shx,this.sx)}}),Object.defineProperty(Vt.prototype,"scaleX",{get:function(){return this.decompose().scale.sx}}),Object.defineProperty(Vt.prototype,"scaleY",{get:function(){return this.decompose().scale.sy}}),Object.defineProperty(Vt.prototype,"isIdentity",{get:function(){return 1===this.sx&&(0===this.shy&&(0===this.shx&&(1===this.sy&&(0===this.tx&&0===this.ty))))}}),Vt.prototype.join=function(t){return[this.sx,this.shy,this.shx,this.sy,this.tx,this.ty].map(E).join(t)},Vt.prototype.multiply=function(t){var e=t.sx*this.sx+t.shy*this.shx,r=t.sx*this.shy+t.shy*this.sy,n=t.shx*this.sx+t.sy*this.shx,i=t.shx*this.shy+t.sy*this.sy,a=t.tx*this.sx+t.ty*this.shx+this.tx,o=t.tx*this.shy+t.ty*this.sy+this.ty;return new Vt(e,r,n,i,a,o)},Vt.prototype.decompose=function(){var t=this.sx,e=this.shy,r=this.shx,n=this.sy,i=this.tx,a=this.ty,o=Math.sqrt(t*t+e*e),s=(t/=o)*r+(e/=o)*n;r-=t*s,n-=e*s;var c=Math.sqrt(r*r+n*n);return s/=c,t*(n/=c)<e*(r/=c)&&(t=-t,e=-e,s=-s,o=-o),{scale:new Vt(o,0,0,c,0,0),translate:new Vt(1,0,0,1,i,a),rotate:new Vt(t,e,-e,t,0,0),skew:new Vt(1,0,s,1,0,0)}},Vt.prototype.toString=function(t){return this.join(" ")},Vt.prototype.inversed=function(){var t=this.sx,e=this.shy,r=this.shx,n=this.sy,i=this.tx,a=this.ty,o=1/(t*n-e*r),s=n*o,c=-e*o,u=-r*o,l=t*o;return new Vt(s,c,u,l,-s*i-u*a,-c*i-l*a)},Vt.prototype.applyToPoint=function(t){var e=t.x*this.sx+t.y*this.shx+this.tx,r=t.x*this.shy+t.y*this.sy+this.ty;return new Cr(e,r)},Vt.prototype.applyToRectangle=function(t){var e=this.applyToPoint(t),r=this.applyToPoint(new Cr(t.x+t.w,t.y+t.h));return new jr(e.x,e.y,r.x-e.x,r.y-e.y)},Vt.prototype.clone=function(){var t=this.sx,e=this.shy,r=this.shx,n=this.sy,i=this.tx,a=this.ty;return new Vt(t,e,r,n,i,a)},y.Matrix=Vt;var Gt=y.matrixMult=function(t,e){return e.multiply(t)},Yt=new Vt(1,0,0,1,0,0);y.unitMatrix=y.identityMatrix=Yt;var Jt=function(t,e){if(!Bt[t]){var r=(e instanceof O?"Sh":"P")+(Object.keys(Ot).length+1).toString(10);e.id=r,Bt[t]=r,Ot[r]=e,Tt.publish("addPattern",e)}};y.ShadingPattern=O,y.TilingPattern=B,y.addShadingPattern=function(t,e){return q("addShadingPattern()"),Jt(t,e),this},y.beginTilingPattern=function(t){q("beginTilingPattern()"),Br(t.boundingBox[0],t.boundingBox[1],t.boundingBox[2]-t.boundingBox[0],t.boundingBox[3]-t.boundingBox[1],t.matrix)},y.endTilingPattern=function(t,e){q("endTilingPattern()"),e.stream=ot[$].join("\n"),Jt(t,e),Tt.publish("endTilingPattern",e),Wt.pop().restore()};var Xt=y.__private__.newObject=function(){var t=Kt();return Zt(t,!0),t},Kt=y.__private__.newObjectDeferred=function(){return et++,rt[et]=function(){return it},et},Zt=function(t,e){return e="boolean"==typeof e&&e,rt[t]=it,e&&ht(t+" 0 obj"),t},$t=y.__private__.newAdditionalObject=function(){var t={objId:Kt(),content:""};return at.push(t),t},Qt=Kt(),te=Kt(),ee=y.__private__.decodeColorString=function(t){var e=t.split(" ");if(2!==e.length||"g"!==e[1]&&"G"!==e[1]){if(5===e.length&&("k"===e[4]||"K"===e[4])){e=[(1-e[0])*(1-e[3]),(1-e[1])*(1-e[3]),(1-e[2])*(1-e[3]),"r"]}}else{var r=parseFloat(e[0]);e=[r,r,r,"r"]}for(var n="#",i=0;i<3;i++)n+=("0"+Math.floor(255*parseFloat(e[i])).toString(16)).slice(-2);return n},re=y.__private__.encodeColorString=function(t){var r;"string"==typeof t&&(t={ch1:t});var n=t.ch1,i=t.ch2,a=t.ch3,o=t.ch4,s="draw"===t.pdfColorType?["G","RG","K"]:["g","rg","k"];if("string"==typeof n&&"#"!==n.charAt(0)){var c=new h(n);if(c.ok)n=c.toHex();else if(!/^\d*\.?\d*$/.test(n))throw new Error('Invalid color "'+n+'" passed to jsPDF.encodeColorString.')}if("string"==typeof n&&/^#[0-9A-Fa-f]{3}$/.test(n)&&(n="#"+n[1]+n[1]+n[2]+n[2]+n[3]+n[3]),"string"==typeof n&&/^#[0-9A-Fa-f]{6}$/.test(n)){var u=parseInt(n.substr(1),16);n=u>>16&255,i=u>>8&255,a=255&u}if(void 0===i||void 0===o&&n===i&&i===a)if("string"==typeof n)r=n+" "+s[0];else switch(t.precision){case 2:r=R(n/255)+" "+s[0];break;case 3:default:r=T(n/255)+" "+s[0]}else if(void 0===o||"object"===e(o)){if(o&&!isNaN(o.a)&&0===o.a)return r=["1.","1.","1.",s[1]].join(" ");if("string"==typeof n)r=[n,i,a,s[1]].join(" ");else switch(t.precision){case 2:r=[R(n/255),R(i/255),R(a/255),s[1]].join(" ");break;default:case 3:r=[T(n/255),T(i/255),T(a/255),s[1]].join(" ")}}else if("string"==typeof n)r=[n,i,a,o,s[2]].join(" ");else switch(t.precision){case 2:r=[R(n),R(i),R(a),R(o),s[2]].join(" ");break;case 3:default:r=[T(n),T(i),T(a),T(o),s[2]].join(" ")}return r},ne=y.__private__.getFilters=function(){return f},ie=y.__private__.putStream=function(t){var e=(t=t||{}).data||"",r=t.filters||ne(),n=t.alreadyAppliedFilters||[],i=t.addLength1||!1,a=e.length,o=t.objectId,s=function(t){return t};if(null!==m&&void 0===o)throw new Error("ObjectId must be passed to putStream for file encryption");null!==m&&(s=Ye.encryptor(o,0));var c={};!0===r&&(r=["FlateEncode"]);var u=t.additionalKeyValues||[],l=(c=void 0!==M.API.processDataByFilters?M.API.processDataByFilters(e,r):{data:e,reverseChain:[]}).reverseChain+(Array.isArray(n)?n.join(" "):n.toString());if(0!==c.data.length&&(u.push({key:"Length",value:c.data.length}),!0===i&&u.push({key:"Length1",value:a})),0!=l.length)if(l.split("/").length-1==1)u.push({key:"Filter",value:l});else{u.push({key:"Filter",value:"["+l+"]"});for(var h=0;h<u.length;h+=1)if("DecodeParms"===u[h].key){for(var f=[],d=0;d<c.reverseChain.split("/").length-1;d+=1)f.push("null");f.push(u[h].value),u[h].value="["+f.join(" ")+"]"}}ht("<<");for(var p=0;p<u.length;p++)ht("/"+u[p].key+" "+u[p].value);ht(">>"),0!==c.data.length&&(ht("stream"),ht(s(c.data)),ht("endstream"))},ae=y.__private__.putPage=function(t){var e=t.number,r=t.data,n=t.objId,i=t.contentsObjId;Zt(n,!0),ht("<</Type /Page"),ht("/Parent "+t.rootDictionaryObjId+" 0 R"),ht("/Resources "+t.resourceDictionaryObjId+" 0 R"),ht("/MediaBox ["+parseFloat(E(t.mediaBox.bottomLeftX))+" "+parseFloat(E(t.mediaBox.bottomLeftY))+" "+E(t.mediaBox.topRightX)+" "+E(t.mediaBox.topRightY)+"]"),null!==t.cropBox&&ht("/CropBox ["+E(t.cropBox.bottomLeftX)+" "+E(t.cropBox.bottomLeftY)+" "+E(t.cropBox.topRightX)+" "+E(t.cropBox.topRightY)+"]"),null!==t.bleedBox&&ht("/BleedBox ["+E(t.bleedBox.bottomLeftX)+" "+E(t.bleedBox.bottomLeftY)+" "+E(t.bleedBox.topRightX)+" "+E(t.bleedBox.topRightY)+"]"),null!==t.trimBox&&ht("/TrimBox ["+E(t.trimBox.bottomLeftX)+" "+E(t.trimBox.bottomLeftY)+" "+E(t.trimBox.topRightX)+" "+E(t.trimBox.topRightY)+"]"),null!==t.artBox&&ht("/ArtBox ["+E(t.artBox.bottomLeftX)+" "+E(t.artBox.bottomLeftY)+" "+E(t.artBox.topRightX)+" "+E(t.artBox.topRightY)+"]"),"number"==typeof t.userUnit&&1!==t.userUnit&&ht("/UserUnit "+t.userUnit),Tt.publish("putPage",{objId:n,pageContext:Rt[e],pageNumber:e,page:r}),ht("/Contents "+i+" 0 R"),ht(">>"),ht("endobj");var a=r.join("\n");return S===x.ADVANCED&&(a+="\nQ"),Zt(i,!0),ie({data:a,filters:ne(),objectId:i}),ht("endobj"),n},oe=y.__private__.putPages=function(){var t,e,r=[];for(t=1;t<=Dt;t++)Rt[t].objId=Kt(),Rt[t].contentsObjId=Kt();for(t=1;t<=Dt;t++)r.push(ae({number:t,data:ot[t],objId:Rt[t].objId,contentsObjId:Rt[t].contentsObjId,mediaBox:Rt[t].mediaBox,cropBox:Rt[t].cropBox,bleedBox:Rt[t].bleedBox,trimBox:Rt[t].trimBox,artBox:Rt[t].artBox,userUnit:Rt[t].userUnit,rootDictionaryObjId:Qt,resourceDictionaryObjId:te}));Zt(Qt,!0),ht("<</Type /Pages");var n="/Kids [";for(e=0;e<Dt;e++)n+=r[e]+" 0 R ";ht(n+"]"),ht("/Count "+Dt),ht(">>"),ht("endobj"),Tt.publish("postPutPages")},se=function(t){Tt.publish("putFont",{font:t,out:ht,newObject:Xt,putStream:ie}),!0!==t.isAlreadyPutted&&(t.objectNumber=Xt(),ht("<<"),ht("/Type /Font"),ht("/BaseFont /"+F(t.postScriptName)),ht("/Subtype /Type1"),"string"==typeof t.encoding&&ht("/Encoding /"+t.encoding),ht("/FirstChar 32"),ht("/LastChar 255"),ht(">>"),ht("endobj"))},ce=function(){for(var t in It)It.hasOwnProperty(t)&&(!1===v||!0===v&&b.hasOwnProperty(t))&&se(It[t])},ue=function(t){t.objectNumber=Xt();var e=[];e.push({key:"Type",value:"/XObject"}),e.push({key:"Subtype",value:"/Form"}),e.push({key:"BBox",value:"["+[E(t.x),E(t.y),E(t.x+t.width),E(t.y+t.height)].join(" ")+"]"}),e.push({key:"Matrix",value:"["+t.matrix.toString()+"]"});var r=t.pages[1].join("\n");ie({data:r,additionalKeyValues:e,objectId:t.objectNumber}),ht("endobj")},le=function(){for(var t in zt)zt.hasOwnProperty(t)&&ue(zt[t])},he=function(t,e){var r,n=[],i=1/(e-1);for(r=0;r<1;r+=i)n.push(r);if(n.push(1),0!=t[0].offset){var a={offset:0,color:t[0].color};t.unshift(a)}if(1!=t[t.length-1].offset){var o={offset:1,color:t[t.length-1].color};t.push(o)}for(var s="",c=0,u=0;u<n.length;u++){for(r=n[u];r>t[c+1].offset;)c++;var l=t[c].offset,h=(r-l)/(t[c+1].offset-l),f=t[c].color,d=t[c+1].color;s+=tt(Math.round((1-h)*f[0]+h*d[0]).toString(16))+tt(Math.round((1-h)*f[1]+h*d[1]).toString(16))+tt(Math.round((1-h)*f[2]+h*d[2]).toString(16))}return s.trim()},fe=function(t,e){e||(e=21);var r=Xt(),n=he(t.colors,e),i=[];i.push({key:"FunctionType",value:"0"}),i.push({key:"Domain",value:"[0.0 1.0]"}),i.push({key:"Size",value:"["+e+"]"}),i.push({key:"BitsPerSample",value:"8"}),i.push({key:"Range",value:"[0.0 1.0 0.0 1.0 0.0 1.0]"}),i.push({key:"Decode",value:"[0.0 1.0 0.0 1.0 0.0 1.0]"}),ie({data:n,additionalKeyValues:i,alreadyAppliedFilters:["/ASCIIHexDecode"],objectId:r}),ht("endobj"),t.objectNumber=Xt(),ht("<< /ShadingType "+t.type),ht("/ColorSpace /DeviceRGB");var a="/Coords ["+E(parseFloat(t.coords[0]))+" "+E(parseFloat(t.coords[1]))+" ";2===t.type?a+=E(parseFloat(t.coords[2]))+" "+E(parseFloat(t.coords[3])):a+=E(parseFloat(t.coords[2]))+" "+E(parseFloat(t.coords[3]))+" "+E(parseFloat(t.coords[4]))+" "+E(parseFloat(t.coords[5])),ht(a+="]"),t.matrix&&ht("/Matrix ["+t.matrix.toString()+"]"),ht("/Function "+r+" 0 R"),ht("/Extend [true true]"),ht(">>"),ht("endobj")},de=function(t,e){var r=Kt(),n=Xt();e.push({resourcesOid:r,objectOid:n}),t.objectNumber=n;var i=[];i.push({key:"Type",value:"/Pattern"}),i.push({key:"PatternType",value:"1"}),i.push({key:"PaintType",value:"1"}),i.push({key:"TilingType",value:"1"}),i.push({key:"BBox",value:"["+t.boundingBox.map(E).join(" ")+"]"}),i.push({key:"XStep",value:E(t.xStep)}),i.push({key:"YStep",value:E(t.yStep)}),i.push({key:"Resources",value:r+" 0 R"}),t.matrix&&i.push({key:"Matrix",value:"["+t.matrix.toString()+"]"}),ie({data:t.stream,additionalKeyValues:i,objectId:t.objectNumber}),ht("endobj")},pe=function(t){var e;for(e in Ot)Ot.hasOwnProperty(e)&&(Ot[e]instanceof O?fe(Ot[e]):Ot[e]instanceof B&&de(Ot[e],t))},ge=function(t){for(var e in t.objectNumber=Xt(),ht("<<"),t)switch(e){case"opacity":ht("/ca "+R(t[e]));break;case"stroke-opacity":ht("/CA "+R(t[e]))}ht(">>"),ht("endobj")},me=function(){var t;for(t in Mt)Mt.hasOwnProperty(t)&&ge(Mt[t])},ve=function(){for(var t in ht("/XObject <<"),zt)zt.hasOwnProperty(t)&&zt[t].objectNumber>=0&&ht("/"+t+" "+zt[t].objectNumber+" 0 R");Tt.publish("putXobjectDict"),ht(">>")},be=function(){Ye.oid=Xt(),ht("<<"),ht("/Filter /Standard"),ht("/V "+Ye.v),ht("/R "+Ye.r),ht("/U <"+Ye.toHexString(Ye.U)+">"),ht("/O <"+Ye.toHexString(Ye.O)+">"),ht("/P "+Ye.P),ht(">>"),ht("endobj")},ye=function(){for(var t in ht("/Font <<"),It)It.hasOwnProperty(t)&&(!1===v||!0===v&&b.hasOwnProperty(t))&&ht("/"+t+" "+It[t].objectNumber+" 0 R");ht(">>")},we=function(){if(Object.keys(Ot).length>0){for(var t in ht("/Shading <<"),Ot)Ot.hasOwnProperty(t)&&Ot[t]instanceof O&&Ot[t].objectNumber>=0&&ht("/"+t+" "+Ot[t].objectNumber+" 0 R");Tt.publish("putShadingPatternDict"),ht(">>")}},Ne=function(t){if(Object.keys(Ot).length>0){for(var e in ht("/Pattern <<"),Ot)Ot.hasOwnProperty(e)&&Ot[e]instanceof y.TilingPattern&&Ot[e].objectNumber>=0&&Ot[e].objectNumber<t&&ht("/"+e+" "+Ot[e].objectNumber+" 0 R");Tt.publish("putTilingPatternDict"),ht(">>")}},Le=function(){if(Object.keys(Mt).length>0){var t;for(t in ht("/ExtGState <<"),Mt)Mt.hasOwnProperty(t)&&Mt[t].objectNumber>=0&&ht("/"+t+" "+Mt[t].objectNumber+" 0 R");Tt.publish("putGStateDict"),ht(">>")}},Ae=function(t){Zt(t.resourcesOid,!0),ht("<<"),ht("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]"),ye(),we(),Ne(t.objectOid),Le(),ve(),ht(">>"),ht("endobj")},xe=function(){var t=[];ce(),me(),le(),pe(t),Tt.publish("putResources"),t.forEach(Ae),Ae({resourcesOid:te,objectOid:Number.MAX_SAFE_INTEGER}),Tt.publish("postPutResources")},Se=function(){Tt.publish("putAdditionalObjects");for(var t=0;t<at.length;t++){var e=at[t];Zt(e.objId,!0),ht(e.content),ht("endobj")}Tt.publish("postPutAdditionalObjects")},_e=function(t){Ct[t.fontName]=Ct[t.fontName]||{},Ct[t.fontName][t.fontStyle]=t.id},Pe=function(t,e,r,n,i){var a={id:"F"+(Object.keys(It).length+1).toString(10),postScriptName:t,fontName:e,fontStyle:r,encoding:n,isStandardFont:i||!1,metadata:{}};return Tt.publish("addFont",{font:a,instance:this}),It[a.id]=a,_e(a),a.id},ke=function(t){for(var e=0,r=pt.length;e<r;e++){var n=Pe.call(this,t[e][0],t[e][1],t[e][2],pt[e][3],!0);!1===v&&(b[n]=!0);var i=t[e][0].split("-");_e({id:n,fontName:i[0],fontStyle:i[1]||""})}Tt.publish("addFonts",{fonts:It,dictionary:Ct})},Fe=function(t){return t.foo=function(){try{return t.apply(this,arguments)}catch(t){var e=t.stack||"";~e.indexOf(" at ")&&(e=e.split(" at ")[1]);var n="Error in function "+e.split("\n")[0].split("<")[0]+": "+t.message;if(!r.console)throw new Error(n);r.console.error(n,t),r.alert&&alert(n)}},t.foo.bar=t,t.foo},Ie=function(t,e){var r,n,i,a,o,s,c,u,l;if(i=(e=e||{}).sourceEncoding||"Unicode",o=e.outputEncoding,(e.autoencode||o)&&It[St].metadata&&It[St].metadata[i]&&It[St].metadata[i].encoding&&(a=It[St].metadata[i].encoding,!o&&It[St].encoding&&(o=It[St].encoding),!o&&a.codePages&&(o=a.codePages[0]),"string"==typeof o&&(o=a[o]),o)){for(c=!1,s=[],r=0,n=t.length;r<n;r++)(u=o[t.charCodeAt(r)])?s.push(String.fromCharCode(u)):s.push(t[r]),s[r].charCodeAt(0)>>8&&(c=!0);t=s.join("")}for(r=t.length;void 0===c&&0!==r;)t.charCodeAt(r-1)>>8&&(c=!0),r--;if(!c)return t;for(s=e.noBOM?[]:[254,255],r=0,n=t.length;r<n;r++){if((l=(u=t.charCodeAt(r))>>8)>>8)throw new Error("Character at position "+r+" of string '"+t+"' exceeds 16bits. Cannot be encoded into UCS-2 BE");s.push(l),s.push(u-(l<<8))}return String.fromCharCode.apply(void 0,s)},Ce=y.__private__.pdfEscape=y.pdfEscape=function(t,e){return Ie(t,e).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)")},je=y.__private__.beginPage=function(t){ot[++Dt]=[],Rt[Dt]={objId:0,contentsObjId:0,userUnit:Number(d),artBox:null,bleedBox:null,cropBox:null,trimBox:null,mediaBox:{bottomLeftX:0,bottomLeftY:0,topRightX:Number(t[0]),topRightY:Number(t[1])}},Me(Dt),lt(ot[$])},Oe=function(t,e){var r,n,o;switch(a=e||a,"string"==typeof t&&(r=A(t.toLowerCase()),Array.isArray(r)&&(n=r[0],o=r[1])),Array.isArray(t)&&(n=t[0]*_t,o=t[1]*_t),isNaN(n)&&(n=s[0],o=s[1]),(n>14400||o>14400)&&(i.warn("A page in a PDF can not be wider or taller than 14400 userUnit. jsPDF limits the width/height to 14400"),n=Math.min(14400,n),o=Math.min(14400,o)),s=[n,o],a.substr(0,1)){case"l":o>n&&(s=[o,n]);break;case"p":n>o&&(s=[o,n])}je(s),pr(fr),ht(Lr),0!==kr&&ht(kr+" J"),0!==Fr&&ht(Fr+" j"),Tt.publish("addPage",{pageNumber:Dt})},Be=function(t){t>0&&t<=Dt&&(ot.splice(t,1),Rt.splice(t,1),Dt--,$>Dt&&($=Dt),this.setPage($))},Me=function(t){t>0&&t<=Dt&&($=t)},Ee=y.__private__.getNumberOfPages=y.getNumberOfPages=function(){return ot.length-1},qe=function(t,e,r){var n,a=void 0;return r=r||{},t=void 0!==t?t:It[St].fontName,e=void 0!==e?e:It[St].fontStyle,n=t.toLowerCase(),void 0!==Ct[n]&&void 0!==Ct[n][e]?a=Ct[n][e]:void 0!==Ct[t]&&void 0!==Ct[t][e]?a=Ct[t][e]:!1===r.disableWarning&&i.warn("Unable to look up font label for font '"+t+"', '"+e+"'. Refer to getFontList() for available fonts."),a||r.noFallback||null==(a=Ct.times[e])&&(a=Ct.times.normal),a},De=y.__private__.putInfo=function(){var t=Xt(),e=function(t){return t};for(var r in null!==m&&(e=Ye.encryptor(t,0)),ht("<<"),ht("/Producer ("+Ce(e("jsPDF "+M.version))+")"),xt)xt.hasOwnProperty(r)&&xt[r]&&ht("/"+r.substr(0,1).toUpperCase()+r.substr(1)+" ("+Ce(e(xt[r]))+")");ht("/CreationDate ("+Ce(e(W))+")"),ht(">>"),ht("endobj")},Re=y.__private__.putCatalog=function(t){var e=(t=t||{}).rootDictionaryObjId||Qt;switch(Xt(),ht("<<"),ht("/Type /Catalog"),ht("/Pages "+e+" 0 R"),mt||(mt="fullwidth"),mt){case"fullwidth":ht("/OpenAction [3 0 R /FitH null]");break;case"fullheight":ht("/OpenAction [3 0 R /FitV null]");break;case"fullpage":ht("/OpenAction [3 0 R /Fit]");break;case"original":ht("/OpenAction [3 0 R /XYZ null null 1]");break;default:var r=""+mt;"%"===r.substr(r.length-1)&&(mt=parseInt(mt)/100),"number"==typeof mt&&ht("/OpenAction [3 0 R /XYZ null null "+R(mt)+"]")}switch(Nt||(Nt="continuous"),Nt){case"continuous":ht("/PageLayout /OneColumn");break;case"single":ht("/PageLayout /SinglePage");break;case"two":case"twoleft":ht("/PageLayout /TwoColumnLeft");break;case"tworight":ht("/PageLayout /TwoColumnRight")}yt&&ht("/PageMode /"+yt),Tt.publish("putCatalog"),ht(">>"),ht("endobj")},Te=y.__private__.putTrailer=function(){ht("trailer"),ht("<<"),ht("/Size "+(et+1)),ht("/Root "+et+" 0 R"),ht("/Info "+(et-1)+" 0 R"),null!==m&&ht("/Encrypt "+Ye.oid+" 0 R"),ht("/ID [ <"+V+"> <"+V+"> ]"),ht(">>")},Ue=y.__private__.putHeader=function(){ht("%PDF-"+w),ht("%ºß¬à")},ze=y.__private__.putXRef=function(){var t="0000000000";ht("xref"),ht("0 "+(et+1)),ht("0000000000 65535 f ");for(var e=1;e<=et;e++){"function"==typeof rt[e]?ht((t+rt[e]()).slice(-10)+" 00000 n "):void 0!==rt[e]?ht((t+rt[e]).slice(-10)+" 00000 n "):ht("0000000000 00000 n ")}},He=y.__private__.buildDocument=function(){ut(),lt(nt),Tt.publish("buildDocument"),Ue(),oe(),Se(),xe(),null!==m&&be(),De(),Re();var t=it;return ze(),Te(),ht("startxref"),ht(""+t),ht("%%EOF"),lt(ot[$]),nt.join("\n")},We=y.__private__.getBlob=function(t){return new Blob([dt(t)],{type:"application/pdf"})},Ve=y.output=y.__private__.output=Fe((function(t,e){switch("string"==typeof(e=e||{})?e={filename:e}:e.filename=e.filename||"generated.pdf",t){case void 0:return He();case"save":y.save(e.filename);break;case"arraybuffer":return dt(He());case"blob":return We(He());case"bloburi":case"bloburl":if(void 0!==r.URL&&"function"==typeof r.URL.createObjectURL)return r.URL&&r.URL.createObjectURL(We(He()))||void 0;i.warn("bloburl is not supported by your system, because URL.createObjectURL is not supported by your browser.");break;case"datauristring":case"dataurlstring":var n="",a=He();try{n=u(a)}catch(t){n=u(unescape(encodeURIComponent(a)))}return"data:application/pdf;filename="+e.filename+";base64,"+n;case"pdfobjectnewwindow":if("[object Window]"===Object.prototype.toString.call(r)){var o="https://cdnjs.cloudflare.com/ajax/libs/pdfobject/2.1.1/pdfobject.min.js",s=' integrity="sha512-4ze/a9/4jqu+tX9dfOqJYSvyYd5M6qum/3HpCLr+/Jqf0whc37VUbkpNGHR7/8pSnCFw47T1fmIpwBV7UySh3g==" crossorigin="anonymous"';e.pdfObjectUrl&&(o=e.pdfObjectUrl,s="");var c='<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><script src="'+o+'"'+s+'><\/script><script >PDFObject.embed("'+this.output("dataurlstring")+'", '+JSON.stringify(e)+");<\/script></body></html>",l=r.open();return null!==l&&l.document.write(c),l}throw new Error("The option pdfobjectnewwindow just works in a browser-environment.");case"pdfjsnewwindow":if("[object Window]"===Object.prototype.toString.call(r)){var h='<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><iframe id="pdfViewer" src="'+(e.pdfJsUrl||"examples/PDF.js/web/viewer.html")+"?file=&downloadName="+e.filename+'" width="500px" height="400px" /></body></html>',f=r.open();if(null!==f){f.document.write(h);var d=this;f.document.documentElement.querySelector("#pdfViewer").onload=function(){f.document.title=e.filename,f.document.documentElement.querySelector("#pdfViewer").contentWindow.PDFViewerApplication.open(d.output("bloburl"))}}return f}throw new Error("The option pdfjsnewwindow just works in a browser-environment.");case"dataurlnewwindow":if("[object Window]"!==Object.prototype.toString.call(r))throw new Error("The option dataurlnewwindow just works in a browser-environment.");var p='<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><iframe src="'+this.output("datauristring",e)+'"></iframe></body></html>',g=r.open();if(null!==g&&(g.document.write(p),g.document.title=e.filename),g||"undefined"==typeof safari)return g;break;case"datauri":case"dataurl":return r.document.location.href=this.output("datauristring",e);default:return null}})),Ge=function(t){return!0===Array.isArray(Ut)&&Ut.indexOf(t)>-1};switch(o){case"pt":_t=1;break;case"mm":_t=72/25.4;break;case"cm":_t=72/2.54;break;case"in":_t=72;break;case"px":_t=1==Ge("px_scaling")?.75:96/72;break;case"pc":case"em":_t=12;break;case"ex":_t=6;break;default:if("number"!=typeof o)throw new Error("Invalid unit: "+o);_t=o}var Ye=null;K(),Y();var Je=function(t){return null!==m?Ye.encryptor(t,0):function(t){return t}},Xe=y.__private__.getPageInfo=y.getPageInfo=function(t){if(isNaN(t)||t%1!=0)throw new Error("Invalid argument passed to jsPDF.getPageInfo");return{objId:Rt[t].objId,pageNumber:t,pageContext:Rt[t]}},Ke=y.__private__.getPageInfoByObjId=function(t){if(isNaN(t)||t%1!=0)throw new Error("Invalid argument passed to jsPDF.getPageInfoByObjId");for(var e in Rt)if(Rt[e].objId===t)break;return Xe(e)},Ze=y.__private__.getCurrentPageInfo=y.getCurrentPageInfo=function(){return{objId:Rt[$].objId,pageNumber:$,pageContext:Rt[$]}};y.addPage=function(){return Oe.apply(this,arguments),this},y.setPage=function(){return Me.apply(this,arguments),lt.call(this,ot[$]),this},y.insertPage=function(t){return this.addPage(),this.movePage($,t),this},y.movePage=function(t,e){var r,n;if(t>e){r=ot[t],n=Rt[t];for(var i=t;i>e;i--)ot[i]=ot[i-1],Rt[i]=Rt[i-1];ot[e]=r,Rt[e]=n,this.setPage(e)}else if(t<e){r=ot[t],n=Rt[t];for(var a=t;a<e;a++)ot[a]=ot[a+1],Rt[a]=Rt[a+1];ot[e]=r,Rt[e]=n,this.setPage(e)}return this},y.deletePage=function(){return Be.apply(this,arguments),this},y.__private__.text=y.text=function(t,r,n,i,a){var o,s,c,u,l,h,f,d,p,g=(i=i||{}).scope||this;if("number"==typeof t&&"number"==typeof r&&("string"==typeof n||Array.isArray(n))){var m=n;n=r,r=t,t=m}if(arguments[3]instanceof Vt==!1?(c=arguments[4],u=arguments[5],"object"===e(f=arguments[3])&&null!==f||("string"==typeof c&&(u=c,c=null),"string"==typeof f&&(u=f,f=null),"number"==typeof f&&(c=f,f=null),i={flags:f,angle:c,align:u})):(q("The transform parameter of text() with a Matrix value"),p=a),isNaN(r)||isNaN(n)||null==t)throw new Error("Invalid arguments passed to jsPDF.text");if(0===t.length)return g;var v="",y=!1,w="number"==typeof i.lineHeightFactor?i.lineHeightFactor:hr,N=g.internal.scaleFactor;function L(t){return t=t.split("\t").join(Array(i.TabLen||9).join(" ")),Ce(t,f)}function A(t){for(var e,r=t.concat(),n=[],i=r.length;i--;)"string"==typeof(e=r.shift())?n.push(e):Array.isArray(t)&&(1===e.length||void 0===e[1]&&void 0===e[2])?n.push(e[0]):n.push([e[0],e[1],e[2]]);return n}function _(t,e){var r;if("string"==typeof t)r=e(t)[0];else if(Array.isArray(t)){for(var n,i,a=t.concat(),o=[],s=a.length;s--;)"string"==typeof(n=a.shift())?o.push(e(n)[0]):Array.isArray(n)&&"string"==typeof n[0]&&(i=e(n[0],n[1],n[2]),o.push([i[0],i[1],i[2]]));r=o}return r}var P=!1,k=!0;if("string"==typeof t)P=!0;else if(Array.isArray(t)){var F=t.concat();s=[];for(var I,C=F.length;C--;)("string"!=typeof(I=F.shift())||Array.isArray(I)&&"string"!=typeof I[0])&&(k=!1);P=k}if(!1===P)throw new Error('Type of text must be string or Array. "'+t+'" is not recognized.');"string"==typeof t&&(t=t.match(/[\r?\n]/)?t.split(/\r\n|\r|\n/g):[t]);var j=gt/g.internal.scaleFactor,O=j*(w-1);switch(i.baseline){case"bottom":n-=O;break;case"top":n+=j-O;break;case"hanging":n+=j-2*O;break;case"middle":n+=j/2-O}if((h=i.maxWidth||0)>0&&("string"==typeof t?t=g.splitTextToSize(t,h):"[object Array]"===Object.prototype.toString.call(t)&&(t=t.reduce((function(t,e){return t.concat(g.splitTextToSize(e,h))}),[]))),o={text:t,x:r,y:n,options:i,mutex:{pdfEscape:Ce,activeFontKey:St,fonts:It,activeFontSize:gt}},Tt.publish("preProcessText",o),t=o.text,c=(i=o.options).angle,p instanceof Vt==!1&&c&&"number"==typeof c){c*=Math.PI/180,0===i.rotationDirection&&(c=-c),S===x.ADVANCED&&(c=-c);var B=Math.cos(c),M=Math.sin(c);p=new Vt(B,M,-M,B,0,0)}else c&&c instanceof Vt&&(p=c);S!==x.ADVANCED||p||(p=Yt),void 0!==(l=i.charSpace||_r)&&(v+=E(U(l))+" Tc\n",this.setCharSpace(this.getCharSpace()||0)),void 0!==(d=i.horizontalScale)&&(v+=E(100*d)+" Tz\n");i.lang;var D=-1,R=void 0!==i.renderingMode?i.renderingMode:i.stroke,T=g.internal.getCurrentPageInfo().pageContext;switch(R){case 0:case!1:case"fill":D=0;break;case 1:case!0:case"stroke":D=1;break;case 2:case"fillThenStroke":D=2;break;case 3:case"invisible":D=3;break;case 4:case"fillAndAddForClipping":D=4;break;case 5:case"strokeAndAddPathForClipping":D=5;break;case 6:case"fillThenStrokeAndAddToPathForClipping":D=6;break;case 7:case"addToPathForClipping":D=7}var z=void 0!==T.usedRenderingMode?T.usedRenderingMode:-1;-1!==D?v+=D+" Tr\n":-1!==z&&(v+="0 Tr\n"),-1!==D&&(T.usedRenderingMode=D),u=i.align||"left";var H,W=gt*w,V=g.internal.pageSize.getWidth(),G=It[St];l=i.charSpace||_r,h=i.maxWidth||0,f=Object.assign({autoencode:!0,noBOM:!0},i.flags);var Y=[];if("[object Array]"===Object.prototype.toString.call(t)){var J;s=A(t),"left"!==u&&(H=s.map((function(t){return g.getStringUnitWidth(t,{font:G,charSpace:l,fontSize:gt,doKerning:!1})*gt/N})));var X,K=0;if("right"===u){r-=H[0],t=[],C=s.length;for(var Z=0;Z<C;Z++)0===Z?(X=br(r),J=yr(n)):(X=U(K-H[Z]),J=-W),t.push([s[Z],X,J]),K=H[Z]}else if("center"===u){r-=H[0]/2,t=[],C=s.length;for(var $=0;$<C;$++)0===$?(X=br(r),J=yr(n)):(X=U((K-H[$])/2),J=-W),t.push([s[$],X,J]),K=H[$]}else if("left"===u){t=[],C=s.length;for(var Q=0;Q<C;Q++)t.push(s[Q])}else{if("justify"!==u)throw new Error('Unrecognized alignment option, use "left", "center", "right" or "justify".');t=[],C=s.length,h=0!==h?h:V;for(var tt=0;tt<C;tt++)J=0===tt?yr(n):-W,X=0===tt?br(r):0,tt<C-1?Y.push(E(U((h-H[tt])/(s[tt].split(" ").length-1)))):Y.push(0),t.push([s[tt],X,J])}}var et="boolean"==typeof i.R2L?i.R2L:bt;!0===et&&(t=_(t,(function(t,e,r){return[t.split("").reverse().join(""),e,r]}))),o={text:t,x:r,y:n,options:i,mutex:{pdfEscape:Ce,activeFontKey:St,fonts:It,activeFontSize:gt}},Tt.publish("postProcessText",o),t=o.text,y=o.mutex.isHex||!1;var rt=It[St].encoding;"WinAnsiEncoding"!==rt&&"StandardEncoding"!==rt||(t=_(t,(function(t,e,r){return[L(t),e,r]}))),s=A(t),t=[];for(var nt,it,at,ot=0,st=1,ct=Array.isArray(s[0])?st:ot,ut="",lt=function(t,e,r){var n="";return r instanceof Vt?(r="number"==typeof i.angle?Gt(r,new Vt(1,0,0,1,t,e)):Gt(new Vt(1,0,0,1,t,e),r),S===x.ADVANCED&&(r=Gt(new Vt(1,0,0,-1,0,0),r)),n=r.join(" ")+" Tm\n"):n=E(t)+" "+E(e)+" Td\n",n},ft=0;ft<s.length;ft++){switch(ut="",ct){case st:at=(y?"<":"(")+s[ft][0]+(y?">":")"),nt=parseFloat(s[ft][1]),it=parseFloat(s[ft][2]);break;case ot:at=(y?"<":"(")+s[ft]+(y?">":")"),nt=br(r),it=yr(n)}void 0!==Y&&void 0!==Y[ft]&&(ut=Y[ft]+" Tw\n"),0===ft?t.push(ut+lt(nt,it,p)+at):ct===ot?t.push(ut+at):ct===st&&t.push(ut+lt(nt,it,p)+at)}t=ct===ot?t.join(" Tj\nT* "):t.join(" Tj\n"),t+=" Tj\n";var dt="BT\n/";return dt+=St+" "+gt+" Tf\n",dt+=E(gt*w)+" TL\n",dt+=xr+"\n",dt+=v,dt+=t,ht(dt+="ET"),b[St]=!0,g};var $e=y.__private__.clip=y.clip=function(t){return ht("evenodd"===t?"W*":"W"),this};y.clipEvenOdd=function(){return $e("evenodd")},y.__private__.discardPath=y.discardPath=function(){return ht("n"),this};var Qe=y.__private__.isValidStyle=function(t){var e=!1;return-1!==[void 0,null,"S","D","F","DF","FD","f","f*","B","B*","n"].indexOf(t)&&(e=!0),e};y.__private__.setDefaultPathOperation=y.setDefaultPathOperation=function(t){return Qe(t)&&(g=t),this};var tr=y.__private__.getStyle=y.getStyle=function(t){var e=g;switch(t){case"D":case"S":e="S";break;case"F":e="f";break;case"FD":case"DF":e="B";break;case"f":case"f*":case"B":case"B*":e=t}return e},er=y.close=function(){return ht("h"),this};y.stroke=function(){return ht("S"),this},y.fill=function(t){return rr("f",t),this},y.fillEvenOdd=function(t){return rr("f*",t),this},y.fillStroke=function(t){return rr("B",t),this},y.fillStrokeEvenOdd=function(t){return rr("B*",t),this};var rr=function(t,r){"object"===e(r)?ar(r,t):ht(t)},nr=function(t){null===t||S===x.ADVANCED&&void 0===t||(t=tr(t),ht(t))};function ir(t,e,r,n,i){var a=new B(e||this.boundingBox,r||this.xStep,n||this.yStep,this.gState,i||this.matrix);a.stream=this.stream;var o=t+"$$"+this.cloneIndex+++"$$";return Jt(o,a),a}var ar=function(t,e){var r=Bt[t.key],n=Ot[r];if(n instanceof O)ht("q"),ht(or(e)),n.gState&&y.setGState(n.gState),ht(t.matrix.toString()+" cm"),ht("/"+r+" sh"),ht("Q");else if(n instanceof B){var i=new Vt(1,0,0,-1,0,Rr());t.matrix&&(i=i.multiply(t.matrix||Yt),r=ir.call(n,t.key,t.boundingBox,t.xStep,t.yStep,i).id),ht("q"),ht("/Pattern cs"),ht("/"+r+" scn"),n.gState&&y.setGState(n.gState),ht(e),ht("Q")}},or=function(t){switch(t){case"f":case"F":return"W n";case"f*":return"W* n";case"B":return"W S";case"B*":return"W* S";case"S":return"W S";case"n":return"W n"}},sr=y.moveTo=function(t,e){return ht(E(U(t))+" "+E(H(e))+" m"),this},cr=y.lineTo=function(t,e){return ht(E(U(t))+" "+E(H(e))+" l"),this},ur=y.curveTo=function(t,e,r,n,i,a){return ht([E(U(t)),E(H(e)),E(U(r)),E(H(n)),E(U(i)),E(H(a)),"c"].join(" ")),this};y.__private__.line=y.line=function(t,e,r,n,i){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||!Qe(i))throw new Error("Invalid arguments passed to jsPDF.line");return S===x.COMPAT?this.lines([[r-t,n-e]],t,e,[1,1],i||"S"):this.lines([[r-t,n-e]],t,e,[1,1]).stroke()},y.__private__.lines=y.lines=function(t,e,r,n,i,a){var o,s,c,u,l,h,f,d,p,g,m,v;if("number"==typeof t&&(v=r,r=e,e=t,t=v),n=n||[1,1],a=a||!1,isNaN(e)||isNaN(r)||!Array.isArray(t)||!Array.isArray(n)||!Qe(i)||"boolean"!=typeof a)throw new Error("Invalid arguments passed to jsPDF.lines");for(sr(e,r),o=n[0],s=n[1],u=t.length,g=e,m=r,c=0;c<u;c++)2===(l=t[c]).length?(g=l[0]*o+g,m=l[1]*s+m,cr(g,m)):(h=l[0]*o+g,f=l[1]*s+m,d=l[2]*o+g,p=l[3]*s+m,g=l[4]*o+g,m=l[5]*s+m,ur(h,f,d,p,g,m));return a&&er(),nr(i),this},y.path=function(t){for(var e=0;e<t.length;e++){var r=t[e],n=r.c;switch(r.op){case"m":sr(n[0],n[1]);break;case"l":cr(n[0],n[1]);break;case"c":ur.apply(this,n);break;case"h":er()}}return this},y.__private__.rect=y.rect=function(t,e,r,n,i){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||!Qe(i))throw new Error("Invalid arguments passed to jsPDF.rect");return S===x.COMPAT&&(n=-n),ht([E(U(t)),E(H(e)),E(U(r)),E(U(n)),"re"].join(" ")),nr(i),this},y.__private__.triangle=y.triangle=function(t,e,r,n,i,a,o){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||isNaN(i)||isNaN(a)||!Qe(o))throw new Error("Invalid arguments passed to jsPDF.triangle");return this.lines([[r-t,n-e],[i-r,a-n],[t-i,e-a]],t,e,[1,1],o,!0),this},y.__private__.roundedRect=y.roundedRect=function(t,e,r,n,i,a,o){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||isNaN(i)||isNaN(a)||!Qe(o))throw new Error("Invalid arguments passed to jsPDF.roundedRect");var s=4/3*(Math.SQRT2-1);return i=Math.min(i,.5*r),a=Math.min(a,.5*n),this.lines([[r-2*i,0],[i*s,0,i,a-a*s,i,a],[0,n-2*a],[0,a*s,-i*s,a,-i,a],[2*i-r,0],[-i*s,0,-i,-a*s,-i,-a],[0,2*a-n],[0,-a*s,i*s,-a,i,-a]],t+i,e,[1,1],o,!0),this},y.__private__.ellipse=y.ellipse=function(t,e,r,n,i){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||!Qe(i))throw new Error("Invalid arguments passed to jsPDF.ellipse");var a=4/3*(Math.SQRT2-1)*r,o=4/3*(Math.SQRT2-1)*n;return sr(t+r,e),ur(t+r,e-o,t+a,e-n,t,e-n),ur(t-a,e-n,t-r,e-o,t-r,e),ur(t-r,e+o,t-a,e+n,t,e+n),ur(t+a,e+n,t+r,e+o,t+r,e),nr(i),this},y.__private__.circle=y.circle=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||!Qe(n))throw new Error("Invalid arguments passed to jsPDF.circle");return this.ellipse(t,e,r,r,n)},y.setFont=function(t,e,r){return r&&(e=j(e,r)),St=qe(t,e,{disableWarning:!1}),this};var lr=y.__private__.getFont=y.getFont=function(){return It[qe.apply(y,arguments)]};y.__private__.getFontList=y.getFontList=function(){var t,e,r={};for(t in Ct)if(Ct.hasOwnProperty(t))for(e in r[t]=[],Ct[t])Ct[t].hasOwnProperty(e)&&r[t].push(e);return r},y.addFont=function(t,e,r,n,i){var a=["StandardEncoding","MacRomanEncoding","Identity-H","WinAnsiEncoding"];return arguments[3]&&-1!==a.indexOf(arguments[3])?i=arguments[3]:arguments[3]&&-1==a.indexOf(arguments[3])&&(r=j(r,n)),i=i||"Identity-H",Pe.call(this,t,e,r,i)};var hr,fr=t.lineWidth||.200025,dr=y.__private__.getLineWidth=y.getLineWidth=function(){return fr},pr=y.__private__.setLineWidth=y.setLineWidth=function(t){return fr=t,ht(E(U(t))+" w"),this};y.__private__.setLineDash=M.API.setLineDash=M.API.setLineDashPattern=function(t,e){if(t=t||[],e=e||0,isNaN(e)||!Array.isArray(t))throw new Error("Invalid arguments passed to jsPDF.setLineDash");return t=t.map((function(t){return E(U(t))})).join(" "),e=E(U(e)),ht("["+t+"] "+e+" d"),this};var gr=y.__private__.getLineHeight=y.getLineHeight=function(){return gt*hr};y.__private__.getLineHeight=y.getLineHeight=function(){return gt*hr};var mr=y.__private__.setLineHeightFactor=y.setLineHeightFactor=function(t){return"number"==typeof(t=t||1.15)&&(hr=t),this},vr=y.__private__.getLineHeightFactor=y.getLineHeightFactor=function(){return hr};mr(t.lineHeight);var br=y.__private__.getHorizontalCoordinate=function(t){return U(t)},yr=y.__private__.getVerticalCoordinate=function(t){return S===x.ADVANCED?t:Rt[$].mediaBox.topRightY-Rt[$].mediaBox.bottomLeftY-U(t)},wr=y.__private__.getHorizontalCoordinateString=y.getHorizontalCoordinateString=function(t){return E(br(t))},Nr=y.__private__.getVerticalCoordinateString=y.getVerticalCoordinateString=function(t){return E(yr(t))},Lr=t.strokeColor||"0 G";y.__private__.getStrokeColor=y.getDrawColor=function(){return ee(Lr)},y.__private__.setStrokeColor=y.setDrawColor=function(t,e,r,n){return Lr=re({ch1:t,ch2:e,ch3:r,ch4:n,pdfColorType:"draw",precision:2}),ht(Lr),this};var Ar=t.fillColor||"0 g";y.__private__.getFillColor=y.getFillColor=function(){return ee(Ar)},y.__private__.setFillColor=y.setFillColor=function(t,e,r,n){return Ar=re({ch1:t,ch2:e,ch3:r,ch4:n,pdfColorType:"fill",precision:2}),ht(Ar),this};var xr=t.textColor||"0 g",Sr=y.__private__.getTextColor=y.getTextColor=function(){return ee(xr)};y.__private__.setTextColor=y.setTextColor=function(t,e,r,n){return xr=re({ch1:t,ch2:e,ch3:r,ch4:n,pdfColorType:"text",precision:3}),this};var _r=t.charSpace,Pr=y.__private__.getCharSpace=y.getCharSpace=function(){return parseFloat(_r||0)};y.__private__.setCharSpace=y.setCharSpace=function(t){if(isNaN(t))throw new Error("Invalid argument passed to jsPDF.setCharSpace");return _r=t,this};var kr=0;y.CapJoinStyles={0:0,butt:0,but:0,miter:0,1:1,round:1,rounded:1,circle:1,2:2,projecting:2,project:2,square:2,bevel:2},y.__private__.setLineCap=y.setLineCap=function(t){var e=y.CapJoinStyles[t];if(void 0===e)throw new Error("Line cap style of '"+t+"' is not recognized. See or extend .CapJoinStyles property for valid styles");return kr=e,ht(e+" J"),this};var Fr=0;y.__private__.setLineJoin=y.setLineJoin=function(t){var e=y.CapJoinStyles[t];if(void 0===e)throw new Error("Line join style of '"+t+"' is not recognized. See or extend .CapJoinStyles property for valid styles");return Fr=e,ht(e+" j"),this},y.__private__.setLineMiterLimit=y.__private__.setMiterLimit=y.setLineMiterLimit=y.setMiterLimit=function(t){if(t=t||0,isNaN(t))throw new Error("Invalid argument passed to jsPDF.setLineMiterLimit");return ht(E(U(t))+" M"),this},y.GState=C,y.setGState=function(t){(t="string"==typeof t?Mt[Et[t]]:Ir(null,t)).equals(qt)||(ht("/"+t.id+" gs"),qt=t)};var Ir=function(t,e){if(!t||!Et[t]){var r=!1;for(var n in Mt)if(Mt.hasOwnProperty(n)&&Mt[n].equals(e)){r=!0;break}if(r)e=Mt[n];else{var i="GS"+(Object.keys(Mt).length+1).toString(10);Mt[i]=e,e.id=i}return t&&(Et[t]=e.id),Tt.publish("addGState",e),e}};y.addGState=function(t,e){return Ir(t,e),this},y.saveGraphicsState=function(){return ht("q"),jt.push({key:St,size:gt,color:xr}),this},y.restoreGraphicsState=function(){ht("Q");var t=jt.pop();return St=t.key,gt=t.size,xr=t.color,qt=null,this},y.setCurrentTransformationMatrix=function(t){return ht(t.toString()+" cm"),this},y.comment=function(t){return ht("#"+t),this};var Cr=function(t,e){var r=t||0;Object.defineProperty(this,"x",{enumerable:!0,get:function(){return r},set:function(t){isNaN(t)||(r=parseFloat(t))}});var n=e||0;Object.defineProperty(this,"y",{enumerable:!0,get:function(){return n},set:function(t){isNaN(t)||(n=parseFloat(t))}});var i="pt";return Object.defineProperty(this,"type",{enumerable:!0,get:function(){return i},set:function(t){i=t.toString()}}),this},jr=function(t,e,r,n){Cr.call(this,t,e),this.type="rect";var i=r||0;Object.defineProperty(this,"w",{enumerable:!0,get:function(){return i},set:function(t){isNaN(t)||(i=parseFloat(t))}});var a=n||0;return Object.defineProperty(this,"h",{enumerable:!0,get:function(){return a},set:function(t){isNaN(t)||(a=parseFloat(t))}}),this},Or=function(){this.page=Dt,this.currentPage=$,this.pages=ot.slice(0),this.pagesContext=Rt.slice(0),this.x=Pt,this.y=kt,this.matrix=Ft,this.width=qr($),this.height=Rr($),this.outputDestination=ct,this.id="",this.objectNumber=-1};Or.prototype.restore=function(){Dt=this.page,$=this.currentPage,Rt=this.pagesContext,ot=this.pages,Pt=this.x,kt=this.y,Ft=this.matrix,Dr($,this.width),Tr($,this.height),ct=this.outputDestination};var Br=function(t,e,r,n,i){Wt.push(new Or),Dt=$=0,ot=[],Pt=t,kt=e,Ft=i,je([r,n])},Mr=function(t){if(Ht[t])Wt.pop().restore();else{var e=new Or,r="Xo"+(Object.keys(zt).length+1).toString(10);e.id=r,Ht[t]=r,zt[r]=e,Tt.publish("addFormObject",e),Wt.pop().restore()}};for(var Er in y.beginFormObject=function(t,e,r,n,i){return Br(t,e,r,n,i),this},y.endFormObject=function(t){return Mr(t),this},y.doFormObject=function(t,e){var r=zt[Ht[t]];return ht("q"),ht(e.toString()+" cm"),ht("/"+r.id+" Do"),ht("Q"),this},y.getFormObject=function(t){var e=zt[Ht[t]];return{x:e.x,y:e.y,width:e.width,height:e.height,matrix:e.matrix}},y.save=function(t,e){return t=t||"generated.pdf",(e=e||{}).returnPromise=e.returnPromise||!1,!1===e.returnPromise?(l(We(He()),t),"function"==typeof l.unload&&r.setTimeout&&setTimeout(l.unload,911),this):new Promise((function(e,n){try{var i=l(We(He()),t);"function"==typeof l.unload&&r.setTimeout&&setTimeout(l.unload,911),e(i)}catch(t){n(t.message)}}))},M.API)M.API.hasOwnProperty(Er)&&("events"===Er&&M.API.events.length?function(t,e){var r,n,i;for(i=e.length-1;-1!==i;i--)r=e[i][0],n=e[i][1],t.subscribe.apply(t,[r].concat("function"==typeof n?[n]:n))}(Tt,M.API.events):y[Er]=M.API[Er]);var qr=y.getPageWidth=function(t){return(Rt[t=t||$].mediaBox.topRightX-Rt[t].mediaBox.bottomLeftX)/_t},Dr=y.setPageWidth=function(t,e){Rt[t].mediaBox.topRightX=e*_t+Rt[t].mediaBox.bottomLeftX},Rr=y.getPageHeight=function(t){return(Rt[t=t||$].mediaBox.topRightY-Rt[t].mediaBox.bottomLeftY)/_t},Tr=y.setPageHeight=function(t,e){Rt[t].mediaBox.topRightY=e*_t+Rt[t].mediaBox.bottomLeftY};return y.internal={pdfEscape:Ce,getStyle:tr,getFont:lr,getFontSize:vt,getCharSpace:Pr,getTextColor:Sr,getLineHeight:gr,getLineHeightFactor:vr,getLineWidth:dr,write:ft,getHorizontalCoordinate:br,getVerticalCoordinate:yr,getCoordinateString:wr,getVerticalCoordinateString:Nr,collections:{},newObject:Xt,newAdditionalObject:$t,newObjectDeferred:Kt,newObjectDeferredBegin:Zt,getFilters:ne,putStream:ie,events:Tt,scaleFactor:_t,pageSize:{getWidth:function(){return qr($)},setWidth:function(t){Dr($,t)},getHeight:function(){return Rr($)},setHeight:function(t){Tr($,t)}},encryptionOptions:m,encryption:Ye,getEncryptor:Je,output:Ve,getNumberOfPages:Ee,pages:ot,out:ht,f2:R,f3:T,getPageInfo:Xe,getPageInfoByObjId:Ke,getCurrentPageInfo:Ze,getPDFVersion:N,Point:Cr,Rectangle:jr,Matrix:Vt,hasHotfix:Ge},Object.defineProperty(y.internal.pageSize,"width",{get:function(){return qr($)},set:function(t){Dr($,t)},enumerable:!0,configurable:!0}),Object.defineProperty(y.internal.pageSize,"height",{get:function(){return Rr($)},set:function(t){Tr($,t)},enumerable:!0,configurable:!0}),ke.call(y,pt),St="F1",Oe(s,a),Tt.publish("initialized"),y}k.prototype.lsbFirstWord=function(t){return String.fromCharCode(t>>0&255,t>>8&255,t>>16&255,t>>24&255)},k.prototype.toHexString=function(t){return t.split("").map((function(t){return("0"+(255&t.charCodeAt(0)).toString(16)).slice(-2)})).join("")},k.prototype.hexToBytes=function(t){for(var e=[],r=0;r<t.length;r+=2)e.push(String.fromCharCode(parseInt(t.substr(r,2),16)));return e.join("")},k.prototype.processOwnerPassword=function(t,e){return _(A(e).substr(0,5),t)},k.prototype.encryptor=function(t,e){var r=A(this.encryptionKey+String.fromCharCode(255&t,t>>8&255,t>>16&255,255&e,e>>8&255)).substr(0,10);return function(t){return _(r,t)}},C.prototype.equals=function(t){var r,n="id,objectNumber,equals";if(!t||e(t)!==e(this))return!1;var i=0;for(r in this)if(!(n.indexOf(r)>=0)){if(this.hasOwnProperty(r)&&!t.hasOwnProperty(r))return!1;if(this[r]!==t[r])return!1;i++}for(r in t)t.hasOwnProperty(r)&&n.indexOf(r)<0&&i--;return 0===i},M.API={events:[]},M.version="2.5.1";var E=M.API,q=1,D=function(t){return t.replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)")},R=function(t){return t.replace(/\\\\/g,"\\").replace(/\\\(/g,"(").replace(/\\\)/g,")")},T=function(t){return t.toFixed(2)},U=function(t){return t.toFixed(5)};E.__acroform__={};var z=function(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t},H=function(t){return t*q},W=function(t){var e=new ct,r=Lt.internal.getHeight(t)||0,n=Lt.internal.getWidth(t)||0;return e.BBox=[0,0,Number(T(n)),Number(T(r))],e},V=E.__acroform__.setBit=function(t,e){if(t=t||0,e=e||0,isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBit");return t|=1<<e},G=E.__acroform__.clearBit=function(t,e){if(t=t||0,e=e||0,isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBit");return t&=~(1<<e)},Y=E.__acroform__.getBit=function(t,e){if(isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBit");return 0==(t&1<<e)?0:1},J=E.__acroform__.getBitForPdf=function(t,e){if(isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBitForPdf");return Y(t,e-1)},X=E.__acroform__.setBitForPdf=function(t,e){if(isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBitForPdf");return V(t,e-1)},K=E.__acroform__.clearBitForPdf=function(t,e){if(isNaN(t)||isNaN(e))throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBitForPdf");return G(t,e-1)},Z=E.__acroform__.calculateCoordinates=function(t,e){var r=e.internal.getHorizontalCoordinate,n=e.internal.getVerticalCoordinate,i=t[0],a=t[1],o=t[2],s=t[3],c={};return c.lowerLeft_X=r(i)||0,c.lowerLeft_Y=n(a+s)||0,c.upperRight_X=r(i+o)||0,c.upperRight_Y=n(a)||0,[Number(T(c.lowerLeft_X)),Number(T(c.lowerLeft_Y)),Number(T(c.upperRight_X)),Number(T(c.upperRight_Y))]},$=function(t){if(t.appearanceStreamContent)return t.appearanceStreamContent;if(t.V||t.DV){var e=[],r=t._V||t.DV,n=Q(t,r),i=t.scope.internal.getFont(t.fontName,t.fontStyle).id;e.push("/Tx BMC"),e.push("q"),e.push("BT"),e.push(t.scope.__private__.encodeColorString(t.color)),e.push("/"+i+" "+T(n.fontSize)+" Tf"),e.push("1 0 0 1 0 0 Tm"),e.push(n.text),e.push("ET"),e.push("Q"),e.push("EMC");var a=W(t);return a.scope=t.scope,a.stream=e.join("\n"),a}},Q=function(t,e){var r=0===t.fontSize?t.maxFontSize:t.fontSize,n={text:"",fontSize:""},i=(e=")"==(e="("==e.substr(0,1)?e.substr(1):e).substr(e.length-1)?e.substr(0,e.length-1):e).split(" ");i=t.multiline?i.map((function(t){return t.split("\n")})):i.map((function(t){return[t]}));var a=r,o=Lt.internal.getHeight(t)||0;o=o<0?-o:o;var s=Lt.internal.getWidth(t)||0;s=s<0?-s:s;var c=function(e,r,n){if(e+1<i.length){var a=r+" "+i[e+1][0];return tt(a,t,n).width<=s-4}return!1};a++;t:for(;a>0;){e="",a--;var u,l,h=tt("3",t,a).height,f=t.multiline?o-a:(o-h)/2,d=f+=2,p=0,g=0,m=0;if(a<=0){e="(...) Tj\n",e+="% Width of Text: "+tt(e,t,a=12).width+", FieldWidth:"+s+"\n";break}for(var v="",b=0,y=0;y<i.length;y++)if(i.hasOwnProperty(y)){var w=!1;if(1!==i[y].length&&m!==i[y].length-1){if((h+2)*(b+2)+2>o)continue t;v+=i[y][m],w=!0,g=y,y--}else{v=" "==(v+=i[y][m]+" ").substr(v.length-1)?v.substr(0,v.length-1):v;var N=parseInt(y),L=c(N,v,a),A=y>=i.length-1;if(L&&!A){v+=" ",m=0;continue}if(L||A){if(A)g=N;else if(t.multiline&&(h+2)*(b+2)+2>o)continue t}else{if(!t.multiline)continue t;if((h+2)*(b+2)+2>o)continue t;g=N}}for(var x="",S=p;S<=g;S++){var _=i[S];if(t.multiline){if(S===g){x+=_[m]+" ",m=(m+1)%_.length;continue}if(S===p){x+=_[_.length-1]+" ";continue}}x+=_[0]+" "}switch(x=" "==x.substr(x.length-1)?x.substr(0,x.length-1):x,l=tt(x,t,a).width,t.textAlign){case"right":u=s-l-2;break;case"center":u=(s-l)/2;break;case"left":default:u=2}e+=T(u)+" "+T(d)+" Td\n",e+="("+D(x)+") Tj\n",e+=-T(u)+" 0 Td\n",d=-(a+2),l=0,p=w?g:g+1,b++,v=""}else;break}return n.text=e,n.fontSize=a,n},tt=function(t,e,r){var n=e.scope.internal.getFont(e.fontName,e.fontStyle),i=e.scope.getStringUnitWidth(t,{font:n,fontSize:parseFloat(r),charSpace:0})*parseFloat(r);return{height:e.scope.getStringUnitWidth("3",{font:n,fontSize:parseFloat(r),charSpace:0})*parseFloat(r)*1.5,width:i}},et={fields:[],xForms:[],acroFormDictionaryRoot:null,printedOut:!1,internal:null,isInitialized:!1},rt=function(t,e){var r={type:"reference",object:t};void 0===e.internal.getPageInfo(t.page).pageContext.annotations.find((function(t){return t.type===r.type&&t.object===r.object}))&&e.internal.getPageInfo(t.page).pageContext.annotations.push(r)},nt=function(t,r){for(var n in t)if(t.hasOwnProperty(n)){var i=n,a=t[n];r.internal.newObjectDeferredBegin(a.objId,!0),"object"===e(a)&&"function"==typeof a.putStream&&a.putStream(),delete t[i]}},it=function(t,r){if(r.scope=t,void 0!==t.internal&&(void 0===t.internal.acroformPlugin||!1===t.internal.acroformPlugin.isInitialized)){if(lt.FieldNum=0,t.internal.acroformPlugin=JSON.parse(JSON.stringify(et)),t.internal.acroformPlugin.acroFormDictionaryRoot)throw new Error("Exception while creating AcroformDictionary");q=t.internal.scaleFactor,t.internal.acroformPlugin.acroFormDictionaryRoot=new ut,t.internal.acroformPlugin.acroFormDictionaryRoot.scope=t,t.internal.acroformPlugin.acroFormDictionaryRoot._eventID=t.internal.events.subscribe("postPutResources",(function(){!function(t){t.internal.events.unsubscribe(t.internal.acroformPlugin.acroFormDictionaryRoot._eventID),delete t.internal.acroformPlugin.acroFormDictionaryRoot._eventID,t.internal.acroformPlugin.printedOut=!0}(t)})),t.internal.events.subscribe("buildDocument",(function(){!function(t){t.internal.acroformPlugin.acroFormDictionaryRoot.objId=void 0;var e=t.internal.acroformPlugin.acroFormDictionaryRoot.Fields;for(var r in e)if(e.hasOwnProperty(r)){var n=e[r];n.objId=void 0,n.hasAnnotation&&rt(n,t)}}(t)})),t.internal.events.subscribe("putCatalog",(function(){!function(t){if(void 0===t.internal.acroformPlugin.acroFormDictionaryRoot)throw new Error("putCatalogCallback: Root missing.");t.internal.write("/AcroForm "+t.internal.acroformPlugin.acroFormDictionaryRoot.objId+" 0 R")}(t)})),t.internal.events.subscribe("postPutPages",(function(r){!function(t,r){var n=!t;for(var i in t||(r.internal.newObjectDeferredBegin(r.internal.acroformPlugin.acroFormDictionaryRoot.objId,!0),r.internal.acroformPlugin.acroFormDictionaryRoot.putStream()),t=t||r.internal.acroformPlugin.acroFormDictionaryRoot.Kids)if(t.hasOwnProperty(i)){var a=t[i],o=[],s=a.Rect;if(a.Rect&&(a.Rect=Z(a.Rect,r)),r.internal.newObjectDeferredBegin(a.objId,!0),a.DA=Lt.createDefaultAppearanceStream(a),"object"===e(a)&&"function"==typeof a.getKeyValueListForStream&&(o=a.getKeyValueListForStream()),a.Rect=s,a.hasAppearanceStream&&!a.appearanceStreamContent){var c=$(a);o.push({key:"AP",value:"<</N "+c+">>"}),r.internal.acroformPlugin.xForms.push(c)}if(a.appearanceStreamContent){var u="";for(var l in a.appearanceStreamContent)if(a.appearanceStreamContent.hasOwnProperty(l)){var h=a.appearanceStreamContent[l];if(u+="/"+l+" ",u+="<<",Object.keys(h).length>=1||Array.isArray(h)){for(var i in h)if(h.hasOwnProperty(i)){var f=h[i];"function"==typeof f&&(f=f.call(r,a)),u+="/"+i+" "+f+" ",r.internal.acroformPlugin.xForms.indexOf(f)>=0||r.internal.acroformPlugin.xForms.push(f)}}else"function"==typeof(f=h)&&(f=f.call(r,a)),u+="/"+i+" "+f,r.internal.acroformPlugin.xForms.indexOf(f)>=0||r.internal.acroformPlugin.xForms.push(f);u+=">>"}o.push({key:"AP",value:"<<\n"+u+">>"})}r.internal.putStream({additionalKeyValues:o,objectId:a.objId}),r.internal.out("endobj")}n&&nt(r.internal.acroformPlugin.xForms,r)}(r,t)})),t.internal.acroformPlugin.isInitialized=!0}},at=E.__acroform__.arrayToPdfArray=function(t,r,n){var i=function(t){return t};if(Array.isArray(t)){for(var a="[",o=0;o<t.length;o++)switch(0!==o&&(a+=" "),e(t[o])){case"boolean":case"number":case"object":a+=t[o].toString();break;case"string":"/"!==t[o].substr(0,1)?(void 0!==r&&n&&(i=n.internal.getEncryptor(r)),a+="("+D(i(t[o].toString()))+")"):a+=t[o].toString()}return a+="]"}throw new Error("Invalid argument passed to jsPDF.__acroform__.arrayToPdfArray")};var ot=function(t,e,r){var n=function(t){return t};return void 0!==e&&r&&(n=r.internal.getEncryptor(e)),(t=t||"").toString(),t="("+D(n(t))+")"},st=function(){this._objId=void 0,this._scope=void 0,Object.defineProperty(this,"objId",{get:function(){if(void 0===this._objId){if(void 0===this.scope)return;this._objId=this.scope.internal.newObjectDeferred()}return this._objId},set:function(t){this._objId=t}}),Object.defineProperty(this,"scope",{value:this._scope,writable:!0})};st.prototype.toString=function(){return this.objId+" 0 R"},st.prototype.putStream=function(){var t=this.getKeyValueListForStream();this.scope.internal.putStream({data:this.stream,additionalKeyValues:t,objectId:this.objId}),this.scope.internal.out("endobj")},st.prototype.getKeyValueListForStream=function(){var t=[],e=Object.getOwnPropertyNames(this).filter((function(t){return"content"!=t&&"appearanceStreamContent"!=t&&"scope"!=t&&"objId"!=t&&"_"!=t.substring(0,1)}));for(var r in e)if(!1===Object.getOwnPropertyDescriptor(this,e[r]).configurable){var n=e[r],i=this[n];i&&(Array.isArray(i)?t.push({key:n,value:at(i,this.objId,this.scope)}):i instanceof st?(i.scope=this.scope,t.push({key:n,value:i.objId+" 0 R"})):"function"!=typeof i&&t.push({key:n,value:i}))}return t};var ct=function(){st.call(this),Object.defineProperty(this,"Type",{value:"/XObject",configurable:!1,writable:!0}),Object.defineProperty(this,"Subtype",{value:"/Form",configurable:!1,writable:!0}),Object.defineProperty(this,"FormType",{value:1,configurable:!1,writable:!0});var t,e=[];Object.defineProperty(this,"BBox",{configurable:!1,get:function(){return e},set:function(t){e=t}}),Object.defineProperty(this,"Resources",{value:"2 0 R",configurable:!1,writable:!0}),Object.defineProperty(this,"stream",{enumerable:!1,configurable:!0,set:function(e){t=e.trim()},get:function(){return t||null}})};z(ct,st);var ut=function(){st.call(this);var t,e=[];Object.defineProperty(this,"Kids",{enumerable:!1,configurable:!0,get:function(){return e.length>0?e:void 0}}),Object.defineProperty(this,"Fields",{enumerable:!1,configurable:!1,get:function(){return e}}),Object.defineProperty(this,"DA",{enumerable:!1,configurable:!1,get:function(){if(t){var e=function(t){return t};return this.scope&&(e=this.scope.internal.getEncryptor(this.objId)),"("+D(e(t))+")"}},set:function(e){t=e}})};z(ut,st);var lt=function t(){st.call(this);var e=4;Object.defineProperty(this,"F",{enumerable:!1,configurable:!1,get:function(){return e},set:function(t){if(isNaN(t))throw new Error('Invalid value "'+t+'" for attribute F supplied.');e=t}}),Object.defineProperty(this,"showWhenPrinted",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(e,3))},set:function(t){!0===Boolean(t)?this.F=X(e,3):this.F=K(e,3)}});var r=0;Object.defineProperty(this,"Ff",{enumerable:!1,configurable:!1,get:function(){return r},set:function(t){if(isNaN(t))throw new Error('Invalid value "'+t+'" for attribute Ff supplied.');r=t}});var n=[];Object.defineProperty(this,"Rect",{enumerable:!1,configurable:!1,get:function(){if(0!==n.length)return n},set:function(t){n=void 0!==t?t:[]}}),Object.defineProperty(this,"x",{enumerable:!0,configurable:!0,get:function(){return!n||isNaN(n[0])?0:n[0]},set:function(t){n[0]=t}}),Object.defineProperty(this,"y",{enumerable:!0,configurable:!0,get:function(){return!n||isNaN(n[1])?0:n[1]},set:function(t){n[1]=t}}),Object.defineProperty(this,"width",{enumerable:!0,configurable:!0,get:function(){return!n||isNaN(n[2])?0:n[2]},set:function(t){n[2]=t}}),Object.defineProperty(this,"height",{enumerable:!0,configurable:!0,get:function(){return!n||isNaN(n[3])?0:n[3]},set:function(t){n[3]=t}});var i="";Object.defineProperty(this,"FT",{enumerable:!0,configurable:!1,get:function(){return i},set:function(t){switch(t){case"/Btn":case"/Tx":case"/Ch":case"/Sig":i=t;break;default:throw new Error('Invalid value "'+t+'" for attribute FT supplied.')}}});var a=null;Object.defineProperty(this,"T",{enumerable:!0,configurable:!1,get:function(){if(!a||a.length<1){if(this instanceof bt)return;a="FieldObject"+t.FieldNum++}var e=function(t){return t};return this.scope&&(e=this.scope.internal.getEncryptor(this.objId)),"("+D(e(a))+")"},set:function(t){a=t.toString()}}),Object.defineProperty(this,"fieldName",{configurable:!0,enumerable:!0,get:function(){return a},set:function(t){a=t}});var o="helvetica";Object.defineProperty(this,"fontName",{enumerable:!0,configurable:!0,get:function(){return o},set:function(t){o=t}});var s="normal";Object.defineProperty(this,"fontStyle",{enumerable:!0,configurable:!0,get:function(){return s},set:function(t){s=t}});var c=0;Object.defineProperty(this,"fontSize",{enumerable:!0,configurable:!0,get:function(){return c},set:function(t){c=t}});var u=void 0;Object.defineProperty(this,"maxFontSize",{enumerable:!0,configurable:!0,get:function(){return void 0===u?50/q:u},set:function(t){u=t}});var l="black";Object.defineProperty(this,"color",{enumerable:!0,configurable:!0,get:function(){return l},set:function(t){l=t}});var h="/F1 0 Tf 0 g";Object.defineProperty(this,"DA",{enumerable:!0,configurable:!1,get:function(){if(!(!h||this instanceof bt||this instanceof wt))return ot(h,this.objId,this.scope)},set:function(t){t=t.toString(),h=t}});var f=null;Object.defineProperty(this,"DV",{enumerable:!1,configurable:!1,get:function(){if(f)return this instanceof gt==!1?ot(f,this.objId,this.scope):f},set:function(t){t=t.toString(),f=this instanceof gt==!1?"("===t.substr(0,1)?R(t.substr(1,t.length-2)):R(t):t}}),Object.defineProperty(this,"defaultValue",{enumerable:!0,configurable:!0,get:function(){return this instanceof gt==!0?R(f.substr(1,f.length-1)):f},set:function(t){t=t.toString(),f=this instanceof gt==!0?"/"+t:t}});var d=null;Object.defineProperty(this,"_V",{enumerable:!1,configurable:!1,get:function(){if(d)return d},set:function(t){this.V=t}}),Object.defineProperty(this,"V",{enumerable:!1,configurable:!1,get:function(){if(d)return this instanceof gt==!1?ot(d,this.objId,this.scope):d},set:function(t){t=t.toString(),d=this instanceof gt==!1?"("===t.substr(0,1)?R(t.substr(1,t.length-2)):R(t):t}}),Object.defineProperty(this,"value",{enumerable:!0,configurable:!0,get:function(){return this instanceof gt==!0?R(d.substr(1,d.length-1)):d},set:function(t){t=t.toString(),d=this instanceof gt==!0?"/"+t:t}}),Object.defineProperty(this,"hasAnnotation",{enumerable:!0,configurable:!0,get:function(){return this.Rect}}),Object.defineProperty(this,"Type",{enumerable:!0,configurable:!1,get:function(){return this.hasAnnotation?"/Annot":null}}),Object.defineProperty(this,"Subtype",{enumerable:!0,configurable:!1,get:function(){return this.hasAnnotation?"/Widget":null}});var p,g=!1;Object.defineProperty(this,"hasAppearanceStream",{enumerable:!0,configurable:!0,get:function(){return g},set:function(t){t=Boolean(t),g=t}}),Object.defineProperty(this,"page",{enumerable:!0,configurable:!0,get:function(){if(p)return p},set:function(t){p=t}}),Object.defineProperty(this,"readOnly",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,1))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,1):this.Ff=K(this.Ff,1)}}),Object.defineProperty(this,"required",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,2))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,2):this.Ff=K(this.Ff,2)}}),Object.defineProperty(this,"noExport",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,3))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,3):this.Ff=K(this.Ff,3)}});var m=null;Object.defineProperty(this,"Q",{enumerable:!0,configurable:!1,get:function(){if(null!==m)return m},set:function(t){if(-1===[0,1,2].indexOf(t))throw new Error('Invalid value "'+t+'" for attribute Q supplied.');m=t}}),Object.defineProperty(this,"textAlign",{get:function(){var t;switch(m){case 0:default:t="left";break;case 1:t="center";break;case 2:t="right"}return t},configurable:!0,enumerable:!0,set:function(t){switch(t){case"right":case 2:m=2;break;case"center":case 1:m=1;break;case"left":case 0:default:m=0}}})};z(lt,st);var ht=function(){lt.call(this),this.FT="/Ch",this.V="()",this.fontName="zapfdingbats";var t=0;Object.defineProperty(this,"TI",{enumerable:!0,configurable:!1,get:function(){return t},set:function(e){t=e}}),Object.defineProperty(this,"topIndex",{enumerable:!0,configurable:!0,get:function(){return t},set:function(e){t=e}});var e=[];Object.defineProperty(this,"Opt",{enumerable:!0,configurable:!1,get:function(){return at(e,this.objId,this.scope)},set:function(t){var r,n;n=[],"string"==typeof(r=t)&&(n=function(t,e,r){r||(r=1);for(var n,i=[];n=e.exec(t);)i.push(n[r]);return i}(r,/\((.*?)\)/g)),e=n}}),this.getOptions=function(){return e},this.setOptions=function(t){e=t,this.sort&&e.sort()},this.addOption=function(t){t=(t=t||"").toString(),e.push(t),this.sort&&e.sort()},this.removeOption=function(t,r){for(r=r||!1,t=(t=t||"").toString();-1!==e.indexOf(t)&&(e.splice(e.indexOf(t),1),!1!==r););},Object.defineProperty(this,"combo",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,18))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,18):this.Ff=K(this.Ff,18)}}),Object.defineProperty(this,"edit",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,19))},set:function(t){!0===this.combo&&(!0===Boolean(t)?this.Ff=X(this.Ff,19):this.Ff=K(this.Ff,19))}}),Object.defineProperty(this,"sort",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,20))},set:function(t){!0===Boolean(t)?(this.Ff=X(this.Ff,20),e.sort()):this.Ff=K(this.Ff,20)}}),Object.defineProperty(this,"multiSelect",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,22))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,22):this.Ff=K(this.Ff,22)}}),Object.defineProperty(this,"doNotSpellCheck",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,23))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,23):this.Ff=K(this.Ff,23)}}),Object.defineProperty(this,"commitOnSelChange",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,27))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,27):this.Ff=K(this.Ff,27)}}),this.hasAppearanceStream=!1};z(ht,lt);var ft=function(){ht.call(this),this.fontName="helvetica",this.combo=!1};z(ft,ht);var dt=function(){ft.call(this),this.combo=!0};z(dt,ft);var pt=function(){dt.call(this),this.edit=!0};z(pt,dt);var gt=function(){lt.call(this),this.FT="/Btn",Object.defineProperty(this,"noToggleToOff",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,15))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,15):this.Ff=K(this.Ff,15)}}),Object.defineProperty(this,"radio",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,16))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,16):this.Ff=K(this.Ff,16)}}),Object.defineProperty(this,"pushButton",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,17))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,17):this.Ff=K(this.Ff,17)}}),Object.defineProperty(this,"radioIsUnison",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,26))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,26):this.Ff=K(this.Ff,26)}});var t,r={};Object.defineProperty(this,"MK",{enumerable:!1,configurable:!1,get:function(){var t=function(t){return t};if(this.scope&&(t=this.scope.internal.getEncryptor(this.objId)),0!==Object.keys(r).length){var e,n=[];for(e in n.push("<<"),r)n.push("/"+e+" ("+D(t(r[e]))+")");return n.push(">>"),n.join("\n")}},set:function(t){"object"===e(t)&&(r=t)}}),Object.defineProperty(this,"caption",{enumerable:!0,configurable:!0,get:function(){return r.CA||""},set:function(t){"string"==typeof t&&(r.CA=t)}}),Object.defineProperty(this,"AS",{enumerable:!1,configurable:!1,get:function(){return t},set:function(e){t=e}}),Object.defineProperty(this,"appearanceState",{enumerable:!0,configurable:!0,get:function(){return t.substr(1,t.length-1)},set:function(e){t="/"+e}})};z(gt,lt);var mt=function(){gt.call(this),this.pushButton=!0};z(mt,gt);var vt=function(){gt.call(this),this.radio=!0,this.pushButton=!1;var t=[];Object.defineProperty(this,"Kids",{enumerable:!0,configurable:!1,get:function(){return t},set:function(e){t=void 0!==e?e:[]}})};z(vt,gt);var bt=function(){var t,r;lt.call(this),Object.defineProperty(this,"Parent",{enumerable:!1,configurable:!1,get:function(){return t},set:function(e){t=e}}),Object.defineProperty(this,"optionName",{enumerable:!1,configurable:!0,get:function(){return r},set:function(t){r=t}});var n,i={};Object.defineProperty(this,"MK",{enumerable:!1,configurable:!1,get:function(){var t=function(t){return t};this.scope&&(t=this.scope.internal.getEncryptor(this.objId));var e,r=[];for(e in r.push("<<"),i)r.push("/"+e+" ("+D(t(i[e]))+")");return r.push(">>"),r.join("\n")},set:function(t){"object"===e(t)&&(i=t)}}),Object.defineProperty(this,"caption",{enumerable:!0,configurable:!0,get:function(){return i.CA||""},set:function(t){"string"==typeof t&&(i.CA=t)}}),Object.defineProperty(this,"AS",{enumerable:!1,configurable:!1,get:function(){return n},set:function(t){n=t}}),Object.defineProperty(this,"appearanceState",{enumerable:!0,configurable:!0,get:function(){return n.substr(1,n.length-1)},set:function(t){n="/"+t}}),this.caption="l",this.appearanceState="Off",this._AppearanceType=Lt.RadioButton.Circle,this.appearanceStreamContent=this._AppearanceType.createAppearanceStream(this.optionName)};z(bt,lt),vt.prototype.setAppearance=function(t){if(!("createAppearanceStream"in t)||!("getCA"in t))throw new Error("Couldn't assign Appearance to RadioButton. Appearance was Invalid!");for(var e in this.Kids)if(this.Kids.hasOwnProperty(e)){var r=this.Kids[e];r.appearanceStreamContent=t.createAppearanceStream(r.optionName),r.caption=t.getCA()}},vt.prototype.createOption=function(t){var e=new bt;return e.Parent=this,e.optionName=t,this.Kids.push(e),At.call(this.scope,e),e};var yt=function(){gt.call(this),this.fontName="zapfdingbats",this.caption="3",this.appearanceState="On",this.value="On",this.textAlign="center",this.appearanceStreamContent=Lt.CheckBox.createAppearanceStream()};z(yt,gt);var wt=function(){lt.call(this),this.FT="/Tx",Object.defineProperty(this,"multiline",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,13))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,13):this.Ff=K(this.Ff,13)}}),Object.defineProperty(this,"fileSelect",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,21))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,21):this.Ff=K(this.Ff,21)}}),Object.defineProperty(this,"doNotSpellCheck",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,23))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,23):this.Ff=K(this.Ff,23)}}),Object.defineProperty(this,"doNotScroll",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,24))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,24):this.Ff=K(this.Ff,24)}}),Object.defineProperty(this,"comb",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,25))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,25):this.Ff=K(this.Ff,25)}}),Object.defineProperty(this,"richText",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,26))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,26):this.Ff=K(this.Ff,26)}});var t=null;Object.defineProperty(this,"MaxLen",{enumerable:!0,configurable:!1,get:function(){return t},set:function(e){t=e}}),Object.defineProperty(this,"maxLength",{enumerable:!0,configurable:!0,get:function(){return t},set:function(e){Number.isInteger(e)&&(t=e)}}),Object.defineProperty(this,"hasAppearanceStream",{enumerable:!0,configurable:!0,get:function(){return this.V||this.DV}})};z(wt,lt);var Nt=function(){wt.call(this),Object.defineProperty(this,"password",{enumerable:!0,configurable:!0,get:function(){return Boolean(J(this.Ff,14))},set:function(t){!0===Boolean(t)?this.Ff=X(this.Ff,14):this.Ff=K(this.Ff,14)}}),this.password=!0};z(Nt,wt);var Lt={CheckBox:{createAppearanceStream:function(){return{N:{On:Lt.CheckBox.YesNormal},D:{On:Lt.CheckBox.YesPushDown,Off:Lt.CheckBox.OffPushDown}}},YesPushDown:function(t){var e=W(t);e.scope=t.scope;var r=[],n=t.scope.internal.getFont(t.fontName,t.fontStyle).id,i=t.scope.__private__.encodeColorString(t.color),a=Q(t,t.caption);return r.push("0.749023 g"),r.push("0 0 "+T(Lt.internal.getWidth(t))+" "+T(Lt.internal.getHeight(t))+" re"),r.push("f"),r.push("BMC"),r.push("q"),r.push("0 0 1 rg"),r.push("/"+n+" "+T(a.fontSize)+" Tf "+i),r.push("BT"),r.push(a.text),r.push("ET"),r.push("Q"),r.push("EMC"),e.stream=r.join("\n"),e},YesNormal:function(t){var e=W(t);e.scope=t.scope;var r=t.scope.internal.getFont(t.fontName,t.fontStyle).id,n=t.scope.__private__.encodeColorString(t.color),i=[],a=Lt.internal.getHeight(t),o=Lt.internal.getWidth(t),s=Q(t,t.caption);return i.push("1 g"),i.push("0 0 "+T(o)+" "+T(a)+" re"),i.push("f"),i.push("q"),i.push("0 0 1 rg"),i.push("0 0 "+T(o-1)+" "+T(a-1)+" re"),i.push("W"),i.push("n"),i.push("0 g"),i.push("BT"),i.push("/"+r+" "+T(s.fontSize)+" Tf "+n),i.push(s.text),i.push("ET"),i.push("Q"),e.stream=i.join("\n"),e},OffPushDown:function(t){var e=W(t);e.scope=t.scope;var r=[];return r.push("0.749023 g"),r.push("0 0 "+T(Lt.internal.getWidth(t))+" "+T(Lt.internal.getHeight(t))+" re"),r.push("f"),e.stream=r.join("\n"),e}},RadioButton:{Circle:{createAppearanceStream:function(t){var e={D:{Off:Lt.RadioButton.Circle.OffPushDown},N:{}};return e.N[t]=Lt.RadioButton.Circle.YesNormal,e.D[t]=Lt.RadioButton.Circle.YesPushDown,e},getCA:function(){return"l"},YesNormal:function(t){var e=W(t);e.scope=t.scope;var r=[],n=Lt.internal.getWidth(t)<=Lt.internal.getHeight(t)?Lt.internal.getWidth(t)/4:Lt.internal.getHeight(t)/4;n=Number((.9*n).toFixed(5));var i=Lt.internal.Bezier_C,a=Number((n*i).toFixed(5));return r.push("q"),r.push("1 0 0 1 "+U(Lt.internal.getWidth(t)/2)+" "+U(Lt.internal.getHeight(t)/2)+" cm"),r.push(n+" 0 m"),r.push(n+" "+a+" "+a+" "+n+" 0 "+n+" c"),r.push("-"+a+" "+n+" -"+n+" "+a+" -"+n+" 0 c"),r.push("-"+n+" -"+a+" -"+a+" -"+n+" 0 -"+n+" c"),r.push(a+" -"+n+" "+n+" -"+a+" "+n+" 0 c"),r.push("f"),r.push("Q"),e.stream=r.join("\n"),e},YesPushDown:function(t){var e=W(t);e.scope=t.scope;var r=[],n=Lt.internal.getWidth(t)<=Lt.internal.getHeight(t)?Lt.internal.getWidth(t)/4:Lt.internal.getHeight(t)/4;n=Number((.9*n).toFixed(5));var i=Number((2*n).toFixed(5)),a=Number((i*Lt.internal.Bezier_C).toFixed(5)),o=Number((n*Lt.internal.Bezier_C).toFixed(5));return r.push("0.749023 g"),r.push("q"),r.push("1 0 0 1 "+U(Lt.internal.getWidth(t)/2)+" "+U(Lt.internal.getHeight(t)/2)+" cm"),r.push(i+" 0 m"),r.push(i+" "+a+" "+a+" "+i+" 0 "+i+" c"),r.push("-"+a+" "+i+" -"+i+" "+a+" -"+i+" 0 c"),r.push("-"+i+" -"+a+" -"+a+" -"+i+" 0 -"+i+" c"),r.push(a+" -"+i+" "+i+" -"+a+" "+i+" 0 c"),r.push("f"),r.push("Q"),r.push("0 g"),r.push("q"),r.push("1 0 0 1 "+U(Lt.internal.getWidth(t)/2)+" "+U(Lt.internal.getHeight(t)/2)+" cm"),r.push(n+" 0 m"),r.push(n+" "+o+" "+o+" "+n+" 0 "+n+" c"),r.push("-"+o+" "+n+" -"+n+" "+o+" -"+n+" 0 c"),r.push("-"+n+" -"+o+" -"+o+" -"+n+" 0 -"+n+" c"),r.push(o+" -"+n+" "+n+" -"+o+" "+n+" 0 c"),r.push("f"),r.push("Q"),e.stream=r.join("\n"),e},OffPushDown:function(t){var e=W(t);e.scope=t.scope;var r=[],n=Lt.internal.getWidth(t)<=Lt.internal.getHeight(t)?Lt.internal.getWidth(t)/4:Lt.internal.getHeight(t)/4;n=Number((.9*n).toFixed(5));var i=Number((2*n).toFixed(5)),a=Number((i*Lt.internal.Bezier_C).toFixed(5));return r.push("0.749023 g"),r.push("q"),r.push("1 0 0 1 "+U(Lt.internal.getWidth(t)/2)+" "+U(Lt.internal.getHeight(t)/2)+" cm"),r.push(i+" 0 m"),r.push(i+" "+a+" "+a+" "+i+" 0 "+i+" c"),r.push("-"+a+" "+i+" -"+i+" "+a+" -"+i+" 0 c"),r.push("-"+i+" -"+a+" -"+a+" -"+i+" 0 -"+i+" c"),r.push(a+" -"+i+" "+i+" -"+a+" "+i+" 0 c"),r.push("f"),r.push("Q"),e.stream=r.join("\n"),e}},Cross:{createAppearanceStream:function(t){var e={D:{Off:Lt.RadioButton.Cross.OffPushDown},N:{}};return e.N[t]=Lt.RadioButton.Cross.YesNormal,e.D[t]=Lt.RadioButton.Cross.YesPushDown,e},getCA:function(){return"8"},YesNormal:function(t){var e=W(t);e.scope=t.scope;var r=[],n=Lt.internal.calculateCross(t);return r.push("q"),r.push("1 1 "+T(Lt.internal.getWidth(t)-2)+" "+T(Lt.internal.getHeight(t)-2)+" re"),r.push("W"),r.push("n"),r.push(T(n.x1.x)+" "+T(n.x1.y)+" m"),r.push(T(n.x2.x)+" "+T(n.x2.y)+" l"),r.push(T(n.x4.x)+" "+T(n.x4.y)+" m"),r.push(T(n.x3.x)+" "+T(n.x3.y)+" l"),r.push("s"),r.push("Q"),e.stream=r.join("\n"),e},YesPushDown:function(t){var e=W(t);e.scope=t.scope;var r=Lt.internal.calculateCross(t),n=[];return n.push("0.749023 g"),n.push("0 0 "+T(Lt.internal.getWidth(t))+" "+T(Lt.internal.getHeight(t))+" re"),n.push("f"),n.push("q"),n.push("1 1 "+T(Lt.internal.getWidth(t)-2)+" "+T(Lt.internal.getHeight(t)-2)+" re"),n.push("W"),n.push("n"),n.push(T(r.x1.x)+" "+T(r.x1.y)+" m"),n.push(T(r.x2.x)+" "+T(r.x2.y)+" l"),n.push(T(r.x4.x)+" "+T(r.x4.y)+" m"),n.push(T(r.x3.x)+" "+T(r.x3.y)+" l"),n.push("s"),n.push("Q"),e.stream=n.join("\n"),e},OffPushDown:function(t){var e=W(t);e.scope=t.scope;var r=[];return r.push("0.749023 g"),r.push("0 0 "+T(Lt.internal.getWidth(t))+" "+T(Lt.internal.getHeight(t))+" re"),r.push("f"),e.stream=r.join("\n"),e}}},createDefaultAppearanceStream:function(t){var e=t.scope.internal.getFont(t.fontName,t.fontStyle).id,r=t.scope.__private__.encodeColorString(t.color);return"/"+e+" "+t.fontSize+" Tf "+r}};Lt.internal={Bezier_C:.551915024494,calculateCross:function(t){var e=Lt.internal.getWidth(t),r=Lt.internal.getHeight(t),n=Math.min(e,r);return{x1:{x:(e-n)/2,y:(r-n)/2+n},x2:{x:(e-n)/2+n,y:(r-n)/2},x3:{x:(e-n)/2,y:(r-n)/2},x4:{x:(e-n)/2+n,y:(r-n)/2+n}}}},Lt.internal.getWidth=function(t){var r=0;return"object"===e(t)&&(r=H(t.Rect[2])),r},Lt.internal.getHeight=function(t){var r=0;return"object"===e(t)&&(r=H(t.Rect[3])),r};var At=E.addField=function(t){if(it(this,t),!(t instanceof lt))throw new Error("Invalid argument passed to jsPDF.addField.");var e;return(e=t).scope.internal.acroformPlugin.printedOut&&(e.scope.internal.acroformPlugin.printedOut=!1,e.scope.internal.acroformPlugin.acroFormDictionaryRoot=null),e.scope.internal.acroformPlugin.acroFormDictionaryRoot.Fields.push(e),t.page=t.scope.internal.getCurrentPageInfo().pageNumber,this};E.AcroFormChoiceField=ht,E.AcroFormListBox=ft,E.AcroFormComboBox=dt,E.AcroFormEditBox=pt,E.AcroFormButton=gt,E.AcroFormPushButton=mt,E.AcroFormRadioButton=vt,E.AcroFormCheckBox=yt,E.AcroFormTextField=wt,E.AcroFormPasswordField=Nt,E.AcroFormAppearance=Lt,E.AcroForm={ChoiceField:ht,ListBox:ft,ComboBox:dt,EditBox:pt,Button:gt,PushButton:mt,RadioButton:vt,CheckBox:yt,TextField:wt,PasswordField:Nt,Appearance:Lt},M.AcroForm={ChoiceField:ht,ListBox:ft,ComboBox:dt,EditBox:pt,Button:gt,PushButton:mt,RadioButton:vt,CheckBox:yt,TextField:wt,PasswordField:Nt,Appearance:Lt};var xt=M.AcroForm;function St(t){return t.reduce((function(t,e,r){return t[e]=r,t}),{})}!function(t){t.__addimage__={};var r="UNKNOWN",n={PNG:[[137,80,78,71]],TIFF:[[77,77,0,42],[73,73,42,0]],JPEG:[[255,216,255,224,void 0,void 0,74,70,73,70,0],[255,216,255,225,void 0,void 0,69,120,105,102,0,0],[255,216,255,219],[255,216,255,238]],JPEG2000:[[0,0,0,12,106,80,32,32]],GIF87a:[[71,73,70,56,55,97]],GIF89a:[[71,73,70,56,57,97]],WEBP:[[82,73,70,70,void 0,void 0,void 0,void 0,87,69,66,80]],BMP:[[66,77],[66,65],[67,73],[67,80],[73,67],[80,84]]},i=t.__addimage__.getImageFileTypeByImageData=function(t,e){var i,a,o,s,c,u=r;if("RGBA"===(e=e||r)||void 0!==t.data&&t.data instanceof Uint8ClampedArray&&"height"in t&&"width"in t)return"RGBA";if(x(t))for(c in n)for(o=n[c],i=0;i<o.length;i+=1){for(s=!0,a=0;a<o[i].length;a+=1)if(void 0!==o[i][a]&&o[i][a]!==t[a]){s=!1;break}if(!0===s){u=c;break}}else for(c in n)for(o=n[c],i=0;i<o.length;i+=1){for(s=!0,a=0;a<o[i].length;a+=1)if(void 0!==o[i][a]&&o[i][a]!==t.charCodeAt(a)){s=!1;break}if(!0===s){u=c;break}}return u===r&&e!==r&&(u=e),u},a=function t(e){for(var r=this.internal.write,n=this.internal.putStream,i=(0,this.internal.getFilters)();-1!==i.indexOf("FlateEncode");)i.splice(i.indexOf("FlateEncode"),1);e.objectId=this.internal.newObject();var a=[];if(a.push({key:"Type",value:"/XObject"}),a.push({key:"Subtype",value:"/Image"}),a.push({key:"Width",value:e.width}),a.push({key:"Height",value:e.height}),e.colorSpace===b.INDEXED?a.push({key:"ColorSpace",value:"[/Indexed /DeviceRGB "+(e.palette.length/3-1)+" "+("sMask"in e&&void 0!==e.sMask?e.objectId+2:e.objectId+1)+" 0 R]"}):(a.push({key:"ColorSpace",value:"/"+e.colorSpace}),e.colorSpace===b.DEVICE_CMYK&&a.push({key:"Decode",value:"[1 0 1 0 1 0 1 0]"})),a.push({key:"BitsPerComponent",value:e.bitsPerComponent}),"decodeParameters"in e&&void 0!==e.decodeParameters&&a.push({key:"DecodeParms",value:"<<"+e.decodeParameters+">>"}),"transparency"in e&&Array.isArray(e.transparency)){for(var o="",s=0,c=e.transparency.length;s<c;s++)o+=e.transparency[s]+" "+e.transparency[s]+" ";a.push({key:"Mask",value:"["+o+"]"})}void 0!==e.sMask&&a.push({key:"SMask",value:e.objectId+1+" 0 R"});var u=void 0!==e.filter?["/"+e.filter]:void 0;if(n({data:e.data,additionalKeyValues:a,alreadyAppliedFilters:u,objectId:e.objectId}),r("endobj"),"sMask"in e&&void 0!==e.sMask){var l="/Predictor "+e.predictor+" /Colors 1 /BitsPerComponent "+e.bitsPerComponent+" /Columns "+e.width,h={width:e.width,height:e.height,colorSpace:"DeviceGray",bitsPerComponent:e.bitsPerComponent,decodeParameters:l,data:e.sMask};"filter"in e&&(h.filter=e.filter),t.call(this,h)}if(e.colorSpace===b.INDEXED){var f=this.internal.newObject();n({data:_(new Uint8Array(e.palette)),objectId:f}),r("endobj")}},o=function(){var t=this.internal.collections.addImage_images;for(var e in t)a.call(this,t[e])},s=function(){var t,e=this.internal.collections.addImage_images,r=this.internal.write;for(var n in e)r("/I"+(t=e[n]).index,t.objectId,"0","R")},u=function(){this.internal.collections.addImage_images||(this.internal.collections.addImage_images={},this.internal.events.subscribe("putResources",o),this.internal.events.subscribe("putXobjectDict",s))},l=function(){var t=this.internal.collections.addImage_images;return u.call(this),t},h=function(){return Object.keys(this.internal.collections.addImage_images).length},f=function(e){return"function"==typeof t["process"+e.toUpperCase()]},d=function(t){return"object"===e(t)&&1===t.nodeType},p=function(e,r){if("IMG"===e.nodeName&&e.hasAttribute("src")){var n=""+e.getAttribute("src");if(0===n.indexOf("data:image/"))return c(unescape(n).split("base64,").pop());var i=t.loadFile(n,!0);if(void 0!==i)return i}if("CANVAS"===e.nodeName){if(0===e.width||0===e.height)throw new Error("Given canvas must have data. Canvas width: "+e.width+", height: "+e.height);var a;switch(r){case"PNG":a="image/png";break;case"WEBP":a="image/webp";break;case"JPEG":case"JPG":default:a="image/jpeg"}return c(e.toDataURL(a,1).split("base64,").pop())}},g=function(t){var e=this.internal.collections.addImage_images;if(e)for(var r in e)if(t===e[r].alias)return e[r]},m=function(t,e,r){return t||e||(t=-96,e=-96),t<0&&(t=-1*r.width*72/t/this.internal.scaleFactor),e<0&&(e=-1*r.height*72/e/this.internal.scaleFactor),0===t&&(t=e*r.width/r.height),0===e&&(e=t*r.height/r.width),[t,e]},v=function(t,e,r,n,i,a){var o=m.call(this,r,n,i),s=this.internal.getCoordinateString,c=this.internal.getVerticalCoordinateString,u=l.call(this);if(r=o[0],n=o[1],u[i.index]=i,a){a*=Math.PI/180;var h=Math.cos(a),f=Math.sin(a),d=function(t){return t.toFixed(4)},p=[d(h),d(f),d(-1*f),d(h),0,0,"cm"]}this.internal.write("q"),a?(this.internal.write([1,"0","0",1,s(t),c(e+n),"cm"].join(" ")),this.internal.write(p.join(" ")),this.internal.write([s(r),"0","0",s(n),"0","0","cm"].join(" "))):this.internal.write([s(r),"0","0",s(n),s(t),c(e+n),"cm"].join(" ")),this.isAdvancedAPI()&&this.internal.write([1,0,0,-1,0,0,"cm"].join(" ")),this.internal.write("/I"+i.index+" Do"),this.internal.write("Q")},b=t.color_spaces={DEVICE_RGB:"DeviceRGB",DEVICE_GRAY:"DeviceGray",DEVICE_CMYK:"DeviceCMYK",CAL_GREY:"CalGray",CAL_RGB:"CalRGB",LAB:"Lab",ICC_BASED:"ICCBased",INDEXED:"Indexed",PATTERN:"Pattern",SEPARATION:"Separation",DEVICE_N:"DeviceN"};t.decode={DCT_DECODE:"DCTDecode",FLATE_DECODE:"FlateDecode",LZW_DECODE:"LZWDecode",JPX_DECODE:"JPXDecode",JBIG2_DECODE:"JBIG2Decode",ASCII85_DECODE:"ASCII85Decode",ASCII_HEX_DECODE:"ASCIIHexDecode",RUN_LENGTH_DECODE:"RunLengthDecode",CCITT_FAX_DECODE:"CCITTFaxDecode"};var y=t.image_compression={NONE:"NONE",FAST:"FAST",MEDIUM:"MEDIUM",SLOW:"SLOW"},w=t.__addimage__.sHashCode=function(t){var e,r,n=0;if("string"==typeof t)for(r=t.length,e=0;e<r;e++)n=(n<<5)-n+t.charCodeAt(e),n|=0;else if(x(t))for(r=t.byteLength/2,e=0;e<r;e++)n=(n<<5)-n+t[e],n|=0;return n},N=t.__addimage__.validateStringAsBase64=function(t){(t=t||"").toString().trim();var e=!0;return 0===t.length&&(e=!1),t.length%4!=0&&(e=!1),!1===/^[A-Za-z0-9+/]+$/.test(t.substr(0,t.length-2))&&(e=!1),!1===/^[A-Za-z0-9/][A-Za-z0-9+/]|[A-Za-z0-9+/]=|==$/.test(t.substr(-2))&&(e=!1),e},L=t.__addimage__.extractImageFromDataUrl=function(t){var e=(t=t||"").split("base64,"),r=null;if(2===e.length){var n=/^data:(\w*\/\w*);*(charset=(?!charset=)[\w=-]*)*;*$/.exec(e[0]);Array.isArray(n)&&(r={mimeType:n[1],charset:n[2],data:e[1]})}return r},A=t.__addimage__.supportsArrayBuffer=function(){return"undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array};t.__addimage__.isArrayBuffer=function(t){return A()&&t instanceof ArrayBuffer};var x=t.__addimage__.isArrayBufferView=function(t){return A()&&"undefined"!=typeof Uint32Array&&(t instanceof Int8Array||t instanceof Uint8Array||"undefined"!=typeof Uint8ClampedArray&&t instanceof Uint8ClampedArray||t instanceof Int16Array||t instanceof Uint16Array||t instanceof Int32Array||t instanceof Uint32Array||t instanceof Float32Array||t instanceof Float64Array)},S=t.__addimage__.binaryStringToUint8Array=function(t){for(var e=t.length,r=new Uint8Array(e),n=0;n<e;n++)r[n]=t.charCodeAt(n);return r},_=t.__addimage__.arrayBufferToBinaryString=function(t){for(var e="",r=x(t)?t:new Uint8Array(t),n=0;n<r.length;n+=8192)e+=String.fromCharCode.apply(null,r.subarray(n,n+8192));return e};t.addImage=function(){var t,n,i,a,o,s,c,l,h;if("number"==typeof arguments[1]?(n=r,i=arguments[1],a=arguments[2],o=arguments[3],s=arguments[4],c=arguments[5],l=arguments[6],h=arguments[7]):(n=arguments[1],i=arguments[2],a=arguments[3],o=arguments[4],s=arguments[5],c=arguments[6],l=arguments[7],h=arguments[8]),"object"===e(t=arguments[0])&&!d(t)&&"imageData"in t){var f=t;t=f.imageData,n=f.format||n||r,i=f.x||i||0,a=f.y||a||0,o=f.w||f.width||o,s=f.h||f.height||s,c=f.alias||c,l=f.compression||l,h=f.rotation||f.angle||h}var p=this.internal.getFilters();if(void 0===l&&-1!==p.indexOf("FlateEncode")&&(l="SLOW"),isNaN(i)||isNaN(a))throw new Error("Invalid coordinates passed to jsPDF.addImage");u.call(this);var g=P.call(this,t,n,c,l);return v.call(this,i,a,o,s,g,h),this};var P=function(e,n,a,o){var s,c,u;if("string"==typeof e&&i(e)===r){e=unescape(e);var l=k(e,!1);(""!==l||void 0!==(l=t.loadFile(e,!0)))&&(e=l)}if(d(e)&&(e=p(e,n)),n=i(e,n),!f(n))throw new Error("addImage does not support files of type '"+n+"', please ensure that a plugin for '"+n+"' support is added.");if((null==(u=a)||0===u.length)&&(a=function(t){return"string"==typeof t||x(t)?w(t):x(t.data)?w(t.data):null}(e)),(s=g.call(this,a))||(A()&&(e instanceof Uint8Array||"RGBA"===n||(c=e,e=S(e))),s=this["process"+n.toUpperCase()](e,h.call(this),a,function(e){return e&&"string"==typeof e&&(e=e.toUpperCase()),e in t.image_compression?e:y.NONE}(o),c)),!s)throw new Error("An unknown error occurred whilst processing the image.");return s},k=t.__addimage__.convertBase64ToBinaryString=function(t,e){var r;e="boolean"!=typeof e||e;var n,i="";if("string"==typeof t){n=null!==(r=L(t))?r.data:t;try{i=c(n)}catch(t){if(e)throw N(n)?new Error("atob-Error in jsPDF.convertBase64ToBinaryString "+t.message):new Error("Supplied Data is not a valid base64-String jsPDF.convertBase64ToBinaryString ")}}return i};t.getImageProperties=function(e){var n,a,o="";if(d(e)&&(e=p(e)),"string"==typeof e&&i(e)===r&&(""===(o=k(e,!1))&&(o=t.loadFile(e)||""),e=o),a=i(e),!f(a))throw new Error("addImage does not support files of type '"+a+"', please ensure that a plugin for '"+a+"' support is added.");if(!A()||e instanceof Uint8Array||(e=S(e)),!(n=this["process"+a.toUpperCase()](e)))throw new Error("An unknown error occurred whilst processing the image");return n.fileType=a,n}}(M.API),
/**
   * @license
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
function(t){var e=function(t){if(void 0!==t&&""!=t)return!0};M.API.events.push(["addPage",function(t){this.internal.getPageInfo(t.pageNumber).pageContext.annotations=[]}]),t.events.push(["putPage",function(t){for(var r,n,i,a=this.internal.getCoordinateString,o=this.internal.getVerticalCoordinateString,s=this.internal.getPageInfoByObjId(t.objId),c=t.pageContext.annotations,u=!1,l=0;l<c.length&&!u;l++)switch((r=c[l]).type){case"link":(e(r.options.url)||e(r.options.pageNumber))&&(u=!0);break;case"reference":case"text":case"freetext":u=!0}if(0!=u){this.internal.write("/Annots [");for(var h=0;h<c.length;h++){r=c[h];var f=this.internal.pdfEscape,d=this.internal.getEncryptor(t.objId);switch(r.type){case"reference":this.internal.write(" "+r.object.objId+" 0 R ");break;case"text":var p=this.internal.newAdditionalObject(),g=this.internal.newAdditionalObject(),m=this.internal.getEncryptor(p.objId),v=r.title||"Note";i="<</Type /Annot /Subtype /Text "+(n="/Rect ["+a(r.bounds.x)+" "+o(r.bounds.y+r.bounds.h)+" "+a(r.bounds.x+r.bounds.w)+" "+o(r.bounds.y)+"] ")+"/Contents ("+f(m(r.contents))+")",i+=" /Popup "+g.objId+" 0 R",i+=" /P "+s.objId+" 0 R",i+=" /T ("+f(m(v))+") >>",p.content=i;var b=p.objId+" 0 R";i="<</Type /Annot /Subtype /Popup "+(n="/Rect ["+a(r.bounds.x+30)+" "+o(r.bounds.y+r.bounds.h)+" "+a(r.bounds.x+r.bounds.w+30)+" "+o(r.bounds.y)+"] ")+" /Parent "+b,r.open&&(i+=" /Open true"),i+=" >>",g.content=i,this.internal.write(p.objId,"0 R",g.objId,"0 R");break;case"freetext":n="/Rect ["+a(r.bounds.x)+" "+o(r.bounds.y)+" "+a(r.bounds.x+r.bounds.w)+" "+o(r.bounds.y+r.bounds.h)+"] ";var y=r.color||"#000000";i="<</Type /Annot /Subtype /FreeText "+n+"/Contents ("+f(d(r.contents))+")",i+=" /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#"+y+")",i+=" /Border [0 0 0]",i+=" >>",this.internal.write(i);break;case"link":if(r.options.name){var w=this.annotations._nameMap[r.options.name];r.options.pageNumber=w.page,r.options.top=w.y}else r.options.top||(r.options.top=0);if(n="/Rect ["+r.finalBounds.x+" "+r.finalBounds.y+" "+r.finalBounds.w+" "+r.finalBounds.h+"] ",i="",r.options.url)i="<</Type /Annot /Subtype /Link "+n+"/Border [0 0 0] /A <</S /URI /URI ("+f(d(r.options.url))+") >>";else if(r.options.pageNumber){switch(i="<</Type /Annot /Subtype /Link "+n+"/Border [0 0 0] /Dest ["+this.internal.getPageInfo(r.options.pageNumber).objId+" 0 R",r.options.magFactor=r.options.magFactor||"XYZ",r.options.magFactor){case"Fit":i+=" /Fit]";break;case"FitH":i+=" /FitH "+r.options.top+"]";break;case"FitV":r.options.left=r.options.left||0,i+=" /FitV "+r.options.left+"]";break;case"XYZ":default:var N=o(r.options.top);r.options.left=r.options.left||0,void 0===r.options.zoom&&(r.options.zoom=0),i+=" /XYZ "+r.options.left+" "+N+" "+r.options.zoom+"]"}}""!=i&&(i+=" >>",this.internal.write(i))}}this.internal.write("]")}}]),t.createAnnotation=function(t){var e=this.internal.getCurrentPageInfo();switch(t.type){case"link":this.link(t.bounds.x,t.bounds.y,t.bounds.w,t.bounds.h,t);break;case"text":case"freetext":e.pageContext.annotations.push(t)}},t.link=function(t,e,r,n,i){var a=this.internal.getCurrentPageInfo(),o=this.internal.getCoordinateString,s=this.internal.getVerticalCoordinateString;a.pageContext.annotations.push({finalBounds:{x:o(t),y:s(e),w:o(t+r),h:s(e+n)},options:i,type:"link"})},t.textWithLink=function(t,e,r,n){var i,a,o=this.getTextWidth(t),s=this.internal.getLineHeight()/this.internal.scaleFactor;if(void 0!==n.maxWidth){a=n.maxWidth;var c=this.splitTextToSize(t,a).length;i=Math.ceil(s*c)}else a=o,i=s;return this.text(t,e,r,n),r+=.2*s,"center"===n.align&&(e-=o/2),"right"===n.align&&(e-=o),this.link(e,r-s,a,i,n),o},t.getTextWidth=function(t){var e=this.internal.getFontSize();return this.getStringUnitWidth(t)*e/this.internal.scaleFactor}}(M.API),
/**
   * @license
   * Copyright (c) 2017 Aras Abbasi
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
function(t){var e={1569:[65152],1570:[65153,65154],1571:[65155,65156],1572:[65157,65158],1573:[65159,65160],1574:[65161,65162,65163,65164],1575:[65165,65166],1576:[65167,65168,65169,65170],1577:[65171,65172],1578:[65173,65174,65175,65176],1579:[65177,65178,65179,65180],1580:[65181,65182,65183,65184],1581:[65185,65186,65187,65188],1582:[65189,65190,65191,65192],1583:[65193,65194],1584:[65195,65196],1585:[65197,65198],1586:[65199,65200],1587:[65201,65202,65203,65204],1588:[65205,65206,65207,65208],1589:[65209,65210,65211,65212],1590:[65213,65214,65215,65216],1591:[65217,65218,65219,65220],1592:[65221,65222,65223,65224],1593:[65225,65226,65227,65228],1594:[65229,65230,65231,65232],1601:[65233,65234,65235,65236],1602:[65237,65238,65239,65240],1603:[65241,65242,65243,65244],1604:[65245,65246,65247,65248],1605:[65249,65250,65251,65252],1606:[65253,65254,65255,65256],1607:[65257,65258,65259,65260],1608:[65261,65262],1609:[65263,65264,64488,64489],1610:[65265,65266,65267,65268],1649:[64336,64337],1655:[64477],1657:[64358,64359,64360,64361],1658:[64350,64351,64352,64353],1659:[64338,64339,64340,64341],1662:[64342,64343,64344,64345],1663:[64354,64355,64356,64357],1664:[64346,64347,64348,64349],1667:[64374,64375,64376,64377],1668:[64370,64371,64372,64373],1670:[64378,64379,64380,64381],1671:[64382,64383,64384,64385],1672:[64392,64393],1676:[64388,64389],1677:[64386,64387],1678:[64390,64391],1681:[64396,64397],1688:[64394,64395],1700:[64362,64363,64364,64365],1702:[64366,64367,64368,64369],1705:[64398,64399,64400,64401],1709:[64467,64468,64469,64470],1711:[64402,64403,64404,64405],1713:[64410,64411,64412,64413],1715:[64406,64407,64408,64409],1722:[64414,64415],1723:[64416,64417,64418,64419],1726:[64426,64427,64428,64429],1728:[64420,64421],1729:[64422,64423,64424,64425],1733:[64480,64481],1734:[64473,64474],1735:[64471,64472],1736:[64475,64476],1737:[64482,64483],1739:[64478,64479],1740:[64508,64509,64510,64511],1744:[64484,64485,64486,64487],1746:[64430,64431],1747:[64432,64433]},r={65247:{65154:65269,65156:65271,65160:65273,65166:65275},65248:{65154:65270,65156:65272,65160:65274,65166:65276},65165:{65247:{65248:{65258:65010}}},1617:{1612:64606,1613:64607,1614:64608,1615:64609,1616:64610}},n={1612:64606,1613:64607,1614:64608,1615:64609,1616:64610},i=[1570,1571,1573,1575];t.__arabicParser__={};var a=t.__arabicParser__.isInArabicSubstitutionA=function(t){return void 0!==e[t.charCodeAt(0)]},o=t.__arabicParser__.isArabicLetter=function(t){return"string"==typeof t&&/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/.test(t)},s=t.__arabicParser__.isArabicEndLetter=function(t){return o(t)&&a(t)&&e[t.charCodeAt(0)].length<=2},c=t.__arabicParser__.isArabicAlfLetter=function(t){return o(t)&&i.indexOf(t.charCodeAt(0))>=0};t.__arabicParser__.arabicLetterHasIsolatedForm=function(t){return o(t)&&a(t)&&e[t.charCodeAt(0)].length>=1};var u=t.__arabicParser__.arabicLetterHasFinalForm=function(t){return o(t)&&a(t)&&e[t.charCodeAt(0)].length>=2};t.__arabicParser__.arabicLetterHasInitialForm=function(t){return o(t)&&a(t)&&e[t.charCodeAt(0)].length>=3};var l=t.__arabicParser__.arabicLetterHasMedialForm=function(t){return o(t)&&a(t)&&4==e[t.charCodeAt(0)].length},h=t.__arabicParser__.resolveLigatures=function(t){var e=0,n=r,i="",a=0;for(e=0;e<t.length;e+=1)void 0!==n[t.charCodeAt(e)]?(a++,"number"==typeof(n=n[t.charCodeAt(e)])&&(i+=String.fromCharCode(n),n=r,a=0),e===t.length-1&&(n=r,i+=t.charAt(e-(a-1)),e-=a-1,a=0)):(n=r,i+=t.charAt(e-a),e-=a,a=0);return i};t.__arabicParser__.isArabicDiacritic=function(t){return void 0!==t&&void 0!==n[t.charCodeAt(0)]};var f=t.__arabicParser__.getCorrectForm=function(t,e,r){return o(t)?!1===a(t)?-1:!u(t)||!o(e)&&!o(r)||!o(r)&&s(e)||s(t)&&!o(e)||s(t)&&c(e)||s(t)&&s(e)?0:l(t)&&o(e)&&!s(e)&&o(r)&&u(r)?3:s(t)||!o(r)?1:2:-1},d=function(t){var r=0,n=0,i=0,a="",s="",c="",u=(t=t||"").split("\\s+"),l=[];for(r=0;r<u.length;r+=1){for(l.push(""),n=0;n<u[r].length;n+=1)a=u[r][n],s=u[r][n-1],c=u[r][n+1],o(a)?(i=f(a,s,c),l[r]+=-1!==i?String.fromCharCode(e[a.charCodeAt(0)][i]):a):l[r]+=a;l[r]=h(l[r])}return l.join(" ")},p=t.__arabicParser__.processArabic=t.processArabic=function(){var t,e="string"==typeof arguments[0]?arguments[0]:arguments[0].text,r=[];if(Array.isArray(e)){var n=0;for(r=[],n=0;n<e.length;n+=1)Array.isArray(e[n])?r.push([d(e[n][0]),e[n][1],e[n][2]]):r.push([d(e[n])]);t=r}else t=d(e);return"string"==typeof arguments[0]?t:(arguments[0].text=t,arguments[0])};t.events.push(["preProcessText",p])}(M.API),
/** @license
   * jsPDF Autoprint Plugin
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
function(t){t.autoPrint=function(t){var e;switch((t=t||{}).variant=t.variant||"non-conform",t.variant){case"javascript":this.addJS("print({});");break;case"non-conform":default:this.internal.events.subscribe("postPutResources",(function(){e=this.internal.newObject(),this.internal.out("<<"),this.internal.out("/S /Named"),this.internal.out("/Type /Action"),this.internal.out("/N /Print"),this.internal.out(">>"),this.internal.out("endobj")})),this.internal.events.subscribe("putCatalog",(function(){this.internal.out("/OpenAction "+e+" 0 R")}))}return this}}(M.API),
/**
   * @license
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
function(t){var e=function(){var t=void 0;Object.defineProperty(this,"pdf",{get:function(){return t},set:function(e){t=e}});var e=150;Object.defineProperty(this,"width",{get:function(){return e},set:function(t){e=isNaN(t)||!1===Number.isInteger(t)||t<0?150:t,this.getContext("2d").pageWrapXEnabled&&(this.getContext("2d").pageWrapX=e+1)}});var r=300;Object.defineProperty(this,"height",{get:function(){return r},set:function(t){r=isNaN(t)||!1===Number.isInteger(t)||t<0?300:t,this.getContext("2d").pageWrapYEnabled&&(this.getContext("2d").pageWrapY=r+1)}});var n=[];Object.defineProperty(this,"childNodes",{get:function(){return n},set:function(t){n=t}});var i={};Object.defineProperty(this,"style",{get:function(){return i},set:function(t){i=t}}),Object.defineProperty(this,"parentNode",{})};e.prototype.getContext=function(t,e){var r;if("2d"!==(t=t||"2d"))return null;for(r in e)this.pdf.context2d.hasOwnProperty(r)&&(this.pdf.context2d[r]=e[r]);return this.pdf.context2d._canvas=this,this.pdf.context2d},e.prototype.toDataURL=function(){throw new Error("toDataURL is not implemented.")},t.events.push(["initialized",function(){this.canvas=new e,this.canvas.pdf=this}])}(M.API),function(t){var r={left:0,top:0,bottom:0,right:0},n=!1,i=function(){void 0===this.internal.__cell__&&(this.internal.__cell__={},this.internal.__cell__.padding=3,this.internal.__cell__.headerFunction=void 0,this.internal.__cell__.margins=Object.assign({},r),this.internal.__cell__.margins.width=this.getPageWidth(),a.call(this))},a=function(){this.internal.__cell__.lastCell=new o,this.internal.__cell__.pages=1},o=function(){var t=arguments[0];Object.defineProperty(this,"x",{enumerable:!0,get:function(){return t},set:function(e){t=e}});var e=arguments[1];Object.defineProperty(this,"y",{enumerable:!0,get:function(){return e},set:function(t){e=t}});var r=arguments[2];Object.defineProperty(this,"width",{enumerable:!0,get:function(){return r},set:function(t){r=t}});var n=arguments[3];Object.defineProperty(this,"height",{enumerable:!0,get:function(){return n},set:function(t){n=t}});var i=arguments[4];Object.defineProperty(this,"text",{enumerable:!0,get:function(){return i},set:function(t){i=t}});var a=arguments[5];Object.defineProperty(this,"lineNumber",{enumerable:!0,get:function(){return a},set:function(t){a=t}});var o=arguments[6];return Object.defineProperty(this,"align",{enumerable:!0,get:function(){return o},set:function(t){o=t}}),this};o.prototype.clone=function(){return new o(this.x,this.y,this.width,this.height,this.text,this.lineNumber,this.align)},o.prototype.toArray=function(){return[this.x,this.y,this.width,this.height,this.text,this.lineNumber,this.align]},t.setHeaderFunction=function(t){return i.call(this),this.internal.__cell__.headerFunction="function"==typeof t?t:void 0,this},t.getTextDimensions=function(t,e){i.call(this);var r=(e=e||{}).fontSize||this.getFontSize(),n=e.font||this.getFont(),a=e.scaleFactor||this.internal.scaleFactor,o=0,s=0,c=0,u=this;if(!Array.isArray(t)&&"string"!=typeof t){if("number"!=typeof t)throw new Error("getTextDimensions expects text-parameter to be of type String or type Number or an Array of Strings.");t=String(t)}var l=e.maxWidth;l>0?"string"==typeof t?t=this.splitTextToSize(t,l):"[object Array]"===Object.prototype.toString.call(t)&&(t=t.reduce((function(t,e){return t.concat(u.splitTextToSize(e,l))}),[])):t=Array.isArray(t)?t:[t];for(var h=0;h<t.length;h++)o<(c=this.getStringUnitWidth(t[h],{font:n})*r)&&(o=c);return 0!==o&&(s=t.length),{w:o/=a,h:Math.max((s*r*this.getLineHeightFactor()-r*(this.getLineHeightFactor()-1))/a,0)}},t.cellAddPage=function(){i.call(this),this.addPage();var t=this.internal.__cell__.margins||r;return this.internal.__cell__.lastCell=new o(t.left,t.top,void 0,void 0),this.internal.__cell__.pages+=1,this};var s=t.cell=function(){var t;t=arguments[0]instanceof o?arguments[0]:new o(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]),i.call(this);var e=this.internal.__cell__.lastCell,a=this.internal.__cell__.padding,s=this.internal.__cell__.margins||r,c=this.internal.__cell__.tableHeaderRow,u=this.internal.__cell__.printHeaders;return void 0!==e.lineNumber&&(e.lineNumber===t.lineNumber?(t.x=(e.x||0)+(e.width||0),t.y=e.y||0):e.y+e.height+t.height+s.bottom>this.getPageHeight()?(this.cellAddPage(),t.y=s.top,u&&c&&(this.printHeaderRow(t.lineNumber,!0),t.y+=c[0].height)):t.y=e.y+e.height||t.y),void 0!==t.text[0]&&(this.rect(t.x,t.y,t.width,t.height,!0===n?"FD":void 0),"right"===t.align?this.text(t.text,t.x+t.width-a,t.y+a,{align:"right",baseline:"top"}):"center"===t.align?this.text(t.text,t.x+t.width/2,t.y+a,{align:"center",baseline:"top",maxWidth:t.width-a-a}):this.text(t.text,t.x+a,t.y+a,{align:"left",baseline:"top",maxWidth:t.width-a-a})),this.internal.__cell__.lastCell=t,this};t.table=function(t,n,u,l,h){if(i.call(this),!u)throw new Error("No data for PDF table.");var f,d,p,g,m=[],v=[],b=[],y={},w={},N=[],L=[],A=(h=h||{}).autoSize||!1,x=!1!==h.printHeaders,S=h.css&&void 0!==h.css["font-size"]?16*h.css["font-size"]:h.fontSize||12,_=h.margins||Object.assign({width:this.getPageWidth()},r),P="number"==typeof h.padding?h.padding:3,k=h.headerBackgroundColor||"#c8c8c8",F=h.headerTextColor||"#000";if(a.call(this),this.internal.__cell__.printHeaders=x,this.internal.__cell__.margins=_,this.internal.__cell__.table_font_size=S,this.internal.__cell__.padding=P,this.internal.__cell__.headerBackgroundColor=k,this.internal.__cell__.headerTextColor=F,this.setFontSize(S),null==l)v=m=Object.keys(u[0]),b=m.map((function(){return"left"}));else if(Array.isArray(l)&&"object"===e(l[0]))for(m=l.map((function(t){return t.name})),v=l.map((function(t){return t.prompt||t.name||""})),b=l.map((function(t){return t.align||"left"})),f=0;f<l.length;f+=1)w[l[f].name]=l[f].width*(19.049976/25.4);else Array.isArray(l)&&"string"==typeof l[0]&&(v=m=l,b=m.map((function(){return"left"})));if(A||Array.isArray(l)&&"string"==typeof l[0])for(f=0;f<m.length;f+=1){for(y[g=m[f]]=u.map((function(t){return t[g]})),this.setFont(void 0,"bold"),N.push(this.getTextDimensions(v[f],{fontSize:this.internal.__cell__.table_font_size,scaleFactor:this.internal.scaleFactor}).w),d=y[g],this.setFont(void 0,"normal"),p=0;p<d.length;p+=1)N.push(this.getTextDimensions(d[p],{fontSize:this.internal.__cell__.table_font_size,scaleFactor:this.internal.scaleFactor}).w);w[g]=Math.max.apply(null,N)+P+P,N=[]}if(x){var I={};for(f=0;f<m.length;f+=1)I[m[f]]={},I[m[f]].text=v[f],I[m[f]].align=b[f];var C=c.call(this,I,w);L=m.map((function(e){return new o(t,n,w[e],C,I[e].text,void 0,I[e].align)})),this.setTableHeaderRow(L),this.printHeaderRow(1,!1)}var j=l.reduce((function(t,e){return t[e.name]=e.align,t}),{});for(f=0;f<u.length;f+=1){"rowStart"in h&&h.rowStart instanceof Function&&h.rowStart({row:f,data:u[f]},this);var O=c.call(this,u[f],w);for(p=0;p<m.length;p+=1){var B=u[f][m[p]];"cellStart"in h&&h.cellStart instanceof Function&&h.cellStart({row:f,col:p,data:B},this),s.call(this,new o(t,n,w[m[p]],O,B,f+2,j[m[p]]))}}return this.internal.__cell__.table_x=t,this.internal.__cell__.table_y=n,this};var c=function(t,e){var r=this.internal.__cell__.padding,n=this.internal.__cell__.table_font_size,i=this.internal.scaleFactor;return Object.keys(t).map((function(n){var i=t[n];return this.splitTextToSize(i.hasOwnProperty("text")?i.text:i,e[n]-r-r)}),this).map((function(t){return this.getLineHeightFactor()*t.length*n/i+r+r}),this).reduce((function(t,e){return Math.max(t,e)}),0)};t.setTableHeaderRow=function(t){i.call(this),this.internal.__cell__.tableHeaderRow=t},t.printHeaderRow=function(t,e){if(i.call(this),!this.internal.__cell__.tableHeaderRow)throw new Error("Property tableHeaderRow does not exist.");var r;if(n=!0,"function"==typeof this.internal.__cell__.headerFunction){var a=this.internal.__cell__.headerFunction(this,this.internal.__cell__.pages);this.internal.__cell__.lastCell=new o(a[0],a[1],a[2],a[3],void 0,-1)}this.setFont(void 0,"bold");for(var c=[],u=0;u<this.internal.__cell__.tableHeaderRow.length;u+=1){r=this.internal.__cell__.tableHeaderRow[u].clone(),e&&(r.y=this.internal.__cell__.margins.top||0,c.push(r)),r.lineNumber=t;var l=this.getTextColor();this.setTextColor(this.internal.__cell__.headerTextColor),this.setFillColor(this.internal.__cell__.headerBackgroundColor),s.call(this,r),this.setTextColor(l)}c.length>0&&this.setTableHeaderRow(c),this.setFont(void 0,"normal"),n=!1}}(M.API);var _t={italic:["italic","oblique","normal"],oblique:["oblique","italic","normal"],normal:["normal","oblique","italic"]},Pt=["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded"],kt=St(Pt),Ft=[100,200,300,400,500,600,700,800,900],It=St(Ft);function Ct(t){var e=t.family.replace(/"|'/g,"").toLowerCase(),r=function(t){return _t[t=t||"normal"]?t:"normal"}(t.style),n=function(t){if(!t)return 400;if("number"==typeof t)return t>=100&&t<=900&&t%100==0?t:400;if(/^\d00$/.test(t))return parseInt(t);switch(t){case"bold":return 700;case"normal":default:return 400}}(t.weight),i=function(t){return"number"==typeof kt[t=t||"normal"]?t:"normal"}(t.stretch);return{family:e,style:r,weight:n,stretch:i,src:t.src||[],ref:t.ref||{name:e,style:[i,r,n].join(" ")}}}function jt(t,e,r,n){var i;for(i=r;i>=0&&i<e.length;i+=n)if(t[e[i]])return t[e[i]];for(i=r;i>=0&&i<e.length;i-=n)if(t[e[i]])return t[e[i]]}var Ot={"sans-serif":"helvetica",fixed:"courier",monospace:"courier",terminal:"courier",cursive:"times",fantasy:"times",serif:"times"},Bt={caption:"times",icon:"times",menu:"times","message-box":"times","small-caption":"times","status-bar":"times"};function Mt(t){return[t.stretch,t.style,t.weight,t.family].join(" ")}function Et(t,e,r){for(var n=(r=r||{}).defaultFontFamily||"times",i=Object.assign({},Ot,r.genericFontFamilies||{}),a=null,o=null,s=0;s<e.length;++s)if(i[(a=Ct(e[s])).family]&&(a.family=i[a.family]),t.hasOwnProperty(a.family)){o=t[a.family];break}if(!(o=o||t[n]))throw new Error("Could not find a font-family for the rule '"+Mt(a)+"' and default family '"+n+"'.");if(o=function(t,e){if(e[t])return e[t];var r=kt[t],n=r<=kt.normal?-1:1,i=jt(e,Pt,r,n);if(!i)throw new Error("Could not find a matching font-stretch value for "+t);return i}(a.stretch,o),o=function(t,e){if(e[t])return e[t];for(var r=_t[t],n=0;n<r.length;++n)if(e[r[n]])return e[r[n]];throw new Error("Could not find a matching font-style for "+t)}(a.style,o),!(o=function(t,e){if(e[t])return e[t];if(400===t&&e[500])return e[500];if(500===t&&e[400])return e[400];var r=It[t],n=jt(e,Ft,r,t<400?-1:1);if(!n)throw new Error("Could not find a matching font-weight for value "+t);return n}(a.weight,o)))throw new Error("Failed to resolve a font for the rule '"+Mt(a)+"'.");return o}function qt(t){return t.trimLeft()}function Dt(t,e){for(var r=0;r<t.length;){if(t.charAt(r)===e)return[t.substring(0,r),t.substring(r+1)];r+=1}return null}function Rt(t){var e=t.match(/^(-[a-z_]|[a-z_])[a-z0-9_-]*/i);return null===e?null:[e[0],t.substring(e[0].length)]}var Tt=["times"];!function(t){var r,n,a,o,s,c,u,l,f,d=function(t){return t=t||{},this.isStrokeTransparent=t.isStrokeTransparent||!1,this.strokeOpacity=t.strokeOpacity||1,this.strokeStyle=t.strokeStyle||"#000000",this.fillStyle=t.fillStyle||"#000000",this.isFillTransparent=t.isFillTransparent||!1,this.fillOpacity=t.fillOpacity||1,this.font=t.font||"10px sans-serif",this.textBaseline=t.textBaseline||"alphabetic",this.textAlign=t.textAlign||"left",this.lineWidth=t.lineWidth||1,this.lineJoin=t.lineJoin||"miter",this.lineCap=t.lineCap||"butt",this.path=t.path||[],this.transform=void 0!==t.transform?t.transform.clone():new l,this.globalCompositeOperation=t.globalCompositeOperation||"normal",this.globalAlpha=t.globalAlpha||1,this.clip_path=t.clip_path||[],this.currentPoint=t.currentPoint||new c,this.miterLimit=t.miterLimit||10,this.lastPoint=t.lastPoint||new c,this.lineDashOffset=t.lineDashOffset||0,this.lineDash=t.lineDash||[],this.margin=t.margin||[0,0,0,0],this.prevPageLastElemOffset=t.prevPageLastElemOffset||0,this.ignoreClearRect="boolean"!=typeof t.ignoreClearRect||t.ignoreClearRect,this};t.events.push(["initialized",function(){this.context2d=new p(this),r=this.internal.f2,n=this.internal.getCoordinateString,a=this.internal.getVerticalCoordinateString,o=this.internal.getHorizontalCoordinate,s=this.internal.getVerticalCoordinate,c=this.internal.Point,u=this.internal.Rectangle,l=this.internal.Matrix,f=new d}]);var p=function(t){Object.defineProperty(this,"canvas",{get:function(){return{parentNode:!1,style:!1}}});var e=t;Object.defineProperty(this,"pdf",{get:function(){return e}});var r=!1;Object.defineProperty(this,"pageWrapXEnabled",{get:function(){return r},set:function(t){r=Boolean(t)}});var n=!1;Object.defineProperty(this,"pageWrapYEnabled",{get:function(){return n},set:function(t){n=Boolean(t)}});var i=0;Object.defineProperty(this,"posX",{get:function(){return i},set:function(t){isNaN(t)||(i=t)}});var a=0;Object.defineProperty(this,"posY",{get:function(){return a},set:function(t){isNaN(t)||(a=t)}}),Object.defineProperty(this,"margin",{get:function(){return f.margin},set:function(t){var e;"number"==typeof t?e=[t,t,t,t]:((e=new Array(4))[0]=t[0],e[1]=t.length>=2?t[1]:e[0],e[2]=t.length>=3?t[2]:e[0],e[3]=t.length>=4?t[3]:e[1]),f.margin=e}});var o=!1;Object.defineProperty(this,"autoPaging",{get:function(){return o},set:function(t){o=t}});var s=0;Object.defineProperty(this,"lastBreak",{get:function(){return s},set:function(t){s=t}});var c=[];Object.defineProperty(this,"pageBreaks",{get:function(){return c},set:function(t){c=t}}),Object.defineProperty(this,"ctx",{get:function(){return f},set:function(t){t instanceof d&&(f=t)}}),Object.defineProperty(this,"path",{get:function(){return f.path},set:function(t){f.path=t}});var u=[];Object.defineProperty(this,"ctxStack",{get:function(){return u},set:function(t){u=t}}),Object.defineProperty(this,"fillStyle",{get:function(){return this.ctx.fillStyle},set:function(t){var e;e=g(t),this.ctx.fillStyle=e.style,this.ctx.isFillTransparent=0===e.a,this.ctx.fillOpacity=e.a,this.pdf.setFillColor(e.r,e.g,e.b,{a:e.a}),this.pdf.setTextColor(e.r,e.g,e.b,{a:e.a})}}),Object.defineProperty(this,"strokeStyle",{get:function(){return this.ctx.strokeStyle},set:function(t){var e=g(t);this.ctx.strokeStyle=e.style,this.ctx.isStrokeTransparent=0===e.a,this.ctx.strokeOpacity=e.a,0===e.a?this.pdf.setDrawColor(255,255,255):(e.a,this.pdf.setDrawColor(e.r,e.g,e.b))}}),Object.defineProperty(this,"lineCap",{get:function(){return this.ctx.lineCap},set:function(t){-1!==["butt","round","square"].indexOf(t)&&(this.ctx.lineCap=t,this.pdf.setLineCap(t))}}),Object.defineProperty(this,"lineWidth",{get:function(){return this.ctx.lineWidth},set:function(t){isNaN(t)||(this.ctx.lineWidth=t,this.pdf.setLineWidth(t))}}),Object.defineProperty(this,"lineJoin",{get:function(){return this.ctx.lineJoin},set:function(t){-1!==["bevel","round","miter"].indexOf(t)&&(this.ctx.lineJoin=t,this.pdf.setLineJoin(t))}}),Object.defineProperty(this,"miterLimit",{get:function(){return this.ctx.miterLimit},set:function(t){isNaN(t)||(this.ctx.miterLimit=t,this.pdf.setMiterLimit(t))}}),Object.defineProperty(this,"textBaseline",{get:function(){return this.ctx.textBaseline},set:function(t){this.ctx.textBaseline=t}}),Object.defineProperty(this,"textAlign",{get:function(){return this.ctx.textAlign},set:function(t){-1!==["right","end","center","left","start"].indexOf(t)&&(this.ctx.textAlign=t)}});var l=null;function h(t,e){if(null===l){var r=function(t){var e=[];return Object.keys(t).forEach((function(r){t[r].forEach((function(t){var n=null;switch(t){case"bold":n={family:r,weight:"bold"};break;case"italic":n={family:r,style:"italic"};break;case"bolditalic":n={family:r,weight:"bold",style:"italic"};break;case"":case"normal":n={family:r}}null!==n&&(n.ref={name:r,style:t},e.push(n))}))})),e}(t.getFontList());l=function(t){for(var e={},r=0;r<t.length;++r){var n=Ct(t[r]),i=n.family,a=n.stretch,o=n.style,s=n.weight;e[i]=e[i]||{},e[i][a]=e[i][a]||{},e[i][a][o]=e[i][a][o]||{},e[i][a][o][s]=n}return e}(r.concat(e))}return l}var p=null;Object.defineProperty(this,"fontFaces",{get:function(){return p},set:function(t){l=null,p=t}}),Object.defineProperty(this,"font",{get:function(){return this.ctx.font},set:function(t){var e;if(this.ctx.font=t,null!==(e=/^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-_,\"\'\sa-z]+?)\s*$/i.exec(t))){var r=e[1],n=(e[2],e[3]),i=e[4],a=(e[5],e[6]),o=/^([.\d]+)((?:%|in|[cem]m|ex|p[ctx]))$/i.exec(i)[2];i="px"===o?Math.floor(parseFloat(i)*this.pdf.internal.scaleFactor):"em"===o?Math.floor(parseFloat(i)*this.pdf.getFontSize()):Math.floor(parseFloat(i)*this.pdf.internal.scaleFactor),this.pdf.setFontSize(i);var s=function(t){var e,r,n=[],i=t.trim();if(""===i)return Tt;if(i in Bt)return[Bt[i]];for(;""!==i;){switch(r=null,e=(i=qt(i)).charAt(0)){case'"':case"'":r=Dt(i.substring(1),e);break;default:r=Rt(i)}if(null===r)return Tt;if(n.push(r[0]),""!==(i=qt(r[1]))&&","!==i.charAt(0))return Tt;i=i.replace(/^,/,"")}return n}(a);if(this.fontFaces){var c=Et(h(this.pdf,this.fontFaces),s.map((function(t){return{family:t,stretch:"normal",weight:n,style:r}})));this.pdf.setFont(c.ref.name,c.ref.style)}else{var u="";("bold"===n||parseInt(n,10)>=700||"bold"===r)&&(u="bold"),"italic"===r&&(u+="italic"),0===u.length&&(u="normal");for(var l="",f={arial:"Helvetica",Arial:"Helvetica",verdana:"Helvetica",Verdana:"Helvetica",helvetica:"Helvetica",Helvetica:"Helvetica","sans-serif":"Helvetica",fixed:"Courier",monospace:"Courier",terminal:"Courier",cursive:"Times",fantasy:"Times",serif:"Times"},d=0;d<s.length;d++){if(void 0!==this.pdf.internal.getFont(s[d],u,{noFallback:!0,disableWarning:!0})){l=s[d];break}if("bolditalic"===u&&void 0!==this.pdf.internal.getFont(s[d],"bold",{noFallback:!0,disableWarning:!0}))l=s[d],u="bold";else if(void 0!==this.pdf.internal.getFont(s[d],"normal",{noFallback:!0,disableWarning:!0})){l=s[d],u="normal";break}}if(""===l)for(var p=0;p<s.length;p++)if(f[s[p]]){l=f[s[p]];break}l=""===l?"Times":l,this.pdf.setFont(l,u)}}}}),Object.defineProperty(this,"globalCompositeOperation",{get:function(){return this.ctx.globalCompositeOperation},set:function(t){this.ctx.globalCompositeOperation=t}}),Object.defineProperty(this,"globalAlpha",{get:function(){return this.ctx.globalAlpha},set:function(t){this.ctx.globalAlpha=t}}),Object.defineProperty(this,"lineDashOffset",{get:function(){return this.ctx.lineDashOffset},set:function(t){this.ctx.lineDashOffset=t,T.call(this)}}),Object.defineProperty(this,"lineDash",{get:function(){return this.ctx.lineDash},set:function(t){this.ctx.lineDash=t,T.call(this)}}),Object.defineProperty(this,"ignoreClearRect",{get:function(){return this.ctx.ignoreClearRect},set:function(t){this.ctx.ignoreClearRect=Boolean(t)}})};p.prototype.setLineDash=function(t){this.lineDash=t},p.prototype.getLineDash=function(){return this.lineDash.length%2?this.lineDash.concat(this.lineDash):this.lineDash.slice()},p.prototype.fill=function(){A.call(this,"fill",!1)},p.prototype.stroke=function(){A.call(this,"stroke",!1)},p.prototype.beginPath=function(){this.path=[{type:"begin"}]},p.prototype.moveTo=function(t,e){if(isNaN(t)||isNaN(e))throw i.error("jsPDF.context2d.moveTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.moveTo");var r=this.ctx.transform.applyToPoint(new c(t,e));this.path.push({type:"mt",x:r.x,y:r.y}),this.ctx.lastPoint=new c(t,e)},p.prototype.closePath=function(){var t=new c(0,0),r=0;for(r=this.path.length-1;-1!==r;r--)if("begin"===this.path[r].type&&"object"===e(this.path[r+1])&&"number"==typeof this.path[r+1].x){t=new c(this.path[r+1].x,this.path[r+1].y);break}this.path.push({type:"close"}),this.ctx.lastPoint=new c(t.x,t.y)},p.prototype.lineTo=function(t,e){if(isNaN(t)||isNaN(e))throw i.error("jsPDF.context2d.lineTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.lineTo");var r=this.ctx.transform.applyToPoint(new c(t,e));this.path.push({type:"lt",x:r.x,y:r.y}),this.ctx.lastPoint=new c(r.x,r.y)},p.prototype.clip=function(){this.ctx.clip_path=JSON.parse(JSON.stringify(this.path)),A.call(this,null,!0)},p.prototype.quadraticCurveTo=function(t,e,r,n){if(isNaN(r)||isNaN(n)||isNaN(t)||isNaN(e))throw i.error("jsPDF.context2d.quadraticCurveTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.quadraticCurveTo");var a=this.ctx.transform.applyToPoint(new c(r,n)),o=this.ctx.transform.applyToPoint(new c(t,e));this.path.push({type:"qct",x1:o.x,y1:o.y,x:a.x,y:a.y}),this.ctx.lastPoint=new c(a.x,a.y)},p.prototype.bezierCurveTo=function(t,e,r,n,a,o){if(isNaN(a)||isNaN(o)||isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw i.error("jsPDF.context2d.bezierCurveTo: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.bezierCurveTo");var s=this.ctx.transform.applyToPoint(new c(a,o)),u=this.ctx.transform.applyToPoint(new c(t,e)),l=this.ctx.transform.applyToPoint(new c(r,n));this.path.push({type:"bct",x1:u.x,y1:u.y,x2:l.x,y2:l.y,x:s.x,y:s.y}),this.ctx.lastPoint=new c(s.x,s.y)},p.prototype.arc=function(t,e,r,n,a,o){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||isNaN(a))throw i.error("jsPDF.context2d.arc: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.arc");if(o=Boolean(o),!this.ctx.transform.isIdentity){var s=this.ctx.transform.applyToPoint(new c(t,e));t=s.x,e=s.y;var u=this.ctx.transform.applyToPoint(new c(0,r)),l=this.ctx.transform.applyToPoint(new c(0,0));r=Math.sqrt(Math.pow(u.x-l.x,2)+Math.pow(u.y-l.y,2))}Math.abs(a-n)>=2*Math.PI&&(n=0,a=2*Math.PI),this.path.push({type:"arc",x:t,y:e,radius:r,startAngle:n,endAngle:a,counterclockwise:o})},p.prototype.arcTo=function(t,e,r,n,i){throw new Error("arcTo not implemented.")},p.prototype.rect=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw i.error("jsPDF.context2d.rect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.rect");this.moveTo(t,e),this.lineTo(t+r,e),this.lineTo(t+r,e+n),this.lineTo(t,e+n),this.lineTo(t,e),this.lineTo(t+r,e),this.lineTo(t,e)},p.prototype.fillRect=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw i.error("jsPDF.context2d.fillRect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.fillRect");if(!m.call(this)){var a={};"butt"!==this.lineCap&&(a.lineCap=this.lineCap,this.lineCap="butt"),"miter"!==this.lineJoin&&(a.lineJoin=this.lineJoin,this.lineJoin="miter"),this.beginPath(),this.rect(t,e,r,n),this.fill(),a.hasOwnProperty("lineCap")&&(this.lineCap=a.lineCap),a.hasOwnProperty("lineJoin")&&(this.lineJoin=a.lineJoin)}},p.prototype.strokeRect=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw i.error("jsPDF.context2d.strokeRect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.strokeRect");v.call(this)||(this.beginPath(),this.rect(t,e,r,n),this.stroke())},p.prototype.clearRect=function(t,e,r,n){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n))throw i.error("jsPDF.context2d.clearRect: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.clearRect");this.ignoreClearRect||(this.fillStyle="#ffffff",this.fillRect(t,e,r,n))},p.prototype.save=function(t){t="boolean"!=typeof t||t;for(var e=this.pdf.internal.getCurrentPageInfo().pageNumber,r=0;r<this.pdf.internal.getNumberOfPages();r++)this.pdf.setPage(r+1),this.pdf.internal.out("q");if(this.pdf.setPage(e),t){this.ctx.fontSize=this.pdf.internal.getFontSize();var n=new d(this.ctx);this.ctxStack.push(this.ctx),this.ctx=n}},p.prototype.restore=function(t){t="boolean"!=typeof t||t;for(var e=this.pdf.internal.getCurrentPageInfo().pageNumber,r=0;r<this.pdf.internal.getNumberOfPages();r++)this.pdf.setPage(r+1),this.pdf.internal.out("Q");this.pdf.setPage(e),t&&0!==this.ctxStack.length&&(this.ctx=this.ctxStack.pop(),this.fillStyle=this.ctx.fillStyle,this.strokeStyle=this.ctx.strokeStyle,this.font=this.ctx.font,this.lineCap=this.ctx.lineCap,this.lineWidth=this.ctx.lineWidth,this.lineJoin=this.ctx.lineJoin,this.lineDash=this.ctx.lineDash,this.lineDashOffset=this.ctx.lineDashOffset)},p.prototype.toDataURL=function(){throw new Error("toDataUrl not implemented.")};var g=function(t){var e,r,n,i;if(!0===t.isCanvasGradient&&(t=t.getColor()),!t)return{r:0,g:0,b:0,a:0,style:t};if(/transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/.test(t))e=0,r=0,n=0,i=0;else{var a=/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(t);if(null!==a)e=parseInt(a[1]),r=parseInt(a[2]),n=parseInt(a[3]),i=1;else if(null!==(a=/rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/.exec(t)))e=parseInt(a[1]),r=parseInt(a[2]),n=parseInt(a[3]),i=parseFloat(a[4]);else{if(i=1,"string"==typeof t&&"#"!==t.charAt(0)){var o=new h(t);t=o.ok?o.toHex():"#000000"}4===t.length?(e=t.substring(1,2),e+=e,r=t.substring(2,3),r+=r,n=t.substring(3,4),n+=n):(e=t.substring(1,3),r=t.substring(3,5),n=t.substring(5,7)),e=parseInt(e,16),r=parseInt(r,16),n=parseInt(n,16)}}return{r:e,g:r,b:n,a:i,style:t}},m=function(){return this.ctx.isFillTransparent||0==this.globalAlpha},v=function(){return Boolean(this.ctx.isStrokeTransparent||0==this.globalAlpha)};p.prototype.fillText=function(t,e,r,n){if(isNaN(e)||isNaN(r)||"string"!=typeof t)throw i.error("jsPDF.context2d.fillText: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.fillText");if(n=isNaN(n)?void 0:n,!m.call(this)){var a=q(this.ctx.transform.rotation),o=this.ctx.transform.scaleX;C.call(this,{text:t,x:e,y:r,scale:o,angle:a,align:this.textAlign,maxWidth:n})}},p.prototype.strokeText=function(t,e,r,n){if(isNaN(e)||isNaN(r)||"string"!=typeof t)throw i.error("jsPDF.context2d.strokeText: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.strokeText");if(!v.call(this)){n=isNaN(n)?void 0:n;var a=q(this.ctx.transform.rotation),o=this.ctx.transform.scaleX;C.call(this,{text:t,x:e,y:r,scale:o,renderingMode:"stroke",angle:a,align:this.textAlign,maxWidth:n})}},p.prototype.measureText=function(t){if("string"!=typeof t)throw i.error("jsPDF.context2d.measureText: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.measureText");var e=this.pdf,r=this.pdf.internal.scaleFactor,n=e.internal.getFontSize(),a=e.getStringUnitWidth(t)*n/e.internal.scaleFactor,o=function(t){var e=(t=t||{}).width||0;return Object.defineProperty(this,"width",{get:function(){return e}}),this};return new o({width:a*=Math.round(96*r/72*1e4)/1e4})},p.prototype.scale=function(t,e){if(isNaN(t)||isNaN(e))throw i.error("jsPDF.context2d.scale: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.scale");var r=new l(t,0,0,e,0,0);this.ctx.transform=this.ctx.transform.multiply(r)},p.prototype.rotate=function(t){if(isNaN(t))throw i.error("jsPDF.context2d.rotate: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.rotate");var e=new l(Math.cos(t),Math.sin(t),-Math.sin(t),Math.cos(t),0,0);this.ctx.transform=this.ctx.transform.multiply(e)},p.prototype.translate=function(t,e){if(isNaN(t)||isNaN(e))throw i.error("jsPDF.context2d.translate: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.translate");var r=new l(1,0,0,1,t,e);this.ctx.transform=this.ctx.transform.multiply(r)},p.prototype.transform=function(t,e,r,n,a,o){if(isNaN(t)||isNaN(e)||isNaN(r)||isNaN(n)||isNaN(a)||isNaN(o))throw i.error("jsPDF.context2d.transform: Invalid arguments",arguments),new Error("Invalid arguments passed to jsPDF.context2d.transform");var s=new l(t,e,r,n,a,o);this.ctx.transform=this.ctx.transform.multiply(s)},p.prototype.setTransform=function(t,e,r,n,i,a){t=isNaN(t)?1:t,e=isNaN(e)?0:e,r=isNaN(r)?0:r,n=isNaN(n)?1:n,i=isNaN(i)?0:i,a=isNaN(a)?0:a,this.ctx.transform=new l(t,e,r,n,i,a)};var b=function(){return this.margin[0]>0||this.margin[1]>0||this.margin[2]>0||this.margin[3]>0};p.prototype.drawImage=function(t,e,r,n,i,a,o,s,c){var h=this.pdf.getImageProperties(t),f=1,d=1,p=1,g=1;void 0!==n&&void 0!==s&&(p=s/n,g=c/i,f=h.width/n*s/n,d=h.height/i*c/i),void 0===a&&(a=e,o=r,e=0,r=0),void 0!==n&&void 0===s&&(s=n,c=i),void 0===n&&void 0===s&&(s=h.width,c=h.height);for(var m,v=this.ctx.transform.decompose(),w=q(v.rotate.shx),A=new l,S=(A=(A=(A=A.multiply(v.translate)).multiply(v.skew)).multiply(v.scale)).applyToRectangle(new u(a-e*p,o-r*g,n*f,i*d)),_=y.call(this,S),P=[],k=0;k<_.length;k+=1)-1===P.indexOf(_[k])&&P.push(_[k]);if(L(P),this.autoPaging)for(var F=P[0],I=P[P.length-1],C=F;C<I+1;C++){this.pdf.setPage(C);var j=this.pdf.internal.pageSize.width-this.margin[3]-this.margin[1],O=1===C?this.posY+this.margin[0]:this.margin[0],B=this.pdf.internal.pageSize.height-this.posY-this.margin[0]-this.margin[2],M=this.pdf.internal.pageSize.height-this.margin[0]-this.margin[2],E=1===C?0:B+(C-2)*M;if(0!==this.ctx.clip_path.length){var D=this.path;m=JSON.parse(JSON.stringify(this.ctx.clip_path)),this.path=N(m,this.posX+this.margin[3],-E+O+this.ctx.prevPageLastElemOffset),x.call(this,"fill",!0),this.path=D}var R=JSON.parse(JSON.stringify(S));R=N([R],this.posX+this.margin[3],-E+O+this.ctx.prevPageLastElemOffset)[0];var T=(C>F||C<I)&&b.call(this);T&&(this.pdf.saveGraphicsState(),this.pdf.rect(this.margin[3],this.margin[0],j,M,null).clip().discardPath()),this.pdf.addImage(t,"JPEG",R.x,R.y,R.w,R.h,null,null,w),T&&this.pdf.restoreGraphicsState()}else this.pdf.addImage(t,"JPEG",S.x,S.y,S.w,S.h,null,null,w)};var y=function(t,e,r){var n=[];e=e||this.pdf.internal.pageSize.width,r=r||this.pdf.internal.pageSize.height-this.margin[0]-this.margin[2];var i=this.posY+this.ctx.prevPageLastElemOffset;switch(t.type){default:case"mt":case"lt":n.push(Math.floor((t.y+i)/r)+1);break;case"arc":n.push(Math.floor((t.y+i-t.radius)/r)+1),n.push(Math.floor((t.y+i+t.radius)/r)+1);break;case"qct":var a=D(this.ctx.lastPoint.x,this.ctx.lastPoint.y,t.x1,t.y1,t.x,t.y);n.push(Math.floor((a.y+i)/r)+1),n.push(Math.floor((a.y+a.h+i)/r)+1);break;case"bct":var o=R(this.ctx.lastPoint.x,this.ctx.lastPoint.y,t.x1,t.y1,t.x2,t.y2,t.x,t.y);n.push(Math.floor((o.y+i)/r)+1),n.push(Math.floor((o.y+o.h+i)/r)+1);break;case"rect":n.push(Math.floor((t.y+i)/r)+1),n.push(Math.floor((t.y+t.h+i)/r)+1)}for(var s=0;s<n.length;s+=1)for(;this.pdf.internal.getNumberOfPages()<n[s];)w.call(this);return n},w=function(){var t=this.fillStyle,e=this.strokeStyle,r=this.font,n=this.lineCap,i=this.lineWidth,a=this.lineJoin;this.pdf.addPage(),this.fillStyle=t,this.strokeStyle=e,this.font=r,this.lineCap=n,this.lineWidth=i,this.lineJoin=a},N=function(t,e,r){for(var n=0;n<t.length;n++)switch(t[n].type){case"bct":t[n].x2+=e,t[n].y2+=r;case"qct":t[n].x1+=e,t[n].y1+=r;case"mt":case"lt":case"arc":default:t[n].x+=e,t[n].y+=r}return t},L=function(t){return t.sort((function(t,e){return t-e}))},A=function(t,e){for(var r,n,i=this.fillStyle,a=this.strokeStyle,o=this.lineCap,s=this.lineWidth,c=Math.abs(s*this.ctx.transform.scaleX),u=this.lineJoin,l=JSON.parse(JSON.stringify(this.path)),h=JSON.parse(JSON.stringify(this.path)),f=[],d=0;d<h.length;d++)if(void 0!==h[d].x)for(var p=y.call(this,h[d]),g=0;g<p.length;g+=1)-1===f.indexOf(p[g])&&f.push(p[g]);for(var m=0;m<f.length;m++)for(;this.pdf.internal.getNumberOfPages()<f[m];)w.call(this);if(L(f),this.autoPaging)for(var v=f[0],A=f[f.length-1],S=v;S<A+1;S++){this.pdf.setPage(S),this.fillStyle=i,this.strokeStyle=a,this.lineCap=o,this.lineWidth=c,this.lineJoin=u;var _=this.pdf.internal.pageSize.width-this.margin[3]-this.margin[1],P=1===S?this.posY+this.margin[0]:this.margin[0],k=this.pdf.internal.pageSize.height-this.posY-this.margin[0]-this.margin[2],F=this.pdf.internal.pageSize.height-this.margin[0]-this.margin[2],I=1===S?0:k+(S-2)*F;if(0!==this.ctx.clip_path.length){var C=this.path;r=JSON.parse(JSON.stringify(this.ctx.clip_path)),this.path=N(r,this.posX+this.margin[3],-I+P+this.ctx.prevPageLastElemOffset),x.call(this,t,!0),this.path=C}if(n=JSON.parse(JSON.stringify(l)),this.path=N(n,this.posX+this.margin[3],-I+P+this.ctx.prevPageLastElemOffset),!1===e||0===S){var j=(S>v||S<A)&&b.call(this);j&&(this.pdf.saveGraphicsState(),this.pdf.rect(this.margin[3],this.margin[0],_,F,null).clip().discardPath()),x.call(this,t,e),j&&this.pdf.restoreGraphicsState()}this.lineWidth=s}else this.lineWidth=c,x.call(this,t,e),this.lineWidth=s;this.path=l},x=function(t,e){if(("stroke"!==t||e||!v.call(this))&&("stroke"===t||e||!m.call(this))){for(var r,n,i=[],a=this.path,o=0;o<a.length;o++){var s=a[o];switch(s.type){case"begin":i.push({begin:!0});break;case"close":i.push({close:!0});break;case"mt":i.push({start:s,deltas:[],abs:[]});break;case"lt":var c=i.length;if(a[o-1]&&!isNaN(a[o-1].x)&&(r=[s.x-a[o-1].x,s.y-a[o-1].y],c>0))for(;c>=0;c--)if(!0!==i[c-1].close&&!0!==i[c-1].begin){i[c-1].deltas.push(r),i[c-1].abs.push(s);break}break;case"bct":r=[s.x1-a[o-1].x,s.y1-a[o-1].y,s.x2-a[o-1].x,s.y2-a[o-1].y,s.x-a[o-1].x,s.y-a[o-1].y],i[i.length-1].deltas.push(r);break;case"qct":var u=a[o-1].x+2/3*(s.x1-a[o-1].x),l=a[o-1].y+2/3*(s.y1-a[o-1].y),h=s.x+2/3*(s.x1-s.x),f=s.y+2/3*(s.y1-s.y),d=s.x,p=s.y;r=[u-a[o-1].x,l-a[o-1].y,h-a[o-1].x,f-a[o-1].y,d-a[o-1].x,p-a[o-1].y],i[i.length-1].deltas.push(r);break;case"arc":i.push({deltas:[],abs:[],arc:!0}),Array.isArray(i[i.length-1].abs)&&i[i.length-1].abs.push(s)}}n=e?null:"stroke"===t?"stroke":"fill";for(var g=!1,b=0;b<i.length;b++)if(i[b].arc)for(var y=i[b].abs,w=0;w<y.length;w++){var N=y[w];"arc"===N.type?P.call(this,N.x,N.y,N.radius,N.startAngle,N.endAngle,N.counterclockwise,void 0,e,!g):j.call(this,N.x,N.y),g=!0}else if(!0===i[b].close)this.pdf.internal.out("h"),g=!1;else if(!0!==i[b].begin){var L=i[b].start.x,A=i[b].start.y;O.call(this,i[b].deltas,L,A),g=!0}n&&k.call(this,n),e&&F.call(this)}},S=function(t){var e=this.pdf.internal.getFontSize()/this.pdf.internal.scaleFactor,r=e*(this.pdf.internal.getLineHeightFactor()-1);switch(this.ctx.textBaseline){case"bottom":return t-r;case"top":return t+e-r;case"hanging":return t+e-2*r;case"middle":return t+e/2-r;case"ideographic":return t;case"alphabetic":default:return t}},_=function(t){return t+this.pdf.internal.getFontSize()/this.pdf.internal.scaleFactor*(this.pdf.internal.getLineHeightFactor()-1)};p.prototype.createLinearGradient=function(){var t=function(){};return t.colorStops=[],t.addColorStop=function(t,e){this.colorStops.push([t,e])},t.getColor=function(){return 0===this.colorStops.length?"#000000":this.colorStops[0][1]},t.isCanvasGradient=!0,t},p.prototype.createPattern=function(){return this.createLinearGradient()},p.prototype.createRadialGradient=function(){return this.createLinearGradient()};var P=function(t,e,r,n,i,a,o,s,c){for(var u=M.call(this,r,n,i,a),l=0;l<u.length;l++){var h=u[l];0===l&&(c?I.call(this,h.x1+t,h.y1+e):j.call(this,h.x1+t,h.y1+e)),B.call(this,t,e,h.x2,h.y2,h.x3,h.y3,h.x4,h.y4)}s?F.call(this):k.call(this,o)},k=function(t){switch(t){case"stroke":this.pdf.internal.out("S");break;case"fill":this.pdf.internal.out("f")}},F=function(){this.pdf.clip(),this.pdf.discardPath()},I=function(t,e){this.pdf.internal.out(n(t)+" "+a(e)+" m")},C=function(t){var e;switch(t.align){case"right":case"end":e="right";break;case"center":e="center";break;case"left":case"start":default:e="left"}var r=this.pdf.getTextDimensions(t.text),n=S.call(this,t.y),i=_.call(this,n)-r.h,a=this.ctx.transform.applyToPoint(new c(t.x,n)),o=this.ctx.transform.decompose(),s=new l;s=(s=(s=s.multiply(o.translate)).multiply(o.skew)).multiply(o.scale);for(var h,f,d,p=this.ctx.transform.applyToRectangle(new u(t.x,n,r.w,r.h)),g=s.applyToRectangle(new u(t.x,i,r.w,r.h)),m=y.call(this,g),v=[],w=0;w<m.length;w+=1)-1===v.indexOf(m[w])&&v.push(m[w]);if(L(v),this.autoPaging)for(var A=v[0],P=v[v.length-1],k=A;k<P+1;k++){this.pdf.setPage(k);var F=1===k?this.posY+this.margin[0]:this.margin[0],I=this.pdf.internal.pageSize.height-this.posY-this.margin[0]-this.margin[2],C=this.pdf.internal.pageSize.height-this.margin[2],j=C-this.margin[0],O=this.pdf.internal.pageSize.width-this.margin[1],B=O-this.margin[3],M=1===k?0:I+(k-2)*j;if(0!==this.ctx.clip_path.length){var E=this.path;h=JSON.parse(JSON.stringify(this.ctx.clip_path)),this.path=N(h,this.posX+this.margin[3],-1*M+F),x.call(this,"fill",!0),this.path=E}var q=N([JSON.parse(JSON.stringify(g))],this.posX+this.margin[3],-M+F+this.ctx.prevPageLastElemOffset)[0];t.scale>=.01&&(f=this.pdf.internal.getFontSize(),this.pdf.setFontSize(f*t.scale),d=this.lineWidth,this.lineWidth=d*t.scale);var D="text"!==this.autoPaging;if(D||q.y+q.h<=C){if(D||q.y>=F&&q.x<=O){var R=D?t.text:this.pdf.splitTextToSize(t.text,t.maxWidth||O-q.x)[0],T=N([JSON.parse(JSON.stringify(p))],this.posX+this.margin[3],-M+F+this.ctx.prevPageLastElemOffset)[0],U=D&&(k>A||k<P)&&b.call(this);U&&(this.pdf.saveGraphicsState(),this.pdf.rect(this.margin[3],this.margin[0],B,j,null).clip().discardPath()),this.pdf.text(R,T.x,T.y,{angle:t.angle,align:e,renderingMode:t.renderingMode}),U&&this.pdf.restoreGraphicsState()}}else q.y<C&&(this.ctx.prevPageLastElemOffset+=C-q.y);t.scale>=.01&&(this.pdf.setFontSize(f),this.lineWidth=d)}else t.scale>=.01&&(f=this.pdf.internal.getFontSize(),this.pdf.setFontSize(f*t.scale),d=this.lineWidth,this.lineWidth=d*t.scale),this.pdf.text(t.text,a.x+this.posX,a.y+this.posY,{angle:t.angle,align:e,renderingMode:t.renderingMode,maxWidth:t.maxWidth}),t.scale>=.01&&(this.pdf.setFontSize(f),this.lineWidth=d)},j=function(t,e,r,i){r=r||0,i=i||0,this.pdf.internal.out(n(t+r)+" "+a(e+i)+" l")},O=function(t,e,r){return this.pdf.lines(t,e,r,null,null)},B=function(t,e,n,i,a,c,u,l){this.pdf.internal.out([r(o(n+t)),r(s(i+e)),r(o(a+t)),r(s(c+e)),r(o(u+t)),r(s(l+e)),"c"].join(" "))},M=function(t,e,r,n){for(var i=2*Math.PI,a=Math.PI/2;e>r;)e-=i;var o=Math.abs(r-e);o<i&&n&&(o=i-o);for(var s=[],c=n?-1:1,u=e;o>1e-5;){var l=u+c*Math.min(o,a);s.push(E.call(this,t,u,l)),o-=Math.abs(l-u),u=l}return s},E=function(t,e,r){var n=(r-e)/2,i=t*Math.cos(n),a=t*Math.sin(n),o=i,s=-a,c=o*o+s*s,u=c+o*i+s*a,l=4/3*(Math.sqrt(2*c*u)-u)/(o*a-s*i),h=o-l*s,f=s+l*o,d=h,p=-f,g=n+e,m=Math.cos(g),v=Math.sin(g);return{x1:t*Math.cos(e),y1:t*Math.sin(e),x2:h*m-f*v,y2:h*v+f*m,x3:d*m-p*v,y3:d*v+p*m,x4:t*Math.cos(r),y4:t*Math.sin(r)}},q=function(t){return 180*t/Math.PI},D=function(t,e,r,n,i,a){var o=t+.5*(r-t),s=e+.5*(n-e),c=i+.5*(r-i),l=a+.5*(n-a),h=Math.min(t,i,o,c),f=Math.max(t,i,o,c),d=Math.min(e,a,s,l),p=Math.max(e,a,s,l);return new u(h,d,f-h,p-d)},R=function(t,e,r,n,i,a,o,s){var c,l,h,f,d,p,g,m,v,b,y,w,N,L,A=r-t,x=n-e,S=i-r,_=a-n,P=o-i,k=s-a;for(l=0;l<41;l++)v=(g=(h=t+(c=l/40)*A)+c*((d=r+c*S)-h))+c*(d+c*(i+c*P-d)-g),b=(m=(f=e+c*x)+c*((p=n+c*_)-f))+c*(p+c*(a+c*k-p)-m),0==l?(y=v,w=b,N=v,L=b):(y=Math.min(y,v),w=Math.min(w,b),N=Math.max(N,v),L=Math.max(L,b));return new u(Math.round(y),Math.round(w),Math.round(N-y),Math.round(L-w))},T=function(){if(this.prevLineDash||this.ctx.lineDash.length||this.ctx.lineDashOffset){var t,e,r=(t=this.ctx.lineDash,e=this.ctx.lineDashOffset,JSON.stringify({lineDash:t,lineDashOffset:e}));this.prevLineDash!==r&&(this.pdf.setLineDash(this.ctx.lineDash,this.ctx.lineDashOffset),this.prevLineDash=r)}}}(M.API);try{require("worker_threads").Worker}catch(t){}var Ut=Uint8Array,zt=Uint16Array,Ht=Uint32Array,Wt=new Ut([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Vt=new Ut([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Gt=new Ut([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Yt=function(t,e){for(var r=new zt(31),n=0;n<31;++n)r[n]=e+=1<<t[n-1];var i=new Ht(r[30]);for(n=1;n<30;++n)for(var a=r[n];a<r[n+1];++a)i[a]=a-r[n]<<5|n;return[r,i]},Jt=Yt(Wt,2),Xt=Jt[0],Kt=Jt[1];Xt[28]=258,Kt[258]=28;for(var Zt=Yt(Vt,0),$t=Zt[0],Qt=Zt[1],te=new zt(32768),ee=0;ee<32768;++ee){var re=(43690&ee)>>>1|(21845&ee)<<1;re=(61680&(re=(52428&re)>>>2|(13107&re)<<2))>>>4|(3855&re)<<4,te[ee]=((65280&re)>>>8|(255&re)<<8)>>>1}var ne=function(t,e,r){for(var n=t.length,i=0,a=new zt(e);i<n;++i)++a[t[i]-1];var o,s=new zt(e);for(i=0;i<e;++i)s[i]=s[i-1]+a[i-1]<<1;if(r){o=new zt(1<<e);var c=15-e;for(i=0;i<n;++i)if(t[i])for(var u=i<<4|t[i],l=e-t[i],h=s[t[i]-1]++<<l,f=h|(1<<l)-1;h<=f;++h)o[te[h]>>>c]=u}else for(o=new zt(n),i=0;i<n;++i)o[i]=te[s[t[i]-1]++]>>>15-t[i];return o},ie=new Ut(288);for(ee=0;ee<144;++ee)ie[ee]=8;for(ee=144;ee<256;++ee)ie[ee]=9;for(ee=256;ee<280;++ee)ie[ee]=7;for(ee=280;ee<288;++ee)ie[ee]=8;var ae=new Ut(32);for(ee=0;ee<32;++ee)ae[ee]=5;var oe=ne(ie,9,0),se=ne(ie,9,1),ce=ne(ae,5,0),ue=ne(ae,5,1),le=function(t){for(var e=t[0],r=1;r<t.length;++r)t[r]>e&&(e=t[r]);return e},he=function(t,e,r){var n=e/8>>0;return(t[n]|t[n+1]<<8)>>>(7&e)&r},fe=function(t,e){var r=e/8>>0;return(t[r]|t[r+1]<<8|t[r+2]<<16)>>>(7&e)},de=function(t){return(t/8>>0)+(7&t&&1)},pe=function(t,e,r){(null==e||e<0)&&(e=0),(null==r||r>t.length)&&(r=t.length);var n=new(t instanceof zt?zt:t instanceof Ht?Ht:Ut)(r-e);return n.set(t.subarray(e,r)),n},ge=function(t,e,r){r<<=7&e;var n=e/8>>0;t[n]|=r,t[n+1]|=r>>>8},me=function(t,e,r){r<<=7&e;var n=e/8>>0;t[n]|=r,t[n+1]|=r>>>8,t[n+2]|=r>>>16},ve=function(t,e){for(var r=[],n=0;n<t.length;++n)t[n]&&r.push({s:n,f:t[n]});var i=r.length,a=r.slice();if(!i)return[new Ut(0),0];if(1==i){var o=new Ut(r[0].s+1);return o[r[0].s]=1,[o,1]}r.sort((function(t,e){return t.f-e.f})),r.push({s:-1,f:25001});var s=r[0],c=r[1],u=0,l=1,h=2;for(r[0]={s:-1,f:s.f+c.f,l:s,r:c};l!=i-1;)s=r[r[u].f<r[h].f?u++:h++],c=r[u!=l&&r[u].f<r[h].f?u++:h++],r[l++]={s:-1,f:s.f+c.f,l:s,r:c};var f=a[0].s;for(n=1;n<i;++n)a[n].s>f&&(f=a[n].s);var d=new zt(f+1),p=be(r[l-1],d,0);if(p>e){n=0;var g=0,m=p-e,v=1<<m;for(a.sort((function(t,e){return d[e.s]-d[t.s]||t.f-e.f}));n<i;++n){var b=a[n].s;if(!(d[b]>e))break;g+=v-(1<<p-d[b]),d[b]=e}for(g>>>=m;g>0;){var y=a[n].s;d[y]<e?g-=1<<e-d[y]++-1:++n}for(;n>=0&&g;--n){var w=a[n].s;d[w]==e&&(--d[w],++g)}p=e}return[new Ut(d),p]},be=function(t,e,r){return-1==t.s?Math.max(be(t.l,e,r+1),be(t.r,e,r+1)):e[t.s]=r},ye=function(t){for(var e=t.length;e&&!t[--e];);for(var r=new zt(++e),n=0,i=t[0],a=1,o=function(t){r[n++]=t},s=1;s<=e;++s)if(t[s]==i&&s!=e)++a;else{if(!i&&a>2){for(;a>138;a-=138)o(32754);a>2&&(o(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(o(i),--a;a>6;a-=6)o(8304);a>2&&(o(a-3<<5|8208),a=0)}for(;a--;)o(i);a=1,i=t[s]}return[r.subarray(0,n),e]},we=function(t,e){for(var r=0,n=0;n<e.length;++n)r+=t[n]*e[n];return r},Ne=function(t,e,r){var n=r.length,i=de(e+2);t[i]=255&n,t[i+1]=n>>>8,t[i+2]=255^t[i],t[i+3]=255^t[i+1];for(var a=0;a<n;++a)t[i+a+4]=r[a];return 8*(i+4+n)},Le=function(t,e,r,n,i,a,o,s,c,u,l){ge(e,l++,r),++i[256];for(var h=ve(i,15),f=h[0],d=h[1],p=ve(a,15),g=p[0],m=p[1],v=ye(f),b=v[0],y=v[1],w=ye(g),N=w[0],L=w[1],A=new zt(19),x=0;x<b.length;++x)A[31&b[x]]++;for(x=0;x<N.length;++x)A[31&N[x]]++;for(var S=ve(A,7),_=S[0],P=S[1],k=19;k>4&&!_[Gt[k-1]];--k);var F,I,C,j,O=u+5<<3,B=we(i,ie)+we(a,ae)+o,M=we(i,f)+we(a,g)+o+14+3*k+we(A,_)+(2*A[16]+3*A[17]+7*A[18]);if(O<=B&&O<=M)return Ne(e,l,t.subarray(c,c+u));if(ge(e,l,1+(M<B)),l+=2,M<B){F=ne(f,d,0),I=f,C=ne(g,m,0),j=g;var E=ne(_,P,0);ge(e,l,y-257),ge(e,l+5,L-1),ge(e,l+10,k-4),l+=14;for(x=0;x<k;++x)ge(e,l+3*x,_[Gt[x]]);l+=3*k;for(var q=[b,N],D=0;D<2;++D){var R=q[D];for(x=0;x<R.length;++x){var T=31&R[x];ge(e,l,E[T]),l+=_[T],T>15&&(ge(e,l,R[x]>>>5&127),l+=R[x]>>>12)}}}else F=oe,I=ie,C=ce,j=ae;for(x=0;x<s;++x)if(n[x]>255){T=n[x]>>>18&31;me(e,l,F[T+257]),l+=I[T+257],T>7&&(ge(e,l,n[x]>>>23&31),l+=Wt[T]);var U=31&n[x];me(e,l,C[U]),l+=j[U],U>3&&(me(e,l,n[x]>>>5&8191),l+=Vt[U])}else me(e,l,F[n[x]]),l+=I[n[x]];return me(e,l,F[256]),l+I[256]},Ae=new Ht([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),xe=new Ut(0),Se=function(t,e,r,n,i){return function(t,e,r,n,i,a){var o=t.length,s=new Ut(n+o+5*(1+Math.floor(o/7e3))+i),c=s.subarray(n,s.length-i),u=0;if(!e||o<8)for(var l=0;l<=o;l+=65535){var h=l+65535;h<o?u=Ne(c,u,t.subarray(l,h)):(c[l]=a,u=Ne(c,u,t.subarray(l,o)))}else{for(var f=Ae[e-1],d=f>>>13,p=8191&f,g=(1<<r)-1,m=new zt(32768),v=new zt(g+1),b=Math.ceil(r/3),y=2*b,w=function(e){return(t[e]^t[e+1]<<b^t[e+2]<<y)&g},N=new Ht(25e3),L=new zt(288),A=new zt(32),x=0,S=0,_=(l=0,0),P=0,k=0;l<o;++l){var F=w(l),I=32767&l,C=v[F];if(m[I]=C,v[F]=I,P<=l){var j=o-l;if((x>7e3||_>24576)&&j>423){u=Le(t,c,0,N,L,A,S,_,k,l-k,u),_=x=S=0,k=l;for(var O=0;O<286;++O)L[O]=0;for(O=0;O<30;++O)A[O]=0}var B=2,M=0,E=p,q=I-C&32767;if(j>2&&F==w(l-q))for(var D=Math.min(d,j)-1,R=Math.min(32767,l),T=Math.min(258,j);q<=R&&--E&&I!=C;){if(t[l+B]==t[l+B-q]){for(var U=0;U<T&&t[l+U]==t[l+U-q];++U);if(U>B){if(B=U,M=q,U>D)break;var z=Math.min(q,U-2),H=0;for(O=0;O<z;++O){var W=l-q+O+32768&32767,V=W-m[W]+32768&32767;V>H&&(H=V,C=W)}}}q+=(I=C)-(C=m[I])+32768&32767}if(M){N[_++]=268435456|Kt[B]<<18|Qt[M];var G=31&Kt[B],Y=31&Qt[M];S+=Wt[G]+Vt[Y],++L[257+G],++A[Y],P=l+B,++x}else N[_++]=t[l],++L[t[l]]}}u=Le(t,c,a,N,L,A,S,_,k,l-k,u),a||(u=Ne(c,u,xe))}return pe(s,0,n+de(u)+i)}(t,null==e.level?6:e.level,null==e.mem?Math.ceil(1.5*Math.max(8,Math.min(13,Math.log(t.length)))):12+e.mem,r,n,!i)};function _e(t,e){void 0===e&&(e={});var r=function(){var t=1,e=0;return{p:function(r){for(var n=t,i=e,a=r.length,o=0;o!=a;){for(var s=Math.min(o+5552,a);o<s;++o)i+=n+=r[o];n%=65521,i%=65521}t=n,e=i},d:function(){return(t>>>8<<16|(255&e)<<8|e>>>8)+2*((255&t)<<23)}}}();r.p(t);var n=Se(t,e,2,4);return function(t,e){var r=e.level,n=0==r?0:r<6?1:9==r?3:2;t[0]=120,t[1]=n<<6|(n?32-2*n:1)}(n,e),function(t,e,r){for(;r;++e)t[e]=r,r>>>=8}(n,n.length-4,r.d()),n}function Pe(t,e){return function(t,e,r){var n=t.length,i=!e||r,a=!r||r.i;r||(r={}),e||(e=new Ut(3*n));var o=function(t){var r=e.length;if(t>r){var n=new Ut(Math.max(2*r,t));n.set(e),e=n}},s=r.f||0,c=r.p||0,u=r.b||0,l=r.l,h=r.d,f=r.m,d=r.n,p=8*n;do{if(!l){r.f=s=he(t,c,1);var g=he(t,c+1,3);if(c+=3,!g){var m=t[(P=de(c)+4)-4]|t[P-3]<<8,v=P+m;if(v>n){if(a)throw"unexpected EOF";break}i&&o(u+m),e.set(t.subarray(P,v),u),r.b=u+=m,r.p=c=8*v;continue}if(1==g)l=se,h=ue,f=9,d=5;else{if(2!=g)throw"invalid block type";var b=he(t,c,31)+257,y=he(t,c+10,15)+4,w=b+he(t,c+5,31)+1;c+=14;for(var N=new Ut(w),L=new Ut(19),A=0;A<y;++A)L[Gt[A]]=he(t,c+3*A,7);c+=3*y;var x=le(L),S=(1<<x)-1;if(!a&&c+w*(x+7)>p)break;var _=ne(L,x,1);for(A=0;A<w;){var P,k=_[he(t,c,S)];if(c+=15&k,(P=k>>>4)<16)N[A++]=P;else{var F=0,I=0;for(16==P?(I=3+he(t,c,3),c+=2,F=N[A-1]):17==P?(I=3+he(t,c,7),c+=3):18==P&&(I=11+he(t,c,127),c+=7);I--;)N[A++]=F}}var C=N.subarray(0,b),j=N.subarray(b);f=le(C),d=le(j),l=ne(C,f,1),h=ne(j,d,1)}if(c>p)throw"unexpected EOF"}i&&o(u+131072);for(var O=(1<<f)-1,B=(1<<d)-1,M=f+d+18;a||c+M<p;){var E=(F=l[fe(t,c)&O])>>>4;if((c+=15&F)>p)throw"unexpected EOF";if(!F)throw"invalid length/literal";if(E<256)e[u++]=E;else{if(256==E){l=null;break}var q=E-254;if(E>264){var D=Wt[A=E-257];q=he(t,c,(1<<D)-1)+Xt[A],c+=D}var R=h[fe(t,c)&B],T=R>>>4;if(!R)throw"invalid distance";c+=15&R;j=$t[T];if(T>3){D=Vt[T];j+=fe(t,c)&(1<<D)-1,c+=D}if(c>p)throw"unexpected EOF";i&&o(u+131072);for(var U=u+q;u<U;u+=4)e[u]=e[u-j],e[u+1]=e[u+1-j],e[u+2]=e[u+2-j],e[u+3]=e[u+3-j];u=U}}r.l=l,r.p=c,r.b=u,l&&(s=1,r.m=f,r.d=h,r.n=d)}while(!s);return u==e.length?e:pe(e,0,u)}((function(t){if(8!=(15&t[0])||t[0]>>>4>7||(t[0]<<8|t[1])%31)throw"invalid zlib data";if(32&t[1])throw"invalid zlib data: preset dictionaries not supported"}(t),t.subarray(2,-4)),e)}
/**
   * @license
   * jsPDF filters PlugIn
   * Copyright (c) 2014 Aras Abbasi
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */!function(t){var e=function(t){var e,r,n,i,a,o,s,c,u,l;for(/[^\x00-\xFF]/.test(t),r=[],n=0,i=(t+=e="\0\0\0\0".slice(t.length%4||4)).length;i>n;n+=4)0!==(a=(t.charCodeAt(n)<<24)+(t.charCodeAt(n+1)<<16)+(t.charCodeAt(n+2)<<8)+t.charCodeAt(n+3))?(o=(a=((a=((a=((a=(a-(l=a%85))/85)-(u=a%85))/85)-(c=a%85))/85)-(s=a%85))/85)%85,r.push(o+33,s+33,c+33,u+33,l+33)):r.push(122);return function(t,e){for(var r=e;r>0;r--)t.pop()}(r,e.length),String.fromCharCode.apply(String,r)+"~>"},r=function(t){var e,r,n,i,a,o=String,s="length",c=255,u="charCodeAt",l="slice",h="replace";for(t[l](-2),t=t[l](0,-2)[h](/\s/g,"")[h]("z","!!!!!"),n=[],i=0,a=(t+=e="uuuuu"[l](t[s]%5||5))[s];a>i;i+=5)r=52200625*(t[u](i)-33)+614125*(t[u](i+1)-33)+7225*(t[u](i+2)-33)+85*(t[u](i+3)-33)+(t[u](i+4)-33),n.push(c&r>>24,c&r>>16,c&r>>8,c&r);return function(t,e){for(var r=e;r>0;r--)t.pop()}(n,e[s]),o.fromCharCode.apply(o,n)},n=function(t){var e=new RegExp(/^([0-9A-Fa-f]{2})+$/);if(-1!==(t=t.replace(/\s/g,"")).indexOf(">")&&(t=t.substr(0,t.indexOf(">"))),t.length%2&&(t+="0"),!1===e.test(t))return"";for(var r="",n=0;n<t.length;n+=2)r+=String.fromCharCode("0x"+(t[n]+t[n+1]));return r},i=function(t){for(var e=new Uint8Array(t.length),r=t.length;r--;)e[r]=t.charCodeAt(r);return t=(e=_e(e)).reduce((function(t,e){return t+String.fromCharCode(e)}),"")};t.processDataByFilters=function(t,a){var o=0,s=t||"",c=[];for("string"==typeof(a=a||[])&&(a=[a]),o=0;o<a.length;o+=1)switch(a[o]){case"ASCII85Decode":case"/ASCII85Decode":s=r(s),c.push("/ASCII85Encode");break;case"ASCII85Encode":case"/ASCII85Encode":s=e(s),c.push("/ASCII85Decode");break;case"ASCIIHexDecode":case"/ASCIIHexDecode":s=n(s),c.push("/ASCIIHexEncode");break;case"ASCIIHexEncode":case"/ASCIIHexEncode":s=s.split("").map((function(t){return("0"+t.charCodeAt().toString(16)).slice(-2)})).join("")+">",c.push("/ASCIIHexDecode");break;case"FlateEncode":case"/FlateEncode":s=i(s),c.push("/FlateDecode");break;default:throw new Error('The filter: "'+a[o]+'" is not implemented')}return{data:s,reverseChain:c.reverse().join(" ")}}}(M.API),
/**
   * @license
   * jsPDF fileloading PlugIn
   * Copyright (c) 2018 Aras Abbasi (aras.abbasi@gmail.com)
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
function(t){t.loadFile=function(t,e,r){return function(t,e,r){e=!1!==e,r="function"==typeof r?r:function(){};var n=void 0;try{n=function(t,e,r){var n=new XMLHttpRequest,i=0,a=function(t){var e=t.length,r=[],n=String.fromCharCode;for(i=0;i<e;i+=1)r.push(n(255&t.charCodeAt(i)));return r.join("")};if(n.open("GET",t,!e),n.overrideMimeType("text/plain; charset=x-user-defined"),!1===e&&(n.onload=function(){200===n.status?r(a(this.responseText)):r(void 0)}),n.send(null),e&&200===n.status)return a(n.responseText)}(t,e,r)}catch(t){}return n}(t,e,r)},t.loadImageFile=t.loadFile}(M.API),function(n){function i(){return(r.html2canvas?Promise.resolve(r.html2canvas):"object"===(void 0===t?"undefined":e(t))&&"undefined"!=typeof module?new Promise((function(t,e){try{t(require("html2canvas"))}catch(t){e(t)}})):"function"==typeof define&&define.amd?new Promise((function(t,e){try{require(["html2canvas"],t)}catch(t){e(t)}})):Promise.reject(new Error("Could not load html2canvas"))).catch((function(t){return Promise.reject(new Error("Could not load html2canvas: "+t))})).then((function(t){return t.default?t.default:t}))}function a(){return(r.DOMPurify?Promise.resolve(r.DOMPurify):"object"===(void 0===t?"undefined":e(t))&&"undefined"!=typeof module?new Promise((function(t,e){try{t(require("dompurify"))}catch(t){e(t)}})):"function"==typeof define&&define.amd?new Promise((function(t,e){try{require(["dompurify"],t)}catch(t){e(t)}})):Promise.reject(new Error("Could not load dompurify"))).catch((function(t){return Promise.reject(new Error("Could not load dompurify: "+t))})).then((function(t){return t.default?t.default:t}))}var o=function(t){var r=e(t);return"undefined"===r?"undefined":"string"===r||t instanceof String?"string":"number"===r||t instanceof Number?"number":"function"===r||t instanceof Function?"function":t&&t.constructor===Array?"array":t&&1===t.nodeType?"element":"object"===r?"object":"unknown"},s=function(t,e){var r=document.createElement(t);for(var n in e.className&&(r.className=e.className),e.innerHTML&&e.dompurify&&(r.innerHTML=e.dompurify.sanitize(e.innerHTML)),e.style)r.style[n]=e.style[n];return r},c=function t(e){var r=Object.assign(t.convert(Promise.resolve()),JSON.parse(JSON.stringify(t.template))),n=t.convert(Promise.resolve(),r);return n=(n=n.setProgress(1,t,1,[t])).set(e)};(c.prototype=Object.create(Promise.prototype)).constructor=c,c.convert=function(t,e){return t.__proto__=e||c.prototype,t},c.template={prop:{src:null,container:null,overlay:null,canvas:null,img:null,pdf:null,pageSize:null,callback:function(){}},progress:{val:0,state:null,n:0,stack:[]},opt:{filename:"file.pdf",margin:[0,0,0,0],enableLinks:!0,x:0,y:0,html2canvas:{},jsPDF:{},backgroundColor:"transparent"}},c.prototype.from=function(t,e){return this.then((function(){switch(e=e||function(t){switch(o(t)){case"string":return"string";case"element":return"canvas"===t.nodeName.toLowerCase()?"canvas":"element";default:return"unknown"}}(t)){case"string":return this.then(a).then((function(e){return this.set({src:s("div",{innerHTML:t,dompurify:e})})}));case"element":return this.set({src:t});case"canvas":return this.set({canvas:t});case"img":return this.set({img:t});default:return this.error("Unknown source type.")}}))},c.prototype.to=function(t){switch(t){case"container":return this.toContainer();case"canvas":return this.toCanvas();case"img":return this.toImg();case"pdf":return this.toPdf();default:return this.error("Invalid target.")}},c.prototype.toContainer=function(){return this.thenList([function(){return this.prop.src||this.error("Cannot duplicate - no source HTML.")},function(){return this.prop.pageSize||this.setPageSize()}]).then((function(){var t={position:"relative",display:"inline-block",width:("number"!=typeof this.opt.width||isNaN(this.opt.width)||"number"!=typeof this.opt.windowWidth||isNaN(this.opt.windowWidth)?Math.max(this.prop.src.clientWidth,this.prop.src.scrollWidth,this.prop.src.offsetWidth):this.opt.windowWidth)+"px",left:0,right:0,top:0,margin:"auto",backgroundColor:this.opt.backgroundColor},e=function t(e,r){for(var n=3===e.nodeType?document.createTextNode(e.nodeValue):e.cloneNode(!1),i=e.firstChild;i;i=i.nextSibling)!0!==r&&1===i.nodeType&&"SCRIPT"===i.nodeName||n.appendChild(t(i,r));return 1===e.nodeType&&("CANVAS"===e.nodeName?(n.width=e.width,n.height=e.height,n.getContext("2d").drawImage(e,0,0)):"TEXTAREA"!==e.nodeName&&"SELECT"!==e.nodeName||(n.value=e.value),n.addEventListener("load",(function(){n.scrollTop=e.scrollTop,n.scrollLeft=e.scrollLeft}),!0)),n}(this.prop.src,this.opt.html2canvas.javascriptEnabled);"BODY"===e.tagName&&(t.height=Math.max(document.body.scrollHeight,document.body.offsetHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight,document.documentElement.offsetHeight)+"px"),this.prop.overlay=s("div",{className:"html2pdf__overlay",style:{position:"fixed",overflow:"hidden",zIndex:1e3,left:"-100000px",right:0,bottom:0,top:0}}),this.prop.container=s("div",{className:"html2pdf__container",style:t}),this.prop.container.appendChild(e),this.prop.container.firstChild.appendChild(s("div",{style:{clear:"both",border:"0 none transparent",margin:0,padding:0,height:0}})),this.prop.container.style.float="none",this.prop.overlay.appendChild(this.prop.container),document.body.appendChild(this.prop.overlay),this.prop.container.firstChild.style.position="relative",this.prop.container.height=Math.max(this.prop.container.firstChild.clientHeight,this.prop.container.firstChild.scrollHeight,this.prop.container.firstChild.offsetHeight)+"px"}))},c.prototype.toCanvas=function(){var t=[function(){return document.body.contains(this.prop.container)||this.toContainer()}];return this.thenList(t).then(i).then((function(t){var e=Object.assign({},this.opt.html2canvas);return delete e.onrendered,t(this.prop.container,e)})).then((function(t){(this.opt.html2canvas.onrendered||function(){})(t),this.prop.canvas=t,document.body.removeChild(this.prop.overlay)}))},c.prototype.toContext2d=function(){var t=[function(){return document.body.contains(this.prop.container)||this.toContainer()}];return this.thenList(t).then(i).then((function(t){var e=this.opt.jsPDF,r=this.opt.fontFaces,n="number"!=typeof this.opt.width||isNaN(this.opt.width)||"number"!=typeof this.opt.windowWidth||isNaN(this.opt.windowWidth)?1:this.opt.width/this.opt.windowWidth,i=Object.assign({async:!0,allowTaint:!0,scale:n,scrollX:this.opt.scrollX||0,scrollY:this.opt.scrollY||0,backgroundColor:"#ffffff",imageTimeout:15e3,logging:!0,proxy:null,removeContainer:!0,foreignObjectRendering:!1,useCORS:!1},this.opt.html2canvas);if(delete i.onrendered,e.context2d.autoPaging=void 0===this.opt.autoPaging||this.opt.autoPaging,e.context2d.posX=this.opt.x,e.context2d.posY=this.opt.y,e.context2d.margin=this.opt.margin,e.context2d.fontFaces=r,r)for(var a=0;a<r.length;++a){var o=r[a],s=o.src.find((function(t){return"truetype"===t.format}));s&&e.addFont(s.url,o.ref.name,o.ref.style)}return i.windowHeight=i.windowHeight||0,i.windowHeight=0==i.windowHeight?Math.max(this.prop.container.clientHeight,this.prop.container.scrollHeight,this.prop.container.offsetHeight):i.windowHeight,e.context2d.save(!0),t(this.prop.container,i)})).then((function(t){this.opt.jsPDF.context2d.restore(!0),(this.opt.html2canvas.onrendered||function(){})(t),this.prop.canvas=t,document.body.removeChild(this.prop.overlay)}))},c.prototype.toImg=function(){return this.thenList([function(){return this.prop.canvas||this.toCanvas()}]).then((function(){var t=this.prop.canvas.toDataURL("image/"+this.opt.image.type,this.opt.image.quality);this.prop.img=document.createElement("img"),this.prop.img.src=t}))},c.prototype.toPdf=function(){return this.thenList([function(){return this.toContext2d()}]).then((function(){this.prop.pdf=this.prop.pdf||this.opt.jsPDF}))},c.prototype.output=function(t,e,r){return"img"===(r=r||"pdf").toLowerCase()||"image"===r.toLowerCase()?this.outputImg(t,e):this.outputPdf(t,e)},c.prototype.outputPdf=function(t,e){return this.thenList([function(){return this.prop.pdf||this.toPdf()}]).then((function(){return this.prop.pdf.output(t,e)}))},c.prototype.outputImg=function(t){return this.thenList([function(){return this.prop.img||this.toImg()}]).then((function(){switch(t){case void 0:case"img":return this.prop.img;case"datauristring":case"dataurlstring":return this.prop.img.src;case"datauri":case"dataurl":return document.location.href=this.prop.img.src;default:throw'Image output type "'+t+'" is not supported.'}}))},c.prototype.save=function(t){return this.thenList([function(){return this.prop.pdf||this.toPdf()}]).set(t?{filename:t}:null).then((function(){this.prop.pdf.save(this.opt.filename)}))},c.prototype.doCallback=function(){return this.thenList([function(){return this.prop.pdf||this.toPdf()}]).then((function(){this.prop.callback(this.prop.pdf)}))},c.prototype.set=function(t){if("object"!==o(t))return this;var e=Object.keys(t||{}).map((function(e){if(e in c.template.prop)return function(){this.prop[e]=t[e]};switch(e){case"margin":return this.setMargin.bind(this,t.margin);case"jsPDF":return function(){return this.opt.jsPDF=t.jsPDF,this.setPageSize()};case"pageSize":return this.setPageSize.bind(this,t.pageSize);default:return function(){this.opt[e]=t[e]}}}),this);return this.then((function(){return this.thenList(e)}))},c.prototype.get=function(t,e){return this.then((function(){var r=t in c.template.prop?this.prop[t]:this.opt[t];return e?e(r):r}))},c.prototype.setMargin=function(t){return this.then((function(){switch(o(t)){case"number":t=[t,t,t,t];case"array":if(2===t.length&&(t=[t[0],t[1],t[0],t[1]]),4===t.length)break;default:return this.error("Invalid margin array.")}this.opt.margin=t})).then(this.setPageSize)},c.prototype.setPageSize=function(t){function e(t,e){return Math.floor(t*e/72*96)}return this.then((function(){(t=t||M.getPageSize(this.opt.jsPDF)).hasOwnProperty("inner")||(t.inner={width:t.width-this.opt.margin[1]-this.opt.margin[3],height:t.height-this.opt.margin[0]-this.opt.margin[2]},t.inner.px={width:e(t.inner.width,t.k),height:e(t.inner.height,t.k)},t.inner.ratio=t.inner.height/t.inner.width),this.prop.pageSize=t}))},c.prototype.setProgress=function(t,e,r,n){return null!=t&&(this.progress.val=t),null!=e&&(this.progress.state=e),null!=r&&(this.progress.n=r),null!=n&&(this.progress.stack=n),this.progress.ratio=this.progress.val/this.progress.state,this},c.prototype.updateProgress=function(t,e,r,n){return this.setProgress(t?this.progress.val+t:null,e||null,r?this.progress.n+r:null,n?this.progress.stack.concat(n):null)},c.prototype.then=function(t,e){var r=this;return this.thenCore(t,e,(function(t,e){return r.updateProgress(null,null,1,[t]),Promise.prototype.then.call(this,(function(e){return r.updateProgress(null,t),e})).then(t,e).then((function(t){return r.updateProgress(1),t}))}))},c.prototype.thenCore=function(t,e,r){r=r||Promise.prototype.then;t&&(t=t.bind(this)),e&&(e=e.bind(this));var n=-1!==Promise.toString().indexOf("[native code]")&&"Promise"===Promise.name?this:c.convert(Object.assign({},this),Promise.prototype),i=r.call(n,t,e);return c.convert(i,this.__proto__)},c.prototype.thenExternal=function(t,e){return Promise.prototype.then.call(this,t,e)},c.prototype.thenList=function(t){var e=this;return t.forEach((function(t){e=e.thenCore(t)})),e},c.prototype.catch=function(t){t&&(t=t.bind(this));var e=Promise.prototype.catch.call(this,t);return c.convert(e,this)},c.prototype.catchExternal=function(t){return Promise.prototype.catch.call(this,t)},c.prototype.error=function(t){return this.then((function(){throw new Error(t)}))},c.prototype.using=c.prototype.set,c.prototype.saveAs=c.prototype.save,c.prototype.export=c.prototype.output,c.prototype.run=c.prototype.then,M.getPageSize=function(t,r,n){if("object"===e(t)){var i=t;t=i.orientation,r=i.unit||r,n=i.format||n}r=r||"mm",n=n||"a4",t=(""+(t||"P")).toLowerCase();var a,o=(""+n).toLowerCase(),s={a0:[2383.94,3370.39],a1:[1683.78,2383.94],a2:[1190.55,1683.78],a3:[841.89,1190.55],a4:[595.28,841.89],a5:[419.53,595.28],a6:[297.64,419.53],a7:[209.76,297.64],a8:[147.4,209.76],a9:[104.88,147.4],a10:[73.7,104.88],b0:[2834.65,4008.19],b1:[2004.09,2834.65],b2:[1417.32,2004.09],b3:[1000.63,1417.32],b4:[708.66,1000.63],b5:[498.9,708.66],b6:[354.33,498.9],b7:[249.45,354.33],b8:[175.75,249.45],b9:[124.72,175.75],b10:[87.87,124.72],c0:[2599.37,3676.54],c1:[1836.85,2599.37],c2:[1298.27,1836.85],c3:[918.43,1298.27],c4:[649.13,918.43],c5:[459.21,649.13],c6:[323.15,459.21],c7:[229.61,323.15],c8:[161.57,229.61],c9:[113.39,161.57],c10:[79.37,113.39],dl:[311.81,623.62],letter:[612,792],"government-letter":[576,756],legal:[612,1008],"junior-legal":[576,360],ledger:[1224,792],tabloid:[792,1224],"credit-card":[153,243]};switch(r){case"pt":a=1;break;case"mm":a=72/25.4;break;case"cm":a=72/2.54;break;case"in":a=72;break;case"px":a=.75;break;case"pc":case"em":a=12;break;case"ex":a=6;break;default:throw"Invalid unit: "+r}var c,u=0,l=0;if(s.hasOwnProperty(o))u=s[o][1]/a,l=s[o][0]/a;else try{u=n[1],l=n[0]}catch(t){throw new Error("Invalid format: "+n)}if("p"===t||"portrait"===t)t="p",l>u&&(c=l,l=u,u=c);else{if("l"!==t&&"landscape"!==t)throw"Invalid orientation: "+t;t="l",u>l&&(c=l,l=u,u=c)}return{width:l,height:u,unit:r,k:a,orientation:t}},n.html=function(t,e){(e=e||{}).callback=e.callback||function(){},e.html2canvas=e.html2canvas||{},e.html2canvas.canvas=e.html2canvas.canvas||this.canvas,e.jsPDF=e.jsPDF||this,e.fontFaces=e.fontFaces?e.fontFaces.map(Ct):null;var r=new c(e);return e.worker?r:r.from(t).doCallback()}}(M.API),
/**
   * @license
   * ====================================================================
   * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   * ====================================================================
   */
function(t){var e,r,n;t.addJS=function(t){return n=t,this.internal.events.subscribe("postPutResources",(function(){e=this.internal.newObject(),this.internal.out("<<"),this.internal.out("/Names [(EmbeddedJS) "+(e+1)+" 0 R]"),this.internal.out(">>"),this.internal.out("endobj"),r=this.internal.newObject(),this.internal.out("<<"),this.internal.out("/S /JavaScript"),this.internal.out("/JS ("+n+")"),this.internal.out(">>"),this.internal.out("endobj")})),this.internal.events.subscribe("putCatalog",(function(){void 0!==e&&void 0!==r&&this.internal.out("/Names <</JavaScript "+e+" 0 R>>")})),this}}(M.API),
/**
   * @license
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
function(t){var e;t.events.push(["postPutResources",function(){var t=this,r=/^(\d+) 0 obj$/;if(this.outline.root.children.length>0)for(var n=t.outline.render().split(/\r\n/),i=0;i<n.length;i++){var a=n[i],o=r.exec(a);if(null!=o){var s=o[1];t.internal.newObjectDeferredBegin(s,!1)}t.internal.write(a)}if(this.outline.createNamedDestinations){var c=this.internal.pages.length,u=[];for(i=0;i<c;i++){var l=t.internal.newObject();u.push(l);var h=t.internal.getPageInfo(i+1);t.internal.write("<< /D["+h.objId+" 0 R /XYZ null null null]>> endobj")}var f=t.internal.newObject();t.internal.write("<< /Names [ ");for(i=0;i<u.length;i++)t.internal.write("(page_"+(i+1)+")"+u[i]+" 0 R");t.internal.write(" ] >>","endobj"),e=t.internal.newObject(),t.internal.write("<< /Dests "+f+" 0 R"),t.internal.write(">>","endobj")}}]),t.events.push(["putCatalog",function(){this.outline.root.children.length>0&&(this.internal.write("/Outlines",this.outline.makeRef(this.outline.root)),this.outline.createNamedDestinations&&this.internal.write("/Names "+e+" 0 R"))}]),t.events.push(["initialized",function(){var t=this;t.outline={createNamedDestinations:!1,root:{children:[]}},t.outline.add=function(t,e,r){var n={title:e,options:r,children:[]};return null==t&&(t=this.root),t.children.push(n),n},t.outline.render=function(){return this.ctx={},this.ctx.val="",this.ctx.pdf=t,this.genIds_r(this.root),this.renderRoot(this.root),this.renderItems(this.root),this.ctx.val},t.outline.genIds_r=function(e){e.id=t.internal.newObjectDeferred();for(var r=0;r<e.children.length;r++)this.genIds_r(e.children[r])},t.outline.renderRoot=function(t){this.objStart(t),this.line("/Type /Outlines"),t.children.length>0&&(this.line("/First "+this.makeRef(t.children[0])),this.line("/Last "+this.makeRef(t.children[t.children.length-1]))),this.line("/Count "+this.count_r({count:0},t)),this.objEnd()},t.outline.renderItems=function(e){for(var r=this.ctx.pdf.internal.getVerticalCoordinateString,n=0;n<e.children.length;n++){var i=e.children[n];this.objStart(i),this.line("/Title "+this.makeString(i.title)),this.line("/Parent "+this.makeRef(e)),n>0&&this.line("/Prev "+this.makeRef(e.children[n-1])),n<e.children.length-1&&this.line("/Next "+this.makeRef(e.children[n+1])),i.children.length>0&&(this.line("/First "+this.makeRef(i.children[0])),this.line("/Last "+this.makeRef(i.children[i.children.length-1])));var a=this.count=this.count_r({count:0},i);if(a>0&&this.line("/Count "+a),i.options&&i.options.pageNumber){var o=t.internal.getPageInfo(i.options.pageNumber);this.line("/Dest ["+o.objId+" 0 R /XYZ 0 "+r(0)+" 0]")}this.objEnd()}for(var s=0;s<e.children.length;s++)this.renderItems(e.children[s])},t.outline.line=function(t){this.ctx.val+=t+"\r\n"},t.outline.makeRef=function(t){return t.id+" 0 R"},t.outline.makeString=function(e){return"("+t.internal.pdfEscape(e)+")"},t.outline.objStart=function(t){this.ctx.val+="\r\n"+t.id+" 0 obj\r\n<<\r\n"},t.outline.objEnd=function(){this.ctx.val+=">> \r\nendobj\r\n"},t.outline.count_r=function(t,e){for(var r=0;r<e.children.length;r++)t.count++,this.count_r(t,e.children[r]);return t.count}}])}(M.API),
/**
   * @license
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
function(t){var e=[192,193,194,195,196,197,198,199];t.processJPEG=function(t,r,n,i,a,o){var s,c=this.decode.DCT_DECODE,u=null;if("string"==typeof t||this.__addimage__.isArrayBuffer(t)||this.__addimage__.isArrayBufferView(t)){switch(t=a||t,t=this.__addimage__.isArrayBuffer(t)?new Uint8Array(t):t,(s=function(t){for(var r,n=256*t.charCodeAt(4)+t.charCodeAt(5),i=t.length,a={width:0,height:0,numcomponents:1},o=4;o<i;o+=2){if(o+=n,-1!==e.indexOf(t.charCodeAt(o+1))){r=256*t.charCodeAt(o+5)+t.charCodeAt(o+6),a={width:256*t.charCodeAt(o+7)+t.charCodeAt(o+8),height:r,numcomponents:t.charCodeAt(o+9)};break}n=256*t.charCodeAt(o+2)+t.charCodeAt(o+3)}return a}(t=this.__addimage__.isArrayBufferView(t)?this.__addimage__.arrayBufferToBinaryString(t):t)).numcomponents){case 1:o=this.color_spaces.DEVICE_GRAY;break;case 4:o=this.color_spaces.DEVICE_CMYK;break;case 3:o=this.color_spaces.DEVICE_RGB}u={data:t,width:s.width,height:s.height,colorSpace:o,bitsPerComponent:8,filter:c,index:r,alias:n}}return u}}(M.API);var ke,Fe,Ie,Ce,je,Oe=function(){var t,e,n;function i(t){var e,r,n,i,a,o,s,c,u,l,h,f,d,p;for(this.data=t,this.pos=8,this.palette=[],this.imgData=[],this.transparency={},this.animation=null,this.text={},o=null;;){switch(e=this.readUInt32(),u=function(){var t,e;for(e=[],t=0;t<4;++t)e.push(String.fromCharCode(this.data[this.pos++]));return e}.call(this).join("")){case"IHDR":this.width=this.readUInt32(),this.height=this.readUInt32(),this.bits=this.data[this.pos++],this.colorType=this.data[this.pos++],this.compressionMethod=this.data[this.pos++],this.filterMethod=this.data[this.pos++],this.interlaceMethod=this.data[this.pos++];break;case"acTL":this.animation={numFrames:this.readUInt32(),numPlays:this.readUInt32()||1/0,frames:[]};break;case"PLTE":this.palette=this.read(e);break;case"fcTL":o&&this.animation.frames.push(o),this.pos+=4,o={width:this.readUInt32(),height:this.readUInt32(),xOffset:this.readUInt32(),yOffset:this.readUInt32()},a=this.readUInt16(),i=this.readUInt16()||100,o.delay=1e3*a/i,o.disposeOp=this.data[this.pos++],o.blendOp=this.data[this.pos++],o.data=[];break;case"IDAT":case"fdAT":for("fdAT"===u&&(this.pos+=4,e-=4),t=(null!=o?o.data:void 0)||this.imgData,f=0;0<=e?f<e:f>e;0<=e?++f:--f)t.push(this.data[this.pos++]);break;case"tRNS":switch(this.transparency={},this.colorType){case 3:if(n=this.palette.length/3,this.transparency.indexed=this.read(e),this.transparency.indexed.length>n)throw new Error("More transparent colors than palette size");if((l=n-this.transparency.indexed.length)>0)for(d=0;0<=l?d<l:d>l;0<=l?++d:--d)this.transparency.indexed.push(255);break;case 0:this.transparency.grayscale=this.read(e)[0];break;case 2:this.transparency.rgb=this.read(e)}break;case"tEXt":s=(h=this.read(e)).indexOf(0),c=String.fromCharCode.apply(String,h.slice(0,s)),this.text[c]=String.fromCharCode.apply(String,h.slice(s+1));break;case"IEND":return o&&this.animation.frames.push(o),this.colors=function(){switch(this.colorType){case 0:case 3:case 4:return 1;case 2:case 6:return 3}}.call(this),this.hasAlphaChannel=4===(p=this.colorType)||6===p,r=this.colors+(this.hasAlphaChannel?1:0),this.pixelBitlength=this.bits*r,this.colorSpace=function(){switch(this.colors){case 1:return"DeviceGray";case 3:return"DeviceRGB"}}.call(this),void(this.imgData=new Uint8Array(this.imgData));default:this.pos+=e}if(this.pos+=4,this.pos>this.data.length)throw new Error("Incomplete or corrupt PNG file")}}i.prototype.read=function(t){var e,r;for(r=[],e=0;0<=t?e<t:e>t;0<=t?++e:--e)r.push(this.data[this.pos++]);return r},i.prototype.readUInt32=function(){return this.data[this.pos++]<<24|this.data[this.pos++]<<16|this.data[this.pos++]<<8|this.data[this.pos++]},i.prototype.readUInt16=function(){return this.data[this.pos++]<<8|this.data[this.pos++]},i.prototype.decodePixels=function(t){var e=this.pixelBitlength/8,r=new Uint8Array(this.width*this.height*e),n=0,i=this;if(null==t&&(t=this.imgData),0===t.length)return new Uint8Array(0);function a(a,o,s,c){var u,l,h,f,d,p,g,m,v,b,y,w,N,L,A,x,S,_,P,k,F,I=Math.ceil((i.width-a)/s),C=Math.ceil((i.height-o)/c),j=i.width==I&&i.height==C;for(L=e*I,w=j?r:new Uint8Array(L*C),p=t.length,N=0,l=0;N<C&&n<p;){switch(t[n++]){case 0:for(f=S=0;S<L;f=S+=1)w[l++]=t[n++];break;case 1:for(f=_=0;_<L;f=_+=1)u=t[n++],d=f<e?0:w[l-e],w[l++]=(u+d)%256;break;case 2:for(f=P=0;P<L;f=P+=1)u=t[n++],h=(f-f%e)/e,A=N&&w[(N-1)*L+h*e+f%e],w[l++]=(A+u)%256;break;case 3:for(f=k=0;k<L;f=k+=1)u=t[n++],h=(f-f%e)/e,d=f<e?0:w[l-e],A=N&&w[(N-1)*L+h*e+f%e],w[l++]=(u+Math.floor((d+A)/2))%256;break;case 4:for(f=F=0;F<L;f=F+=1)u=t[n++],h=(f-f%e)/e,d=f<e?0:w[l-e],0===N?A=x=0:(A=w[(N-1)*L+h*e+f%e],x=h&&w[(N-1)*L+(h-1)*e+f%e]),g=d+A-x,m=Math.abs(g-d),b=Math.abs(g-A),y=Math.abs(g-x),v=m<=b&&m<=y?d:b<=y?A:x,w[l++]=(u+v)%256;break;default:throw new Error("Invalid filter algorithm: "+t[n-1])}if(!j){var O=((o+N*c)*i.width+a)*e,B=N*L;for(f=0;f<I;f+=1){for(var M=0;M<e;M+=1)r[O++]=w[B++];O+=(s-1)*e}}N++}}return t=Pe(t),1==i.interlaceMethod?(a(0,0,8,8),a(4,0,8,8),a(0,4,4,8),a(2,0,4,4),a(0,2,2,4),a(1,0,2,2),a(0,1,1,2)):a(0,0,1,1),r},i.prototype.decodePalette=function(){var t,e,r,n,i,a,o,s,c;for(r=this.palette,a=this.transparency.indexed||[],i=new Uint8Array((a.length||0)+r.length),n=0,t=0,e=o=0,s=r.length;o<s;e=o+=3)i[n++]=r[e],i[n++]=r[e+1],i[n++]=r[e+2],i[n++]=null!=(c=a[t++])?c:255;return i},i.prototype.copyToImageData=function(t,e){var r,n,i,a,o,s,c,u,l,h,f;if(n=this.colors,l=null,r=this.hasAlphaChannel,this.palette.length&&(l=null!=(f=this._decodedPalette)?f:this._decodedPalette=this.decodePalette(),n=4,r=!0),u=(i=t.data||t).length,o=l||e,a=s=0,1===n)for(;a<u;)c=l?4*e[a/4]:s,h=o[c++],i[a++]=h,i[a++]=h,i[a++]=h,i[a++]=r?o[c++]:255,s=c;else for(;a<u;)c=l?4*e[a/4]:s,i[a++]=o[c++],i[a++]=o[c++],i[a++]=o[c++],i[a++]=r?o[c++]:255,s=c},i.prototype.decode=function(){var t;return t=new Uint8Array(this.width*this.height*4),this.copyToImageData(t,this.decodePixels()),t};var a=function(){if("[object Window]"===Object.prototype.toString.call(r)){try{e=r.document.createElement("canvas"),n=e.getContext("2d")}catch(t){return!1}return!0}return!1};return a(),t=function(t){var r;if(!0===a())return n.width=t.width,n.height=t.height,n.clearRect(0,0,t.width,t.height),n.putImageData(t,0,0),(r=new Image).src=e.toDataURL(),r;throw new Error("This method requires a Browser with Canvas-capability.")},i.prototype.decodeFrames=function(e){var r,n,i,a,o,s,c,u;if(this.animation){for(u=[],n=o=0,s=(c=this.animation.frames).length;o<s;n=++o)r=c[n],i=e.createImageData(r.width,r.height),a=this.decodePixels(new Uint8Array(r.data)),this.copyToImageData(i,a),r.imageData=i,u.push(r.image=t(i));return u}},i.prototype.renderFrame=function(t,e){var r,n,i;return r=(n=this.animation.frames)[e],i=n[e-1],0===e&&t.clearRect(0,0,this.width,this.height),1===(null!=i?i.disposeOp:void 0)?t.clearRect(i.xOffset,i.yOffset,i.width,i.height):2===(null!=i?i.disposeOp:void 0)&&t.putImageData(i.imageData,i.xOffset,i.yOffset),0===r.blendOp&&t.clearRect(r.xOffset,r.yOffset,r.width,r.height),t.drawImage(r.image,r.xOffset,r.yOffset)},i.prototype.animate=function(t){var e,r,n,i,a,o,s=this;return r=0,o=this.animation,i=o.numFrames,n=o.frames,a=o.numPlays,(e=function(){var o,c;if(o=r++%i,c=n[o],s.renderFrame(t,o),i>1&&r/i<a)return s.animation._timeout=setTimeout(e,c.delay)})()},i.prototype.stopAnimation=function(){var t;return clearTimeout(null!=(t=this.animation)?t._timeout:void 0)},i.prototype.render=function(t){var e,r;return t._png&&t._png.stopAnimation(),t._png=this,t.width=this.width,t.height=this.height,e=t.getContext("2d"),this.animation?(this.decodeFrames(e),this.animate(e)):(r=e.createImageData(this.width,this.height),this.copyToImageData(r,this.decodePixels()),e.putImageData(r,0,0))},i}();
/**
   * @license
   *
   * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   * ====================================================================
   */
/**
   * @license
   * (c) Dean McNamee <dean@gmail.com>, 2013.
   *
   * https://github.com/deanm/omggif
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to
   * deal in the Software without restriction, including without limitation the
   * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
   * sell copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
   * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
   * IN THE SOFTWARE.
   *
   * omggif is a JavaScript implementation of a GIF 89a encoder and decoder,
   * including animation and compression.  It does not rely on any specific
   * underlying system, so should run in the browser, Node, or Plask.
   */
function Be(t){var e=0;if(71!==t[e++]||73!==t[e++]||70!==t[e++]||56!==t[e++]||56!=(t[e++]+1&253)||97!==t[e++])throw new Error("Invalid GIF 87a/89a header.");var r=t[e++]|t[e++]<<8,n=t[e++]|t[e++]<<8,i=t[e++],a=i>>7,o=1<<(7&i)+1;t[e++];t[e++];var s=null,c=null;a&&(s=e,c=o,e+=3*o);var u=!0,l=[],h=0,f=null,d=0,p=null;for(this.width=r,this.height=n;u&&e<t.length;)switch(t[e++]){case 33:switch(t[e++]){case 255:if(11!==t[e]||78==t[e+1]&&69==t[e+2]&&84==t[e+3]&&83==t[e+4]&&67==t[e+5]&&65==t[e+6]&&80==t[e+7]&&69==t[e+8]&&50==t[e+9]&&46==t[e+10]&&48==t[e+11]&&3==t[e+12]&&1==t[e+13]&&0==t[e+16])e+=14,p=t[e++]|t[e++]<<8,e++;else for(e+=12;;){if(!((P=t[e++])>=0))throw Error("Invalid block size");if(0===P)break;e+=P}break;case 249:if(4!==t[e++]||0!==t[e+4])throw new Error("Invalid graphics extension block.");var g=t[e++];h=t[e++]|t[e++]<<8,f=t[e++],0==(1&g)&&(f=null),d=g>>2&7,e++;break;case 254:for(;;){if(!((P=t[e++])>=0))throw Error("Invalid block size");if(0===P)break;e+=P}break;default:throw new Error("Unknown graphic control label: 0x"+t[e-1].toString(16))}break;case 44:var m=t[e++]|t[e++]<<8,v=t[e++]|t[e++]<<8,b=t[e++]|t[e++]<<8,y=t[e++]|t[e++]<<8,w=t[e++],N=w>>6&1,L=1<<(7&w)+1,A=s,x=c,S=!1;if(w>>7){S=!0;A=e,x=L,e+=3*L}var _=e;for(e++;;){var P;if(!((P=t[e++])>=0))throw Error("Invalid block size");if(0===P)break;e+=P}l.push({x:m,y:v,width:b,height:y,has_local_palette:S,palette_offset:A,palette_size:x,data_offset:_,data_length:e-_,transparent_index:f,interlaced:!!N,delay:h,disposal:d});break;case 59:u=!1;break;default:throw new Error("Unknown gif block: 0x"+t[e-1].toString(16))}this.numFrames=function(){return l.length},this.loopCount=function(){return p},this.frameInfo=function(t){if(t<0||t>=l.length)throw new Error("Frame index out of range.");return l[t]},this.decodeAndBlitFrameBGRA=function(e,n){var i=this.frameInfo(e),a=i.width*i.height,o=new Uint8Array(a);Me(t,i.data_offset,o,a);var s=i.palette_offset,c=i.transparent_index;null===c&&(c=256);var u=i.width,l=r-u,h=u,f=4*(i.y*r+i.x),d=4*((i.y+i.height)*r+i.x),p=f,g=4*l;!0===i.interlaced&&(g+=4*r*7);for(var m=8,v=0,b=o.length;v<b;++v){var y=o[v];if(0===h&&(h=u,(p+=g)>=d&&(g=4*l+4*r*(m-1),p=f+(u+l)*(m<<1),m>>=1)),y===c)p+=4;else{var w=t[s+3*y],N=t[s+3*y+1],L=t[s+3*y+2];n[p++]=L,n[p++]=N,n[p++]=w,n[p++]=255}--h}},this.decodeAndBlitFrameRGBA=function(e,n){var i=this.frameInfo(e),a=i.width*i.height,o=new Uint8Array(a);Me(t,i.data_offset,o,a);var s=i.palette_offset,c=i.transparent_index;null===c&&(c=256);var u=i.width,l=r-u,h=u,f=4*(i.y*r+i.x),d=4*((i.y+i.height)*r+i.x),p=f,g=4*l;!0===i.interlaced&&(g+=4*r*7);for(var m=8,v=0,b=o.length;v<b;++v){var y=o[v];if(0===h&&(h=u,(p+=g)>=d&&(g=4*l+4*r*(m-1),p=f+(u+l)*(m<<1),m>>=1)),y===c)p+=4;else{var w=t[s+3*y],N=t[s+3*y+1],L=t[s+3*y+2];n[p++]=w,n[p++]=N,n[p++]=L,n[p++]=255}--h}}}function Me(t,e,r,n){for(var a=t[e++],o=1<<a,s=o+1,c=s+1,u=a+1,l=(1<<u)-1,h=0,f=0,d=0,p=t[e++],g=new Int32Array(4096),m=null;;){for(;h<16&&0!==p;)f|=t[e++]<<h,h+=8,1===p?p=t[e++]:--p;if(h<u)break;var v=f&l;if(f>>=u,h-=u,v!==o){if(v===s)break;for(var b=v<c?v:m,y=0,w=b;w>o;)w=g[w]>>8,++y;var N=w;if(d+y+(b!==v?1:0)>n)return void i.log("Warning, gif stream longer than expected.");r[d++]=N;var L=d+=y;for(b!==v&&(r[d++]=N),w=b;y--;)w=g[w],r[--L]=255&w,w>>=8;null!==m&&c<4096&&(g[c++]=m<<8|N,c>=l+1&&u<12&&(++u,l=l<<1|1)),m=v}else c=s+1,l=(1<<(u=a+1))-1,m=null}return d!==n&&i.log("Warning, gif stream shorter than expected."),r}
/**
   * @license
    Copyright (c) 2008, Adobe Systems Incorporated
    All rights reserved.

    Redistribution and use in source and binary forms, with or without 
    modification, are permitted provided that the following conditions are
    met:

    * Redistributions of source code must retain the above copyright notice, 
      this list of conditions and the following disclaimer.
    
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the 
      documentation and/or other materials provided with the distribution.
    
    * Neither the name of Adobe Systems Incorporated nor the names of its 
      contributors may be used to endorse or promote products derived from 
      this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
    IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
    THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR 
    CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
    EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
    LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
    NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */function Ee(t){var e,r,n,i,a,o=Math.floor,s=new Array(64),c=new Array(64),u=new Array(64),l=new Array(64),h=new Array(65535),f=new Array(65535),d=new Array(64),p=new Array(64),g=[],m=0,v=7,b=new Array(64),y=new Array(64),w=new Array(64),N=new Array(256),L=new Array(2048),A=[0,1,5,6,14,15,27,28,2,4,7,13,16,26,29,42,3,8,12,17,25,30,41,43,9,11,18,24,31,40,44,53,10,19,23,32,39,45,52,54,20,22,33,38,46,51,55,60,21,34,37,47,50,56,59,61,35,36,48,49,57,58,62,63],x=[0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0],S=[0,1,2,3,4,5,6,7,8,9,10,11],_=[0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125],P=[1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250],k=[0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0],F=[0,1,2,3,4,5,6,7,8,9,10,11],I=[0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,119],C=[0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250];function j(t,e){for(var r=0,n=0,i=new Array,a=1;a<=16;a++){for(var o=1;o<=t[a];o++)i[e[n]]=[],i[e[n]][0]=r,i[e[n]][1]=a,n++,r++;r*=2}return i}function O(t){for(var e=t[0],r=t[1]-1;r>=0;)e&1<<r&&(m|=1<<v),r--,--v<0&&(255==m?(B(255),B(0)):B(m),v=7,m=0)}function B(t){g.push(t)}function M(t){B(t>>8&255),B(255&t)}function E(t,e,r,n,i){for(var a,o=i[0],s=i[240],c=function(t,e){var r,n,i,a,o,s,c,u,l,h,f=0;for(l=0;l<8;++l){r=t[f],n=t[f+1],i=t[f+2],a=t[f+3],o=t[f+4],s=t[f+5],c=t[f+6];var p=r+(u=t[f+7]),g=r-u,m=n+c,v=n-c,b=i+s,y=i-s,w=a+o,N=a-o,L=p+w,A=p-w,x=m+b,S=m-b;t[f]=L+x,t[f+4]=L-x;var _=.707106781*(S+A);t[f+2]=A+_,t[f+6]=A-_;var P=.382683433*((L=N+y)-(S=v+g)),k=.5411961*L+P,F=1.306562965*S+P,I=.707106781*(x=y+v),C=g+I,j=g-I;t[f+5]=j+k,t[f+3]=j-k,t[f+1]=C+F,t[f+7]=C-F,f+=8}for(f=0,l=0;l<8;++l){r=t[f],n=t[f+8],i=t[f+16],a=t[f+24],o=t[f+32],s=t[f+40],c=t[f+48];var O=r+(u=t[f+56]),B=r-u,M=n+c,E=n-c,q=i+s,D=i-s,R=a+o,T=a-o,U=O+R,z=O-R,H=M+q,W=M-q;t[f]=U+H,t[f+32]=U-H;var V=.707106781*(W+z);t[f+16]=z+V,t[f+48]=z-V;var G=.382683433*((U=T+D)-(W=E+B)),Y=.5411961*U+G,J=1.306562965*W+G,X=.707106781*(H=D+E),K=B+X,Z=B-X;t[f+40]=Z+Y,t[f+24]=Z-Y,t[f+8]=K+J,t[f+56]=K-J,f++}for(l=0;l<64;++l)h=t[l]*e[l],d[l]=h>0?h+.5|0:h-.5|0;return d}(t,e),u=0;u<64;++u)p[A[u]]=c[u];var l=p[0]-r;r=p[0],0==l?O(n[0]):(O(n[f[a=32767+l]]),O(h[a]));for(var g=63;g>0&&0==p[g];)g--;if(0==g)return O(o),r;for(var m,v=1;v<=g;){for(var b=v;0==p[v]&&v<=g;)++v;var y=v-b;if(y>=16){m=y>>4;for(var w=1;w<=m;++w)O(s);y&=15}a=32767+p[v],O(i[(y<<4)+f[a]]),O(h[a]),v++}return 63!=g&&O(o),r}function q(t){(t=Math.min(Math.max(t,1),100),a!=t)&&(!function(t){for(var e=[16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99],r=0;r<64;r++){var n=o((e[r]*t+50)/100);n=Math.min(Math.max(n,1),255),s[A[r]]=n}for(var i=[17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99],a=0;a<64;a++){var h=o((i[a]*t+50)/100);h=Math.min(Math.max(h,1),255),c[A[a]]=h}for(var f=[1,1.387039845,1.306562965,1.175875602,1,.785694958,.5411961,.275899379],d=0,p=0;p<8;p++)for(var g=0;g<8;g++)u[d]=1/(s[A[d]]*f[p]*f[g]*8),l[d]=1/(c[A[d]]*f[p]*f[g]*8),d++}(t<50?Math.floor(5e3/t):Math.floor(200-2*t)),a=t)}this.encode=function(t,a){a&&q(a),g=new Array,m=0,v=7,M(65496),M(65504),M(16),B(74),B(70),B(73),B(70),B(0),B(1),B(1),B(0),M(1),M(1),B(0),B(0),function(){M(65499),M(132),B(0);for(var t=0;t<64;t++)B(s[t]);B(1);for(var e=0;e<64;e++)B(c[e])}(),function(t,e){M(65472),M(17),B(8),M(e),M(t),B(3),B(1),B(17),B(0),B(2),B(17),B(1),B(3),B(17),B(1)}(t.width,t.height),function(){M(65476),M(418),B(0);for(var t=0;t<16;t++)B(x[t+1]);for(var e=0;e<=11;e++)B(S[e]);B(16);for(var r=0;r<16;r++)B(_[r+1]);for(var n=0;n<=161;n++)B(P[n]);B(1);for(var i=0;i<16;i++)B(k[i+1]);for(var a=0;a<=11;a++)B(F[a]);B(17);for(var o=0;o<16;o++)B(I[o+1]);for(var s=0;s<=161;s++)B(C[s])}(),M(65498),M(12),B(3),B(1),B(0),B(2),B(17),B(3),B(17),B(0),B(63),B(0);var o=0,h=0,f=0;m=0,v=7,this.encode.displayName="_encode_";for(var d,p,N,A,j,D,R,T,U,z=t.data,H=t.width,W=t.height,V=4*H,G=0;G<W;){for(d=0;d<V;){for(j=V*G+d,R=-1,T=0,U=0;U<64;U++)D=j+(T=U>>3)*V+(R=4*(7&U)),G+T>=W&&(D-=V*(G+1+T-W)),d+R>=V&&(D-=d+R-V+4),p=z[D++],N=z[D++],A=z[D++],b[U]=(L[p]+L[N+256>>0]+L[A+512>>0]>>16)-128,y[U]=(L[p+768>>0]+L[N+1024>>0]+L[A+1280>>0]>>16)-128,w[U]=(L[p+1280>>0]+L[N+1536>>0]+L[A+1792>>0]>>16)-128;o=E(b,u,o,e,n),h=E(y,l,h,r,i),f=E(w,l,f,r,i),d+=32}G+=8}if(v>=0){var Y=[];Y[1]=v+1,Y[0]=(1<<v+1)-1,O(Y)}return M(65497),new Uint8Array(g)},t=t||50,function(){for(var t=String.fromCharCode,e=0;e<256;e++)N[e]=t(e)}(),e=j(x,S),r=j(k,F),n=j(_,P),i=j(I,C),function(){for(var t=1,e=2,r=1;r<=15;r++){for(var n=t;n<e;n++)f[32767+n]=r,h[32767+n]=[],h[32767+n][1]=r,h[32767+n][0]=n;for(var i=-(e-1);i<=-t;i++)f[32767+i]=r,h[32767+i]=[],h[32767+i][1]=r,h[32767+i][0]=e-1+i;t<<=1,e<<=1}}(),function(){for(var t=0;t<256;t++)L[t]=19595*t,L[t+256>>0]=38470*t,L[t+512>>0]=7471*t+32768,L[t+768>>0]=-11059*t,L[t+1024>>0]=-21709*t,L[t+1280>>0]=32768*t+8421375,L[t+1536>>0]=-27439*t,L[t+1792>>0]=-5329*t}(),q(t)}
/**
   * @license
   * Copyright (c) 2017 Aras Abbasi
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */function qe(t,e){if(this.pos=0,this.buffer=t,this.datav=new DataView(t.buffer),this.is_with_alpha=!!e,this.bottom_up=!0,this.flag=String.fromCharCode(this.buffer[0])+String.fromCharCode(this.buffer[1]),this.pos+=2,-1===["BM","BA","CI","CP","IC","PT"].indexOf(this.flag))throw new Error("Invalid BMP File");this.parseHeader(),this.parseBGR()}function De(t){function e(t){if(!t)throw Error("assert :P")}function r(t,e,r){for(var n=0;4>n;n++)if(t[e+n]!=r.charCodeAt(n))return!0;return!1}function n(t,e,r,n,i){for(var a=0;a<i;a++)t[e+a]=r[n+a]}function i(t,e,r,n){for(var i=0;i<n;i++)t[e+i]=r}function a(t){return new Int32Array(t)}function o(t,e){for(var r=[],n=0;n<t;n++)r.push(new e);return r}function s(t,e){var r=[];return function t(r,n,i){for(var a=i[n],o=0;o<a&&(r.push(i.length>n+1?[]:new e),!(i.length<n+1));o++)t(r[o],n+1,i)}(r,0,t),r}var c=function(){var t=this;function c(t,e){for(var r=1<<e-1>>>0;t&r;)r>>>=1;return r?(t&r-1)+r:t}function u(t,r,n,i,a){e(!(i%n));do{t[r+(i-=n)]=a}while(0<i)}function l(t,r,n,i,o){if(e(2328>=o),512>=o)var s=a(512);else if(null==(s=a(o)))return 0;return function(t,r,n,i,o,s){var l,f,d=r,p=1<<n,g=a(16),m=a(16);for(e(0!=o),e(null!=i),e(null!=t),e(0<n),f=0;f<o;++f){if(15<i[f])return 0;++g[i[f]]}if(g[0]==o)return 0;for(m[1]=0,l=1;15>l;++l){if(g[l]>1<<l)return 0;m[l+1]=m[l]+g[l]}for(f=0;f<o;++f)l=i[f],0<i[f]&&(s[m[l]++]=f);if(1==m[15])return(i=new h).g=0,i.value=s[0],u(t,d,1,p,i),p;var v,b=-1,y=p-1,w=0,N=1,L=1,A=1<<n;for(f=0,l=1,o=2;l<=n;++l,o<<=1){if(N+=L<<=1,0>(L-=g[l]))return 0;for(;0<g[l];--g[l])(i=new h).g=l,i.value=s[f++],u(t,d+w,o,A,i),w=c(w,l)}for(l=n+1,o=2;15>=l;++l,o<<=1){if(N+=L<<=1,0>(L-=g[l]))return 0;for(;0<g[l];--g[l]){if(i=new h,(w&y)!=b){for(d+=A,v=1<<(b=l)-n;15>b&&!(0>=(v-=g[b]));)++b,v<<=1;p+=A=1<<(v=b-n),t[r+(b=w&y)].g=v+n,t[r+b].value=d-r-b}i.g=l-n,i.value=s[f++],u(t,d+(w>>n),o,A,i),w=c(w,l)}}return N!=2*m[15]-1?0:p}(t,r,n,i,o,s)}function h(){this.value=this.g=0}function f(){this.value=this.g=0}function d(){this.G=o(5,h),this.H=a(5),this.jc=this.Qb=this.qb=this.nd=0,this.pd=o(Dr,f)}function p(t,r,n,i){e(null!=t),e(null!=r),e(2147483648>i),t.Ca=254,t.I=0,t.b=-8,t.Ka=0,t.oa=r,t.pa=n,t.Jd=r,t.Yc=n+i,t.Zc=4<=i?n+i-4+1:n,_(t)}function g(t,e){for(var r=0;0<e--;)r|=k(t,128)<<e;return r}function m(t,e){var r=g(t,e);return P(t)?-r:r}function v(t,r,n,i){var a,o=0;for(e(null!=t),e(null!=r),e(4294967288>i),t.Sb=i,t.Ra=0,t.u=0,t.h=0,4<i&&(i=4),a=0;a<i;++a)o+=r[n+a]<<8*a;t.Ra=o,t.bb=i,t.oa=r,t.pa=n}function b(t){for(;8<=t.u&&t.bb<t.Sb;)t.Ra>>>=8,t.Ra+=t.oa[t.pa+t.bb]<<Ur-8>>>0,++t.bb,t.u-=8;A(t)&&(t.h=1,t.u=0)}function y(t,r){if(e(0<=r),!t.h&&r<=Tr){var n=L(t)&Rr[r];return t.u+=r,b(t),n}return t.h=1,t.u=0}function w(){this.b=this.Ca=this.I=0,this.oa=[],this.pa=0,this.Jd=[],this.Yc=0,this.Zc=[],this.Ka=0}function N(){this.Ra=0,this.oa=[],this.h=this.u=this.bb=this.Sb=this.pa=0}function L(t){return t.Ra>>>(t.u&Ur-1)>>>0}function A(t){return e(t.bb<=t.Sb),t.h||t.bb==t.Sb&&t.u>Ur}function x(t,e){t.u=e,t.h=A(t)}function S(t){t.u>=zr&&(e(t.u>=zr),b(t))}function _(t){e(null!=t&&null!=t.oa),t.pa<t.Zc?(t.I=(t.oa[t.pa++]|t.I<<8)>>>0,t.b+=8):(e(null!=t&&null!=t.oa),t.pa<t.Yc?(t.b+=8,t.I=t.oa[t.pa++]|t.I<<8):t.Ka?t.b=0:(t.I<<=8,t.b+=8,t.Ka=1))}function P(t){return g(t,1)}function k(t,e){var r=t.Ca;0>t.b&&_(t);var n=t.b,i=r*e>>>8,a=(t.I>>>n>i)+0;for(a?(r-=i,t.I-=i+1<<n>>>0):r=i+1,n=r,i=0;256<=n;)i+=8,n>>=8;return n=7^i+Hr[n],t.b-=n,t.Ca=(r<<n)-1,a}function F(t,e,r){t[e+0]=r>>24&255,t[e+1]=r>>16&255,t[e+2]=r>>8&255,t[e+3]=r>>0&255}function I(t,e){return t[e+0]<<0|t[e+1]<<8}function C(t,e){return I(t,e)|t[e+2]<<16}function j(t,e){return I(t,e)|I(t,e+2)<<16}function O(t,r){var n=1<<r;return e(null!=t),e(0<r),t.X=a(n),null==t.X?0:(t.Mb=32-r,t.Xa=r,1)}function B(t,r){e(null!=t),e(null!=r),e(t.Xa==r.Xa),n(r.X,0,t.X,0,1<<r.Xa)}function M(){this.X=[],this.Xa=this.Mb=0}function E(t,r,n,i){e(null!=n),e(null!=i);var a=n[0],o=i[0];return 0==a&&(a=(t*o+r/2)/r),0==o&&(o=(r*a+t/2)/t),0>=a||0>=o?0:(n[0]=a,i[0]=o,1)}function q(t,e){return t+(1<<e)-1>>>e}function D(t,e){return((4278255360&t)+(4278255360&e)>>>0&4278255360)+((16711935&t)+(16711935&e)>>>0&16711935)>>>0}function R(e,r){t[r]=function(r,n,i,a,o,s,c){var u;for(u=0;u<o;++u){var l=t[e](s[c+u-1],i,a+u);s[c+u]=D(r[n+u],l)}}}function T(){this.ud=this.hd=this.jd=0}function U(t,e){return((4278124286&(t^e))>>>1)+(t&e)>>>0}function z(t){return 0<=t&&256>t?t:0>t?0:255<t?255:void 0}function H(t,e){return z(t+(t-e+.5>>1))}function W(t,e,r){return Math.abs(e-r)-Math.abs(t-r)}function V(t,e,r,n,i,a,o){for(n=a[o-1],r=0;r<i;++r)a[o+r]=n=D(t[e+r],n)}function G(t,e,r,n,i){var a;for(a=0;a<r;++a){var o=t[e+a],s=o>>8&255,c=16711935&(c=(c=16711935&o)+((s<<16)+s));n[i+a]=(4278255360&o)+c>>>0}}function Y(t,e){e.jd=t>>0&255,e.hd=t>>8&255,e.ud=t>>16&255}function J(t,e,r,n,i,a){var o;for(o=0;o<n;++o){var s=e[r+o],c=s>>>8,u=s,l=255&(l=(l=s>>>16)+((t.jd<<24>>24)*(c<<24>>24)>>>5));u=255&(u=(u=u+((t.hd<<24>>24)*(c<<24>>24)>>>5))+((t.ud<<24>>24)*(l<<24>>24)>>>5));i[a+o]=(4278255360&s)+(l<<16)+u}}function X(e,r,n,i,a){t[r]=function(t,e,r,n,o,s,c,u,l){for(n=c;n<u;++n)for(c=0;c<l;++c)o[s++]=a(r[i(t[e++])])},t[e]=function(e,r,o,s,c,u,l){var h=8>>e.b,f=e.Ea,d=e.K[0],p=e.w;if(8>h)for(e=(1<<e.b)-1,p=(1<<h)-1;r<o;++r){var g,m=0;for(g=0;g<f;++g)g&e||(m=i(s[c++])),u[l++]=a(d[m&p]),m>>=h}else t["VP8LMapColor"+n](s,c,d,p,u,l,r,o,f)}}function K(t,e,r,n,i){for(r=e+r;e<r;){var a=t[e++];n[i++]=a>>16&255,n[i++]=a>>8&255,n[i++]=a>>0&255}}function Z(t,e,r,n,i){for(r=e+r;e<r;){var a=t[e++];n[i++]=a>>16&255,n[i++]=a>>8&255,n[i++]=a>>0&255,n[i++]=a>>24&255}}function $(t,e,r,n,i){for(r=e+r;e<r;){var a=(o=t[e++])>>16&240|o>>12&15,o=o>>0&240|o>>28&15;n[i++]=a,n[i++]=o}}function Q(t,e,r,n,i){for(r=e+r;e<r;){var a=(o=t[e++])>>16&248|o>>13&7,o=o>>5&224|o>>3&31;n[i++]=a,n[i++]=o}}function tt(t,e,r,n,i){for(r=e+r;e<r;){var a=t[e++];n[i++]=a>>0&255,n[i++]=a>>8&255,n[i++]=a>>16&255}}function et(t,e,r,i,a,o){if(0==o)for(r=e+r;e<r;)F(i,((o=t[e++])[0]>>24|o[1]>>8&65280|o[2]<<8&16711680|o[3]<<24)>>>0),a+=32;else n(i,a,t,e,r)}function rt(e,r){t[r][0]=t[e+"0"],t[r][1]=t[e+"1"],t[r][2]=t[e+"2"],t[r][3]=t[e+"3"],t[r][4]=t[e+"4"],t[r][5]=t[e+"5"],t[r][6]=t[e+"6"],t[r][7]=t[e+"7"],t[r][8]=t[e+"8"],t[r][9]=t[e+"9"],t[r][10]=t[e+"10"],t[r][11]=t[e+"11"],t[r][12]=t[e+"12"],t[r][13]=t[e+"13"],t[r][14]=t[e+"0"],t[r][15]=t[e+"0"]}function nt(t){return t==Hn||t==Wn||t==Vn||t==Gn}function it(){this.eb=[],this.size=this.A=this.fb=0}function at(){this.y=[],this.f=[],this.ea=[],this.F=[],this.Tc=this.Ed=this.Cd=this.Fd=this.lb=this.Db=this.Ab=this.fa=this.J=this.W=this.N=this.O=0}function ot(){this.Rd=this.height=this.width=this.S=0,this.f={},this.f.RGBA=new it,this.f.kb=new at,this.sd=null}function st(){this.width=[0],this.height=[0],this.Pd=[0],this.Qd=[0],this.format=[0]}function ct(){this.Id=this.fd=this.Md=this.hb=this.ib=this.da=this.bd=this.cd=this.j=this.v=this.Da=this.Sd=this.ob=0}function ut(t){return alert("todo:WebPSamplerProcessPlane"),t.T}function lt(t,e){var r=t.T,i=e.ba.f.RGBA,a=i.eb,o=i.fb+t.ka*i.A,s=vi[e.ba.S],c=t.y,u=t.O,l=t.f,h=t.N,f=t.ea,d=t.W,p=e.cc,g=e.dc,m=e.Mc,v=e.Nc,b=t.ka,y=t.ka+t.T,w=t.U,N=w+1>>1;for(0==b?s(c,u,null,null,l,h,f,d,l,h,f,d,a,o,null,null,w):(s(e.ec,e.fc,c,u,p,g,m,v,l,h,f,d,a,o-i.A,a,o,w),++r);b+2<y;b+=2)p=l,g=h,m=f,v=d,h+=t.Rc,d+=t.Rc,o+=2*i.A,s(c,(u+=2*t.fa)-t.fa,c,u,p,g,m,v,l,h,f,d,a,o-i.A,a,o,w);return u+=t.fa,t.j+y<t.o?(n(e.ec,e.fc,c,u,w),n(e.cc,e.dc,l,h,N),n(e.Mc,e.Nc,f,d,N),r--):1&y||s(c,u,null,null,l,h,f,d,l,h,f,d,a,o+i.A,null,null,w),r}function ht(t,r,n){var i=t.F,a=[t.J];if(null!=i){var o=t.U,s=r.ba.S,c=s==Tn||s==Vn;r=r.ba.f.RGBA;var u=[0],l=t.ka;u[0]=t.T,t.Kb&&(0==l?--u[0]:(--l,a[0]-=t.width),t.j+t.ka+t.T==t.o&&(u[0]=t.o-t.j-l));var h=r.eb;l=r.fb+l*r.A;t=Sn(i,a[0],t.width,o,u,h,l+(c?0:3),r.A),e(n==u),t&&nt(s)&&An(h,l,c,o,u,r.A)}return 0}function ft(t){var e=t.ma,r=e.ba.S,n=11>r,i=r==qn||r==Rn||r==Tn||r==Un||12==r||nt(r);if(e.memory=null,e.Ib=null,e.Jb=null,e.Nd=null,!Mr(e.Oa,t,i?11:12))return 0;if(i&&nt(r)&&br(),t.da)alert("todo:use_scaling");else{if(n){if(e.Ib=ut,t.Kb){if(r=t.U+1>>1,e.memory=a(t.U+2*r),null==e.memory)return 0;e.ec=e.memory,e.fc=0,e.cc=e.ec,e.dc=e.fc+t.U,e.Mc=e.cc,e.Nc=e.dc+r,e.Ib=lt,br()}}else alert("todo:EmitYUV");i&&(e.Jb=ht,n&&mr())}if(n&&!Ci){for(t=0;256>t;++t)ji[t]=89858*(t-128)+_i>>Si,Mi[t]=-22014*(t-128)+_i,Bi[t]=-45773*(t-128),Oi[t]=113618*(t-128)+_i>>Si;for(t=Pi;t<ki;++t)e=76283*(t-16)+_i>>Si,Ei[t-Pi]=Vt(e,255),qi[t-Pi]=Vt(e+8>>4,15);Ci=1}return 1}function dt(t){var r=t.ma,n=t.U,i=t.T;return e(!(1&t.ka)),0>=n||0>=i?0:(n=r.Ib(t,r),null!=r.Jb&&r.Jb(t,r,n),r.Dc+=n,1)}function pt(t){t.ma.memory=null}function gt(t,e,r,n){return 47!=y(t,8)?0:(e[0]=y(t,14)+1,r[0]=y(t,14)+1,n[0]=y(t,1),0!=y(t,3)?0:!t.h)}function mt(t,e){if(4>t)return t+1;var r=t-2>>1;return(2+(1&t)<<r)+y(e,r)+1}function vt(t,e){return 120<e?e-120:1<=(r=((r=$n[e-1])>>4)*t+(8-(15&r)))?r:1;var r}function bt(t,e,r){var n=L(r),i=t[e+=255&n].g-8;return 0<i&&(x(r,r.u+8),n=L(r),e+=t[e].value,e+=n&(1<<i)-1),x(r,r.u+t[e].g),t[e].value}function yt(t,r,n){return n.g+=t.g,n.value+=t.value<<r>>>0,e(8>=n.g),t.g}function wt(t,r,n){var i=t.xc;return e((r=0==i?0:t.vc[t.md*(n>>i)+(r>>i)])<t.Wb),t.Ya[r]}function Nt(t,r,i,a){var o=t.ab,s=t.c*r,c=t.C;r=c+r;var u=i,l=a;for(a=t.Ta,i=t.Ua;0<o--;){var h=t.gc[o],f=c,d=r,p=u,g=l,m=(l=a,u=i,h.Ea);switch(e(f<d),e(d<=h.nc),h.hc){case 2:Gr(p,g,(d-f)*m,l,u);break;case 0:var v=f,b=d,y=l,w=u,N=(_=h).Ea;0==v&&(Wr(p,g,null,null,1,y,w),V(p,g+1,0,0,N-1,y,w+1),g+=N,w+=N,++v);for(var L=1<<_.b,A=L-1,x=q(N,_.b),S=_.K,_=_.w+(v>>_.b)*x;v<b;){var P=S,k=_,F=1;for(Vr(p,g,y,w-N,1,y,w);F<N;){var I=(F&~A)+L;I>N&&(I=N),(0,Zr[P[k++]>>8&15])(p,g+ +F,y,w+F-N,I-F,y,w+F),F=I}g+=N,w+=N,++v&A||(_+=x)}d!=h.nc&&n(l,u-m,l,u+(d-f-1)*m,m);break;case 1:for(m=p,b=g,N=(p=h.Ea)-(w=p&~(y=(g=1<<h.b)-1)),v=q(p,h.b),L=h.K,h=h.w+(f>>h.b)*v;f<d;){for(A=L,x=h,S=new T,_=b+w,P=b+p;b<_;)Y(A[x++],S),$r(S,m,b,g,l,u),b+=g,u+=g;b<P&&(Y(A[x++],S),$r(S,m,b,N,l,u),b+=N,u+=N),++f&y||(h+=v)}break;case 3:if(p==l&&g==u&&0<h.b){for(b=l,p=m=u+(d-f)*m-(w=(d-f)*q(h.Ea,h.b)),g=l,y=u,v=[],w=(N=w)-1;0<=w;--w)v[w]=g[y+w];for(w=N-1;0<=w;--w)b[p+w]=v[w];Yr(h,f,d,l,m,l,u)}else Yr(h,f,d,p,g,l,u)}u=a,l=i}l!=i&&n(a,i,u,l,s)}function Lt(t,r){var n=t.V,i=t.Ba+t.c*t.C,a=r-t.C;if(e(r<=t.l.o),e(16>=a),0<a){var o=t.l,s=t.Ta,c=t.Ua,u=o.width;if(Nt(t,a,n,i),a=c=[c],e((n=t.C)<(i=r)),e(o.v<o.va),i>o.o&&(i=o.o),n<o.j){var l=o.j-n;n=o.j;a[0]+=l*u}if(n>=i?n=0:(a[0]+=4*o.v,o.ka=n-o.j,o.U=o.va-o.v,o.T=i-n,n=1),n){if(c=c[0],11>(n=t.ca).S){var h=n.f.RGBA,f=(i=n.S,a=o.U,o=o.T,l=h.eb,h.A),d=o;for(h=h.fb+t.Ma*h.A;0<d--;){var p=s,g=c,m=a,v=l,b=h;switch(i){case En:Qr(p,g,m,v,b);break;case qn:tn(p,g,m,v,b);break;case Hn:tn(p,g,m,v,b),An(v,b,0,m,1,0);break;case Dn:nn(p,g,m,v,b);break;case Rn:et(p,g,m,v,b,1);break;case Wn:et(p,g,m,v,b,1),An(v,b,0,m,1,0);break;case Tn:et(p,g,m,v,b,0);break;case Vn:et(p,g,m,v,b,0),An(v,b,1,m,1,0);break;case Un:en(p,g,m,v,b);break;case Gn:en(p,g,m,v,b),xn(v,b,m,1,0);break;case zn:rn(p,g,m,v,b);break;default:e(0)}c+=u,h+=f}t.Ma+=o}else alert("todo:EmitRescaledRowsYUVA");e(t.Ma<=n.height)}}t.C=r,e(t.C<=t.i)}function At(t){var e;if(0<t.ua)return 0;for(e=0;e<t.Wb;++e){var r=t.Ya[e].G,n=t.Ya[e].H;if(0<r[1][n[1]+0].g||0<r[2][n[2]+0].g||0<r[3][n[3]+0].g)return 0}return 1}function xt(t,r,n,i,a,o){if(0!=t.Z){var s=t.qd,c=t.rd;for(e(null!=mi[t.Z]);r<n;++r)mi[t.Z](s,c,i,a,i,a,o),s=i,c=a,a+=o;t.qd=s,t.rd=c}}function St(t,r){var n=t.l.ma,i=0==n.Z||1==n.Z?t.l.j:t.C;i=t.C<i?i:t.C;if(e(r<=t.l.o),r>i){var a=t.l.width,o=n.ca,s=n.tb+a*i,c=t.V,u=t.Ba+t.c*i,l=t.gc;e(1==t.ab),e(3==l[0].hc),Xr(l[0],i,r,c,u,o,s),xt(n,i,r,o,s,a)}t.C=t.Ma=r}function _t(t,r,n,i,a,o,s){var c=t.$/i,u=t.$%i,l=t.m,h=t.s,f=n+t.$,d=f;a=n+i*a;var p=n+i*o,g=280+h.ua,m=t.Pb?c:16777216,v=0<h.ua?h.Wa:null,b=h.wc,y=f<p?wt(h,u,c):null;e(t.C<o),e(p<=a);var w=!1;t:for(;;){for(;w||f<p;){var N=0;if(c>=m){var _=f-n;e((m=t).Pb),m.wd=m.m,m.xd=_,0<m.s.ua&&B(m.s.Wa,m.s.vb),m=c+ti}if(u&b||(y=wt(h,u,c)),e(null!=y),y.Qb&&(r[f]=y.qb,w=!0),!w)if(S(l),y.jc){N=l,_=r;var P=f,k=y.pd[L(N)&Dr-1];e(y.jc),256>k.g?(x(N,N.u+k.g),_[P]=k.value,N=0):(x(N,N.u+k.g-256),e(256<=k.value),N=k.value),0==N&&(w=!0)}else N=bt(y.G[0],y.H[0],l);if(l.h)break;if(w||256>N){if(!w)if(y.nd)r[f]=(y.qb|N<<8)>>>0;else{if(S(l),w=bt(y.G[1],y.H[1],l),S(l),_=bt(y.G[2],y.H[2],l),P=bt(y.G[3],y.H[3],l),l.h)break;r[f]=(P<<24|w<<16|N<<8|_)>>>0}if(w=!1,++f,++u>=i&&(u=0,++c,null!=s&&c<=o&&!(c%16)&&s(t,c),null!=v))for(;d<f;)N=r[d++],v.X[(506832829*N&4294967295)>>>v.Mb]=N}else if(280>N){if(N=mt(N-256,l),_=bt(y.G[4],y.H[4],l),S(l),_=vt(i,_=mt(_,l)),l.h)break;if(f-n<_||a-f<N)break t;for(P=0;P<N;++P)r[f+P]=r[f+P-_];for(f+=N,u+=N;u>=i;)u-=i,++c,null!=s&&c<=o&&!(c%16)&&s(t,c);if(e(f<=a),u&b&&(y=wt(h,u,c)),null!=v)for(;d<f;)N=r[d++],v.X[(506832829*N&4294967295)>>>v.Mb]=N}else{if(!(N<g))break t;for(w=N-280,e(null!=v);d<f;)N=r[d++],v.X[(506832829*N&4294967295)>>>v.Mb]=N;N=f,e(!(w>>>(_=v).Xa)),r[N]=_.X[w],w=!0}w||e(l.h==A(l))}if(t.Pb&&l.h&&f<a)e(t.m.h),t.a=5,t.m=t.wd,t.$=t.xd,0<t.s.ua&&B(t.s.vb,t.s.Wa);else{if(l.h)break t;null!=s&&s(t,c>o?o:c),t.a=0,t.$=f-n}return 1}return t.a=3,0}function Pt(t){e(null!=t),t.vc=null,t.yc=null,t.Ya=null;var r=t.Wa;null!=r&&(r.X=null),t.vb=null,e(null!=t)}function kt(){var e=new or;return null==e?null:(e.a=0,e.xb=gi,rt("Predictor","VP8LPredictors"),rt("Predictor","VP8LPredictors_C"),rt("PredictorAdd","VP8LPredictorsAdd"),rt("PredictorAdd","VP8LPredictorsAdd_C"),Gr=G,$r=J,Qr=K,tn=Z,en=$,rn=Q,nn=tt,t.VP8LMapColor32b=Jr,t.VP8LMapColor8b=Kr,e)}function Ft(t,r,n,s,c){var u=1,f=[t],p=[r],g=s.m,m=s.s,v=null,b=0;t:for(;;){if(n)for(;u&&y(g,1);){var w=f,N=p,A=s,_=1,P=A.m,k=A.gc[A.ab],F=y(P,2);if(A.Oc&1<<F)u=0;else{switch(A.Oc|=1<<F,k.hc=F,k.Ea=w[0],k.nc=N[0],k.K=[null],++A.ab,e(4>=A.ab),F){case 0:case 1:k.b=y(P,3)+2,_=Ft(q(k.Ea,k.b),q(k.nc,k.b),0,A,k.K),k.K=k.K[0];break;case 3:var I,C=y(P,8)+1,j=16<C?0:4<C?1:2<C?2:3;if(w[0]=q(k.Ea,j),k.b=j,I=_=Ft(C,1,0,A,k.K)){var B,M=C,E=k,R=1<<(8>>E.b),T=a(R);if(null==T)I=0;else{var U=E.K[0],z=E.w;for(T[0]=E.K[0][0],B=1;B<1*M;++B)T[B]=D(U[z+B],T[B-1]);for(;B<4*R;++B)T[B]=0;E.K[0]=null,E.K[0]=T,I=1}}_=I;break;case 2:break;default:e(0)}u=_}}if(f=f[0],p=p[0],u&&y(g,1)&&!(u=1<=(b=y(g,4))&&11>=b)){s.a=3;break t}var H;if(H=u)e:{var W,V,G,Y=s,J=f,X=p,K=b,Z=n,$=Y.m,Q=Y.s,tt=[null],et=1,rt=0,nt=Qn[K];r:for(;;){if(Z&&y($,1)){var it=y($,3)+2,at=q(J,it),ot=q(X,it),st=at*ot;if(!Ft(at,ot,0,Y,tt))break r;for(tt=tt[0],Q.xc=it,W=0;W<st;++W){var ct=tt[W]>>8&65535;tt[W]=ct,ct>=et&&(et=ct+1)}}if($.h)break r;for(V=0;5>V;++V){var ut=Xn[V];!V&&0<K&&(ut+=1<<K),rt<ut&&(rt=ut)}var lt=o(et*nt,h),ht=et,ft=o(ht,d);if(null==ft)var dt=null;else e(65536>=ht),dt=ft;var pt=a(rt);if(null==dt||null==pt||null==lt){Y.a=1;break r}var gt=lt;for(W=G=0;W<et;++W){var mt=dt[W],vt=mt.G,bt=mt.H,wt=0,Nt=1,Lt=0;for(V=0;5>V;++V){ut=Xn[V],vt[V]=gt,bt[V]=G,!V&&0<K&&(ut+=1<<K);n:{var At,xt=ut,St=Y,kt=pt,It=gt,Ct=G,jt=0,Ot=St.m,Bt=y(Ot,1);if(i(kt,0,0,xt),Bt){var Mt=y(Ot,1)+1,Et=y(Ot,1),qt=y(Ot,0==Et?1:8);kt[qt]=1,2==Mt&&(kt[qt=y(Ot,8)]=1);var Dt=1}else{var Rt=a(19),Tt=y(Ot,4)+4;if(19<Tt){St.a=3;var Ut=0;break n}for(At=0;At<Tt;++At)Rt[Zn[At]]=y(Ot,3);var zt=void 0,Ht=void 0,Wt=St,Vt=Rt,Gt=xt,Yt=kt,Jt=0,Xt=Wt.m,Kt=8,Zt=o(128,h);i:for(;l(Zt,0,7,Vt,19);){if(y(Xt,1)){var $t=2+2*y(Xt,3);if((zt=2+y(Xt,$t))>Gt)break i}else zt=Gt;for(Ht=0;Ht<Gt&&zt--;){S(Xt);var Qt=Zt[0+(127&L(Xt))];x(Xt,Xt.u+Qt.g);var te=Qt.value;if(16>te)Yt[Ht++]=te,0!=te&&(Kt=te);else{var ee=16==te,re=te-16,ne=Jn[re],ie=y(Xt,Yn[re])+ne;if(Ht+ie>Gt)break i;for(var ae=ee?Kt:0;0<ie--;)Yt[Ht++]=ae}}Jt=1;break i}Jt||(Wt.a=3),Dt=Jt}(Dt=Dt&&!Ot.h)&&(jt=l(It,Ct,8,kt,xt)),Dt&&0!=jt?Ut=jt:(St.a=3,Ut=0)}if(0==Ut)break r;if(Nt&&1==Kn[V]&&(Nt=0==gt[G].g),wt+=gt[G].g,G+=Ut,3>=V){var oe,se=pt[0];for(oe=1;oe<ut;++oe)pt[oe]>se&&(se=pt[oe]);Lt+=se}}if(mt.nd=Nt,mt.Qb=0,Nt&&(mt.qb=(vt[3][bt[3]+0].value<<24|vt[1][bt[1]+0].value<<16|vt[2][bt[2]+0].value)>>>0,0==wt&&256>vt[0][bt[0]+0].value&&(mt.Qb=1,mt.qb+=vt[0][bt[0]+0].value<<8)),mt.jc=!mt.Qb&&6>Lt,mt.jc){var ce,ue=mt;for(ce=0;ce<Dr;++ce){var le=ce,he=ue.pd[le],fe=ue.G[0][ue.H[0]+le];256<=fe.value?(he.g=fe.g+256,he.value=fe.value):(he.g=0,he.value=0,le>>=yt(fe,8,he),le>>=yt(ue.G[1][ue.H[1]+le],16,he),le>>=yt(ue.G[2][ue.H[2]+le],0,he),yt(ue.G[3][ue.H[3]+le],24,he))}}}Q.vc=tt,Q.Wb=et,Q.Ya=dt,Q.yc=lt,H=1;break e}H=0}if(!(u=H)){s.a=3;break t}if(0<b){if(m.ua=1<<b,!O(m.Wa,b)){s.a=1,u=0;break t}}else m.ua=0;var de=s,pe=f,ge=p,me=de.s,ve=me.xc;if(de.c=pe,de.i=ge,me.md=q(pe,ve),me.wc=0==ve?-1:(1<<ve)-1,n){s.xb=pi;break t}if(null==(v=a(f*p))){s.a=1,u=0;break t}u=(u=_t(s,v,0,f,p,p,null))&&!g.h;break t}return u?(null!=c?c[0]=v:(e(null==v),e(n)),s.$=0,n||Pt(m)):Pt(m),u}function It(t,r){var n=t.c*t.i,i=n+r+16*r;return e(t.c<=r),t.V=a(i),null==t.V?(t.Ta=null,t.Ua=0,t.a=1,0):(t.Ta=t.V,t.Ua=t.Ba+n+r,1)}function Ct(t,r){var n=t.C,i=r-n,a=t.V,o=t.Ba+t.c*n;for(e(r<=t.l.o);0<i;){var s=16<i?16:i,c=t.l.ma,u=t.l.width,l=u*s,h=c.ca,f=c.tb+u*n,d=t.Ta,p=t.Ua;Nt(t,s,a,o),_n(d,p,h,f,l),xt(c,n,n+s,h,f,u),i-=s,a+=s*t.c,n+=s}e(n==r),t.C=t.Ma=r}function jt(){this.ub=this.yd=this.td=this.Rb=0}function Ot(){this.Kd=this.Ld=this.Ud=this.Td=this.i=this.c=0}function Bt(){this.Fb=this.Bb=this.Cb=0,this.Zb=a(4),this.Lb=a(4)}function Mt(){this.Yb=function(){var t=[];return function t(e,r,n){for(var i=n[r],a=0;a<i&&(e.push(n.length>r+1?[]:0),!(n.length<r+1));a++)t(e[a],r+1,n)}(t,0,[3,11]),t}()}function Et(){this.jb=a(3),this.Wc=s([4,8],Mt),this.Xc=s([4,17],Mt)}function qt(){this.Pc=this.wb=this.Tb=this.zd=0,this.vd=new a(4),this.od=new a(4)}function Dt(){this.ld=this.La=this.dd=this.tc=0}function Rt(){this.Na=this.la=0}function Tt(){this.Sc=[0,0],this.Eb=[0,0],this.Qc=[0,0],this.ia=this.lc=0}function Ut(){this.ad=a(384),this.Za=0,this.Ob=a(16),this.$b=this.Ad=this.ia=this.Gc=this.Hc=this.Dd=0}function zt(){this.uc=this.M=this.Nb=0,this.wa=Array(new Dt),this.Y=0,this.ya=Array(new Ut),this.aa=0,this.l=new Gt}function Ht(){this.y=a(16),this.f=a(8),this.ea=a(8)}function Wt(){this.cb=this.a=0,this.sc="",this.m=new w,this.Od=new jt,this.Kc=new Ot,this.ed=new qt,this.Qa=new Bt,this.Ic=this.$c=this.Aa=0,this.D=new zt,this.Xb=this.Va=this.Hb=this.zb=this.yb=this.Ub=this.za=0,this.Jc=o(8,w),this.ia=0,this.pb=o(4,Tt),this.Pa=new Et,this.Bd=this.kc=0,this.Ac=[],this.Bc=0,this.zc=[0,0,0,0],this.Gd=Array(new Ht),this.Hd=0,this.rb=Array(new Rt),this.sb=0,this.wa=Array(new Dt),this.Y=0,this.oc=[],this.pc=0,this.sa=[],this.ta=0,this.qa=[],this.ra=0,this.Ha=[],this.B=this.R=this.Ia=0,this.Ec=[],this.M=this.ja=this.Vb=this.Fc=0,this.ya=Array(new Ut),this.L=this.aa=0,this.gd=s([4,2],Dt),this.ga=null,this.Fa=[],this.Cc=this.qc=this.P=0,this.Gb=[],this.Uc=0,this.mb=[],this.nb=0,this.rc=[],this.Ga=this.Vc=0}function Vt(t,e){return 0>t?0:t>e?e:t}function Gt(){this.T=this.U=this.ka=this.height=this.width=0,this.y=[],this.f=[],this.ea=[],this.Rc=this.fa=this.W=this.N=this.O=0,this.ma="void",this.put="VP8IoPutHook",this.ac="VP8IoSetupHook",this.bc="VP8IoTeardownHook",this.ha=this.Kb=0,this.data=[],this.hb=this.ib=this.da=this.o=this.j=this.va=this.v=this.Da=this.ob=this.w=0,this.F=[],this.J=0}function Yt(){var t=new Wt;return null!=t&&(t.a=0,t.sc="OK",t.cb=0,t.Xb=0,ni||(ni=Zt)),t}function Jt(t,e,r){return 0==t.a&&(t.a=e,t.sc=r,t.cb=0),0}function Xt(t,e,r){return 3<=r&&157==t[e+0]&&1==t[e+1]&&42==t[e+2]}function Kt(t,r){if(null==t)return 0;if(t.a=0,t.sc="OK",null==r)return Jt(t,2,"null VP8Io passed to VP8GetHeaders()");var n=r.data,a=r.w,o=r.ha;if(4>o)return Jt(t,7,"Truncated header.");var s=n[a+0]|n[a+1]<<8|n[a+2]<<16,c=t.Od;if(c.Rb=!(1&s),c.td=s>>1&7,c.yd=s>>4&1,c.ub=s>>5,3<c.td)return Jt(t,3,"Incorrect keyframe parameters.");if(!c.yd)return Jt(t,4,"Frame not displayable.");a+=3,o-=3;var u=t.Kc;if(c.Rb){if(7>o)return Jt(t,7,"cannot parse picture header");if(!Xt(n,a,o))return Jt(t,3,"Bad code word");u.c=16383&(n[a+4]<<8|n[a+3]),u.Td=n[a+4]>>6,u.i=16383&(n[a+6]<<8|n[a+5]),u.Ud=n[a+6]>>6,a+=7,o-=7,t.za=u.c+15>>4,t.Ub=u.i+15>>4,r.width=u.c,r.height=u.i,r.Da=0,r.j=0,r.v=0,r.va=r.width,r.o=r.height,r.da=0,r.ib=r.width,r.hb=r.height,r.U=r.width,r.T=r.height,i((s=t.Pa).jb,0,255,s.jb.length),e(null!=(s=t.Qa)),s.Cb=0,s.Bb=0,s.Fb=1,i(s.Zb,0,0,s.Zb.length),i(s.Lb,0,0,s.Lb)}if(c.ub>o)return Jt(t,7,"bad partition length");p(s=t.m,n,a,c.ub),a+=c.ub,o-=c.ub,c.Rb&&(u.Ld=P(s),u.Kd=P(s)),u=t.Qa;var l,h=t.Pa;if(e(null!=s),e(null!=u),u.Cb=P(s),u.Cb){if(u.Bb=P(s),P(s)){for(u.Fb=P(s),l=0;4>l;++l)u.Zb[l]=P(s)?m(s,7):0;for(l=0;4>l;++l)u.Lb[l]=P(s)?m(s,6):0}if(u.Bb)for(l=0;3>l;++l)h.jb[l]=P(s)?g(s,8):255}else u.Bb=0;if(s.Ka)return Jt(t,3,"cannot parse segment header");if((u=t.ed).zd=P(s),u.Tb=g(s,6),u.wb=g(s,3),u.Pc=P(s),u.Pc&&P(s)){for(h=0;4>h;++h)P(s)&&(u.vd[h]=m(s,6));for(h=0;4>h;++h)P(s)&&(u.od[h]=m(s,6))}if(t.L=0==u.Tb?0:u.zd?1:2,s.Ka)return Jt(t,3,"cannot parse filter header");var f=o;if(o=l=a,a=l+f,u=f,t.Xb=(1<<g(t.m,2))-1,f<3*(h=t.Xb))n=7;else{for(l+=3*h,u-=3*h,f=0;f<h;++f){var d=n[o+0]|n[o+1]<<8|n[o+2]<<16;d>u&&(d=u),p(t.Jc[+f],n,l,d),l+=d,u-=d,o+=3}p(t.Jc[+h],n,l,u),n=l<a?0:5}if(0!=n)return Jt(t,n,"cannot parse partitions");for(n=g(l=t.m,7),o=P(l)?m(l,4):0,a=P(l)?m(l,4):0,u=P(l)?m(l,4):0,h=P(l)?m(l,4):0,l=P(l)?m(l,4):0,f=t.Qa,d=0;4>d;++d){if(f.Cb){var v=f.Zb[d];f.Fb||(v+=n)}else{if(0<d){t.pb[d]=t.pb[0];continue}v=n}var b=t.pb[d];b.Sc[0]=ei[Vt(v+o,127)],b.Sc[1]=ri[Vt(v+0,127)],b.Eb[0]=2*ei[Vt(v+a,127)],b.Eb[1]=101581*ri[Vt(v+u,127)]>>16,8>b.Eb[1]&&(b.Eb[1]=8),b.Qc[0]=ei[Vt(v+h,117)],b.Qc[1]=ri[Vt(v+l,127)],b.lc=v+l}if(!c.Rb)return Jt(t,4,"Not a key frame.");for(P(s),c=t.Pa,n=0;4>n;++n){for(o=0;8>o;++o)for(a=0;3>a;++a)for(u=0;11>u;++u)h=k(s,ui[n][o][a][u])?g(s,8):si[n][o][a][u],c.Wc[n][o].Yb[a][u]=h;for(o=0;17>o;++o)c.Xc[n][o]=c.Wc[n][li[o]]}return t.kc=P(s),t.kc&&(t.Bd=g(s,8)),t.cb=1}function Zt(t,e,r,n,i,a,o){var s=e[i].Yb[r];for(r=0;16>i;++i){if(!k(t,s[r+0]))return i;for(;!k(t,s[r+1]);)if(s=e[++i].Yb[0],r=0,16==i)return 16;var c=e[i+1].Yb;if(k(t,s[r+2])){var u=t,l=0;if(k(u,(f=s)[(h=r)+3]))if(k(u,f[h+6])){for(s=0,h=2*(l=k(u,f[h+8]))+(f=k(u,f[h+9+l])),l=0,f=ii[h];f[s];++s)l+=l+k(u,f[s]);l+=3+(8<<h)}else k(u,f[h+7])?(l=7+2*k(u,165),l+=k(u,145)):l=5+k(u,159);else l=k(u,f[h+4])?3+k(u,f[h+5]):2;s=c[2]}else l=1,s=c[1];c=o+ai[i],0>(u=t).b&&_(u);var h,f=u.b,d=(h=u.Ca>>1)-(u.I>>f)>>31;--u.b,u.Ca+=d,u.Ca|=1,u.I-=(h+1&d)<<f,a[c]=((l^d)-d)*n[(0<i)+0]}return 16}function $t(t){var e=t.rb[t.sb-1];e.la=0,e.Na=0,i(t.zc,0,0,t.zc.length),t.ja=0}function Qt(t,r){if(null==t)return 0;if(null==r)return Jt(t,2,"NULL VP8Io parameter in VP8Decode().");if(!t.cb&&!Kt(t,r))return 0;if(e(t.cb),null==r.ac||r.ac(r)){r.ob&&(t.L=0);var s=Ri[t.L];if(2==t.L?(t.yb=0,t.zb=0):(t.yb=r.v-s>>4,t.zb=r.j-s>>4,0>t.yb&&(t.yb=0),0>t.zb&&(t.zb=0)),t.Va=r.o+15+s>>4,t.Hb=r.va+15+s>>4,t.Hb>t.za&&(t.Hb=t.za),t.Va>t.Ub&&(t.Va=t.Ub),0<t.L){var c=t.ed;for(s=0;4>s;++s){var u;if(t.Qa.Cb){var l=t.Qa.Lb[s];t.Qa.Fb||(l+=c.Tb)}else l=c.Tb;for(u=0;1>=u;++u){var h=t.gd[s][u],f=l;if(c.Pc&&(f+=c.vd[0],u&&(f+=c.od[0])),0<(f=0>f?0:63<f?63:f)){var d=f;0<c.wb&&((d=4<c.wb?d>>2:d>>1)>9-c.wb&&(d=9-c.wb)),1>d&&(d=1),h.dd=d,h.tc=2*f+d,h.ld=40<=f?2:15<=f?1:0}else h.tc=0;h.La=u}}}s=0}else Jt(t,6,"Frame setup failed"),s=t.a;if(s=0==s){if(s){t.$c=0,0<t.Aa||(t.Ic=Ui);t:{s=t.Ic;c=4*(d=t.za);var p=32*d,g=d+1,m=0<t.L?d*(0<t.Aa?2:1):0,v=(2==t.Aa?2:1)*d;if((h=c+832+(u=3*(16*s+Ri[t.L])/2*p)+(l=null!=t.Fa&&0<t.Fa.length?t.Kc.c*t.Kc.i:0))!=h)s=0;else{if(h>t.Vb){if(t.Vb=0,t.Ec=a(h),t.Fc=0,null==t.Ec){s=Jt(t,1,"no memory during frame initialization.");break t}t.Vb=h}h=t.Ec,f=t.Fc,t.Ac=h,t.Bc=f,f+=c,t.Gd=o(p,Ht),t.Hd=0,t.rb=o(g+1,Rt),t.sb=1,t.wa=m?o(m,Dt):null,t.Y=0,t.D.Nb=0,t.D.wa=t.wa,t.D.Y=t.Y,0<t.Aa&&(t.D.Y+=d),e(!0),t.oc=h,t.pc=f,f+=832,t.ya=o(v,Ut),t.aa=0,t.D.ya=t.ya,t.D.aa=t.aa,2==t.Aa&&(t.D.aa+=d),t.R=16*d,t.B=8*d,d=(p=Ri[t.L])*t.R,p=p/2*t.B,t.sa=h,t.ta=f+d,t.qa=t.sa,t.ra=t.ta+16*s*t.R+p,t.Ha=t.qa,t.Ia=t.ra+8*s*t.B+p,t.$c=0,f+=u,t.mb=l?h:null,t.nb=l?f:null,e(f+l<=t.Fc+t.Vb),$t(t),i(t.Ac,t.Bc,0,c),s=1}}if(s){if(r.ka=0,r.y=t.sa,r.O=t.ta,r.f=t.qa,r.N=t.ra,r.ea=t.Ha,r.Vd=t.Ia,r.fa=t.R,r.Rc=t.B,r.F=null,r.J=0,!Cn){for(s=-255;255>=s;++s)Pn[255+s]=0>s?-s:s;for(s=-1020;1020>=s;++s)kn[1020+s]=-128>s?-128:127<s?127:s;for(s=-112;112>=s;++s)Fn[112+s]=-16>s?-16:15<s?15:s;for(s=-255;510>=s;++s)In[255+s]=0>s?0:255<s?255:s;Cn=1}an=ue,on=ae,cn=oe,un=se,ln=ce,sn=ie,hn=Je,fn=Xe,dn=$e,pn=Qe,gn=Ke,mn=Ze,vn=tr,bn=er,yn=ze,wn=He,Nn=We,Ln=Ve,fi[0]=xe,fi[1]=he,fi[2]=Le,fi[3]=Ae,fi[4]=Se,fi[5]=Pe,fi[6]=_e,fi[7]=ke,fi[8]=Ie,fi[9]=Fe,hi[0]=ve,hi[1]=de,hi[2]=pe,hi[3]=ge,hi[4]=be,hi[5]=ye,hi[6]=we,di[0]=Be,di[1]=fe,di[2]=Ce,di[3]=je,di[4]=Ee,di[5]=Me,di[6]=qe,s=1}else s=0}s&&(s=function(t,r){for(t.M=0;t.M<t.Va;++t.M){var o,s=t.Jc[t.M&t.Xb],c=t.m,u=t;for(o=0;o<u.za;++o){var l=c,h=u,f=h.Ac,d=h.Bc+4*o,p=h.zc,g=h.ya[h.aa+o];if(h.Qa.Bb?g.$b=k(l,h.Pa.jb[0])?2+k(l,h.Pa.jb[2]):k(l,h.Pa.jb[1]):g.$b=0,h.kc&&(g.Ad=k(l,h.Bd)),g.Za=!k(l,145)+0,g.Za){var m=g.Ob,v=0;for(h=0;4>h;++h){var b,y=p[0+h];for(b=0;4>b;++b){y=ci[f[d+b]][y];for(var w=oi[k(l,y[0])];0<w;)w=oi[2*w+k(l,y[w])];y=-w,f[d+b]=y}n(m,v,f,d,4),v+=4,p[0+h]=y}}else y=k(l,156)?k(l,128)?1:3:k(l,163)?2:0,g.Ob[0]=y,i(f,d,y,4),i(p,0,y,4);g.Dd=k(l,142)?k(l,114)?k(l,183)?1:3:2:0}if(u.m.Ka)return Jt(t,7,"Premature end-of-partition0 encountered.");for(;t.ja<t.za;++t.ja){if(u=s,l=(c=t).rb[c.sb-1],f=c.rb[c.sb+c.ja],o=c.ya[c.aa+c.ja],d=c.kc?o.Ad:0)l.la=f.la=0,o.Za||(l.Na=f.Na=0),o.Hc=0,o.Gc=0,o.ia=0;else{var N,L;l=f,f=u,d=c.Pa.Xc,p=c.ya[c.aa+c.ja],g=c.pb[p.$b];if(h=p.ad,m=0,v=c.rb[c.sb-1],y=b=0,i(h,m,0,384),p.Za)var A=0,x=d[3];else{w=a(16);var S=l.Na+v.Na;if(S=ni(f,d[1],S,g.Eb,0,w,0),l.Na=v.Na=(0<S)+0,1<S)an(w,0,h,m);else{var _=w[0]+3>>3;for(w=0;256>w;w+=16)h[m+w]=_}A=1,x=d[0]}var P=15&l.la,F=15&v.la;for(w=0;4>w;++w){var I=1&F;for(_=L=0;4>_;++_)P=P>>1|(I=(S=ni(f,x,S=I+(1&P),g.Sc,A,h,m))>A)<<7,L=L<<2|(3<S?3:1<S?2:0!=h[m+0]),m+=16;P>>=4,F=F>>1|I<<7,b=(b<<8|L)>>>0}for(x=P,A=F>>4,N=0;4>N;N+=2){for(L=0,P=l.la>>4+N,F=v.la>>4+N,w=0;2>w;++w){for(I=1&F,_=0;2>_;++_)S=I+(1&P),P=P>>1|(I=0<(S=ni(f,d[2],S,g.Qc,0,h,m)))<<3,L=L<<2|(3<S?3:1<S?2:0!=h[m+0]),m+=16;P>>=2,F=F>>1|I<<5}y|=L<<4*N,x|=P<<4<<N,A|=(240&F)<<N}l.la=x,v.la=A,p.Hc=b,p.Gc=y,p.ia=43690&y?0:g.ia,d=!(b|y)}if(0<c.L&&(c.wa[c.Y+c.ja]=c.gd[o.$b][o.Za],c.wa[c.Y+c.ja].La|=!d),u.Ka)return Jt(t,7,"Premature end-of-file encountered.")}if($t(t),c=r,u=1,o=(s=t).D,l=0<s.L&&s.M>=s.zb&&s.M<=s.Va,0==s.Aa)t:{if(o.M=s.M,o.uc=l,Or(s,o),u=1,o=(L=s.D).Nb,l=(y=Ri[s.L])*s.R,f=y/2*s.B,w=16*o*s.R,_=8*o*s.B,d=s.sa,p=s.ta-l+w,g=s.qa,h=s.ra-f+_,m=s.Ha,v=s.Ia-f+_,F=0==(P=L.M),b=P>=s.Va-1,2==s.Aa&&Or(s,L),L.uc)for(I=(S=s).D.M,e(S.D.uc),L=S.yb;L<S.Hb;++L){A=L,x=I;var C=(j=(U=S).D).Nb;N=U.R;var j=j.wa[j.Y+A],O=U.sa,B=U.ta+16*C*N+16*A,M=j.dd,E=j.tc;if(0!=E)if(e(3<=E),1==U.L)0<A&&wn(O,B,N,E+4),j.La&&Ln(O,B,N,E),0<x&&yn(O,B,N,E+4),j.La&&Nn(O,B,N,E);else{var q=U.B,D=U.qa,R=U.ra+8*C*q+8*A,T=U.Ha,U=U.Ia+8*C*q+8*A;C=j.ld;0<A&&(fn(O,B,N,E+4,M,C),pn(D,R,T,U,q,E+4,M,C)),j.La&&(mn(O,B,N,E,M,C),bn(D,R,T,U,q,E,M,C)),0<x&&(hn(O,B,N,E+4,M,C),dn(D,R,T,U,q,E+4,M,C)),j.La&&(gn(O,B,N,E,M,C),vn(D,R,T,U,q,E,M,C))}}if(s.ia&&alert("todo:DitherRow"),null!=c.put){if(L=16*P,P=16*(P+1),F?(c.y=s.sa,c.O=s.ta+w,c.f=s.qa,c.N=s.ra+_,c.ea=s.Ha,c.W=s.Ia+_):(L-=y,c.y=d,c.O=p,c.f=g,c.N=h,c.ea=m,c.W=v),b||(P-=y),P>c.o&&(P=c.o),c.F=null,c.J=null,null!=s.Fa&&0<s.Fa.length&&L<P&&(c.J=hr(s,c,L,P-L),c.F=s.mb,null==c.F&&0==c.F.length)){u=Jt(s,3,"Could not decode alpha data.");break t}L<c.j&&(y=c.j-L,L=c.j,e(!(1&y)),c.O+=s.R*y,c.N+=s.B*(y>>1),c.W+=s.B*(y>>1),null!=c.F&&(c.J+=c.width*y)),L<P&&(c.O+=c.v,c.N+=c.v>>1,c.W+=c.v>>1,null!=c.F&&(c.J+=c.v),c.ka=L-c.j,c.U=c.va-c.v,c.T=P-L,u=c.put(c))}o+1!=s.Ic||b||(n(s.sa,s.ta-l,d,p+16*s.R,l),n(s.qa,s.ra-f,g,h+8*s.B,f),n(s.Ha,s.Ia-f,m,v+8*s.B,f))}if(!u)return Jt(t,6,"Output aborted.")}return 1}(t,r)),null!=r.bc&&r.bc(r),s&=1}return s?(t.cb=0,s):0}function te(t,e,r,n,i){i=t[e+r+32*n]+(i>>3),t[e+r+32*n]=-256&i?0>i?0:255:i}function ee(t,e,r,n,i,a){te(t,e,0,r,n+i),te(t,e,1,r,n+a),te(t,e,2,r,n-a),te(t,e,3,r,n-i)}function re(t){return(20091*t>>16)+t}function ne(t,e,r,n){var i,o=0,s=a(16);for(i=0;4>i;++i){var c=t[e+0]+t[e+8],u=t[e+0]-t[e+8],l=(35468*t[e+4]>>16)-re(t[e+12]),h=re(t[e+4])+(35468*t[e+12]>>16);s[o+0]=c+h,s[o+1]=u+l,s[o+2]=u-l,s[o+3]=c-h,o+=4,e++}for(i=o=0;4>i;++i)c=(t=s[o+0]+4)+s[o+8],u=t-s[o+8],l=(35468*s[o+4]>>16)-re(s[o+12]),te(r,n,0,0,c+(h=re(s[o+4])+(35468*s[o+12]>>16))),te(r,n,1,0,u+l),te(r,n,2,0,u-l),te(r,n,3,0,c-h),o++,n+=32}function ie(t,e,r,n){var i=t[e+0]+4,a=35468*t[e+4]>>16,o=re(t[e+4]),s=35468*t[e+1]>>16;ee(r,n,0,i+o,t=re(t[e+1]),s),ee(r,n,1,i+a,t,s),ee(r,n,2,i-a,t,s),ee(r,n,3,i-o,t,s)}function ae(t,e,r,n,i){ne(t,e,r,n),i&&ne(t,e+16,r,n+4)}function oe(t,e,r,n){on(t,e+0,r,n,1),on(t,e+32,r,n+128,1)}function se(t,e,r,n){var i;for(t=t[e+0]+4,i=0;4>i;++i)for(e=0;4>e;++e)te(r,n,e,i,t)}function ce(t,e,r,n){t[e+0]&&un(t,e+0,r,n),t[e+16]&&un(t,e+16,r,n+4),t[e+32]&&un(t,e+32,r,n+128),t[e+48]&&un(t,e+48,r,n+128+4)}function ue(t,e,r,n){var i,o=a(16);for(i=0;4>i;++i){var s=t[e+0+i]+t[e+12+i],c=t[e+4+i]+t[e+8+i],u=t[e+4+i]-t[e+8+i],l=t[e+0+i]-t[e+12+i];o[0+i]=s+c,o[8+i]=s-c,o[4+i]=l+u,o[12+i]=l-u}for(i=0;4>i;++i)s=(t=o[0+4*i]+3)+o[3+4*i],c=o[1+4*i]+o[2+4*i],u=o[1+4*i]-o[2+4*i],l=t-o[3+4*i],r[n+0]=s+c>>3,r[n+16]=l+u>>3,r[n+32]=s-c>>3,r[n+48]=l-u>>3,n+=64}function le(t,e,r){var n,i=e-32,a=Bn,o=255-t[i-1];for(n=0;n<r;++n){var s,c=a,u=o+t[e-1];for(s=0;s<r;++s)t[e+s]=c[u+t[i+s]];e+=32}}function he(t,e){le(t,e,4)}function fe(t,e){le(t,e,8)}function de(t,e){le(t,e,16)}function pe(t,e){var r;for(r=0;16>r;++r)n(t,e+32*r,t,e-32,16)}function ge(t,e){var r;for(r=16;0<r;--r)i(t,e,t[e-1],16),e+=32}function me(t,e,r){var n;for(n=0;16>n;++n)i(e,r+32*n,t,16)}function ve(t,e){var r,n=16;for(r=0;16>r;++r)n+=t[e-1+32*r]+t[e+r-32];me(n>>5,t,e)}function be(t,e){var r,n=8;for(r=0;16>r;++r)n+=t[e-1+32*r];me(n>>4,t,e)}function ye(t,e){var r,n=8;for(r=0;16>r;++r)n+=t[e+r-32];me(n>>4,t,e)}function we(t,e){me(128,t,e)}function Ne(t,e,r){return t+2*e+r+2>>2}function Le(t,e){var r,i=e-32;i=new Uint8Array([Ne(t[i-1],t[i+0],t[i+1]),Ne(t[i+0],t[i+1],t[i+2]),Ne(t[i+1],t[i+2],t[i+3]),Ne(t[i+2],t[i+3],t[i+4])]);for(r=0;4>r;++r)n(t,e+32*r,i,0,i.length)}function Ae(t,e){var r=t[e-1],n=t[e-1+32],i=t[e-1+64],a=t[e-1+96];F(t,e+0,16843009*Ne(t[e-1-32],r,n)),F(t,e+32,16843009*Ne(r,n,i)),F(t,e+64,16843009*Ne(n,i,a)),F(t,e+96,16843009*Ne(i,a,a))}function xe(t,e){var r,n=4;for(r=0;4>r;++r)n+=t[e+r-32]+t[e-1+32*r];for(n>>=3,r=0;4>r;++r)i(t,e+32*r,n,4)}function Se(t,e){var r=t[e-1+0],n=t[e-1+32],i=t[e-1+64],a=t[e-1-32],o=t[e+0-32],s=t[e+1-32],c=t[e+2-32],u=t[e+3-32];t[e+0+96]=Ne(n,i,t[e-1+96]),t[e+1+96]=t[e+0+64]=Ne(r,n,i),t[e+2+96]=t[e+1+64]=t[e+0+32]=Ne(a,r,n),t[e+3+96]=t[e+2+64]=t[e+1+32]=t[e+0+0]=Ne(o,a,r),t[e+3+64]=t[e+2+32]=t[e+1+0]=Ne(s,o,a),t[e+3+32]=t[e+2+0]=Ne(c,s,o),t[e+3+0]=Ne(u,c,s)}function _e(t,e){var r=t[e+1-32],n=t[e+2-32],i=t[e+3-32],a=t[e+4-32],o=t[e+5-32],s=t[e+6-32],c=t[e+7-32];t[e+0+0]=Ne(t[e+0-32],r,n),t[e+1+0]=t[e+0+32]=Ne(r,n,i),t[e+2+0]=t[e+1+32]=t[e+0+64]=Ne(n,i,a),t[e+3+0]=t[e+2+32]=t[e+1+64]=t[e+0+96]=Ne(i,a,o),t[e+3+32]=t[e+2+64]=t[e+1+96]=Ne(a,o,s),t[e+3+64]=t[e+2+96]=Ne(o,s,c),t[e+3+96]=Ne(s,c,c)}function Pe(t,e){var r=t[e-1+0],n=t[e-1+32],i=t[e-1+64],a=t[e-1-32],o=t[e+0-32],s=t[e+1-32],c=t[e+2-32],u=t[e+3-32];t[e+0+0]=t[e+1+64]=a+o+1>>1,t[e+1+0]=t[e+2+64]=o+s+1>>1,t[e+2+0]=t[e+3+64]=s+c+1>>1,t[e+3+0]=c+u+1>>1,t[e+0+96]=Ne(i,n,r),t[e+0+64]=Ne(n,r,a),t[e+0+32]=t[e+1+96]=Ne(r,a,o),t[e+1+32]=t[e+2+96]=Ne(a,o,s),t[e+2+32]=t[e+3+96]=Ne(o,s,c),t[e+3+32]=Ne(s,c,u)}function ke(t,e){var r=t[e+0-32],n=t[e+1-32],i=t[e+2-32],a=t[e+3-32],o=t[e+4-32],s=t[e+5-32],c=t[e+6-32],u=t[e+7-32];t[e+0+0]=r+n+1>>1,t[e+1+0]=t[e+0+64]=n+i+1>>1,t[e+2+0]=t[e+1+64]=i+a+1>>1,t[e+3+0]=t[e+2+64]=a+o+1>>1,t[e+0+32]=Ne(r,n,i),t[e+1+32]=t[e+0+96]=Ne(n,i,a),t[e+2+32]=t[e+1+96]=Ne(i,a,o),t[e+3+32]=t[e+2+96]=Ne(a,o,s),t[e+3+64]=Ne(o,s,c),t[e+3+96]=Ne(s,c,u)}function Fe(t,e){var r=t[e-1+0],n=t[e-1+32],i=t[e-1+64],a=t[e-1+96];t[e+0+0]=r+n+1>>1,t[e+2+0]=t[e+0+32]=n+i+1>>1,t[e+2+32]=t[e+0+64]=i+a+1>>1,t[e+1+0]=Ne(r,n,i),t[e+3+0]=t[e+1+32]=Ne(n,i,a),t[e+3+32]=t[e+1+64]=Ne(i,a,a),t[e+3+64]=t[e+2+64]=t[e+0+96]=t[e+1+96]=t[e+2+96]=t[e+3+96]=a}function Ie(t,e){var r=t[e-1+0],n=t[e-1+32],i=t[e-1+64],a=t[e-1+96],o=t[e-1-32],s=t[e+0-32],c=t[e+1-32],u=t[e+2-32];t[e+0+0]=t[e+2+32]=r+o+1>>1,t[e+0+32]=t[e+2+64]=n+r+1>>1,t[e+0+64]=t[e+2+96]=i+n+1>>1,t[e+0+96]=a+i+1>>1,t[e+3+0]=Ne(s,c,u),t[e+2+0]=Ne(o,s,c),t[e+1+0]=t[e+3+32]=Ne(r,o,s),t[e+1+32]=t[e+3+64]=Ne(n,r,o),t[e+1+64]=t[e+3+96]=Ne(i,n,r),t[e+1+96]=Ne(a,i,n)}function Ce(t,e){var r;for(r=0;8>r;++r)n(t,e+32*r,t,e-32,8)}function je(t,e){var r;for(r=0;8>r;++r)i(t,e,t[e-1],8),e+=32}function Oe(t,e,r){var n;for(n=0;8>n;++n)i(e,r+32*n,t,8)}function Be(t,e){var r,n=8;for(r=0;8>r;++r)n+=t[e+r-32]+t[e-1+32*r];Oe(n>>4,t,e)}function Me(t,e){var r,n=4;for(r=0;8>r;++r)n+=t[e+r-32];Oe(n>>3,t,e)}function Ee(t,e){var r,n=4;for(r=0;8>r;++r)n+=t[e-1+32*r];Oe(n>>3,t,e)}function qe(t,e){Oe(128,t,e)}function De(t,e,r){var n=t[e-r],i=t[e+0],a=3*(i-n)+jn[1020+t[e-2*r]-t[e+r]],o=On[112+(a+4>>3)];t[e-r]=Bn[255+n+On[112+(a+3>>3)]],t[e+0]=Bn[255+i-o]}function Re(t,e,r,n){var i=t[e+0],a=t[e+r];return Mn[255+t[e-2*r]-t[e-r]]>n||Mn[255+a-i]>n}function Te(t,e,r,n){return 4*Mn[255+t[e-r]-t[e+0]]+Mn[255+t[e-2*r]-t[e+r]]<=n}function Ue(t,e,r,n,i){var a=t[e-3*r],o=t[e-2*r],s=t[e-r],c=t[e+0],u=t[e+r],l=t[e+2*r],h=t[e+3*r];return 4*Mn[255+s-c]+Mn[255+o-u]>n?0:Mn[255+t[e-4*r]-a]<=i&&Mn[255+a-o]<=i&&Mn[255+o-s]<=i&&Mn[255+h-l]<=i&&Mn[255+l-u]<=i&&Mn[255+u-c]<=i}function ze(t,e,r,n){var i=2*n+1;for(n=0;16>n;++n)Te(t,e+n,r,i)&&De(t,e+n,r)}function He(t,e,r,n){var i=2*n+1;for(n=0;16>n;++n)Te(t,e+n*r,1,i)&&De(t,e+n*r,1)}function We(t,e,r,n){var i;for(i=3;0<i;--i)ze(t,e+=4*r,r,n)}function Ve(t,e,r,n){var i;for(i=3;0<i;--i)He(t,e+=4,r,n)}function Ge(t,e,r,n,i,a,o,s){for(a=2*a+1;0<i--;){if(Ue(t,e,r,a,o))if(Re(t,e,r,s))De(t,e,r);else{var c=t,u=e,l=r,h=c[u-2*l],f=c[u-l],d=c[u+0],p=c[u+l],g=c[u+2*l],m=27*(b=jn[1020+3*(d-f)+jn[1020+h-p]])+63>>7,v=18*b+63>>7,b=9*b+63>>7;c[u-3*l]=Bn[255+c[u-3*l]+b],c[u-2*l]=Bn[255+h+v],c[u-l]=Bn[255+f+m],c[u+0]=Bn[255+d-m],c[u+l]=Bn[255+p-v],c[u+2*l]=Bn[255+g-b]}e+=n}}function Ye(t,e,r,n,i,a,o,s){for(a=2*a+1;0<i--;){if(Ue(t,e,r,a,o))if(Re(t,e,r,s))De(t,e,r);else{var c=t,u=e,l=r,h=c[u-l],f=c[u+0],d=c[u+l],p=On[112+((g=3*(f-h))+4>>3)],g=On[112+(g+3>>3)],m=p+1>>1;c[u-2*l]=Bn[255+c[u-2*l]+m],c[u-l]=Bn[255+h+g],c[u+0]=Bn[255+f-p],c[u+l]=Bn[255+d-m]}e+=n}}function Je(t,e,r,n,i,a){Ge(t,e,r,1,16,n,i,a)}function Xe(t,e,r,n,i,a){Ge(t,e,1,r,16,n,i,a)}function Ke(t,e,r,n,i,a){var o;for(o=3;0<o;--o)Ye(t,e+=4*r,r,1,16,n,i,a)}function Ze(t,e,r,n,i,a){var o;for(o=3;0<o;--o)Ye(t,e+=4,1,r,16,n,i,a)}function $e(t,e,r,n,i,a,o,s){Ge(t,e,i,1,8,a,o,s),Ge(r,n,i,1,8,a,o,s)}function Qe(t,e,r,n,i,a,o,s){Ge(t,e,1,i,8,a,o,s),Ge(r,n,1,i,8,a,o,s)}function tr(t,e,r,n,i,a,o,s){Ye(t,e+4*i,i,1,8,a,o,s),Ye(r,n+4*i,i,1,8,a,o,s)}function er(t,e,r,n,i,a,o,s){Ye(t,e+4,1,i,8,a,o,s),Ye(r,n+4,1,i,8,a,o,s)}function rr(){this.ba=new ot,this.ec=[],this.cc=[],this.Mc=[],this.Dc=this.Nc=this.dc=this.fc=0,this.Oa=new ct,this.memory=0,this.Ib="OutputFunc",this.Jb="OutputAlphaFunc",this.Nd="OutputRowFunc"}function nr(){this.data=[],this.offset=this.kd=this.ha=this.w=0,this.na=[],this.xa=this.gb=this.Ja=this.Sa=this.P=0}function ir(){this.nc=this.Ea=this.b=this.hc=0,this.K=[],this.w=0}function ar(){this.ua=0,this.Wa=new M,this.vb=new M,this.md=this.xc=this.wc=0,this.vc=[],this.Wb=0,this.Ya=new d,this.yc=new h}function or(){this.xb=this.a=0,this.l=new Gt,this.ca=new ot,this.V=[],this.Ba=0,this.Ta=[],this.Ua=0,this.m=new N,this.Pb=0,this.wd=new N,this.Ma=this.$=this.C=this.i=this.c=this.xd=0,this.s=new ar,this.ab=0,this.gc=o(4,ir),this.Oc=0}function sr(){this.Lc=this.Z=this.$a=this.i=this.c=0,this.l=new Gt,this.ic=0,this.ca=[],this.tb=0,this.qd=null,this.rd=0}function cr(t,e,r,n,i,a,o){for(t=null==t?0:t[e+0],e=0;e<o;++e)i[a+e]=t+r[n+e]&255,t=i[a+e]}function ur(t,e,r,n,i,a,o){var s;if(null==t)cr(null,null,r,n,i,a,o);else for(s=0;s<o;++s)i[a+s]=t[e+s]+r[n+s]&255}function lr(t,e,r,n,i,a,o){if(null==t)cr(null,null,r,n,i,a,o);else{var s,c=t[e+0],u=c,l=c;for(s=0;s<o;++s)u=l+(c=t[e+s])-u,l=r[n+s]+(-256&u?0>u?0:255:u)&255,u=c,i[a+s]=l}}function hr(t,r,i,o){var s=r.width,c=r.o;if(e(null!=t&&null!=r),0>i||0>=o||i+o>c)return null;if(!t.Cc){if(null==t.ga){var u;if(t.ga=new sr,(u=null==t.ga)||(u=r.width*r.o,e(0==t.Gb.length),t.Gb=a(u),t.Uc=0,null==t.Gb?u=0:(t.mb=t.Gb,t.nb=t.Uc,t.rc=null,u=1),u=!u),!u){u=t.ga;var l=t.Fa,h=t.P,f=t.qc,d=t.mb,p=t.nb,g=h+1,m=f-1,b=u.l;if(e(null!=l&&null!=d&&null!=r),mi[0]=null,mi[1]=cr,mi[2]=ur,mi[3]=lr,u.ca=d,u.tb=p,u.c=r.width,u.i=r.height,e(0<u.c&&0<u.i),1>=f)r=0;else if(u.$a=l[h+0]>>0&3,u.Z=l[h+0]>>2&3,u.Lc=l[h+0]>>4&3,h=l[h+0]>>6&3,0>u.$a||1<u.$a||4<=u.Z||1<u.Lc||h)r=0;else if(b.put=dt,b.ac=ft,b.bc=pt,b.ma=u,b.width=r.width,b.height=r.height,b.Da=r.Da,b.v=r.v,b.va=r.va,b.j=r.j,b.o=r.o,u.$a)t:{e(1==u.$a),r=kt();e:for(;;){if(null==r){r=0;break t}if(e(null!=u),u.mc=r,r.c=u.c,r.i=u.i,r.l=u.l,r.l.ma=u,r.l.width=u.c,r.l.height=u.i,r.a=0,v(r.m,l,g,m),!Ft(u.c,u.i,1,r,null))break e;if(1==r.ab&&3==r.gc[0].hc&&At(r.s)?(u.ic=1,l=r.c*r.i,r.Ta=null,r.Ua=0,r.V=a(l),r.Ba=0,null==r.V?(r.a=1,r=0):r=1):(u.ic=0,r=It(r,u.c)),!r)break e;r=1;break t}u.mc=null,r=0}else r=m>=u.c*u.i;u=!r}if(u)return null;1!=t.ga.Lc?t.Ga=0:o=c-i}e(null!=t.ga),e(i+o<=c);t:{if(r=(l=t.ga).c,c=l.l.o,0==l.$a){if(g=t.rc,m=t.Vc,b=t.Fa,h=t.P+1+i*r,f=t.mb,d=t.nb+i*r,e(h<=t.P+t.qc),0!=l.Z)for(e(null!=mi[l.Z]),u=0;u<o;++u)mi[l.Z](g,m,b,h,f,d,r),g=f,m=d,d+=r,h+=r;else for(u=0;u<o;++u)n(f,d,b,h,r),g=f,m=d,d+=r,h+=r;t.rc=g,t.Vc=m}else{if(e(null!=l.mc),r=i+o,e(null!=(u=l.mc)),e(r<=u.i),u.C>=r)r=1;else if(l.ic||mr(),l.ic){l=u.V,g=u.Ba,m=u.c;var y=u.i,w=(b=1,h=u.$/m,f=u.$%m,d=u.m,p=u.s,u.$),N=m*y,L=m*r,x=p.wc,_=w<L?wt(p,f,h):null;e(w<=N),e(r<=y),e(At(p));e:for(;;){for(;!d.h&&w<L;){if(f&x||(_=wt(p,f,h)),e(null!=_),S(d),256>(y=bt(_.G[0],_.H[0],d)))l[g+w]=y,++w,++f>=m&&(f=0,++h<=r&&!(h%16)&&St(u,h));else{if(!(280>y)){b=0;break e}y=mt(y-256,d);var P,k=bt(_.G[4],_.H[4],d);if(S(d),!(w>=(k=vt(m,k=mt(k,d)))&&N-w>=y)){b=0;break e}for(P=0;P<y;++P)l[g+w+P]=l[g+w+P-k];for(w+=y,f+=y;f>=m;)f-=m,++h<=r&&!(h%16)&&St(u,h);w<L&&f&x&&(_=wt(p,f,h))}e(d.h==A(d))}St(u,h>r?r:h);break e}!b||d.h&&w<N?(b=0,u.a=d.h?5:3):u.$=w,r=b}else r=_t(u,u.V,u.Ba,u.c,u.i,r,Ct);if(!r){o=0;break t}}i+o>=c&&(t.Cc=1),o=1}if(!o)return null;if(t.Cc&&(null!=(o=t.ga)&&(o.mc=null),t.ga=null,0<t.Ga))return alert("todo:WebPDequantizeLevels"),null}return t.nb+i*s}function fr(t,e,r,n,i,a){for(;0<i--;){var o,s=t,c=e+(r?1:0),u=t,l=e+(r?0:3);for(o=0;o<n;++o){var h=u[l+4*o];255!=h&&(h*=32897,s[c+4*o+0]=s[c+4*o+0]*h>>23,s[c+4*o+1]=s[c+4*o+1]*h>>23,s[c+4*o+2]=s[c+4*o+2]*h>>23)}e+=a}}function dr(t,e,r,n,i){for(;0<n--;){var a;for(a=0;a<r;++a){var o=t[e+2*a+0],s=15&(u=t[e+2*a+1]),c=4369*s,u=(240&u|u>>4)*c>>16;t[e+2*a+0]=(240&o|o>>4)*c>>16&240|(15&o|o<<4)*c>>16>>4&15,t[e+2*a+1]=240&u|s}e+=i}}function pr(t,e,r,n,i,a,o,s){var c,u,l=255;for(u=0;u<i;++u){for(c=0;c<n;++c){var h=t[e+c];a[o+4*c]=h,l&=h}e+=r,o+=s}return 255!=l}function gr(t,e,r,n,i){var a;for(a=0;a<i;++a)r[n+a]=t[e+a]>>8}function mr(){An=fr,xn=dr,Sn=pr,_n=gr}function vr(r,n,i){t[r]=function(t,r,a,o,s,c,u,l,h,f,d,p,g,m,v,b,y){var w,N=y-1>>1,L=s[c+0]|u[l+0]<<16,A=h[f+0]|d[p+0]<<16;e(null!=t);var x=3*L+A+131074>>2;for(n(t[r+0],255&x,x>>16,g,m),null!=a&&(x=3*A+L+131074>>2,n(a[o+0],255&x,x>>16,v,b)),w=1;w<=N;++w){var S=s[c+w]|u[l+w]<<16,_=h[f+w]|d[p+w]<<16,P=L+S+A+_+524296,k=P+2*(S+A)>>3;x=k+L>>1,L=(P=P+2*(L+_)>>3)+S>>1,n(t[r+2*w-1],255&x,x>>16,g,m+(2*w-1)*i),n(t[r+2*w-0],255&L,L>>16,g,m+(2*w-0)*i),null!=a&&(x=P+A>>1,L=k+_>>1,n(a[o+2*w-1],255&x,x>>16,v,b+(2*w-1)*i),n(a[o+2*w+0],255&L,L>>16,v,b+(2*w+0)*i)),L=S,A=_}1&y||(x=3*L+A+131074>>2,n(t[r+y-1],255&x,x>>16,g,m+(y-1)*i),null!=a&&(x=3*A+L+131074>>2,n(a[o+y-1],255&x,x>>16,v,b+(y-1)*i)))}}function br(){vi[En]=bi,vi[qn]=wi,vi[Dn]=yi,vi[Rn]=Ni,vi[Tn]=Li,vi[Un]=Ai,vi[zn]=xi,vi[Hn]=wi,vi[Wn]=Ni,vi[Vn]=Li,vi[Gn]=Ai}function yr(t){return t&~Ii?0>t?0:255:t>>Fi}function wr(t,e){return yr((19077*t>>8)+(26149*e>>8)-14234)}function Nr(t,e,r){return yr((19077*t>>8)-(6419*e>>8)-(13320*r>>8)+8708)}function Lr(t,e){return yr((19077*t>>8)+(33050*e>>8)-17685)}function Ar(t,e,r,n,i){n[i+0]=wr(t,r),n[i+1]=Nr(t,e,r),n[i+2]=Lr(t,e)}function xr(t,e,r,n,i){n[i+0]=Lr(t,e),n[i+1]=Nr(t,e,r),n[i+2]=wr(t,r)}function Sr(t,e,r,n,i){var a=Nr(t,e,r);e=a<<3&224|Lr(t,e)>>3,n[i+0]=248&wr(t,r)|a>>5,n[i+1]=e}function _r(t,e,r,n,i){var a=240&Lr(t,e)|15;n[i+0]=240&wr(t,r)|Nr(t,e,r)>>4,n[i+1]=a}function Pr(t,e,r,n,i){n[i+0]=255,Ar(t,e,r,n,i+1)}function kr(t,e,r,n,i){xr(t,e,r,n,i),n[i+3]=255}function Fr(t,e,r,n,i){Ar(t,e,r,n,i),n[i+3]=255}function Vt(t,e){return 0>t?0:t>e?e:t}function Ir(e,r,n){t[e]=function(t,e,i,a,o,s,c,u,l){for(var h=u+(-2&l)*n;u!=h;)r(t[e+0],i[a+0],o[s+0],c,u),r(t[e+1],i[a+0],o[s+0],c,u+n),e+=2,++a,++s,u+=2*n;1&l&&r(t[e+0],i[a+0],o[s+0],c,u)}}function Cr(t,e,r){return 0==r?0==t?0==e?6:5:0==e?4:0:r}function jr(t,e,r,n,i){switch(t>>>30){case 3:on(e,r,n,i,0);break;case 2:sn(e,r,n,i);break;case 1:un(e,r,n,i)}}function Or(t,e){var r,a,o=e.M,s=e.Nb,c=t.oc,u=t.pc+40,l=t.oc,h=t.pc+584,f=t.oc,d=t.pc+600;for(r=0;16>r;++r)c[u+32*r-1]=129;for(r=0;8>r;++r)l[h+32*r-1]=129,f[d+32*r-1]=129;for(0<o?c[u-1-32]=l[h-1-32]=f[d-1-32]=129:(i(c,u-32-1,127,21),i(l,h-32-1,127,9),i(f,d-32-1,127,9)),a=0;a<t.za;++a){var p=e.ya[e.aa+a];if(0<a){for(r=-1;16>r;++r)n(c,u+32*r-4,c,u+32*r+12,4);for(r=-1;8>r;++r)n(l,h+32*r-4,l,h+32*r+4,4),n(f,d+32*r-4,f,d+32*r+4,4)}var g=t.Gd,m=t.Hd+a,v=p.ad,b=p.Hc;if(0<o&&(n(c,u-32,g[m].y,0,16),n(l,h-32,g[m].f,0,8),n(f,d-32,g[m].ea,0,8)),p.Za){var y=c,w=u-32+16;for(0<o&&(a>=t.za-1?i(y,w,g[m].y[15],4):n(y,w,g[m+1].y,0,4)),r=0;4>r;r++)y[w+128+r]=y[w+256+r]=y[w+384+r]=y[w+0+r];for(r=0;16>r;++r,b<<=2)y=c,w=u+Di[r],fi[p.Ob[r]](y,w),jr(b,v,16*+r,y,w)}else if(y=Cr(a,o,p.Ob[0]),hi[y](c,u),0!=b)for(r=0;16>r;++r,b<<=2)jr(b,v,16*+r,c,u+Di[r]);for(r=p.Gc,y=Cr(a,o,p.Dd),di[y](l,h),di[y](f,d),b=v,y=l,w=h,255&(p=r>>0)&&(170&p?cn(b,256,y,w):ln(b,256,y,w)),p=f,b=d,255&(r>>=8)&&(170&r?cn(v,320,p,b):ln(v,320,p,b)),o<t.Ub-1&&(n(g[m].y,0,c,u+480,16),n(g[m].f,0,l,h+224,8),n(g[m].ea,0,f,d+224,8)),r=8*s*t.B,g=t.sa,m=t.ta+16*a+16*s*t.R,v=t.qa,p=t.ra+8*a+r,b=t.Ha,y=t.Ia+8*a+r,r=0;16>r;++r)n(g,m+r*t.R,c,u+32*r,16);for(r=0;8>r;++r)n(v,p+r*t.B,l,h+32*r,8),n(b,y+r*t.B,f,d+32*r,8)}}function Br(t,n,i,a,o,s,c,u,l){var h=[0],f=[0],d=0,p=null!=l?l.kd:0,g=null!=l?l:new nr;if(null==t||12>i)return 7;g.data=t,g.w=n,g.ha=i,n=[n],i=[i],g.gb=[g.gb];t:{var m=n,b=i,y=g.gb;if(e(null!=t),e(null!=b),e(null!=y),y[0]=0,12<=b[0]&&!r(t,m[0],"RIFF")){if(r(t,m[0]+8,"WEBP")){y=3;break t}var w=j(t,m[0]+4);if(12>w||4294967286<w){y=3;break t}if(p&&w>b[0]-8){y=7;break t}y[0]=w,m[0]+=12,b[0]-=12}y=0}if(0!=y)return y;for(w=0<g.gb[0],i=i[0];;){t:{var L=t;b=n,y=i;var A=h,x=f,S=m=[0];if((k=d=[d])[0]=0,8>y[0])y=7;else{if(!r(L,b[0],"VP8X")){if(10!=j(L,b[0]+4)){y=3;break t}if(18>y[0]){y=7;break t}var _=j(L,b[0]+8),P=1+C(L,b[0]+12);if(2147483648<=P*(L=1+C(L,b[0]+15))){y=3;break t}null!=S&&(S[0]=_),null!=A&&(A[0]=P),null!=x&&(x[0]=L),b[0]+=18,y[0]-=18,k[0]=1}y=0}}if(d=d[0],m=m[0],0!=y)return y;if(b=!!(2&m),!w&&d)return 3;if(null!=s&&(s[0]=!!(16&m)),null!=c&&(c[0]=b),null!=u&&(u[0]=0),c=h[0],m=f[0],d&&b&&null==l){y=0;break}if(4>i){y=7;break}if(w&&d||!w&&!d&&!r(t,n[0],"ALPH")){i=[i],g.na=[g.na],g.P=[g.P],g.Sa=[g.Sa];t:{_=t,y=n,w=i;var k=g.gb;A=g.na,x=g.P,S=g.Sa;P=22,e(null!=_),e(null!=w),L=y[0];var F=w[0];for(e(null!=A),e(null!=S),A[0]=null,x[0]=null,S[0]=0;;){if(y[0]=L,w[0]=F,8>F){y=7;break t}var I=j(_,L+4);if(4294967286<I){y=3;break t}var O=8+I+1&-2;if(P+=O,0<k&&P>k){y=3;break t}if(!r(_,L,"VP8 ")||!r(_,L,"VP8L")){y=0;break t}if(F[0]<O){y=7;break t}r(_,L,"ALPH")||(A[0]=_,x[0]=L+8,S[0]=I),L+=O,F-=O}}if(i=i[0],g.na=g.na[0],g.P=g.P[0],g.Sa=g.Sa[0],0!=y)break}i=[i],g.Ja=[g.Ja],g.xa=[g.xa];t:if(k=t,y=n,w=i,A=g.gb[0],x=g.Ja,S=g.xa,_=y[0],L=!r(k,_,"VP8 "),P=!r(k,_,"VP8L"),e(null!=k),e(null!=w),e(null!=x),e(null!=S),8>w[0])y=7;else{if(L||P){if(k=j(k,_+4),12<=A&&k>A-12){y=3;break t}if(p&&k>w[0]-8){y=7;break t}x[0]=k,y[0]+=8,w[0]-=8,S[0]=P}else S[0]=5<=w[0]&&47==k[_+0]&&!(k[_+4]>>5),x[0]=w[0];y=0}if(i=i[0],g.Ja=g.Ja[0],g.xa=g.xa[0],n=n[0],0!=y)break;if(4294967286<g.Ja)return 3;if(null==u||b||(u[0]=g.xa?2:1),c=[c],m=[m],g.xa){if(5>i){y=7;break}u=c,p=m,b=s,null==t||5>i?t=0:5<=i&&47==t[n+0]&&!(t[n+4]>>5)?(w=[0],k=[0],A=[0],v(x=new N,t,n,i),gt(x,w,k,A)?(null!=u&&(u[0]=w[0]),null!=p&&(p[0]=k[0]),null!=b&&(b[0]=A[0]),t=1):t=0):t=0}else{if(10>i){y=7;break}u=m,null==t||10>i||!Xt(t,n+3,i-3)?t=0:(p=t[n+0]|t[n+1]<<8|t[n+2]<<16,b=16383&(t[n+7]<<8|t[n+6]),t=16383&(t[n+9]<<8|t[n+8]),1&p||3<(p>>1&7)||!(p>>4&1)||p>>5>=g.Ja||!b||!t?t=0:(c&&(c[0]=b),u&&(u[0]=t),t=1))}if(!t)return 3;if(c=c[0],m=m[0],d&&(h[0]!=c||f[0]!=m))return 3;null!=l&&(l[0]=g,l.offset=n-l.w,e(4294967286>n-l.w),e(l.offset==l.ha-i));break}return 0==y||7==y&&d&&null==l?(null!=s&&(s[0]|=null!=g.na&&0<g.na.length),null!=a&&(a[0]=c),null!=o&&(o[0]=m),0):y}function Mr(t,e,r){var n=e.width,i=e.height,a=0,o=0,s=n,c=i;if(e.Da=null!=t&&0<t.Da,e.Da&&(s=t.cd,c=t.bd,a=t.v,o=t.j,11>r||(a&=-2,o&=-2),0>a||0>o||0>=s||0>=c||a+s>n||o+c>i))return 0;if(e.v=a,e.j=o,e.va=a+s,e.o=o+c,e.U=s,e.T=c,e.da=null!=t&&0<t.da,e.da){if(!E(s,c,r=[t.ib],a=[t.hb]))return 0;e.ib=r[0],e.hb=a[0]}return e.ob=null!=t&&t.ob,e.Kb=null==t||!t.Sd,e.da&&(e.ob=e.ib<3*n/4&&e.hb<3*i/4,e.Kb=0),1}function Er(t){if(null==t)return 2;if(11>t.S){var e=t.f.RGBA;e.fb+=(t.height-1)*e.A,e.A=-e.A}else e=t.f.kb,t=t.height,e.O+=(t-1)*e.fa,e.fa=-e.fa,e.N+=(t-1>>1)*e.Ab,e.Ab=-e.Ab,e.W+=(t-1>>1)*e.Db,e.Db=-e.Db,null!=e.F&&(e.J+=(t-1)*e.lb,e.lb=-e.lb);return 0}function qr(t,e,r,n){if(null==n||0>=t||0>=e)return 2;if(null!=r){if(r.Da){var i=r.cd,o=r.bd,s=-2&r.v,c=-2&r.j;if(0>s||0>c||0>=i||0>=o||s+i>t||c+o>e)return 2;t=i,e=o}if(r.da){if(!E(t,e,i=[r.ib],o=[r.hb]))return 2;t=i[0],e=o[0]}}n.width=t,n.height=e;t:{var u=n.width,l=n.height;if(t=n.S,0>=u||0>=l||!(t>=En&&13>t))t=2;else{if(0>=n.Rd&&null==n.sd){s=o=i=e=0;var h=(c=u*zi[t])*l;if(11>t||(o=(l+1)/2*(e=(u+1)/2),12==t&&(s=(i=u)*l)),null==(l=a(h+2*o+s))){t=1;break t}n.sd=l,11>t?((u=n.f.RGBA).eb=l,u.fb=0,u.A=c,u.size=h):((u=n.f.kb).y=l,u.O=0,u.fa=c,u.Fd=h,u.f=l,u.N=0+h,u.Ab=e,u.Cd=o,u.ea=l,u.W=0+h+o,u.Db=e,u.Ed=o,12==t&&(u.F=l,u.J=0+h+2*o),u.Tc=s,u.lb=i)}if(e=1,i=n.S,o=n.width,s=n.height,i>=En&&13>i)if(11>i)t=n.f.RGBA,e&=(c=Math.abs(t.A))*(s-1)+o<=t.size,e&=c>=o*zi[i],e&=null!=t.eb;else{t=n.f.kb,c=(o+1)/2,h=(s+1)/2,u=Math.abs(t.fa);l=Math.abs(t.Ab);var f=Math.abs(t.Db),d=Math.abs(t.lb),p=d*(s-1)+o;e&=u*(s-1)+o<=t.Fd,e&=l*(h-1)+c<=t.Cd,e=(e&=f*(h-1)+c<=t.Ed)&u>=o&l>=c&f>=c,e&=null!=t.y,e&=null!=t.f,e&=null!=t.ea,12==i&&(e&=d>=o,e&=p<=t.Tc,e&=null!=t.F)}else e=0;t=e?0:2}}return 0!=t||null!=r&&r.fd&&(t=Er(n)),t}var Dr=64,Rr=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535,131071,262143,524287,1048575,2097151,4194303,8388607,16777215],Tr=24,Ur=32,zr=8,Hr=[0,0,1,1,2,2,2,2,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7];R("Predictor0","PredictorAdd0"),t.Predictor0=function(){return 4278190080},t.Predictor1=function(t){return t},t.Predictor2=function(t,e,r){return e[r+0]},t.Predictor3=function(t,e,r){return e[r+1]},t.Predictor4=function(t,e,r){return e[r-1]},t.Predictor5=function(t,e,r){return U(U(t,e[r+1]),e[r+0])},t.Predictor6=function(t,e,r){return U(t,e[r-1])},t.Predictor7=function(t,e,r){return U(t,e[r+0])},t.Predictor8=function(t,e,r){return U(e[r-1],e[r+0])},t.Predictor9=function(t,e,r){return U(e[r+0],e[r+1])},t.Predictor10=function(t,e,r){return U(U(t,e[r-1]),U(e[r+0],e[r+1]))},t.Predictor11=function(t,e,r){var n=e[r+0];return 0>=W(n>>24&255,t>>24&255,(e=e[r-1])>>24&255)+W(n>>16&255,t>>16&255,e>>16&255)+W(n>>8&255,t>>8&255,e>>8&255)+W(255&n,255&t,255&e)?n:t},t.Predictor12=function(t,e,r){var n=e[r+0];return(z((t>>24&255)+(n>>24&255)-((e=e[r-1])>>24&255))<<24|z((t>>16&255)+(n>>16&255)-(e>>16&255))<<16|z((t>>8&255)+(n>>8&255)-(e>>8&255))<<8|z((255&t)+(255&n)-(255&e)))>>>0},t.Predictor13=function(t,e,r){var n=e[r-1];return(H((t=U(t,e[r+0]))>>24&255,n>>24&255)<<24|H(t>>16&255,n>>16&255)<<16|H(t>>8&255,n>>8&255)<<8|H(t>>0&255,n>>0&255))>>>0};var Wr=t.PredictorAdd0;t.PredictorAdd1=V,R("Predictor2","PredictorAdd2"),R("Predictor3","PredictorAdd3"),R("Predictor4","PredictorAdd4"),R("Predictor5","PredictorAdd5"),R("Predictor6","PredictorAdd6"),R("Predictor7","PredictorAdd7"),R("Predictor8","PredictorAdd8"),R("Predictor9","PredictorAdd9"),R("Predictor10","PredictorAdd10"),R("Predictor11","PredictorAdd11"),R("Predictor12","PredictorAdd12"),R("Predictor13","PredictorAdd13");var Vr=t.PredictorAdd2;X("ColorIndexInverseTransform","MapARGB","32b",(function(t){return t>>8&255}),(function(t){return t})),X("VP8LColorIndexInverseTransformAlpha","MapAlpha","8b",(function(t){return t}),(function(t){return t>>8&255}));var Gr,Yr=t.ColorIndexInverseTransform,Jr=t.MapARGB,Xr=t.VP8LColorIndexInverseTransformAlpha,Kr=t.MapAlpha,Zr=t.VP8LPredictorsAdd=[];Zr.length=16,(t.VP8LPredictors=[]).length=16,(t.VP8LPredictorsAdd_C=[]).length=16,(t.VP8LPredictors_C=[]).length=16;var $r,Qr,tn,en,rn,nn,an,on,sn,cn,un,ln,hn,fn,dn,pn,gn,mn,vn,bn,yn,wn,Nn,Ln,An,xn,Sn,_n,Pn=a(511),kn=a(2041),Fn=a(225),In=a(767),Cn=0,jn=kn,On=Fn,Bn=In,Mn=Pn,En=0,qn=1,Dn=2,Rn=3,Tn=4,Un=5,zn=6,Hn=7,Wn=8,Vn=9,Gn=10,Yn=[2,3,7],Jn=[3,3,11],Xn=[280,256,256,256,40],Kn=[0,1,1,1,0],Zn=[17,18,0,1,2,3,4,5,16,6,7,8,9,10,11,12,13,14,15],$n=[24,7,23,25,40,6,39,41,22,26,38,42,56,5,55,57,21,27,54,58,37,43,72,4,71,73,20,28,53,59,70,74,36,44,88,69,75,52,60,3,87,89,19,29,86,90,35,45,68,76,85,91,51,61,104,2,103,105,18,30,102,106,34,46,84,92,67,77,101,107,50,62,120,1,119,121,83,93,17,31,100,108,66,78,118,122,33,47,117,123,49,63,99,109,82,94,0,116,124,65,79,16,32,98,110,48,115,125,81,95,64,114,126,97,111,80,113,127,96,112],Qn=[2954,2956,2958,2962,2970,2986,3018,3082,3212,3468,3980,5004],ti=8,ei=[4,5,6,7,8,9,10,10,11,12,13,14,15,16,17,17,18,19,20,20,21,21,22,22,23,23,24,25,25,26,27,28,29,30,31,32,33,34,35,36,37,37,38,39,40,41,42,43,44,45,46,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,76,77,78,79,80,81,82,83,84,85,86,87,88,89,91,93,95,96,98,100,101,102,104,106,108,110,112,114,116,118,122,124,126,128,130,132,134,136,138,140,143,145,148,151,154,157],ri=[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,119,122,125,128,131,134,137,140,143,146,149,152,155,158,161,164,167,170,173,177,181,185,189,193,197,201,205,209,213,217,221,225,229,234,239,245,249,254,259,264,269,274,279,284],ni=null,ii=[[173,148,140,0],[176,155,140,135,0],[180,157,141,134,130,0],[254,254,243,230,196,177,153,140,133,130,129,0]],ai=[0,1,4,8,5,2,3,6,9,12,13,10,7,11,14,15],oi=[-0,1,-1,2,-2,3,4,6,-3,5,-4,-5,-6,7,-7,8,-8,-9],si=[[[[128,128,128,128,128,128,128,128,128,128,128],[128,128,128,128,128,128,128,128,128,128,128],[128,128,128,128,128,128,128,128,128,128,128]],[[253,136,254,255,228,219,128,128,128,128,128],[189,129,242,255,227,213,255,219,128,128,128],[106,126,227,252,214,209,255,255,128,128,128]],[[1,98,248,255,236,226,255,255,128,128,128],[181,133,238,254,221,234,255,154,128,128,128],[78,134,202,247,198,180,255,219,128,128,128]],[[1,185,249,255,243,255,128,128,128,128,128],[184,150,247,255,236,224,128,128,128,128,128],[77,110,216,255,236,230,128,128,128,128,128]],[[1,101,251,255,241,255,128,128,128,128,128],[170,139,241,252,236,209,255,255,128,128,128],[37,116,196,243,228,255,255,255,128,128,128]],[[1,204,254,255,245,255,128,128,128,128,128],[207,160,250,255,238,128,128,128,128,128,128],[102,103,231,255,211,171,128,128,128,128,128]],[[1,152,252,255,240,255,128,128,128,128,128],[177,135,243,255,234,225,128,128,128,128,128],[80,129,211,255,194,224,128,128,128,128,128]],[[1,1,255,128,128,128,128,128,128,128,128],[246,1,255,128,128,128,128,128,128,128,128],[255,128,128,128,128,128,128,128,128,128,128]]],[[[198,35,237,223,193,187,162,160,145,155,62],[131,45,198,221,172,176,220,157,252,221,1],[68,47,146,208,149,167,221,162,255,223,128]],[[1,149,241,255,221,224,255,255,128,128,128],[184,141,234,253,222,220,255,199,128,128,128],[81,99,181,242,176,190,249,202,255,255,128]],[[1,129,232,253,214,197,242,196,255,255,128],[99,121,210,250,201,198,255,202,128,128,128],[23,91,163,242,170,187,247,210,255,255,128]],[[1,200,246,255,234,255,128,128,128,128,128],[109,178,241,255,231,245,255,255,128,128,128],[44,130,201,253,205,192,255,255,128,128,128]],[[1,132,239,251,219,209,255,165,128,128,128],[94,136,225,251,218,190,255,255,128,128,128],[22,100,174,245,186,161,255,199,128,128,128]],[[1,182,249,255,232,235,128,128,128,128,128],[124,143,241,255,227,234,128,128,128,128,128],[35,77,181,251,193,211,255,205,128,128,128]],[[1,157,247,255,236,231,255,255,128,128,128],[121,141,235,255,225,227,255,255,128,128,128],[45,99,188,251,195,217,255,224,128,128,128]],[[1,1,251,255,213,255,128,128,128,128,128],[203,1,248,255,255,128,128,128,128,128,128],[137,1,177,255,224,255,128,128,128,128,128]]],[[[253,9,248,251,207,208,255,192,128,128,128],[175,13,224,243,193,185,249,198,255,255,128],[73,17,171,221,161,179,236,167,255,234,128]],[[1,95,247,253,212,183,255,255,128,128,128],[239,90,244,250,211,209,255,255,128,128,128],[155,77,195,248,188,195,255,255,128,128,128]],[[1,24,239,251,218,219,255,205,128,128,128],[201,51,219,255,196,186,128,128,128,128,128],[69,46,190,239,201,218,255,228,128,128,128]],[[1,191,251,255,255,128,128,128,128,128,128],[223,165,249,255,213,255,128,128,128,128,128],[141,124,248,255,255,128,128,128,128,128,128]],[[1,16,248,255,255,128,128,128,128,128,128],[190,36,230,255,236,255,128,128,128,128,128],[149,1,255,128,128,128,128,128,128,128,128]],[[1,226,255,128,128,128,128,128,128,128,128],[247,192,255,128,128,128,128,128,128,128,128],[240,128,255,128,128,128,128,128,128,128,128]],[[1,134,252,255,255,128,128,128,128,128,128],[213,62,250,255,255,128,128,128,128,128,128],[55,93,255,128,128,128,128,128,128,128,128]],[[128,128,128,128,128,128,128,128,128,128,128],[128,128,128,128,128,128,128,128,128,128,128],[128,128,128,128,128,128,128,128,128,128,128]]],[[[202,24,213,235,186,191,220,160,240,175,255],[126,38,182,232,169,184,228,174,255,187,128],[61,46,138,219,151,178,240,170,255,216,128]],[[1,112,230,250,199,191,247,159,255,255,128],[166,109,228,252,211,215,255,174,128,128,128],[39,77,162,232,172,180,245,178,255,255,128]],[[1,52,220,246,198,199,249,220,255,255,128],[124,74,191,243,183,193,250,221,255,255,128],[24,71,130,219,154,170,243,182,255,255,128]],[[1,182,225,249,219,240,255,224,128,128,128],[149,150,226,252,216,205,255,171,128,128,128],[28,108,170,242,183,194,254,223,255,255,128]],[[1,81,230,252,204,203,255,192,128,128,128],[123,102,209,247,188,196,255,233,128,128,128],[20,95,153,243,164,173,255,203,128,128,128]],[[1,222,248,255,216,213,128,128,128,128,128],[168,175,246,252,235,205,255,255,128,128,128],[47,116,215,255,211,212,255,255,128,128,128]],[[1,121,236,253,212,214,255,255,128,128,128],[141,84,213,252,201,202,255,219,128,128,128],[42,80,160,240,162,185,255,205,128,128,128]],[[1,1,255,128,128,128,128,128,128,128,128],[244,1,255,128,128,128,128,128,128,128,128],[238,1,255,128,128,128,128,128,128,128,128]]]],ci=[[[231,120,48,89,115,113,120,152,112],[152,179,64,126,170,118,46,70,95],[175,69,143,80,85,82,72,155,103],[56,58,10,171,218,189,17,13,152],[114,26,17,163,44,195,21,10,173],[121,24,80,195,26,62,44,64,85],[144,71,10,38,171,213,144,34,26],[170,46,55,19,136,160,33,206,71],[63,20,8,114,114,208,12,9,226],[81,40,11,96,182,84,29,16,36]],[[134,183,89,137,98,101,106,165,148],[72,187,100,130,157,111,32,75,80],[66,102,167,99,74,62,40,234,128],[41,53,9,178,241,141,26,8,107],[74,43,26,146,73,166,49,23,157],[65,38,105,160,51,52,31,115,128],[104,79,12,27,217,255,87,17,7],[87,68,71,44,114,51,15,186,23],[47,41,14,110,182,183,21,17,194],[66,45,25,102,197,189,23,18,22]],[[88,88,147,150,42,46,45,196,205],[43,97,183,117,85,38,35,179,61],[39,53,200,87,26,21,43,232,171],[56,34,51,104,114,102,29,93,77],[39,28,85,171,58,165,90,98,64],[34,22,116,206,23,34,43,166,73],[107,54,32,26,51,1,81,43,31],[68,25,106,22,64,171,36,225,114],[34,19,21,102,132,188,16,76,124],[62,18,78,95,85,57,50,48,51]],[[193,101,35,159,215,111,89,46,111],[60,148,31,172,219,228,21,18,111],[112,113,77,85,179,255,38,120,114],[40,42,1,196,245,209,10,25,109],[88,43,29,140,166,213,37,43,154],[61,63,30,155,67,45,68,1,209],[100,80,8,43,154,1,51,26,71],[142,78,78,16,255,128,34,197,171],[41,40,5,102,211,183,4,1,221],[51,50,17,168,209,192,23,25,82]],[[138,31,36,171,27,166,38,44,229],[67,87,58,169,82,115,26,59,179],[63,59,90,180,59,166,93,73,154],[40,40,21,116,143,209,34,39,175],[47,15,16,183,34,223,49,45,183],[46,17,33,183,6,98,15,32,183],[57,46,22,24,128,1,54,17,37],[65,32,73,115,28,128,23,128,205],[40,3,9,115,51,192,18,6,223],[87,37,9,115,59,77,64,21,47]],[[104,55,44,218,9,54,53,130,226],[64,90,70,205,40,41,23,26,57],[54,57,112,184,5,41,38,166,213],[30,34,26,133,152,116,10,32,134],[39,19,53,221,26,114,32,73,255],[31,9,65,234,2,15,1,118,73],[75,32,12,51,192,255,160,43,51],[88,31,35,67,102,85,55,186,85],[56,21,23,111,59,205,45,37,192],[55,38,70,124,73,102,1,34,98]],[[125,98,42,88,104,85,117,175,82],[95,84,53,89,128,100,113,101,45],[75,79,123,47,51,128,81,171,1],[57,17,5,71,102,57,53,41,49],[38,33,13,121,57,73,26,1,85],[41,10,67,138,77,110,90,47,114],[115,21,2,10,102,255,166,23,6],[101,29,16,10,85,128,101,196,26],[57,18,10,102,102,213,34,20,43],[117,20,15,36,163,128,68,1,26]],[[102,61,71,37,34,53,31,243,192],[69,60,71,38,73,119,28,222,37],[68,45,128,34,1,47,11,245,171],[62,17,19,70,146,85,55,62,70],[37,43,37,154,100,163,85,160,1],[63,9,92,136,28,64,32,201,85],[75,15,9,9,64,255,184,119,16],[86,6,28,5,64,255,25,248,1],[56,8,17,132,137,255,55,116,128],[58,15,20,82,135,57,26,121,40]],[[164,50,31,137,154,133,25,35,218],[51,103,44,131,131,123,31,6,158],[86,40,64,135,148,224,45,183,128],[22,26,17,131,240,154,14,1,209],[45,16,21,91,64,222,7,1,197],[56,21,39,155,60,138,23,102,213],[83,12,13,54,192,255,68,47,28],[85,26,85,85,128,128,32,146,171],[18,11,7,63,144,171,4,4,246],[35,27,10,146,174,171,12,26,128]],[[190,80,35,99,180,80,126,54,45],[85,126,47,87,176,51,41,20,32],[101,75,128,139,118,146,116,128,85],[56,41,15,176,236,85,37,9,62],[71,30,17,119,118,255,17,18,138],[101,38,60,138,55,70,43,26,142],[146,36,19,30,171,255,97,27,20],[138,45,61,62,219,1,81,188,64],[32,41,20,117,151,142,20,21,163],[112,19,12,61,195,128,48,4,24]]],ui=[[[[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[176,246,255,255,255,255,255,255,255,255,255],[223,241,252,255,255,255,255,255,255,255,255],[249,253,253,255,255,255,255,255,255,255,255]],[[255,244,252,255,255,255,255,255,255,255,255],[234,254,254,255,255,255,255,255,255,255,255],[253,255,255,255,255,255,255,255,255,255,255]],[[255,246,254,255,255,255,255,255,255,255,255],[239,253,254,255,255,255,255,255,255,255,255],[254,255,254,255,255,255,255,255,255,255,255]],[[255,248,254,255,255,255,255,255,255,255,255],[251,255,254,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,253,254,255,255,255,255,255,255,255,255],[251,254,254,255,255,255,255,255,255,255,255],[254,255,254,255,255,255,255,255,255,255,255]],[[255,254,253,255,254,255,255,255,255,255,255],[250,255,254,255,254,255,255,255,255,255,255],[254,255,255,255,255,255,255,255,255,255,255]],[[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]]],[[[217,255,255,255,255,255,255,255,255,255,255],[225,252,241,253,255,255,254,255,255,255,255],[234,250,241,250,253,255,253,254,255,255,255]],[[255,254,255,255,255,255,255,255,255,255,255],[223,254,254,255,255,255,255,255,255,255,255],[238,253,254,254,255,255,255,255,255,255,255]],[[255,248,254,255,255,255,255,255,255,255,255],[249,254,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,253,255,255,255,255,255,255,255,255,255],[247,254,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,253,254,255,255,255,255,255,255,255,255],[252,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,254,254,255,255,255,255,255,255,255,255],[253,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,254,253,255,255,255,255,255,255,255,255],[250,255,255,255,255,255,255,255,255,255,255],[254,255,255,255,255,255,255,255,255,255,255]],[[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]]],[[[186,251,250,255,255,255,255,255,255,255,255],[234,251,244,254,255,255,255,255,255,255,255],[251,251,243,253,254,255,254,255,255,255,255]],[[255,253,254,255,255,255,255,255,255,255,255],[236,253,254,255,255,255,255,255,255,255,255],[251,253,253,254,254,255,255,255,255,255,255]],[[255,254,254,255,255,255,255,255,255,255,255],[254,254,254,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,254,255,255,255,255,255,255,255,255,255],[254,254,255,255,255,255,255,255,255,255,255],[254,255,255,255,255,255,255,255,255,255,255]],[[255,255,255,255,255,255,255,255,255,255,255],[254,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]]],[[[248,255,255,255,255,255,255,255,255,255,255],[250,254,252,254,255,255,255,255,255,255,255],[248,254,249,253,255,255,255,255,255,255,255]],[[255,253,253,255,255,255,255,255,255,255,255],[246,253,253,255,255,255,255,255,255,255,255],[252,254,251,254,254,255,255,255,255,255,255]],[[255,254,252,255,255,255,255,255,255,255,255],[248,254,253,255,255,255,255,255,255,255,255],[253,255,254,254,255,255,255,255,255,255,255]],[[255,251,254,255,255,255,255,255,255,255,255],[245,251,254,255,255,255,255,255,255,255,255],[253,253,254,255,255,255,255,255,255,255,255]],[[255,251,253,255,255,255,255,255,255,255,255],[252,253,254,255,255,255,255,255,255,255,255],[255,254,255,255,255,255,255,255,255,255,255]],[[255,252,255,255,255,255,255,255,255,255,255],[249,255,254,255,255,255,255,255,255,255,255],[255,255,254,255,255,255,255,255,255,255,255]],[[255,255,253,255,255,255,255,255,255,255,255],[250,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]],[[255,255,255,255,255,255,255,255,255,255,255],[254,255,255,255,255,255,255,255,255,255,255],[255,255,255,255,255,255,255,255,255,255,255]]]],li=[0,1,2,3,6,4,5,6,6,6,6,6,6,6,6,7,0],hi=[],fi=[],di=[],pi=1,gi=2,mi=[],vi=[];vr("UpsampleRgbLinePair",Ar,3),vr("UpsampleBgrLinePair",xr,3),vr("UpsampleRgbaLinePair",Fr,4),vr("UpsampleBgraLinePair",kr,4),vr("UpsampleArgbLinePair",Pr,4),vr("UpsampleRgba4444LinePair",_r,2),vr("UpsampleRgb565LinePair",Sr,2);var bi=t.UpsampleRgbLinePair,yi=t.UpsampleBgrLinePair,wi=t.UpsampleRgbaLinePair,Ni=t.UpsampleBgraLinePair,Li=t.UpsampleArgbLinePair,Ai=t.UpsampleRgba4444LinePair,xi=t.UpsampleRgb565LinePair,Si=16,_i=1<<Si-1,Pi=-227,ki=482,Fi=6,Ii=(256<<Fi)-1,Ci=0,ji=a(256),Oi=a(256),Bi=a(256),Mi=a(256),Ei=a(ki-Pi),qi=a(ki-Pi);Ir("YuvToRgbRow",Ar,3),Ir("YuvToBgrRow",xr,3),Ir("YuvToRgbaRow",Fr,4),Ir("YuvToBgraRow",kr,4),Ir("YuvToArgbRow",Pr,4),Ir("YuvToRgba4444Row",_r,2),Ir("YuvToRgb565Row",Sr,2);var Di=[0,4,8,12,128,132,136,140,256,260,264,268,384,388,392,396],Ri=[0,2,8],Ti=[8,7,6,4,4,2,2,2,1,1,1,1],Ui=1;this.WebPDecodeRGBA=function(t,r,n,i,a){var o=qn,s=new rr,c=new ot;s.ba=c,c.S=o,c.width=[c.width],c.height=[c.height];var u=c.width,l=c.height,h=new st;if(null==h||null==t)var f=2;else e(null!=h),f=Br(t,r,n,h.width,h.height,h.Pd,h.Qd,h.format,null);if(0!=f?u=0:(null!=u&&(u[0]=h.width[0]),null!=l&&(l[0]=h.height[0]),u=1),u){c.width=c.width[0],c.height=c.height[0],null!=i&&(i[0]=c.width),null!=a&&(a[0]=c.height);t:{if(i=new Gt,(a=new nr).data=t,a.w=r,a.ha=n,a.kd=1,r=[0],e(null!=a),(0==(t=Br(a.data,a.w,a.ha,null,null,null,r,null,a))||7==t)&&r[0]&&(t=4),0==(r=t)){if(e(null!=s),i.data=a.data,i.w=a.w+a.offset,i.ha=a.ha-a.offset,i.put=dt,i.ac=ft,i.bc=pt,i.ma=s,a.xa){if(null==(t=kt())){s=1;break t}if(function(t,r){var n=[0],i=[0],a=[0];e:for(;;){if(null==t)return 0;if(null==r)return t.a=2,0;if(t.l=r,t.a=0,v(t.m,r.data,r.w,r.ha),!gt(t.m,n,i,a)){t.a=3;break e}if(t.xb=gi,r.width=n[0],r.height=i[0],!Ft(n[0],i[0],1,t,null))break e;return 1}return e(0!=t.a),0}(t,i)){if(i=0==(r=qr(i.width,i.height,s.Oa,s.ba))){e:{i=t;r:for(;;){if(null==i){i=0;break e}if(e(null!=i.s.yc),e(null!=i.s.Ya),e(0<i.s.Wb),e(null!=(n=i.l)),e(null!=(a=n.ma)),0!=i.xb){if(i.ca=a.ba,i.tb=a.tb,e(null!=i.ca),!Mr(a.Oa,n,Rn)){i.a=2;break r}if(!It(i,n.width))break r;if(n.da)break r;if((n.da||nt(i.ca.S))&&mr(),11>i.ca.S||(alert("todo:WebPInitConvertARGBToYUV"),null!=i.ca.f.kb.F&&mr()),i.Pb&&0<i.s.ua&&null==i.s.vb.X&&!O(i.s.vb,i.s.Wa.Xa)){i.a=1;break r}i.xb=0}if(!_t(i,i.V,i.Ba,i.c,i.i,n.o,Lt))break r;a.Dc=i.Ma,i=1;break e}e(0!=i.a),i=0}i=!i}i&&(r=t.a)}else r=t.a}else{if(null==(t=new Yt)){s=1;break t}if(t.Fa=a.na,t.P=a.P,t.qc=a.Sa,Kt(t,i)){if(0==(r=qr(i.width,i.height,s.Oa,s.ba))){if(t.Aa=0,n=s.Oa,e(null!=(a=t)),null!=n){if(0<(u=0>(u=n.Md)?0:100<u?255:255*u/100)){for(l=h=0;4>l;++l)12>(f=a.pb[l]).lc&&(f.ia=u*Ti[0>f.lc?0:f.lc]>>3),h|=f.ia;h&&(alert("todo:VP8InitRandom"),a.ia=1)}a.Ga=n.Id,100<a.Ga?a.Ga=100:0>a.Ga&&(a.Ga=0)}Qt(t,i)||(r=t.a)}}else r=t.a}0==r&&null!=s.Oa&&s.Oa.fd&&(r=Er(s.ba))}s=r}o=0!=s?null:11>o?c.f.RGBA.eb:c.f.kb.y}else o=null;return o};var zi=[3,4,3,4,4,2,2,4,4,4,2,1,1]};function u(t,e){for(var r="",n=0;n<4;n++)r+=String.fromCharCode(t[e++]);return r}function l(t,e){return(t[e+0]<<0|t[e+1]<<8|t[e+2]<<16)>>>0}function h(t,e){return(t[e+0]<<0|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0}new c;var f=[0],d=[0],p=[],g=new c,m=t,v=function(t,e){var r={},n=0,i=!1,a=0,o=0;if(r.frames=[],!
/** @license
     * Copyright (c) 2017 Dominik Homberger
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    https://webpjs.appspot.com
    WebPRiffParser dominikhlbg@gmail.com
    */
function(t,e,r,n){for(var i=0;i<n;i++)if(t[e+i]!=r.charCodeAt(i))return!0;return!1}(t,e,"RIFF",4)){var s,c;h(t,e+=4);for(e+=8;e<t.length;){var f=u(t,e),d=h(t,e+=4);e+=4;var p=d+(1&d);switch(f){case"VP8 ":case"VP8L":void 0===r.frames[n]&&(r.frames[n]={});(v=r.frames[n]).src_off=i?o:e-8,v.src_size=a+d+8,n++,i&&(i=!1,a=0,o=0);break;case"VP8X":(v=r.header={}).feature_flags=t[e];var g=e+4;v.canvas_width=1+l(t,g);g+=3;v.canvas_height=1+l(t,g);g+=3;break;case"ALPH":i=!0,a=p+8,o=e-8;break;case"ANIM":(v=r.header).bgcolor=h(t,e);g=e+4;v.loop_count=(s=t)[(c=g)+0]<<0|s[c+1]<<8;g+=2;break;case"ANMF":var m,v;(v=r.frames[n]={}).offset_x=2*l(t,e),e+=3,v.offset_y=2*l(t,e),e+=3,v.width=1+l(t,e),e+=3,v.height=1+l(t,e),e+=3,v.duration=l(t,e),e+=3,m=t[e++],v.dispose=1&m,v.blend=m>>1&1}"ANMF"!=f&&(e+=p)}return r}}(m,0);v.response=m,v.rgbaoutput=!0,v.dataurl=!1;var b=v.header?v.header:null,y=v.frames?v.frames:null;if(b){b.loop_counter=b.loop_count,f=[b.canvas_height],d=[b.canvas_width];for(var w=0;w<y.length&&0!=y[w].blend;w++);}var N=y[0],L=g.WebPDecodeRGBA(m,N.src_off,N.src_size,d,f);N.rgba=L,N.imgwidth=d[0],N.imgheight=f[0];for(var A=0;A<d[0]*f[0]*4;A++)p[A]=L[A];return this.width=d,this.height=f,this.data=p,this}!function(t){var e=function(){return!0},r=function(e,r,i,u){var l=4,h=o;switch(u){case t.image_compression.FAST:l=1,h=a;break;case t.image_compression.MEDIUM:l=6,h=s;break;case t.image_compression.SLOW:l=9,h=c}var f=_e(e=n(e,r,i,h),{level:l});return t.__addimage__.arrayBufferToBinaryString(f)},n=function(t,e,r,n){for(var i,a,o,s=t.length/e,c=new Uint8Array(t.length+s),u=l(),f=0;f<s;f+=1){if(o=f*e,i=t.subarray(o,o+e),n)c.set(n(i,r,a),o+f);else{for(var d,p=u.length,g=[];d<p;d+=1)g[d]=u[d](i,r,a);var m=h(g.concat());c.set(g[m],o+f)}a=i}return c},i=function(t){var e=Array.apply([],t);return e.unshift(0),e},a=function(t,e){var r,n=[],i=t.length;n[0]=1;for(var a=0;a<i;a+=1)r=t[a-e]||0,n[a+1]=t[a]-r+256&255;return n},o=function(t,e,r){var n,i=[],a=t.length;i[0]=2;for(var o=0;o<a;o+=1)n=r&&r[o]||0,i[o+1]=t[o]-n+256&255;return i},s=function(t,e,r){var n,i,a=[],o=t.length;a[0]=3;for(var s=0;s<o;s+=1)n=t[s-e]||0,i=r&&r[s]||0,a[s+1]=t[s]+256-(n+i>>>1)&255;return a},c=function(t,e,r){var n,i,a,o,s=[],c=t.length;s[0]=4;for(var l=0;l<c;l+=1)n=t[l-e]||0,i=r&&r[l]||0,a=r&&r[l-e]||0,o=u(n,i,a),s[l+1]=t[l]-o+256&255;return s},u=function(t,e,r){if(t===e&&e===r)return t;var n=Math.abs(e-r),i=Math.abs(t-r),a=Math.abs(t+e-r-r);return n<=i&&n<=a?t:i<=a?e:r},l=function(){return[i,a,o,s,c]},h=function(t){var e=t.map((function(t){return t.reduce((function(t,e){return t+Math.abs(e)}),0)}));return e.indexOf(Math.min.apply(null,e))};t.processPNG=function(n,i,a,o){var s,c,u,l,h,f,d,p,g,m,v,b,y,w,N,L=this.decode.FLATE_DECODE,A="";if(this.__addimage__.isArrayBuffer(n)&&(n=new Uint8Array(n)),this.__addimage__.isArrayBufferView(n)){if(n=(u=new Oe(n)).imgData,c=u.bits,s=u.colorSpace,h=u.colors,-1!==[4,6].indexOf(u.colorType)){if(8===u.bits){g=(p=32==u.pixelBitlength?new Uint32Array(u.decodePixels().buffer):16==u.pixelBitlength?new Uint16Array(u.decodePixels().buffer):new Uint8Array(u.decodePixels().buffer)).length,v=new Uint8Array(g*u.colors),m=new Uint8Array(g);var x,S=u.pixelBitlength-u.bits;for(w=0,N=0;w<g;w++){for(y=p[w],x=0;x<S;)v[N++]=y>>>x&255,x+=u.bits;m[w]=y>>>x&255}}if(16===u.bits){g=(p=new Uint32Array(u.decodePixels().buffer)).length,v=new Uint8Array(g*(32/u.pixelBitlength)*u.colors),m=new Uint8Array(g*(32/u.pixelBitlength)),b=u.colors>1,w=0,N=0;for(var _=0;w<g;)y=p[w++],v[N++]=y>>>0&255,b&&(v[N++]=y>>>16&255,y=p[w++],v[N++]=y>>>0&255),m[_++]=y>>>16&255;c=8}o!==t.image_compression.NONE&&e()?(n=r(v,u.width*u.colors,u.colors,o),d=r(m,u.width,1,o)):(n=v,d=m,L=void 0)}if(3===u.colorType&&(s=this.color_spaces.INDEXED,f=u.palette,u.transparency.indexed)){var P=u.transparency.indexed,k=0;for(w=0,g=P.length;w<g;++w)k+=P[w];if((k/=255)===g-1&&-1!==P.indexOf(0))l=[P.indexOf(0)];else if(k!==g){for(p=u.decodePixels(),m=new Uint8Array(p.length),w=0,g=p.length;w<g;w++)m[w]=P[p[w]];d=r(m,u.width,1)}}var F=function(e){var r;switch(e){case t.image_compression.FAST:r=11;break;case t.image_compression.MEDIUM:r=13;break;case t.image_compression.SLOW:r=14;break;default:r=12}return r}(o);return L===this.decode.FLATE_DECODE&&(A="/Predictor "+F+" "),A+="/Colors "+h+" /BitsPerComponent "+c+" /Columns "+u.width,(this.__addimage__.isArrayBuffer(n)||this.__addimage__.isArrayBufferView(n))&&(n=this.__addimage__.arrayBufferToBinaryString(n)),(d&&this.__addimage__.isArrayBuffer(d)||this.__addimage__.isArrayBufferView(d))&&(d=this.__addimage__.arrayBufferToBinaryString(d)),{alias:a,data:n,index:i,filter:L,decodeParameters:A,transparency:l,palette:f,sMask:d,predictor:F,width:u.width,height:u.height,bitsPerComponent:c,colorSpace:s}}}}(M.API),function(t){t.processGIF89A=function(e,r,n,i){var a=new Be(e),o=a.width,s=a.height,c=[];a.decodeAndBlitFrameRGBA(0,c);var u={data:c,width:o,height:s},l=new Ee(100).encode(u,100);return t.processJPEG.call(this,l,r,n,i)},t.processGIF87A=t.processGIF89A}(M.API),qe.prototype.parseHeader=function(){if(this.fileSize=this.datav.getUint32(this.pos,!0),this.pos+=4,this.reserved=this.datav.getUint32(this.pos,!0),this.pos+=4,this.offset=this.datav.getUint32(this.pos,!0),this.pos+=4,this.headerSize=this.datav.getUint32(this.pos,!0),this.pos+=4,this.width=this.datav.getUint32(this.pos,!0),this.pos+=4,this.height=this.datav.getInt32(this.pos,!0),this.pos+=4,this.planes=this.datav.getUint16(this.pos,!0),this.pos+=2,this.bitPP=this.datav.getUint16(this.pos,!0),this.pos+=2,this.compress=this.datav.getUint32(this.pos,!0),this.pos+=4,this.rawSize=this.datav.getUint32(this.pos,!0),this.pos+=4,this.hr=this.datav.getUint32(this.pos,!0),this.pos+=4,this.vr=this.datav.getUint32(this.pos,!0),this.pos+=4,this.colors=this.datav.getUint32(this.pos,!0),this.pos+=4,this.importantColors=this.datav.getUint32(this.pos,!0),this.pos+=4,16===this.bitPP&&this.is_with_alpha&&(this.bitPP=15),this.bitPP<15){var t=0===this.colors?1<<this.bitPP:this.colors;this.palette=new Array(t);for(var e=0;e<t;e++){var r=this.datav.getUint8(this.pos++,!0),n=this.datav.getUint8(this.pos++,!0),i=this.datav.getUint8(this.pos++,!0),a=this.datav.getUint8(this.pos++,!0);this.palette[e]={red:i,green:n,blue:r,quad:a}}}this.height<0&&(this.height*=-1,this.bottom_up=!1)},qe.prototype.parseBGR=function(){this.pos=this.offset;try{var t="bit"+this.bitPP,e=this.width*this.height*4;this.data=new Uint8Array(e),this[t]()}catch(t){i.log("bit decode error:"+t)}},qe.prototype.bit1=function(){var t,e=Math.ceil(this.width/8),r=e%4;for(t=this.height-1;t>=0;t--){for(var n=this.bottom_up?t:this.height-1-t,i=0;i<e;i++)for(var a=this.datav.getUint8(this.pos++,!0),o=n*this.width*4+8*i*4,s=0;s<8&&8*i+s<this.width;s++){var c=this.palette[a>>7-s&1];this.data[o+4*s]=c.blue,this.data[o+4*s+1]=c.green,this.data[o+4*s+2]=c.red,this.data[o+4*s+3]=255}0!==r&&(this.pos+=4-r)}},qe.prototype.bit4=function(){for(var t=Math.ceil(this.width/2),e=t%4,r=this.height-1;r>=0;r--){for(var n=this.bottom_up?r:this.height-1-r,i=0;i<t;i++){var a=this.datav.getUint8(this.pos++,!0),o=n*this.width*4+2*i*4,s=a>>4,c=15&a,u=this.palette[s];if(this.data[o]=u.blue,this.data[o+1]=u.green,this.data[o+2]=u.red,this.data[o+3]=255,2*i+1>=this.width)break;u=this.palette[c],this.data[o+4]=u.blue,this.data[o+4+1]=u.green,this.data[o+4+2]=u.red,this.data[o+4+3]=255}0!==e&&(this.pos+=4-e)}},qe.prototype.bit8=function(){for(var t=this.width%4,e=this.height-1;e>=0;e--){for(var r=this.bottom_up?e:this.height-1-e,n=0;n<this.width;n++){var i=this.datav.getUint8(this.pos++,!0),a=r*this.width*4+4*n;if(i<this.palette.length){var o=this.palette[i];this.data[a]=o.red,this.data[a+1]=o.green,this.data[a+2]=o.blue,this.data[a+3]=255}else this.data[a]=255,this.data[a+1]=255,this.data[a+2]=255,this.data[a+3]=255}0!==t&&(this.pos+=4-t)}},qe.prototype.bit15=function(){for(var t=this.width%3,e=parseInt("11111",2),r=this.height-1;r>=0;r--){for(var n=this.bottom_up?r:this.height-1-r,i=0;i<this.width;i++){var a=this.datav.getUint16(this.pos,!0);this.pos+=2;var o=(a&e)/e*255|0,s=(a>>5&e)/e*255|0,c=(a>>10&e)/e*255|0,u=a>>15?255:0,l=n*this.width*4+4*i;this.data[l]=c,this.data[l+1]=s,this.data[l+2]=o,this.data[l+3]=u}this.pos+=t}},qe.prototype.bit16=function(){for(var t=this.width%3,e=parseInt("11111",2),r=parseInt("111111",2),n=this.height-1;n>=0;n--){for(var i=this.bottom_up?n:this.height-1-n,a=0;a<this.width;a++){var o=this.datav.getUint16(this.pos,!0);this.pos+=2;var s=(o&e)/e*255|0,c=(o>>5&r)/r*255|0,u=(o>>11)/e*255|0,l=i*this.width*4+4*a;this.data[l]=u,this.data[l+1]=c,this.data[l+2]=s,this.data[l+3]=255}this.pos+=t}},qe.prototype.bit24=function(){for(var t=this.height-1;t>=0;t--){for(var e=this.bottom_up?t:this.height-1-t,r=0;r<this.width;r++){var n=this.datav.getUint8(this.pos++,!0),i=this.datav.getUint8(this.pos++,!0),a=this.datav.getUint8(this.pos++,!0),o=e*this.width*4+4*r;this.data[o]=a,this.data[o+1]=i,this.data[o+2]=n,this.data[o+3]=255}this.pos+=this.width%4}},qe.prototype.bit32=function(){for(var t=this.height-1;t>=0;t--)for(var e=this.bottom_up?t:this.height-1-t,r=0;r<this.width;r++){var n=this.datav.getUint8(this.pos++,!0),i=this.datav.getUint8(this.pos++,!0),a=this.datav.getUint8(this.pos++,!0),o=this.datav.getUint8(this.pos++,!0),s=e*this.width*4+4*r;this.data[s]=a,this.data[s+1]=i,this.data[s+2]=n,this.data[s+3]=o}},qe.prototype.getData=function(){return this.data},
/**
   * @license
   * Copyright (c) 2018 Aras Abbasi
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
function(t){t.processBMP=function(e,r,n,i){var a=new qe(e,!1),o=a.width,s=a.height,c={data:a.getData(),width:o,height:s},u=new Ee(100).encode(c,100);return t.processJPEG.call(this,u,r,n,i)}}(M.API),De.prototype.getData=function(){return this.data},
/**
   * @license
   * Copyright (c) 2019 Aras Abbasi
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
function(t){t.processWEBP=function(e,r,n,i){var a=new De(e,!1),o=a.width,s=a.height,c={data:a.getData(),width:o,height:s},u=new Ee(100).encode(c,100);return t.processJPEG.call(this,u,r,n,i)}}(M.API),
/**
   * @license
   *
   * Copyright (c) 2021 Antti Palola, https://github.com/Pantura
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   * ====================================================================
   */
function(t){t.processRGBA=function(t,e,r){for(var n=t.data,i=n.length,a=new Uint8Array(i/4*3),o=new Uint8Array(i/4),s=0,c=0,u=0;u<i;u+=4){var l=n[u],h=n[u+1],f=n[u+2],d=n[u+3];a[s++]=l,a[s++]=h,a[s++]=f,o[c++]=d}var p=this.__addimage__.arrayBufferToBinaryString(a);return{alpha:this.__addimage__.arrayBufferToBinaryString(o),data:p,index:e,alias:r,colorSpace:"DeviceRGB",bitsPerComponent:8,width:t.width,height:t.height}}}(M.API),
/**
   * @license
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
function(t){t.setLanguage=function(t){return void 0===this.internal.languageSettings&&(this.internal.languageSettings={},this.internal.languageSettings.isSubscribed=!1),void 0!=={af:"Afrikaans",sq:"Albanian",ar:"Arabic (Standard)","ar-DZ":"Arabic (Algeria)","ar-BH":"Arabic (Bahrain)","ar-EG":"Arabic (Egypt)","ar-IQ":"Arabic (Iraq)","ar-JO":"Arabic (Jordan)","ar-KW":"Arabic (Kuwait)","ar-LB":"Arabic (Lebanon)","ar-LY":"Arabic (Libya)","ar-MA":"Arabic (Morocco)","ar-OM":"Arabic (Oman)","ar-QA":"Arabic (Qatar)","ar-SA":"Arabic (Saudi Arabia)","ar-SY":"Arabic (Syria)","ar-TN":"Arabic (Tunisia)","ar-AE":"Arabic (U.A.E.)","ar-YE":"Arabic (Yemen)",an:"Aragonese",hy:"Armenian",as:"Assamese",ast:"Asturian",az:"Azerbaijani",eu:"Basque",be:"Belarusian",bn:"Bengali",bs:"Bosnian",br:"Breton",bg:"Bulgarian",my:"Burmese",ca:"Catalan",ch:"Chamorro",ce:"Chechen",zh:"Chinese","zh-HK":"Chinese (Hong Kong)","zh-CN":"Chinese (PRC)","zh-SG":"Chinese (Singapore)","zh-TW":"Chinese (Taiwan)",cv:"Chuvash",co:"Corsican",cr:"Cree",hr:"Croatian",cs:"Czech",da:"Danish",nl:"Dutch (Standard)","nl-BE":"Dutch (Belgian)",en:"English","en-AU":"English (Australia)","en-BZ":"English (Belize)","en-CA":"English (Canada)","en-IE":"English (Ireland)","en-JM":"English (Jamaica)","en-NZ":"English (New Zealand)","en-PH":"English (Philippines)","en-ZA":"English (South Africa)","en-TT":"English (Trinidad & Tobago)","en-GB":"English (United Kingdom)","en-US":"English (United States)","en-ZW":"English (Zimbabwe)",eo:"Esperanto",et:"Estonian",fo:"Faeroese",fj:"Fijian",fi:"Finnish",fr:"French (Standard)","fr-BE":"French (Belgium)","fr-CA":"French (Canada)","fr-FR":"French (France)","fr-LU":"French (Luxembourg)","fr-MC":"French (Monaco)","fr-CH":"French (Switzerland)",fy:"Frisian",fur:"Friulian",gd:"Gaelic (Scots)","gd-IE":"Gaelic (Irish)",gl:"Galacian",ka:"Georgian",de:"German (Standard)","de-AT":"German (Austria)","de-DE":"German (Germany)","de-LI":"German (Liechtenstein)","de-LU":"German (Luxembourg)","de-CH":"German (Switzerland)",el:"Greek",gu:"Gujurati",ht:"Haitian",he:"Hebrew",hi:"Hindi",hu:"Hungarian",is:"Icelandic",id:"Indonesian",iu:"Inuktitut",ga:"Irish",it:"Italian (Standard)","it-CH":"Italian (Switzerland)",ja:"Japanese",kn:"Kannada",ks:"Kashmiri",kk:"Kazakh",km:"Khmer",ky:"Kirghiz",tlh:"Klingon",ko:"Korean","ko-KP":"Korean (North Korea)","ko-KR":"Korean (South Korea)",la:"Latin",lv:"Latvian",lt:"Lithuanian",lb:"Luxembourgish",mk:"North Macedonia",ms:"Malay",ml:"Malayalam",mt:"Maltese",mi:"Maori",mr:"Marathi",mo:"Moldavian",nv:"Navajo",ng:"Ndonga",ne:"Nepali",no:"Norwegian",nb:"Norwegian (Bokmal)",nn:"Norwegian (Nynorsk)",oc:"Occitan",or:"Oriya",om:"Oromo",fa:"Persian","fa-IR":"Persian/Iran",pl:"Polish",pt:"Portuguese","pt-BR":"Portuguese (Brazil)",pa:"Punjabi","pa-IN":"Punjabi (India)","pa-PK":"Punjabi (Pakistan)",qu:"Quechua",rm:"Rhaeto-Romanic",ro:"Romanian","ro-MO":"Romanian (Moldavia)",ru:"Russian","ru-MO":"Russian (Moldavia)",sz:"Sami (Lappish)",sg:"Sango",sa:"Sanskrit",sc:"Sardinian",sd:"Sindhi",si:"Singhalese",sr:"Serbian",sk:"Slovak",sl:"Slovenian",so:"Somani",sb:"Sorbian",es:"Spanish","es-AR":"Spanish (Argentina)","es-BO":"Spanish (Bolivia)","es-CL":"Spanish (Chile)","es-CO":"Spanish (Colombia)","es-CR":"Spanish (Costa Rica)","es-DO":"Spanish (Dominican Republic)","es-EC":"Spanish (Ecuador)","es-SV":"Spanish (El Salvador)","es-GT":"Spanish (Guatemala)","es-HN":"Spanish (Honduras)","es-MX":"Spanish (Mexico)","es-NI":"Spanish (Nicaragua)","es-PA":"Spanish (Panama)","es-PY":"Spanish (Paraguay)","es-PE":"Spanish (Peru)","es-PR":"Spanish (Puerto Rico)","es-ES":"Spanish (Spain)","es-UY":"Spanish (Uruguay)","es-VE":"Spanish (Venezuela)",sx:"Sutu",sw:"Swahili",sv:"Swedish","sv-FI":"Swedish (Finland)","sv-SV":"Swedish (Sweden)",ta:"Tamil",tt:"Tatar",te:"Teluga",th:"Thai",tig:"Tigre",ts:"Tsonga",tn:"Tswana",tr:"Turkish",tk:"Turkmen",uk:"Ukrainian",hsb:"Upper Sorbian",ur:"Urdu",ve:"Venda",vi:"Vietnamese",vo:"Volapuk",wa:"Walloon",cy:"Welsh",xh:"Xhosa",ji:"Yiddish",zu:"Zulu"}[t]&&(this.internal.languageSettings.languageCode=t,!1===this.internal.languageSettings.isSubscribed&&(this.internal.events.subscribe("putCatalog",(function(){this.internal.write("/Lang ("+this.internal.languageSettings.languageCode+")")})),this.internal.languageSettings.isSubscribed=!0)),this}}(M.API),ke=M.API,Fe=ke.getCharWidthsArray=function(t,r){var n,i,a=(r=r||{}).font||this.internal.getFont(),o=r.fontSize||this.internal.getFontSize(),s=r.charSpace||this.internal.getCharSpace(),c=r.widths?r.widths:a.metadata.Unicode.widths,u=c.fof?c.fof:1,l=r.kerning?r.kerning:a.metadata.Unicode.kerning,h=l.fof?l.fof:1,f=!1!==r.doKerning,d=0,p=t.length,g=0,m=c[0]||u,v=[];for(n=0;n<p;n++)i=t.charCodeAt(n),"function"==typeof a.metadata.widthOfString?v.push((a.metadata.widthOfGlyph(a.metadata.characterToGlyph(i))+s*(1e3/o)||0)/1e3):(d=f&&"object"===e(l[i])&&!isNaN(parseInt(l[i][g],10))?l[i][g]/h:0,v.push((c[i]||m)/u+d)),g=i;return v},Ie=ke.getStringUnitWidth=function(t,e){var r=(e=e||{}).fontSize||this.internal.getFontSize(),n=e.font||this.internal.getFont(),i=e.charSpace||this.internal.getCharSpace();return ke.processArabic&&(t=ke.processArabic(t)),"function"==typeof n.metadata.widthOfString?n.metadata.widthOfString(t,r,i)/r:Fe.apply(this,arguments).reduce((function(t,e){return t+e}),0)},Ce=function(t,e,r,n){for(var i=[],a=0,o=t.length,s=0;a!==o&&s+e[a]<r;)s+=e[a],a++;i.push(t.slice(0,a));var c=a;for(s=0;a!==o;)s+e[a]>n&&(i.push(t.slice(c,a)),s=0,c=a),s+=e[a],a++;return c!==a&&i.push(t.slice(c,a)),i},je=function(t,e,r){r||(r={});var n,i,a,o,s,c,u,l=[],h=[l],f=r.textIndent||0,d=0,p=0,g=t.split(" "),m=Fe.apply(this,[" ",r])[0];if(c=-1===r.lineIndent?g[0].length+2:r.lineIndent||0){var v=Array(c).join(" "),b=[];g.map((function(t){(t=t.split(/\s*\n/)).length>1?b=b.concat(t.map((function(t,e){return(e&&t.length?"\n":"")+t}))):b.push(t[0])})),g=b,c=Ie.apply(this,[v,r])}for(a=0,o=g.length;a<o;a++){var y=0;if(n=g[a],c&&"\n"==n[0]&&(n=n.substr(1),y=1),f+d+(p=(i=Fe.apply(this,[n,r])).reduce((function(t,e){return t+e}),0))>e||y){if(p>e){for(s=Ce.apply(this,[n,i,e-(f+d),e]),l.push(s.shift()),l=[s.pop()];s.length;)h.push([s.shift()]);p=i.slice(n.length-(l[0]?l[0].length:0)).reduce((function(t,e){return t+e}),0)}else l=[n];h.push(l),f=p+c,d=m}else l.push(n),f+=d+p,d=m}return u=c?function(t,e){return(e?v:"")+t.join(" ")}:function(t){return t.join(" ")},h.map(u)},ke.splitTextToSize=function(t,e,r){var n,i=(r=r||{}).fontSize||this.internal.getFontSize(),a=function(t){if(t.widths&&t.kerning)return{widths:t.widths,kerning:t.kerning};var e=this.internal.getFont(t.fontName,t.fontStyle);return e.metadata.Unicode?{widths:e.metadata.Unicode.widths||{0:1},kerning:e.metadata.Unicode.kerning||{}}:{font:e.metadata,fontSize:this.internal.getFontSize(),charSpace:this.internal.getCharSpace()}}.call(this,r);n=Array.isArray(t)?t:String(t).split(/\r?\n/);var o=1*this.internal.scaleFactor*e/i;a.textIndent=r.textIndent?1*r.textIndent*this.internal.scaleFactor/i:0,a.lineIndent=r.lineIndent;var s,c,u=[];for(s=0,c=n.length;s<c;s++)u=u.concat(je.apply(this,[n[s],o,a]));return u},function(t){t.__fontmetrics__=t.__fontmetrics__||{};for(var r="klmnopqrstuvwxyz",n={},i={},a=0;a<r.length;a++)n[r[a]]="0123456789abcdef"[a],i["0123456789abcdef"[a]]=r[a];var o=function(t){return"0x"+parseInt(t,10).toString(16)},s=t.__fontmetrics__.compress=function(t){var r,n,a,c,u=["{"];for(var l in t){if(r=t[l],isNaN(parseInt(l,10))?n="'"+l+"'":(l=parseInt(l,10),n=(n=o(l).slice(2)).slice(0,-1)+i[n.slice(-1)]),"number"==typeof r)r<0?(a=o(r).slice(3),c="-"):(a=o(r).slice(2),c=""),a=c+a.slice(0,-1)+i[a.slice(-1)];else{if("object"!==e(r))throw new Error("Don't know what to do with value type "+e(r)+".");a=s(r)}u.push(n+a)}return u.push("}"),u.join("")},c=t.__fontmetrics__.uncompress=function(t){if("string"!=typeof t)throw new Error("Invalid argument passed to uncompress.");for(var e,r,i,a,o={},s=1,c=o,u=[],l="",h="",f=t.length-1,d=1;d<f;d+=1)"'"==(a=t[d])?e?(i=e.join(""),e=void 0):e=[]:e?e.push(a):"{"==a?(u.push([c,i]),c={},i=void 0):"}"==a?((r=u.pop())[0][r[1]]=c,i=void 0,c=r[0]):"-"==a?s=-1:void 0===i?n.hasOwnProperty(a)?(l+=n[a],i=parseInt(l,16)*s,s=1,l=""):l+=a:n.hasOwnProperty(a)?(h+=n[a],c[i]=parseInt(h,16)*s,s=1,i=void 0,h=""):h+=a;return o},u={codePages:["WinAnsiEncoding"],WinAnsiEncoding:c("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}")},l={Unicode:{Courier:u,"Courier-Bold":u,"Courier-BoldOblique":u,"Courier-Oblique":u,Helvetica:u,"Helvetica-Bold":u,"Helvetica-BoldOblique":u,"Helvetica-Oblique":u,"Times-Roman":u,"Times-Bold":u,"Times-BoldItalic":u,"Times-Italic":u}},h={Unicode:{"Courier-Oblique":c("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-BoldItalic":c("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}"),"Helvetica-Bold":c("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),Courier:c("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Courier-BoldOblique":c("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-Bold":c("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}"),Symbol:c("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}"),Helvetica:c("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"),"Helvetica-BoldOblique":c("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),ZapfDingbats:c("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}"),"Courier-Bold":c("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-Italic":c("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}"),"Times-Roman":c("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}"),"Helvetica-Oblique":c("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")}};t.events.push(["addFont",function(t){var e=t.font,r=h.Unicode[e.postScriptName];r&&(e.metadata.Unicode={},e.metadata.Unicode.widths=r.widths,e.metadata.Unicode.kerning=r.kerning);var n=l.Unicode[e.postScriptName];n&&(e.metadata.Unicode.encoding=n,e.encoding=n.codePages[0])}])}(M.API),
/**
   * @license
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
function(t){var e=function(t){for(var e=t.length,r=new Uint8Array(e),n=0;n<e;n++)r[n]=t.charCodeAt(n);return r};t.API.events.push(["addFont",function(r){var n=void 0,i=r.font,a=r.instance;if(!i.isStandardFont){if(void 0===a)throw new Error("Font does not exist in vFS, import fonts or remove declaration doc.addFont('"+i.postScriptName+"').");if("string"!=typeof(n=!1===a.existsFileInVFS(i.postScriptName)?a.loadFile(i.postScriptName):a.getFileFromVFS(i.postScriptName)))throw new Error("Font is not stored as string-data in vFS, import fonts or remove declaration doc.addFont('"+i.postScriptName+"').");!function(r,n){n=/^\x00\x01\x00\x00/.test(n)?e(n):e(c(n)),r.metadata=t.API.TTFFont.open(n),r.metadata.Unicode=r.metadata.Unicode||{encoding:{},kerning:{},widths:[]},r.metadata.glyIdsUsed=[0]}(i,n)}}])}(M),function(n){function a(){return(r.canvg?Promise.resolve(r.canvg):"object"===(void 0===t?"undefined":e(t))&&"undefined"!=typeof module?new Promise((function(t,e){try{t(require("canvg"))}catch(t){e(t)}})):"function"==typeof define&&define.amd?new Promise((function(t,e){try{require(["canvg"],t)}catch(t){e(t)}})):Promise.reject(new Error("Could not load canvg"))).catch((function(t){return Promise.reject(new Error("Could not load canvg: "+t))})).then((function(t){return t.default?t.default:t}))}n.addSvgAsImage=function(t,e,r,n,o,s,c,u){if(isNaN(e)||isNaN(r))throw i.error("jsPDF.addSvgAsImage: Invalid coordinates",arguments),new Error("Invalid coordinates passed to jsPDF.addSvgAsImage");if(isNaN(n)||isNaN(o))throw i.error("jsPDF.addSvgAsImage: Invalid measurements",arguments),new Error("Invalid measurements (width and/or height) passed to jsPDF.addSvgAsImage");var l=document.createElement("canvas");l.width=n,l.height=o;var h=l.getContext("2d");h.fillStyle="#fff",h.fillRect(0,0,l.width,l.height);var f={ignoreMouse:!0,ignoreAnimation:!0,ignoreDimensions:!0},d=this;return a().then((function(e){return e.fromString(h,t,f)}),(function(){return Promise.reject(new Error("Could not load canvg."))})).then((function(t){return t.render(f)})).then((function(){d.addImage(l.toDataURL("image/jpeg",1),e,r,n,o,c,u)}))}}(M.API),
/**
   * @license
   * ====================================================================
   * Copyright (c) 2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   * ====================================================================
   */
function(t){t.putTotalPages=function(t){var e,r=0;parseInt(this.internal.getFont().id.substr(1),10)<15?(e=new RegExp(t,"g"),r=this.internal.getNumberOfPages()):(e=new RegExp(this.pdfEscape16(t,this.internal.getFont()),"g"),r=this.pdfEscape16(this.internal.getNumberOfPages()+"",this.internal.getFont()));for(var n=1;n<=this.internal.getNumberOfPages();n++)for(var i=0;i<this.internal.pages[n].length;i++)this.internal.pages[n][i]=this.internal.pages[n][i].replace(e,r);return this}}(M.API),function(t){t.viewerPreferences=function(t,r){var n;t=t||{},r=r||!1;var i,a,o,s={HideToolbar:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},HideMenubar:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},HideWindowUI:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},FitWindow:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},CenterWindow:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},DisplayDocTitle:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.4},NonFullScreenPageMode:{defaultValue:"UseNone",value:"UseNone",type:"name",explicitSet:!1,valueSet:["UseNone","UseOutlines","UseThumbs","UseOC"],pdfVersion:1.3},Direction:{defaultValue:"L2R",value:"L2R",type:"name",explicitSet:!1,valueSet:["L2R","R2L"],pdfVersion:1.3},ViewArea:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},ViewClip:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},PrintArea:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},PrintClip:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},PrintScaling:{defaultValue:"AppDefault",value:"AppDefault",type:"name",explicitSet:!1,valueSet:["AppDefault","None"],pdfVersion:1.6},Duplex:{defaultValue:"",value:"none",type:"name",explicitSet:!1,valueSet:["Simplex","DuplexFlipShortEdge","DuplexFlipLongEdge","none"],pdfVersion:1.7},PickTrayByPDFSize:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.7},PrintPageRange:{defaultValue:"",value:"",type:"array",explicitSet:!1,valueSet:null,pdfVersion:1.7},NumCopies:{defaultValue:1,value:1,type:"integer",explicitSet:!1,valueSet:null,pdfVersion:1.7}},c=Object.keys(s),u=[],l=0,h=0,f=0;function d(t,e){var r,n=!1;for(r=0;r<t.length;r+=1)t[r]===e&&(n=!0);return n}if(void 0===this.internal.viewerpreferences&&(this.internal.viewerpreferences={},this.internal.viewerpreferences.configuration=JSON.parse(JSON.stringify(s)),this.internal.viewerpreferences.isSubscribed=!1),n=this.internal.viewerpreferences.configuration,"reset"===t||!0===r){var p=c.length;for(f=0;f<p;f+=1)n[c[f]].value=n[c[f]].defaultValue,n[c[f]].explicitSet=!1}if("object"===e(t))for(a in t)if(o=t[a],d(c,a)&&void 0!==o){if("boolean"===n[a].type&&"boolean"==typeof o)n[a].value=o;else if("name"===n[a].type&&d(n[a].valueSet,o))n[a].value=o;else if("integer"===n[a].type&&Number.isInteger(o))n[a].value=o;else if("array"===n[a].type){for(l=0;l<o.length;l+=1)if(i=!0,1===o[l].length&&"number"==typeof o[l][0])u.push(String(o[l]-1));else if(o[l].length>1){for(h=0;h<o[l].length;h+=1)"number"!=typeof o[l][h]&&(i=!1);!0===i&&u.push([o[l][0]-1,o[l][1]-1].join(" "))}n[a].value="["+u.join(" ")+"]"}else n[a].value=n[a].defaultValue;n[a].explicitSet=!0}return!1===this.internal.viewerpreferences.isSubscribed&&(this.internal.events.subscribe("putCatalog",(function(){var t,e=[];for(t in n)!0===n[t].explicitSet&&("name"===n[t].type?e.push("/"+t+" /"+n[t].value):e.push("/"+t+" "+n[t].value));0!==e.length&&this.internal.write("/ViewerPreferences\n<<\n"+e.join("\n")+"\n>>")})),this.internal.viewerpreferences.isSubscribed=!0),this.internal.viewerpreferences.configuration=n,this}}(M.API),
/** ====================================================================
   * @license
   * jsPDF XMP metadata plugin
   * Copyright (c) 2016 Jussi Utunen, u-jussi@suomi24.fi
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   * ====================================================================
   */
function(t){var e=function(){var t='<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:jspdf="'+this.internal.__metadata__.namespaceuri+'"><jspdf:metadata>',e=unescape(encodeURIComponent('<x:xmpmeta xmlns:x="adobe:ns:meta/">')),r=unescape(encodeURIComponent(t)),n=unescape(encodeURIComponent(this.internal.__metadata__.metadata)),i=unescape(encodeURIComponent("</jspdf:metadata></rdf:Description></rdf:RDF>")),a=unescape(encodeURIComponent("</x:xmpmeta>")),o=r.length+n.length+i.length+e.length+a.length;this.internal.__metadata__.metadata_object_number=this.internal.newObject(),this.internal.write("<< /Type /Metadata /Subtype /XML /Length "+o+" >>"),this.internal.write("stream"),this.internal.write(e+r+n+i+a),this.internal.write("endstream"),this.internal.write("endobj")},r=function(){this.internal.__metadata__.metadata_object_number&&this.internal.write("/Metadata "+this.internal.__metadata__.metadata_object_number+" 0 R")};t.addMetadata=function(t,n){return void 0===this.internal.__metadata__&&(this.internal.__metadata__={metadata:t,namespaceuri:n||"http://jspdf.default.namespaceuri/"},this.internal.events.subscribe("putCatalog",r),this.internal.events.subscribe("postPutResources",e)),this}}(M.API),function(t){var e=t.API,r=e.pdfEscape16=function(t,e){for(var r,n=e.metadata.Unicode.widths,i=["","0","00","000","0000"],a=[""],o=0,s=t.length;o<s;++o){if(r=e.metadata.characterToGlyph(t.charCodeAt(o)),e.metadata.glyIdsUsed.push(r),e.metadata.toUnicode[r]=t.charCodeAt(o),-1==n.indexOf(r)&&(n.push(r),n.push([parseInt(e.metadata.widthOfGlyph(r),10)])),"0"==r)return a.join("");r=r.toString(16),a.push(i[4-r.length],r)}return a.join("")},n=function(t){var e,r,n,i,a,o,s;for(a="/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000><ffff>\nendcodespacerange",n=[],o=0,s=(r=Object.keys(t).sort((function(t,e){return t-e}))).length;o<s;o++)e=r[o],n.length>=100&&(a+="\n"+n.length+" beginbfchar\n"+n.join("\n")+"\nendbfchar",n=[]),void 0!==t[e]&&null!==t[e]&&"function"==typeof t[e].toString&&(i=("0000"+t[e].toString(16)).slice(-4),e=("0000"+(+e).toString(16)).slice(-4),n.push("<"+e+"><"+i+">"));return n.length&&(a+="\n"+n.length+" beginbfchar\n"+n.join("\n")+"\nendbfchar\n"),a+="endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend"};e.events.push(["putFont",function(e){!function(e){var r=e.font,i=e.out,a=e.newObject,o=e.putStream;if(r.metadata instanceof t.API.TTFFont&&"Identity-H"===r.encoding){for(var s=r.metadata.Unicode.widths,c=r.metadata.subset.encode(r.metadata.glyIdsUsed,1),u="",l=0;l<c.length;l++)u+=String.fromCharCode(c[l]);var h=a();o({data:u,addLength1:!0,objectId:h}),i("endobj");var f=a();o({data:n(r.metadata.toUnicode),addLength1:!0,objectId:f}),i("endobj");var d=a();i("<<"),i("/Type /FontDescriptor"),i("/FontName /"+F(r.fontName)),i("/FontFile2 "+h+" 0 R"),i("/FontBBox "+t.API.PDFObject.convert(r.metadata.bbox)),i("/Flags "+r.metadata.flags),i("/StemV "+r.metadata.stemV),i("/ItalicAngle "+r.metadata.italicAngle),i("/Ascent "+r.metadata.ascender),i("/Descent "+r.metadata.decender),i("/CapHeight "+r.metadata.capHeight),i(">>"),i("endobj");var p=a();i("<<"),i("/Type /Font"),i("/BaseFont /"+F(r.fontName)),i("/FontDescriptor "+d+" 0 R"),i("/W "+t.API.PDFObject.convert(s)),i("/CIDToGIDMap /Identity"),i("/DW 1000"),i("/Subtype /CIDFontType2"),i("/CIDSystemInfo"),i("<<"),i("/Supplement 0"),i("/Registry (Adobe)"),i("/Ordering ("+r.encoding+")"),i(">>"),i(">>"),i("endobj"),r.objectNumber=a(),i("<<"),i("/Type /Font"),i("/Subtype /Type0"),i("/ToUnicode "+f+" 0 R"),i("/BaseFont /"+F(r.fontName)),i("/Encoding /"+r.encoding),i("/DescendantFonts ["+p+" 0 R]"),i(">>"),i("endobj"),r.isAlreadyPutted=!0}}(e)}]);e.events.push(["putFont",function(e){!function(e){var r=e.font,i=e.out,a=e.newObject,o=e.putStream;if(r.metadata instanceof t.API.TTFFont&&"WinAnsiEncoding"===r.encoding){for(var s=r.metadata.rawData,c="",u=0;u<s.length;u++)c+=String.fromCharCode(s[u]);var l=a();o({data:c,addLength1:!0,objectId:l}),i("endobj");var h=a();o({data:n(r.metadata.toUnicode),addLength1:!0,objectId:h}),i("endobj");var f=a();i("<<"),i("/Descent "+r.metadata.decender),i("/CapHeight "+r.metadata.capHeight),i("/StemV "+r.metadata.stemV),i("/Type /FontDescriptor"),i("/FontFile2 "+l+" 0 R"),i("/Flags 96"),i("/FontBBox "+t.API.PDFObject.convert(r.metadata.bbox)),i("/FontName /"+F(r.fontName)),i("/ItalicAngle "+r.metadata.italicAngle),i("/Ascent "+r.metadata.ascender),i(">>"),i("endobj"),r.objectNumber=a();for(var d=0;d<r.metadata.hmtx.widths.length;d++)r.metadata.hmtx.widths[d]=parseInt(r.metadata.hmtx.widths[d]*(1e3/r.metadata.head.unitsPerEm));i("<</Subtype/TrueType/Type/Font/ToUnicode "+h+" 0 R/BaseFont/"+F(r.fontName)+"/FontDescriptor "+f+" 0 R/Encoding/"+r.encoding+" /FirstChar 29 /LastChar 255 /Widths "+t.API.PDFObject.convert(r.metadata.hmtx.widths)+">>"),i("endobj"),r.isAlreadyPutted=!0}}(e)}]);var i=function(t){var e,n=t.text||"",i=t.x,a=t.y,o=t.options||{},s=t.mutex||{},c=s.pdfEscape,u=s.activeFontKey,l=s.fonts,h=u,f="",d=0,p="",g=l[h].encoding;if("Identity-H"!==l[h].encoding)return{text:n,x:i,y:a,options:o,mutex:s};for(p=n,h=u,Array.isArray(n)&&(p=n[0]),d=0;d<p.length;d+=1)l[h].metadata.hasOwnProperty("cmap")&&(e=l[h].metadata.cmap.unicode.codeMap[p[d].charCodeAt(0)]),e||p[d].charCodeAt(0)<256&&l[h].metadata.hasOwnProperty("Unicode")?f+=p[d]:f+="";var m="";return parseInt(h.slice(1))<14||"WinAnsiEncoding"===g?m=c(f,h).split("").map((function(t){return t.charCodeAt(0).toString(16)})).join(""):"Identity-H"===g&&(m=r(f,l[h])),s.isHex=!0,{text:m,x:i,y:a,options:o,mutex:s}};e.events.push(["postProcessText",function(t){var e=t.text||"",r=[],n={text:e,x:t.x,y:t.y,options:t.options,mutex:t.mutex};if(Array.isArray(e)){var a=0;for(a=0;a<e.length;a+=1)Array.isArray(e[a])&&3===e[a].length?r.push([i(Object.assign({},n,{text:e[a][0]})).text,e[a][1],e[a][2]]):r.push(i(Object.assign({},n,{text:e[a]})).text);t.text=r}else t.text=i(Object.assign({},n,{text:e})).text}])}(M),
/**
   * @license
   * jsPDF virtual FileSystem functionality
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
function(t){var e=function(){return void 0===this.internal.vFS&&(this.internal.vFS={}),!0};t.existsFileInVFS=function(t){return e.call(this),void 0!==this.internal.vFS[t]},t.addFileToVFS=function(t,r){return e.call(this),this.internal.vFS[t]=r,this},t.getFileFromVFS=function(t){return e.call(this),void 0!==this.internal.vFS[t]?this.internal.vFS[t]:null}}(M.API),
/**
   * @license
   * Unicode Bidi Engine based on the work of Alex Shensis (@asthensis)
   * MIT License
   */
function(t){t.__bidiEngine__=t.prototype.__bidiEngine__=function(t){var r,n,i,a,o,s,c,u=e,l=[[0,3,0,1,0,0,0],[0,3,0,1,2,2,0],[0,3,0,17,2,0,1],[0,3,5,5,4,1,0],[0,3,21,21,4,0,1],[0,3,5,5,4,2,0]],h=[[2,0,1,1,0,1,0],[2,0,1,1,0,2,0],[2,0,2,1,3,2,0],[2,0,2,33,3,1,1]],f={L:0,R:1,EN:2,AN:3,N:4,B:5,S:6},d={0:0,5:1,6:2,7:3,32:4,251:5,254:6,255:7},p=["(",")","(","<",">","<","[","]","[","{","}","{","«","»","«","‹","›","‹","⁅","⁆","⁅","⁽","⁾","⁽","₍","₎","₍","≤","≥","≤","〈","〉","〈","﹙","﹚","﹙","﹛","﹜","﹛","﹝","﹞","﹝","﹤","﹥","﹤"],g=new RegExp(/^([1-4|9]|1[0-9]|2[0-9]|3[0168]|4[04589]|5[012]|7[78]|159|16[0-9]|17[0-2]|21[569]|22[03489]|250)$/),m=!1,v=0;this.__bidiEngine__={};var b=function(t){var e=t.charCodeAt(),r=e>>8,n=d[r];return void 0!==n?u[256*n+(255&e)]:252===r||253===r?"AL":g.test(r)?"L":8===r?"R":"N"},y=function(t){for(var e,r=0;r<t.length;r++){if("L"===(e=b(t.charAt(r))))return!1;if("R"===e)return!0}return!1},w=function(t,e,o,s){var c,u,l,h,f=e[s];switch(f){case"L":case"R":m=!1;break;case"N":case"AN":break;case"EN":m&&(f="AN");break;case"AL":m=!0,f="R";break;case"WS":f="N";break;case"CS":s<1||s+1>=e.length||"EN"!==(c=o[s-1])&&"AN"!==c||"EN"!==(u=e[s+1])&&"AN"!==u?f="N":m&&(u="AN"),f=u===c?u:"N";break;case"ES":f="EN"===(c=s>0?o[s-1]:"B")&&s+1<e.length&&"EN"===e[s+1]?"EN":"N";break;case"ET":if(s>0&&"EN"===o[s-1]){f="EN";break}if(m){f="N";break}for(l=s+1,h=e.length;l<h&&"ET"===e[l];)l++;f=l<h&&"EN"===e[l]?"EN":"N";break;case"NSM":if(i&&!a){for(h=e.length,l=s+1;l<h&&"NSM"===e[l];)l++;if(l<h){var d=t[s],p=d>=1425&&d<=2303||64286===d;if(c=e[l],p&&("R"===c||"AL"===c)){f="R";break}}}f=s<1||"B"===(c=e[s-1])?"N":o[s-1];break;case"B":m=!1,r=!0,f=v;break;case"S":n=!0,f="N";break;case"LRE":case"RLE":case"LRO":case"RLO":case"PDF":m=!1;break;case"BN":f="N"}return f},N=function(t,e,r){var n=t.split("");return r&&L(n,r,{hiLevel:v}),n.reverse(),e&&e.reverse(),n.join("")},L=function(t,e,i){var a,o,s,c,u,d=-1,p=t.length,g=0,y=[],N=v?h:l,L=[];for(m=!1,r=!1,n=!1,o=0;o<p;o++)L[o]=b(t[o]);for(s=0;s<p;s++){if(u=g,y[s]=w(t,L,y,s),a=240&(g=N[u][f[y[s]]]),g&=15,e[s]=c=N[g][5],a>0)if(16===a){for(o=d;o<s;o++)e[o]=1;d=-1}else d=-1;if(N[g][6])-1===d&&(d=s);else if(d>-1){for(o=d;o<s;o++)e[o]=c;d=-1}"B"===L[s]&&(e[s]=0),i.hiLevel|=c}n&&function(t,e,r){for(var n=0;n<r;n++)if("S"===t[n]){e[n]=v;for(var i=n-1;i>=0&&"WS"===t[i];i--)e[i]=v}}(L,e,p)},A=function(t,e,n,i,a){if(!(a.hiLevel<t)){if(1===t&&1===v&&!r)return e.reverse(),void(n&&n.reverse());for(var o,s,c,u,l=e.length,h=0;h<l;){if(i[h]>=t){for(c=h+1;c<l&&i[c]>=t;)c++;for(u=h,s=c-1;u<s;u++,s--)o=e[u],e[u]=e[s],e[s]=o,n&&(o=n[u],n[u]=n[s],n[s]=o);h=c}h++}}},x=function(t,e,r){var n=t.split(""),i={hiLevel:v};return r||(r=[]),L(n,r,i),function(t,e,r){if(0!==r.hiLevel&&c)for(var n,i=0;i<t.length;i++)1===e[i]&&(n=p.indexOf(t[i]))>=0&&(t[i]=p[n+1])}(n,r,i),A(2,n,e,r,i),A(1,n,e,r,i),n.join("")};return this.__bidiEngine__.doBidiReorder=function(t,e,r){if(function(t,e){if(e)for(var r=0;r<t.length;r++)e[r]=r;void 0===a&&(a=y(t)),void 0===s&&(s=y(t))}(t,e),i||!o||s)if(i&&o&&a^s)v=a?1:0,t=N(t,e,r);else if(!i&&o&&s)v=a?1:0,t=x(t,e,r),t=N(t,e);else if(!i||a||o||s){if(i&&!o&&a^s)t=N(t,e),a?(v=0,t=x(t,e,r)):(v=1,t=x(t,e,r),t=N(t,e));else if(i&&a&&!o&&s)v=1,t=x(t,e,r),t=N(t,e);else if(!i&&!o&&a^s){var n=c;a?(v=1,t=x(t,e,r),v=0,c=!1,t=x(t,e,r),c=n):(v=0,t=x(t,e,r),t=N(t,e),v=1,c=!1,t=x(t,e,r),c=n,t=N(t,e))}}else v=0,t=x(t,e,r);else v=a?1:0,t=x(t,e,r);return t},this.__bidiEngine__.setOptions=function(t){t&&(i=t.isInputVisual,o=t.isOutputVisual,a=t.isInputRtl,s=t.isOutputRtl,c=t.isSymmetricSwapping)},this.__bidiEngine__.setOptions(t),this.__bidiEngine__};var e=["BN","BN","BN","BN","BN","BN","BN","BN","BN","S","B","S","WS","B","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","B","B","B","S","WS","N","N","ET","ET","ET","N","N","N","N","N","ES","CS","ES","CS","CS","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","CS","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","BN","BN","BN","BN","BN","BN","B","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","BN","CS","N","ET","ET","ET","ET","N","N","N","N","L","N","N","BN","N","N","ET","ET","EN","EN","N","L","N","N","N","EN","L","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","L","L","L","L","L","L","L","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","L","N","N","N","N","N","ET","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","R","NSM","R","NSM","NSM","R","NSM","NSM","R","NSM","N","N","N","N","N","N","N","N","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","N","N","N","N","N","R","R","R","R","R","N","N","N","N","N","N","N","N","N","N","N","AN","AN","AN","AN","AN","AN","N","N","AL","ET","ET","AL","CS","AL","N","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AL","AL","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AN","AN","AN","AN","AN","AN","AN","AN","AN","AN","ET","AN","AN","AL","AL","AL","NSM","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AN","N","NSM","NSM","NSM","NSM","NSM","NSM","AL","AL","NSM","NSM","N","NSM","NSM","NSM","NSM","AL","AL","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","N","AL","AL","NSM","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","AL","N","N","N","N","N","N","N","N","N","N","N","N","N","N","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","R","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","R","R","N","N","N","N","R","N","N","N","N","N","WS","WS","WS","WS","WS","WS","WS","WS","WS","WS","WS","BN","BN","BN","L","R","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","WS","B","LRE","RLE","PDF","LRO","RLO","CS","ET","ET","ET","ET","ET","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","CS","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","WS","BN","BN","BN","BN","BN","N","LRI","RLI","FSI","PDI","BN","BN","BN","BN","BN","BN","EN","L","N","N","EN","EN","EN","EN","EN","EN","ES","ES","N","N","N","L","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","ES","ES","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","ET","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","L","L","L","L","L","L","L","N","N","N","N","N","N","N","N","N","N","N","N","L","L","L","L","L","N","N","N","N","N","R","NSM","R","R","R","R","R","R","R","R","R","R","ES","R","R","R","R","R","R","R","R","R","R","R","R","R","N","R","R","R","R","R","N","R","N","R","R","N","R","R","N","R","R","R","R","R","R","R","R","R","R","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","NSM","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","CS","N","CS","N","N","CS","N","N","N","N","N","N","N","N","N","ET","N","N","ES","ES","N","N","N","N","N","ET","ET","N","N","N","N","N","AL","AL","AL","AL","AL","N","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","AL","N","N","BN","N","N","N","ET","ET","ET","N","N","N","N","N","ES","CS","ES","CS","CS","EN","EN","EN","EN","EN","EN","EN","EN","EN","EN","CS","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","N","N","N","N","N","N","N","N","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","L","N","N","N","L","L","L","L","L","L","N","N","L","L","L","L","L","L","N","N","L","L","L","L","L","L","N","N","L","L","L","N","N","N","ET","ET","N","N","N","ET","ET","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N"],r=new t.__bidiEngine__({isInputVisual:!0});t.API.events.push(["postProcessText",function(t){var e=t.text,n=(t.x,t.y,t.options||{}),i=(t.mutex,n.lang,[]);if(n.isInputVisual="boolean"!=typeof n.isInputVisual||n.isInputVisual,r.setOptions(n),"[object Array]"===Object.prototype.toString.call(e)){var a=0;for(i=[],a=0;a<e.length;a+=1)"[object Array]"===Object.prototype.toString.call(e[a])?i.push([r.doBidiReorder(e[a][0]),e[a][1],e[a][2]]):i.push([r.doBidiReorder(e[a])]);t.text=i}else t.text=r.doBidiReorder(e);r.setOptions({isInputVisual:!0})}])}(M),M.API.TTFFont=function(){function t(t){var e;if(this.rawData=t,e=this.contents=new Te(t),this.contents.pos=4,"ttcf"===e.readString(4))throw new Error("TTCF not supported.");e.pos=0,this.parse(),this.subset=new ar(this),this.registerTTF()}return t.open=function(e){return new t(e)},t.prototype.parse=function(){return this.directory=new Ue(this.contents),this.head=new We(this),this.name=new Ze(this),this.cmap=new Ge(this),this.toUnicode={},this.hhea=new Ye(this),this.maxp=new $e(this),this.hmtx=new Qe(this),this.post=new Xe(this),this.os2=new Je(this),this.loca=new ir(this),this.glyf=new er(this),this.ascender=this.os2.exists&&this.os2.ascender||this.hhea.ascender,this.decender=this.os2.exists&&this.os2.decender||this.hhea.decender,this.lineGap=this.os2.exists&&this.os2.lineGap||this.hhea.lineGap,this.bbox=[this.head.xMin,this.head.yMin,this.head.xMax,this.head.yMax]},t.prototype.registerTTF=function(){var t,e,r,n,i;if(this.scaleFactor=1e3/this.head.unitsPerEm,this.bbox=function(){var e,r,n,i;for(i=[],e=0,r=(n=this.bbox).length;e<r;e++)t=n[e],i.push(Math.round(t*this.scaleFactor));return i}.call(this),this.stemV=0,this.post.exists?(r=255&(n=this.post.italic_angle),0!=(32768&(e=n>>16))&&(e=-(1+(65535^e))),this.italicAngle=+(e+"."+r)):this.italicAngle=0,this.ascender=Math.round(this.ascender*this.scaleFactor),this.decender=Math.round(this.decender*this.scaleFactor),this.lineGap=Math.round(this.lineGap*this.scaleFactor),this.capHeight=this.os2.exists&&this.os2.capHeight||this.ascender,this.xHeight=this.os2.exists&&this.os2.xHeight||0,this.familyClass=(this.os2.exists&&this.os2.familyClass||0)>>8,this.isSerif=1===(i=this.familyClass)||2===i||3===i||4===i||5===i||7===i,this.isScript=10===this.familyClass,this.flags=0,this.post.isFixedPitch&&(this.flags|=1),this.isSerif&&(this.flags|=2),this.isScript&&(this.flags|=8),0!==this.italicAngle&&(this.flags|=64),this.flags|=32,!this.cmap.unicode)throw new Error("No unicode cmap for font")},t.prototype.characterToGlyph=function(t){var e;return(null!=(e=this.cmap.unicode)?e.codeMap[t]:void 0)||0},t.prototype.widthOfGlyph=function(t){var e;return e=1e3/this.head.unitsPerEm,this.hmtx.forGlyph(t).advance*e},t.prototype.widthOfString=function(t,e,r){var n,i,a,o;for(a=0,i=0,o=(t=""+t).length;0<=o?i<o:i>o;i=0<=o?++i:--i)n=t.charCodeAt(i),a+=this.widthOfGlyph(this.characterToGlyph(n))+r*(1e3/e)||0;return a*(e/1e3)},t.prototype.lineHeight=function(t,e){var r;return null==e&&(e=!1),r=e?this.lineGap:0,(this.ascender+r-this.decender)/1e3*t},t}();var Re,Te=function(){function t(t){this.data=null!=t?t:[],this.pos=0,this.length=this.data.length}return t.prototype.readByte=function(){return this.data[this.pos++]},t.prototype.writeByte=function(t){return this.data[this.pos++]=t},t.prototype.readUInt32=function(){return 16777216*this.readByte()+(this.readByte()<<16)+(this.readByte()<<8)+this.readByte()},t.prototype.writeUInt32=function(t){return this.writeByte(t>>>24&255),this.writeByte(t>>16&255),this.writeByte(t>>8&255),this.writeByte(255&t)},t.prototype.readInt32=function(){var t;return(t=this.readUInt32())>=2147483648?t-4294967296:t},t.prototype.writeInt32=function(t){return t<0&&(t+=4294967296),this.writeUInt32(t)},t.prototype.readUInt16=function(){return this.readByte()<<8|this.readByte()},t.prototype.writeUInt16=function(t){return this.writeByte(t>>8&255),this.writeByte(255&t)},t.prototype.readInt16=function(){var t;return(t=this.readUInt16())>=32768?t-65536:t},t.prototype.writeInt16=function(t){return t<0&&(t+=65536),this.writeUInt16(t)},t.prototype.readString=function(t){var e,r;for(r=[],e=0;0<=t?e<t:e>t;e=0<=t?++e:--e)r[e]=String.fromCharCode(this.readByte());return r.join("")},t.prototype.writeString=function(t){var e,r,n;for(n=[],e=0,r=t.length;0<=r?e<r:e>r;e=0<=r?++e:--e)n.push(this.writeByte(t.charCodeAt(e)));return n},t.prototype.readShort=function(){return this.readInt16()},t.prototype.writeShort=function(t){return this.writeInt16(t)},t.prototype.readLongLong=function(){var t,e,r,n,i,a,o,s;return t=this.readByte(),e=this.readByte(),r=this.readByte(),n=this.readByte(),i=this.readByte(),a=this.readByte(),o=this.readByte(),s=this.readByte(),128&t?-1*(72057594037927940*(255^t)+281474976710656*(255^e)+1099511627776*(255^r)+4294967296*(255^n)+16777216*(255^i)+65536*(255^a)+256*(255^o)+(255^s)+1):72057594037927940*t+281474976710656*e+1099511627776*r+4294967296*n+16777216*i+65536*a+256*o+s},t.prototype.writeLongLong=function(t){var e,r;return e=Math.floor(t/4294967296),r=4294967295&t,this.writeByte(e>>24&255),this.writeByte(e>>16&255),this.writeByte(e>>8&255),this.writeByte(255&e),this.writeByte(r>>24&255),this.writeByte(r>>16&255),this.writeByte(r>>8&255),this.writeByte(255&r)},t.prototype.readInt=function(){return this.readInt32()},t.prototype.writeInt=function(t){return this.writeInt32(t)},t.prototype.read=function(t){var e,r;for(e=[],r=0;0<=t?r<t:r>t;r=0<=t?++r:--r)e.push(this.readByte());return e},t.prototype.write=function(t){var e,r,n,i;for(i=[],r=0,n=t.length;r<n;r++)e=t[r],i.push(this.writeByte(e));return i},t}(),Ue=function(){var t;function e(t){var e,r,n;for(this.scalarType=t.readInt(),this.tableCount=t.readShort(),this.searchRange=t.readShort(),this.entrySelector=t.readShort(),this.rangeShift=t.readShort(),this.tables={},r=0,n=this.tableCount;0<=n?r<n:r>n;r=0<=n?++r:--r)e={tag:t.readString(4),checksum:t.readInt(),offset:t.readInt(),length:t.readInt()},this.tables[e.tag]=e}return e.prototype.encode=function(e){var r,n,i,a,o,s,c,u,l,h,f,d,p;for(p in f=Object.keys(e).length,s=Math.log(2),l=16*Math.floor(Math.log(f)/s),a=Math.floor(l/s),u=16*f-l,(n=new Te).writeInt(this.scalarType),n.writeShort(f),n.writeShort(l),n.writeShort(a),n.writeShort(u),i=16*f,c=n.pos+i,o=null,d=[],e)for(h=e[p],n.writeString(p),n.writeInt(t(h)),n.writeInt(c),n.writeInt(h.length),d=d.concat(h),"head"===p&&(o=c),c+=h.length;c%4;)d.push(0),c++;return n.write(d),r=2981146554-t(n.data),n.pos=o+8,n.writeUInt32(r),n.data},t=function(t){var e,r,n,i;for(t=tr.call(t);t.length%4;)t.push(0);for(n=new Te(t),r=0,e=0,i=t.length;e<i;e=e+=4)r+=n.readUInt32();return 4294967295&r},e}(),ze={}.hasOwnProperty,He=function(t,e){for(var r in e)ze.call(e,r)&&(t[r]=e[r]);function n(){this.constructor=t}return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},We=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return He(e,t),e.prototype.tag="head",e.prototype.parse=function(t){return t.pos=this.offset,this.version=t.readInt(),this.revision=t.readInt(),this.checkSumAdjustment=t.readInt(),this.magicNumber=t.readInt(),this.flags=t.readShort(),this.unitsPerEm=t.readShort(),this.created=t.readLongLong(),this.modified=t.readLongLong(),this.xMin=t.readShort(),this.yMin=t.readShort(),this.xMax=t.readShort(),this.yMax=t.readShort(),this.macStyle=t.readShort(),this.lowestRecPPEM=t.readShort(),this.fontDirectionHint=t.readShort(),this.indexToLocFormat=t.readShort(),this.glyphDataFormat=t.readShort()},e.prototype.encode=function(t){var e;return(e=new Te).writeInt(this.version),e.writeInt(this.revision),e.writeInt(this.checkSumAdjustment),e.writeInt(this.magicNumber),e.writeShort(this.flags),e.writeShort(this.unitsPerEm),e.writeLongLong(this.created),e.writeLongLong(this.modified),e.writeShort(this.xMin),e.writeShort(this.yMin),e.writeShort(this.xMax),e.writeShort(this.yMax),e.writeShort(this.macStyle),e.writeShort(this.lowestRecPPEM),e.writeShort(this.fontDirectionHint),e.writeShort(t),e.writeShort(this.glyphDataFormat),e.data},e}(Re=function(){function t(t){var e;this.file=t,e=this.file.directory.tables[this.tag],this.exists=!!e,e&&(this.offset=e.offset,this.length=e.length,this.parse(this.file.contents))}return t.prototype.parse=function(){},t.prototype.encode=function(){},t.prototype.raw=function(){return this.exists?(this.file.contents.pos=this.offset,this.file.contents.read(this.length)):null},t}()),Ve=function(){function t(t,e){var r,n,i,a,o,s,c,u,l,h,f,d,p,g,m,v,b;switch(this.platformID=t.readUInt16(),this.encodingID=t.readShort(),this.offset=e+t.readInt(),l=t.pos,t.pos=this.offset,this.format=t.readUInt16(),this.length=t.readUInt16(),this.language=t.readUInt16(),this.isUnicode=3===this.platformID&&1===this.encodingID&&4===this.format||0===this.platformID&&4===this.format,this.codeMap={},this.format){case 0:for(s=0;s<256;++s)this.codeMap[s]=t.readByte();break;case 4:for(f=t.readUInt16(),h=f/2,t.pos+=6,i=function(){var e,r;for(r=[],s=e=0;0<=h?e<h:e>h;s=0<=h?++e:--e)r.push(t.readUInt16());return r}(),t.pos+=2,p=function(){var e,r;for(r=[],s=e=0;0<=h?e<h:e>h;s=0<=h?++e:--e)r.push(t.readUInt16());return r}(),c=function(){var e,r;for(r=[],s=e=0;0<=h?e<h:e>h;s=0<=h?++e:--e)r.push(t.readUInt16());return r}(),u=function(){var e,r;for(r=[],s=e=0;0<=h?e<h:e>h;s=0<=h?++e:--e)r.push(t.readUInt16());return r}(),n=(this.length-t.pos+this.offset)/2,o=function(){var e,r;for(r=[],s=e=0;0<=n?e<n:e>n;s=0<=n?++e:--e)r.push(t.readUInt16());return r}(),s=m=0,b=i.length;m<b;s=++m)for(g=i[s],r=v=d=p[s];d<=g?v<=g:v>=g;r=d<=g?++v:--v)0===u[s]?a=r+c[s]:0!==(a=o[u[s]/2+(r-d)-(h-s)]||0)&&(a+=c[s]),this.codeMap[r]=65535&a}t.pos=l}return t.encode=function(t,e){var r,n,i,a,o,s,c,u,l,h,f,d,p,g,m,v,b,y,w,N,L,A,x,S,_,P,k,F,I,C,j,O,B,M,E,q,D,R,T,U,z,H,W,V,G,Y;switch(F=new Te,a=Object.keys(t).sort((function(t,e){return t-e})),e){case"macroman":for(p=0,g=function(){var t=[];for(d=0;d<256;++d)t.push(0);return t}(),v={0:0},i={},I=0,B=a.length;I<B;I++)null==v[W=t[n=a[I]]]&&(v[W]=++p),i[n]={old:t[n],new:v[t[n]]},g[n]=v[t[n]];return F.writeUInt16(1),F.writeUInt16(0),F.writeUInt32(12),F.writeUInt16(0),F.writeUInt16(262),F.writeUInt16(0),F.write(g),{charMap:i,subtable:F.data,maxGlyphID:p+1};case"unicode":for(P=[],l=[],b=0,v={},r={},m=c=null,C=0,M=a.length;C<M;C++)null==v[w=t[n=a[C]]]&&(v[w]=++b),r[n]={old:w,new:v[w]},o=v[w]-n,null!=m&&o===c||(m&&l.push(m),P.push(n),c=o),m=n;for(m&&l.push(m),l.push(65535),P.push(65535),S=2*(x=P.length),A=2*Math.pow(Math.log(x)/Math.LN2,2),h=Math.log(A/2)/Math.LN2,L=2*x-A,s=[],N=[],f=[],d=j=0,E=P.length;j<E;d=++j){if(_=P[d],u=l[d],65535===_){s.push(0),N.push(0);break}if(_-(k=r[_].new)>=32768)for(s.push(0),N.push(2*(f.length+x-d)),n=O=_;_<=u?O<=u:O>=u;n=_<=u?++O:--O)f.push(r[n].new);else s.push(k-_),N.push(0)}for(F.writeUInt16(3),F.writeUInt16(1),F.writeUInt32(12),F.writeUInt16(4),F.writeUInt16(16+8*x+2*f.length),F.writeUInt16(0),F.writeUInt16(S),F.writeUInt16(A),F.writeUInt16(h),F.writeUInt16(L),z=0,q=l.length;z<q;z++)n=l[z],F.writeUInt16(n);for(F.writeUInt16(0),H=0,D=P.length;H<D;H++)n=P[H],F.writeUInt16(n);for(V=0,R=s.length;V<R;V++)o=s[V],F.writeUInt16(o);for(G=0,T=N.length;G<T;G++)y=N[G],F.writeUInt16(y);for(Y=0,U=f.length;Y<U;Y++)p=f[Y],F.writeUInt16(p);return{charMap:r,subtable:F.data,maxGlyphID:b+1}}},t}(),Ge=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return He(e,t),e.prototype.tag="cmap",e.prototype.parse=function(t){var e,r,n;for(t.pos=this.offset,this.version=t.readUInt16(),n=t.readUInt16(),this.tables=[],this.unicode=null,r=0;0<=n?r<n:r>n;r=0<=n?++r:--r)e=new Ve(t,this.offset),this.tables.push(e),e.isUnicode&&null==this.unicode&&(this.unicode=e);return!0},e.encode=function(t,e){var r,n;return null==e&&(e="macroman"),r=Ve.encode(t,e),(n=new Te).writeUInt16(0),n.writeUInt16(1),r.table=n.data.concat(r.subtable),r},e}(Re),Ye=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return He(e,t),e.prototype.tag="hhea",e.prototype.parse=function(t){return t.pos=this.offset,this.version=t.readInt(),this.ascender=t.readShort(),this.decender=t.readShort(),this.lineGap=t.readShort(),this.advanceWidthMax=t.readShort(),this.minLeftSideBearing=t.readShort(),this.minRightSideBearing=t.readShort(),this.xMaxExtent=t.readShort(),this.caretSlopeRise=t.readShort(),this.caretSlopeRun=t.readShort(),this.caretOffset=t.readShort(),t.pos+=8,this.metricDataFormat=t.readShort(),this.numberOfMetrics=t.readUInt16()},e}(Re),Je=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return He(e,t),e.prototype.tag="OS/2",e.prototype.parse=function(t){if(t.pos=this.offset,this.version=t.readUInt16(),this.averageCharWidth=t.readShort(),this.weightClass=t.readUInt16(),this.widthClass=t.readUInt16(),this.type=t.readShort(),this.ySubscriptXSize=t.readShort(),this.ySubscriptYSize=t.readShort(),this.ySubscriptXOffset=t.readShort(),this.ySubscriptYOffset=t.readShort(),this.ySuperscriptXSize=t.readShort(),this.ySuperscriptYSize=t.readShort(),this.ySuperscriptXOffset=t.readShort(),this.ySuperscriptYOffset=t.readShort(),this.yStrikeoutSize=t.readShort(),this.yStrikeoutPosition=t.readShort(),this.familyClass=t.readShort(),this.panose=function(){var e,r;for(r=[],e=0;e<10;++e)r.push(t.readByte());return r}(),this.charRange=function(){var e,r;for(r=[],e=0;e<4;++e)r.push(t.readInt());return r}(),this.vendorID=t.readString(4),this.selection=t.readShort(),this.firstCharIndex=t.readShort(),this.lastCharIndex=t.readShort(),this.version>0&&(this.ascent=t.readShort(),this.descent=t.readShort(),this.lineGap=t.readShort(),this.winAscent=t.readShort(),this.winDescent=t.readShort(),this.codePageRange=function(){var e,r;for(r=[],e=0;e<2;e=++e)r.push(t.readInt());return r}(),this.version>1))return this.xHeight=t.readShort(),this.capHeight=t.readShort(),this.defaultChar=t.readShort(),this.breakChar=t.readShort(),this.maxContext=t.readShort()},e}(Re),Xe=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return He(e,t),e.prototype.tag="post",e.prototype.parse=function(t){var e,r,n;switch(t.pos=this.offset,this.format=t.readInt(),this.italicAngle=t.readInt(),this.underlinePosition=t.readShort(),this.underlineThickness=t.readShort(),this.isFixedPitch=t.readInt(),this.minMemType42=t.readInt(),this.maxMemType42=t.readInt(),this.minMemType1=t.readInt(),this.maxMemType1=t.readInt(),this.format){case 65536:break;case 131072:var i;for(r=t.readUInt16(),this.glyphNameIndex=[],i=0;0<=r?i<r:i>r;i=0<=r?++i:--i)this.glyphNameIndex.push(t.readUInt16());for(this.names=[],n=[];t.pos<this.offset+this.length;)e=t.readByte(),n.push(this.names.push(t.readString(e)));return n;case 151552:return r=t.readUInt16(),this.offsets=t.read(r);case 196608:break;case 262144:return this.map=function(){var e,r,n;for(n=[],i=e=0,r=this.file.maxp.numGlyphs;0<=r?e<r:e>r;i=0<=r?++e:--e)n.push(t.readUInt32());return n}.call(this)}},e}(Re),Ke=function(t,e){this.raw=t,this.length=t.length,this.platformID=e.platformID,this.encodingID=e.encodingID,this.languageID=e.languageID},Ze=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return He(e,t),e.prototype.tag="name",e.prototype.parse=function(t){var e,r,n,i,a,o,s,c,u,l,h;for(t.pos=this.offset,t.readShort(),e=t.readShort(),o=t.readShort(),r=[],i=0;0<=e?i<e:i>e;i=0<=e?++i:--i)r.push({platformID:t.readShort(),encodingID:t.readShort(),languageID:t.readShort(),nameID:t.readShort(),length:t.readShort(),offset:this.offset+o+t.readShort()});for(s={},i=u=0,l=r.length;u<l;i=++u)n=r[i],t.pos=n.offset,c=t.readString(n.length),a=new Ke(c,n),null==s[h=n.nameID]&&(s[h]=[]),s[n.nameID].push(a);this.strings=s,this.copyright=s[0],this.fontFamily=s[1],this.fontSubfamily=s[2],this.uniqueSubfamily=s[3],this.fontName=s[4],this.version=s[5];try{this.postscriptName=s[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g,"")}catch(t){this.postscriptName=s[4][0].raw.replace(/[\x00-\x19\x80-\xff]/g,"")}return this.trademark=s[7],this.manufacturer=s[8],this.designer=s[9],this.description=s[10],this.vendorUrl=s[11],this.designerUrl=s[12],this.license=s[13],this.licenseUrl=s[14],this.preferredFamily=s[15],this.preferredSubfamily=s[17],this.compatibleFull=s[18],this.sampleText=s[19]},e}(Re),$e=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return He(e,t),e.prototype.tag="maxp",e.prototype.parse=function(t){return t.pos=this.offset,this.version=t.readInt(),this.numGlyphs=t.readUInt16(),this.maxPoints=t.readUInt16(),this.maxContours=t.readUInt16(),this.maxCompositePoints=t.readUInt16(),this.maxComponentContours=t.readUInt16(),this.maxZones=t.readUInt16(),this.maxTwilightPoints=t.readUInt16(),this.maxStorage=t.readUInt16(),this.maxFunctionDefs=t.readUInt16(),this.maxInstructionDefs=t.readUInt16(),this.maxStackElements=t.readUInt16(),this.maxSizeOfInstructions=t.readUInt16(),this.maxComponentElements=t.readUInt16(),this.maxComponentDepth=t.readUInt16()},e}(Re),Qe=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return He(e,t),e.prototype.tag="hmtx",e.prototype.parse=function(t){var e,r,n,i,a,o,s;for(t.pos=this.offset,this.metrics=[],e=0,o=this.file.hhea.numberOfMetrics;0<=o?e<o:e>o;e=0<=o?++e:--e)this.metrics.push({advance:t.readUInt16(),lsb:t.readInt16()});for(n=this.file.maxp.numGlyphs-this.file.hhea.numberOfMetrics,this.leftSideBearings=function(){var r,i;for(i=[],e=r=0;0<=n?r<n:r>n;e=0<=n?++r:--r)i.push(t.readInt16());return i}(),this.widths=function(){var t,e,r,n;for(n=[],t=0,e=(r=this.metrics).length;t<e;t++)i=r[t],n.push(i.advance);return n}.call(this),r=this.widths[this.widths.length-1],s=[],e=a=0;0<=n?a<n:a>n;e=0<=n?++a:--a)s.push(this.widths.push(r));return s},e.prototype.forGlyph=function(t){return t in this.metrics?this.metrics[t]:{advance:this.metrics[this.metrics.length-1].advance,lsb:this.leftSideBearings[t-this.metrics.length]}},e}(Re),tr=[].slice,er=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return He(e,t),e.prototype.tag="glyf",e.prototype.parse=function(){return this.cache={}},e.prototype.glyphFor=function(t){var e,r,n,i,a,o,s,c,u,l;return t in this.cache?this.cache[t]:(i=this.file.loca,e=this.file.contents,r=i.indexOf(t),0===(n=i.lengthOf(t))?this.cache[t]=null:(e.pos=this.offset+r,a=(o=new Te(e.read(n))).readShort(),c=o.readShort(),l=o.readShort(),s=o.readShort(),u=o.readShort(),this.cache[t]=-1===a?new nr(o,c,l,s,u):new rr(o,a,c,l,s,u),this.cache[t]))},e.prototype.encode=function(t,e,r){var n,i,a,o,s;for(a=[],i=[],o=0,s=e.length;o<s;o++)n=t[e[o]],i.push(a.length),n&&(a=a.concat(n.encode(r)));return i.push(a.length),{table:a,offsets:i}},e}(Re),rr=function(){function t(t,e,r,n,i,a){this.raw=t,this.numberOfContours=e,this.xMin=r,this.yMin=n,this.xMax=i,this.yMax=a,this.compound=!1}return t.prototype.encode=function(){return this.raw.data},t}(),nr=function(){function t(t,e,r,n,i){var a,o;for(this.raw=t,this.xMin=e,this.yMin=r,this.xMax=n,this.yMax=i,this.compound=!0,this.glyphIDs=[],this.glyphOffsets=[],a=this.raw;o=a.readShort(),this.glyphOffsets.push(a.pos),this.glyphIDs.push(a.readUInt16()),32&o;)a.pos+=1&o?4:2,128&o?a.pos+=8:64&o?a.pos+=4:8&o&&(a.pos+=2)}return 1,8,32,64,128,t.prototype.encode=function(){var t,e,r;for(e=new Te(tr.call(this.raw.data)),t=0,r=this.glyphIDs.length;t<r;++t)e.pos=this.glyphOffsets[t];return e.data},t}(),ir=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return He(e,t),e.prototype.tag="loca",e.prototype.parse=function(t){var e,r;return t.pos=this.offset,e=this.file.head.indexToLocFormat,this.offsets=0===e?function(){var e,n;for(n=[],r=0,e=this.length;r<e;r+=2)n.push(2*t.readUInt16());return n}.call(this):function(){var e,n;for(n=[],r=0,e=this.length;r<e;r+=4)n.push(t.readUInt32());return n}.call(this)},e.prototype.indexOf=function(t){return this.offsets[t]},e.prototype.lengthOf=function(t){return this.offsets[t+1]-this.offsets[t]},e.prototype.encode=function(t,e){for(var r=new Uint32Array(this.offsets.length),n=0,i=0,a=0;a<r.length;++a)if(r[a]=n,i<e.length&&e[i]==a){++i,r[a]=n;var o=this.offsets[a],s=this.offsets[a+1]-o;s>0&&(n+=s)}for(var c=new Array(4*r.length),u=0;u<r.length;++u)c[4*u+3]=255&r[u],c[4*u+2]=(65280&r[u])>>8,c[4*u+1]=(16711680&r[u])>>16,c[4*u]=(4278190080&r[u])>>24;return c},e}(Re),ar=function(){function t(t){this.font=t,this.subset={},this.unicodes={},this.next=33}return t.prototype.generateCmap=function(){var t,e,r,n,i;for(e in n=this.font.cmap.tables[0].codeMap,t={},i=this.subset)r=i[e],t[e]=n[r];return t},t.prototype.glyphsFor=function(t){var e,r,n,i,a,o,s;for(n={},a=0,o=t.length;a<o;a++)n[i=t[a]]=this.font.glyf.glyphFor(i);for(i in e=[],n)(null!=(r=n[i])?r.compound:void 0)&&e.push.apply(e,r.glyphIDs);if(e.length>0)for(i in s=this.glyphsFor(e))r=s[i],n[i]=r;return n},t.prototype.encode=function(t,e){var r,n,i,a,o,s,c,u,l,h,f,d,p,g,m;for(n in r=Ge.encode(this.generateCmap(),"unicode"),a=this.glyphsFor(t),f={0:0},m=r.charMap)f[(s=m[n]).old]=s.new;for(d in h=r.maxGlyphID,a)d in f||(f[d]=h++);return u=function(t){var e,r;for(e in r={},t)r[t[e]]=e;return r}(f),l=Object.keys(u).sort((function(t,e){return t-e})),p=function(){var t,e,r;for(r=[],t=0,e=l.length;t<e;t++)o=l[t],r.push(u[o]);return r}(),i=this.font.glyf.encode(a,p,f),c=this.font.loca.encode(i.offsets,p),g={cmap:this.font.cmap.raw(),glyf:i.table,loca:c,hmtx:this.font.hmtx.raw(),hhea:this.font.hhea.raw(),maxp:this.font.maxp.raw(),post:this.font.post.raw(),name:this.font.name.raw(),head:this.font.head.encode(e)},this.font.os2.exists&&(g["OS/2"]=this.font.os2.raw()),this.font.directory.encode(g)},t}();M.API.PDFObject=function(){var t;function e(){}return t=function(t,e){return(Array(e+1).join("0")+t).slice(-e)},e.convert=function(r){var n,i,a,o;if(Array.isArray(r))return"["+function(){var t,i,a;for(a=[],t=0,i=r.length;t<i;t++)n=r[t],a.push(e.convert(n));return a}().join(" ")+"]";if("string"==typeof r)return"/"+r;if(null!=r?r.isString:void 0)return"("+r+")";if(r instanceof Date)return"(D:"+t(r.getUTCFullYear(),4)+t(r.getUTCMonth(),2)+t(r.getUTCDate(),2)+t(r.getUTCHours(),2)+t(r.getUTCMinutes(),2)+t(r.getUTCSeconds(),2)+"Z)";if("[object Object]"==={}.toString.call(r)){for(i in a=["<<"],r)o=r[i],a.push("/"+i+" "+e.convert(o));return a.push(">>"),a.join("\n")}return""+r},e}(),t.AcroForm=xt,t.AcroFormAppearance=Lt,t.AcroFormButton=gt,t.AcroFormCheckBox=yt,t.AcroFormChoiceField=ht,t.AcroFormComboBox=dt,t.AcroFormEditBox=pt,t.AcroFormListBox=ft,t.AcroFormPasswordField=Nt,t.AcroFormPushButton=mt,t.AcroFormRadioButton=vt,t.AcroFormTextField=wt,t.GState=C,t.ShadingPattern=O,t.TilingPattern=B,t.default=M,t.jsPDF=M,Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=jspdf.umd.min.js.map

} catch (eJspdf) { console.warn("[Hidden Lights] jspdf load failed", eJspdf); }
})();
(function(){
  var SH = window.SHELL;
  if (!SH || !SH.container) return;
  SH.container.innerHTML = `<style>body {
      width: 100%;
      min-width: 280px;
      height: 100vh;
      margin: 0;
      padding: 12px 16px;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-sizing: border-box;
    }
    .main-scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }
    h2 {
      margin: 0 0 12px 0;
      font-size: 16px;
      color: #0369a1;
    }
    button {
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      background: #0ea5e9;
      color: #fff;
      border: none;
      border-radius: 6px;
    }
    button:hover {
      background: #0284c7;
    }
    /* Concurances scan buttons: grey by default, blue only when active list */
    .concurance-scan-btn {
      background: #94a3b8;
    }
    .concurance-scan-btn:hover {
      background: #64748b;
    }
    .concurance-scan-btn.is-active {
      background: #0ea5e9;
    }
    .concurance-scan-btn.is-active:hover {
      background: #0284c7;
    }
    /* Console fixed at bottom, full width, always visible */
    .console-bar {
      flex-shrink: 0;
      width: calc(100% + 32px);
      margin-left: -16px;
      margin-right: -16px;
      margin-bottom: -12px;
      height: clamp(170px, 34vh, 280px);
      min-height: 150px;
      max-height: min(560px, 72vh);
      border-top: 1px solid #7dd3fc;
      background: #f0f9ff;
      display: flex;
      flex-direction: column;
      padding: 6px 16px 12px;
      box-sizing: border-box;
      resize: vertical;
      overflow: hidden;
    }
    /* Scroll settings + log together so Save stays reachable when the panel is tall */
    .console-bar-scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .console-bar .console-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .console-bar .console-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #0369a1;
    }
    .settings-btn {
      background: none;
      border: none;
      padding: 0 2px;
      cursor: pointer;
      font-size: 14px;
      color: #0369a1;
      opacity: 0.7;
      line-height: 1;
    }
    .settings-btn:hover { opacity: 1; background: none; }
    .settings-panel {
      display: none;
      margin-bottom: 6px;
      padding: 8px 10px;
      background: #fff;
      border: 1px solid #bae6fd;
      border-radius: 4px;
      font-size: 12px;
    }
    .settings-panel.open { display: block; }
    .settings-panel label {
      display: block;
      font-weight: 600;
      color: #334155;
      margin-bottom: 3px;
      font-size: 11px;
    }
    .settings-panel input[type="text"],
    .settings-panel input[type="password"],
    .settings-panel textarea {
      width: 100%;
      padding: 5px 7px;
      font-size: 12px;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      box-sizing: border-box;
      margin-bottom: 6px;
      font-family: inherit;
      resize: vertical;
      min-height: 52px;
    }
    .settings-panel textarea {
      line-height: 1.35;
    }
    .settings-section {
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e0f2fe;
    }
    .settings-section:last-of-type {
      border-bottom: none;
      margin-bottom: 8px;
      padding-bottom: 0;
    }
    .settings-section-title {
      font-size: 12px;
      font-weight: 700;
      color: #0369a1;
      margin: 0 0 6px 0;
    }
    .settings-help {
      font-size: 11px;
      color: #64748b;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }
    .settings-panel .settings-save {
      padding: 4px 14px;
      font-size: 12px;
      background: #0ea5e9;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .settings-panel .settings-save:hover { background: #0284c7; }
    .settings-panel .settings-saved-msg {
      display: inline-block;
      margin-left: 8px;
      font-size: 11px;
      color: #16a34a;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .settings-panel .settings-saved-msg.show { opacity: 1; }
    #log {
      flex: 1;
      min-height: 0;
      padding: 6px 8px;
      background: #fff;
      border: 1px solid #bae6fd;
      border-radius: 4px;
      font-size: 11px;
      overflow-y: auto;
    }
    #log:empty {
      background: #f0f9ff;
    }
    #log p {
      margin: 3px 0;
    }
    .section {
      margin-bottom: 14px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #0369a1;
      margin: 0 0 6px 0;
    }
    .buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .section .buttons {
      margin-bottom: 0;
    }
    #overlaps-result {
      margin-top: 12px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
      max-height: 280px;
      overflow-y: auto;
    }
    #overlaps-result:empty {
      display: none;
    }
    #overlaps-result h3 {
      margin: 0 0 8px 0;
      font-size: 13px;
      color: #0369a1;
    }
    #overlaps-result .group {
      margin-bottom: 12px;
      padding: 8px;
      background: #fff;
      border: 1px solid #eee;
      border-radius: 4px;
    }
    #overlaps-result .entry {
      margin: 4px 0;
      padding: 4px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 11px;
    }
    #overlaps-result .entry:last-child {
      border-bottom: none;
    }
    .section-hint--billing-walk {
      margin-top: 10px;
    }
    .section-hint {
      font-size: 11px;
      color: #475569;
      margin: 0 0 8px 0;
    }
    #overlap-fix-buttons .overlap-btn {
      margin-bottom: 6px;
    }
    /* Overlap list: simple list of one-liners with Fix button */
    .overlap-fix-list {
      margin-top: 10px;
    }
    .overlap-fix-list:empty {
      display: none;
    }
    .overlap-list {
      list-style: none;
      margin: 0;
      padding: 0;
      border: 1px solid #0ea5e9;
      border-radius: 6px;
      background: #fff;
    }
    .overlap-list__item {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 0;
      padding: 8px 12px;
      font-size: 12px;
      color: #334155;
      border-bottom: 1px solid #cbd5e1;
    }
    .overlap-list__item:last-child {
      border-bottom: none;
    }
    .overlap-list--blocked {
      border-color: #f59e0b;
      margin-bottom: 12px;
    }
    .overlap-list__item--blocked {
      background: #fffbeb;
    }
    .overlap-blocked-multi__title {
      margin: 0 0 4px 0;
      font-size: 13px;
      color: #b45309;
    }
    .overlap-blocked-multi {
      margin-bottom: 14px;
    }
    .overlap-list__item--multi {
      background: #fffbeb;
    }
    .overlap-list__type--multi {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 11px;
      line-height: 1;
      color: #b45309;
      font-weight: 600;
    }
    .overlap-list__line--multi-label {
      color: #b45309;
      font-weight: 600;
    }
    .overlap-list__row {
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;
    }
    .overlap-list__type {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 10px;
      line-height: 1;
      color: #94a3b8;
      font-weight: 400;
    }
    .overlap-list__fix-wrap {
      flex-shrink: 0;
    }
    .overlap-list__lines {
      flex: 1;
      min-width: 0;
    }
    .overlap-list__line {
      line-height: 1.35;
      margin-bottom: 2px;
    }
    .overlap-list__line:first-child {
      color: #0369a1;
      font-weight: 600;
    }
    .overlap-list__line:last-child {
      margin-bottom: 0;
    }
    .overlap-list__line--error {
      color: #b91c1c;
    }
    .overlap-list__fail-reason {
      display: block;
      color: #b91c1c;
      font-size: 11px;
      margin-top: 4px;
      padding-left: 42px;
      min-height: 0;
      font-weight: 400;
    }
    .overlap-list__fail-reason:empty {
      display: none;
    }
    .overlap-list__fail-reason--progress {
      color: #64748b;
    }
    .overlap-list__fix {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      font-size: 0;
      line-height: 1;
      color: #fff;
      background: #0ea5e9;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .overlap-list__fix::before {
      content: "\\2692";
      font-size: 14px;
      display: block;
    }
    .overlap-list__fix:hover:not(:disabled) {
      background: #0284c7;
    }
    .overlap-list__fix:disabled:not(.is-loading) {
      background: #94a3b8;
      cursor: not-allowed;
      opacity: 0.8;
    }
    /* Loading: spinner, yellow */
    .overlap-list__fix.is-loading::before {
      content: "";
      display: block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(0,0,0,0.15);
      border-top-color: #1e293b;
      border-radius: 50%;
      animation: overlap-spin 0.65s linear infinite;
    }
    .overlap-list__fix.is-loading {
      background: #eab308;
      cursor: wait;
    }
    @keyframes overlap-spin {
      to { transform: rotate(360deg); }
    }
    /* Success: checkmark, green */
    .overlap-list__fix.is-success::before {
      content: "\\2713";
      font-size: 16px;
      font-weight: bold;
    }
    .overlap-list__fix.is-success {
      background: #16a34a;
      cursor: default;
    }
    .overlap-list__fix.is-success:disabled {
      background: #16a34a;
      opacity: 1;
    }
    /* Error: red X; click to retry */
    .overlap-list__fix.is-error::before {
      content: "\\2715";
      font-size: 14px;
      font-weight: bold;
    }
    .overlap-list__fix.is-error {
      background: #dc2626;
      color: #fff;
      cursor: pointer;
    }
    .overlap-list__fix.is-error:hover {
      background: #b91c1c;
      color: #fff;
    }
    .overlap-list__fix.is-error:disabled {
      background: #dc2626;
      color: #fff;
      opacity: 1;
    }
    #overlap-fix-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f8ff;
      border-radius: 4px;
      font-size: 12px;
    }
    .overlap-fix-result--fail {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 4px;
      padding: 10px;
      color: #991b1b;
    }
    .overlap-fix-result--fail-detail {
      margin: 8px 0 0;
      white-space: pre-wrap;
      word-break: break-word;
    }
    #overlap-fix-result:empty {
      display: none;
    }
    .overlap-run-all-toolbar {
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .overlap-run-all-toolbar:empty {
      display: none;
    }
    #overlap-run-all-btn {
      background: #0ea5e9;
      font-weight: 600;
    }
    #overlap-run-all-btn:hover:not(:disabled) {
      background: #0284c7;
    }
    #overlap-run-all-btn:disabled {
      opacity: 0.65;
      cursor: wait;
    }
    #timesheet-result {
      margin-top: 12px;
      padding: 8px;
      background: #f0f8ff;
      border-radius: 4px;
      font-size: 12px;
      max-height: 320px;
      overflow-y: auto;
    }
    #timesheet-result:empty {
      display: none;
    }
    #timesheet-result h3 {
      margin: 0 0 8px 0;
      font-size: 13px;
    }
    #timesheet-result .field {
      margin: 4px 0;
      padding: 4px 0;
      border-bottom: 1px solid #e0e8f0;
    }
    #timesheet-result .field:last-child {
      border-bottom: none;
    }
    #timesheet-result .field-name {
      font-weight: 600;
      color: #0369a1;
    }
    #add-service-line-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #add-service-line-result:empty {
      display: none;
    }
    #set-date-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #set-date-result:empty {
      display: none;
    }
    #enter-times-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #enter-times-result:empty {
      display: none;
    }
    #set-timesheet-timezone-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #set-timesheet-timezone-result:empty {
      display: none;
    }
    #select-place-of-service-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #select-place-of-service-result:empty {
      display: none;
    }
    #select-service-address-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #select-service-address-result:empty {
      display: none;
    }
    #select-nonbillable-code-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #select-nonbillable-code-result:empty {
      display: none;
    }
    #click-billable-97153-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #click-billable-97153-result:empty {
      display: none;
    }
    #select-payor-option-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #select-payor-option-result:empty {
      display: none;
    }
    #click-existing-note-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #click-existing-note-result:empty {
      display: none;
    }
    #click-note-by-date-name-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #click-note-by-date-name-result:empty {
      display: none;
    }
    #selected-backup-notes-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #selected-backup-notes-result:empty {
      display: none;
    }
    #click-close-note-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #click-close-note-result:empty {
      display: none;
    }
    #click-provider-name-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #click-provider-name-result:empty {
      display: none;
    }
    #read-contact-labels-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #read-contact-labels-result:empty {
      display: none;
    }
    #close-contact-card-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #close-contact-card-result:empty {
      display: none;
    }
    #provider-combo-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #provider-combo-result:empty {
      display: none;
    }
    #open-sig-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #open-sig-result:empty {
      display: none;
    }
    /* Tab bar: Auto | Manual, full width, 50/50 */
    .tab-bar {
      display: flex;
      width: 100%;
      margin-bottom: 12px;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #0ea5e9;
      position: relative;
      z-index: 10;
    }
    .tab-bar .tab {
      flex: 1;
      min-width: 0;
      padding: 10px 12px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      background: #e0f2fe;
      color: #0369a1;
      position: relative;
      pointer-events: auto;
    }
    .tab-bar .tab:hover {
      background: #e0f2fe;
      color: #0369a1;
    }
    .tab-bar .tab.active {
      background: #0ea5e9;
      color: #fff;
    }
    .tab-bar .tab:not(:last-child) {
      border-right: 1px solid #7dd3fc;
    }
    .panel {
      display: none;
    }
    .panel.active {
      display: block;
    }
    .edit-timesheet-ready-status {
      margin-top: 8px;
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .edit-timesheet-ready-status--idle {
      background: #e2e8f0;
      color: #475569;
    }
    .edit-timesheet-ready-status--ready {
      background: #22c55e;
      color: #fff;
    }
    .edit-timesheet-ready-status--not-ready {
      background: #ef4444;
      color: #fff;
    }
    .edit-timesheet-ready-status--loading {
      background: #d97706;
      color: #fff;
    }
    #check-edit-timesheet-ready.is-monitoring {
      background: #b45309;
    }
    #check-edit-timesheet-ready.is-monitoring:hover {
      background: #92400e;
    }
    #walk-billing-pages-result,
    #billing-500-mode-result {
      margin-top: 8px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
      line-height: 1.4;
      white-space: pre-wrap;
    }
    #walk-billing-pages-result:empty,
    #billing-500-mode-result:empty {
      display: none;
    }
    /* AI Search */
    .ai-search-input {
      width: 100%;
      padding: 8px 10px;
      font-size: 13px;
      font-family: system-ui, sans-serif;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      box-sizing: border-box;
      resize: vertical;
      min-height: 56px;
    }
    .ai-search-input:focus {
      outline: none;
      border-color: #0ea5e9;
      box-shadow: 0 0 0 2px rgba(14,165,233,0.15);
    }
    #ai-search-result {
      margin-top: 12px;
      padding: 8px;
      background: #f0f9ff;
      border-radius: 4px;
      font-size: 12px;
    }
    #ai-search-result:empty {
      display: none;
    }
    #ai-search-result h3 {
      margin: 0 0 6px 0;
      font-size: 13px;
      color: #0369a1;
    }
    #ai-search-result .ai-summary {
      margin: 0 0 4px 0;
      font-size: 11px;
      color: #475569;
    }
    #ai-search-list:empty {
      display: none;
    }
    #ai-search-list {
      margin-top: 8px;
    }
    .ai-result-item {
      display: flex;
      flex-direction: column;
      padding: 8px 12px;
      font-size: 12px;
      color: #334155;
      border-bottom: 1px solid #cbd5e1;
    }
    .ai-result-item:last-child {
      border-bottom: none;
    }
    .ai-result-item__line {
      line-height: 1.35;
      margin-bottom: 2px;
    }
    .ai-result-item__line:first-child {
      color: #0369a1;
      font-weight: 600;
    }
    .ai-result-item__line:last-child {
      margin-bottom: 0;
    }
    .ai-result-item__line b {
      color: #64748b;
      font-weight: 600;
    }
    .ai-result-pair {
      padding: 0 !important;
    }
    .ai-pair-row {
      padding: 8px 12px;
    }
    .ai-pair-vs {
      text-align: center;
      font-size: 10px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 2px 0;
      background: #f1f5f9;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
    }
    .settings-panel label + label {
      margin-top: 8px;
    }
    /* 97155 scan — unknown payor classification */
    .unknown-payors-prompt {
      padding: 10px 12px;
      background: #fffbeb;
      border: 1px solid #fbbf24;
      border-radius: 6px;
      margin-bottom: 10px;
    }
    .unknown-payors-prompt__title {
      margin: 0 0 6px 0;
      font-size: 13px;
      color: #92400e;
    }
    .unknown-payors-prompt__row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      padding: 8px 0;
      border-top: 1px solid #fde68a;
    }
    .unknown-payors-prompt__row:first-of-type {
      border-top: none;
      padding-top: 4px;
    }
    .unknown-payors-prompt__label {
      flex: 1;
      min-width: 140px;
      font-size: 12px;
      font-weight: 600;
      color: #78350f;
      word-break: break-word;
    }
    .unknown-payors-prompt__btn {
      padding: 6px 12px;
      font-size: 12px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      color: #fff;
    }
    .unknown-payors-prompt__btn--allow {
      background: #059669;
    }
    .unknown-payors-prompt__btn--allow:hover {
      background: #047857;
    }
    .unknown-payors-prompt__btn--block {
      background: #b45309;
    }
    .unknown-payors-prompt__btn--block:hover {
      background: #92400e;
    }
    .ai-saved-row {
      display: flex;
      gap: 4px;
      margin-bottom: 6px;
      position: relative;
    }
    .ai-saved-trigger {
      flex: 1;
      min-width: 0;
      padding: 6px 24px 6px 8px;
      font-size: 12px;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2364748b'/%3E%3C/svg%3E") no-repeat right 8px center;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4;
      color: #334155;
    }
    .ai-saved-trigger:hover {
      border-color: #94a3b8;
    }
    .ai-saved-dropdown {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 28px;
      z-index: 100;
      max-height: 240px;
      overflow-y: auto;
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,.12);
      margin-top: 2px;
    }
    .ai-saved-dropdown.open {
      display: block;
    }
    .ai-saved-dropdown-item {
      padding: 8px 10px;
      font-size: 12px;
      line-height: 1.5;
      cursor: pointer;
      white-space: normal;
      word-wrap: break-word;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    .ai-saved-dropdown-item:last-child {
      border-bottom: none;
    }
    .ai-saved-dropdown-item:hover {
      background: #f0f9ff;
    }
    .ai-saved-dropdown-item.selected {
      background: #e0f2fe;
      font-weight: 600;
    }
    .ai-saved-dropdown-empty {
      padding: 8px 10px;
      font-size: 12px;
      color: #94a3b8;
      font-style: italic;
    }
    .ai-saved-delete {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      padding: 0;
      font-size: 16px;
      line-height: 1;
      background: none;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      color: #94a3b8;
      cursor: pointer;
    }
    .ai-saved-delete:hover {
      color: #dc2626;
      border-color: #dc2626;
      background: none;
    }
    .ai-save-btn {
      background: #16a34a;
      font-size: 13px;
      padding: 8px 14px;
    }
    .ai-save-btn:hover {
      background: #15803d;
    }
    .ai-highlight-btn {
      font-size: 13px;
      padding: 8px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #f1f5f9;
      color: #64748b;
      cursor: pointer;
    }
    .ai-highlight-btn:hover {
      background: #e2e8f0;
    }
    .ai-highlight-btn.active {
      background: #fef08a;
      border-color: #eab308;
      color: #854d0e;
    }
    .ai-highlight-btn.active:hover {
      background: #fde047;
    }
    .ai-filter-btn {
      background: #0ea5e9;
      color: #fff;
      font-size: 13px;
      padding: 8px 14px;
    }
    .ai-filter-btn:hover {
      background: #0284c7;
    }
    .ai-clear-highlight-btn {
      background: #94a3b8;
      font-size: 13px;
      padding: 8px 14px;
    }
    .ai-clear-highlight-btn:hover {
      background: #64748b;
    }
    .panel-build {
      font-size: 11px;
      font-weight: 500;
      color: #64748b;
      margin-left: 6px;
    }
    .rbt-folder-box {
      padding: 10px 12px;
      margin-bottom: 12px;
      background: #fff;
      border: 1px solid #d2d2d7;
      border-radius: 8px;
    }
    .rbt-folder-box .rbt-label {
      font-size: 10px;
      color: #6e6e73;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .rbt-btn {
      display: block;
      width: 100%;
      padding: 10px 12px;
      margin-bottom: 8px;
      border: 1px solid #d2d2d7;
      border-radius: 6px;
      background: #fff;
      color: #1d1d1f;
      cursor: pointer;
      font-size: 14px;
      text-align: left;
    }
    .rbt-btn:hover { background: #e8e8ed; }
    .rbt-queue-box {
      border: 1px solid #d2d2d7;
      border-radius: 8px;
      background: #fff;
      padding: 10px 12px;
      margin-bottom: 12px;
    }
    .rbt-queue-box .queue-header {
      font-size: 10px;
      color: #6e6e73;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .rbt-queue-list {
      max-height: 120px;
      overflow-y: auto;
      min-height: 40px;
    }
    .queue-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 8px;
      margin-bottom: 4px;
      background: #f5f5f7;
      border-radius: 4px;
      font-size: 12px;
      color: #1d1d1f;
    }
    .queue-item:last-child { margin-bottom: 0; }
    .queue-item .queue-remove {
      cursor: pointer;
      color: #c93434;
      font-size: 14px;
      padding: 0 4px;
    }
    .queue-empty-msg {
      font-size: 11px;
      color: #86868b;
      padding: 8px 0;
    }
    .rbt-status {
      font-size: 12px;
      color: #6e6e73;
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px solid #d2d2d7;
    }
    .rbt-save-log {
      font-size: 10px;
      color: #2d6a2d;
      margin-top: 8px;
      max-height: 100px;
      overflow-y: auto;
      background: #f0f7f0;
      padding: 6px 8px;
      border-radius: 4px;
      border: 1px solid #d2e8d2;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .rbt-form-row { margin-bottom: 8px; }
    .rbt-form-row label {
      display: block;
      font-size: 11px;
      color: #6e6e73;
      margin-bottom: 3px;
    }
    .rbt-form-row input,
    .rbt-form-row select {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid #d2d2d7;
      border-radius: 4px;
      background: #fff;
      color: #1d1d1f;
      font-size: 13px;
      box-sizing: border-box;
    }
    .bcba-directory-result {
      margin-top: 10px;
      font-size: 12px;
      max-height: 360px;
      overflow: auto;
    }
    .bcba-directory-result details {
      margin-bottom: 8px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 8px;
      background: #fff;
    }
    .bcba-directory-result summary {
      cursor: pointer;
      font-weight: 600;
      color: #0f172a;
    }
    .bcba-directory-result ul {
      margin: 6px 0 0 0;
      padding-left: 18px;
    }
    .bcba-directory-result li {
      margin: 2px 0;
      color: #334155;
    }</style><div class="main-scroll">
  <h2>Hidden Lights <span class="panel-build" id="panel-build-label"></span></h2>

  <div class="tab-bar">
    <button type="button" class="tab active" data-panel="auto" aria-pressed="true">Concurrences</button>
    <button type="button" class="tab" data-panel="bcba-reports" aria-pressed="false">BCBA reports</button>
    <button type="button" class="tab" data-panel="rbt-reports" aria-pressed="false">RBT reports</button>
    <button type="button" class="tab" data-panel="manual" aria-pressed="false" hidden>Manual</button>
  </div>

  <div id="panel-auto" class="panel active">
    <div class="section" id="overlap-fix-section">
      <div class="buttons">
        <button id="texas-overlaps-scan" type="button" class="concurance-scan-btn" style="width:100%">Scan</button>
      </div>
      <div id="overlap-run-all-wrap"></div>
      <div id="overlap-fix-buttons" class="overlap-fix-list"></div>
      <div id="overlaps-result"></div>
      <div id="overlap-fix-result"></div>
    </div>
  </div>

  <div id="panel-bcba-reports" class="panel">
    <div class="section">
      <div class="section-title">BCBA Directory</div>
      <p class="section-hint">Opens the BCBA contacts label list, scrapes each BCBA, then loads connected clients for a full directory.</p>
      <div class="buttons">
        <button id="bcba-directory-btn" type="button" class="concurance-scan-btn" style="width:100%">Directory</button>
      </div>
      <div id="bcba-directory-status" class="section-hint" aria-live="polite"></div>
      <div id="bcba-directory-result" class="bcba-directory-result" aria-live="polite"></div>
    </div>
  </div>

  <div id="panel-rbt-reports" class="panel">
    <div class="section">
      <div class="section-title">RBT reports</div>
      <div class="rbt-folder-box">
        <div class="rbt-label">Clients folder (required)</div>
        <button type="button" class="rbt-btn" id="rbt-btn-choose-folder">Choose Clients folder</button>
      </div>
      <div id="rbt-main-content" style="display:none;flex-direction:column;">
        <div id="rbt-main-scroll">
          <div id="rbt-queue-section" class="rbt-queue-box">
            <div class="queue-header">Queue</div>
            <button type="button" class="rbt-btn" id="rbt-btn-add-to-queue">Add to queue</button>
            <div id="rbt-queue-list" class="rbt-queue-list"></div>
          </div>
          <button type="button" class="rbt-btn" id="rbt-btn-run-main">Generate report for only the Current Contact</button>
          <div class="rbt-status" id="rbt-status">Ready.</div>
          <div id="rbt-save-log" class="rbt-save-log"></div>
          <div id="rbt-settings-section" style="display:none;margin-top:12px;padding-top:12px;border-top:1px solid #d2d2d7;">
            <h3 style="font-size:0.9rem;margin:0 0 8px;color:#0369a1;">Settings</h3>
            <div class="rbt-form-row">
              <label>Low utilization threshold (%)</label>
              <input type="number" id="rbt-settings-low-util-threshold" value="80" min="0" max="100" placeholder="80">
            </div>
            <div class="rbt-form-row">
              <label>Unfound clients folder name</label>
              <input type="text" id="rbt-settings-unfound-folder" value="Unfound Clients" placeholder="Unfound Clients">
            </div>
            <div class="rbt-form-row">
              <label>Auth to select</label>
              <select id="rbt-settings-auth-selection">
                <option value="current">Current / Most Recent</option>
                <option value="1">Most Recent</option>
                <option value="2">2nd Most Recent</option>
                <option value="3">3rd Most Recent</option>
              </select>
            </div>
            <button type="button" class="rbt-btn" id="rbt-btn-manual-mode" style="margin-top:12px;">Manual mode</button>
            <div id="rbt-manual-mode-section" style="display:none;">
              <h2 style="font-size:0.95rem;margin:12px 0 8px 0;color:#0369a1;border-top:1px solid #d2d2d7;padding-top:12px;">Run Full Report</h2>
              <div id="rbt-run-full-form">
                <div style="font-size:10px;color:#6e6e73;margin-bottom:6px;text-transform:uppercase;">PDF report fields</div>
                <div class="rbt-form-row">
                  <label>Client name</label>
                  <input type="text" id="rbt-pdf-client-name" placeholder="Client name">
                </div>
                <div class="rbt-form-row">
                  <label>DOB</label>
                  <input type="text" id="rbt-pdf-dob" placeholder="DOB">
                </div>
                <div class="rbt-form-row">
                  <label>Authorized hours</label>
                  <input type="number" id="rbt-pdf-authorized-hours" placeholder="e.g. 364" min="0">
                </div>
                <div style="font-size:10px;color:#6e6e73;margin-top:2px;">Utilization % = (total duration ÷ authorized hours) × 100 — auto-calculated.</div>
                <div style="font-size:10px;color:#6e6e73;margin:10px 0 6px;text-transform:uppercase;">Search filters &amp; auth period</div>
                <div class="rbt-form-row" id="rbt-row-auth-date-range" style="display:none;">
                  <label>Auth date range</label>
                  <select id="rbt-run-auth-date-range">
                    <option value="">— Select —</option>
                  </select>
                </div>
                <div class="rbt-form-row">
                  <label>Start date</label>
                  <input type="text" id="rbt-run-start-date" value="08/04/2025" placeholder="MM/DD/YYYY">
                </div>
                <div class="rbt-form-row">
                  <label>Stop date</label>
                  <input type="text" id="rbt-run-stop-date" value="02/04/26" placeholder="MM/DD/YYYY">
                </div>
                <div class="rbt-form-row">
                  <label>Contact ID</label>
                  <input type="text" id="rbt-run-contact-id" value="3792429" placeholder="Contact ID">
                </div>
                <div class="rbt-form-row">
                  <label>Service code</label>
                  <select id="rbt-run-service-code">
                    <option value="97153 tx">97153 tx</option>
                    <option value="97155 tx t">97155 tx t</option>
                    <option value="97156 tx t">97156 tx t</option>
                    <option value="all" selected>All</option>
                  </select>
                </div>
                <button type="button" class="rbt-btn" id="rbt-btn-load-contact-info">Load Contact Info</button>
                <button type="button" class="rbt-btn" id="rbt-btn-run-full-report" data-action="runFullReport">Run Full Report</button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="rbt-btn" id="rbt-btn-show-settings" style="margin-top:12px;">Show settings</button>
      </div>
    </div>
  </div>

  <div id="panel-manual" class="panel">
  <div class="section">
    <div class="section-title">Signatures</div>
    <div class="buttons">
      <button id="sig">Sig</button>
      <button id="open-client-sig">Open client sig</button>
      <button id="open-provider-sig">Open provider sig</button>
      <button id="fill-no-signature">No signature + agree</button>
      <button id="click-sign-confirm">Confirm sign</button>
      <button id="click-continue-dismiss">Dismiss dialog</button>
      <button id="auto-sign-both" style="background:#1565c0;color:#fff;font-weight:700;">Auto sign both</button>
    </div>
    <div id="open-sig-result"></div>
  </div>

  <div class="section">
    <div class="section-title">Basics</div>
    <div class="buttons">
      <button id="texas-overlaps-manual" type="button" class="concurance-scan-btn">Scan</button>
      <button id="edit-timesheet">Edit Timesheet</button>
      <button type="button" id="check-edit-timesheet-ready">Watch grid load</button>
    </div>
    <div id="edit-timesheet-ready-status" class="edit-timesheet-ready-status edit-timesheet-ready-status--idle" aria-live="polite">—</div>
    <p class="section-hint section-hint--billing-walk"><strong>Walk all billing pages</strong> always runs 500 mode first (hash <code>pageSize=500</code>, no <code>page=</code>), clicks <strong>Apply</strong>, waits until the grid has finished loading, then uses <strong>Next</strong> only with a <strong>3s</strong> gap after each page. Stops when there is no Next, 0 rows, or load timeout.</p>
    <div class="buttons">
      <button type="button" id="billing-500-mode">500 mode (hash + Apply)</button>
      <button type="button" id="walk-billing-pages">Walk all billing pages</button>
    </div>
    <p class="section-hint section-hint--billing-walk">500 mode: sets <code>pageSize=500</code>, removes <code>page=</code> in the hash, then clicks <strong>Apply</strong> when the MUI button shows (same setup as the start of a walk).</p>
    <div id="billing-500-mode-result" aria-live="polite"></div>
    <div id="walk-billing-pages-result" aria-live="polite"></div>
  </div>

  <div class="section">
    <div class="section-title">Time sheet shared</div>
    <div class="buttons">
      <button id="read-timesheet">Read Time Sheet</button>
      <button id="add-service-line">Add Service Line</button>
      <button id="set-date-today">Set Date (1 month ago)</button>
      <button id="enter-times">Enter times</button>
      <button id="set-timesheet-timezone" type="button">Set time zone</button>
    </div>
    <div id="set-timesheet-timezone-result" aria-live="polite"></div>
  </div>

  <div class="section">
    <div class="section-title">Non billable specif</div>
    <div class="buttons">
      <button id="select-nonbillable-code">Select nonbillable code</button>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Billable new</div>
    <div class="buttons">
      <button id="click-billable-97153">97153</button>
      <button id="select-payor-option">Master</button>
      <button id="select-place-of-service">Place of service</button>
      <button id="select-service-address">Service address</button>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Note</div>
    <div class="buttons">
      <button id="click-existing-note">Click existing note</button>
      <button id="click-note-by-date-name">Click note (03/17 Molly)</button>
      <button type="button" id="selected-backup-notes">Selected backup notes</button>
      <button id="click-close-note">Close note</button>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Provider</div>
    <p class="section-hint">On the billing list: click the provider name on the first row (opens the contact card). With the contact card open, read its labels.</p>
    <div class="buttons">
      <button id="click-provider-name">Click provider name</button>
      <button id="read-contact-labels">Read labels</button>
      <button id="close-contact-card">Close contact card</button>
      <button id="provider-combo">Combo: open → read labels → close</button>
    </div>
    <div id="click-provider-name-result"></div>
    <div id="read-contact-labels-result"></div>
    <div id="close-contact-card-result"></div>
    <div id="provider-combo-result"></div>
  </div>

  <div id="add-service-line-result"></div>
  <div id="set-date-result"></div>
  <div id="enter-times-result"></div>
  <div id="select-place-of-service-result"></div>
  <div id="select-service-address-result"></div>
  <div id="select-nonbillable-code-result"></div>
  <div id="click-billable-97153-result"></div>
  <div id="select-payor-option-result"></div>
  <div id="click-existing-note-result"></div>
  <div id="click-note-by-date-name-result"></div>
  <div id="selected-backup-notes-result"></div>
  <div id="click-close-note-result"></div>
  <div id="timesheet-result"></div>
  </div><!-- /#panel-manual -->

  <div id="panel-ai-search" class="panel">
    <div class="section">
      <div class="section-title">AI-Powered Search</div>
      <p class="section-hint">Describe what you want to find in the billing table in plain English. The AI will read the current page and find matching rows.</p>
      <div class="ai-saved-row">
        <div id="ai-saved-trigger" class="ai-saved-trigger">-- saved searches --</div>
        <div id="ai-saved-dropdown" class="ai-saved-dropdown"></div>
        <button type="button" id="ai-saved-delete" class="ai-saved-delete" title="Delete selected saved search">&times;</button>
      </div>
      <textarea id="ai-search-input" class="ai-search-input" rows="3" placeholder="e.g. Find all codes 97155 that are at the same time as 97153&#10;e.g. Payor is United and code 97153"></textarea>
      <div class="buttons" style="margin-top:8px;">
        <button type="button" id="ai-search-btn">Search</button>
        <button type="button" id="ai-save-search-btn" class="ai-save-btn" style="display:none;">Save search</button>
        <button type="button" id="ai-highlight-toggle" class="ai-highlight-btn active" style="display:none;">Highlight</button>
        <button type="button" id="ai-filter-btn" class="ai-filter-btn" style="display:none;">Filter page</button>
        <button type="button" id="ai-reset-page-btn" class="ai-clear-highlight-btn" style="display:none;">Reset page</button>
      </div>
      <div id="ai-search-result"></div>
      <div id="ai-search-list"></div>
    </div>
  </div><!-- /#panel-ai-search -->

  </div><!-- /.main-scroll -->

  <div class="console-bar">
    <div class="console-header">
      <span class="console-label">Console</span>
      <button type="button" class="settings-btn" id="toggle-settings" title="Settings">&#9881;</button>
    </div>
    <div class="console-bar-scroll">
      <div class="settings-panel" id="settings-panel">
        <div class="settings-section">
          <div class="settings-section-title">97155 concurrents scan — payors</div>
          <p class="settings-help">
            Substrings match the Payor column (case-insensitive). Put <strong>one entry per line</strong> (commas also work).
            Block list is applied first. Then allow list — use <code>*</code> alone to allow every payor that is not blocked.
            Rows that match neither list are held until you choose allow or block. Use <code>(empty payor)</code> as a literal
            entry to match blank payor cells.
          </p>
          <label for="settings-payors-allow">Allow list (whitelist)</label>
          <textarea id="settings-payors-allow" rows="4" placeholder="United Healthcare Community Plan&#10;Aetna&#10;or *"></textarea>
          <label for="settings-payors-block">Block list (blacklist)</label>
          <textarea id="settings-payors-block" rows="4" placeholder="Medicare&#10;Medicaid"></textarea>
        </div>
        <div class="settings-section">
          <div class="settings-section-title">AI Search</div>
          <label for="settings-anthropic-key">Anthropic API key <span style="font-weight:400;color:#64748b;">(optional)</span></label>
          <input type="password" id="settings-anthropic-key" placeholder="sk-ant-...">
        </div>
        <div>
          <button type="button" class="settings-save" id="settings-save">Save</button>
          <span class="settings-saved-msg" id="settings-saved-msg">Saved</span>
        </div>
      </div>
      <div id="log"></div>
    </div>
  </div>

  `;

/**
 * Element selectors and page config for CentralReach (members.centralreach.com).
 * All selectors and URLs live here so content script stays generic.
 * Injected first in content_scripts; shared with content.js in the same isolated world.
 */
var CENTRALREACH_SELECTORS = {
  // Base URL for the app
  baseUrl: 'https://members.centralreach.com',

  // Reporting page we're targeting
  reportingUrl: 'https://members.centralreach.com/#reporting/104',

  // Default values for filters (change as needed)
  defaultContactId: '3792429',
  defaultServiceCode: 'all',

  // Report table column indices (0-based) for export
  reportTableDateCol: 0,
  reportTableDurationCol: 3,

  // Run All – edit these to change what the "Run All" button does
  runAll: {
    dateFrom: '08/04/2025',
    dateTo: '02/04/26',
    contactId: '3792429',
    serviceCode: 'all'
  },

  // Report 104 (Service Audits) – main working area. Each element has multiple selectors (CSS + XPath)
  // tried in order for resilience. CSS first, then XPath fallbacks.
  elements: {
    formPanel: ['.form-panel', '//div[contains(@class,"form-panel")]'],
    reportName: ['#reportName', '//h2[@id="reportName"]'],
    report104: ['#cr__reporting-104', '//div[@id="cr__reporting-104"]'],
    report104Container: ['#indReportRoot', '//div[@id="indReportRoot"]'],
    dateFrom: [
      '#dateFrom',
      'input#dateFrom',
      'input.dateCal[placeholder="From..."]',
      '//input[@id="dateFrom"]',
      '//input[@placeholder="From..."]'
    ],
    dateTo: [
      '#dateTo',
      'input#dateTo',
      'input.dateCal[placeholder="To..."]',
      '//input[@id="dateTo"]',
      '//input[@placeholder="To..."]',
      '/html/body/div[1]/div[1]/div[4]/div[1]/div[1]/div/div/div/div[2]/div[28]/div/div[1]/div[2]/div/input'
    ],
    btnSearch: ['#btnsearch', 'a#btnsearch', '//a[@id="btnsearch"]'],
    exportBtn: ['a.export-report', '//a[contains(@class,"export-report")]'],
    reportTable: ['#reportTable', '//table[@id="reportTable"]'],
    reportList: ['#reportList', '//tbody[@id="reportList"]'],
    filterContact: ['[data-bind*="clientSelect"]', '//input[contains(@data-bind,"clientSelect")]'],
    filterContactTrigger: [
      'span.select2-chosen[id="select2-chosen-8"]',
      '#indReportRoot span.select2-chosen:first-of-type',
      'span.select2-chosen[id*="select2-chosen"]',
      '//span[contains(@class,"select2-chosen") and contains(.,"Filter by contact")]',
      '#indReportRoot .select2-container:first-of-type .select2-choice',
      '#cr__reporting-104 .form-inline .select2-container:first-of-type .select2-choice',
      '.select2-container .select2-choice',
      '/html/body/div[1]/div[1]/div[4]/div[1]/div[1]/div/div/div/div[2]/div[28]/div/div[1]/div[3]/div/a/span[1]'
    ],
    filterContactSearchInput: [
      '#s2id_autogen8_search',
      'input#s2id_autogen8_search',
      '#select2-drop input.select2-input',
      '.select2-drop-active input.select2-input',
      '.select2-drop .select2-search input',
      'input.select2-input[placeholder*="contact"]',
      'input[placeholder="Filter by contact..."]',
      '//input[contains(@placeholder,"Filter by contact")]',
      '/html/body/div[10]//input[@class="select2-input"]'
    ],
    filterContactResult: [
      '.select2-drop .select2-results li.select2-result-selectable',
      '.select2-drop .select2-results li.select2-highlighted',
      '#select2-drop .select2-results li',
      '.select2-results li.select2-result-selectable',
      '//div[@id="select2-drop"]//ul[@class="select2-results"]/li',
      '/html/body/div[10]//ul[@class="select2-results"]/li'
    ],
    filterEmployee: ['[data-bind*="employeeSelect"]', '//input[contains(@data-bind,"employeeSelect")]'],
    filterServiceCode: ['[data-bind*="codeSelect"]', '//input[contains(@data-bind,"codeSelect")]'],
    filterServiceCodeTrigger: [
      '//span[contains(@class,"select2-chosen") and contains(.,"Filter by service code")]',
      '/html/body/div[1]/div[1]/div[4]/div[1]/div[1]/div/div/div/div[2]/div[28]/div/div[1]/div[5]/div/a/span[1]',
      '#indReportRoot .select2-container:nth-of-type(3) span.select2-chosen',
      'span.select2-chosen[id*="select2-chosen"]'
    ]
  }
};

/**
 * Side panel: Sig button sends drawS to the active tab's content script.
 * Logs to both console and the #log div in the panel.
 */
const PANEL_BUILD = '2026-07-13rbt-storage';
const logEl = document.getElementById('log');

(function showPanelBuild() {
  var el = document.getElementById('panel-build-label');
  if (el) el.textContent = PANEL_BUILD;
})();

/* ---------- Mode visibility flags ---------- */
const ENABLE_MANUAL_MODE = false;
const ENABLE_AI_SEARCH_MODE = false;

/* ---------- Settings panel ---------- */
const SETTINGS_STORAGE_KEY = 'hidden_lights_fixer_settings';
const DEFAULT_ALLOWED_PAYORS = ['United Healthcare Community Plan'];

/** Split comma- or newline-separated settings lists (payor allow/block). */
function commaSplitLines(raw) {
  if (!raw || typeof raw !== 'string') return [];
  return raw
    .split(/[\n,]+/)
    .map(function (s) {
      return s.trim();
    })
    .filter(Boolean);
}

/**
 * Stored payor lists are string[] — legacy rows sometimes used one comma-joined string per slot.
 * Split each element so UI and inject always see one substring per entry.
 */
function flattenPayorStringsForList(items) {
  var out = [];
  if (!Array.isArray(items)) return out;
  items.forEach(function (item) {
    commaSplitLines(String(item || '')).forEach(function (t) {
      if (t) out.push(t);
    });
  });
  return out;
}

let _settingsCache = null;

/** Read settings from the active tab's localStorage via execScript. */
async function _loadSettingsFromPage() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return null;
    const results = await execScript({
      target: { tabId: tab.id },
      func: (key) => {
        try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null; }
        catch (e) { return null; }
      },
      args: [SETTINGS_STORAGE_KEY]
    });
    return results && results[0] && results[0].result;
  } catch (e) {
    console.warn('[Settings] page read failed:', e);
    return null;
  }
}

/** Write settings to the active tab's localStorage via execScript. */
async function _saveSettingsToPage(obj) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    await execScript({
      target: { tabId: tab.id },
      func: (key, val) => {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
      },
      args: [SETTINGS_STORAGE_KEY, obj]
    });
  } catch (e) {
    console.warn('[Settings] page write failed:', e);
  }
}

let _settingsCacheReady = null;

async function _initSettingsCache() {
  _settingsCache = await _loadSettingsFromPage();
  console.log('[Settings] loaded:', _settingsCache ? Object.keys(_settingsCache).join(', ') : '(empty)');
}

function _ensureSettingsLoaded() {
  if (!_settingsCacheReady) _settingsCacheReady = _initSettingsCache();
  return _settingsCacheReady;
}

function loadSettings() {
  return _settingsCache;
}

function saveSettings(obj) {
  const existing = _settingsCache || {};
  _settingsCache = Object.assign({}, existing, obj);
  _saveSettingsToPage(_settingsCache);
}

function getAllowedPayors() {
  const s = loadSettings();
  const raw =
    s && Array.isArray(s.allowedPayors) && s.allowedPayors.length ? s.allowedPayors : null;
  if (!raw) return DEFAULT_ALLOWED_PAYORS.slice();
  const flat = flattenPayorStringsForList(raw);
  return flat.length ? flat : DEFAULT_ALLOWED_PAYORS.slice();
}

function getBlockedPayors() {
  const s = loadSettings();
  if (!s || !Array.isArray(s.blockedPayors) || !s.blockedPayors.length) return [];
  return flattenPayorStringsForList(s.blockedPayors);
}

/** Append one substring to allowed payors (dedupe), persist, merge with existing settings. */
function addPayorToAllowedList(substring) {
  const t = typeof substring === 'string' ? substring.trim() : '';
  if (!t) return;
  const cur = getAllowedPayors().slice();
  if (!cur.some(function (x) { return x === t; })) cur.push(t);
  saveSettings({ allowedPayors: cur.length ? cur : DEFAULT_ALLOWED_PAYORS });
}

function addPayorToBlockedList(substring) {
  const t = typeof substring === 'string' ? substring.trim() : '';
  if (!t) return;
  const cur = getBlockedPayors().slice();
  if (!cur.some(function (x) { return x === t; })) cur.push(t);
  saveSettings({ blockedPayors: cur });
}

function getAnthropicApiKey() {
  const s = loadSettings();
  return (s && typeof s.anthropicApiKey === 'string') ? s.anthropicApiKey : '';
}

_ensureSettingsLoaded();

(function initSettingsPanel() {
  const toggleBtn = document.getElementById('toggle-settings');
  const panel = document.getElementById('settings-panel');
  const allowTa = document.getElementById('settings-payors-allow');
  const blockTa = document.getElementById('settings-payors-block');
  const apiKeyInput = document.getElementById('settings-anthropic-key');
  const saveBtn = document.getElementById('settings-save');
  const savedMsg = document.getElementById('settings-saved-msg');
  if (!toggleBtn || !panel) return;
  toggleBtn.addEventListener('click', async () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      _settingsCacheReady = _initSettingsCache();
      await _settingsCacheReady;
      if (allowTa) allowTa.value = getAllowedPayors().join('\n');
      if (blockTa) blockTa.value = getBlockedPayors().join('\n');
      if (apiKeyInput) apiKeyInput.value = getAnthropicApiKey();
      if (allowTa) allowTa.focus();
    }
  });
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const allowedItems = allowTa ? commaSplitLines(allowTa.value) : [];
      const blockedItems = blockTa ? commaSplitLines(blockTa.value) : [];
      const updated = {
        allowedPayors: allowedItems.length ? allowedItems : DEFAULT_ALLOWED_PAYORS,
        blockedPayors: blockedItems,
        anthropicApiKey: apiKeyInput ? apiKeyInput.value.trim() : ''
      };
      saveSettings(updated);
      if (savedMsg) {
        savedMsg.classList.add('show');
        setTimeout(() => savedMsg.classList.remove('show'), 1500);
      }
    });
  }
})();

/**
 * Snapshot from first timesheet during an overlap fix (provider, POS, address, date, timezone).
 * Stored per target tab so Run-all parallel jobs do not clobber each other.
 */
const overlapFixRecordByTabId = new Map();

function overlapFixRecordGet(tabId) {
  if (tabId == null || tabId === '') return null;
  return overlapFixRecordByTabId.get(tabId) || null;
}

function overlapFixRecordSet(tabId, rec) {
  if (tabId == null || tabId === '') return;
  overlapFixRecordByTabId.set(tabId, rec);
}

function overlapFixRecordClear(tabId) {
  if (tabId != null && tabId !== '') overlapFixRecordByTabId.delete(tabId);
}

const TIMESHEET_SNAPSHOT_READ_TIMEOUT_MS = 20000;

/**
 * Read line-1 timesheet fields into overlapFixRecordSet. Polls __timesheetResult with a timeout
 * so Run all rows do not spin forever if the inject never sets the global.
 */
async function captureOverlapFixTimesheetSnapshot(tabId, reportProgress) {
  if (reportProgress) await reportProgress('Saving snapshot…', 'snapshot');
  await execScript({
    target: { tabId: tabId },
    files: ['inject-service-line-tab-count.js', 'inject-read-timesheet.js']
  });
  await new Promise(function (r) {
    setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS);
  });
  var deadline = Date.now() + TIMESHEET_SNAPSHOT_READ_TIMEOUT_MS;
  var data = null;
  while (Date.now() < deadline) {
    var results = await execScript({
      target: { tabId: tabId },
      func: function () {
        return window.__timesheetResult;
      }
    });
    data = results && results[0] && results[0].result;
    if (data) break;
    await new Promise(function (r) {
      setTimeout(r, 400);
    });
  }
  if (!data) {
    return { error: 'Could not read timesheet (timed out waiting for snapshot).' };
  }
  if (data.error) {
    return { error: data.error };
  }
  overlapFixRecordSet(tabId, {
    provider: data.provider,
    placeOfService: data.placeOfService,
    serviceAddress: data.serviceAddress,
    serviceAddressText: data.serviceAddressText || data.serviceAddress,
    dateOfService: data.dateOfService,
    timeZone: data.timeZone,
    timeZoneValue: data.timeZoneValue != null ? String(data.timeZoneValue).trim() : ''
  });
  if (reportProgress) await reportProgress('Snapshot saved', 'snapshot');
  return { ok: true, data: data };
}

/** URL of the tab used for the last overlap scan (for Run all — duplicate list or timesheet deep link). */
let lastOverlapScanPageUrl = null;
/** `'texas'` | `'97155'` — which scan produced `lastOverlapScanPageUrl` (Texas = default billing overlap list). */
let lastOverlapScanMode = null;

/**
 * Run all: max concurrent workers. Fixes run truly in parallel — only
 * date-picker steps are serialized by the focus lock below.
 */
const RUN_ALL_MAX_CONCURRENT = 5;
/**
 * Minimum ms between consecutive `chrome.tabs.create` calls. Tighten/loosen stagger here.
 */
const RUN_ALL_TAB_CREATE_STAGGER_MS = 350;

/** For stagger between tab creates (first create is not delayed). */
let runAllLastTabsCreateMs = 0;

/**
 * Narrow focus lock for Run All — only held during the ~3–4 s date-picker
 * window (focus tab → set date → poll settle). Everything else runs in
 * parallel across tabs. Inactive (no-op) during single-entry execution.
 */
let _runAllFocusActive = false;
let _runAllFocusChain = Promise.resolve();
function acquireRunAllFocus() {
  if (!_runAllFocusActive) return Promise.resolve(function () {});
  const prev = _runAllFocusChain;
  let release;
  _runAllFocusChain = new Promise(function (r) { release = r; });
  return prev.then(function () { return release; });
}

/** @returns {Promise<void>} */
function sleepRunAll(ms) {
  return new Promise(function (r) {
    setTimeout(r, ms);
  });
}

/**
 * CentralReach date pickers often need the timesheet tab to be active.
 * During Run All, acquires the focus lock first so only one tab is active at a time.
 * @param {number} tabId
 * @returns {Promise<function>} release — caller MUST call release() when the focus-sensitive
 *   work is done (e.g. after pollForInjectResult for the date step).
 *   For single-entry execution the returned function is a no-op.
 */
async function focusTargetTabForTimesheetUi(tabId) {
  var release = await acquireRunAllFocus();
  if (tabId == null) return release;
  try {
    if (typeof chrome.tabs !== 'undefined' && typeof chrome.tabs.update === 'function') {
      await chrome.tabs.update(tabId, { active: true });
    } else if (typeof window.SHELL !== 'undefined' && typeof window.SHELL.activateTab === 'function') {
      await window.SHELL.activateTab(tabId);
    }
    await sleepRunAll(380);
  } catch (e) {
    log('Focus tab ' + tabId + ' (soft): ' + (e.message || String(e)));
  }
  return release;
}

/** Wait until timesheet editor is loaded enough to inject (date field preferred). */
async function waitForTimesheetEditorReady(tabId, entryId, maxWaitMs) {
  var waitMs = maxWaitMs != null ? maxWaitMs : 45000;
  var pollMs = 400;
  var stablePasses = 0;
  for (var elapsed = 0; elapsed < waitMs; elapsed += pollMs) {
    var data = null;
    try {
      var res = await execScript({
        target: { tabId: tabId },
        func: function () {
          var input =
            document.getElementById('dateOfService') ||
            document.querySelector('input[name="dateOfService"]') ||
            document.querySelector('input.hasDatepicker');
          var hasDateInput = false;
          if (input) {
            var rect = input.getBoundingClientRect();
            var style = window.getComputedStyle(input);
            hasDateInput =
              !!rect.width &&
              !!rect.height &&
              !input.disabled &&
              !input.readOnly &&
              style.visibility !== 'hidden' &&
              style.display !== 'none';
          }
          var hasTimeWorked = document.body.innerText.indexOf('Time worked') !== -1;
          var hasAnyInput = !!document.querySelector('input');
          if (hasDateInput || hasTimeWorked || hasAnyInput) {
            return { ready: true, hasDateInput: hasDateInput };
          }
          return { ready: false };
        },
      });
      data = res && res[0] && res[0].result;
    } catch (ePoll) {
      data = null;
    }
    if (data && data.ready) {
      stablePasses += 1;
      var needStable = data.hasDateInput ? 2 : 3;
      if (stablePasses >= needStable) {
        await sleepRunAll(_runAllFocusActive ? 1000 : 600);
        return true;
      }
    } else {
      stablePasses = 0;
    }
    await sleepRunAll(pollMs);
  }
  throw new Error('Timesheet editor did not finish loading in time (entry ' + entryId + ').');
}

/**
 * Build URL to open for Run all. Texas / Speech-shaped = same billing list URL; 97155 = timesheet editor hash for entry id.
 * @param {string} listUrl
 * @param {string} entryId
 * @param {'texas'|'speech'|'97155'} mode
 */
function buildRunAllOpenUrl(listUrl, entryId, mode) {
  if (!listUrl || !entryId) return listUrl;
  if (mode === '97155') {
    try {
      const u = new URL(listUrl);
      u.hash = 'billingmanager/timesheeteditor/?&id=' + String(entryId);
      return u.href;
    } catch (e) {
      return listUrl;
    }
  }
  return listUrl;
}

async function staggeredTabsCreate(url) {
  const now = Date.now();
  if (runAllLastTabsCreateMs > 0) {
    const due = runAllLastTabsCreateMs + RUN_ALL_TAB_CREATE_STAGGER_MS;
    if (now < due) await sleepRunAll(due - now);
  }
  let tab;
  if (typeof chrome.tabs.create === 'function') {
    tab = await chrome.tabs.create({ url: url, active: false });
  } else if (typeof window.SHELL !== 'undefined' && typeof window.SHELL.createTab === 'function') {
    tab = await window.SHELL.createTab({ url: url, active: false });
  } else {
    throw new Error('chrome.tabs.create is not available in this environment');
  }
  if (!tab || tab.id == null) {
    throw new Error('tabs.create returned no tab id');
  }
  runAllLastTabsCreateMs = Date.now();
  return tab;
}

function waitForTabStatusComplete(tabId, timeoutMs) {
  return new Promise(function (resolve, reject) {
    var done = false;
    var timer = setTimeout(function () {
      if (done) return;
      done = true;
      try {
        chrome.tabs.onUpdated.removeListener(onUpdated);
      } catch (e) {}
      reject(new Error('Tab load timed out after ' + Math.round(timeoutMs / 1000) + 's'));
    }, timeoutMs);
    function finishOk() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try {
        chrome.tabs.onUpdated.removeListener(onUpdated);
      } catch (e) {}
      resolve();
    }
    function onUpdated(id, info) {
      if (id !== tabId) return;
      if (info.status === 'complete') finishOk();
    }
    chrome.tabs.onUpdated.addListener(onUpdated);
    chrome.tabs.get(tabId).then(function (t) {
      if (t && t.status === 'complete') finishOk();
    }).catch(function () {});
  });
}

/** Wait for tab load: real extension API, or POEL sandbox `SHELL.waitTabComplete`. */
async function waitForTabLoadCompleteUnified(tabId, timeoutMs) {
  const ms = timeoutMs != null ? timeoutMs : 120000;
  if (
    typeof chrome.tabs !== 'undefined' &&
    chrome.tabs.onUpdated &&
    typeof chrome.tabs.onUpdated.addListener === 'function'
  ) {
    return waitForTabStatusComplete(tabId, ms);
  }
  if (typeof window.SHELL !== 'undefined' && typeof window.SHELL.waitTabComplete === 'function') {
    await window.SHELL.waitTabComplete(tabId, ms);
    return;
  }
  await sleepRunAll(Math.min(5000, ms));
}

async function setTabConcurrenceTitle(tabId, client, date) {
  var want = String((client || '').trim() + ' · ' + (date || '').trim()).trim();
  if (want.length > 120) want = want.slice(0, 117) + '...';
  if (!want) want = 'Hidden Lights';
  var betweenMs = [280, 450, 700];
  for (var round = 0; round <= betweenMs.length; round++) {
    if (round > 0) await sleepRunAll(betweenMs[round - 1]);
    try {
      await execScript({
        target: { tabId: tabId },
        world: 'MAIN',
        func: function (t) {
          document.title = t;
        },
        args: [want]
      });
    } catch (e) {
      /* ignore */
    }
  }
}

async function writeConcurrenceFixProgress(tabId, message, phase, error) {
  try {
    await execScript({
      target: { tabId: tabId },
      world: 'MAIN',
      func: function (p) {
        window.__concurrenceFixProgress = {
          phase: p.phase || '',
          message: p.message || '',
          error: p.error != null ? p.error : null,
          updatedAt: Date.now()
        };
      },
      args: [{ phase: phase || '', message: String(message || '').slice(0, 400), error: error != null ? String(error).slice(0, 400) : null }]
    });
  } catch (e) {
    /* tab gone */
  }
}

function createVirtualOverlapFixButton(fix, mode97155, meta) {
  var b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('data-run-all-virtual', '1');
  if (mode97155) b.setAttribute('data-fix-mode', '97155');
  b.setAttribute('data-entry-id', fix.entryId);
  b.setAttribute('data-time-from', fix.timeFrom);
  b.setAttribute('data-time-to', fix.timeTo);
  b.setAttribute('data-overlap', fix.overlapText || '');
  b.setAttribute('data-overlap-from', fix.overlapFrom || '');
  b.setAttribute('data-overlap-to', fix.overlapTo || '');
  b.setAttribute('data-part3-from', fix.part3From || '');
  b.setAttribute('data-part3-to', fix.part3To || '');
  b.setAttribute('data-overlap-type', fix.overlapType || 'middle');
  if (meta) {
    if (meta.client) b.setAttribute('data-client', meta.client);
    if (meta.date) b.setAttribute('data-date', meta.date);
    if (meta.originalTimes) b.setAttribute('data-original-times', meta.originalTimes);
    if (meta.logSummary) b.setAttribute('data-log-summary', meta.logSummary);
  }
  return b;
}

function createVirtualMulti97155FixButton(plan, meta) {
  var b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('data-run-all-virtual', '1');
  b.setAttribute('data-fix-mode', '97155-multi');
  b.setAttribute('data-entry-id', plan.entryId);
  b.setAttribute('data-fix-plan', JSON.stringify(plan));
  if (meta) {
    if (meta.client) b.setAttribute('data-client', meta.client);
    if (meta.date) b.setAttribute('data-date', meta.date);
    if (meta.originalTimes) b.setAttribute('data-original-times', meta.originalTimes);
    if (meta.logSummary) b.setAttribute('data-log-summary', meta.logSummary);
  }
  return b;
}

/** Match the visible Fix button for this run-all job (same row as a single Fix click). */
function findFixButtonForRunAllJob(job) {
  var root = document.getElementById('overlap-fix-buttons');
  if (!root) return null;
  var wantId = String((job.fix && job.fix.entryId) || '');
  var wantClient = String((job.client || '').trim());
  var wantDate = String((job.date || '').trim());
  var wantMode = job.mode === '97155-multi' ? '97155-multi' : job.mode === '97155' ? '97155' : '';
  var list = root.querySelectorAll('button.overlap-btn');
  for (var i = 0; i < list.length; i++) {
    var b = list[i];
    if (b.disabled) continue;
    if (String(b.getAttribute('data-entry-id') || '') !== wantId) continue;
    if (String(b.getAttribute('data-client') || '').trim() !== wantClient) continue;
    if (String(b.getAttribute('data-date') || '').trim() !== wantDate) continue;
    if (wantMode && String(b.getAttribute('data-fix-mode') || '') !== wantMode) continue;
    return b;
  }
  return null;
}

/** Non-error status line under the overlap row (same cell as fail reason). */
function setOverlapFixLiveProgress(btn, text) {
  if (!btn) return;
  var item = btn.closest('.overlap-list__item');
  if (!item) return;
  var el = item.querySelector('.overlap-list__fail-reason');
  if (!el) return;
  el.classList.add('overlap-list__fail-reason--progress');
  el.textContent = text || '';
}

function clearOverlapFixLiveProgress(btn) {
  if (!btn) return;
  var item = btn.closest('.overlap-list__item');
  if (!item) return;
  var el = item.querySelector('.overlap-list__fail-reason');
  if (!el) return;
  el.classList.remove('overlap-list__fail-reason--progress');
  el.textContent = '';
}

function clearOverlapRunAllMount() {
  var wrap = document.getElementById('overlap-run-all-wrap');
  if (wrap) wrap.innerHTML = '';
}

function mountOverlapRunAllUI(mode, groups, multiCases) {
  clearOverlapRunAllMount();
  var wrap = document.getElementById('overlap-run-all-wrap');
  if (!wrap || !lastOverlapScanPageUrl) return;
  var jobs = [];
  for (var i = 0; i < groups.length; i++) {
    var g = groups[i];
    var fix = getOverlapFixForGroup(g);
    if (!fix.ok) continue;
    var clientLabel = (g.client || '(no client)').trim();
    var dateLabel = (g.date || '').trim();
    var timesLine = (g.entries || [])
      .map(function (e) {
        return (e.time || '').trim() + ' ' + shortServiceCode(e.serviceAuth);
      })
      .join(' | ');
    var overlapText = fix.overlapText || (mode === '97155' ? getOverlap97155Display(g) : '');
    var logSummary =
      (mode === '97155' ? '97155' : 'speech') +
      ' · ' +
      clientLabel +
      ' • ' +
      dateLabel +
      ' ' +
      timesLine +
      (overlapText ? ' Overlap ' + overlapText : '');
    jobs.push({
      client: g.client,
      date: g.date,
      mode: mode,
      fix: fix,
      originalTimes: timesLine,
      logSummary: logSummary
    });
  }
  if (mode === '97155' && multiCases && multiCases.length) {
    for (var m = 0; m < multiCases.length; m++) {
      var item = multiCases[m];
      var plan = buildMulti97155FixPlanFromCase(item);
      if (!plan.ok) continue;
      var clientM = (item.client || '(no client)').trim();
      var dateM = (item.date || '').trim();
      var timesM =
        (item.entry97153.time || '').trim() +
        ' 97153 | ' +
        (item.concurrent97155 || [])
          .map(function (e) {
            return (e.time || '').trim() + ' 97155';
          })
          .join(' | ');
      jobs.push({
        client: item.client,
        date: item.date,
        mode: '97155-multi',
        plan: plan,
        fix: { entryId: plan.entryId },
        originalTimes: timesM,
        logSummary: '97155-multi · ' + clientM + ' • ' + dateM + ' ' + timesM
      });
    }
  }
  if (jobs.length === 0) return;
  var toolbar = document.createElement('div');
  toolbar.className = 'overlap-run-all-toolbar';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'overlap-run-all-btn';
  btn.textContent = 'Run all (' + jobs.length + ')';
  btn.addEventListener('click', function () {
    void startOverlapRunAll(jobs);
  });
  toolbar.appendChild(btn);
  wrap.appendChild(toolbar);
}

var _runAllPollTimer = null;

function stopRunAllProgressPoll() {
  if (_runAllPollTimer != null) {
    clearInterval(_runAllPollTimer);
    _runAllPollTimer = null;
  }
}

function startRunAllProgressPoll(tabIdToFixBtn) {
  stopRunAllProgressPoll();
  _runAllPollTimer = setInterval(function () {
    tabIdToFixBtn.forEach(function (fixBtn, tabId) {
      if (!fixBtn || !fixBtn.isConnected) return;
      execScript({
        target: { tabId: tabId },
        func: function () {
          return window.__concurrenceFixProgress || null;
        }
      })
        .then(function (res) {
          var data = res && res[0] && res[0].result;
          if (!data || !fixBtn.isConnected) return;
          var t = (data.message || data.phase || '').trim();
          if (t) setOverlapFixLiveProgress(fixBtn, t);
        })
        .catch(function () {});
    });
  }, 450);
}

/**
 * Run queued overlap fixes: staggered tab.create, up to RUN_ALL_MAX_CONCURRENT workers.
 * @param {Array<{ client: string, date: string, mode: 'texas'|'speech'|'97155', fix: object }>} jobs
 */
async function startOverlapRunAll(jobs) {
  var listUrl = lastOverlapScanPageUrl;
  if (!listUrl) {
    log('Run all: missing list URL — run Texas overlaps (97155 concurrents) scan again.');
    console.warn('[Run all]', 'missing list URL');
    return;
  }
  var runBtn = document.getElementById('overlap-run-all-btn');
  if (runBtn) runBtn.disabled = true;
  runAllLastTabsCreateMs = 0;
  _runAllFocusActive = true;
  _runAllFocusChain = Promise.resolve();

  function runAllLog(msg) {
    log(msg);
    try {
      console.warn('[Run all]', msg);
    } catch (e) {}
  }

  var tabIdToFixBtn = new Map();
  var rows = [];
  for (var j = 0; j < jobs.length; j++) {
    var job = jobs[j];
    var fixBtn = findFixButtonForRunAllJob(job);
    rows.push({ job: job, btn: fixBtn });
    if (fixBtn) {
      clearOverlapFixLiveProgress(fixBtn);
      setOverlapFixButtonState(fixBtn, 'loading');
      setOverlapFixFailReason(fixBtn, '');
      setOverlapFixLiveProgress(fixBtn, 'Queued');
    } else {
      runAllLog(
        'Run all: no Fix button for ' +
          String(job.client) +
          ' · ' +
          String(job.date) +
          ' (entry ' +
          String(job.fix && job.fix.entryId) +
          ')'
      );
    }
  }

  startRunAllProgressPoll(tabIdToFixBtn);

  var queue = rows.slice();
  var workers = Math.min(RUN_ALL_MAX_CONCURRENT, Math.max(1, queue.length));

  async function workerFn() {
    while (queue.length > 0) {
      var item = queue.shift();
      if (!item) break;
      var job = item.job;
      var fixBtn = item.btn;
      var openUrl = buildRunAllOpenUrl(listUrl, job.fix.entryId, job.mode);
      if (fixBtn) setOverlapFixLiveProgress(fixBtn, 'Creating tab…');
      runAllLog('Run all: creating tab entry=' + job.fix.entryId + ' url=' + String(openUrl).slice(0, 140));
      var tab;
      try {
        tab = await staggeredTabsCreate(openUrl);
      } catch (e) {
        runAllLog('Run all: tab create failed: ' + (e.message || String(e)));
        if (fixBtn) {
          clearOverlapFixLiveProgress(fixBtn);
          setOverlapFixButtonState(fixBtn, 'error');
          setOverlapFixFailReason(fixBtn, 'Could not open tab: ' + (e.message || String(e)));
        }
        continue;
      }
      if (!tab || tab.id == null) {
        runAllLog('Run all: tab create returned no id: ' + JSON.stringify(tab));
        if (fixBtn) {
          clearOverlapFixLiveProgress(fixBtn);
          setOverlapFixButtonState(fixBtn, 'error');
          setOverlapFixFailReason(fixBtn, 'Tab create returned no id (extension bridge).');
        }
        continue;
      }
      var tabId = tab.id;
      tabIdToFixBtn.set(tabId, fixBtn);
      if (fixBtn) setOverlapFixLiveProgress(fixBtn, 'Loading tab ' + tabId + '…');
      try {
        await waitForTabLoadCompleteUnified(tabId, 120000);
      } catch (e) {
        runAllLog('Run all: load failed tab ' + tabId + ': ' + (e.message || String(e)));
        if (fixBtn) {
          clearOverlapFixLiveProgress(fixBtn);
          setOverlapFixButtonState(fixBtn, 'error');
          setOverlapFixFailReason(fixBtn, e.message || String(e));
        }
        tabIdToFixBtn.delete(tabId);
        continue;
      }
      await setTabConcurrenceTitle(tabId, job.client, job.date);
      await writeConcurrenceFixProgress(tabId, 'Starting fix…', 'start', null);
      if (fixBtn) setOverlapFixLiveProgress(fixBtn, 'Running fix…');
      runAllLog('Run all: starting fix entry=' + job.fix.entryId + ' tab=' + tabId);
      var virtualBtn =
        job.mode === '97155-multi'
          ? createVirtualMulti97155FixButton(job.plan, {
              client: job.client,
              date: job.date,
              originalTimes: job.originalTimes || '',
              logSummary: job.logSummary || ''
            })
          : createVirtualOverlapFixButton(job.fix, job.mode === '97155', {
              client: job.client,
              date: job.date,
              originalTimes: job.originalTimes || '',
              logSummary: job.logSummary || ''
            });
      var hiddenEl = document.createElement('div');
      hiddenEl.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';
      hiddenEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(hiddenEl);
      var fixOpts = {
        targetTabId: tabId,
        resultEl: hiddenEl,
        progressTabId: tabId,
        skipTimesheetNavigate97155: true,
        isRunAll: true
      };
      try {
        if (job.mode === '97155-multi') {
          await runOverlapFix97155Multi(virtualBtn, fixOpts);
        } else if (job.mode === '97155') {
          await runOverlapFix97155(virtualBtn, fixOpts);
        } else {
          await runOverlapFixSpeech(virtualBtn, fixOpts);
        }
        var outcome = virtualBtn.getAttribute('data-run-all-outcome');
        if (outcome === 'error') {
          var failMsg = virtualBtn.getAttribute('data-run-all-fail') || 'Fix reported an error (see log).';
          runAllLog('Run all: fix error entry=' + job.fix.entryId + ' ' + failMsg);
          if (fixBtn) {
            clearOverlapFixLiveProgress(fixBtn);
            setOverlapFixButtonState(fixBtn, 'error');
            setOverlapFixFailReason(fixBtn, failMsg);
          }
          void writeConcurrenceFixProgress(tabId, failMsg, 'error', failMsg);
        } else {
          runAllLog('Run all: done entry=' + job.fix.entryId);
          if (fixBtn) {
            clearOverlapFixLiveProgress(fixBtn);
            setOverlapFixButtonState(fixBtn, 'success');
            setOverlapFixFailReason(fixBtn, '');
          }
        }
      } catch (err) {
        var msg = (err && err.message) || String(err);
        runAllLog('Run all: fix error entry=' + job.fix.entryId + ' ' + msg);
        if (fixBtn) {
          clearOverlapFixLiveProgress(fixBtn);
          setOverlapFixButtonState(fixBtn, 'error');
          setOverlapFixFailReason(fixBtn, msg);
        }
        void writeConcurrenceFixProgress(tabId, msg, 'error', msg);
      } finally {
        overlapFixRecordClear(tabId);
        tabIdToFixBtn.delete(tabId);
        document.body.removeChild(hiddenEl);
      }
    }
  }

  try {
    await Promise.all(
      Array.from({ length: workers }, function () {
        return workerFn();
      })
    );
  } finally {
    _runAllFocusActive = false;
    stopRunAllProgressPoll();
    if (runBtn) runBtn.disabled = false;
  }
}

/** POST overlap-fix telemetry to POEL (no cookie). Timesheet is not submitted — log on fix complete only. */
const POEL_PROGRAM_LOG_INGEST_URL =
  'https://www.poel.ai/api/ingest/program-logs/7621a158-c39a-4a16-b5af-22e1efb05694/2fe29489-451c-4e94-b2be-de2e9955f982';
const HIDDEN_TALENTS_APP_VERSION = '1.0.3';

/**
 * @returns {{ ok: boolean, status: number, text?: string, error?: string }}
 */
async function postPoelProgramLogIngest(body) {
  console.log('[Hidden Lights] POEL ingest → POST', POEL_PROGRAM_LOG_INGEST_URL);
  console.log('[Hidden Lights] POEL ingest body', body);
  try {
    if (
      typeof window !== 'undefined' &&
      window.SHELL &&
      typeof window.SHELL.ingestProgramLog === 'function'
    ) {
      try {
        var shellTimeoutMs = 20000;
        var ingestPromise = window.SHELL.ingestProgramLog(POEL_PROGRAM_LOG_INGEST_URL, body);
        var timeoutPromise = new Promise(function (resolve) {
          setTimeout(function () {
            resolve({ __timedOut: true });
          }, shellTimeoutMs);
        });
        var shellRes = await Promise.race([ingestPromise, timeoutPromise]);
        if (shellRes && shellRes.__timedOut) {
          console.error(
            '[Hidden Lights] POEL ingest timed out after ' +
              shellTimeoutMs +
              'ms — reload POEL CLIENTS v1.0.10+ (MessageChannel ingest).'
          );
          return { ok: false, status: 0, error: 'POEL shell ingest timed out (reload POEL extension v1.0.10+)' };
        }
        if (!shellRes || typeof shellRes !== 'object') {
          return { ok: false, status: 0, error: 'empty shell response' };
        }
        if (!shellRes.ok) {
          console.warn('[Hidden Lights] POEL ingest failed (shell)', shellRes.status, shellRes.text);
        }
        logPoelIngestServerAck(shellRes.text, 'shell');
        return { ok: !!shellRes.ok, status: shellRes.status || 0, text: shellRes.text || '' };
      } catch (shellErr) {
        var se = shellErr && shellErr.message ? shellErr.message : String(shellErr);
        console.error('[Hidden Lights] POEL ingest shell error:', shellErr);
        return { ok: false, status: 0, error: se };
      }
    }
    const res = await fetch(POEL_PROGRAM_LOG_INGEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'omit',
      mode: 'cors'
    });
    const text = await res.text().catch(function () {
      return '';
    });
    if (!res.ok) {
      console.warn('[Hidden Lights] POEL ingest failed', res.status, text);
    }
    logPoelIngestServerAck(text, 'direct');
    return { ok: res.ok, status: res.status, text: text };
  } catch (e) {
    const err = e && e.message ? e.message : String(e);
    console.error('[Hidden Lights] POEL ingest network/CORS error:', e);
    return { ok: false, status: 0, error: err };
  }
}

function parsePoelIngestResponseText(text) {
  try {
    var j = JSON.parse(text || '{}');
    if (j && typeof j === 'object') return j;
  } catch (e) {
    /* ignore */
  }
  return null;
}

function logPoelIngestServerAck(text, where) {
  var p = parsePoelIngestResponseText(text);
  if (p && p.id) {
    console.log('[Hidden Lights] POEL ingest recorded id=' + p.id + ' (' + where + ')');
  } else if (text && String(text).trim()) {
    console.log('[Hidden Lights] POEL ingest response (' + where + '):', String(text).slice(0, 500));
  } else {
    console.warn('[Hidden Lights] POEL ingest empty response body (' + where + ')');
  }
}

function overlapFixIngestPayloadFromButton(btn, kind) {
  return {
    kind: kind,
    client: btn.getAttribute('data-client') || '',
    date: btn.getAttribute('data-date') || '',
    originalTimes: btn.getAttribute('data-original-times') || '',
    logSummary: btn.getAttribute('data-log-summary') || '',
    entryId: btn.getAttribute('data-entry-id') || '',
    overlapType: btn.getAttribute('data-overlap-type') || '',
    timeFrom: btn.getAttribute('data-time-from') || '',
    timeTo: btn.getAttribute('data-time-to') || '',
    overlap: btn.getAttribute('data-overlap') || '',
    overlapFrom: btn.getAttribute('data-overlap-from') || '',
    overlapTo: btn.getAttribute('data-overlap-to') || '',
    part3From: btn.getAttribute('data-part3-from') || '',
    part3To: btn.getAttribute('data-part3-to') || ''
  };
}

function overlapFixIngestChangeSummary(detail, variant, kind) {
  var who = (detail.client || '').trim() ? detail.client.trim() + ' · ' : '';
  var orig = (detail.originalTimes || '').trim();
  var origBit = orig ? 'List times: ' + orig + '. ' : '';
  var p1 = detail.timeFrom + '–' + detail.timeTo;
  var ov = detail.overlapFrom + '–' + detail.overlapTo;
  if (variant === '2-line') {
    return (
      who +
      origBit +
      kind +
      ' (' +
      (detail.overlapType || '?') +
      '): Part 1 trimmed to ' +
      p1 +
      '; line 2 nonbillable ' +
      ov +
      '. Not submitted.'
    );
  }
  var tail = detail.part3From + '–' + detail.part3To;
  return (
    who +
    origBit +
    kind +
    ' (middle): Part 1 ' +
    p1 +
    '; line 2 nonbillable ' +
    ov +
    '; line 3 billable ' +
    tail +
    (kind === '97155' ? '; note linked; client+provider signatures.' : '; note linked.') +
    ' Not submitted.'
  );
}

function overlapFixVariantFromButton(btn) {
  return (btn.getAttribute('data-overlap-type') || 'middle') === 'middle' ? '3-line' : '2-line';
}

function logPoelIngestOutcome(r) {
  try {
    if (typeof log !== 'function') return;
    if (r.ok) {
      var parsed = parsePoelIngestResponseText(r.text);
      var idPart = parsed && parsed.id ? ' ingestId=' + parsed.id : '';
      log('POEL program log OK (HTTP ' + r.status + ')' + idPart);
    } else {
      log(
        'POEL program log failed (HTTP ' +
          (r.status || 0) +
          '): ' +
          (r.error || r.text || 'unknown').slice(0, 240)
      );
    }
  } catch (e) {
    /* ignore */
  }
}

/**
 * Log overlap fix completion to POEL without submitting the timesheet.
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
async function sendPoelOverlapFixCompleteIngest(btn, kind, variant, awaitIngest) {
  var detail = overlapFixIngestPayloadFromButton(btn, kind);
  var changeSummary = overlapFixIngestChangeSummary(detail, variant, kind);
  var clientLabel = (detail.client || '').trim() || 'unknown client';
  var summaryLine = (detail.logSummary || '').trim();
  var preview =
    summaryLine ||
    kind + ' · ' + clientLabel + (detail.entryId ? ' · entry ' + detail.entryId : '') + ' · ' + variant;
  var body = {
    level: 'info',
    message: preview,
    payload: {
      source: 'hidden-lights-fixer',
      appVersion: HIDDEN_TALENTS_APP_VERSION,
      submitted: false,
      kind: kind,
      variant: variant,
      client: clientLabel,
      date: (detail.date || '').trim(),
      originalTimes: (detail.originalTimes || '').trim(),
      logSummary: summaryLine,
      changeSummary: changeSummary,
      fix: detail
    }
  };
  try {
    log('Sending POEL program log (overlap fix complete, not submitted)…');
  } catch (e0) {
    /* ignore */
  }
  if (awaitIngest) {
    var rAwait = await postPoelProgramLogIngest(body);
    logPoelIngestOutcome(rAwait);
    return { ok: !!rAwait.ok, error: rAwait.ok ? undefined : rAwait.error || rAwait.text || 'ingest failed' };
  }
  postPoelProgramLogIngest(body).then(function (r) {
    logPoelIngestOutcome(r);
  });
  return { ok: true };
}

/**
 * Mark overlap fix success and POST POEL ingest (no timesheet submit).
 * @returns {Promise<boolean>}
 */
async function completeOverlapFixWithIngest(btn, kind, variant, fo, resultEl, successHtml, logLine) {
  var progressCtx = fo
    ? { progressTabId: fo.progressTabId, panelFixBtn: fo.panelFixBtn }
    : null;
  if (progressCtx) {
    await writeConcurrenceFixProgress(progressCtx.progressTabId, 'Logging fix…', 'ingest', null);
  }
  var ingestRes = await sendPoelOverlapFixCompleteIngest(btn, kind, variant, !!(fo && fo.isRunAll));
  if (ingestRes && !ingestRes.ok && fo && fo.isRunAll) {
    if (resultEl) resultEl.innerHTML = '';
    setOverlapFixButtonState(btn, 'error');
    if (fo.panelFixBtn) setOverlapFixButtonState(fo.panelFixBtn, 'error');
    var failMsg = ingestRes.error || 'POEL program log failed.';
    setOverlapFixFailReason(btn, failMsg);
    if (fo.panelFixBtn) setOverlapFixFailReason(fo.panelFixBtn, failMsg);
    log('Run all: ingest failed — ' + failMsg);
    return false;
  }
  if (progressCtx && progressCtx.progressTabId != null) {
    await writeConcurrenceFixProgress(progressCtx.progressTabId, 'Done', 'done', null);
  }
  setOverlapFixButtonState(btn, 'success');
  if (fo && fo.panelFixBtn) {
    clearOverlapFixLiveProgress(fo.panelFixBtn);
    setOverlapFixButtonState(fo.panelFixBtn, 'success');
    setOverlapFixFailReason(fo.panelFixBtn, '');
  }
  setOverlapFixFailReason(btn, '');
  if (resultEl && successHtml) resultEl.innerHTML = successHtml;
  if (logLine) log(logLine);
  return true;
}

/** Timings for speech-overlap Fix: same timesheet, 2–3 service lines (see JSDoc on `document.body` overlap listener). */
/** Short delay between discrete steps (navigation, separate injects). */
const OVERLAP_FIX_STEP_DELAY_MS = 350;

/**
 * Poll UI readiness every this many ms instead of long fixed sleeps (overlap fix).
 * Each phase stops as soon as the check passes, up to OVERLAP_FIX_UI_POLL_MAX_MS.
 */
const OVERLAP_FIX_UI_POLL_MS = 500;
const OVERLAP_FIX_UI_POLL_MAX_MS = 12000;

/** Wait after entering times on any line so the value has time to settle before read-back verify. */
const OVERLAP_FIX_AFTER_ENTER_TIMES_MS = 1200;
const OVERLAP_FIX_AFTER_FIRST_END_TIME_MS = OVERLAP_FIX_AFTER_ENTER_TIMES_MS;

/** Max attempts to enter times and verify From/To took (retry on verify failure). All lines. */
const OVERLAP_FIX_TIMES_VERIFY_ATTEMPTS = 3;
const OVERLAP_FIX_PART1_VERIFY_ATTEMPTS = OVERLAP_FIX_TIMES_VERIFY_ATTEMPTS;
/** Consecutive matching reads before we trust the UI (guards transient values that revert). */
const TIMES_VERIFY_STABLE_READS = 3;
const TIMES_VERIFY_STABLE_POLL_MS = 500;
const TIMES_VERIFY_STABLE_MAX_MS = 5500;
const PART1_VERIFY_STABLE_READS = TIMES_VERIFY_STABLE_READS;
const PART1_VERIFY_STABLE_POLL_MS = TIMES_VERIFY_STABLE_POLL_MS;
const PART1_VERIFY_STABLE_MAX_MS = TIMES_VERIFY_STABLE_MAX_MS;

/** inject-enter-times.js polls inputs up to 8s; From → To → refocus From to commit To. */
const ENTER_TIMES_RESULT_POLL_STEP_MS = 400;
const ENTER_TIMES_RESULT_POLL_MAX_MS = 9000;
const ENTER_TIMES_PART3_POLL_MAX_MS = 9500;

/**
 * inject-set-date-of-service.js types MM/DD/YYYY (~10 chars + delays), waits for the picker,
 * then polls for the day cell — finish before reading window.__setDateOfServiceResult.
 */
const SET_DATE_INJECT_SETTLE_MS = 3200;

/** Brief settle after payor click before place-of-service inject (MUI repopulates dependent dropdowns). */
const OVERLAP_FIX_AFTER_MASTER_MS = 1100;

/**
 * Speech line 3: fee schedule menu and Master/Associate payor tier can appear one after the other (either order).
 * Allow enough time for both to mount and be clicked.
 */
const OVERLAP_FIX_FEE_PAYOR_COMBINED_MAX_MS = Math.max(OVERLAP_FIX_UI_POLL_MAX_MS * 2, 24000);

/** Wait between note steps (existing note, click note by date/name, close note) - more loading. */
const OVERLAP_FIX_NOTE_STEP_MS = 800;

/**
 * Poll until inject-select-existing-session-note-flow sets __selectExistingSessionNoteFlowResult.
 * Match inject MAX_MS (2.5 min) and 3s poll interval.
 */
const OVERLAP_FIX_BACKUP_NOTE_POLL_MAX_MS = 150000;
const OVERLAP_FIX_BACKUP_NOTE_POLL_STEP_MS = 3000;

/**
 * Retry wrapper around execScript.
 * Catches transient errors (403, network hiccups) and retries up to maxRetries times.
 */
const EXEC_SCRIPT_MAX_RETRIES = 3;
const EXEC_SCRIPT_RETRY_DELAY_MS = 600;

const _chromeScripting = chrome.scripting;

async function execScript(opts) {
  let lastErr;
  for (let attempt = 0; attempt <= EXEC_SCRIPT_MAX_RETRIES; attempt++) {
    try {
      return await _chromeScripting.executeScript(opts);
    } catch (err) {
      lastErr = err;
      const msg = (err && err.message) || '';
      const isTransient = /Script failed:\s*\d{3}/i.test(msg) || /fetch|network|timeout/i.test(msg);
      if (!isTransient || attempt === EXEC_SCRIPT_MAX_RETRIES) throw err;
      console.warn('[execScript] attempt ' + (attempt + 1) + ' failed (' + msg + '), retrying in ' + EXEC_SCRIPT_RETRY_DELAY_MS + 'ms…');
      await new Promise((r) => setTimeout(r, EXEC_SCRIPT_RETRY_DELAY_MS));
    }
  }
  throw lastErr;
}

/** Scoped service-line tab count (inject-service-line-tab-count.js). */
async function fetchServiceLineTabCount(tabId) {
  await execScript({
    target: { tabId },
    files: ['inject-service-line-tab-count.js']
  });
  const r = await execScript({
    target: { tabId },
    func: () => window.__serviceLineTabCountResult
  });
  return r && r[0] && r[0].result;
}

/** Poll until at least one service-line tab exists or timeout (timesheet still loading). */
async function pollServiceLineTabCountUntilPositive(tabId, maxWaitMs = 5000) {
  const step = 300;
  for (let elapsed = 0; elapsed < maxWaitMs; elapsed += step) {
    const res = await fetchServiceLineTabCount(tabId);
    const c = res && typeof res.count === 'number' ? res.count : 0;
    if (c > 0) return res;
    await new Promise((r) => setTimeout(r, step));
  }
  return fetchServiceLineTabCount(tabId);
}

/**
 * Call tryOnce() every pollMs until it returns true or maxMs elapses (overlap fix).
 * First attempt runs immediately.
 */
async function overlapUiPollTry(options) {
  const maxMs = options.maxMs != null ? options.maxMs : OVERLAP_FIX_UI_POLL_MAX_MS;
  const pollMs = options.pollMs != null ? options.pollMs : OVERLAP_FIX_UI_POLL_MS;
  const tryOnce = options.tryOnce;
  const resultEl = options.resultEl;
  const waitingHtml = options.waitingHtml;
  const deadline = Date.now() + maxMs;
  let n = 0;
  while (Date.now() < deadline) {
    n += 1;
    if (resultEl && waitingHtml) {
      resultEl.innerHTML =
        '<p>' +
        waitingHtml +
        (n > 1 ? ' <span style="opacity:0.85">· check ' + n + '</span>' : '') +
        '</p>';
    }
    if (await tryOnce()) return true;
    const wait = Math.min(pollMs, Math.max(0, deadline - Date.now()));
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  }
  return false;
}

async function probeServiceCodesLinkReady(tabId) {
  const r = await execScript({
    target: { tabId },
    func: () => {
      const links = document.querySelectorAll('a');
      for (let i = 0; i < links.length; i++) {
        const t = (links[i].textContent || '').trim();
        if (/Service\s*Codes\s*\(\d+\)/i.test(t)) return true;
        if (t.toLowerCase().indexOf('service codes') !== -1) return true;
      }
      return false;
    }
  });
  return !!(r && r[0] && r[0].result);
}


async function probeBillable97153Ready(tabId) {
  const r = await execScript({
    target: { tabId },
    func: () => {
      function rowMatchesTexasBillable(text) {
        const t = (text || '').toLowerCase();
        return (
          t.indexOf('97153') !== -1 &&
          t.indexOf('direct care') !== -1 &&
          (t.indexOf('rbt') !== -1 || t.indexOf('/bt') !== -1)
        );
      }
      const selectors = [
        '.md-tab-content ul.tab-pane.active',
        '.md-tab-content ul',
        'ul.jss20512',
        'ul.tab-pane.active'
      ];
      for (let i = 0; i < selectors.length; i++) {
        const ul = document.querySelector(selectors[i]);
        if (!ul) continue;
        const items = ul.querySelectorAll('li > a');
        if (items.length === 0) continue;
        for (let j = 0; j < items.length; j++) {
          const txt = items[j].textContent || '';
          if (rowMatchesTexasBillable(txt)) return true;
        }
      }
      const uls = document.querySelectorAll('.md-tab-content ul');
      for (let k = 0; k < uls.length; k++) {
        const items = uls[k].querySelectorAll('li > a');
        for (let j = 0; j < items.length; j++) {
          const txt = items[j].textContent || '';
          if (rowMatchesTexasBillable(txt)) return true;
        }
      }
      return false;
    }
  });
  return !!(r && r[0] && r[0].result);
}

/** Billing list “walk all pages”: max pages (safety), overlay wait timeout, poll interval. */
const BILLING_PAGE_WALK_MAX_PAGES = 60;
const BILLING_PAGE_WALK_LOAD_TIMEOUT_MS = 120000;
const BILLING_PAGE_WALK_POLL_MS = 350;
/** After setting billing hash, wait before clicking MUI Apply (filters UI). */
const BILLING_HASH_BEFORE_APPLY_MS = 400;
/** Min time between successive Next clicks (after grid has settled from previous Next). */
const BILLING_NEXT_GAP_MS = 3000;
/**
 * Delay inside the page before dispatching the synthetic Next click (matches console snippet).
 * Console “felt” better because it never fired in the same tick as inject; 0 = immediate.
 */
const BILLING_NEXT_GENTLE_MS = 50;

/**
 * Default payor inject match for Manual “Select payor” and fallback only.
 * Auto overlap fix (middle) uses labels via inferPayorMatchFromProviderLabels → "master" | "associate".
 */
const PAYOR_OPTION_MATCH = 'master';

/**
 * Log the full inject result to the panel (POEL often returns the whole object; older remote scripts omit `debug`).
 * Always logs something so you can confirm script version / tier fields vs a stale server file.
 */
function logRemoteInjectDebug(logPrefix, pick) {
  var pre = logPrefix || 'Remote inject';
  if (pick == null) {
    log(pre + ': result is null or undefined (RUN_SCRIPT did not return a payload).');
    return;
  }
  var line;
  try {
    line = JSON.stringify(pick);
  } catch (e) {
    line = String(pick);
  }
  if (line.length > 9000) line = line.slice(0, 9000) + '…[truncated]';
  log(pre + ': ' + line);
  if (!pick.debug) {
    log(
      pre +
        ': note — no `debug` property (tier visibility / scriptBuild). Your hosted script is probably an older file; deploy the copy from POEL CLIENTS/remote-scripts-source/ for this repo.'
    );
  }
}

/**
 * Read payor inject result from the page. Tries MAIN then default world — POEL may inject MAIN-only while
 * a single-world read misses, yielding undefined and a useless "no success" loop.
 */
async function readSelectPayorOptionResult(tabId) {
  try {
    const r = await execScript({
      target: { tabId },
      world: 'MAIN',
      func: () => window.__selectPayorOptionResult
    });
    const v = r && r[0] && r[0].result;
    if (v !== undefined && v !== null) return v;
  } catch (e) {
    /* MAIN disallowed or unavailable */
  }
  const r2 = await execScript({
    target: { tabId },
    func: () => window.__selectPayorOptionResult
  });
  return r2 && r2[0] && r2[0].result;
}

/**
 * Education / payor tier cards: DOM logic is not shipped in the core package.
 * Host `inject-select-payor-option` via POEL / private repo (see POEL CLIENTS/remote-scripts-source/).
 */
async function runInjectPayorSelect(tabId) {
  if (typeof window.SHELL !== 'undefined' && window.SHELL.runScript) {
    var out = await window.SHELL.runScript('inject-select-payor-option');
    if (out !== undefined && out != null) {
      if (!out.debug) {
        var fromPageP = await readSelectPayorOptionResult(tabId);
        if (fromPageP && fromPageP.debug) return fromPageP;
      }
      return out;
    }
    return readSelectPayorOptionResult(tabId);
  }
  await execScript({
    target: { tabId: tabId },
    func: () => {
      window.__selectPayorOptionResult = {
        success: true,
        skipped: true,
        clicked: 0,
        debug: { shippedStub: true }
      };
    }
  });
  await new Promise((r) => setTimeout(r, 50));
  return readSelectPayorOptionResult(tabId);
}

/**
 * Read fee schedule inject result from the page (MAIN then default world — same pattern as payor).
 */
async function readSelectFeeScheduleRoleResult(tabId) {
  try {
    const r = await execScript({
      target: { tabId },
      world: 'MAIN',
      func: () => window.__selectFeeScheduleRoleResult
    });
    const v = r && r[0] && r[0].result;
    if (v !== undefined && v !== null) return v;
  } catch (e) {
    /* MAIN disallowed or unavailable */
  }
  const r2 = await execScript({
    target: { tabId },
    func: () => window.__selectFeeScheduleRoleResult
  });
  return r2 && r2[0] && r2[0].result;
}

/**
 * Fee schedule line-3 automation: DOM logic is not shipped in the core extension.
 * POEL / private repo serves `inject-select-fee-schedule-role` (see POEL CLIENTS/remote-scripts-source/).
 * Unpacked-only: inline stub skips the step so overlap fix can continue (fee row must be clicked manually).
 */
async function runInjectFeeScheduleRoleSelect(tabId) {
  if (typeof window.SHELL !== 'undefined' && window.SHELL.runScript) {
    var out = await window.SHELL.runScript('inject-select-fee-schedule-role');
    if (out !== undefined && out != null) {
      if (!out.debug) {
        var fromPage = await readSelectFeeScheduleRoleResult(tabId);
        if (fromPage && fromPage.debug) return fromPage;
      }
      return out;
    }
    return readSelectFeeScheduleRoleResult(tabId);
  }
  await execScript({
    target: { tabId: tabId },
    func: () => {
      window.__selectFeeScheduleRoleResult = {
        success: true,
        skipped: true,
        clicked: 0,
        debug: { shippedStub: true }
      };
    }
  });
  await new Promise((r) => setTimeout(r, 50));
  return readSelectFeeScheduleRoleResult(tabId);
}

async function readSelectVisitLocationResult(tabId) {
  try {
    const r = await execScript({
      target: { tabId },
      world: 'MAIN',
      func: () => window.__selectVisitLocationResult
    });
    const v = r && r[0] && r[0].result;
    if (v !== undefined && v !== null) return v;
  } catch (e) {
    /* MAIN disallowed */
  }
  const r2 = await execScript({
    target: { tabId },
    func: () => window.__selectVisitLocationResult
  });
  return r2 && r2[0] && r2[0].result;
}

/**
 * Highmark-style HOME / OFFICE / OTHER cards after 97153 (optional — skips if not on screen).
 * POEL: RUN_SCRIPT must return __selectVisitLocationResult (POEL 1.0.7+ defaults).
 */
async function runInjectVisitLocationSelect(tabId) {
  if (typeof window.SHELL !== 'undefined' && window.SHELL.runScript) {
    var out = await window.SHELL.runScript('inject-select-visit-location-cards');
    if (out !== undefined && out !== null) return out;
    return readSelectVisitLocationResult(tabId);
  }
  await execScript({
    target: { tabId: tabId },
    files: ['inject-' + 'select-visit-location-cards.js']
  });
  await new Promise((r) => setTimeout(r, 250));
  return readSelectVisitLocationResult(tabId);
}

/**
 * Map line-1 place-of-service label to visit-location cards (HOME / OFFICE / OTHER).
 * Default OTHER unless POS text clearly reads as home or office (from the timesheet field).
 */
function inferVisitLocationMatchFromPlaceOfService(posText) {
  var t = (posText || '').trim().toLowerCase();
  if (!t) return 'other';

  var homeSpecific =
    /\bhome\b/.test(t) || /12\s*-\s*home/.test(t) || /^12\s*-/.test(t);
  var officeSpecific =
    /\boffice\b/.test(t) || /11\s*-\s*office/.test(t) || /^11\s*-/.test(t);

  if (homeSpecific && !officeSpecific) return 'home';
  if (officeSpecific && !homeSpecific) return 'office';
  return 'other';
}

/** Full JSON of payor result for troubleshooting (panel log). */
function logPayorResultPayload(logPrefix, attemptLabel, pick) {
  var prefix = logPrefix || 'Overlap fix';
  var lab = attemptLabel ? String(attemptLabel) : '';
  var tag = prefix + ': payor payload ' + lab + ' ';
  if (pick === undefined) {
    log(
      tag +
        'UNDEFINED — inject result missing (POEL: reload extension with RUN_SCRIPT payor return fix; unpacked: check inject).'
    );
    return;
  }
  if (pick === null) {
    log(
      tag +
        'NULL — page read returned null. Use POEL 1.0.5+ (or set poelShell.runScriptReturnGlobal in project config).'
    );
    return;
  }
  var s;
  try {
    s = JSON.stringify(pick);
  } catch (e) {
    s = String(pick);
  }
  if (s.length > 3500) s = s.slice(0, 3500) + '…[truncated]';
  log(tag + s);
}

function logPayorSelectDebug(payorPick, attemptLabel, logPrefix) {
  var prefix = logPrefix || 'Overlap fix';
  var label = attemptLabel ? String(attemptLabel) : '';
  if (payorPick == null) {
    log(
      prefix +
        ': payor ' +
        label +
        ' — no result (null/undefined). POEL: ensure extension returns payor payload from RUN_SCRIPT; see logPayorResultPayload line above.'
    );
    return;
  }
  if (!payorPick.debug) {
    log(prefix + ': payor ' + label + (payorPick.error ? ' — ' + payorPick.error : ' (no debug payload)'));
    return;
  }
  if (payorPick.skipped) {
    log(prefix + ': payor ' + label + ' skipped — no tier / education UI visible');
    return;
  }
  var d = payorPick.debug;
  var legacy =
    d.hadLegacyContainerClass != null ? d.hadLegacyContainerClass : d.hadLegacyJss20878;
  log(
    prefix +
      ': payor ' +
      label +
      ' phase=' +
      (d.phase != null ? d.phase : '—') +
      ' hadContainer=' +
      (d.hadResolvedContainer != null ? d.hadResolvedContainer : '—') +
      ' ibcHeader=' +
      (d.hadIbcHeader != null ? d.hadIbcHeader : '—') +
      ' legacyJss=' +
      (legacy != null ? legacy : '—') +
      ' tierLikeCount=' +
      (d.tierLikeSnippets ? d.tierLikeSnippets.length : 0)
  );
  if (d.containerSample) log(prefix + ': payor container sample: ' + String(d.containerSample).slice(0, 450));
  if (d.chosenSnippet) log(prefix + ': payor chosen snippet: ' + d.chosenSnippet);
  if (d.tierLikeSnippets && d.tierLikeSnippets.length)
    log(prefix + ': payor tier-like texts: ' + JSON.stringify(d.tierLikeSnippets));
  if (typeof d.radioCount === 'number')
    log(prefix + ': payor radio input count on page=' + d.radioCount);
  if (d.radioEducationSnippets && d.radioEducationSnippets.length)
    log(prefix + ': payor radio/education labels: ' + JSON.stringify(d.radioEducationSnippets));
}

/** Match string for Place of service dropdown (e.g. "office" for 11 - Office). Change this to select a different option. */
const PLACE_OF_SERVICE_MATCH = 'office';

/** Match string for Service address dropdown (e.g. "30 carn" for 30 Carnoustie Way...). Loose text matching. */
const SERVICE_ADDRESS_MATCH = '30 carn';

/** Date and name to match when clicking a note row (e.g. "03/17/2026" and "Molly Egan"). Easy to change. */
const NOTE_MATCH_DATE = '03/17/2026';
const NOTE_MATCH_NAME = 'Molly Egan';
/** Manual "Selected backup notes": dialog row must contain this substring (see inject-select-existing-session-note-flow). */
const BACKUP_NOTE_ROW_SNIPPET = '03/25/2026 Haley Kline';

/** Convert minutes since midnight to "HH:MM AM/PM" for timesheet inputs. */
function minutesToTimeString(minutes) {
  if (minutes == null || typeof minutes !== 'number') return '';
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const isPm = h >= 12;
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const pad = (n) => String(n).padStart(2, '0');
  return pad(h12) + ':' + pad(m) + ' ' + (isPm ? 'PM' : 'AM');
}

/** Normalize time string for comparison (e.g. "02:00 PM" and "2:00 PM" match). */
function normalizeTimeForCompare(s) {
  if (!s || typeof s !== 'string') return '';
  return s
    .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\s*([ap])\.?\s*m\.?/i, ' $1m')
    .replace(/^0(\d:)/, '$1')
    .trim();
}

/** Parse "HH:MM AM/PM" to minutes since midnight; null if unparseable. */
function parseTimeStringToMinutes(s) {
  if (!s || typeof s !== 'string') return null;
  const t = normalizeTimeForCompare(s);
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (min < 0 || min > 59 || h < 1 || h > 12) return null;
  if (m[3] === 'pm' && h < 12) h += 12;
  if (m[3] === 'am' && h === 12) h = 0;
  return h * 60 + min;
}

/** Click a service-line tab by index (0 = first line). */
async function clickServiceLineTabOnTab(tabId, index) {
  await execScript({
    target: { tabId: tabId },
    func: (idx) => {
      window.__serviceLineTabIndex = idx;
    },
    args: [index]
  });
  await execScript({ target: { tabId: tabId }, files: ['inject-click-service-line-tab.js'] });
  const res = await execScript({
    target: { tabId: tabId },
    func: () => window.__clickServiceLineTabResult
  });
  return res && res[0] && res[0].result;
}

/** Ensure the requested service line tab is active before reading or entering times. */
async function ensureServiceLineTabActive(tabId, index) {
  const tabCountRes = await fetchServiceLineTabCount(tabId);
  const count = tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
  if (count <= 1) return { ok: true, alreadySelected: true };
  const clickRes = await clickServiceLineTabOnTab(tabId, index);
  if (!clickRes || !clickRes.success) {
    return {
      ok: false,
      error: (clickRes && clickRes.error) || 'Could not select service line ' + (index + 1) + '.'
    };
  }
  // Only wait when we actually switched tabs — re-click settle was wiping Time From/To mid-poll.
  if (!clickRes.alreadySelected) {
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
  }
  return { ok: true, alreadySelected: !!clickRes.alreadySelected };
}

/** Read current Time From / To on the active service line. */
async function readTimeWorkedOnTab(tabId) {
  await execScript({ target: { tabId: tabId }, files: ['inject-read-time-worked.js'] });
  const res = await execScript({
    target: { tabId: tabId },
    func: () => window.__readTimeWorkedResult
  });
  return res && res[0] && res[0].result;
}

function part1TimesMatchExpected(readResult, timeFrom, timeTo) {
  if (!readResult || readResult.error) return false;
  if (readResult.from == null || readResult.to == null) return false;
  const expFrom = parseTimeStringToMinutes(timeFrom);
  const expTo = parseTimeStringToMinutes(timeTo);
  const gotFrom = parseTimeStringToMinutes(readResult.from);
  const gotTo = parseTimeStringToMinutes(readResult.to);
  if (expFrom != null && expTo != null && gotFrom != null && gotTo != null) {
    return expFrom === gotFrom && expTo === gotTo;
  }
  return (
    normalizeTimeForCompare(readResult.from) === normalizeTimeForCompare(timeFrom) &&
    normalizeTimeForCompare(readResult.to) === normalizeTimeForCompare(timeTo)
  );
}

function formatPart1TimesMismatch(readResult, timeFrom, timeTo) {
  if (!readResult || readResult.error) {
    return (
      'expected ' +
      timeFrom +
      ' – ' +
      timeTo +
      ', could not read times (' +
      (readResult && readResult.error ? readResult.error : 'no result') +
      ')'
    );
  }
  return (
    'expected ' +
    timeFrom +
    ' – ' +
    timeTo +
    ', got ' +
    (readResult.from || '(empty)') +
    ' – ' +
    (readResult.to || '(empty)')
  );
}

/**
 * Poll until Time From/To read back the expected values on consecutive reads (guards against
 * transient DOM values that revert after async validation).
 * Selects the service-line tab once up front — re-selecting every poll caused MUI to flicker
 * and produced false "times are wrong" errors where expected === got on the last read.
 */
async function pollTimeWorkedUntilMatch(tabId, timeFrom, timeTo, opts) {
  const options = opts || {};
  const lineIndex = options.lineIndex != null ? options.lineIndex : 0;
  const maxMs = options.maxMs != null ? options.maxMs : TIMES_VERIFY_STABLE_MAX_MS;
  const pollMs = options.pollMs != null ? options.pollMs : TIMES_VERIFY_STABLE_POLL_MS;
  const requiredStable =
    options.requiredStable != null ? options.requiredStable : TIMES_VERIFY_STABLE_READS;
  let stableCount = 0;
  let lastRead = null;
  const tabPick = await ensureServiceLineTabActive(tabId, lineIndex);
  if (!tabPick.ok) {
    return { ok: false, read: lastRead, error: tabPick.error };
  }
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    lastRead = await readTimeWorkedOnTab(tabId);
    if (part1TimesMatchExpected(lastRead, timeFrom, timeTo)) {
      stableCount += 1;
      if (stableCount >= requiredStable) {
        return { ok: true, read: lastRead };
      }
    } else {
      stableCount = 0;
    }
    await new Promise((r) => setTimeout(r, pollMs));
  }
  // Last chance: values often match after flicker settles. Confirm with one delayed re-read
  // so we do not fail with "expected X, got X".
  if (part1TimesMatchExpected(lastRead, timeFrom, timeTo)) {
    await new Promise((r) => setTimeout(r, pollMs));
    const confirm = await readTimeWorkedOnTab(tabId);
    if (part1TimesMatchExpected(confirm, timeFrom, timeTo)) {
      return { ok: true, read: confirm, recoveredAfterFlicker: true };
    }
    lastRead = confirm || lastRead;
  }
  return { ok: false, read: lastRead };
}

/**
 * Enter times on a service line with retries until From/To read back correctly on that line.
 * Selects the service-line tab before every read and every enter attempt.
 * @returns {Promise<{ ok: true } | { ok: false, message: string }>}
 */
async function enterAndVerifyTimesOnLine(tabId, lineIndex, timeFrom, timeTo, resultEl, logPrefix, opts) {
  const options = opts || {};
  const lineLabel = options.lineLabel || 'Line ' + (lineIndex + 1);
  const stepLabel = options.stepLabel || lineLabel;
  const pollMaxMs =
    options.pollMaxMs != null ? options.pollMaxMs : ENTER_TIMES_RESULT_POLL_MAX_MS;
  const manageFocus = options.manageFocus !== false;
  let releaseFocus = function () {};
  if (manageFocus) {
    releaseFocus = await focusTargetTabForTimesheetUi(tabId);
  }
  try {
    const tabPick = await ensureServiceLineTabActive(tabId, lineIndex);
    if (!tabPick.ok) {
      return { ok: false, message: tabPick.error || 'Could not select ' + lineLabel + '.' };
    }

    resultEl.innerHTML = '<p>Checking ' + lineLabel + ' times…</p>';
    let stable = await pollTimeWorkedUntilMatch(tabId, timeFrom, timeTo, { lineIndex: lineIndex });
    if (stable.ok) {
      resultEl.innerHTML = '<p>' + lineLabel + ' already shows target times — no change needed.</p>';
      log(
        logPrefix +
          ': ' +
          lineLabel +
          ' skip enter-times (stable ' +
          stable.read.from +
          ' – ' +
          stable.read.to +
          ')'
      );
      return { ok: true };
    }

    let lastRead = stable.read;
    for (let attempt = 1; attempt <= OVERLAP_FIX_TIMES_VERIFY_ATTEMPTS; attempt++) {
      resultEl.innerHTML =
        '<p>Setting ' +
        lineLabel +
        ' times' +
        (attempt > 1
          ? ' (retry ' + attempt + ' of ' + OVERLAP_FIX_TIMES_VERIFY_ATTEMPTS + ')...'
          : '...') +
        '</p>';
      await ensureServiceLineTabActive(tabId, lineIndex);
      await primeEnterTimesExplicit(tabId, timeFrom, timeTo);
      await execScript({ target: { tabId: tabId }, files: ['inject-enter-times.js'] });
      const data = await pollEnterTimesResult(tabId, pollMaxMs);
      if (!data || !data.success) {
        const errMsg = messageForEnterTimesStepFailure(data, stepLabel);
        return { ok: false, message: errMsg };
      }
      log(
        logPrefix +
          ': ' +
          lineLabel +
          ' set to ' +
          timeFrom +
          ' – ' +
          timeTo +
          (attempt > 1 ? ' (attempt ' + attempt + ')' : '')
      );
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_AFTER_ENTER_TIMES_MS));
      resultEl.innerHTML = '<p>Verifying ' + lineLabel + ' times (From and To)...</p>';
      stable = await pollTimeWorkedUntilMatch(tabId, timeFrom, timeTo, { lineIndex: lineIndex });
      lastRead = stable.read || lastRead;
      if (stable.ok) {
        log(logPrefix + ': ' + lineLabel + ' times verified: ' + stable.read.from + ' – ' + stable.read.to);
        return { ok: true };
      }
      log(
        logPrefix +
          ': ' +
          lineLabel +
          ' verify failed – ' +
          formatPart1TimesMismatch(lastRead, timeFrom, timeTo) +
          (attempt < OVERLAP_FIX_TIMES_VERIFY_ATTEMPTS ? ', retrying...' : '')
      );
      if (attempt < OVERLAP_FIX_TIMES_VERIFY_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }
    return {
      ok: false,
      message: lineLabel + ' times did not take. ' + formatPart1TimesMismatch(lastRead, timeFrom, timeTo) + '.'
    };
  } finally {
    releaseFocus();
  }
}

/** Part 1 wrapper — line index 0. */
async function enterAndVerifyPart1Times(tabId, timeFrom, timeTo, resultEl, logPrefix) {
  return enterAndVerifyTimesOnLine(tabId, 0, timeFrom, timeTo, resultEl, logPrefix, {
    lineLabel: 'Part 1',
    stepLabel: 'Part 1'
  });
}

/**
 * Assert From/To on a service line (stable consecutive reads). Does not enter times.
 * @returns {Promise<{ ok: true } | { ok: false, message: string }>}
 */
async function assertTimesOnLine(tabId, lineIndex, timeFrom, timeTo, logPrefix, opts) {
  const options = opts || {};
  const lineLabel = options.lineLabel || 'Line ' + (lineIndex + 1);
  const manageFocus = options.manageFocus !== false;
  let releaseFocus = function () {};
  if (manageFocus) {
    releaseFocus = await focusTargetTabForTimesheetUi(tabId);
  }
  try {
    const tabPick = await ensureServiceLineTabActive(tabId, lineIndex);
    if (!tabPick.ok) {
      return { ok: false, message: tabPick.error || 'Could not select ' + lineLabel + '.' };
    }
    const stable = await pollTimeWorkedUntilMatch(tabId, timeFrom, timeTo, {
      lineIndex: lineIndex,
      maxMs: options.maxMs != null ? options.maxMs : TIMES_VERIFY_STABLE_MAX_MS + 1000
    });
    if (!stable.ok) {
      const matchedOnce = part1TimesMatchExpected(stable.read, timeFrom, timeTo);
      return {
        ok: false,
        message: matchedOnce
          ? lineLabel +
            ' times matched expected values but did not stay stable long enough to trust. ' +
            formatPart1TimesMismatch(stable.read, timeFrom, timeTo) +
            '.'
          : lineLabel +
            ' times are wrong. ' +
            formatPart1TimesMismatch(stable.read, timeFrom, timeTo) +
            '.'
      };
    }
    log(
      logPrefix +
        ': ' +
        lineLabel +
        ' times confirmed — ' +
        stable.read.from +
        ' – ' +
        stable.read.to +
        (stable.recoveredAfterFlicker ? ' (settled after flicker)' : '')
    );
    return { ok: true };
  } finally {
    releaseFocus();
  }
}

/** Re-read line 1 From/To immediately before starting line 2. */
async function assertPart1TimesBeforeLine2(tabId, timeFrom, timeTo, logPrefix, opts) {
  return assertTimesOnLine(tabId, 0, timeFrom, timeTo, logPrefix, Object.assign({ lineLabel: 'Line 1' }, opts || {}));
}

/**
 * From billing contact-card provider labels, choose which payor option card to click on line 3
 * ("Master or Bachelor" vs "Associate or HS"). Uses fuzzy substring checks (typos, missing trailing s).
 * Returns inject match string: "master" or "associate" (remote script inject-select-payor-option).
 */
function inferPayorMatchFromProviderLabels(labels) {
  if (!labels || !Array.isArray(labels) || labels.length === 0) {
    return {
      ok: false,
      error:
        "We did not find any tags on the provider's profile card. Those tags tell us whether to use the Master/Bachelor payor option or the Associate/HS option on the third line. Open the provider from the billing row, confirm the tags show up, then run Fix again, or pick the payor option yourself on the timesheet."
    };
  }
  const blob = labels
    .map((l) => String(l || ''))
    .join(' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  if (!blob) {
    return {
      ok: false,
      error:
        "The provider's profile card had no readable tag text. Tags should mention degree level (for example Master, Bachelor, Associate, or HS) so we can choose the right payor. Check the profile in CentralReach, then try again, or select the payor option yourself."
    };
  }

  function looseHas(hay, needles) {
    const h = hay.toLowerCase();
    for (let i = 0; i < needles.length; i++) {
      const v = needles[i].toLowerCase();
      if (h.includes(v)) return true;
      if (v.length >= 4 && v.endsWith('s') && h.includes(v.slice(0, -1))) return true;
      if (v.length >= 5 && h.includes(v.slice(0, -1))) return true;
    }
    return false;
  }

  const masterSide = looseHas(blob, [
    'master',
    'maste',
    'mastre',
    'bachelor',
    'bachelo',
    'bachlor',
    'bachler',
    'bachel'
  ]);
  const assocSide =
    looseHas(blob, [
      'associate',
      'associat',
      'assoc',
      'assocaite',
      'association',
      'assocation',
      'assciate'
    ]) ||
    /\bhs\b/.test(blob) ||
    /(^|[\s,;/(]|[-–—])hs([\s,;).]|$)/.test(blob);

  if (masterSide && assocSide) {
    return {
      ok: false,
      error:
        "The provider's tags point to both degree levels at once (Master/Bachelor and Associate/HS), so the tool cannot pick a single payor option. Clean up conflicting tags on the provider profile, or choose the correct payor option yourself on the timesheet."
    };
  }
  if (masterSide) {
    return { ok: true, match: 'master', tier: 'Master or Bachelor' };
  }
  if (assocSide) {
    return { ok: true, match: 'associate', tier: 'Associate or HS' };
  }
  return {
    ok: false,
    error:
      "The provider's tags do not clearly say Master, Bachelor, Associate, or HS. Update the tags on the provider profile so degree level is obvious, or choose the Master vs Associate payor option yourself on the third line."
  };
}

/** Human label for panel log when reporting decided fee-schedule role from contact-card tags. */
function feeScheduleRoleDisplayName(role) {
  if (role === 'bcba') return 'BCBA';
  if (role === 'lbs') return 'LBS';
  if (role === 'rbt_bt') return 'RBT/BT';
  return '';
}

/** Fee row credential priority: BCBA (highest) > LBS > RBT/BT. When several tags match, the highest wins. */
const FEE_SCHEDULE_ROLE_PRIORITY = { rbt_bt: 1, lbs: 2, bcba: 3 };

function sortFeeRolesHighestFirst(roles) {
  const order = { bcba: 0, lbs: 1, rbt_bt: 2 };
  return roles.slice().sort((a, b) => (order[a] ?? 99) - (order[b] ?? 99));
}

/** Join role ids into readable text, highest credential first, e.g. "BCBA, LBS, and RBT/BT". */
function formatFeeScheduleRolesList(roleIds) {
  const names = sortFeeRolesHighestFirst(roleIds).map(feeScheduleRoleDisplayName).filter(Boolean);
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return names[0] + ' and ' + names[1];
  return names.slice(0, -1).join(', ') + ', and ' + names[names.length - 1];
}

function pickHighestFeeScheduleRole(primarySet) {
  const arr = Array.from(primarySet);
  if (arr.length === 0) return null;
  return arr.reduce((best, r) =>
    (FEE_SCHEDULE_ROLE_PRIORITY[r] || 0) > (FEE_SCHEDULE_ROLE_PRIORITY[best] || 0) ? r : best
  );
}

/**
 * From billing contact-card provider tags, infer fee-schedule role for Quest-style rows: BCBA, LBS, RBT/BT.
 * When several primary tags match, picks the highest credential: BCBA > LBS > RBT/BT (RBT is lowest).
 * "Behavior Technician" maps to RBT/BT only when no BCBA/LBS/RBT/BT primary tag matched.
 * Returns { ok: true, role, allMatchedPrimary? } — role is "bcba" | "lbs" | "rbt_bt" | null.
 * @param {string[]} labels
 * @param {{ providerName?: string }} [options] — providerName reserved for future messages
 */
function inferProviderRoleFromLabels(labels, options) {
  if (!labels || !Array.isArray(labels) || labels.length === 0) {
    return { ok: true, role: null, allMatchedPrimary: [] };
  }
  const primary = new Set();
  let hasBehaviorTechnician = false;

  for (let i = 0; i < labels.length; i++) {
    const raw = String(labels[i] || '').trim();
    if (!raw) continue;
    const t = raw.toLowerCase().replace(/\s+/g, ' ').trim();

    if (/behavior\s*technician/i.test(raw)) {
      hasBehaviorTechnician = true;
    }

    if (t === 'bcba') {
      primary.add('bcba');
      continue;
    }
    if (t === 'lbs') {
      primary.add('lbs');
      continue;
    }
    if (/^registered\s+behavior\s+technician$/i.test(raw) || /^rbt-bt$/i.test(t)) {
      primary.add('rbt_bt');
      continue;
    }
    if (/^rbt\s*\/\s*bt$/.test(t) || t === 'rbt' || t === 'bt') {
      primary.add('rbt_bt');
    }
  }

  if (primary.size > 0) {
    const chosen = pickHighestFeeScheduleRole(primary);
    return { ok: true, role: chosen, allMatchedPrimary: Array.from(primary) };
  }
  if (hasBehaviorTechnician) {
    return { ok: true, role: 'rbt_bt', allMatchedPrimary: ['rbt_bt'] };
  }
  return { ok: true, role: null, allMatchedPrimary: [] };
}

/**
 * Overlap/automation: inject-enter-times must receive real From/To (no 02:00/03:30 fallback).
 * Clears stale result, sets globals, then verifies they actually landed in the page's MAIN world.
 */
async function primeEnterTimesExplicit(tabId, fromStr, toStr) {
  await execScript({
    target: { tabId: tabId },
    func: (from, to) => {
      window.__enterTimesResult = null;
      window.__enterTimesAllowDefaults = false;
      window.__enterTimesFrom = from;
      window.__enterTimesTo = to;
    },
    args: [fromStr, toStr]
  });
  const verify = await execScript({
    target: { tabId: tabId },
    func: () => ({ f: typeof window.__enterTimesFrom, t: typeof window.__enterTimesTo })
  });
  const v = verify && verify[0] && verify[0].result;
  if (!v || v.f !== 'string' || v.t !== 'string') {
    console.warn('[primeEnterTimesExplicit] globals may not be in MAIN world:', v, 'from=', fromStr, 'to=', toStr);
    await execScript({
      target: { tabId: tabId },
      func: (from, to) => {
        window.__enterTimesResult = null;
        window.__enterTimesAllowDefaults = false;
        window.__enterTimesFrom = from;
        window.__enterTimesTo = to;
      },
      args: [fromStr, toStr]
    });
  }
}

/**
 * Wait for window.__enterTimesResult after inject-enter-times.js (do not read once after a short sleep).
 * @returns {object|null}
 */
async function pollEnterTimesResult(tabId, maxWaitMs, stepMs) {
  const max = maxWaitMs != null ? maxWaitMs : ENTER_TIMES_RESULT_POLL_MAX_MS;
  const step = stepMs != null ? stepMs : ENTER_TIMES_RESULT_POLL_STEP_MS;
  let data = null;
  for (let elapsed = 0; elapsed < max; elapsed += step) {
    if (elapsed > 0) await new Promise((r) => setTimeout(r, step));
    const results = await execScript({
      target: { tabId: tabId },
      func: () => window.__enterTimesResult
    });
    data = results && results[0] && results[0].result;
    if (data) break;
  }
  return data;
}

/**
 * User-facing reason when enter-times did not succeed (never a bare "failed").
 * @param {object|null} data — from __enterTimesResult
 * @param {string} stepLabel — e.g. "Line 2 (nonbillable overlap)"
 */
function messageForEnterTimesStepFailure(data, stepLabel) {
  if (data && data.error) return stepLabel + ': ' + data.error;
  if (!data) {
    return (
      stepLabel +
      ': Timed out waiting for Time From / Time To (no result from the page yet). The times may still have applied — check the active line. If not, wait for the timesheet to finish loading and click Fix again.'
    );
  }
  var was = '';
  if (data.wasFrom != null || data.wasTo != null) {
    was =
      ' Before this attempt: Time From was ' +
      (data.wasFrom != null ? String(data.wasFrom) : '(unknown)') +
      ', Time To was ' +
      (data.wasTo != null ? String(data.wasTo) : '(unknown)') +
      '.';
  }
  return stepLabel + ': Enter times reported failure with no error message.' + was;
}

/** Manual “Enter times”: allow 02:00 PM / 03:30 PM when fields are not preset. */
function primeEnterTimesDefaults(tabId) {
  return execScript({
    target: { tabId: tabId },
    func: () => {
      window.__enterTimesAllowDefaults = true;
      delete window.__enterTimesFrom;
      delete window.__enterTimesTo;
    }
  });
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

/** When aborting timesheet editing, click the CANCEL button so the dialog closes. */
async function clickTimesheetCancel(tab) {
  if (!tab?.id) return;
  try {
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-cancel.js'] });
    await new Promise((r) => setTimeout(r, 300));
  } catch (e) {
    if (typeof log === 'function') log('Click Cancel failed: ' + (e && e.message));
  }
}

function log(msg) {
  const p = document.createElement('p');
  p.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logEl.appendChild(p);
  logEl.scrollTop = logEl.scrollHeight;
  console.log('[Hidden Lights sidepanel]', msg);
}

document.getElementById('sig').addEventListener('click', async () => {
  log('Sig clicked');
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      log('Cannot run on this page. Open a normal webpage with a canvas.');
      return;
    }
    log('Injecting draw into tab...');
    await execScript({ target: { tabId: tab.id }, files: ['inject-draw.js'] });
    log('Done. Check the page console (F12) for [Hidden Lights] messages.');
  } catch (e) {
    log('Error: ' + e.message);
    console.error('[Hidden Lights sidepanel]', e);
  }
});

async function handleClickSignatureButton(target) {
  const label = target === 'client' ? 'Client signature' : 'Provider signature';
  const resultEl = document.getElementById('open-sig-result');
  log(label + ' clicked');
  if (resultEl) resultEl.innerHTML = '<p>Opening ' + label.toLowerCase() + '...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      if (resultEl) resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      if (resultEl) resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      func: (t) => { window.__signatureTarget = t; },
      args: [target]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-signature-button.js'] });
    await new Promise((r) => setTimeout(r, 4500));
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickSignatureResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      if (resultEl) resultEl.innerHTML = '<p>No result. Open the timesheet first.</p>';
      log(label + ': no result');
      return;
    }
    if (data.error || !data.success) {
      if (resultEl) resultEl.innerHTML = '<p>' + escapeHtml(data.error || 'Could not click the button.') + '</p>';
      log(label + ': ' + (data.error || 'failed'));
      return;
    }
    const confirmNote = data.dismissedConfirm
      ? ' (recollect signatures dialog appeared — clicked Continue)'
      : data.modalDetected === false
        ? ' (no recollect dialog)'
        : '';
    if (resultEl) resultEl.innerHTML = '<p>Opened <strong>' + escapeHtml(label) + '</strong>.' + escapeHtml(confirmNote) + '</p>';
    log(label + ': opened' + confirmNote);
  } catch (e) {
    log('Error: ' + e.message);
    if (resultEl) resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
}

document.getElementById('open-client-sig').addEventListener('click', () => handleClickSignatureButton('client'));
document.getElementById('open-provider-sig').addEventListener('click', () => handleClickSignatureButton('provider'));

document.getElementById('fill-no-signature').addEventListener('click', async () => {
  const resultEl = document.getElementById('open-sig-result');
  log('No signature + agree clicked');
  if (resultEl) resultEl.innerHTML = '<p>Filling "No signature" and checking agree...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      if (resultEl) resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      if (resultEl) resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-fill-no-signature.js'] });
    await new Promise((r) => setTimeout(r, 400));
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__fillNoSignatureResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      if (resultEl) resultEl.innerHTML = '<p>No result. Open the signature panel first.</p>';
      log('No signature: no result');
      return;
    }
    if (!data.success) {
      if (resultEl) resultEl.innerHTML = '<p>' + escapeHtml(data.error || 'Failed.') + '</p>';
      log('No signature: ' + (data.error || 'failed'));
      return;
    }
    const parts = [];
    if (data.inputFilled) parts.push('typed "No signature"');
    if (data.checkboxChecked) parts.push('checked agree');
    if (resultEl) resultEl.innerHTML = '<p><strong>Done</strong> — ' + escapeHtml(parts.join(', ') || 'OK') + '.</p>';
    log('No signature: ' + parts.join(', '));
  } catch (e) {
    log('Error: ' + e.message);
    if (resultEl) resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('click-sign-confirm').addEventListener('click', async () => {
  const resultEl = document.getElementById('open-sig-result');
  log('Confirm sign clicked');
  if (resultEl) resultEl.innerHTML = '<p>Clicking SIGN...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      if (resultEl) resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      if (resultEl) resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-sign-button.js'] });
    await new Promise((r) => setTimeout(r, 300));
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickSignButtonResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      if (resultEl) resultEl.innerHTML = '<p>No result. Make sure the signature panel is open.</p>';
      return;
    }
    if (!data.success) {
      if (resultEl) resultEl.innerHTML = '<p>' + escapeHtml(data.error || 'Failed.') + '</p>';
      return;
    }
    if (resultEl) resultEl.innerHTML = '<p><strong>Done</strong> — clicked SIGN.</p>';
    log('Confirm sign: clicked SIGN');
  } catch (e) {
    log('Error: ' + e.message);
    if (resultEl) resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('click-continue-dismiss').addEventListener('click', async () => {
  const resultEl = document.getElementById('open-sig-result');
  log('Dismiss dialog clicked');
  if (resultEl) resultEl.innerHTML = '<p>Clicking CONTINUE...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      if (resultEl) resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      if (resultEl) resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-continue-button.js'] });
    await new Promise((r) => setTimeout(r, 300));
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickContinueButtonResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      if (resultEl) resultEl.innerHTML = '<p>No result. Make sure the dialog is showing.</p>';
      return;
    }
    if (!data.success) {
      if (resultEl) resultEl.innerHTML = '<p>' + escapeHtml(data.error || 'Failed.') + '</p>';
      return;
    }
    if (resultEl) resultEl.innerHTML = '<p><strong>Done</strong> — dismissed dialog.</p>';
    log('Dismiss dialog: clicked CONTINUE');
  } catch (e) {
    log('Error: ' + e.message);
    if (resultEl) resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

// --------------- Auto sign both ---------------

async function pollForInjectResult(tabId, globalName, maxMs, pollMs) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const res = await execScript({
      target: { tabId },
      func: (name) => window[name],
      args: [globalName]
    });
    const data = res && res[0] && res[0].result;
    if (data !== null && data !== undefined) return data;
    await new Promise((r) => setTimeout(r, pollMs));
  }
  return null;
}

/** Snippet for backup session-note dialog row; prefers overlap capture date + provider. */
function getBackupNoteRowSnippetForOverlapFix(tabId) {
  const rec = overlapFixRecordGet(tabId);
  if (!rec) return BACKUP_NOTE_ROW_SNIPPET;
  const d = (rec.dateOfService || '').trim();
  const p = (rec.provider || '').trim();
  if (d && p) return d + ' ' + p;
  return BACKUP_NOTE_ROW_SNIPPET;
}

/**
 * Pick session note on the timesheet line.
 * Pass A (primary): session-note picker → date/name list — **without** clicking SELECT EXISTING NOTE first
 *   (works when Session Note Names grid or list is already available).
 * Pass B (backup): disabled — was: click SELECT EXISTING NOTE, then repeat session picker → date/name.
 * @returns {Promise<{ ok: true } | { ok: false, msg: string }>}
 */
async function tryOverlapFixPickNoteBackupThenPrimary(tabId, resultEl, logPrefix) {
  const recPick = overlapFixRecordGet(tabId);
  const d = (recPick && recPick.dateOfService) || '';
  const n = (recPick && recPick.provider) || '';
  const snippet = getBackupNoteRowSnippetForOverlapFix(tabId);
  resultEl.innerHTML = '<p>Finding note (' + escapeHtml(d + ' ' + n) + ')...</p>';

  async function attemptSessionPickerOnly(passLabel) {
    log(logPrefix + ': ' + passLabel + ' — session-note picker');
    resultEl.innerHTML = '<p>Choosing note (session picker)…</p>';

    await execScript({
      target: { tabId },
      func: function (s) {
        window.__backupNoteRowSnippet = s;
        window.__selectExistingSessionNoteFlowResult = null;
      },
      args: [snippet],
    });
    await execScript({ target: { tabId }, files: ['inject-select-existing-session-note-flow.js'] });
    const backup = await pollForInjectResult(
      tabId,
      '__selectExistingSessionNoteFlowResult',
      OVERLAP_FIX_BACKUP_NOTE_POLL_MAX_MS,
      OVERLAP_FIX_BACKUP_NOTE_POLL_STEP_MS
    );
    if (backup && backup.success) {
      log(logPrefix + ': note selected via session-note picker (' + passLabel + ')');
      return { ok: true };
    }
    var backupErr =
      (backup && backup.error) ||
      'Session-note picker did not complete within ' + OVERLAP_FIX_BACKUP_NOTE_POLL_MAX_MS + 'ms.';
    return { ok: false, backupErr: backupErr };
  }

  /* Pass A — primary: no SELECT EXISTING NOTE button yet */
  var passA = await attemptSessionPickerOnly('primary (before SELECT EXISTING NOTE)');
  if (passA.ok) return { ok: true };

  /* Pass B — force-open SELECT EXISTING NOTE, then retry session picker only. */
  resultEl.innerHTML = '<p>Backup: clicking SELECT EXISTING NOTE…</p>';
  log(logPrefix + ': backup — clicking SELECT EXISTING NOTE button');
  await new Promise(function (r) {
    setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS);
  });
  await execScript({ target: { tabId }, files: ['inject-click-existing-note.js'] });
  await new Promise(function (r) {
    setTimeout(r, 400);
  });
  var btnRes = await execScript({
    target: { tabId },
    func: function () {
      return window.__clickExistingNoteResult;
    },
  });
  var btnData = btnRes && btnRes[0] && btnRes[0].result;
  if (!btnData || !btnData.success) {
    var btnErr =
      (btnData && btnData.error) ||
      'SELECT EXISTING NOTE button not found or click failed after primary attempts.';
    return {
      ok: false,
      msg: 'Primary: session — ' + passA.backupErr + ' · Backup button: ' + btnErr,
    };
  }

  await new Promise(function (r) {
    setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS);
  });

  var passB = await attemptSessionPickerOnly('after SELECT EXISTING NOTE');
  if (passB.ok) return { ok: true };

  return {
    ok: false,
    msg:
      'Primary: session — ' +
      passA.backupErr +
      ' · After SELECT EXISTING NOTE: session — ' +
      passB.backupErr,
  };
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error('No active tab');
  if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')))
    throw new Error('Cannot run on this page');
  return tab;
}

async function pollForElement(tabId, pollMs, maxMs, checkFn, checkArgs) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const res = await execScript({ target: { tabId }, func: checkFn, args: checkArgs || [] });
    if (res && res[0] && res[0].result) return true;
    await new Promise((r) => setTimeout(r, pollMs));
  }
  return false;
}

async function runSignatureSequence(tab, target, resultEl, dismiss) {
  const label = target === 'client' ? 'Client' : 'Provider';

  // 1. Open sig
  if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Opening signature button...</p>';
  log('[Auto] Opening ' + label + ' signature');
  await execScript({
    target: { tabId: tab.id },
    func: (t) => { window.__signatureTarget = t; },
    args: [target]
  });
  await execScript({ target: { tabId: tab.id }, files: ['inject-click-signature-button.js'] });

  // 2. Wait for the signature form to load (poll for #providersignature input every 200ms, max 8s)
  if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Waiting for signature form to load...</p>';
  log('[Auto] Waiting for signature form');
  const formReady = await pollForElement(tab.id, 200, 8000, () => {
    return !!document.getElementById('providersignature') || !!document.querySelector('input[id*="providersignature"]');
  });
  if (!formReady) {
    log('[Auto] Signature form did not appear');
    if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Signature form did not load in time.</p>';
    return false;
  }

  // 3. No signature + agree (no wait after)
  if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Filling "No signature" + agree...</p>';
  log('[Auto] Filling no-signature + agree');
  await execScript({ target: { tabId: tab.id }, files: ['inject-fill-no-signature.js'] });

  // 4. Draw the S
  if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Drawing signature...</p>';
  log('[Auto] Drawing S');
  await execScript({ target: { tabId: tab.id }, files: ['inject-draw.js'] });

  // 5. Wait 0.4s
  await new Promise((r) => setTimeout(r, 400));

  // 6. Confirm sign (click SIGN)
  if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Clicking SIGN...</p>';
  log('[Auto] Clicking SIGN');
  await execScript({ target: { tabId: tab.id }, files: ['inject-click-sign-button.js'] });

  // 7. Wait for CONTINUE button to appear (poll every 200ms, max 6s)
  if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Waiting for confirmation...</p>';
  log('[Auto] Waiting for next step');
  const nextReady = await pollForElement(tab.id, 200, 6000, () => {
    var btns = document.querySelectorAll('button');
    for (var i = 0; i < btns.length; i++) {
      var t = (btns[i].textContent || '').trim();
      if (t === 'CONTINUE') return true;
    }
    return false;
  });

  // 8. Dismiss dialog (only for client)
  if (dismiss) {
    if (nextReady) {
      if (resultEl) resultEl.innerHTML = '<p>[' + label + '] Dismissing dialog...</p>';
      log('[Auto] Dismissing dialog');
      await execScript({ target: { tabId: tab.id }, files: ['inject-click-continue-button.js'] });
    } else {
      log('[Auto] No CONTINUE button found, skipping dismiss');
    }
  }

  log('[Auto] ' + label + ' signature complete');
  return true;
}

document.getElementById('auto-sign-both').addEventListener('click', async () => {
  const resultEl = document.getElementById('open-sig-result');
  if (resultEl) resultEl.innerHTML = '<p><strong>Auto sign started...</strong></p>';
  log('[Auto] Auto sign both started');
  try {
    const tab = await getActiveTab();

    // ---- CLIENT ----
    const clientOk = await runSignatureSequence(tab, 'client', resultEl, true);
    if (!clientOk) return;

    // ---- Wait 2s for page to settle ----
    if (resultEl) resultEl.innerHTML = '<p>Client done. Waiting 2s before provider...</p>';
    log('[Auto] Waiting 2s before provider');
    await new Promise((r) => setTimeout(r, 2000));

    // ---- PROVIDER ----
    const providerOk = await runSignatureSequence(tab, 'provider', resultEl, false);
    if (!providerOk) return;

    if (resultEl) resultEl.innerHTML = '<p><strong>Both signatures complete.</strong></p>';
    log('[Auto] Both signatures complete');
  } catch (e) {
    log('[Auto] Error: ' + e.message);
    if (resultEl) resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

/** Extract short service code (e.g. 92507 or 97153) from serviceAuth string. */
function shortServiceCode(serviceAuth) {
  const m = (serviceAuth || '').match(/\d{5}/);
  return m ? m[0] : (serviceAuth || '').trim().slice(0, 5) || '—';
}

/** 97155 scan list: only groups that include a 97153 line can use the automatic fix (hide 97155-only overlaps). */
function overlapGroupHas97153Line(g) {
  const entries = g.entries || [];
  return entries.some((e) => (e.serviceAuth || '').includes('97153'));
}

/** True for billable/concurrent 97155 rows (not 97153, not direct non billable). */
function is97155ConcurrentServiceEntry(e) {
  const auth = (e && e.serviceAuth) || '';
  if (!auth.includes('97155')) return false;
  if (auth.toLowerCase().includes('direct non billable')) return false;
  return true;
}

function overlapEntryStableKey(e) {
  if (e && e.rowId) return String(e.rowId);
  return (
    String(e.time || '') +
    '|' +
    String(e.serviceAuth || '') +
    '|' +
    String(e.startMinutes != null ? e.startMinutes : '') +
    '|' +
    String(e.endMinutes != null ? e.endMinutes : '')
  );
}

function find97153EntryInOverlapGroup(g) {
  const entries = g.entries || [];
  const with97153 = entries.filter((e) => (e.serviceAuth || '').includes('97153'));
  if (with97153.length === 0) return null;
  if (with97153.length === 1) return with97153[0];
  return with97153.reduce((best, e) =>
    e.endMinutes - e.startMinutes >= best.endMinutes - best.startMinutes ? e : best
  );
}

/**
 * When one 97153 line overlaps two or more distinct 97155 sessions, automatic fix is not supported yet.
 * Returns regular fixable groups and blocked cases (one row per 97153 + its 97155 concurrences).
 */
function partition97155MultiConcurrentGroups(fixableGroups) {
  const buckets = new Map();
  for (const g of fixableGroups || []) {
    const entry97153 = find97153EntryInOverlapGroup(g);
    if (!entry97153) continue;
    const others = (g.entries || []).filter((e) => e !== entry97153);
    const concurrent97155 = others.filter(is97155ConcurrentServiceEntry);
    if (concurrent97155.length === 0) continue;
    const bucketKey =
      String(g.client || '') +
      '|' +
      String(g.date || '') +
      '|' +
      overlapEntryStableKey(entry97153);
    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, {
        client: g.client,
        date: g.date,
        entry97153: entry97153,
        groups: [],
        concurrent97155ByKey: new Map()
      });
    }
    const bucket = buckets.get(bucketKey);
    bucket.groups.push(g);
    for (const c of concurrent97155) {
      bucket.concurrent97155ByKey.set(overlapEntryStableKey(c), c);
    }
  }

  const blockedGroupSet = new Set();
  const blockedCases = [];
  for (const bucket of buckets.values()) {
    if (bucket.concurrent97155ByKey.size < 2) continue;
    const concurrent97155 = Array.from(bucket.concurrent97155ByKey.values());
    for (const g of bucket.groups) blockedGroupSet.add(g);
    blockedCases.push({
      client: bucket.client,
      date: bucket.date,
      entry97153: bucket.entry97153,
      concurrent97155: concurrent97155,
      groups: bucket.groups
    });
  }

  const regular = (fixableGroups || []).filter((g) => !blockedGroupSet.has(g));
  return { regular: regular, blockedCases: blockedCases };
}

/** Same tolerance as getOverlapFixForGroup start/middle/end classification. */
const OVERLAP_PEEL_TOLERANCE_MINUTES = 1;
const MAX_MULTI_97155_LINE_COUNT = 8;

function segmentsOverlapMinutes(a0, a1, b0, b1) {
  return a0 < b1 && b0 < a1;
}

function classifyOverlapOnBillableSpan(wStart, wEnd, spanStart, spanEnd) {
  const overlapStart = Math.max(wStart, spanStart);
  const overlapEnd = Math.min(wEnd, spanEnd);
  if (overlapEnd <= overlapStart) return null;
  const atStart = overlapStart <= spanStart + OVERLAP_PEEL_TOLERANCE_MINUTES;
  const atEnd = overlapEnd >= spanEnd - OVERLAP_PEEL_TOLERANCE_MINUTES;
  if (atStart) return 'start';
  if (atEnd) return 'end';
  return 'middle';
}

/**
 * Build execution-order segment plan for one 97153 line with 2+ 97155 concurrences.
 * Line 1 is always billable (trim only); non billable lines are added as line 2+.
 */
function buildMulti97155FixPlan(entry97153, concurrent97155, meta) {
  if (!entry97153 || entry97153.startMinutes == null || entry97153.endMinutes == null) {
    return { ok: false, error: 'Missing 97153 time range.' };
  }
  if (!Array.isArray(concurrent97155) || concurrent97155.length < 2) {
    return { ok: false, error: 'Multi plan requires at least two 97155 sessions.' };
  }
  const entryId = (entry97153.rowId || '').replace(/^billing-grid-row-/, '');
  if (!entryId) {
    return { ok: false, error: 'We could not read the 97153 row id.' };
  }

  const S = entry97153.startMinutes;
  const E = entry97153.endMinutes;
  const windows = concurrent97155
    .map(function (entry) {
      const ws = Math.max(S, entry.startMinutes);
      const we = Math.min(E, entry.endMinutes);
      if (we <= ws) return null;
      return { startMinutes: ws, endMinutes: we, entry: entry };
    })
    .filter(Boolean)
    .sort(function (a, b) {
      return a.startMinutes - b.startMinutes || a.endMinutes - b.endMinutes;
    });

  if (windows.length < 2) {
    return { ok: false, error: 'Less than two 97155 windows overlap the 97153 line after clipping.' };
  }

  let billableSpans = [{ lineIndex: 0, startMinutes: S, endMinutes: E }];
  const nonBillableLines = [];
  let nextLineIndex = 1;
  const warnings = [];

  for (const w of windows) {
    const spanIdx = billableSpans.findIndex(function (s) {
      return segmentsOverlapMinutes(s.startMinutes, s.endMinutes, w.startMinutes, w.endMinutes);
    });
    if (spanIdx === -1) {
      const overlapWith = nonBillableLines
        .filter(function (nb) {
          return segmentsOverlapMinutes(nb.startMinutes, nb.endMinutes, w.startMinutes, w.endMinutes);
        })
        .map(function (nb) {
          return nb.lineIndex;
        });
      nonBillableLines.push({
        lineIndex: nextLineIndex++,
        startMinutes: w.startMinutes,
        endMinutes: w.endMinutes,
        source97155: w.entry
      });
      if (overlapWith.length) {
        warnings.push(
          '97155 row ' +
            (w.entry.time || '').trim() +
            ' overlaps nonbillable line(s) ' +
            overlapWith
              .map(function (i) {
                return String(i + 1);
              })
              .join(', ')
        );
      }
      continue;
    }
    const span = billableSpans[spanIdx];
    const kind = classifyOverlapOnBillableSpan(w.startMinutes, w.endMinutes, span.startMinutes, span.endMinutes);
    if (!kind) continue;

    if (kind === 'start') {
      billableSpans[spanIdx] = Object.assign({}, span, { startMinutes: w.endMinutes });
      nonBillableLines.push({
        lineIndex: nextLineIndex++,
        startMinutes: w.startMinutes,
        endMinutes: w.endMinutes,
        source97155: w.entry
      });
    } else if (kind === 'end') {
      billableSpans[spanIdx] = Object.assign({}, span, { endMinutes: w.startMinutes });
      nonBillableLines.push({
        lineIndex: nextLineIndex++,
        startMinutes: w.startMinutes,
        endMinutes: w.endMinutes,
        source97155: w.entry
      });
    } else {
      const oldEnd = span.endMinutes;
      billableSpans[spanIdx] = Object.assign({}, span, { endMinutes: w.startMinutes });
      nonBillableLines.push({
        lineIndex: nextLineIndex++,
        startMinutes: w.startMinutes,
        endMinutes: w.endMinutes,
        source97155: w.entry
      });
      billableSpans.push({
        lineIndex: nextLineIndex++,
        startMinutes: w.endMinutes,
        endMinutes: oldEnd
      });
    }
  }

  const allLines = billableSpans
    .map(function (s) {
      return {
        lineIndex: s.lineIndex,
        type: 'billable',
        startMinutes: s.startMinutes,
        endMinutes: s.endMinutes
      };
    })
    .concat(
      nonBillableLines.map(function (n) {
        return {
          lineIndex: n.lineIndex,
          type: 'nonbillable',
          startMinutes: n.startMinutes,
          endMinutes: n.endMinutes,
          source97155: n.source97155
        };
      })
    )
    .sort(function (a, b) {
      return a.lineIndex - b.lineIndex;
    });

  if (!allLines.length) {
    return { ok: false, error: 'Could not build service line plan.' };
  }
  if (allLines.length > MAX_MULTI_97155_LINE_COUNT) {
    return {
      ok: false,
      error:
        'Too many service lines (' +
        allLines.length +
        ') — fix manually (max ' +
        MAX_MULTI_97155_LINE_COUNT +
        ').'
    };
  }

  const line0 = allLines.find(function (l) {
    return l.lineIndex === 0;
  });
  if (!line0 || line0.type !== 'billable') {
    return { ok: false, error: 'Line 1 must remain billable — cannot build plan.' };
  }

  const segments = [
    {
      lineIndex: 0,
      type: 'billable',
      action: 'trim',
      from: minutesToTimeString(line0.startMinutes),
      to: minutesToTimeString(line0.endMinutes)
    }
  ];
  for (let i = 1; i < allLines.length; i++) {
    const line = allLines[i];
    const nbOverlap =
      line.type === 'nonbillable'
        ? nonBillableLines
            .filter(function (nb) {
              return (
                nb.lineIndex !== line.lineIndex &&
                segmentsOverlapMinutes(nb.startMinutes, nb.endMinutes, line.startMinutes, line.endMinutes)
              );
            })
            .map(function (nb) {
              return nb.lineIndex;
            })
        : [];
    segments.push({
      lineIndex: line.lineIndex,
      type: line.type,
      action: 'add',
      from: minutesToTimeString(line.startMinutes),
      to: minutesToTimeString(line.endMinutes),
      source97155: line.source97155 || null,
      warnOverlapWith: nbOverlap.length ? nbOverlap : undefined
    });
  }

  const billableIndices = allLines.filter(function (l) {
    return l.type === 'billable';
  });
  const lastBillableIndex = billableIndices[billableIndices.length - 1].lineIndex;

  return {
    ok: true,
    entryId: entryId,
    client: (meta && meta.client) || '',
    date: (meta && meta.date) || '',
    entry97153: entry97153,
    concurrent97155Count: windows.length,
    segments: segments,
    lineCount: allLines.length,
    lastBillableIndex: lastBillableIndex,
    warnings: warnings
  };
}

function buildMulti97155FixPlanFromCase(item) {
  if (!item || !item.entry97153) {
    return { ok: false, error: 'Invalid multi-concurrent case.' };
  }
  return buildMulti97155FixPlan(item.entry97153, item.concurrent97155 || [], {
    client: item.client,
    date: item.date
  });
}

function formatMulti97155SegmentPreview(plan) {
  if (!plan || !plan.ok || !plan.segments) return '';
  return plan.segments
    .map(function (seg, idx) {
      const label = seg.type === 'nonbillable' ? 'non billable' : 'billable';
      return (
        'L' +
        (seg.lineIndex + 1) +
        ' ' +
        label +
        ' ' +
        seg.from +
        '–' +
        seg.to +
        (seg.action === 'trim' ? ' (trim)' : '')
      );
    })
    .join(' · ');
}

function render97155MultiConcurrentFixSection(multiCases, containerEl) {
  if (!multiCases.length || !containerEl) return;
  const wrap = document.createElement('div');
  wrap.className = 'overlap-blocked-multi';

  const title = document.createElement('p');
  title.className = 'overlap-blocked-multi__title';
  title.innerHTML = '<strong>Multi-concurrent (' + multiCases.length + ')</strong>';
  wrap.appendChild(title);

  const hint = document.createElement('p');
  hint.className = 'section-hint';
  hint.textContent =
    'One 97153 line with two or more 97155 sessions. Line 1 stays billable; extra lines are added in peel order (tab order may differ from clock order).';
  wrap.appendChild(hint);

  const list = document.createElement('ul');
  list.className = 'overlap-list overlap-list--blocked';
  multiCases.forEach(function (item) {
    const plan = buildMulti97155FixPlanFromCase(item);
    const clientLabel = (item.client || '(no client)').trim();
    const dateLabel = (item.date || '').trim();
    const line97153 = (item.entry97153.time || '').trim() + ' 97153';
    const lines97155 = item.concurrent97155
      .map(function (e) {
        return (e.time || '').trim() + ' 97155';
      })
      .join(' | ');
    const count97155 = item.concurrent97155.length;
    const badgeLabel = count97155 + '×97155';
    const multiDetail = plan.ok
      ? 'Multi — ' +
        count97155 +
        '×97155 on one 97153 → ' +
        plan.lineCount +
        ' lines after fix'
      : plan.error || 'Cannot build fix plan';
    const preview = plan.ok ? formatMulti97155SegmentPreview(plan) : '';
    const warnHtml =
      plan.ok && plan.warnings && plan.warnings.length
        ? '<div class="overlap-list__line overlap-list__line--error">' +
          escapeHtml(plan.warnings.join(' · ')) +
          '</div>'
        : '';

    const li = document.createElement('li');
    li.className = 'overlap-list__item overlap-list__item--multi';
    li.innerHTML =
      '<div class="overlap-list__row">' +
      '<span class="overlap-list__fix-wrap"></span>' +
      '<div class="overlap-list__lines">' +
      '<div class="overlap-list__line">' +
      escapeHtml(clientLabel) +
      ' · ' +
      escapeHtml(dateLabel) +
      '</div>' +
      '<div class="overlap-list__line">' +
      escapeHtml(line97153) +
      ' | ' +
      escapeHtml(lines97155) +
      '</div>' +
      '<div class="overlap-list__line overlap-list__line--multi-label">' +
      escapeHtml(multiDetail) +
      '</div>' +
      (preview
        ? '<div class="overlap-list__line section-hint" style="margin:0;font-size:11px;">' +
          escapeHtml(preview) +
          '</div>'
        : '') +
      warnHtml +
      '</div>' +
      '<span class="overlap-list__type overlap-list__type--multi" title="Multi-concurrent: ' +
      count97155 +
      ' separate 97155 sessions on one 97153 line" aria-label="Multi-concurrent ' +
      count97155 +
      ' 97155 sessions">' +
      escapeHtml(badgeLabel) +
      '</span>' +
      '</div>' +
      '<div class="overlap-list__fail-reason" aria-live="polite"></div>';

    const fixWrap = li.querySelector('.overlap-list__fix-wrap');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'overlap-btn overlap-list__fix';
    if (plan.ok) {
      btn.setAttribute('data-fix-mode', '97155-multi');
      btn.setAttribute('data-entry-id', plan.entryId);
      btn.setAttribute('data-fix-plan', JSON.stringify(plan));
      btn.setAttribute('data-client', item.client || '');
      btn.setAttribute('data-date', item.date || '');
      btn.setAttribute(
        'data-log-summary',
        '97155-multi · ' +
          clientLabel +
          ' • ' +
          dateLabel +
          ' ' +
          line97153 +
          ' | ' +
          lines97155 +
          ' Multi ' +
          count97155 +
          '×97155'
      );
      btn.title = 'Fix multi-concurrent 97155 overlap';
    } else {
      btn.disabled = true;
      btn.title = plan.error || 'Cannot fix';
    }
    fixWrap.appendChild(btn);
    list.appendChild(li);
  });
  wrap.appendChild(list);
  containerEl.appendChild(wrap);
}

/** Length in minutes of [a0,a1] ∩ [b0,b1] (0 if disjoint). */
function overlapSegmentMinutes(a0, a1, b0, b1) {
  const s = Math.max(a0, b0);
  const e = Math.min(a1, b1);
  return e > s ? e - s : 0;
}

/** True when a billing row has the same start and end minute (e.g. 4:07–4:07p) — not a real overlap candidate. */
function isSameMinuteEntry(e) {
  if (!e || e.startMinutes == null || e.endMinutes == null) return false;
  return e.endMinutes <= e.startMinutes;
}

/** Drop overlap groups that include a zero-length row or have no positive overlap window. */
function overlapGroupIsMeaningful(g) {
  const entries = g.entries || [];
  if (entries.some(isSameMinuteEntry)) return false;
  if (entries.length < 2) return false;
  const overlapStart = Math.max(...entries.map((e) => e.startMinutes));
  const overlapEnd = Math.min(...entries.map((e) => e.endMinutes));
  return overlapEnd > overlapStart;
}

function describe97155OmittedOverlapGroups(overlappingGroups) {
  const groups = overlappingGroups || [];
  const with97153 = groups.filter(overlapGroupHas97153Line);
  const chainOnly = with97153.filter(function (g) {
    return !overlapGroupIsMeaningful(g);
  });
  if (chainOnly.length > 0) {
    return {
      title: 'Overlaps were found but could not be listed for automatic fix.',
      hint:
        chainOnly.length +
        ' group(s) link sessions in a chain where no single time window is shared by every line (for example morning 97153, 97155, and afternoon 97153). Update the extension and scan again, or review manually.',
    };
  }
  if (groups.length > 0) {
    return {
      title: 'No overlapping groups include a 97153 line, so nothing is listed for automatic fix.',
      hint:
        groups.length +
        ' overlap group(s) (for example 97155-only) were found but omitted — this flow only applies when a 97153 line is part of the overlap.',
    };
  }
  return {
    title: 'No overlapping groups include a 97153 line, so nothing is listed for automatic fix.',
    hint: '',
  };
}

/**
 * For an overlap group, pick a 97153 entry that intersects the non-97153 appointment window and split out
 * only that concurring segment (partial wrap is OK — we do not require 97153 to cover the full other span).
 * Returns { ok, error?, entry97153?, entryId?, timeFrom?, timeTo?, overlapText? }.
 */
function getOverlapFixForGroup(g) {
  const entries = g.entries || [];
  const with97153 = entries.filter((e) => (e.serviceAuth || '').includes('97153'));
  const others = entries.filter((e) => !(e.serviceAuth || '').includes('97153'));
  if (with97153.length === 0) {
    return { ok: false, error: 'This group does not include a 97153 service line, so this automatic fix does not apply here.' };
  }
  if (others.length === 0) {
    return {
      ok: false,
      error:
        'Every line here is 97153. This tool is for when 97153 overlaps a different service code (for example 92507) on the same day.'
    };
  }
  const minStartOthers = Math.min(...others.map((e) => e.startMinutes));
  const maxEndOthers = Math.max(...others.map((e) => e.endMinutes));

  const intersecting97153 = with97153.filter(
    (e) => e.startMinutes < maxEndOthers && e.endMinutes > minStartOthers
  );
  if (intersecting97153.length === 0) {
    const spanOthers = minutesToTimeString(minStartOthers) + ' – ' + minutesToTimeString(maxEndOthers);
    return {
      ok: false,
      error:
        'No 97153 line intersects the other overlapping appointment window (' +
        spanOthers +
        '). Refresh the billing list, run Overlaps again, or review manually.'
    };
  }

  const entry97153 = intersecting97153.reduce((best, e) => {
    const iw = overlapSegmentMinutes(e.startMinutes, e.endMinutes, minStartOthers, maxEndOthers);
    const bw = overlapSegmentMinutes(best.startMinutes, best.endMinutes, minStartOthers, maxEndOthers);
    if (iw > bw) return e;
    if (iw < bw) return best;
    return e.endMinutes - e.startMinutes >= best.endMinutes - best.startMinutes ? e : best;
  });

  const overlapStart = Math.max(entry97153.startMinutes, minStartOthers);
  const overlapEnd = Math.min(entry97153.endMinutes, maxEndOthers);

  if (overlapEnd <= overlapStart) {
    return {
      ok: false,
      error:
        'The overlap is only a single minute boundary (for example 4:07 PM – 4:07 PM), often from a zero-length row like 4:07–4:07. That does not count as an overlap — no fix needed.'
    };
  }

  const TOLERANCE_MINUTES = 1;
  const atStart = overlapStart <= entry97153.startMinutes + TOLERANCE_MINUTES;
  const atEnd = overlapEnd >= entry97153.endMinutes - TOLERANCE_MINUTES;

  const entryId = (entry97153.rowId || '').replace(/^billing-grid-row-/, '');
  if (!entryId) return { ok: false, error: 'We could not read the row id for this entry. Refresh the billing list and run Overlaps again.' };

  if (atStart) {
    // Overlap at start: adjust first line to start at end of overlap; add second (nonbillable). No third line.
    return {
      ok: true,
      overlapType: 'start',
      entry97153,
      entryId,
      timeFrom: minutesToTimeString(overlapEnd),
      timeTo: minutesToTimeString(entry97153.endMinutes),
      overlapText: minutesToTimeString(overlapStart) + ' – ' + minutesToTimeString(overlapEnd),
      overlapFrom: minutesToTimeString(overlapStart),
      overlapTo: minutesToTimeString(overlapEnd),
      part3From: '',
      part3To: ''
    };
  }
  if (atEnd) {
    // Overlap at end: part 1 ends at start of overlap; add second (nonbillable). No third line.
    return {
      ok: true,
      overlapType: 'end',
      entry97153,
      entryId,
      timeFrom: minutesToTimeString(entry97153.startMinutes),
      timeTo: minutesToTimeString(overlapStart),
      overlapText: minutesToTimeString(overlapStart) + ' – ' + minutesToTimeString(overlapEnd),
      overlapFrom: minutesToTimeString(overlapStart),
      overlapTo: minutesToTimeString(overlapEnd),
      part3From: '',
      part3To: ''
    };
  }

  // Middle: part 1 ends at overlap start; line 2 = nonbillable overlap; line 3 = billable after overlap.
  const newEndMinutes = overlapStart;
  return {
    ok: true,
    overlapType: 'middle',
    entry97153,
    entryId,
    timeFrom: minutesToTimeString(entry97153.startMinutes),
    timeTo: minutesToTimeString(newEndMinutes),
    overlapText: minutesToTimeString(overlapStart) + ' – ' + minutesToTimeString(overlapEnd),
    overlapFrom: minutesToTimeString(overlapStart),
    overlapTo: minutesToTimeString(overlapEnd),
    part3From: minutesToTimeString(overlapEnd),
    part3To: minutesToTimeString(entry97153.endMinutes)
  };
}

/**
 * When middle overlap fix fails before payor inference, map inject result codes to clear copy.
 * Row-not-found is a DOM/grid visibility issue, not “missing CRM labels” on the provider.
 */
function messageForOverlapFixProviderLabelsFailure(result) {
  if (!result || (!result.error && !result.success)) {
    return "We could not read the provider's profile tags in time. Those tags tell us which payor/education option to use on the third line. Make sure the right billing row is on screen, then click Fix again.";
  }
  if (result.success && result.labels && result.labels.length) return '';
  const code = result.code;
  const id = result.entryId != null ? String(result.entryId) : '';
  if (code === 'ROW_NOT_FOUND') {
    return (
      'This billing line is not on the screen right now (row ' +
      (id || 'unknown') +
      '). Scroll until you can see that appointment on the billing list, check filters and pages, then click Fix again. You can also click Overlaps to refresh the list first.'
    );
  }
  if (code === 'PROVIDER_COLUMN_NOT_FOUND') {
    return 'We found the row but not the provider column (the page layout may have changed). Refresh the billing list, run Overlaps again, then try Fix.';
  }
  if (code === 'NO_VCARD') {
    return "We could not click the provider's name on that row. Scroll the row fully into view and try again.";
  }
  if (code === 'CONTACT_CARD_TIMEOUT') {
    return "The provider profile window did not open in time. Close any open profile windows, wait for the billing list to finish loading, then try Fix again.";
  }
  if (code === 'NO_ENTRY_ID') {
    return 'Something went wrong matching this fix to a row. Click Overlaps again, then try Fix.';
  }
  if (result.error) {
    var raw = String(result.error);
    if (raw.indexOf('Row not found for entry') !== -1) {
      var idMatch = raw.match(/entry\s+([\d]+)/i);
      return messageForOverlapFixProviderLabelsFailure({
        code: 'ROW_NOT_FOUND',
        entryId: result.entryId != null ? result.entryId : idMatch ? idMatch[1] : ''
      });
    }
    return (
      "We could not read the provider's profile tags. " +
      raw.replace(/\.$/, '') +
      '. If this keeps happening, open the provider from the billing row yourself, note their degree tags, then choose the payor option by hand on the timesheet.'
    );
  }
  return "We could not read the provider's profile tags. Make sure the billing row is visible, then try Fix again.";
}

/**
 * Short message when remote payor/education inject fails (overlap flow or manual button).
 */
function messageForPayorSelectFailure(data) {
  if (data && data.error) return data.error;
  return 'We could not click the payor or education-level choice on this screen. Scroll until the Master / Associate (or similar) options are fully visible, wait for the page to finish loading, then try again. You can also click the right option yourself.';
}

/** For a 97155 overlap group, return overlap time range text for display. */
function getOverlap97155Display(g) {
  const entries = g.entries || [];
  if (entries.length === 0) return '—';
  const overlapStart = Math.max(...entries.map((e) => e.startMinutes));
  const overlapEnd = Math.min(...entries.map((e) => e.endMinutes));
  return minutesToTimeString(overlapStart) + ' – ' + minutesToTimeString(overlapEnd);
}

/**
 * Unknown payor labels from the billing table — user must add each to allow or block list before overlap results show.
 */
function renderUnknownPayors97155Prompt(unknownPayors) {
  const el = document.getElementById('overlaps-result');
  const fixButtonsEl = document.getElementById('overlap-fix-buttons');
  if (!el || !fixButtonsEl) return;
  el.innerHTML = '';
  fixButtonsEl.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'unknown-payors-prompt';

  const title = document.createElement('p');
  title.className = 'unknown-payors-prompt__title';
  title.innerHTML = '<strong>New payors on this page</strong>';
  wrap.appendChild(title);

  const hint = document.createElement('p');
  hint.className = 'section-hint';
  hint.style.marginBottom = '10px';
  hint.textContent =
    'These payor cells did not match your allow list or block list. Pick where each label should go — settings update immediately and the scan runs again when you finish the list.';
  wrap.appendChild(hint);

  unknownPayors.forEach(function (payorLabel) {
    const row = document.createElement('div');
    row.className = 'unknown-payors-prompt__row';

    const labelEl = document.createElement('span');
    labelEl.className = 'unknown-payors-prompt__label';
    labelEl.textContent = payorLabel;

    const btnAllow = document.createElement('button');
    btnAllow.type = 'button';
    btnAllow.className = 'unknown-payors-prompt__btn unknown-payors-prompt__btn--allow';
    btnAllow.textContent = 'Allow list';
    btnAllow.addEventListener('click', function () {
      addPayorToAllowedList(payorLabel);
      row.remove();
      log('97155 scan: added to allow list — ' + payorLabel);
      if (!wrap.querySelector('.unknown-payors-prompt__row')) {
        runFindOverlaps97155();
      }
    });

    const btnBlock = document.createElement('button');
    btnBlock.type = 'button';
    btnBlock.className = 'unknown-payors-prompt__btn unknown-payors-prompt__btn--block';
    btnBlock.textContent = 'Block list';
    btnBlock.addEventListener('click', function () {
      addPayorToBlockedList(payorLabel);
      row.remove();
      log('97155 scan: added to block list — ' + payorLabel);
      if (!wrap.querySelector('.unknown-payors-prompt__row')) {
        runFindOverlaps97155();
      }
    });

    row.appendChild(labelEl);
    row.appendChild(btnAllow);
    row.appendChild(btnBlock);
    wrap.appendChild(row);
  });

  el.appendChild(wrap);
  fixButtonsEl.innerHTML =
    '<p class="section-hint">Resolve each payor above (or edit lists in Settings), then overlap results will appear.</p>';
}

function renderOverlaps97155(data) {
  const el = document.getElementById('overlaps-result');
  const fixButtonsEl = document.getElementById('overlap-fix-buttons');
  if (!el || !fixButtonsEl) return;
  el.innerHTML = '';
  fixButtonsEl.innerHTML = '';
  if (data.error) {
    clearOverlapRunAllMount();
    el.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
    fixButtonsEl.innerHTML = '<p class="section-hint">97155 overlap list will appear here after a successful scan.</p>';
    return;
  }
  const unknownPayors = Array.isArray(data.unknownPayors) ? data.unknownPayors : [];
  const overlappingGroups = Array.isArray(data.overlappingGroups) ? data.overlappingGroups : [];
  if (unknownPayors.length > 0) {
    renderUnknownPayors97155Prompt(unknownPayors);
    if (overlappingGroups.length === 0) {
      clearOverlapRunAllMount();
      return;
    }
    fixButtonsEl.innerHTML = '';
  }
  const {
    totalRows = 0,
    totalTableRows,
    uniqueClients = 0,
    skippedPayorRows = 0,
    skippedBlacklistRows = 0
  } = data;
  var skipParts = [];
  if (skippedBlacklistRows > 0) skipParts.push(skippedBlacklistRows + ' skipped (block list)');
  var skipOther = skippedPayorRows - skippedBlacklistRows;
  if (skipOther > 0) skipParts.push(skipOther + ' skipped (allow rules)');
  const payorNote = skipParts.length ? ' (' + skipParts.join('; ') + ')' : '';
  const rowSummary = totalTableRows != null
    ? totalTableRows + ' table rows in view, ' + totalRows + ' with 97155/97153'
    : totalRows + ' rows with 97155/97153';
  if (overlappingGroups.length === 0) {
    clearOverlapRunAllMount();
    el.innerHTML = '<p>No 97155/97153 overlapping times found.</p><p>' + rowSummary + '. ' + uniqueClients + ' unique clients.' + escapeHtml(payorNote) + '</p>';
    fixButtonsEl.innerHTML = '<p class="section-hint">No overlaps. The list will appear here when overlaps are found.</p>';
    return;
  }
  const fixable97155Groups = overlappingGroups.filter(function (g) {
    return overlapGroupIsMeaningful(g) && overlapGroupHas97153Line(g);
  });
  const partitioned97155 = partition97155MultiConcurrentGroups(fixable97155Groups);
  const regular97155Groups = partitioned97155.regular;
  const blockedMulti97155 = partitioned97155.blockedCases;
  if (fixable97155Groups.length === 0) {
    clearOverlapRunAllMount();
    const omitted = describe97155OmittedOverlapGroups(overlappingGroups);
    el.innerHTML =
      '<p>' + omitted.title + '</p>' +
      (omitted.hint ? '<p class="section-hint">' + omitted.hint + '</p>' : '') +
      '<p>' +
      rowSummary +
      '. ' +
      uniqueClients +
      ' unique clients.' +
      escapeHtml(payorNote) +
      '</p>';
    fixButtonsEl.innerHTML = '<p class="section-hint">Nothing to show for this scan.</p>';
    return;
  }
  if (regular97155Groups.length === 0 && blockedMulti97155.length > 0) {
    clearOverlapRunAllMount();
    const h3Blocked = document.createElement('h3');
    h3Blocked.textContent =
      blockedMulti97155.length +
      ' multi-concurrent case(s) · ' +
      totalRows +
      ' rows with 97155/97153' +
      payorNote;
    el.appendChild(h3Blocked);
    const subBlocked = document.createElement('p');
    subBlocked.className = 'section-hint';
    subBlocked.textContent =
      'Each row is one 97153 line with two or more 97155 concurrences. Line 1 stays billable.';
    subBlocked.style.marginTop = '4px';
    subBlocked.style.marginBottom = '8px';
    el.appendChild(subBlocked);
    render97155MultiConcurrentFixSection(blockedMulti97155, fixButtonsEl);
    mountOverlapRunAllUI('97155', [], blockedMulti97155);
    return;
  }
  const h3 = document.createElement('h3');
  const fixableCountLabel =
    regular97155Groups.length +
    ' fixable group(s)' +
    (blockedMulti97155.length > 0
      ? ', ' + blockedMulti97155.length + ' multi-concurrent'
      : '');
  const rowSummary97155 = totalTableRows != null
    ? fixableCountLabel + ' · ' + totalRows + ' rows with 97155/97153 (of ' + totalTableRows + ' table rows)' + payorNote
    : fixableCountLabel + ' · ' + totalRows + ' rows with 97155/97153' + payorNote;
  h3.textContent = rowSummary97155;
  const sub97155 = document.createElement('p');
  sub97155.className = 'section-hint';
  sub97155.textContent = 'Each fixable group = one client + one date with a single 97155 concurrent on that 97153 line.';
  sub97155.style.marginTop = '4px';
  sub97155.style.marginBottom = '8px';
  el.appendChild(h3);
  el.appendChild(sub97155);
  if (blockedMulti97155.length > 0) {
    render97155MultiConcurrentFixSection(blockedMulti97155, fixButtonsEl);
  }
  const list = document.createElement('ul');
  list.className = 'overlap-list';
  regular97155Groups.forEach((g) => {
    const fix = getOverlapFixForGroup(g);
    const overlapText = getOverlap97155Display(g);
    const clientLabel = (g.client || '(no client)').trim();
    const dateLabel = (g.date || '').trim();
    const timesLine = (g.entries || [])
      .map((e) => (e.time || '').trim() + ' ' + shortServiceCode(e.serviceAuth))
      .join(' | ');
    const thirdLineText = fix.ok ? 'Overlap ' + overlapText : 'Cannot fix';
    const thirdLineClass = fix.ok ? 'overlap-list__line' : 'overlap-list__line overlap-list__line--error';
    const typeBadge97155 = fix.ok && fix.overlapType ? ('<span class="overlap-list__type" aria-hidden="true">' + (fix.overlapType === 'middle' ? 'm' : fix.overlapType === 'start' ? 'b' : 'e') + '</span>') : '';
    const li = document.createElement('li');
    li.className = 'overlap-list__item';
    li.innerHTML =
      '<div class="overlap-list__row">' +
      '<span class="overlap-list__fix-wrap"></span>' +
      '<div class="overlap-list__lines">' +
      '<div class="overlap-list__line">' + escapeHtml(clientLabel) + ' · ' + escapeHtml(dateLabel) + '</div>' +
      '<div class="overlap-list__line">' + escapeHtml(timesLine) + '</div>' +
      '<div class="' + thirdLineClass + '">' + escapeHtml(thirdLineText) + '</div>' +
      '</div>' +
      typeBadge97155 +
      '</div>' +
      '<div class="overlap-list__fail-reason" aria-live="polite">' +
        (fix.ok
          ? ''
          : escapeHtml(
              fix.error ||
                'The 97153 time does not fully cover the other overlapping code for this group, so automatic fix is not available. Review the times manually.'
            )) +
        '</div>';
    const fixWrap = li.querySelector('.overlap-list__fix-wrap');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'overlap-btn overlap-list__fix';
    if (fix.ok) {
      btn.setAttribute('data-fix-mode', '97155');
      btn.setAttribute('data-entry-id', fix.entryId);
      btn.setAttribute('data-time-from', fix.timeFrom);
      btn.setAttribute('data-time-to', fix.timeTo);
      btn.setAttribute('data-overlap', fix.overlapText);
      btn.setAttribute('data-overlap-from', fix.overlapFrom);
      btn.setAttribute('data-overlap-to', fix.overlapTo);
      btn.setAttribute('data-part3-from', fix.part3From || '');
      btn.setAttribute('data-part3-to', fix.part3To || '');
      btn.setAttribute('data-overlap-type', fix.overlapType || 'middle');
      btn.setAttribute('data-client', g.client);
      btn.setAttribute('data-date', g.date);
      btn.setAttribute('data-original-times', timesLine);
      var logSummary97155 =
        '97155 · ' +
        clientLabel +
        ' • ' +
        dateLabel +
        ' ' +
        timesLine +
        (overlapText ? ' Overlap ' + overlapText : '');
      btn.setAttribute('data-log-summary', logSummary97155);
      btn.textContent = '';
      btn.title = 'Fix this 97155 overlap';
    } else {
      btn.textContent = '';
      btn.title = fix.error || '';
      btn.disabled = true;
    }
    fixWrap.appendChild(btn);
    list.appendChild(li);
  });
  fixButtonsEl.appendChild(list);
  mountOverlapRunAllUI('97155', regular97155Groups, blockedMulti97155);
}

function renderOverlaps(data) {
  const el = document.getElementById('overlaps-result');
  el.innerHTML = '';
  const fixButtonsEl = document.getElementById('overlap-fix-buttons');
  fixButtonsEl.innerHTML = '';
  if (data.error) {
    clearOverlapRunAllMount();
    el.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
    fixButtonsEl.innerHTML = '<p class="section-hint">Overlap list will appear here after a successful scan.</p>';
    return;
  }
  const { overlappingGroups = [], totalRows = 0, totalTableRows, uniqueClients = 0 } = data;
  const fixableGroups = (overlappingGroups || []).filter((g) => {
    if (!overlapGroupIsMeaningful(g)) return false;
    const entries = g.entries || [];
    const others = entries.filter((e) => !(e.serviceAuth || '').includes('97153'));
    return others.length > 0;
  });
  if (fixableGroups.length === 0) {
    clearOverlapRunAllMount();
    const rowSummary = totalTableRows != null
      ? totalTableRows + ' table rows in view, ' + totalRows + ' with 92507/97153'
      : totalRows + ' rows with 92507/97153';
    el.innerHTML = '<p>No overlapping times found.</p><p>' + rowSummary + '. ' + uniqueClients + ' unique clients.</p>';
    fixButtonsEl.innerHTML = '<p class="section-hint">No overlaps. The list will appear here when overlaps are found.</p>';
    return;
  }
  const h3 = document.createElement('h3');
  const rowSummary = totalTableRows != null
    ? fixableGroups.length + ' overlapping group(s) · ' + totalRows + ' rows with 92507/97153 (of ' + totalTableRows + ' table rows in view)'
    : fixableGroups.length + ' overlapping group(s) · ' + totalRows + ' rows with 92507/97153';
  h3.textContent = rowSummary;
  const sub = document.createElement('p');
  sub.className = 'section-hint';
  sub.textContent = 'Each group = one client + one date where two or more entries have overlapping times.';
  sub.style.marginTop = '4px';
  sub.style.marginBottom = '8px';
  el.appendChild(h3);
  el.appendChild(sub);
  const list = document.createElement('ul');
  list.className = 'overlap-list';
  fixableGroups.forEach((g) => {
    const fix = getOverlapFixForGroup(g);
    const clientLabel = (g.client || '(no client)').trim();
    const dateLabel = (g.date || '').trim();
    const timesLine = (g.entries || [])
      .map((e) => (e.time || '').trim() + ' ' + shortServiceCode(e.serviceAuth))
      .join(' | ');
    const overlapLine = fix.ok ? 'Overlap ' + escapeHtml(fix.overlapText) : 'Cannot fix';
    const failReasonText = fix.ok
      ? ''
      : fix.error ||
        'The 97153 time does not fully cover the other overlapping code for this group, so automatic fix is not available. Review the times manually.';
    const li = document.createElement('li');
    li.className = 'overlap-list__item';
    const typeBadge = fix.ok && fix.overlapType ? ('<span class="overlap-list__type" aria-hidden="true">' + (fix.overlapType === 'middle' ? 'm' : fix.overlapType === 'start' ? 'b' : 'e') + '</span>') : '';
    li.innerHTML =
      '<div class="overlap-list__row">' +
      '<span class="overlap-list__fix-wrap"></span>' +
      '<div class="overlap-list__lines">' +
      '<div class="overlap-list__line">' + escapeHtml(clientLabel) + ' · ' + escapeHtml(dateLabel) + '</div>' +
      '<div class="overlap-list__line">' + escapeHtml(timesLine) + '</div>' +
      '<div class="overlap-list__line' + (fix.ok ? '' : ' overlap-list__line--error') + '">' + overlapLine + '</div>' +
      '</div>' +
      typeBadge +
      '</div>' +
      '<div class="overlap-list__fail-reason" aria-live="polite">' + escapeHtml(failReasonText) + '</div>';
    const fixWrap = li.querySelector('.overlap-list__fix-wrap');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'overlap-btn overlap-list__fix';
    if (fix.ok) {
      btn.setAttribute('data-entry-id', fix.entryId);
      btn.setAttribute('data-time-from', fix.timeFrom);
      btn.setAttribute('data-time-to', fix.timeTo);
      btn.setAttribute('data-overlap', fix.overlapText);
      btn.setAttribute('data-overlap-from', fix.overlapFrom);
      btn.setAttribute('data-overlap-to', fix.overlapTo);
      btn.setAttribute('data-part3-from', fix.part3From || '');
      btn.setAttribute('data-part3-to', fix.part3To || '');
      btn.setAttribute('data-overlap-type', fix.overlapType || 'middle');
      btn.setAttribute('data-client', g.client);
      btn.setAttribute('data-date', g.date);
      btn.setAttribute('data-original-times', timesLine);
      var logSummarySpeech =
        'speech · ' +
        clientLabel +
        ' • ' +
        dateLabel +
        ' ' +
        timesLine +
        (fix.overlapText ? ' Overlap ' + fix.overlapText : '');
      btn.setAttribute('data-log-summary', logSummarySpeech);
      btn.textContent = '';
      btn.title = 'Fix this overlap';
    } else {
      btn.textContent = '';
      btn.title = fix.error || '';
      btn.disabled = true;
    }
    fixWrap.appendChild(btn);
    list.appendChild(li);
  });
  fixButtonsEl.appendChild(list);
  mountOverlapRunAllUI('speech', fixableGroups);
}

function renderTimesheet(data) {
  const el = document.getElementById('timesheet-result');
  el.innerHTML = '';
  if (data.error) {
    el.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
    return;
  }
  const h3 = document.createElement('h3');
  h3.textContent = 'Time sheet';
  el.appendChild(h3);
  const fields = [
    ['Date of service', data.dateOfService],
    ['Authorization', data.authorization],
    ['Time worked (start)', data.timeWorkedFrom],
    ['Time worked (end)', data.timeWorkedTo],
    ['Units of service', data.unitsOfService],
    ['Place of service', data.placeOfService],
    ['Service address', data.serviceAddressText || data.serviceAddress]
  ];
  fields.forEach(([name, value]) => {
    if (value === undefined || value === '') return;
    const div = document.createElement('div');
    div.className = 'field';
    div.innerHTML = '<span class="field-name">' + escapeHtml(name) + '</span>: ' + escapeHtml(String(value));
    el.appendChild(div);
  });
}

/** Push allow/block payor lists into the page MAIN world (POEL overlap scan reads them there). */
async function prime97155PayorFiltersOnTab(tabId) {
  await execScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: function (allowed, blocked) {
      window.__97155AllowedPayors = allowed;
      window.__97155BlockedPayors = blocked;
    },
    args: [getAllowedPayors(), getBlockedPayors()]
  });
}

/** Run overlap scan only (no scrolling). resultKey: '97155' = 97155/97153 scan, null = Speech 92507/97153 scan. */
async function runOverlapScanOnly(tab, resultKey) {
  await _ensureSettingsLoaded();
  if (resultKey === '97155') {
    await prime97155PayorFiltersOnTab(tab.id);
  }
  if (typeof window.SHELL !== 'undefined' && window.SHELL.runOverlapScan) {
    return window.SHELL.runOverlapScan(resultKey);
  }
  const scanFile = resultKey === '97155' ? 'inject-overlaps-97155.js' : 'inject-overlaps.js';
  await execScript({ target: { tabId: tab.id }, files: [scanFile] });
  const results = await execScript({
    target: { tabId: tab.id },
    func: (key) => (key === '97155' ? window.__overlaps97155Result : window.__overlapsResult),
    args: [resultKey]
  });
  return results && results[0] && results[0].result;
}

async function runFindOverlaps() {
  const resultEl = document.getElementById('overlaps-result');
  const fixButtonsEl = document.getElementById('overlap-fix-buttons');
  resultEl.innerHTML = '<p>Scanning...</p>';
  if (fixButtonsEl) fixButtonsEl.innerHTML = '';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    const data = await runOverlapScanOnly(tab, null);
    if (!data) {
      resultEl.innerHTML = '<p>No result. Make sure you are on the billing table page.</p>';
      document.getElementById('overlap-fix-buttons').innerHTML = '<p class="section-hint">Scan failed. Open the billing table and try again.</p>';
      return;
    }
    lastOverlapScanPageUrl = tab.url || null;
    lastOverlapScanMode = 'speech';
    renderOverlaps(data);
    log('Overlaps: ' + (data.overlappingGroups || []).length + ' group(s)');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
    document.getElementById('overlap-fix-buttons').innerHTML = '<p class="section-hint">Error. Try again.</p>';
  }
}

/** Set the clicked Concurances button as active (blue); the other in the same panel becomes grey. */
function setConcuranceScanActive(activeBtn) {
  const container = activeBtn && activeBtn.closest('.buttons');
  if (!container) return;
  container.querySelectorAll('.concurance-scan-btn').forEach((btn) => {
    btn.classList.toggle('is-active', btn === activeBtn);
  });
}

document.getElementById('texas-overlaps-manual').addEventListener('click', () => {
  setConcuranceScanActive(document.getElementById('texas-overlaps-manual'));
  log('Texas overlaps (manual) — 97155 concurrents scan');
  runFindOverlaps97155();
});

document.getElementById('texas-overlaps-scan').addEventListener('click', () => {
  setConcuranceScanActive(document.getElementById('texas-overlaps-scan'));
  log('Texas overlaps — 97155 concurrents scan');
  runFindOverlaps97155();
});

async function runFindOverlaps97155() {
  const resultEl = document.getElementById('overlaps-result');
  const fixButtonsEl = document.getElementById('overlap-fix-buttons');
  if (resultEl) resultEl.innerHTML = '<p>Scanning for 97155/53...</p>';
  if (fixButtonsEl) fixButtonsEl.innerHTML = '';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      if (resultEl) resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      if (resultEl) resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    const data = await runOverlapScanOnly(tab, '97155');
    if (!data) {
      if (resultEl) resultEl.innerHTML = '<p>No result. Make sure you are on the billing table page.</p>';
      if (fixButtonsEl) fixButtonsEl.innerHTML = '<p class="section-hint">Scan failed. Open the billing table and try again.</p>';
      return;
    }
    lastOverlapScanPageUrl = tab.url || null;
    lastOverlapScanMode = '97155';
    renderOverlaps97155(data);
    const nGroups = (data.overlappingGroups || []).length;
    const nFixable = (data.overlappingGroups || []).filter(function (g) {
      return overlapGroupIsMeaningful(g) && overlapGroupHas97153Line(g);
    }).length;
    const nUnknown = (data.unknownPayors || []).length;
    let scanSummary = '97155 Overlaps: ' + nGroups + ' group(s), ' + nFixable + ' fixable';
    if (nUnknown > 0) {
      scanSummary += ', ' + nUnknown + ' payor(s) need allow/block';
    }
    if (nGroups > 0 && nFixable === 0) {
      const hasChain = (data.overlappingGroups || []).some(function (g) {
        return overlapGroupHas97153Line(g) && !overlapGroupIsMeaningful(g);
      });
      scanSummary += hasChain
        ? ' (chain-linked groups — no shared overlap window)'
        : ' (groups found but none include a fixable 97153 overlap)';
    }
    log(scanSummary);
  } catch (e) {
    log('Error: ' + e.message);
    if (resultEl) resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
    if (fixButtonsEl) fixButtonsEl.innerHTML = '<p class="section-hint">Error. Try again.</p>';
  }
}

document.getElementById('read-timesheet').addEventListener('click', async () => {
  log('Read Time Sheet clicked');
  const resultEl = document.getElementById('timesheet-result');
  resultEl.innerHTML = '<p>Reading timesheet...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      files: ['inject-service-line-tab-count.js', 'inject-read-timesheet.js']
    });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__timesheetResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet editor page first.</p>';
      return;
    }
    renderTimesheet(data);
    log('Time sheet read.');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('add-service-line').addEventListener('click', async () => {
  log('Add Service Line clicked');
  const resultEl = document.getElementById('add-service-line-result');
  resultEl.innerHTML = '<p>Adding service line...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      files: ['inject-service-line-tab-count.js', 'inject-add-service-line.js']
    });
    await new Promise(function (r) { setTimeout(r, 550); });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__addServiceLineResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet editor first.</p>';
      log('Add Service Line: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Add Service Line: ' + data.error);
      return;
    }
    const before = data.countBefore;
    const after = data.countAfter;
    resultEl.innerHTML = '<p><strong>Added.</strong> Service lines: <strong>' + after + '</strong>' + (before !== after ? ' (was ' + before + ').' : '.') + '</p>';
    log('Add Service Line: now ' + after + ' service line(s)');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('select-nonbillable-code').addEventListener('click', async () => {
  log('Select nonbillable code clicked');
  const resultEl = document.getElementById('select-nonbillable-code-result');
  resultEl.innerHTML = '<p>Opening Service Codes and selecting...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-service-codes.js'] });
    await new Promise(function (r) { setTimeout(r, 950); });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__selectServiceCodesResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result yet. Try again or open a timesheet editor first.</p>';
      log('Select nonbillable code: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Select nonbillable code: ' + data.error);
      return;
    }
    resultEl.innerHTML =
      '<p>Clicked <strong>' +
      data.clicked +
      '</strong> matching code(s) (CONCURRENT: Nonbillable supervision time).</p>';
    log('Select nonbillable code: clicked ' + data.clicked);
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('click-billable-97153').addEventListener('click', async () => {
  log('97153 (billable) clicked');
  const resultEl = document.getElementById('click-billable-97153-result');
  resultEl.innerHTML = '<p>Clicking 97153...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-billable-97153.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickBillable97153Result
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open the billable tab first.</p>';
      log('97153: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('97153: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Clicked <strong>97153</strong>.</p>';
    log('97153: clicked');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('select-payor-option').addEventListener('click', async () => {
  log('Select payor option (' + PAYOR_OPTION_MATCH + ') clicked');
  const resultEl = document.getElementById('select-payor-option-result');
  resultEl.innerHTML = '<p>Selecting &hellip;</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      func: function (m) { window.__payorOptionMatch = m; },
      args: [PAYOR_OPTION_MATCH]
    });
    const data = await runInjectPayorSelect(tab.id);
    logRemoteInjectDebug('Payor manual', data);
    if (!data) {
      resultEl.innerHTML =
        '<p>Open the timesheet to the step where you choose <strong>insurance payor</strong> or <strong>provider education level</strong> (the Master vs Associate style choices), then click this button again.</p>';
      log('Payor option: no result');
      logPayorResultPayload('Payor', 'manual', data);
      logPayorSelectDebug(data, 'manual', 'Payor');
      return;
    }
    if (data.error || !data.success) {
      resultEl.innerHTML = '<p>' + escapeHtml(messageForPayorSelectFailure(data)) + '</p>';
      log('Payor option: ' + (data.error || 'failed'));
      logPayorResultPayload('Payor', 'manual', data);
      logPayorSelectDebug(data, 'manual', 'Payor');
      return;
    }
    if (data.skipped) {
      if (data.debug && data.debug.shippedStub) {
        resultEl.innerHTML =
          '<p>The shipped panel does not bundle payor/education DOM logic. With <strong>POEL</strong>, publish <code>inject-select-payor-option</code> from your project scripts; each automation run fetches the latest file (cache-bust). Use <strong>Update</strong> in the shell for new config — you do not need to reload the Chrome extension.</p>';
        log('Payor option: local stub only (host inject-select-payor-option remotely).');
        logRemoteInjectDebug('Payor manual', data);
        return;
      }
      resultEl.innerHTML =
        '<p>This screen does not show payor or education-level choices, so we <strong>skipped</strong> that step. That is normal on some lines.</p>';
      log('Payor option: skipped (no tier UI)');
      logPayorResultPayload('Payor', 'manual', data);
      logPayorSelectDebug(data, 'manual', 'Payor');
      logRemoteInjectDebug('Payor manual', data);
      return;
    }
    resultEl.innerHTML = '<p>Clicked option containing "<strong>' + escapeHtml(data.matchedText || PAYOR_OPTION_MATCH) + '</strong>".</p>';
    log('Payor option: clicked ' + (data.matchedText || PAYOR_OPTION_MATCH));
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('click-existing-note').addEventListener('click', async () => {
  log('Click existing note clicked');
  const resultEl = document.getElementById('click-existing-note-result');
  resultEl.innerHTML = '<p>Clicking...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-existing-note.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickExistingNoteResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet with notes first.</p>';
      log('Click existing note: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Click existing note: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Clicked <strong>SELECT EXISTING NOTE</strong>.</p>';
    log('Click existing note: OK');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('click-note-by-date-name').addEventListener('click', async () => {
  log('Click note (' + NOTE_MATCH_DATE + ' ' + NOTE_MATCH_NAME + ') clicked');
  const resultEl = document.getElementById('click-note-by-date-name-result');
  resultEl.innerHTML = '<p>Finding note...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      func: function (d, n) { window.__noteMatchDate = d; window.__noteMatchName = n; },
      args: [NOTE_MATCH_DATE, NOTE_MATCH_NAME]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-note-by-date-name.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickNoteByDateNameResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Click "Click existing note" first to open the list.</p>';
      log('Click note: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Click note: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Clicked note: <strong>' + escapeHtml(NOTE_MATCH_DATE + ' ' + NOTE_MATCH_NAME) + '</strong>.</p>';
    log('Click note: OK');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('selected-backup-notes').addEventListener('click', async () => {
  log('Selected backup notes clicked');
  const resultEl = document.getElementById('selected-backup-notes-result');
  resultEl.innerHTML = '<p>Opening session note picker…</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      func: function (snippet) {
        window.__backupNoteRowSnippet = snippet;
      },
      args: [BACKUP_NOTE_ROW_SNIPPET],
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-existing-session-note-flow.js'] });
    const data = await pollForInjectResult(tab.id, '__selectExistingSessionNoteFlowResult', 16000, 250);
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet line with session notes.</p>';
      log('Selected backup notes: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Selected backup notes: ' + data.error);
      return;
    }
    resultEl.innerHTML =
      '<p>Selected session note matching <strong>' + escapeHtml(BACKUP_NOTE_ROW_SNIPPET) + '</strong>.</p>';
    log('Selected backup notes: OK');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('click-close-note').addEventListener('click', async () => {
  log('Close note clicked');
  const resultEl = document.getElementById('click-close-note-result');
  resultEl.innerHTML = '<p>Closing...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-close-note.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickCloseNoteResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result.</p>';
      log('Close note: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Close note: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Clicked <strong>CLOSE</strong>.</p>';
    log('Close note: OK');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('click-provider-name').addEventListener('click', async () => {
  log('Click provider name');
  const resultEl = document.getElementById('click-provider-name-result');
  resultEl.innerHTML = '<p>Clicking provider name on first row...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-provider-name.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__clickProviderNameResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open the billing list page first.</p>';
      log('Click provider name: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Click provider name: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Clicked provider: <strong>' + escapeHtml(data.name || '') + '</strong></p>';
    log('Click provider name: OK');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('read-contact-labels').addEventListener('click', async () => {
  log('Read labels');
  const resultEl = document.getElementById('read-contact-labels-result');
  resultEl.innerHTML = '<p>Reading labels from contact card...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-read-contact-labels.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__readContactLabelsResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a contact card first, then click Read labels.</p>';
      log('Read labels: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Read labels: ' + data.error);
      return;
    }
    const labels = data.labels || [];
    resultEl.innerHTML = '<p><strong>Labels (' + labels.length + '):</strong></p><ul style="margin: 4px 0 0 0; padding-left: 18px;">' +
      labels.map(function (l) { return '<li>' + escapeHtml(l) + '</li>'; }).join('') + '</ul>';
    log('Read labels: ' + labels.length + ' label(s)');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('close-contact-card').addEventListener('click', async () => {
  log('Close contact card');
  const resultEl = document.getElementById('close-contact-card-result');
  resultEl.innerHTML = '<p>Closing contact card...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-close-contact-card.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__closeContactCardResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open the billing list page first.</p>';
      log('Close contact card: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Close contact card: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Clicked row cell to close the card.</p>';
    log('Close contact card: OK');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('provider-combo').addEventListener('click', async () => {
  log('Provider combo');
  const resultEl = document.getElementById('provider-combo-result');
  resultEl.innerHTML = '<p>Opening provider card, waiting for load, reading labels, closing...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({ target: { tabId: tab.id }, files: ['inject-provider-combo.js'] });
    const maxWait = 5000;
    const pollMs = 400;
    let data = null;
    for (let elapsed = 0; elapsed < maxWait; elapsed += pollMs) {
      await new Promise(function (r) { setTimeout(r, pollMs); });
      const results = await execScript({
        target: { tabId: tab.id },
        func: () => window.__providerComboResult
      });
      data = results && results[0] && results[0].result;
      if (data) break;
    }
    if (!data) {
      resultEl.innerHTML = '<p>No result yet. Try again on the billing list page.</p>';
      log('Provider combo: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Provider combo: ' + data.error);
      return;
    }
    const labels = data.labels || [];
    resultEl.innerHTML = '<p><strong>Done.</strong> Labels (' + labels.length + '):</p><ul style="margin: 4px 0 0 0; padding-left: 18px;">' +
      labels.map(function (l) { return '<li>' + escapeHtml(l) + '</li>'; }).join('') + '</ul>';
    log('Provider combo: ' + labels.length + ' label(s)');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('set-date-today').addEventListener('click', async () => {
  log('Set Date (1 month ago) clicked');
  const resultEl = document.getElementById('set-date-result');
  resultEl.innerHTML = '<p>Setting date...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    const target = new Date();
    target.setMonth(target.getMonth() - 1);
    const dateStr = String(target.getMonth() + 1).padStart(2, '0') + '/' + String(target.getDate()).padStart(2, '0') + '/' + target.getFullYear();
    await execScript({
      target: { tabId: tab.id },
      func: function (d) { window.__dateOfServiceValue = d; },
      args: [dateStr]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-set-date-of-service.js'] });
    await new Promise(function (r) { setTimeout(r, SET_DATE_INJECT_SETTLE_MS); });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__setDateOfServiceResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet editor first.</p>';
      log('Set Date: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Set Date: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Date of service set to <strong>' + escapeHtml(data.dateSet) + '</strong>.</p>';
    log('Set Date: ' + data.dateSet);
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('enter-times').addEventListener('click', async () => {
  log('Enter times clicked');
  const resultEl = document.getElementById('enter-times-result');
  resultEl.innerHTML = '<p>Entering times...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await primeEnterTimesDefaults(tab.id);
    await execScript({ target: { tabId: tab.id }, files: ['inject-enter-times.js'] });
    await new Promise(function (r) { setTimeout(r, 260); });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__enterTimesResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet editor first.</p>';
      log('Enter times: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Enter times: ' + data.error);
      return;
    }
    var wasFrom = (data.wasFrom != null ? data.wasFrom : '(empty)');
    var wasTo = (data.wasTo != null ? data.wasTo : '(empty)');
    resultEl.innerHTML = '<p>Was: ' + escapeHtml(wasFrom) + ' – ' + escapeHtml(wasTo) + '.<br>Now: <strong>02:00 PM</strong> – <strong>03:30 PM</strong>.</p>';
    log('Enter times: was ' + wasFrom + ' – ' + wasTo + ', now 02:00 PM – 03:30 PM');
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('set-timesheet-timezone').addEventListener('click', async () => {
  log('Set time zone clicked (match: Alaska)');
  const resultEl = document.getElementById('set-timesheet-timezone-result');
  resultEl.innerHTML = '<p>Selecting timezone…</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      func: () => {
        window.__timesheetTimezoneMatch = 'alaska';
      }
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-set-timesheet-timezone.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__setTimesheetTimezoneResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet with the timezone dropdown.</p>';
      log('Set time zone: no result');
      return;
    }
    if (!data.success) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error || 'Failed.') + '</p>';
      log('Set time zone: ' + (data.error || 'failed'));
      return;
    }
    resultEl.innerHTML =
      '<p>Set to <strong>' +
      escapeHtml(data.label || data.value || '') +
      '</strong> <code>' +
      escapeHtml(data.value || '') +
      '</code> (matched <em>' +
      escapeHtml(data.match || 'alaska') +
      '</em>).</p>';
    log('Set time zone: ' + (data.value || '') + ' — ' + (data.label || ''));
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('select-place-of-service').addEventListener('click', async () => {
  log('Place of service (' + PLACE_OF_SERVICE_MATCH + ') clicked');
  const resultEl = document.getElementById('select-place-of-service-result');
  resultEl.innerHTML = '<p>Selecting...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      func: function (m) { window.__placeOfServiceMatch = m; },
      args: [PLACE_OF_SERVICE_MATCH]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-place-of-service.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__selectPlaceOfServiceResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet editor first.</p>';
      log('Place of service: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Place of service: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Place of service: <strong>' + escapeHtml(data.text || data.value || data.matchedText) + '</strong>.</p>';
    log('Place of service: ' + (data.text || data.value));
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('select-service-address').addEventListener('click', async () => {
  log('Service address (' + SERVICE_ADDRESS_MATCH + ') clicked');
  const resultEl = document.getElementById('select-service-address-result');
  resultEl.innerHTML = '<p>Selecting...</p>';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }
    await execScript({
      target: { tabId: tab.id },
      func: function (m) { window.__serviceAddressMatch = m; },
      args: [SERVICE_ADDRESS_MATCH]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-service-address.js'] });
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__selectServiceAddressResult
    });
    const data = results && results[0] && results[0].result;
    if (!data) {
      resultEl.innerHTML = '<p>No result. Open a timesheet editor first.</p>';
      log('Service address: no result');
      return;
    }
    if (data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml(data.error) + '</p>';
      log('Service address: ' + data.error);
      return;
    }
    resultEl.innerHTML = '<p>Service address: <strong>' + escapeHtml(data.text || data.value || data.matchedText) + '</strong>.</p>';
    log('Service address: ' + (data.text || data.value));
  } catch (e) {
    log('Error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
  }
});

document.getElementById('edit-timesheet').addEventListener('click', async () => {
  log('Edit Timesheet clicked');
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      log('No active tab');
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      log('Cannot run on this page.');
      return;
    }
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => {
        const row = document.querySelector('tr[id^="billing-grid-row-"]');
        if (!row) return { error: 'No billing row found' };
        const id = (row.getAttribute('id') || '').replace(/^billing-grid-row-/, '');
        if (!id) return { error: 'No entry id in row' };
        window.location.hash = 'billingmanager/timesheeteditor/?&id=' + id;
        return { success: true, id: id };
      }
    });
    const data = results && results[0] && results[0].result;
    if (data && data.error) {
      log('Edit Timesheet: ' + data.error);
      return;
    }
    if (data && data.success) {
      log('Opened timesheet for entry ' + data.id);
    }
  } catch (e) {
    log('Error: ' + e.message);
    console.error('[Hidden Lights sidepanel]', e);
  }
});

let editTimesheetReadyMonitorId = null;

function setEditTimesheetReadyStatusEl(el, state, message) {
  if (!el) return;
  el.classList.remove(
    'edit-timesheet-ready-status--idle',
    'edit-timesheet-ready-status--ready',
    'edit-timesheet-ready-status--not-ready',
    'edit-timesheet-ready-status--loading'
  );
  if (state === 'ready') {
    el.classList.add('edit-timesheet-ready-status--ready');
  } else if (state === 'not-ready') {
    el.classList.add('edit-timesheet-ready-status--not-ready');
  } else if (state === 'loading') {
    el.classList.add('edit-timesheet-ready-status--loading');
  } else {
    el.classList.add('edit-timesheet-ready-status--idle');
  }
  el.textContent = message;
}

/**
 * Page probe: billing rows + Knockout list/invoice loading overlay (.overlay-loading).
 * Static HTML often looks the same; visible: binding toggles display at runtime.
 */
async function probeBillingGridRowsForEditTimesheet(tabId, injectOpts) {
  const inject = {
    target: { tabId: tabId },
    func: () => {
      function isOverlayLoadingVisible(el) {
        if (!el) return false;
        if (typeof el.checkVisibility === 'function') {
          try {
            return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
          } catch (e) {
            /* fall through */
          }
        }
        const s = window.getComputedStyle(el);
        return (
          s.display !== 'none' &&
          s.visibility !== 'hidden' &&
          parseFloat(s.opacity) > 0
        );
      }
      const overlay = document.querySelector('.overlay-loading');
      const rows = document.querySelectorAll('tr[id^="billing-grid-row-"]');
      return {
        rowCount: rows.length,
        ready: rows.length > 0,
        overlayFound: !!overlay,
        listLoading: isOverlayLoadingVisible(overlay)
      };
    }
  };
  if (injectOpts && injectOpts.world === 'MAIN') {
    inject.world = 'MAIN';
  }
  const results = await execScript(inject);
  return results && results[0] ? results[0].result : null;
}

document.getElementById('check-edit-timesheet-ready').addEventListener('click', async () => {
  const btn = document.getElementById('check-edit-timesheet-ready');
  const statusEl = document.getElementById('edit-timesheet-ready-status');

  if (editTimesheetReadyMonitorId !== null) {
    clearInterval(editTimesheetReadyMonitorId);
    editTimesheetReadyMonitorId = null;
    btn.textContent = 'Watch grid load';
    btn.classList.remove('is-monitoring');
    setEditTimesheetReadyStatusEl(statusEl, 'idle', '—');
    log('Stopped watching billing grid');
    return;
  }

  btn.textContent = 'Stop watching';
  btn.classList.add('is-monitoring');
  log('Watching billing grid (same check as Edit Timesheet)…');

  async function tick() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        setEditTimesheetReadyStatusEl(statusEl, 'not-ready', 'No active tab');
        return;
      }
      if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
        setEditTimesheetReadyStatusEl(statusEl, 'not-ready', 'Not a web page');
        return;
      }
      const data = await probeBillingGridRowsForEditTimesheet(tab.id);
      if (!data) {
        setEditTimesheetReadyStatusEl(statusEl, 'not-ready', 'Could not read page');
        return;
      }
      if (data.listLoading) {
        setEditTimesheetReadyStatusEl(
          statusEl,
          'loading',
          'Loading — .overlay-loading is visible (list or invoice creator spinner). Wait…'
        );
        return;
      }
      if (data.ready) {
        const n = data.rowCount;
        const label = n === 1 ? '1 row' : n + ' rows';
        const suffix = data.overlayFound ? '' : ' (no .overlay-loading on page)';
        setEditTimesheetReadyStatusEl(
          statusEl,
          'ready',
          'Ready — billing grid loaded (' + label + '). Edit Timesheet will work.' + suffix
        );
      } else {
        const hint = data.overlayFound
          ? 'Spinner off, but no billing rows yet.'
          : 'No billing rows; .overlay-loading not found (wrong page?).';
        setEditTimesheetReadyStatusEl(
          statusEl,
          'not-ready',
          'Not ready — ' + hint + ' Edit Timesheet not ready.'
        );
      }
    } catch (e) {
      setEditTimesheetReadyStatusEl(statusEl, 'not-ready', 'Error: ' + (e.message || String(e)));
    }
  }

  await tick();
  editTimesheetReadyMonitorId = setInterval(tick, 1000);
});

function parseBillingManagerListHash(tabUrl) {
  try {
    const u = new URL(tabUrl);
    const host = (u.hostname || '').toLowerCase();
    if (!host.includes('centralreach.com')) {
      return { error: 'Open a CentralReach members tab (billing list).' };
    }
    let h = u.hash || '';
    if (h.startsWith('#')) h = h.slice(1);
    if (!h.includes('billingmanager/billing')) {
      return { error: 'Hash must include billingmanager/billing (billing list).' };
    }
    const q = h.indexOf('?');
    const path = q >= 0 ? h.slice(0, q) : h;
    const search = q >= 0 ? h.slice(q + 1) : '';
    return { path: path, params: new URLSearchParams(search) };
  } catch (e) {
    return { error: e.message || String(e) };
  }
}

function buildBillingListHash(path, params) {
  return '#' + path + '?' + params.toString();
}

async function navigateBillingListHash(tabId, fullHash) {
  await execScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: (h) => {
      window.location.hash = h;
    },
    args: [fullHash]
  });
}

/**
 * Billing filters: MUI primary “Apply” after hash/query changes.
 */
async function clickBillingApplyButton(tabId) {
  const results = await execScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: () => {
      function btnVisible(btn) {
        if (!btn || btn.disabled) return false;
        if (typeof btn.checkVisibility === 'function') {
          try {
            return btn.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
          } catch (e) {
            /* fall through */
          }
        }
        const s = window.getComputedStyle(btn);
        return (
          s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0
        );
      }
      const labels = document.querySelectorAll('.MuiButton-label');
      for (let i = 0; i < labels.length; i++) {
        const span = labels[i];
        if ((span.textContent || '').trim() !== 'Apply') continue;
        const btn = span.closest('button');
        if (btn && btnVisible(btn)) {
          btn.click();
          return { ok: true, via: 'mui-label-exact' };
        }
      }
      const buttons = document.querySelectorAll('button.MuiButton-root');
      for (let j = 0; j < buttons.length; j++) {
        const b = buttons[j];
        const t = (b.textContent || '').replace(/\s+/g, ' ').trim();
        if (!/\bApply\b/.test(t)) continue;
        if (btnVisible(b)) {
          b.click();
          return { ok: true, via: 'mui-button-text' };
        }
      }
      return { ok: false, reason: 'apply-not-found' };
    }
  });
  const r = results && results[0] && results[0].result;
  if (!r) return { ok: false, reason: 'no-result' };
  return r;
}

/**
 * Same “loading?” signal as Watch grid load: probe until listLoading is false (overlay gone).
 * Used after each Next click while walking.
 */
async function waitForBillingGridWatchSettled(tabId, injectOpts) {
  const deadline = Date.now() + BILLING_PAGE_WALK_LOAD_TIMEOUT_MS;
  let last = null;
  while (Date.now() < deadline) {
    last = await probeBillingGridRowsForEditTimesheet(tabId, injectOpts);
    if (last && !last.listLoading) return { ok: true, data: last };
    await new Promise((r) => setTimeout(r, BILLING_PAGE_WALK_POLL_MS));
  }
  return { ok: false, data: last };
}

/**
 * After 500 mode + Apply: wait until the grid is done loading — overlay off and either at least
 * one row, or overlay off for several polls with 0 rows (truly empty list).
 */
async function waitForBillingGridReadyAfterApply(tabId, injectOpts) {
  const deadline = Date.now() + BILLING_PAGE_WALK_LOAD_TIMEOUT_MS;
  let last = null;
  let stableIdleZeroRows = 0;
  const stableEmptyPolls = 4;
  while (Date.now() < deadline) {
    last = await probeBillingGridRowsForEditTimesheet(tabId, injectOpts);
    if (!last) {
      await new Promise((r) => setTimeout(r, BILLING_PAGE_WALK_POLL_MS));
      continue;
    }
    if (last.listLoading) {
      stableIdleZeroRows = 0;
      await new Promise((r) => setTimeout(r, BILLING_PAGE_WALK_POLL_MS));
      continue;
    }
    if (last.rowCount > 0) {
      return { ok: true, data: last };
    }
    stableIdleZeroRows++;
    if (stableIdleZeroRows >= stableEmptyPolls) {
      return { ok: true, data: last };
    }
    await new Promise((r) => setTimeout(r, BILLING_PAGE_WALK_POLL_MS));
  }
  return { ok: false, data: last };
}

/** Read ?page= from location.hash inside the tab (page MAIN world). Hidden Lights does not write this. */
async function readBillingHashPageFromPage(tabId) {
  const results = await execScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: () => {
      const h = (window.location.hash || '').replace(/^#/, '');
      const qi = h.indexOf('?');
      if (qi < 0) return { page: null };
      return { page: new URLSearchParams(h.slice(qi + 1)).get('page') };
    }
  });
  return results && results[0] ? results[0].result : { page: null };
}

async function billingListHasNextPage(tabId, injectOpts) {
  const inject = {
    target: { tabId: tabId },
    func: () => {
      function isVisible(el) {
        if (!el) return false;
        if (typeof el.checkVisibility === 'function') {
          try {
            return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
          } catch (e) {
            /* fall through */
          }
        }
        const s = window.getComputedStyle(el);
        return (
          s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0
        );
      }
      const anchors = document.querySelectorAll('a[data-click="pageUp"]');
      for (let i = 0; i < anchors.length; i++) {
        if (isVisible(anchors[i])) return true;
      }
      return false;
    }
  };
  if (injectOpts && injectOpts.world === 'MAIN') {
    inject.world = 'MAIN';
  }
  const results = await execScript(inject);
  return !!(results && results[0] && results[0].result);
}

async function clickBillingListNextPage(tabId) {
  const results = await execScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: (gentleMs) => {
      return new Promise(function (resolve) {
        function isVisible(el) {
          if (!el) return false;
          if (typeof el.checkVisibility === 'function') {
            try {
              return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
            } catch (e) {
              /* fall through */
            }
          }
          const s = window.getComputedStyle(el);
          return (
            s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0
          );
        }
        function runClick() {
          try {
            /**
             * One real user click only runs the <a>’s data-click / delegated handler once.
             * Calling vm.pageUp() via ko.contextFor can hit the wrong $parent and appear to
             * advance many pages (e.g. 12) in one “click”. So: never call pageUp() directly;
             * only fire a single synthetic click on the visible Next anchor.
             */
            const anchors = document.querySelectorAll('a[data-click="pageUp"]');
            let el = null;
            for (let i = 0; i < anchors.length; i++) {
              if (isVisible(anchors[i])) {
                el = anchors[i];
                break;
              }
            }
            if (!el) {
              resolve(
                anchors.length ? { ok: false, reason: 'next-not-visible' } : { ok: false, reason: 'no-next-control' }
              );
              return;
            }
            const had = el.hasAttribute('href');
            const prev = had ? el.getAttribute('href') : null;
            if (had) el.removeAttribute('href');
            try {
              el.dispatchEvent(
                new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
              );
            } finally {
              if (had) {
                setTimeout(function () {
                  try {
                    el.setAttribute('href', prev);
                  } catch (e) {
                    /* ignore */
                  }
                }, 1200);
              }
            }
            resolve({ ok: true, via: 'single-anchor-click-gentle' });
          } catch (e) {
            resolve({ ok: false, reason: e && e.message ? e.message : String(e) });
          }
        }
        const ms = typeof gentleMs === 'number' ? gentleMs : 50;
        if (ms > 0) {
          setTimeout(runClick, ms);
        } else {
          runClick();
        }
      });
    },
    args: [BILLING_NEXT_GENTLE_MS]
  });
  const r = results && results[0] && results[0].result;
  if (!r) return { ok: false, reason: 'no-result' };
  return r;
}

/**
 * Billing list: set hash to pageSize=500, remove page=, click MUI Apply when visible, wait for grid to settle.
 */
async function runBillingList500HashAndApply(tabId, tabUrl, injectOpts) {
  const parsed = parseBillingManagerListHash(tabUrl);
  if (parsed.error) {
    return { ok: false, error: parsed.error };
  }
  const path = parsed.path;
  const params = new URLSearchParams(parsed.params.toString());
  params.set('pageSize', '500');
  params.delete('page');
  await navigateBillingListHash(tabId, buildBillingListHash(path, params));
  await new Promise((r) => setTimeout(r, BILLING_HASH_BEFORE_APPLY_MS));

  let applyRes = await clickBillingApplyButton(tabId);
  if (!applyRes.ok) {
    await new Promise((r) => setTimeout(r, 600));
    applyRes = await clickBillingApplyButton(tabId);
  }
  if (!applyRes.ok) {
    return {
      ok: false,
      error:
        'Could not click Apply (' +
        (applyRes.reason || '?') +
        '). Open billing filters so Apply is visible.',
      applyRes
    };
  }

  const settled = await waitForBillingGridReadyAfterApply(tabId, injectOpts);
  const snap = settled.data;
  const hp = await readBillingHashPageFromPage(tabId);
  return { ok: true, applyRes, settled, snap, hp };
}

let walkBillingPagesRunning = false;
let walkBillingPagesAbortRequested = false;

document.getElementById('walk-billing-pages').addEventListener('click', async () => {
  const btn = document.getElementById('walk-billing-pages');
  const resultEl = document.getElementById('walk-billing-pages-result');

  if (walkBillingPagesRunning) {
    walkBillingPagesAbortRequested = true;
    resultEl.textContent = (resultEl.textContent || '') + '\nStop requested — will stop after current page…';
    log('Walk billing pages: stop requested');
    return;
  }

  walkBillingPagesRunning = true;
  walkBillingPagesAbortRequested = false;
  btn.textContent = 'Stop walk';

  const lines = [];
  const pushLine = (s) => {
    lines.push(s);
    resultEl.textContent = lines.join('\n');
    log(s);
  };

  try {
    resultEl.textContent = '';
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      pushLine('No active tab.');
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      pushLine('Cannot run on this page.');
      return;
    }

    const walkInject = { world: 'MAIN' };

    pushLine(
      'Walk: (1) 500 mode — hash pageSize=500, drop page=, click Apply. ' +
        '(2) Wait until the grid finishes loading. ' +
        '(3) Then Next only, ' +
        BILLING_NEXT_GAP_MS / 1000 +
        's between Next clicks after each page settles.'
    );

    let walkExitedEarly = false;
    pushLine('Step 1/3 — 500 mode: updating hash and clicking Apply…');
    const prep = await runBillingList500HashAndApply(tab.id, tab.url, walkInject);
    if (!prep.ok) {
      pushLine(prep.error);
      walkExitedEarly = true;
    } else {
      pushLine('Hash updated (pageSize=500, page param removed). Apply: ' + (prep.applyRes.via || '?') + '.');
      pushLine('Step 2/3 — waiting for grid to finish loading after Apply…');
      if (!prep.settled.ok) {
        pushLine(
          'Grid still loading or empty after timeout — stopping walk (fix filters or try again).'
        );
        walkExitedEarly = true;
      } else {
        pushLine('Grid ready (spinner off' + (prep.snap && prep.snap.rowCount > 0 ? '; rows present' : '; list empty') + ').');
      }
      let snap = prep.snap;
      let rows = snap ? snap.rowCount : 0;
      let hp = prep.hp;
      if (!walkExitedEarly) {
        pushLine(
          'Step 3/3 — walking: hash page=' +
            (hp.page != null && hp.page !== '' ? hp.page : '(none)') +
            ', ' +
            rows +
            ' row(s).'
        );
        if (rows === 0) {
          pushLine('Done — 0 rows (nothing to walk).');
          walkExitedEarly = true;
        }
      }
      if (!walkExitedEarly) {
        let settled = prep.settled;
        let nextClicks = 0;
        let isFirstNext = true;
        let hitNextLimit = false;
        while (nextClicks < BILLING_PAGE_WALK_MAX_PAGES) {
          if (walkBillingPagesAbortRequested) {
            pushLine('Stopped by user.');
            walkExitedEarly = true;
            break;
          }
          const hasNext = await billingListHasNextPage(tab.id, walkInject);
          if (!hasNext) {
            pushLine('Done — no Next. Next clicks used: ' + nextClicks + '.');
            walkExitedEarly = true;
            break;
          }
          if (!isFirstNext) {
            pushLine('Waiting ' + BILLING_NEXT_GAP_MS / 1000 + 's before Next (grid already settled)…');
            await new Promise((r) => setTimeout(r, BILLING_NEXT_GAP_MS));
          }
          isFirstNext = false;
          if (walkBillingPagesAbortRequested) {
            walkExitedEarly = true;
            break;
          }
          const clickRes = await clickBillingListNextPage(tab.id);
          if (!clickRes.ok) {
            pushLine('Next failed (' + (clickRes.reason || '?') + '). Stopping.');
            walkExitedEarly = true;
            break;
          }
          pushLine('Clicked Next (' + (clickRes.via || '?') + '). Waiting for grid…');
          settled = await waitForBillingGridWatchSettled(tab.id, walkInject);
          if (!settled.ok) {
            pushLine('Warning: grid timed out after Next.');
          }
          snap = await probeBillingGridRowsForEditTimesheet(tab.id, walkInject);
          rows = snap ? snap.rowCount : 0;
          hp = await readBillingHashPageFromPage(tab.id);
          pushLine(
            'After Next — hash page=' +
              (hp.page != null && hp.page !== '' ? hp.page : '(none)') +
              ', ' +
              rows +
              ' row(s).'
          );
          if (rows === 0) {
            pushLine('Done — 0 rows.');
            walkExitedEarly = true;
            break;
          }
          nextClicks++;
        }
        if (!walkExitedEarly && nextClicks >= BILLING_PAGE_WALK_MAX_PAGES) {
          hitNextLimit = true;
        }
        if (hitNextLimit) {
          pushLine('Stopped — Next safety limit (' + BILLING_PAGE_WALK_MAX_PAGES + ').');
        }
      }
    }
  } catch (e) {
    pushLine('Error: ' + (e.message || String(e)));
  } finally {
    walkBillingPagesRunning = false;
    walkBillingPagesAbortRequested = false;
    btn.textContent = 'Walk all billing pages';
  }
});

document.getElementById('billing-500-mode').addEventListener('click', async () => {
  const resultEl = document.getElementById('billing-500-mode-result');
  const lines = [];
  const pushLine = (s) => {
    lines.push(s);
    resultEl.textContent = lines.join('\n');
    log(s);
  };
  const injectOpts = { world: 'MAIN' };

  try {
    resultEl.textContent = '';
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      pushLine('No active tab.');
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      pushLine('Cannot run on this page.');
      return;
    }

    pushLine('Setting billing hash to pageSize=500 (removing page=)…');
    const prep = await runBillingList500HashAndApply(tab.id, tab.url, injectOpts);
    if (!prep.ok) {
      pushLine(prep.error);
      return;
    }
    pushLine('Clicked Apply (' + (prep.applyRes.via || '?') + ').');
    pushLine('Grid settled: ' + (prep.settled.ok ? 'yes' : 'timed out (list may still be loading).'));
    const rows = prep.snap ? prep.snap.rowCount : 0;
    const hp = prep.hp;
    pushLine(
      'Hash page param: ' +
        (hp.page != null && hp.page !== '' ? hp.page : '(none)') +
        ', ' +
        rows +
        ' row(s) visible.'
    );
    pushLine('Done — 500 mode.');
  } catch (e) {
    pushLine('Error: ' + (e.message || String(e)));
  }
});

/**
 * After entering times on a new service line, reapply the IANA timezone value captured from line 1.
 * Soft-fail: logs only; does not abort the overlap fix.
 */
async function applyCapturedTimesheetTimezone(tabId, contextLabel) {
  const recTz = overlapFixRecordGet(tabId);
  if (!recTz || !recTz.timeZoneValue) return;
  const v = String(recTz.timeZoneValue).trim();
  if (!v) return;
  const label = contextLabel || 'Timezone';
  try {
    await execScript({
      target: { tabId: tabId },
      func: (value) => {
        window.__timesheetTimezoneValue = value;
      },
      args: [v]
    });
    await execScript({ target: { tabId: tabId }, files: ['inject-set-timesheet-timezone.js'] });
    const results = await execScript({
      target: { tabId: tabId },
      func: () => window.__setTimesheetTimezoneResult
    });
    const data = results && results[0] && results[0].result;
    if (data && data.success) {
      log(label + ': reapplied ' + (data.value || v));
      // Give CR a beat to finish any form refresh before the post-TZ time assert.
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS + 150));
    } else {
      log(label + ': reapply soft-failed — ' + ((data && data.error) || 'no result'));
    }
  } catch (e) {
    log(label + ': reapply soft-failed — ' + (e.message || String(e)));
  }
}

/** Set fail reason in red under the detail for this overlap item. Pass '' to clear. */
function setOverlapFixFailReason(btn, message) {
  if (btn && btn.getAttribute && btn.getAttribute('data-run-all-virtual') === '1') {
    btn.setAttribute('data-run-all-fail', message || '');
    return;
  }
  const item = btn && btn.closest('.overlap-list__item');
  if (!item) return;
  const el = item.querySelector('.overlap-list__fail-reason');
  if (!el) return;
  el.classList.remove('overlap-list__fail-reason--progress');
  el.textContent = '';
  if (message) {
    el.appendChild(document.createTextNode(message));
  }
}

/** Visible HTML for #overlap-fix-result when the note attach step fails (non-empty so result panel shows). */
function overlapFixNoteFailureHtml(detailMsg) {
  const detail = detailMsg ? String(detailMsg) : 'Could not attach a matching session note.';
  return (
    '<div class="overlap-fix-result--fail">' +
    '<p><strong>Note step failed</strong></p>' +
    '<p class="overlap-fix-result--fail-detail">' +
    escapeHtml(detail) +
    '</p>' +
    '</div>'
  );
}

/** Set overlap Fix button state: 'loading' | 'success' | 'error'. Idle = no class. */
function setOverlapFixButtonState(btn, state) {
  if (!btn || !btn.classList) return;
  if (btn.getAttribute && btn.getAttribute('data-run-all-virtual') === '1') {
    btn.setAttribute('data-run-all-outcome', state);
    return;
  }
  btn.classList.remove('is-loading', 'is-success', 'is-error');
  if (state === 'loading') {
    btn.classList.add('is-loading');
    btn.disabled = true;
    btn.title = 'Running…';
  } else if (state === 'success') {
    btn.classList.add('is-success');
    btn.disabled = true;
    btn.title = 'Done';
  } else if (state === 'error') {
    btn.classList.add('is-error');
    btn.disabled = false;
    btn.title = 'Failed – click to try again';
  }
}

function parseMulti97155FixPlanFromButton(btn) {
  const raw = btn.getAttribute('data-fix-plan');
  if (!raw) return null;
  try {
    const plan = JSON.parse(raw);
    return plan && plan.ok ? plan : null;
  } catch (e) {
    return null;
  }
}

/**
 * Add one service line when tab count is below expectedCount.
 * @returns {Promise<{ ok: true, count: number } | { ok: false, message: string }>}
 */
async function addServiceLineUntilCount(tabId, expectedCount, logPrefix) {
  let tabCountRes = await fetchServiceLineTabCount(tabId);
  let count = tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
  if (count >= expectedCount) {
    return { ok: true, count: count };
  }
  await execScript({ target: { tabId: tabId }, files: ['inject-service-line-tab-count.js'] });
  await new Promise((r) => setTimeout(r, 150));
  await execScript({
    target: { tabId: tabId },
    func: (maxBefore) => {
      window.__addServiceLineMaxBefore = maxBefore;
    },
    args: [expectedCount - 1]
  });
  await execScript({ target: { tabId: tabId }, files: ['inject-add-service-line.js'] });
  await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
  await new Promise((r) => setTimeout(r, 550));
  const results = await execScript({
    target: { tabId: tabId },
    func: () => window.__addServiceLineResult
  });
  const data = results && results[0] && results[0].result;
  if (!data) {
    return { ok: false, message: 'Add service line: no result.' };
  }
  if (data.error) {
    return { ok: false, message: data.error };
  }
  tabCountRes = await fetchServiceLineTabCount(tabId);
  count = tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
  if (count !== expectedCount) {
    return {
      ok: false,
      message:
        'After adding a line, expected ' +
        expectedCount +
        ' service lines, got ' +
        count +
        '. Before/after: ' +
        (data.countBefore != null ? data.countBefore : '?') +
        ' → ' +
        (data.countAfter != null ? data.countAfter : '?') +
        '.'
    };
  }
  log((logPrefix || '97155 multi') + ': service line count ' + count);
  return { ok: true, count: count };
}

/**
 * Configure date, code, POS, address, and verified times on one service line (97155 fix).
 * @returns {Promise<{ ok: true } | { ok: false, message: string }>}
 */
async function configureOverlapServiceLine97155(tabId, lineIndex, seg, resultEl, logPrefix, opts) {
  const options = opts || {};
  const lineNum = lineIndex + 1;
  const isNonBillable = seg.type === 'nonbillable';
  const lineLabel =
    options.lineLabel ||
    'Line ' + lineNum + (isNonBillable ? ' (nonbillable)' : ' (billable)');
  const stepLabel =
    options.stepLabel || lineLabel + ' ' + seg.from + ' – ' + seg.to;
  const pollMaxMs =
    options.pollMaxMs != null ? options.pollMaxMs : ENTER_TIMES_RESULT_POLL_MAX_MS;

  const tabPick = await ensureServiceLineTabActive(tabId, lineIndex);
  if (!tabPick.ok) {
    return { ok: false, message: tabPick.error || 'Could not select ' + lineLabel + '.' };
  }

  if (seg.action === 'add') {
    resultEl.innerHTML = '<p>Setting date on ' + escapeHtml(lineLabel) + '…</p>';
    await execScript({
      target: { tabId: tabId },
      func: (d) => {
        window.__setDateOfServiceResult = null;
        window.__dateOfServiceValue = d;
      },
      args: [overlapFixRecordGet(tabId).dateOfService]
    });
    await execScript({ target: { tabId: tabId }, files: ['inject-set-date-of-service.js'] });
    await pollForInjectResult(tabId, '__setDateOfServiceResult', SET_DATE_INJECT_SETTLE_MS, 200);
  }

  resultEl.innerHTML =
    '<p>Waiting for service codes (' + escapeHtml(lineLabel) + ')…</p>';
  const codesReady = await overlapUiPollTry({
    tryOnce: () => probeServiceCodesLinkReady(tabId),
    resultEl,
    waitingHtml: 'Waiting for <strong>Service Codes</strong> link (' + lineLabel + ')…'
  });
  if (!codesReady) {
    return {
      ok: false,
      message:
        'Service Codes link did not appear within ' +
        Math.round(OVERLAP_FIX_UI_POLL_MAX_MS / 1000) +
        's on ' +
        lineLabel +
        '.'
    };
  }

  if (isNonBillable) {
    resultEl.innerHTML = '<p>Selecting nonbillable code on ' + escapeHtml(lineLabel) + '…</p>';
    await execScript({ target: { tabId: tabId }, files: ['inject-select-service-codes.js'] });
    await new Promise((r) => setTimeout(r, 900));
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    const codeRes = await execScript({
      target: { tabId: tabId },
      func: () => window.__selectServiceCodesResult
    });
    const codeData = codeRes && codeRes[0] && codeRes[0].result;
    if (codeData && codeData.error) {
      return { ok: false, message: 'Nonbillable code: ' + codeData.error };
    }
  } else if (seg.action === 'add') {
    const billableReady = await overlapUiPollTry({
      tryOnce: () => probeBillable97153Ready(tabId),
      resultEl,
      waitingHtml: 'Waiting for <strong>97153</strong> billable list (' + lineLabel + ')…'
    });
    if (billableReady) {
      resultEl.innerHTML = '<p>Clicking billable 97153 on ' + escapeHtml(lineLabel) + '…</p>';
      await execScript({
        target: { tabId: tabId },
        files: ['inject-click-billable-97153-no-nonbillable.js']
      });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    } else {
      log(logPrefix + ': billable 97153 list not found on ' + lineLabel + ', continuing');
    }
  }

  const placeMatch = (overlapFixRecordGet(tabId).placeOfService || '').trim() || PLACE_OF_SERVICE_MATCH;
  await execScript({
    target: { tabId: tabId },
    func: (m) => {
      window.__placeOfServiceMatch = m;
    },
    args: [placeMatch]
  });
  await execScript({ target: { tabId: tabId }, files: ['inject-select-place-of-service.js'] });
  await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

  const addressMatch =
    (overlapFixRecordGet(tabId).serviceAddressText || overlapFixRecordGet(tabId).serviceAddress || '').trim() ||
    SERVICE_ADDRESS_MATCH;
  await execScript({
    target: { tabId: tabId },
    func: (m) => {
      window.__serviceAddressMatch = m;
    },
    args: [addressMatch]
  });
  await execScript({ target: { tabId: tabId }, files: ['inject-select-service-address.js'] });
  await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

  const timesResult = await enterAndVerifyTimesOnLine(
    tabId,
    lineIndex,
    seg.from,
    seg.to,
    resultEl,
    logPrefix,
    {
      lineLabel: lineLabel,
      stepLabel: stepLabel,
      pollMaxMs: pollMaxMs,
      manageFocus: false
    }
  );
  if (!timesResult.ok) {
    return { ok: false, message: timesResult.message || stepLabel + ' failed.' };
  }

  await applyCapturedTimesheetTimezone(tabId, logPrefix + ' line ' + lineNum);
  const afterTz = await assertTimesOnLine(tabId, lineIndex, seg.from, seg.to, logPrefix, {
    lineLabel: lineLabel,
    manageFocus: false
  });
  if (!afterTz.ok) {
    return { ok: false, message: afterTz.message };
  }

  return { ok: true };
}

/** Read back every segment in the plan (one pass; used once before note/signatures). */
async function assertAllPlanSegments(tabId, plan, throughIndex, logPrefix) {
  for (let i = 0; i <= throughIndex && i < plan.segments.length; i++) {
    const seg = plan.segments[i];
    const check = await assertTimesOnLine(tabId, seg.lineIndex, seg.from, seg.to, logPrefix, {
      lineLabel: 'Line ' + (seg.lineIndex + 1),
      manageFocus: false
    });
    if (!check.ok) {
      return check;
    }
  }
  return { ok: true };
}

/**
 * Multi 97155 overlap fix — data-fix-mode="97155-multi".
 * Line 1 billable trim, then add/configure each remaining segment with verify gates.
 */
async function runOverlapFix97155Multi(btn, fixOpts) {
  const fo = fixOpts || {};
  const plan = parseMulti97155FixPlanFromButton(btn);
  const entryId = btn.getAttribute('data-entry-id');
  const resultEl = fo.resultEl || document.getElementById('overlap-fix-result');
  const progressTabId = fo.progressTabId != null ? fo.progressTabId : null;
  const logPrefix = '97155 multi fix';

  async function progMulti(message, phase) {
    if (progressTabId != null) {
      await writeConcurrenceFixProgress(progressTabId, message, phase || 'run', null);
    }
  }

  if (!plan || !plan.segments || !plan.segments.length) {
    const msg = 'Invalid multi fix plan on this button. Run Overlaps again.';
    setOverlapFixButtonState(btn, 'error');
    setOverlapFixFailReason(btn, msg);
    return;
  }

  setOverlapFixButtonState(btn, 'loading');
  setOverlapFixFailReason(btn, '');
  resultEl.innerHTML = '<p>Starting multi-concurrent 97155 fix…</p>';
  await progMulti('Multi 97155 fix started', 'start');
  log(logPrefix + ': entry ' + entryId + ', ' + plan.lineCount + ' lines, ' + plan.concurrent97155Count + '×97155');

  try {
    let tab;
    if (fo.targetTabId != null) {
      tab = { id: fo.targetTabId };
    } else {
      const [t] = await chrome.tabs.query({ active: true, currentWindow: true });
      tab = t;
    }
    if (!tab?.id) {
      const msg = 'No active tab.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }

    if (!fo.skipTimesheetNavigate97155) {
      resultEl.innerHTML = '<p>Opening timesheet...</p>';
      await progMulti('Opening timesheet…', 'navigate');
      await execScript({
        target: { tabId: tab.id },
        func: (id) => {
          window.location.hash = 'billingmanager/timesheeteditor/?&id=' + id;
          return { success: true };
        },
        args: [entryId]
      });
      await new Promise((r) => setTimeout(r, 500));
      await waitForTimesheetEditorReady(tab.id, entryId);
    } else {
      await waitForTimesheetEditorReady(tab.id, entryId);
    }

    const seg0 = plan.segments[0];
    const part1Result = await enterAndVerifyPart1Times(tab.id, seg0.from, seg0.to, resultEl, logPrefix);
    if (!part1Result.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, part1Result.message);
      return;
    }
    await progMulti('Line 1 verified', 'part1');

    resultEl.innerHTML = '<p>Recording from first timesheet...</p>';
    const snap = await captureOverlapFixTimesheetSnapshot(tab.id, progMulti);
    if (!snap.ok) {
      const msg = snap.error || 'Could not read timesheet.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    for (let si = 1; si < plan.segments.length; si++) {
      const seg = plan.segments[si];
      const expectedCount = seg.lineIndex + 1;
      resultEl.innerHTML =
        '<p>Adding line ' + expectedCount + ' (' + (seg.type === 'nonbillable' ? 'nonbillable' : 'billable') + ')…</p>';
      const addRes = await addServiceLineUntilCount(tab.id, expectedCount, logPrefix);
      if (!addRes.ok) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, addRes.message);
        return;
      }

      const releaseFocus = await focusTargetTabForTimesheetUi(tab.id);
      let lineOk;
      try {
        lineOk = await configureOverlapServiceLine97155(
          tab.id,
          seg.lineIndex,
          seg,
          resultEl,
          logPrefix,
          {
            pollMaxMs: si === plan.segments.length - 1 ? ENTER_TIMES_PART3_POLL_MAX_MS : undefined
          }
        );
      } finally {
        releaseFocus();
      }
      if (!lineOk.ok) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, lineOk.message);
        return;
      }

      await progMulti('Line ' + expectedCount + ' configured', 'line' + expectedCount);
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    }

    resultEl.innerHTML = '<p>Verifying all service lines…</p>';
    await progMulti('Verifying all lines…', 'verify-all');
    const finalGate = await assertAllPlanSegments(
      tab.id,
      plan,
      plan.segments.length - 1,
      logPrefix
    );
    if (!finalGate.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, finalGate.message);
      return;
    }

    resultEl.innerHTML = '<p>Attaching note on last billable line…</p>';
    await ensureServiceLineTabActive(tab.id, plan.lastBillableIndex);
    const notePick = await tryOverlapFixPickNoteBackupThenPrimary(tab.id, resultEl, logPrefix);
    if (!notePick.ok) {
      resultEl.innerHTML = overlapFixNoteFailureHtml(notePick.msg);
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, notePick.msg);
      return;
    }

    resultEl.innerHTML = '<p>Closing note panel...</p>';
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_NOTE_STEP_MS));
    await execScript({ target: { tabId: tab.id }, files: ['inject-click-close-note.js'] });
    await new Promise((r) => setTimeout(r, 300));
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_NOTE_STEP_MS));

    const clientOk = await runSignatureSequence(tab, 'client', resultEl, true);
    if (!clientOk) {
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, 'Timesheet built OK but client signature failed.');
      return;
    }
    await new Promise((r) => setTimeout(r, 2000));
    const providerOk = await runSignatureSequence(tab, 'provider', resultEl, false);
    if (!providerOk) {
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, 'Timesheet built OK but provider signature failed.');
      return;
    }

    const doneHtml =
      '<p><strong>Done.</strong> Multi-concurrent fix — ' +
      plan.concurrent97155Count +
      '×97155 → ' +
      plan.lineCount +
      ' service lines.</p>' +
      '<p class="section-hint">' +
      escapeHtml(formatMulti97155SegmentPreview(plan)) +
      '</p>';
    const okDone = await completeOverlapFixWithIngest(
      btn,
      '97155',
      'multi-line',
      fo,
      resultEl,
      doneHtml,
      logPrefix + ': complete'
    );
    if (!okDone) return;
  } catch (err) {
    const msg = err.message || String(err);
    resultEl.innerHTML = '';
    log(logPrefix + ' error: ' + msg);
    setOverlapFixButtonState(btn, 'error');
    setOverlapFixFailReason(btn, msg);
  }
}

/**
 * 97155 overlap fix — triggered from Fix buttons with data-fix-mode="97155".
 *
 * Same overall shape as the Speech fix (LINE 1, snapshot, LINE 2, optional LINE 3) but:
 *  - No provider labels / payor inference (skip entirely).
 *  - LINE 2 (nonbillable): uses inject-click-nonbillable-97153.js + place of service + service address.
 *  - LINE 3 (middle only): uses inject-click-billable-97153-no-nonbillable.js + POS + address + note. No payor, no visit location.
 */
async function runOverlapFix97155(btn, fixOpts) {
  const fo = fixOpts || {};
  const entryId = btn.getAttribute('data-entry-id');
  const timeFrom = btn.getAttribute('data-time-from');
  const timeTo = btn.getAttribute('data-time-to');
  const overlapText = btn.getAttribute('data-overlap') || '';
  const overlapFrom = btn.getAttribute('data-overlap-from') || '';
  const overlapTo = btn.getAttribute('data-overlap-to') || '';
  const overlapType = btn.getAttribute('data-overlap-type') || 'middle';
  const resultEl = fo.resultEl || document.getElementById('overlap-fix-result');
  const progressTabId = fo.progressTabId != null ? fo.progressTabId : null;
  async function prog97155(message, phase) {
    if (progressTabId != null) {
      await writeConcurrenceFixProgress(progressTabId, message, phase || 'run', null);
    }
  }
  setOverlapFixButtonState(btn, 'loading');
  setOverlapFixFailReason(btn, '');
  resultEl.innerHTML = '<p>Starting 97155 overlap fix...</p>';
  await prog97155('97155 fix started', 'start');
  log('97155 fix: entry ' + entryId + ', type ' + overlapType + ', Part1 ' + timeFrom + ' – ' + timeTo + ' (overlap: ' + overlapText + ')');
  try {
    let results;
    let data;

    let tab;
    if (fo.targetTabId != null) {
      tab = { id: fo.targetTabId };
    } else {
      const [t] = await chrome.tabs.query({ active: true, currentWindow: true });
      tab = t;
    }
    if (!tab?.id) {
      const msg = 'No active tab.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }
    if (
      fo.targetTabId == null &&
      tab.url &&
      (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))
    ) {
      const msg = 'Cannot run on this page.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }

    /* -------------------------------------------------------------------------
     * PREAMBLE — Navigate to the timesheet editor (no labels/payor needed).
     * ------------------------------------------------------------------------- */
    if (!fo.skipTimesheetNavigate97155) {
      resultEl.innerHTML = '<p>Opening timesheet...</p>';
      await prog97155('Opening timesheet…', 'navigate');
      await execScript({
        target: { tabId: tab.id },
        func: (id) => {
          window.location.hash = 'billingmanager/timesheeteditor/?&id=' + id;
          return { success: true };
        },
        args: [entryId]
      });
      await new Promise((r) => setTimeout(r, 500));
      await waitForTimesheetEditorReady(tab.id, entryId);
    } else {
      resultEl.innerHTML = '<p>Waiting for timesheet editor…</p>';
      await prog97155('Waiting for timesheet editor…', 'navigate');
      await waitForTimesheetEditorReady(tab.id, entryId);
    }

    /* -------------------------------------------------------------------------
     * LINE 1 — First service line (trimmed 97153)
     * Same logic as Speech: shrink the original line so it no longer covers the overlap.
     * ------------------------------------------------------------------------- */
    const part1Result = await enterAndVerifyPart1Times(tab.id, timeFrom, timeTo, resultEl, '97155 fix');
    if (!part1Result.ok) {
      resultEl.innerHTML = '';
      log('97155 fix: Part 1 failed – ' + part1Result.message);
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, part1Result.message);
      return;
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    await prog97155('Part 1 verified', 'part1');

    /* Snapshot line 1 — provider / POS / address / date to reuse on lines 2 & 3. */
    resultEl.innerHTML = '<p>Recording from first timesheet...</p>';
    var snap97155 = await captureOverlapFixTimesheetSnapshot(tab.id, prog97155);
    if (!snap97155.ok) {
      const msg = snap97155.error || 'Could not read timesheet.';
      resultEl.innerHTML = '';
      log('97155 fix: read timesheet failed');
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }
    const snapL = overlapFixRecordGet(tab.id);
    log('97155 fix: recorded provider, place, address, date' + (snapL && snapL.timeZoneValue ? ', tz ' + snapL.timeZoneValue : ''));
    await prog97155('Snapshot recorded', 'snapshot');
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    resultEl.innerHTML = '<p>Verifying line 1 times before line 2…</p>';
    await prog97155('Verifying line 1 times before line 2…', 'part1');
    const part1Gate97155 = await assertPart1TimesBeforeLine2(tab.id, timeFrom, timeTo, '97155 fix');
    if (!part1Gate97155.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, part1Gate97155.message);
      log('97155 fix: ' + part1Gate97155.message);
      return;
    }

    /* -------------------------------------------------------------------------
     * LINE 2 — Nonbillable overlap segment (97153 Direct non billable)
     * Steps: add line → date → click nonbillable 97153 → place of service → address → enter overlap times.
     * ------------------------------------------------------------------------- */
    resultEl.innerHTML = '<p>Checking service line tabs…</p>';
    let tabCountRes = await pollServiceLineTabCountUntilPositive(tab.id);
    let serviceLineCount =
      tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
    if (serviceLineCount === 0) {
      const msg = 'Could not detect service line tabs. Wait for the timesheet to finish loading and try again.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      log('97155 fix: no service line tabs');
      return;
    }
    if (serviceLineCount > 2) {
      const msg = 'Too many service lines (' + serviceLineCount + '). Remove extra lines or start from a single-line timesheet before running this fix.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      log('97155 fix: too many lines before line 2 — ' + serviceLineCount);
      return;
    }
    if (serviceLineCount >= 2) {
      resultEl.innerHTML = '<p>Already ' + serviceLineCount + ' service line(s) — skipping add. Configure the active line as nonbillable overlap.</p>';
      log('97155 fix: skip add for line 2 (already ' + serviceLineCount + ' tab(s))');
    } else {
      resultEl.innerHTML = '<p>Adding second service line…</p>';
      await execScript({
        target: { tabId: tab.id },
        files: ['inject-service-line-tab-count.js']
      });
      await new Promise((r) => setTimeout(r, 150));
      await execScript({
        target: { tabId: tab.id },
        func: () => { window.__addServiceLineMaxBefore = 1; }
      });
      await execScript({
        target: { tabId: tab.id },
        files: ['inject-add-service-line.js']
      });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
      await new Promise((r) => setTimeout(r, 550));
      results = await execScript({
        target: { tabId: tab.id },
        func: () => window.__addServiceLineResult
      });
      data = results && results[0] && results[0].result;
      if (!data) {
        const msg = 'Add service line: no result.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        return;
      }
      if (data.error) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, data.error);
        return;
      }
      if (data.skipped) {
        log('97155 fix: add-service-line skipped (already enough lines)');
      }
      tabCountRes = await fetchServiceLineTabCount(tab.id);
      serviceLineCount = tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
      if (serviceLineCount !== 2) {
        const msg = 'After adding a line, expected exactly 2 service lines, got ' + serviceLineCount + '. Before/after from click: ' + data.countBefore + ' → ' + data.countAfter + '.';
        resultEl.innerHTML = '';
        log('97155 fix: service line count after add mismatch');
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        return;
      }
      log('97155 fix: second service line present (count verified)');
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    resultEl.innerHTML = '<p>Setting date on new line...</p>';
    var releaseFocusL2 = await focusTargetTabForTimesheetUi(tab.id);
    try {
      await execScript({
        target: { tabId: tab.id },
        func: (d) => { window.__setDateOfServiceResult = null; window.__dateOfServiceValue = d; },
        args: [overlapFixRecordGet(tab.id).dateOfService]
      });
      await execScript({ target: { tabId: tab.id }, files: ['inject-set-date-of-service.js'] });
      await pollForInjectResult(tab.id, '__setDateOfServiceResult', SET_DATE_INJECT_SETTLE_MS, 200);

    resultEl.innerHTML = '<p>Waiting for new line to load, then selecting nonbillable code...</p>';
    const codesLinkReadyL2 = await overlapUiPollTry({
      tryOnce: () => probeServiceCodesLinkReady(tab.id),
      resultEl,
      waitingHtml: 'Waiting for <strong>Service Codes</strong> link (line 2)…'
    });
    if (!codesLinkReadyL2) {
      const msg =
        'Service Codes link did not appear within ' +
        Math.round(OVERLAP_FIX_UI_POLL_MAX_MS / 1000) +
        's — wait for the tab to finish loading and run Fix again.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      log('97155 fix: ' + msg);
      return;
    }
    resultEl.innerHTML = '<p>Selecting nonbillable code (CONCURRENT supervision)...</p>';
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-service-codes.js'] });
    await new Promise((r) => setTimeout(r, 900));
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__selectServiceCodesResult
    });
    data = results && results[0] && results[0].result;
    if (data && data.error) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, 'Nonbillable code: ' + data.error);
      return;
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    /* LINE 2 — place of service + service address (97155 needs these on the nonbillable line too) */
    resultEl.innerHTML = '<p>Place of service (from original)...</p>';
    const placeMatchL2 = (overlapFixRecordGet(tab.id).placeOfService || '').trim() || PLACE_OF_SERVICE_MATCH;
    await execScript({
      target: { tabId: tab.id },
      func: (m) => { window.__placeOfServiceMatch = m; },
      args: [placeMatchL2]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-place-of-service.js'] });
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    resultEl.innerHTML = '<p>Service address (from original)...</p>';
    const addressMatchL2 = (overlapFixRecordGet(tab.id).serviceAddressText || overlapFixRecordGet(tab.id).serviceAddress || '').trim() || SERVICE_ADDRESS_MATCH;
    await execScript({
      target: { tabId: tab.id },
      func: (m) => { window.__serviceAddressMatch = m; },
      args: [addressMatchL2]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-service-address.js'] });
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    resultEl.innerHTML = '<p>Entering overlap times (nonbillable)…</p>';
    const line2Times97155 = await enterAndVerifyTimesOnLine(
      tab.id,
      1,
      overlapFrom,
      overlapTo,
      resultEl,
      '97155 fix',
      {
        lineLabel: 'Line 2 (nonbillable)',
        stepLabel: 'Line 2 (nonbillable overlap)',
        manageFocus: false
      }
    );
    if (!line2Times97155.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, line2Times97155.message);
      return;
    }
    await applyCapturedTimesheetTimezone(tab.id, '97155 line 2');
    const line2AfterTz97155 = await assertTimesOnLine(
      tab.id,
      1,
      overlapFrom,
      overlapTo,
      '97155 fix',
      { lineLabel: 'Line 2 (nonbillable)', manageFocus: false }
    );
    if (!line2AfterTz97155.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, line2AfterTz97155.message);
      return;
    }
    const line1AfterL297155 = await assertPart1TimesBeforeLine2(tab.id, timeFrom, timeTo, '97155 fix', {
      manageFocus: false
    });
    if (!line1AfterL297155.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, line1AfterL297155.message);
      return;
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    } finally { releaseFocusL2(); }

    /* Start/end overlap: line 1 + line 2 completes the fix. */
    if (overlapType !== 'middle') {
      const ok97155Two = await completeOverlapFixWithIngest(
        btn,
        '97155',
        '2-line',
        fo,
        resultEl,
        '<p><strong>Done.</strong> Part 1: ' +
          escapeHtml(timeFrom) +
          ' – ' +
          escapeHtml(timeTo) +
          '. Line 2 (nonbillable): ' +
          escapeHtml(overlapFrom) +
          ' – ' +
          escapeHtml(overlapTo) +
          '. No third line (overlap at ' +
          (overlapType === 'start' ? 'start' : 'end') +
          ').</p>',
        '97155 fix: 2-line fix complete (' + overlapType + ')'
      );
      if (!ok97155Two) return;
    } else {
      /* -----------------------------------------------------------------------
       * LINE 3 — Third service line (billable 97153 after overlap)
       * Same shape as Speech line 3 but: no payor, no visit location, no note.
       * ----------------------------------------------------------------------- */
      const part3From = btn.getAttribute('data-part3-from') || '';
      const part3To = btn.getAttribute('data-part3-to') || '';

      resultEl.innerHTML = '<p>Checking service line tabs before third line…</p>';
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
      tabCountRes = await fetchServiceLineTabCount(tab.id);
      serviceLineCount = tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
      if (serviceLineCount < 2) {
        const msg = 'Expected at least 2 service lines before adding the third, got ' + serviceLineCount + '.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        log('97155 fix: too few lines before line 3');
        return;
      }
      if (serviceLineCount > 3) {
        const msg = 'Too many service lines (' + serviceLineCount + ') before the third line. Remove extras or finish manually.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        log('97155 fix: too many lines before line 3 — ' + serviceLineCount);
        return;
      }
      if (serviceLineCount >= 3) {
        resultEl.innerHTML = '<p>Already ' + serviceLineCount + ' service line(s) — skipping add. Configure the active line as billable 97153.</p>';
        log('97155 fix: skip add for line 3 (already ' + serviceLineCount + ' tab(s))');
      } else {
        resultEl.innerHTML = '<p>Adding third service line (billable, after overlap)...</p>';
        await execScript({
          target: { tabId: tab.id },
          files: ['inject-service-line-tab-count.js']
        });
        await new Promise((r) => setTimeout(r, 150));
        await execScript({
          target: { tabId: tab.id },
          func: () => { window.__addServiceLineMaxBefore = 2; }
        });
        await execScript({
          target: { tabId: tab.id },
          files: ['inject-add-service-line.js']
        });
        await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
        await new Promise((r) => setTimeout(r, 550));
        results = await execScript({
          target: { tabId: tab.id },
          func: () => window.__addServiceLineResult
        });
        data = results && results[0] && results[0].result;
        if (!data || data.error) {
          const msg = (data && data.error) ? data.error : 'Add third line: no result.';
          resultEl.innerHTML = '';
          setOverlapFixButtonState(btn, 'error');
          setOverlapFixFailReason(btn, msg);
          return;
        }
        if (data.skipped) {
          log('97155 fix: add-service-line skipped for line 3 (already enough lines)');
        }
        tabCountRes = await fetchServiceLineTabCount(tab.id);
        serviceLineCount = tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
        if (serviceLineCount !== 3) {
          const msg = 'After adding a line, expected 3 service lines, got ' + serviceLineCount + '. Click reported ' + (data.countBefore ?? '?') + ' → ' + (data.countAfter ?? '?') + '.';
          resultEl.innerHTML = '';
          setOverlapFixButtonState(btn, 'error');
          setOverlapFixFailReason(btn, msg);
          log('97155 fix: count after third add mismatch');
          return;
        }
        log('97155 fix: third service line present (count verified)');
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /* Line 3 — date of service */
      resultEl.innerHTML = '<p>Setting date on third line...</p>';
      var releaseFocusL3_97 = await focusTargetTabForTimesheetUi(tab.id);
      try {
        await execScript({
          target: { tabId: tab.id },
          func: (d) => { window.__setDateOfServiceResult = null; window.__dateOfServiceValue = d; },
          args: [overlapFixRecordGet(tab.id).dateOfService]
        });
        await execScript({ target: { tabId: tab.id }, files: ['inject-set-date-of-service.js'] });
        await pollForInjectResult(tab.id, '__setDateOfServiceResult', SET_DATE_INJECT_SETTLE_MS, 200);

      /* Line 3 — try to select billable 97153 code (optional — may already be set) */
      resultEl.innerHTML = '<p>Checking for service code list (billable 97153)...</p>';
      const codesLinkReadyL3 = await overlapUiPollTry({
        tryOnce: () => probeServiceCodesLinkReady(tab.id),
        resultEl,
        waitingHtml: 'Waiting for <strong>Service Codes</strong> link (line 3)…'
      });
      if (codesLinkReadyL3) {
        const billableReady = await overlapUiPollTry({
          tryOnce: () => probeBillable97153Ready(tab.id),
          resultEl,
          waitingHtml: 'Waiting for service code list with <strong>97153</strong>…'
        });
        if (billableReady) {
          resultEl.innerHTML = '<p>Clicking billable 97153...</p>';
          await execScript({ target: { tabId: tab.id }, files: ['inject-click-billable-97153-no-nonbillable.js'] });
          await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
          results = await execScript({
            target: { tabId: tab.id },
            func: () => window.__clickBillable97153NoBResult
          });
          data = results && results[0] && results[0].result;
          if (data && data.success) {
            log('97155 fix: billable 97153 selected');
          } else {
            log('97155 fix: billable click soft-failed — ' + ((data && data.error) || 'no result') + ', continuing');
          }
        } else {
          log('97155 fix: 97153 list not found for line 3, skipping code selection (may already be set)');
        }
      } else {
        log('97155 fix: Service Codes link not found on line 3, skipping code selection (may already be set)');
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /* Line 3 — place of service + service address */
      resultEl.innerHTML = '<p>Place of service (from original)...</p>';
      const placeMatchL3 = (overlapFixRecordGet(tab.id).placeOfService || '').trim() || PLACE_OF_SERVICE_MATCH;
      await execScript({
        target: { tabId: tab.id },
        func: (m) => { window.__placeOfServiceMatch = m; },
        args: [placeMatchL3]
      });
      await execScript({ target: { tabId: tab.id }, files: ['inject-select-place-of-service.js'] });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      resultEl.innerHTML = '<p>Service address (from original)...</p>';
      const addressMatchL3 = (overlapFixRecordGet(tab.id).serviceAddressText || overlapFixRecordGet(tab.id).serviceAddress || '').trim() || SERVICE_ADDRESS_MATCH;
      await execScript({
        target: { tabId: tab.id },
        func: (m) => { window.__serviceAddressMatch = m; },
        args: [addressMatchL3]
      });
      await execScript({ target: { tabId: tab.id }, files: ['inject-select-service-address.js'] });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /* Line 3 — times for post-overlap billable segment */
      resultEl.innerHTML = '<p>Entering Part 3 times (after overlap)…</p>';
      const line3Times97155 = await enterAndVerifyTimesOnLine(
        tab.id,
        2,
        part3From,
        part3To,
        resultEl,
        '97155 fix',
        {
          lineLabel: 'Part 3',
          stepLabel: 'Part 3 (billable segment after overlap)',
          pollMaxMs: ENTER_TIMES_PART3_POLL_MAX_MS,
          manageFocus: false
        }
      );
      if (!line3Times97155.ok) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, line3Times97155.message);
        return;
      }
      await applyCapturedTimesheetTimezone(tab.id, '97155 line 3');
      const line3AfterTz97155 = await assertTimesOnLine(
        tab.id,
        2,
        part3From,
        part3To,
        '97155 fix',
        { lineLabel: 'Part 3', manageFocus: false }
      );
      if (!line3AfterTz97155.ok) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, line3AfterTz97155.message);
        return;
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /* Line 3 — attach note (primary tries session picker + date/name without SELECT EXISTING NOTE; button is backup) */
      const notePick97155 = await tryOverlapFixPickNoteBackupThenPrimary(tab.id, resultEl, '97155 fix');
      if (!notePick97155.ok) {
        resultEl.innerHTML = overlapFixNoteFailureHtml(notePick97155.msg);
        log('97155 fix: note step failed – ' + notePick97155.msg);
        await prog97155(notePick97155.msg || 'Note step failed', 'error');
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, notePick97155.msg);
        return;
      }

      resultEl.innerHTML = '<p>Closing note panel...</p>';
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_NOTE_STEP_MS));
      await execScript({ target: { tabId: tab.id }, files: ['inject-click-close-note.js'] });
      await new Promise((r) => setTimeout(r, 300));
      const closeRes97155 = await execScript({
        target: { tabId: tab.id },
        func: () => window.__clickCloseNoteResult
      });
      const closeData97155 = closeRes97155 && closeRes97155[0] && closeRes97155[0].result;
      if (!closeData97155 || !closeData97155.success) {
        log('97155 fix: close note soft-failed — ' + ((closeData97155 && closeData97155.error) || 'CLOSE button not found') + ', continuing');
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_NOTE_STEP_MS));
      } finally { releaseFocusL3_97(); }

      /* ---- AUTO SIGN BOTH (client then provider) ---- */
      log('97155 fix: starting auto-sign');

      // Client signature
      const clientOk = await runSignatureSequence(tab, 'client', resultEl, true);
      if (!clientOk) {
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, 'Timesheet built OK but client signature failed. Use the manual Signature buttons to finish.');
        return;
      }

      resultEl.innerHTML = '<p>Client signed. Waiting 2s before provider...</p>';
      log('97155 fix: client signed, waiting 2s');
      await new Promise((r) => setTimeout(r, 2000));

      // Provider signature
      const providerOk = await runSignatureSequence(tab, 'provider', resultEl, false);
      if (!providerOk) {
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, 'Timesheet built OK but provider signature failed. Use the manual Signature buttons to finish.');
        return;
      }

      log('97155 fix: both signatures complete');

      const ok97155Three = await completeOverlapFixWithIngest(
        btn,
        '97155',
        '3-line',
        fo,
        resultEl,
        '<p><strong>Done.</strong> Part 1: ' +
          escapeHtml(timeFrom) +
          ' – ' +
          escapeHtml(timeTo) +
          '. Line 2 (nonbillable): ' +
          escapeHtml(overlapFrom) +
          ' – ' +
          escapeHtml(overlapTo) +
          '. Line 3 (billable): ' +
          escapeHtml(part3From) +
          ' – ' +
          escapeHtml(part3To) +
          '. Note connected. Both signatures applied.</p>',
        '97155 fix: 3-line fix complete, note connected, signatures done'
      );
      if (!ok97155Three) return;
    }
  } catch (err) {
    const msg = err.message || 'Unknown error';
    resultEl.innerHTML = '';
    log('97155 fix error: ' + msg);
    await prog97155(msg, 'error');
    setOverlapFixButtonState(btn, 'error');
    setOverlapFixFailReason(btn, msg);
  }
}

/**
 * Speech overlap — delegated click on **Fix** (`button.overlap-btn`) for Speech (92507 / spanning 97153).
 *
 * Purpose
 * -------
 * Resolve a “speech concurrence”: one 97153 row overlaps another service’s minutes. We split work
 * across **2 or 3 service lines on the same timesheet** so times don’t double-book and the overlap
 * window is explicit:
 *
 *   • **Line 1** — Original 97153 shortened so it no longer covers the overlap (`timeFrom`–`timeTo`).
 *   • **Line 2** — Nonbillable line for **only** the overlap (`overlapFrom`–`overlapTo`).
 *   • **Line 3** — (*Middle* only) Remaining billable 97153 after the overlap; mirror billing fields
 *     from line 1; attach the note to this line.
 *
 * **Start** / **end** → lines 1–2 only. **Middle** → lines 1–2–3.
 *
 * Handler sections: PREAMBLE (billing list) → LINE 1 → snapshot → LINE 2 → (branch) LINE 3 + note.
 */
async function runOverlapFixSpeech(btn, fixOpts) {
  const fo = fixOpts || {};
  const entryId = btn.getAttribute('data-entry-id');
  const timeFrom = btn.getAttribute('data-time-from');
  const timeTo = btn.getAttribute('data-time-to');
  const overlapText = btn.getAttribute('data-overlap') || '';
  const overlapFrom = btn.getAttribute('data-overlap-from') || '';
  const overlapTo = btn.getAttribute('data-overlap-to') || '';
  const overlapType = btn.getAttribute('data-overlap-type') || 'middle';
  const resultEl = fo.resultEl || document.getElementById('overlap-fix-result');
  const progressTabId = fo.progressTabId != null ? fo.progressTabId : null;
  async function progSpeech(message, phase) {
    if (progressTabId != null) {
      await writeConcurrenceFixProgress(progressTabId, message, phase || 'run', null);
    }
  }
  setOverlapFixButtonState(btn, 'loading');
  setOverlapFixFailReason(btn, '');
  /** Provider labels from the entry's contact card; captured before opening timesheet. */
  let overlapFixProviderLabels = null;
  /** Payor inject match for line 3 — "master" or "associate", from labels when overlapType is middle. */
  let overlapFixPayorMatch = null;
  /** Fee schedule role for line 3 — "bcba" | "lbs" | "rbt_bt" | null, from labels when inferrable. */
  let overlapFixProviderRole = null;
  resultEl.innerHTML = '<p>Getting provider labels...</p>';
  await progSpeech('Getting provider labels…', 'start');
  log('Overlap fix: entry ' + entryId + ', type ' + overlapType + ', set Part1 to ' + timeFrom + ' – ' + timeTo + ' (overlap: ' + overlapText + ')');
  try {
    let results;

    let tab;
    if (fo.targetTabId != null) {
      tab = { id: fo.targetTabId };
    } else {
      const [t] = await chrome.tabs.query({ active: true, currentWindow: true });
      tab = t;
    }
    if (!tab?.id) {
      const msg = 'No active tab.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }
    if (
      fo.targetTabId == null &&
      tab.url &&
      (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))
    ) {
      const msg = 'Cannot run on this page.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }

    /* -------------------------------------------------------------------------
     * PREAMBLE — Still on billing list: identify the row, optional provider labels, open editor.
     * Purpose: land on the correct timesheet (same entry) before touching line 1.
     * ------------------------------------------------------------------------- */
    await execScript({
      target: { tabId: tab.id },
      func: (id) => { window.__overlapFixEntryId = id; },
      args: [entryId]
    });
    await execScript({ target: { tabId: tab.id }, files: ['inject-provider-combo-for-entry.js'] });
    const maxWait = 18000;
    const pollMs = 400;
    let labelsResult = null;
    for (let elapsed = 0; elapsed < maxWait; elapsed += pollMs) {
      await new Promise(function (r) { setTimeout(r, pollMs); });
      const results = await execScript({
        target: { tabId: tab.id },
        func: () => window.__overlapFixProviderLabels
      });
      labelsResult = results && results[0] && results[0].result;
      if (labelsResult) break;
    }
    if (overlapType === 'middle') {
      if (!labelsResult || !labelsResult.success || !labelsResult.labels || !labelsResult.labels.length) {
        const msg = messageForOverlapFixProviderLabelsFailure(labelsResult);
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        log('Overlap fix: stopped — ' + msg);
        console.error('[Hidden Lights overlap fix] Missing provider labels (middle overlap):', labelsResult);
        return;
      }
      overlapFixProviderLabels = labelsResult.labels;
      log('Overlap fix: got ' + overlapFixProviderLabels.length + ' provider label(s): ' + overlapFixProviderLabels.join(', '));
      console.log('[Hidden Lights overlap fix] Provider label(s) read before fix:', overlapFixProviderLabels);
      const payorInf = inferPayorMatchFromProviderLabels(overlapFixProviderLabels);
      if (!payorInf.ok) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, payorInf.error);
        log('Overlap fix: stopped — ' + payorInf.error);
        console.error('[Hidden Lights overlap fix] Payor inference failed:', payorInf.error, overlapFixProviderLabels);
        return;
      }
      overlapFixPayorMatch = payorInf.match;
      log(
        'Overlap fix: payor from labels → ' + payorInf.tier + ' (inject match "' + payorInf.match + '")'
      );
      console.log('[Hidden Lights overlap fix] Inferred payor:', payorInf.match, payorInf.tier, overlapFixProviderLabels);
      const roleInf = inferProviderRoleFromLabels(overlapFixProviderLabels, {
        providerName: (labelsResult && labelsResult.providerName) || ''
      });
      overlapFixProviderRole = roleInf.role;
      if (overlapFixProviderRole != null) {
        const multi =
          roleInf.allMatchedPrimary && roleInf.allMatchedPrimary.length > 1
            ? ' (highest among tagged roles: ' + formatFeeScheduleRolesList(roleInf.allMatchedPrimary) + ')'
            : '';
        log(
          'Overlap fix: decided fee-schedule role from labels — ' +
            feeScheduleRoleDisplayName(overlapFixProviderRole) +
            ' (inject match "' +
            overlapFixProviderRole +
            '")' +
            multi
        );
        console.log(
          '[Hidden Lights overlap fix] Decided fee-schedule role:',
          overlapFixProviderRole,
          '(' + feeScheduleRoleDisplayName(overlapFixProviderRole) + ')',
          'allMatchedPrimary:',
          roleInf.allMatchedPrimary,
          'labels:',
          overlapFixProviderLabels
        );
      } else {
        log(
          'Overlap fix: decided fee-schedule role from labels — none matched (BCBA / LBS / RBT-BT). Fee menu will skip unless it appears; if it appears without a role, Fix will ask you to pick the row.'
        );
        console.log(
          '[Hidden Lights overlap fix] Decided fee-schedule role: (none — no BCBA/LBS/RBT-BT tag matched)',
          overlapFixProviderLabels
        );
      }
    } else {
      if (labelsResult && labelsResult.success && labelsResult.labels) {
        overlapFixProviderLabels = labelsResult.labels;
        log('Overlap fix: got ' + overlapFixProviderLabels.length + ' provider label(s): ' + overlapFixProviderLabels.join(', '));
        console.log('[Hidden Lights overlap fix] Provider label(s) read before fix:', overlapFixProviderLabels);
        const roleInfSe = inferProviderRoleFromLabels(overlapFixProviderLabels, {
          providerName: (labelsResult && labelsResult.providerName) || ''
        });
        overlapFixProviderRole = roleInfSe.role;
        if (overlapFixProviderRole != null) {
          const multiSe =
            roleInfSe.allMatchedPrimary && roleInfSe.allMatchedPrimary.length > 1
              ? ' (highest among tagged roles: ' + formatFeeScheduleRolesList(roleInfSe.allMatchedPrimary) + ')'
              : '';
          log(
            'Overlap fix: decided fee-schedule role from labels — ' +
              feeScheduleRoleDisplayName(overlapFixProviderRole) +
              ' (inject match "' +
              overlapFixProviderRole +
              '")' +
              multiSe
          );
          console.log(
            '[Hidden Lights overlap fix] Decided fee-schedule role:',
            overlapFixProviderRole,
            '(' + feeScheduleRoleDisplayName(overlapFixProviderRole) + ')',
            'allMatchedPrimary:',
            roleInfSe.allMatchedPrimary,
            'labels:',
            overlapFixProviderLabels
          );
        } else {
          log(
            'Overlap fix: decided fee-schedule role from labels — none matched (not needed for start/end line count).'
          );
          console.log(
            '[Hidden Lights overlap fix] Decided fee-schedule role: (none)',
            overlapFixProviderLabels
          );
        }
      } else if (labelsResult && labelsResult.error) {
        log(
          'Overlap fix: provider labels failed – ' + labelsResult.error + ' (continuing — start/end, no line 3 payor)'
        );
        console.warn('[Hidden Lights overlap fix] Provider labels failed (continuing):', labelsResult.error, labelsResult);
      } else {
        console.warn(
          '[Hidden Lights overlap fix] No provider labels after poll (continuing — start/end overlap).',
          labelsResult
        );
      }
    }
    resultEl.innerHTML = '<p>Opening timesheet...</p>';
    await execScript({
      target: { tabId: tab.id },
      func: (id) => {
        window.location.hash = 'billingmanager/timesheeteditor/?&id=' + id;
        return { success: true };
      },
      args: [entryId]
    });
    await new Promise((r) => setTimeout(r, 500));
    await waitForTimesheetEditorReady(tab.id, entryId);
    await progSpeech('Timesheet editor open', 'timesheet');

    /* -------------------------------------------------------------------------
     * LINE 1 — First service line (trimmed 97153)
     * Purpose: shrink the original billable segment so it no longer includes the overlap window.
     * Outcome: active line shows timeFrom–timeTo (verified on From and To); still one line only.
     * ------------------------------------------------------------------------- */
    const part1ResultSp = await enterAndVerifyPart1Times(tab.id, timeFrom, timeTo, resultEl, 'Overlap fix');
    if (!part1ResultSp.ok) {
      resultEl.innerHTML = '';
      log('Overlap fix: Part 1 failed – ' + part1ResultSp.message);
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, part1ResultSp.message);
      return;
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    await progSpeech('Part 1 verified', 'part1');

    /* Snapshot line 1 — provider / POS / address / date to reuse on new lines (esp. line 3). */
    resultEl.innerHTML = '<p>Recording from first timesheet...</p>';
    var snapSpeech = await captureOverlapFixTimesheetSnapshot(tab.id, progSpeech);
    if (!snapSpeech.ok) {
      const msg = snapSpeech.error || 'Could not read timesheet.';
      resultEl.innerHTML = '';
      log('Overlap fix: read timesheet failed');
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      return;
    }
    const snapS = overlapFixRecordGet(tab.id);
    log('Overlap fix: recorded provider, place, address, date' + (snapS && snapS.timeZoneValue ? ', tz ' + snapS.timeZoneValue : ''));
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    resultEl.innerHTML = '<p>Verifying line 1 times before line 2…</p>';
    await progSpeech('Verifying line 1 times before line 2…', 'part1');
    const part1GateSp = await assertPart1TimesBeforeLine2(tab.id, timeFrom, timeTo, 'Overlap fix');
    if (!part1GateSp.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, part1GateSp.message);
      log('Overlap fix: ' + part1GateSp.message);
      return;
    }

    /* -------------------------------------------------------------------------
     * LINE 2 — Second service line (nonbillable overlap slice)
     * Purpose: add a row that covers exactly the overlapping minutes as nonbillable, same DOS.
     * Steps: ensure 2 tabs (add only if needed) → set date → pick nonbillable code → enter overlapFrom–overlapTo.
     * ------------------------------------------------------------------------- */
    resultEl.innerHTML = '<p>Checking service line tabs…</p>';
    let tabCountRes = await pollServiceLineTabCountUntilPositive(tab.id);
    let serviceLineCount =
      tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
    if (serviceLineCount === 0) {
      const msg =
        'Could not detect service line tabs. Wait for the timesheet to finish loading and try again.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      log('Overlap fix: no service line tabs');
      return;
    }
    if (serviceLineCount > 2) {
      const msg =
        'Too many service lines (' +
        serviceLineCount +
        '). Remove extra lines or start from a single-line timesheet before running this fix.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      log('Overlap fix: too many lines before line 2 — ' + serviceLineCount);
      return;
    }
    if (serviceLineCount >= 2) {
      resultEl.innerHTML =
        '<p>Already ' +
        serviceLineCount +
        ' service line(s) — skipping add. Configure the active line as nonbillable overlap.</p>';
      log(
        'Overlap fix: skip add for line 2 (already ' + serviceLineCount + ' tab(s), scoped count)'
      );
    } else {
      resultEl.innerHTML = '<p>Adding second service line…</p>';
      await execScript({
        target: { tabId: tab.id },
        files: ['inject-service-line-tab-count.js']
      });
      await new Promise((r) => setTimeout(r, 150));
      await execScript({
        target: { tabId: tab.id },
        func: () => { window.__addServiceLineMaxBefore = 1; }
      });
      await execScript({
        target: { tabId: tab.id },
        files: ['inject-add-service-line.js']
      });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
      await new Promise((r) => setTimeout(r, 550));
      results = await execScript({
        target: { tabId: tab.id },
        func: () => window.__addServiceLineResult
      });
      data = results && results[0] && results[0].result;
      if (!data) {
        const msg = 'Add service line: no result.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        return;
      }
      if (data.error) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, data.error);
        return;
      }
      if (data.skipped) {
        log('Overlap fix: add-service-line skipped (already enough lines)');
      }
      tabCountRes = await fetchServiceLineTabCount(tab.id);
      serviceLineCount = tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
      if (serviceLineCount !== 2) {
        const msg =
          'After adding a line, expected exactly 2 service lines, got ' +
          serviceLineCount +
          '. Before/after from click: ' +
          data.countBefore +
          ' → ' +
          data.countAfter +
          '.';
        resultEl.innerHTML = '';
        log('Overlap fix: service line count after add mismatch');
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        return;
      }
      log('Overlap fix: second service line present (count verified)');
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    resultEl.innerHTML = '<p>Setting date on new line...</p>';
    var releaseFocusL2sp = await focusTargetTabForTimesheetUi(tab.id);
    try {
      await execScript({
        target: { tabId: tab.id },
        func: (d) => { window.__setDateOfServiceResult = null; window.__dateOfServiceValue = d; },
        args: [overlapFixRecordGet(tab.id).dateOfService]
      });
      await execScript({ target: { tabId: tab.id }, files: ['inject-set-date-of-service.js'] });
      await pollForInjectResult(tab.id, '__setDateOfServiceResult', SET_DATE_INJECT_SETTLE_MS, 200);

    resultEl.innerHTML = '<p>Waiting for new line to load, then selecting nonbillable code...</p>';
    const codesLinkReady = await overlapUiPollTry({
      tryOnce: () => probeServiceCodesLinkReady(tab.id),
      resultEl,
      waitingHtml: 'Waiting for <strong>Service Codes</strong> link (new line)…'
    });
    if (!codesLinkReady) {
      const msg =
        'Service Codes link did not appear within ' +
        Math.round(OVERLAP_FIX_UI_POLL_MAX_MS / 1000) +
        's — wait for the tab to finish loading and run Fix again.';
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, msg);
      log('Overlap fix: ' + msg);
      return;
    }
    resultEl.innerHTML = '<p>Selecting nonbillable code...</p>';
    await execScript({ target: { tabId: tab.id }, files: ['inject-select-service-codes.js'] });
    await new Promise((r) => setTimeout(r, 900));
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__selectServiceCodesResult
    });
    data = results && results[0] && results[0].result;
    if (data && data.error) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, 'Nonbillable code: ' + data.error);
      return;
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

    resultEl.innerHTML = '<p>Entering overlap times (nonbillable)…</p>';
    const line2TimesSp = await enterAndVerifyTimesOnLine(
      tab.id,
      1,
      overlapFrom,
      overlapTo,
      resultEl,
      'Overlap fix',
      {
        lineLabel: 'Line 2 (nonbillable)',
        stepLabel: 'Line 2 (nonbillable overlap)',
        manageFocus: false
      }
    );
    if (!line2TimesSp.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, line2TimesSp.message);
      return;
    }
    await applyCapturedTimesheetTimezone(tab.id, 'Texas line 2');
    const line2AfterTzSp = await assertTimesOnLine(
      tab.id,
      1,
      overlapFrom,
      overlapTo,
      'Overlap fix',
      { lineLabel: 'Line 2 (nonbillable)', manageFocus: false }
    );
    if (!line2AfterTzSp.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, line2AfterTzSp.message);
      return;
    }
    const line1AfterL2Sp = await assertPart1TimesBeforeLine2(tab.id, timeFrom, timeTo, 'Overlap fix', {
      manageFocus: false
    });
    if (!line1AfterL2Sp.ok) {
      resultEl.innerHTML = '';
      setOverlapFixButtonState(btn, 'error');
      setOverlapFixFailReason(btn, line1AfterL2Sp.message);
      return;
    }
    await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
    } finally { releaseFocusL2sp(); }

    /* Start/end overlap: line 1 + line 2 completes the fix (no billable segment after overlap). */
    if (overlapType !== 'middle') {
      const okSpeechTwo = await completeOverlapFixWithIngest(
        btn,
        'speech',
        '2-line',
        fo,
        resultEl,
        '<p><strong>Done.</strong> Part 1: ' +
          escapeHtml(timeFrom) +
          ' – ' +
          escapeHtml(timeTo) +
          '. Line 2 (nonbillable): ' +
          escapeHtml(overlapFrom) +
          ' – ' +
          escapeHtml(overlapTo) +
          '. No third line (overlap at ' +
          (overlapType === 'start' ? 'start' : 'end') +
          ').</p>',
        'Overlap fix: 2-line fix complete (' + overlapType + ')'
      );
      if (!okSpeechTwo) return;
    } else {
      /* -------------------------------------------------------------------------
       * LINE 3 — Third service line (billable 97153 after overlap) + note
       * Purpose: restore billable 97153 for minutes after the overlap; mirror billing fields from
       * line 1; link the session note to this line so documentation matches the billable segment.
       * ------------------------------------------------------------------------- */
      const part3From = btn.getAttribute('data-part3-from') || '';
      const part3To = btn.getAttribute('data-part3-to') || '';

      resultEl.innerHTML = '<p>Checking service line tabs before third line…</p>';
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
      tabCountRes = await fetchServiceLineTabCount(tab.id);
      serviceLineCount =
        tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
      if (serviceLineCount < 2) {
        const msg =
          'Expected at least 2 service lines before adding the third, got ' + serviceLineCount + '.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        log('Overlap fix: too few lines before line 3');
        return;
      }
      if (serviceLineCount > 3) {
        const msg =
          'Too many service lines (' +
          serviceLineCount +
          ') before the third line. Remove extras or finish manually.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        log('Overlap fix: too many lines before line 3 — ' + serviceLineCount);
        return;
      }
      if (serviceLineCount >= 3) {
        resultEl.innerHTML =
          '<p>Already ' +
          serviceLineCount +
          ' service line(s) — skipping add. Configure the active line as billable 97153.</p>';
        log(
          'Overlap fix: skip add for line 3 (already ' + serviceLineCount + ' tab(s))'
        );
      } else {
        resultEl.innerHTML = '<p>Adding third service line (billable, after overlap)...</p>';
        await execScript({
          target: { tabId: tab.id },
          files: ['inject-service-line-tab-count.js']
        });
        await new Promise((r) => setTimeout(r, 150));
        await execScript({
          target: { tabId: tab.id },
          func: () => { window.__addServiceLineMaxBefore = 2; }
        });
        await execScript({
          target: { tabId: tab.id },
          files: ['inject-add-service-line.js']
        });
        await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));
        await new Promise((r) => setTimeout(r, 550));
        results = await execScript({
          target: { tabId: tab.id },
          func: () => window.__addServiceLineResult
        });
        data = results && results[0] && results[0].result;
        if (!data || data.error) {
          const msg = (data && data.error) ? data.error : 'Add third line: no result.';
          resultEl.innerHTML = '';
          setOverlapFixButtonState(btn, 'error');
          setOverlapFixFailReason(btn, msg);
          return;
        }
        if (data.skipped) {
          log('Overlap fix: add-service-line skipped for line 3 (already enough lines)');
        }
        tabCountRes = await fetchServiceLineTabCount(tab.id);
        serviceLineCount =
          tabCountRes && typeof tabCountRes.count === 'number' ? tabCountRes.count : 0;
        if (serviceLineCount !== 3) {
          const msg =
            'After adding a line, expected 3 service lines, got ' +
            serviceLineCount +
            '. Click reported ' +
            (data.countBefore ?? '?') +
            ' → ' +
            (data.countAfter ?? '?') +
            '.';
          resultEl.innerHTML = '';
          setOverlapFixButtonState(btn, 'error');
          setOverlapFixFailReason(btn, msg);
          log('Overlap fix: count after third add mismatch');
          return;
        }
        log('Overlap fix: third service line present (count verified)');
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /* Line 3 — same date of service as line 1 */
      resultEl.innerHTML = '<p>Setting date on third line...</p>';
      var releaseFocusL3sp = await focusTargetTabForTimesheetUi(tab.id);
      try {
        await execScript({
          target: { tabId: tab.id },
          func: (d) => { window.__setDateOfServiceResult = null; window.__dateOfServiceValue = d; },
          args: [overlapFixRecordGet(tab.id).dateOfService]
        });
        await execScript({ target: { tabId: tab.id }, files: ['inject-set-date-of-service.js'] });
        await pollForInjectResult(tab.id, '__setDateOfServiceResult', SET_DATE_INJECT_SETTLE_MS, 200);

      /* Line 3 — billable code + payor / POS / address (align with trimmed workflow) */
      const billableReady = await overlapUiPollTry({
        tryOnce: () => probeBillable97153Ready(tab.id),
        resultEl,
        waitingHtml: 'Waiting for billable <strong>97153: Direct Care – RBT/BT</strong>…'
      });
      if (!billableReady) {
        const msg =
          'Billable line (97153 Direct Care RBT/BT) did not appear within ' +
          Math.round(OVERLAP_FIX_UI_POLL_MAX_MS / 1000) +
          's — open the billable tab if needed and try again.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, msg);
        log('Overlap fix: ' + msg);
        return;
      }
      resultEl.innerHTML = '<p>Clicking 97153 (billable)...</p>';
      await execScript({ target: { tabId: tab.id }, files: ['inject-click-billable-97153.js'] });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      resultEl.innerHTML = '<p>Visit location (HOME / OFFICE / OTHER) if shown…</p>';
      const visitTier = inferVisitLocationMatchFromPlaceOfService(overlapFixRecordGet(tab.id).placeOfService);
      await execScript({
        target: { tabId: tab.id },
        func: (m) => {
          window.__visitLocationMatch = m;
        },
        args: [visitTier]
      });
      const visitPick = await runInjectVisitLocationSelect(tab.id);
      if (visitPick && !visitPick.success) {
        const vmsg = visitPick.error || 'Visit location step failed.';
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, vmsg);
        log('Overlap fix: visit location — ' + vmsg);
        logPayorResultPayload('Overlap fix', 'visit location', visitPick);
        return;
      }
      if (visitPick && visitPick.skipped) {
        log('Overlap fix: visit location cards not on screen — skipped');
      } else if (visitPick && visitPick.success) {
        log('Overlap fix: visit location selected (' + visitTier + ')');
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /**
       * Line 3: fee schedule rows (BCBA / LBS / RBT-BT + plus) and Master/Associate payor tier can appear
       * sequentially in either order, or not at all. Poll until both are resolved or combined timeout.
       */
      let feeHandled = false;
      let payorHandled = false;
      let payorPick = null;
      const combinedDeadline = Date.now() + OVERLAP_FIX_FEE_PAYOR_COMBINED_MAX_MS;
      let pass = 0;
      while (Date.now() < combinedDeadline && (!feeHandled || !payorHandled)) {
        pass += 1;
        resultEl.innerHTML =
          '<p>Fee schedule / payor tier' +
          (pass > 1 ? ' <span style="opacity:0.85">· pass ' + pass + '</span>' : '') +
          '…</p>';

        if (!feeHandled) {
          var feePlace = inferVisitLocationMatchFromPlaceOfService(
            (overlapFixRecordGet(tab.id).placeOfService || ''));
          await execScript({
            target: { tabId: tab.id },
            func: (role, tier, place) => {
              window.__feeScheduleRoleMatch = role != null && role !== '' ? String(role) : '';
              window.__feeScheduleTierMatch =
                tier != null && tier !== '' ? String(tier).trim().toLowerCase() : '';
              window.__feeSchedulePlaceMatch =
                place != null && place !== '' ? String(place).trim().toLowerCase() : '';
            },
            args: [
              overlapFixProviderRole != null ? overlapFixProviderRole : '',
              overlapFixPayorMatch != null ? overlapFixPayorMatch : '',
              feePlace || ''
            ]
          });
          const feePick = await runInjectFeeScheduleRoleSelect(tab.id);
          logRemoteInjectDebug('Overlap fix: fee schedule script (pass ' + pass + ')', feePick);
          if (!feePick || !feePick.success) {
            log('Overlap fix: fee schedule not matched yet (pass ' + pass + ')' +
              (Date.now() < combinedDeadline ? ', will retry…' : ' — will continue without it.'));
          } else if (feePick.clicked > 0) {
            feeHandled = true;
            log(
              'Overlap fix: fee schedule plus clicked (' +
                (feePick.matchedText || overlapFixProviderRole || '') +
                ')'
            );
            var feeMt = feePick.matchedText || '';
            if (feeMt.indexOf('+master') !== -1 || feeMt.indexOf('+associate') !== -1) {
              payorHandled = true;
              log(
                'Overlap fix: education tier was part of fee step (' +
                  feeMt +
                  '); will not run duplicate payor / education card step.'
              );
            }
          } else if (feePick.skipped && feePick.debug && feePick.debug.shippedStub) {
            feeHandled = true;
            log(
              'Overlap fix: fee schedule — core build has no bundled DOM script; host inject-select-fee-schedule-role via POEL/repo or click the row yourself.'
            );
          }
        }

        if (!payorHandled) {
          await execScript({
            target: { tabId: tab.id },
            func: (m) => {
              window.__payorOptionMatch = m;
            },
            args: [overlapFixPayorMatch || PAYOR_OPTION_MATCH]
          });
          payorPick = await runInjectPayorSelect(tab.id);
          logRemoteInjectDebug('Overlap fix: payor / education script (pass ' + pass + ')', payorPick);
          if (!payorPick || !payorPick.success) {
            log('Overlap fix: payor / education not matched yet (pass ' + pass + ')' +
              (Date.now() < combinedDeadline ? ', will retry…' : ' — will continue without it.'));
          } else if (!payorPick.skipped) {
            payorHandled = true;
            logPayorResultPayload('Overlap fix', 'combined payor OK', payorPick);
          } else if (payorPick.skipped && payorPick.debug && payorPick.debug.shippedStub) {
            payorHandled = true;
            log(
              'Overlap fix: payor / education — core build has no bundled DOM script; host inject-select-payor-option via POEL/repo or click the tier yourself.'
            );
          } else if (
            payorPick.skipped &&
            payorPick.debug &&
            payorPick.debug.skipReason === 'no_payor_or_education_ui'
          ) {
            payorHandled = true;
            log(
              'Overlap fix: payor / education — no tier cards (already handled or next step); continuing.'
            );
          } else {
            log('Overlap fix: payor / education tier not on screen yet (pass ' + pass + ')');
          }
        }

        if (feeHandled && payorHandled) break;
        const wait = Math.min(OVERLAP_FIX_UI_POLL_MS, Math.max(0, combinedDeadline - Date.now()));
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      }

      if (!feeHandled) {
        var feePlaceFinal = inferVisitLocationMatchFromPlaceOfService(
          (overlapFixRecordGet(tab.id).placeOfService || ''));
        await execScript({
          target: { tabId: tab.id },
          func: (role, tier, place) => {
            window.__feeScheduleRoleMatch = role != null && role !== '' ? String(role) : '';
            window.__feeScheduleTierMatch =
              tier != null && tier !== '' ? String(tier).trim().toLowerCase() : '';
            window.__feeSchedulePlaceMatch =
              place != null && place !== '' ? String(place).trim().toLowerCase() : '';
          },
          args: [
            overlapFixProviderRole != null ? overlapFixProviderRole : '',
            overlapFixPayorMatch != null ? overlapFixPayorMatch : '',
            feePlaceFinal || ''
          ]
        });
        const feeFinal = await runInjectFeeScheduleRoleSelect(tab.id);
        logRemoteInjectDebug('Overlap fix: fee schedule script (final pass)', feeFinal);
        if (!feeFinal || !feeFinal.success) {
          const msg =
            (feeFinal && feeFinal.error) ||
            'Fee schedule step could not match — continuing (pick the correct plus (+) yourself if needed).';
          log('Overlap fix: fee schedule (final) — ' + msg);
        } else if (feeFinal.skipped) {
          log('Overlap fix: fee schedule menu never appeared — skipped');
        } else if (feeFinal.clicked > 0) {
          log('Overlap fix: fee schedule plus clicked on final pass');
        }
        feeHandled = true;
      }

      if (!payorHandled) {
        payorPick = payorPick || { success: true, skipped: true };
        log('Overlap fix: payor tier did not appear — continuing (skipped)');
        logPayorResultPayload('Overlap fix', 'combined payor timeout', payorPick);
      } else {
        logPayorResultPayload('Overlap fix', 'combined final', payorPick);
      }

      await new Promise((r) => setTimeout(r, OVERLAP_FIX_AFTER_MASTER_MS));

      resultEl.innerHTML = '<p>Place of service (from original)...</p>';
      const placeMatch = (overlapFixRecordGet(tab.id).placeOfService || '').trim() || PLACE_OF_SERVICE_MATCH;
      await execScript({
        target: { tabId: tab.id },
        func: (m) => { window.__placeOfServiceMatch = m; },
        args: [placeMatch]
      });
      await execScript({ target: { tabId: tab.id }, files: ['inject-select-place-of-service.js'] });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      resultEl.innerHTML = '<p>Service address (from original)...</p>';
      const addressMatch = (overlapFixRecordGet(tab.id).serviceAddressText || overlapFixRecordGet(tab.id).serviceAddress || '').trim() || SERVICE_ADDRESS_MATCH;
      await execScript({
        target: { tabId: tab.id },
        func: (m) => { window.__serviceAddressMatch = m; },
        args: [addressMatch]
      });
      await execScript({ target: { tabId: tab.id }, files: ['inject-select-service-address.js'] });
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /* Line 3 — times for post-overlap billable segment */
      resultEl.innerHTML = '<p>Entering Part 3 times (after overlap)…</p>';
      const line3TimesSp = await enterAndVerifyTimesOnLine(
        tab.id,
        2,
        part3From,
        part3To,
        resultEl,
        'Overlap fix',
        {
          lineLabel: 'Part 3',
          stepLabel: 'Part 3 (billable segment after overlap)',
          pollMaxMs: ENTER_TIMES_PART3_POLL_MAX_MS,
          manageFocus: false
        }
      );
      if (!line3TimesSp.ok) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, line3TimesSp.message);
        return;
      }
      await applyCapturedTimesheetTimezone(tab.id, 'Texas line 3');
      const line3AfterTzSp = await assertTimesOnLine(
        tab.id,
        2,
        part3From,
        part3To,
        'Overlap fix',
        { lineLabel: 'Part 3', manageFocus: false }
      );
      if (!line3AfterTzSp.ok) {
        resultEl.innerHTML = '';
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, line3AfterTzSp.message);
        return;
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_STEP_DELAY_MS));

      /* Line 3 — attach note (primary tries session picker + date/name without SELECT EXISTING NOTE; button is backup) */
      const notePickSpeech = await tryOverlapFixPickNoteBackupThenPrimary(tab.id, resultEl, 'Overlap fix');
      if (!notePickSpeech.ok) {
        resultEl.innerHTML = overlapFixNoteFailureHtml(notePickSpeech.msg);
        log('Overlap fix: note step failed – ' + notePickSpeech.msg);
        await progSpeech(notePickSpeech.msg || 'Note step failed', 'error');
        setOverlapFixButtonState(btn, 'error');
        setOverlapFixFailReason(btn, notePickSpeech.msg);
        return;
      }

      resultEl.innerHTML = '<p>Closing note panel...</p>';
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_NOTE_STEP_MS));
      await execScript({ target: { tabId: tab.id }, files: ['inject-click-close-note.js'] });
      await new Promise((r) => setTimeout(r, 300));
      const closeResSpeech = await execScript({
        target: { tabId: tab.id },
        func: () => window.__clickCloseNoteResult
      });
      const closeDataSpeech = closeResSpeech && closeResSpeech[0] && closeResSpeech[0].result;
      if (!closeDataSpeech || !closeDataSpeech.success) {
        log('Overlap fix: close note soft-failed — ' + ((closeDataSpeech && closeDataSpeech.error) || 'CLOSE button not found') + ', continuing');
      }
      await new Promise((r) => setTimeout(r, OVERLAP_FIX_NOTE_STEP_MS));
      } finally { releaseFocusL3sp(); }

      const okSpeechThree = await completeOverlapFixWithIngest(
        btn,
        'speech',
        '3-line',
        fo,
        resultEl,
        '<p><strong>Done.</strong> Part 1: ' +
          escapeHtml(timeFrom) +
          ' – ' +
          escapeHtml(timeTo) +
          '. Line 2 (nonbillable): ' +
          escapeHtml(overlapFrom) +
          ' – ' +
          escapeHtml(overlapTo) +
          '. Line 3 (billable): ' +
          escapeHtml(part3From) +
          ' – ' +
          escapeHtml(part3To) +
          '. Note connected.</p>',
        'Overlap fix: note connected'
      );
      if (!okSpeechThree) return;
    }
  } catch (err) {
    const msg = err.message || 'Unknown error';
    resultEl.innerHTML = '';
    log('Overlap fix error: ' + msg);
    await progSpeech(msg, 'error');
    setOverlapFixButtonState(btn, 'error');
    setOverlapFixFailReason(btn, msg);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      // await clickTimesheetCancel(tab);  // temporarily disabled: don't close dialog on error
    } catch (e) {}
  }
}

document.body.addEventListener('click', async (e) => {
  const btn = e.target.closest('button.overlap-btn');
  if (!btn || btn.disabled) return;
  if (btn.getAttribute('data-fix-mode') === '97155-multi') {
    return runOverlapFix97155Multi(btn);
  }
  if (btn.getAttribute('data-fix-mode') === '97155') {
    return runOverlapFix97155(btn);
  }
  await runOverlapFixSpeech(btn, {});
});

/* ---------- AI Search ---------- */

const AI_SEARCH_SYSTEM_PROMPT = [
  'You are an expert billing data analyst.',
  '',
  'You will receive ONLY the table structure: column headers, keys, and a few sample rows.',
  'You will NOT receive the full dataset. Your job is to write a JavaScript filter function',
  'that will be executed locally against all the data.',
  '',
  'You will receive:',
  '1. "headers" - human-readable column names in display order.',
  '2. "keys" - the corresponding camelCase property keys on each row object.',
  '3. "sampleRows" - 2-3 example rows so you can see exact property names, value formats, and data patterns.',
  '4. "totalRows" - how many rows are in the full dataset.',
  '',
  'Core field names (always present):',
  '- date, time, client, payor, providers, labels, serviceAuth, location',
  '- hrs, units, billedRate (rate per unit), agreedRate (agreed rate, may be empty)',
  '- billedCharges (total billed), agreedCharges (total agreed, may be empty)',
  '- calcAdj, prAmt (patient responsibility), adj, paid, owed',
  'Additional dynamic columns may also exist (check the keys/sampleRows).',
  '',
  'Return ONLY a valid JSON object with these fields:',
  '{',
  '  "filterFn": "<javascript function body>",',
  '  "explanation": "<brief summary>",',
  '  "displayFields": ["<field1>", "<field2>", ...],',
  '  "groupMode": "single" | "pairs"',
  '}',
  '',
  'displayFields: array of property key names that are RELEVANT to this query.',
  'Only include fields the user cares about. Always include "client" and "date".',
  'For example, if the user asks about payor and service codes at the same time,',
  'include: ["client","date","time","serviceAuth","payor"].',
  'If they ask about agreed charges, include: ["client","date","serviceAuth","agreedCharges","billedCharges"].',
  '',
  'groupMode: how results should be displayed.',
  '- "single": each matching row shown individually (default for simple filters).',
  '- "pairs": results involve comparing two rows (e.g. overlapping times, concurrence',
  '  checks). The filterFn must then return a FLAT array of idx values where consecutive',
  '  pairs are related: [rowA1, rowB1, rowA2, rowB2, ...]. The UI will display each pair',
  '  side by side in one card so the user can compare them.',
  '',
  'filterFn rules:',
  '- Function body string. Takes (rows, parseTime). Returns array of idx values.',
  '- For groupMode "pairs": return idx values in consecutive pairs [a,b, a,b, ...].',
  '- rows is the full array of row objects. Each has "idx" plus all column properties.',
  '- parseTime("9:00am") returns minutes since midnight. Returns null if unparseable.',
  '- For time ranges like "9:00am-10:00am", split on "-" yourself.',
  '- Use ONLY plain ES5 JavaScript (var, for, function). No arrow functions, no let/const, no template literals.',
  '- Called as: new Function("rows","parseTime", filterFn)(rows, parseTime)',
  '- Dollar amounts may contain "$", ",", or be empty. Parse with: parseFloat((val||"").replace(/[^\\d.\\-]/g,""))',
  '',
  'Important rules:',
  '- ALWAYS use the property names visible in sampleRows. Do NOT guess field names.',
  '- "at the same time" / "overlapping" means time ranges overlap (startA < endB AND startB < endA).',
  '- Service codes are in serviceAuth, e.g. "97155 - Adaptive behavior treatment".',
  '- Match payor names case-insensitively with substring matching.',
  '- Group by client+date when comparing across rows for the same client/date.',
  '- "agreed" refers to agreedRate or agreedCharges. "billed" refers to billedRate or billedCharges.',
  '- The filter must handle ALL rows and return every matching idx.',
  '- Return ONLY the JSON object, no markdown fences, no extra text.'
].join('\n');

async function readBillingTableData(tab) {
  if (typeof window.SHELL !== 'undefined' && window.SHELL.runScript) {
    await window.SHELL.runScript('inject-read-billing-table');
    const results = await execScript({
      target: { tabId: tab.id },
      func: () => window.__billingTableData
    });
    return results && results[0] && results[0].result;
  }
  await execScript({ target: { tabId: tab.id }, files: ['inject-read-billing-table.js'] });
  const results = await execScript({
    target: { tabId: tab.id },
    func: () => window.__billingTableData
  });
  return results && results[0] && results[0].result;
}

async function callAnthropicAPI(apiKey, tableData, userQuery) {
  var rows = tableData.rows || [];
  var headers = tableData.headers || [];
  var keys = tableData.keys || [];

  var sampleRows = rows.slice(0, Math.min(3, rows.length));

  var userContent = 'Column headers: ' + JSON.stringify(headers) +
    '\nColumn keys: ' + JSON.stringify(keys) +
    '\nSample rows (' + sampleRows.length + ' of ' + rows.length + ' total):\n' + JSON.stringify(sampleRows, null, 1) +
    '\ntotalRows: ' + rows.length +
    '\n\nFind: ' + userQuery;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: AI_SEARCH_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: userContent
      }]
    })
  });
  if (!response.ok) {
    const errBody = await response.text();
    throw new Error('Anthropic API error ' + response.status + ': ' + errBody);
  }
  return response.json();
}

var FIELD_LABELS = {
  date: 'Date', time: 'Time', client: 'Client', payor: 'Payor',
  providers: 'Provider', labels: 'Labels', serviceAuth: 'Service',
  location: 'Location', hrs: 'Hrs', units: 'Units',
  billedRate: 'Rate', agreedRate: 'Agreed Rate',
  billedCharges: 'Billed', agreedCharges: 'Agreed',
  calcAdj: 'Calc Adj', prAmt: 'PR Amt', adj: 'Adj', paid: 'Paid', owed: 'Owed'
};

function _renderRowFields(r, fields) {
  if (!fields || fields.length === 0) {
    fields = ['client', 'date', 'time', 'serviceAuth', 'payor', 'providers'];
  }
  var html = '';
  var parts = [];
  for (var i = 0; i < fields.length; i++) {
    var key = fields[i];
    var val = r[key];
    if (val === undefined || val === null || val === '') continue;
    var label = FIELD_LABELS[key] || key;
    parts.push('<b>' + escapeHtml(label) + ':</b> ' + escapeHtml(val));
  }
  for (var i = 0; i < parts.length; i++) {
    html += '<div class="ai-result-item__line">' + parts[i] + '</div>';
  }
  return html;
}

function renderAISearchResults(allRows, matchIndices, explanation, displayFields, groupMode) {
  const resultEl = document.getElementById('ai-search-result');
  const listEl = document.getElementById('ai-search-list');
  resultEl.innerHTML = '';
  listEl.innerHTML = '';

  if (!displayFields || displayFields.length === 0) {
    displayFields = ['client', 'date', 'time', 'serviceAuth', 'payor'];
  }
  if (!groupMode) groupMode = 'single';

  const rowMap = {};
  allRows.forEach(function (r) { rowMap[r.idx] = r; });

  const uniqueIndices = [];
  const seen = {};
  matchIndices.forEach(function (idx) {
    if (!seen[idx]) { seen[idx] = true; uniqueIndices.push(idx); }
  });

  var resultCount;
  if (groupMode === 'pairs') {
    resultCount = Math.floor(matchIndices.length / 2);
  } else {
    resultCount = uniqueIndices.length;
  }

  const h3 = document.createElement('h3');
  h3.textContent = resultCount + ' result' + (resultCount !== 1 ? 's' : '') + ' found';
  resultEl.appendChild(h3);

  if (explanation) {
    const p = document.createElement('p');
    p.className = 'ai-summary';
    p.textContent = explanation;
    resultEl.appendChild(p);
  }

  if (resultCount === 0) return;

  const list = document.createElement('ul');
  list.className = 'overlap-list';

  if (groupMode === 'pairs') {
    for (var i = 0; i + 1 < matchIndices.length; i += 2) {
      var rA = rowMap[matchIndices[i]];
      var rB = rowMap[matchIndices[i + 1]];
      if (!rA && !rB) continue;

      var li = document.createElement('li');
      li.className = 'overlap-list__item ai-result-item ai-result-pair';
      var html = '';
      if (rA) {
        html += '<div class="ai-pair-row">' + _renderRowFields(rA, displayFields) + '</div>';
      }
      html += '<div class="ai-pair-vs">vs</div>';
      if (rB) {
        html += '<div class="ai-pair-row">' + _renderRowFields(rB, displayFields) + '</div>';
      }
      li.innerHTML = html;
      list.appendChild(li);
    }
  } else {
    uniqueIndices.forEach(function (idx) {
      var r = rowMap[idx];
      if (!r) return;
      var li = document.createElement('li');
      li.className = 'overlap-list__item ai-result-item';
      li.innerHTML = _renderRowFields(r, displayFields);
      list.appendChild(li);
    });
  }

  listEl.appendChild(list);
}

async function runAISearch() {
  const resultEl = document.getElementById('ai-search-result');
  const listEl = document.getElementById('ai-search-list');
  const input = document.getElementById('ai-search-input');
  const query = (input && input.value || '').trim();

  if (!query) {
    resultEl.innerHTML = '<p>Please enter a search query.</p>';
    listEl.innerHTML = '';
    return;
  }

  resultEl.innerHTML = '<p>Reading billing table...</p>';
  listEl.innerHTML = '';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      resultEl.innerHTML = '<p>No active tab.</p>';
      return;
    }
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
      resultEl.innerHTML = '<p>Cannot run on this page.</p>';
      return;
    }

    await resetPageHighlightsAndFilter();

    const data = await readBillingTableData(tab);
    if (!data || data.error) {
      resultEl.innerHTML = '<p>' + escapeHtml((data && data.error) || 'No billing table found on this page.') + '</p>';
      return;
    }

    const rows = data.rows || [];
    if (rows.length === 0) {
      resultEl.innerHTML = '<p>Billing table is empty (0 rows).</p>';
      return;
    }

    await _ensureSettingsLoaded();
    const saved = getSavedSearches().find(s => s.query.toLowerCase() === query.toLowerCase());
    let matchIndices, explanation, filterFn;
    let displayFields = [];
    let groupMode = 'single';

    if (saved && saved.filterFn) {
      log('AI Search: running saved filter on ' + rows.length + ' rows');
      resultEl.innerHTML = '<p>Running saved filter (' + rows.length + ' rows)...</p>';
      const localResult = runSavedFilter(rows, saved.filterFn);
      if (localResult !== null) {
        matchIndices = localResult;
        explanation = 'Saved search (no AI call)';
        filterFn = saved.filterFn;
        displayFields = Array.isArray(saved.displayFields) ? saved.displayFields : [];
        groupMode = saved.groupMode || 'single';
      } else {
        log('Saved filter failed, falling back to AI');
        matchIndices = null;
      }
    }

    if (matchIndices == null) {
      const apiKey = getAnthropicApiKey();
      if (!apiKey) {
        resultEl.innerHTML = '<p>No Anthropic API key set. Open Settings (gear icon) and add your key.</p>';
        listEl.innerHTML = '';
        return;
      }
      log('AI Search: ' + rows.length + ' rows, querying AI for filter...');
      resultEl.innerHTML = '<p>Querying AI for filter function...</p>';

      const apiResponse = await callAnthropicAPI(apiKey, data, query);
      const textBlock = (apiResponse.content || []).find(b => b.type === 'text');
      const rawText = textBlock ? textBlock.text : '';

      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch (e) {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('AI returned invalid JSON: ' + rawText.slice(0, 200));
        }
      }

      filterFn = (typeof parsed.filterFn === 'string') ? parsed.filterFn : '';
      explanation = parsed.explanation || '';
      displayFields = Array.isArray(parsed.displayFields) ? parsed.displayFields : [];
      groupMode = (parsed.groupMode === 'pairs') ? 'pairs' : 'single';

      if (!filterFn) {
        throw new Error('AI did not return a filter function.');
      }

      resultEl.innerHTML = '<p>Running filter on ' + rows.length + ' rows...</p>';
      matchIndices = runSavedFilter(rows, filterFn);
      if (matchIndices === null) {
        throw new Error('Filter function returned an error. Try rephrasing your query.');
      }
    }

    log('AI Search: ' + matchIndices.length + ' matches, mode=' + groupMode);
    renderAISearchResults(rows, matchIndices, explanation, displayFields, groupMode);

    _lastSuccessfulQuery = query;
    _lastFilterFn = filterFn;
    _lastMatchIndices = matchIndices;
    _lastDisplayFields = displayFields;
    _lastGroupMode = groupMode;
    const saveBtn = document.getElementById('ai-save-search-btn');
    if (saveBtn) {
      const already = getSavedSearches().some(s => s.query.toLowerCase() === query.toLowerCase());
      saveBtn.style.display = already ? 'none' : '';
    }
    const filterBtn = document.getElementById('ai-filter-btn');
    if (filterBtn) filterBtn.style.display = matchIndices.length > 0 ? '' : 'none';
    const resetBtn = document.getElementById('ai-reset-page-btn');
    if (resetBtn) resetBtn.style.display = 'none';
    const hlBtn = document.getElementById('ai-highlight-toggle');
    if (hlBtn) hlBtn.style.display = matchIndices.length > 0 ? '' : 'none';

    _lastUsedCols = _detectUsedColumns(filterFn, data.keys || []);

    if (matchIndices.length > 0) {
      var hlToggle = document.getElementById('ai-highlight-toggle');
      if (!hlToggle || hlToggle.classList.contains('active')) {
        await highlightRowsOnPage(matchIndices, _lastUsedCols);
      }
    }
  } catch (e) {
    log('AI Search error: ' + e.message);
    resultEl.innerHTML = '<p>Error: ' + escapeHtml(e.message) + '</p>';
    listEl.innerHTML = '';
  }
}

/* Saved searches: { query: string, filterFn: string }[] */
function getSavedSearches() {
  const s = loadSettings();
  if (!s || !Array.isArray(s.savedSearches)) return [];
  return s.savedSearches.map(function (item) {
    if (typeof item === 'string') return { query: item, filterFn: '' };
    return item;
  });
}

let _savedDropdownSelectedIdx = -1;

function _populateSavedSearchDropdown() {
  const trigger = document.getElementById('ai-saved-trigger');
  const dropdown = document.getElementById('ai-saved-dropdown');
  if (!trigger || !dropdown) return;
  const searches = getSavedSearches();
  _savedDropdownSelectedIdx = -1;
  trigger.textContent = '-- saved searches (' + searches.length + ') --';
  dropdown.innerHTML = '';
  if (searches.length === 0) {
    dropdown.innerHTML = '<div class="ai-saved-dropdown-empty">No saved searches yet</div>';
    return;
  }
  searches.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'ai-saved-dropdown-item';
    div.setAttribute('data-idx', String(i));
    div.textContent = item.query || '';
    div.addEventListener('click', () => {
      _savedDropdownSelectedIdx = i;
      trigger.textContent = item.query || '';
      document.getElementById('ai-search-input').value = item.query || '';
      dropdown.classList.remove('open');
      dropdown.querySelectorAll('.ai-saved-dropdown-item').forEach(el => el.classList.remove('selected'));
      div.classList.add('selected');
    });
    dropdown.appendChild(div);
  });
}

function _parseTimeMins(s) {
  if (!s || typeof s !== 'string') return null;
  s = s.trim().toLowerCase().replace(/\s+(cst|cdt|est|edt|pst|pdt|utc)$/i, '').trim();
  var hasP = /p|pm/.test(s);
  var hasA = /a|am/.test(s);
  var num = s.replace(/[^\d]/g, '');
  if (!num.length) return null;
  var h, m;
  if (num.length <= 2) { h = parseInt(num, 10); m = 0; }
  else { h = parseInt(num.slice(0, -2), 10); m = parseInt(num.slice(-2), 10); }
  if (h === 12 && hasA) h = 0;
  else if (h !== 12 && hasP) h += 12;
  return h * 60 + m;
}

function runSavedFilter(rows, filterFn) {
  try {
    var fn = new Function('rows', 'parseTime', filterFn);
    return fn(rows, _parseTimeMins);
  } catch (e) {
    console.warn('[AI Search] saved filter error:', e);
    return null;
  }
}

let _lastSuccessfulQuery = '';
let _lastFilterFn = '';
let _lastMatchIndices = [];
let _lastUsedCols = [];
let _lastDisplayFields = [];
let _lastGroupMode = 'single';

function _detectUsedColumns(filterFn, allKeys) {
  if (!filterFn) return [];
  var totalCols = (allKeys && allKeys.length) ? allKeys.length : 30;
  var KNOWN_POS = {
    date: 6, time: 7, client: 8, payor: 9, providers: 10,
    labels: 11, serviceAuth: 12, location: 13,
    hrs: 14, units: 15, billedRate: 16, agreedRate: 17
  };
  var KNOWN_FROM_END = {
    owed: 2, paid: 3, adj: 4, prAmt: 5, calcAdj: 6, agreedCharges: 7, billedCharges: 8
  };
  var used = {};
  for (var name in KNOWN_POS) {
    if (filterFn.indexOf(name) >= 0) {
      used[KNOWN_POS[name]] = true;
    }
  }
  for (var name in KNOWN_FROM_END) {
    if (filterFn.indexOf(name) >= 0) {
      var resolved = totalCols - KNOWN_FROM_END[name];
      if (resolved >= 0) used[resolved] = true;
    }
  }
  if (allKeys && allKeys.length) {
    for (var i = 0; i < allKeys.length; i++) {
      var k = allKeys[i];
      if (k && filterFn.indexOf(k) >= 0) used[i] = true;
    }
  }
  return Object.keys(used).map(Number);
}

async function highlightRowsOnPage(indices, columnIndices) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    await execScript({
      target: { tabId: tab.id },
      func: (matchIdxs, colIdxs) => {
        function findTable() {
          var tables = document.querySelectorAll('table');
          for (var i = 0; i < tables.length; i++) {
            var t = tables[i];
            var header = t.querySelector('thead th, tr th');
            if (header && (t.textContent || '').includes('Date') && (t.textContent || '').includes('Time')) {
              return t;
            }
          }
          return document.querySelector('table') || null;
        }
        var table = findTable();
        if (!table) return;

        if (colIdxs && colIdxs.length > 0) {
          var allTrs = table.querySelectorAll('tr');
          var headerRow = null;
          for (var r = 0; r < allTrs.length; r++) {
            if (allTrs[r].querySelectorAll('th').length > 5) { headerRow = allTrs[r]; break; }
          }
          if (headerRow) {
            var ths = headerRow.querySelectorAll('th');
            var colSet = new Set(colIdxs);
            for (var h = 0; h < ths.length; h++) {
              if (colSet.has(h)) {
                ths[h].style.setProperty('background-color', '#bfdbfe', 'important');
                ths[h].style.setProperty('border-bottom', '3px solid #3b82f6', 'important');
                ths[h].setAttribute('data-ai-highlight-col', '1');
              }
            }
          }
        }

        var tbody = table.querySelector('tbody');
        if (!tbody) return;
        var trs = Array.from(tbody.querySelectorAll('tr')).filter(function (tr) {
          return tr.querySelectorAll('td').length >= 6;
        });
        var set = new Set(matchIdxs);
        for (var i = 0; i < trs.length; i++) {
          if (set.has(i)) {
            trs[i].style.setProperty('background-color', '#fef08a', 'important');
            trs[i].setAttribute('data-ai-highlight', '1');
          }
        }
        if (matchIdxs.length > 0 && trs[matchIdxs[0]]) {
          trs[matchIdxs[0]].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      },
      args: [indices, columnIndices || []]
    });
    log('Highlighted ' + indices.length + ' rows' + (columnIndices && columnIndices.length ? ', ' + columnIndices.length + ' columns' : ''));
  } catch (e) {
    log('Highlight error: ' + e.message);
  }
}

async function clearHighlightsOnly() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    await execScript({
      target: { tabId: tab.id },
      func: () => {
        document.querySelectorAll('tr[data-ai-highlight]').forEach(function (tr) {
          tr.style.removeProperty('background-color');
          tr.removeAttribute('data-ai-highlight');
        });
        document.querySelectorAll('[data-ai-highlight-col]').forEach(function (th) {
          th.style.removeProperty('background-color');
          th.style.removeProperty('border-bottom');
          th.removeAttribute('data-ai-highlight-col');
        });
      }
    });
    log('Cleared highlights');
  } catch (e) {
    log('Clear highlights error: ' + e.message);
  }
}

async function resetPageHighlightsAndFilter() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    await execScript({
      target: { tabId: tab.id },
      func: () => {
        document.querySelectorAll('tr[data-ai-highlight]').forEach(function (tr) {
          tr.style.removeProperty('background-color');
          tr.removeAttribute('data-ai-highlight');
        });
        document.querySelectorAll('tr[data-ai-hidden]').forEach(function (tr) {
          tr.style.removeProperty('display');
          tr.removeAttribute('data-ai-hidden');
        });
        document.querySelectorAll('[data-ai-highlight-col]').forEach(function (th) {
          th.style.removeProperty('background-color');
          th.style.removeProperty('border-bottom');
          th.removeAttribute('data-ai-highlight-col');
        });
      }
    });
    log('Reset page');
  } catch (e) {
    log('Reset page error: ' + e.message);
  }
}

async function filterPageRows(indices) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    await execScript({
      target: { tabId: tab.id },
      func: (matchIdxs) => {
        function findTable() {
          var tables = document.querySelectorAll('table');
          for (var i = 0; i < tables.length; i++) {
            var t = tables[i];
            var header = t.querySelector('thead th, tr th');
            if (header && (t.textContent || '').includes('Date') && (t.textContent || '').includes('Time')) {
              var tbody = t.querySelector('tbody');
              if (tbody && tbody.querySelectorAll('tr').length > 0) return tbody;
            }
          }
          return document.querySelector('table tbody') || null;
        }
        var tbody = findTable();
        if (!tbody) return;
        var trs = Array.from(tbody.querySelectorAll('tr')).filter(function (tr) {
          return tr.querySelectorAll('td').length >= 6;
        });
        var set = new Set(matchIdxs);
        for (var i = 0; i < trs.length; i++) {
          if (!set.has(i)) {
            trs[i].style.setProperty('display', 'none', 'important');
            trs[i].setAttribute('data-ai-hidden', '1');
          }
        }
      },
      args: [indices]
    });
    log('Filtered page: showing ' + indices.length + ' rows');
  } catch (e) {
    log('Filter error: ' + e.message);
  }
}

document.getElementById('ai-filter-btn').addEventListener('click', async () => {
  if (_lastMatchIndices.length > 0) {
    await filterPageRows(_lastMatchIndices);
    document.getElementById('ai-reset-page-btn').style.display = '';
  }
});

document.getElementById('ai-reset-page-btn').addEventListener('click', async () => {
  await resetPageHighlightsAndFilter();
  document.getElementById('ai-reset-page-btn').style.display = 'none';
});

document.getElementById('ai-highlight-toggle').addEventListener('click', async (e) => {
  var btn = e.currentTarget;
  var isActive = btn.classList.toggle('active');
  if (isActive) {
    if (_lastMatchIndices.length > 0) {
      await highlightRowsOnPage(_lastMatchIndices, _lastUsedCols);
    }
  } else {
    await clearHighlightsOnly();
  }
});

document.getElementById('ai-search-btn').addEventListener('click', () => {
  runAISearch();
});

document.getElementById('ai-search-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    runAISearch();
  }
});

document.getElementById('ai-saved-trigger').addEventListener('click', () => {
  const dropdown = document.getElementById('ai-saved-dropdown');
  if (dropdown) dropdown.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  const trigger = document.getElementById('ai-saved-trigger');
  const dropdown = document.getElementById('ai-saved-dropdown');
  if (!dropdown || !trigger) return;
  if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});

document.getElementById('ai-save-search-btn').addEventListener('click', () => {
  const query = _lastSuccessfulQuery.trim();
  if (!query) return;
  const searches = getSavedSearches();
  if (searches.some(s => s.query.toLowerCase() === query.toLowerCase())) return;
  searches.push({ query: query, filterFn: _lastFilterFn, displayFields: _lastDisplayFields, groupMode: _lastGroupMode });
  saveSettings({ savedSearches: searches });
  _populateSavedSearchDropdown();
  const btn = document.getElementById('ai-save-search-btn');
  if (btn) btn.style.display = 'none';
});

document.getElementById('ai-saved-delete').addEventListener('click', () => {
  const idx = _savedDropdownSelectedIdx;
  if (idx < 0) return;
  const searches = getSavedSearches();
  if (idx >= 0 && idx < searches.length) {
    searches.splice(idx, 1);
    saveSettings({ savedSearches: searches });
    _populateSavedSearchDropdown();
  }
});

_ensureSettingsLoaded().then(() => _populateSavedSearchDropdown());

/* ---------- BCBA Directory ---------- */
const BCBA_CONTACTS_LIST_HASH = '#contacts/?contactLabelIdIncluded=1015524';

async function navigateHash(tabId, fullHash) {
  var h = fullHash.indexOf('#') === 0 ? fullHash : '#' + fullHash;
  await execScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: (hash) => {
      window.location.hash = hash;
    },
    args: [h]
  });
}

async function runNamedInjectAndPoll(tabId, scriptName, globalName, maxMs) {
  await execScript({
    target: { tabId: tabId },
    func: (name) => {
      window[name] = null;
    },
    args: [globalName]
  });
  if (typeof window.SHELL !== 'undefined' && window.SHELL.runScript) {
    try {
      await window.SHELL.runScript(scriptName);
    } catch (e) {
      /* fall through to files */
    }
  }
  try {
    await execScript({
      target: { tabId: tabId },
      files: [scriptName + '.js']
    });
  } catch (e2) {
    /* SHELL path may already have run it */
  }
  return pollForInjectResult(tabId, globalName, maxMs || 120000, 400);
}

function renderBcbaDirectory(directory, statusEl, resultEl) {
  if (!directory || !directory.length) {
    resultEl.innerHTML = '<p>No BCBAs found.</p>';
    return;
  }
  var html = '<p><strong>' + directory.length + '</strong> BCBA(s)</p>';
  for (var i = 0; i < directory.length; i++) {
    var bcba = directory[i];
    var clients = bcba.clients || [];
    html +=
      '<details open>' +
      '<summary>' +
      escapeHtml(bcba.name || 'BCBA') +
      ' <span style="font-weight:500;color:#64748b">(' +
      escapeHtml(String(bcba.id || '')) +
      ') — ' +
      clients.length +
      ' client(s)</span></summary>';
    if (bcba.error) {
      html += '<p style="color:#b91c1c">' + escapeHtml(bcba.error) + '</p>';
    } else if (!clients.length) {
      html += '<p style="color:#64748b">No connected clients.</p>';
    } else {
      html += '<ul>';
      for (var j = 0; j < clients.length; j++) {
        var c = clients[j];
        html +=
          '<li>' +
          escapeHtml(c.name || '') +
          ' <span style="color:#64748b">(ID: ' +
          escapeHtml(String(c.id || '')) +
          (c.type ? ' · ' + escapeHtml(c.type) : '') +
          (c.status ? ' · ' + escapeHtml(c.status) : '') +
          ')</span></li>';
      }
      html += '</ul>';
    }
    html += '</details>';
  }
  resultEl.innerHTML = html;
}

async function runBcbaDirectory() {
  var statusEl = document.getElementById('bcba-directory-status');
  var resultEl = document.getElementById('bcba-directory-result');
  var btn = document.getElementById('bcba-directory-btn');
  if (!statusEl || !resultEl) return;
  if (btn) btn.disabled = true;
  resultEl.innerHTML = '';
  try {
    var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    var tab = tabs && tabs[0];
    if (!tab || !tab.id) throw new Error('No active tab.');
    if (!(tab.url || '').startsWith('https://members.centralreach.com')) {
      throw new Error('Open CentralReach (members.centralreach.com) first.');
    }

    statusEl.textContent = 'Opening BCBA contacts list…';
    await navigateHash(tab.id, BCBA_CONTACTS_LIST_HASH);
    await new Promise(function (r) {
      setTimeout(r, 2000);
    });

    statusEl.textContent = 'Scraping BCBA list…';
    var listRes = await runNamedInjectAndPoll(
      tab.id,
      'inject-read-contacts-list',
      '__contactsListResult',
      90000
    );
    if (!listRes || !listRes.success) {
      throw new Error((listRes && listRes.error) || 'Could not read BCBA contacts list.');
    }
    var contacts = listRes.contacts || [];
    if (!contacts.length) throw new Error('No BCBAs found on the contacts list.');

    var directory = [];
    for (var i = 0; i < contacts.length; i++) {
      var bcba = contacts[i];
      statusEl.textContent =
        'Connected clients ' + (i + 1) + '/' + contacts.length + ': ' + (bcba.name || bcba.id) + '…';
      var detailHash =
        '#contacts/details/?id=' + encodeURIComponent(bcba.id) + '&mode=profile&edit=connected-clients';
      await navigateHash(tab.id, detailHash);
      await new Promise(function (r) {
        setTimeout(r, 1800);
      });
      var clientsRes = await runNamedInjectAndPoll(
        tab.id,
        'inject-read-connected-clients',
        '__connectedClientsResult',
        180000
      );
      if (!clientsRes || !clientsRes.success) {
        directory.push({
          id: bcba.id,
          name: bcba.name,
          clients: [],
          error: (clientsRes && clientsRes.error) || 'Failed to read connected clients'
        });
      } else {
        directory.push({
          id: bcba.id,
          name: bcba.name,
          clients: clientsRes.clients || []
        });
      }
    }

    statusEl.textContent = 'Done — ' + directory.length + ' BCBA(s).';
    renderBcbaDirectory(directory, statusEl, resultEl);
    log('BCBA Directory: ' + directory.length + ' BCBAs scraped.');
  } catch (e) {
    var msg = (e && e.message) || String(e);
    statusEl.textContent = 'Error: ' + msg;
    resultEl.innerHTML = '<p style="color:#b91c1c">' + escapeHtml(msg) + '</p>';
    log('BCBA Directory error: ' + msg);
  } finally {
    if (btn) btn.disabled = false;
  }
}

(function initBcbaDirectory() {
  var btn = document.getElementById('bcba-directory-btn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    runBcbaDirectory();
  });
})();

// Tab bar: Concurrences / BCBA reports / RBT reports (CSP-safe, no inline script)
(function initTabs() {
  const tabBar = document.querySelector('.tab-bar');
  const panels = {
    'bcba-reports': document.getElementById('panel-bcba-reports'),
    'rbt-reports': document.getElementById('panel-rbt-reports'),
    auto: document.getElementById('panel-auto'),
    manual: document.getElementById('panel-manual'),
    'ai-search': document.getElementById('panel-ai-search')
  };
  if (!tabBar) return;

  const disabledPanels = {};
  if (!ENABLE_MANUAL_MODE) disabledPanels['manual'] = true;
  if (!ENABLE_AI_SEARCH_MODE) disabledPanels['ai-search'] = true;

  tabBar.querySelectorAll('.tab').forEach((t) => {
    const id = t.getAttribute('data-panel');
    if (disabledPanels[id] || t.hasAttribute('hidden')) {
      t.style.display = 'none';
      if (panels[id]) panels[id].style.display = 'none';
    }
  });
  // AI Search is not offered in Hidden Lights — keep DOM for shared code, hide panel.
  if (panels['ai-search']) panels['ai-search'].style.display = 'none';

  const visibleTabs = Array.from(tabBar.querySelectorAll('.tab')).filter(t => t.style.display !== 'none');
  if (visibleTabs.length <= 1) {
    tabBar.style.display = 'none';
  }

  const tabs = tabBar.querySelectorAll('.tab');

  function showPanel(panelId) {
    tabs.forEach((t) => {
      const isActive = t.getAttribute('data-panel') === panelId;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    Object.keys(panels).forEach((key) => {
      if (panels[key]) panels[key].classList.toggle('active', key === panelId);
    });
  }

  tabBar.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab || tab.style.display === 'none' || tab.hasAttribute('hidden')) return;
    e.preventDefault();
    e.stopPropagation();
    const panelId = tab.getAttribute('data-panel');
    if (panelId) showPanel(panelId);
    return false;
  }, true);
})();

(function initPanelDiagnostics() {
  if (typeof window.SHELL === 'undefined' || !window.SHELL.runScript || window.SHELL.__cfRunScriptHooked) return;
  window.SHELL.__cfRunScriptHooked = true;
  var orig = window.SHELL.runScript.bind(window.SHELL);
  window.SHELL.runScript = function (name, returnGlobal) {
    return orig(name, returnGlobal).then(function (res) {
      var hasDebug = res && typeof res === 'object' && res.debug != null;
      var line =
        '[POEL runScript] ' +
        name +
        ' success=' +
        (res && res.success) +
        ' skipped=' +
        (res && res.skipped) +
        ' clicked=' +
        (res && res.clicked) +
        ' hasDebug=' +
        hasDebug +
        (res && res.error ? ' hasError=1' : '');
      try {
        log(line);
      } catch (e) {
        console.log('[Hidden Lights]', line);
      }
      return res;
    });
  };
})();

/**
 * RBT reports (ported from Hidden Light standalone extension).
 * IDs are prefixed with rbt- to avoid collisions with Concurrences UI.
 */
(function initHiddenLightsRbtReports() {
  if (!document.getElementById('rbt-btn-run-main')) return;

  function rbtWaitTabComplete(tabId, timeoutMs) {
    var ms = timeoutMs != null ? timeoutMs : 10000;
    if (typeof window.SHELL !== 'undefined' && window.SHELL.waitTabComplete) {
      return window.SHELL.waitTabComplete(tabId, ms);
    }
    var deadline = Date.now() + ms;
    return (async function () {
      while (Date.now() < deadline) {
        try {
          var t = await chrome.tabs.get(tabId);
          if (t && t.status === 'complete') return;
        } catch (e) {}
        await new Promise(function (r) { setTimeout(r, 250); });
      }
    })();
  }

  function rbtDownloadBlob(blob, baseFilename, rowCount) {
    try {
      if (chrome.downloads && typeof chrome.downloads.download === 'function') {
        var reader = new FileReader();
        reader.onload = function () {
          var b64 = reader.result.split(',')[1];
          chrome.downloads.download({
            url: 'data:application/pdf;base64,' + b64,
            filename: baseFilename,
            saveAs: false
          }, function () {
            if (chrome.runtime.lastError) {
              setStatus('Download failed: ' + chrome.runtime.lastError.message, true);
            } else {
              setStatus('Exported ' + rowCount + ' rows to Downloads/' + baseFilename);
            }
          });
        };
        reader.readAsDataURL(blob);
        return;
      }
    } catch (e) {}
    try {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = baseFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      setStatus('Exported ' + rowCount + ' rows as ' + baseFilename);
    } catch (e2) {
      setStatus('Download failed: ' + (e2 && e2.message ? e2.message : e2), true);
    }
  }

/**
 * Sidepanel UI: sends messages to the active tab's content script.
 */
const statusEl = document.getElementById('rbt-status');
const PDF_FORM_KEYS = ['rbt-pdf-client-name', 'rbt-pdf-dob', 'rbt-pdf-authorized-hours'];
const SETTINGS_KEYS = ['rbt-settings-low-util-threshold', 'rbt-settings-unfound-folder', 'rbt-settings-auth-selection'];
const RUN_FULL_KEYS = ['rbt-run-start-date', 'rbt-run-stop-date', 'rbt-run-contact-id', 'rbt-run-service-code'];

const RUN_FULL_DEFAULTS = {
  'rbt-run-start-date': '08/04/2025',
  'rbt-run-stop-date': '02/04/26',
  'rbt-run-contact-id': '3792429',
  'rbt-run-service-code': 'all'
};

/** Service codes for dropdown; when "All" is selected, report runs for each of these. */
const SERVICE_CODES = ['97153 tx', '97155 tx t', '97156 tx t'];

/** Set by Load Contact Info: hours per service code from auth breakdown. Used by Run Full Report when service is "all". */
let loadedHoursByCode = {};

/** Queue: array of { name, url }. Persisted to storage. */
const QUEUE_STORAGE_KEY = 'hidden_lights_rbt_report_queue';
let reportQueue = [];

/** FileSystemDirectoryHandle for Clients base folder. Persisted in IndexedDB. */
let customSaveDirHandle = null;

const IDB_NAME = 'HiddenLightsRbtReports';
const IDB_STORE = 'storage';
const DIR_HANDLE_KEY = 'clientsFolder';

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      if (!e.target.result.objectStoreNames.contains(IDB_STORE)) {
        e.target.result.createObjectStore(IDB_STORE);
      }
    };
  });
}

async function saveDirHandleToStorage(handle) {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.put(handle, DIR_HANDLE_KEY);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  } catch (e) {
    console.warn('[CentralReach Helper] Could not save folder to storage:', e);
  }
}

async function loadDirHandleFromStorage() {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(DIR_HANDLE_KEY);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result || null);
    });
  } catch (e) {
    return null;
  }
}

async function clearDirHandleFromStorage() {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const req = tx.objectStore(IDB_STORE).delete(DIR_HANDLE_KEY);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  } catch (e) {
    console.warn('[CentralReach Helper] Could not clear folder from storage:', e);
  }
}
let queueLoadInProgress = true;

const AUTH_UTIL_FOLDER = 'Auth Utilization';

/** Cache so multiple PDFs for same client in one run share the same DS folder. */
let cachedSaveDir = null;
let cachedSaveDirClient = null;

/** True if any PDF in the current run used Unfound Clients folder. */
let queueRunUsedUnfound = false;

/** True if any PDF fell back to Downloads (File System API failed). */
let queueRunUsedFallback = false;

function clearSaveDirCache() {
  cachedSaveDir = null;
  cachedSaveDirClient = null;
}

function requireFolderChosen() {
  if (!customSaveDirHandle) {
    setStatus('Choose the Clients folder above first.', true);
    return false;
  }
  return true;
}

function clearSaveLog() {
  const el = document.getElementById('rbt-save-log');
  if (el) el.textContent = '';
}

function loadQueue() {
  queueLoadInProgress = true;
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.get(QUEUE_STORAGE_KEY, (o) => {
      if (queueLoadInProgress) {
        reportQueue = Array.isArray(o[QUEUE_STORAGE_KEY]) ? o[QUEUE_STORAGE_KEY] : [];
      }
      queueLoadInProgress = false;
      renderQueue();
      updateMainButton();
    });
    return;
  }
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    reportQueue = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(reportQueue)) reportQueue = [];
  } catch (e) {
    reportQueue = [];
  }
  queueLoadInProgress = false;
  renderQueue();
  updateMainButton();
}

function saveQueue() {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.set({ [QUEUE_STORAGE_KEY]: reportQueue });
  } else {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(reportQueue));
    } catch (e) { /* ignore */ }
  }
  queueLoadInProgress = false;
  renderQueue();
  updateMainButton();
}

function renderQueue() {
  const el = document.getElementById('rbt-queue-list');
  if (!el) return;
  if (reportQueue.length === 0) {
    el.innerHTML = '<div class="queue-empty-msg">No contacts in queue</div>';
    return;
  }
  el.innerHTML = reportQueue.map((item, i) => {
    const name = String(item.name || 'Unknown').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    return '<div class="queue-item" data-index="' + i + '">' +
      '<span>' + name + '</span>' +
      '<span class="queue-remove" data-index="' + i + '" title="Remove">×</span>' +
    '</div>';
  }).join('');
  el.querySelectorAll('.queue-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      reportQueue.splice(idx, 1);
      saveQueue();
    });
  });
}

function updateMainButton() {
  const btn = document.getElementById('rbt-btn-run-main');
  if (!btn) return;
  btn.textContent = reportQueue.length > 0 ? 'Run the queue' : 'Generate report for only the Current Contact';
}

function loadFormValues() {
  const cfg = typeof CENTRALREACH_SELECTORS !== 'undefined' ? CENTRALREACH_SELECTORS : {};
  const runDefaults = {
    'rbt-run-start-date': (cfg.runAll && cfg.runAll.dateFrom) || RUN_FULL_DEFAULTS['rbt-run-start-date'],
    'rbt-run-stop-date': (cfg.runAll && cfg.runAll.dateTo) || RUN_FULL_DEFAULTS['rbt-run-stop-date'],
    'rbt-run-contact-id': cfg.defaultContactId || RUN_FULL_DEFAULTS['rbt-run-contact-id'],
    'rbt-run-service-code': cfg.defaultServiceCode || RUN_FULL_DEFAULTS['rbt-run-service-code']
  };
  RUN_FULL_KEYS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = runDefaults[id] || '';
  });
  function applyStored(stored) {
    PDF_FORM_KEYS.forEach((id) => {
      const el = document.getElementById(id);
      if (el && stored[id] != null && String(stored[id]).trim() !== '') el.value = stored[id];
    });
    SETTINGS_KEYS.forEach((id) => {
      const el = document.getElementById(id);
      if (el && stored[id] != null) el.value = stored[id];
    });
  }
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.get([...PDF_FORM_KEYS, ...SETTINGS_KEYS], (stored) => {
      applyStored(stored || {});
    });
  } else {
    try {
      const raw = localStorage.getItem('hidden_lights_rbt_form');
      if (raw) applyStored(JSON.parse(raw) || {});
    } catch (e) { /* ignore */ }
  }
}

function savePdfFormToStorage() {
  const obj = {};
  PDF_FORM_KEYS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) obj[id] = el.value || '';
  });
  RUN_FULL_KEYS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) obj[id] = el.value || '';
  });
  SETTINGS_KEYS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) obj[id] = el.value || '';
  });
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.set(obj);
  } else {
    try {
      localStorage.setItem('hidden_lights_rbt_form', JSON.stringify(obj));
    } catch (e) { /* ignore */ }
  }
}
const REPORTING_URL = 'https://members.centralreach.com/#reporting/104';

function setStatus(text, isError = false) {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.style.color = isError ? '#e08080' : '#888';
}

function appendLog(text) {
  const el = document.getElementById('rbt-save-log');
  if (!el) return;
  const line = '[' + new Date().toLocaleTimeString() + '] ' + text;
  el.textContent = (el.textContent ? el.textContent + '\n' : '') + line;
  el.scrollTop = el.scrollHeight;
}

function showQueueSummary(results) {
  if (!results || results.length === 0) return;
  appendLog('');
  appendLog('——— Queue complete ———');
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const name = (r.clientName || 'Unknown').trim() || 'Unknown';
    const reports = r.reports || [];
    const list = reports.length > 0 ? reports.join(', ') : '(none)';
    appendLog(name + ': ' + list);
  }
  if (queueRunUsedFallback) {
    appendLogRed('Some PDFs saved to Downloads folder (folder access had expired).');
  }
  if (queueRunUsedUnfound) {
    appendLogRed('Some clients were saved to the Unfound Clients folder (no matching client folder).');
  }
  appendLog('——— End summary ———');
}

function appendLogRed(text) {
  const el = document.getElementById('rbt-save-log');
  if (!el) return;
  const line = '[' + new Date().toLocaleTimeString() + '] ';
  const span = document.createElement('span');
  span.style.color = '#c93434';
  span.textContent = text;
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(line));
  div.appendChild(span);
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function normalizeForMatch(s) {
  return (s || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

/** Resolves Clients base -> client folder -> Auth Utilization -> next DS folder. Returns { dirHandle, logPath }. Caches per client so multiple PDFs in one run share the same DS folder. */
async function getSaveDirectoryForClient(clientName) {
  if (!customSaveDirHandle) return null;
  const name = (clientName || '').trim() || 'Pt';
  if (cachedSaveDirClient === name && cachedSaveDir) {
    return cachedSaveDir;
  }
  const unfoundName = (document.getElementById('rbt-settings-unfound-folder')?.value || 'Unfound Clients').trim() || 'Unfound Clients';
  const clientNorm = normalizeForMatch(name);

  let clientDirHandle = null;
  let usedFolderName = '';

  try {
    const entries = [];
    for await (const [name, handle] of customSaveDirHandle.entries()) {
      if (handle.kind === 'directory') entries.push({ name, handle });
    }

    const exact = entries.find((e) => normalizeForMatch(e.name) === clientNorm);
    if (exact) {
      clientDirHandle = exact.handle;
      usedFolderName = exact.name;
      appendLog('Found client folder: "' + usedFolderName + '"');
    } else {
      const partial = entries.find((e) => {
        const fn = normalizeForMatch(e.name);
        return fn && clientNorm && (fn.includes(clientNorm) || clientNorm.includes(fn));
      });
      if (partial) {
        clientDirHandle = partial.handle;
        usedFolderName = partial.name;
        appendLog('Matched client folder: "' + usedFolderName + '"');
      }
    }

    if (!clientDirHandle) {
      const safeName = (name || 'Pt').replace(/[/\\:*?"<>|]/g, '').trim().replace(/\s+/g, ' ') || 'Pt';
      const unfoundRoot = await customSaveDirHandle.getDirectoryHandle(unfoundName, { create: true });
      clientDirHandle = await unfoundRoot.getDirectoryHandle(safeName, { create: true });
      usedFolderName = unfoundName + '\\' + safeName;
      queueRunUsedUnfound = true;
      appendLogRed('Client not found, using: ' + usedFolderName);
    }

    const authUtil = await clientDirHandle.getDirectoryHandle(AUTH_UTIL_FOLDER, { create: true });

    let maxDs = 0;
    for await (const [name, handle] of authUtil.entries()) {
      if (handle.kind !== 'directory') continue;
      const m = name.match(/^ds(\d+)$/i);
      if (m) maxDs = Math.max(maxDs, parseInt(m[1], 10));
    }
    const nextDs = 'DS' + (maxDs + 1);
    const dsDir = await authUtil.getDirectoryHandle(nextDs, { create: true });

    const logPath = usedFolderName + '\\' + AUTH_UTIL_FOLDER + '\\' + nextDs;
    appendLog('Save path: ' + logPath);

    cachedSaveDir = { dirHandle: dsDir, logPath };
    cachedSaveDirClient = name;
    return cachedSaveDir;
  } catch (e) {
    appendLog('Error resolving path: ' + (e.message || String(e)));
    throw e;
  }
}

function isFileSystemPermissionError(e) {
  const msg = (e?.message || '').toLowerCase();
  return /not allowed by the user agent|the platform in the current context|permission denied|invalidstateerror|securityerror/i.test(msg) ||
    e?.name === 'SecurityError' || e?.name === 'InvalidStateError';
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function sendToContent(action, payload = {}) {
  const tab = await getActiveTab();
  if (!tab?.id) {
    setStatus('No active tab.', true);
    return null;
  }
  const url = payload.url || REPORTING_URL;
  if (action === 'navigate') {
    chrome.tabs.update(tab.id, { url });
    setStatus('Redirecting…');
    return { ok: true };
  }
  const isCentralReach = tab.url?.startsWith('https://members.centralreach.com');
  if (!isCentralReach) {
    setStatus('Open a CentralReach tab for this action.', true);
    return null;
  }
  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      source: 'sidepanel',
      action,
      payload
    });
    return response;
  } catch (e) {
    console.error('[CentralReach Helper] sendToContent failed:', {
      action,
      tabId: tab.id,
      tabUrl: tab.url,
      errorName: e?.name,
      errorMessage: e?.message,
      fullError: e
    });
    const isReceivingEnd = /receiving end does not exist|Receiving end does not exist/i.test(e?.message || '');
    const msg = isReceivingEnd
      ? 'Content script not loaded. Refresh the CentralReach page (F5) and try again.'
      : 'Page may not be loaded. Try again. ' + (e.message || '');
    setStatus(msg, true);
    return null;
  }
}

document.getElementById('rbt-run-auth-date-range').addEventListener('change', function () {
  const val = (this.value || '').trim();
  if (!val || val.indexOf(' - ') < 0) return;
  const parts = val.split(' - ');
  const startEl = document.getElementById('rbt-run-start-date');
  const stopEl = document.getElementById('rbt-run-stop-date');
  if (startEl) startEl.value = (parts[0] || '').trim();
  if (stopEl) stopEl.value = (parts[1] || '').trim();
  savePdfFormToStorage();
});

document.getElementById('rbt-run-service-code').addEventListener('change', function () {
  if (!loadedHoursByCode || !Object.keys(loadedHoursByCode).length) return;
  const code = (this.value || '').trim();
  const authEl = document.getElementById('rbt-pdf-authorized-hours');
  if (!authEl) return;
  if (code === 'all') {
    const sum = Object.values(loadedHoursByCode).reduce((a, b) => a + b, 0);
    authEl.value = sum || '';
  } else if (loadedHoursByCode[code] != null) {
    authEl.value = loadedHoursByCode[code];
  }
  savePdfFormToStorage();
});

document.getElementById('rbt-btn-load-contact-info').addEventListener('click', async () => {
  if (!requireFolderChosen()) return;
  const tab = await getActiveTab();
  if (!tab?.id) {
    setStatus('No active tab.', true);
    return;
  }
  if (!tab.url?.startsWith('https://members.centralreach.com')) {
    setStatus('Open a CentralReach contact page first.', true);
    return;
  }
  const delay = ms => new Promise(r => setTimeout(r, ms));
  let clientId = '', clientName = '', clientDob = '';
  let authRanges = [];
  let dateFrom = '', dateTo = '';
  let hoursByCode = {};
  try {
    setStatus('Step 1: Reading client ID, name & DOB…');
    let r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        var clientId = '', clientName = '', clientDob = '';
        try {
          var idEl = document.evaluate('/html/body/div[1]/div[1]/div[4]/div/div/div/div/div[2]/div/div[1]/nav[1]/div[2]/div[2]/div[3]/span[2]', document, null, 9, null).singleNodeValue;
          if (idEl) clientId = (idEl.textContent || '').trim();
        } catch (e) {}
        if (!clientId) {
          var spans = document.querySelectorAll('nav span.pull-right');
          for (var i = 0; i < spans.length; i++) {
            var t = (spans[i].textContent || '').trim();
            if (t && /^\d+$/.test(t)) { clientId = t; break; }
          }
        }
        try {
          var nameEl = document.evaluate('/html/body/div[1]/div[1]/div[4]/div/div/div/div/div[2]/div/div[1]/nav[1]/div[2]/div[1]/div/div[2]', document, null, 9, null).singleNodeValue;
          if (nameEl) clientName = (nameEl.textContent || '').trim();
        } catch (e) {}
        if (!clientName) {
          var d = document.querySelector('.txt-xxl.margin-top');
          if (d) clientName = (d.textContent || '').trim();
        }
        try {
          var dobContainer = document.evaluate('/html/body/div[1]/div[1]/div[4]/div/div/div/div/div/div/div[1]/nav[1]/div[2]/div[2]/div[5]', document, null, 9, null).singleNodeValue;
          if (!dobContainer) dobContainer = document.querySelector('nav div[class*="padding"]');
          var searchRoot = dobContainer || document;
          var dobDivs = searchRoot.querySelectorAll('div.padding-xs-bottom, div.border-bottom, div[class*="padding-xs-bottom"]');
          for (var j = 0; j < dobDivs.length; j++) {
            var firstSpan = dobDivs[j].querySelector('span');
            if (firstSpan && (firstSpan.textContent || '').indexOf('DOB') >= 0) {
              var pr = dobDivs[j].querySelector('span.pull-right');
              if (pr) { clientDob = (pr.textContent || '').trim(); break; }
            }
          }
        } catch (e) {}
        return { ok: true, clientId, clientName, clientDob };
      }
    });
    if (!r?.[0]?.result?.ok) {
      setStatus(r?.[0]?.result?.error || 'Could not read client', true);
      return;
    }
    clientId = r[0].result.clientId || '';
    clientName = r[0].result.clientName || '';
    clientDob = r[0].result.clientDob || '';
    await delay(500);

    setStatus('Step 2: Clicking Show/Hide More…');
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        function realClick(el) {
          var prevent = function(e) { e.preventDefault(); };
          el.addEventListener('click', prevent, true);
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          el.removeEventListener('click', prevent, true);
        }
        var el = document.querySelector('.module-actions a.showmore') || document.querySelector('a.showmore');
        if (!el) return { ok: false, error: 'Show/Hide More not found' };
        realClick(el);
        return { ok: true };
      }
    });
    if (!r?.[0]?.result?.ok) {
      setStatus(r?.[0]?.result?.error || 'Show/Hide More failed', true);
      return;
    }
    await delay(500);

    setStatus('Step 3: Reading auth date ranges…');
    const authSelection = document.getElementById('rbt-settings-auth-selection')?.value || 'current';
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (selectionPref) => {
        var ranges = [];
        var container = document;
        var authMod = Array.from(document.querySelectorAll('.module-title')).find(function(m) {
          return (m.textContent || '').indexOf('Authorizations') >= 0;
        });
        if (authMod) {
          var parent = authMod.closest('.relative') || authMod.closest('.white-basic') || authMod.parentElement;
          if (parent) container = parent;
        }
        function is97151(linkEl) {
          if (!linkEl) return false;
          var desc = linkEl.querySelector('span.overflow-hidden.block') || Array.from(linkEl.children).find(function(c) { return c.tagName === 'SPAN'; });
          if (!desc) return false;
          return /^97151\b/.test((desc.textContent || '').trim());
        }
        var pullRights = container.querySelectorAll('.module-items a.item .pull-right, .module-items .pull-right');
        for (var i = 0; i < pullRights.length; i++) {
          var link = pullRights[i].closest('a') || pullRights[i].parentElement;
          if (is97151(link)) continue;
          var spans = pullRights[i].querySelectorAll('span');
          if (spans.length >= 2) {
            var start = (spans[0].textContent || '').trim();
            var end = (spans[1].textContent || '').trim();
            if (start && end && /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(start) && /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(end)) {
              ranges.push(start + ' - ' + end);
            }
          }
        }
        function parseEnd(str) {
          var p = str.split(' - ')[1];
          if (!p) return 0;
          p = p.split('/');
          if (p.length < 3) return 0;
          var m = parseInt(p[0], 10), d = parseInt(p[1], 10), y = parseInt(p[2], 10);
          if (y < 100) y += 2000;
          return new Date(y, m - 1, d).getTime();
        }
        function parseStart(str) {
          var p = str.split(' - ')[0];
          if (!p) return 0;
          p = p.split('/');
          if (p.length < 3) return 0;
          var m = parseInt(p[0], 10), d = parseInt(p[1], 10), y = parseInt(p[2], 10);
          if (y < 100) y += 2000;
          return new Date(y, m - 1, d).getTime();
        }
        ranges.sort(function(a, b) { return parseEnd(a) - parseEnd(b); });
        
        var dateFrom = '', dateTo = '';
        if (ranges.length > 0) {
          var chosenRange;
          var now = Date.now();
          if (selectionPref === 'current') {
            var containingToday = ranges.filter(function(r) { 
              return now >= parseStart(r) && now <= parseEnd(r); 
            });
            if (containingToday.length > 0) {
              chosenRange = containingToday[containingToday.length - 1];
            } else {
              chosenRange = ranges[ranges.length - 1];
            }
          } else {
            var indexOffset = parseInt(selectionPref, 10) || 1;
            var targetIndex = ranges.length - indexOffset;
            if (targetIndex < 0) targetIndex = 0;
            chosenRange = ranges[targetIndex];
          }
          
          if (chosenRange) {
            var parts = chosenRange.split(' - ');
            dateFrom = parts[0] || '';
            dateTo = parts[1] || '';
          }
        }
        return { ok: true, ranges: ranges, dateFrom, dateTo };
      },
      args: [authSelection]
    });
    if (r?.[0]?.result?.ok) {
      authRanges = [...new Set(r[0].result.ranges || [])];
      dateFrom = r[0].result.dateFrom || '';
      dateTo = r[0].result.dateTo || '';
      console.log('[CentralReach Helper] [DATES] Load Contact Info — dates from CLIENT PAGE (Authorizations module, latest by end date):', { dateFrom, dateTo, source: 'client page DOM', rangesFound: authRanges });
    }
    if (!authRanges.length) {
      setStatus('No auth date ranges found. Click Show/Hide More first.', true);
      return;
    }
    await delay(500);

    setStatus('Step 4: Opening chosen auth…');
    const authSelectionStep4 = document.getElementById('rbt-settings-auth-selection')?.value || 'current';
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (selectionPref) => {
        var container = document;
        var authMod = Array.from(document.querySelectorAll('.module-title')).find(function(m) {
          return (m.textContent || '').indexOf('Authorizations') >= 0;
        });
        if (authMod) {
          var parent = authMod.closest('.relative') || authMod.closest('.white-basic') || authMod.parentElement;
          if (parent) container = parent;
        }
        var links = container.querySelectorAll('.module-items a.item[href]');
        if (!links.length) return { ok: false, error: 'No auth item found' };
        function is97151(linkEl) {
          if (!linkEl) return false;
          var desc = linkEl.querySelector('span.overflow-hidden.block') || Array.from(linkEl.children).find(function(c) { return c.tagName === 'SPAN'; });
          if (!desc) return false;
          return /^97151\b/.test((desc.textContent || '').trim());
        }
        function parseDate(str) {
          var p = (str || '').split('/');
          if (p.length < 3) return 0;
          var m = parseInt(p[0], 10), d = parseInt(p[1], 10), y = parseInt(p[2], 10);
          if (y < 100) y += 2000;
          return new Date(y, m - 1, d).getTime();
        }
        var items = [];
        for (var i = 0; i < links.length; i++) {
          if (is97151(links[i])) continue;
          var pr = links[i].querySelector('.pull-right');
          if (!pr) continue;
          var spans = pr.querySelectorAll('span');
          if (spans.length < 2) continue;
          var startStr = (spans[0].textContent || '').trim();
          var endStr = (spans[1].textContent || '').trim();
          var startTime = parseDate(startStr);
          var endTime = parseDate(endStr);
          items.push({ link: links[i], startTime: startTime, endTime: endTime });
        }
        items.sort(function(a, b) { return a.endTime - b.endTime; });
        if (!items.length) return { ok: false, error: 'No auth item found' };
        
        var chosen;
        var now = Date.now();
        if (selectionPref === 'current') {
          var containingToday = items.filter(function(it) { return now >= it.startTime && now <= it.endTime; });
          if (containingToday.length > 0) {
            chosen = containingToday[containingToday.length - 1];
          } else {
            chosen = items[items.length - 1];
          }
        } else {
          var indexOffset = parseInt(selectionPref, 10) || 1;
          var targetIndex = items.length - indexOffset;
          if (targetIndex < 0) targetIndex = 0;
          chosen = items[targetIndex];
        }

        var href = (chosen.link.getAttribute('href') || '').trim();
        if (!href) return { ok: false, error: 'No href' };
        var fullUrl = href.indexOf('http') === 0 ? href : (new URL(href, window.location.href)).href;
        return { ok: true, url: fullUrl };
      },
      args: [authSelectionStep4]
    });
    if (!r?.[0]?.result?.ok) {
      setStatus(r?.[0]?.result?.error || 'Latest auth failed', true);
      return;
    }
    chrome.tabs.update(tab.id, { url: r[0].result.url });
    await delay(2500);
    await delay(500);

    setStatus('Step 5: Closing modal…');
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        function realClick(el) {
          var prevent = function(e) { e.preventDefault(); };
          el.addEventListener('click', prevent, true);
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          el.removeEventListener('click', prevent, true);
        }
        var btn = document.querySelector('.modal-content button[data-dismiss="modal"]') || document.querySelector('button[data-dismiss="modal"]');
        if (!btn) return { ok: false };
        realClick(btn);
        return { ok: true };
      }
    });
    await delay(500);

    setStatus('Step 6: Reading service breakdown…');
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (codeMap) => {
        var section = Array.from(document.querySelectorAll('*')).find(function(el) {
          return (el.textContent || '').trim() === 'Service Code Breakdown';
        });
        if (!section) {
          section = Array.from(document.querySelectorAll('.flex, .border')).find(function(el) {
            return (el.textContent || '').indexOf('Service Code Breakdown') >= 0;
          });
        }
        if (!section) return { ok: false, error: 'Service Code Breakdown not found' };
        var container = section.closest('.border') || section.closest('.drop-shadow') || section.parentElement || document;
        var groups = container.querySelectorAll('.code-group');
        var out = [];
        for (var g = 0; g < groups.length; g++) {
          var group = groups[g];
          var codeSpans = group.querySelectorAll('h5 span');
          var codesRaw = '';
          for (var s = 0; s < codeSpans.length; s++) {
            var t = (codeSpans[s].textContent || '').trim();
            if (t && /^[\d\s,]+$/.test(t)) { codesRaw = t; break; }
          }
          if (!codesRaw) codesRaw = ((group.querySelector('h5') || {}).textContent || '').replace(/Grouped Codes:\s*/i, '').trim() || '?';
          var uniqueCodes = codesRaw.split(',').map(function(x) { return x.trim(); }).filter(Boolean);
          uniqueCodes = uniqueCodes.filter(function(c, i) { return uniqueCodes.indexOf(c) === i; });
          var rows = group.querySelectorAll('.row');
          function getUnits(row) {
            if (!row) return null;
            var cols = row.querySelectorAll('.col-xs-3');
            if (cols.length >= 3) {
              var v = (cols[2].textContent || '').trim().replace(/\s+/g, ' ').replace(/\s*n\/a\s*/gi, '').trim();
              return v && /units/i.test(v) ? v : null;
            }
            return null;
          }
          var onceUnits = rows[0] ? getUnits(rows[0]) : null;
          var totalUnits = rows[1] ? getUnits(rows[1]) : null;
          var units = totalUnits || onceUnits;
          if (units) {
            var hours = 0;
            var hoursMatch = units.match(/\((\d+(?:\.\d+)?)\s*hours?\)/i);
            if (hoursMatch) hours = Math.round(parseFloat(hoursMatch[1]));
            else {
              var num = parseInt(units.replace(/\D/g, ''), 10);
              hours = !isNaN(num) ? Math.round(num / 4) : 0;
            }
            for (var c = 0; c < uniqueCodes.length; c++) {
              var sc = codeMap[uniqueCodes[c]];
              if (sc) out.push({ serviceCode: sc, hours: hours });
            }
          }
        }
        return { ok: true, breakdown: out };
      },
      args: [{ '97153': '97153 tx', '97155': '97155 tx t', '97156': '97156 tx t' }]
    });
    if (!r?.[0]?.result?.ok) {
      setStatus(r?.[0]?.result?.error || 'Service breakdown failed', true);
      return;
    }
    var breakdown = r[0].result.breakdown || [];
    for (let i = 0; i < breakdown.length; i++) {
      hoursByCode[breakdown[i].serviceCode] = breakdown[i].hours;
    }
    loadedHoursByCode = { ...hoursByCode };

    document.getElementById('rbt-pdf-client-name').value = clientName;
    document.getElementById('rbt-pdf-dob').value = clientDob;
    document.getElementById('rbt-run-start-date').value = dateFrom;
    document.getElementById('rbt-run-stop-date').value = dateTo;
    document.getElementById('rbt-run-contact-id').value = clientId;
    const authTotal = Object.values(hoursByCode).reduce((a, b) => a + b, 0);
    document.getElementById('rbt-pdf-authorized-hours').value = authTotal || '';

    const authSelect = document.getElementById('rbt-run-auth-date-range');
    const rowAuth = document.getElementById('rbt-row-auth-date-range');
    authSelect.innerHTML = '<option value="">— Select —</option>' + authRanges.map(function(range) {
      return '<option value="' + range.replace(/"/g, '&quot;') + '">' + range + '</option>';
    }).join('');
    authSelect.value = (dateFrom && dateTo) ? (dateFrom + ' - ' + dateTo) : (authRanges[authRanges.length - 1] || '');
    rowAuth.style.display = 'block';

    console.log('[CentralReach Helper] [DATES] Load Contact Info — form SET to:', { dateFrom, dateTo, clientName, clientId, source: 'client page (latest auth range)' });
    savePdfFormToStorage();
    setStatus('Contact info loaded. Select auth range if needed, then click Run Full Report.');
  } catch (e) {
    setStatus('Error: ' + (e.message || 'Could not load'), true);
  }
});

document.getElementById('rbt-btn-run-full-report').addEventListener('click', async () => {
  clearSaveDirCache();
  if (!requireFolderChosen()) return;
  clearSaveLog();
  queueRunUsedFallback = false;
  queueRunUsedUnfound = false;
  setStatus('Step 1: Refreshing page…');

  const tab = await getActiveTab();
  if (!tab?.id) {
    setStatus('No active tab.', true);
    return;
  }
  if (!tab.url?.startsWith('https://members.centralreach.com')) {
    setStatus('Open a CentralReach tab first.', true);
    return;
  }

  chrome.tabs.reload(tab.id);
  await new Promise((resolve) => {
    const listener = (tabId, changeInfo) => {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
    setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      resolve();
    }, 10000);
  });
  await new Promise(r => setTimeout(r, 1500));

  const cfg = typeof CENTRALREACH_SELECTORS !== 'undefined' ? CENTRALREACH_SELECTORS : {};
  const dateFrom = (document.getElementById('rbt-run-start-date')?.value || '').trim();
  const dateTo = (document.getElementById('rbt-run-stop-date')?.value || '').trim();
  const contactId = (document.getElementById('rbt-run-contact-id')?.value || '').trim() || String(cfg.defaultContactId || '3792429');
  const serviceCode = (document.getElementById('rbt-run-service-code')?.value || '').trim() || String(cfg.defaultServiceCode || 'all');

  console.log('[CentralReach Helper] [DATES] Run Full Report (manual) — using dates from SIDEPANEL FORM:', { dateFrom, dateTo, contactId, source: 'manual form (refresh with Load Contact Info on the contact page if wrong)' });

  if (!dateFrom || !dateTo) {
    setStatus('Enter start and stop dates.', true);
    return;
  }

  savePdfFormToStorage();
  const codesToRun = (serviceCode === 'all') ? SERVICE_CODES : [serviceCode];
  const opts = { dateFrom, dateTo, contactId, serviceCode };

  try {
    setStatus('Step 2: Filling dates…');
    console.log('[CentralReach Helper] [DATES] Run Full Report (manual) — filling REPORT PAGE with form dates:', { dateFrom: opts.dateFrom, dateTo: opts.dateTo, source: 'sidepanel form' });
    let results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (o) => {
        function fillDate(sel, val) {
          var el = document.querySelector(sel) || document.getElementById((sel || '').replace('#', ''));
          if (!el) return false;
          el.value = val;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
        if (!fillDate('#dateFrom', o.dateFrom)) return { ok: false, error: 'Date from not found' };
        if (!fillDate('#dateTo', o.dateTo)) return { ok: false, error: 'Date to not found' };
        return { ok: true };
      },
      args: [opts]
    });
    if (!results?.[0]?.result?.ok) {
      setStatus(results?.[0]?.result?.error || 'Dates failed', true);
      return;
    }

    setStatus('Step 3: Selecting contact…');
    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async (id) => {
        function realClick(el) {
          var prevent = function(e) { e.preventDefault(); };
          el.addEventListener('click', prevent, true);
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          el.removeEventListener('click', prevent, true);
        }
        var contactSpan = document.querySelector('span#select2-chosen-8') || document.querySelector('#indReportRoot span.select2-chosen:first-of-type');
        if (!contactSpan) return { ok: false, error: 'Contact span not found' };
        realClick(contactSpan);
        await new Promise(r => setTimeout(r, 400));
        var searchInput = document.querySelector('#select2-drop input') || document.querySelector('.select2-drop input.select2-input');
        if (!searchInput) return { ok: false, error: 'Contact search input not found' };
        searchInput.focus();
        searchInput.value = id;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.dispatchEvent(new Event('keyup', { bubbles: true }));
        await new Promise(r => setTimeout(r, 1000));
        var res = document.querySelector('#select2-drop .select2-results li.select2-result-selectable') || document.querySelector('#select2-drop .select2-results li');
        if (!res) return { ok: false, error: 'Contact result not found' };
        realClick(res);
        return { ok: true };
      },
      args: [contactId]
    });
    if (!results?.[0]?.result?.ok) {
      setStatus(results?.[0]?.result?.error || 'Contact failed', true);
      return;
    }

    let pdfCount = 0;
    const totalCodes = codesToRun.length;
    for (let idx = 0; idx < codesToRun.length; idx++) {
      const code = codesToRun[idx];
      const stepLabel = totalCodes > 1 ? ` (${idx + 1}/${totalCodes}: ${code})` : '';

      if (idx > 0) {
        setStatus('Waiting for page to be ready…');
        await new Promise(r => setTimeout(r, 3000));
        setStatus('Clearing previous service code…');
        results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            function realClick(el) {
              var prevent = function(e) { e.preventDefault(); };
              el.addEventListener('click', prevent, true);
              el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
              el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
              el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
              el.removeEventListener('click', prevent, true);
            }
            var closeBtn = document.querySelector('#indReportRoot .select2-container:nth-of-type(3) abbr.select2-search-choice-close');
            if (!closeBtn) {
              var all = document.querySelectorAll('abbr.select2-search-choice-close');
              closeBtn = all.length >= 3 ? all[2] : (all[all.length - 1] || all[0]);
            }
            if (!closeBtn) return { ok: false, error: 'Service code clear (X) button not found' };
            realClick(closeBtn);
            return { ok: true };
          }
        });
        if (!results?.[0]?.result?.ok) {
          setStatus(results?.[0]?.result?.error || 'Clear service code failed', true);
          return;
        }
        await new Promise(r => setTimeout(r, 500));
      }

      setStatus('Step 4' + stepLabel + ': Selecting service code…');
      results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async (code) => {
          function realClick(el) {
            var prevent = function(e) { e.preventDefault(); };
            el.addEventListener('click', prevent, true);
            el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
            el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
            el.removeEventListener('click', prevent, true);
          }
          var codeSpan = (function() {
            try {
              var r = document.evaluate('//span[contains(@class,"select2-chosen") and contains(.,"Filter by service code")]', document, null, 9, null);
              if (r.singleNodeValue) return r.singleNodeValue;
            } catch(e) {}
            return document.querySelector('#indReportRoot .select2-container:nth-of-type(3) span.select2-chosen');
          })();
          if (!codeSpan) return { ok: false, error: 'Service code span not found' };
          realClick(codeSpan);
          await new Promise(r => setTimeout(r, 400));
          var searchInput = document.querySelector('#select2-drop input') || document.querySelector('.select2-drop input.select2-input');
          if (!searchInput) return { ok: false, error: 'Service code search input not found' };
          searchInput.focus();
          searchInput.value = code;
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          searchInput.dispatchEvent(new Event('keyup', { bubbles: true }));
          await new Promise(r => setTimeout(r, 1000));
          var res = document.querySelector('#select2-drop .select2-results li.select2-result-selectable') || document.querySelector('#select2-drop .select2-results li');
          if (!res) return { ok: false, error: 'Service code result not found' };
          realClick(res);
          return { ok: true };
        },
        args: [code]
      });
      if (!results?.[0]?.result?.ok) {
        setStatus(results?.[0]?.result?.error || 'Service code failed', true);
        return;
      }

      setStatus('Step 5' + stepLabel + ': Clicking Search…');
      results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          var btn = document.querySelector('#btnsearch') || document.querySelector('a#btnsearch');
          if (!btn) return { ok: false, error: 'Search button not found' };
          var prevent = function(e) { e.preventDefault(); };
          btn.addEventListener('click', prevent, true);
          btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          btn.removeEventListener('click', prevent, true);
          return { ok: true };
        }
      });

      if (!results?.[0]?.result?.ok) {
        setStatus(results?.[0]?.result?.error || 'Search failed', true);
        return;
      }

      savePdfFormToStorage();

      setStatus('Step 6' + stepLabel + ': Waiting for results…');
      await new Promise(r => setTimeout(r, 4000));

      setStatus('Step 7' + stepLabel + ': Generating PDF…');
      const authHours = (loadedHoursByCode && loadedHoursByCode[code] != null) ? loadedHoursByCode[code] : null;
      const pdfOk = await runPdfExport(tab, {
        serviceCodeOverride: code,
        authorizedHoursOverride: authHours != null ? authHours : undefined
      });
      if (pdfOk) pdfCount++;
      if (idx < codesToRun.length - 1) {
        setStatus('Preparing for next service code…');
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    setStatus(pdfCount > 0
      ? (pdfCount === totalCodes ? 'Done. ' + pdfCount + ' PDF(s) downloaded.' : 'Done. ' + pdfCount + '/' + totalCodes + ' PDF(s) downloaded.')
      : 'Search complete. PDF failed—try Export button after table loads.');
  } catch (e) {
    setStatus('Error: ' + (e.message || 'Could not run'), true);
  }
});

/** Maps breakdown codes (97153) to SERVICE_CODES (97153 tx). 97151 is ignored. */
const CODE_TO_SERVICE = { '97153': '97153 tx', '97155': '97155 tx t', '97156': '97156 tx t' };

function isContactDetailsUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim();
  if (!u.startsWith('https://members.centralreach.com')) return false;
  return u.indexOf('#contacts/details/') >= 0 && /[?&]id=\d+/.test(u);
}

function getContactIdFromUrl(url) {
  const m = (url || '').match(/[?&]id=(\d+)/);
  return m ? m[1] : '';
}

document.getElementById('rbt-btn-add-to-queue').addEventListener('click', async () => {
  if (!requireFolderChosen()) return;
  try {
    const tab = await getActiveTab();
    if (!tab?.id) {
      setStatus('No active tab.', true);
      return;
    }
    const url = (tab.url || '').trim();
    if (!isContactDetailsUrl(url)) {
      setStatus('Open a CentralReach contact page (e.g. .../#contacts/details/?id=12345)', true);
      return;
    }
    if (reportQueue.some((q) => q.url === url)) {
      setStatus('Already in queue.', true);
      return;
    }
    setStatus('Reading client name…');
    let name = 'Contact ' + (getContactIdFromUrl(url) || '?');
    try {
      const r = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          var clientName = '';
          try {
            var nameEl = document.evaluate('/html/body/div[1]/div[1]/div[4]/div/div/div/div/div[2]/div/div[1]/nav[1]/div[2]/div[1]/div/div[2]', document, null, 9, null).singleNodeValue;
            if (nameEl) clientName = (nameEl.textContent || '').trim();
          } catch (e) {}
          if (!clientName) {
            var d = document.querySelector('.txt-xxl.margin-top');
            if (d) clientName = (d.textContent || '').trim();
          }
          if (!clientName) {
            var nav = document.querySelector('nav .txt-xxl, nav h2, .contact-name');
            if (nav) clientName = (nav.textContent || '').trim();
          }
          return { ok: true, name: clientName || '' };
        }
      });
      const n = r?.[0]?.result?.name;
      if (n) name = n;
    } catch (e) {
      setStatus('Could not read name (using ID). Adding anyway…');
    }
    reportQueue.push({ name, url });
    saveQueue();
    setStatus('Added "' + name + '" to queue.');
  } catch (err) {
    setStatus('Add to queue failed: ' + (err.message || String(err)), true);
    console.error('Add to queue:', err);
  }
});

async function runFullReportFromContactForTab(tab, clientLabel = '') {
  clearSaveDirCache();
  if (!tab?.id) {
    setStatus('No active tab.', true);
    return { clientName: '', reports: [] };
  }
  if (!tab.url?.startsWith('https://members.centralreach.com')) {
    setStatus('Open a CentralReach contact page first.', true);
    return { clientName: '', reports: [] };
  }
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const prefix = clientLabel ? clientLabel + ' ' : '';
  let clientId = '', clientName = '', clientDob = '';
  let dateFrom = '', dateTo = '';
  let hoursByCode = {};
  try {
    setStatus(prefix + 'Step 1: Reading client ID, name & DOB…');
    let r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        var clientId = '', clientName = '', clientDob = '';
        try {
          var idEl = document.evaluate('/html/body/div[1]/div[1]/div[4]/div/div/div/div/div[2]/div/div[1]/nav[1]/div[2]/div[2]/div[3]/span[2]', document, null, 9, null).singleNodeValue;
          if (idEl) clientId = (idEl.textContent || '').trim();
        } catch (e) {}
        if (!clientId) {
          var spans = document.querySelectorAll('nav span.pull-right');
          for (var i = 0; i < spans.length; i++) {
            var t = (spans[i].textContent || '').trim();
            if (t && /^\d+$/.test(t)) { clientId = t; break; }
          }
        }
        try {
          var nameEl = document.evaluate('/html/body/div[1]/div[1]/div[4]/div/div/div/div/div[2]/div/div[1]/nav[1]/div[2]/div[1]/div/div[2]', document, null, 9, null).singleNodeValue;
          if (nameEl) clientName = (nameEl.textContent || '').trim();
        } catch (e) {}
        if (!clientName) {
          var d = document.querySelector('.txt-xxl.margin-top');
          if (d) clientName = (d.textContent || '').trim();
        }
        try {
          var dobContainer = document.evaluate('/html/body/div[1]/div[1]/div[4]/div/div/div/div/div/div/div[1]/nav[1]/div[2]/div[2]/div[5]', document, null, 9, null).singleNodeValue;
          if (!dobContainer) dobContainer = document.querySelector('nav div[class*="padding"]');
          var searchRoot = dobContainer || document;
          var dobDivs = searchRoot.querySelectorAll('div.padding-xs-bottom, div.border-bottom, div[class*="padding-xs-bottom"]');
          for (var j = 0; j < dobDivs.length; j++) {
            var firstSpan = dobDivs[j].querySelector('span');
            if (firstSpan && (firstSpan.textContent || '').indexOf('DOB') >= 0) {
              var pr = dobDivs[j].querySelector('span.pull-right');
              if (pr) { clientDob = (pr.textContent || '').trim(); break; }
            }
          }
        } catch (e) {}
        return { ok: true, clientId, clientName, clientDob };
      }
    });
    if (!r?.[0]?.result?.ok) {
      setStatus(r?.[0]?.result?.error || 'Could not read client', true);
      return { clientName: '', reports: [] };
    }
    clientId = r[0].result.clientId || '';
    clientName = r[0].result.clientName || '';
    clientDob = r[0].result.clientDob || '';
    await delay(500);

    setStatus(prefix + 'Step 2: Clicking Show/Hide More…');
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        function realClick(el) {
          var prevent = function(e) { e.preventDefault(); };
          el.addEventListener('click', prevent, true);
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          el.removeEventListener('click', prevent, true);
        }
        var el = document.querySelector('.module-actions a.showmore') || document.querySelector('a.showmore');
        if (!el) return { ok: false, error: 'Show/Hide More not found' };
        realClick(el);
        return { ok: true };
      }
    });
    if (!r?.[0]?.result?.ok) {
      setStatus(r?.[0]?.result?.error || 'Show/Hide More failed', true);
      return { clientName: clientName || '', reports: [] };
    }
    await delay(500);

    setStatus(prefix + 'Step 3: Reading auth date ranges and choosing auth…');
    const authSelectionStep3 = document.getElementById('rbt-settings-auth-selection')?.value || 'current';
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (selectionPref) => {
        var container = document;
        var authMod = Array.from(document.querySelectorAll('.module-title')).find(function(m) {
          return (m.textContent || '').indexOf('Authorizations') >= 0;
        });
        if (authMod) {
          var parent = authMod.closest('.relative') || authMod.closest('.white-basic') || authMod.parentElement;
          if (parent) container = parent;
        }
        var links = container.querySelectorAll('.module-items a.item[href]');
        if (!links.length) return { ok: false, error: 'No auth item found' };
        function is97151(linkEl) {
          if (!linkEl) return false;
          var desc = linkEl.querySelector('span.overflow-hidden.block') || Array.from(linkEl.children).find(function(c) { return c.tagName === 'SPAN'; });
          if (!desc) return false;
          return /^97151\b/.test((desc.textContent || '').trim());
        }
        function parseDate(str) {
          var p = (str || '').split('/');
          if (p.length < 3) return 0;
          var m = parseInt(p[0], 10), d = parseInt(p[1], 10), y = parseInt(p[2], 10);
          if (y < 100) y += 2000;
          return new Date(y, m - 1, d).getTime();
        }
        var items = [];
        for (var i = 0; i < links.length; i++) {
          if (is97151(links[i])) continue;
          var pr = links[i].querySelector('.pull-right');
          if (!pr) continue;
          var spans = pr.querySelectorAll('span');
          if (spans.length < 2) continue;
          var startStr = (spans[0].textContent || '').trim();
          var endStr = (spans[1].textContent || '').trim();
          if (!startStr || !endStr || !/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(startStr) || !/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(endStr)) continue;
          var startTime = parseDate(startStr);
          var endTime = parseDate(endStr);
          items.push({ link: links[i], startStr, endStr, startTime, endTime });
        }
        items.sort(function(a, b) { return a.endTime - b.endTime; });
        if (!items.length) return { ok: false, error: 'No auth items with dates' };
        var now = Date.now();
        var nowDate = new Date(now);
        var nowStr = (nowDate.getMonth() + 1) + '/' + nowDate.getDate() + '/' + (String(nowDate.getFullYear()).slice(-2));
        var containingToday = items.filter(function(it) { return now >= it.startTime && now <= it.endTime; });
        
        var chosen;
        var reason;
        
        if (selectionPref === 'current') {
          if (containingToday.length > 0) {
            chosen = containingToday[containingToday.length - 1]; // most recent ending among current
            reason = 'current_containing_today';
          } else {
            chosen = items[items.length - 1];
            reason = 'most_recent_fallback';
          }
        } else {
          // '1' for Most Recent, '2' for 2nd Most Recent, etc.
          var indexOffset = parseInt(selectionPref, 10) || 1;
          var targetIndex = items.length - indexOffset;
          if (targetIndex < 0) targetIndex = 0;
          chosen = items[targetIndex];
          reason = 'selected_index_' + indexOffset;
        }

        var authRanges = items.map(function(it) { return it.startStr + ' - ' + it.endStr; });
        var href = (chosen.link.getAttribute('href') || '').trim();
        if (!href) return { ok: false, error: 'No href' };
        var fullUrl = href.indexOf('http') === 0 ? href : (new URL(href, window.location.href)).href;
        return { ok: true, dateFrom: chosen.startStr, dateTo: chosen.endStr, url: fullUrl, authLog: { now: nowStr, ranges: authRanges, chosen: chosen.startStr + ' - ' + chosen.endStr, reason: reason } };
      },
      args: [authSelectionStep3]
    });
    if (r?.[0]?.result?.ok) {
      dateFrom = r[0].result.dateFrom || '';
      dateTo = r[0].result.dateTo || '';
      const log = r[0].result.authLog;
      if (log) {
        appendLog('[Auth range] Today: ' + log.now);
        appendLog('[Auth range] Found: ' + (log.ranges || []).join(' | '));
        appendLog('[Auth range] Chose: ' + log.chosen + ' (reason: ' + log.reason + ')');
        console.log('[CentralReach Helper] [DATES] Run from contact/queue — dates from CURRENT CONTACT PAGE (Authorizations, non-97151):', { dateFrom, dateTo, reason: log.reason, chosen: log.chosen, ranges: log.ranges, source: 'client page DOM' });
      }
    }
    if (!r?.[0]?.result?.ok) {
      setStatus(r?.[0]?.result?.error || 'Auth selection failed', true);
      return { clientName: clientName || '', reports: [] };
    }
    if (!dateFrom || !dateTo) {
      setStatus('Could not get auth date range.', true);
      return { clientName: clientName || '', reports: [] };
    }
    await delay(500);

    setStatus('Step 4: Opening auth…');
    chrome.tabs.update(tab.id, { url: r[0].result.url });
    await delay(2500);
    await delay(500);

    setStatus('Step 5: Closing modal…');
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        function realClick(el) {
          var prevent = function(e) { e.preventDefault(); };
          el.addEventListener('click', prevent, true);
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          el.removeEventListener('click', prevent, true);
        }
        var btn = document.querySelector('.modal-content button[data-dismiss="modal"]') || document.querySelector('button[data-dismiss="modal"]');
        if (!btn) return { ok: false };
        realClick(btn);
        return { ok: true };
      }
    });
    await delay(500);

    setStatus('Step 6: Reading service breakdown…');
    r = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (codeMap) => {
        var section = Array.from(document.querySelectorAll('*')).find(function(el) {
          return (el.textContent || '').trim() === 'Service Code Breakdown';
        });
        if (!section) {
          section = Array.from(document.querySelectorAll('.flex, .border')).find(function(el) {
            return (el.textContent || '').indexOf('Service Code Breakdown') >= 0;
          });
        }
        if (!section) return { ok: false, error: 'Service Code Breakdown not found' };
        var container = section.closest('.border') || section.closest('.drop-shadow') || section.parentElement || document;
        var groups = container.querySelectorAll('.code-group');
        var out = [];
        for (var g = 0; g < groups.length; g++) {
          var group = groups[g];
          var codeSpans = group.querySelectorAll('h5 span');
          var codesRaw = '';
          for (var s = 0; s < codeSpans.length; s++) {
            var t = (codeSpans[s].textContent || '').trim();
            if (t && /^[\d\s,]+$/.test(t)) { codesRaw = t; break; }
          }
          if (!codesRaw) codesRaw = ((group.querySelector('h5') || {}).textContent || '').replace(/Grouped Codes:\s*/i, '').trim() || '?';
          var uniqueCodes = codesRaw.split(',').map(function(x) { return x.trim(); }).filter(Boolean);
          uniqueCodes = uniqueCodes.filter(function(c, i) { return uniqueCodes.indexOf(c) === i; });
          var rows = group.querySelectorAll('.row');
          function getUnits(row) {
            if (!row) return null;
            var cols = row.querySelectorAll('.col-xs-3');
            if (cols.length >= 3) {
              var v = (cols[2].textContent || '').trim().replace(/\s+/g, ' ').replace(/\s*n\/a\s*/gi, '').trim();
              return v && /units/i.test(v) ? v : null;
            }
            return null;
          }
          var onceUnits = rows[0] ? getUnits(rows[0]) : null;
          var totalUnits = rows[1] ? getUnits(rows[1]) : null;
          var units = totalUnits || onceUnits;
          if (units) {
            var hours = 0;
            var hoursMatch = units.match(/\((\d+(?:\.\d+)?)\s*hours?\)/i);
            if (hoursMatch) hours = Math.round(parseFloat(hoursMatch[1]));
            else {
              var num = parseInt(units.replace(/\D/g, ''), 10);
              hours = !isNaN(num) ? Math.round(num / 4) : 0;
            }
            for (var c = 0; c < uniqueCodes.length; c++) {
              var sc = codeMap[uniqueCodes[c]];
              if (sc) out.push({ serviceCode: sc, hours: hours });
            }
          }
        }
        return { ok: true, breakdown: out };
      },
      args: [{ '97153': '97153 tx', '97155': '97155 tx t', '97156': '97156 tx t' }]
    });
    let hoursByCode = {};
    SERVICE_CODES.forEach(c => hoursByCode[c] = 0);

    if (r?.[0]?.result?.ok) {
      var breakdown = r[0].result.breakdown || [];
      for (var i = 0; i < breakdown.length; i++) {
        hoursByCode[breakdown[i].serviceCode] = breakdown[i].hours;
      }
    } else {
      console.warn('[CentralReach Helper] Service breakdown read failed or not found, hours will be 0.');
    }

    document.getElementById('rbt-pdf-client-name').value = clientName;
    document.getElementById('rbt-pdf-dob').value = clientDob;
    document.getElementById('rbt-run-start-date').value = dateFrom;
    document.getElementById('rbt-run-stop-date').value = dateTo;
    document.getElementById('rbt-run-contact-id').value = clientId;
    console.log('[CentralReach Helper] [DATES] Run from contact/queue — form SET to:', { dateFrom, dateTo, clientName, clientId, source: 'current contact page (chosen auth range)' });
    savePdfFormToStorage();

    setStatus(prefix + 'Step 7: Navigating to reporting…');
    chrome.tabs.update(tab.id, { url: REPORTING_URL });
    await new Promise((resolve) => {
      const listener = (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
      setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }, 10000);
    });
    await delay(1500);

    let results;
    let pdfCount = 0;
    const reportsGenerated = [];

    // Make sure service code filter is cleared before searching
    setStatus('Step 8: Clearing any service code filter…');
    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        function realClick(el) {
          var prevent = function(e) { e.preventDefault(); };
          el.addEventListener('click', prevent, true);
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          el.removeEventListener('click', prevent, true);
        }
        var closeBtn = document.querySelector('#indReportRoot .select2-container:nth-of-type(3) abbr.select2-search-choice-close');
        if (!closeBtn) {
          var all = document.querySelectorAll('abbr.select2-search-choice-close');
          closeBtn = all.length >= 3 ? all[2] : (all[all.length - 1] || all[0]);
        }
        if (closeBtn) realClick(closeBtn);
        return { ok: true };
      }
    });
    await delay(500);

    setStatus('Step 9: Filling dates & contact…');
    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (opts) => {
        function fillDate(sel, val) {
          var el = document.querySelector(sel) || document.getElementById((sel || '').replace('#', ''));
          if (!el) return false;
          el.value = val;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
        if (!fillDate('#dateFrom', opts.dateFrom)) return { ok: false, error: 'Date from not found' };
        if (!fillDate('#dateTo', opts.dateTo)) return { ok: false, error: 'Date to not found' };
        return { ok: true };
      },
      args: [{ dateFrom, dateTo }]
    });
    if (!results?.[0]?.result?.ok) {
      setStatus(results?.[0]?.result?.error || 'Dates failed', true);
      return { clientName: clientName || '', reports: reportsGenerated };
    }

    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async (id) => {
        function realClick(el) {
          var prevent = function(e) { e.preventDefault(); };
          el.addEventListener('click', prevent, true);
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          el.removeEventListener('click', prevent, true);
        }
        var contactSpan = document.querySelector('span#select2-chosen-8') || document.querySelector('#indReportRoot span.select2-chosen:first-of-type');
        if (!contactSpan) return { ok: false, error: 'Contact span not found' };
        realClick(contactSpan);
        await new Promise(r => setTimeout(r, 400));
        var searchInput = document.querySelector('#select2-drop input') || document.querySelector('.select2-drop input.select2-input');
        if (!searchInput) return { ok: false, error: 'Contact search input not found' };
        searchInput.focus();
        searchInput.value = id;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.dispatchEvent(new Event('keyup', { bubbles: true }));
        await new Promise(r => setTimeout(r, 1000));
        var res = document.querySelector('#select2-drop .select2-results li.select2-result-selectable') || document.querySelector('#select2-drop .select2-results li');
        if (!res) return { ok: false, error: 'Contact result not found' };
        realClick(res);
        return { ok: true };
      },
      args: [clientId]
    });
    if (!results?.[0]?.result?.ok) {
      setStatus(results?.[0]?.result?.error || 'Contact failed', true);
      return { clientName: clientName || '', reports: reportsGenerated };
    }
    await delay(400);

    setStatus('Step 10: Clicking Search…');
    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        var btn = document.querySelector('#btnsearch') || document.querySelector('a#btnsearch');
        if (!btn) return { ok: false, error: 'Search button not found' };
        var prevent = function(e) { e.preventDefault(); };
        btn.addEventListener('click', prevent, true);
        btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        btn.removeEventListener('click', prevent, true);
        return { ok: true };
      }
    });
    if (!results?.[0]?.result?.ok) {
      setStatus(results?.[0]?.result?.error || 'Search failed', true);
      return { clientName: clientName || '', reports: reportsGenerated };
    }

    setStatus('Step 11: Waiting for results…');
    await delay(4000);

    setStatus('Step 12: Reading all timesheets from table…');
    const dateCol = (typeof CENTRALREACH_SELECTORS !== 'undefined' && CENTRALREACH_SELECTORS.reportTableDateCol != null) ? CENTRALREACH_SELECTORS.reportTableDateCol : 0;
    const durationCol = (typeof CENTRALREACH_SELECTORS !== 'undefined' && CENTRALREACH_SELECTORS.reportTableDurationCol != null) ? CENTRALREACH_SELECTORS.reportTableDurationCol : 3;
    const serviceCodeCol = 9;

    results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (dateColIdx, durationColIdx, serviceCodeColIdx) => {
        const tbody = document.querySelector('#reportList') || document.querySelector('#reportTable tbody');
        if (!tbody) return { ok: false, error: 'Report table not found' };
        const trs = Array.from(tbody.querySelectorAll('tr'));
        const data = [];
        for (let i = 0; i < trs.length; i++) {
          const cells = trs[i].querySelectorAll('td');
          if (cells.length > Math.max(dateColIdx, durationColIdx)) {
            const date = (cells[dateColIdx]?.textContent || '').trim();
            const duration = (cells[durationColIdx]?.textContent || '').trim();
            const serviceCode = (cells.length > serviceCodeColIdx ? (cells[serviceCodeColIdx]?.textContent || '').trim() : '');
            if (date || duration) data.push({ date, duration, serviceCode });
          }
        }
        return { ok: true, rows: data };
      },
      args: [dateCol, durationCol, serviceCodeCol]
    });

    const allRows = results?.[0]?.result?.rows || [];
    if (allRows.length === 0) {
      setStatus('No timesheets found for this contact in the given period.', true);
      return { clientName: clientName || '', reports: [] };
    }

    for (let idx = 0; idx < SERVICE_CODES.length; idx++) {
      const code = SERVICE_CODES[idx];
      const prefixMatch = code.split(' ')[0]; // e.g., '97153' from '97153 tx'
      
      const filteredRows = allRows.filter(r => r.serviceCode && r.serviceCode.startsWith(prefixMatch));
      if (filteredRows.length === 0) continue;

      setStatus('Step 13: Generating PDF for ' + code + '…');
      const pdfOk = await runPdfExport(tab, {
        serviceCodeOverride: code,
        authorizedHoursOverride: hoursByCode[code] || 0,
        rowsOverride: filteredRows
      });

      if (pdfOk) {
        pdfCount++;
        reportsGenerated.push(code);
      }
      await delay(500);
    }

    setStatus('Done. ' + pdfCount + ' PDF(s) downloaded.');
    return { clientName: clientName || '', reports: reportsGenerated };
  } catch (e) {
    setStatus('Error: ' + (e.message || 'Failed'), true);
    return { clientName: clientName || '', reports: [] };
  }
}

document.getElementById('rbt-btn-run-main').addEventListener('click', async () => {
  if (!requireFolderChosen()) return;
  clearSaveLog();
  queueRunUsedFallback = false;
  queueRunUsedUnfound = false;
  const tab = await getActiveTab();
  if (!tab?.id) {
    setStatus('No active tab.', true);
    return;
  }
  if (reportQueue.length > 0) {
    const total = reportQueue.length;
    const queueResults = [];
    for (let i = 0; i < total; i++) {
      clearSaveDirCache();
      const item = reportQueue[0];
      if (!item) break;
      const label = '(' + (i + 1) + '/' + total + ': ' + item.name + ')';
      setStatus('Loading ' + item.name + '…');
      chrome.tabs.update(tab.id, { url: item.url });
      await rbtWaitTabComplete(tab.id, 10000);
      await new Promise(r => setTimeout(r, 2000));
      const result = await runFullReportFromContactForTab(tab, label);
      const clientName = (result?.clientName || item.name || '').trim() || item.name || 'Unknown';
      queueResults.push({ clientName, reports: result?.reports || [] });
      reportQueue.shift();
      saveQueue();
      if (reportQueue.length > 0) {
        setStatus('Next: ' + reportQueue[0].name + '…');
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    showQueueSummary(queueResults);
    setStatus('Queue complete. See log for summary.');
  } else {
    if (!tab.url?.startsWith('https://members.centralreach.com') || tab.url.indexOf('contacts/details') < 0) {
      setStatus('Open a CentralReach contact page first.', true);
      return;
    }
    await runFullReportFromContactForTab(tab);
    if (queueRunUsedFallback) {
      appendLogRed('Some PDFs saved to Downloads folder (folder access had expired).');
    }
    if (queueRunUsedUnfound) {
      appendLogRed('Some clients were saved to the Unfound Clients folder (no matching client folder).');
    }
  }
});

async function runPdfExport(tab, options = {}) {
  const { serviceCodeOverride, authorizedHoursOverride, rowsOverride } = options;
  const dateCol = (typeof CENTRALREACH_SELECTORS !== 'undefined' && CENTRALREACH_SELECTORS.reportTableDateCol != null)
    ? CENTRALREACH_SELECTORS.reportTableDateCol : 0;
  const durationCol = (typeof CENTRALREACH_SELECTORS !== 'undefined' && CENTRALREACH_SELECTORS.reportTableDurationCol != null)
    ? CENTRALREACH_SELECTORS.reportTableDurationCol : 3;
  const serviceCodeCol = 9;

  try {
    let rows = [];
    if (rowsOverride) {
      rows = rowsOverride;
    } else {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (dateColIdx, durationColIdx, serviceCodeColIdx) => {
          const tbody = document.querySelector('#reportList') || document.querySelector('#reportTable tbody');
          if (!tbody) return { ok: false, error: 'Report table not found' };
          const trs = Array.from(tbody.querySelectorAll('tr'));
          const data = [];
          for (let i = 0; i < trs.length; i++) {
            const cells = trs[i].querySelectorAll('td');
            if (cells.length > Math.max(dateColIdx, durationColIdx)) {
              const date = (cells[dateColIdx]?.textContent || '').trim();
              const duration = (cells[durationColIdx]?.textContent || '').trim();
              const serviceCode = (cells.length > serviceCodeColIdx ? (cells[serviceCodeColIdx]?.textContent || '').trim() : '');
              if (date || duration) data.push({ date, duration, serviceCode });
            }
          }
          return { ok: true, rows: data };
        },
        args: [dateCol, durationCol, serviceCodeCol]
      });

      const result = results?.[0]?.result;
      if (!result?.ok) {
        setStatus(result?.error || 'Failed to read table', true);
        return false;
      }
      rows = result.rows || [];
    }

    if (rows.length === 0) {
      setStatus('No results—skipped.');
      return true;
    }

    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
      setStatus('PDF library not loaded.', true);
      return false;
    }

    let totalMinutes = 0;
    for (let i = 0; i < rows.length; i++) {
      const d = (rows[i].duration || '').trim();
      const m = d.match(/^(\d+):(\d{2})$/);
      if (m) totalMinutes += parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    }
    const totalHours = Math.floor(totalMinutes / 60);
    const totalMins = totalMinutes % 60;
    const totalStr = (totalHours || totalMinutes) ? (totalHours + 'hrs' + (totalMins > 0 ? ' ' + totalMins + ' mins' : '')) : '0hrs';

    const clientName = (document.getElementById('rbt-pdf-client-name')?.value || '').trim();
    const clientDOB = (document.getElementById('rbt-pdf-dob')?.value || '').trim();
    const dateFrom = (document.getElementById('rbt-run-start-date')?.value || '').trim();
    const dateTo = (document.getElementById('rbt-run-stop-date')?.value || '').trim();
    const authPeriod = (dateFrom && dateTo) ? (dateFrom + ' - ' + dateTo) : '';
    console.log('[CentralReach Helper] [DATES] PDF export — auth period from SIDEPANEL FORM (used in PDF header):', { dateFrom, dateTo, authPeriod, clientName, source: 'sidepanel form' });
    const serviceCode = (serviceCodeOverride != null ? serviceCodeOverride : (document.getElementById('rbt-run-service-code')?.value || '').trim());
    const authorizedHours = (authorizedHoursOverride != null ? authorizedHoursOverride : (() => {
      const raw = (document.getElementById('rbt-pdf-authorized-hours')?.value || '').trim();
      return raw ? parseFloat(raw) : 0;
    })());
    const totalDurationHours = totalMinutes / 60;
    const utilizationPercent = (authorizedHours > 0) ? Math.round((totalDurationHours / authorizedHours) * 1000) / 10 : 0;
    const pageW = 210;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', compress: true });
    const colW = [55, 45];
    const tableW = colW[0] + colW[1];
    const startX = (pageW - tableW) / 2;
    const logoH = 28;
    const logoMargin = 6;
    const startY = 38 + logoH + logoMargin * 2;
    const rowH = 8;
    const headerH = 10;

    /* logo skipped in Hidden Lights POEL build */

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Authorization Utilization Report', pageW / 2, logoMargin + logoH + logoMargin + 8, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text('Client name: ' + clientName + '  |  DOB: ' + clientDOB + '  |  Auth period: ' + authPeriod, pageW / 2, logoMargin + logoH + logoMargin + 18, { align: 'center' });
    doc.setFont(undefined, 'bold');
    const serviceCodeDisplay = (String(serviceCode).match(/\d{5}/g) || []).join(',') || serviceCode;
    doc.text('Service code: ' + serviceCodeDisplay + ' – Authorized hours: ' + authorizedHours, pageW / 2, logoMargin + logoH + logoMargin + 26, { align: 'center' });
    doc.setFont(undefined, 'normal');

    let y = startY;
    doc.rect(startX, y, tableW, headerH);
    doc.setFont(undefined, 'bold');
    doc.text('Date', startX + 3, y + 7);
    doc.text('Duration', startX + colW[0] + 3, y + 7);
    doc.setFont(undefined, 'normal');
    doc.line(startX + colW[0], y, startX + colW[0], y + headerH);
    y += headerH;

    for (let i = 0; i < rows.length; i++) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.rect(startX, y, tableW, rowH);
      doc.line(startX + colW[0], y, startX + colW[0], y + rowH);
      doc.text((rows[i].date || '').substring(0, 18), startX + 3, y + 5.5);
      doc.text(rows[i].duration || '', startX + colW[0] + 3, y + 5.5);
      y += rowH;
    }

    y += 12;
    doc.setFont(undefined, 'bold');
    doc.text('Total: ' + totalStr, pageW / 2, y, { align: 'center' });
    doc.setFont(undefined, 'normal');
    y += 8;
    const utilLabel = authorizedHours > 0
      ? 'Utilization: ' + utilizationPercent + '% (total ' + totalStr + ' ÷ ' + authorizedHours + ' authorized hrs)'
      : 'Utilization: ' + utilizationPercent + '% (enter authorized hours to calculate)';
    doc.text(utilLabel, pageW / 2, y, { align: 'center' });
    y += 10;

    // const lowUtilThreshold = parseFloat((document.getElementById('rbt-settings-low-util-threshold')?.value || '80').trim()) || 80;
    // if (utilizationPercent < lowUtilThreshold) {
    //   doc.setTextColor(220, 53, 69);
    //   doc.setFontSize(9);
    //   const lowUtilMsg = 'Utilization was impacted by brief staffing challenges. A qualified RBT is now assigned and delivering services consistently, with no anticipated disruptions moving forward.';
    //   doc.text(lowUtilMsg, pageW / 2, y, { maxWidth: 170, align: 'center' });
    //   doc.setTextColor(0, 0, 0);
    //   doc.setFontSize(10);
    // }

    const blob = doc.output('blob');
    const ptName = (clientName || 'Pt').replace(/[/\\:*?"<>|]/g, '').trim().replace(/\s+/g, ' ') || 'Pt';
    const codeNum = (String(serviceCode).match(/\d{5}/g) || []).join(',') || 'code';
    const dateRange = (dateFrom && dateTo)
      ? (dateFrom + ' - ' + dateTo).replace(/\//g, '-')
      : new Date().toISOString().slice(0, 10);
    const baseFilename = ptName + ' ' + codeNum + ' ' + dateRange + '.pdf';

    if (!customSaveDirHandle) {
      setStatus('Choose the Clients folder above first.', true);
      return false;
    }
    try {
      appendLog('Saving PDF for: ' + (clientName || 'Pt'));
      const resolved = await getSaveDirectoryForClient(clientName || ptName);
      if (!resolved) {
        setStatus('No save folder chosen.', true);
        return false;
      }
      const fileHandle = await resolved.dirHandle.getFileHandle(baseFilename, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      appendLog('Saved: ' + baseFilename + ' -> ' + resolved.logPath);
      setStatus('Exported ' + rows.length + ' rows to ' + resolved.logPath);
    } catch (e) {
      if (isFileSystemPermissionError(e)) {
        queueRunUsedFallback = true;
        appendLogRed('Folder access expired. Using Downloads folder.');
        customSaveDirHandle = null;
        await clearDirHandleFromStorage();
        updateChosenFolderUIFull();
        rbtDownloadBlob(blob, baseFilename, rows.length);
      } else {
        appendLog('Save failed: ' + (e.message || 'Unknown error'));
        setStatus('Save failed: ' + (e.message || 'Unknown error'), true);
      }
    }
    savePdfFormToStorage();
    return true;
  } catch (err) {
    setStatus('Error: ' + (err.message || 'Could not export'), true);
    return false;
  }
}

function doChooseFolder() {
  return (async () => {
    if (!('showDirectoryPicker' in self)) {
      setStatus('Choose folder not supported in this browser.', true);
      return;
    }
    try {
      const handle = await showDirectoryPicker({ mode: 'readwrite' });
      customSaveDirHandle = handle;
      await saveDirHandleToStorage(handle);
      updateChosenFolderUIFull();
      setStatus('Clients folder chosen. Saved for next time.');
    } catch (e) {
      if (e.name === 'AbortError') return;
      setStatus('Could not open folder: ' + (e.message || 'Unknown error'), true);
    }
  })();
}

async function verifyDirHandle(handle) {
  try {
    for await (const _ of handle.entries()) { break; }
    return true;
  } catch (e) {
    return false;
  }
}

async function restoreDirHandle() {
  const handle = await loadDirHandleFromStorage();
  if (!handle) return;
  const valid = await verifyDirHandle(handle);
  if (!valid) {
    await clearDirHandleFromStorage();
    customSaveDirHandle = null;
    updateChosenFolderUIFull();
    return;
  }
  customSaveDirHandle = handle;
  updateChosenFolderUIFull();
}

document.getElementById('rbt-btn-choose-folder').addEventListener('click', doChooseFolder);

document.getElementById('rbt-btn-show-settings').addEventListener('click', function () {
  const section = document.getElementById('rbt-settings-section');
  if (!section) return;
  const isHidden = section.style.display === 'none';
  section.style.display = isHidden ? 'block' : 'none';
  this.textContent = isHidden ? 'Hide settings' : 'Show settings';
});

['rbt-settings-low-util-threshold', 'rbt-settings-unfound-folder', 'rbt-settings-auth-selection'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('change', savePdfFormToStorage);
});

function updateChosenFolderUIFull() {
  const btn = document.getElementById('rbt-btn-choose-folder');
  if (btn) btn.textContent = customSaveDirHandle ? (customSaveDirHandle.name || 'Chosen folder') : 'Choose Clients folder';
  const visible = !!customSaveDirHandle;
  const mainContent = document.getElementById('rbt-main-content');
  if (mainContent) mainContent.style.display = visible ? 'flex' : 'none';
}

document.getElementById('rbt-btn-manual-mode').addEventListener('click', function () {
  const section = document.getElementById('rbt-manual-mode-section');
  if (!section) return;
  const isHidden = section.style.display === 'none';
  section.style.display = isHidden ? 'block' : 'none';
  this.textContent = isHidden ? 'Hide manual mode' : 'Manual mode';
});

(async function rbtBoot() {
  loadFormValues();
  loadQueue();
  await restoreDirHandle();
  updateChosenFolderUIFull();
})();


})();


})();