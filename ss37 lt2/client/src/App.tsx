
import './App.css'
import FilterControls from './components/FilterControls'
import TaskList from './components/TaskList'


function App() {


  function fetchStudentsAgain(): void {
    throw new Error('Function not implemented.')
  }

  return (
    <>
    <div className='w-[50%] ml-4'>
      <FilterControls onStudentAdded={fetchStudentsAgain}/>
      <TaskList/>
    </div>
      
    </>
  )
}

export default App
