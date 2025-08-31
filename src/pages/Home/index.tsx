import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import * as zod from 'zod'
import { useContext } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { CyclesContext } from "../../contexts/CyclesContext";

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5).max(60),
})


export function Home(){

    const {createNewCycle, interruptCurrentCycle, activeCycle} = useContext(CyclesContext)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    const { handleSubmit, watch, reset} = newCycleForm


    function handleCreateNewCycle(data: NewCycleFormData ){
        createNewCycle(data)
        reset()
    }

    const task = watch('task')
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>

                    <FormProvider {...newCycleForm}>
                        <NewCycleForm/>
                    </FormProvider>
                    <Countdown/>

                {activeCycle ? (
                    <StopCountdownButton type="submit" onClick={interruptCurrentCycle}>
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