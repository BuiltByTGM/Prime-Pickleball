(function venueTourEnhancer() {
  const base = "/Prime-Pickleball/";
  const src = base + "venue-tour.mp4";
  const poster = base + "gallery/prime-8161.webp";
  const icon = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m8 4 12 8-12 8V4Z"/></svg>';
  const style = document.createElement("style");
  style.textContent = `
    .tour-hero-btn{display:inline-flex;align-items:center;justify-content:center;gap:.6rem;margin-top:1rem;padding:.75rem 1.15rem;min-height:46px;border:1px solid #03182c;border-radius:100px;background:#03182c;color:white;position:relative;z-index:8;font-size:.93rem;line-height:1.2;font-weight:700;letter-spacing:.02em;cursor:pointer;transition:background .2s,transform .2s}
    .tour-hero-btn:hover{background:#2869ac;border-color:#2869ac;transform:translateY(-2px)}
    .tour-hero-btn:focus-visible,.tour-play:focus-visible{outline:3px solid #8abdf2;outline-offset:3px}
    .tour-venue{scroll-margin-top:0;padding:clamp(3.5rem,7vw,6.5rem) var(--page-inset,5%);background:#03182c;color:#fff}
    .tour-venue-inner{max-width:1200px;margin:0 auto}
    .tour-venue-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(230px,.7fr);gap:1rem 3rem;align-items:end;margin-bottom:2rem}
    .tour-venue .eyebrow{color:#9bc9fa;margin-bottom:.6rem}
    .tour-venue h2{font-size:clamp(2.5rem,6vw,5.5rem);line-height:1.05;margin:0;color:#fff;letter-spacing:-.02em}
    .tour-venue h2 em{color:#8abdf2;font-style:normal}
    .tour-venue-head p{color:#d5e4f3;max-width:38ch;font-size:1.075rem;line-height:1.7;margin:0}
    .tour-media{position:relative;aspect-ratio:16/9;overflow:hidden;border-radius:clamp(10px,2vw,20px);background:#000;box-shadow:0 20px 60px #0005}
    .tour-media video{width:100%;height:100%;display:block;object-fit:contain}
    .tour-play{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.1rem;width:100%;border:0;background:linear-gradient(0deg,#00101caa,#00101c12 55%,#00101c50);color:white;text-align:center;cursor:pointer;font-size:clamp(1rem,1.8vw,1.3rem);font-weight:700;text-shadow:0 2px 16px #000a}
    .tour-play[hidden]{display:none}
    .tour-play-icon{display:grid;place-items:center;width:clamp(68px,9vw,96px);height:clamp(68px,9vw,96px);border:2px solid white;border-radius:50%;background:#5598df;color:#03182c;box-shadow:0 0 0 9px #ffffff30;transition:transform .2s}
    .tour-play-icon svg{width:34px;height:34px;margin-left:5px}
    .tour-play:hover .tour-play-icon{transform:scale(1.08)}
    .tour-venue-note{color:#bed2e7;font-size:.9rem;margin:1rem 0 0}
    @media(max-width:700px){.tour-venue-head{grid-template-columns:1fr;gap:1rem}.tour-venue-head p{max-width:60ch}.tour-venue h2{font-size:clamp(2.25rem,10vw,3.8rem)}.tour-hero-btn{font-size:.85rem}.tour-play{gap:.7rem}.tour-play-icon{box-shadow:0 0 0 5px #ffffff30}}
    @media(prefers-reduced-motion:reduce){.tour-hero-btn,.tour-play-icon{transition:none}.tour-hero-btn:hover{transform:none}}
  `;
  function mount() {
    const hero = document.querySelector("#play .hero-top");
    const club = document.querySelector("#main > section.club-intro");
    if (!hero || !club) return false;
    if (document.getElementById("venue")) return true;
    const section = document.createElement("section");
    section.id = "venue";
    section.className = "tour-venue";
    section.setAttribute("aria-labelledby", "tour-title");
    section.innerHTML = `<div class="tour-venue-inner">
      <div class="tour-venue-head"><div><span class="eyebrow">EXPLORE THE VENUE</span><h2 id="tour-title">STEP INSIDE <em>PRIME.</em></h2></div><p>See the courts, the atmosphere, and the people that make Prime Pickleball a place to play and connect.</p></div>
      <div class="tour-media"><video playsinline preload="none" poster="${poster}" aria-label="Prime Pickleball venue tour"><source src="${src}" type="video/mp4">Your browser does not support HTML5 video.</video><button type="button" class="tour-play" aria-label="Play venue tour"><span class="tour-play-icon">${icon}</span><span>WATCH THE 46-SECOND VENUE TOUR</span></button></div>
      <p class="tour-venue-note">Take a look inside Prime Pickleball. Use the player controls to pause, replay or adjust sound.</p></div>`;
    club.before(section);
    const heroButton = document.createElement("button");
    heroButton.type = "button";
    heroButton.className = "tour-hero-btn";
    heroButton.innerHTML = icon + "<span>WATCH VENUE TOUR</span>";
    hero.append(heroButton);
    const video = section.querySelector("video");
    const playButton = section.querySelector(".tour-play");
    playButton.addEventListener("click", () => {
      playButton.hidden = true;
      video.controls = true;
      video.preload = "metadata";
      video.play().catch(() => {});
    });
    // The hero CTA uses the same inline player within Step Inside Prime.
    // Start video immediately within the user's tap/click gesture for mobile.
    heroButton.addEventListener("click", event => {
      event.preventDefault();
      video.controls = true;
      video.preload = "auto";
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      playButton.hidden = true;
      const playback = video.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(() => { playButton.hidden = false; });
      }
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return true;
  }
  async function init() {
    // Deploy safely: do not expose the video feature before the MP4 exists.
    try {
      const response = await fetch(src, {method:"HEAD", cache:"no-store"});
      if (!response.ok || /text\/html/i.test(response.headers.get("content-type") || "")) return;
    } catch (_) { return; }
    document.head.append(style);
    if (mount()) return;
    const root = document.getElementById("root");
    if (!root) return;
    const observer = new MutationObserver(() => { if (mount()) observer.disconnect(); });
    observer.observe(root, {childList:true, subtree:true});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
