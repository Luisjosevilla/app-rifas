import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../../../../../components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../../../components/ui/pagination'

async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[]  }>;

}) {
  const getData = await fetch(`${process.env.URL}/api/admin/Payments`,{method:"GET"})
    let data = await  getData.json()
    

    const queryParams= await searchParams
    if(queryParams.query){
      data= data.payments.filter((e:any)=>e.status == queryParams?.query )

    }

    const startIndex = "page" in queryParams && queryParams.page ? (Number(queryParams.page) * 10): 0;
    const endIndex = startIndex + 10;
    const paginatedData = data?.payments?.slice(startIndex, endIndex);
    console.log(paginatedData)
  return (
    <section className='flex flex-col gap-6 w-full p-10'>
    <h1 className='px-28  font-bold text-4xl text-slate-700'>Pagos</h1>
    <Table >
            <TableCaption>
              
            </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium text-center">Id</TableHead>
                  <TableHead className="font-medium text-center min-w-[200px]">Usuario</TableHead>
                  <TableHead className="font-medium min-w-[150px] text-center">Numeros</TableHead>
                  <TableHead className="font-medium min-w-[150px] text-center">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='cursor-pointer'>
               {paginatedData?.map((items:any,index:number)=>{
                return  <TableRow key={index}>
                <TableCell className="font-medium min-w-[200px] text-center">{items.id}</TableCell>
                <TableCell className="font-medium  text-center">{items.user}</TableCell>
                <TableCell className="font-medium min-w-[150px] text-center">{items.nmbers.length}</TableCell>
                <TableCell className="font-medium min-w-[150px] text-center">{items.status}</TableCell>
              </TableRow>
               })}
              </TableBody>
              <TableFooter className='w-full flex items-center justify-center'>
              

              </TableFooter>
              
              
            </Table>
            <div className='w-full items-center justify-center'>
              <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href={`/protected/dashboard/admin/pagos?page=${Number(queryParams?.page)>=1 ? Number(queryParams?.page)-1 : 0}` }/>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href={"/protected/dashboard/admin/pagos?page="+queryParams?.page}>{queryParams?.page}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href={`/protected/dashboard/admin/pagos?page=${Number(queryParams?.page)>=1 ? Number(queryParams?.page)+1 : 0}` } />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

              </div>
    </section>
  )
}

export default Page