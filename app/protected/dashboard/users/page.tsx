import { redirect } from 'next/navigation';
import React from 'react'
import { createClient } from '../../../../utils/supabase/server';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import Image from 'next/image';
import moto1 from "../../../public/moto1.jpg"
import AnimateButton from '../../../../components/Animate-button';

async function Page() {
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
  let { data: profile, error } = await supabase
  .from('profile')
  .select("*")
  .eq('user_id', user?.id)

     console.log(profile)      
  if(profile !== null ){
      if(profile[0]?.rol == "admin"){
         return redirect("/protected/dashboard/admin")
      }
  }
 
  
  return (
    <section className='flex flex-col gap-6 w-full items-center '>
       <h1 className='px-28  font-bold text-4xl text bg-background-primary w-full text-left'>Inicio</h1>
        <div className='flex flex-col md:flex-row gap-4 w-full items-center justify-center '>
        <Card className="w-full md:basis-1/4 bg-background">
          <CardHeader>
            <CardTitle>Tickets comprados</CardTitle>
            <CardDescription>Numero de usuarios registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <span className='text-3xl font-bold text-primary '>{0}</span>
          </CardContent>
         
        </Card>
        <Card className="w-full md:basis-1/4 bg-background">
          <CardHeader>
            <CardTitle>Tickets Verificados</CardTitle>
            <CardDescription>Tickets validados</CardDescription>
          </CardHeader>
          <CardContent>
          <span className='text-3xl font-bold text-primary '>{0}</span>
         
          </CardContent>
          
        </Card>
        <Card className="w-full md:basis-1/4 bg-background">
          <CardHeader>
            <CardTitle>Fecha de rifa</CardTitle>
            <CardDescription>Tickets Vendidos</CardDescription>
          </CardHeader>
          <CardContent>
          <span className='text-3xl font-bold text-primary '>{0}</span>
          </CardContent>
        </Card>
        </div>
        <div className='relative flex flex-col p-4  gap-4 md:w-3/4  w-full bg-neutral-100 rounded-lg items-start justify-center px-8 p-4'>
          
            <Link href={"/protected/dashboard/users/tickets?page=0"} className='absolute top-6 right-2 md:right-10 p-2 w-fit h-fit rounded-lg text-md bg-primary text-white font-bold'>Ver Tickets</Link>
          
          <div className='flex flex-col md:flex-row gap-4 items-start justify-start'>
            <Image src={moto1} width={200} height={200} alt='moto' className='basis-1/4 rounded-lg '/>
            <div className='flex flex-col gap-4 items-start justify-start'>
              <h2 className='text-primary text-3xl font-bold'>MOTO RK200</h2>
              <p className='w-3/4'>Texto para promocionar la rifa y provocar que el usuario quiera comprar mas </p>
              <AnimateButton />
            </div>
          </div>
        
        </div>

    </section>
  )
}

export default Page