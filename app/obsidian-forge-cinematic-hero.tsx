'use client'

import { useEffect, useRef } from 'react'

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
body[data-ui-experience="obsidian-forge"] .target-hero h1{width:min(100%,600px)!important;max-width:100%!important;font-size:0!important;line-height:.86!important;letter-spacing:-.055em!important}
body[data-ui-experience="obsidian-forge"] .target-hero h1::before{content:"BUILD\\A INTELLIGENT\\A SOLUTIONS."!important;white-space:pre!important;display:block!important;color:#faf8f2!important;font-family:Impact,Oswald,"Arial Narrow",sans-serif!important;font-size:clamp(56px,6.2vw,120px)!important;font-weight:700!important;line-height:.84!important;letter-spacing:-.055em!important;text-shadow:0 3px 30px rgba(0,0,0,.5)!important}
body[data-ui-experience="obsidian-forge"] .target-hero h1 > *{display:none!important}
body[data-ui-experience="obsidian-forge"] .target-hero-copy{width:min(600px,50vw)!important;max-width:600px!important}
body[data-ui-experience="obsidian-forge"] .target-hero-description{max-width:350px!important}
body[data-ui-experience="obsidian-forge"] .target-stats{z-index:11!important}
body[data-ui-experience="obsidian-forge"] .target-actions{z-index:10!important}
@media(max-width:1100px) and (min-width:761px){body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait{right:0;width:46vw;height:76vh}body[data-ui-experience="obsidian-forge"] .forge-cinematic-rim{right:0;width:46vw;height:76vh}body[data-ui-experience="obsidian-forge"] .target-hero h1::before{font-size:clamp(54px,7vw,82px)!important}}
@media(max-width:760px){
body[data-ui-experience="obsidian-forge"] .forge-cinematic-video{object-position:58% center;opacity:1!important;filter:saturate(.88) contrast(1.03) brightness(.94)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-grade{background:linear-gradient(90deg,rgba(3,4,5,.42) 0%,rgba(3,4,5,.2) 58%,rgba(3,4,5,.05) 100%),linear-gradient(180deg,rgba(2,3,4,.08),transparent 46%,rgba(2,3,4,.68) 100%)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait{right:-3%;left:auto;bottom:-3%;width:min(55vw,370px);height:min(50dvh,470px);transform:none;filter:contrast(1.05) brightness(.93) saturate(.92);opacity:.98;-webkit-mask-image:linear-gradient(to bottom,#000 0 72%,rgba(0,0,0,.86) 86%,transparent 100%);mask-image:linear-gradient(to bottom,#000 0 72%,rgba(0,0,0,.86) 86%,transparent 100%)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-rim{right:-3%;left:auto;bottom:0;width:min(55vw,370px);height:min(50dvh,470px);transform:none}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-copy-veil{top:8%;bottom:22%;width:92%;background:linear-gradient(90deg,rgba(3,4,5,.44),rgba(3,4,5,.2) 68%,transparent)}
body[data-ui-experience="obsidian-forge"] .target-hero{min-height:100dvh!important;height:100dvh!important;overflow:hidden!important;background:transparent!important}
body[data-ui-experience="obsidian-forge"] .target-hero::before{opacity:.06!important}
body[data-ui-experience="obsidian-forge"] .target-hero::after{right:14px!important;top:31%!important;font-size:7px!important;line-height:1.7!important;opacity:.24!important}
body[data-ui-experience="obsidian-forge"] .target-hero-inner{width:calc(100% - 36px)!important;padding-top:clamp(104px,13vh,126px)!important}
body[data-ui-experience="obsidian-forge"] .target-hero-copy{width:min(82vw,430px)!important;max-width:82vw!important}
body[data-ui-experience="obsidian-forge"] .target-eyebrow{margin-bottom:12px!important;font-size:8px!important;letter-spacing:.27em!important;white-space:nowrap!important}
body[data-ui-experience="obsidian-forge"] .target-hero h1{width:100%!important;max-width:100%!important}
body[data-ui-experience="obsidian-forge"] .target-hero h1::before{font-size:clamp(46px,13vw,55px)!important;line-height:.85!important;letter-spacing:-.052em!important}
body[data-ui-experience="obsidian-forge"] .target-hero .target-hero-description{width:min(64vw,245px)!important;max-width:245px!important;margin-top:16px!important;font-size:10px!important;line-height:1.48!important}
body[data-ui-experience="obsidian-forge"] .target-actions{gap:7px!important;margin-top:13px!important;max-width:76vw!important}
body[data-ui-experience="obsidian-forge"] .target-actions a{min-height:37px!important;padding:0 10px!important;font-size:7px!important;letter-spacing:.08em!important;background:rgba(6,7,8,.3)!important;backdrop-filter:blur(7px)!important}
body[data-ui-experience="obsidian-forge"] .target-stats{left:0!important;bottom:18px!important;width:min(74vw,310px)!important}
body[data-ui-experience="obsidian-forge"] .target-stats>div{min-width:0!important;width:33.333%!important;padding:0 7px!important}
body[data-ui-experience="obsidian-forge"] .target-stats b{font-size:15px!important}
body[data-ui-experience="obsidian-forge"] .target-stats span{font-size:6px!important;letter-spacing:.07em!important}
body[data-ui-experience="obsidian-forge"] .target-hero-quote,.target-scroll{display:none!important}
}
@media(max-width:390px){body[data-ui-experience="obsidian-forge"] .target-hero h1::before{font-size:clamp(45px,12.8vw,52px)!important}body[data-ui-experience="obsidian-forge"] .target-hero .target-hero-description{width:min(61vw,230px)!important}body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait{right:-5%;width:53vw;height:46dvh}}
@media(min-width:1400px){body[data-ui-experience="obsidian-forge"] .target-hero h1::before{font-size:clamp(90px,6.2vw,120px)!important}body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait{right:5%;width:min(44vw,700px)}}
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
