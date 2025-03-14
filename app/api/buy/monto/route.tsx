import { NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import React from 'react'
import { createClient } from '../../../../utils/supabase/server';

export async function GET( request:NextRequest) {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams

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
    
    if(!searchParams.get("method") || !searchParams.get("number") || !(Number(searchParams.get("number") )>=4)) {
        return  NextResponse.json({msj:"Error en peticion"},{status:500})
    }
        let { data: methods, error:errormethod } = await supabase
        .from('method')
        .select('*')
        .eq("name",searchParams.get("method"));
    
        if(!methods){
          return NextResponse.json({msj:"Error en peticion"},{status:500})
        }
      
        const monto = methods[0]?.currency=="BS"?(Number(searchParams.get("number"))*((await getprice())?.tasa)*(await getprice())?.price).toFixed(2):(Number(searchParams.get("number"))*(await getprice())?.price).toFixed(2)
        return  NextResponse.json({monto:monto})
    
    
}
    
    