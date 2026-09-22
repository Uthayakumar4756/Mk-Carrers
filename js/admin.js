/* ===========================================================
   MK CAREER GUIDANCE — Admin panel (DEMO)
   Auth + activity log run entirely in the browser via localStorage.
   This is fine for trying things out, but is NOT secure for a real
   deployment: anyone can read/edit localStorage in devtools.
   For production, replace this with the backend/ sample (Node + MySQL)
   described in the README, and check credentials server-side.
   =========================================================== */
(function(){
  "use strict";

  /* Change these before publishing the site */
  var ADMIN_USERS = [
    {username:"admin", password:"admin123"}
  ];

  function logLogin(username, result){
    var log = JSON.parse(localStorage.getItem("mk_admin_logins") || "[]");
    log.push({username: username, at: new Date().toISOString(), result: result});
    localStorage.setItem("mk_admin_logins", JSON.stringify(log));
  }

  /* ---------------- login.html ---------------- */
  var loginForm = document.getElementById("loginForm");
  if(loginForm){
    loginForm.addEventListener("submit", function(e){
      e.preventDefault();
      var u = document.getElementById("loginUser").value.trim();
      var p = document.getElementById("loginPass").value;
      var match = ADMIN_USERS.find(function(a){ return a.username === u && a.password === p; });
      var errorEl = document.getElementById("loginError");
      if(match){
        logLogin(u, "success");
        sessionStorage.setItem("mk_admin_session", u);
        window.location.href = "dashboard.html";
      } else {
        logLogin(u || "(blank)", "failed");
        errorEl.style.display = "block";
      }
    });
  }

  /* ---------------- dashboard.html ---------------- */
  var dashboardRoot = document.getElementById("leadsBody");
  if(dashboardRoot){
    var session = sessionStorage.getItem("mk_admin_session");
    if(!session){
      window.location.href = "login.html";
      return;
    }
    document.getElementById("whoAmI").textContent = "Signed in as " + session;
    document.getElementById("logoutBtn").addEventListener("click", function(){
      sessionStorage.removeItem("mk_admin_session");
      window.location.href = "login.html";
    });

    function fmt(iso){
      if(!iso) return "—";
      var d = new Date(iso);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
    }
    function esc(s){
      var div = document.createElement("div");
      div.textContent = s == null ? "" : s;
      return div.innerHTML;
    }

    var leads = JSON.parse(localStorage.getItem("mk_leads") || "[]");
    var contacts = JSON.parse(localStorage.getItem("mk_contacts") || "[]");
    var logins = JSON.parse(localStorage.getItem("mk_admin_logins") || "[]");

    document.getElementById("statLeads").textContent = leads.length;
    document.getElementById("statContacts").textContent = contacts.length;
    document.getElementById("statLogins").textContent = logins.length;

    var leadsBody = document.getElementById("leadsBody");
    if(leads.length === 0){ document.getElementById("leadsEmpty").style.display = "block"; }
    leads.slice().reverse().forEach(function(l){
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + esc(l.email) + "</td><td>" + fmt(l.registeredAt) + "</td><td>" + fmt(l.lastSeen) + "</td><td>" + (l.visits||1) + "</td><td>" + ((l.messages||[]).length) + " messages</td>";
      leadsBody.appendChild(tr);
    });

    var contactsBody = document.getElementById("contactsBody");
    if(contacts.length === 0){ document.getElementById("contactsEmpty").style.display = "block"; }
    contacts.slice().reverse().forEach(function(c){
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + esc(c.name) + "</td><td>" + esc(c.phone) + "</td><td>" + esc(c.email) + "</td><td>" + esc(c.topic) + "</td><td>" + esc(c.message) + "</td><td>" + fmt(c.submittedAt) + "</td>";
      contactsBody.appendChild(tr);
    });

    var loginsBody = document.getElementById("loginsBody");
    if(logins.length === 0){ document.getElementById("loginsEmpty").style.display = "block"; }
    logins.slice().reverse().forEach(function(l){
      var tr = document.createElement("tr");
      var badge = l.result === "success" ? '<span class="badge badge-green">success</span>' : '<span class="badge" style="background:#fde2e2;color:#c0392b;">failed</span>';
      tr.innerHTML = "<td>" + esc(l.username) + "</td><td>" + fmt(l.at) + "</td><td>" + badge + "</td>";
      loginsBody.appendChild(tr);
    });
  }
})();
