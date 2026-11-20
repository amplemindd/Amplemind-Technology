(function () {
  "use strict";
  var BASE = "https://amplemindtechnologies.com";
  var API = BASE + "/api/admin/students/analytics";
  var LIST_APIS = [BASE + "/api/admin/students?limit=1000", BASE + "/api/admin/students"];
  var PANEL_ID = "student-analytics-dashboard";
  var MOUNT_ID = "student-analytics-mount";
  var COLORS = ["#22c55e", "#2dd4bf", "#a3e635", "#10b981", "#86efac", "#14b8a6", "#bef264", "#059669"];
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  var DATE_KEYS = ["createdAt","admissionDate","admission_date","joiningDate","joinDate","enrollmentDate","enrolledAt","registeredAt","registrationDate","created_at","date"];
  var COURSE_KEYS = ["course","courseName","course_name","courseEnrolled","courseTitle"];
  var PAY_KEYS = ["paymentStatus","payment_status","feeStatus","payment","paymentstatus"];
  var GENDER_KEYS = ["gender","sex"];
  var PERIODS = [["day","Daily"],["week","Weekly"],["month","Monthly"],["year","Yearly"]];
  var RANGES = [["7","7D"],["30","30D"],["90","90D"],["365","1Y"],["all","All"]];
  var state = { loading: false, error: null, analytics: null, records: null, listCount: 0, updated: null, period: "day", range: "30" };
  function semColor(l, idx) { var s = String(l).toLowerCase(); if (/^(paid|success|complete)/.test(s)) return "#22c55e"; if (/pend|due|unpaid|partial/.test(s)) return "#fbbf24"; if (/inactive/.test(s)) return "#f87171"; if (/^active/.test(s)) return "#22c55e"; if (/^other/.test(s)) return "#64748b"; return COLORS[idx % COLORS.length]; }

  /* ---------- helpers ---------- */
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function num(v) { var n = Number(v); return isFinite(n) ? n : 0; }
  function fmt(n) { return num(n).toLocaleString("en-IN"); }
  function pct(part, total) { return total > 0 ? Math.round((part / total) * 1000) / 10 : 0; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function sod(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function mondayOf(d) { var x = sod(d), wd = (x.getDay() + 6) % 7; return addDays(x, -wd); }
  function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function round1(n) { return Math.round(n * 10) / 10; }
  function first(o, keys) {
    for (var i = 0; i < keys.length; i++) { var v = o[keys[i]]; if (v != null && v !== "") return v; }
    return null;
  }
  function textOf(v) {
    if (v == null) return null;
    if (typeof v === "object") return v.name || v.title || v.courseName || null;
    return String(v);
  }
  function parseDate(v) {
    if (v == null || v === "") return null;
    var d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  function labelOf(i) {
    var l = i.label != null ? i.label : i.name != null ? i.name : i._id != null ? i._id :
      i.course != null ? i.course : i.status != null ? i.status : i.gender != null ? i.gender :
      i.month != null ? i.month : i.key != null ? i.key : "Unknown";
    if (l && typeof l === "object") {
      if (l.year != null && l.month != null) return l.year + "-" + pad(num(l.month));
      return JSON.stringify(l);
    }
    if (l === "" || l === null) return "Unknown";
    return String(l);
  }
  function toList(src) {
    if (!src) return [];
    if (Array.isArray(src)) {
      return src.map(function (i) {
        if (i == null) return null;
        if (typeof i !== "object") return { label: String(i), value: 1 };
        var v = i.count != null ? i.count : i.total != null ? i.total : i.value != null ? i.value : i.students != null ? i.students : 0;
        return { label: labelOf(i), value: num(v) };
      }).filter(Boolean);
    }
    if (typeof src === "object") {
      return Object.keys(src).map(function (k) { return { label: k, value: num(src[k]) }; });
    }
    return [];
  }
  function prettyMonth(l) {
    var m = /^(\d{4})-(\d{1,2})$/.exec(l);
    return m ? MONTHS[num(m[2]) - 1] + " " + m[1] : l;
  }
  function sortMonths(list) {
    var ok = list.every(function (i) { return /^\d{4}-\d{1,2}$/.test(i.label); });
    if (!ok) return list;
    return list.slice().sort(function (a, b) {
      var x = a.label.split("-"), y = b.label.split("-");
      return (num(x[0]) * 12 + num(x[1])) - (num(y[0]) * 12 + num(y[1]));
    });
  }
  function payClass(label) {
    var l = String(label).toLowerCase();
    if (/pend|due|unpaid|partial/.test(l)) return "pending";
    if (/paid|success|complete/.test(l)) return "paid";
    return "other";
  }

  /* ---------- records (student list) ---------- */
  function pickArray(res) {
    if (Array.isArray(res)) return res;
    if (!res || typeof res !== "object") return null;
    var keys = ["students","data","items","results","rows","records"];
    for (var i = 0; i < keys.length; i++) {
      var v = res[keys[i]];
      if (Array.isArray(v)) return v;
      if (v && typeof v === "object") {
        for (var j = 0; j < keys.length; j++) { if (Array.isArray(v[keys[j]])) return v[keys[j]]; }
      }
    }
    return null;
  }
  function normalize(list) {
    return list.filter(function (o) { return o && typeof o === "object"; }).map(function (o) {
      return {
        date: parseDate(first(o, DATE_KEYS)),
        course: textOf(first(o, COURSE_KEYS)) || "Unknown",
        payment: textOf(first(o, PAY_KEYS)) || "Unknown",
        gender: textOf(first(o, GENDER_KEYS)) || "Not specified"
      };
    });
  }
  function dated() {
    return state.records ? state.records.filter(function (r) { return r.date; }) : [];
  }

  /* ---------- time buckets ---------- */
  function keyOf(d, p) {
    if (p === "day") return ymd(d);
    if (p === "week") return ymd(mondayOf(d));
    if (p === "month") return d.getFullYear() + "-" + pad(d.getMonth() + 1);
    return String(d.getFullYear());
  }
  function buildBuckets(start, end, p) {
    var out = [], c = sod(start), guard = 0;
    if (p === "week") c = mondayOf(c);
    if (p === "month") c = new Date(c.getFullYear(), c.getMonth(), 1);
    if (p === "year") c = new Date(c.getFullYear(), 0, 1);
    while (c <= end && guard++ < 500) {
      out.push({ key: keyOf(c, p), date: new Date(c), value: 0 });
      if (p === "day") c = addDays(c, 1);
      else if (p === "week") c = addDays(c, 7);
      else if (p === "month") c = new Date(c.getFullYear(), c.getMonth() + 1, 1);
      else c = new Date(c.getFullYear() + 1, 0, 1);
    }
    return out;
  }
  function shortLabel(d, p) {
    if (p === "day" || p === "week") return d.getDate() + " " + MONTHS[d.getMonth()];
    if (p === "month") return MONTHS[d.getMonth()] + " " + String(d.getFullYear()).slice(2);
    return String(d.getFullYear());
  }
  function longLabel(d, p) {
    if (p === "day") return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
    if (p === "week") return "Week of " + d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
    if (p === "month") return MONTHS[d.getMonth()] + " " + d.getFullYear();
    return String(d.getFullYear());
  }
  function rangeBounds() {
    var today = sod(new Date()), recs = dated(), start, end = today;
    if (recs.length) {
      var mx = sod(new Date(Math.max.apply(null, recs.map(function (r) { return r.date.getTime(); }))));
      if (mx > end) end = mx;
    }
    if (state.range === "all") {
      start = recs.length ? sod(new Date(Math.min.apply(null, recs.map(function (r) { return r.date.getTime(); })))) : addDays(today, -29);
    } else {
      start = addDays(end, -(num(state.range) - 1));
    }
    return { start: start, end: end };
  }

  function trend() {
    var p = state.period, recs = dated();
    if (recs.length) {
      var b = rangeBounds(), buckets = buildBuckets(b.start, b.end, p), map = {}, base = 0;
      buckets.forEach(function (bk) { map[bk.key] = bk; });
      var firstDate = buckets[0].date;
      recs.forEach(function (r) {
        var k = keyOf(r.date, p);
        if (map[k]) map[k].value++;
        else if (r.date < firstDate) base++;
      });
      return {
        source: "students", base: base, bounds: b,
        series: buckets.map(function (bk) {
          return { label: shortLabel(bk.date, p), title: longLabel(bk.date, p), value: bk.value };
        })
      };
    }
    if (p === "day" || p === "week") return { unavailable: true, series: [], base: 0 };
    var m = sortMonths(toList(state.analytics.monthlyAdmissions));
    var series;
    if (p === "year") {
      var ys = {}, order = [];
      m.forEach(function (i) {
        var y = String(i.label).slice(0, 4);
        if (!(y in ys)) { ys[y] = 0; order.push(y); }
        ys[y] += i.value;
      });
      series = order.map(function (y) { return { label: y, title: y, value: ys[y] }; });
    } else {
      series = m.map(function (i) { return { label: prettyMonth(i.label), title: prettyMonth(i.label), value: i.value }; });
    }
    return { source: "analytics", base: 0, series: series };
  }

  /* ---------- chart builders ---------- */
  function niceScale(m) {
    if (m < 4) return { max: 4, step: 1 };
    var raw = m / 4, p = Math.pow(10, Math.floor(Math.log10(raw))), n = raw / p;
    var s = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return { max: s * p * 4, step: s * p };
  }
  function empty(msg) { return '<div class="sa-empty">' + esc(msg || "No data available") + '</div>'; }
  function card(title, sub, body, cls) {
    return '<div class="sa-card ' + (cls || "") + '"><div class="sa-card-head"><h3>' + esc(title) + '</h3><p>' + esc(sub) + '</p></div>' + body + '</div>';
  }

  function lineChart(series, id) {
    var n = series.length;
    if (!n) return empty();
    var W = 800, H = 270, L = 44, R = 18, T = 14, B = 36, iw = W - L - R, ih = H - T - B;
    var max = series.reduce(function (m, s) { return Math.max(m, s.value); }, 0);
    var sc = niceScale(max);
    function X(i) { return n === 1 ? L + iw / 2 : L + (i * iw) / (n - 1); }
    function Y(v) { return T + ih - (v / sc.max) * ih; }
    var grid = "";
    for (var k = 0; k <= 4; k++) {
      var v = sc.step * k, y = Y(v);
      grid += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '" class="sa-grid-l"></line>' +
        '<text x="' + (L - 8) + '" y="' + (y + 3).toFixed(1) + '" text-anchor="end" class="sa-ax">' + round1(v) + '</text>';
    }
    var pts = series.map(function (s, i) { return X(i).toFixed(1) + "," + Y(s.value).toFixed(1); });
    var line = "M" + pts.join(" L ");
    var area = line + " L " + X(n - 1).toFixed(1) + "," + Y(0).toFixed(1) + " L " + X(0).toFixed(1) + "," + Y(0).toFixed(1) + " Z";
    var dots = "";
    if (n <= 45) {
      dots = series.map(function (s, i) {
        if (n > 14 && !s.value) return "";
        return '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(s.value).toFixed(1) + '" r="4" class="sa-dotc"><title>' +
          esc(s.title + ": " + s.value) + '</title></circle>';
      }).join("");
    }
    var step = Math.ceil(n / 8), labels = "";
    series.forEach(function (s, i) {
      if ((n - 1 - i) % step === 0) {
        labels += '<text x="' + X(i).toFixed(1) + '" y="' + (H - 12) + '" text-anchor="middle" class="sa-ax">' + esc(s.label) + '</text>';
      }
    });
    return '<div class="sa-svgwrap"><svg viewBox="0 0 ' + W + ' ' + H + '" class="sa-line" role="img">' +
      '<defs><linearGradient id="sag-' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#22c55e" stop-opacity=".45"></stop>' +
      '<stop offset="100%" stop-color="#22c55e" stop-opacity="0"></stop></linearGradient></defs>' +
      grid + '<path d="' + area + '" fill="url(#sag-' + id + ')"></path>' +
      '<path d="' + line + '" class="sa-path"></path>' + dots + labels + '</svg></div>';
  }

  function donut(title, sub, list, cls) {
    var total = list.reduce(function (s, i) { return s + i.value; }, 0);
    if (!list.length || total === 0) return card(title, sub, empty(), cls);
    var R = 40, C = 2 * Math.PI * R, acc = 0, rings = "";
    list.forEach(function (i, idx) {
      var len = (i.value / total) * C, vis = Math.max(0, len - 1.5);
      rings += '<circle cx="60" cy="60" r="' + R + '" fill="none" stroke="' + semColor(i.label, idx) +
        '" stroke-width="14" stroke-dasharray="' + vis.toFixed(2) + ' ' + (C - vis).toFixed(2) +
        '" stroke-dashoffset="' + (-acc).toFixed(2) + '" transform="rotate(-90 60 60)"><title>' + esc(i.label + ": " + i.value) + '</title></circle>';
      acc += len;
    });
    var legend = list.map(function (i, idx) {
      return '<li><span class="sa-dot" style="background:' + semColor(i.label, idx) + '"></span><span class="sa-leg-name">' +
        esc(i.label) + '</span><b>' + fmt(i.value) + '</b><em>' + pct(i.value, total) + '%</em></li>';
    }).join("");
    var body = '<div class="sa-donut-wrap"><svg viewBox="0 0 120 120" class="sa-donut" role="img" aria-label="' + esc(title) + '">' +
      '<circle cx="60" cy="60" r="40" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="14"></circle>' + rings +
      '<text x="60" y="60" text-anchor="middle" class="sa-d-num">' + fmt(total) + '</text>' +
      '<text x="60" y="75" text-anchor="middle" class="sa-d-lbl">TOTAL</text></svg><ul class="sa-legend">' + legend + '</ul></div>';
    return card(title, sub, body, cls);
  }

  function bars(title, sub, list, cls) {
    var sorted = list.slice().sort(function (a, b) { return b.value - a.value; });
    var total = sorted.reduce(function (s, i) { return s + i.value; }, 0);
    if (!sorted.length || total === 0) return card(title, sub, empty(), cls);
    var max = sorted[0].value;
    var body = sorted.map(function (i) {
      var w = Math.max(4, (i.value / max) * 100);
      return '<div class="sa-bar-row"><div class="sa-bar-head"><span>' + esc(i.label) + '</span><b>' + fmt(i.value) +
        ' <em>' + pct(i.value, total) + '%</em></b></div><div class="sa-track"><div class="sa-fill" style="width:' + w.toFixed(1) + '%"></div></div></div>';
    }).join("");
    return card(title, sub, body, cls);
  }

  function columns(list) {
    var max = list.reduce(function (m, i) { return Math.max(m, i.value); }, 0);
    if (!list.length || max === 0) return empty();
    return '<div class="sa-cols-scroll"><div class="sa-cols">' + list.map(function (i) {
      var h = Math.max(6, (i.value / max) * 150);
      return '<div class="sa-col"><span class="sa-col-val">' + fmt(i.value) + '</span><div class="sa-col-bar" style="height:' +
        h.toFixed(0) + 'px" title="' + esc(i.label + ": " + i.value) + '"></div><span class="sa-col-lbl">' + esc(i.label) + '</span></div>';
    }).join("") + '</div></div>';
  }

  function stacked(title, sub, cls) {
    if (!state.records || !state.records.length) {
      return card(title, sub, empty("Student list API se data nahi mila"), cls);
    }
    var by = {};
    state.records.forEach(function (r) {
      var c = by[r.course] || (by[r.course] = { paid: 0, pending: 0, other: 0, total: 0 });
      c[payClass(r.payment)]++; c.total++;
    });
    var rows = Object.keys(by).map(function (k) { return { name: k, d: by[k] }; })
      .sort(function (a, b) { return b.d.total - a.d.total; });
    var max = rows[0].d.total;
    var body = '<div class="sa-stk-legend"><span><i class="sa-sp"></i>Paid</span><span><i class="sa-sd"></i>Pending</span><span><i class="sa-so"></i>Other</span></div>' +
      rows.map(function (r) {
        var d = r.d, w = Math.max(8, (d.total / max) * 100);
        function seg(cls, v) { return v ? '<div class="sa-seg ' + cls + '" style="flex:' + v + '" title="' + v + '">' + v + '</div>' : ""; }
        return '<div class="sa-bar-row"><div class="sa-bar-head"><span>' + esc(r.name) + '</span><b>' + fmt(d.total) + '</b></div>' +
          '<div class="sa-track sa-stk" style="width:' + w.toFixed(1) + '%">' + seg("sa-sp", d.paid) + seg("sa-sd", d.pending) + seg("sa-so", d.other) + '</div></div>';
      }).join("");
    return card(title, sub, body, cls);
  }

  function kpi(title, value, sub, icon, tone, share, subCls) {
    return '<div class="sa-kpi sa-t-' + tone + '"><div class="sa-kpi-top"><span class="sa-kpi-title">' + esc(title) +
      '</span><span class="sa-kpi-ico">' + icon + '</span></div><strong class="sa-kpi-value">' + fmt(value) + '</strong>' +
      '<span class="sa-kpi-sub ' + (subCls || "") + '">' + esc(sub) + '</span><div class="sa-kpi-track"><div class="sa-kpi-fill" style="width:' +
      Math.min(100, Math.max(0, share)) + '%"></div></div></div>';
  }
  function chip(label, value) { return '<div class="sa-chip"><span>' + esc(label) + '</span><b>' + esc(value) + '</b></div>'; }
  function seg(attr, list, current) {
    return '<div class="sa-seg-ctl">' + list.map(function (i) {
      return '<button type="button" class="' + (i[0] === current ? "on" : "") + '" data-' + attr + '="' + i[0] + '">' + i[1] + '</button>';
    }).join("") + '</div>';
  }
  function skeleton() {
    var k = ""; for (var i = 0; i < 4; i++) k += '<div class="sa-kpi sa-skel"></div>';
    return '<div class="sa-kpis">' + k + '</div><div class="sa-grid"><div class="sa-card sa-skel sa-tall sa-s12"></div><div class="sa-card sa-skel sa-tall sa-s6"></div><div class="sa-card sa-skel sa-tall sa-s6"></div></div>';
  }

  /* ---------- render ---------- */
  function render() {
    var head = '<div class="sa-head"><div class="sa-title"><span class="sa-badge">LIVE</span><h2>Student Analytics</h2>' +
      '<p>Admissions, status, payments and course insights</p></div><div class="sa-actions">' +
      (state.updated ? '<span class="sa-updated">Updated ' + esc(state.updated.toLocaleTimeString()) + '</span>' : '') +
      '<button type="button" class="sa-btn" data-sa-refresh="1"' + (state.loading ? ' disabled' : '') + '>' +
      (state.loading ? 'Loading…' : '⟳ Refresh') + '</button></div></div>';

    if (state.error && !state.analytics) {
      return head + '<div class="sa-error"><strong>Analytics load nahi ho paya.</strong><br>' + esc(state.error) + '</div>';
    }
    if (!state.analytics) return head + skeleton();

    var d = state.analytics;
    var active = num(d.activeStudents), inactive = num(d.inactiveStudents), other = num(d.otherStatusStudents);
    var total = d.totalStudents != null ? num(d.totalStudents) : active + inactive + other;
    var course = toList(d.courseDistribution), payment = toList(d.paymentDistribution), gender = toList(d.genderDistribution);
    var top = course.slice().sort(function (a, b) { return b.value - a.value; })[0];
    var paid = 0;
    payment.forEach(function (p) { if (payClass(p.label) === "paid") paid += p.value; });

    var tr = trend(), series = tr.series;
    var inRange = series.reduce(function (s, i) { return s + i.value; }, 0);
    var peak = series.reduce(function (p, i) { return !p || i.value > p.value ? i : p; }, null);
    var avg = series.length ? round1(inRange / series.length) : 0;
    var growthTxt = "in selected range", growthCls = "";
    if (tr.source === "students" && state.range !== "all") {
      var n = num(state.range), b = tr.bounds, ps = addDays(b.start, -n), prev = 0;
      dated().forEach(function (r) { if (r.date >= ps && r.date < b.start) prev++; });
      if (prev > 0) {
        var g = round1(((inRange - prev) / prev) * 100);
        growthTxt = (g >= 0 ? "▲ " : "▼ ") + Math.abs(g) + "% vs previous " + n + " days";
        growthCls = g >= 0 ? "sa-up" : "sa-down";
      } else { growthTxt = "previous period: 0"; }
    }

    var pLabel = { day: "Daily", week: "Weekly", month: "Monthly", year: "Yearly" }[state.period];
    var controls = '<div class="sa-toolbar"><div class="sa-tb-group"><span>View</span>' + seg("sa-period", PERIODS, state.period) +
      '</div><div class="sa-tb-group"><span>Range</span>' + seg("sa-range", RANGES, state.range) + '</div></div>';

    var chips = '<div class="sa-chips">' +
      (top && top.value > 0 ? chip("Top Course", top.label + " (" + fmt(top.value) + ")") : "") +
      (peak && peak.value > 0 ? chip("Peak " + pLabel.replace("ly", "").replace("Dai", "Day"), peak.title + " (" + peak.value + ")") : "") +
      chip("Avg / " + (state.period === "day" ? "day" : state.period), String(avg)) +
      chip("Inactive", fmt(inactive)) + '</div>';

    var kpis = '<div class="sa-kpis">' +
      kpi("Total Students", total, "All registered", "👥", "main", 100) +
      kpi("Active", active, pct(active, total) + "% of total", "✅", "good", pct(active, total)) +
      kpi("New in Range", inRange, growthTxt, "🚀", "lime", total > 0 ? pct(inRange, total) : 0, growthCls) +
      kpi("Payment Collected", paid, pct(paid, total) + "% of total", "💰", "teal", pct(paid, total)) + '</div>';

    var trendBody, trendStats = "";
    if (tr.unavailable) {
      trendBody = empty("Daily/Weekly view ke liye student list (joining date) API chahiye. Monthly ya Yearly select karein.");
    } else {
      trendStats = '<div class="sa-mstats"><div><span>Total in range</span><b>' + fmt(inRange) + '</b></div><div><span>Peak</span><b>' +
        esc(peak ? peak.label : "-") + '</b></div><div><span>Avg / period</span><b>' + avg + '</b></div></div>';
      trendBody = trendStats + lineChart(series, "t");
    }

    var cumBody;
    if (tr.unavailable || !series.length) cumBody = empty();
    else {
      var run = tr.base, cum = series.map(function (s) { run += s.value; return { label: s.label, title: s.title, value: run }; });
      cumBody = lineChart(cum, "c");
    }

    var wdBody;
    if (tr.source !== "students") wdBody = empty("Student list API se data nahi mila");
    else {
      var counts = [0, 0, 0, 0, 0, 0, 0], bd = tr.bounds, endX = addDays(bd.end, 1);
      dated().forEach(function (r) { if (r.date >= bd.start && r.date < endX) counts[(r.date.getDay() + 6) % 7]++; });
      wdBody = columns(counts.map(function (c, i) { return { label: DAYS[i], value: c }; }));
    }

    var status = [{ label: "Active", value: active }, { label: "Inactive", value: inactive }, { label: "Other", value: other }]
      .filter(function (s) { return s.value > 0; });

    var note = tr.source === "students"
      ? "Data: analytics API + " + fmt(state.records.length) + " student records" + (state.records.length < total ? " (list partial: " + fmt(total) + " total)" : "")
      : "Daily/Weekly ke liye student list API available nahi hai. Monthly/Yearly analytics API se aa rahe hain.";

    return head + controls + chips + kpis + '<div class="sa-grid">' +
      card(pLabel + " Admissions Trend", "New students over time", trendBody, "sa-s12") +
      card("Cumulative Growth", "Total students over time", cumBody, "sa-s7") +
      card("Weekday Pattern", "Admissions by day of week", wdBody, "sa-s5") +
      bars("Course Distribution", "Students by course", course, "sa-s5") +
      stacked("Payment by Course", "Paid vs pending per course", "sa-s7") +
      donut("Payment Status", "Paid vs pending", payment, "sa-s4") +
      donut("Gender Distribution", "Student profile", gender, "sa-s4") +
      donut("Student Status", "Active vs inactive", status, "sa-s4") +
      '</div><div class="sa-note">' + esc(note) + '</div>';
  }

  function draw() {
    var p = document.getElementById(PANEL_ID);
    if (p) p.innerHTML = render();
  }

  /* ---------- data loading ---------- */
  function authFetch(url, token) {
    return fetch(url, { headers: { Authorization: "Bearer " + token, Accept: "application/json" } });
  }
  function loadList(token, i) {
    if (i >= LIST_APIS.length) return Promise.resolve(null);
    return authFetch(LIST_APIS[i], token)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (res) { var a = pickArray(res); return a && a.length ? a : null; })
      .catch(function () { return null; })
      .then(function (a) { return a || loadList(token, i + 1); });
  }
  function load() {
    var token = null;
    try { token = localStorage.getItem("adminToken"); } catch (e) {}
    if (!token) { state.error = "Admin token nahi mila. Dobara login karein."; state.loading = false; draw(); return; }
    state.loading = true; state.error = null; draw();
    var main = authFetch(API, token).then(function (r) {
      if (r.status === 401 || r.status === 403) throw new Error("Session expire ho gaya. Dobara login karein.");
      if (!r.ok) throw new Error("Server error: HTTP " + r.status);
      return r.json();
    });
    Promise.all([main, loadList(token, 0)]).then(function (out) {
      var res = out[0], a = res && (res.analytics || res.data || res);
      if (!a || typeof a !== "object") throw new Error("Unexpected API response.");
      state.analytics = a;
      state.records = out[1] ? normalize(out[1]) : null;
      state.updated = new Date(); state.error = null;
    }).catch(function (e) { state.error = e.message || "Unknown error"; })
      .then(function () { state.loading = false; draw(); });
  }

  /* ---------- mount / events ---------- */
  function sync() {
    var mount = document.getElementById(MOUNT_ID);
    var panel = document.getElementById(PANEL_ID);
    if (!mount) { if (panel) panel.remove(); return; }
    if (panel && mount.contains(panel)) return;
    if (panel) panel.remove();
    panel = document.createElement("section");
    panel.id = PANEL_ID; panel.className = "sa-root";
    mount.appendChild(panel);
    draw();
    load();
  }
  var queued = false;
  function schedule() {
    if (queued) return; queued = true;
    requestAnimationFrame(function () { queued = false; sync(); });
  }
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target : null;
    if (!t) return;
    var b;
    if ((b = t.closest("[data-sa-refresh]"))) { if (!state.loading) load(); return; }
    if ((b = t.closest("[data-sa-period]"))) { state.period = b.getAttribute("data-sa-period"); draw(); return; }
    if ((b = t.closest("[data-sa-range]"))) { state.range = b.getAttribute("data-sa-range"); draw(); return; }
  });
  function start() {
    sync();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
