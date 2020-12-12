//
// baguetteboxjs
//

/**************************************************
 * exchange data-caption with data-title
 **************************************************/

/*!
 * baguetteBox.js
 * @author  feimosi
 * @version 1.11.0
 * @url https://github.com/feimosi/baguetteBox.js
 */
!function(e,t){"use strict";"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.baguetteBox=t()}(this,function(){"use strict";var s,l,u,c,d,f='<svg width="44" height="60"><polyline points="30 10 10 30 30 50" stroke="rgba(255,255,255,0.5)" stroke-width="4"stroke-linecap="butt" fill="none" stroke-linejoin="round"/></svg>',g='<svg width="44" height="60"><polyline points="14 10 34 30 14 50" stroke="rgba(255,255,255,0.5)" stroke-width="4"stroke-linecap="butt" fill="none" stroke-linejoin="round"/></svg>',p='<svg width="30" height="30"><g stroke="rgb(160,160,160)" stroke-width="4"><line x1="5" y1="5" x2="25" y2="25"/><line x1="5" y1="25" x2="25" y2="5"/></g></svg>',b={},m={captions:!0,buttons:"auto",fullScreen:!1,noScrollbars:!1,bodyClass:"baguetteBox-open",titleTag:!1,async:!1,preload:2,animation:"slideIn",afterShow:null,afterHide:null,onChange:null,overlayBackgroundColor:"rgba(0,0,0,.8)"},v={},h=[],o=0,n=!1,i={},a=!1,y=/.+\.(gif|jpe?g|png|webp)/i,w={},k=[],r=null,x=function(e){-1!==e.target.id.indexOf("baguette-img")&&j()},C=function(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0,D()},E=function(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0,X()},B=function(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0,j()},T=function(e){i.count++,1<i.count&&(i.multitouch=!0),i.startX=e.changedTouches[0].pageX,i.startY=e.changedTouches[0].pageY},N=function(e){if(!a&&!i.multitouch){e.preventDefault?e.preventDefault():e.returnValue=!1;var t=e.touches[0]||e.changedTouches[0];40<t.pageX-i.startX?(a=!0,D()):t.pageX-i.startX<-40?(a=!0,X()):100<i.startY-t.pageY&&j()}},L=function(){i.count--,i.count<=0&&(i.multitouch=!1),a=!1},A=function(){L()},P=function(e){"block"===s.style.display&&s.contains&&!s.contains(e.target)&&(e.stopPropagation(),Y())};function S(e){if(w.hasOwnProperty(e)){var t=w[e].galleries;[].forEach.call(t,function(e){[].forEach.call(e,function(e){W(e.imageElement,"click",e.eventHandler)}),h===e&&(h=[])}),delete w[e]}}function F(e){switch(e.keyCode){case 37:D();break;case 39:X();break;case 27:j();break;case 36:!function t(e){e&&e.preventDefault();return M(0)}(e);break;case 35:!function n(e){e&&e.preventDefault();return M(h.length-1)}(e)}}function H(e,t){if(h!==e){for(h=e,function r(e){e||(e={});for(var t in m)b[t]=m[t],"undefined"!=typeof e[t]&&(b[t]=e[t]);l.style.transition=l.style.webkitTransition="fadeIn"===b.animation?"opacity .4s ease":"slideIn"===b.animation?"":"none","auto"===b.buttons&&("ontouchstart"in window||1===h.length)&&(b.buttons=!1);u.style.display=c.style.display=b.buttons?"":"none";try{s.style.backgroundColor=b.overlayBackgroundColor}catch(n){}}(t);l.firstChild;)l.removeChild(l.firstChild);for(var n,o=[],i=[],a=k.length=0;a<e.length;a++)(n=J("div")).className="full-image",n.id="baguette-img-"+a,k.push(n),o.push("baguetteBox-figure-"+a),i.push("baguetteBox-figcaption-"+a),l.appendChild(k[a]);s.setAttribute("aria-labelledby",o.join(" ")),s.setAttribute("aria-describedby",i.join(" "))}}function I(e){b.noScrollbars&&(document.documentElement.style.overflowY="hidden",document.body.style.overflowY="scroll"),"block"!==s.style.display&&(U(document,"keydown",F),i={count:0,startX:null,startY:null},q(o=e,function(){z(o),V(o)}),R(),s.style.display="block",b.fullScreen&&function t(){s.requestFullscreen?s.requestFullscreen():s.webkitRequestFullscreen?s.webkitRequestFullscreen():s.mozRequestFullScreen&&s.mozRequestFullScreen()}(),setTimeout(function(){s.className="visible",b.bodyClass&&document.body.classList&&document.body.classList.add(b.bodyClass),b.afterShow&&b.afterShow()},50),b.onChange&&b.onChange(o,k.length),r=document.activeElement,Y(),n=!0)}function Y(){b.buttons?u.focus():d.focus()}function j(){b.noScrollbars&&(document.documentElement.style.overflowY="auto",document.body.style.overflowY="auto"),"none"!==s.style.display&&(W(document,"keydown",F),s.className="",setTimeout(function(){s.style.display="none",document.fullscreen&&function e(){document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen&&document.webkitExitFullscreen()}(),b.bodyClass&&document.body.classList&&document.body.classList.remove(b.bodyClass),b.afterHide&&b.afterHide(),r&&r.focus(),n=!1},500))}function q(t,n){var e=k[t],o=h[t];if(void 0!==e&&void 0!==o)if(e.getElementsByTagName("img")[0])n&&n();else{var i=o.imageElement,a=i.getElementsByTagName("img")[0],r="function"==typeof b.captions?b.captions.call(h,i):i.getAttribute("data-title")||i.title,s=function d(e){var t=e.href;if(e.dataset){var n=[];for(var o in e.dataset)"at-"!==o.substring(0,3)||isNaN(o.substring(3))||(n[o.replace("at-","")]=e.dataset[o]);for(var i=Object.keys(n).sort(function(e,t){return parseInt(e,10)<parseInt(t,10)?-1:1}),a=window.innerWidth*window.devicePixelRatio,r=0;r<i.length-1&&i[r]<a;)r++;t=n[i[r]]||t}return t}(i),l=J("figure");if(l.id="baguetteBox-figure-"+t,l.innerHTML='<div class="baguetteBox-spinner"><div class="baguetteBox-double-bounce1"></div><div class="baguetteBox-double-bounce2"></div></div>',b.captions&&r){var u=J("figcaption");u.id="baguetteBox-figcaption-"+t,u.innerHTML=r,l.appendChild(u)}e.appendChild(l);var c=J("img");c.onload=function(){var e=document.querySelector("#baguette-img-"+t+" .baguetteBox-spinner");l.removeChild(e),!b.async&&n&&n()},c.setAttribute("src",s),c.alt=a&&a.alt||"",b.titleTag&&r&&(c.title=r),l.appendChild(c),b.async&&n&&n()}}function X(){return M(o+1)}function D(){return M(o-1)}function M(e,t){return!n&&0<=e&&e<t.length?(H(t,b),I(e),!0):e<0?(b.animation&&O("left"),!1):e>=k.length?(b.animation&&O("right"),!1):(q(o=e,function(){z(o),V(o)}),R(),b.onChange&&b.onChange(o,k.length),!0)}function O(e){l.className="bounce-from-"+e,setTimeout(function(){l.className=""},400)}function R(){var e=100*-o+"%";"fadeIn"===b.animation?(l.style.opacity=0,setTimeout(function(){v.transforms?l.style.transform=l.style.webkitTransform="translate3d("+e+",0,0)":l.style.left=e,l.style.opacity=1},400)):v.transforms?l.style.transform=l.style.webkitTransform="translate3d("+e+",0,0)":l.style.left=e}function z(e){e-o>=b.preload||q(e+1,function(){z(e+1)})}function V(e){o-e>=b.preload||q(e-1,function(){V(e-1)})}function U(e,t,n,o){e.addEventListener?e.addEventListener(t,n,o):e.attachEvent("on"+t,function(e){(e=e||window.event).target=e.target||e.srcElement,n(e)})}function W(e,t,n,o){e.removeEventListener?e.removeEventListener(t,n,o):e.detachEvent("on"+t,n)}function G(e){return document.getElementById(e)}function J(e){return document.createElement(e)}return[].forEach||(Array.prototype.forEach=function(e,t){for(var n=0;n<this.length;n++)e.call(t,this[n],n,this)}),[].filter||(Array.prototype.filter=function(e,t,n,o,i){for(n=this,o=[],i=0;i<n.length;i++)e.call(t,n[i],i,n)&&o.push(n[i]);return o}),{run:function K(e,t){return v.transforms=function n(){var e=J("div");return"undefined"!=typeof e.style.perspective||"undefined"!=typeof e.style.webkitPerspective}(),v.svg=function o(){var e=J("div");return e.innerHTML="<svg/>","http://www.w3.org/2000/svg"===(e.firstChild&&e.firstChild.namespaceURI)}(),v.passiveEvents=function i(){var e=!1;try{var t=Object.defineProperty({},"passive",{get:function(){e=!0}});window.addEventListener("test",null,t)}catch(n){}return e}(),function a(){if(s=G("baguetteBox-overlay"))return l=G("baguetteBox-slider"),u=G("previous-button"),c=G("next-button"),void(d=G("close-button"));(s=J("div")).setAttribute("role","dialog"),s.id="baguetteBox-overlay",document.getElementsByTagName("body")[0].appendChild(s),(l=J("div")).id="baguetteBox-slider",s.appendChild(l),(u=J("button")).setAttribute("type","button"),u.id="previous-button",u.setAttribute("aria-label","Previous"),u.innerHTML=v.svg?f:"&lt;",s.appendChild(u),(c=J("button")).setAttribute("type","button"),c.id="next-button",c.setAttribute("aria-label","Next"),c.innerHTML=v.svg?g:"&gt;",s.appendChild(c),(d=J("button")).setAttribute("type","button"),d.id="close-button",d.setAttribute("aria-label","Close"),d.innerHTML=v.svg?p:"&times;",s.appendChild(d),u.className=c.className=d.className="baguetteBox-button",function t(){var e=v.passiveEvents?{passive:!0}:null;U(s,"click",x),U(u,"click",C),U(c,"click",E),U(d,"click",B),U(l,"contextmenu",A),U(s,"touchstart",T,e),U(s,"touchmove",N,e),U(s,"touchend",L),U(document,"focus",P,!0)}()}(),S(e),function r(e,a){var t=document.querySelectorAll(e),n={galleries:[],nodeList:t};return w[e]=n,[].forEach.call(t,function(e){a&&a.filter&&(y=a.filter);var t=[];if(t="A"===e.tagName?[e]:e.getElementsByTagName("a"),0!==(t=[].filter.call(t,function(e){if(-1===e.className.indexOf(a&&a.ignoreClass))return y.test(e.href)})).length){var i=[];[].forEach.call(t,function(e,t){var n=function(e){e.preventDefault?e.preventDefault():e.returnValue=!1,H(i,a),I(t)},o={eventHandler:n,imageElement:e};U(e,"click",n),i.push(o)}),n.galleries.push(i)}}),n.galleries}(e,t)},show:M,showNext:X,showPrevious:D,hide:j,destroy:function e(){!function t(){var e=v.passiveEvents?{passive:!0}:null;W(s,"click",x),W(u,"click",C),W(c,"click",E),W(d,"click",B),W(l,"contextmenu",A),W(s,"touchstart",T,e),W(s,"touchmove",N,e),W(s,"touchend",L),W(document,"focus",P,!0)}(),function n(){for(var e in w)w.hasOwnProperty(e)&&S(e)}(),W(document,"keydown",F),document.getElementsByTagName("body")[0].removeChild(document.getElementById("baguetteBox-overlay")),w={},h=[],o=0}}});

/*! jQuery Migrate v1.2.1 | (c) 2005, 2013 jQuery Foundation, Inc. and other contributors | jquery.org/license */
jQuery.migrateMute===void 0&&(jQuery.migrateMute=!0),function(e,t,n){function r(n){var r=t.console;i[n]||(i[n]=!0,e.migrateWarnings.push(n),r&&r.warn&&!e.migrateMute&&(r.warn("JQMIGRATE: "+n),e.migrateTrace&&r.trace&&r.trace()))}function a(t,a,i,o){if(Object.defineProperty)try{return Object.defineProperty(t,a,{configurable:!0,enumerable:!0,get:function(){return r(o),i},set:function(e){r(o),i=e}}),n}catch(s){}e._definePropertyBroken=!0,t[a]=i}var i={};e.migrateWarnings=[],!e.migrateMute&&t.console&&t.console.log&&t.console.log("JQMIGRATE: Logging is active"),e.migrateTrace===n&&(e.migrateTrace=!0),e.migrateReset=function(){i={},e.migrateWarnings.length=0},"BackCompat"===document.compatMode&&r("jQuery is not compatible with Quirks Mode");var o=e("<input/>",{size:1}).attr("size")&&e.attrFn,s=e.attr,u=e.attrHooks.value&&e.attrHooks.value.get||function(){return null},c=e.attrHooks.value&&e.attrHooks.value.set||function(){return n},l=/^(?:input|button)$/i,d=/^[238]$/,p=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,f=/^(?:checked|selected)$/i;a(e,"attrFn",o||{},"jQuery.attrFn is deprecated"),e.attr=function(t,a,i,u){var c=a.toLowerCase(),g=t&&t.nodeType;return u&&(4>s.length&&r("jQuery.fn.attr( props, pass ) is deprecated"),t&&!d.test(g)&&(o?a in o:e.isFunction(e.fn[a])))?e(t)[a](i):("type"===a&&i!==n&&l.test(t.nodeName)&&t.parentNode&&r("Can't change the 'type' of an input or button in IE 6/7/8"),!e.attrHooks[c]&&p.test(c)&&(e.attrHooks[c]={get:function(t,r){var a,i=e.prop(t,r);return i===!0||"boolean"!=typeof i&&(a=t.getAttributeNode(r))&&a.nodeValue!==!1?r.toLowerCase():n},set:function(t,n,r){var a;return n===!1?e.removeAttr(t,r):(a=e.propFix[r]||r,a in t&&(t[a]=!0),t.setAttribute(r,r.toLowerCase())),r}},f.test(c)&&r("jQuery.fn.attr('"+c+"') may use property instead of attribute")),s.call(e,t,a,i))},e.attrHooks.value={get:function(e,t){var n=(e.nodeName||"").toLowerCase();return"button"===n?u.apply(this,arguments):("input"!==n&&"option"!==n&&r("jQuery.fn.attr('value') no longer gets properties"),t in e?e.value:null)},set:function(e,t){var a=(e.nodeName||"").toLowerCase();return"button"===a?c.apply(this,arguments):("input"!==a&&"option"!==a&&r("jQuery.fn.attr('value', val) no longer sets properties"),e.value=t,n)}};var g,h,v=e.fn.init,m=e.parseJSON,y=/^([^<]*)(<[\w\W]+>)([^>]*)$/;e.fn.init=function(t,n,a){var i;return t&&"string"==typeof t&&!e.isPlainObject(n)&&(i=y.exec(e.trim(t)))&&i[0]&&("<"!==t.charAt(0)&&r("$(html) HTML strings must start with '<' character"),i[3]&&r("$(html) HTML text after last tag is ignored"),"#"===i[0].charAt(0)&&(r("HTML string cannot start with a '#' character"),e.error("JQMIGRATE: Invalid selector string (XSS)")),n&&n.context&&(n=n.context),e.parseHTML)?v.call(this,e.parseHTML(i[2],n,!0),n,a):v.apply(this,arguments)},e.fn.init.prototype=e.fn,e.parseJSON=function(e){return e||null===e?m.apply(this,arguments):(r("jQuery.parseJSON requires a valid JSON string"),null)},e.uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||0>e.indexOf("compatible")&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},e.browser||(g=e.uaMatch(navigator.userAgent),h={},g.browser&&(h[g.browser]=!0,h.version=g.version),h.chrome?h.webkit=!0:h.webkit&&(h.safari=!0),e.browser=h),a(e,"browser",e.browser,"jQuery.browser is deprecated"),e.sub=function(){function t(e,n){return new t.fn.init(e,n)}e.extend(!0,t,this),t.superclass=this,t.fn=t.prototype=this(),t.fn.constructor=t,t.sub=this.sub,t.fn.init=function(r,a){return a&&a instanceof e&&!(a instanceof t)&&(a=t(a)),e.fn.init.call(this,r,a,n)},t.fn.init.prototype=t.fn;var n=t(document);return r("jQuery.sub() is deprecated"),t},e.ajaxSetup({converters:{"text json":e.parseJSON}});var b=e.fn.data;e.fn.data=function(t){var a,i,o=this[0];return!o||"events"!==t||1!==arguments.length||(a=e.data(o,t),i=e._data(o,t),a!==n&&a!==i||i===n)?b.apply(this,arguments):(r("Use of jQuery.fn.data('events') is deprecated"),i)};var j=/\/(java|ecma)script/i,w=e.fn.andSelf||e.fn.addBack;e.fn.andSelf=function(){return r("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"),w.apply(this,arguments)},e.clean||(e.clean=function(t,a,i,o){a=a||document,a=!a.nodeType&&a[0]||a,a=a.ownerDocument||a,r("jQuery.clean() is deprecated");var s,u,c,l,d=[];if(e.merge(d,e.buildFragment(t,a).childNodes),i)for(c=function(e){return!e.type||j.test(e.type)?o?o.push(e.parentNode?e.parentNode.removeChild(e):e):i.appendChild(e):n},s=0;null!=(u=d[s]);s++)e.nodeName(u,"script")&&c(u)||(i.appendChild(u),u.getElementsByTagName!==n&&(l=e.grep(e.merge([],u.getElementsByTagName("script")),c),d.splice.apply(d,[s+1,0].concat(l)),s+=l.length));return d});var Q=e.event.add,x=e.event.remove,k=e.event.trigger,N=e.fn.toggle,T=e.fn.live,M=e.fn.die,S="ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",C=RegExp("\\b(?:"+S+")\\b"),H=/(?:^|\s)hover(\.\S+|)\b/,A=function(t){return"string"!=typeof t||e.event.special.hover?t:(H.test(t)&&r("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'"),t&&t.replace(H,"mouseenter$1 mouseleave$1"))};e.event.props&&"attrChange"!==e.event.props[0]&&e.event.props.unshift("attrChange","attrName","relatedNode","srcElement"),e.event.dispatch&&a(e.event,"handle",e.event.dispatch,"jQuery.event.handle is undocumented and deprecated"),e.event.add=function(e,t,n,a,i){e!==document&&C.test(t)&&r("AJAX events should be attached to document: "+t),Q.call(this,e,A(t||""),n,a,i)},e.event.remove=function(e,t,n,r,a){x.call(this,e,A(t)||"",n,r,a)},e.fn.error=function(){var e=Array.prototype.slice.call(arguments,0);return r("jQuery.fn.error() is deprecated"),e.splice(0,0,"error"),arguments.length?this.bind.apply(this,e):(this.triggerHandler.apply(this,e),this)},e.fn.toggle=function(t,n){if(!e.isFunction(t)||!e.isFunction(n))return N.apply(this,arguments);r("jQuery.fn.toggle(handler, handler...) is deprecated");var a=arguments,i=t.guid||e.guid++,o=0,s=function(n){var r=(e._data(this,"lastToggle"+t.guid)||0)%o;return e._data(this,"lastToggle"+t.guid,r+1),n.preventDefault(),a[r].apply(this,arguments)||!1};for(s.guid=i;a.length>o;)a[o++].guid=i;return this.click(s)},e.fn.live=function(t,n,a){return r("jQuery.fn.live() is deprecated"),T?T.apply(this,arguments):(e(this.context).on(t,this.selector,n,a),this)},e.fn.die=function(t,n){return r("jQuery.fn.die() is deprecated"),M?M.apply(this,arguments):(e(this.context).off(t,this.selector||"**",n),this)},e.event.trigger=function(e,t,n,a){return n||C.test(e)||r("Global events are undocumented and deprecated"),k.call(this,e,t,n||document,a)},e.each(S.split("|"),function(t,n){e.event.special[n]={setup:function(){var t=this;return t!==document&&(e.event.add(document,n+"."+e.guid,function(){e.event.trigger(n,null,t,!0)}),e._data(this,n,e.guid++)),!1},teardown:function(){return this!==document&&e.event.remove(document,n+"."+e._data(this,n)),!1}}})}(jQuery,window);
var stacks = {};
stacks.jQuery = jQuery.noConflict(true);
stacks.stacks_in_58_page5 = {};
stacks.stacks_in_58_page5 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;/* Gallery 3 3.11.1 */

$(function() {

    var getRetinaImage = function(image) {
        // 736 iPhone 6s Plus, 768 iPad Air
        if (window.innerWidth >= 736 && window.devicePixelRatio > 1 || window.innerWidth >= 1366) {
            if (image.srcset && image.srcset.indexOf(',') != -1) {
                var srcset = image.srcset.split(',');
                if (srcset.length > 1) {
                    return srcset[1].substring(0, srcset[1].length-3);
                }
            }
        }
        return image.src;
    };

    /**
    * Randomize array element order in-place.
    * Using Durstenfeld shuffle algorithm.
    */
    var shuffleArray = function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };

    var initializeLibraries = function(images, allowImageShuffle, initializeLightbox) {
        if (images.length > 0) {

            if (allowImageShuffle) {
                
            }

            if (stacks['stacks_in_58_page5'].initializeGrid) {
                stacks['stacks_in_58_page5'].initializeGrid('.stacks_in_58_page5_photo_wrapper', images, function () {
                    if (initializeLightbox) {
                        if (stacks['stacks_in_58_page5'].initializeLightbox) {
                            stacks['stacks_in_58_page5'].initializeLightbox('.stacks_in_58_page5_photo_wrapper', images, function () {
                                //$('#stacks_in_58_page5').toggle();
                                
                            });
                        }
                    }
                });
            }
            if (stacks['stacks_in_58_page5'].initializeSlider) {
                stacks['stacks_in_58_page5'].initializeSlider('.stacks_in_58_page5_photo_wrapper', images, function () {
                    //$('#stacks_in_58_page5').toggle();
                });
            }
        }
    };

    stacks['stacks_in_58_page5'].refreshLibraries = initializeLibraries;

    var images = [];
    // Synchrounous
    $.each($('.stacks_in_58_page5_photo_wrapper').children(), function(){
        // standard image stack
        if (this.children && this.children[0] && (
            $(this.children[0]).hasClass('image_stack') || 
            $(this.children[0]).hasClass('site_image_stack') || 
        	$(this.children[0]).hasClass('de_futural_remoteimagestack_stack') || 
        	$(this.children[0]).hasClass('de_futural_repostack_warehouseimage_stack'))) {
            $.each($(this).find('img'), function(index, val) {
                if (this) {
                    images.push({
                        imgLgSrc:       getRetinaImage(this),
                        imgLgCaption: this.alt,
                        imgSmSrc:     this.src,
                        imgSmCaption: this.alt
                    });
                }
            });
        }
        // stack with thumbnail
        else if (this.children && this.children[0] && ($(this.children[0]).hasClass('de_futural_gallerystack3_photo_local_rectangular_stack') 
            || $(this.children[0]).hasClass('de_futural_gallerystack3_photo_local_square_stack') 
            || $(this.children[0]).hasClass('de_futural_gallerystack3_image_stack'))) {
            $.each($(this).find('.stacks_in'), function(index, val) {
                if (this.children[0].children[0]) {
                    images.push({
                        imgLgSrc:     getRetinaImage(this.children[0].children[0]),
                        imgLgCaption: this.children[0].children[0].alt,
                        imgSmSrc:     this.children[1].children[0].src,
                        imgSmCaption: this.children[0].children[0].alt
                    });
                }
            });
        }
        // img large and thumb src in data set
        else if (this.children && this.children[0] && $(this.children[0]).hasClass('de_futural_gallerystack3_imagepro_stack')) {
            if (this.children[0].children[0]) {
                images.push({
                    imgLgSrc:     this.children[0].children[0].dataset.lgSrc,
                    imgLgCaption: this.children[0].children[0].dataset.lgAlt,
                    imgSmSrc:     this.children[0].children[0].dataset.smSrc,
                    imgSmCaption: this.children[0].children[0].dataset.lgAlt
                });
            }
        }
        // directory
        else if ($(this).hasClass('de_futural_gallerystack3_directory')) {
            images.push({
                imgLgSrc:     this.dataset.lgSrc,
                imgLgCaption: this.dataset.lgAlt,
                imgLgHeight:  this.dataset.lgHeight,
                imgLgWidth:   this.dataset.lgWidth,
                imgSmSrc:     this.dataset.smSrc,
                imgSmCaption: this.dataset.smAlt,
                imgSmHeight:  this.dataset.smHeight,
                imgSmWidth:   this.dataset.smWidth
            });
        }
        // Total CMS #image
        else if ($(this).hasClass('total-cms-image')) {
            var that = this;
            
            $.ajax({
                url: this.src,
                async: false
            })
            .done(function() {
                images.push({
                    imgLgSrc:     that.dataset.img,
                    imgLgCaption: that.alt,
                    imgSmSrc:     that.src,
                    imgSmCaption: that.alt
                });
            })
            .fail(function() {
                console.log('Image ' + that.src + ' not available');
            });
            
            
        }
        // Total CMS Gallery
        else if ($(this).hasClass('total-cms-list')) {
            
            
            images.push({
                imgLgSrc:     this.children[0].href,
                imgLgCaption: this.children[0].children[0].alt,
                imgSmSrc:     this.children[0].children[0].src,
                imgSmCaption: this.children[0].children[0].alt
            });
        }
        // Pulse CMS Gallery
        else if ($(this).hasClass('pulse-cms-image-list')) {
            images.push({
                imgLgSrc:      this.children[0].href,
                imgLgCaption: this.children[0].children[0].alt,
                imgSmSrc:      this.children[0].children[0].src,
                imgSmCaption: this.children[0].children[0].alt
            });
        }
        // Total CMS Gallery or Pulse 5 Gallery
        else if ($(this).hasClass('pulse5-image-list')) {
            images.push({
                imgLgSrc:     this.children[0].href,
                imgLgCaption: this.children[0].children[0].alt,
                imgLgHeight:  this.children[0].children[0].dataset.height,
                imgLgWidth:   this.children[0].children[0].dataset.width,
                imgSmSrc:      this.children[0].children[0].src,
                imgSmCaption: this.children[0].children[0].alt,
                imgSmHeight:  this.children[0].children[0].dataset.height,
                imgSmWidth:   this.children[0].children[0].dataset.width
            });
        }
        // Pulse CMS Blog Gallery
        else if ($(this).hasClass('pulse-cms-image-list-blog') || $(this).hasClass('pulse5-image-list-blog')) {
            $.each($('#stacks_in_1_page5 img').css("display","none"), function() {
                images.push({
                    imgLgSrc:      this.src,
                    imgLgCaption: this.alt,
                    imgSmSrc:      this.src,
                    imgSmCaption: this.alt
                });
            });
        }
        // Armadillo Blog
        else if ($(this).hasClass('armadillo-blog')) {
            if ($(".blog-entry") && $(".blog-entry").length == 1) {
                $.each($(".blog-entry img").css("display","none"), function() {
                    images.push({
                        imgLgSrc:     this.src,
                        imgLgCaption: this.alt,
                        imgSmSrc:     this.src,
                        imgSmCaption: this.alt
                    });
                });
            }
        }
        // Armadillo Blog
        else if ($(this).hasClass('armadillo-integration')) {
            if ($(".blog-entry") && $(".blog-entry").length > 1) {
                // don't do anything when more than one blog entry is available -> blog list
            } else {
                $.each($(".armadilloContent img").css("display","none"), function() {
                    images.push({
                        imgLgSrc:     this.src,
                        imgLgCaption: this.alt,
                        imgSmSrc:     this.src,
                        imgSmCaption: this.alt
                    });
                });
            }
            // Additional Sentry Images
            $.each($(".sentryWrapper").not(".sentryEditMode").find("img").css("display","none"), function() {
                images.push({
                    imgLgSrc:     this.src,
                    imgLgCaption: this.alt,
                    imgSmSrc:     this.src,
                    imgSmCaption: this.alt
                });
            });
        }
    });
    if (stacks['stacks_in_58_page5'].asyncImageSource) {
        stacks['stacks_in_58_page5'].asyncImageSource(images, function (images) {
            initializeLibraries(images, true, true);
        });
    } else {
        initializeLibraries(images, true, true);
    }

    

});
return stack;})(stacks.stacks_in_58_page5);
stacks.stacks_in_62_page5 = {};
stacks.stacks_in_62_page5 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;stacks['stacks_in_58_page5'].initializeGrid = function(selector, images, completeCallback) {
	var html = [];
	$.each(images, function(){
		html.push('<div class="thumbnail-wrapper"><a href="');
		html.push(this.imgLgSrc);
		html.push('" data-title="');
		html.push(this.imgLgCaption);
		html.push('"><img alt="');
		html.push(this.imgSmCaption);
		html.push('" src="');
		html.push(this.imgSmSrc);
		html.push('"/></div>');
	});
	$(selector).html(html.join(''));

	completeCallback();
};
return stack;})(stacks.stacks_in_62_page5);
stacks.stacks_in_63_page5 = {};
stacks.stacks_in_63_page5 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;stacks['stacks_in_58_page5'].initializeLightbox = function(selector, images, completeCallback) {
    baguetteBox.run(selector, {
        captions: true,
        overlayBackgroundColor: "rgba(1, 30, 86, 1.00)",
        noScrollbars: true,
        animation: "slideIn",
        filter: /.*/i
    });
	completeCallback();
};
return stack;})(stacks.stacks_in_63_page5);