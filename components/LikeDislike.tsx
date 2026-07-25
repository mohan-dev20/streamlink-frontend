"use client";
import { useState } from "react";
export default function LikeDislike(){
    const [likes,setLikes]=useState(0);
    const [dislikes,setDislikes]=useState(0);

     return(
        <div className="flex gap-4 mt-4">
            <button onClick={()=> setLikes(likes+1)}
            className="
h-12
px-6
rounded-full
bg-slate-800
hover:bg-slate-700
transition
">
                👍{likes}
            </button>
            <button onClick={()=> setDislikes(dislikes+1)} className="
h-12
px-6
rounded-full
bg-slate-800
hover:bg-slate-700
transition
">
                👎{dislikes}
                </button> 
                    
                
            
        </div>
     );   
    }
