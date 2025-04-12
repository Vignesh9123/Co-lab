import Image from "next/image"

function LandingPage() {
  return (
    <div>
        <Image src={'/LP-BG.png'} fill alt="bg-img" className="absolute object-fill"/>
        <div className="bg-black text-white">Hello world</div>
    </div>
  )
}

export default LandingPage
