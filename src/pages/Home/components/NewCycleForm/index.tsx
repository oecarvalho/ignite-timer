import { FormContainer, TaskInput, MinutesAmountInput } from "./styles";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { CyclesContext } from "../../../../contexts/CyclesContext";


export function NewCycleForm(){

    const {activeCycle} = useContext(CyclesContext)
    const {register} = useFormContext()

    return(
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                        type="text" 
                        id="task" 
                        disabled={!!activeCycle}
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
                        disabled={!!activeCycle}
                        {...register('minutesAmount', {valueAsNumber: true})}
                    />

                    <span>minutos.</span>
                </FormContainer>
    )
}