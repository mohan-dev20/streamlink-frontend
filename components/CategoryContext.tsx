"use client"
import { createContext,useContext,useState} from "react"
const CategoryContext = createContext<any>(null);
export function CategoryProvider({ children,}:{children:React.ReactNode;}){
    const [category,setCategory]=useState("All");
    return(
        <CategoryContext.Provider value={{category,setCategory}}>
            {children}
        </CategoryContext.Provider>
    );
}
export const useCategory =()=>useContext(CategoryContext);