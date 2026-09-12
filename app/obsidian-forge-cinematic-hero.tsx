'use client'

import { useEffect, useRef } from 'react'

const VIDEO_SRC = '/herovideo.mp4'

const FORGE_STYLE = `
body[data-ui-experience="obsidian-forge"] .forge-cinematic-hero {
  position:absolute; inset:0; z-index:3; overflow:hidden; pointer-events:none;
  background:#050607;
}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-video {
  position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
  object-position:center center; opacity:.94;
  filter:saturate(.72) contrast(1.08) brightness(.72);
}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-grade {
  position:absolute; inset:0; z-index:1;
  background:
    linear-gradient(90deg,rgba(3,4,5,.72),rgba(3,4,5,.34) 36%,rgba(3,4,5,.08) 66%,rgba(3,4,5,.3)),
    linear-gradient(180deg,rgba(2,3,4,.34),transparent 38%,rgba(2,3,4,.82));
}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-atmosphere {
  position:absolute; inset:0; z-index:2;
  background:
    radial-gradient(ellipse at 78% 20%,rgba(255,167,94,.12),transparent 25%),
    radial-gradient(ellipse at 52% 72%,rgba(255,205,155,.055),transparent 32%);
  mix-blend-mode:screen;
}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait {
  position:absolute; z-index:5; left:61%; bottom:-2%;
  width:min(47vw,650px); height:min(88vh,800px);
  transform:translateX(-43%); object-fit:contain; object-position:center bottom;
  filter:contrast(1.1) brightness(.84) saturate(.84);
  mix-blend-mode:multiply;
  opacity:.96;
  -webkit-mask-image:
    radial-gradient(ellipse 63% 58% at 50% 40%,#000 0 68%,rgba(0,0,0,.92) 78%,transparent 100%),
    linear-gradient(to bottom,#000 0 69%,rgba(0,0,0,.82) 82%,transparent 100%);
  mask-image:
    radial-gradient(ellipse 63% 58% at 50% 40%,#000 0 68%,rgba(0,0,0,.92) 78%,transparent 100%),
    linear-gradient(to bottom,#000 0 69%,rgba(0,0,0,.82) 82%,transparent 100%);
}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-rim {
  position:absolute; z-index:6; left:61%; bottom:0;
  width:min(47vw,650px); height:min(88vh,800px);
  transform:translateX(-43%); pointer-events:none;
  background:linear-gradient(90deg,transparent 0 64%,rgba(255,151,76,.16) 75%,transparent 87%);
  mix-blend-mode:screen; opacity:.7;
  -webkit-mask-image:linear-gradient(to bottom,transparent 0 15%,#000 30% 77%,transparent 94%);
  mask-image:linear-gradient(to bottom,transparent 0 15%,#000 30% 77%,transparent 94%);
}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-copy-veil {
  position:absolute; z-index:8; left:0; top:12%; bottom:8%; width:min(58%,760px);
  background:linear-gradient(90deg,rgba(3,4,5,.52),rgba(3,4,5,.18) 68%,transparent);
  pointer-events:none;
}
body[data-ui-experience="obsidian-forge"] .target-hero { background:#050607!important; }
body[data-ui-experience="obsidian-forge"] .target-hero::before { z-index:10!important; opacity:.22; }
body[data-ui-experience="obsidian-forge"] .target-hero::after { z-index:11!important; }
body[data-ui-experience="obsidian-forge"] .target-hero-inner { z-index:12!important; }
body[data-ui-experience="obsidian-forge"] .target-portrait-wrap { display:none!important; }
body[data-ui-experience="obsidian-forge"] .target-hero h1 {
  width:auto!important; max-width:8.8ch!important;
  font-size:clamp(4.25rem,8vw,8.9rem)!important;
  line-height:.82!important;
}
body[data-ui-experience="obsidian-forge"] .target-hero h1::before {
  content:"BUILD\\A INTELLIGENT\\A SOLUTIONS.\\A MOHAMMED"!important;
}
body[data-ui-experience="obsidian-forge"] .target-hero-copy { width:min(560px,48vw)!important; }
body[data-ui-experience="obsidian-forge"] .target-hero-description { max-width:350px!important; }
body[data-ui-experience="obsidian-forge"] .forge-cinematic-grain {
  position:absolute; inset:0; z-index:7; opacity:.035; pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
  mix-blend-mode:soft-light;
}
@media (max-width:760px) {
  body[data-ui-experience="obsidian-forge"] .forge-cinematic-video {
    object-position:60% center; opacity:.92; filter:saturate(.7) contrast(1.08) brightness(.68);
  }
  body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait {
    left:67%; bottom:-1%; width:min(76vw,440px); height:min(67dvh,620px);
    transform:translateX(-45%); filter:contrast(1.08) brightness(.86) saturate(.84);
  }
  body[data-ui-experience="obsidian-forge"] .forge-cinematic-rim {
    left:67%; width:min(76vw,440px); height:min(67dvh,620px); transform:translateX(-45%);
  }
  body[data-ui-experience="obsidian-forge"] .forge-cinematic-copy-veil {
    top:14%; bottom:8%; width:82%;
    background:linear-gradient(90deg,rgba(3,4,5,.64),rgba(3,4,5,.25) 65%,transparent);
  }
  body[data-ui-experience="obsidian-forge"] .target-hero {
    min-height:100dvh!important; height:100dvh!important; overflow:hidden!important;
  }
  body[data-ui-experience="obsidian-forge"] .target-hero-inner {
    width:calc(100% - 40px)!important; padding-top:clamp(105px,15vh,145px)!important;
  }
  body[data-ui-experience="obsidian-forge"] .target-hero-copy {
    width:min(74vw,420px)!important; max-width:74vw!important;
  }
  body[data-ui-experience="obsidian-forge"] .target-eyebrow {
    margin-bottom:14px!important; font-size:8px!important; letter-spacing:.3em!important;
  }
  body[data-ui-experience="obsidian-forge"] .target-hero h1 {
    width:auto!important; max-width:9.1ch!important;
    font-size:clamp(3.25rem,13.1vw,5.35rem)!important;
    line-height:.84!important; letter-spacing:-.055em!important;
  }
  body[data-ui-experience="obsidian-forge"] .target-hero h1::before {
    content:"BUILD\\A INTELLIGENT\\A SOLUTIONS.\\A MOHAMMED"!important;
  }
  body[data-ui-experience="obsidian-forge"] .target-hero .target-hero-description {
    width:min(58vw,250px)!important; margin-top:20px!important; font-size:10px!important; line-height:1.5!important;
  }
  body[data-ui-experience="obsidian-forge"] .target-actions {
    gap:8px!important; margin-top:16px!important; max-width:66vw!important;
  }
  body[data-ui-experience="obsidian-forge"] .target-actions a {
    min-height:38px!important; padding:0 12px!important; font-size:7px!important; letter-spacing:.1em!important;
  }
  body[data-ui-experience="obsidian-forge"] .target-stats {
    left:0!important; bottom:24px!important; width:min(72vw,320px)!important;
  }
  body[data-ui-experience="obsidian-forge"] .target-stats > div {
    min-width:0!important; width:33.333%!important; padding:0 9px!important;
  }
  body[data-ui-experience="obsidian-forge"] .target-stats b { font-size:16px!important; }
  body[data-ui-experience="obsidian-forge"] .target-stats span { font-size:6px!important; letter-spacing:.1em!important; }
  body[data-ui-experience="obsidian-forge"] .target-hero-quote { display:none!important; }
  body[data-ui-experience="obsidian-forge"] .target-scroll { display:none!important; }
}
@media (max-width:390px) {
  body[data-ui-experience="obsidian-forge"] .target-hero-copy { width:72vw!important; max-width:72vw!important; }
  body[data-ui-experience="obsidian-forge"] .target-hero h1 { font-size:clamp(2.95rem,12.5vw,4.7rem)!important; }
  body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait { left:70%; width:73vw; }
}
`

type Props={portraitSrc:string}

export default function ObsidianForgeCinematicHero({portraitSrc}:Props){
  const videoRef=useRef<HTMLVideoElement>(null)

  useEffect(()=>{
    const video=videoRef.current
    if(!video)return
    const play=()=>void video.play().catch(()=>{})
    play()
    const onVisibility=()=>{if(document.visibilityState==='visible')play()}
    document.addEventListener('visibilitychange',onVisibility)
    return()=>document.removeEventListener('visibilitychange',onVisibility)
  },[])

  return <>
    <style dangerouslySetInnerHTML={{__html:FORGE_STYLE}}/>
    <div className="forge-cinematic-hero" aria-hidden="true">
      <video ref={videoRef} className="forge-cinematic-video" autoPlay muted loop playsInline preload="metadata" poster="/obsidian-forge-environment.svg">
        <source src={VIDEO_SRC} type="video/mp4"/>
      </video>
      <div className="forge-cinematic-grade"/>
      <div className="forge-cinematic-atmosphere"/>
      <img className="forge-cinematic-portrait" src={portraitSrc} alt="" draggable={false}/>
      <div className="forge-cinematic-rim"/>
      <div className="forge-cinematic-copy-veil"/>
      <div className="forge-cinematic-grain"/>
    </div>
  </>
}
