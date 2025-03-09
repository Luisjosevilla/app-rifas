"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
const getprice=async ()=>{

  const getTasa= await fetch("https://ve.dolarapi.com/v1/dolares/paralelo",{method:"GET"})
  const resTasa= await getTasa?.json()
  const supabase = await createClient();
  let { data: settings, error } = await supabase
  .from('settings')
  .select("*")
  if(!settings) return null;
  return {price: settings[0].price, tasa:resTasa.promedio+1,monto:2 }
      
}
const getNumbers= async (number:number)=>{
  "use server"
 
  const data= await fetch(`${process.env.URL}/api/numbers?count=${number}`,{method:"GET"})
  const datares= await data.json()
  const numbers= datares?.numbers.map((item:any)=>item.number )

  return redirect("/sign-up/?numbers="+numbers.toString())
}

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString();
  const phone = formData.get("phone")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { data,error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });
  

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    
      const {  error } = await supabase
      .from('profile')
      .insert([
        { user_id:data.user?.id,rol:"user",name,phone,ntickets:[""], address:"" },
      ])
      .select()

      if (error) {
        console.error(error.code + " " + error.message);
        return encodedRedirect("error", "/sign-up", error.message);
      }
        

    return encodedRedirect(
      "success",
      "/sign-in",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected/dashboard/users");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const seeMonto = async (formData:FormData) => {
  const supabase = await createClient();
  const method = formData.get("method") 
  const number = formData.get("number") 
  if(!method || !number || !(Number(number)>=4)) {
    return  encodedRedirect(
        "error",
        "/sign-up",
        "Ingresar valores validos",
      ); 
  }
  let { data: methods, error:errormethod } = await supabase
  .from('method')
  .select('*')
  .eq("name",method);
  if(!methods){
    return  encodedRedirect(
      "error",
      "/sign-up",
      "Error de servidor",
    ); 
  }

  const monto = (Number(number)*((await getprice())?.tasa)*(await getprice())?.price).toFixed(2)
  return  redirect(`/sign-up?number=${number}&method=${method}&monto=${monto}`) 
};
export const selectMethod= async (formData:FormData) => {
  const method = formData.get("method") 
  const number = formData.get("number") 
  const transferencia = formData.get("transferencia") 
  const file = formData.get("file") 
  const terms = formData.get("terms") 
  const monto = (Number(number)*((await getprice())?.tasa)*(await getprice())?.price).toFixed(2)
 
  if(!(Number(number)>=4)){
    encodedRedirect(
      "error",
      `/sign-up`,
      `Numero tiene que ser mayor que 4`,
    );
  }
  if(!transferencia){
    return encodedRedirect(
      "error",
      `/sign-up`,
      `Número de tranferencia es requerido.`,
    );
  }
  if(!file){
   return encodedRedirect(
      "error",
      `/sign-up`,
      `Capture es requerido.`,
    );
  }
  if(!terms){
    return  redirect(`/sign-up?number=${number}&method=${method}&monto=${monto}&error="Aceptar los terminos y condiciones"`) 
  }
 
  const url = 'https://upload.imagekit.io/api/v2/files/upload';
  const form = new FormData();
  form.append('file', file);
  form.append('fileName', `capture${Math.round(Math.random())*1000000}`);
  const auth= Buffer.from(process.env.APIKEY_imagekit??"").toString("base64"); 
  console.log("auth",process.env.APIKEY_imagekit)
  const options = {
    body:form,
    method: 'POST',
    headers: {Accept: 'application/json', Authorization: `Basic ${auth}`}
  };

   
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data)
    return redirect(`/sign-up?number=${number}&method=${method}&monto=${monto}&img=${data.url}&step=register`)
  } catch (error) {
    return  redirect(`/sign-up?number=${number}&method=${method}&monto=${monto}&error="error del servidor intente de nuevo"`) 
  }

  
  
};



