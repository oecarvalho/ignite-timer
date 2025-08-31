import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import * as zod from 'zod'
import { createContext, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5).max(60),
})


interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedDate?: Date,
    finishedDate?: Date
}

interface CyclesContextType {
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    markCurrentCycleAsFinished: () => void
    amountSecondsPast: number
    setSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home(){

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null> (null)
    const [amountSecondsPast, setAmountSecondsPast] = useState(0)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    const { handleSubmit, watch, reset} = newCycleForm

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    function markCurrentCycleAsFinished(){
        setCycles(state => state.map(cycle =>{
            if(cycle.id === activeCycleId){
                return {...cycle, finishedDate: new Date()}
            } else {
                return cycle
            }
        }))
    }

    function handleCreateNewCircle({task, minutesAmount}: NewCycleFormData){
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: task,
            minutesAmount: minutesAmount,
            startDate: new Date(),
        }

        setCycles(state => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPast(0)
        reset();
    }

    function handleInterruptCycle(){
        setCycles(state => state.map(cycle =>{
            if(cycle.id === activeCycleId){
                return {...cycle, interruptedDate: new Date()}
            } else {
                return cycle
            }
        }))

        setActiveCycleId(null);
    }

    function setSecondsPassed(seconds: number){
        setAmountSecondsPast(seconds)
    }

    const task = watch('task')
    const isSubmitDisabled = !task
    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCircle)}>

                <CyclesContext.Provider 
                    value={{activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPast, setSecondsPassed}}
                >
                      
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm/>
                    </FormProvider>

                    <Countdown/>
                </CyclesContext.Provider>

                {activeCycle ? (
                    <StopCountdownButton type="submit" onClick={handleInterruptCycle}>
                        <HandPalm size={24}/>
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
                        <Play size={24}/>
                        Começar
                    </StartCountdownButton>
                )}

            </form>
        </HomeContainer>
    )
}