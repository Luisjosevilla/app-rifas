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
      .range(index%2==1? (index>4?4000: (index-1)*1000): (index>4?9000:( 5000+(index*1000))), 10000)
      .eq('status', 'disponible')
      if( !data|| errortickets){
        const msj= errortickets
        return NextResponse.json({msj:`error en la consulta${msj}`},{status:500})

      }
      datanumber.push(data[Math.round(Math.random()*data.length)])
      
    }
 
console.log(datanumber)

  return NextResponse.json({ numbers:datanumber})
}

