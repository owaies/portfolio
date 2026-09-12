'use client'

import { useLayoutEffect, useRef } from 'react'

const VIDEO_SRC = '/herovideo.mp4'
const PORTRAIT_SRC = '/herome.png'

const FORGE_STYLE = `
body[data-ui-experience="obsidian-forge"] .forge-cinematic-hero{position:absolute;inset:0;z-index:4;isolation:isolate;overflow:hidden;pointer-events:none;background:transparent!important}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-video{position:absolute;inset:0;z-index:0;width:100%;height:100%;display:block;visibility:visible;object-fit:cover;object-position:center center;opacity:1!important;filter:saturate(.9) contrast(1.03) brightness(.98);transform:translateZ(0)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-grade{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(90deg,rgba(3,4,5,.36) 0%,rgba(3,4,5,.16) 34%,rgba(3,4,5,.03) 67%,rgba(3,4,5,.13) 100%),linear-gradient(180deg,rgba(2,3,4,.12) 0%,transparent 48%,rgba(2,3,4,.58) 100%)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-atmosphere{position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse at 78% 20%,rgba(255,167,94,.1),transparent 25%),radial-gradient(ellipse at 58% 76%,rgba(255,205,155,.06),transparent 36%);mix-blend-mode:screen}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait{position:absolute;z-index:2;right:3%;bottom:-3%;width:min(48vw,680px);height:min(84vh,820px);object-fit:contain;object-position:center bottom;display:block;filter:contrast(1.06) brightness(.93) saturate(.92);opacity:.98;-webkit-mask-image:radial-gradient(ellipse 68% 64% at 52% 42%,#000 0 70%,rgba(0,0,0,.9) 82%,transparent 100%),linear-gradient(to bottom,#000 0 70%,rgba(0,0,0,.84) 83%,transparent 100%);mask-image:radial-gradient(ellipse 68% 64% at 52% 42%,#000 0 70%,rgba(0,0,0,.9) 82%,transparent 100%),linear-gradient(to bottom,#000 0 70%,rgba(0,0,0,.84) 83%,transparent 100%)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-rim{position:absolute;z-index:2;right:3%;bottom:0;width:min(48vw,680px);height:min(84vh,820px);background:radial-gradient(ellipse at 68% 58%,rgba(255,151,76,.13),transparent 32%),linear-gradient(90deg,transparent 60%,rgba(255,151,76,.12) 78%,transparent 92%);mix-blend-mode:screen;opacity:.6;-webkit-mask-image:linear-gradient(to bottom,transparent 0 12%,#000 28% 78%,transparent 95%);mask-image:linear-gradient(to bottom,transparent 0 12%,#000 28% 78%,transparent 95%)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-copy-veil{position:absolute;z-index:1;left:0;top:8%;bottom:10%;width:min(62%,820px);pointer-events:none;background:linear-gradient(90deg,rgba(3,4,5,.34),rgba(3,4,5,.12) 66%,transparent)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-grain{position:absolute;inset:0;z-index:1;opacity:.025;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");mix-blend-mode:soft-light}
body[data-ui-experience="obsidian-forge"] .target-hero{background:transparent!important}
body[data-ui-experience="obsidian-forge"] .target-hero::before{z-index:1!important;opacity:.08!important}
body[data-ui-experience="obsidian-forge"] .target-hero::after{z-index:1!important;opacity:.55!important}
body[data-ui-experience="obsidian-forge"] .target-grid{z-index:1!important;opacity:.07!important}
body[data-ui-experience="obsidian-forge"] .target-hero-inner{z-index:5!important}
body[data-ui-experience="obsidian-forge"] .target-portrait-wrap{display:none!important}
body[data-ui-experience="obsidian-forge"] .target-hero h1.forge-editorial-headline{width:min(100%,600px)!important;max-width:100%!important;margin:0!important;color:#faf8f2!important;font-family:Impact,Oswald,"Arial Narrow",sans-serif!important;font-size:clamp(56px,6.2vw,120px)!important;font-weight:700!important;line-height:.84!important;letter-spacing:-.055em!important;white-space:pre-line!important;text-shadow:0 3px 30px rgba(0,0,0,.5)!important;visibility:visible!important}
body[data-ui-experience="obsidian-forge"] .target-hero h1.forge-editorial-headline::before{content:none!important;display:none!important}
body[data-ui-experience="obsidian-forge"] .target-hero h1.forge-editorial-headline::after{content:none!important;display:none!important}
body[data-ui-experience="obsidian-forge"] .target-hero-copy{width:min(600px,50vw)!important;max-width:600px!important}
body[data-ui-experience="obsidian-forge"] .target-hero-description{max-width:350px!important}
body[data-ui-experience="obsidian-forge"] .target-actions{z-index:10!important}
body[data-ui-experience="obsidian-forge"] .target-hero-quote{z-index:5!important}
body[data-ui-experience="obsidian-forge"] .target-scroll{z-index:5!important}
@media(max-width:1100px) and (min-width:761px){body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait{right:0;width:46vw;height:76vh}body[data-ui-experience="obsidian-forge"] .forge-cinematic-rim{right:0;width:46vw;height:76vh}body[data-ui-experience="obsidian-forge"] .target-hero h1.forge-editorial-headline{font-size:clamp(54px,7vw,82px)!important}}
@media(max-width:760px){
body[data-ui-experience="obsidian-forge"] .target-hero{position:relative!important;height:100dvh!important;min-height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;background:transparent!important}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-video{object-position:60% center!important;object-fit:cover!important}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-grade{background:linear-gradient(90deg,rgba(3,4,5,.38),rgba(3,4,5,.14) 58%,rgba(3,4,5,.04) 100%),linear-gradient(180deg,rgba(2,3,4,.08),transparent 50%,rgba(2,3,4,.62) 100%)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait{right:-2vw!important;left:auto!important;bottom:0!important;width:clamp(180px,48vw,270px)!important;height:auto!important;max-height:65dvh!important;transform:none!important;object-fit:contain!important;object-position:center bottom!important;filter:contrast(1.05) brightness(.93) saturate(.92)!important;opacity:.98!important;-webkit-mask-image:linear-gradient(to bottom,#000 0 72%,rgba(0,0,0,.86) 86%,transparent 100%)!important;mask-image:linear-gradient(to bottom,#000 0 72%,rgba(0,0,0,.86) 86%,transparent 100%)!important}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-rim{right:-2vw!important;left:auto!important;bottom:0!important;width:clamp(180px,48vw,270px)!important;height:min(42dvh,400px)!important;transform:none!important}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-copy-veil{top:8%;bottom:20%;width:90%;background:linear-gradient(90deg,rgba(3,4,5,.42),rgba(3,4,5,.16) 70%,transparent)}
body[data-ui-experience="obsidian-forge"] .target-hero-inner{position:relative!important;width:100%!important;height:100%!important;min-height:0!important;padding:0!important;margin:0!important;display:block!important}
body[data-ui-experience="obsidian-forge"] .target-hero-copy{position:absolute!important;left:20px!important;top:34%!important;width:min(88vw,360px)!important;max-width:88vw!important;margin:0!important;padding:0!important;z-index:8!important}
body[data-ui-experience="obsidian-forge"] .target-eyebrow{margin:0 0 12px!important;font-size:8px!important;line-height:1.2!important;letter-spacing:.22em!important;white-space:nowrap!important}
body[data-ui-experience="obsidian-forge"] .target-hero h1.forge-editorial-headline{display:block!important;width:min(88vw,350px)!important;max-width:88vw!important;font-size:clamp(3rem,10.5vw,6rem)!important;line-height:.86!important;letter-spacing:-.045em!important;white-space:pre-line!important;overflow:visible!important}
body[data-ui-experience="obsidian-forge"] .target-hero .target-role{margin:13px 0 0!important;font-size:clamp(11px,3.2vw,15px)!important;line-height:1.2!important;white-space:nowrap!important}
body[data-ui-experience="obsidian-forge"] .target-hero .target-hero-description{width:min(66vw,250px)!important;max-width:250px!important;margin:14px 0 0!important;font-size:10px!important;line-height:1.45!important}
body[data-ui-experience="obsidian-forge"] .target-actions{display:flex!important;flex-wrap:wrap!important;gap:6px!important;width:fit-content!important;max-width:88vw!important;margin:13px 0 0!important;padding:0!important}
body[data-ui-experience="obsidian-forge"] .target-actions a{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:34px!important;height:34px!important;padding:0 10px!important;font-size:7px!important;line-height:1!important;letter-spacing:.08em!important;white-space:nowrap!important;background:rgba(6,7,8,.3)!important;backdrop-filter:blur(7px)!important;-webkit-backdrop-filter:blur(7px)!important}
body[data-ui-experience="obsidian-forge"] .target-actions svg{flex:0 0 auto!important}
body[data-ui-experience="obsidian-forge"] .target-hero-quote,body[data-ui-experience="obsidian-forge"] .target-scroll{display:none!important}
}
@media(max-width:390px){body[data-ui-experience="obsidian-forge"] .target-hero-copy{top:33%!important;left:20px!important}body[data-ui-experience="obsidian-forge"] .target-hero h1.forge-editorial-headline{font-size:clamp(3rem,10.5vw,3.9rem)!important;line-height:.86!important;letter-spacing:-.045em!important}body[data-ui-experience="obsidian-forge"] .target-hero .target-hero-description{width:min(64vw,235px)!important}}
@media(min-width:1400px){body[data-ui-experience="obsidian-forge"] .target-hero h1.forge-editorial-headline{font-size:clamp(90px,6.2vw,120px)!important}body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait{right:5%!important;width:min(44vw,700px)!important;height:min(84vh,820px)!important}}
`

function isForgeActive(){
  if(typeof window==='undefined')return false
  const preview=new URLSearchParams(window.location.search).get('ui-preview')
  return preview==='obsidian-forge' || document.body.dataset.uiExperience==='obsidian-forge'
}

export default function ObsidianForgeCinematicHero(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const originalH1Ref=useRef<string|null>(null)
  const originalStatsRef=useRef<string|null>(null)
  const originalH1ClassRef=useRef<string|null>(null)

  useLayoutEffect(()=>{
    const restore=()=>{
      if(isForgeActive())return
      const hero=document.querySelector('#home.target-hero') as HTMLElement|null
      if(!hero)return
      const h1=hero.querySelector('.target-hero-copy > h1') as HTMLHeadingElement|null
      if(h1&&h1.classList.contains('forge-editorial-headline')&&originalH1Ref.current!==null){
        h1.innerHTML=originalH1Ref.current
        h1.className=originalH1ClassRef.current||''
      }
      if(originalStatsRef.current!==null&&!hero.querySelector('.target-stats')){
        const actions=hero.querySelector('.target-actions')
        if(actions)actions.insertAdjacentHTML('afterend',originalStatsRef.current)
      }
    }
    const apply=()=>{
      if(!isForgeActive()){restore();return}
      const hero=document.querySelector('#home.target-hero') as HTMLElement|null
      if(!hero)return
      const h1=hero.querySelector('.target-hero-copy > h1') as HTMLHeadingElement|null
      if(h1&&!h1.classList.contains('forge-editorial-headline')){
        originalH1Ref.current=h1.innerHTML
        originalH1ClassRef.current=h1.className
        h1.classList.add('forge-editorial-headline')
        h1.textContent='BUILD\\nINTELLIGENT\\nSOLUTIONS.'
      }
      const stats=hero.querySelector('.target-stats') as HTMLElement|null
      if(stats){
        originalStatsRef.current=stats.outerHTML
        stats.remove()
      }
    }
    apply()
    const observer=new MutationObserver(()=>apply())
    observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['data-ui-experience']})
    return()=>observer.disconnect()
  },[])

  useLayoutEffect(()=>{
    const video=videoRef.current
    if(!video)return
    const report=(event:string)=>{
      if(process.env.NODE_ENV==='production')return
      console.info('[Forge Video]',event,{src:video.currentSrc||VIDEO_SRC,readyState:video.readyState,networkState:video.networkState,videoWidth:video.videoWidth,videoHeight:video.videoHeight,currentTime:video.currentTime,error:video.error?{code:video.error.code,message:video.error.message}:null})
    }
    const handlers=new Map<string,EventListener>()
    ;(['loadedmetadata','canplay','playing','waiting','stalled','error'] as const).forEach(event=>{const handler=()=>report(event);handlers.set(event,handler);video.addEventListener(event,handler)})
    const play=()=>{video.muted=true;void video.play().catch(()=>{})}
    play()
    const onVisibility=()=>{if(document.visibilityState==='visible')play()}
    document.addEventListener('visibilitychange',onVisibility)
    return()=>{handlers.forEach((handler,event)=>video.removeEventListener(event,handler));document.removeEventListener('visibilitychange',onVisibility)}
  },[])

  return <>
    <style dangerouslySetInnerHTML={{__html:FORGE_STYLE}}/>
    <div className="forge-cinematic-hero" aria-hidden="true">
      <video ref={videoRef} className="forge-cinematic-video" src={VIDEO_SRC} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
      <div className="forge-cinematic-grade"/>
      <div className="forge-cinematic-atmosphere"/>
      <img className="forge-cinematic-portrait" src={PORTRAIT_SRC} alt="" draggable={false}/>
      <div className="forge-cinematic-rim"/>
      <div className="forge-cinematic-copy-veil"/>
      <div className="forge-cinematic-grain"/>
    </div>
  </>
}
