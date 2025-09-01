import { createContext, useEffect, useReducer, useState, type ReactNode } from 'react'
import { cyclesReducers, type Cycle } from '../reducers/cycles/reducer'
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from '../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'

interface CreateCycleData {
    task: string,
    minutesAmount: number
}

interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPast: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}

export function CyclesContextProvider({children,}: CyclesContextProviderProps){

    const [cyclesState, dispach] = useReducer(cyclesReducers, {
        cycles: [],
        activeCycleId: null
    }, (initialState)=>{
        const storedStateAsJSON = localStorage.getItem('@ignite-time:cycles-state-1.0.0')

        if(storedStateAsJSON){
            return JSON.parse(storedStateAsJSON)
        }

        return initialState
    })

    const {cycles, activeCycleId} = cyclesState;
    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    const [amountSecondsPast, setAmountSecondsPast] = useState(()=> {
        if(activeCycle){
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
        }
        return 0
    })

    useEffect(()=>{
        const stateJSON = JSON.stringify(cyclesState)
        localStorage.setItem('@ignite-time:cycles-state-1.0.0', stateJSON)


    }, [cyclesState])

    function markCurrentCycleAsFinished(){
        dispach(markCurrentCycleAsFinishedAction())
    }

    function setSecondsPassed(seconds: number){
        setAmountSecondsPast(seconds)
    }

    function createNewCycle({task, minutesAmount}: CreateCycleData){
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: task,
            minutesAmount: minutesAmount,
            startDate: new Date(),
        }

        dispach(addNewCycleAction(newCycle))

        setAmountSecondsPast(0)
    }

    function interruptCurrentCycle(){
        dispach(interruptCurrentCycleAction())
    }


    return(
        <CyclesContext.Provider 
          value={{
            cycles,
            activeCycle, 
            activeCycleId, 
            markCurrentCycleAsFinished, 
            amountSecondsPast, 
            setSecondsPassed,
            createNewCycle,
            interruptCurrentCycle
          }}>

            {children}

          </CyclesContext.Provider>
    )
}