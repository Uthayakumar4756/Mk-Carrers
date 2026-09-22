/* ===========================================================
   MK CAREER GUIDANCE — Chatbot widget
   - Collects visitor email before chatting ("register")
   - Answers a few common questions with quick-reply buttons
   - Saves every lead + transcript to localStorage (for Admin panel demo)
   - Optionally emails a copy to mk@gmail.com via EmailJS
     (see EMAILJS CONFIG below — free account needed, see README)
   =========================================================== */
(function(){
  "use strict";

  /* ================= EMAILJS CONFIG =================
     1. Create a free account at https://www.emailjs.com
     2. Add an Email Service (e.g. Gmail) connected to mk@gmail.com
     3. Create an Email Template with variables: {{from_email}} {{message}}
     4. Paste your IDs below. Until you do, the chatbot still works —
        it just skips the email step and only saves the lead locally.
  ===================================================== */
  var EMAILJS_PUBLIC_KEY  = "YOUR_EMAILJS_PUBLIC_KEY";
  var EMAILJS_SERVICE_ID  = "YOUR_EMAILJS_SERVICE_ID";
  var EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";
  var NOTIFY_EMAIL = "mk@gmail.com";
  var emailjsReady = false;

  function loadEmailJs(cb){
    if(window.emailjs){ emailjsReady = true; cb(); return; }
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    s.onload = function(){
      try{
        if(EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY.indexOf("YOUR_") !== 0){
          window.emailjs.init(EMAILJS_PUBLIC_KEY);
          emailjsReady = true;
        }
      }catch(e){ console.warn("EmailJS init skipped:", e); }
      cb && cb();
    };
    s.onerror = function(){ cb && cb(); };
    document.head.appendChild(s);
  }
  loadEmailJs(function(){});

  function sendToOwner(fromEmail, message){
    if(!emailjsReady || EMAILJS_SERVICE_ID.indexOf("YOUR_") === 0) return;
    window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_email: fromEmail,
      message: message,
      to_email: NOTIFY_EMAIL
    }).catch(function(err){ console.warn("EmailJS send failed:", err); });
  }

  /* ================= Lead storage (demo DB via localStorage) ================= */
  function saveLead(email){
    var leads = JSON.parse(localStorage.getItem("mk_leads") || "[]");
    var existing = leads.find(function(l){ return l.email === email; });
    if(existing){
      existing.lastSeen = new Date().toISOString();
      existing.visits = (existing.visits || 1) + 1;
    } else {
      leads.push({
        email: email,
        registeredAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        visits: 1,
        messages: []
      });
    }
    localStorage.setItem("mk_leads", JSON.stringify(leads));
  }
  function appendMessage(email, who, text){
    var leads = JSON.parse(localStorage.getItem("mk_leads") || "[]");
    var lead = leads.find(function(l){ return l.email === email; });
    if(!lead) return;
    lead.messages.push({who: who, text: text, at: new Date().toISOString()});
    localStorage.setItem("mk_leads", JSON.stringify(leads));
  }

  /* ================= Canned answers ================= */
  var QUICK_TOPICS = [
    {label:"After 12th options", key:"after12"},
    {label:"College admission help", key:"college"},
    {label:"Scholarship & fees", key:"scholarship"},
    {label:"Talk to a counsellor", key:"counsellor"}
  ];
  var ANSWERS = {
    after12: "After 12th you can explore Engineering, Medical/Allied Health, Arts & Science, or Computer courses depending on your group. Visit our 'After 12th' page for a full stream-wise breakdown, or tell me your group (Maths/Bio/Commerce/Arts) and I'll point you in the right direction.",
    college: "We help you shortlist colleges based on placements, faculty, accreditation, fees and location. Check the 'College & Admissions' page for our full checklist, or share your preferred course and city.",
    scholarship: "We guide students on government & college scholarships, merit concessions, tuition and hostel fee planning. Share your course and community category and our counsellor will share options that fit.",
    counsellor: "Sure! Please share the best phone number to reach you, and Madhankumar's team will call you back within a day. You can also call +91 87654 32456 directly."
  };
  function findAnswer(text){
    var t = text.toLowerCase();
    if(/engineer|b\.?e\.?|b\.?tech|computer|cse/.test(t)) return "For Engineering/Computer Science, popular picks are B.E/B.Tech, B.Sc Computer Science, BCA and AI & ML programs. Want help comparing colleges for these?";
    if(/medical|mbbs|bds|nurs|pharma/.test(t)) return "For Medical & Allied Health, options include MBBS, BDS, Nursing, Pharmacy and Allied Health Sciences via NEET. I can share the eligibility steps if you'd like.";
    if(/arts|commerce|bba|bcom|b\.com/.test(t)) return "For Arts & Commerce, common paths are B.Com, BBA, BA and professional/skill-based programs. Would you like a comparison of career scope for each?";
    if(/fee|scholarship|cost|money/.test(t)) return ANSWERS.scholarship;
    if(/college|admission/.test(t)) return ANSWERS.college;
    if(/call|phone|counsellor|counselor|talk/.test(t)) return ANSWERS.counsellor;
    return "Thanks for sharing that! I've noted it down — our counsellor will follow up by email shortly. You can also pick a topic below.";
  }

  /* ================= DOM refs ================= */
  var fab = document.getElementById("chatFab");
  var panel = document.getElementById("chatPanel");
  var closeBtn = document.getElementById("chatClose");
  var body = document.getElementById("chatBody");
  var form = document.getElementById("chatForm");
  var input = document.getElementById("chatInput");
  if(!fab || !panel) return;

  var visitorEmail = localStorage.getItem("mk_chat_email") || null;
  var awaitingEmail = !visitorEmail;

  function addMsg(who, html){
    var div = document.createElement("div");
    div.className = "chat-msg " + who;
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }
  function addQuickReplies(){
    var wrap = document.createElement("div");
    wrap.className = "chat-quick";
    QUICK_TOPICS.forEach(function(t){
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = t.label;
      b.addEventListener("click", function(){
        addMsg("user", t.label);
        var ans = ANSWERS[t.key];
        setTimeout(function(){ addMsg("bot", ans); }, 350);
        if(visitorEmail){ appendMessage(visitorEmail, "user", t.label); appendMessage(visitorEmail, "bot", ans); }
      });
      wrap.appendChild(b);
    });
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  function openPanel(){
    panel.classList.add("open");
    if(body.dataset.inited) return;
    body.dataset.inited = "1";
    if(awaitingEmail){
      addMsg("bot", "Hi! I'm the MK Career Guidance assistant \uD83D\uDC4B<br>Could you share your email so I can send you the right guidance?");
    } else {
      addMsg("bot", "Welcome back! What would you like help with today?");
      addQuickReplies();
    }
  }
  fab.addEventListener("click", function(){
    var isOpen = panel.classList.contains("open");
    if(isOpen){ panel.classList.remove("open"); } else { openPanel(); input.focus(); }
  });
  closeBtn && closeBtn.addEventListener("click", function(){ panel.classList.remove("open"); });

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", function(e){
    e.preventDefault();
    var text = input.value.trim();
    if(!text) return;
    input.value = "";

    if(awaitingEmail){
      if(!EMAIL_RE.test(text)){
        addMsg("user", text);
        setTimeout(function(){ addMsg("bot", "That doesn't look like a valid email — could you try again? e.g. name@example.com"); }, 300);
        return;
      }
      addMsg("user", text);
      visitorEmail = text;
      awaitingEmail = false;
      localStorage.setItem("mk_chat_email", visitorEmail);
      saveLead(visitorEmail);
      sendToOwner(visitorEmail, "New chatbot registration on MK Career Guidance website.");
      setTimeout(function(){
        addMsg("bot", "Thank you! You're registered \u2713 A confirmation has been sent. What would you like help with?");
        addQuickReplies();
      }, 350);
      return;
    }

    addMsg("user", text);
    appendMessage(visitorEmail, "user", text);
    var reply = findAnswer(text);
    setTimeout(function(){
      addMsg("bot", reply);
      appendMessage(visitorEmail, "bot", reply);
    }, 350);
    sendToOwner(visitorEmail, text);
  });
})();
