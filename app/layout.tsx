import type { Metadata, Viewport } from "next"
import "./globals.css"
import "./admin-overrides.css"
import "./premium-ux.css"
import "./premium-ux-motion.css"
import "./profile-palette-motion.css"
import "./cinematic.css"
import "./cinematic-nav.css"
import "./reference-overrides.css"
import SiteNav from "./site-nav-v2"
import PremiumUX from "./premium-ux"

const siteUrl="https://owaies-portfolio.vercel.app"
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:"Mohammed Owaies | AI/ML Engineer",description:"Mohammed Owaies is an AI/ML Engineer focused on Python, machine learning, deep learning, computer vision and practical intelligent systems.",authors:[{name:"Mohammed Owaies"}],creator:"Mohammed Owaies",keywords:["Mohammed Owaies","AI/ML Engineer","Python Developer","Machine Learning","Deep Learning","Computer Vision"],robots:{index:true,follow:true},alternates:{canonical:"/"},openGraph:{title:"Mohammed Owaies | AI/ML Engineer",description:"Building practical intelligent systems with AI/ML and software engineering.",type:"website",url:siteUrl,siteName:"Mohammed Owaies Portfolio",images:[{url:"/og-image.svg",width:1200,height:630,alt:"Mohammed Owaies AI/ML Engineer portfolio"}]},twitter:{card:"summary_large_image",title:"Mohammed Owaies | AI/ML Engineer",description:"AI/ML Engineer portfolio focused on intelligent real-world systems.",images:["/og-image.svg"]},icons:{icon:"/favicon.svg"}}
export const viewport:Viewport={width:"device-width",initialScale:1,colorScheme:"dark",themeColor:"#050508"}
const structuredData={"@context":"https://schema.org","@type":"Person",name:"Mohammed Owaies",jobTitle:"AI/ML Engineer",url:siteUrl,sameAs:["https://github.com/owaies","https://www.linkedin.com/in/mohammed-owaies-507b4a398"]}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><SiteNav/><PremiumUX>{children}</PremiumUX><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}}/></body></html>}
