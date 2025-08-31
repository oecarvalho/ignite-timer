import { createContext, useState, type ReactNode } from 'react'

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

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedDate?: Date,
    finishedDate?: Date
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}

export function CyclesContextProvider({children,}: CyclesContextProviderProps){

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null> (null)
    const [amountSecondsPast, setAmountSecondsPast] = useState(0)
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

        setCycles(state => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPast(0)
    }

    function interruptCurrentCycle(){
        setCycles(state => state.map(cycle =>{
            if(cycle.id === activeCycleId){
                return {...cycle, interruptedDate: new Date()}
            } else {
                return cycle
            }
        }))

        setActiveCycleId(null);
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