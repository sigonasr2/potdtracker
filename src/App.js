
import logo from './logo.svg';
import './App.css';
import './bootstrap.css';
import {useState,useEffect} from 'react'

function FormatFloor(numb) {
	while (String(numb).length<3) {
		numb = "0"+numb
	}
	return numb
}

function CenterAlignAdjust(str,size) {
	return Math.round((String(str).length/2)*(size/2.1))
}

function App() {
	
	useEffect(()=>{		
		const interval = setInterval(()=>{
			fetch("http://localhost:4600")
			.then((resp)=>{
				return resp.json()
			})
			.then((data)=>{
				setData(data)
			})
		},1000)
		
		return ()=>clearInterval(interval)
	},[])
	
	const [data,setData] = useState(undefined)

	function NameMatches(i) {
		for (var key of Object.keys(data.floor_storage)) {
			if ((key==="safety"&&i===0)||
			(key==="sight"&&i===1)||
			(key==="strength"&&i===2)||
			(key==="steel"&&i===3)||
			(key==="affluence"&&i===4)||
			(key==="flight"&&i===5)||
			(key==="alteration"&&i===6)||
			(key==="purity"&&i===7)||
			(key==="fortune"&&i===8)||
			(key==="witching"&&i===9)||
			(key==="serenity"&&i===10)||
			(key==="rage"&&i===11)||
			(key==="lust"&&i===12)||
			(key==="intuition"&&i===13)||
			(key==="raising"&&i===14)||
			(key==="resolution"&&i===15)) {
				if (data.floor_storage[key]>0) {
					return 1
				} else {
					return 2
				}
			}
		}
		return 0
	}
  return (
	<>
		<img src="./layout.png"/>
		
		{data&&<>
			<div className="floating score" style={{left:190-CenterAlignAdjust(data.points,42),top:40,fontSize:42,color:"rgb(219,209,200)"}}>
				{data.points}</div>
			<div className="floating" style={{left:403,top:40,fontSize:42,color:"rgb(219,209,200)"}}>
				{FormatFloor(data.floor)}</div>
				
				{
					data.pomander.map((pom,i)=>{
						return <>
						{NameMatches(i)==1?<div className="floating dot" style={{left:50+(i%6)*64,top:88+Math.floor(i/6)*64,fontSize:24}}/>:NameMatches(i)==2&&<div className="floating dotused" style={{left:50+(i%6)*64,top:88+Math.floor(i/6)*64,fontSize:24}}/>}
						<div className="floating current" style={{left:48+(i%6)*64,top:80+Math.floor(i/6)*64,fontSize:24}}>
						{pom[1]}</div>
						<div className="floating alltime" style={{left:48+(i%6)*64,top:104+Math.floor(i/6)*64,fontSize:24}}>
						{pom[2]}</div>
						<div className="floating" style={{left:82+(i%6)*64,top:120+Math.floor(i/6)*64,fontSize:24,color:pom[0]!==0?"white":"gray"}}>
						x{pom[0]}</div></>
					})
				}
				{
					data.accursed_hoard.map((acc,i)=>{
						return <>
						<div className="floating current" style={{left:342+(i%2)*76,top:210+Math.floor(i/2)*32,fontSize:16}}>
						{acc[0]}</div>
						<div className="floating alltime" style={{left:342+(i%2)*76,top:224+Math.floor(i/2)*32,fontSize:16}}>
						{acc[1]}</div></>
					})
				}
				{
					data.mimics.map((mm,i)=>{
						return <>
							<div className={"floating "+(i===0?"current":"alltime")} style={{left:342+i*99-CenterAlignAdjust(mm,28),top:286,fontSize:28}}>
							{mm}</div>
						</>
					})
				}
				{
					data.traps.map((trap,i)=>{
						return (i<=2)?
						<>
						<div className="floating current" style={{left:90+i*122,top:336,fontSize:24}}>
						{trap[0]}</div>
						<div className="floating alltime" style={{left:90+i*122,top:368,fontSize:24}}>
						{trap[1]}</div></>
						:
						<>
						<div className="floating current" style={{left:142+(i-3)*122,top:408,fontSize:24}}>
						{trap[0]}</div>
						<div className="floating alltime" style={{left:142+(i-3)*122,top:440,fontSize:24}}>
						{trap[1]}</div></>
					})
				}
				<div className="floating current" style={{left:345-CenterAlignAdjust(data.death_count[0],32),top:416,fontSize:32}}>
				{data.death_count[0]}</div>
				<div className="floating alltime" style={{left:422-CenterAlignAdjust(data.death_count[0],32),top:464,fontSize:32}}>
				{data.death_count[1]}</div>
				{
					data.floor_effects.map((eff,i)=>{
						return <>
						{i in data.floor_buff_storage&&<div className={"floating "+((i<=1)?"smoldotgreen":"smoldot")} style={{left:48+Math.floor(i/3)*96,top:528+(i%3)*48+((i<=1)?-4:0),fontSize:16}}/>}
						<div className="floating current" style={{left:96+Math.floor(i/3)*96,top:534+(i%3)*48,fontSize:16}}>
						{eff[0]}</div>
						<div className="floating alltime" style={{left:96+Math.floor(i/3)*96,top:554+(i%3)*48,fontSize:16}}>
						{eff[1]}</div></>
					})
				}
			</>
		}
    </>
  );
}

export default App;
