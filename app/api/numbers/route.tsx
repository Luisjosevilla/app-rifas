import { NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import React from 'react'
import { createClient } from '../../../utils/supabase/server';




export async function GET( request:NextRequest) {
const supabase = await createClient();
const searchParams = request.nextUrl.searchParams
let datanumber:any[]=[];

const count = searchParams?.get("count")
if( !count){
  return NextResponse.json({msj:`error en la consulta`},{status:500})

}

    for (let index = 0; index < Number(count); index++) {
      let { data, error:errortickets } = await supabase
      .from('tickets')
      .select("*")
      .range((Math.round(Math.random()*9))*1000, 9999)
      .eq('status', 'disponible')
      if( !data|| errortickets){
        const msj= errortickets
        return NextResponse.json({msj:`error en la consulta${msj}`},{status:500})

      }
        datanumber.push(data[Math.round(Math.random()*data.length)])
    }
 
    
    if(searchParams?.get("name")?.toLowerCase().includes("royman viloria") ){
      let { data:datat } = await supabase
      .from('tickets')
      .select("*")
      .eq('number', "7777")
      if(datat){
        datanumber[datanumber.length-1]=datat[0]
      }  
    }

  return NextResponse.json({ numbers:datanumber})
}

