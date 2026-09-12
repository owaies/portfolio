'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const ObsidianForgeMonolithCanvas = dynamic(() => import('./obsidian-forge-monolith-canvas'), { ssr: false })
const DESKTOP_VIDEO = '/videos/obsidian-forge-hero.mp4'
const MOBILE_VIDEO = '/videos/obsidian-forge-hero-mobile.mp4'
const FORGE_PORTRAIT = '/images/forge-profile-cutout.webp'

const FORGE_STYLE = `
body[data-ui-experience="obsidian-forge"] .forge-cinematic-hero{position:absolute;inset:0;z-index:3;overflow:hidden;pointer-events:none;background:#050607}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-video,body[data-ui-experience="obsidian-forge"] .forge-cinematic-grade,body[data-ui-experience="obsidian-forge"] .forge-cinematic-haze,body[data-ui-experience="obsidian-forge"] .forge-cinematic-grain{position:absolute;inset:0;width:100%;height:100%}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-video{object-fit:cover;object-position:center center;opacity:.94;filter:saturate(.72) contrast(1.08) brightness(.72)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-grade{z-index:1;background:linear-gradient(90deg,rgba(3,4,5,.74),rgba(3,4,5,.42) 34%,rgba(3,4,5,.08) 62%,rgba(3,4,5,.28) 100%),linear-gradient(180deg,rgba(2,3,4,.36),transparent 34%,rgba(2,3,4,.76) 100%)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-haze{z-index:2;background:radial-gradient(ellipse at 78% 22%,rgba(255,167,94,.13),transparent 24%),radial-gradient(ellipse at 53% 70%,rgba(255,205,155,.06),transparent 30%);mix-blend-mode:screen}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-grain{z-index:7;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");mix-blend-mode:soft-light}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait{position:absolute;z-index:5;left:55%;bottom:-7%;width:min(48vw,700px);height:min(88vh,820px);transform:translateX(-43%);object-fit:contain;object-position:center bottom;filter:contrast(1.08) brightness(.82) saturate(.84) drop-shadow(12px 4px 18px rgba(255,145,72,.13));-webkit-mask-image:linear-gradient(to bottom,#000 0 70%,rgba(0,0,0,.88) 82%,transparent 100%);mask-image:linear-gradient(to bottom,#000 0 70%,rgba(0,0,0,.88) 82%,transparent 100%)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-rim{position:absolute;z-index:6;left:55%;bottom:0;width:min(48vw,700px);height:min(88vh,820px);transform:translateX(-43%);background:linear-gradient(90deg,transparent 0 67%,rgba(255,153,79,.16) 75%,transparent 86%);opacity:.65;mix-blend-mode:screen;-webkit-mask-image:linear-gradient(to bottom,transparent 0 16%,#000 30% 77%,transparent 92%);mask-image:linear-gradient(to bottom,transparent 0 16%,#000 30% 77%,transparent 92%)}
body[data-ui-experience="obsidian-forge"] .forge-cinematic-copy-veil{position:absolute;inset:14% auto 8% 0;width:min(58%,760px);z-index:8;background:linear-gradient(90deg,rgba(3,4,5,.48),rgba(3,4,5,.14) 68%,transparent)}
body[data-ui-experience="obsidian-forge"] .target-hero-inner{z-index:12!important}
body[data-ui-experience="obsidian-forge"] .target-hero{background:#050607!important}
body[data-ui-experience="obsidian-forge"] .target-hero::before{z-index:10!important;opacity:.28}
body[data-ui-experience="obsidian-forge"] .target-hero::after{z-index:11!important}
body[data-ui-experience="obsidian-forge"] .target-hero[data-forge-video-ready="true"] .target-portrait-wrap{display:none!important}
@media(max-width:760px){body[data-ui-experience="obsidian-forge"] .forge-cinematic-video{object-position:62% center;opacity:.92;filter:saturate(.7) contrast(1.08) brightness(.68)}body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait{left:61%;bottom:-4%;width:min(94vw,620px);height:min(79dvh,700px);transform:translateX(-48%);filter:contrast(1.08) brightness(.85) saturate(.82) drop-shadow(9px 3px 15px rgba(255,145,72,.13))}body[data-ui-experience="obsidian-forge"] .forge-cinematic-rim{left:61%;bottom:0;width:min(94vw,620px);height:min(79dvh,700px);transform:translateX(-48%)}body[data-ui-experience="obsidian-forge"] .forge-cinematic-copy-veil{inset:16% auto 12% 0;width:88%;background:linear-gradient(90deg,rgba(3,4,5,.68),rgba(3,4,5,.28) 64%,transparent)}}
@media(prefers-reduced-motion:reduce){body[data-ui-experience="obsidian-forge"] .forge-cinematic-portrait,body[data-ui-experience="obsidian-forge"] .forge-cinematic-rim{transition:none!important}}
`

export default function ObsidianForgeCinematicHero(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const [failed,setFailed]=useState(false)
  const [ready,setReady]=useState(false)

  useEffect(()=>{
    const video=videoRef.current
    if(!video)return
    const media=window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync=()=>{
      if(media.matches){video.pause();return}
      void video.play().catch(()=>{})
    }
    sync()
    media.addEventListener?.('change',sync)
    return()=>media.removeEventListener?.('change',sync)
  },[])

  useEffect(()=>{
    const hero=document.querySelector('.target-hero')
    if(!hero)return
    hero.setAttribute('data-forge-video-ready',ready&&!failed?'true':'false')
    return()=>hero.removeAttribute('data-forge-video-ready')
  },[ready,failed])

  if(failed)return <ObsidianForgeMonolithCanvas/>

  return <>
    <style dangerouslySetInnerHTML={{__html:FORGE_STYLE}}/>
    <div className="forge-cinematic-hero" aria-hidden="true">
      <video ref={videoRef} className="forge-cinematic-video" autoPlay muted playsInline loop preload="metadata" poster="/obsidian-forge-environment.svg" onCanPlay={()=>setReady(true)} onError={()=>setFailed(true)}>
        <source src={MOBILE_VIDEO} media="(max-width:760px)" type="video/mp4"/>
        <source src={DESKTOP_VIDEO} type="video/mp4"/>
      </video>
      <div className="forge-cinematic-grade"/><div className="forge-cinematic-haze"/>
      <img className="forge-cinematic-portrait" src={FORGE_PORTRAIT} alt="" draggable={false}/>
      <div className="forge-cinematic-rim"/><div className="forge-cinematic-copy-veil"/><div className="forge-cinematic-grain"/>
    </div>
  </>
}
