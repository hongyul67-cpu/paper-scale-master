/* ══════════════════════════════════════════════════════════════
   기초 제도 — 그림 모음 (그림01 · 2026-09-30)
   양식·척도 · 선 · 치수 기입 — 배우기 카드와 수업 슬라이드가 함께 쓴다.
   공용 그리기 도우미 links/fig.js 를 쓴다(사본 금지 — 항상 주소로 부른다).

   ▸ 같은 파일이 세 저장소에 있다 — 원본은 domyeon-master(도면읽기).
       domyeon-master      배우기 21쪽 · 슬라이드
       paper-scale-master  배우기 4쪽(양식·척도 그림만 씀)
       dimensioning-master 배우기 10장(치수 그림만 씀)
     고칠 때는 도면읽기 쪽을 고치고 두 곳에 **통째로 복사**한다.

   ▸ 한 칸의 모양
       키: { cap:'캡션 한 줄', topics:['form'|'line'|'dim'], cards:['카드 제목'…], draw:function(){ … } }
       cards — 이 그림이 실제로 보여 주는 배우기 카드(제목 앞부분). 기록용이다.

   ▸ 정답 이름표 — 답이 되는 글자는 ans:1 로 그렸다. 수업 슬라이드는 FIG.svgOf(키,{labels:false}) 로
     불러 그 글자를 ? 로 가린다(슬라이드 요점의 빈칸 답이 그림에 보이지 않게). 배우기에서는 다 보인다.

   ▸ 근거 — 기초제도(씨마스) 교과서 Ⅱ단원 43~70쪽 · 강의용 PPT Ⅱ_03 · Ⅱ_04.
     교과서 그림을 따라 그리지 않고 같은 개념을 새로 짰다.
     치수 숫자(60 · 150 · φ20 …)는 기호를 보여 주려는 예시다 — 캡션에 「숫자는 예시」.
     교과서와 카드 글이 다른 곳은 교과서를 따랐다(절단선 · 숨은선 접속 · 4×φ10 · t=).
   ══════════════════════════════════════════════════════════════ */
var FIGS = (function () {
  var F = window.FIG;
  if (!F) return {};
  var C = F.C;
  var t = F.t, box = F.box, line = F.line, arrow = F.arrow, callout = F.callout, dim = F.dim;

  /* ── 선 굵기 (그림 안 비율 가는 : 굵은 = 1 : 2) ── */
  var THIN = 1.2, THICK = 2.6;
  var D_HID = '7 4', D_CEN = '18 4 3 4', D_PHA = '18 3 3 3 3 3';

  function ol(x1, y1, x2, y2) { return line(x1, y1, x2, y2, { w: THICK }); }                   /* 외형선 */
  function hid(x1, y1, x2, y2, o) { return line(x1, y1, x2, y2, { w: THIN * 1.2, dash: D_HID, c: (o && o.c) || C.ink }); } /* 숨은선 */
  function cen(x1, y1, x2, y2, o) { return line(x1, y1, x2, y2, { w: THIN, dash: D_CEN, c: (o && o.c) || C.ink }); }    /* 중심선 */
  function pha(x1, y1, x2, y2, o) { return line(x1, y1, x2, y2, { w: THIN, dash: D_PHA, c: (o && o.c) || C.ink }); }    /* 가상선 */
  function thin(x1, y1, x2, y2, o) { return line(x1, y1, x2, y2, { w: THIN, c: (o && o.c) || C.ink }); }                /* 가는 실선 */
  function rectO(x, y, w, h) { return box(x, y, w, h, { fill: 'none', r: 0, w: THICK }); }
  function dot(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 3) + '" fill="' + (c || C.ink) + '"/>'; }
  function arc(x1, y1, r, x2, y2, o) {
    o = o || {};
    return F.path('M' + x1 + ',' + y1 + ' A' + r + ',' + r + ' 0 ' + (o.large ? 1 : 0) + ' ' + (o.sweep == null ? 1 : o.sweep) + ' ' + x2 + ',' + y2,
      { w: o.w || THICK, c: o.c, dash: o.dash });
  }
  /* 치수선 — 보조선 없이, 양 끝 화살표(3:1 에 가까운 모양) */
  function dl(x1, y1, x2, y2, o) { o = o || {}; return arrow(x1, y1, x2, y2, { c: o.c || C.ink, w: 1, head: 9, both: true }); }
  /* 치수 보조선 — 외형선에서 조금 띄워 치수선 너머까지 */
  function ext(x1, y1, x2, y2, o) { return line(x1, y1, x2, y2, { w: 1, c: (o && o.c) || C.ink }); }
  /* 가로 치수 한 벌: 두 점(x1,x2)의 외형선 y0 에서 아래(+)/위(-)로 off 만큼 */
  function hdim(x1, x2, y0, off, txt, o) {
    o = o || {};
    var s = off > 0 ? 1 : -1, yd = y0 + off, c = o.c || C.ink;
    var out = ext(x1, y0 + s * 4, x1, yd + s * 7, { c: c }) + ext(x2, y0 + s * 4, x2, yd + s * 7, { c: c }) + dl(x1, yd, x2, yd, { c: c });
    if (txt != null) out += t((x1 + x2) / 2, yd - 11, txt, { a: 'm', size: o.size || 15, c: o.tc || c, b: o.b, ans: o.ans });
    return out;
  }
  /* 세로 치수 한 벌: 외형선 x0 에서 왼쪽(-)/오른쪽(+)으로 off 만큼. 숫자는 오른쪽에서 읽도록 돌려 쓴다 */
  function vdim(y1, y2, x0, off, txt, o) {
    o = o || {};
    var s = off > 0 ? 1 : -1, xd = x0 + off, c = o.c || C.ink;
    var out = ext(x0 + s * 4, y1, xd + s * 7, y1, { c: c }) + ext(x0 + s * 4, y2, xd + s * 7, y2, { c: c }) + dl(xd, y1, xd, y2, { c: c });
    if (txt != null) {
      var mx = xd - 11, my = (y1 + y2) / 2;
      out += '<g transform="rotate(-90 ' + mx + ' ' + my + ')">' + t(mx, my, txt, { a: 'm', size: o.size || 15, c: o.tc || c, b: o.b }) + '</g>';
    }
    return out;
  }
  function ok(x, y, s) { return t(x, y, '⭕', { a: 'm', size: s || 18, halo: false }); }
  function no(x, y, s) { return t(x, y, '❌', { a: 'm', size: s || 16, halo: false }); }
  function eye(x, y, dir) { /* dir: 'up' | 'left' — 눈이 바라보는 쪽 */
    var e = '<ellipse cx="' + x + '" cy="' + y + '" rx="15" ry="9" fill="' + C.paper + '" stroke="' + C.blue + '" stroke-width="1.8"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="4.5" fill="' + C.blue + '"/>';
    return e + (dir === 'left' ? arrow(x - 20, y, x - 46, y, { c: C.blue, w: 1.6, head: 9 }) : arrow(x, y - 14, x, y - 38, { c: C.blue, w: 1.6, head: 9 }));
  }

  return {

  /* ════════════════ Ⅰ. 양식 · 척도 ════════════════ */

  'std-levels': { topics: ['form'], cards: ['① 왜 규칙(표준)부터 배울까'],
    cap: '표준의 층 — 국제 → 국가 → 단체 → 사내, 아래로 갈수록 적용 범위가 좁아진다',
    draw: function () {
      var rows = [
        { w: 440, nm: '국제 표준', sub: 'ISO (전기·전자 외 전 분야) · IEC (전기·전자)', fill: C.blueL, c: C.blue },
        { w: 380, nm: '국가 표준', sub: 'KS 한국 · JIS 일본 · DIN 독일 · ANSI 미국 …', fill: C.greenL, c: C.green },
        { w: 320, nm: '단체 표준', sub: 'SAE(미국자동차기술자협회) · KR(한국선급)', fill: C.grayL, c: C.sub },
        { w: 260, nm: '사내 표준', sub: '회사 · 공장 안에서만', fill: C.grayL, c: C.sub }
      ], s = '';
      rows.forEach(function (r, i) {
        var y = 14 + i * 58, x = 240 - r.w / 2;
        s += box(x, y, r.w, 50, { fill: r.fill, c: r.c }) +
          t(240, y + 17, r.nm, { a: 'm', b: 1, size: 17, halo: false }) +
          t(240, y + 37, r.sub, { a: 'm', size: 13, c: C.ink, halo: false, ans: 1 });
      });
      s += arrow(22, 30, 22, 236, { c: C.sub, w: 1.4, head: 9 }) +
        t(34, 236, '좁아진다', { size: 13, c: C.sub });
      /* 우리나라 표준 KS */
      var y = 258;
      s += t(240, y, '우리나라 표준 = KS (한국 산업 표준)', { a: 'm', b: 1, size: 15, c: C.orange });
      var ks = [['KS A', '기본'], ['KS B', '기계'], ['KS A 0005', '제도 통칙']];
      ks.forEach(function (k, i) {
        var x = 36 + i * 142, w = i === 2 ? 138 : 126;
        s += box(x, y + 16, w, 44, { fill: C.orangeL, c: C.orange }) +
          t(x + w / 2, y + 30, k[0], { a: 'm', b: 1, size: 15, halo: false }) +
          t(x + w / 2, y + 49, k[1], { a: 'm', size: 13, halo: false });
      });
      return F.svg(480, 334, s);
    } },

  'paper-nest': { topics: ['form'], cards: ['② 도면의 크기 — A0을 반으로 접으면 A1'],
    cap: 'A0 을 반으로 자르면 A1, 또 자르면 A2 … — 짧은 변 : 긴 변 = 1 : √2 (단위 mm)',
    draw: function () {
      var k = 400 / 1189, x0 = 58, y0 = 46;
      function R(x, y, w, h, nm, sz, fill) {
        var X = x0 + x * k, Y = y0 + y * k, W = w * k, H = h * k;
        return box(X, Y, W, H, { fill: fill || C.paper, c: C.ink, r: 0, w: 1.6 }) +
          t(X + W / 2, Y + H / 2 - (sz ? 9 : 0), nm, { a: 'm', b: 1, size: nm === 'A4' ? 15 : 18, halo: false, ans: 1 }) +
          (sz ? t(X + W / 2, Y + H / 2 + 12, sz, { a: 'm', size: 13, c: C.sub, halo: false }) : '');
      }
      var s = R(0, 0, 594.5, 841, 'A1', '594 × 841', C.blueL) +
        R(594.5, 0, 594.5, 420.5, 'A2', '420 × 594', C.greenL) +
        R(594.5, 420.5, 297.25, 420.5, 'A3', '297 × 420', C.grayL) +
        R(891.75, 420.5, 297.25, 210.25, 'A4', '210 × 297', C.orangeL) +
        R(891.75, 630.75, 297.25, 210.25, 'A4', '210 × 297', C.orangeL);
      s += box(x0, y0, 400, 841 * k, { fill: 'none', c: C.ink, r: 0, w: 2.4 });
      s += dim(x0, y0, x0 + 400, y0, 'A0  1189', { off: 16, size: 15 });
      s += dim(x0, y0 + 841 * k, x0, y0, '841', { off: 18, size: 15 });
      s += t(240, 350, '짧은 변 : 긴 변 = 1 : √2 · A0 넓이 약 1 m²', { a: 'm', size: 14, b: 1 });
      s += t(240, 372, '큰 도면은 A4 크기로 접어 보관한다', { a: 'm', size: 14, c: C.orange, b: 1 });
      return F.svg(480, 390, s);
    } },

  'sheet-form': { topics: ['form'], cards: ['③ 도면의 양식 — 5가지 요소'],
    cap: '도면 양식 5요소 — 윤곽선 · 표제란 · 중심 마크 · 구역 표시 · 재단 마크 (여백은 알아보기 쉽게 크게 그림)',
    draw: function () {
      var X = 76, Y = 66, W = 330, H = 234, L = 40, M = 20;   /* 재단된 용지 · 왼쪽 여백 L · 나머지 M */
      var s = '';
      /* 재단하지 않은 용지 */
      s += box(X - 18, Y - 18, W + 36, H + 36, { fill: C.grayL, c: C.line, r: 0, w: 1, dash: '5 4' });
      s += box(X, Y, W, H, { fill: C.paper, c: C.sub, r: 0, w: 1 });
      /* 구역 표시 — 긴 변 8칸 · 짧은 변 6칸 (A3) */
      var zs = '';
      for (var i = 1; i < 8; i++) {
        var zx = X + W * i / 8;
        zs += line(zx, Y, zx, Y + M, { w: 1, c: C.sub }) + line(zx, Y + H - M, zx, Y + H, { w: 1, c: C.sub });
      }
      for (var j = 1; j < 6; j++) {
        var zy = Y + H * j / 6;
        zs += line(X, zy, X + L, zy, { w: 1, c: C.sub }) + line(X + W - M, zy, X + W, zy, { w: 1, c: C.sub });
      }
      for (i = 0; i < 8; i++) zs += t(Math.max(X + W * (i + 0.5) / 8, X + L + 8), Y + M / 2 + 1, String(i + 1), { a: 'm', size: 13, c: C.sub, halo: false });
      'ABCDEF'.split('').forEach(function (ch, j) { zs += t(X + L / 2, Math.max(Y + H * (j + 0.5) / 6, Y + M + 10), ch, { a: 'm', size: 13, c: C.sub, halo: false }); });
      s += zs;
      /* 윤곽선 (굵게) */
      s += box(X + L, Y + M, W - L - M, H - 2 * M, { fill: 'none', c: C.ink, r: 0, w: 2.8 });
      /* 중심 마크 — 네 변 가운데 */
      var cx = X + W / 2, cy = Y + H / 2, cm = { w: 2.8, c: C.blue };
      s += line(cx, Y, cx, Y + M + 12, cm) + line(cx, Y + H, cx, Y + H - M - 12, cm) +
        line(X, cy, X + L + 12, cy, cm) + line(X + W, cy, X + W - M - 12, cy, cm);
      /* 표제란 — 오른쪽 아래 */
      var tw = 118, th = 46, tx = X + W - M - tw, ty = Y + H - M - th;
      s += box(tx, ty, tw, th, { fill: C.orangeL, c: C.ink, r: 0, w: 1.6 }) +
        line(tx, ty + th / 2, tx + tw, ty + th / 2, { w: 1 }) + line(tx + tw / 2, ty, tx + tw / 2, ty + th, { w: 1 });
      /* 재단 마크 — 네 귀퉁이, 두 직사각형이 합쳐진 모양 */
      function trim(x, y, sx, sy) {
        return F.poly([[x, y], [x + sx * 14, y], [x + sx * 14, y + sy * 6], [x + sx * 6, y + sy * 6], [x + sx * 6, y + sy * 14], [x, y + sy * 14]],
          { close: 1, fill: C.ink, c: C.ink, w: 1 });
      }
      s += trim(X, Y, -1, -1) + trim(X + W, Y, 1, -1) + trim(X, Y + H, -1, 1) + trim(X + W, Y + H, 1, 1);
      /* 여백 치수 */
      s += dim(X, Y + H * 0.62, X + L, Y + H * 0.62, '20', { size: 14 }) +
        dim(X + W - M, Y + H * 0.40, X + W, Y + H * 0.40, '10', { size: 14 });
      /* 이름표 */
      s += callout(cx + 2, Y + 20, 290, 30, '중심 마크', { c: C.blue, tc: C.blue, b: 1, ans: 1 });
      s += callout(X + W * 1.5 / 8, Y + M / 2 + 8, 70, 30, '구역 표시', { a: 's', b: 1, ans: 1 });
      s += callout(X + W + 10, Y - 10, 470, 30, '재단 마크', { a: 'e', b: 1, ans: 1 });
      s += callout(X + L + 60, Y + H - M, 110, 334, '윤곽선', { a: 's', b: 1, ans: 1 });
      s += callout(tx + tw / 2, ty + th - 4, 300, 334, '표제란', { a: 's', b: 1, ans: 1 });
      return F.svg(480, 352, s);
    } },

  'scale-3': { topics: ['form'], cards: ['⑤ 척도 — 그림만 커지고, 치수는 실제 치수'],
    cap: '같은 물체(실제 60 × 40)를 세 척도로 — 그림 크기만 바뀌고, 치수 숫자는 모두 60',
    draw: function () {
      var mm = 1.25, s = '', base = 188;
      function part(cx, k) {
        var w = 60 * k * mm, h = 40 * k * mm, x = cx - w / 2, y = base - h;
        return F.poly([[x, y], [x + w * 0.55, y], [x + w * 0.55, y + h * 0.45], [x + w, y + h * 0.45], [x + w, y + h], [x, y + h]],
          { close: 1, fill: C.blueL, c: C.ink, w: 2.2 }) + hdim(x, x + w, base, 26, '60', { tc: C.orange, b: 1, size: 16 });
      }
      var P = [{ cx: 62, k: 0.5, nm: '축척 1 : 2', sub: '실물보다 작게' },
               { cx: 172, k: 1, nm: '현척 1 : 1', sub: '실물과 같게' },
               { cx: 348, k: 2, nm: '배척 2 : 1', sub: '실물보다 크게' }];
      P.forEach(function (p) {
        s += t(p.cx, 26, p.nm, { a: 'm', b: 1, size: 17, c: C.blue }) + t(p.cx, 48, p.sub, { a: 'm', size: 13, c: C.sub }) + part(p.cx, p.k);
      });
      s += t(240, 252, '척도 A : B  =  도면에서의 크기 : 실제 크기', { a: 'm', size: 15, b: 1, ans: 1 });
      s += t(240, 276, '치수는 척도와 관계없이 실제 치수로 적는다', { a: 'm', size: 15, b: 1, c: C.orange, ans: 1 });
      return F.svg(480, 296, s);
    } },

  /* ════════════════ Ⅱ. 선 ════════════════ */

  'line-width': { topics: ['line'], cards: ['① 선은 굵기와 모양으로 말한다'],
    cap: '선의 굵기 — 가는 선 : 굵은 선 : 아주 굵은 선 = 1 : 2 : 4',
    draw: function () {
      var s = '', R = [['가는 선', 1.6, '1'], ['굵은 선', 3.2, '2'], ['아주 굵은 선', 6.4, '4']];
      R.forEach(function (r, i) {
        var y = 34 + i * 46;
        s += t(16, y, r[0], { b: 1 }) + line(126, y, 330, y, { w: r[1] }) +
          F.circle(356, y, 14, { fill: C.blueL, c: C.blue, w: 1.4, label: r[2], lc: C.blue, size: 15, ans: 1 });
      });
      s += t(16, 166, '굵은 실선 = 외형선 (보이는 모양)', { size: 14, c: C.sub });
      /* 교과서 표 Ⅱ-8 — 용지 크기에 맞춰 한 줄을 고른다 */
      s += t(16, 200, '용지 크기에 맞춰 한 벌을 골라 쓴다 (mm) — 비율은 그대로', { size: 14, b: 1 });
      var sets = [['0.18', '0.35', '0.7'], ['0.25', '0.5', '1'], ['0.35', '0.7', '1.4']];
      sets.forEach(function (st, i) {
        var x = 16 + i * 152;
        s += box(x, 214, 140, 38, { fill: i === 1 ? C.orangeL : C.grayL, c: i === 1 ? C.orange : C.grayM }) +
          t(x + 70, 233, st.join(' · '), { a: 'm', size: 15, b: i === 1, halo: false });
      });
      return F.svg(480, 266, s);
    } },

  'line-kinds': { topics: ['line'], cards: ['② 여섯 가지 선 한눈에', '⑥ 정리'],
    cap: '선 여섯 가지 — 굵기와 모양으로 이름이 정해진다',
    draw: function () {
      var s = '', x1 = 132, x2 = 300;
      var R = [
        ['외형선', '굵은 실선', function (y) { return line(x1, y, x2, y, { w: THICK + 0.4 }); }],
        ['숨은선', '가는 파선', function (y) { return hid(x1, y, x2, y); }],
        ['중심선', '가는 1점 쇄선', function (y) { return cen(x1, y, x2, y); }],
        ['치수선', '가는 실선 + 화살표', function (y) { return dl(x1, y, x2, y); }],
        ['절단선', '가는 1점 쇄선,\n끝·꺾인 곳만 굵게', function (y) {
          return cen(x1 + 22, y, x2 - 22, y) + line(x1, y, x1 + 22, y, { w: THICK + 0.4 }) + line(x2 - 22, y, x2, y, { w: THICK + 0.4 }) +
            arrow(x1 + 4, y, x1 + 4, y - 18, { w: 1.2, head: 8 }) + arrow(x2 - 4, y, x2 - 4, y - 18, { w: 1.2, head: 8 }) +
            t(x1 + 16, y - 16, 'A', { size: 13, b: 1 }) + t(x2 - 16, y - 16, 'A', { size: 13, b: 1, a: 'e' });
        }],
        ['가상선', '가는 2점 쇄선', function (y) { return pha(x1, y, x2, y); }]
      ];
      R.forEach(function (r, i) {
        var y = 32 + i * 50;
        s += t(16, y, r[0], { b: 1, size: 17, ans: 1 }) + r[2](y) + t(316, y, r[1], { size: 14, c: C.sub });
        if (i) s += line(12, y - 25, 468, y - 25, { w: 1, c: C.edge });
      });
      return F.svg(480, 318, s);
    } },

  'line-in-drawing': { topics: ['line'], cards: ['② 여섯 가지 선 한눈에'],
    cap: '한 장의 도면 속 선 — 구멍 뚫린 블록과 옆 부품 (숫자는 예시)',
    draw: function () {
      var s = '', X = 130, Y = 104, W = 180, H = 96, hx = 204, hw = 32;
      /* 옆 부품 — 가상선 */
      s += pha(X + W, Y + 26, X + W + 84, Y + 26) + pha(X + W + 84, Y + 26, X + W + 84, Y + H) + pha(X + W, Y + H, X + W + 84, Y + H);
      /* 블록 — 외형선 */
      s += rectO(X, Y, W, H);
      /* 구멍 — 숨은선 2줄 + 중심선 */
      s += hid(hx, Y, hx, Y + H) + hid(hx + hw, Y, hx + hw, Y + H) + cen(hx + hw / 2, Y - 18, hx + hw / 2, Y + H + 18);
      /* 치수 */
      s += hdim(X, X + W, Y + H, 42, '80');
      /* 이름표 */
      s += callout(X, Y + 60, 30, 156, '외형선', { a: 's', b: 1, ans: 1 });
      s += callout(hx + hw, Y + 40, 322, 50, '숨은선', { a: 's', b: 1, ans: 1 });
      s += callout(hx + hw / 2, Y - 14, 150, 50, '중심선', { a: 'e', b: 1, ans: 1 });
      s += callout(X + W + 84, Y + 70, 452, 90, '가상선', { a: 'e', b: 1, ans: 1 });
      s += callout(X + W, Y + H + 30, 370, 262, '치수 보조선', { a: 's', b: 1, ans: 1 });
      s += callout(X + 40, Y + H + 42, 110, 272, '치수선', { a: 'e', b: 1, ans: 1 });
      s += t(X + W + 42, Y + 50, '옆 부품', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 290, s);
    } },

  'chain-compare': { topics: ['line'], cards: ['③ 1점 쇄선과 2점 쇄선을 가르는 법'],
    cap: '긴 선 사이의 짧은 선을 센다 — 하나면 1점 쇄선, 둘이면 2점 쇄선',
    draw: function () {
      var s = '';
      function chain(y, n, x0) {
        var o = '', x = x0, L = 66, g = 11, d = 8;
        for (var rep = 0; rep < 3; rep++) {
          o += line(x, y, x + L, y, { w: 3.4 }); x += L;
          if (rep === 2) break;
          for (var k = 0; k < n; k++) {
            x += g; o += line(x, y, x + d, y, { w: 3.4, c: C.orange });
            o += F.num(x + d / 2, y - 22, k + 1, { c: C.orange, r: 8.5, size: 11 });
            x += d;
          }
          x += g;
        }
        return o;
      }
      s += t(16, 28, '1점 쇄선', { b: 1, size: 17 }) + t(104, 28, '긴 선 — 짧은 선 1개 — 긴 선', { size: 14, c: C.sub });
      s += chain(78, 1, 40);
      s += t(16, 118, '2점 쇄선', { b: 1, size: 17 }) + t(104, 118, '긴 선 — 짧은 선 2개 — 긴 선', { size: 14, c: C.sub });
      s += chain(168, 2, 40);
      s += line(12, 196, 468, 196, { w: 1, c: C.edge });
      /* 실제 굵기로 */
      s += t(16, 220, '1점 쇄선 — 가늘면', { size: 14 }) + cen(170, 220, 300, 220) + t(314, 220, '중심선', { b: 1, ans: 1 });
      s += t(16, 256, '1점 쇄선 — 끝만 굵게', { size: 14 }) + cen(192, 256, 278, 256) + line(170, 256, 192, 256, { w: THICK + 0.4 }) +
        line(278, 256, 300, 256, { w: THICK + 0.4 }) + t(314, 256, '절단선', { b: 1, ans: 1 });
      s += t(16, 292, '2점 쇄선 — 가늘게', { size: 14 }) + pha(170, 292, 300, 292) + t(314, 292, '가상선 · 무게중심선', { b: 1, ans: 1 });
      return F.svg(480, 314, s);
    } },

  'line-priority': { topics: ['line'], cards: ['④ 두 선이 겹치면 누가 이길까 — 우선순위', '⑥ 정리'],
    cap: '선의 우선순위 — 같은 자리에 겹치면 번호가 빠른 선 하나만 그린다',
    draw: function () {
      var s = '', R = [
        ['외형선', function (x, y) { return line(x, y, x + 100, y, { w: THICK + 0.4 }); }],
        ['숨은선', function (x, y) { return hid(x, y, x + 100, y); }],
        ['절단선', function (x, y) { return cen(x + 16, y, x + 84, y) + line(x, y, x + 16, y, { w: THICK + 0.4 }) + line(x + 84, y, x + 100, y, { w: THICK + 0.4 }); }],
        ['중심선', function (x, y) { return cen(x, y, x + 100, y); }],
        ['무게중심선', function (x, y) { return pha(x, y, x + 100, y); }],
        ['치수 보조선', function (x, y) { return thin(x, y, x + 100, y); }]
      ];
      R.forEach(function (r, i) {
        var col = i % 3, row = Math.floor(i / 3), x = 14 + col * 156, y = 20 + row * 96;
        var first = i === 0;
        s += box(x, y, 138, 70, { fill: first ? C.greenL : C.paper, c: first ? C.green : C.grayM, w: first ? 2 : 1.4 }) +
          F.num(x + 18, y + 20, i + 1, { c: first ? C.green : C.blue }) +
          t(x + 36, y + 21, r[0], { b: 1, size: r[0].length > 4 ? 15 : 16, halo: false, ans: 1 }) + r[1](x + 19, y + 50);
        if (col < 2) s += t(x + 147, y + 36, '›', { a: 'm', size: 24, c: C.sub, b: 1, halo: false });
      });
      s += t(240, 212, '보이는 것 → 안 보이는 것 → 자른 자리 → 중심 → 무게중심 → 치수 보조', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 230, s);
    } },

  'line-overlap': { topics: ['line'], cards: ['④ 두 선이 겹치면 누가 이길까 — 우선순위'],
    cap: '겹친 자리에는 한 선만 — 외형선이 가장 세고, 숨은선은 중심선을 이긴다',
    draw: function () {
      var s = '', x1 = 16, x2 = 106, rx = 150, rx2 = 240;
      var R = [
        ['외형선', '숨은선', function (y) { return line(x1, y, x2, y, { w: THICK + 0.4 }) + hid(x1, y + 12, x2, y + 12, { c: C.sub }); },
          function (y) { return line(rx, y, rx2, y, { w: THICK + 0.4 }); }, '외형선'],
        ['외형선', '중심선', function (y) { return line(x1, y, x2, y, { w: THICK + 0.4 }) + cen(x1, y + 12, x2, y + 12, { c: C.sub }); },
          function (y) { return line(rx, y, rx2, y, { w: THICK + 0.4 }); }, '외형선'],
        ['숨은선', '중심선', function (y) { return hid(x1, y, x2, y) + cen(x1, y + 12, x2, y + 12, { c: C.sub }); },
          function (y) { return hid(rx, y, rx2, y); }, '숨은선']
      ];
      s += t(61, 20, '같은 자리에 겹침', { a: 'm', size: 13, c: C.sub }) + t(195, 20, '그리는 선', { a: 'm', size: 13, c: C.sub });
      R.forEach(function (r, i) {
        var y = 52 + i * 62;
        s += r[2](y) + arrow(114, y + 6, 142, y + 6, { c: C.green, w: 2, head: 10 }) + r[3](y + 6) +
          t(rx + 45, y + 28, r[4], { a: 'm', b: 1, size: 15, c: C.green, ans: 1 });
      });
      /* 예 — 반원 부품: 가로 중심선이 바닥 외형선과 겹친다 */
      var cx = 372, cy = 162, rr = 62;
      s += line(262, 12, 262, 222, { w: 1, c: C.edge });
      s += t(372, 20, '예) 반원 모양 부품', { a: 'm', size: 13, b: 1 });
      s += arc(cx - rr, cy, rr, cx + rr, cy, { sweep: 1 }) + line(cx - rr, cy, cx + rr, cy, { w: THICK + 0.4 });
      s += cen(cx, cy - rr - 14, cx, cy + 14) + cen(cx - rr - 20, cy, cx - rr - 4, cy) + cen(cx + rr + 4, cy, cx + rr + 20, cy);
      s += callout(cx + 30, cy, 366, 206, '가로 중심선은 외형선에 묻힌다', { a: 'm', size: 13 });
      return F.svg(480, 234, s);
    } },

  'hidden-join': { topics: ['line'], cards: ['⑤ 선을 그을 때 자주 하는 실수'],
    cap: '숨은선의 접속 — 이어 가거나 가로지를 때는 띄우고, 맞닿아 끝나거나 숨은선끼리 만나면 붙인다',
    draw: function () {
      var s = '', P = [
        { x: 10, y: 10, t1: '① 외형선을 이어 가면', t2: '→ 간격을 둔다', g: 1 },
        { x: 244, y: 10, t1: '② 외형선에서 끝나면', t2: '→ 붙인다', g: 0 },
        { x: 10, y: 160, t1: '③ 숨은선끼리 만나면', t2: '→ 붙인다', g: 0 },
        { x: 244, y: 160, t1: '④ 외형선을 가로지르면', t2: '→ 간격을 둔다', g: 1 }
      ];
      P.forEach(function (p, i) {
        var x = p.x, y = p.y;
        s += box(x, y, 226, 146, { fill: C.paper, c: C.edge, w: 1.4 });
        s += t(x + 12, y + 20, p.t1, { size: 14, b: 1 }) + t(x + 12, y + 40, p.t2, { size: 14, b: 1, c: p.g ? C.orange : C.green });
        var ox = x + 40, oy = y + 58;
        if (i === 0) {        /* 외형선 → 같은 줄로 숨은선 */
          s += ol(ox, oy + 50, ox + 80, oy + 50) + ol(ox, oy + 10, ox, oy + 50) + hid(ox + 90, oy + 50, ox + 170, oy + 50);
          s += F.circle(ox + 85, oy + 50, 11, { fill: 'none', c: C.orange, w: 1.6 });
        } else if (i === 1) { /* 숨은선이 외형선에 맞닿아 끝남 */
          s += ol(ox, oy + 60, ox + 150, oy + 60) + ol(ox, oy + 6, ox, oy + 60) + hid(ox + 80, oy + 60, ox + 80, oy + 6);
          s += F.circle(ox + 80, oy + 58, 11, { fill: 'none', c: C.green, w: 1.6 });
        } else if (i === 2) { /* 숨은선 모서리 */
          s += hid(ox + 20, oy + 6, ox + 20, oy + 60) + hid(ox + 20, oy + 6, ox + 150, oy + 6);
          s += F.circle(ox + 20, oy + 6, 11, { fill: 'none', c: C.green, w: 1.6 });
        } else {              /* 숨은선이 외형선을 가로지름 */
          s += ol(ox + 70, oy, ox + 70, oy + 70) + hid(ox + 63, oy + 36, ox, oy + 36) + hid(ox + 77, oy + 36, ox + 160, oy + 36);
          s += F.circle(ox + 70, oy + 36, 11, { fill: 'none', c: C.orange, w: 1.6 });
        }
      });
      return F.svg(480, 316, s);
    } },

  /* ════════════════ Ⅲ. 치수 기입 ════════════════ */

  'dim-elements': { topics: ['dim'], cards: ['① 치수 기입의 4가지 요소'],
    cap: '치수 기입의 요소 — 치수선 · 치수 보조선 · 화살표 · 치수 숫자 (숫자는 예시)',
    draw: function () {
      var X = 110, Y = 40, W = 220, H = 80, s = '';
      s += rectO(X, Y, W, H) + t(X + W / 2, Y + H / 2, '물체', { a: 'm', size: 14, c: C.sub, halo: false });
      s += hdim(X, X + W, Y + H, 58, '150', { size: 17, b: 1, c: C.blue });
      s += callout(X + W / 2 + 50, Y + H + 58, 352, 204, '① 치수선', { a: 's', b: 1, ans: 1 });
      s += callout(X + W, Y + H + 26, 352, 150, '② 치수 보조선', { a: 's', b: 1, ans: 1 });
      s += callout(X + 5, Y + H + 58, 40, 212, '③ 화살표', { a: 's', b: 1, ans: 1 });
      s += callout(X + W / 2 - 22, Y + H + 42, 150, 212, '④ 치수 숫자', { a: 's', b: 1, ans: 1 });
      s += t(240, 244, '모두 가는 실선 · 숫자는 치수선 위 가운데 · 단위 mm 는 쓰지 않는다', { a: 'm', size: 13, c: C.sub, ans: 1 });
      return F.svg(480, 262, s);
    } },

  'dim-arrow': { topics: ['dim'], cards: ['② 화살표와 지시선 — 크기와 각도가 정해져 있다'],
    cap: '화살표 — 길이 : 너비 = 3 : 1, 길이 2.5~3 mm. 자리가 좁을 때만 점이나 짧은 사선',
    draw: function () {
      var s = '';
      /* 크게 그린 화살표 — 끝이 왼쪽 */
      var ax = 24, ay = 92, L = 120, Wd = 40;
      s += t(16, 24, '크게 그리면', { size: 14, b: 1 });
      s += F.poly([[ax, ay], [ax + L, ay - Wd / 2], [ax + L, ay + Wd / 2]], { close: 1, fill: C.blue, c: C.blue, w: 1 });
      s += line(ax, ay + 26, ax, ay + 44, { w: 1, c: C.sub }) + line(ax + L, ay + 26, ax + L, ay + 44, { w: 1, c: C.sub }) +
        dl(ax, ay + 38, ax + L, ay + 38) + t(ax + L / 2, ay + 26, '3', { a: 'm', size: 16, b: 1, ans: 1 });
      s += line(ax + L + 6, ay - Wd / 2, ax + L + 30, ay - Wd / 2, { w: 1, c: C.sub }) + line(ax + L + 6, ay + Wd / 2, ax + L + 30, ay + Wd / 2, { w: 1, c: C.sub }) +
        dl(ax + L + 24, ay - Wd / 2, ax + L + 24, ay + Wd / 2) + t(ax + L + 36, ay, '1', { size: 16, b: 1, ans: 1 });
      s += t(16, 164, '길이 : 너비 = 3 : 1', { size: 14, b: 1, ans: 1 });
      s += t(16, 186, '실제 길이 2.5 ~ 3 mm', { size: 14, c: C.orange, b: 1, ans: 1 });
      s += line(236, 14, 236, 196, { w: 1, c: C.edge });
      /* 좁을 때 */
      s += t(252, 24, '치수가 좁게 붙어 있으면', { size: 14, b: 1 });
      var xs = [262, 292, 322, 352, 440], y1 = 70, y2 = 140;
      function row(y, kind) {
        var o = line(xs[0] - 12, y, xs[4] + 12, y, { w: 1 });
        xs.forEach(function (x, i) {
          o += line(x, y - 24, x, y + 7, { w: 1 });
          if (kind === 'dot') o += dot(x, y, 3.4);
          else o += line(x - 5, y + 5, x + 5, y - 5, { w: 1.8 });
          if (i < 3) o += t((x + xs[i + 1]) / 2, y - 11, '5', { a: 'm', size: 14 });
        });
        o += t((xs[3] + xs[4]) / 2, y - 11, '15', { a: 'm', size: 14 });
        return o;
      }
      s += row(y1, 'dot') + t(262, y1 + 26, '점으로', { size: 14, c: C.sub });
      s += row(y2, 'slash') + t(262, y2 + 26, '짧은 사선(45°)으로', { size: 14, c: C.sub });
      return F.svg(480, 206, s);
    } },

  'dim-leader': { topics: ['dim'], cards: ['② 화살표와 지시선 — 크기와 각도가 정해져 있다'],
    cap: '지시선 — 가는 실선으로 수평에 60°. 외형선을 가리키면 화살표, 도형 안에서 끌어내면 흑점 (숫자는 예시)',
    draw: function () {
      var s = '', c60 = Math.cos(Math.PI / 3), s60 = Math.sin(Math.PI / 3);
      /* ① 구멍(원) — 원둘레에 화살표, 중심을 향한다 */
      var cx = 110, cy = 140, r = 42;
      s += F.circle(cx, cy, r, { fill: 'none', w: THICK });
      s += cen(cx - r - 14, cy, cx + r + 14, cy) + cen(cx, cy - r - 14, cx, cy + r + 14);
      var tx = cx + r * c60, ty = cy - r * s60, ex = tx + 58 * c60, ey = ty - 58 * s60;
      s += arrow(ex, ey, tx, ty, { w: 1.2, head: 11 }) + line(ex, ey, ex + 64, ey, { w: 1.2 }) +
        t(ex + 8, ey - 12, 'φ40', { size: 16, b: 1, c: C.blue });
      s += F.path('M' + (tx + 24) + ',' + ty + ' A24,24 0 0 0 ' + (tx + 24 * c60) + ',' + (ty - 24 * s60), { w: 1, c: C.orange });
      s += line(tx, ty, tx + 34, ty, { w: 1, c: C.orange, dash: '3 3' });
      s += t(tx + 36, ty - 12, '60°', { size: 14, b: 1, c: C.orange, ans: 1 });
      s += t(110, 218, '외형선을 가리킨다 → 화살표', { a: 'm', size: 14, b: 1 });
      s += t(110, 238, '(원이면 중심을 향하게)', { a: 'm', size: 13, c: C.sub });
      s += line(240, 14, 240, 246, { w: 1, c: C.edge });
      /* ② 판 — 도형 안에서 끌어내면 흑점 */
      var px = 272, py = 108, pw = 170, ph = 80;
      s += rectO(px, py, pw, ph);
      var dx = px + 50, dy = py + 52, lx = dx + 70 * c60, ly = dy - 70 * s60;
      s += dot(dx, dy, 4.2) + line(dx, dy, lx, ly, { w: 1.2 }) + line(lx, ly, lx + 64, ly, { w: 1.2 }) +
        t(lx + 8, ly - 12, 't=3', { size: 16, b: 1, c: C.blue });
      s += t(357, 218, '도형 안에서 끌어낸다 → 흑점', { a: 'm', size: 14, b: 1 });
      s += t(357, 238, '(판 두께 t= 를 적을 때 등)', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 256, s);
    } },

  'dim-spacing': { topics: ['dim'], cards: ['③ 치수선 긋는 규칙'],
    cap: '치수선 간격 — 작은 치수는 안쪽, 큰 치수는 바깥쪽 (간격은 교과서 권장값 · 70 · 140 은 예시)',
    draw: function () {
      var X = 130, Y = 26, W = 190, st = 95, s = '';
      s += F.poly([[X, Y], [X + st, Y], [X + st, Y + 36], [X + W, Y + 36], [X + W, Y + 80], [X, Y + 80]], { close: 1, fill: 'none', w: THICK });
      var yb = Y + 80, d1 = yb + 40, d2 = yb + 80;
      s += ext(X, yb + 4, X, d2 + 8) + ext(X + st, Y + 40, X + st, d1 + 8) + ext(X + W, yb + 4, X + W, d2 + 8);
      s += dl(X, d1, X + st, d1, { c: C.blue }) + t(X + st / 2, d1 - 11, '70', { a: 'm', size: 15, b: 1, c: C.blue });
      s += dl(X, d2, X + W, d2) + t(X + W / 2, d2 - 11, '140', { a: 'm', size: 15, b: 1 });
      /* 간격 — 왼쪽에 */
      var g1 = 112, g2 = 64, oc = { w: 1, c: C.orange, dash: '3 3' };
      s += line(X - 4, yb, g1 - 6, yb, oc) + line(X - 4, d1, g2 - 6, d1, oc) + line(X - 4, d2, g2 - 6, d2, oc);
      s += dl(g1, yb, g1, d1, { c: C.orange }) + t(g1 - 8, (yb + d1) / 2, '10~15', { a: 'e', size: 14, b: 1, c: C.orange, ans: 1 });
      s += dl(g2, d1, g2, d2, { c: C.orange }) + t(g2 - 8, (d1 + d2) / 2, '8~10', { a: 'e', size: 14, b: 1, c: C.orange, ans: 1 });
      /* 오른쪽 설명 */
      s += t(X + W + 12, d1, '← 작은 치수는 안쪽', { size: 13, b: 1, c: C.blue, ans: 1 });
      s += t(X + W + 12, d2, '← 큰 치수는 바깥쪽', { size: 13, b: 1, ans: 1 });
      s += callout(X + W, d2 + 7, 300, d2 + 36, '보조선은 치수선보다 2~3 넘게', { a: 'm', size: 13, ans: 1 });
      return F.svg(480, 240, s);
    } },

  'dim-text-dir': { topics: ['dim'], cards: ['④ 치수 숫자 쓰는 방향'],
    cap: '치수 숫자의 방향 — 수평 치수는 도면 아래쪽에서, 수직 치수는 오른쪽에서 읽히게 (숫자는 예시)',
    draw: function () {
      var X = 110, Y = 50, W = 190, H = 110, s = '';
      s += rectO(X, Y, W, H);
      s += hdim(X, X + W, Y + H, 38, '100', { size: 17, b: 1, c: C.blue });
      s += vdim(Y + H, Y, X + W, 40, '60', { size: 17, b: 1, c: C.blue });
      s += eye(X + W / 2, Y + H + 88, 'up') + t(X + W / 2, Y + H + 116, '아래에서 읽는다', { a: 'm', size: 14, b: 1, ans: 1 });
      s += eye(440, Y + H / 2, 'left') + t(440, Y + H / 2 + 30, '오른쪽에서', { a: 'm', size: 14, b: 1, ans: 1 }) +
        t(440, Y + H / 2 + 50, '읽는다', { a: 'm', size: 14, b: 1 });
      s += t(16, 22, '숫자는 치수선 위 가운데, 치수선과 조금 띄워서', { size: 14, c: C.sub });
      return F.svg(480, 296, s);
    } },

  'dim-symbols-part': { topics: ['dim'], cards: ['⑤ 치수 보조기호 한눈에'],
    cap: '치수 보조기호는 숫자 앞에 — 판 한 장에 φ · □ · R · C · t= 가 붙은 모습 (숫자는 예시)',
    draw: function () {
      var X = 100, Y = 64, W = 250, H = 140, r = 30, ch = 18, s = '';
      var c60 = 0.5, s60 = 0.866;
      function shelf(x, y, len, txt) {   /* 끝(x,y)에서 가로로 len, 글자는 선 위 */
        var x2 = x + len;
        return line(x, y, x2, y, { w: 1.1 }) + t(Math.min(x, x2) + 6, y - 11, txt, { size: 16, b: 1, c: C.blue, ans: 1 });
      }
      /* 판: 오른쪽 위 둥근 모서리(R), 왼쪽 아래 45° 모따기(C) */
      s += F.path('M' + X + ',' + Y + ' H' + (X + W - r) + ' A' + r + ',' + r + ' 0 0 1 ' + (X + W) + ',' + (Y + r) +
        ' V' + (Y + H) + ' H' + (X + ch) + ' L' + X + ',' + (Y + H - ch) + ' Z', { w: THICK });
      /* 둥근 구멍 — 지시선은 중심을 향한다 */
      var cx = X + 66, cy = Y + 66, cr = 26;
      s += F.circle(cx, cy, cr, { fill: 'none', w: THICK }) + cen(cx - cr - 10, cy, cx + cr + 10, cy) + cen(cx, cy - cr - 10, cx, cy + cr + 10);
      var px = cx - cr * c60, py = cy - cr * s60, qx = px - 34 * c60, qy = py - 34 * s60;
      s += arrow(qx, qy, px, py, { w: 1.1, head: 10 }) + shelf(qx, qy, -60, 'φ20');
      /* 네모 구멍 */
      var sx = X + 160, sy = Y + 70, sh = 22;
      s += box(sx - sh, sy - sh, sh * 2, sh * 2, { fill: 'none', r: 0, w: THICK }) + cen(sx - sh - 10, sy, sx + sh + 10, sy) + cen(sx, sy - sh - 10, sx, sy + sh + 10);
      var bx = sx + sh, by = sy - sh, bqx = bx + 34 * c60, bqy = by - 60 * s60;
      s += arrow(bqx, bqy, bx, by, { w: 1.1, head: 10 }) + shelf(bqx, bqy, 56, '□15');
      /* 둥근 모서리 — 중심에서 호로, 호 쪽에만 화살표 */
      var rcx = X + W - r, rcy = Y + r, ax = rcx + r * Math.SQRT1_2, ay = rcy - r * Math.SQRT1_2;
      s += line(rcx - 5, rcy, rcx + 5, rcy, { w: 1 }) + line(rcx, rcy - 5, rcx, rcy + 5, { w: 1 });
      s += arrow(rcx, rcy, ax, ay, { w: 1.1, head: 10 }) + line(ax, ay, ax + 22, ay - 22, { w: 1.1 }) + shelf(ax + 22, ay - 22, 52, 'R10');
      /* 모따기 */
      var mx = X + ch / 2, my = Y + H - ch / 2;
      s += arrow(mx - 30, my + 30, mx, my, { w: 1.1, head: 10 }) + shelf(mx - 30, my + 30, -54, 'C3');
      /* 두께 — 도형 안에서 흑점 */
      var dx = X + W - 50, dy = Y + H - 34;
      s += dot(dx, dy, 4) + line(dx, dy, dx + 38, dy + 66, { w: 1.1 }) + shelf(dx + 38, dy + 66, 56, 't=5');
      s += t(240, 266, 'φ 지름 · □ 정사각형 변 · R 반지름 · C 45° 모따기 · t= 판 두께', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 282, s);
    } },

  'phi-vs-r': { topics: ['dim'], cards: ['⑥ φ와 R을 구분하기'],
    cap: 'φ 와 R — 완전한 원은 지름 φ, 원호(둥근 모서리)는 반지름 R, 구는 Sφ · SR (숫자는 예시)',
    draw: function () {
      var s = '', k = Math.SQRT1_2;
      /* 원 → φ : 치수선이 원을 가로지른다 */
      var cx = 80, cy = 106, r = 50;
      s += F.circle(cx, cy, r, { fill: 'none', w: THICK }) + cen(cx - r - 12, cy, cx + r + 12, cy) + cen(cx, cy - r - 12, cx, cy + r + 12);
      s += dl(cx - r * k, cy + r * k, cx + r * k, cy - r * k, { c: C.blue });
      s += '<g transform="rotate(-45 ' + (cx - 8) + ' ' + (cy - 8) + ')">' + t(cx - 8, cy - 8, 'φ100', { a: 'm', size: 16, b: 1, c: C.blue, ans: 1 }) + '</g>';
      s += t(cx, 190, '원 → 지름 φ', { a: 'm', size: 15, b: 1 }) + t(cx, 212, '원을 가로지른다', { a: 'm', size: 13, c: C.sub, ans: 1 });
      /* 원호 → R : 중심에서 호로, 호 쪽에만 화살표 */
      var ox = 180, oy = 40, R = 60;
      s += F.path('M' + ox + ',' + (oy + 110) + ' V' + oy + ' H' + (ox + 100 - R) + ' A' + R + ',' + R + ' 0 0 1 ' + (ox + 100) + ',' + (oy + R) + ' V' + (oy + 110), { w: THICK });
      var ccx = ox + 100 - R, ccy = oy + R;
      s += line(ccx - 8, ccy, ccx + 8, ccy, { w: 1 }) + line(ccx, ccy - 8, ccx, ccy + 8, { w: 1 });
      s += arrow(ccx, ccy, ccx + R * k, ccy - R * k, { c: C.blue, w: 1, head: 10 });
      s += t(ccx + 4, ccy + 18, 'R60', { size: 16, b: 1, c: C.blue, ans: 1 });
      s += t(240, 190, '원호 → 반지름 R', { a: 'm', size: 15, b: 1 }) + t(240, 212, '중심에서 호까지', { a: 'm', size: 13, c: C.sub, ans: 1 });
      /* 구 → Sφ */
      var gx = 400, gy = 106, gr = 46;
      s += F.circle(gx, gy, gr, { fill: C.blueL, w: THICK }) + F.path('M' + (gx - 26) + ',' + (gy - 22) + ' A34,34 0 0 1 ' + (gx + 6) + ',' + (gy - 36), { w: 3, c: C.paper });
      s += dl(gx - gr, gy + 62, gx + gr, gy + 62, { c: C.blue }) + ext(gx - gr, gy + 4, gx - gr, gy + 69, { c: C.blue }) + ext(gx + gr, gy + 4, gx + gr, gy + 69, { c: C.blue });
      s += t(gx, gy + 50, 'Sφ92', { a: 'm', size: 16, b: 1, c: C.blue, ans: 1 });
      s += t(gx, 190, '구(공) → Sφ · SR', { a: 'm', size: 15, b: 1 }) + t(gx, 212, 'S = 구(공)', { a: 'm', size: 13, c: C.sub });
      s += t(240, 244, '원호가 180° 를 넘으면 φ, 180° 까지면 R', { a: 'm', size: 13, c: C.orange, b: 1 });
      return F.svg(480, 262, s);
    } },

  'dim-marks': { topics: ['dim'], cards: ['⑦ 그 밖의 표시'],
    cap: '같은 구멍 여러 개(개수 × 치수) · 참고 치수 ( ) · 이론적으로 정확한 치수 □ · 비례가 아닌 치수 밑줄 (숫자는 예시)',
    draw: function () {
      var s = '', X = 50, Y = 44, W = 200, H = 100, hr = 11;
      s += rectO(X, Y, W, H);
      [[X + 44, Y + 28], [X + W - 44, Y + 28], [X + 44, Y + H - 28], [X + W - 44, Y + H - 28]].forEach(function (p) {
        s += F.circle(p[0], p[1], hr, { fill: 'none', w: 2.2 }) + cen(p[0] - hr - 7, p[1], p[0] + hr + 7, p[1]) + cen(p[0], p[1] - hr - 7, p[0], p[1] + hr + 7);
      });
      var hx = X + W - 44, hy = Y + 28, tx = hx + hr * 0.5, ty = hy - hr * 0.866, lx = tx + 22, ly = ty - 30;
      s += arrow(lx, ly, tx, ty, { w: 1.1, head: 10 }) + line(lx, ly, lx + 84, ly, { w: 1.1 });
      s += t(lx + 6, ly - 12, '4×φ10', { size: 17, b: 1, c: C.blue, ans: 1 });
      s += t(X + W + 70, Y + 50, '지름 10 구멍이 4개', { size: 15, b: 1 });
      s += t(X + W + 70, Y + 74, '한 곳에만 적는다', { size: 13, c: C.sub });
      s += t(X + W + 70, Y + 96, '(예전 표기 4-φ10)', { size: 13, c: C.sub });
      s += line(12, 164, 468, 164, { w: 1, c: C.edge });
      /* 숫자 꾸밈 세 가지 */
      var cols = [{ x: 82, lab: '참고 치수', txt: '(80)' }, { x: 240, lab: '이론적으로 정확한 치수', txt: '50', boxd: 1 }, { x: 398, lab: '비례가 아닌 치수', txt: '60', ul: 1 }];
      cols.forEach(function (c) {
        var y = 218;
        s += dl(c.x - 62, y, c.x + 62, y) + ext(c.x - 62, y - 26, c.x - 62, y + 7) + ext(c.x + 62, y - 26, c.x + 62, y + 7);
        s += t(c.x, y - 13, c.txt, { a: 'm', size: 17, b: 1, c: C.blue, ans: 1 });
        if (c.boxd) s += box(c.x - 18, y - 27, 36, 26, { fill: 'none', c: C.blue, r: 0, w: 1.4 });
        if (c.ul) s += line(c.x - 12, y - 3, c.x + 12, y - 3, { w: 1.6, c: C.blue });
        s += t(c.x, y + 26, c.lab, { a: 'm', size: 14, b: 1 });
      });
      s += t(82, 264, '검사하지 않는 치수', { a: 'm', size: 13, c: C.sub }) + t(240, 264, '네모로 둘러싼다', { a: 'm', size: 13, c: C.sub }) +
        t(398, 264, '숫자 밑에 밑줄', { a: 'm', size: 13, c: C.sub });
      return F.svg(480, 280, s);
    } },

  'dim-main-view': { topics: ['dim'], cards: ['⑧ 치수 기입의 기본 원칙'],
    cap: '치수는 되도록 주 투상도(정면도)에 모아서 — 길이 · 높이는 정면도에, 두께는 측면도에 (숫자는 예시)',
    draw: function () {
      var s = '', X = 60, Y = 78, W = 190, H = 100, st = 70;
      /* 정면도: 계단 모양 */
      s += F.poly([[X, Y], [X + st, Y], [X + st, Y + 44], [X + W, Y + 44], [X + W, Y + H], [X, Y + H]], { close: 1, fill: 'none', w: THICK });
      /* 우측면도 */
      var RX = X + W + 60, RW = 60;
      s += rectO(RX, Y, RW, H) + ol(RX, Y + 44, RX + RW, Y + 44);   /* 단의 모서리 — 보이므로 외형선 */
      s += t(X + W / 2, 22, '정면도 (주 투상도)', { a: 'm', size: 15, b: 1, c: C.blue, ans: 1 }) + t(RX + RW / 2, 22, '우측면도', { a: 'm', size: 15, b: 1 });
      /* 치수 */
      s += hdim(X, X + st, Y, -16, '30') + hdim(X, X + W, Y + H, 32, '80');
      s += vdim(Y + H, Y, X, -30, '40') + vdim(Y + H, Y + 44, X + W, 22, '24');
      s += hdim(RX, RX + RW, Y + H, 32, '25', { c: C.orange, b: 1 });
      s += callout(X + W / 2 + 40, Y + H + 32, 150, 254, '길이 · 높이 → 정면도에 모은다', { a: 's', size: 14, c: C.blue, tc: C.blue, b: 1, ans: 1 });
      s += callout(RX + RW / 2 + 16, Y + H + 32, 352, 226, '두께 → 측면도', { a: 's', size: 14, c: C.orange, tc: C.orange, b: 1 });
      return F.svg(480, 272, s);
    } },

  'dim-dup': { topics: ['dim'], cards: ['⑨ 자주 하는 실수 ① 중복 기입'],
    cap: '중복 기입 — 부분 치수를 다 적었으면 전체 치수는 참고 치수 ( ) 로 (숫자는 예시)',
    draw: function () {
      var s = '', X = 110, W = 240;
      function panel(Y, good) {
        var o = rectO(X, Y, W, 36) + ext(X + W / 2, Y + 40, X + W / 2, Y + 70);
        o += hdim(X, X + W / 2, Y + 36, 28, '75') + dl(X + W / 2, Y + 64, X + W, Y + 64) + t(X + W * 0.75, Y + 53, '75', { a: 'm', size: 15 });
        o += ext(X, Y + 72, X, Y + 104) + ext(X + W, Y + 72, X + W, Y + 104) + dl(X, Y + 98, X + W, Y + 98, { c: good ? C.ink : C.red });
        o += t(X + W / 2, Y + 87, good ? '(150)' : '150', { a: 'm', size: 16, b: 1, c: good ? C.green : C.red, ans: good ? 1 : 0 });
        return o;
      }
      s += panel(14, false) + no(40, 60) + t(40, 86, '중복', { a: 'm', size: 15, b: 1, c: C.red });
      s += line(12, 134, 468, 134, { w: 1, c: C.edge });
      s += panel(148, true) + ok(40, 194) + t(40, 220, '참고 치수', { a: 'm', size: 14, b: 1, c: C.green, ans: 1 });
      s += t(404, 112, '75 + 75 = 150', { a: 'm', size: 13, c: C.red }) + t(404, 128, '두 번 적은 셈', { a: 'm', size: 13, c: C.red });
      return F.svg(480, 270, s);
    } },

  'dim-mistakes': { topics: ['dim'], cards: ['⑩ 자주 하는 실수 ② 그 밖의 것들'],
    cap: '자주 하는 실수 — 치수선 교차 · 보조선 모자람 · 단위 붙이기 (숫자는 예시)',
    draw: function () {
      var s = '', LX = 60, RX = 290, BW = 130;
      s += t(LX + BW / 2, 18, '❌ 틀린 것', { a: 'm', size: 15, b: 1, c: C.red }) + t(RX + BW / 2, 18, '⭕ 바른 것', { a: 'm', size: 15, b: 1, c: C.green });
      s += line(240, 30, 240, 346, { w: 1, c: C.edge });
      /* ① 치수선 교차 */
      function crossRow(x, good) {
        var Y = 40, o = rectO(x, Y, BW, 26), mid = x + 56;
        o += ext(x, Y + 30, x, Y + 88) + ext(x + BW, Y + 30, x + BW, Y + 88);
        if (good) {
          o += ext(mid, Y + 30, mid, Y + 60) + dl(x, Y + 52, mid, Y + 52) + t((x + mid) / 2, Y + 42, '40', { a: 'm', size: 14 }) +
            dl(x, Y + 80, x + BW, Y + 80) + t(x + BW / 2, Y + 70, '90', { a: 'm', size: 14 });
        } else {
          o += dl(x, Y + 52, x + BW, Y + 52) + t(x + BW / 2 + 22, Y + 42, '90', { a: 'm', size: 14 }) +
            ext(mid, Y + 30, mid, Y + 88) + dl(x, Y + 80, mid, Y + 80) + t((x + mid) / 2, Y + 70, '40', { a: 'm', size: 14 }) +
            F.circle(mid, Y + 52, 9, { fill: 'none', c: C.red, w: 1.6 });
        }
        return o;
      }
      s += crossRow(LX, false) + crossRow(RX, true);
      s += t(240, 146, '① 작은 치수를 안쪽에 — 치수선이 서로 교차하지 않게', { a: 'm', size: 13, c: C.sub, ans: 1 });
      /* ② 보조선 모자람 */
      function extRow(x, good) {
        var Y = 170, o = rectO(x, Y, BW, 26), yd = Y + 58;
        if (good) o += ext(x, Y + 30, x, yd + 8) + ext(x + BW, Y + 30, x + BW, yd + 8);
        else o += ext(x, Y + 30, x, yd - 8) + ext(x + BW, Y + 30, x + BW, yd - 8) + F.circle(x + BW, yd - 4, 9, { fill: 'none', c: C.red, w: 1.6 });
        return o + dl(x, yd, x + BW, yd) + t(x + BW / 2, yd - 10, '90', { a: 'm', size: 14 });
      }
      s += extRow(LX, false) + extRow(RX, true);
      s += t(240, 256, '② 보조선은 치수선보다 2 ~ 3 mm 넘게', { a: 'm', size: 13, c: C.sub, ans: 1 });
      /* ③ 단위 */
      function unitRow(x, good) {
        var Y = 282;
        return dl(x, Y + 20, x + BW, Y + 20) + ext(x, Y + 4, x, Y + 27) + ext(x + BW, Y + 4, x + BW, Y + 27) +
          t(x + BW / 2, Y + 8, good ? '50' : '50mm', { a: 'm', size: 15, b: 1, c: good ? C.green : C.red, ans: good ? 1 : 0 });
      }
      s += unitRow(LX, false) + unitRow(RX, true);
      s += t(240, 330, '③ 길이 단위는 mm — 기호는 적지 않는다', { a: 'm', size: 13, c: C.sub, ans: 1 });
      return F.svg(480, 346, s);
    } }

  };
})();
