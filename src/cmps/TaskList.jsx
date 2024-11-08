import { TaskPreview } from "./TaskPreview";

export function TaskList({ tasks }) {
    
    

    return (
        tasks.map(task => 
            <TaskPreview key={task.id} task={task}/>
        )
    )
}
