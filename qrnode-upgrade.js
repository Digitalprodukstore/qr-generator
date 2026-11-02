/* QR Studio Pro — QRNode adoption + Phase 2 Premium Design Studio. Additive; legacy renderer/admin remain. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const enc = v => encodeURIComponent(String(v ?? "").trim());
  const digits = v => String(v ?? "").replace(/\D/g, "");
  const defs = {
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
  const ids=Object.keys(defs); let active="url", values={};
  const esc=v=>String(v??"").replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/([,;])/g,"\\$1");
  const icsEsc=v=>esc(v); // retained Phase 1 safety marker for iCalendar-compatible escaping
  const wifiEsc=v=>String(v??"").replace(/([\\;,:"])/g,"\\$1");
  const icsDate=v=>{if(!v)return"";const d=new Date(v);if(Number.isNaN(d.getTime()))return"";return d.getUTCFullYear()+String(d.getUTCMonth()+1).padStart(2,"0")+String(d.getUTCDate()).padStart(2,"0")+"T"+String(d.getUTCHours()).padStart(2,"0")+String(d.getUTCMinutes()).padStart(2,"0")+"00Z"};
  function payload(c,f){const g=k=>String(f[k]??"").trim();switch(c){
    case"url":case"menu":case"invitation":return g("url");case"text":return g("text");
    case"wa":return"https://wa.me/"+digits(g("number"))+(g("message")?"?text="+enc(g("message")):"");
    case"email":return"mailto:"+g("to")+"?subject="+enc(g("subject"))+"&body="+enc(g("body"));
    case"tel":return"tel:"+g("number").replace(/[^\d+]/g,"");case"sms":return"smsto:"+digits(g("number"))+(g("message")?":"+g("message"):"");
    case"wifi":return"WIFI:T:"+g("security")+";S:"+wifiEsc(g("ssid"))+";P:"+wifiEsc(g("password"))+";;";
    case"vcard":return["BEGIN:VCARD","VERSION:3.0","FN:"+esc(g("name")),g("org")?"ORG:"+esc(g("org")):"",g("phone")?"TEL;TYPE=CELL:"+esc(g("phone")):"",g("email")?"EMAIL:"+esc(g("email")):"","END:VCARD"].filter(Boolean).join("\r\n");
    case"geo":return"geo:"+g("lat")+","+g("lng")+(g("address")?"?q="+enc(g("address")):"");
    case"event":return["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//QR Studio Pro//ID","BEGIN:VEVENT","SUMMARY:"+g("title").replace(/[\r\n]/g," "),g("start")?"DTSTART:"+icsDate(g("start")):"",g("end")?"DTEND:"+icsDate(g("end")):"",g("location")?"LOCATION:"+g("location").replace(/[\r\n]/g," "):"","END:VEVENT","END:VCALENDAR"].filter(Boolean).join("\r\n");
    default:return"";}}
  function validate(c,f){const g=k=>String(f[k]??"").trim();
    if(["url","menu","invitation"].includes(c)){try{const u=new URL(g("url"));if(!["http:","https:"].includes(u.protocol))throw 0}catch{return"Masukkan tautan valid yang diawali https:// atau http://."}}
    if(c==="text"&&!g("text"))return"Teks tidak boleh kosong.";
    if(c==="wa"&&!/^\d{8,15}$/.test(digits(g("number"))))return"Nomor WhatsApp harus 8–15 digit termasuk kode negara.";
    if(c==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g("to")))return"Alamat email belum valid.";
    if(["tel","sms"].includes(c)&&!/^\+?\d{6,16}$/.test(g("number").replace(/[\s()-]/g,"")))return"Nomor telepon harus 6–16 digit.";
    if(c==="wifi"&&!g("ssid"))return"Nama jaringan (SSID) wajib diisi.";if(c==="wifi"&&g("security")!=="nopass"&&!g("password"))return"Kata sandi Wi-Fi wajib diisi untuk keamanan WPA/WEP.";
    if(c==="vcard"&&!g("name"))return"Nama kontak wajib diisi.";
    if(c==="geo"){const a=Number(g("lat")),b=Number(g("lng"));if(!g("lat")||!g("lng")||!Number.isFinite(a)||a<-90||a>90||!Number.isFinite(b)||b<-180||b>180)return"Latitude harus -90 s/d 90 dan longitude -180 s/d 180."}
    if(c==="event"){if(!g("title")||!g("start"))return"Nama acara dan waktu mulai wajib diisi.";if(!icsDate(g("start")))return"Waktu mulai tidak valid.";if(g("end")&&(!icsDate(g("end"))||new Date(g("end"))<new Date(g("start"))))return"Waktu selesai harus valid dan tidak lebih awal dari waktu mulai."}return null;
  }
  function clearPreview(){const c=$("qrCanvas");if(!c)return;const x=c.getContext("2d");if(x)x.clearRect(0,0,c.width,c.height);c.dataset.qrReady="false";c.dataset.qrPayload=""}
  function update(){const e=validate(active,values),s=$("qrnodeStatus");if(e){if(s){s.textContent=e;s.className="mt-2 text-sm text-red-700"}clearPreview();return}const p=payload(active,values),n=new TextEncoder().encode(p).length;if(n>1200){if(s){s.textContent="Konten terlalu panjang ("+n+" byte). Ringkas konten agar mudah dipindai.";s.className="mt-2 text-sm text-red-700"}clearPreview();return}$("payloadValue").value=p;if(s){s.textContent="Data valid • "+n+" byte • EC Level H";s.className="mt-2 text-sm text-emerald-700"}window.renderLiveQR?.();updateContrast()}
  function renderFields(){const host=$("qrnodeFields");if(!host)return;host.replaceChildren();for(const[name,label,type,placeholder]of defs[active]){const w=document.createElement("label");w.className="flex flex-col gap-1.5 min-w-0";const t=document.createElement("span");t.className="font-label-sm text-label-sm text-on-surface-variant";t.textContent=label;w.append(t);let input;if(type==="textarea"){input=document.createElement("textarea");input.rows=2}else if(type==="select"){input=document.createElement("select");for(const v of ["WPA","WEP","nopass"]){const o=document.createElement("option");o.value=v;o.textContent=v==="nopass"?"Tanpa sandi":v;input.append(o)}}else{input=document.createElement("input");input.type=type}input.dataset.qrfield=name;input.value=values[name]??(type==="select"?"WPA":"");if(!input.value&&placeholder)input.placeholder=placeholder;input.className="w-full rounded-xl bg-surface-container-highest text-on-surface px-3 py-2.5 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary";const changed=()=>{values[name]=input.value;update()};input.addEventListener("input",changed);input.addEventListener("change",changed);w.append(input);host.append(w)}}
  function safeName(s){return String(s||"qr-studio").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"qr-studio"}
  function qrMatrix(){const p=$("payloadValue")?.value||"",gen=window.qrcode||(typeof qrcode==="function"?qrcode:null);if(!p||!gen)throw Error("QR belum siap.");const qr=gen(0,"H");qr.addData(p,"Byte");qr.make();return qr}
  async function downloadSvg(){
    try {
      const qr=qrMatrix(),n=qr.getModuleCount(),q=4,total=n+q*2,
        fg=$("qrColor1")?.value||"#111827",bg=$("qrBgColor")?.value||"#fff",
        g2=$("qrColor2")?.value||fg,
        gradient=$("modeGradientBtn")?.classList.contains("bg-secondary"),
        logo=$("customLogoImg");
      let body='<rect width="'+total+'" height="'+total+'" fill="'+bg+'"/>';
      if(gradient)body+='<defs><linearGradient id="qrGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="'+fg+'"/><stop offset="100%" stop-color="'+g2+'"/></linearGradient></defs>';
      body+='<g fill="'+(gradient?"url(#qrGradient)":fg)+'">';
      for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(qr.isDark(r,c))body+='<rect x="'+(c+q)+'" y="'+(r+q)+'" width="1" height="1"/>';
      body+='</g>';
      if(logo&&!logo.classList.contains("hidden")&&/^data:image\/(png|jpeg|webp);base64,/i.test(logo.src)){
        const side=total*.20,x=(total-side)/2,y=(total-side)/2;
        body+='<rect x="'+(x-.25)+'" y="'+(y-.25)+'" width="'+(side+.5)+'" height="'+(side+.5)+'" rx="1" fill="#fff"/><image href="'+logo.src+'" x="'+x+'" y="'+y+'" width="'+side+'" height="'+side+'" preserveAspectRatio="xMidYMid meet"/>';
      }
      const svg='<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 '+total+' '+total+'" role="img" aria-label="QR Code">'+body+"</svg>";
      const blob=new Blob([svg],{type:"image/svg+xml;charset=utf-8"});
      const filename=safeName("qr-studio-"+active)+"-"+Date.now()+".svg";
      if(typeof window.qrnodeDeliverFile==="function") await window.qrnodeDeliverFile(blob,filename,"QR Studio Pro — SVG");
      else {
        const url=URL.createObjectURL(blob),a=document.createElement("a");
        a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
        setTimeout(()=>URL.revokeObjectURL(url),60000);
        window.showToast?.("Unduhan dikirim ke browser","Periksa folder Unduhan/Downloads perangkat Anda.");
      }
    } catch(e) {
      window.showToast?.("Ekspor SVG gagal",e.message||"Coba lagi.");
    }
  }
  const exportSizes=[
    {id:"story",label:"Story / Reels",ratio:"9:16",width:1080,height:1920,usage:"Instagram Story, Reels, TikTok"},
    {id:"square",label:"Post Persegi",ratio:"1:1",width:1080,height:1080,usage:"Instagram, katalog, profil"},
    {id:"portrait",label:"Feed Portrait",ratio:"4:5",width:1080,height:1350,usage:"Feed Instagram & promosi"},
    {id:"landscape",label:"Landscape",ratio:"16:9",width:1920,height:1080,usage:"Presentasi, layar, banner digital"},
    {id:"print",label:"Flyer / Cetak",ratio:"3:2",width:1800,height:1200,usage:"Flyer, poster kecil, materi cetak"}
  ];
  let selectedExportSize="story";
  async function downloadCustomSize(){
    const source=$("qrCanvas"),size=exportSizes.find(item=>item.id===selectedExportSize);
    if(!source||source.dataset.qrReady!=="true"){window.showToast?.("QR belum siap","Lengkapi data QR terlebih dahulu.");return}
    if(!size){window.showToast?.("Ukuran belum dipilih","Pilih salah satu ukuran terlebih dahulu.");return}
    try{
      const out=document.createElement("canvas");out.width=size.width;out.height=size.height;
      const ctx=out.getContext("2d");if(!ctx)throw Error("Browser tidak dapat menyiapkan canvas.");
      const bg=$("qrBgColor")?.value||"#FFFFFF";
      ctx.fillStyle=bg;ctx.fillRect(0,0,size.width,size.height);
      const side=Math.floor(Math.min(size.width,size.height)*.82);
      const x=Math.round((size.width-side)/2),y=Math.round((size.height-side)/2);
      ctx.imageSmoothingEnabled=false;ctx.drawImage(source,x,y,side,side);
      const blob=await new Promise((resolve,reject)=>out.toBlob(value=>value?resolve(value):reject(Error("Browser gagal membuat file PNG.")),"image/png"));
      const filename=safeName("qr-studio-"+active+"-"+size.id+"-"+size.width+"x"+size.height)+".png";
      if(typeof window.qrnodeDeliverFile==="function")await window.qrnodeDeliverFile(blob,filename,"QR Studio Pro — "+size.ratio);
      else{
        const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
        setTimeout(()=>URL.revokeObjectURL(url),60000);
        window.showToast?.("Unduhan dikirim ke browser","Periksa folder Unduhan/Downloads perangkat Anda.");
      }
    }catch(e){window.showToast?.("Ekspor ukuran gagal",e.message||"Coba lagi.")}
  }
  function renderExportSizes(){
    const host=$("qrnodeSizeOptions");if(!host)return;host.replaceChildren();
    for(const size of exportSizes){
      const b=document.createElement("button");b.type="button";b.dataset.size=size.id;
      b.className="qrnode-size-option text-left rounded-xl border p-3 transition";
      b.setAttribute("aria-pressed",String(size.id===selectedExportSize));
      const title=document.createElement("span");title.className="block text-sm font-semibold";title.textContent=size.label;
      const ratio=document.createElement("span");ratio.className="block text-base font-bold mt-1";ratio.textContent=size.ratio;
      const pixels=document.createElement("span");pixels.className="block text-xs mt-1";pixels.textContent=size.width+" × "+size.height+" px";
      const usage=document.createElement("span");usage.className="block text-xs mt-1";usage.textContent=size.usage;
      b.append(title,ratio,pixels,usage);b.addEventListener("click",()=>{selectedExportSize=size.id;renderExportSizes();const status=$("qrnodeSizeStatus");if(status)status.textContent="Dipilih: "+size.ratio+" • "+size.width+" × "+size.height+" px";});
      if(size.id===selectedExportSize)b.classList.add("is-selected");
      host.append(b);
    }
  }
  async function downloadPng2048(){
    const c=$("qrCanvas");
    if(!c||c.dataset.qrReady!=="true"){window.showToast?.("QR belum siap","Lengkapi data QR terlebih dahulu.");return}
    try {
      const out=document.createElement("canvas");out.width=2048;out.height=2048;
      const x=out.getContext("2d");if(!x)throw Error("Browser tidak dapat menyiapkan canvas.");
      x.imageSmoothingEnabled=false;x.drawImage(c,0,0,2048,2048);
      const blob=await new Promise((resolve,reject)=>out.toBlob(value=>value?resolve(value):reject(Error("Browser gagal membuat PNG 2048.")),"image/png"));
      const filename=safeName("qr-studio-"+active)+"-2048.png";
      if(typeof window.qrnodeDeliverFile==="function") await window.qrnodeDeliverFile(blob,filename,"QR Studio Pro — PNG 2048");
      else {
        const url=URL.createObjectURL(blob),a=document.createElement("a");
        a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
        setTimeout(()=>URL.revokeObjectURL(url),60000);
        window.showToast?.("Unduhan dikirim ke browser","Periksa folder Unduhan/Downloads perangkat Anda.");
      }
    } catch(e) {
      window.showToast?.("Ekspor PNG gagal",e.message||"Coba lagi.");
    }
  }
  function luminance(hex){const h=String(hex||"").replace("#","");if(!/^[0-9a-f]{6}$/i.test(h))return 0;const rgb=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]}
  function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
  function updateContrast(){const el=$("qrnodeContrast");if(!el)return;const c1=$("qrColor1")?.value||"#111111",c2=$("qrColor2")?.value||c1,bg=$("qrBgColor")?.value||"#ffffff",ratio=Math.min(contrast(c1,bg),contrast(c2,bg)),pass=ratio>=4.5;el.textContent="Kontras "+ratio.toFixed(2)+":1 • "+(pass?"Baik untuk pemindaian":"Ubah warna agar lebih mudah dipindai");el.className="mt-2 text-xs "+(pass?"text-emerald-700":"text-amber-700")}
  const presetData={gold:{c1:"#211F1A",c2:"#8B682D",bg:"#FFFEFA",grad:true},midnight:{c1:"#FFFFFF",c2:"#D2B679",bg:"#171713",grad:true},mono:{c1:"#111111",c2:"#111111",bg:"#FFFFFF",grad:false},coffee:{c1:"#4B2E1E",c2:"#8B4F25",bg:"#FFF8EE",grad:true},forest:{c1:"#173B2A",c2:"#356B47",bg:"#F4FAF5",grad:true}};
  function applyDesignPreset(key){const p=presetData[key];if(!p)return;const set=(id,v)=>{const e=$(id);if(e)e.value=v};set("qrColor1",p.c1);set("qrColor1Hex",p.c1);set("qrColor2",p.c2);set("qrColor2Hex",p.c2);set("qrBgColor",p.bg);set("qrBgColorHex",p.bg);window.setColorMode?.(p.grad?"gradient":"solid");updateContrast()}
  function saveProject(){try{const p=$("payloadValue")?.value||"";if(!p)return;const item={id:Date.now(),name:labels[active]+" • "+new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"}),type:active,values:{...values},colors:{c1:$("qrColor1")?.value,c2:$("qrColor2")?.value,bg:$("qrBgColor")?.value,gradient:$("modeGradientBtn")?.classList.contains("bg-secondary")}};const list=JSON.parse(localStorage.getItem("qrstudio.projects")||"[]");list.unshift(item);localStorage.setItem("qrstudio.projects",JSON.stringify(list.slice(0,8)));renderProjects();window.showToast?.("Proyek disimpan","Tersimpan lokal di perangkat ini.")}catch(e){window.showToast?.("Gagal menyimpan",e.message||"Penyimpanan browser tidak tersedia.")}}
  function loadProject(id){try{const list=JSON.parse(localStorage.getItem("qrstudio.projects")||"[]"),item=list.find(x=>String(x.id)===String(id));if(!item)return;active=item.type;values={...(item.values||{})};const sel=$("qrnodeSelect");if(sel)sel.value=active;renderFields();const set=(id,v)=>{const e=$(id);if(e&&v)e.value=v};set("qrColor1",item.colors?.c1);set("qrColor2",item.colors?.c2);set("qrBgColor",item.colors?.bg);window.setColorMode?.(item.colors?.gradient?"gradient":"solid");update();window.showToast?.("Proyek dimuat","Desain dan konten berhasil dipulihkan.")}catch(e){window.showToast?.("Gagal memuat proyek",e.message||"Data lokal rusak.")}}
  function deleteProject(id){const list=JSON.parse(localStorage.getItem("qrstudio.projects")||"[]").filter(x=>String(x.id)!==String(id));localStorage.setItem("qrstudio.projects",JSON.stringify(list));renderProjects()}
  function renderProjects(){const host=$("qrnodeProjects");if(!host)return;host.replaceChildren();let list=[];try{list=JSON.parse(localStorage.getItem("qrstudio.projects")||"[]")}catch{}if(!list.length){host.innerHTML='<span class="text-xs text-on-surface-variant">Belum ada proyek tersimpan.</span>';return}for(const item of list.slice(0,5)){const row=document.createElement("div");row.className="flex items-center justify-between gap-2 rounded-lg border border-outline-variant px-2.5 py-2 bg-surface-container-low";const b=document.createElement("button");b.type="button";b.className="min-w-0 flex-1 text-left text-xs text-on-surface truncate";b.textContent=item.name||labels[item.type]||"Proyek QR";b.onclick=()=>loadProject(item.id);const d=document.createElement("button");d.type="button";d.className="shrink-0 text-xs text-red-700 px-2";d.textContent="Hapus";d.onclick=()=>deleteProject(item.id);row.append(b,d);host.append(row)}}
  function addStudio(){if($("qrnodeStudio"))return;const anchor=$("qrnodeCategory");if(!anchor)return;const sec=document.createElement("section");sec.id="qrnodeStudio";sec.className="mt-3 rounded-xl border border-outline-variant bg-surface p-3 sm:p-4";sec.innerHTML='<div class="flex items-center justify-between gap-2"><div><h3 class="font-label-md text-label-md text-on-surface">Premium Design Studio</h3><p class="text-xs text-on-surface-variant mt-1">Pilih gaya, cek kontras, simpan proyek, lalu ekspor resolusi tinggi.</p></div><span class="text-xs rounded-full bg-primary-container px-2 py-1">PHASE 2</span></div><div class="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3"><button type="button" class="qrnode-preset" data-preset="gold">Luxury Gold</button><button type="button" class="qrnode-preset" data-preset="midnight">Midnight</button><button type="button" class="qrnode-preset" data-preset="mono">Mono</button><button type="button" class="qrnode-preset" data-preset="coffee">Coffee</button><button type="button" class="qrnode-preset" data-preset="forest">Forest</button></div><p id="qrnodeContrast" class="mt-2 text-xs text-on-surface-variant" role="status" aria-live="polite">Kontras akan diperiksa otomatis.</p><div class="mt-4 rounded-xl border border-outline-variant bg-surface-container-low p-3"><div class="flex items-center justify-between gap-2"><div><h4 class="text-sm font-semibold text-on-surface">Ukuran Download</h4><p class="text-xs text-on-surface-variant mt-1">Pilih format sesuai media tujuan. QR akan otomatis diposisikan di tengah.</p></div><span class="text-xs rounded-full bg-primary-container px-2 py-1">PNG</span></div><div id="qrnodeSizeOptions" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3"></div><p id="qrnodeSizeStatus" class="text-xs text-on-surface-variant mt-2" role="status" aria-live="polite">Dipilih: 9:16 • 1080 × 1920 px</p><button type="button" id="qrnodeDownloadSize" class="qrnode-action w-full mt-3">Unduh Ukuran Terpilih</button></div><div class="flex flex-wrap gap-2 mt-3"><button type="button" id="qrnodeSave" class="qrnode-action">Simpan Proyek</button></div><div class="mt-3"><div class="text-xs font-semibold text-on-surface mb-2">Proyek tersimpan di perangkat ini</div><div id="qrnodeProjects" class="space-y-1.5"></div></div>';anchor.insertAdjacentElement("afterend",sec);["qrColor1","qrColor1Hex","qrColor2","qrColor2Hex","qrBgColor","qrBgColorHex"].forEach(id=>{const input=$(id);if(input){input.addEventListener("input",updateContrast);input.addEventListener("change",updateContrast)}});sec.querySelectorAll("[data-preset]").forEach(b=>b.addEventListener("click",()=>applyDesignPreset(b.dataset.preset)));$("qrnodeSave").onclick=saveProject;$("qrnodeDownloadSize").onclick=downloadCustomSize;renderExportSizes();renderProjects();updateContrast()}
  function addSvgButton(){const share=document.querySelector('button[onclick="shareQRMobile()"]');if(share&&!$("qrSvgButton")){const b=document.createElement("button");b.id="qrSvgButton";b.type="button";b.className=share.className;b.innerHTML='<span class="material-symbols-outlined text-[22px]">code</span><span>Unduh SVG</span>';b.addEventListener("click",downloadSvg);share.parentElement.insertBefore(b,share)}}
  function init(){const tabs=$("tabUrl")?.parentElement,oldInput=$("inputPayloadContainer"),oldWa=$("waExtrasContainer");if(!tabs||!$("payloadValue")||$("qrnodeCategory"))return;const panel=document.createElement("section");panel.id="qrnodeCategory";panel.className="mb-3 rounded-xl border border-outline-variant bg-surface p-3 sm:p-4";panel.innerHTML='<div class="flex items-center justify-between gap-2 mb-3"><div><h3 class="font-label-md text-label-md text-on-surface">Pilih jenis QR</h3><p class="text-xs text-on-surface-variant mt-1">12 format untuk kebutuhan pribadi dan bisnis</p></div><span class="text-xs rounded-full bg-primary-container px-2 py-1">QRNode</span></div><select id="qrnodeSelect" class="w-full rounded-xl border border-outline-variant bg-surface-container-highest text-on-surface px-3 py-3 font-label-md"></select><div id="qrnodeFields" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3"></div><p id="qrnodeStatus" role="status" aria-live="polite" class="mt-2 text-sm text-on-surface-variant">Lengkapi data untuk membuat QR.</p><p class="mt-2 text-xs text-on-surface-variant">Menu digital dan undangan menggunakan tautan publik agar hasil QR dapat dibuka oleh semua pemindai.</p>';tabs.parentElement.insertBefore(panel,tabs);tabs.classList.add("hidden");if(oldInput)oldInput.classList.add("hidden");if(oldWa)oldWa.classList.add("hidden");const sel=$("qrnodeSelect");for(const id of ids){const o=document.createElement("option");o.value=id;o.textContent=labels[id];sel.append(o)}sel.addEventListener("change",()=>{active=sel.value;values={};renderFields();update()});values={url:"https://example.com"};renderFields();update();addStudio();addSvgButton()}
  window.qrStudioApplyDesignPreset=applyDesignPreset;window.qrStudioSaveProject=saveProject;
  window.addEventListener("DOMContentLoaded",init);if(document.readyState!=="loading")init();
})();