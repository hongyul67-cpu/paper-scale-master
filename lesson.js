/* ══════════════════════════════════════════════════════════════
   lesson.js — 도면 양식·척도 · 수업 슬라이드 원고 (데이터만)

   화면은 links 의 공용 board-pro.js 가 만든다. 이 파일은 원고뿐이다.
   저장소 안에 뷰어 사본을 두지 않는다 — 고칠 일이 생기면 links 하나만 고친다.

   슬라이드 한 장
     { u:'단원', t:'제목', fig:'그림키', cap:'그림 아래 한 줄',
       pts:['요점 — {{빈칸}} 은 눌러야 보인다'],      // 3~5줄이 상한
       ask:'발문 — 정답을 말하지 않는다',
       ansq:'퀴즈', anso:[…], ansa:정답번호(0부터), anse:'해설' }

   ▸ 배우기(index 의 4쪽)를 지우지 않았다. 이것은 교실 앞 화면용 별도의 한 벌이다.
   ▸ 이 도구의 그림은 캔버스로 그려서 슬라이드로 가져올 수 없다.
     그래서 FIG 에 작은 SVG·표를 따로 두었다. 숫자는 index.html 의
     PAPERS · FORMS · SCALES 와 같은 값이다 — 한쪽만 고치면 어긋난다.
   ══════════════════════════════════════════════════════════════ */
(function () {
"use strict";

/* 슬라이드 그림 — board-pro 의 fig(s) 가 키로 불러 쓴다 */
var FIG = {

/* 표준의 층 — 국제 → 국가 → 단체 → 사내 */
std: function () { return '' +
'<svg viewBox="0 0 620 240" style="max-height:32vh">' +
' <rect x="60"  y="20"  width="500" height="44" rx="8" fill="#123152" stroke="#4b9fe1" stroke-width="2"/>' +
' <text x="310" y="48" text-anchor="middle" fill="#cfe6ff" font-size="20" font-weight="700">국제 표준 — ISO · IEC</text>' +
' <rect x="105" y="76"  width="410" height="44" rx="8" fill="#123a2c" stroke="#48c79a" stroke-width="2"/>' +
' <text x="310" y="104" text-anchor="middle" fill="#c7f2e2" font-size="20" font-weight="700">국가 표준 — KS · JIS · DIN · ANSI</text>' +
' <rect x="150" y="132" width="320" height="44" rx="8" fill="#3a3116" stroke="#d8b141" stroke-width="2"/>' +
' <text x="310" y="160" text-anchor="middle" fill="#f6e6b4" font-size="20" font-weight="700">단체 표준</text>' +
' <rect x="195" y="188" width="230" height="42" rx="8" fill="#3a2029" stroke="#e0798f" stroke-width="2"/>' +
' <text x="310" y="215" text-anchor="middle" fill="#ffd7e0" font-size="20" font-weight="700">사내 표준</text>' +
' <text x="588" y="130" text-anchor="middle" fill="#8fa2bd" font-size="13">↓ 좁아진다</text>' +
'</svg>'; },

/* KS 21개 부문 중 도면에서 자주 쓰는 것 */
ksTable: function () { return '' +
'<table style="width:100%;border-collapse:collapse;font-size:clamp(13px,1.25vw,24px)">' +
' <tr>' + [['A','기본'],['B','기계'],['C','전기·전자'],['D','금속']].map(function (r) {
   return '<td style="border:1px solid #38465c;padding:8px 6px;text-align:center;background:#16202e">' +
          '<div style="color:#ffd166;font-weight:800;font-size:1.25em">KS ' + r[0] + '</div>' +
          '<div style="color:#cfdcee">' + r[1] + '</div></td>'; }).join('') + '</tr>' +
' <tr>' + [['E','광산'],['F','건설'],['R','수송기계'],['X','정보']].map(function (r) {
   return '<td style="border:1px solid #38465c;padding:8px 6px;text-align:center;background:#131b27">' +
          '<div style="color:#9fb6d1;font-weight:800;font-size:1.15em">KS ' + r[0] + '</div>' +
          '<div style="color:#8fa2bd">' + r[1] + '</div></td>'; }).join('') + '</tr>' +
'</table>' +
'<div style="text-align:center;color:#93a2ba;margin-top:8px;font-size:clamp(12px,1.1vw,20px)">' +
'모두 21개 부문 (A ~ X) · 제도 통칙은 <b style="color:#7cc6ff">KS A 0005</b></div>'; },

/* 나라별 국가 표준 기호 — index.html 의 STD 와 같은 값 */
stdTable: function () {
  var S = [['KS','한국'],['JIS','일본'],['DIN','독일'],['ANSI','미국'],
           ['BS','영국'],['NF','프랑스'],['GB','중국']];
  return '<table style="width:100%;border-collapse:collapse;font-size:clamp(13px,1.25vw,24px)">' +
  '<tr>' + S.slice(0, 4).map(function (r) {
    return '<td style="border:1px solid #38465c;padding:9px 6px;text-align:center;background:#16202e">' +
           '<div style="color:#ffd166;font-weight:800;font-size:1.2em">' + r[0] + '</div>' +
           '<div style="color:#cfdcee">' + r[1] + '</div></td>'; }).join('') + '</tr>' +
  '<tr>' + S.slice(4).map(function (r) {
    return '<td style="border:1px solid #38465c;padding:9px 6px;text-align:center;background:#131b27">' +
           '<div style="color:#9fb6d1;font-weight:800;font-size:1.1em">' + r[0] + '</div>' +
           '<div style="color:#8fa2bd">' + r[1] + '</div></td>'; }).join('') +
  '<td style="border:1px solid #38465c;background:#131b27"></td></tr></table>'; },

/* A0 안에 A1~A4 를 겹쳐 그려 「반으로 접으면 다음 것」을 보인다 */
papers: function () { return '' +
'<svg viewBox="0 0 620 250" style="max-height:32vh">' +
' <rect x="40" y="20" width="424" height="300" fill="none"/>' +
' <rect x="40" y="22" width="420" height="297" fill="#101a26"/>' +
' <rect x="40" y="22" width="420" height="212" fill="#16202e" stroke="#4b9fe1" stroke-width="2.5"/>' +
' <rect x="40" y="22" width="210" height="212" fill="#17293c" stroke="#48c79a" stroke-width="2.5"/>' +
' <rect x="40" y="22" width="210" height="106" fill="#1b3145" stroke="#d8b141" stroke-width="2.5"/>' +
' <rect x="40" y="22" width="105" height="106" fill="#20394f" stroke="#e0798f" stroke-width="2.5"/>' +
' <rect x="40" y="22" width="105" height="53"  fill="#2a4560" stroke="#eef3fb" stroke-width="2"/>' +
' <text x="355" y="190" text-anchor="middle" fill="#4b9fe1" font-size="17" font-weight="800">A0</text>' +
' <text x="355" y="212" text-anchor="middle" fill="#7f9cbb" font-size="13">841 × 1189</text>' +
' <text x="145" y="190" text-anchor="middle" fill="#48c79a" font-size="16" font-weight="800">A1</text>' +
' <text x="200" y="100" text-anchor="middle" fill="#d8b141" font-size="15" font-weight="800">A2</text>' +
' <text x="92"  y="115" text-anchor="middle" fill="#e0798f" font-size="14" font-weight="800">A3</text>' +
' <text x="92"  y="52"  text-anchor="middle" fill="#eef3fb" font-size="14" font-weight="800">A4</text>' +
' <path d="M480 130 L560 130" stroke="#7cc6ff" stroke-width="2.5"/>' +
' <text x="520" y="118" text-anchor="middle" fill="#7cc6ff" font-size="14" font-weight="800">반으로</text>' +
' <text x="520" y="152" text-anchor="middle" fill="#7cc6ff" font-size="14" font-weight="800">접으면</text>' +
' <text x="520" y="180" text-anchor="middle" fill="#93a2ba" font-size="13">다음 크기</text>' +
'</svg>'; },

/* 용지 크기 · 제도 영역 표 — index.html 의 PAPERS 와 같은 값 */
sizeTable: function () {
  var P = [['A0','841 × 1189','821 × 1159'], ['A1','594 × 841','574 × 811'],
           ['A2','420 × 594','400 × 564'],   ['A3','297 × 420','277 × 390'],
           ['A4','210 × 297','180 × 277']];
  return '<table style="width:100%;border-collapse:collapse;font-size:clamp(12.5px,1.2vw,23px)">' +
  '<tr style="background:#1c2736">' +
  ['용지','크기 (mm)','제도 영역 (mm)'].map(function (h) {
    return '<th style="border:1px solid #38465c;padding:7px;color:#9fb6d1">' + h + '</th>'; }).join('') + '</tr>' +
  P.map(function (r, k) {
    return '<tr style="background:' + (k === 4 ? '#1b3145' : '#131b27') + '">' +
      '<td style="border:1px solid #38465c;padding:7px;text-align:center;color:#ffd166;font-weight:800">' + r[0] + '</td>' +
      '<td style="border:1px solid #38465c;padding:7px;text-align:center;color:#eef3fb">' + r[1] + '</td>' +
      '<td style="border:1px solid #38465c;padding:7px;text-align:center;color:#cfdcee">' + r[2] + '</td></tr>'; }).join('') +
  '</table>'; },

/* 윤곽선 — 왼쪽 20, 나머지 10 */
frame: function () { return '' +
'<svg viewBox="0 0 620 250" style="max-height:32vh">' +
' <rect x="70" y="25" width="480" height="200" fill="#101a26" stroke="#6f8299" stroke-width="1.5" stroke-dasharray="6 4"/>' +
' <text x="310" y="18" text-anchor="middle" fill="#8fa2bd" font-size="13">재단된 용지의 가장자리</text>' +
' <rect x="130" y="45" width="400" height="160" fill="none" stroke="#4b9fe1" stroke-width="4"/>' +
' <text x="330" y="130" text-anchor="middle" fill="#4b9fe1" font-size="17" font-weight="800">제도 영역</text>' +
' <path d="M70 235 L130 235" stroke="#ffd166" stroke-width="2"/>' +
' <text x="100" y="249" text-anchor="middle" fill="#ffd166" font-size="14" font-weight="800">20</text>' +
' <path d="M530 235 L550 235" stroke="#48c79a" stroke-width="2"/>' +
' <text x="540" y="249" text-anchor="middle" fill="#48c79a" font-size="13" font-weight="800">10</text>' +
' <path d="M600 25 L600 45" stroke="#48c79a" stroke-width="2"/>' +
' <text x="600" y="20" text-anchor="middle" fill="#48c79a" font-size="13" font-weight="800">10</text>' +
' <text x="100" y="120" text-anchor="middle" fill="#ffd166" font-size="13" font-weight="700">철하는</text>' +
' <text x="100" y="140" text-anchor="middle" fill="#ffd166" font-size="13" font-weight="700">여백</text>' +
'</svg>'; },

/* 양식 5요소가 놓이는 자리 */
form5: function () { return '' +
'<svg viewBox="0 0 620 250" style="max-height:32vh">' +
' <rect x="55" y="30" width="510" height="190" fill="#101a26" stroke="#6f8299" stroke-width="1.5"/>' +
' <rect x="80" y="45" width="465" height="160" fill="none" stroke="#4b9fe1" stroke-width="3.5"/>' +
' <text x="70" y="128" text-anchor="middle" fill="#4b9fe1" font-size="12" font-weight="800" transform="rotate(-90 70 128)">윤곽선</text>' +
' <rect x="395" y="150" width="150" height="55" fill="#1b3145" stroke="#ffd166" stroke-width="2.5"/>' +
' <text x="470" y="182" text-anchor="middle" fill="#ffd166" font-size="15" font-weight="800">표제란</text>' +
' <path d="M312 30 L312 58 M312 192 L312 220 M55 125 L108 125 M517 125 L565 125" stroke="#48c79a" stroke-width="3.5"/>' +
' <text x="312" y="80" text-anchor="middle" fill="#48c79a" font-size="13" font-weight="800">중심 마크 (4개)</text>' +
' <text x="150" y="42" fill="#e0798f" font-size="12" font-weight="800">1</text>' +
' <text x="215" y="42" fill="#e0798f" font-size="12" font-weight="800">2</text>' +
' <text x="280" y="42" fill="#e0798f" font-size="12" font-weight="800">3</text>' +
' <text x="68"  y="70" fill="#e0798f" font-size="12" font-weight="800">A</text>' +
' <text x="68"  y="105" fill="#e0798f" font-size="12" font-weight="800">B</text>' +
' <text x="240" y="118" text-anchor="middle" fill="#e0798f" font-size="13" font-weight="800">구역 표시</text>' +
' <rect x="55" y="24" width="20" height="6" fill="#c0d0e4"/>' +
' <rect x="545" y="220" width="20" height="6" fill="#c0d0e4"/>' +
' <text x="150" y="238" text-anchor="middle" fill="#c0d0e4" font-size="13" font-weight="800">재단 마크</text>' +
'</svg>'; },

/* 구역 표시 — 세로 영문(I·O 제외), 가로 숫자 */
zone: function () { return '' +
'<svg viewBox="0 0 620 210" style="max-height:30vh">' +
' <rect x="60" y="30" width="500" height="150" fill="#101a26" stroke="#4b9fe1" stroke-width="2.5"/>' +
[1,2,3,4,5,6].map(function (n, k) {
  return ' <path d="M' + (60 + (k + 1) * 71.4) + ' 30 L' + (60 + (k + 1) * 71.4) + ' 180" stroke="#38465c" stroke-width="1"/>' +
         ' <text x="' + (60 + k * 71.4 + 35) + '" y="22" text-anchor="middle" fill="#e0798f" font-size="16" font-weight="800">' + n + '</text>'; }).join('') +
['A','B','C'].map(function (c, k) {
  return ' <path d="M60 ' + (30 + (k + 1) * 50) + ' L560 ' + (30 + (k + 1) * 50) + '" stroke="#38465c" stroke-width="1"/>' +
         ' <text x="46" y="' + (30 + k * 50 + 32) + '" text-anchor="middle" fill="#48c79a" font-size="16" font-weight="800">' + c + '</text>'; }).join('') +
' <text x="310" y="200" text-anchor="middle" fill="#93a2ba" font-size="14">한 구역 50mm · 세로는 영문 대문자, 가로는 숫자</text>' +
'</svg>'; },

/* 척도 3종 — 같은 실물을 다르게 그린다 */
scale3: function () { return '' +
'<svg viewBox="0 0 620 220" style="max-height:30vh">' +
' <rect x="35"  y="70"  width="60"  height="60"  fill="#2b3646" stroke="#8fa2bd" stroke-width="2"/>' +
' <text x="65"  y="152" text-anchor="middle" fill="#8fa2bd" font-size="14" font-weight="800">실물</text>' +
' <rect x="160" y="85"  width="30"  height="30"  fill="#123a2c" stroke="#48c79a" stroke-width="2.5"/>' +
' <text x="175" y="152" text-anchor="middle" fill="#48c79a" font-size="16" font-weight="800">축척 1:2</text>' +
' <text x="175" y="174" text-anchor="middle" fill="#93a2ba" font-size="13">작게</text>' +
' <rect x="285" y="70"  width="60"  height="60"  fill="#123152" stroke="#4b9fe1" stroke-width="2.5"/>' +
' <text x="315" y="152" text-anchor="middle" fill="#4b9fe1" font-size="16" font-weight="800">현척 1:1</text>' +
' <text x="315" y="174" text-anchor="middle" fill="#93a2ba" font-size="13">같게</text>' +
' <rect x="430" y="40"  width="120" height="120" fill="#3a3116" stroke="#d8b141" stroke-width="2.5"/>' +
' <text x="490" y="182" text-anchor="middle" fill="#d8b141" font-size="16" font-weight="800">배척 2:1</text>' +
' <text x="490" y="204" text-anchor="middle" fill="#93a2ba" font-size="13">크게</text>' +
'</svg>'; },

/* 척도가 달라도 적는 숫자는 실제 치수 */
scaleDim: function () { return '' +
'<svg viewBox="0 0 620 210" style="max-height:30vh">' +
' <rect x="70"  y="55" width="160" height="80" fill="#123152" stroke="#4b9fe1" stroke-width="2.5"/>' +
' <path d="M70 152 L230 152" stroke="#ffd166" stroke-width="2"/>' +
' <path d="M70 146 L70 158 M230 146 L230 158" stroke="#ffd166" stroke-width="2"/>' +
' <text x="150" y="176" text-anchor="middle" fill="#ffd166" font-size="20" font-weight="800">60</text>' +
' <text x="150" y="40"  text-anchor="middle" fill="#4b9fe1" font-size="16" font-weight="800">척도 1:1</text>' +
' <rect x="360" y="75" width="80"  height="40" fill="#123a2c" stroke="#48c79a" stroke-width="2.5"/>' +
' <path d="M360 152 L440 152" stroke="#ffd166" stroke-width="2"/>' +
' <path d="M360 146 L360 158 M440 146 L440 158" stroke="#ffd166" stroke-width="2"/>' +
' <text x="400" y="176" text-anchor="middle" fill="#ffd166" font-size="20" font-weight="800">60</text>' +
' <text x="400" y="40"  text-anchor="middle" fill="#48c79a" font-size="16" font-weight="800">척도 1:2</text>' +
' <text x="530" y="100" text-anchor="middle" fill="#e0798f" font-size="15" font-weight="800">그림만</text>' +
' <text x="530" y="122" text-anchor="middle" fill="#e0798f" font-size="15" font-weight="800">작아졌다</text>' +
' <text x="530" y="150" text-anchor="middle" fill="#93a2ba" font-size="13">숫자는 그대로</text>' +
'</svg>'; }

};

var LESSON = [

/* ═══ Ⅰ. 제도의 규격 ═══ */
{u:'Ⅰ. 제도의 규격', t:'도면은 말없이 전달하는 지시서',
 pts:['그린 사람과 만드는 사람이 <b>서로 다른 규칙</b>을 쓰면 물건이 엉뚱하게 나온다.',
      '그래서 도면 그리는 법을 나라마다 정해 두었다. 우리나라 것이 <b>{{한국 산업 표준(KS)}}</b> 이다.',
      '도면의 선 하나, 숫자 하나가 <b>말 대신</b> 하는 일이다. 약속을 어기면 뜻이 안 통한다.'],
 ask:'같은 부품을 두 사람이 각자 자기 방식으로 그렸습니다. 공장에서는 무엇을 보고 만들어야 할까요?',
 ansq:'우리나라의 국가 표준을 가리키는 기호는?',
 anso:['ISO','KS','JIS','DIN'], ansa:1,
 anse:'<b>KS</b> 가 한국 산업 표준이다. JIS 는 일본, DIN 은 독일, ISO 는 국제 표준이다.'},

{u:'Ⅰ. 제도의 규격', t:'표준에도 층이 있다', fig:'std',
 cap:'위로 갈수록 넓게, 아래로 갈수록 좁게 적용된다',
 pts:['가장 넓은 것이 <b>국제 표준</b> — <b>{{ISO}}</b> 와, 전기·전자만 맡는 <b>{{IEC}}</b>.',
      '그 아래가 <b>국가 표준</b> — KS(한국) · JIS(일본) · DIN(독일) · ANSI(미국).',
      '더 아래로 <b>단체 표준</b>, 마지막이 회사 안에서만 쓰는 <b>사내 표준</b>이다.'],
 ask:'전기·전자 분야만 따로 맡는 국제 기구를 하나 더 둔 까닭은 무엇일까요?',
 ansq:'전기·전자 분야의 국제 표준을 정하는 곳은?',
 anso:['ISO','IEC','KS','ANSI'], ansa:1,
 anse:'<b>IEC</b>. ISO 는 전기·전자를 <b>뺀</b> 나머지 분야의 국제 표준을 맡는다.'},

{u:'Ⅰ. 제도의 규격', t:'나라마다 부르는 이름이 다르다', fig:'stdTable',
 cap:'같은 국가 표준인데 기호가 다르다',
 pts:['국가 표준은 나라마다 따로 있고 <b>기호도 다르다.</b>',
      '<b>{{KS}}</b> 한국 · JIS 일본 · DIN 독일 · ANSI 미국 · BS 영국.',
      '수입 부품 도면에 낯선 기호가 있으면 <b>어느 나라 표준인지</b>부터 본다.'],
 ask:'외국에서 들여온 기계의 도면에 DIN 이라고 적혀 있다면, 어느 나라 규칙으로 그린 것일까요?',
 ansq:'독일의 국가 표준을 나타내는 기호는?',
 anso:['JIS','DIN','BS','NF'], ansa:1,
 anse:'<b>DIN</b> 이 독일이다. JIS 일본 · BS 영국 · NF 프랑스.'},

{u:'Ⅰ. 제도의 규격', t:'KS 는 부문으로 나뉜다', fig:'ksTable',
 cap:'KS 21개 부문 가운데 도면에서 자주 만나는 것',
 pts:['KS 는 분야별로 <b>A 부터 X 까지 {{21}}개 부문</b>으로 나뉜다.',
      '우리가 배우는 기계 도면은 <b>{{KS B}}</b> — 기계 부문이다.',
      '외울 것은 넷뿐이다. <b>A 기본 · B 기계 · C 전기·전자 · D 금속.</b>'],
 ask:'전선과 배전반은 어느 부문에 들어갈까요? 표에서 짚어 봅시다.',
 ansq:'기계 부문을 나타내는 KS 기호는?',
 anso:['KS A','KS B','KS C','KS D'], ansa:1,
 anse:'<b>KS B</b> 가 기계다. A 는 기본, C 는 전기·전자, D 는 금속이다.'},

{u:'Ⅰ. 제도의 규격', t:'제도 통칙 — KS A 0005',
 pts:['도면을 그리는 <b>기본 규칙</b>을 모아 둔 것이 <b>제도 통칙</b>이다.',
      '번호는 <b>{{KS A 0005}}</b> — 기계(B)가 아니라 <b>기본(A)</b> 부문에 있다.',
      '기계든 전기든 건설이든 <b>공통으로</b> 지키는 규칙이라 A 에 두었다.'],
 ask:'제도 통칙이 기계 부문이 아니라 기본 부문에 들어 있는 것은 무엇을 뜻할까요?',
 ansq:'제도 통칙의 표준 번호는?',
 anso:['KS A 0005','KS B 0001','KS A 0105','KS B 0005'], ansa:0,
 anse:'<b>KS A 0005</b>. 분야를 가리지 않고 쓰는 규칙이라 <b>A(기본)</b> 부문에 있다.'},

/* ═══ Ⅱ. 도면의 크기 ═══ */
{u:'Ⅱ. 도면의 크기', t:'반으로 접으면 다음 크기', fig:'papers',
 cap:'A0 → A1 → A2 → A3 → A4, 접을 때마다 절반',
 pts:['용지는 <b>A0 ~ A4</b> 를 쓴다. 외울 게 많아 보이지만 규칙은 하나다.',
      '<b>큰 것을 반으로 접으면 바로 다음 것</b>이 된다. A0 을 접으면 A1.',
      '그래서 A4 두 장을 붙이면 <b>{{A3}}</b> 한 장이 된다.'],
 ask:'A2 는 A4 몇 장을 붙인 크기일까요? 그림에서 세어 봅시다.',
 ansq:'A1 용지를 반으로 접으면 어떤 크기가 되는가?',
 anso:['A0','A2','A3','A4'], ansa:1,
 anse:'번호가 <b>하나 커지면 절반</b>이다. A1 을 접으면 A2.'},

{u:'Ⅱ. 도면의 크기', t:'A0 은 841 × 1189 · 넓이 약 1m²',
 pts:['가장 큰 <b>A0 은 {{841 × 1189}} mm</b>, 넓이가 약 <b>1m²</b> 다.',
      '짧은 변 : 긴 변 = <b>{{1 : √2}}</b> 로 정해 두었다.',
      '이 비율이라서 <b>반으로 접어도 모양 비율이 그대로</b>다 — 그래서 계속 접을 수 있다.'],
 ask:'만약 비율이 1:2 였다면, 반으로 접었을 때 모양이 어떻게 달라질까요?',
 ansq:'A 계열 용지의 짧은 변과 긴 변의 비는?',
 anso:['1 : 1.5','1 : √2','1 : 2','2 : 3'], ansa:1,
 anse:'<b>1 : √2</b>(약 1:1.414). 이 비율이라야 반으로 접어도 같은 모양이 유지된다.'},

{u:'Ⅱ. 도면의 크기', t:'용지 크기와 제도 영역', fig:'sizeTable',
 cap:'제도 영역은 용지보다 한 겹 안쪽이다',
 pts:['왼쪽이 <b>용지 크기</b>, 오른쪽이 실제로 그림을 그리는 <b>제도 영역</b>이다.',
      '제도 영역이 더 작은 까닭은 <b>윤곽선</b>이 안쪽으로 들어와 있기 때문이다.',
      '실습에서 제일 많이 쓰는 <b>A4 는 {{210 × 297}}</b>, 제도 영역은 180 × 277 이다.'],
 ask:'A3 의 제도 영역이 277 × 390 인데, 용지 크기 297 × 420 과 각각 얼마나 차이가 나나요?',
 ansq:'A4 용지의 크기로 옳은 것은?',
 anso:['180 × 277','210 × 297','297 × 420','420 × 594'], ansa:1,
 anse:'A4 용지는 <b>210 × 297</b>. 180 × 277 은 그 안쪽 <b>제도 영역</b>이다.'},

{u:'Ⅱ. 도면의 크기', t:'용지가 크면 구역도 많아진다',
 pts:['구역 표시는 한 칸이 <b>50mm</b> 로 정해져 있다. 그래서 <b>용지가 크면 칸 수가 는다.</b>',
      '<b>A4</b> 는 긴 변 <b>{{6}}</b> · 짧은 변 4 칸, <b>A0</b> 은 긴 변 <b>{{24}}</b> · 짧은 변 16 칸이다.',
      'A1 은 16/12, A2 는 12/8, A3 은 8/6 칸이다.',
      '칸 수를 외울 것은 없다 — <b>제도 영역을 50 으로 나눈 것</b>임만 알면 된다.'],
 ask:'A0 의 긴 변 제도 영역이 1159mm 입니다. 50 으로 나누면 대략 몇 칸이 나올까요?',
 ansq:'구역 표시에서 한 구역의 크기는?',
 anso:['10mm','25mm','50mm','100mm'], ansa:2,
 anse:'한 구역은 <b>50mm</b>. 제도 영역을 50 으로 나눈 수가 곧 구역 수가 된다.'},

{u:'Ⅱ. 도면의 크기', t:'큰 도면은 A4 크기로 접어 보관한다',
 pts:['A0 도면을 그대로 서랍에 넣을 수는 없다. <b>접어서</b> 보관한다.',
      '접는 기준은 <b>{{A4}}</b> 크기다 — 어떤 도면이든 접으면 A4 한 장 크기가 된다.',
      '이때 <b>표제란이 겉으로 나오게</b> 접는다. 펴지 않고도 무슨 도면인지 알아야 하기 때문이다.'],
 ask:'서류철에 든 도면 100장에서 원하는 것을 찾으려면, 접을 때 무엇이 보여야 편할까요?',
 ansq:'도면을 접어서 보관할 때의 기준 크기는?',
 anso:['A2','A3','A4','A5'], ansa:2,
 anse:'<b>A4</b> 크기로 접는다. 서류철·파일에 함께 꽂아 두기 위해서다.'},

/* ═══ Ⅲ. 도면의 양식 ═══ */
{u:'Ⅲ. 도면의 양식', t:'정해진 자리에 정해진 것을 그린다', fig:'form5',
 cap:'윤곽선 · 표제란 · 중심 마크 · 구역 표시 · 재단 마크',
 pts:['도면은 그림만 있는 것이 아니다. <b>관리</b>하려고 넣는 것들이 따로 있다.',
      '다섯 가지다 — <b>윤곽선 · 표제란 · 중심 마크 · 구역 표시 · 재단 마크.</b>',
      '자리가 <b>정해져</b> 있어서, 처음 보는 도면도 어디를 볼지 바로 안다.'],
 ask:'그림을 그릴 자리를 넓히려고 이 다섯 가지를 빼면 어떤 불편이 생길까요?',
 ansq:'도면 양식의 5요소에 <b>들지 않는</b> 것은?',
 anso:['윤곽선','표제란','부품 목록표','재단 마크'], ansa:2,
 anse:'양식 5요소는 윤곽선·표제란·중심 마크·구역 표시·재단 마크다. 부품 목록표는 필요할 때 덧붙이는 것이다.'},

{u:'Ⅲ. 도면의 양식', t:'윤곽선 — 왼쪽만 20mm', fig:'frame',
 cap:'왼쪽이 넓은 까닭은 철할 자리를 남기기 때문이다',
 pts:['제도 영역을 네 변으로 둘러싼 선이다. <b>0.7mm 굵기 실선</b>으로 긋는다.',
      '<b>왼쪽은 {{20}}mm</b>, <b>나머지 세 변은 {{10}}mm</b> 를 띄운다.',
      '왼쪽만 넓은 것은 <b>철할 때 구멍이 그림을 먹지 않게</b> 하기 위해서다.'],
 ask:'왼쪽 여백을 다른 변과 똑같이 10mm 로 하면 무엇이 곤란해질까요?',
 ansq:'윤곽선의 왼쪽 여백을 넓게 두는 까닭은?',
 anso:['글씨를 크게 쓰려고','철하는 여백을 남기려고','접기 쉽게 하려고','표제란을 넣으려고'], ansa:1,
 anse:'왼쪽 20mm 는 <b>철하는(바인딩) 여백</b>이다. 나머지 세 변은 10mm.'},

{u:'Ⅲ. 도면의 양식', t:'표제란 — 오른쪽 아래 구석',
 pts:['제도 영역의 <b>{{오른쪽 아래}}</b> 구석에 둔다. 자리가 정해져 있다.',
      '<b>표제란을 읽는 방향 = 도면을 읽는 방향</b>이다. 도면을 어느 쪽으로 놓을지 알려 준다.',
      '적는 것 — <b>도번 · 도명 · 척도 · 투상법 · 작성일 · 제도자.</b>'],
 ask:'도면을 돌려 놓아도 어느 쪽이 위인지 알 수 있는 것은 무엇 덕분일까요?',
 ansq:'표제란이 놓이는 자리는?',
 anso:['왼쪽 위','오른쪽 위','왼쪽 아래','오른쪽 아래'], ansa:3,
 anse:'제도 영역의 <b>오른쪽 아래</b>다. 이 방향이 곧 도면을 읽는 방향이 된다.'},

{u:'Ⅲ. 도면의 양식', t:'중심 마크 — 네 곳에 짧게',
 pts:['<b>두 대칭축의 끝</b>, 곧 네 변 한가운데에 <b>{{4}}개</b> 표시한다.',
      '도면을 <b>다시 만들거나 마이크로필름으로 만들 때</b> 위치를 잡는 데 쓴다.',
      '구역 표시 경계에서 시작해 <b>윤곽선을 지나 10mm 까지</b>, 0.7mm 실선으로 긋는다.'],
 ask:'복사기에 도면을 올려 놓을 때 이 표시가 없다면 어떤 일이 생길까요?',
 ansq:'중심 마크의 개수는?',
 anso:['2개','4개','6개','8개'], ansa:1,
 anse:'네 변 한가운데에 <b>4개</b>다. 두 대칭축의 양 끝이라 4개가 된다.'},

{u:'Ⅲ. 도면의 양식', t:'구역 표시 — I 와 O 는 쓰지 않는다', fig:'zone',
 cap:'세로는 영문 대문자, 가로는 숫자',
 pts:['도면의 어느 자리인지 <b>「B-3」처럼</b> 가리키려고 나눈 칸이다.',
      '<b>세로는 영문 대문자, 가로는 숫자</b>. 한 구역의 크기는 <b>{{50}}mm</b> 다.',
      '영문 중 <b>{{I 와 O}}</b> 는 쓰지 않는다 — 숫자 <b>1 · 0</b> 과 헷갈리기 때문이다.'],
 ask:'글자 가운데 딱 두 개만 빼놓았습니다. 어떤 글자들이 숫자와 닮았는지 찾아볼까요?',
 ansq:'구역 표시의 세로 기호에서 빼는 두 글자는?',
 anso:['A 와 B','I 와 O','X 와 Y','S 와 Z'], ansa:1,
 anse:'<b>I 와 O</b> 다. 숫자 <b>1 · 0</b> 과 혼동되기 때문에 건너뛴다.'},

{u:'Ⅲ. 도면의 양식', t:'재단 마크 — 자를 자리 표시',
 pts:['복사한 도면을 <b>어디서 자를지</b> 알려 주는 표시다.',
      '네 변의 경계에 <b>{{10 × 5}}mm</b> 직사각형 두 개가 붙은 모양으로 넣는다.',
      '도면 내용과는 상관이 없다 — <b>인쇄·재단</b>을 위한 표시다.'],
 ask:'큰 종이에 여러 장을 한꺼번에 인쇄한다면 이 표시가 왜 필요할까요?',
 ansq:'재단 마크의 크기는?',
 anso:['5 × 5 mm','10 × 5 mm','20 × 10 mm','50 × 50 mm'], ansa:1,
 anse:'<b>10 × 5 mm</b> 직사각형 두 개가 합쳐진 모양으로 네 변의 경계에 넣는다.'},

/* ═══ Ⅳ. 척도 ═══ */
{u:'Ⅳ. 척도', t:'척도 A : B — 앞이 도면, 뒤가 실물', fig:'scale3',
 cap:'같은 실물을 세 가지 척도로 그린 모습',
 pts:['척도는 <b>실물에 대한 도면 그림의 비율</b>이다.',
      '<b>척도 A : B</b> 에서 <b>A 는 {{도면에서의 크기}}</b>, <b>B 는 {{실제 크기}}</b> 다.',
      '어느 쪽이 앞인지만 알면 축척·현척·배척은 저절로 갈린다.'],
 ask:'「2 : 1」이라고 적힌 도면의 그림은 실물보다 클까요, 작을까요? 앞뒤가 무엇인지 먼저 짚어 봅시다.',
 ansq:'척도 표시 <b>A : B</b> 에서 A 가 뜻하는 것은?',
 anso:['실제 크기','도면에서의 크기','용지 크기','축척 배수'], ansa:1,
 anse:'앞의 <b>A 가 도면에서의 크기</b>, 뒤의 B 가 실제 크기다.'},

{u:'Ⅳ. 척도', t:'축척 · 현척 · 배척',
 pts:['<b>축척</b> — 실물보다 <b>작게</b>. 1:2, 1:5 처럼 <b>1 : 큰 수</b> 꼴이다.',
      '<b>현척</b> — 실물과 <b>같게</b>. <b>{{1:1}}</b> 하나뿐이고 실척이라고도 한다.',
      '<b>배척</b> — 실물보다 <b>크게</b>. 2:1, 5:1 처럼 <b>큰 수 : 1</b> 꼴이다.',
      '큰 기계는 축척으로, 아주 작은 부품은 <b>배척</b>으로 그린다.'],
 ask:'손목시계 안의 작은 톱니바퀴를 도면에 그린다면 어느 척도가 맞을까요?',
 ansq:'다음 중 <b>배척</b>인 것은?',
 anso:['1:5','1:2','1:1','5:1'], ansa:3,
 anse:'<b>5:1</b>. 앞의 수가 크면 도면이 실물보다 커진 것이니 배척이다.'},

{u:'Ⅳ. 척도', t:'★ 척도를 바꿔도 치수는 실제 치수', fig:'scaleDim',
 cap:'그림만 작아졌고, 적는 숫자는 60 그대로다',
 pts:['여기가 <b>가장 많이 틀리는 곳</b>이다.',
      '척도가 무엇이든 도면에 적는 <b>치수 숫자는 언제나 {{실제 치수}}</b> 다.',
      '1:2 로 그렸다고 <b>60 을 30 이라 적지 않는다.</b> 작아진 것은 그림뿐이다.',
      '척도는 <b>표제란</b>에 한 번 적어 두면 된다.'],
 ask:'1:2 도면의 그림을 자로 재니 30mm 였습니다. 이 부품을 실제로 만들면 몇 mm 여야 할까요?',
 ansq:'실제 길이 60mm 인 부분을 척도 1:2 로 그렸다. 도면에 적는 치수는?',
 anso:['30','60','120','1:2'], ansa:1,
 anse:'치수는 <b>척도와 관계없이 실제 치수</b>인 <b>60</b> 을 적는다. 그림의 길이만 30mm 가 된다.'},

{u:'Ⅳ. 척도', t:'비례가 아니면 NS 또는 밑줄',
 pts:['그림이 척도대로 그려지지 않은 곳도 있다. 그때는 <b>표시를 해 준다.</b>',
      '표제란 척도란에 <b>{{NS}}</b> (Not to Scale) 라고 적거나 「비례가 아님」이라 쓴다.',
      '한 치수만 그렇다면 그 <b>치수 숫자 밑에 밑줄</b>을 긋는다.',
      '표시가 없으면 읽는 사람은 <b>척도대로</b>라고 믿는다 — 그래서 반드시 알려야 한다.'],
 ask:'도면을 받은 사람이 자로 재서 치수를 정하려 한다면, 왜 말려야 할까요?',
 ansq:'그림이 척도와 비례하지 않을 때의 표시 방법은?',
 anso:['척도란을 비워 둔다','NS 라 적거나 치수 밑에 밑줄을 긋는다','치수를 괄호로 묶는다','도면을 다시 그린다'], ansa:1,
 anse:'<b>NS = Not to Scale</b>. 척도란에 NS 라 적거나, 그 치수 밑에 <b>밑줄</b>을 그어 알린다.'},

{u:'Ⅳ. 척도', t:'한 장에 척도가 여럿일 때',
 pts:['상세도를 크게 그리면 <b>한 도면 안에 척도가 둘 이상</b> 생긴다.',
      '<b>주요 척도만 {{표제란}}</b> 에 적는다.',
      '나머지는 <b>그 그림의 부품 번호나 상세도 참조 문자 부근</b>에 따로 적는다.',
      '적어 두지 않으면 읽는 사람은 표제란 척도로 알고 <b>엉뚱한 크기</b>로 만든다.'],
 ask:'상세도 옆에 「2:1」이 적혀 있다면, 표제란의 척도는 그 그림에도 해당될까요?',
 ansq:'한 도면에 서로 다른 척도를 쓸 때 옳은 것은?',
 anso:['주요 척도는 표제란에, 나머지는 그 그림 부근에 적는다','표제란에 모두 나열한다',
       '도면 왼쪽 위에 모아 적는다','척도를 적지 않는다'], ansa:0,
 anse:'주요 척도만 표제란에 적고, 그 밖의 척도는 <b>해당 그림의 부품 번호·참조 문자 부근</b>에 적는다.'},

{u:'Ⅳ. 척도', t:'용지는 이렇게 고른다',
 pts:['① 실제 크기에 <b>척도를 곱해</b> 도면에서의 크기를 구한다.',
      '② 그 크기가 들어가는 <b>{{제도 영역}}</b> 을 가진 용지 중 <b>가장 작은</b> 것을 고른다.',
      '③ 용지 크기가 아니라 <b>제도 영역</b>과 견준다 — 윤곽선 안쪽만 쓸 수 있다.',
      '예) 실제 500 짜리를 1:2 로 그리면 도면에서 250 → A4(180 × 277) 에는 안 들어간다.'],
 ask:'A4 는 210 × 297 인데 그림을 그릴 수 있는 자리는 그보다 좁습니다. 무엇이 자리를 먹고 있을까요?',
 ansq:'용지를 고를 때 크기를 견주어야 하는 값은?',
 anso:['용지 크기','제도 영역','표제란 크기','구역 크기'], ansa:1,
 anse:'그림은 윤곽선 안쪽에만 그린다. 그래서 <b>제도 영역</b>과 견주어야 한다.'}

];

window.LESSON  = LESSON;
window.LESSFIG = FIG;
})();
