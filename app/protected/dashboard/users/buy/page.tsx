import { comprarUser, seeMonto, seeMontoUser, selectMethod } from '@/app/actions';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import React from 'react'

async function Page(props: {
  searchParams: Promise<any>;
}) {
  const searchParams= await props.searchParams

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const getprice=async ()=>{
      const getTasa= await fetch("https://ve.dolarapi.com/v1/dolares/paralelo",{method:"GET"})
      const resTasa= await getTasa?.json()
      let { data: settings, error } = await supabase
      .from('settings')
      .select("*")
      if(!settings) return null;
      return {price: settings[0].price, tasa:resTasa.promedio+1,monto:2 }
          
  }

  let { data: methods, error:errormethod } = await supabase
  .from('method')
  .select('*')
  return (
    <section className='flex flex-row gap-4 '>
        <form className="overflow-hidden relative flex flex-col w-full min-h-[80vh] gap-4 basis-1/2 mx-auto p-6 md:px-10 rounded-lg shadow-xl items-center">
        {searchParams.error?
        <p className="w-full h-fit text-md text-red-600 bg-red-200 rounded-lg p-2"><span className="font-bold text-red-800">Error:</span> {searchParams.error}</p>
        :null} 
       <h2 className="text-3xl text-primary font-bold opacity-90 text-center md:text-start animate pulse"> PARTICIPA Y GANA!</h2>
        <span className="text-xs text-center">Los números son otorgados de forma totalmente  aleatoria previa confirmación del pago, recuerda que si te sale alguno de los siguientes numeros: 7777, 3333 y 8888. Obtendras un premio que será entregado de manera inmediata al ganador. MUCHA SUERTE!</span>
        <div className="absolute  top-0 -right-full">
          <Input name="user"  defaultValue={user?.id} />
        </div>
         
         <table className="table-auto gap-2 ">
            <thead className="">
              <tr className="border-2 border-b-primary/60  border-transparent rounded-xl">
                <th className="border-r-2 border-primary/60 text-center max-w-[100px] p-2 text-foregound-primary">Precio por ticket</th>
                <th className="border-r-2 border-primary/60 text-center max-w-[100px] p-2 text-foregound-primary">Tasa del dia</th>
                <th className="border-l-2 border-primary/60 text-center max-w-[100px] p-2 text-foregound-primary">Compra mínima</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-r-2 border-primary/60 text-center p-4">{(await getprice())?.price}$</td>
                <td className="border-r-2 border-primary/60 text-center p-4">{(await getprice())?.tasa}Bs.</td>
                <td className="border-l-2 border-primary/60 text-center p-4">{(await getprice())?.monto}$</td>
              </tr>
              
            </tbody>
          </table>
          <div className="flex flex-col gap-2 items-center justify-center w-full h-fit">
              <label className="text-md text-foreground font-bold flex flex-col">Agregar el número de tickets<span className="text-xs text-foreground/60"> (tiene que ser mayor a 4 tickets)</span></label>
              <div className="flex flex-row gap-2 items-center justify-center">
                  <input type="number" className={`border-2 border-primary/40 bg-transparent rounded-lg text-md p-2 w-[300px]`} name="number" defaultValue={searchParams?.number}/>
              </div>
              
            </div>
          <div className="flex items-center justify-center flex-col gap-2 w-[300px] ">

        <Label htmlFor="method" className="text-md font-bold">Metodo de pago</Label>
          <Select name="method" defaultValue={searchParams.method} >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="seleccionar metodo de pago" />
            </SelectTrigger>
            <SelectContent>
              {methods?.map((item,index)=>{
                return(<SelectItem key={index} value={item.name}>{item.name}</SelectItem>)
              })}
            </SelectContent>
          </Select>
          </div>
          
          {searchParams.monto? 
          null
          :<button formAction={seeMontoUser} type="submit" className="p-2 px-4 w-fit h-fit bg-primary text-primary-foreground font-bold rounded-lg hover:scale-105">
          Ver datos de pago
          </button>}
          {  searchParams.monto?
          <div className="flex flex-col items-start border-2 border-primary/40 p-2 w-fit h-fit rounded-lg ">
            <h3 className="text-xl font-bold text-foreground">Total a pagar: {searchParams.monto} Bs</h3>
            <div className="flex flex-col">
              <span className="text-md font-bold">{searchParams.method}</span>
              <div className="w-[300px] flex flex-col">{methods?.find((i)=>i.name == searchParams.method).info.split("/").map((item:any,i:number)=>{
                return( <span className=" flex flex-row" key={i}>{item}</span>)
              })}
              </div> 
            </div>
          </div>
          :null}

          {searchParams.monto? 
          <>
           <div className="flex flex-col gap-2 items-center justify-center w-full h-fit">
              <label className="text-md text-foreground font-bold flex flex-col">Agregar el número de transferencia</label>
              <div className="flex flex-row gap-2 items-center justify-center">
                  <input type="number" className={`w-[300px] border-2 border-primary/40 bg-transparent rounded-lg text-md p-2 `} name="transferencia" placeholder="454500000"/>
              </div>
              
            </div>
            <div className="flex flex-col gap-2 items-center justify-center w-full h-fit">
              <label className="text-md text-foreground font-bold flex flex-col">Agregar el Capture de transferencia</label>
              <div className="flex flex-row gap-2 items-center justify-center">
                  <input type="file" className={`border-2 border-primary/40 bg-transparent rounded-lg text-md p-2 w-[300px] `} name="file" accept="jpg,png,jpeg" placeholder=""/>
              </div>
              
            </div>
           
          
          </>
          :
          null
          }

        
       
        { searchParams.monto? 
        <>
        <div className="flex items-center space-x-2">
              <Checkbox id="terms" name="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
               Acepto los <Link className="hover:text-primary text-blue-700" href={"/tac"}>Términos y condiciones</Link>
              </label>
            </div>
        <button formAction={comprarUser} type="submit" className="p-2 px-4 w-fit h-fit bg-primary text-primary-foreground font-bold rounded-lg hover:scale-105">
        Comprar
        </button>
        
        </>
        
        :null}
       
       </form>
    </section>
  )
}

export default Page