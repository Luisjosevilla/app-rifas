import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export  default async function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    
          
   const supabase = await createClient();
      
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
    let { data: profile, error } = await supabase
    .from('profile')
    .select("*")
    .eq('user_id', user?.id)
  
     if(!profile){
      return redirect("/sign_in")
     }     
    if(profile !== null ){
        if(profile[0]?.rol == "admin"){
           return redirect("/protected/dashboard/admin")
        }
    }
  
    
    return (
    <>
        {children}
    </>
        
    )
  }