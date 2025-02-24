import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { SubmitButton } from "../components/submit-button";
import Link from "next/link";
import Wsp from "../components/Wsp";
import Redes from "../components/Redes";
import { EnvVarWarning } from "../components/env-var-warning";
import HeaderAuth from "../components/header-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import Image from "next/image";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import moto1 from "./public/moto1.jpg"
import moto2 from "./public/moto2.jpg"
import moto3 from "./public/moto3.jpg"
import { Play } from "lucide-react";
import Timer from "../components/Timer";


export default async function Home() {
  return (
    <>
      <nav className="w-full bg-background flex justify-center border-b border-b-foreground/10 h-18 relative  shadow-xl"  style={{"boxShadow": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"}}>
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
              <div className="flex gap-5 items-center font-semibold">
                <Link href={"/"} className="text-primary font-bold text-2xl">RIFAS</Link>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
          </div>
      </nav>
      <main className="flex flex-col w-full items-center w-full">
        <Hero />
        <section className="flex-1 flex w-full h-fit items-center justify-center flex-col gap-8 p-10">
          <div className="flex flex-col gap-4  mt-16 w-full h-fit items-center justify-center relative ">
             <h2 className="w-fit h-fit text-3xl font-bold text-primary">DETALLES DE LA RIFA</h2>
             <Card className="w-full md:w-[650px]">
              <CardHeader>
                <CardTitle>MOTO RK200</CardTitle>
                <CardDescription>No esperes más, participa y gana una maravillosa moto RK200</CardDescription>
                <span>Porcentaje de boletos ventidos</span>
                <Progress value={33} />

              </CardHeader>
              <CardContent className="flex flex-col gap-4 items-center justify-center">
                <div className="flex flex-row w-full justify-between">
                  <Badge>24/05/2025</Badge>

                </div>
              
              <Carousel className="w-full max-w-xs">
                  <CarouselContent>
                    {[ "1", "2","3","modal",].map((item, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                              {item =="modal"?<Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" className="flex flex-col gap-2 w-full h-full p-2"><span className="text-xl font-bold">Ver video</span><Play className="w-20 h-20" /></Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                          <DialogTitle>Moto RK200</DialogTitle>
                                        </DialogHeader>
                                        <video className="w-full h-full max-h-[450px]" controls preload="none">
                                            <source  src="https://ik.imagekit.io/rifaapp/videomoto.mp4?updatedAt=1740261254436" type="video/mp4" />
                                            <track
                                              src="https://ik.imagekit.io/rifaapp/videomoto.mp4?updatedAt=1740261254436"
                                              kind="subtitles"

                                              srcLang="es"
                                              label="English"
                                            />
                                            Your browser does not support the video tag.
                                        </video>
                                        <DialogFooter>
                                          <DialogClose className="w-fit h-fit p-2 px-4 rounded-lg text-white bg-primary">Cerrar</DialogClose>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                            :<Image alt="foto de la moto" width={300} height={300} src={item=="1"?moto1:item=="2"?moto2:moto3}></Image>}
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
                            
              </CardContent>
              <CardFooter className="flex justify-between">
                <div/>
                <Button>Comprar</Button>
              </CardFooter>
            </Card>
          </div>
      
          <div className="rounded-3xl flex flex-col gap-8 w-full h-fit  py-10 p-4 bg-primary items-center justify-items-center">
          <h3 className="text-white text-2xl font-bold">¡SE ACABA EL TIEMPO!</h3>
          <Timer now={new Date().toUTCString()}/>
          <span className="text-md opacity-70 text-center text-primary-foreground ">La rifa se llevara acabo el (fecha), si deseas participar registrate antes de que se acabe el tiempo. Podras mantenerte informado en tiempo real del estado de la rifa a través de tu cuenta o nuestras redes sociales.</span>
          
          <Link href={"/login"} className="text-foreground bg-background w-fit h-fit py-2 px-4 font-bold rounded-lg hover:scale-105 "> PARTICIPA YA</Link>
          </div>

          <div className="relative rounded-3xl flex flex-col gap-8 justify-center items-center gap-4 w-full h-fit py-6 items-center justify-items-center">
          <h3 className="text-primary text-3xl font-bold text-center">CONTACTANOS EN NUESTRAS REDES SOCIALES</h3>
          <Redes/>
          </div>
          <Link href={"https://api.whatsapp.com/send?phone=584128220099&text=hola"} target={"_blank"} className="fixed bottom-2 right-2 w-[120px] h-[120px] z-20  ">

                  <Wsp className="w-full  h-full hover:scale-105 cursor-pointer " style={{filter:"drop-shadow(0 10px 15px black)"}}/>
          </Link>
        </section>
      </main>
    </>
  );
}
