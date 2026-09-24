
(function(){
  "use strict";
  if(typeof CUTOFF_DATA === "undefined") return;

  var CATS = ["OC","BC","BCM","MBC","SC","SCA","ST"];
  var PAGE_SIZE = 10;
  var state = {
    tab: "marks",
    district: "",
    branch: "",
    college: "",
    categories: CATS.slice(),
    page: 1
  };

  /* ---- populate dropdowns from the dataset ---- */
  function uniqueSorted(key){
    var set = {};
    CUTOFF_DATA.forEach(function(row){ set[row[key]] = true; });
    return Object.keys(set).sort();
  }
  function fillSelect(id, values, placeholder){
    var el = document.getElementById(id);
    if(!el) return;
    var html = '<option value="">' + placeholder + '</option>';
    values.forEach(function(v){ html += '<option value="' + v.replace(/"/g,'&quot;') + '">' + v + '</option>'; });
    el.innerHTML = html;
  }
  fillSelect("calcDistrict", uniqueSorted("district"), "All Districts");
  fillSelect("calcBranch", uniqueSorted("branch"), "All Departments");
  fillSelect("calcCollege", uniqueSorted("college"), "All Colleges");

  /* ---- tabs ---- */
  var tabLabels = {
    marks: "Aggregate Marks",
    ranks: "Estimated Rank",
    allotments: "Allotment Status",
    compare: "Compare Years"
  };
  document.querySelectorAll(".calc-tab").forEach(function(btn){
    btn.addEventListener("click", function(){
      document.querySelectorAll(".calc-tab").forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
      state.tab = btn.dataset.tab;
      state.page = 1;
      render();
    });
  });

  /* ---- category chips ---- */
  /* ---- category chips ---- */
document.querySelectorAll(".cat-chip").forEach(function(chip){
  var input = chip.querySelector("input");

  input.addEventListener("change", function(){
    chip.classList.toggle("on", input.checked);

    state.categories = Array.from(
      document.querySelectorAll(".cat-chip input:checked")
    ).map(function(i){
      return i.value;
    });

    state.page = 1;
    render();
  });
});


  /* ---- filter fields ---- */
  ["calcDistrict","calcBranch","calcCollege"].forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    el.addEventListener("change", function(){
      state.district = document.getElementById("calcDistrict").value;
      state.branch = document.getElementById("calcBranch").value;
      state.college = document.getElementById("calcCollege").value;
      state.page = 1;
      render();
    });
  });
  var searchInput = document.getElementById("calcCollegeSearch");
  if(searchInput){
    searchInput.addEventListener("input", function(){
      state.collegeSearch = searchInput.value.trim().toLowerCase();
      state.page = 1;
      render();
    });
  }

  function getFiltered(){
    return CUTOFF_DATA.filter(function(row){
      if(state.district && row.district !== state.district) return false;
      if(state.branch && row.branch !== state.branch) return false;
      if(state.college && row.college !== state.college) return false;
      if(state.collegeSearch && row.college.toLowerCase().indexOf(state.collegeSearch) === -1) return false;
      return true;
    });
  }

  function render(){
    var rows = getFiltered();
    var totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    if(state.page > totalPages) state.page = totalPages;
    var start = (state.page - 1) * PAGE_SIZE;
    var pageRows = rows.slice(start, start + PAGE_SIZE);

    document.getElementById("calcResultsCount").textContent = rows.length;
    document.getElementById("calcResultsLabel").textContent = tabLabels[state.tab] || "Aggregate Marks";

    var thead = document.getElementById("calcTableHead");
   var visibleCats = CATS.filter(function(c){
  return state.categories.indexOf(c) !== -1;
});

    var headHtml = "<tr><th>College</th><th>District</th><th>Branch</th>";
    visibleCats.forEach(function(c){ headHtml += "<th>" + c + "</th>"; });
    headHtml += "</tr>";
    thead.innerHTML = headHtml;

    var tbody = document.getElementById("calcTableBody");
    if(pageRows.length === 0){
      tbody.innerHTML = "";
      document.getElementById("calcEmpty").style.display = "block";
    } else {
      document.getElementById("calcEmpty").style.display = "none";
      tbody.innerHTML = pageRows.map(function(row){
        var cells = "<td>" + row.college + "</td><td>" + row.district + "</td><td>" + row.branch + "</td>";
        visibleCats.forEach(function(c){
          var v = row.cutoffs[c];
          var display = v == null ? "—" : formatValue(v, row);
          cells += "<td>" + display + "</td>";
        });
        return "<tr>" + cells + "</tr>";
      }).join("");
    }

    document.getElementById("calcPageInfo").textContent = "Page " + state.page + " of " + totalPages;
    document.getElementById("calcPrev").disabled = state.page <= 1;
    document.getElementById("calcNext").disabled = state.page >= totalPages;
  }

  function formatValue(v, row){
    if(state.tab === "ranks"){
      /* Rough illustrative "estimated rank" derived from marks — for demo only */
      var estRank = Math.round((200 - v) * 350 + 50);
      return estRank.toLocaleString("en-IN");
    }
    if(state.tab === "allotments"){
      return v >= 190 ? '<span class="badge badge-green">Likely</span>' : (v >= 160 ? '<span class="badge badge-orange">Possible</span>' : '<span class="badge" style="background:#fde2e2;color:#c0392b;">Unlikely</span>');
    }
    return v.toFixed(2);
  }

  document.getElementById("calcPrev").addEventListener("click", function(){
    if(state.page > 1){ state.page--; render(); }
  });
  document.getElementById("calcNext").addEventListener("click", function(){
    state.page++; render();
  });

  render();
})();
