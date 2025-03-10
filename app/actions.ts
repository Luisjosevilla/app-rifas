"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import jwt from 'jsonwebtoken';

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
  const numbers= datares?.numbers.map((item:any)=>`${item.number}` )

  return numbers
}

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString();
  const phone = formData.get("phone")?.toString();
  const img = formData.get("img")?.toString();
  const monto = formData.get("monto")?.toString();
  const method = formData.get("method")?.toString();
  const number = formData.get("number")?.toString();
  const nt = formData.get("nt")?.toString();

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
  const numbersRifa= await getNumbers(Number(number))

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    
      const {  error } = await supabase
      .from('profile')
      .insert([
        { user_id:data.user?.id,rol:"user",name,phone,ntickets:numbersRifa, address:"" },
      ])
      .select()

      const { data:payment, error:errorpayments } = await supabase
      .from('payments')
      .insert([
        { user: data.user?.id, numbers:numbersRifa, capture:img, trans_number:nt, pay_method:method,status:false,monto:monto },
      ])
      .select()

      if (error ) {
        console.error(error.code + " " + error.message);
        return encodedRedirect("error", "/sign-up", error.message);
      }
      if(errorpayments ){
        return encodedRedirect("error", "/sign-up", errorpayments.message);
      }
      if (payment){
        for (let index = 0; index < payment[0].numbers.length; index++) {
          const element = payment[0].numbers[index];
          const { data:tickets, error } = await supabase
          .from('tickets')
          .update({ "status": 'no disponible' })
          .eq('number', element)
          .select()
          if(error)return redirect(`/protected/dashboard/admin/pagos/verify/id?error="error del servidor intente de nuevo"`) 
          
        }
        return redirect(`/protected/dashboard/users/?buy=Compra Exitosa!`)
  
      } 

      const { error:errorsignin } = await supabase.auth.signInWithPassword({
          email,
          password,
      });
    return redirect("/protected/dashboard/users?user=nuevo");
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

  const monto = methods[0].currency=="BS"?(Number(number)*((await getprice())?.tasa)*(await getprice())?.price).toFixed(2):(Number(number)*(await getprice())?.price).toFixed(2)
  return  redirect(`/sign-up?number=${number}&method=${method}&monto=${monto}`) 
};

export const seeMontoUser = async (formData:FormData) => {
  const supabase = await createClient();
  const method = formData.get("method") 
  const number = formData.get("number") 
  if(!method || !number || !(Number(number)>=4)) {
    return  encodedRedirect(
        "error",
        "/protected/dashboard/users/buy",
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
      "/protected/dashboard/users/buy",
      "Error de servidor",
    ); 
  }

  const monto = methods[0].currency=="BS"?(Number(number)*((await getprice())?.tasa)*(await getprice())?.price).toFixed(2):(Number(number)*(await getprice())?.price).toFixed(2)
  return  redirect(`/protected/dashboard/users/buy?number=${number}&method=${method}&monto=${monto}`) 
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
  const filename= `capture${Math.round(Math.random())*1000000}.jpg`;


  const token = jwt.sign({
    fileName: filename
  }, process.env.PRIVATE_KEY!, {
    expiresIn: 600,
    header: {
      alg: "HS256",
      typ: "JWT",
      kid: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
    },
  });
  form.append("fileName", filename);
  form.append('token', token);
  const options = {
    body:form,
    method: 'POST',
    headers: {Accept: 'application/json', Authorization: `Bearer ${process.env.PRIVATE_KEY}`}
  };

   
    const response = await fetch(url, options);
    const data = await response.json();
    if (data) return redirect(`/sign-up?number=${number}&nt=${transferencia}&&method=${method}&monto=${monto}&img=${data?.url}&step=register`)
  
    return  redirect(`/sign-up?number=${number}&method=${method}&monto=${monto}&error="error del servidor intente de nuevo"`) 
  
  
};

export const comprarUser= async (formData:FormData) => {
  const supabase = await createClient();
  const method = formData.get("method") 
  const number = formData.get("number") 
  const transferencia = formData.get("transferencia") 
  const file = formData.get("file") 
  const terms = formData.get("terms") 
  const monto = formData.get("monto") 
  const user = formData.get("user") 
  if(!(Number(number)>=4)){
    encodedRedirect(
      "error",
      `/protected/dashboard/users/buy`,
      `Numero tiene que ser mayor que 4`,
    );
  }
  if(!transferencia){
    return encodedRedirect(
      "error",
      `/protected/dashboard/users/buy`,
      `Número de tranferencia es requerido.`,
    );
  }
  if(!file){
   return encodedRedirect(
      "error",
      `/protected/dashboard/users/buy`,
      `Capture es requerido.`,
    );
  }
  if(!terms){
    return  redirect(`/protected/dashboard/users/buy?number=${number}&method=${method}&monto=${monto}&error="Aceptar los terminos y condiciones"`) 
  }
 
  const url = 'https://upload.imagekit.io/api/v2/files/upload';
  const form = new FormData();
  form.append('file', file);
  const filename= `capture${Math.round(Math.random())*1000000}.jpg`;


  const token = jwt.sign({
    fileName: filename
  }, process.env.PRIVATE_KEY!, {
    expiresIn: 600,
    header: {
      alg: "HS256",
      typ: "JWT",
      kid: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
    },
  });
  form.append("fileName", filename);
  form.append('token', token);
  const options = {
    body:form,
    method: 'POST',
    headers: {Accept: 'application/json', Authorization: `Bearer ${process.env.PRIVATE_KEY}`}
  };

   
    const response = await fetch(url, options);
    const data = await response.json();

    let { data: profile, error:errorprofile } = await supabase
    .from('profile')
    .select('*')
    .eq("user_id", user )
            
    const numbersRifa= await getNumbers(Number(number))

      if(!profile){
        return redirect(`/protected/dashboard/users/buy?number=${number}&method=${method}&monto=${monto}&error="error del servidor intente de nuevo"`) 
      }
      
      const {  error:errorupdate } = await supabase
      .from('profile')
      .update({ ntickets:[...profile[0].ntickets, numbersRifa] })
      .eq('user_id', user)
      .select()
        

      const { data:payment, error:errorpayments } = await supabase
      .from('payments')
      .insert([
        { user: user, numbers:numbersRifa, capture:data?.url, trans_number:transferencia, pay_method:method,status:false,monto:monto },
      ])
      .select()

     

    if (payment){
      for (let index = 0; index < payment[0].numbers.length; index++) {
        const element = payment[0].numbers[index];
        const { data:tickets, error } = await supabase
        .from('tickets')
        .update({ "status": 'no disponible' })
        .eq('number', element)
        .select()
        if(error)return redirect(`/protected/dashboard/admin/pagos/verify/id?error="error del servidor intente de nuevo"`) 
        
      }
      return redirect(`/protected/dashboard/users/?buy=Compra Exitosa!`)

    } 
  
    return  redirect(`/protected/dashboard/users/buy?number=${number}&method=${method}&monto=${monto}&error="error del servidor intente de nuevo"`) 
  
  
};


export const validarPago= async (formData:FormData) => {
  const supabase = await createClient();
  const id= formData.get("id")

  const { data, error } = await supabase
  .from('payments')
  .update({ status: true })
  .eq('id', id)
  .select()

  if(!data){
    return  redirect(`/protected/dashboard/admin/pagos/verify/${id}?error="error del servidor intente de nuevo"`) 
  
  }
  for (let index = 0; index < data[0].numbers.length; index++) {
    const element = data[0].numbers[index];
    const { data:tickets, error } = await supabase
    .from('tickets')
    .update({ "status": 'comprado' })
    .eq('number', element)
    .select()
    if(error)return redirect(`/protected/dashboard/admin/pagos/verify/${id}?error="error del servidor intente de nuevo"`) 
    
  }
  
  return  redirect(`/protected/dashboard/admin/pagos/?message=Pago validado exitosamente!`) 
  
  
};



