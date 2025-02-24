import { NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import React from 'react'
import { createClient } from '../../../../utils/supabase/server';

export async function GET( request:NextRequest) {
const supabase = await createClient();
const searchParams = request.nextUrl.searchParams


let { data: profile, error } = await supabase
  .from('profile')
  .select('*')
          

  let { data: tickets, error:errortickets } = await supabase
  .from('tickets')
  .select("*")
  .eq('status', 'disponible')
  
  
    let { data: payments, error:errorPayments } = await supabase
    .from('payments')
    .select('*')
    .range(0, 9)

    if( error || errorPayments|| errortickets){
        const msj= error ?? errortickets ?? errortickets
        return NextResponse.json({msj:`error en la consulta${msj}`},{status:500})

    }
        
          

  return NextResponse.json({users: profile?.length, tickets:tickets?.length, payments})
}

