/* ===========================================================
   MK CAREER GUIDANCE — shared site behaviour
   Mobile nav, scroll-reveal animation, notification toast
   =========================================================== */

  // Script to inject external header components cleanly
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error rendering header template:', error));

  // 1. Separate Header-ah fetch panni load panrom
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
      
      // 2. Header load aanathuku apram, current page edhunu check panni 'active' class add panrom
      setActiveNavLink();
    })
    .catch(error => console.error('Error rendering header template:', error));

  function setActiveNavLink() {
    // Current URL path-ah edukrom (e.g., "/about.html")
    const currentPath = window.location.pathname;
    
    // Header-la irukura ella nav links-aiyum select panrom
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
      // First, default-ah irukura active class-ah remove panniduvom
      link.classList.remove('active');
      
      // Link-oda href track-ah edukrom (e.g., "about.html")
      const linkHref = link.getAttribute('href');
      
      // Ippo current URL, link href kooda match aaguthannu check panrom
      if (currentPath.endsWith(linkHref)) {
        link.classList.add('active');
      }
      
      // Oruvelai main root path-la iruntha (e.g., pure domain "/" or index.html), Home-ku active tharom
      if ((currentPath === '/' || currentPath.endsWith('index.html')) && linkHref === 'index.html') {
        link.classList.add('active');
      }
    });
  }


(function(){
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if(toggle && nav){
    toggle.addEventListener("click", function(){
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ nav.classList.remove("open"); });
    });
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.14, rootMargin:"0px 0px -40px 0px"});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("in"); });
  }

  /* ---- Notification toast (shows once per session, after a short delay) ---- */
  function initToast(){
    var toastEl = document.getElementById("mkToast");
    if(!toastEl) return;
    if(sessionStorage.getItem("mk_toast_seen")) return;

    setTimeout(function(){
      toastEl.classList.add("show");
      sessionStorage.setItem("mk_toast_seen", "1");
    }, 1600);

    var closeBtn = toastEl.querySelector(".mk-toast-close");
    if(closeBtn){
      closeBtn.addEventListener("click", function(){
        toastEl.classList.remove("show");
      });
    }
    setTimeout(function(){ toastEl.classList.remove("show"); }, 11000);
  }
  initToast();

  /* ---- Footer year ---- */
  document.querySelectorAll(".js-year").forEach(function(el){
    el.textContent = new Date().getFullYear();
  });
})();
