import { Play } from "phosphor-react";
import { CountdownCointainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, TaskInput } from "./styles";
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod'


const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5).max(60),
})


// interface NewCycleFormData{
//     task: string;
//     minutesAmount: number
// }

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home(){

    const {register, handleSubmit, watch, reset} = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    function handleSubmitnewCircle(data: NewCycleFormData){
        console.log(data)
        reset();
    }

    const task = watch('task')
    const isSubmitDisabled = !task
    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleSubmitnewCircle)}>
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                    type="text" 
                    id="task" 
                    placeholder="Dê um nome para o seu projeto" list="task-suggestions"
                    {...register('task')}
                    />

                    <datalist id='task-suggestions'>
                        <option value="Banana"></option>
                        <option value="Banana"></option>
                        <option value="Banana"></option>
                        <option value="Banana"></option>
                        <option value="Banana"></option>
                    </datalist>

                    <label htmlFor="">durante</label>
                    <MinutesAmountInput 
                        type="number" 
                        id="minutesAmount" 
                        placeholder="00" 
                        step={5} 
                        min={5} 
                        max={60}
                        {...register('minutesAmount', {valueAsNumber: true})}
                    />

                    <span>minutos.</span>
                </FormContainer>
            
            
                <CountdownCointainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownCointainer>

                <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
                    <Play size={24}/>
                    Começar
                </StartCountdownButton>
            </form>
        </HomeContainer>
    )
}