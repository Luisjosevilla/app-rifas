import { buscarGanador } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import React from 'react';

const Page = ({
    params,
    searchParams,
  }: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[]  }>;
  
  }) => {
    return (
        <div className='flex flex-col w-full p-10'>
            <div className='flex flex-row justify-between w-full'>
                <h1 className='text-xl md:text-4xl font-bold text-primary'>Buscar Ganador</h1>
                <form className='flex flex-row gap-2 ' action={buscarGanador}>
                    <Input type='text' name='number' />
                    <SubmitButton pendingText='Consultando...' className='bg-primary p-2 rounded-lg w-fit h-fit'>Buscar</SubmitButton>
                </form>
            </div>
            <div className='w-full h-fit justify-center '>

            </div>
            
        </div>
    );
}

export default Page;
