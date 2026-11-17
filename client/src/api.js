const BASE=import.meta.env.VITE_API_URL||"http://localhost:8084/api";
export async function api(path,options={}) {
 const token=localStorage.getItem("issueflow_token");
 const headers={...(options.body instanceof FormData?{}:{"Content-Type":"application/json"}),...(token?{Authorization:`Bearer ${token}`}:{}) ,...options.headers};
 const response=await fetch(`${BASE}${path}`,{...options,headers});
 const data=await response.json().catch(()=>({message:"Unexpected server response"}));
 if(!response.ok) throw new Error(data.message||"Request failed");
 return data;
}
export const assetUrl=(path)=>path?`${BASE.replace(/\/api$/,"")}${path}`:"";
