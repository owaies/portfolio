'use client'

import { useEffect, useRef } from 'react'

const VIDEO_SRC = '/herovideo.mp4'
const PORTRAIT_SRC = '/herome.png'

const FORGE_STYLE = `
body[data-ui-experience="obsidian-forge"] .forge-cinematic-hero{position:absolute;inset:0;z-index:4;overflow:hidden;pointer-events:none;background:#050607}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-video{position:absolute;inset:0;z-index:0;width:100%;height:100%;display:block;visibility:visible;object-fit:cover;object-position:center center;opacity:1;filter:saturate(.88) contrast(1.04) brightness(.96)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-grade{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(90deg,rgba(3,4,5,.24),rgba(3,4,5,.07) 44%,rgba(3,4,5,.03) 72%,rgba(3,4,5,.16)),linear-gradient(180deg,rgba(2,3,4,.12),transparent 48%,rgba(2,3,4,.38) 100%)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-atmosphere{position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse at 78% 20%,rgba(255,167,94,.12),transparent 25%),radial-gradient(ellipse at 52% 72%,rgba(255,205,155,.045),transparent 34%);mix-blend-mode:screen}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait{position:absolute;z-index:2;left:61%;bottom:-2%;width:min(47vw,650px);height:min(88vh,800px);transform:translateX(-43%);object-fit:contain;object-position:center bottom;display:block;filter:contrast(1.08) brightness(.9) saturate(.88);opacity:.98;-webkit-mask-image:radial-gradient(ellipse 63% 58% at 50% 40%,#000 0 68%,rgba(0,0,0,.92) 78%,transparent 100%),linear-gradient(to bottom,#000 0 69%,rgba(0,0,0,.82) 82%,transparent 100%);mask-image:radial-gradient(ellipse 63% 58% at 50% 40%,#000 0 68%,rgba(0,0,0,.92) 78%,transparent 100%),linear-gradient(to bottom,#000 0 69%,rgba(0,0,0,.82) 82%,transparent 100%)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-rim{position:absolute;z-index:2;left:61%;bottom:0;width:min(47vw,650px);height:min(88vh,800px);transform:translateX(-43%);background:linear-gradient(90deg,transparent 0 64%,rgba(255,151,76,.16) 75%,transparent 87%);mix-blend-mode:screen;opacity:.65;-webkit-mask-image:linear-gradient(to bottom,transparent 0 15%,#000 30% 77%,transparent 94%);mask-image:linear-gradient(to bottom,transparent 0 15%,#000 30% 77%,transparent 94%)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-copy-veil{position:absolute;z-index:1;left:0;top:12%;bottom:8%;width:min(58%,760px);pointer-events:none;background:linear-gradient(90deg,rgba(3,4,5,.22),rgba(3,4,5,.06) 68%,transparent)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-grain{position:absolute;inset:0;z-index:1;opacity:.025;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");mix-blend-mode:soft-light}
body[data-ui-experience="obsidian-forge"] .target-hero{background:#050607!important}
body[data-ui-experience="obsidian-forge"] .target-hero::before{z-index:1!important;opacity:.10!important}
body[data-ui-experience="obsidian-forge"] .target-hero::after{z-index:1!important;opacity:.75!important}
body[data-ui-experience="obsidian-forge"] .target-hero-inner{z-index:5!important}
body[data-ui-experience="obsidian-forge"] .target-portrait-wrap{display:none!important}
body[data-ui-experience="obsidian-forge"] .target-hero h1{width:min(100%,560px)!important;max-width:100%!important;font-size:0!important;line-height:.84!important;letter-spacing:-.055em!important}
body[data-ui-experience="obsidian-forge"] .target-hero h1::before{content:"BUILD\\A INTELLIGENT\\A SOLUTIONS."!important;white-space:pre!important;display:block!important;color:#faf8f2!important;font-family:Impact,Oswald,"Arial Narrow",sans-serif!important;font-size:clamp(4rem,7.4vw,8rem)!important;font-weight:700!important;line-height:.84!important;letter-spacing:-.055em!important;text-shadow:0 3px 30px rgba(0,0,0,.5)!important}
body[data-ui-experience="obsidian-forge"] .target-hero h1 > *{display:none!important}
body[data-ui-experience="obsidian-forge"] .target-hero-copy{width:min(560px,48vw)!important}
body[data-ui-experience="obsidian-forge"] .target-hero-description{max-width:350px!important}
@media(max-width:760px){
body[data-ui-experience="obsidian-forge"] .forge-cinematic-video{object-position:60% center;opacity:1;filter:saturate(.86) contrast(1.04) brightness(.92)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait{left:72%;bottom:-1%;width:min(64vw,390px);height:min(61dvh,560px);transform:translateX(-48%);filter:contrast(1.08) brightness(.9) saturate(.88)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-rim{left:72%;width:min(64vw,390px);height:min(61dvh,560px);transform:translateX(-48%)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-copy-veil{top:12%;bottom:8%;width:76%;background:linear-gradient(90deg,rgba(3,4,5,.26),rgba(3,4,5,.05) 72%,transparent)}
body[data-ui-experience="obsidian-forge"] .target-hero{min-height:100dvh!important;height:100dvh!important;overflow:hidden!important;background:#050607!important}
body[data-ui-experience="obsidian-forge"] .target-hero::before{opacity:.07!important}
body[data-ui-experience="obsidian-forge"] .target-hero::after{right:16px!important;top:31%!important;font-size:7px!important;line-height:1.7!important;opacity:.3!important}
body[data-ui-experience="obsidian-forge"] .target-hero-inner{width:calc(100% - 36px)!important;padding-top:clamp(104px,14vh,132px)!important}
body[data-ui-experience="obsidian-forge"] .target-hero-copy{width:min(78vw,420px)!important;max-width:78vw!important}
body[data-ui-experience="obsidian-forge"] .target-eyebrow{margin-bottom:13px!important;font-size:8px!important;letter-spacing:.28em!important;white-space:nowrap!important}
body[data-ui-experience="obsidian-forge"] .target-hero h1{width:calc(100vw - 44px)!important;max-width:calc(100vw - 44px)!important}
body[data-ui-experience="obsidian-forge"] .target-hero h1::before{font-size:clamp(2.48rem,9.8vw,4.1rem)!important;line-height:.86!important;letter-spacing:-.05em!important}
body[data-ui-experience="obsidian-forge"] .target-hero .target-hero-description{width:58vw!important;max-width:245px!important;margin-top:18px!important;font-size:10px!important;line-height:1.48!important}
body[data-ui-experience="obsidian-forge"] .target-actions{gap:8px!important;margin-top:15px!important;max-width:72vw!important}
body[data-ui-experience="obsidian-forge"] .target-actions a{min-height:38px!important;padding:0 11px!important;font-size:7px!important;letter-spacing:.09em!important}
body[data-ui-experience="obsidian-forge"] .target-stats{left:0!important;bottom:22px!important;width:min(72vw,320px)!important}
body[data-ui-experience="obsidian-forge"] .target-stats>div{min-width:0!important;width:33.333%!important;padding:0 8px!important}
body[data-ui-experience="obsidian-forge"] .target-stats b{font-size:16px!important}
body[data-ui-experience="obsidian-forge"] .target-stats span{font-size:6px!important;letter-spacing:.08em!important}
body[data-ui-experience="obsidian-forge"] .target-hero-quote,.target-scroll{display:none!important}
}
@media(max-width:390px){body[data-ui-experience="obsidian-forge"] .target-hero h1::before{font-size:clamp(2.36rem,9.5vw,3.8rem)!important}body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait{left:74%;width:64vw}}
`

export default function ObsidianForgeCinematicHero(){
  const videoRef=useRef<HTMLVideoElement>(null)

  useEffect(()=>{
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
