(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5408,7420],{6437:function(e,t,a){"use strict";a.d(t,{E:function(){return l}});var n=a(7294),r=a(4996),i=a(6742),s=a(641),o=a(4184),c=a.n(o),l=function(){return n.createElement("div",{className:s.Z.buttons},n.createElement(i.Z,{className:c()("button button--primary button--lg",s.Z.getStarted),to:(0,r.Z)("overview/getting-started/")},"Get Started"),n.createElement(i.Z,{href:"https://github.com/erxes/erxes/discussions ",className:c()("button button--outline button--primary button--lg",s.Z.getStarted)},"Join Our Community"))}},5618:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return d}});var n=a(7294),r=a(4184),i=a.n(r),s=a(8648),o=a(2263),c=a(6437),l=a(9578),u=a(9105);function d(){(0,n.useEffect)((function(){var e=document.createElement("script");return e.src="https://w.office.erxes.io/build/formWidget.bundle.js",e.async=!0,document.body.appendChild(e),window.erxesSettings={forms:[{brand_id:"ZJ7bSh",form_id:"r57v72"}]},function(){document.body.removeChild(e)}}),[]);var e=(0,o.default)().siteConfig,t=void 0===e?{}:e,a=t.tagline,r=t.url,d=t.favicon,p=r+"/img/default.jpg";return n.createElement(s.Z,{title:"Agency App and Web Developers",description:a,ogImage:p,url:r,favicon:d},n.createElement(u.Z,null,n.createElement("script",{async:!0,defer:!0,src:"https://buttons.github.io/buttons.js"})),n.createElement("header",{id:"hero",className:i()("hero hero--primary",l.Z.heroBanner)},n.createElement("div",{className:"container"},n.createElement("div",{className:l.Z.header},n.createElement("h1",{className:l.Z.headingOne},"Agency App and Web Developers")))),n.createElement("main",null,n.createElement("div",{className:"container container-sm"},n.createElement("section",{className:l.Z.section},n.createElement("p",null,"When you sign-up to the newsletter below, you experience the exact same erxes experience that your customers and clients will. For one, we will automatically add you to a segmented list so that we only send you emails that you will be interested in, then you will subscribed to a short series of emails exploring erxes and how erxes can help you quite literally add extra money to each client transaction, improve your customer experience and help you to integrate erxes into your own app and website as simple integrations."),n.createElement("p",null,"After the short email series is over, you get occasional emails about erxes. And of course, you can opt-out of any emails from us whenever you want."),n.createElement("p",null,"We recommend signing up with the same email address that you are likely to use when you download and demo erxes."),n.createElement("div",{"data-erxes-embed":"r57v72",className:l.Z.subscribe})))),n.createElement("div",{className:l.Z.cta},n.createElement(c.E,null)))}},6979:function(e,t,a){"use strict";var n=a(7294),r=a(4184),i=a.n(r),s=a(2263),o=a(5977),c=a(2644);t.Z=function(e){var t=(0,n.useState)(!1),r=t[0],l=t[1],u=(0,n.useRef)(null),d=(0,s.default)().siteConfig,p=(void 0===d?{}:d).themeConfig.algolia,m=(0,o.k6)(),h=(0,c.Z)().navigateToSearchPage;var f=function(e){void 0===e&&(e=!0),r||Promise.all([Promise.all([a.e(4362),a.e(5525)]).then(a.t.bind(a,4362,23)),Promise.all([a.e(532),a.e(3343)]).then(a.bind(a,3343))]).then((function(t){var a=t[0].default;l(!0),window.docsearch=a,function(e){window.docsearch({appId:p.appId,apiKey:p.apiKey,indexName:p.indexName,inputSelector:"#search_input_react",algoliaOptions:p.algoliaOptions,autocompleteOptions:{openOnFocus:!0,autoselect:!1,hint:!1},handleSelected:function(e,t,a){t.stopPropagation();var n=document.createElement("a");n.href=a.url;var r="#__docusaurus"===n.hash?""+n.pathname:""+n.pathname+n.hash;m.push(r)}}),e&&u.current.focus()}(e)}))},b=(0,n.useCallback)((function(){f(),r&&u.current.focus(),e.handleSearchBarToggle(!e.isSearchBarExpanded)}),[e.isSearchBarExpanded]),g=(0,n.useCallback)((function(){e.handleSearchBarToggle(!e.isSearchBarExpanded)}),[e.isSearchBarExpanded]),y=(0,n.useCallback)((function(e){var t="mouseover"!==e.type;f(t)})),_=(0,n.useCallback)((function(e){e.defaultPrevented||"Enter"!==e.key||h(e.target.value)}));return n.createElement("div",{className:"navbar__search",key:"search-box"},n.createElement("span",{"aria-label":"expand searchbar",role:"button",className:i()("search-icon",{"search-icon-hidden":e.isSearchBarExpanded}),onClick:b,onKeyDown:b,tabIndex:0}),n.createElement("input",{id:"search_input_react",type:"search",placeholder:"Search","aria-label":"Search",className:i()("navbar__search-input",{"search-bar-expanded":e.isSearchBarExpanded},{"search-bar":!e.isSearchBarExpanded}),onMouseOver:y,onFocus:y,onBlur:g,onKeyDown:_,ref:u}))}},641:function(e,t){"use strict";t.Z={buttons:"buttons_18wb",step:"step_2TGP",dedicationWrapper:"dedicationWrapper_3CLG",featureImage:"featureImage_Nz4U",investIcon:"investIcon_1E_p",smallDesc:"smallDesc_rLtZ",description:"description_30kM",item:"item_281F",link:"link_3jTK",iframe:"iframe_WMJZ",clientsWrapper:"clientsWrapper_2zdX",clients:"clients_21O3",features:"features_2xlB",iconWrapper:"iconWrapper_2t8I",colorYellow:"colorYellow_iVS4",colorPrimary:"colorPrimary_1n6O",descriptionList:"descriptionList_3h7-",styled:"styled_304r",styleSpinner:"styleSpinner_1qYL",spinner:"spinner_3Hax"}},9578:function(e,t){"use strict";t.Z={heroBanner:"heroBanner_3P7f",header:"header_2zn2",headingOne:"headingOne_3QyX",headingTwo:"headingTwo_2KoI",description:"description_326Q",suggestion:"suggestion_2U70",cta:"cta_1SDS",section:"section_1DfF",list:"list_3APv",subscribe:"subscribe_3Njj",tableWrapper:"tableWrapper_y5VS",colorPrimary:"colorPrimary_3Jer",investList:"investList_3bW9"}}}]);