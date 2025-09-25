import React, { useEffect, useState } from 'react';
import TaskItem from './TaskItem';
import FilterControls from './FilterControls';
import CircularProgress from '@mui/material/CircularProgress';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface Student {
  id: number;
  name: string;
  age: number;
  grade: string;
}

const TaskList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteId, setDeleteId] = useState<number | null>(null); // id student cần xóa

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/students');
      const data = await res.json();
      setStudents(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteConfirm = async () => {
    if (deleteId !== null) {
      try {
        await fetch(`http://localhost:8080/students/${deleteId}`, {
          method: 'DELETE',
        });
        setDeleteId(null); // đóng modal
        fetchStudents(); // reload list
      } catch (err) {
        console.error('Error deleting student:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center gap-3">
          <CircularProgress />
          <span className="text-gray-600 font-medium">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-10">
      <FilterControls onStudentAdded={fetchStudents} />

      <div className="grid grid-cols-2 gap-4">
        {students.map((student) => (
          <TaskItem
            key={student.id}
            id={student.id}
            name={student.name}
            age={student.age}
            grade={student.grade}
            onDelete={(id) => setDeleteId(id)}
          />
        ))}
      </div>

      {/* Modal xác nhận xóa */}
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa sinh viên này không?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskList;
