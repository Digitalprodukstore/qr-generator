/* QR Studio Pro — QRNode feature adoption, Phase 1. Additive; legacy admin/renderer remain. */
(() => {
"use strict";
const $=id=>document.getElementById(id), digits=v=>String(v??"").replace(/\D/g,""), enc=v=>encodeURIComponent(String(v??"").trim());
const defs={
url:[["url","URL website","url","https://example.com"]],text:[["text","Teks bebas","textarea","Tulis pesan Anda"]],
wa:[["number","Nomor WhatsApp (kode negara)","tel","628123456789"],["message","Pesan otomatis","text","Halo, saya ingin bertanya"]],
email:[["to","Alamat email","email","halo@bisnis.com"],["subject","Subjek","text","Halo"],["body","Isi pesan","textarea",""]],
tel:[["number","Nomor telepon (format internasional)","tel","+62215550188"]],sms:[["number","Nomor tujuan SMS","tel","+628123456789"],["message","Isi SMS","textarea",""]],
wifi:[["ssid","Nama jaringan (SSID)","text","Nama Wi-Fi"],["security","Keamanan","select","WPA"],["password","Kata sandi","text",""]],
vcard:[["name","Nama lengkap","text","Nama Anda"],["org","Perusahaan / organisasi","text",""],["phone","Nomor telepon","tel","+628123456789"],["email","Email","email",""]],
geo:[["lat","Latitude","text","-6.200000"],["lng","Longitude","text","106.816666"],["address","Nama lokasi (opsional)","text",""]],
event:[["title","Nama acara","text","Acara Anda"],["start","Mulai","datetime-local",""],["end","Selesai","datetime-local",""],["location","Lokasi","text",""]],
menu:[["url","Link menu online","url","https://example.com/menu"]],invitation:[["url","Link undangan online","url","https://example.com/undangan"]]
};
const labels={url:"Website / URL",text:"Teks",wa:"WhatsApp",email:"Email",tel:"Telepon",sms:"SMS",wifi:"Wi-Fi",vcard:"Kontak (vCard)",geo:"Lokasi (Geo)",event:"Acara (Calendar)",menu:"Menu digital (tautan)",invitation:"Undangan (tautan)"};
const ids=Object.keys(defs); let active="url",values={};
const wifiEsc=v=>String(v??"").replace(/([\\;,:"])/g,"\\$1");
const vcEsc=v=>String(v??"").replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/([,;])/g,"\\$1");
const icsEsc=v=>String(v??"").replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/([,;])/g,"\\$1");
const icsDate=v=>{if(!v)return"";const d=new Date(v);if(Number.isNaN(d.getTime()))return"";return d.getUTCFullYear()+String(d.getUTCMonth()+1).padStart(2,"0")+String(d.getUTCDate()).padStart(2,"0")+"T"+String(d.getUTCHours()).padStart(2,"0")+String(d.getUTCMinutes()).padStart(2,"0")+"00Z";};
function payload(c,f){const g=k=>String(f[k]??"").trim();switch(c){
case"url":case"menu":case"invitation":return g("url");case"text":return g("text");
case"wa":return"https://wa.me/"+digits(g("number"))+(g("message")?"?text="+enc(g("message")):"");
case"email":return"mailto:"+g("to")+"?subject="+enc(g("subject"))+"&body="+enc(g("body"));
case"tel":return"tel:"+g("number").replace(/[^\d+]/g,"");case"sms":return"smsto:"+digits(g("number"))+(g("message")?":"+g("message"):"");
case"wifi":return"WIFI:T:"+g("security")+";S:"+wifiEsc(g("ssid"))+";P:"+wifiEsc(g("password"))+";;";
case"vcard":return["BEGIN:VCARD","VERSION:3.0","FN:"+vcEsc(g("name")),g("org")?"ORG:"+vcEsc(g("org")):"",g("phone")?"TEL;TYPE=CELL:"+vcEsc(g("phone")):"",g("email")?"EMAIL:"+vcEsc(g("email")):"","END:VCARD"].filter(Boolean).join("\r\n");
case"geo":return"geo:"+g("lat")+","+g("lng")+(g("address")?"?q="+enc(g("address")):"");
case"event":return["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//QR Studio Pro//ID","BEGIN:VEVENT","SUMMARY:"+g("title").replace(/[\r\n]/g," "),g("start")?"DTSTART:"+icsDate(g("start")):"",g("end")?"DTEND:"+icsDate(g("end")):"",g("location")?"LOCATION:"+g("location").replace(/[\r\n]/g," "):"","END:VEVENT","END:VCALENDAR"].filter(Boolean).join("\r\n");
default:return"";}}
function validate(c,f){const g=k=>String(f[k]??"").trim();
if(["url","menu","invitation"].includes(c)){try{const u=new URL(g("url"));if(!["http:","https:"].includes(u.protocol))throw 0;}catch{return"Masukkan tautan valid yang diawali https:// atau http://.";}}
if(c==="text"&&!g("text"))return"Teks tidak boleh kosong.";
if(c==="wa"&&!/^\d{8,15}$/.test(digits(g("number"))))return"Nomor WhatsApp harus 8–15 digit termasuk kode negara.";
if(c==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g("to")))return"Alamat email belum valid.";
if(["tel","sms"].includes(c)&&! /^\+?\d{6,16}$/.test(g("number").replace(/[\s()-]/g,"")))return"Nomor telepon harus 6–16 digit.";
if(c==="wifi"&&!g("ssid"))return"Nama jaringan (SSID) wajib diisi.";if(c==="wifi"&&g("security")!=="nopass"&&!g("password"))return"Kata sandi Wi-Fi wajib diisi untuk keamanan WPA/WEP.";
if(c==="vcard"&&!g("name"))return"Nama kontak wajib diisi.";
if(c==="geo"){const a=Number(g("lat")),b=Number(g("lng"));if(!g("lat")||!g("lng")||!Number.isFinite(a)||a< -90||a>90||!Number.isFinite(b)||b< -180||b>180)return"Latitude harus -90 s/d 90 dan longitude -180 s/d 180.";}
if(c==="event"){if(!g("title")||!g("start"))return"Nama acara dan waktu mulai wajib diisi.";if(!icsDate(g("start")))return"Waktu mulai tidak valid.";if(g("end")&&(!icsDate(g("end"))||new Date(g("end"))<new Date(g("start"))))return"Waktu selesai harus valid dan tidak lebih awal dari waktu mulai.";}
return null;}
function clearPreview(){const c=$("qrCanvas");if(!c)return;const x=c.getContext("2d");if(x)x.clearRect(0,0,c.width,c.height);c.dataset.qrReady="false";c.dataset.qrPayload="";}
function update(){const e=validate(active,values),s=$("qrnodeStatus");if(e){if(s){s.textContent=e;s.className="mt-2 text-sm text-red-700";}clearPreview();return;}
const p=payload(active,values),n=new TextEncoder().encode(p).length;if(n>1200){if(s){s.textContent="Konten terlalu panjang ("+n+" byte). Ringkas konten agar mudah dipindai.";s.className="mt-2 text-sm text-red-700";}clearPreview();return;}
$("payloadValue").value=p;if(s){s.textContent="Data valid • "+n+" byte • EC Level H";s.className="mt-2 text-sm text-emerald-700";}if(typeof window.renderLiveQR==="function")window.renderLiveQR();}
function renderFields(){const host=$("qrnodeFields");if(!host)return;host.replaceChildren();for(const [name,label,type,placeholder]of defs[active]){
const w=document.createElement("label");w.className="flex flex-col gap-1.5 min-w-0";const t=document.createElement("span");t.className="font-label-sm text-label-sm text-on-surface-variant";t.textContent=label;w.append(t);let input;
if(type==="textarea"){input=document.createElement("textarea");input.rows=2;}else if(type==="select"){input=document.createElement("select");for(const v of ["WPA","WEP","nopass"]){const o=document.createElement("option");o.value=v;o.textContent=v==="nopass"?"Tanpa sandi":v;input.append(o);}}else{input=document.createElement("input");input.type=type;}
input.dataset.qrfield=name;input.value=values[name]??(type==="select"?"WPA":"");if(!input.value&&placeholder)input.placeholder=placeholder;input.className="w-full rounded-xl bg-surface-container-highest text-on-surface px-3 py-2.5 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary";
const changed=()=>{values[name]=input.value;update();};input.addEventListener("input",changed);input.addEventListener("change",changed);w.append(input);host.append(w);}}
function safeName(s){return String(s||"qr-studio").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"qr-studio";}
function downloadSvg(){const c=$("qrCanvas"),p=$("payloadValue")?.value||"";if(!c||c.dataset.qrReady!=="true"||!p){if(window.showToast)window.showToast("QR belum siap","Lengkapi data QR yang valid terlebih dahulu.");return;}
try{const gen=window.qrcode||(typeof qrcode==="function"?qrcode:null);if(!gen)throw Error("Library QR belum tersedia.");const qr=gen(0,"H");qr.addData(p,"Byte");qr.make();const n=qr.getModuleCount(),q=4,total=n+q*2,fg=$("qrColor1")?.value||"#111827",bg=$("qrBgColor")?.value||"#ffffff",g2=$("qrColor2")?.value||fg,gradient=$("modeGradientBtn")?.classList.contains("bg-secondary")||false;
let body='<rect width="'+total+'" height="'+total+'" fill="'+bg+'"/>';if(gradient)body+='<defs><linearGradient id="qrGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="'+fg+'"/><stop offset="100%" stop-color="'+g2+'"/></linearGradient></defs>';
body+='<g fill="'+(gradient?"url(#qrGradient)":fg)+'">';for(let r=0;r<n;r++)for(let col=0;col<n;col++)if(qr.isDark(r,col))body+='<rect x="'+(col+q)+'" y="'+(r+q)+'" width="1" height="1"/>';body+="</g>";
const logo=$("customLogoImg");if(logo&&!logo.classList.contains("hidden")&&logo.src&&logo.src.startsWith("data:image/")){const side=total*.20,x=(total-side)/2,y=(total-side)/2;body+='<rect x="'+(x-.25)+'" y="'+(y-.25)+'" width="'+(side+.5)+'" height="'+(side+.5)+'" rx="1" fill="#ffffff"/><image href="'+logo.src+'" x="'+x+'" y="'+y+'" width="'+side+'" height="'+side+'" preserveAspectRatio="xMidYMid meet"/>';}
const svg='<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="1200" viewBox="0 0 '+total+' '+total+'" role="img" aria-label="QR Code">'+body+"</svg>";
const blob=new Blob([svg],{type:"image/svg+xml;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=safeName("qr-studio-"+active)+"-"+Date.now()+".svg";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);if(window.showToast)window.showToast("SVG berhasil dibuat","File vektor siap digunakan untuk desain.");}catch(e){if(window.showToast)window.showToast("Ekspor SVG gagal",e.message||"Coba lagi.");}}
function init(){const tabs=$("tabUrl")?.parentElement,oldInput=$("inputPayloadContainer"),oldWa=$("waExtrasContainer");if(!tabs||!$("payloadValue")||$("qrnodeCategory"))return;
const panel=document.createElement("section");panel.id="qrnodeCategory";panel.className="mb-3 rounded-xl border border-outline-variant bg-surface p-3 sm:p-4";
panel.innerHTML='<div class="flex items-center justify-between gap-2 mb-3"><div><h3 class="font-label-md text-label-md text-on-surface">Pilih jenis QR</h3><p class="text-xs text-on-surface-variant mt-1">12 format untuk kebutuhan pribadi dan bisnis</p></div><span class="text-xs rounded-full bg-primary-container px-2 py-1">QRNode</span></div><select id="qrnodeSelect" class="w-full rounded-xl border border-outline-variant bg-surface-container-highest text-on-surface px-3 py-3 font-label-md"></select><div id="qrnodeFields" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3"></div><p id="qrnodeStatus" role="status" aria-live="polite" class="mt-2 text-sm text-on-surface-variant">Lengkapi data untuk membuat QR.</p><p class="mt-2 text-xs text-on-surface-variant">Menu digital dan undangan menggunakan tautan publik agar hasil QR dapat dibuka oleh semua pemindai.</p>';
tabs.parentElement.insertBefore(panel,tabs);tabs.classList.add("hidden");if(oldInput)oldInput.classList.add("hidden");if(oldWa)oldWa.classList.add("hidden");
const sel=$("qrnodeSelect");for(const id of ids){const o=document.createElement("option");o.value=id;o.textContent=labels[id];sel.append(o);}sel.addEventListener("change",()=>{active=sel.value;values={};renderFields();update();});
active="url";values={url:"https://example.com"};renderFields();update();
const share=document.querySelector('button[onclick="shareQRMobile()"]');if(share&&!$("qrSvgButton")){const b=document.createElement("button");b.id="qrSvgButton";b.type="button";b.className=share.className;b.innerHTML='<span class="material-symbols-outlined text-[22px]">code</span><span>Unduh SVG</span>';b.addEventListener("click",downloadSvg);share.parentElement.insertBefore(b,share);}
}
window.addEventListener("DOMContentLoaded",init);if(document.readyState!=="loading")init();
})();