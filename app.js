const categories = [
["Username","Find publicly published references to a handle across sites and communities.","Public profile pages","Search-engine queries","Username reuse checks","Compare dates and context before linking accounts."],
["Email Address","Organize checks for an email address you own or are authorized to assess.","Domain and MX records","Publicly documented contact pages","Breach-notification services for the account owner","Never expose mailbox contents or use leaked credential dumps."],
["Domain Name","Review public technical and registration information for a domain.","DNS records","Certificate transparency","RDAP / registration data","Public website metadata"],
["Cloud Infrastructure","Map public-facing cloud assets belonging to an authorized organization.","Published cloud asset inventories","Public DNS and certificate records","Provider documentation","Do not probe systems without permission."],
["IP & MAC Address","Understand network identifiers and public routing context.","RDAP / WHOIS","ASN and routing registries","Vendor OUI references for MAC prefixes","A public IP address does not identify a person."],
["Images / Videos / Docs","Verify media context and preserve publicly available evidence.","Reverse-image search services","Metadata from files you are authorized to inspect","Archive links and capture timestamps","Avoid publishing private or identifying media."],
["Social Networks","Review public posts and profiles within platform rules.","Public profile pages","Official platform search tools","Public post timestamps","Do not bypass privacy settings or scrape restricted content."],
["Instant Messaging","Document publicly visible messaging-platform information.","Public invite pages","Official platform documentation","User-provided exports","No private message access or account intrusion."],
["People Search Engines","Evaluate public directory listings with care.","Official public directories","Source provenance and correction requests","Jurisdiction-specific public registers","Avoid compiling sensitive personal details."],
["Dating","Assess publicly shared safety or authenticity signals.","Publicly visible profile claims","Reverse-image checks where lawful","Platform reporting and safety tools","Do not deanonymize or target private individuals."],
["Telephone Numbers","Classify number formats and publicly listed business contacts.","Country and numbering plans","Business contact pages","Carrier or line-type data from permitted providers","Do not use for harassment or tracking."],
["Public Records","Locate official records that are legally open to the public.","Government registries","Court and company registers","Licensing databases","Respect local access and reuse rules."],
["Compliance & Risk Intelligence","Organize public regulatory and sanctions information for due diligence.","Official sanctions lists","Regulator notices","Company disclosures","Verify identity matches before drawing conclusions."],
["Business Records","Research organizations and their public filings.","Company registries","Official websites","Annual reports and public filings","Distinguish similarly named entities."],
["Transportation","Review public transport and vehicle-related datasets.","Open transit feeds","Public transport notices","Official aviation and maritime registries","Do not use to track a private person's movements."],
["Geolocation Tools / Maps","Interpret geographic references already present in public evidence.","OpenStreetMap","Public map layers","Geotagged media you are authorized to review","Do not infer a private person's live location."],
["Search Engines","Build repeatable searches for public web content.","Search operators","News and web indexes","Cached or archived public pages","Respect robots rules and site terms."],
["Online Communities","Review public discussions and community documentation.","Public forums","Community search tools","Published moderation policies","Do not evade membership restrictions."],
["Archives","Find historical versions of public pages.","Internet Archive","Public web archives","Archived organizational documents","Archived material may be outdated or inaccurate."],
["Language Translation","Understand public material in other languages.","Translation tools","Original-language source capture","Human review for important claims","Keep the original text with the translation."],
["Mobile OSINT","Review public mobile-app and device ecosystem information.","Official app listings","Public app documentation","Mobile security advisories","No device exploitation or unauthorized access."],
["Dark Web","Understand threat reporting without accessing illegal material.","Reputable threat-intelligence reports","Law-enforcement and academic publications","Vendor research","No marketplace access, purchases, or stolen-data retrieval."],
["Disinformation & Media Verification","Check the origin, context, and integrity of public claims and media.","Fact-checking organizations","Reverse-image search","Original publication context","Record uncertainty and contradictory evidence."],
["Blockchain & Cryptocurrency","Inspect public ledger data and published project information.","Public block explorers","Official project disclosures","Regulatory notices","Do not claim a wallet address proves a person's identity."],
["Classifieds","Review public marketplace listings for research or fraud prevention.","Public listing pages","Platform safety guidance","Archived public listing references","Do not contact, threaten, or expose private sellers."],
["Encoding / Decoding","Decode data formats encountered in authorized research.","URL and Base64 decoding","Hash identification","Text and file format references","Decoding is not decryption; do not process stolen secrets."],
["Tools","Discover utilities for organizing and validating public evidence.","WHOIS / RDAP clients","DNS utilities","Metadata viewers","Use tools only within their permitted scope."],
["AI Tools","Assist with summarization, clustering, and translation of collected public evidence.","Local text analysis","Entity extraction with human review","Source summarization","Verify every AI-generated claim against its source."],
["Malicious File Analysis","Safely triage suspicious files without executing them.","Hashes and reputation portals","Static metadata inspection","Sandbox reports from trusted providers","Never open unknown files on your everyday device."],
["Cyber Threat Intelligence","Review published indicators and defensive threat reports.","CISA advisories","CERT publications","Public vendor reports","Use indicators for defense, not retaliation."],
["OpSec","Protect the integrity and privacy of a lawful research workflow.","Separate research accounts","Secure storage","Access logs and retention controls","Do not impersonate people or evade lawful controls."],
["Documentation / Evidence Capture","Create clear, reproducible records of what was observed.","Source URLs","UTC timestamps","Screenshots and hashes","Record collection method and confidence."],
["Training","Build practical skills in verification, privacy, and responsible research.","OSINT exercises using synthetic data","Digital verification courses","Legal and ethical guidance","Practice on test data, not unsuspecting people."]
];
const colors=["#a78bfa","#f472b6","#60a5fa","#fb7185","#c084fc","#f9a8d4","#818cf8","#e879f9","#38bdf8","#fb7185","#c084fc","#a78bfa"];
const grid=document.getElementById("category-grid");
const modal=document.getElementById("info-modal");
let activeCategory=null;
const saved=new Set();
function renderCategories(filter=""){
 grid.innerHTML="";
 categories.forEach((item,i)=>{
  if(!item[0].toLowerCase().includes(filter.toLowerCase()))return;
  const card=document.createElement("button");card.className="category-card";card.style.setProperty("--accent",colors[i%colors.length]);
  card.innerHTML='<div class="cat-top"><b></b><span class="cat-dot"></span></div><small></small><span class="more">More info ↗</span>';
  card.querySelector("b").textContent=item[0];card.querySelector("small").textContent=item[1];
  card.addEventListener("click",()=>openCategory(i));grid.appendChild(card);
 });
 if(!grid.children.length){const p=document.createElement("p");p.className="section-copy";p.textContent="No categories match that filter.";grid.appendChild(p)}
}
function openCategory(i){
 activeCategory=i;const c=categories[i];document.getElementById("modal-title").textContent=c[0];document.getElementById("modal-description").textContent=c[1];document.getElementById("modal-icon").textContent=["◈","⌕","◎","⌁"][i%4];
 const ul=document.getElementById("modal-bullets");ul.innerHTML="";
 c.slice(2,6).forEach(t=>{const li=document.createElement("li");li.textContent=t;ul.appendChild(li)});
 const save=document.getElementById("modal-save");save.textContent=saved.has(i)?"★ Saved":"☆ Save category";save.classList.toggle("saved",saved.has(i));modal.hidden=false;
}
function closeModal(){modal.hidden=true}
document.getElementById("modal-close").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
document.getElementById("modal-save").addEventListener("click",()=>{if(activeCategory===null)return;if(saved.has(activeCategory))saved.delete(activeCategory);else saved.add(activeCategory);const b=document.getElementById("modal-save");b.textContent=saved.has(activeCategory)?"★ Saved":"☆ Save category";b.classList.toggle("saved",saved.has(activeCategory))});
document.getElementById("category-filter").addEventListener("input",e=>renderCategories(e.target.value));
const sourceList=document.getElementById("source-list");
categories.slice(0,18).forEach((c,i)=>{const row=document.createElement("div");row.className="source-row";row.innerHTML='<span class="source-mark">◎</span><div><b></b><small>Suggested research area · connector not configured</small></div>';row.querySelector("b").textContent=c[0];sourceList.appendChild(row)});
let selectedType="Username";
document.querySelectorAll(".type-tab").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".type-tab").forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");selectedType=btn.dataset.type;document.getElementById("target-label").textContent=selectedType.toUpperCase();document.getElementById("target-input").placeholder="Enter "+selectedType.toLowerCase()+"...";document.getElementById("form-error").textContent=""}));
const plans={
"Username":[["Public profile references","Search public pages where this handle is intentionally visible."],["Handle reuse review","Compare exact matches carefully; a shared handle is not proof of one identity."],["Evidence log","Record source URLs, dates, and confidence for each observation."]],
"Discord ID":[["User-provided context","Use only an ID belonging to you or an account you are authorized to assess."],["Official platform information","Use Discord's documented features and permitted public information only."],["Evidence log","Keep the source and reason for each observation. No private server or message access."]],
"Email address":[["Domain checks","Review public DNS and mail-domain configuration."],["Owner-controlled exposure check","Use a reputable breach-notification service for the account owner. Never submit a password."],["Evidence log","Store only necessary findings and redact personal information in reports."]],
"Domain":[["DNS and registration","Review public DNS, RDAP, and certificate records."],["Public web footprint","Review pages and documents published by the domain owner."],["Evidence log","Timestamp records and note the collection method."]],
"IP address":[["Network ownership","Review public RDAP, ASN, and routing information."],["Public exposure context","Use authorized asset inventories and reputable public references."],["Evidence log","An IP address may be shared, reassigned, or masked by a VPN."]]
};
function go(view){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active-page",p.id===view));document.querySelectorAll(".side-link").forEach(b=>b.classList.toggle("active",b.dataset.view===view));document.getElementById("crumb-current").textContent=view.toUpperCase();window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll(".side-link").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));
document.getElementById("start-investigation").addEventListener("click",()=>go("investigate"));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
document.getElementById("run-search").addEventListener("click",()=>{
 const value=document.getElementById("target-input").value.trim();const error=document.getElementById("form-error");error.textContent="";
 if(!value){error.textContent="Enter an identifier to prepare a research plan.";return}
 if(/password|passwd|token|secret/i.test(value)){error.textContent="Do not enter passwords, tokens, or secrets.";return}
 if(selectedType==="Email address"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){error.textContent="Enter a valid email address format.";return}
 if(selectedType==="Domain"&&!/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(value)){error.textContent="Enter a valid domain name.";return}
 if(selectedType==="IP address"&&!/^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/.test(value)){error.textContent="Enter a valid IPv4 address for this prototype.";return}
 document.getElementById("result-title").textContent=selectedType+" research plan";
 const list=document.getElementById("plan-list");list.innerHTML="";
 (plans[selectedType]||plans.Username).forEach((p,i)=>{const item=document.createElement("div");item.className="plan-item";const b=document.createElement("b");b.textContent=String(i+1).padStart(2,"0")+" / "+p[0];const para=document.createElement("p");para.textContent=p[1];item.append(b,para);list.appendChild(item)});
 document.getElementById("results-panel").hidden=false;document.getElementById("results-panel").scrollIntoView({behavior:"smooth",block:"start"});
});
renderCategories();