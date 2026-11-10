/* QR Studio Pro — authenticated global admin settings client. */
(() => {
  "use strict";
  const TYPE_LABELS = {
    url:"Website / URL", text:"Teks", wifi:"Wi-Fi", wa:"WhatsApp", email:"Email",
    tel:"Telepon", sms:"SMS", vcard:"Kontak (vCard)", review:"Google Review",
    social:"Social Media", menu:"Menu Digital", geo:"Lokasi", pdf:"PDF / Dokumen",
    multilink:"Multi-Link", form:"Formulir / Feedback", event:"Acara / Kalender",
    invitation:"Undangan", app:"App Download"
  };
  const GROUPS = [
    {title:"BASIC",ids:["url","text","wifi"]},
    {title:"COMMUNICATION",ids:["wa","email","tel","sms","vcard"]},
    {title:"BUSINESS",ids:["review","social","menu","geo","pdf"]},
    {title:"MARKETING & EVENT",ids:["multilink","form","event","invitation","app"]}
  ];
  let settings = null;
  let storageStatus = "loading";
  const $ = id => document.getElementById(id);
  const defaultTypes = () => Object.fromEntries(Object.keys(TYPE_LABELS).map(id=>[id,true]));
  function toast(title, message) {
    if (typeof window.showToast === "function") window.showToast(title,message);
    else alert(title + "\n" + message);
  }
  function adminStatus(message, kind) {
    const el=$("globalAdminStatus"); if(!el)return;
    el.textContent=message;
    el.className="rounded-xl border px-3 py-2 text-sm "+(kind==="ok"?"border-emerald-300 bg-emerald-50 text-emerald-800":kind==="warn"?"border-amber-300 bg-amber-50 text-amber-900":"border-red-300 bg-red-50 text-red-800");
  }
  function renderFeatureControls() {
    const host=$("globalQrFeatureControls"); if(!host||!settings)return;
    host.replaceChildren();
    for(const group of GROUPS){
      const section=document.createElement("div");
      section.className="rounded-xl border border-outline-variant p-3";
      const heading=document.createElement("h4");heading.className="font-semibold text-sm mb-2";heading.textContent=group.title;section.append(heading);
      const grid=document.createElement("div");grid.className="grid grid-cols-1 sm:grid-cols-2 gap-2";
      for(const id of group.ids){
        const label=document.createElement("label");label.className="flex items-center justify-between gap-3 rounded-lg bg-surface-container-low p-3";
        const text=document.createElement("span");text.className="text-sm";text.textContent=TYPE_LABELS[id];
        const input=document.createElement("input");input.type="checkbox";input.className="w-5 h-5 accent-secondary";input.dataset.qrFeature=id;input.checked=settings.enabledTypes[id]!==false;
        label.append(text,input);grid.append(label);
      }
      section.append(grid);host.append(section);
    }
  }
  function readForm() {
    const ad={
      adMode: typeof appState!=="undefined" ? appState.config.adMode : "sponsor",
      autoAds:$("adminAutoAdsToggle")?.checked===true,
      pubId:$("adminPubId")?.value.trim()||"",
      slotId:$("adminSlotId")?.value.trim()||"",
      sponsorName:$("adminSponsorName")?.value.trim()||"",
      sponsorLink:$("adminSponsorLink")?.value.trim()||"",
      sponsorTagline:$("adminSponsorTagline")?.value.trim()||""
    };
    const enabledTypes={};
    document.querySelectorAll("[data-qr-feature]").forEach(el=>{enabledTypes[el.dataset.qrFeature]=el.checked});
    return {schemaVersion:1,ad,enabledTypes};
  }
  function applySettings(data) {
    settings=data;
    storageStatus="ready";
    if(typeof appState!=="undefined"){
      appState.config={...appState.config,...data.ad};
      appState.enabledTypes={...data.enabledTypes};
    }
    if(typeof renderPublicAds==="function")renderPublicAds();
    renderFeatureControls();
    applyPublicFeatureFlags();
  }
  async function loadGlobalSettings() {
    try{
      const response=await fetch("/api/admin/settings",{credentials:"same-origin",cache:"no-store"});
      const result=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(result.error||"Penyimpanan global belum tersedia.");
      applySettings(result.settings);
      storageStatus=result.storage||"ready";
      if(storageStatus==="ready")adminStatus(result.configured?"Pengaturan global berhasil dimuat.":"Penyimpanan aktif; konfigurasi masih menggunakan nilai awal.", "ok");
    }catch(error){
      storageStatus="unavailable";
      if(typeof appState!=="undefined"&&typeof DEFAULT_CONFIG!=="undefined")appState.config={...DEFAULT_CONFIG};
      settings={schemaVersion:1,ad:{...appState.config},enabledTypes:defaultTypes()};
      renderFeatureControls();
      adminStatus(error.message+" Pengaturan belum dapat disinkronkan antarperangkat.","warn");
    }
  }
  async function saveGlobalSettings() {
    if(storageStatus!=="ready"){adminStatus("Tidak dapat menyimpan: backend global belum siap. Tidak ada perubahan yang diterapkan.","warn");return}
    const payload=readForm();
    if(!Object.values(payload.enabledTypes).some(Boolean)){toast("Tidak dapat menyimpan","Minimal satu jenis QR harus tetap aktif.");return}
    const button=document.querySelector('#view-admin button[onclick="saveAdminSettings()"]');
    if(button){button.disabled=true;button.dataset.originalText=button.innerText;button.innerText="Menyimpan ke server…"}
    try{
      const response=await fetch("/api/admin/settings",{method:"PUT",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||result.saved!==true)throw new Error(result.error||"Server menolak penyimpanan.");
      applySettings(result.settings);
      adminStatus("Tersimpan di backend global. Pengaturan berlaku untuk perangkat yang memuat ulang halaman.","ok");
      toast("Pengaturan global tersimpan","Konfigurasi tersimpan di server dan dapat dimuat oleh perangkat lain. Iklan AdSense tetap nonaktif sampai akun dan integrasi disiapkan.");
    }catch(error){
      adminStatus(error.message+" Perubahan belum diterapkan.","warn");
      toast("Penyimpanan gagal",error.message);
    }finally{
      if(button){button.disabled=false;button.innerText=button.dataset.originalText||"Simpan Pengaturan Global"}
    }
  }
  function injectAdminControls() {
    const view=$("view-admin");if(!view||$("globalQrFeatureControls"))return;
    const saveButton=view.querySelector('button[onclick="saveAdminSettings()"]');
    if(!saveButton)return;
    const section=document.createElement("section");
    section.className="rounded-2xl border border-outline-variant bg-surface p-4 sm:p-5 flex flex-col gap-3";
    section.innerHTML='<div><h2 class="font-headline-sm text-headline-sm">Kontrol Fitur QR Global</h2><p class="text-sm text-on-surface-variant mt-1">Aktif/nonaktifkan jenis QR untuk seluruh pengunjung. Perubahan disimpan ke backend, bukan hanya browser ini.</p></div><div id="globalQrFeatureControls" class="grid grid-cols-1 lg:grid-cols-2 gap-3"></div><div id="globalAdminStatus" role="status" aria-live="polite" class="rounded-xl border px-3 py-2 text-sm">Memeriksa penyimpanan global…</div>';
    saveButton.insertAdjacentElement("beforebegin",section);
    saveButton.querySelector("span:last-child")?.replaceChildren(document.createTextNode("Simpan Pengaturan Global"));
  }
  function applyPublicFeatureFlags() {
    const select=$("qrnodeSelect");
    if(!select||!settings)return;
    const enabled=Object.keys(TYPE_LABELS).filter(id=>settings.enabledTypes[id]!==false);
    for(const option of select.options){option.hidden=settings.enabledTypes[option.value]===false;option.disabled=settings.enabledTypes[option.value]===false;}
    if(!enabled.length)return;
    if(settings.enabledTypes[select.value]===false){
      select.value=enabled[0];
      select.dispatchEvent(new Event("change",{bubbles:true}));
    }
    select.disabled=enabled.length===1;
  }
  function observePublicControls() {
    applyPublicFeatureFlags();
    const target=$("qrnodeCategory");
    if(target&&window.MutationObserver){
      new MutationObserver(()=>applyPublicFeatureFlags()).observe(target,{childList:true,subtree:true});
    }
  }
  document.addEventListener("DOMContentLoaded",async()=>{
    injectAdminControls();
    await loadGlobalSettings();
    renderFeatureControls();
    observePublicControls();
    if(typeof appState!=="undefined"&&appState.activeRoute==="admin")loadAdminInputs?.();
  });
  window.saveAdminSettings=saveGlobalSettings;
  window.qrStudioReloadGlobalSettings=loadGlobalSettings;
})();