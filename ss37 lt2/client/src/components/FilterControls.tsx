import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import React, { useState, useRef } from 'react';

const FilterControls: React.FC<{ onStudentAdded: () => void }> = ({ onStudentAdded }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [grade, setGrade] = useState('');
  const [errors, setErrors] = useState<{ name?: string; age?: string; grade?: string }>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = async () => {
    const newErrors: typeof errors = {};

    // validate name
    if (!name.trim()) {
      newErrors.name = 'Tên sinh viên không được để trống';
    }

    // validate age
    if (age === '' || age < 0) {
      newErrors.age = 'Tuổi không hợp lệ';
    }

    // validate grade
    if (!grade.trim()) {
      newErrors.grade = 'Tên lớp học không được để trống';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // check trùng name
      const res = await fetch('http://localhost:8080/students');
      const students = await res.json();
      if (students.some((s: any) => s.name === name.trim())) {
        setErrors({ name: 'Tên sinh viên đã tồn tại' });
        return;
      }

      // POST lên server
      await fetch('http://localhost:8080/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), age, grade })
      });

      // reset form
      setName('');
      setAge('');
      setGrade('');
      setErrors({});
      setOpen(false);

      // focus lại input
      setTimeout(() => nameInputRef.current?.focus(), 200);

      // gọi callback để reload list
      onStudentAdded();
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <SchoolIcon />
        <div className="text-[30px] font-bold">Student Manager</div>
      </div>

      <Button variant="contained" onClick={() => setOpen(true)}>
        Add Student
      </Button>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Thêm sinh viên</DialogTitle>
        <DialogContent className="flex flex-col gap-4 mt-2">
          <TextField
            inputRef={nameInputRef}
            label="Tên sinh viên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            autoFocus
          />
          <TextField
            type="number"
            label="Tuổi"
            value={age}
            onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
            error={!!errors.age}
            helperText={errors.age}
          />
          <TextField
            label="Lớp học"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            error={!!errors.grade}
            helperText={errors.grade}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* bộ lọc */}
      <div className="mt-[15px] flex gap-4 items-center bg-white p-4 rounded-2xl shadow-md mb-4">
        <TextField label="Tìm kiếm" variant="outlined" size="small" className="w-[480px]" />
        <FormControl size="small" className="w-40">
          <InputLabel>Grade</InputLabel>
          <Select label="Trạng thái">
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="completed">Hoàn thành</MenuItem>
            <MenuItem value="active">Chưa hoàn thành</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" className="w-40">
          <InputLabel>Sắp xếp</InputLabel>
          <Select label="Ưu tiên">
            <MenuItem value="all">Name A-Z</MenuItem>
            <MenuItem value="low">Thấp</MenuItem>
            <MenuItem value="medium">Trung bình</MenuItem>
            <MenuItem value="high">Cao</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined">Clear</Button>
      </div>
    </>
  );
};

export default FilterControls;
